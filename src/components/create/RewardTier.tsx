type RewardTierProps = {
  tier: string;
};

export default function RewardTier({ tier }: RewardTierProps) {
  return (
    <div className="flex flex-col gap-y-1 items-center">
      <p className="text-sm">{tier === "bronze" ? "BRONZE" : tier === "silver" ? "SILVER" : "GOLD"}</p>
      <p className="bg-green rounded-xl px-2 py-1 text-dark w-20 text-center font-bold">
        {tier === "bronze" ? "$500" : tier === "silver" ? "$1000" : "$1500"}
      </p>
      <p className={`${tier === "gold" ? "text-gold" : "text-white"} text-xs`}>{tier === "bronze" ? "*All users" : tier === "silver" ? "*1 Frog" : "*5 Frogs"}</p>
    </div>
  );
}
