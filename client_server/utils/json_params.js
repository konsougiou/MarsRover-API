start_params = {
  "TableName": "REMOTE_CONTROL",
  "Item": {
    "ID" : {"N": "0"
        },
    "EVENT_TYPE" : {"S": "REMOTE_COMMAND"
        },
    "EVENT" : {"S": "START"
        },
      "NEW_X" : {"N": "9999"
      },
      "NEW_Y" : {"N": "9999"
      },
      "SESSION_ID": {"N": '9999'
    },
      "CONTROL_STATE": {"S": 'AUTOPILOT'
    }
    }
}
stop_params = {
  "TableName": "REMOTE_CONTROL",
  "Item": {
    "ID" : {"N": "0"
        },
    "EVENT_TYPE" : {"S": "REMOTE_COMMAND"
        },
    "EVENT" : {"S": "STOP"
        },
        "NEW_X" : {"N": "9999"
      },
      "NEW_Y" : {"N": "9999"
      },
      "SESSION_ID": {"N": '9999'
    },
    "CONTROL_STATE": {"S": 'AUTOPILOT'
  }      
    }
}

module.exports = {start_params, stop_params}