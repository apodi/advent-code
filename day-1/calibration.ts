import * as fs from 'fs';
import * as readline from 'readline';

export async function sumCalibrationValues(filePath: string): Promise<number> {
    let totalSum = 0;
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const digits = line.match(/\d/g);
        if (digits && digits.length >= 1) {
            const firstDigit = digits[0]; 
            const lastDigit = digits[digits.length - 1];
            const number = parseInt(firstDigit + lastDigit); 
            totalSum += number;
        }
    }

    if (rl.close) {
      rl.close(); // Close readline stream
  }
  if (fileStream && typeof fileStream.close === 'function') {
      fileStream.close();
  }

    return totalSum;
}

const filePath = 'calibration_document.txt'; 
sumCalibrationValues(filePath).then(totalSum => {
    console.log(`The total sum of calibration values is: ${totalSum}`);
}).catch(error => {
    //console.error('Error:', error);
});