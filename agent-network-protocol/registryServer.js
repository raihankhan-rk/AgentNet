import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

const agentsRegistry = {};

app.post('/register', (req, res) => {
  const { peerId, name, description, capabilities, walletAddress } = req.body;
  if (!peerId) return res.status(400).send('Missing peerId');
  agentsRegistry[peerId] = { name, description, capabilities, walletAddress };
  console.log('Registered agent:', { peerId, name, capabilities, walletAddress });
  console.log('Current registry:', agentsRegistry);
  res.status(200).send({ message: 'Registered successfully' });
});

app.get('/lookup', (req, res) => {
  const { capability, walletAddress } = req.query;
  console.log('Looking up with params:', { capability, walletAddress });
  console.log('Current registry:', agentsRegistry);

  const result = Object.entries(agentsRegistry)
    .filter(([peerId, agent]) => {
      if (capability && walletAddress) {
        return agent.capabilities.includes(capability) && agent.walletAddress === walletAddress;
      } else if (capability) {
        return agent.capabilities.includes(capability);
      } else if (walletAddress) {
        return agent.walletAddress === walletAddress;
      }
      return false;
    })
    .map(([peerId, agent]) => ({
      ...agent,
      peerId
    }));

  console.log('Lookup result:', result);
  res.status(200).json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Registry server listening on port ${PORT}`);
});
