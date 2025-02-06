import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

export function loadEnvFromFolder(folderPath) {
    const envPath = path.join(folderPath, '.env');
    
    try {
        if (fs.existsSync(envPath)) {
            console.log(`Loading .env from: ${envPath}`);
            const envConfig = dotenv.config({ path: envPath });
            if (envConfig.error) {
                console.warn(`Error loading .env from ${envPath}:`, envConfig.error);
            } else {
                console.log(`Successfully loaded .env from ${envPath}`);
            }
            return envConfig.parsed || {};
        } else {
            console.warn(`No .env file found at: ${envPath}`);
            return {};
        }
    } catch (error) {
        console.warn(`Error checking .env at ${envPath}:`, error);
        return {};
    }
}

export function getAgentEnv() {
    // Get the directory name of the calling file
    const callerPath = new Error().stack
        .split('\n')[2]
        .match(/\((.*):\d+:\d+\)/)[1];
    const callerDir = path.dirname(callerPath);
    
    return loadEnvFromFolder(callerDir);
} 