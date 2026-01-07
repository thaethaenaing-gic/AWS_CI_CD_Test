import json
import boto3
from datetime import datetime  
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Test_TTN')

def lambda_handler(event, context):
    action = event.get("action")
    item_id = event.get("id")
    created_id = datetime.utcnow().isoformat()
    print("Received event:", json.dumps(event, indent=2))
    print("Test CI/CD Pipeline")
    if action == "put":
        item = {
            "id": item_id,
            "created_id": created_id,
            "name": event.get("name"),
            "age": event.get("age")
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "body": "Item inserted successfully"
        }

    elif action == "get":
        created_id = event.get("created_id")
        response = table.get_item(
            Key={"id": item_id,"created_id": created_id}
        )

        if "Item" in response:
            return {
                "statusCode": 200,
                "body": response["Item"]
            }
        else:
            return {
                "statusCode": 404,
                "body": "Item not found"
            }

    else:
        return {
            "statusCode": 400,
            "body": "Invalid action"
        }
