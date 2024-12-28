"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";

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
  const chapter = Array.isArray(params.chapter)
    ? params.chapter[0]
    : params.chapter;

  const [currentVerse, setCurrentVerse] = useState(1);

  // const { data, isLoading, refetch } = useQuery<BibleResponse>({
  //   queryKey: ["bibleVerse", book, chapter, currentVerse],
  //   queryFn: () =>
  //     fetchBibleVerse(decodeURI(book), chapter, currentVerse.toString()),
  //   // keepPreviousData: true, // 保留上一個請求的資料，減少跳動
  // });

  const { data, isLoading, refetch, isFetching } = useQuery<BibleResponse>({
    queryKey: ["bibleVerses", book, chapter],
    queryFn: () => fetchBibleVerses(decodeURI(book), currentVerse.toString()),
  });

  // console.log("Book:", decodeURI(book));
  // console.log("chapter:", chapter);
  const handleNext = () => {
    setCurrentVerse((prev) => prev + 1);
    refetch();
  };
  const handlePrevious = () => {
    if (currentVerse > 1) {
      setCurrentVerse((prev) => prev - 1);
      refetch();
    }
  };
  const loadingData = Array(10).fill(undefined);

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {loadingData.map((_, index) => (
            <Skeleton key={index} className="h-[125px] w-[250px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">{data?.reference}</h1>
      <div className="min-h-dvh flex-1 space-y-2">
        <div className="mt-4">
          {data?.verses.map((verse) => (
            <p key={verse.verse}>
              <span className="font-bold">{verse.verse}:</span> {verse.text}
            </p>
          ))}
        </div>
        <p className="mt-4 text-gray-500">
          {data?.translation_name} ({data?.translation_note})
        </p>
      </div>

      <div className="mt-6 flex justify-between space-x-4">
        <button
          onClick={handlePrevious}
          disabled={currentVerse <= 1}
          className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
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
