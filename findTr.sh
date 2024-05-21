#!/bin/bash

# Function to process a single file
process_file() {
  local filename="$1"
  awk -v RS="\n" -v FS="'" '{ for (i=2; i<NF; i+=2) { print filename, $i } }' "$filename"
}

# Loop through all files in the current directory recursively
find . -type f -exec bash -c 'process_file "{}" \;' _

# Note: The underscore "_" at the end is a placeholder for the actual filename passed by find
