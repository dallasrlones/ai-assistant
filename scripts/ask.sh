#!/bin/bash

# Check if a prompt is provided
if [ -z "$1" ]; then
  echo "Usage: $0 \"Your prompt here\""
  exit 1
fi

# Assign the prompt from the first argument
PROMPT="$1"

# Debug: Log the start of the process
echo "DEBUG: Sending prompt to the API: $PROMPT"

# Variables for thought process and answer
thought_process=""
final_answer=""

# Send the prompt to the API and process the output
curl -s -X POST "http://localhost:11434/api/generate" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"deepseek-r1:14b\",
    \"prompt\": \"$PROMPT\"
  }" | while IFS= read -r line || [ -n "$line" ]; do
  # Extract the "response" field
  response=$(echo "$line" | grep -o '"response":"[^"]*"' | sed 's/"response":"//' | sed 's/"$//')

  # Decode special characters
  response=$(echo -e "$response" | sed 's/\\u003c/</g' | sed 's/\\n/\n/g')

  # Check for <think> tags
  if [[ "$response" == *"<think>"* ]]; then
    response=${response//<think>/}
    thought_process+="$response"
    echo -n "$response"
  elif [[ "$response" == *"</think>"* ]]; then
    response=${response//<\/think>/}
    thought_process+="$response"
    echo -e "\n"
  else
    final_answer+="$response"
  fi
done

# Print final outputs
echo -e "\nDEBUG: Full Thought Process:\n$thought_process"
echo -e "\nAnswer:\n$final_answer"
