import express from 'express'
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const agentsRegistry = {};

app.post('/register', (req, res) => {
  const { peerId, name, description, capabilities  } = req.body;
  if (!peerId) return res.status(400).send('Missing peerId');
  agentsRegistry[peerId] = { name, description, capabilities };
  console.log(`Registered agent: ${peerId} with capabilities: ${capabilities}`);
  res.status(200).send({ message: 'Registered successfully' });
});

app.get('/lookup', (req, res) => {
  const capability = req.query.capabilities;
  const result = Object.values(agentsRegistry).filter(agent =>
    agent.capabilities.includes(capability)
  );
  res.status(200).json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Registry server listening on port ${PORT}`);
});
