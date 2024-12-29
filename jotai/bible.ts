import { atom } from "jotai";

export const bibleAtom = atom({
  book: "",
  chapter: 1,
  verse: 1,
});
