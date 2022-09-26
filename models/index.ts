export interface User {
  availableTokens: number;
  planType: "Free" | "Standard" | "Unlimited";
  numberOfRequests: number;
  paymentId?: string;
}

export const getDefaultUser = () => {
  const u: User = {
    availableTokens: 300,
    planType: "Free",
    numberOfRequests: 0,
  };
  return u;
};
