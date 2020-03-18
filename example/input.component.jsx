import React from 'react';
import { useCacheContext } from '@kuzmycz/react-cache';

const Input = ({name, ...rest}) => {
    console.log("RENDER: " + name);
    const cache = useCacheContext();
    const counterKey = `counter.${name}`;
    const counterValue = cache.get(counterKey);
    if(counterValue === undefined) {
        cache.set(counterKey, 1);
    } else {
        cache.set(counterKey, counterValue + 1);
    }

    return (<input name={name} {...rest}/>)
};

export default Input;
