[Skip to main content](https://docs.nillion.com/build/secret-vault-quickstart#__docusaurus_skipToContent_fallback)

On this page

[SecretVault](https://docs.nillion.com/build/secret-vault) lets you store sensitive data securely by encrypting and splitting it across multiple nodes. While regular fields remain readable, private information is protected through encryption - making it perfect for applications that need to balance data accessibility with privacy.

**In this 15-minute quickstart, you'll build a privacy-preserving data collection for a Web3 experience survey** using Node.js and SecretVault. The project will encrypt personal data ( `name` and `years_in_web3` fields) while keeping the `responses` array of survey ratings in plaintext.

SecretVault Quickstart

1.2×

19 min⚡️24 min19 min16 min13 min11 min9 min 40 sec7 min 44 sec

![poster image](https://cdn.loom.com/sessions/thumbnails/ee391ce583ab442db71942565b068e61-11833662fc659309-full.jpg)

Your user agent does not support the HTML5 Video element.

1.2×

19 min⚡️24 min19 min16 min13 min11 min9 min 40 sec7 min 44 sec

info

This guide uses JavaScript (Node.js) and the [nillion-sv-wrappers](https://github.com/NillionNetwork/nillion-sv-wrappers) package for simplicity, but SecretVault can be integrated with any language [using the nilDB APIs directly](https://docs.nillion.com/build/secret-vault#how-to-use-secretvault).

## Project Overview [​](https://docs.nillion.com/build/secret-vault-quickstart\#project-overview "Direct link to Project Overview")

This quickstart will guide you through:

1. Setting up a Node.js project from scratch and installing [nillion-sv-wrappers](https://github.com/NillionNetwork/nillion-sv-wrappers)
2. Configuring SecretVault org access
3. Creating a SecretVault Collection by uploading a schema
4. Writing and reading encrypted survey data to the collection

Your final project structure will be below. For a complete working version, check out the finished project in this [GitHub repo](https://github.com/oceans404/nillion-sv-example)

```codeBlockLines_e6Vv
sv-quickstart/
├── node_modules
├── package-lock.json
├── package.json          # Project dependencies
├── nillionOrgConfig.js   # Nillion org credentials and node URLs
├── postSchema.js         # Script for uploading a schema to create a collection
└── index.js              # Main script that reads and writes to SecretVault

```

### Prerequisites [​](https://docs.nillion.com/build/secret-vault-quickstart\#prerequisites "Direct link to Prerequisites")

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Build your project [​](https://docs.nillion.com/build/secret-vault-quickstart\#build-your-project "Direct link to Build your project")

### 1\. Set up Node.js Project [​](https://docs.nillion.com/build/secret-vault-quickstart\#1-set-up-nodejs-project "Direct link to 1. Set up Node.js Project")

#### Create and enter the project directory: [​](https://docs.nillion.com/build/secret-vault-quickstart\#create-and-enter-the-project-directory "Direct link to Create and enter the project directory:")

```codeBlockLines_e6Vv
mkdir sv-quickstart
cd sv-quickstart

```

#### Initialize npm project with type "module" and install dependencies: [​](https://docs.nillion.com/build/secret-vault-quickstart\#initialize-npm-project-with-type-module-and-install-dependencies "Direct link to Initialize npm project with type \"module\" and install dependencies:")

```codeBlockLines_e6Vv
npm init es6
npm i nillion-sv-wrappers

```

info

[nillion-sv-wrappers](https://github.com/NillionNetwork/nillion-sv-wrappers) is a JavaScript npm package with wrappers for simplifying usage of Nillion's Secret Vault and the nilQL encryption and decryption library.

### 2\. Set your SecretVault Organization Config [​](https://docs.nillion.com/build/secret-vault-quickstart\#2-set-your-secretvault-organization-config "Direct link to 2. Set your SecretVault Organization Config")

#### Create a Nillion organization configuration file [​](https://docs.nillion.com/build/secret-vault-quickstart\#create-a-nillion-organization-configuration-file "Direct link to Create a Nillion organization configuration file")

```codeBlockLines_e6Vv
touch nillionOrgConfig.js

```

#### Add the demo organization configuration: [​](https://docs.nillion.com/build/secret-vault-quickstart\#add-the-demo-organization-configuration "Direct link to Add the demo organization configuration:")

For quickstart purposes, we've pre-registered an org you can use. Here are the organization's credentials and cluster configuration including node urls and node did (decentralized identifiers) to paste into your `nillionOrgConfig.js` file:

**Copy this Demo Organization Config into nillionOrgConfig.js**

You can also look up cluster configuration values using the orgDid in the "Returning Org" section of the [SecretVault Registration Portal](https://sv-sda-registration.replit.app/).

nillionOrgConfig.js

```codeBlockLines_e6Vv
export const orgConfig = {
  // demo org credentials
  // in a production environment, make sure to put your org's credentials in environment variables
  orgCredentials: {
    secretKey:
      'a786abe58f933e190d01d05b467838abb1e391007a674d8a3aef106e15a0bf5a',
    orgDid: 'did:nil:testnet:nillion1vn49zpzgpagey80lp4xzzefaz09kufr5e6zq8c',
  },
  // demo node config
  nodes: [\
    {\
      url: 'https://nildb-zy8u.nillion.network',\
      did: 'did:nil:testnet:nillion1fnhettvcrsfu8zkd5zms4d820l0ct226c3zy8u',\
    },\
    {\
      url: 'https://nildb-rl5g.nillion.network',\
      did: 'did:nil:testnet:nillion14x47xx85de0rg9dqunsdxg8jh82nvkax3jrl5g',\
    },\
    {\
      url: 'https://nildb-lpjp.nillion.network',\
      did: 'did:nil:testnet:nillion167pglv9k7m4gj05rwj520a46tulkff332vlpjp',\
    },\
  ],
};

```

[View on GitHub](https://github.com/oceans404/nillion-sv-example/blob/main/nillionOrgConfig.js)

Now we have all the organization and cluster details needed to use SecretVault:

- Organization Credentials: private key and did
- Cluster configuration: Node API urls and Node DIDs for each node in the cluster

### 3\. Create Collection Schema [​](https://docs.nillion.com/build/secret-vault-quickstart\#3-create-collection-schema "Direct link to 3. Create Collection Schema")

#### Create a schema.json file: [​](https://docs.nillion.com/build/secret-vault-quickstart\#create-a-schemajson-file "Direct link to Create a schema.json file:")

```codeBlockLines_e6Vv
touch schema.json

```

Add the "Web3 Experience Survey" schema within schema.json. The schema definition specifies the data structure of any record uploaded to the collection:

- Every survey response requires a unique `_id`
- `name` is an encrypted field that stores data shares
- `years_in_web3` is also encrypted and follows the same structure
- `responses` array holds unencrypted survey ratings, with each rating being 1-5

**Copy this Web3 Experience Survey schema into schema.json:**

schema.json

```codeBlockLines_e6Vv
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Web3 Experience Survey",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "_id": {
        "type": "string",
        "format": "uuid",
        "coerce": true
      },
      "name": {
        "type": "object",
        "properties": {
          "$share": {
            "type": "string"
          }
        },
        "required": ["$share"]
      },
      "years_in_web3": {
        "type": "object",
        "properties": {
          "$share": {
            "type": "string"
          }
        },
        "required": ["$share"]
      },
      "responses": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "rating": {
              "type": "integer",
              "minimum": 1,
              "maximum": 5
            },
            "question_number": {
              "type": "integer",
              "minimum": 1
            }
          },
          "required": ["rating", "question_number"]
        },
        "minItems": 1
      }
    },
    "required": ["_id", "name", "years_in_web3", "responses"]
  }
}

```

[View on GitHub](https://github.com/oceans404/nillion-sv-example/blob/main/schema.json)

#### Create the upload schema script: [​](https://docs.nillion.com/build/secret-vault-quickstart\#create-the-upload-schema-script "Direct link to Create the upload schema script:")

```codeBlockLines_e6Vv
touch postSchema.js

```

**Copy this script that creates your collection schema into postSchema.js:**

postSchema.js

```codeBlockLines_e6Vv
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './nillionOrgConfig.js';
import schema from './schema.json' assert { type: 'json' };

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();

    // Create a new collection schema for all nodes in the org
    const collectionName = 'Web3 Experience Survey';
    const newSchema = await org.createSchema(schema, collectionName);
    console.log('✅ New Collection Schema created for all nodes:', newSchema);
    console.log('👀 Schema ID:', newSchema[0].result.data);
  } catch (error) {
    console.error('❌ Failed to use SecretVaultWrapper:', error.message);
    process.exit(1);
  }
}

main();

```

[View on GitHub](https://github.com/oceans404/nillion-sv-example/blob/main/postSchema.js)

#### Run the upload schema script to create a schema collection: [​](https://docs.nillion.com/build/secret-vault-quickstart\#run-the-upload-schema-script-to-create-a-schema-collection "Direct link to Run the upload schema script to create a schema collection:")

```codeBlockLines_e6Vv
node postSchema.js

```

Save the Schema ID from the output - you'll need it for writing and reading data to your collection in the next step.

### 4\. Interact with SecretVault Data [​](https://docs.nillion.com/build/secret-vault-quickstart\#4-interact-with-secretvault-data "Direct link to 4. Interact with SecretVault Data")

#### 1\. Create a main script file [​](https://docs.nillion.com/build/secret-vault-quickstart\#1-create-a-main-script-file "Direct link to 1. Create a main script file")

```codeBlockLines_e6Vv
touch index.js

```

Now your file structure should look like this:

```codeBlockLines_e6Vv
sv-quickstart/
├── node_modules
├── package-lock.json
├── package.json
├── nillionOrgConfig.js
├── postSchema.js
└── index.js

```

#### 2\. Import dependencies in index.js [​](https://docs.nillion.com/build/secret-vault-quickstart\#2-import-dependencies-in-indexjs "Direct link to 2. Import dependencies in index.js")

```codeBlockLines_e6Vv
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './nillionOrgConfig.js';

```

#### 3\. Add your Collection's Schema ID [​](https://docs.nillion.com/build/secret-vault-quickstart\#3-add-your-collections-schema-id "Direct link to 3. Add your Collection's Schema ID")

```codeBlockLines_e6Vv
const SCHEMA_ID = 'YOUR_SCHEMA_ID';

```

#### 4\. Create a payload of 1 or more Web3 Experience Survey data records to store [​](https://docs.nillion.com/build/secret-vault-quickstart\#4-create-a-payload-of-1-or-more-web3-experience-survey-data-records-to-store "Direct link to 4. Create a payload of 1 or more Web3 Experience Survey data records to store")

Mark the name and years\_in\_web3 fields with `$allot` to signal to nilQL that these are fields that need to be encrypted to shares before being stored in SecretVault. The nillion-sv-wrappers package will transform data marked $allot into encrypted $share properties before upload to SecretVault.

```codeBlockLines_e6Vv
const data = [\
  {\
    name: { $allot: 'Vitalik Buterin' }, // name will be encrypted to a $share\
    years_in_web3: { $allot: 8 }, // years_in_web3 will be encrypted to a $share\
    responses: [\
      { rating: 5, question_number: 1 },\
      { rating: 3, question_number: 2 },\
    ], // responses will be stored in plaintext\
  },\
];

```

#### 5\. Write the main function [​](https://docs.nillion.com/build/secret-vault-quickstart\#5-write-the-main-function "Direct link to 5. Write the main function")

- Initialize wrapper with nodes and credentials
- Write data to nodes, encrypting the years\_in\_web3 with nilQL ahead of time
- Read data from all nodes and recombine shares to decrypt the years\_in\_web3 field

index.js

```codeBlockLines_e6Vv
async function main() {
  try {
    // Create a secret vault wrapper and initialize the SecretVault collection to use
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      SCHEMA_ID
    );
    await collection.init();

    // Write collection data to nodes encrypting the specified fields ahead of time
    const dataWritten = await collection.writeToNodes(data);
    console.log(
      '👀 Data written to nodes:',
      JSON.stringify(dataWritten, null, 2)
    );

    // Get the ids of the SecretVault records created
    const newIds = [\
      ...new Set(dataWritten.map((item) => item.result.data.created).flat()),\
    ];
    console.log('uploaded record ids:', newIds);

    // Read all collection data from the nodes, decrypting the specified fields
    const decryptedCollectionData = await collection.readFromNodes({});

    // Log first 5 records
    console.log(
      'Most recent records',
      decryptedCollectionData.slice(0, data.length)
    );
  } catch (error) {
    console.error('❌ SecretVaultWrapper error:', error.message);
    process.exit(1);
  }
}

main();

```

[View on GitHub](https://github.com/oceans404/nillion-sv-example/blob/main/index.js#L30-L67)

#### 5\. Run the script [​](https://docs.nillion.com/build/secret-vault-quickstart\#5-run-the-script "Direct link to 5. Run the script")

```codeBlockLines_e6Vv
node index.js

```

Full index.js file

index.js

```codeBlockLines_e6Vv
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './nillionOrgConfig.js';

// Use postSchema.js to create a new collection schema
// Update SCHEMA_ID to the schema id of your new collection
const SCHEMA_ID = '🎯UPDATE_ME_WITH_YOUR_SCHEMA_ID';

// Web3 Experience Survey Data to add to the collection
// $allot signals that the name years_in_web3 field will be encrypted
// Each node will have a different encrypted $share of encrypted field
const data = [\
  {\
    name: { $allot: 'Vitalik Buterin' }, // will be encrypted to a $share\
    years_in_web3: { $allot: 8 }, // will be encrypted to a $share\
    responses: [\
      { rating: 5, question_number: 1 },\
      { rating: 3, question_number: 2 },\
    ],\
  },\
  {\
    name: { $allot: 'Satoshi Nakamoto' }, // will be encrypted to a $share\
    years_in_web3: { $allot: 14 }, // will be encrypted to a $share\
    responses: [\
      { rating: 2, question_number: 1 },\
      { rating: 5, question_number: 2 },\
    ],\
  },\
];

async function main() {
  try {
    // Create a secret vault wrapper and initialize the SecretVault collection to use
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      SCHEMA_ID
    );
    await collection.init();

    // Write collection data to nodes encrypting the specified fields ahead of time
    const dataWritten = await collection.writeToNodes(data);
    console.log(
      '👀 Data written to nodes:',
      JSON.stringify(dataWritten, null, 2)
    );

    // Get the ids of the SecretVault records created
    const newIds = [\
      ...new Set(dataWritten.map((item) => item.result.data.created).flat()),\
    ];
    console.log('uploaded record ids:', newIds);

    // Read all collection data from the nodes, decrypting the specified fields
    const decryptedCollectionData = await collection.readFromNodes({});

    // Log first 5 records
    console.log(
      'Most recent records',
      decryptedCollectionData.slice(0, data.length)
    );
  } catch (error) {
    console.error('❌ SecretVaultWrapper error:', error.message);
    process.exit(1);
  }
}

main();

```

[View on GitHub](https://github.com/oceans404/nillion-sv-example/blob/main/index.js)

#### Results [​](https://docs.nillion.com/build/secret-vault-quickstart\#results "Direct link to Results")

You should see output showing:

- Record IDs for the encrypted data written to SecretVault
- Decrypted data after reading across nodes

## Next Steps [​](https://docs.nillion.com/build/secret-vault-quickstart\#next-steps "Direct link to Next Steps")

Great work! Now that you've successfully written and read encrypted data from SecretVault, explore:

- [Registering your own organization](https://docs.nillion.com/build/secretVault-secretDataAnalytics/access)
- [Creating custom collection schemas](https://docs.nillion.com/build/secretVault-secretDataAnalytics/create-schema)
- [Storing new records](https://docs.nillion.com/build/secretVault-secretDataAnalytics/upload)
- [Retrieving filtered records](https://docs.nillion.com/build/secretVault-secretDataAnalytics/retrieve)

- [Project Overview](https://docs.nillion.com/build/secret-vault-quickstart#project-overview)
  - [Prerequisites](https://docs.nillion.com/build/secret-vault-quickstart#prerequisites)
- [Build your project](https://docs.nillion.com/build/secret-vault-quickstart#build-your-project)
  - [1\. Set up Node.js Project](https://docs.nillion.com/build/secret-vault-quickstart#1-set-up-nodejs-project)
  - [2\. Set your SecretVault Organization Config](https://docs.nillion.com/build/secret-vault-quickstart#2-set-your-secretvault-organization-config)
  - [3\. Create Collection Schema](https://docs.nillion.com/build/secret-vault-quickstart#3-create-collection-schema)
  - [4\. Interact with SecretVault Data](https://docs.nillion.com/build/secret-vault-quickstart#4-interact-with-secretvault-data)
- [Next Steps](https://docs.nillion.com/build/secret-vault-quickstart#next-steps)

Feedback