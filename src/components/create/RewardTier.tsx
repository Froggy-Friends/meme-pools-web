type RewardTierProps = {
  tier: string;
  rewardAmount: number;
};

export default function RewardTier({ tier, rewardAmount }: RewardTierProps) {
  return (
    <div className="flex flex-col gap-y-1 items-center">
      <p className="text-sm">{tier === "bronze" ? "BRONZE" : tier === "silver" ? "SILVER" : "GOLD"}</p>
      <p className={`rounded-3xl px-2 py-1 text-dark w-20 text-center font-bold ${tier === "bronze" ? "bg-bronze" : tier === "silver" ? "bg-light-gray" : "bg-gold"}`}>
        ${rewardAmount}
      </p>
      <p className="text-xs">{tier === "bronze" ? "*All users" : tier === "silver" ? "*1 Frog" : "*5 Frogs"}</p>
    </div>
  );
}
