import React, { useState } from 'react';
import Address from './address.component';
import { Field, FormProvider } from '../.';
import Input from "./input.component";

const Entity = ({name}) => {
    return (<div>
        <h2>{name}</h2>
        <div className={'field'}>
            <label>Name:</label>
            <Field type='text' name={`${name}.name`} component={Input}/>
        </div>

        <div className={'section'}>
            <Address name={`${name}.address`} />
        </div>

        <div className={'section'}>
            <div>Gender</div>
            <label><Field name={`${name}.gender`} value='male' type={'radio'} /> Male</label>
            <label><Field name={`${name}.gender`} value='female' type={'radio'} /> Female</label>
            <label><Field name={`${name}.gender`} value='other' type={'radio'} /> Other</label>
        </div>

        <div className={'section'}>
            <div>Favorite Fruit</div>
            <label><Field name={`${name}.fruit`} value='apples' type={'checkbox'} /> Apples</label>
            <label><Field name={`${name}.fruit`} value='oranges' type={'checkbox'} />Oranges</label>
            <label><Field name={`${name}.fruit`} value='pears' type={'checkbox'} />Pears</label>
        </div>

        <div className={'section'}>
            <div>Favorite Color</div>
            <Field component="select" name={`${name}.color`}>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
            </Field>
        </div>

        <div className={'section'}>
            <div>Languages</div>
            <Field component="select" name={`${name}.languages`} multiple>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="italian">Italian</option>
            </Field>
        </div>

        <div className={'section'}>
            <div>Terms and Conditions</div>
            <label><Field name={`${name}.termsAndConditions`} type={'checkbox'} /> Agree to terms and conditions.</label>
        </div>
    </div>);
};

export default Entity;
