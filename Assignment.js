
// Calculate longest increasing subsequence
const lengthOfLIS = (array) => {
    // basic check
    const arrayLength = array.length;

    if (arrayLength === 0){
        return {length: 0, sequence: []};
    } 
    
    // Initialize the dp array with 1s
    const current = new Array(arrayLength);
    current.fill(1); // fill with 1
    const previous = new Array(arrayLength).fill(-1);

    // Fill the dp array
    for (let i = 1; i < arrayLength; i++) {
        for (let j = 0; j < i; j++) {
            if (array[i] > array[j]) {
                current[i] = Math.max(current[i], current[j] + 1);
            }
        }
    }

    // The length of the longest increasing subsequence is the max value in dp
    return Math.max(...current);
}

// Example usage:
const testArray = [10, 9, 2, 5, 3, 7, 101, 18];
console.log(lengthOfLIS(testArray)); // Output: 4