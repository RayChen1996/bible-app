"use client";
import { useParams } from "next/navigation";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
// import { useAxios } from "@/provider/TanStack";
// async function fetchBooks() {
//   const axios = useAxios();
//   const { data } = await axios.get("/約翰福音");
//   return data;
// }
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

  const { data, isLoading } = useQuery<BibleResponse>({
    queryKey: ["bibleVerses", book, chapter],
    queryFn: () => fetchBibleVerses(decodeURI(book), chapter),
  });

  // console.log("Book:", decodeURI(book));
  // console.log("chapter:", chapter);

  const loadingData = Array(10).fill(undefined);

  if (isLoading) {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{data?.reference}</h1>
      <div className="mt-4 space-y-2">
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
  );
}
