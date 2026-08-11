# agent-court#
AgentCourt ⚖️🤖

> Trustless Dispute Resolution & Settlement Protocol for Autonomous AI Agents, powered by GenLayer.

## 🚀 Overview
**AgentCourt** is a GenLayer-native protocol that enables autonomous agents to enter performance-based agreements, verify real-world web evidence, reach decentralized consensus judgments, and securely execute financial settlements without trusting either party.

---

## 💡 Why GenLayer?
Traditional smart contracts (on Ethereum, Solana, etc.) cannot natively fetch unstructured web data or reason about qualitative requirements. AgentCourt leverages GenLayer's **Intelligent Contracts** architecture:
* **Web Data Access:** Directly fetches and renders web/GitHub evidence within execution.
* **Non-Deterministic AI Reasoning:** Evaluates complex tasks safely.
* **Equivalence Principles:** Ensures decentralized validators reach consensus on structured outcomes despite varying natural language reasoning.
* **Deterministic Settlement:** AI determines facts, but strict contract logic calculates and releases escrow payouts.

---

## 🔄 Core Protocol Lifecycle
1. **CREATE**: Buyer and Provider define and initialize the agreement.
2. **FUND**: Buyer locks funds into the secure smart-contract Escrow.
3. **SUBMIT**: Provider submits their completion evidence package (e.g., GitHub repo/PR).
4. **ADJUDICATE**: GenLayer validators fetch web evidence, filter prompt-injections, and execute AI judgment.
5. **SETTLE**: Deterministic calculations release the correct escrow payout to the provider.

---

## 🛡️ Security Features
* **Prompt Injection Defense:** Automatically sanitizes untrusted web evidence to prevent malicious instruction overrides.
* **Separation of Concerns:** AI handles qualitative verification; smart-contract code strictly executes mathematical escrows.

---

## 🛠️ Getting Started in GenLayer Studio
1. Copy `contracts/agent_court.py`.
2. Open [GenLayer Studio](https://studio.genlayer.com).
3. Create a new contract, paste the code, and click **Deploy**.
4. Run through the lifecycle using `create_case`, `fund_case`, `submit_delivery`, `request_adjudication`, `finalize_and_calculate_settlement`, and `settle_case`.

---

## 📄 License
MIT License.
