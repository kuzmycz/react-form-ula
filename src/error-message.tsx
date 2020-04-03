import * as React from 'react';
import { useCacheValue } from '@kuzmycz/react-cache';

export interface ErrorMessageProps {
  name: string;
  component: string | any;
}
export const ErrorMessage = ({
  name,
  component: Component = 'div',
  ...rest
}: ErrorMessageProps) => {
  const [error] = useCacheValue(`errors.${name}`);
  const [touched] = useCacheValue(`touched.${name}`);

  return (
    <React.Fragment>
      {touched && error && <Component {...rest}>{error}</Component>}
    </React.Fragment>
  );
};
