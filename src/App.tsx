import { createContext, useEffect, useState } from 'react';
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';
import './App.css';
import { ethers } from 'ethers';
import { Button, Card } from 'antd-mobile';
import EasterEggContainer from './EasterEggComponent';
import { FaucetRequestSuccessResponse } from './shared/models/types';
import mitt from 'mitt';
import { Father } from './demo/Father';
import { PriceInput } from './demo/PriceInput';
import { PriceInputDemo } from './demo/PriceInput/demo';
const emitter = mitt();
// console.log(emitter);

// import EventEmitter3 from 'eventemitter3';
// const emitter = new EventEmitter3();

interface FaucetRequestItem {
  requestTime: Date;
  clientRequestId: string;
  toAddress: string;
  response: FaucetRequestSuccessResponse;
}

export const MyContext = createContext({
  showEaster: false,
  setShowEaster: (f: boolean) => {},
});

function App() {
  const [showEaster, setShowEaster] = useState<boolean>(false);

  return (
    <div className='App'>
      <MyContext.Provider value={{ showEaster, setShowEaster }}>
        <EasterEggContainer
          showEaster={showEaster}
          responder={setShowEaster}
          transactionUrl={''}
          appNetwork='rinkeby'
        />
      </MyContext.Provider>
      <h1>Vite + React: all: </h1>
      {/* <div>{JSON.stringify(emitter)}</div> */}
      <Card title='antd-mobile'>
        <Button color='primary' onClick={() => setShowEaster(true)}>
          show
        </Button>
        <Button onClick={() => setShowEaster(false)}>hide</Button>
        <Button
          color='success'
          onClick={() => {
            emitter.on('test', (e) => {
              console.log('触发 test , 参数是: ', e);
            });
          }}
        >
          监听事件
        </Button>
        <Button
          color='primary'
          onClick={() => {
            emitter.emit('test', 42);
          }}
        >
          触发事件
        </Button>
      </Card>
      <Card title='测试 useContext'>
        <Father />
      </Card>
      <Card title='受控组件'>
        <PriceInputDemo />
      </Card>
    </div>
  );
}

export default App;
