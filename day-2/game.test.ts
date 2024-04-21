import * as fs from 'fs';
import * as readline from 'readline';
import { sumOfPossibleGameIDs, parseCubeCounts, isPossibleGame } from './game';

jest.mock('fs');
jest.mock('readline');

describe('Game ID Summation', () => {
  it('parses cube counts correctly', () => {
    const result = parseCubeCounts("3 red, 5 green, 4 blue");
    expect(result).toEqual({ red: 3, green: 5, blue: 4 });
  });

  it('determines if a game is possible with given bag limits', () => {
    const subsets = ["3 red, 4 green", "2 blue"];
    const bag = { red: 3, green: 5, blue: 3 };
    expect(isPossibleGame(subsets, bag)).toBeTruthy();
  });

  it('calculates the correct sum of possible game IDs', async () => {
    const lines = [
      'Game 1: 3 red, 4 blue; 1 green, 2 blue',
      'Game 2: 1 red, 5 green; 3 blue',
      'Game 3: 4 red, 6 green; 2 blue, 5 red'
    ];
    const bagLimits = { red: 3, green: 5, blue: 3 };
    const mockStream = new (require('stream').Readable)();
    (readline.createInterface as jest.Mock).mockImplementation(() => {
        let i = 0;
        return {
            [Symbol.asyncIterator]() {
                return {
                    next: () => Promise.resolve(i < lines.length ? { value: lines[i++], done: false } : { value: undefined, done: true })
                };
            },
            close: jest.fn(),
        };
    });
    const totalSum = await sumOfPossibleGameIDs('fakepath.txt', bagLimits);
    expect(totalSum).toBe(2);
  });
});
