import { contractAdds } from "./utils/contractAdd";
import abi from "./utils/abi"

async function contractSetup(){
    const add = contractAdds.registry;
    const provider = new ethers.getDefaultProvider(process.env.INFURA_RPC);
    try{
    const contract = new ethers.Contract( add , abi , provider );
    return contract;
}
    catch(err){
        console.log("Error",err)
    }    
    
}

async function contractWriteSetup(){
    try{
        const add = contractAdds.registry;
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
        const provider = new ethers.getDefaultProvider(process.env.INFURA_RPC);
        const contract = new ethers.Contract( add , abi , wallet.connect(provider) );
        return contract;

    }
    catch(err){
        console.log("Error",err)
    }
}

//capabilites is an array of strings

export async function registerAgent(peerId, name, description, capabilities, walletAddress){
    const contract = await contractWriteSetup();

    const res = await contract.addAgent(capabilities, walletAddress, name, description, peerId);

    await res.wait().then(()=>{
        console.log("Agent Registered")
    })

}

export async function getAgentByCapability(capability){
    const contract = await contractSetup();

    const res = await contract.lookUpByCapabilityArray(capability);

    return res;
}

export async function getAgentByWallet(wallet){
    const contract = await contractSetup();

    const res = await contract.lookUpByWallet(wallet);

    return res;
}