import * as fs from 'fs';
import * as readline from 'readline';

type ColorCounts = {
    red: number;
    green: number;
    blue: number;
};

function parseCubeCounts(cubeString: string): ColorCounts {
    const counts: ColorCounts = { red: 0, green: 0, blue: 0 };
    const parts = cubeString.split(", ");
    parts.forEach(part => {
        const [count, color] = part.split(" ");
        if (color.startsWith('red')) counts.red = Math.max(counts.red, parseInt(count));
        if (color.startsWith('green')) counts.green = Math.max(counts.green, parseInt(count));
        if (color.startsWith('blue')) counts.blue = Math.max(counts.blue, parseInt(count));
    });
    return counts;
}

function isPossibleGame(subsets: string[], bag: ColorCounts): boolean {
    return subsets.every(subset => {
        const counts = parseCubeCounts(subset);
        return counts.red <= bag.red && counts.green <= bag.green && counts.blue <= bag.blue;
    });
}

export async function sumOfPossibleGameIDs(filePath: string, bag: ColorCounts): Promise<number> {
    let totalSum = 0;
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const parts = line.split(': ');
        const gameId = parseInt(parts[0].split(' ')[1]);
        const subsets = parts[1].split('; ');

        if (isPossibleGame(subsets, bag)) {
            totalSum += gameId;
        }
    }

    if (rl.close) {
        rl.close();
    }
    if (fileStream && typeof fileStream.close === 'function') {
        fileStream.close();
    }

    return totalSum;
}

const filePath = 'game_data.txt'; 
const bagLimits: ColorCounts = {
    red: 12,
    green: 13,
    blue: 14
};

sumOfPossibleGameIDs(filePath, bagLimits).then(totalSum => {
    console.log(`The total sum of possible game IDs is: ${totalSum}`);
});
