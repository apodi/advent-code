import * as fs from 'fs';
import * as readline from 'readline';
import { calculateTotalCards } from './scratchcard-part2'; 
import { EventEmitter } from 'events';

jest.mock('fs');
jest.mock('readline');

describe('calculateTotalCards', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('correctly calculates the total number of scratchcards', async () => {
    const lines = [
      '41 48 83 86 17 | 83 86 6 31 17 9 48 53',
      '13 32 20 16 61 | 61 30 68 82 17 32 24 19',
      '1 21 53 59 44 | 69 82 63 72 16 21 14 1',
      '41 92 73 84 69 | 59 84 76 51 58 5 54 83',
      '87 83 26 28 32 | 88 30 70 12 93 22 82 36',
      '31 18 13 56 72 | 74 77 10 23 35 67 36 11'
    ];
    const mockStream = new EventEmitter();

    (readline.createInterface as jest.Mock).mockImplementation(() => ({
      [Symbol.asyncIterator]() {
        let i = 0;
        return {
          next: () => {
            if (i < lines.length) {
              return Promise.resolve({ value: lines[i++], done: false });
            } else {
              return Promise.resolve({ value: undefined, done: true });
            }
          }
        };
      },
      close: jest.fn(),
      on: (event: string, listener: Function) => {
        if (event === 'line') {
          lines.forEach(line => process.nextTick(() => listener(line)));
          process.nextTick(() => listener(null)); // simulate end of file
        }
        if (event === 'close') {
          process.nextTick(listener);
        }
      },
      emit: jest.fn()
    }));

    jest.spyOn(fs, 'createReadStream').mockReturnValue(mockStream as any);

    const filePath = 'fakepath.txt';
    const totalCards = await calculateTotalCards(filePath);
    expect(totalCards).toEqual(30);
  });
});
