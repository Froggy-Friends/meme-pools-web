"use client";

import { useState } from "react";
import CollectionInfo from "./CollectionInfo";
import CreateMemePost from "./CreateMemePost";
import { Token } from "@prisma/client";

type InfoAndPostContainerProps = {
  token: Token;
};

export default function InfoAndPostContainer({ token }: InfoAndPostContainerProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section>
      <CollectionInfo token={token} setIsVisible={setIsVisible} />
      <CreateMemePost isVisible={isVisible} setIsVisible={setIsVisible} token={token} />
    </section>
  );
}
