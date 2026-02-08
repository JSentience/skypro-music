import { formatTime, getTimePanel } from './helper';

describe('formatTime', () => {
  it('правильное форматирование времени', () => {
    expect(formatTime(125)).toBe('02:05');
  });
  it('добавление нуля перед однозначными числами', () => {
    expect(formatTime(69)).toBe('01:09');
  });
});

describe('getTimePanel', () => {
  it('правильное отображение текущего и общего времени', () => {
    expect(getTimePanel(125, 300)).toBe('02:05 / 05:00');
  });
});
