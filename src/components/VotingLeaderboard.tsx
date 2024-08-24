import Image from "next/image";
import goldMedal from "../../public/gold-medal.svg";
import silverMedal from "../../public/silver-medal.svg";
import bronzeMedal from "../../public/bronze-medal.svg";
import { PiArrowFatUpFill } from "react-icons/pi";
import { fetchTopVotesTokens } from "@/queries/token/queries";
import SeeAllButton from "./SeeAllButton";

export default async function VotingLeaderboard() {
  const tokens = await fetchTopVotesTokens();

  return (
    <section className="w-[400px] h-72 flex flex-col p-5 rounded-lg bg-dark-gray">
      <h3 className="text-2xl font-proximaSoftBold pb-6">Voting Leaderboard</h3>

      {tokens.map((token, index) => {
        return (
          <div
            className="flex items-center justify-between mb-6"
            key={token.id}
          >
            <div className="flex items-center">
              <Image
                src={
                  index === 0
                    ? goldMedal
                    : index === 1
                    ? silverMedal
                    : bronzeMedal
                }
                alt="gold-medal"
                height={35}
                width={35}
                className="mr-4"
              />

              <Image
                src={token.image}
                alt="profile-image"
                height={35}
                width={35}
                className="rounded-lg mr-2"
              />

              <p className="text-lg">${token.ticker}</p>
            </div>

            <div className="flex items-center gap-x-1">
              <PiArrowFatUpFill size={25} />
              <p>{token.votes.upVotes}</p>
            </div>
          </div>
        );
      })}

      <SeeAllButton />
    </section>
  );
}
