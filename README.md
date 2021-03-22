# React Form-ula User Guide

[![Known Vulnerabilities](https://snyk.io/test/github/kuzmycz/react-form-ula/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kuzmycz/react-form-ula?targetFile=package.json)
[![Fast](https://badgen.now.sh/badge/speed/really%20fast/green)](https://npm.im/@kuzmycz/react-form-ula)
[![gzip size](https://badgen.net/bundlephobia/minzip/@kuzmycz/react-form-ula)](https://bundlephobia.com/result?p=@kuzmycz/react-form-ula)
[![gzip size](https://badgen.net/badge/license/MIT/blue)](./LICENSE)


Inspired by this formik, this library exists to improve the performance of forms by reducing the number of component re-renders. If you have forms that have a large number 
of input fields then each time a field changes (e.g. single key stroke) every input component gets re-rendered. This can lead to key lag.

React Form-ula is different, it uses [react-cache](https://github.com/kuzmycz/react-cache) to identify which components have changed and only renders those components. 
   
## Install

```bash
npm install --save @kuzmycz/react-form-ula
```

## Usage

Simple setup, no initial data, no validations, just works!
```typescript jsx
import { FormProvider, Form, Field } from 'kuzmycz@react-form-ula';

const MyForm = () => {

    const submitHandler = (values: any) => alert("Submitted the following " + values);
    
    return(
      <Form onSubmit={submitHandler}>
          <div className={'element-layout'}>
            <label>Name:
              <Field type='text' name={`name`} />
            </label>
            <label>Name:
              <Field type='text' name={`age`} />
            </label>
            <div>Gender</div>
            <label><Field name={`gender`} value='male' type={'radio'} /> Male</label>
            <label><Field name={`gender`} value='female' type={'radio'} /> Female</label>
            <label><Field name={`gender`} value='other' type={'radio'} /> Other</label>
          </div>
    
          <button type='submit'>Submit</button>
      </Form>);
};

```

Example with initial data.
```typescript jsx
import { FormProvider, Form, Field } from 'kuzmycz@react-form-ula';
const INITIAL_DATA = {name:'', age: '42', gender:'female'};


const MyForm = () => {

    const submitHandler = (values: any) => alert("Submitted the following " + values);
    
    return(
      <Form initialValues={INITIAL_DATA} onSubmit={submitHandler}>
          <div className={'element-layout'}>
            <label>Name:
              <Field type='text' name={`name`} />
            </label>
            <label>Name:
              <Field type='text' name={`age`} />
            </label>
            <div>Gender</div>
            <label><Field name={`gender`} value='male' type={'radio'} /> Male</label>
            <label><Field name={`gender`} value='female' type={'radio'} /> Female</label>
            <label><Field name={`gender`} value='other' type={'radio'} /> Other</label>
          </div>

          <button type='submit'>Submit</button>
      </Form>);
};
```

Example with validation data.
```typescript jsx
import { FormProvider, Form, Field, Error } from 'kuzmycz@react-form-ula';
const INITIAL_DATA = {name:'', age: '42', gender:'female'};
const isEmpty = (value) => value === undefined || value.trim().length() < 1;
const validator = (values) => {
  // you can use Nope or Yup
  // return undefined for no errors or a structured object with errors
  let errors = {};
  if (isEmpty(values.name)) {
    errors['name'] = "Name is required";
  }
  if (isEmpty(values.age)) {
    errors['age'] = "Age is required";
  } else if (Number(values.age) < 18 || values.name.trim().length < 1) {
    errors['age'] = "Age has to be greater than 17";
  }
  return (errors === {}) ? undefined : errors;
}


const MyForm = () => {

    const submitHandler = (values: any) => alert("Submitted the following " + values);
    
    return(
      <Form initialValues={INITIAL_DATA} validator={validator} onSubmit={submitHandler}>
          <div className={'element-layout'}>
            <div className={'field'}>
                <label>Name:
                  <Field type='text' name={`name`} />
                </label>
                <Error name={'name'}/>
            </div>
            <div className={'field'}>
                <label>Name:
                  <Field type='text' name={`age`} />
                </label>
                <Error name={'age'}/>
            </div>
            <div>Gender</div>
            <label><Field name={`gender`} value='male' type={'radio'} /> Male</label>
            <label><Field name={`gender`} value='female' type={'radio'} /> Female</label>
            <label><Field name={`gender`} value='other' type={'radio'} /> Other</label>
          </div>

          <button type='submit'>Submit</button>
      </Form>);
};
```

Or perhaps you would want your own input type


```typescript jsx
import { useField } from 'kuzmycz@react-form-ula';

const TextField = ({name, label, ...rest}) => {
  const fieldContext = useField({...rest, name});
  const {error, touched} = fieldContext.errorProps;

  return(
    <div className='field'>
      {label && <label className='field-label'>{label}</label>}
      <input {...fieldContext.fieldProps}/>
      {touched && error && <div className='field-error'>{error}</div>}
    </div>
  );

};
```
### useFieldValue
The hook (useFieldValue) allows a form field's value to be changed. This is
useful for form fields where their values are derived from other fields or 
inputs. Note: useFieldValue is a short-cut for using useCacheValue.

Why would you want to do this? Typically, you would use this if you have a 
computed value that you want added to the form so that it can be submitted 
later to a server. 

```typescript jsx
import { useFieldValue } from 'kuzmycz@react-form-ula';

const SomeComponent = ({length, width}) => {
  const [area, setArea] = useFieldValue(area);

  useEffect(() => {
    setArea(length * width);
  }, [length, width])
  
  return(
    <div className='field'>
      {label && <label className='field-label'>Area</label>}
      {area}
      {touched && error && <div className='field-error'>{error}</div>}
    </div>
  );

};
```
