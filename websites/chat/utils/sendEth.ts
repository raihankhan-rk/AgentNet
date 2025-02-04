import { ethers } from 'ethers';

export async function sendEth(recipientAddress:string, amountInEth:string) {
    try {
      console.log('Sending ETH...');
      // @ts-ignore
      if (typeof window.ethereum !== 'undefined') {
        // Connect to provider (e.g. MetaMask)
          //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get signer from connected wallet
        const signer = provider.getSigner();
        
        // Create transaction object
        const tx = {
            to: recipientAddress,
            value: ethers.utils.parseEther(amountInEth.toString())
        };

        // Send transaction
        const transaction = await signer.sendTransaction(tx);
        console.log('Transaction hash:', transaction.hash);

        // Wait for confirmation
        const receipt = await transaction.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        
        return receipt;
      }
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}