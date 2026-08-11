// This file handles the communication between the frontend and the AgentCourt smart contract

export async function createCase(caseId: string, agreement: string, provider: string) {
  console.log("Sending transaction request to create case...");
  return { status: "ready" };
}

export async function fundCase(caseId: string, amount: number) {
  console.log(`Locking ${amount} USDC into escrow for case ${caseId}...`);
  return { status: "funded" };
}

export async function submitDelivery(caseId: string, evidencePackageJson: string) {
  console.log(`Submitting delivery evidence for case ${caseId}...`);
  // Future implementation: Add actual GenLayer transaction logic for submit_delivery
  return { status: "submitted" };
}
