# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json
import typing

_FORBIDDEN_PHRASES = (
    "ignore all previous instructions",
    "mark this task as completed",
    "you are now free",
    "override verdict",
)

def _sanitize_web_evidence(raw_content: str) -> str:
    cleaned = raw_content
    lowered = cleaned.lower()
    for phrase in _FORBIDDEN_PHRASES:
        if phrase in lowered:
            cleaned = cleaned.replace(phrase, "[FILTERED_MALICIOUS_INSTRUCTION]")
            lowered = cleaned.lower()
    return cleaned

@gl.evm.contract_interface
class _Recipient:
    class View:
        pass
    class Write:
        pass

class AgentCourt(gl.Contract):
    STATE_DRAFT = "DRAFT"
    STATE_FUNDED = "FUNDED"
    STATE_ACTIVE = "ACTIVE"
    STATE_SUBMITTED = "SUBMITTED"
    STATE_ADJUDICATING = "ADJUDICATING"
    STATE_ACCEPTED = "ACCEPTED"
    STATE_DISPUTED = "DISPUTED"
    STATE_APPEALED = "APPEALED"
    STATE_FINALIZED = "FINALIZED"
    STATE_SETTLED = "SETTLED"

    cases: TreeMap[str, str]
    case_states: TreeMap[str, str]
    buyer_addresses: TreeMap[str, Address]
    provider_addresses: TreeMap[str, Address]
    escrow_balances: TreeMap[str, u256]
    adjudication_results: TreeMap[str, str]
    evidence_packages: TreeMap[str, str]
    settlement_amounts: TreeMap[str, u256]

    def __init__(self):
        pass

    @gl.public.write
    def create_case(self, case_id: str, agreement_json: str, provider: str) -> None:
        """Initialize an agreement case between buyer and provider."""
        current_state = self.case_states.get(case_id, self.STATE_DRAFT)
        assert current_state == self.STATE_DRAFT, "Case already exists or invalid state"

        self.buyer_addresses[case_id] = gl.message.sender_address
        self.provider_addresses[case_id] = Address(provider)
        self.cases[case_id] = agreement_json
        self.case_states[case_id] = self.STATE_DRAFT

    @gl.public.write.payable
    def fund_case(self, case_id: str) -> None:
        """Lock actual GEN tokens in escrow and activate the case with strict buyer authorization."""
        state = self.case_states.get(case_id, self.STATE_DRAFT)
        assert state == self.STATE_DRAFT, "Invalid state for funding"
        
        # Enforce strict party authorization: only the registered buyer can fund
        buyer = self.buyer_addresses.get(case_id)
        assert gl.message.sender_address == buyer, "Unauthorized: only the registered buyer can fund escrow"
        
        val = gl.message.value
        assert val > u256(0), "Escrow amount must be greater than zero"
        
        self.escrow_balances[case_id] = val
        self.case_states[case_id] = self.STATE_ACTIVE

    @gl.public.write
    def submit_delivery(self, case_id: str, evidence_package_json: str) -> None:
        """Provider submits delivery evidence with strict provider authorization."""
        state = self.case_states.get(case_id, "")
        assert state == self.STATE_ACTIVE, "Case is not active"
        
        # Enforce strict party authorization: only the registered provider can submit delivery
        provider = self.provider_addresses.get(case_id)
        assert gl.message.sender_address == provider, "Unauthorized: only the registered provider can submit delivery"
        
        self.evidence_packages[case_id] = evidence_package_json
        self.case_states[case_id] = self.STATE_SUBMITTED

    @gl.public.write
    def request_adjudication(self, case_id: str, web_url: str) -> str:
        """Non-deterministic web evidence fetch + Adversarial AI Adjudication via GenLayer LLM."""
        state = self.case_states.get(case_id, "")
        assert state == self.STATE_SUBMITTED, "Case must be submitted for adjudication"
        self.case_states[case_id] = self.STATE_ADJUDICATING

        agreement_json = self.cases.get(case_id, "{}")

        def evaluate_evidence() -> bool:
            # 1. Fetch live web / GitHub repository code securely
            response = gl.nondet.web.get(web_url)
            web_data = response.body.decode("utf-8")
            safe_data = _sanitize_web_evidence(web_data)

            # 2. Construct strict adversarial auditor prompt for decentralized LLM validators
            prompt = f"""
            You are an ultra-strict, adversarial AI Smart Contract Auditor and Judge.
            Your objective is to find ANY security risk, logic flaw, missing feature, or contradiction between documentation claims and the actual source code.
            
            AGREEMENT REQUIREMENTS / CRITERIA:
            {agreement_json}
            
            SOURCE CODE / SUBMITTED EVIDENCE:
            {safe_data[:3500]}
            
            INSTRUCTIONS:
            - Scrutinize the evidence carefully against the criteria.
            - If there are any security vulnerabilities, missing implementations, unhandled risks, or contradictions between claims and actual code, you MUST output 'DISPUTED'.
            - Only output 'ACCEPTED' if the code completely and safely fulfills all criteria without exceptions.
            
            Respond with ONLY ONE WORD (no extra text or explanation): ACCEPTED or DISPUTED.
            """
            
            # 3. Execute prompt via GenLayer non-deterministic LLM execution layer
            llm_response = str(gl.nondet.exec_prompt(prompt)).strip().upper()
            
            # 4. Strict and safe parsing logic to prevent false positives
            if "DISPUTED" in llm_response:
                return False
            if "ACCEPTED" in llm_response and "DISPUTED" not in llm_response:
                return True
            
            # Default to False (Disputed) if the LLM output is ambiguous
            return False

        # GenLayer Equivalence Principle consensus check across validators
        is_verified = gl.eq_principle.strict_eq(evaluate_evidence)

        if is_verified:
            verdict = "ACCEPTED"
            self.case_states[case_id] = self.STATE_ACCEPTED
        else:
            verdict = "DISPUTED"
            self.case_states[case_id] = self.STATE_DISPUTED

        self.adjudication_results[case_id] = verdict
        return verdict

    @gl.public.write
    def raise_appeal(self, case_id: str, justification: str) -> None:
        """Raise an appeal for secondary review (Section 20)."""
        state = self.case_states.get(case_id, "")
        assert state in (self.STATE_ACCEPTED, self.STATE_DISPUTED), "Invalid state for appeal"
        self.case_states[case_id] = self.STATE_APPEALED

    @gl.public.write
    def finalize_and_calculate_settlement(self, case_id: str, success_score_percentage: u256) -> None:
        """Deterministic calculation of payout based on verified score percentage (0-100)."""
        state = self.case_states.get(case_id, "")
        assert state in (self.STATE_ACCEPTED, self.STATE_DISPUTED, self.STATE_APPEALED), "Invalid state for finalization"
        assert success_score_percentage <= u256(100), "Percentage cannot exceed 100"

        total_funds = self.escrow_balances.get(case_id, u256(0))
        
        # Deterministic integer division to prevent float conversion error
        payout = (total_funds * success_score_percentage) // u256(100)
        
        self.settlement_amounts[case_id] = payout
        self.case_states[case_id] = self.STATE_FINALIZED

    @gl.public.write
    def settle_case(self, case_id: str) -> None:
        """Deterministic settlement and verdict-bound escrow payout release (Section 23)."""
        state = self.case_states.get(case_id, "")
        assert state == self.STATE_FINALIZED, "Case not ready for settlement"

        total_funds = self.escrow_balances.get(case_id, u256(0))
        payout = self.settlement_amounts.get(case_id, u256(0))
        refund = total_funds - payout

        provider = self.provider_addresses.get(case_id)
        buyer = self.buyer_addresses.get(case_id)

        # Enforce verdict-bound custody release: transfer funds out to provider and buyer
        if payout > u256(0) and provider:
            _Recipient(provider).emit_transfer(value=payout, on='finalized')

        if refund > u256(0) and buyer:
            _Recipient(buyer).emit_transfer(value=refund, on='finalized')

        self.case_states[case_id] = self.STATE_SETTLED

    @gl.public.view
    def get_case(self, case_id: str) -> str:
        return self.cases.get(case_id, "")

    @gl.public.view
    def get_case_state(self, case_id: str) -> str:
        return self.case_states.get(case_id, "")

    @gl.public.view
    def get_evidence_package(self, case_id: str) -> str:
        return self.evidence_packages.get(case_id, "")

    @gl.public.view
    def get_adjudication_result(self, case_id: str) -> str:
        return self.adjudication_results.get(case_id, "")

    @gl.public.view
    def get_escrow_balance(self, case_id: str) -> u256:
        return self.escrow_balances.get(case_id, u256(0))

    @gl.public.view
    def get_settlement_amount(self, case_id: str) -> u256:
        return self.settlement_amounts.get(case_id, u256(0))
