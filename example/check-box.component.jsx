import React from 'react';
import { useField } from '../dist';

const CheckBox = ({name, label, ...rest}) => {
  const fieldContext = useField({...rest, name, type: 'checkbox'});
  const {error, touched} = fieldContext.errorProps;

  return(
    <div className='field-checkbox'>
      <label className={'field-label'}>
        <input {...fieldContext.fieldProps}/>
        {label}
      </label>
      {touched && error && <div className={field-error}>{error}</div>}
    </div>
  );

};

export default CheckBox;
