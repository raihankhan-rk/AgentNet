export default [
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "_capabilities",
				"type": "string[]"
			},
			{
				"internalType": "address",
				"name": "_wallet",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_desc",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_peerId",
				"type": "string"
			}
		],
		"name": "addAgent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "lookUpByCapability",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "peerId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "walletId",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "capability",
				"type": "string"
			}
		],
		"name": "lookUpByCapabilityArray",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "peerId",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "capabilities",
						"type": "string[]"
					},
					{
						"internalType": "address",
						"name": "walletId",
						"type": "address"
					}
				],
				"internalType": "struct Web4Registry.Agent[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lookUpByWallet",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "peerId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "walletId",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]