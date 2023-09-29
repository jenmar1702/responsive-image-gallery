"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { DESCRIPTION, LIMIT, TITLE } from "@/constants";
import ImageCard from "@/components/image-card";

type PicsumPhoto = Readonly<{
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}>;

export default function Home() {
  const bottomRef = useRef<HTMLImageElement>(null);

  const getImages = async (page: number) => {
    const response = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=${LIMIT}`
    );
    return response.json();
  };

  const { data, isSuccess, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["picsumphoto"],
    ({ pageParam = 1 }) => getImages(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        return nextPage;
      },
    }
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [bottomRef, hasNextPage, fetchNextPage]);

  return (
    <>
      <div>
        <h1>{TITLE}</h1>
        <h2>{DESCRIPTION}</h2>
      </div>
      <div className={styles.grid}>
        {isSuccess &&
          data.pages.map((page: PicsumPhoto[]) =>
            page.map((img: PicsumPhoto, i: number) => {
              return (
                <div key={img.id}>
                  <ImageCard
                    id={img.id}
                    download_url={img.download_url}
                  />
                </div>
              );
            })
          )}
        <div ref={bottomRef}></div>
      </div>
    </>
  );
}
