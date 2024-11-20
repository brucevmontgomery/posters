/*
let vals = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function getResults(index) {
    console.log(vals[index])
    return new Promise((resolve, reject) => {
        if (vals[index] == 5) {
            console.log("error")
            reject({code: 1, error: "error"})
        } else {
            if (index < 8) {
                getResults(index + 1)
                    .then((val) => {
                        resolve(vals[index] + val)
                    })
                    .catch((error) => {reject(error)})
            } else {
                resolve(vals[index])
            }
        }
    })
}

getResults(0)
    .then((value) => console.log(value))
    .catch((error) => {
        console.log(error)
    })
*/


let c = {messacge: "ddfdf", story: "xxxxxx"}
let p = c?.message ? c.message : c.story
console.log(p)


