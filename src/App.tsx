import { useState } from 'react';
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';
import './App.css';
import { ethers } from 'ethers';
import { Button, Card } from 'antd-mobile';
import EasterEggContainer from './EasterEggComponent';
import { FaucetRequestSuccessResponse } from './shared/models/types';

interface FaucetRequestItem {
  requestTime: Date;
  clientRequestId: string;
  toAddress: string;
  response: FaucetRequestSuccessResponse;
}

function App() {
  const [showEaster, setShowEaster] = useState<boolean>(false);
  const [requestItems, setRequestItems] = useState<FaucetRequestItem[]>(
    // FaucetLocalStorage.getRequests()
    []
  );

  return (
    <div className="App">
      <EasterEggContainer
        showEaster={showEaster}
        responder={setShowEaster}
        transactionUrl={''}
        appNetwork="rinkeby"
      />
      <h1>Vite + React</h1>
      <Card title="antd-mobile">
        <Button color="primary">Button</Button>
      </Card>
    </div>
  );
}

export default App;
