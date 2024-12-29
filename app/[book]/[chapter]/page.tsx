"use client";
import { useParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Verse {
  book_id: string; // 書卷 ID，例如 "JHN"
  book_name: string; // 書卷名稱，例如 "約翰福音"
  chapter: number; // 章節編號
  verse: number; // 經文編號
  text: string; // 經文內容
}

// 回傳的資料結構型別
interface BibleResponse {
  reference: string; // 經文參考，例如 "約翰福音 3:16"
  verses: Verse[]; // 經文陣列
  text: string; // 總經文內容
  translation_id: string; // 翻譯 ID，例如 "cuv"
  translation_name: string; // 翻譯名稱，例如 "Chinese Union Version"
  translation_note: string; // 翻譯註記，例如 "Public Domain"
}

// async function fetchBibleVerse(
//   book: string,
//   chapter: string,
//   verse: string,
// ): Promise<BibleResponse> {
//   const { data } = await axios.get(
//     `https://bible-api.com/${book}+${chapter}:${verse}?translation=cuv`,
//   );
//   return data;
// }

async function fetchBibleVerses(
  book: string,
  chapter: string,
): Promise<BibleResponse> {
  const { data } = await axios.get(
    `https://bible-api.com/${book}+${chapter}?translation=cuv`,
  );
  return data;
}

export default function Page() {
  const params = useParams();
  const book = Array.isArray(params.book) ? params.book[0] : params.book;
  const [inputChapter, setInputChapter] = useState<string>("");
  const [currentChapter, setCurrentChapter] = useState(
    Array.isArray(params.chapter)
      ? parseInt(params.chapter[0])
      : parseInt(params.chapter),
  );
  const { data, isLoading, refetch, isFetching } = useQuery<BibleResponse>({
    queryKey: ["bibleVerses", book, currentChapter],
    queryFn: () => fetchBibleVerses(decodeURI(book), currentChapter.toString()),
  });

  const handleNext = useCallback(() => {
    setCurrentChapter((prev) => prev + 1);
    refetch();
  }, [refetch, setCurrentChapter]);

  const handlePrevious = useCallback(() => {
    setCurrentChapter((prev) => prev - 1);
    refetch();
  }, [refetch, setCurrentChapter]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChapter(e.target.value);
  };

  const handleJumpToChapter = () => {
    const chapterNumber = parseInt(inputChapter);
    if (!isNaN(chapterNumber) && chapterNumber > 0) {
      setCurrentChapter(chapterNumber);
      refetch();
    } else {
      alert("請輸入有效的章節數！");
    }
  };
  const loadingData = Array(20).fill(undefined);

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-10 h-10">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {loadingData.map((_, index) => (
            <div key={index} className="h-5">
              <Skeleton className="h-5 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col space-y-4 p-4">
      <div className="mt-6 flex justify-between">
        <button onClick={handlePrevious} disabled={currentChapter <= 1}>
          Previous
        </button>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={inputChapter}
            onChange={handleInputChange}
            placeholder="輸入章節"
            className="rounded-lg border"
          />
          <Button onClick={handleJumpToChapter}>跳轉</Button>
        </div>
        <button
          onClick={handleNext}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Next
        </button>
      </div>
      <h1 className="text-2xl font-bold">{data?.reference}</h1>
      <section className="min-h-dvh flex-1 space-y-2">
        <div className="my-4">
          {data?.verses.map((verse) => (
            <>
              <div className="my-10 p-5" key={verse.verse}>
                <span className="mb-10 font-bold">{verse.verse}</span>
                {verse.text}
              </div>
              <hr />
            </>
          ))}
        </div>
        <p className="mt-4 text-gray-500">
          {data?.translation_name} ({data?.translation_note})
        </p>
      </section>

      <div className="mt-6 flex justify-between">
        <button onClick={handlePrevious} disabled={currentChapter <= 1}>
          Previous
        </button>
        <div className="flex items-center">
          <Input
            type="number"
            value={inputChapter}
            onChange={handleInputChange}
            placeholder="輸入章節"
            className="rounded-lg border"
          />

          <Button onClick={handleJumpToChapter}>跳轉</Button>
        </div>
        <button
          onClick={handleNext}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
