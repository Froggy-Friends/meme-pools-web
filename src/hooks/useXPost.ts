
export default function useXPost() {

  const post = (text: string) => {
    const url = new URL("https://x.com/intent/post");
    url.searchParams.append("text", text);
    window.open(url, "_blank");
  }

  return post;
}