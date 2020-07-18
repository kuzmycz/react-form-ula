import * as React from 'react';
import { Cache, CacheBag, useCacheContext } from '@kuzmycz/react-cache';
import { deepCopy, merge, trim, flattenObject } from './util';

const validationSubscription = (
  validator: (values: any) => undefined | any
) => {
  return {
    key: 'values',
    callback: (_key: string, _value: any, cache: CacheBag) => {
      const errors = validator && validator(cache.content.values);
      const original = cache.content.errors;
      merge(cache, { errors: original }, { errors: errors });
      cache.content.errors = trim(cache.content.errors);
    },
  };
};

export type FormProps = {
  action?: any;
  children: any;
  initialValues: any;
  onSubmit?: (values: any) => void;
  validator?: (values: any) => undefined | any;
};

export type SubmitFunction = (values: any) => void;
export type ResetFunction = () => void;

export const Form = ({
  action,
  initialValues = {},
  validator,
  children,
  onSubmit,
}: FormProps) => {
  if (validator) console.log('Have a validator');
  const subscriptions = [];
  // Fix values and use tat in the operators. Note initialValues has to be deep copied
  // Create a formContext (private) and a useFormContext (public)
  if (validator) subscriptions.push(validationSubscription(validator));
  const initialErrors = (validator && validator(initialValues)) || {};

  return (
    <Cache
      values={{
        values: deepCopy(initialValues),
        errors: deepCopy(initialErrors),
        touched: {},
        operators: {},
      }}
      observers={subscriptions}
    >
      <FormContext
        action={action}
        initialValues={initialValues}
        initialErrors={initialErrors}
        validator={validator}
        onSubmit={onSubmit}
      >
        {children}
      </FormContext>
    </Cache>
  );
};

export type FormContextProps = {
  action: string;
  children: any;
  initialErrors: any;
  initialValues: any;
  onSubmit?: SubmitFunction;
  validator?: (values: any) => undefined | any;
};

/*
const reset = (cache: CacheBag, values: any, errors: any) => {
    cache.content.values = values;
    cache.content.errors = errors;
    cache.content.touched = {};
    merge(cache, {values: cache.content.values, errors: cache.content.errors}, {values:values, errors: errors});
    cache.content.errors = trim(cache.content.errors);


}
 */

const resetOperation = (
  cache: CacheBag,
  initialValues: any,
  initialErrors: any
) => {
  let operators = cache.content.operators;
  cache.content = {
    values: deepCopy(initialValues),
    errors: deepCopy(initialErrors),
    touched: {},
    operators: operators,
  };
  cache.notifyAll();
};
/*
      cache.content = {values: deepCopy(initialValues), errors: deepCopy(initialErrors), touched:{}, operators: operators};
      cache.notifyAll();

 */

const FormContext = ({
  action,
  initialValues,
  validator,
  initialErrors,
  onSubmit,
  children,
}: FormContextProps) => {
  const cache = useCacheContext();
  const submit = () => onSubmit && onSubmit(cache.content.values);
  const validate = () => validator && validator(cache.content.values);
  const reset = () => resetOperation(cache, initialValues, initialErrors);

  const resetHandler = useEventCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    reset();
  });

  const touchErrorKeys = (errors: any) => {
    Object.entries(flattenObject('', errors || {})).forEach(key => {
      cache.set(`touched.${key}`, true);
    });
  };

  const submitHandler = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const errors = validate();

    if (errors) {
      // has errors, mark the fields with errors as touched so that the error display
      touchErrorKeys(errors);
    } else {
      // No errors (or no validator)
      submit();
    }
  };

  const operators = { validate, submit, reset };
  cache.content.operators = operators;

  return (
    <form
      onSubmit={submitHandler}
      onReset={resetHandler}
      action={action || '#'}
    >
      {children}
    </form>
  );
};

// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
// @see https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect;

function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref: any = React.useRef(fn);

  // we copy a ref to the callback scoped to the current state/props on each render
  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  });

  return React.useCallback(
    (...args: any[]) => ref.current.apply(void 0, args),
    []
  ) as T;
}

export const useSubmit = (): SubmitFunction => {
  const cache = useCacheContext();

  return cache.content?.operators?.submit;
};

export const useReset = (): ResetFunction => {
  const cache = useCacheContext();

  return cache.content?.operators?.reset;
};

const componentDisplayName = (component: React.ComponentType) =>
  component.displayName ||
  component.name ||
  (component.constructor && component.constructor.name) ||
  'Component';

export const withFormProvider = (WrappedComponent: React.ComponentType) =>
  class WithFormProvider extends React.PureComponent<FormProps> {
    displayName = `WithFormProvider(${componentDisplayName})`;

    render() {
      const {
        initialValues = {},
        onSubmit = () => {},
        validator = () => {},
        ...rest
      } = this.props as FormProps;

      return (
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          validator={validator}
        >
          <WrappedComponent {...rest} />
        </Form>
      );
    }
  };
