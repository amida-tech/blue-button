module.exports = { // this needs work or the section needs or both
  "id": "nutrition",
  "type": "object",
  "properties": {
    /* "date_time": {
      "$ref": "cda_date"
    }, */
    /*     "identifiers": {
          "type": "string",
          "item": {
            "$ref": "cda_id"
          },
        }, */
    /*  "value": {
       "type": "string"
     }, */
    "code": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "text": {
      "type": "string"
    },
    "entry": {
      "type": "array",
      "observation": {
        "type": "object",
        "properties": {
          "id": {
            "type": "array"
          },
          "statusCode": {
            "type": "string"
          },
          "code": {
            "type": "string"
          },
          "templateId": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "effectiveTime": {
            "type": "string"
          },
          "value": {
            "type": "string"
          },
          "entryRelationship": {
            "type": "array",
            "nutritionAssessment": {
              "type": "object",
              "properties": {
                /*           "identifiers": {
                            "type": "string",
                            "item": {
                              "$ref": "cda_id"
                            },
                          }, */
                "templateId": {
                  "type": "string"
                },
                "id": {
                  "type": "array"
                },
                /*           "classCode": {
                            "type": "string"
                          },
                          "moodCode": {
                            "type": "string"
                          }, */
                "code": {
                  "type": "string"
                },
                /*  "codeSystem": {
                    "type": "string"
                  }, */
                "statusCode": {
                  "type": "string"
                },
                "effectiveTime": {
                  "$ref": "cda_date"
                },
                "value": {
                  "type": "string"
                },
                "authorParticipation": {
                  "type": "object",
                  "properties": {
                    "templateId": {
                      "type": "string"
                    },
                    "time": {
                      "$ref": "cda_date"
                    },
                    "assignedAuthor": {
                      "type": "string",
                      "id": {
                        "type": "string"
                      },
                      "code": {
                        "type": "string"
                      },
                      "assignedPerson": {
                        "type": "string"
                      },
                      "name": {
                        "type": "array"
                      },
                      "representedOrganization": {
                        "type": "string",
                        "id": {
                          "type": "array"
                        },
                        "name": {
                          "type": "array"
                        },
                        "telecom": {
                          "type": "array"
                        },
                        "addr": {
                          "type": "array"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "additionalProperties": false,
  "minProperties": 1,
  // "required": [
  //   "value"
  // ]
};