import { useState } from 'react';
import { PriceInput } from '.';

interface valueType {
  amount: string;
  currency: string;
}

export const PriceInputDemo = () => {
  const [value, setValue] = useState<valueType>();

  const onInputPriceChane = (deltaValue: valueType) => {
    setValue({
      ...value,
      ...deltaValue,
    });
  };

  return <PriceInput value={value} onChange={onInputPriceChane} />;
};
