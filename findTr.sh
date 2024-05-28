#!/bin/bash

# Capture the grep output
output=$(grep -r '<.*>' ./tests/ | sed 's/.*<//; s/>.*//')

# Split the output into lines (considering odd number of lines)
lines=( $(echo "$output" | tr '\n' ' ') )

# Calculate the number of elements per array (half the lines, rounded down)
half=$(( ${#lines[@]} / 2 ))

# Initialize the two arrays
array1=()
array2=()

# Loop through lines and split them into arrays
for (( i=0; i<${#lines[@]}; i++ )); do
  if [[ $i -lt $half ]]; then
    array1+=("${lines[$i]}")
  else
    array2+=("${lines[$i]}")
  fi
done

# Print the arrays (adjust indentation for readability)
echo "Array 1:"
printf '%s\n' "${array1[@]}"

echo "Array 2:"
printf '%s\n' "${array2[@]}"
