import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

export function loadEnvFromFolder(folderPath) {
    const envPath = path.join(folderPath, '.env');
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
        console.warn(`Warning: No .env file found in ${folderPath}`);
        return {};
    }
    
    return result.parsed;
}

export function getAgentEnv() {
    // Get the directory name of the calling file
    const callerPath = new Error().stack
        .split('\n')[2]
        .match(/\((.*):\d+:\d+\)/)[1];
    const callerDir = path.dirname(callerPath);
    
    return loadEnvFromFolder(callerDir);
} 