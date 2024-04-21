import * as fs from 'fs';
import * as readline from 'readline';

interface ScratchCard {
    winningNumbers: Set<number>;
    yourNumbers: number[];
}

function parseCard(line: string): ScratchCard {
    const [winningPart, yourPart] = line.split('|');
    const winningNumbers = new Set(winningPart.trim().split(/\s+/).map(Number));
    const yourNumbers = yourPart.trim().split(/\s+/).map(Number);
    return { winningNumbers, yourNumbers };
}

function calculateCardPoints(card: ScratchCard): number {
    let points = 0;
    let foundMatches = 0;  // Track number of matches found

    for (const number of card.yourNumbers) {
        if (card.winningNumbers.has(number)) {
            foundMatches++;
            if (foundMatches === 1) {
                points = 1;  // First match worth 1 point
            } else {
                points *= 2;  // Double points for each subsequent match
            }
        }
    }

    return points;
}

export async function calculateTotalPoints(filePath: string): Promise<number> {
    let totalPoints = 0;

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const card = parseCard(line);
        totalPoints += calculateCardPoints(card);
    }

    rl.close();
    if (fileStream && typeof fileStream.close === 'function') {
      fileStream.close();
  }

    return totalPoints;
}

const filePath = 'input.txt';
calculateTotalPoints(filePath).then(totalPoints => {
    console.log(`The total points for all scratchcards is: ${totalPoints}`);
}).catch(error => {
    //console.error('Error:', error);
});
