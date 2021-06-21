import { QuerySelector } from 'mongodb';

function sanitizeRegexpInput(value: string) {
  return value.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
}

export function caseInsensitive(value: string): QuerySelector<string> {
  return { $regex: `^${sanitizeRegexpInput(value)}$`, $options: 'i' };
}
