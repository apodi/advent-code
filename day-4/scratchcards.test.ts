import * as fs from 'fs';
import * as readline from 'readline';
import { calculateTotalPoints } from './scratchcards';
import { EventEmitter } from 'events';

jest.mock('fs');
jest.mock('readline');

describe('calculateTotalPoints', () => {
  it('correctly calculates total points from scratchcards', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const lines = [
      '41 48 83 86 17 | 83 86 6 31 17 9 48 53',
      '13 32 20 16 61 | 61 30 68 82 17 32 24 19',
      '1 21 53 59 44 | 69 82 63 72 16 21 14 1',
      '41 92 73 84 69 | 59 84 76 51 58 5 54 83',
      '87 83 26 28 32 | 88 30 70 12 93 22 82 36',
      '31 18 13 56 72 | 74 77 10 23 35 67 36 11'
    ];
    const mockStream = new EventEmitter(); // Using EventEmitter to simulate the stream

    // Mock readline.createInterface to simulate readline behavior
    (readline.createInterface as jest.Mock).mockImplementation(() => ({
      [Symbol.asyncIterator]() {
        let i = 0;
        return {
          next: () => Promise.resolve(i < lines.length ?
            { value: lines[i++], done: false } :
            { value: null, done: true })
        };
      },
      close: jest.fn(),
      on: (event: string, listener: (...args: any[]) => void) => mockStream.on(event, listener),
      emit: (event: string, data?: any) => mockStream.emit(event, data)
    }));

    jest.spyOn(fs, 'createReadStream').mockReturnValue(mockStream as any);

    const filePath = 'fakepath.txt';
    const totalPoints = await calculateTotalPoints(filePath);
    expect(totalPoints).toEqual(13);
    consoleSpy.mockRestore();
  });
})
