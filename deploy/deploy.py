"""
Deployment script helper for AgentCourt protocol on GenLayer.
Utilizes the GenLayer SDK to deploy the AgentCourt intelligent contract.
"""

import os
from genlayer import *

def main():
    print("Initializing AgentCourt deployment...")
    # Contract path verification
    contract_path = os.path.join("contracts", "agent_court.py")
    if os.path.exists(contract_path):
        print(f"Contract found at: {contract_path}")
        print("Ready for deployment via GenLayer Studio or CLI runner.")
    else:
        print("Error: agent_court.py contract file not found.")

if __name__ == "__main__":
    main()
