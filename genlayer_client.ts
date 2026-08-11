// This file handles the communication between the frontend and the AgentCourt smart contract

export async function createCase(caseId: string, agreement: string, provider: string) {
  console.log("Sending transaction request to create case...");
  // Future implementation: Add actual GenLayer transaction logic for create_case
  return { status: "ready" };
}

export async function fundCase(caseId: string, amount: number) {
  console.log(`Locking ${amount} USDC into escrow for case ${caseId}...`);
  // Future implementation: Add actual GenLayer transaction logic for fund_case
  return { status: "funded" };
}
