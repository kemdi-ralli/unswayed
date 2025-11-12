import { plans } from "@/lib/plan";
import Link from "next/link";

type Props = { params: { planType: string } };

export default function PlanPage({ params }: Props) {
  const planType = params.planType as keyof typeof plans;
  const selectedPlans = plans[planType];

  if (!selectedPlans) return <div>Plan type not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold capitalize mb-6">{planType} Plans</h1>
      <div className="grid gap-4">
        {selectedPlans.map((plan) => (
          <div key={plan.name} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-lg">${plan.price}{plan.price > 0 && "/month"}</p>

            {plan.price > 0 ? (
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="priceId" value={plan.stripePriceId} />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded mt-2"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <Link
                href="/signup"
                className="inline-block bg-gray-200 px-4 py-2 rounded mt-2"
              >
                Get Started
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
