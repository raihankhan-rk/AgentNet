# <img src="star.png" alt="AgentNet Logo" width="24"/> AgentNet - The Decentralized Protocol For AI Agents 

A decentralized open protocol powered by libp2p, designed for seamless, decentralized agentic communication at scale. 🚀

## 🌟 Overview

AgentNet is a next-generation decentralized protocol for agentic communication, redefining how AI agents interact, collaborate, and transact autonomously. Built on libp2p and powered by blockchain technology, AgentNet enables seamless, trustless communication between AI agents, creating a self-organizing network of intelligent entities.

To demonstrate its potential, we’ve introduced three simulated agents as a proof-of-concept:

- 🛫 **Flighty Agent**: Handles flight searches and bookings
- 🏨 **Airbnb Agent**: Manages accommodation searches and bookings
- 👤 **User Agent**: Orchestrates communication between users and specialized agents

## 🏗️ Project Structure

```
AgentNet/
├── agent-network-protocol/    # Core P2P communication protocol
├── agents/                    # AI agent implementations
│   ├── airbnb/               # Airbnb booking agent
│   ├── flighty/              # Flight booking agent
│   └── user-agent/           # User interaction agent
├── websites/                  # Frontend applications
│   ├── airbnb/               # Accommodation booking interface
│   ├── chat/                 # Main chat interface
│   └── flighty/              # Flight booking interface
```

## 🚀 Key Features

- Decentralized P2P agent communication using libp2p
- Blockchain-based transaction verification
- Interactive chat interface for natural language booking
- Multi-agent coordination for complex requests

## 💻 Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Agent Framework**: CDP Agent Kit, OpenAI GPT-4o
- **Core Network Protocol**: libp2p
- **Blockchain Integration**: Base
- **Package Management**: npm

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/raihankhan-rk/AgentNet.git
cd AgentNet
```

### 2. Install dependencies:

Before starting the development servers, install the necessary dependencies in each directory:

```bash
# Install dependencies for the protocol
cd agent-network-protocol
npm install

# Install dependencies for the agents
cd agents
npm install

# Install dependencies for each individual agent
cd agents/airbnb
npm install

cd ../flighty
npm install

cd ../user-agent
npm install
```

### 3. Set up environment variables:
Create `.env` files in the following directories:
- `/agents/flighty/.env`
- `/agents/airbnb/.env`
- `/agents/user-agent/.env`

Required environment variables:
```env
CDP_WALLET_DATA=your_wallet_data
NETWORK_ID=base-sepolia
CDP_API_KEY_NAME=your_api_key_name
CDP_API_KEY_PRIVATE_KEY=your_private_key
OPENAI_API_KEY=your_openai_key
```

### 4. Start the development servers:

Run the following commands to start the required services:

```bash
# Navigate to the protocol directory and start the registry server
cd agent-network-protocol
node registryServer.js

# Open a new terminal, navigate to the agents directory, and start the agents
cd agents
npm start
```

## 🌐 Agent Network Protocol

The platform uses a custom P2P protocol for agent communication, implemented in the `agent-network-protocol` package. Key features include:

- Decentralized agent discovery
- Secure message encryption
- Pub/sub messaging system
- DHT-based peer routing

## 🔐 Security

- All agent communications are encrypted using noise protocol
- Blockchain-based transaction verification
- Secure wallet integration through CDP
- Environment variables protection (see `.gitignore` files)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [CDP Agent Kit](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
- Blockchain integration via [Base](https://www.base.org/)
- P2P networking with [libp2p](https://libp2p.io/)

---

Made with ❤️ by Team Zephyrus
