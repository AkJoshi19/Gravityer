
function lengthOfLIS(nums) {
    const finalResult = []; // Stores the indices of the LIS
    const tails = []; 
    const prevIndices = new Array(nums.length).fill(-1); 
    

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];

        // Find the position to insertupdate the current number
        let left = 0;
        let right = tails.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (nums[tails[mid]] < num) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        // If the current number is greater than all elements in tails, append it
        if (left === tails.length) {
            if (tails.length > 0) {
                prevIndices[i] = tails[tails.length - 1]; // Record the predecessor
            }
            tails.push(i);
        } else {
            // Otherwise, update the tail at the found position
            if (left > 0) {
                prevIndices[i] = tails[left - 1]; // Record the predecessor
            }
            tails[left] = i;
        }
    }

    // Reconstruct the LIS using the prevIndices array
    let currentIndex = tails[tails.length - 1];
    while (currentIndex !== -1) {
        finalResult.unshift(nums[currentIndex]); // Add the number to the result
        currentIndex = prevIndices[currentIndex]; // Move to the predecessor
    }

    return {
        length: tails.length,
        sequence: finalResult,
    };
}

const nums = [10, 9, 21, 51, 3, 7, 180, 150, 45, 9,200];
const result = lengthOfLIS(nums);
console.log(result.length);  // 5
console.log(result.sequence); // [9,21,51,150,200]