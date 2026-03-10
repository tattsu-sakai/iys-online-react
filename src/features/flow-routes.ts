export type FlowAccess = 'authenticated' | 'public' | 'verified';

type FlowRouteMeta = {
  access: FlowAccess;
  path: string;
};

export const flowRouteMeta = {
  account: { access: 'public', path: '/setup/account' },
  accountOpeningStep1Confirmation: { access: 'authenticated', path: '/account-opening/step1/confirmation' },
  accountOpeningStep1DocumentsReview: { access: 'authenticated', path: '/account-opening/step1/documents-review' },
  accountOpeningStep1ElectronicDelivery: { access: 'authenticated', path: '/account-opening/step1/electronic-delivery' },
  accountOpeningStep1Intro: { access: 'authenticated', path: '/account-opening/step1' },
  accountOpeningStep2: { access: 'authenticated', path: '/account-opening/step2' },
  applications: { access: 'authenticated', path: '/top/applications' },
  customerInfo: { access: 'authenticated', path: '/top/customer-info' },
  customerInfoAddressChange: { access: 'authenticated', path: '/top/customer-info/address-change' },
  customerInfoBankChange: { access: 'verified', path: '/top/customer-info/bank-change' },
  customerInfoIdentityVerification: { access: 'authenticated', path: '/top/customer-info/identity-verification' },
  customerInfoNameChange: { access: 'authenticated', path: '/top/customer-info/name-change' },
  done: { access: 'public', path: '/setup/done' },
  intro: { access: 'public', path: '/intro' },
  login: { access: 'public', path: '/login' },
  memberRegistrationContact: { access: 'public', path: '/register/member/contact' },
  memberRegistrationIdentity: { access: 'public', path: '/register/member/identity' },
  memberRegistrationSecurity: { access: 'public', path: '/register/member/security' },
  memberRegistrationSent: { access: 'public', path: '/register/member/sent' },
  memberRegistrationWelcome: { access: 'public', path: '/register/member' },
  portfolioAssets: { access: 'authenticated', path: '/top/assets' },
  top: { access: 'authenticated', path: '/top' },
  tradeHistory: { access: 'authenticated', path: '/top/trade-history' },
  verify: { access: 'public', path: '/setup/verify' },
} as const satisfies Record<string, FlowRouteMeta>;

export type FlowScreen = keyof typeof flowRouteMeta;

export const flowPaths = Object.fromEntries(
  Object.entries(flowRouteMeta).map(([screen, meta]) => [screen, meta.path]),
) as Record<FlowScreen, string>;

const flowPathEntries = Object.entries(flowPaths) as Array<[FlowScreen, string]>;

export function getFlowScreenFromPathname(pathname: string): FlowScreen | null {
  const matchedEntry = flowPathEntries.find(([, path]) => path === pathname);
  return matchedEntry?.[0] ?? null;
}

export function getFlowAccess(screen: FlowScreen) {
  return flowRouteMeta[screen].access;
}

export function getPortfolioAssetsPath(tab?: string) {
  return tab
    ? `${flowPaths.portfolioAssets}?tab=${encodeURIComponent(tab)}`
    : flowPaths.portfolioAssets;
}
