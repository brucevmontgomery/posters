import { TZDate, tz } from "@date-fns/tz"
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { parse, format, isSunday, isWednesday, isSaturday, previousSaturday, previousSunday, isAfter, previousWednesday } from "date-fns"

function getDayorPrevDayDate(forDayOfWeek, hours, minutes, seconds = 0, miliseconds = 0) {
    let today = new Date()
    let todayDayOfWeek = today.getDay()
    let forDayDate = new Date()
  
    if (todayDayOfWeek == forDayOfWeek) {
      forDayDate.setDate(today.getDate())
    } else if (todayDayOfWeek < forDayOfWeek) {
      forDayDate.setDate(today.getDate() - (todayDayOfWeek + (7 - forDayOfWeek)))
    } else {
      forDayDate.setDate(today.getDate() - (todayDayOfWeek - forDayOfWeek))
    }
  
    forDayDate.setHours(hours, minutes, seconds, miliseconds)
    return forDayDate
  }

  function getDayOrPrevDay(forDayOfWeek, hours, minutes, seconds = 0) {
    let today = new Date()
    let todayDayOfWeek = today.getDay()

  }

  let nDate = new Date()
  console.log(nDate)

  /*
  let dateStr = "2024-10-20 23:59:59"
  let saleDay = new Date(dateStr)
  let TZSaleDay = new TZDate(dateStr, "America/New_York")
  //let fnsSaleDay = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date(dateStr),)
  //fnsSaleDay = new Date()
  //fnsSaleDay.setHours(20, 1, 0, 0)
  //let TOSaleDay = toZonedTime(fnsSaleDay, "America/New_York")
  let FromSaleDay = fromZonedTime(fnsSaleDay, "America/New_York")
  console.log(saleDay)
  console.log(isSunday(saleDay))
  console.log(TZSaleDay)
  console.log(isSunday(TZSaleDay))
  console.log(fnsSaleDay)
  console.log(isSunday(fnsSaleDay))
  console.log(TOSaleDay)
  console.log(isSunday(TOSaleDay))
  console.log(FromSaleDay)
  console.log(isSunday(FromSaleDay))

  saleDay = toZonedTime(saleDay,"America/New_York")
  console.log(saleDay.getDay())
  console.log(saleDay)
  console.log(isSunday(saleDay))
  */

  let dateStr = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  console.log(dateStr)
  let fnsSaleDay = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date(dateStr))
  console.log(fnsSaleDay)
  let TOSaleDay = toZonedTime(fnsSaleDay, "America/New_York")
  console.log(TOSaleDay)
  if(!(isSunday(TOSaleDay) || isWednesday(TOSaleDay))) {
    TOSaleDay = isAfter(previousWednesday(TOSaleDay), previousSunday(TOSaleDay)) ? previousWednesday(TOSaleDay) : previousSunday(TOSaleDay)
  }

  console.log(TOSaleDay)


  let mdate = new Date()
  console.log(mdate)
  let edate = toZonedTime(mdate, "America/New_York")
  edate.setHours(20, 1, 0, 0)
  console.log(edate)
  console.log(format(edate, 'yyyy-MM-dd HH:mm:ss'))
  let pwed = previousWednesday(edate)
  pwed = toZonedTime(pwed, "America/New_York")
  console.log(pwed)
  console.log(format(pwed, 'yyyy-MM-dd HH:mm:ss'))

  function getDefaultAuctionDate() {
    let auctionDate = toZonedTime(new Date(), "America/New_York")
    auctionDate.setHours(20, 1, 0, 0)
    if(!(isSunday(auctionDate) || isWednesday(auctionDate))) {
      auctionDate = isAfter(previousWednesday(auctionDate), previousSunday(auctionDate)) ? previousWednesday(auctionDate) : previousSunday(auctionDate)
    }
    return auctionDate
  }

  let tdate = toZonedTime(new Date(), "America/New_York")
  console.log(format(tdate, 'yyyy-MM-dd HH:mm:ss'))

  console.log(format(getDefaultAuctionDate(), 'yyyy-MM-dd HH:mm:ss'))

  