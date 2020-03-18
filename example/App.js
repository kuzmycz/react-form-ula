import React, {useState} from 'react'

import { Form, FormProvider, CacheLogger, Field } from '../.';
import Entity from "./entity.component";
import {Bag} from "./util/bag";
import { LogCache } from '@kuzmycz/react-cache'
import FormElements from './form-elements.component';
import CustomElement from './custom-element.component';
import "./app.styles.scss";
import clsx from 'clsx';

export const App = () => {
  const [example, setExample] = useState('elements');

  return (
    <div className='page'>
      <div className='header'>React Form-ula</div>
      <div className='navigation'>
        <div className={clsx('tab', {selected: example === 'elements'})} onClick={() => setExample('elements')}>Elements</div>
        <div className={clsx('tab', {selected: example === 'component'})} onClick={() => setExample('component')}>Custom Component</div>
      </div>
      <div>
        {example === 'elements' && <FormElements/>}
        {example === 'component' && <CustomElement/>}
      </div>
    </div>
  );
};
