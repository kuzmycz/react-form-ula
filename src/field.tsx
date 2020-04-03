import * as React from 'react';
import { useCacheValue } from '@kuzmycz/react-cache';

export type FieldProps = {
  name: string;
  type: string;
  value: any;
  children: any;
  component: any;
};

const universalChangeHandler = (
  event: React.ChangeEvent<any>,
  state: any,
  setState: (v: any) => void
) => {
  const { type, value, checked, multiple } = event.target;

  if (type === 'checkbox') {
    if (Array.isArray(state)) {
      if (multiple) console.log('FIELD::ChangeHandler - multiple set');
      if (checked) {
        state.indexOf(value) < 0 && setState([...state, value]);
      } else {
        state.indexOf(value) >= 0 && setState(state.filter(v => v !== value));
      }
    } else {
      setState(checked);
    }
  } else if (type === 'radio') {
    setState(value);
  } else if (multiple) {
    let current = state || [];
    if (current.includes(value)) {
      setState(current.filter((v: any) => v !== value));
    } else {
      setState([...current, value]);
    }
  } else {
    setState(value);
  }
};

export const Field = ({
  name,
  component: Component = 'input',
  type,
  value: valueProp,
  children,
  ...rest
}: FieldProps) => {
  const [value, setValue] = useCacheValue(`values.${name}`);
  const [touched, setTouched] = useCacheValue(`touched.${name}`);

  const changeHandler = (event: React.ChangeEvent<any>) => {
    !touched && setTouched(true);
    universalChangeHandler(event, value, setValue);
  };
  const blurHandler = () => !touched && setTouched(true);

  if (type === 'checkbox') {
    if (Array.isArray(value)) {
      return (
        <Component
          {...rest}
          name={name}
          type={type}
          value={valueProp}
          checked={value.includes(valueProp)}
          onChange={changeHandler}
          onBlur={blurHandler}
        >
          {children}
        </Component>
      );
    } else {
      return (
        <Component
          {...rest}
          name={name}
          type={type}
          checked={value}
          onChange={changeHandler}
          onBlur={blurHandler}
        >
          {children}
        </Component>
      );
    }
  } else if (type === 'radio') {
    return (
      <Component
        {...rest}
        name={name}
        type={type}
        checked={value === valueProp}
        value={valueProp}
        onChange={changeHandler}
        onBlur={blurHandler}
      >
        {children}
      </Component>
    );
  } else {
    return (
      <Component
        {...rest}
        name={name}
        type={type}
        value={value}
        onChange={changeHandler}
        onBlur={blurHandler}
      >
        {children}
      </Component>
    );
  }
};

export const useField = ({ name, type, value: valueProp, ...rest }: any) => {
  const [value, setValue] = useCacheValue(`values.${name}`);
  const [error, setError] = useCacheValue(`errors.${name}`);
  const [touched, setTouched] = useCacheValue(`touched.${name}`);

  const changeHandler = (event: React.ChangeEvent<any>) => {
    !touched && setTouched(true);
    universalChangeHandler(event, value, setValue);
  };

  const blurHandler = () => setTouched(true);

  const fieldProps: any = {
    ...rest,
    name,
    type,
    onChange: changeHandler,
    onBlur: blurHandler,
  };
  const errorProps: any = { error, touched };
  const helperProps: any = { setValue, setError };

  if (type === 'checkbox') {
    if (Array.isArray(value)) {
      fieldProps.checked = value.includes(valueProp);
    } else {
      fieldProps.checked = !!value;
    }
    fieldProps.value = valueProp;
  } else if (type === 'radio') {
    fieldProps.checked = valueProp === value;
    fieldProps.value = valueProp;
  } else {
    fieldProps.value = value;
  }

  return { fieldProps, errorProps, helperProps };
};
