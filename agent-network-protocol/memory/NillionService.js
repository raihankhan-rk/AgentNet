import axios from "axios";
import { v4 as uuidv4 } from "uuid";



export class NillionService {
    constructor() {
        this.initialized = true;
        this.schemaId = "bbbcd18c-e102-4b24-86f0-7738219ea6dd";
        this.api = axios.create({
            baseURL: "https://nildb-demo.nillion.network/api/v1",
            headers: {
                Authorization:
                    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ",
                "Content-Type": "application/json",
            },
            validateStatus: function (status) {
                return status < 500;
            },
        });
        console.log("Nillion: Service instance created");
    }

    async getUserContext(walletAddress) {
        try {
            console.log("Nillion: Getting user context for wallet:", walletAddress);

            const response = await this.api.post("/data/read", {
                schema: this.schemaId,
                filter: { walletId: walletAddress },
            });


            console.log(response.data.data);

            if (!response.data.data || response.data.data.length === 0) {
                return null;
            }

            const user = response.data.data[0];

            return user;
        } catch (error) {
            console.error(
                "Nillion: Failed to get user context:",
                error.response?.data || error.message
            );
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async createOrUpdateUserContext(walletAddress, profile) {
        try {
            console.log(
                "Nillion: Creating/Updating user context for wallet:",
                walletAddress
            );
            console.log("Nillion: Profile data:", profile);

            const existingUser = await this.getUserContext(walletAddress);
            console.log("Nillion: Existing user found:", existingUser ? "yes" : "no");

            if(!existingUser) {
                await this.api.post("/data/create", {
                    schema: this.schemaId,
                    data: [{ walletId: walletAddress, name: profile.name, chatHistory: [], _id: uuidv4() }],
                });
            }

            const data = await this.api.post("/data/update", {
                schema: this.schemaId,
                filter: { walletId: walletAddress },
                update: {
                    $set: {
                        name: profile.name,
                    },
                },
            });

            console.log("Nillion: Successfully wrote user data");
            return data;
        } catch (error) {
            console.error(
                "Nillion: Failed to create/update user context:",
                error.response?.data || error.message
            );
            throw error;
        }
    }

    async addChatMessage(walletAddress, message) {
        try {
            console.log("Nillion: Adding chat message for wallet:", walletAddress);
            console.log("Nillion: Message:", message);

            let user = await this.getUserContext(walletAddress);
            if (!user) {
                user = await this.createOrUpdateUserContext(walletAddress, {
                    name: "Anonymous",
                });
            }

            const newMessage = {
                _id: uuidv4(),
                timestamp: String(message.timestamp || new Date().toISOString()),
                sender: message.sender,
                message: message.message,
            };

            const updatedUser = {
                ...user,
                chatHistory: [...(user.chatHistory || []), newMessage],
            };

            console.log("Nillion: Writing updated chat history");

            await this.api.post("/data/update", {
                schema: this.schemaId,
                filter: { walletId: walletAddress },
                update: {
                    $set: {
                        chatHistory: updatedUser.chatHistory,
                    },
                },
            });

            console.log("Nillion: Successfully wrote chat message");
            return updatedUser;
        } catch (error) {
            console.error(
                "Nillion: Failed to add chat message:",
                error.response?.data || error.message
            );
            throw error;
        }
    }

    // async extractNameFromMessage(llm, input) {
    //     try {
    //         const nameExtractionPrompt = `You are having your first conversation with a user. 
    //         Their message was: "${input}"
    //         If they've introduced themselves with their name (like "I'm John" or "My name is John" or just "John here" or even just "John"), extract their name.
    //         If they haven't mentioned their name, ask for it naturally.

    //         Respond in this exact JSON format (no markdown, no code blocks):
    //         {
    //             "name": "the extracted name or null if no name found",
    //             "response": "your response to the user - ask for their name if none was given"
    //         }`;
    //         const nameExtractionResponse = await llm.invoke(nameExtractionPrompt);
    //         const nameExtractionContent = nameExtractionResponse.content;

    //         try {
    //             const cleanContent = nameExtractionContent
    //                 .replace(/json\n?/g, "")
    //                 .replace(/\n?/g, "")
    //                 .replace(/\n/g, " ")
    //                 .trim();

    //             return JSON.parse(cleanContent);
    //         } catch (e) {
    //             console.warn("Failed to parse LLM response as JSON:", e);
    //             return {
    //                 name: null,
    //                 response: nameExtractionContent
    //                     .replace(/json\n?|\n?/g, "")
    //                     .trim(),
    //             };
    //         }
    //     } catch (error) {
    //         console.error("Failed to extract name:", error);
    //         throw error;
    //     }
    // }
}