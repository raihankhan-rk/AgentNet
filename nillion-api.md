[Skip to main content](https://docs.nillion.com/api/nildb/get-health-status#__docusaurus_skipToContent_fallback)

# Check service health status

```
GET https://nildb-demo.nillion.network/health
```

Returns 200 OK if the service is healthy

## Responses [​](https://docs.nillion.com/api/nildb/get-health-status\#responses "Direct link to Responses")

- 200

Service is healthy

- text/plain

- Schema
- Example (auto)

**Schema**

**string** string

**Example:** `OK`

```codeBlockLines_e6Vv
"OK"

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Get, "https://nildb-demo.nillion.network/health");
request.Headers.Add("Accept", "text/plain");
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/get-node-details#__docusaurus_skipToContent_fallback)

# Retrieve node details

```
GET https://nildb-demo.nillion.network/about
```

Returns information about the node including its DID, public key and build details

## Responses [​](https://docs.nillion.com/api/nildb/get-node-details\#responses "Direct link to Responses")

- 200

Successful response with node details

- application/json

- Schema
- Example (auto)

**Schema**

**started** date-timerequired

Timestamp when the node was started

**Example:** `2024-12-16T09:38:04.095Z`

**build** objectrequired

**time** date-timerequired

Build timestamp

**Example:** `2024-12-24T23:59:59Z`

**commit** stringrequired

Git commit hash or identifier

**Example:** `c0401ee26ece3f7155fd788848baf122cdd702ed`

**version** stringrequired

Node's api version

**Example:** `0.2.2`

**did** stringrequired

Decentralized Identifier (DID) of the node

**Example:** `did:nil:testnet:nillion1eunreuzltxglx9fx493l2r8ef6rdlrau4dsdnc`

**publicKey** stringrequired

Public key of the node

**Example:** `02d1f198df9a64ffa27c293861bace8c80bd6b1e150e008267f7f94eae9e6c380c`

**url** urirequired

URL where the node can be reached

**Example:** `http://localhost:8080`

```codeBlockLines_e6Vv
{
  "started": "2024-12-16T09:38:04.095Z",
  "build": {
    "time": "2024-12-24T23:59:59Z",
    "commit": "c0401ee26ece3f7155fd788848baf122cdd702ed",
    "version": "0.2.2"
  },
  "did": "did:nil:testnet:nillion1eunreuzltxglx9fx493l2r8ef6rdlrau4dsdnc",
  "publicKey": "02d1f198df9a64ffa27c293861bace8c80bd6b1e150e008267f7f94eae9e6c380c",
  "url": "http://localhost:8080"
}

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Get, "https://nildb-demo.nillion.network/about");
request.Headers.Add("Accept", "application/json");
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/retrieve-an-organizations-account-details#__docusaurus_skipToContent_fallback)

# Retrieve an organization's account details

```
GET https://nildb-demo.nillion.network/api/v1/accounts
```

Retrieve an organization's account details

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

## Responses [​](https://docs.nillion.com/api/nildb/retrieve-an-organizations-account-details\#responses "Direct link to Responses")

- 200
- 400
- 401

The organization's account details

- application/json

- Schema
- Example (auto)

**Schema**

**\_id** stringrequired

The accounts decentralised identifier (DID)

**Example:** `did:nil:testnet:nillion1eunreuzltxglx9fx493l2r8ef6rdlrau4dsdnc`

**\_type** stringrequired

**Possible values:** \[ `admin`, `organization`\]

**\_created** date-timerequired

**\_updated** date-timerequired

**publicKey** stringrequired

**name** stringrequired

**schemas** uuid\[\]required

A list of schema ids that belong to this account

**queries** uuid\[\]required

A list of query ids that belong to this account

```codeBlockLines_e6Vv
{
  "_id": "did:nil:testnet:nillion1eunreuzltxglx9fx493l2r8ef6rdlrau4dsdnc",
  "_type": "admin",
  "_created": "2024-07-29T15:51:28.071Z",
  "_updated": "2024-07-29T15:51:28.071Z",
  "publicKey": "string",
  "name": "string",
  "schemas": [\
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"\
  ],
  "queries": [\
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"\
  ]
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Get, "https://nildb-demo.nillion.network/api/v1/accounts");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/list-the-organizations-schemas#__docusaurus_skipToContent_fallback)

# List the organization's schemas

```
GET https://nildb-demo.nillion.network/api/v1/schemas
```

List the organization's schemas

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

## Responses [​](https://docs.nillion.com/api/nildb/list-the-organizations-schemas\#responses "Direct link to Responses")

- 200
- 400
- 401

The organization's schemas

- application/json

- Schema
- Example (auto)

**Schema**

**data** object\[\]required

```codeBlockLines_e6Vv
{
  "data": [\
    {\
      "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",\
      "_created": "2024-07-29T15:51:28.071Z",\
      "_updated": "2024-07-29T15:51:28.071Z",\
      "name": "string",\
      "owner": "did:nil:testnet:nillion1eunreuzltxglx9fx493l2r8ef6rdlrau4dsdnc",\
      "keys": [\
        "string"\
      ],\
      "schema": {}\
    }\
  ]
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Get, "https://nildb-demo.nillion.network/api/v1/schemas");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/add-a-new-schema#__docusaurus_skipToContent_fallback)

# Add a new schema

```
POST https://nildb-demo.nillion.network/api/v1/schemas
```

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

Add a new schema

## Request [​](https://docs.nillion.com/api/nildb/add-a-new-schema\#request "Direct link to Request")

- application/json

### Body **required**

**\_id** uuidrequired

A universally unique identifier for the item.

**name** stringrequired

**Possible values:** `non-empty`

**keys** string\[\]required

**schema** objectrequired

**property name\*** any

## Responses [​](https://docs.nillion.com/api/nildb/add-a-new-schema\#responses "Direct link to Responses")

- 200
- 400
- 401

Schema created successfully

- application/json

- Schema
- Example (auto)

**Schema**

**data** uuidrequired

A universally unique identifier for the item.

```codeBlockLines_e6Vv
{
  "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, "https://nildb-demo.nillion.network/api/v1/schemas");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var content = new StringContent("{\n  \"_id\": \"3fa85f64-5717-4562-b3fc-2c963f66afa6\",\n  \"name\": \"string\",\n  \"keys\": [\n    \"string\"\n  ],\n  \"schema\": {}\n}", null, "application/json");
request.Content = content;
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Body required

```
{
  "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "keys": [\
    "string"\
  ],
  "schema": {}
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/delete-a-schema#__docusaurus_skipToContent_fallback)

# Delete a schema

```
DELETE https://nildb-demo.nillion.network/api/v1/schemas
```

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

Delete a schema

## Request [​](https://docs.nillion.com/api/nildb/delete-a-schema\#request "Direct link to Request")

- application/json

### Body **required**

**id** uuidrequired

A universally unique identifier for the item.

## Responses [​](https://docs.nillion.com/api/nildb/delete-a-schema\#responses "Direct link to Responses")

- 200
- 400
- 401

Schema deleted successfully

- application/json

- Schema
- Example (auto)

**Schema**

**data** uuidrequired

A universally unique identifier for the item.

```codeBlockLines_e6Vv
{
  "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Delete, "https://nildb-demo.nillion.network/api/v1/schemas");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var content = new StringContent("{\n  \"id\": \"3fa85f64-5717-4562-b3fc-2c963f66afa6\"\n}", null, "application/json");
request.Content = content;
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Body required

```
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/upload-data-to-the-specified-schema-collection#__docusaurus_skipToContent_fallback)

# Upload data to the specified schema collection

```
POST https://nildb-demo.nillion.network/api/v1/data/create
```

Upload data to the specified schema collection

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

info

You may use the following example + with a unique uuidv4 `id` in the request body.

```codeBlockLines_e6Vv
{
    "schema": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "data": [\
        {\
            "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",\
            "city": "New York",\
            "country_code": "US",\
            "age": 30\
        }\
    ]
}

```

## Request [​](https://docs.nillion.com/api/nildb/upload-data-to-the-specified-schema-collection\#request "Direct link to Request")

- application/json

### Body

**schema** uuidrequired

The schema's uuid used to validate data

**data** object\[\]required

## Responses [​](https://docs.nillion.com/api/nildb/upload-data-to-the-specified-schema-collection\#responses "Direct link to Responses")

- 200
- 400
- 401

The outcome of the data upload operation. The operation can be partially successful.

- application/json

- Schema
- Example (auto)

**Schema**

**created** undefined\[\]required

The uuids from successfully created documents

**errors** object\[\]required

Array \[\
\
**error** stringrequired\
\
**document** objectrequired\
\
\]

```codeBlockLines_e6Vv
{
  "created": [\
    null\
  ],
  "errors": [\
    {\
      "error": "string",\
      "document": {}\
    }\
  ]
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, "https://nildb-demo.nillion.network/api/v1/data/create");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var content = new StringContent("{\n  \"schema\": \"3fa85f64-5717-4562-b3fc-2c963f66afa6\",\n  \"data\": [\n    {}\n  ]\n}", null, "application/json");
request.Content = content;
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Body

```
{
  "schema": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "data": [\
    {}\
  ]
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/retrieve-data-from-the-specified-schema-collection-that-matches-the-provided-filter#__docusaurus_skipToContent_fallback)

# Retrieve data from the specified schema collection that matches the provided filter

```
POST https://nildb-demo.nillion.network/api/v1/data/read
```

Retrieve data from the specified schema collection that matches the provided filter

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

## Request [​](https://docs.nillion.com/api/nildb/retrieve-data-from-the-specified-schema-collection-that-matches-the-provided-filter\#request "Direct link to Request")

- application/json

### Body

**schema** uuidrequired

A universally unique identifier for the item.

**filter** objectrequired

An object representing filter criteria for queries.

**property name\*** object

A flexible object allowing any key-value pairs, where values can be of any type.

## Responses [​](https://docs.nillion.com/api/nildb/retrieve-data-from-the-specified-schema-collection-that-matches-the-provided-filter\#responses "Direct link to Responses")

- 200
- 400
- 401

Data documents that match the provided filter. Pagenation is not supported.

- application/json

- Schema
- Example (auto)

**Schema**

**data** undefined\[\]required

```codeBlockLines_e6Vv
{
  "data": [\
    null\
  ]
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, "https://nildb-demo.nillion.network/api/v1/data/read");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var content = new StringContent("{\n  \"schema\": \"3fa85f64-5717-4562-b3fc-2c963f66afa6\",\n  \"filter\": {}\n}", null, "application/json");
request.Content = content;
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Body

```
{
  "schema": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "filter": {}
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/retrieve-recently-added-documents-from-a-schema-collection#__docusaurus_skipToContent_fallback)

# Retrieve recently added documents from a schema collection

```
POST https://nildb-demo.nillion.network/api/v1/data/tail
```

Retrieve recently added documents from a schema collection

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

## Request [​](https://docs.nillion.com/api/nildb/retrieve-recently-added-documents-from-a-schema-collection\#request "Direct link to Request")

- application/json

### Body

**schema** uuidrequired

A universally unique identifier for the item.

## Responses [​](https://docs.nillion.com/api/nildb/retrieve-recently-added-documents-from-a-schema-collection\#responses "Direct link to Responses")

- 200
- 400
- 401

The last 25 latest documents added to the schema collection

- application/json

- Schema
- Example (auto)

**Schema**

**data** undefined\[\]required

```codeBlockLines_e6Vv
{
  "data": [\
    null\
  ]
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, "https://nildb-demo.nillion.network/api/v1/data/tail");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var content = new StringContent("{\n  \"schema\": \"3fa85f64-5717-4562-b3fc-2c963f66afa6\"\n}", null, "application/json");
request.Content = content;
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Body

```
{
  "schema": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/update-documents-within-a-schema-collection-that-match-the-given-filter#__docusaurus_skipToContent_fallback)

# Update documents within a schema collection that match the given filter

```
POST https://nildb-demo.nillion.network/api/v1/data/update
```

Update documents within a schema collection that match the given filter

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

## Request [​](https://docs.nillion.com/api/nildb/update-documents-within-a-schema-collection-that-match-the-given-filter\#request "Direct link to Request")

- application/json

### Body

**schema** uuidrequired

A universally unique identifier for the item.

**filter** objectrequired

An object representing filter criteria for queries.

**property name\*** object

A flexible object allowing any key-value pairs, where values can be of any type.

**update** required

**property name\*** object

A flexible object allowing any key-value pairs, where values can be of any type.

## Responses [​](https://docs.nillion.com/api/nildb/update-documents-within-a-schema-collection-that-match-the-given-filter\#responses "Direct link to Responses")

- 200
- 400
- 401

The result of the update operation

- application/json

- Schema
- Example (auto)

**Schema**

**data** objectrequired

**matched** numberrequired

**updated** numberrequired

```codeBlockLines_e6Vv
{
  "data": {
    "matched": 0,
    "updated": 0
  }
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, "https://nildb-demo.nillion.network/api/v1/data/update");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var content = new StringContent("{\n  \"schema\": \"3fa85f64-5717-4562-b3fc-2c963f66afa6\",\n  \"filter\": {}\n}", null, "application/json");
request.Content = content;
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Body

```
{
  "schema": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "filter": {}
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/delete-data-records-that-match-a-given-filter#__docusaurus_skipToContent_fallback)

# Delete data records that match a given filter

```
POST https://nildb-demo.nillion.network/api/v1/data/delete
```

Delete data records that match a given filter

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

## Request [​](https://docs.nillion.com/api/nildb/delete-data-records-that-match-a-given-filter\#request "Direct link to Request")

- application/json

### Body

**schema** uuid

A universally unique identifier for the item.

**filter** object

An object representing filter criteria for queries.

**property name\*** object

A flexible object allowing any key-value pairs, where values can be of any type.

## Responses [​](https://docs.nillion.com/api/nildb/delete-data-records-that-match-a-given-filter\#responses "Direct link to Responses")

- 200
- 400
- 401

The number of documents removed

- application/json

- Schema
- Example (auto)

**Schema**

**data** numberrequired

```codeBlockLines_e6Vv
{
  "data": 0
}

```

Validation or processing errors

- application/json

- Schema
- Example (auto)

**Schema**

**ts** date-timerequired

The time of the error according to the node.

**errors** object\[\]required

List of error messages

Array \[\
\
anyOf\
\
- MOD1\
- MOD2\
\
string\
\
**code** string\
\
**message** string\
\
\]

```codeBlockLines_e6Vv
{
  "ts": "2024-07-29T15:51:28.071Z",
  "errors": [\
    "string",\
    {\
      "code": "string",\
      "message": "string"\
    }\
  ]
}

```

Missing or invalid JWT

#### Authorization: http

```
name: jwttype: httpscheme: bearerbearerFormat: JWTdescription: A DID-JWT using the ES256K algorithm for authenticated endpoints.
JWT payload must include:
- iat: Issued at timestamp
- exp: Expiration timestamp (recommended)
- aud: Target node decentralised identifier (DID)
- iss: Client's decentralised identifier (DID)

```

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, "https://nildb-demo.nillion.network/api/v1/data/delete");
request.Headers.Add("Accept", "application/json");
request.Headers.Add("Authorization", "Bearer <TOKEN>");
var content = new StringContent("{\n  \"schema\": \"3fa85f64-5717-4562-b3fc-2c963f66afa6\",\n  \"filter\": {}\n}", null, "application/json");
request.Content = content;
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());

```

Request Collapse all

Base URL

Edit

https://nildb-demo.nillion.network

Auth

Bearer Token

Body

```
{
  "schema": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "filter": {}
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!

Feedback

[Skip to main content](https://docs.nillion.com/api/nildb/remove-all-documents-in-a-schema-collection#__docusaurus_skipToContent_fallback)

# Remove all documents in a schema collection

```
POST /api/v1/data/flush
```

Remove all documents in a schema collection

info

You may use this test Bearer token we have created for development

```codeBlockLines_e6Vv
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOnRlc3RuZXQ6bmlsbGlvbjF4dnRuM2FhajQ4dGY3bm5zZW16MGQ2OGVwbjZlcHU0ZjRhNG5mYSIsImF1ZCI6ImRpZDpuaWw6dGVzdG5ldDpuaWxsaW9uMXd3c3Jqbmd4dnU5dGMzMzVsajlrM213d3JybDV3M3EyZDB1ZXR6In0.yOKg-wyJdyn9jK-KNtkjbi9PS0pF9wmgVmd7pIeNGhoTjhgZhzB62atbgzE45OGGYx0gUsw_i2k3K2AdFf_tuQ

```

## Request [​](https://docs.nillion.com/api/nildb/remove-all-documents-in-a-schema-collection\#request "Direct link to Request")

## Responses [​](https://docs.nillion.com/api/nildb/remove-all-documents-in-a-schema-collection\#responses "Direct link to Responses")

- 200
- 400
- 401

The total documents removed

Validation or processing errors

Missing or invalid JWT

Feedback