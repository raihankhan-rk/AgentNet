import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function startRegistryServer() {
    console.log('Starting registry server...');
    try {
        const registryProcess = exec('node ../agent-network-protocol/registryServer.js');
        
        // Log registry server output
        registryProcess.stdout?.on('data', (data) => {
            console.log(`Registry Server: ${data}`);
        });
        
        registryProcess.stderr?.on('data', (data) => {
            console.error(`Registry Server Error: ${data}`);
        });

        // Wait for server to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Registry server started');
        return registryProcess;
    } catch (error) {
        console.error('Failed to start registry server:', error);
        throw error;
    }
}

async function startMainProcess() {
    console.log('Starting main process...');
    try {
        const mainProcess = exec('node main.js');
        
        mainProcess.stdout?.on('data', (data) => {
            console.log(`Main Process: ${data}`);
        });
        
        mainProcess.stderr?.on('data', (data) => {
            console.error(`Main Process Error: ${data}`);
        });

        return mainProcess;
    } catch (error) {
        console.error('Failed to start main process:', error);
        throw error;
    }
}

async function main() {
    try {
        const registryProcess = await startRegistryServer();
        const mainProcess = await startMainProcess();

        // Handle cleanup on exit
        process.on('SIGINT', async () => {
            console.log('Shutting down...');
            registryProcess.kill();
            mainProcess.kill();
            process.exit(0);
        });

    } catch (error) {
        console.error('Startup failed:', error);
        process.exit(1);
    }
}

main(); 