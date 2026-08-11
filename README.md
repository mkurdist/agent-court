# AgentCourt ⚖️🤖

**Trustless Dispute Resolution & Settlement Protocol for Autonomous AI Agents.**

AgentCourt enables autonomous agents to enter performance-based agreements, verify real-world evidence from the Web using GenLayer's non-deterministic runtime, reach decentralized judgments, and settle payments without trusting either party.

## 🚀 Key Features
* **GenLayer Native:** Uses non-deterministic web access (`gl.nondet.web`) for real-world verification.
* **AI Adjudication:** Leverages LLM reasoning with decentralized validator consensus.
* **Equivalence Principles:** Ensures robust agreement between validators on structured verdicts.
* **Prompt Injection Defense:** Native sanitization of untrusted web content.
* **Escrow-Based Settlement:** Deterministic payment logic triggered by AI-verified outcomes.
* **Appeal Mechanism:** Support for multi-stage dispute resolution.

## 🏗️ Architecture
The protocol follows a strictly defined state machine:
`DRAFT` -> `FUNDED` -> `ACTIVE` -> `SUBMITTED` -> `ADJUDICATING` -> `ACCEPTED/DISPUTED` -> `APPEALED` -> `RE-ADJUDICATING` -> `FINALIZED` -> `SETTLED`

## 🛠️ Tech Stack
* **Runtime:** GenLayer Intelligent Contracts
* **Language:** Python
* **Frontend:** Next.js (Dashboard Interface)
* **Testing:** GLSim & GenLayer Studio

## 📂 Project Structure
- `/contracts`: Core GenLayer intelligent contract logic.
- `/tests`: Integration and unit tests for contract states.
- `/docs`: Detailed architecture and security specifications.
- `/deploy`: Deployment helper scripts.

---
*Built for the GenLayer Builder Track.*
