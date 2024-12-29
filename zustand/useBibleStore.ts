import { createWithEqualityFn } from "zustand/traditional";
import { persist, createJSONStorage, combine } from "zustand/middleware";
import { deepEqual } from "fast-equals";

/** - 狀態 */
export interface BibleState {
  /** - 書名 */
  book: string;
  /** - 章節 */
  chapter: number;
  /** - 節 */
  verse: number;
}

/** - 預設狀態 */
const initialState: BibleState = {
  book: "",
  chapter: 1,
  verse: 1,
};

/** - 聖經狀態管理 */
const useBibleStore = createWithEqualityFn(
  persist(
    combine(initialState, (set) => ({
      /** - 更新書名、章節、節 */
      setBible(book: string, chapter: number, verse: number) {
        if (book && chapter > 0 && verse > 0) {
          set({ book, chapter, verse });
        }
      },
      /** - 清除狀態 */
      resetBible() {
        set(initialState);
      },
    })),
    {
      name: "@web_bible",
      storage: createJSONStorage(() => localStorage),
    },
  ),
  deepEqual,
);

export default useBibleStore;
