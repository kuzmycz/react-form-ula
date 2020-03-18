import React from 'react';
import Input from "./input.component";
import {ErrorMessage, Field} from "../.";
import Error from './error.component';
import clsx from 'clsx';

const Address = ({name, value}) => {

    return (<div className='address'>
        <div className={clsx('field', 'street')}>
            <label className='street'>Street: </label>
            <Field type='text' name={`${name}.street`} component={Input} className='field'/>
        </div>
        <div className={clsx('field')}>
            <label>City:</label>
            <Field type='text' name={`${name}.city`} component={Input} className='field'/>
        </div>
        <div className={clsx('field')}>
            <label>State:</label>
            <Field type='text' name={`${name}.state`} component={Input} className='field'/>
        </div>
        <div className={clsx('field')}>
            <label>Country:</label>
            <Field type='text' name={`${name}.country`} component={Input} className='field'/>
            <ErrorMessage name={`${name}.country`} component={Error}/>
        </div>
        <div className={clsx('field')}>
            <label>Postcode:</label>
            <Field type='text' name={`${name}.postcode`} component={Input} className='field'/>
        </div>
    </div>);
};

export default Address;
