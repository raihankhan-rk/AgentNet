// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0)

pragma solidity ^0.8.20;

contract Web4Registry {

    struct Agent {
        string name;
        string description;
        string peerId;
        string[] capabilities;
        address walletId;
    }

    mapping(string => Agent[]) public lookUpByCapability;
    mapping(address => Agent) public lookUpByWallet;

    function addAgent(string[] memory _capabilities, address _wallet, string memory _name, string memory _desc, string memory _peerId) public {
        Agent memory _agent = Agent(_name, _desc, _peerId, _capabilities, _wallet);

        for(uint i = 0; i< _capabilities.length; i++){
            lookUpByCapability[_capabilities[i]].push(_agent);
        }

        lookUpByWallet[_wallet] = _agent;
    }

    function lookUpByCapabilityArray(string memory capability) public view returns (Agent[] memory){
        return lookUpByCapability[capability];
    }

}