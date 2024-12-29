import React from "react";
import { oldTestament } from "@/options/oldTestament";
import { newTestament } from "@/options/newTestament";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="m-auto sm:container">
      <section className="my-8">
        <h1 className="mb-4 text-center text-2xl font-bold">舊約</h1>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {oldTestament.map((book, index) => (
            <li key={index}>
              <a href={`/${book.bookName}/1`}>
                <Button className="min-h-20 w-full text-xl" variant="outline">
                  {book.bookName}
                </Button>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <hr className="m-auto my-3 w-10/12 border border-black" />

      <section className="mt-8">
        <h1 className="mb-4 text-center text-2xl font-bold">新約</h1>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {newTestament.map((book, index) => (
            <li key={index}>
              <a href={`/${book.bookName}/1`}>
                <Button className="min-h-20 w-full text-xl" variant="outline">
                  {book.bookName}
                </Button>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
