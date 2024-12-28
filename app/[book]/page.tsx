"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const { book, chapter } = useParams();

  console.log("Book:", book);
  console.log("Chapter:", chapter);

  return <div></div>;
}
