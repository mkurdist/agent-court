'use client';

import React, { useState } from 'react';
// Importing the contract connection logic
import { createCase, fundCase } from './genlayer_client';

export default function AgentCourtDashboard() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'provider' | 'court'>('buyer');
  const [caseId, setCaseId] = useState('CASE-02');
  const [status, setStatus] = useState('SETTLED');

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
      
      {/* Header Section */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#818cf8' }}>AgentCourt Protocol ⚖️</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>Trustless Dispute Resolution & Settlement on GenLayer</p>
        </div>
        
        {/* Tabs Menu */}
        <div style={{ display: 'flex', gap: '10px', background: '#1e293b', padding: '5px', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveTab('buyer')} 
            style={{ padding: '8px 16px', background: activeTab === 'buyer' ? '#4f46e5' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Buyer Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('provider')} 
            style={{ padding: '8px 16px', background: activeTab === 'provider' ? '#4f46e5' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Provider Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('court')} 
            style={{ padding: '8px 16px', background: activeTab === 'court' ? '#4f46e5' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Court & Consensus
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ marginTop: 0, color: '#38bdf8' }}>Active Case Overview: {caseId}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Current State</span>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399', marginTop: '5px' }}>{status}</div>
          </div>
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Escrow Balance</span>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24', marginTop: '5px' }}>1,000 USDC</div>
          </div>
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>AI Adjudication Verdict</span>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#818cf8', marginTop: '5px' }}>ACCEPTED (100%)</div>
          </div>
        </div>

        <div style={{ marginTop: '25px', padding: '16px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#f1f5f9' }}>Active View Mode: {activeTab.toUpperCase()}</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
            {activeTab === 'buyer' && 'Manage agreements, lock funds into escrow, and track deliverables.'}
            {activeTab === 'provider' && 'Submit evidence packages, view task requirements, and claim settlements.'}
            {activeTab === 'court' && 'Inspect GenLayer validator consensus, equivalence principles, and appeal logs.'}
          </p>

          {/* Action Area for GenLayer Smart Contract Interactions */}
          {activeTab === 'buyer' && (
            <div style={{ borderTop: '1px solid #334155', paddingTop: '15px', marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={async () => {
                  // Calling the communication function we created in genlayer_client.ts
                  const result = await createCase("CASE-03", '{"task": "dev"}', "0xProviderAddress...");
                  alert("Transaction status: " + result?.status);
                }}
                style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Create New Case (On-Chain)
              </button>

              <button 
                onClick={async () => {
                  // Calling the fundCase function we created in genlayer_client.ts
                  const result = await fundCase("CASE-03", 1000);
                  alert("Escrow funded status: " + result?.status);
                }}
                style={{ padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Fund Escrow (1000 USDC)
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
