"use client";

import Image from "next/image";
import React from "react";
import { IMAGE_PRELOAD, IMAGE_SIZES } from "@/constants";

interface ImageCardProps {
  id: string;
  download_url: string;
}

const ImageCard = (props: ImageCardProps) => {
  const { id, download_url } = props;

  return (
    <Image
      alt={id}
      blurDataURL={IMAGE_PRELOAD}
      fill
      loading="lazy"
      placeholder="blur"
      sizes={IMAGE_SIZES}
      src={download_url}
    />
  );
};

export default ImageCard;
