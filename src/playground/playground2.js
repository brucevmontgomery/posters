import { toZonedTime } from 'date-fns-tz'
import { isSunday, isWednesday, previousSunday, isAfter, isBefore, previousWednesday } from "date-fns"
import { format as format_date } from 'date-fns'


let postTitle = "Post 1 of 5"
let postTitlePattern = /^\s*\bPost\s*\d\s*of\s*\d/
console.log(postTitle.match(postTitlePattern))

let testPostTitle = "TEST - Post 1 of 5"
let testPostTitlePattern = /^\s*\bTEST\s*-\s*\bPost\s*\d\s*of\s*\d/
console.log(testPostTitle.match(testPostTitlePattern))


let a = {}
let pid = "sdfsdfdf"
a.count = 3
a[pid] = true
console.log(a)

const regex = /\d+/;

const str = "ple10ase"
let fit = str.match(regex)

console.log(fit[0])


let bidTime1 = new Date("2024-11-03T20:00:00")
let bidTime2 = new Date("2024-11-03T07:00:00")

let auctionDate = new Date()
auctionDate = toZonedTime(auctionDate, "America/New_York")
auctionDate.setHours(20, 1, 0, 0)
if (!(isSunday(auctionDate) || isWednesday(auctionDate))) {
    auctionDate = isAfter(previousWednesday(auctionDate), previousSunday(auctionDate)) ? previousWednesday(auctionDate) : previousSunday(auctionDate)
}

console.log(isBefore(bidTime1, auctionDate))
console.log(isBefore(bidTime2, auctionDate))

let message = "$ fd22sf s"
let num = message.match(regex)
console.log(num ? num[0] : 0)














