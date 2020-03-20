# React Form-ula User Guide
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
      <FormProvider onSubmit={submitHandler}>
        <Form>
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
        </Form>
      </FormProvider>);
};

```

Example with initial data.
```typescript jsx
import { FormProvider, Form, Field } from 'kuzmycz@react-form-ula';
const INITIAL_DATA = {name:'', age: '42', gender:'female'};


const MyForm = () => {

    const submitHandler = (values: any) => alert("Submitted the following " + values);
    
    return(
      <FormProvider initialData={INITIAL_DATA} onSubmit={submitHandler}>
        <Form>
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
        </Form>
      </FormProvider>);
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
      <FormProvider initialData={INITIAL_DATA} validator={validator} onSubmit={submitHandler}>
        <Form>
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
        </Form>
      </FormProvider>);
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
