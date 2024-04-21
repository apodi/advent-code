import * as fs from 'fs';
import * as readline from 'readline';
import { parseCubeCounts, findMinimumCubesAndPower } from './game-part-2';

jest.mock('fs');
jest.mock('readline');

describe('Cube Game Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('parses cube counts correctly', () => {
    const input = "5 red, 3 green, 7 blue";
    const expectedOutput = { red: 5, green: 3, blue: 7 };
    expect(parseCubeCounts(input)).toEqual(expectedOutput);
  });

  it('calculates minimum cubes and power correctly from file', async () => {
    const lines = [
      'Game 1: 3 red, 4 blue; 1 green, 2 blue',
      'Game 2: 1 red, 2 green; 3 blue, 5 red'
    ];
    const mockStream = new (require('stream').Readable)();
    mockStream._read = () => {};

    const mockReadlineInterface = {
        [Symbol.asyncIterator]() {
            let i = 0;
            return {
                next: () => Promise.resolve(i < lines.length ? { value: lines[i++], done: false } : { value: undefined, done: true }),
            };
        },
        close: jest.fn(),
    };

    jest.spyOn(readline, 'createInterface').mockReturnValue(mockReadlineInterface as any);
    jest.spyOn(fs, 'createReadStream').mockReturnValue(mockStream);

    const filePath = 'fake_game_data.txt';
    const result = await findMinimumCubesAndPower(filePath);
    expect(result).toEqual(42);
  });
});
