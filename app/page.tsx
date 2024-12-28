import React from "react";
import { oldTestament } from "@/options/oldTestament";
import { newTestament } from "@/options/newTestament";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="container m-auto">
      <section className="mt-8">
        <h1>舊約</h1>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {oldTestament.map((book, index) => (
            <li key={index}>
              <a href={`/${book.bookName}/1`}>
                <Button className="w-full" variant="outline">
                  {book.bookName}
                </Button>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h1>新約</h1>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {newTestament.map((book, index) => (
            <li key={index}>
              <a href={`/${book.bookName}/1`}>
                <Button className="w-full" variant="outline">
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
