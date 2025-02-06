import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export function loadEnvFromFolder(folderPath) {
    console.log('Loading .env file from:', folderPath);
    const envPath = path.join(folderPath, '.env');
    console.log('Env path:', envPath);
    
    // Add this check to verify file existence
    if (!fs.existsSync(envPath)) {
        console.warn(`Warning: .env file does not exist at ${envPath}`);
        return {};
    }
    
    try {
        const result = dotenv.config({ path: envPath });
        
        if (result.error) {
            console.error('Error loading .env:', result.error);
            return {};
        }
        
        return result.parsed;
    } catch (error) {
        console.error('Exception loading .env:', error);
        return {};
    }
}

export function getAgentEnv() {
    try {
        const callerPath = new Error().stack
            .split('\n')[2]
            ?.match(/\((.*):\d+:\d+\)/)?.[1];
            
        if (!callerPath) {
            console.warn('Could not determine caller path');
            return {};
        }
        
        const callerDir = path.dirname(callerPath);
        return loadEnvFromFolder(callerDir);
    } catch (error) {
        console.error('Error in getAgentEnv:', error);
        return {};
    }
}