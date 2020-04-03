import React from 'react';
import { Bag } from './util/bag';
import { Form } from '../dist';
import TextField from './text-field.component';
import CheckBox from './check-box.component';
import { CacheLog } from '@kuzmycz/react-cache-tools';

const CustomElement = () => {

  const validator = (values) => {
    const valueBag = Bag.of(values);
    const errorBag = Bag.of({});
    let hasErrors = false;

    const name = valueBag.getValue('name');
    if (name === undefined || name.trim().length < 1) {
      errorBag.setValue('name', "Name is required");
      hasErrors = true;
    }

    if (hasErrors)  {
      return errorBag.content;
    } else {
      return undefined
    }
  };

  return (
    <Form initialValues={{fruit:[]}} validator={validator}>

      <TextField name='name' label={'Name'}/>
      <CheckBox name='happy' label={'Are you happy'}/>
      <div>Favorite Fruit</div>
      <CheckBox name='fruit' value='apple' label='Apple'/>
      <CheckBox name='fruit' value='orange' label='Orange'/>
      <CheckBox name='fruit' value='pear' label='Pear'/>

      <CacheLog display={true}/>
    </Form>);
};

export default CustomElement;
