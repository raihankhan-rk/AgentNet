import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getSchemaId, saveSchemaId } from '../../config/nillionConfig.js';
import schema from '../../schemas/userContextSchema.js';

export class NillionService {
    constructor() {
        this.initialized = false;
        this.schemaId = null;
        this.api = axios.create({
            baseURL: 'https://nildb-demo.nillion.network/api/v1',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ',
                'Content-Type': 'application/json'
            },
            validateStatus: function (status) {
                return status < 500;
            }
        });
        console.log('Nillion: Service instance created');
    }

    async initialize() {
        if (this.initialized) {
            console.log('Nillion: Service already initialized, skipping');
            return;
        }

        try {
            console.log('Nillion: Starting service initialization');

            this.schemaId = getSchemaId();
            if (this.schemaId) {
                console.log('Nillion: Found existing schema ID:', this.schemaId);
                try {
                    await this.api.post(`/data/read`, {
                        "schema": this.schemaId,
                        "filter": {}
                    });
                } catch (error) {
                    console.log('Nillion: Stored schema not found, creating new one');
                    this.schemaId = null;
                }
            }

            if (!this.schemaId) {
                console.log('Nillion: Creating new schema');
                const collectionName = 'User Context and Chat History';
                const response = await this.api.post('/schemas', {
                    name: collectionName,
                    schema: schema
                });

                this.schemaId = response.data.id;
                console.log('Nillion: Created new schema:', this.schemaId);
                saveSchemaId(this.schemaId);
            }

            this.initialized = true;
            console.log('Nillion: Service initialization complete');
        } catch (error) {
            console.error('Nillion: ❌ Failed to initialize service:', error.response?.data || error.message);
            throw error;
        }
    }

    async getUserContext(walletAddress) {
        try {
            console.log('Nillion: Getting user context for wallet:', walletAddress);

            // Query by wallet address using filter
            const response = await this.api.post(`/data/find`, {
                schema: this.schemaId,
                filter: { walletAddress }
            });

            console.log('Nillion: Retrieved raw user data:', JSON.stringify(response.data, null, 2));

            if (!response.data?.data || response.data.data.length === 0) {
                return null;
            }

            const user = response.data.data[0];

            // Get decrypted fields if they exist
            if (user.userProfile) {
                try {
                    const decryptedResponse = await this.api.post(`/data/decrypt`, {
                        schema: this.schemaId,
                        id: user._id,
                        fields: ['userProfile.name', 'userProfile.preferences']
                    });

                    if (decryptedResponse.data?.data) {
                        user.userProfile = {
                            name: {
                                $share: {
                                    $allot: String(decryptedResponse.data.data.userProfile?.name || 'Anonymous')
                                }
                            },
                            preferences: {
                                $share: {
                                    $allot: String(decryptedResponse.data.data.userProfile?.preferences || '{}')
                                }
                            }
                        };
                    }
                } catch (error) {
                    console.error('Nillion: Error decrypting fields:', error.response?.data || error.message);
                    user.userProfile = {
                        name: { $share: { $allot: 'Anonymous' } },
                        preferences: { $share: { $allot: '{}' } }
                    };
                }
            }

            return user;
        } catch (error) {
            console.error('Nillion: Failed to get user context:', error.response?.data || error.message);
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async createOrUpdateUserContext(walletAddress, profile) {
        try {
            console.log('Nillion: Creating/Updating user context for wallet:', walletAddress);
            console.log('Nillion: Profile data:', profile);

            const existingUser = await this.getUserContext(walletAddress);
            console.log('Nillion: Existing user found:', existingUser ? 'yes' : 'no');

            const data = {
                _id: existingUser?._id || uuidv4(),
                walletAddress: String(walletAddress),
                userProfile: {
                    name: {
                        $share: {
                            $allot: String(profile.name || 'Anonymous')
                        }
                    },
                    preferences: {
                        $share: {
                            $allot: typeof profile.preferences === 'object'
                                ? JSON.stringify(profile.preferences)
                                : String(profile.preferences || '{}')
                        }
                    }
                },
                chatHistory: existingUser?.chatHistory || []
            };

            console.log('Nillion: Writing user data:', JSON.stringify(data, null, 2));

            // Use upsert endpoint for both create and update
            await this.api.post(`/data/upsert`, {
                schema: this.schemaId,
                data: [data]  // API expects an array
            });

            console.log('Nillion: Successfully wrote user data');
            return data;
        } catch (error) {
            console.error('Nillion: Failed to create/update user context:', error.response?.data || error.message);
            throw error;
        }
    }

    async addChatMessage(walletAddress, message) {
        try {
            console.log('Nillion: Adding chat message for wallet:', walletAddress);
            console.log('Nillion: Message:', message);

            // Get or create user context
            let user = await this.getUserContext(walletAddress);
            if (!user) {
                // Create new user if doesn't exist
                user = await this.createOrUpdateUserContext(walletAddress, {
                    name: 'Anonymous',
                    preferences: {}
                });
            }

            const newMessage = {
                timestamp: String(message.timestamp || new Date().toISOString()),
                type: String(message.type),
                content: {
                    $share: {
                        $allot: String(message.message)
                    }
                }
            };

            const updatedUser = {
                ...user,
                chatHistory: [...(user.chatHistory || []), newMessage]
            };

            console.log('Nillion: Writing updated chat history');

            // Use upsert endpoint to update the user record
            await this.api.post(`/data/upsert`, {
                schema: this.schemaId,
                data: [updatedUser]  // API expects an array
            });

            console.log('Nillion: Successfully wrote chat message');
            return updatedUser;
        } catch (error) {
            console.error('Nillion: Failed to add chat message:', error.response?.data || error.message);
            throw error;
        }
    }

    async extractNameFromMessage(llm, input) {
        try {
            const nameExtractionPrompt = `You are having your first conversation with a user. 
            Their message was: "${input}"
            If they've introduced themselves with their name (like "I'm John" or "My name is John" or just "John here" or even just "John"), extract their name.
            If they haven't mentioned their name, ask for it naturally.

            Respond in this exact JSON format (no markdown, no code blocks):
            {
                "name": "the extracted name or null if no name found",
                "response": "your response to the user - ask for their name if none was given"
            }`;
            const nameExtractionResponse = await llm.invoke(nameExtractionPrompt);
            const nameExtractionContent = nameExtractionResponse.content;

            try {
                const cleanContent = nameExtractionContent
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .replace(/\n/g, ' ')
                    .trim();

                return JSON.parse(cleanContent);
            } catch (e) {
                console.warn('Failed to parse LLM response as JSON:', e);
                return {
                    name: null,
                    response: nameExtractionContent.replace(/```json\n?|```\n?/g, '').trim()
                };
            }
        } catch (error) {
            console.error('Failed to extract name:', error);
            throw error;
        }
    }
}
