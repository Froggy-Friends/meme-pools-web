"use client";

import { IoCloseCircle } from "react-icons/io5";
import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import { addMeme, addPost } from "@/actions/memepool/actions";
import { toast } from "react-hot-toast";
import FormSubmitButton from "../FormSubmitButton";
import { useRouter } from "next/navigation";

type CreateMemePostProps = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  tokenId: string;
};

export default function CreateMemePost({ isVisible, setIsVisible, tokenId }: CreateMemePostProps) {
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useUser();
  const router = useRouter();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    setImages(prev => [...prev, ...files]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"));
    setImages(prev => [...prev, ...files]);
  };

  const handlePostMemes = async () => {
    if (images.length === 0) return;

    const post = await addPost(tokenId, currentUser?.id);
    if (!post) {
      toast.error("Failed to create post");
      return;
    }

    await Promise.all(
      images.map(async img => {
        const formData = new FormData();
        formData.append("image", img);
        await addMeme(tokenId, currentUser?.id, formData, post.id);
      })
    );

    setImages([]);
    toast.success("Memes posted successfully");
    router.refresh();
  };

  return (
    <>
      {isVisible && (
        <form
          className="w-full flex flex-col bg-dark-gray rounded-xl p-4 laptop:p-6 mt-12"
          action={async () => {
            await handlePostMemes();
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-2xl">Post your memes</p>
            <button onClick={() => setIsVisible(false)}>
              <IoCloseCircle className="text-cream/75 h-6 w-6 hover:text-cream active:scale-[0.98] transition" />
            </button>
          </div>

          <div
            className="flex-1 my-4 border-2 border-dashed border-cream/30 rounded-xl flex flex-col items-center justify-center min-h-[155px] tablet:min-h-[290px] laptop:min-h-[345px] desktop:min-h-[275px]"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileInput}
            />

            {images.length === 0 ? (
              <p
                onClick={() => fileInputRef.current?.click()}
                className="text-cream/75 hover:text-cream hover:cursor-pointer"
              >
                Click or Drag Images Here
              </p>
            ) : (
              <div
                className="grid grid-cols-5 gap-1 p-1 tablet:p-2 w-full h-full hover:cursor-pointer"
                style={{ gridTemplateRows: "repeat(2, 1fr)" }}
                onClick={() => fileInputRef.current?.click()}
              >
                {images.slice(0, 10).map((img, i) => (
                  <div key={i} className="relative pt-[100%]">
                    <div className="absolute inset-0">
                      <Image
                        src={URL.createObjectURL(img)}
                        alt={`Upload ${i + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 33vw, 20vw"
                      />
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setImages(prev => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <IoCloseCircle className="w-5 h-5 text-cream/75 hover:text-cream" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormSubmitButton
            disabled={images.length === 0}
            pendingText="Posting..."
            className="bg-primary text-black font-proximaNovaBold px-8 py-1 rounded-xl mx-auto mt-auto hover:bg-light-primary disabled:bg-gray active:scale-[0.98] transition"
          >
            Post Memes
          </FormSubmitButton>
        </form>
      )}
    </>
  );
}
