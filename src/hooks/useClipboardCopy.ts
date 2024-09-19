import toast from "react-hot-toast";

export default function useCopy() {

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  return copy;
}