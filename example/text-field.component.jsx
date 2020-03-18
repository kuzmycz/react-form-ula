import React from 'react';
import { useField } from '../dist';

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

export default TextField;
