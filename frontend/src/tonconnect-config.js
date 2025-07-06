import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = '/backend/app/tonconnect-manifest.json';

const TonConnectConfig = ({ children }) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
};

export default TonConnectConfig;
