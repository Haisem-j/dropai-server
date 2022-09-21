export interface User {
  availableTokens: number;
  planType: "Free" | "Standard" | "Unlimited";
  numberOfRequests: number;
}
