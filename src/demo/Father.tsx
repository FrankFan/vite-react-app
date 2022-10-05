import { Button } from 'antd-mobile';
import React, { createContext, useState } from 'react';
import { Son } from './Son';

// count: 0,
// setCount: 0,
// React.Dispatch<React.SetStateAction<number>>

// function withEvent(count: number): React.Dispatch<React.SetStateAction<number>> {

// }

export const CountContext = createContext({
  count: 0,
  setCount: (a: number) => {},
  // setCount: (): React.Dispatch<React.SetStateAction<number>> => 1111,
});

export const Father = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <CountContext.Provider value={{ count, setCount }}>
      <div className='father'>
        我是父组件
        <div>{count}</div>
        <Button
          onClick={() => {
            setCount(count + 1);
          }}
        >
          点我+1
        </Button>
        <Son />
      </div>
    </CountContext.Provider>
  );
};
