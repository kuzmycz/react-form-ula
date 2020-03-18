import React from 'react';
import { Bag } from './util/bag';
import { FormProvider } from '../dist';
import Entity from './entity.component';
import { LogCache } from '@kuzmycz/react-cache';
import TextField from './text-field.component';
import CheckBox from './check-box.component';

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
    <FormProvider initialValues={{fruit:[]}} validator={validator}>

      <TextField name='name' label={'Name'}/>
      <CheckBox name='happy' label={'Are you happy'}/>
      <div>Favorite Fruit</div>
      <CheckBox name='fruit' value='apple' label='Apple'/>
      <CheckBox name='fruit' value='orange' label='Orange'/>
      <CheckBox name='fruit' value='pear' label='Pear'/>

      <LogCache display={true}/>
    </FormProvider>);
};

export default CustomElement;
