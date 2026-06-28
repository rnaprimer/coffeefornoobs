import React from 'react';

export function TabPanel({ children, tabId }: { children: React.ReactNode, tabId: string }) {
  return <div className="animate-in fade-in duration-300">{children}</div>;
}
