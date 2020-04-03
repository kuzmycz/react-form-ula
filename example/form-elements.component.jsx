import React from 'react';
import { Form } from '../dist';
import Entity from './entity.component';
import { useCacheContext } from '@kuzmycz/react-cache';
import { Bag } from './util/bag';
import { CacheLog } from '@kuzmycz/react-cache-tools';

const FormElements = () => {

  const validator = (values) => {
    const valueBag = Bag.of(values);
    const errorBag = Bag.of({});
    let hasErrors = false;

    const buyerCountry = valueBag.getValue('buyer.address.country');
    if (buyerCountry === undefined || buyerCountry.trim().length < 1) {
      errorBag.setValue('buyer.address.country', "Country is required");
      hasErrors = true;
    }
    if (valueBag.getValue('seller.address.country') === undefined) {
      errorBag.setValue('seller.address.country', "Country is required");
      hasErrors = true;
    }

    if (hasErrors)  {
      return errorBag.content;
    } else {
      return undefined
    }
  };

  const cache = useCacheContext();

  const submitHandler = (values) => {
    alert("Submitted with the following values:" + JSON.stringify(values));
  }

  return (

  <Form initialValues={{seller: {fruit:[]}, buyer:{fruit:[]}}} validator={validator} onSubmit={submitHandler}>
    <div className='example'>
          <div className={'element-layout'}>
            <Entity name={'buyer'}/>
            <div>
              <h2>Cache Content</h2>
              <CacheLog display={true}/>
            </div>
            <Entity name={'seller'}/>
          </div>

          <button type='reset'>Reset</button>
          <button type='submit'>Submit</button>
      </div>
  </Form>

  );
};

export default FormElements;

