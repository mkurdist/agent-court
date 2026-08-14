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


# AgentCourt Protocol — Comprehensive Adjudication Standards & Requirements

## 📋 Overview
This document outlines the strict, production-grade security, code quality, and consensus standards enforced by the **AgentCourt Protocol**. Our decentralized AI smart contract judges evaluate provider deliverables against these weighted criteria using zero-tolerance automated verification across the GenLayer network.

---

## ⚖️ Weighted Adjudication Framework (100% Total)

The protocol evaluates repositories and deliverables across **27 core criteria**, categorized into structural security, cybersecurity, consensus integrity, testing, and engineering best practices.

### 1. Web3 & AI Security (Weight: 35%)
* **[R1] Invariant Testing (6%)**: Ensuring core contract rules and escrow balances are never violated under any circumstances.
* **[R2] Reentrancy Guard (6%)**: Implemented for all smart contract token withdrawals and transfers.
* **[R3] Formal Verification (5%)**: Ensuring mathematical proof of contract logic correctness prior to deployment.
* **[R4] Access Control & Multi-Signature (5%)**: Strict restrictions and multi-sig patterns for privileged administrative functions.
* **[R5] LLM Determinism Control (5%)**: Defining strict consensus bounds and tolerance rules among validating nodes.
* **[R6] Validator Collusion Resistance (4%)**: Slashing and punitive mechanisms for nodes attempting malicious voting.
* **[R7] MEV & Front-Running Resistance (4%)**: Guaranteeing transaction ordering cannot be maliciously manipulated.

### 2. Cybersecurity & Data Protection (Weight: 31%)
* **[R8] AES-256 Encryption (5%)**: Applied rigorously to all stored sensitive data.
* **[R9] Input Sanitization & SQL Injection Protection (5%)**: Fully protecting backend routes against malicious injection vectors.
* **[R10] OAuth2 Authentication (4%)**: Mandatory authentication for all protected API routes.
* **[R11] Environment Variables Security (4%)**: Zero hardcoded secrets, private keys, or API credentials.
* **[R12] XSS Protection (3%)**: Ensuring all user-supplied inputs are properly escaped and sanitized.
* **[R13] CORS Policy Configuration (3%)**: Disallowing unauthorized wildcard origins and permitting only trusted domains.
* **[R14] Rate Limiting (3%)**: Built-in protection against DoS and brute-force attacks.
* **[R15] JWT Token Validation (2%)**: Secure signature verification and proper expiration management.

### 3. Code Quality & Testing (Weight: 16%)
* **[R16] Unit Test Coverage (4%)**: Automated unit tests covering 80% to 100% of core logic.
* **[R17] Comprehensive Error Handling (4%)**: Robust try-catch wrappers around async operations and database queries.
* **[R18] Integration Tests (3%)**: End-to-end validation of successful responses and HTTP error status codes.
* **[R19] Modular Architecture (3%)**: Clean directory separation between business logic, routing, and data layers.
* **[R20] Edge Cases & Error States (2%)**: Comprehensive test scenarios covering failure paths.

### 4. Performance, Engineering & DevOps (Weight: 18%)
* **[R21] Gas Optimization (4%)**: Minimized loop complexities and efficient state variables.
* **[R22] State Management (4%)**: Prevention of garbage data accumulation in TreeMaps and temporary storage.
* **[R23] Type Safety & Linting (3%)**: Zero fatal warnings against recognized static analysis standards.
* **[R24] Automated CI/CD Pipelines (3%)**: Integrated build and test pipelines.
* **[R25] Async/Await Usage (2%)**: Clean asynchronous control flow avoiding callback hell.
* **[R26] Advanced Gas Optimization (2%)**: High-efficiency state updates and storage layout.
* **[R27] Static Analysis Filters (2%)**: Automated blocking of vulnerable code patterns before deployment.

---

## 🔍 How Decentralized AI Adjudication Works
1. **Evidence Ingestion**: The provider submits repository documentation or code links.
2. **Oracle & Sanitization**: GenLayer fetches repository data through non-deterministic web getters while filtering malicious prompt injections via `_sanitize_web_evidence`.
3. **Consensus Evaluation**: Decentralized AI nodes analyze the codebase against the **27 Weighted Requirements** defined above.
4. **Verdict Execution**: If requirements fail or fall short, the contract securely triggers a `DISPUTED` state, protecting buyer funds with absolute cryptographic and logical rigor.

---
*Built for the GenLayer Builder Track.*
