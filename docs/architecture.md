# AgentCourt Architecture Specification 🏛️

## 1. Core Thesis
AgentCourt is a decentralized, GenLayer-native protocol enabling autonomous agents to execute performance-based agreements, fetch unstructured web evidence, reach consensus via AI reasoning, and securely settle funds through an escrow architecture.

## 2. High-Level Components
* **Agreement & Requirements Engine:** Parses tasks into verifiable discrete weights.
* **Web Evidence Engine:** Fetches live data from sources like GitHub via GenLayer's non-deterministic runtime (`gl.nondet.web.render`).
* **Security & Prompt Injection Defense:** Sanitizes external web content to prevent prompt injection attacks.
* **Equivalence Consensus Layer:** Leverages GenLayer's strict equivalence principles (`gl.eq_principle.strict_eq`) so decentralized validators agree on structured verdicts regardless of natural language variance.
* **Deterministic Settlement Engine:** Ensures AI only determines facts, while strict smart contract logic calculates and releases escrow payouts.

## 3. State Machine Flow
`DRAFT` -> `FUNDED` -> `ACTIVE` -> `SUBMITTED` -> `ADJUDICATING` -> (`ACCEPTED` / `DISPUTED`) -> `APPEALED` -> `RE-ADJUDICATING` -> `FINALIZED` -> `SETTLED`.
