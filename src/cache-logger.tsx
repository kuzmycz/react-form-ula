import {default as React, useEffect, useState} from "react";
import { CacheBag, useCacheContext } from '@kuzmycz/react-cache';
import {deepCopy} from "./util";

type CacheLoggerProps = { display: boolean}
export const CacheLogger = ({display= true}: CacheLoggerProps) => {
    const cache = useCacheContext();
    const [value, setValue] = useState(cache.content);
    const key = '';
    const callback = (_key: string, _value: any, cache: CacheBag) => setValue(deepCopy(cache.content));

    console.log("CACHE", value);

    useEffect(() => {
        cache.subscribeCache(key, callback);

        return () => cache.unsubscribeCache(key, callback);
    }, []);

    if (display) {
        return(<pre>{JSON.stringify(value, undefined, 2)}</pre>);
    } else {
        return(<div></div>);
    }
};
