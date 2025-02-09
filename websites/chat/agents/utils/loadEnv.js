import dotenv from "dotenv";
import path from "path";

export function loadEnvFromFolder() {
    // Load from root .env file
    const rootEnvPath = path.join(process.cwd(), '.env');
    
    try {
        const result = dotenv.config({ path: rootEnvPath });
        
        if (result.error) {
            console.error('Error loading .env:', result.error);
            return {};
        }
        
        return process.env;
    } catch (error) {
        console.error('Exception loading .env:', error);
        return {};
    }
}

// This function is now deprecated but kept for backwards compatibility
export function getAgentEnv() {
    return loadEnvFromFolder();
}