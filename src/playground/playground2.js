//TODO: build in signal abort for promises using AbortController
// also look into upgrading to a newer version of Node.js
// why am i using Node.js v18 and not a newer version


/*
let cancelAPI = false
let APITimers = []
let apiCalls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Promise.all(apiCalls.map((c) => {
    return new Promise((apiResolve, apiReject) => {
        let internalTimer = setTimeout(() => {
            console.log(cancelAPI, c)
            if (cancelAPI) {
                apiReject()
            } else {
                apiResolve()
            }
        }, c * 1000)
        APITimers.push(internalTimer)
    })
})).then(() => {
    console.log("all done")
}).catch((error) => {
    APITimers.forEach((t) => {        
        clearTimeout(t) 
    })
    console.log("cancelled")
})

setTimeout(() => {
    cancelAPI = true
}, 2000)
*/





