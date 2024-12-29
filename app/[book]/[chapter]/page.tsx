"use client";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type Checked = DropdownMenuCheckboxItemProps["checked"];
import {
  ArrowBigLeft,
  ArrowBigRight,
  HomeIcon,
  MoreHorizontal,
} from "lucide-react";

//NOTE - Zustand
import useBibleStore from "@/zustand/useBibleStore";
import Link from "next/link";
interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleResponse {
  reference: string;
  verses: Verse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
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
  const { chapter, verse, setBible } = useBibleStore();

  // console.log(chapter, verse);
  const params = useParams();
  const { toast } = useToast();
  const book = Array.isArray(params.book) ? params.book[0] : params.book;

  const initialChapter = chapter || 1;

  const [inputChapter, setInputChapter] = useState<string>("");
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  // useEffect(() => {
  //   if (!chapter || chapter !== currentChapter) {
  //     setBible(book, currentChapter, verse);
  //   }
  // }, [book, currentChapter, chapter, verse, setBible]);

  const { data, isLoading, refetch, isFetching } = useQuery<BibleResponse>({
    queryKey: ["bibleVerses", book, currentChapter],
    queryFn: () =>
      fetchBibleVerses(decodeURI(book!), currentChapter.toString()),
  });

  const handleNext = useCallback(() => {
    setCurrentChapter((prev) => {
      const newChapter = prev + 1;
      setBible(book!, newChapter, verse);
      return newChapter;
    });
  }, [book, verse, setBible]);

  const handlePrevious = useCallback(() => {
    setCurrentChapter((prev) => {
      const newChapter = Math.max(prev - 1, 1); // 避免章節小於 1
      setBible(book!, newChapter, verse);
      return newChapter;
    });
  }, [book, verse, setBible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChapter(e.target.value);
  };

  const handleJumpToChapter = debounce(() => {
    const chapterNumber = parseInt(inputChapter, 10);
    if (!isNaN(chapterNumber) && chapterNumber > 0) {
      setCurrentChapter(chapterNumber);
      setBible(book!, chapterNumber, verse);
      refetch();
    } else {
      toast({
        title: "請輸入有效的章節數！",
        description: "",
      });
    }
  }, 500);

  useEffect(() => {
    refetch();
    setCurrentChapter(chapter);
  }, [currentChapter, refetch, chapter]);

  const loadingData = Array(20).fill(undefined);
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  return (
    <div className="container mx-auto flex flex-col space-y-4 px-4">
      <div className="sticky top-2 flex flex-col backdrop-blur-lg">
        <div className="flex justify-between gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentChapter <= 1 || isLoading || isFetching}
          >
            <ArrowBigLeft />
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
            <ArrowBigRight />
          </button>
        </div>
        <h1 className="mt-2 text-2xl font-bold max-md:text-center">
          {data?.reference}
        </h1>
      </div>

      {isLoading || isFetching ? (
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
      ) : (
        <section className="min-h-dvh flex-1 space-y-2">
          <div className="my-4">
            {data?.verses.map((verse) => (
              <div
                className="my-10 flex justify-between p-5 text-xl xl:text-3xl"
                key={verse.verse}
              >
                <div>
                  <span className="mb-10 font-bold">{verse.verse}. </span>
                  {verse.text}
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        // checked={showStatusBar}
                        onCheckedChange={setShowStatusBar}
                      >
                        珍藏
                      </DropdownMenuCheckboxItem>
                      {/* <DropdownMenuCheckboxItem
                      checked={showActivityBar}
                      onCheckedChange={setShowActivityBar}
                      disabled
                    >
                      Activity Bar
                    </DropdownMenuCheckboxItem> */}
                      {/* <DropdownMenuCheckboxItem
                      checked={showPanel}
                      onCheckedChange={setShowPanel}
                    >
                      Panel
                    </DropdownMenuCheckboxItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-gray-500">
            {data?.translation_name} ({data?.translation_note})
          </p>
        </section>
      )}

      <div className="sticky bottom-0 mt-6 flex justify-between bg-white backdrop-blur-lg">
        <button
          onClick={handlePrevious}
          disabled={currentChapter <= 1 || isLoading || isFetching}
        >
          <ArrowBigLeft />
        </button>
        <div className="flex items-center space-x-2">
          <Link href={"/"}>
            <HomeIcon />
          </Link>
        </div>
        <button
          onClick={handleNext}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <ArrowBigRight />
        </button>
      </div>
    </div>
  );
}
