import * as fs from 'fs';
import * as readline from 'readline';
import { sumCalibrationValues } from './calibration';
import { EventEmitter } from 'events';

jest.mock('fs');
jest.mock('readline');

describe('sumCalibrationValues', () => {
  it('correctly sums the calibration values', async () => {
    const lines = ['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet'];
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
    const result = await sumCalibrationValues(filePath);
    expect(result).toEqual(142);
  });
});
