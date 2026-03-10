export const flowPaths = {
  account: "/setup/account",
  accountOpeningStep1Confirmation: "/account-opening/step1/confirmation",
  accountOpeningStep1DocumentsReview: "/account-opening/step1/documents-review",
  accountOpeningStep1ElectronicDelivery: "/account-opening/step1/electronic-delivery",
  accountOpeningStep1Intro: "/account-opening/step1",
  accountOpeningStep2: "/account-opening/step2",
  applications: "/top/applications",
  customerInfo: "/top/customer-info",
  done: "/setup/done",
  intro: "/intro",
  login: "/login",
  memberRegistrationContact: "/register/member/contact",
  memberRegistrationIdentity: "/register/member/identity",
  memberRegistrationSecurity: "/register/member/security",
  memberRegistrationSent: "/register/member/sent",
  memberRegistrationWelcome: "/register/member",
  portfolioAssets: "/top/assets",
  tradeHistory: "/top/trade-history",
  top: "/top",
  verify: "/setup/verify",
} as const;

export type FlowScreen = keyof typeof flowPaths;

const flowPathEntries = Object.entries(flowPaths) as Array<[FlowScreen, string]>;

export function getFlowScreenFromPathname(pathname: string): FlowScreen | null {
  const matchedEntry = flowPathEntries.find(([, path]) => path === pathname);
  return matchedEntry?.[0] ?? null;
}

export function getPortfolioAssetsPath(tab?: string) {
  return tab
    ? `${flowPaths.portfolioAssets}?tab=${encodeURIComponent(tab)}`
    : flowPaths.portfolioAssets;
}
