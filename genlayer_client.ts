// Real GenLayer Client Integration for AgentCourt Protocol
// Requires: npm install genlayer-js

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

/**
 * Creates a GenLayer client instance connected to StudioNet/Testnet
 * with an optional signer account or browser wallet provider.
 */
export function getClient(accountAddress?: string) {
  return createClient({
    chain: studionet,
    account: accountAddress ? (accountAddress as `0x${string}`) : undefined,
  });
}

export async function createCase(
  contractAddress: string,
  accountAddress: string,
  caseId: string,
  agreementJson: string,
  provider: string
) {
  const client = getClient(accountAddress);
  const txHash = await client.writeContract({
    address: contractAddress as `0x${string}`,
    functionName: "create_case",
    args: [caseId, agreementJson, provider],
  });
  return await client.waitForTransactionReceipt({
    hash: txHash,
    waitUntil: "finalized",
  });
}

export async function fundCase(
  contractAddress: string,
  accountAddress: string,
  caseId: string,
  amountWei: bigint
) {
  const client = getClient(accountAddress);
  // Sends actual native GEN tokens into the contract's payable escrow
  const txHash = await client.writeContract({
    address: contractAddress as `0x${string}`,
    functionName: "fund_case",
    args: [caseId],
    value: amountWei,
  });
  return await client.waitForTransactionReceipt({
    hash: txHash,
    waitUntil: "finalized",
  });
}

export async function submitDelivery(
  contractAddress: string,
  accountAddress: string,
  caseId: string,
  evidencePackageJson: string
) {
  const client = getClient(accountAddress);
  const txHash = await client.writeContract({
    address: contractAddress as `0x${string}`,
    functionName: "submit_delivery",
    args: [caseId, evidencePackageJson],
  });
  return await client.waitForTransactionReceipt({
    hash: txHash,
    waitUntil: "finalized",
  });
}

export async function requestAdjudication(
  contractAddress: string,
  accountAddress: string,
  caseId: string,
  webUrl: string
) {
  const client = getClient(accountAddress);
  // Triggers GenLayer non-deterministic web fetch and equivalence validation across validators
  const txHash = await client.writeContract({
    address: contractAddress as `0x${string}`,
    functionName: "request_adjudication",
    args: [caseId, webUrl],
  });
  return await client.waitForTransactionReceipt({
    hash: txHash,
    waitUntil: "finalized",
  });
}

export async function finalizeAndCalculateSettlement(
  contractAddress: string,
  accountAddress: string,
  caseId: string,
  successScorePercentage: number
) {
  const client = getClient(accountAddress);
  const txHash = await client.writeContract({
    address: contractAddress as `0x${string}`,
    functionName: "finalize_and_calculate_settlement",
    args: [caseId, BigInt(successScorePercentage)],
  });
  return await client.waitForTransactionReceipt({
    hash: txHash,
    waitUntil: "finalized",
  });
}

export async function settleCase(
  contractAddress: string,
  accountAddress: string,
  caseId: string
) {
  const client = getClient(accountAddress);
  // Triggers verdict-bound payout transfers to provider and buyer wallets
  const txHash = await client.writeContract({
    address: contractAddress as `0x${string}`,
    functionName: "settle_case",
    args: [caseId],
  });
  return await client.waitForTransactionReceipt({
    hash: txHash,
    waitUntil: "finalized",
  });
}
