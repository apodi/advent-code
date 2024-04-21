import * as fs from 'fs';
import * as readline from 'readline';

interface ScratchCard {
    index: number;
    winningNumbers: Set<number>;
    yourNumbers: number[];
}

function parseCard(line: string, index: number): ScratchCard {
    const [winningPart, yourPart] = line.split('|');
    const winningNumbers = new Set(winningPart.trim().split(/\s+/).map(Number));
    const yourNumbers = yourPart.trim().split(/\s+/).map(Number);
    return { index, winningNumbers, yourNumbers };
}

export async function calculateTotalCards(filePath: string): Promise<number> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let index = 0;
    const cardCounts: number[] = [];
    let futureWins: Map<number, number> = new Map();

    for await (const line of rl) {
        const card = parseCard(line, index);
        const count = (futureWins.get(index) || 0) + 1;  // Start with previously won counts, if any, plus one for the original card
        cardCounts[index] = count;  // Record count of this card

        let matchCount = 0;
        card.yourNumbers.forEach(num => {
            if (card.winningNumbers.has(num)) matchCount++;
        });

        for (let i = 1; i <= matchCount; i++) {
            futureWins.set(index + i, (futureWins.get(index + i) || 0) + count);
        }

        index++;
    }

    rl.close();
     if (fileStream && typeof fileStream.close === 'function') {
      fileStream.close();
  }

    const totalCards = cardCounts.reduce((sum, current) => sum + current, 0);
    return totalCards;
}

const filePath = 'input.txt';
calculateTotalCards(filePath).then(totalCards => {
    console.log(`The total number of scratchcards you end up with is: ${totalCards}`);
}).catch(error => {
    //console.error('Error:', error);
});
