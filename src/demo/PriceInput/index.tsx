// 二合一组件，好处是复用了2个组件的数据源
export function PriceInput({
  value = { amount: '', currency: 'rmb' },
  onChange = (p: any) => {},
}) {
  const handleChange = (deltaValue: any) => {
    console.log('delta', deltaValue, '222', value);

    onChange({
      ...value,
      ...deltaValue,
    });
  };

  return (
    <div className='exp-02-price-input'>
      <input
        type='text'
        value={value.amount}
        onChange={(evt) => handleChange({ amount: evt.target.value })}
      />
      <select
        value={value.currency}
        onChange={(evt) => handleChange({ currency: evt.target.value })}
      >
        <option value='rmb'>RMB</option>
        <option value='dollar'>Dollar</option>
      </select>
    </div>
  );
}
