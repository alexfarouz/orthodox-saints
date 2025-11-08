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
  "cyril", // 01:00
  "athanasius", // 02:00
  "johnc", // 03:00
  "moses", // 04:00
  "mina", // 05:00
  "shenouda", // 06:00
  "pachomius", // 07:00
  "diouscorus", // 08:00
  "gregory", // 09:00
  "maximus-and-dometius", // 10:00
  "severus", // 11:00
  "tekle", // 12:00
  "mark", // 13:00
  "gregory-armenian", // 14:00
  "kyrillos", // 15:00
  "shenouda-iii", // 16:00
  "reweis", // 17:00
  "john-short", // 18:00
  "macarius", // 19:00
  "habib", // 20:00
  "mina-abood", // 21:00
  "bishoy-kamel", // 22:00
  "pishoy", // 23:00
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
