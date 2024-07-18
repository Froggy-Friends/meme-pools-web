import { launchCoin } from "@/lib/actions";

export default function LaunchCoinForm() {
  return (
    <section className="w-[400px] mx-auto">
      <h1 className="mx-auto text-2xl mb-6">Launch a New Coin</h1>

      <form action={launchCoin} className="flex flex-col">
        <label htmlFor="name" className="mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <label htmlFor="ticker" className="mb-1">
          Ticker
        </label>
        <input
          id="ticker"
          name="ticker"
          type="text"
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <label htmlFor="description" className="mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="ring-1 ring-black p-2 rounded-md mb-2 h-32"
          required
        />

        <label htmlFor="image" className="mb-1">
          Image
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <label htmlFor="twitter" className="mb-1">
          Twitter link
        </label>
        <input
          id="twitter"
          name="twitter"
          type="url"
          pattern="https://x.com/*"
          placeholder="optional.."
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <label htmlFor="twitter" className="mb-1">
          Telegram link
        </label>
        <input
          id="telegram"
          name="telegram"
          type="text"
          placeholder="optional.."
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <label htmlFor="website" className="mb-1">
          Website
        </label>
        <input
          id="website"
          name="website"
          type="url"
          pattern="https://.*"
          placeholder="optional.."
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <button
          type="submit"
          className="p-2 mt-2 border-[1px] border-black rounded-lg"
        >
          Launch coin
        </button>
      </form>
    </section>
  );
}
