async function __block(condition, time, callback = null, args) {
    const __sleep = () => new Promise((resolve) => setTimeout(resolve, time));
    let started = false;
    let count = 0;

    const __increase = async() => {
        if((!condition) && (count < 1)) { 
            await __sleep();

            if((callback) && (!started)) {
                started = true;
                try {
                    if( (callback instanceof Promise) | (callback instanceof (async () => {}).constructor) )
                        await callback(...args);
                    else 
                        callback(...args);
                } catch(e) {
                    console.log("error in callback __block");
                }  
            }

            ++count;
            return __increase(); 
        }
        else
            return false;
    }

    return !condition? __increase().then(s => s).catch(e => e) : Number.MAX_SAFE_INTEGER;
}

//condition need to be closure;
async function block(condition, time, limit, callback = null, ...args) {
    let numberRepetition = 0;
    let resultBlock = null;
    let stop = false;
    let changeFunction = 0;
    
    const closureCond = condition();

    
    //numberRepetition is number total of repetion
    while(
        (limit === "no-limit" ? true: numberRepetition < limit) &
        (!stop)
        ) {
        ++numberRepetition;
        let closureCondResponse = await closureCond();

        // console.log(`*BLOCK*  block called ${numberRepetition} times`);
        
        if(Array.isArray(callback)) {
            if(changeFunction > 1) changeFunction = 0;
            resultBlock = await __block(closureCondResponse, time, callback[changeFunction], args);
            changeFunction++;
        } 
        else 
            resultBlock = await __block(closureCondResponse, time, callback, args);
        
        if((
            (resultBlock === Number.MAX_SAFE_INTEGER) | 
            (limit === "no-limit" ? numberRepetition === limit : numberRepetition === 6)) || 
            (closureCondResponse)
        ) 
            stop = true;
    }

    return 1;
}

Object.freeze(block);

module.exports = {blockCode: block};
