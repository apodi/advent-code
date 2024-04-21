import * as fs from 'fs';
import * as readline from 'readline';

type CubeCounts = {
    red: number;
    green: number;
    blue: number;
};

export function parseCubeCounts(cubeString: string): CubeCounts {
    const counts: CubeCounts = { red: 0, green: 0, blue: 0 };
    const parts = cubeString.split(", ");
    parts.forEach(part => {
        const [count, color] = part.split(" ");
        const num = parseInt(count);
        if (color.includes('red')) counts.red = Math.max(counts.red, num);
        if (color.includes('green')) counts.green = Math.max(counts.green, num);
        if (color.includes('blue')) counts.blue = Math.max(counts.blue, num);
    });
    return counts;
}

export async function findMinimumCubesAndPower(filePath: string): Promise<number> {
    let totalPower = 0;
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const parts = line.split(': ');
        const subsets = parts[1].split('; ');
        let minCubes: CubeCounts = { red: 0, green: 0, blue: 0 };

        subsets.forEach(subset => {
            const counts = parseCubeCounts(subset);
            minCubes.red = Math.max(minCubes.red, counts.red);
            minCubes.green = Math.max(minCubes.green, counts.green);
            minCubes.blue = Math.max(minCubes.blue, counts.blue);
        });

        const power = minCubes.red * minCubes.green * minCubes.blue;
        totalPower += power;
    }

    if (rl.close) {
        rl.close();
    }
    if (fileStream && typeof fileStream.close === 'function') {
        fileStream.close();
    }

    return totalPower;
}

const filePath = 'game_data.txt'; 
findMinimumCubesAndPower(filePath).then(totalPower => {
    console.log(`The total sum of powers is: ${totalPower}`);
}).catch(error => {
    //console.error('Error:', error);
});
