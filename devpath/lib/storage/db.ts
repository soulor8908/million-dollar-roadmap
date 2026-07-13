// lib/storage/db.ts
// IndexedDB 最简封装（via idb-keyval）
// 提供泛型 get/set/del/keys 方法

import { get, set, del, keys } from "idb-keyval";

export async function getItem<T>(key: string): Promise<T | undefined> {
  return get<T>(key);
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  return set(key, value);
}

export async function delItem(key: string): Promise<void> {
  return del(key);
}

export async function listKeys(prefix?: string): Promise<string[]> {
  const allKeys = await keys();
  const strKeys = allKeys.filter((k): k is string => typeof k === "string");
  if (prefix) {
    return strKeys.filter((k) => k.startsWith(prefix));
  }
  return strKeys;
}

export async function listItems<T>(prefix: string): Promise<T[]> {
  const matchedKeys = await listKeys(prefix);
  const items = await Promise.all(matchedKeys.map((k) => get<T>(k)));
  return items.filter((item): item is T => item !== undefined);
}
