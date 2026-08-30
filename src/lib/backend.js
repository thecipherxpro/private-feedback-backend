import { base44 } from '@/api/base44Client';

export async function api(action, payload = {}) {
  const result = await base44.functions.invoke('app-api', { action, ...payload });
  return result?.data ?? result;
}

export const categories = [
  'Hygiene','Dating','Friendship','Workplace','Neighbour','Habit',
  'Communication','Appearance/style','Appreciation','Apology','Something difficult to say'
];