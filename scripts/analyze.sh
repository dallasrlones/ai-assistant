#!/bin/bash

# Ensure the script exits on error
set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <absolute-file-path> <prompt>"
    exit 1
fi

# Assign variables
FILE_PATH="$1"
PROMPT="$2"

# Expand ~ to the absolute path (macOS/Linux compatibility)
FILE_PATH="${FILE_PATH/#\~/$HOME}"

# Debug: Log the start of the process
echo "DEBUG: Processing file: \"$FILE_PATH\" with prompt: \"$PROMPT\""

# Check if the file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File \"$FILE_PATH\" not found."
    exit 1
fi

# Base64 encode the image (macOS compatible, removed `-i`)
BASE64_IMAGE=$(cat "$FILE_PATH" | base64 | tr -d '\n')

# Debug: Ensure base64 encoding succeeded
if [ -z "$BASE64_IMAGE" ]; then
    echo "Error: Failed to base64 encode the file."
    exit 1
fi

# Create a temporary file for the JSON payload
TMP_PAYLOAD=$(mktemp)
cat <<EOF > "$TMP_PAYLOAD"
{
    "model": "llama3.2-vision:11b",
    "prompt": "$PROMPT",
    "image": "$BASE64_IMAGE"
}
EOF

# Debug: Log payload location
echo "DEBUG: Payload written to $TMP_PAYLOAD"

# Send the request to the Ollama API and process the response
RESPONSE=$(curl -s -X POST "http://localhost:11434/api/generate" \
  -H "Content-Type: application/json" \
  --data-binary @"$TMP_PAYLOAD")

# Remove the temporary file
rm "$TMP_PAYLOAD"

# Check if the response is empty
if [ -z "$RESPONSE" ]; then
    echo "Error: No response received from the API."
    exit 1
fi

# Parse the response for the "response" field
FINAL_ANSWER=$(echo "$RESPONSE" | grep -o '"response":"[^"]*"' | sed 's/"response":"//' | sed 's/"$//')

# Decode special characters in the final answer and remove unnecessary newlines/spaces
FINAL_ANSWER=$(echo -e "$FINAL_ANSWER" | sed 's/\\u003c/</g' | sed 's/\\n/ /g' | tr -s ' ')

# Output the final answer
echo -e "\nAnswer: $FINAL_ANSWER"
