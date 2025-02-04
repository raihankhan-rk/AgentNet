import { ethers } from 'ethers';

export async function sendEth(recipientAddress:string, amountInEth:string) {
    try {
      console.log('Sending ETH...');
      // @ts-ignore
      if (typeof window.ethereum !== 'undefined') {
          //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const signer = provider.getSigner();
        
        const tx = {
            to: recipientAddress,
            value: ethers.utils.parseEther(amountInEth.toString())
        };

        const transaction = await signer.sendTransaction(tx);
        console.log('Transaction hash:', transaction.hash);

        const receipt = await transaction.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        
        return receipt;
      }
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}