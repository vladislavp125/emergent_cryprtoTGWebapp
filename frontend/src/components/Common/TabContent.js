import React from 'react';

const TabContent = ({ activeTab, children }) => {
  return (
    <div id={activeTab} className={`tab-content ${activeTab === 'active' ? 'active' : ''}`}>
      {children}
    </div>
  );
};

export default TabContent;
