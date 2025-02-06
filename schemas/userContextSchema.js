const userContextSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User Context and Chat History",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "_id": {
        "type": "string",
        "format": "uuid",
        "coerce": true
      },
      "walletAddress": {
        "type": "string"
      },  
      "userProfile": {
        "type": "object",
        "properties": {
          "name": {
            "type": "object",
            "properties": {
              "$share": {
                "type": "string"
              }
            },
            "required": ["$share"]
          },
          "preferences": {
            "type": "object",
            "properties": {
              "$share": {
                "type": "string"
              }
            },
            "required": ["$share"]
          }
        },
        "required": ["name"]
      },
      "chatHistory": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "timestamp": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": ["human", "ai"]
            },
            "content": {
              "type": "object",
              "properties": {
                "$share": {
                  "type": "string"
                }
              },
              "required": ["$share"]
            }
          },
          "required": ["timestamp", "type", "content"]
        }
      }
    },
    "required": ["_id", "walletAddress", "userProfile"]
  }
} 