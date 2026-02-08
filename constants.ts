
export const INITIAL_FLOWS = [
  { id: '1', name: 'CRM Auto-Fill', description: 'Maps lead info to Salesforce fields', icon: 'Database' },
  { id: '2', name: 'Expense Reporter', description: 'Extracts data from receipts to SAP', icon: 'ReceiptText' },
  { id: '3', name: 'Admin Onboarding', description: 'Copies user data into HR systems', icon: 'UserPlus' }
];

export const INITIAL_CLIPBOARD = [
  {
    id: 'c1',
    content: 'Johnathan Q. Public\n123 Innovation Way\nSan Francisco, CA 94105\n(555) 012-3456',
    timestamp: Date.now() - 1000 * 60 * 5,
    type: 'text' as const,
    appSource: 'Outlook',
    analysis: 'Detected: Address & Contact Info'
  },
  {
    id: 'c2',
    content: 'const userProfile = { name: "Alice", role: "Developer" };',
    timestamp: Date.now() - 1000 * 60 * 15,
    type: 'code' as const,
    appSource: 'VS Code',
    analysis: 'Detected: JavaScript Object'
  }
];
