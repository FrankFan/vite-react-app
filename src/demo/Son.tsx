import { Button } from 'antd-mobile';
import { useContext } from 'react';
import { CountContext } from './Father';

export const Son = () => {
  const { count, setCount } = useContext(CountContext);
  return (
    <div className='son'>
      <div>我是子组件</div>
      <Button
        color='primary'
        onClick={() => {
          setCount(count + 1);
        }}
      >
        修改count的state
      </Button>
    </div>
  );
};
