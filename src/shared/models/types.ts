// import { Request } from 'express';
import { PromiEvent, TransactionReceipt } from 'web3-core';

/******* Add New Supported Chains and Networks into BaseBlockChain and FaucetRequestNetwork ********/
export enum FaucetRequestNetwork {
  RINKEBY = 'rinkeby',
  GOERLI = 'goerli',
  MUMBAI = 'mumbai',
  KILN = 'kiln',
  SEPOLIA = 'sepolia',
}

export enum BaseBlockChain {
  ETH = 'eth',
  MATIC = 'matic',
}
/******* END ********/

export type FaucetChainNetworkKey =
  | `${BaseBlockChain}_${FaucetRequestNetwork}`
  | 'ALL';

/* Please DO NOT Add any optional parameters into this data structure */
export interface FaucetRequestNetworkInfo {
  network: FaucetRequestNetwork;
  chain: BaseBlockChain;
}

export interface FaucetAppNetworkInfo {
  networkInfo: FaucetRequestNetworkInfo;
  networkDisplayName: string;
  transactionUrl: string;
  reserveWalletAddress: string;
  affiliateReferral: string;
  domain: string;
  tokenName: string;
  fullTokenName: string;
  chainName: string;
  url: string;
  requiresAuthentication: boolean;
  // TOOD (Kurush) Move the flags that can be constant to ENUMs
  requiresOnboarding: boolean;
  authDripAmount: string;
  nonAuthDripAmount: string;
  gaMeasurementId: string;
  recaptchaClientKey: string;
  recaptchaClientType: RecaptchaClientType;
  bannerMessage: string;
}

export enum Env {
  DEV = 'dev',
  STAGING = 'stg',
  PROD = 'prod',
}

export enum FaucetReservesLevel {
  AVAILABLE = 'available',
  BUFFER_PASSED = 'buffer',
  LOW_RESERVES = 'low_reserves',
  EMPTY = 'empty',
}

export enum FaucetInvalidRequestType {
  INVALID_SMART_CONTRACT_ADDRESS = 'InvalidSmartContractAddress',
  INVALID_WALLET_ADDRESS = 'InvalidWalletAddress',
}

/* START API DATA STRUCTURES */
export enum FaucetResponseStatus {
  ERROR = 'error',
  SUCCESS = 'success',
}

/* FAUCET REQUEST DATA STRUCTURES */
export interface FaucetRequestParams {
  networkInfo: FaucetRequestNetworkInfo;
  toAddress: string;
  clientRequestId: string;
  reCAPTCHAValue: string;
  alchemyUserId: string;
}

export type PossibleFaucetRequest = Request<
  unknown,
  unknown,
  FaucetRequestParams
>;

export interface FaucetRequestData {
  networkInfo: FaucetRequestNetworkInfo;
  toAddress: string;
  resolvedToAddress: string;
  ipAddress: string;
  clientRequestId: string;
  requestId: string;
  reCAPTCHAValue: string;
  isAuthed: boolean;
  authchemyUserId: number;
}

export interface FaucetRequestDrip {
  amount: string;
  displayAmount: string;
}

export interface FaucetRateLimitData {
  toAddress: string;
  ipAddress: string;
}

export interface FaucetRequestErrorResponse {
  networkInfo: FaucetRequestNetworkInfo;
  toAddress: string;
  resolvedToAddress: string;
  message: string;
  code: number;
  responseStatus: FaucetResponseStatus.ERROR;
  dangerous_htmlString?: string;
}

export interface FaucetRequestSuccessResponse {
  networkInfo: FaucetRequestNetworkInfo;
  toAddress: string;
  resolvedToAddress: string;
  dripAmount: FaucetRequestDrip;
  responseStatus: FaucetResponseStatus.SUCCESS;
  requestId: string;
  transactionHash: string;
  transactionURL: string;
}

export type FaucetRequestResponse =
  | FaucetRequestSuccessResponse
  | FaucetRequestErrorResponse;

export interface FaucetClientServerData {
  RECAPTCHA_CLIENT_KEY: string;
  RECAPTCHA_CLIENT_TYPE: RecaptchaClientType;
  API_SERVER_URL: string;
  AUTH_URL: string;
  ONBOARDING_URL: string;
  APP_NETWORK_INFO: FaucetAppNetworkInfo;
}

/* FAUCET CONFIGURATION & FEATURE GATE DATA OBJECTS */
export enum FaucetFeatureConditionGate {
  ALLOW = 'allow',
  DENY = 'deny',
}

export enum FaucetFeatureConditionType {
  WALLET_ADDRESS_LIST = 'walletAddressList',
  STATIC = 'static',
  IP_ADDRESS_LIST = 'ipAddressList',
}

/* Please DO NOT Add any optional parameters into this data srcuture */
export interface FaucetFeatureConditionWalletAddressList {
  gate: FaucetFeatureConditionGate;
  type: FaucetFeatureConditionType.WALLET_ADDRESS_LIST;
  value: string[];
}
/* Please DO NOT Add any optional parameters into this data srcuture */
export interface FaucetFeatureConditionIPAddressList {
  gate: FaucetFeatureConditionGate;
  type: FaucetFeatureConditionType.IP_ADDRESS_LIST;
  value: string[];
}

/* Please DO NOT Add any optional parameters into this data structure */
export interface FaucetFeatureConditionStatic {
  gate: FaucetFeatureConditionGate;
  type: FaucetFeatureConditionType.STATIC;
  value: null;
}

export type FaucetFeatureCondition =
  | FaucetFeatureConditionWalletAddressList
  | FaucetFeatureConditionStatic
  | FaucetFeatureConditionIPAddressList;

/* Please DO NOT Add any optional parameters into this data structure */
export interface FaucetConfig {
  supportedChainNetworks: FaucetRequestNetworkInfo[];
  serverConfigs: FaucetServerConfigs;
  networkConfigs: FaucetNetworkConfig[];
  featureGates: {
    [key: string]: FaucetFeatureCondition[];
  };
}

/* Please DO NOT Add any optional parameters into this data structure */

export interface FaucetNetworkConfig {
  network: string;
  chain: BaseBlockChain;
  apiUrlKey: string;
  mainnetApiUrlKey: string;
  shouldENSOnTestnet: boolean;
  shouldENSOnMainnet: boolean;
  transactionUrl: string;
  frontendConfig: FaucetNetworkFrontendConfig;
  requiresAuthentication: boolean;
  requiresOnboarding: boolean;
  rateLimitDurationSeconds: number;
  gasMultiplier: number;
  gasPriceMultiplier: number;
  dripValue: FaucetRequestDrip;
  authDripValue: FaucetRequestDrip;
  walletCredentials: WalletCredentials[];
  reserveLevels: ReserveLevels;
  maxIPAddressAttemptsAllowed: FaucetMaxIPAddressAttemptsAllowed;
  authchemyUserAttemptsAllowed: FaucetAuthchemyUserAttemptsAllowed;
}

export interface FaucetMaxIPAddressAttemptsAllowed {
  nonAuth: number;
  freeAccount: number;
  paidAccount: number;
}

export interface FaucetAuthchemyUserAttemptsAllowed {
  freeAccount: number;
  paidAccount: number;
}

export enum RecaptchaClientType {
  INVISIBLE = 'invisible',
  NORMAL = 'normal',
}

export interface FaucetNetworkFrontendConfig {
  reserveWalletAddress: string;
  affiliateReferral: string;
  displayName: string;
  domain: string;
  tokenName: string;
  fullTokenName: string;
  chainName: string;
  url: string;
  gaMeasurementId: string;
  bannerMessage: string;
  recaptchaClientType: RecaptchaClientType;
}

export interface WalletCredentials {
  address: string;
  privateKey: string;
}

export interface ReserveLevels {
  available: number;
  buffer: number;
  lowReserve: number;
  empty: number;
}

/* FAUCET TRANSFER STATUS REQUEST DATA STRUCTURES */

/**
 * Status meanings:
 * SUBMITTED - When a request is submitted to sqs, but yet to be processed
 * PROCESSING - When a txn hash is received from web3.sendSignedTransaction, network is indexing and mining the transaction
 * COMPLETED - When a confirmation is received for the txn hash, which means the txn is mined
 * FAILED - When processing the txn request failed
 * UNKNOWN - When the txn request cannot be found or the status is missing
 */
export enum FaucetTxnStatus {
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  UNKNOWN = 'unknown',
}

export interface FaucetTransferTxnSubmitted {
  requestId: string;
  toAddress: string;
  status: FaucetTxnStatus.SUBMITTED;
}

export interface FaucetTransferTxnProcessing {
  requestId: string;
  toAddress: string;
  txnHash: string;
  status: FaucetTxnStatus.PROCESSING;
}

export interface FaucetTransferTxnCompleted {
  requestId: string;
  toAddress: string;
  txnHash: string;
  status: FaucetTxnStatus.COMPLETED;
}

export interface FaucetTransferTxnFailed {
  requestId: string;
  toAddress: string;
  message: string;
  status: FaucetTxnStatus.FAILED;
}

export interface FaucetTransferTxnUnknown {
  requestId: string;
  message: string;
  status: FaucetTxnStatus.UNKNOWN;
}

export type FaucetTransferTxn =
  | FaucetTransferTxnSubmitted
  | FaucetTransferTxnProcessing
  | FaucetTransferTxnCompleted
  | FaucetTransferTxnFailed
  | FaucetTransferTxnUnknown;

export interface FaucetTransferTxnsRequestResponseSuccess {
  status: FaucetResponseStatus.SUCCESS;
  data: {
    [key: string]: FaucetTransferTxn;
  };
}

export interface FaucetTransferTxnsRequestResponseFailed {
  status: FaucetResponseStatus.ERROR;
  message: string;
}

export type FaucetTransferTxnsRequestResponse =
  | FaucetTransferTxnsRequestResponseSuccess
  | FaucetTransferTxnsRequestResponseFailed;

export interface FaucetTransferTxnsRequestParams {
  networkInfo: FaucetRequestNetworkInfo;
  requestIds: string[];
}

export type PossibleFaucetTransferTxnsRequest = Request<
  unknown,
  unknown,
  FaucetTransferTxnsRequestParams
>;

export interface FaucetSendTransactionResponse {
  transactionHash: string;
  txnEvtEmitter: PromiEvent<TransactionReceipt>;
}

/* Please DO NOT Add any optional parameters into this data structure */
export interface FaucetServerConfigs {
  sqsEnabled: boolean;
  allowedCorsDomains: string[];
  fallbackFaucet: string;
  recaptchaKeyMap: { [key in RecaptchaClientType]: string };
}

export type AuthchemyUser = {
  id: number;
  extId: string;
  email: string;
  firstName: string;
  lastName: string;
  teamId: number | undefined;
  isActive: boolean;
  isStaff: boolean;
  isBillingAdmin: boolean;
  role: string;
  telegramUsername: string;
  discordUsername: string;
  hasJoinedDiscord: boolean;
  lastActive: string | undefined;
  createdAt: string;
};

export type AuthedUser = {
  id: number;
  extId: string;
  teamId?: number;
  email: string;
  isStaff: boolean;
  firstName: string;
  lastName: string;
  type: 'AuthedUser';
};

export type AuthedUserError = {
  expired: boolean;
  message: string;
  type: 'AuthedUserError';
};

//imply is using snake case
export interface FaucetImplyEntity {
  network: FaucetRequestNetwork;
  chain: BaseBlockChain;
  to_address: string;
  resolved_to_address: string;
  drip_amount: string;
  response_status: FaucetResponseStatus;
  transaction_hash: string;
  http_status_code: number;
  ip_address: string;
  finger_print_id: string;
  server_request_id: string;
  client_request_id: string;
  is_authed: boolean;
  timestamp: number;
}
