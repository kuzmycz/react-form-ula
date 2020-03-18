import * as React from "react";
import {Cache, CacheBag, useCacheContext} from "@kuzmycz/react-cache";
import { deepCopy, merge, trim } from './util';

const validationSubscription = (validator: (values: any) => undefined | any) => {
    return {key: 'values', callback: (_key: string, _value: any, cache: CacheBag) => {
            const errors = validator && validator(cache.content.values);
            const original = cache.content.errors;
            merge(cache, {errors: original}, {errors: errors});
            cache.content.errors = trim(cache.content.errors);
        }
    }
};

export type FormProviderProps = {
    initialValues: any,
    children: any,
    validator?: (values: any) => undefined | any,
    onSubmit?: (values: any) => void
}


export const FormProvider = ({initialValues = {}, validator, children, onSubmit}: FormProviderProps) => {
    if(validator) console.log("Have a validator");
    const subscriptions = [];
    // Fix values and use tat in the operators. Note initialValues has to be deep copied
    // Create a formContext (private) and a useFormContext (public)
    if (validator) subscriptions.push(validationSubscription(validator));
    const initialErrors = (validator && validator(initialValues)) || {};

    return(
        <Cache values={{values:deepCopy(initialValues), errors:deepCopy(initialErrors), touched: {}, operators:{}}} observers={subscriptions}>
            <FormContext initialValues={initialValues} initialErrors={initialErrors} validator={validator} onSubmit={onSubmit}>
                {children}
            </FormContext>
        </Cache>
    )
};

export type FormContextProps = {
    initialValues: any,
    initialErrors: any,
    validator?: (values: any) => undefined | any,
    onSubmit?: (values: any) => void,
    children: any
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

const FormContext = ({initialValues, validator, initialErrors, onSubmit, children}: FormContextProps) => {
    const cache = useCacheContext();

    const operators = {
        validate: () => validator && validator(cache.content.values),
        submit: () => onSubmit && onSubmit(cache.content.values),
        reset: () => {
//            reset(cache, initialValues, initialErrors);
            console.log("RESET TRIGGERED")
            let operators = cache.content.operators;
            cache.content = {values: deepCopy(initialValues), errors: deepCopy(initialErrors), touched:{}, operators: operators};
            cache.notifyAll();
            console.log("RESET::DONE", cache)
        }
    };
    cache.content.operators = operators;

    return(<React.Fragment>
        {children}
    </React.Fragment>);
};


export const useFormContext = () => {
    const cache = useCacheContext();

    return cache.content.operators;
};

const componentDisplayName = (component: React.ComponentType) =>
  component.displayName ||
  component.name ||
  (component.constructor && component.constructor.name) ||
  'Component';

export const withFormProvider = (WrappedComponent: React.ComponentType) => class WithFormProvider extends React.PureComponent<FormProviderProps> {
        displayName = `WithFormProvider(${componentDisplayName})`;

        render() {
            const { initialValues = {}, onSubmit = () =>{}, validator = ()=> {}, ...rest }  = this.props as FormProviderProps;

            return (
              <FormProvider initialValues={initialValues} onSubmit={onSubmit} validator={validator}>
                    <WrappedComponent {...rest}/>
              </FormProvider>
            )
        }
    };


