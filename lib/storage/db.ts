// lib/storage/db.ts
// IndexedDB 最简封装（via idb-keyval）
// 提供泛型 get/set/del/keys 方法

import { get as idbGet, set as idbSet, del as idbDel, keys as idbKeys } from "idb-keyval";

export async function getItem<T>(key: string): Promise<T | undefined> {
  return idbGet<T>(key);
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  return idbSet(key, value);
}

export async function delItem(key: string): Promise<void> {
  return idbDel(key);
}

export async function listKeys(prefix?: string): Promise<string[]> {
  const allKeys = await idbKeys();
  const strKeys = allKeys.filter((k): k is string => typeof k === "string");
  if (prefix) {
    return strKeys.filter((k) => k.startsWith(prefix));
  }
  return strKeys;
}

export async function listItems<T>(prefix: string): Promise<T[]> {
  const matchedKeys = await listKeys(prefix);
  const items = await Promise.all(matchedKeys.map((k) => getItem<T>(k)));
  return items.filter((item) => item !== undefined) as T[];
}

// 别名：与计划文档代码保持一致（get/set/del/keys/getMany）
export const get = getItem;
export const set = setItem;
export const del = delItem;
export const keys = listKeys;

/** 按显式 key 数组批量取值（过滤 undefined） */
export async function getMany<T>(ks: string[]): Promise<T[]> {
  const items = await Promise.all(ks.map((k) => getItem<T>(k)));
  return items.filter((item) => item !== undefined) as T[];
}
