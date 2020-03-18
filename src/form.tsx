import * as React from "react";
import {useCacheContext} from "@kuzmycz/react-cache";

export type FormProps = {action?: any, children: any};

export const Form = ({action, ...rest}: FormProps) => {
    const cache = useCacheContext();
    const {submit, reset} = cache.content.operators;

    const resetHandler = useEventCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        reset();
    });

    const submitHandler = (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        submit(cache.content.values)
    };

    return(
        <form
            onSubmit={submitHandler}
            onReset={resetHandler}
            action={action || '#'}
            {...rest}
        />);
};


export const useFormDispatch = (submitHandler: (values: any, extraInfo?: any) => void) => {
    const cache = useCacheContext();


    return (extraInfo: any) => {
        const values = (cache.content || {})['values'];
        // Validate values
        submitHandler && submitHandler(values, extraInfo);
    }
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
