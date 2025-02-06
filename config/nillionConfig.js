import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_ID_FILE = path.join(__dirname, 'schemaId.json');

export const nillionConfig = {
  orgCredentials: {
    secretKey: '09d852d3f882ce68c6a47ddd4b1cbf81a0e0754d16682f1fe3f7ef63efde2dc5',
    orgDid: 'did:nil:testnet:nillion10vpyu7ksvcfhwe3vh2sl82rz497cxv8wn73ead',
  },
  nodes: [
    {
      url: 'https://nildb-zy8u.nillion.network',
      did: 'did:nil:testnet:nillion1fnhettvcrsfu8zkd5zms4d820l0ct226c3zy8u',
    },
    {
      url: 'https://nildb-rl5g.nillion.network',
      did: 'did:nil:testnet:nillion14x47xx85de0rg9dqunsdxg8jh82nvkax3jrl5g',
    },
    {
      url: 'https://nildb-lpjp.nillion.network',
      did: 'did:nil:testnet:nillion167pglv9k7m4gj05rwj520a46tulkff332vlpjp',
    },
  ],
};

export function saveSchemaId(schemaId) {
    try {
        fs.writeFileSync(SCHEMA_ID_FILE, JSON.stringify({ schemaId }));
        console.log('Nillion: Saved schema ID to file:', schemaId);
    } catch (error) {
        console.error('Nillion: Failed to save schema ID:', error);
    }
}

export function getSchemaId() {
    try {
        if (fs.existsSync(SCHEMA_ID_FILE)) {
            const data = JSON.parse(fs.readFileSync(SCHEMA_ID_FILE, 'utf8'));
            console.log('Nillion: Retrieved schema ID from file:', data.schemaId);
            return data.schemaId;
        }
    } catch (error) {
        console.error('Nillion: Error reading schema ID:', error);
    }
    return null;
}

