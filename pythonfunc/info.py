import sys 
import json

result = {
    'Name': sys.argv[1],
    'From': sys.argv[2],
    'end': 'finish'
  }

json = json.dumps(result)

print(str(json))
sys.stdout.flush()