import React from 'react';

const Error = ({name, ...rest}) => {
  console.log("ERROR::RENDER: " + name);

  return (<div className='error' name={name} {...rest}/>)
}

export default Error;
