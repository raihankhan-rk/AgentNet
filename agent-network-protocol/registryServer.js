import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

const agentsRegistry = {};

app.post('/register', (req, res) => {
  const { peerId, name, description, capabilities  } = req.body;
  if (!peerId) return res.status(400).send('Missing peerId');
  agentsRegistry[peerId] = { name, description, capabilities };
  console.log('Registered agent:', { peerId, name, capabilities });
  console.log('Current registry:', agentsRegistry);
  res.status(200).send({ message: 'Registered successfully' });
});

app.get('/lookup', (req, res) => {
  const capability = req.query.capability;
  console.log('Looking up capability:', capability);
  console.log('Current registry:', agentsRegistry);
  
  const result = Object.entries(agentsRegistry)
    .filter(([peerId, agent]) => agent.capabilities.includes(capability))
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
