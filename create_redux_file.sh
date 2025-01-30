#!/bin/bash

# Script to create a React app with TypeScript and React 18, with optional Microfrontend setup


# Function to display usage information
function usage() {
    echo "Usage: $0"
    exit 1
}

# Function to validate and convert the app name to camelCase
function to_camel_case() {
    local input="$1"
    # Replace hyphens or spaces with nothing, convert to lowercase
    echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/[- ]//g' | awk '{
        for (i=1; i<=NF; i++) {
            $i = (i==1) ? tolower($i) : toupper(substr($i,1,1)) tolower(substr($i,2))
        }
        printf "%s", $0
    }'
}


# Prompt user for the app name
read -p "Enter the Redux file name: " RAW_NAME

APP_NAME=$(to_camel_case "$RAW_NAME")


# Check if an app name is provided
if [ -z "$APP_NAME" ]; then
    echo "Error: Redux file name is required."
    usage
fi

mkdir -p src/features/$APP_NAME 

# Add ${APP_NAME}Slice.ts
cat <<EOT > src/features/$APP_NAME/${APP_NAME}Slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface $(echo "$APP_NAME" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')State {
  value: number;
}

const initialState: $(echo "$APP_NAME" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')State = {
  value: 0,
};

const ${APP_NAME}Slice = createSlice({
  name: '$APP_NAME',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = ${APP_NAME}Slice.actions;
export default ${APP_NAME}Slice.reducer;
EOT