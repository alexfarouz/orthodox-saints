// data/saints-by-hour.ts
import { DATA, Item } from "./saints";

// Build a lookup by id:
export const byId: Record<string, Item> = Object.fromEntries(
  DATA.map((s) => [s.id, s])
);

// Explicit hour → id list (00:00 through 23:00). Fill with your ids.
// If an id isn't in DATA yet, the helper will auto-cycle as a fallback.
const SAINT_IDS_24: (string | null)[] = [
  "anthony", // 00:00
  "jacob-nisibis", // 01:00
  "athanasius", // 02:00
  "johnc", // 03:00
  "moses", // 04:00
  "ephrem", // 05:00
  "shenouda", // 06:00
  "pachomius", // 07:00
  "isaac", // 08:00
  "gregory", // 09:00
  "arsenius", // 10:00
  "severus", // 11:00
  "agathon", // 12:00
  "jacob-serugh", // 13:00
  "poemen", // 14:00
  "kyrillos", // 15:00
  "shenouda-iii", // 16:00
  "serapion", // 17:00
  "mary-egypt", // 18:00
  "basil", // 19:00
  "sisoes", // 20:00
  "bishoy-kamel", // 21:00
  "pishoy", // 22:00
  "macarius", // 23:00
];

export const SAINT_BY_HOUR: Item[] = (() => {
  const items: Item[] = new Array(24);
  let fallbackIdx = 0;
  for (let h = 0; h < 24; h++) {
    const id = SAINT_IDS_24[h];
    const found = id ? byId[id] : undefined;
    if (found) {
      items[h] = found;
    } else {
      items[h] = DATA[fallbackIdx % DATA.length];
      fallbackIdx++;
    }
  }
  return items;
})();
