export type Plan = {
  name: string;
  price: number;
  interval: 'month' | 'annual';
  stripePriceId: string;
};

export const plans = {
  applicant: [
    { name: 'Free', price: 0, interval: 'month', stripePriceId: '' },
    { name: 'Pro', price: 49.99, interval: 'month', stripePriceId: 'price_applicant_pro' },
    { name: 'Pro (Annual)', price: 599.99, interval: 'annual', stripePriceId: 'price_applicant_pro_annual' },
  ],
  employer: [
    { name: 'Tier 1', price: 99.99, interval: 'month', stripePriceId: 'price_employer_tier1' },
    { name: 'Tier 2', price: 150, interval: 'month', stripePriceId: 'price_employer_tier2' },
    { name: 'Tier 3', price: 175, interval: 'month', stripePriceId: 'price_employer_tier3' },
    { name: 'Tier 1 (Annual)', price: 1079.88, interval: 'annual', stripePriceId: 'annual_employer_tier1' },
    { name: 'Tier 2 (Annual)', price: 1620, interval: 'annual', stripePriceId: 'annual_employer_tier2' },
    { name: 'Tier 3 (Annual)', price: 1890, interval: 'annual', stripePriceId: 'annual_employer_tier3' },
  ],
} as const;

