import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

type DisplacementInputProps = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberInputWithDecimal = React.forwardRef<NumericFormatProps, DisplacementInputProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        decimalScale={2}
      />
    );
  },
);

export default NumberInputWithDecimal;