export const contract = {
  "telemetry": {
    "ingest": {
      "method": "post",
      "description": "Receive a batch of ETS2/ATS telemetry from a remote recording agent.",
      "noAuth": true,
      "encrypted": false,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "token": {
              "type": "string"
            },
            "clientId": {
              "type": "string"
            },
            "messages": {
              "type": "array",
              "items": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "connected"
                      }
                    },
                    "required": [
                      "type"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "disconnected"
                      }
                    },
                    "required": [
                      "type"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "frame"
                      },
                      "frame": {
                        "type": "object",
                        "properties": {
                          "t_ms": {
                            "type": "integer",
                            "minimum": -9007199254740991,
                            "maximum": 9007199254740991
                          },
                          "game_min": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "speed_kmh": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "rpm": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "gear": {
                            "type": "integer",
                            "minimum": -2147483648,
                            "maximum": 2147483647
                          },
                          "throttle": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "brake": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "steer": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "clutch": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "fuel_l": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "adblue_l": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "odometer_km": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "cargo_damage": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "x": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "y": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "z": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "heading_deg": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "cruise_control": {
                            "type": "boolean"
                          },
                          "engine_on": {
                            "type": "boolean"
                          },
                          "park_brake": {
                            "type": "boolean"
                          },
                          "game": {
                            "type": "string",
                            "enum": [
                              "ets2",
                              "ats",
                              "unknown"
                            ]
                          },
                          "truck_id": {
                            "type": "string"
                          },
                          "truck_name": {
                            "type": "string"
                          },
                          "truck_brand": {
                            "type": "string"
                          },
                          "truck_plate": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "t_ms"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "required": [
                      "type",
                      "frame"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "job-started"
                      },
                      "job": {
                        "type": "object",
                        "properties": {
                          "game": {
                            "type": "string",
                            "enum": [
                              "ets2",
                              "ats",
                              "unknown"
                            ]
                          },
                          "started_game_min": {
                            "anyOf": [
                              {
                                "type": "number",
                                "minimum": -140737488355328,
                                "maximum": 140737488355327
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "cargo": {
                            "type": "string"
                          },
                          "cargo_id": {
                            "type": "string"
                          },
                          "cargo_mass_kg": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "city_src": {
                            "type": "string"
                          },
                          "city_src_id": {
                            "type": "string"
                          },
                          "comp_src": {
                            "type": "string"
                          },
                          "comp_src_id": {
                            "type": "string"
                          },
                          "city_dst": {
                            "type": "string"
                          },
                          "city_dst_id": {
                            "type": "string"
                          },
                          "comp_dst": {
                            "type": "string"
                          },
                          "comp_dst_id": {
                            "type": "string"
                          },
                          "job_market": {
                            "type": "string"
                          },
                          "special_job": {
                            "type": "boolean"
                          },
                          "unit_count": {
                            "type": "integer",
                            "minimum": -2147483648,
                            "maximum": 2147483647
                          },
                          "unit_mass_kg": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "planned_distance_km": {
                            "anyOf": [
                              {
                                "type": "number",
                                "minimum": -140737488355328,
                                "maximum": 140737488355327
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "income": {
                            "type": "integer",
                            "minimum": -2147483648,
                            "maximum": 2147483647
                          },
                          "truck_id": {
                            "type": "string"
                          },
                          "truck_name": {
                            "type": "string"
                          },
                          "truck_brand": {
                            "type": "string"
                          },
                          "truck_plate": {
                            "type": "string"
                          }
                        },
                        "additionalProperties": false
                      }
                    },
                    "required": [
                      "type",
                      "job"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "job-delivered"
                      },
                      "job": {
                        "type": "object",
                        "properties": {
                          "finished_game_min": {
                            "anyOf": [
                              {
                                "type": "number",
                                "minimum": -140737488355328,
                                "maximum": 140737488355327
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "delivered_distance_km": {
                            "anyOf": [
                              {
                                "type": "number",
                                "minimum": -140737488355328,
                                "maximum": 140737488355327
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "delivery_time_min": {
                            "anyOf": [
                              {
                                "type": "number",
                                "minimum": -140737488355328,
                                "maximum": 140737488355327
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "cargo_damage": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "revenue": {
                            "type": "integer",
                            "minimum": -2147483648,
                            "maximum": 2147483647
                          },
                          "xp": {
                            "type": "integer",
                            "minimum": -2147483648,
                            "maximum": 2147483647
                          },
                          "autopark": {
                            "type": "boolean"
                          },
                          "autoload": {
                            "type": "boolean"
                          }
                        },
                        "additionalProperties": false
                      }
                    },
                    "required": [
                      "type",
                      "job"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "job-cancelled"
                      },
                      "job": {
                        "type": "object",
                        "properties": {
                          "finished_game_min": {
                            "anyOf": [
                              {
                                "type": "number",
                                "minimum": -140737488355328,
                                "maximum": 140737488355327
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "penalty": {
                            "type": "integer",
                            "minimum": -2147483648,
                            "maximum": 2147483647
                          }
                        },
                        "additionalProperties": false
                      }
                    },
                    "required": [
                      "type",
                      "job"
                    ],
                    "additionalProperties": false
                  },
                  {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string",
                        "const": "game-event"
                      },
                      "event": {
                        "type": "object",
                        "properties": {
                          "kind": {
                            "type": "string",
                            "enum": [
                              "fine",
                              "refuel",
                              "tollgate",
                              "ferry",
                              "train"
                            ]
                          },
                          "game_min": {
                            "type": "number",
                            "minimum": -140737488355328,
                            "maximum": 140737488355327
                          },
                          "amount": {
                            "type": "integer",
                            "minimum": -2147483648,
                            "maximum": 2147483647
                          },
                          "detail": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "kind"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "required": [
                      "type",
                      "event"
                    ],
                    "additionalProperties": false
                  }
                ]
              }
            }
          },
          "required": [
            "token",
            "clientId",
            "messages"
          ],
          "additionalProperties": false
        }
      },
      "output": "custom"
    }
  },
  "settings": {
    "get": {
      "method": "get",
      "description": "Get the ingest token metadata (the token itself is masked).",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "tokenLast4": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "tokenCreated": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "date-time"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "tokenLast4",
            "tokenCreated"
          ],
          "additionalProperties": false
        }
      }
    },
    "rotate": {
      "method": "post",
      "description": "Rotate the ingest token. The new raw token is returned only once.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "token": {
              "type": "string"
            },
            "tokenLast4": {
              "type": "string"
            }
          },
          "required": [
            "token",
            "tokenLast4"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "sessions": {
    "get": {
      "method": "get",
      "description": "Get a single recorded session by id.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "client_id": {
              "type": "string"
            },
            "game": {
              "type": "string",
              "enum": [
                "ets2",
                "ats",
                "unknown"
              ]
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "completed",
                "interrupted"
              ]
            },
            "started_at": {
              "type": "string",
              "format": "date-time"
            },
            "started_game_min": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": -140737488355328,
                  "maximum": 140737488355327
                },
                {
                  "type": "null"
                }
              ]
            },
            "finished_at": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "date-time"
                },
                {
                  "type": "null"
                }
              ]
            },
            "finished_game_min": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": -140737488355328,
                  "maximum": 140737488355327
                },
                {
                  "type": "null"
                }
              ]
            },
            "truck_id": {
              "type": "string"
            },
            "truck_name": {
              "type": "string"
            },
            "truck_brand": {
              "type": "string"
            },
            "truck_plate": {
              "type": "string"
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "client_id",
            "game",
            "status",
            "started_at",
            "started_game_min",
            "finished_at",
            "finished_game_min",
            "truck_id",
            "truck_name",
            "truck_brand",
            "truck_plate",
            "created",
            "updated"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "List recorded sessions with optional filters.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "game": {
              "type": "string",
              "enum": [
                "ets2",
                "ats",
                "unknown"
              ]
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "completed",
                "interrupted"
              ]
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "format": "uuid",
                "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
              },
              "client_id": {
                "type": "string"
              },
              "game": {
                "type": "string",
                "enum": [
                  "ets2",
                  "ats",
                  "unknown"
                ]
              },
              "status": {
                "type": "string",
                "enum": [
                  "active",
                  "completed",
                  "interrupted"
                ]
              },
              "started_at": {
                "type": "string",
                "format": "date-time"
              },
              "started_game_min": {
                "anyOf": [
                  {
                    "type": "number",
                    "minimum": -140737488355328,
                    "maximum": 140737488355327
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "finished_at": {
                "anyOf": [
                  {
                    "type": "string",
                    "format": "date-time"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "finished_game_min": {
                "anyOf": [
                  {
                    "type": "number",
                    "minimum": -140737488355328,
                    "maximum": 140737488355327
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "truck_id": {
                "type": "string"
              },
              "truck_name": {
                "type": "string"
              },
              "truck_brand": {
                "type": "string"
              },
              "truck_plate": {
                "type": "string"
              },
              "created": {
                "type": "string",
                "format": "date-time"
              },
              "updated": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "id",
              "client_id",
              "game",
              "status",
              "started_at",
              "started_game_min",
              "finished_at",
              "finished_game_min",
              "truck_id",
              "truck_name",
              "truck_brand",
              "truck_plate",
              "created",
              "updated"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "route": {
      "method": "get",
      "description": "Get the recorded route of a session as GeoJSON.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "sessionId": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            }
          },
          "required": [
            "sessionId"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "const": "FeatureCollection"
            },
            "features": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "const": "Feature"
                  },
                  "properties": {
                    "type": "object",
                    "additionalProperties": {}
                  },
                  "geometry": {
                    "type": "object",
                    "properties": {
                      "type": {
                        "type": "string"
                      },
                      "coordinates": {}
                    },
                    "required": [
                      "type",
                      "coordinates"
                    ],
                    "additionalProperties": false
                  }
                },
                "required": [
                  "type",
                  "properties",
                  "geometry"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "type",
            "features"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "jobs": {
    "get": {
      "method": "get",
      "description": "Get a single recorded job by id.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "session_id": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                {
                  "type": "null"
                }
              ]
            },
            "game": {
              "type": "string",
              "enum": [
                "ets2",
                "ats",
                "unknown"
              ]
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "delivered",
                "cancelled",
                "interrupted"
              ]
            },
            "started_at": {
              "type": "string",
              "format": "date-time"
            },
            "started_game_min": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": -140737488355328,
                  "maximum": 140737488355327
                },
                {
                  "type": "null"
                }
              ]
            },
            "finished_at": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "date-time"
                },
                {
                  "type": "null"
                }
              ]
            },
            "finished_game_min": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": -140737488355328,
                  "maximum": 140737488355327
                },
                {
                  "type": "null"
                }
              ]
            },
            "cargo": {
              "type": "string"
            },
            "cargo_id": {
              "type": "string"
            },
            "cargo_mass_kg": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "city_src": {
              "type": "string"
            },
            "city_src_id": {
              "type": "string"
            },
            "comp_src": {
              "type": "string"
            },
            "comp_src_id": {
              "type": "string"
            },
            "city_dst": {
              "type": "string"
            },
            "city_dst_id": {
              "type": "string"
            },
            "comp_dst": {
              "type": "string"
            },
            "comp_dst_id": {
              "type": "string"
            },
            "job_market": {
              "type": "string"
            },
            "special_job": {
              "type": "boolean"
            },
            "unit_count": {
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
            },
            "unit_mass_kg": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "planned_distance_km": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": -140737488355328,
                  "maximum": 140737488355327
                },
                {
                  "type": "null"
                }
              ]
            },
            "delivered_distance_km": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": -140737488355328,
                  "maximum": 140737488355327
                },
                {
                  "type": "null"
                }
              ]
            },
            "revenue": {
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
            },
            "income": {
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
            },
            "penalty": {
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
            },
            "xp": {
              "type": "integer",
              "minimum": -2147483648,
              "maximum": 2147483647
            },
            "cargo_damage": {
              "type": "number",
              "minimum": -140737488355328,
              "maximum": 140737488355327
            },
            "autopark": {
              "type": "boolean"
            },
            "autoload": {
              "type": "boolean"
            },
            "delivery_time_min": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": -140737488355328,
                  "maximum": 140737488355327
                },
                {
                  "type": "null"
                }
              ]
            },
            "truck_id": {
              "type": "string"
            },
            "truck_name": {
              "type": "string"
            },
            "truck_brand": {
              "type": "string"
            },
            "truck_plate": {
              "type": "string"
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            },
            "sample_count": {
              "type": "number"
            },
            "distance_km": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "max_speed_kmh": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "avg_speed_kmh": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "fuel_used_l": {
              "type": "number"
            },
            "adblue_used_l": {
              "type": "number"
            },
            "idle_min": {
              "type": "number"
            }
          },
          "required": [
            "id",
            "session_id",
            "game",
            "status",
            "started_at",
            "started_game_min",
            "finished_at",
            "finished_game_min",
            "cargo",
            "cargo_id",
            "cargo_mass_kg",
            "city_src",
            "city_src_id",
            "comp_src",
            "comp_src_id",
            "city_dst",
            "city_dst_id",
            "comp_dst",
            "comp_dst_id",
            "job_market",
            "special_job",
            "unit_count",
            "unit_mass_kg",
            "planned_distance_km",
            "delivered_distance_km",
            "revenue",
            "income",
            "penalty",
            "xp",
            "cargo_damage",
            "autopark",
            "autoload",
            "delivery_time_min",
            "truck_id",
            "truck_name",
            "truck_brand",
            "truck_plate",
            "created",
            "updated",
            "sample_count",
            "distance_km",
            "max_speed_kmh",
            "avg_speed_kmh",
            "fuel_used_l",
            "adblue_used_l",
            "idle_min"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "List recorded jobs with optional filters.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "sessionId": {
              "type": "string"
            },
            "game": {
              "type": "string",
              "enum": [
                "ets2",
                "ats",
                "unknown"
              ]
            },
            "status": {
              "type": "string",
              "enum": [
                "active",
                "delivered",
                "cancelled",
                "interrupted"
              ]
            },
            "from": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "page": {
              "type": "string"
            },
            "perPage": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  "session_id": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "uuid",
                        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "game": {
                    "type": "string",
                    "enum": [
                      "ets2",
                      "ats",
                      "unknown"
                    ]
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "active",
                      "delivered",
                      "cancelled",
                      "interrupted"
                    ]
                  },
                  "started_at": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "started_game_min": {
                    "anyOf": [
                      {
                        "type": "number",
                        "minimum": -140737488355328,
                        "maximum": 140737488355327
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "finished_at": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "finished_game_min": {
                    "anyOf": [
                      {
                        "type": "number",
                        "minimum": -140737488355328,
                        "maximum": 140737488355327
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "cargo": {
                    "type": "string"
                  },
                  "cargo_id": {
                    "type": "string"
                  },
                  "cargo_mass_kg": {
                    "type": "number",
                    "minimum": -140737488355328,
                    "maximum": 140737488355327
                  },
                  "city_src": {
                    "type": "string"
                  },
                  "city_src_id": {
                    "type": "string"
                  },
                  "comp_src": {
                    "type": "string"
                  },
                  "comp_src_id": {
                    "type": "string"
                  },
                  "city_dst": {
                    "type": "string"
                  },
                  "city_dst_id": {
                    "type": "string"
                  },
                  "comp_dst": {
                    "type": "string"
                  },
                  "comp_dst_id": {
                    "type": "string"
                  },
                  "job_market": {
                    "type": "string"
                  },
                  "special_job": {
                    "type": "boolean"
                  },
                  "unit_count": {
                    "type": "integer",
                    "minimum": -2147483648,
                    "maximum": 2147483647
                  },
                  "unit_mass_kg": {
                    "type": "number",
                    "minimum": -140737488355328,
                    "maximum": 140737488355327
                  },
                  "planned_distance_km": {
                    "anyOf": [
                      {
                        "type": "number",
                        "minimum": -140737488355328,
                        "maximum": 140737488355327
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "delivered_distance_km": {
                    "anyOf": [
                      {
                        "type": "number",
                        "minimum": -140737488355328,
                        "maximum": 140737488355327
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "revenue": {
                    "type": "integer",
                    "minimum": -2147483648,
                    "maximum": 2147483647
                  },
                  "income": {
                    "type": "integer",
                    "minimum": -2147483648,
                    "maximum": 2147483647
                  },
                  "penalty": {
                    "type": "integer",
                    "minimum": -2147483648,
                    "maximum": 2147483647
                  },
                  "xp": {
                    "type": "integer",
                    "minimum": -2147483648,
                    "maximum": 2147483647
                  },
                  "cargo_damage": {
                    "type": "number",
                    "minimum": -140737488355328,
                    "maximum": 140737488355327
                  },
                  "autopark": {
                    "type": "boolean"
                  },
                  "autoload": {
                    "type": "boolean"
                  },
                  "delivery_time_min": {
                    "anyOf": [
                      {
                        "type": "number",
                        "minimum": -140737488355328,
                        "maximum": 140737488355327
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "truck_id": {
                    "type": "string"
                  },
                  "truck_name": {
                    "type": "string"
                  },
                  "truck_brand": {
                    "type": "string"
                  },
                  "truck_plate": {
                    "type": "string"
                  },
                  "created": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "updated": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "sample_count": {
                    "type": "number"
                  },
                  "distance_km": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "max_speed_kmh": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "avg_speed_kmh": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "fuel_used_l": {
                    "type": "number"
                  },
                  "adblue_used_l": {
                    "type": "number"
                  },
                  "idle_min": {
                    "type": "number"
                  }
                },
                "required": [
                  "id",
                  "session_id",
                  "game",
                  "status",
                  "started_at",
                  "started_game_min",
                  "finished_at",
                  "finished_game_min",
                  "cargo",
                  "cargo_id",
                  "cargo_mass_kg",
                  "city_src",
                  "city_src_id",
                  "comp_src",
                  "comp_src_id",
                  "city_dst",
                  "city_dst_id",
                  "comp_dst",
                  "comp_dst_id",
                  "job_market",
                  "special_job",
                  "unit_count",
                  "unit_mass_kg",
                  "planned_distance_km",
                  "delivered_distance_km",
                  "revenue",
                  "income",
                  "penalty",
                  "xp",
                  "cargo_damage",
                  "autopark",
                  "autoload",
                  "delivery_time_min",
                  "truck_id",
                  "truck_name",
                  "truck_brand",
                  "truck_plate",
                  "created",
                  "updated",
                  "sample_count",
                  "distance_km",
                  "max_speed_kmh",
                  "avg_speed_kmh",
                  "fuel_used_l",
                  "adblue_used_l",
                  "idle_min"
                ],
                "additionalProperties": false
              }
            },
            "page": {
              "type": "number"
            },
            "perPage": {
              "type": "number"
            },
            "totalItems": {
              "type": "number"
            },
            "totalPages": {
              "type": "number"
            }
          },
          "required": [
            "items",
            "page",
            "perPage",
            "totalItems",
            "totalPages"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "events": {
    "list": {
      "method": "get",
      "description": "List recorded game events with optional filters.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "sessionId": {
              "type": "string"
            },
            "jobId": {
              "type": "string"
            },
            "kind": {
              "type": "string",
              "enum": [
                "fine",
                "refuel",
                "tollgate",
                "ferry",
                "train"
              ]
            }
          },
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "format": "uuid",
                "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
              },
              "session_id": {
                "anyOf": [
                  {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "job_id": {
                "anyOf": [
                  {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "kind": {
                "type": "string",
                "enum": [
                  "fine",
                  "refuel",
                  "tollgate",
                  "ferry",
                  "train"
                ]
              },
              "game_min": {
                "type": "number",
                "minimum": -140737488355328,
                "maximum": 140737488355327
              },
              "amount": {
                "type": "integer",
                "minimum": -2147483648,
                "maximum": 2147483647
              },
              "detail": {
                "type": "string"
              },
              "created": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "id",
              "session_id",
              "job_id",
              "kind",
              "game_min",
              "amount",
              "detail",
              "created"
            ],
            "additionalProperties": false
          }
        }
      }
    }
  },
  "tiles": {
    "get": {
      "method": "get",
      "description": "Proxy TruckSim Maps PMTiles (supports range requests).",
      "noAuth": true,
      "encrypted": false,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "file": {
              "type": "string"
            }
          },
          "required": [
            "file"
          ],
          "additionalProperties": false
        }
      },
      "output": "custom"
    }
  }
} as const

export default contract
