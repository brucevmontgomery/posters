import React, { useState, useRef } from 'react'

import { toZonedTime } from 'date-fns-tz'
import { isSunday, isWednesday, previousSunday, isAfter, isBefore, previousWednesday } from "date-fns"

// react-bootstrap
import { Row, Col, Card, Button, InputGroup, Form, FormControl, DropdownButton, Dropdown, Table } from 'react-bootstrap'
import AnimatedModal from '../../components/Modal/AnimatedModal'

import Datetime from 'react-datetime'
import 'moment-timezone'

import { useDownloadExcel } from 'react-export-table-to-excel'
import copy from 'copy-to-clipboard'

import facebookAuctionImg from '../../assets/images/auction/facebook-online-auction.jpg'

// test data
import { useTestData, postAttachmentsLimit, attachmentCommentsLimit, groupPosts, testAllPostsAndAttachments } from '../posters/postersTestData'

function getDefaultAuctionDate() {
  let auctionDate = new Date()
  auctionDate = toZonedTime(auctionDate, "America/New_York")
  auctionDate.setHours(20, 1, 0, 0)
  if (!(isSunday(auctionDate) || isWednesday(auctionDate))) {
    auctionDate = isAfter(previousWednesday(auctionDate), previousSunday(auctionDate)) ? previousWednesday(auctionDate) : previousSunday(auctionDate)
  }
  return auctionDate
}

const postersOnlineAuction = () => {
  const auctionEndDateTime = useRef(getDefaultAuctionDate())
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState({ show: false, error: "" })
  const [posts, setPosts] = useState(null)
  const [checkedPosts, setcheckedPosts] = useState({ count: 0 });
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const [winningBids, setWinningBids] = useState(null)
  const winnersTableRef = useRef(null)

  function setAuctionEndDateTime(newValue) {
    auctionEndDateTime.current = newValue
  }

  //Online auction group id = 2119358545044791
  function getGroupPosts(callback) {
    FB.api(`2119358545044791?fields=name,feed`, function (response) {
      callback(response)
    })
  }

  function onGetPosts() {

    function setPostsAndDefaultChecks(posts) {
      let postTitlePattern = useTestData ? /^\s*\bTEST\s*-\s*\bPost\s*\d\s*of\s*\d/ : /^\s*\bPost\s*\d\s*of\s*\d/
      let defaultCheckedPosts = {}
      let checkedPostCount = 0
      let data = posts.feed.data.map((p) =>
      ({
        id: p.id,
        post: p.message,
        items: null
      }))
      data.forEach((post) => {
        if (post.post != null) {
          if (post.post.match(postTitlePattern)) {
            checkedPostCount++
            defaultCheckedPosts[post.id] = true
          }
        }
      })
      defaultCheckedPosts["count"] = checkedPostCount
      setcheckedPosts(defaultCheckedPosts)
      setPosts(data)
    }

    setIsLoadingPosts(true)
    if (useTestData == true) {
      setTimeout(() => {
        setPostsAndDefaultChecks(groupPosts)
        setIsLoadingPosts(false)
      }, 2000)
    } else {
      getGroupPosts(function (response) {
        if (response?.error) {
          setIsLoadingPosts(false)
          setShowErrorModal({ show: true, error: response.error.message })
        } else {
          setPostsAndDefaultChecks(response)
          setIsLoadingPosts(false)
        }
      })
    }
  }

  function transformPostAttachments(subattachments) {
    return subattachments.map((i) => {
      i.description = i.description ?? "#0 untitled"
      let itemNum = Number(i.description.trim().substr(0, i.description.trim().indexOf(" ")).replace("#", "").replace("$", ""))
      itemNum = itemNum ? itemNum : 0
      let description = i.description.trim().substr(i.description.trim().indexOf(" ") + 1)
      return ({
        id: i.target.id,
        itemNum: itemNum,
        description: description,
        comments: null
      })
    }
    )
  }

  function onGetBidWinners() {
    setIsLoadingBids(true)
    if (useTestData == true) {
      setTimeout(() => {
        let postIds = Object.entries(checkedPosts).filter(([key, value]) => (key != "count") && value).map((e) => e[0])
        let allPostsAndAttachments = testAllPostsAndAttachments.filter((post) => postIds.includes(post.id))
        determineWinningBids(allPostsAndAttachments)
        setIsLoadingBids(false)
      }, 2000)
    } else {
      let postIds = Object.entries(checkedPosts).filter(([key, value]) => (key != "count") && value).map((e) => e[0])
      let allPostsAndAttachments = posts.filter((post) => postIds.includes(post.id))
      let apiCount = 0
      let apiCallGroupSize = 1
      let apiCallWaitStep = 5000
      let apiCallWaitTime = -apiCallWaitStep
      Promise.all(
        postIds.map(postId => {
          if ((apiCount % apiCallGroupSize) == 0) {
            apiCallWaitTime = apiCallWaitTime + apiCallWaitStep
          }
          apiCount++
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              FB.api(`${postId}?fields=attachments{subattachments.limit(${postAttachmentsLimit}){target{id},description}}`, function (response) {
                if (response?.error) {
                  reject(response.error.message)
                } else {
                  let postIdx = allPostsAndAttachments.findIndex(post => post.id === postId)
                  allPostsAndAttachments[postIdx].items = transformPostAttachments(response.attachments.data[0].subattachments.data)
                  resolve()
                }
              })
            }, apiCallWaitTime)
          })
        })
      ).then(() => {
        let apiCount = 0
        let apiCallGroupSize = 1
        let apiCallWaitStep = 3000
        let apiCallWaitTime = -apiCallWaitStep
        let commentAPICalls = postIds.map((postId) => {
          let postIdx = allPostsAndAttachments.findIndex(post => post.id === postId)
          return allPostsAndAttachments[postIdx].items.map((item) => {
            if ((apiCount % apiCallGroupSize) == 0) {
              apiCallWaitTime = apiCallWaitTime + apiCallWaitStep
            }
            apiCount++
            let apiCall = `${item.id}/?fields=comments.limit(${attachmentCommentsLimit})`
            return ({ postIdx: postIdx, itemId: item.id, apiCall: apiCall, waitTime: apiCallWaitTime })
          })
        }).flat()
        Promise.all(commentAPICalls.map((a) => {
          return new Promise((apiResolve, apiReject) => {
            setTimeout(() => {
              FB.api(a.apiCall, function (response) {
                if (response?.error) {
                  apiReject(response.error.message)
                } else {
                  let itemIdx = allPostsAndAttachments[a.postIdx].items.findIndex(aItem => aItem.id === a.itemId)
                  allPostsAndAttachments[a.postIdx].items[itemIdx].comments = (response.hasOwnProperty("comments") && response.comments.hasOwnProperty("data")) ? response.comments.data : []
                  apiResolve()
                }
              })
            }, a.waitTime)
          })
        })).then(() => {
          determineWinningBids(allPostsAndAttachments)
        }).catch((error) => {
          //TODO: Stop the rest of the promises from executing
          setShowErrorModal({ show: true, error: error })
        })
      }).catch((error) => {
        //TODO: Stop the rest of the promises from executing
        setShowErrorModal({ show: true, error: error })
      })
    }
  }


  function determineWinningBids(postsItemsAndComments) {
    const firstNumRegEx = /\d+/
    console.log("postsItemsAndComments", postsItemsAndComments)
    console.log("auctionEndDateTime", auctionEndDateTime.current)
    let aeDate = auctionEndDateTime.current
    let postsWithItems = postsItemsAndComments.filter((p) => p.items != null)
    let allItems = postsWithItems.map((a) => a.items).flat()
    console.log("all items", allItems)
    let bidWinners = allItems.map((a) => {
      console.log("Item: ", a.itemNum, " ", a.description)
      if (a.comments.length > 0 == true) {
        let allowedComments = a.comments.filter((c) => {
          let cDate = new Date(c.created_time)
          return isBefore(cDate, aeDate)
        })
        let maxBid = Math.max(...allowedComments.map((c) => {
          let num = c.message.match(firstNumRegEx)
          return num ? num[0] : 0
        }))
        let winningBids = allowedComments.filter((c) => {
          let num = c.message.match(firstNumRegEx)
          let bid = num ? num[0] : 0
          return bid == maxBid
        })
        winningBids = winningBids.sort((a, b) => {
          let aTime = new Date(a.created_time)
          let bTime = new Date(b.created_time)
          if (aTime < bTime) {
            return -1
          } else if (aTime > bTime) {
            return 1
          } else {
            return 0
          }
        })
        console.log("winning bids")
        console.log(winningBids)
        if (winningBids.length > 0) {
          return ({ id: a.id, itemNum: a.itemNum, description: a.description, winner: { person: 'unknown', winningBid: maxBid, bidTime: winningBids[0].created_time } })
        } else {
          console.log('no bids')
          return ({ id: a.id, itemNum: a.itemNum, description: a.description, winner: { person: 'no bidders', winningBid: 0, bidTime: null } })
        }
      } else {
        console.log('no bids')
        return ({ id: a.id, itemNum: a.itemNum, description: a.description, winner: { person: 'no bidders', winningBid: 0, bidTime: null } })
      }
    })
    console.log('bid winners')
    console.log(bidWinners)
    bidWinners = bidWinners.sort((a, b) => {
      if (a.itemNum < b.itemNum) {
        return -1
      } else if (a.itemNum > b.itemNum) {
        return 1
      } else {
        return 0
      }
    })
    setWinningBids(bidWinners)
  }


  function onCopyWinners() {
    let byPerson = winningBids.sort((a, b) => {
      if (a.winner.person == b.winner.person) {
        if (a.itemNum < b.itemNum) {
          return -1
        } else if (a.itemNum > b.itemNum) {
          return 1
        } else {
          return 0
        }
      } else {
        return a.winner.person.localeCompare(b.winner.person)
      }
    })
    let winnerPost = "The winners for this auction are:\r"
    let currentPerson = ""
    console.log(winningBids)
    byPerson.forEach((item) => {
      console.log(item)
      if (item.winner.person != currentPerson) {
        currentPerson = item.winner.person
        winnerPost = winnerPost + "\r" + currentPerson + " won the following items:\r\r"
      }
      winnerPost = winnerPost + "   " + item.itemNum + " - " + item.description + " @ $" + item.winner.winningBid + "\r"
    })
    copy(winnerPost)
  }

  const { onDownload } = useDownloadExcel({
    currentTableRef: winnersTableRef.current,
    filename: "winningBids",
    sheet: "winners"
  })

  const handlePostCheckChange = (event) => {
    console.log(checkedPosts)
    const { name, checked } = event.target;
    let count = checkedPosts.count
    if (checked == true) {
      count = count + 1
    } else {
      count = count - 1
    }
    setcheckedPosts((prev) => ({ ...prev, [name]: checked, count: count }));
  }

  function getPostChecks(props) {
    return posts.map((p) => {
      return (
        <Row key={p.id}>
          <div className="checkbox d-inline">
            <Form.Control type="checkbox" onChange={handlePostCheckChange} name={p.id} id={p.id} checked={checkedPosts[p.id] || false} />
            <Form.Label htmlFor={p.id} className="cr">
              {p.post}
            </Form.Label>
          </div>
        </Row>
      );
    })
  }

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col xs={3}>
                  <Card.Img src={facebookAuctionImg} alt="CardImageCap" />
                </Col>
              </Row>
              <br />
              <Row>
                <Col md="auto">
                  <Button className="btn-rounded" disabled variant="light" size="sm"><b>1</b></Button>
                </Col>
                <Col md="8">
                  <Card.Text style={{ marginBottom: 2 }}>Set date and time for choosing winning bids. Winning bid must be before selected time. </Card.Text>
                  <Datetime initialValue={auctionEndDateTime.current} onChange={setAuctionEndDateTime} dateFormat="dddd D MMMM Y - z" inputProps={{ placeholder: 'Select Date & Time' }} />
                </Col>
              </Row>
              <br />
              <Row>
                <Col md="auto">
                  <Button className="btn-rounded" disabled variant="light" size="sm">2</Button>
                </Col>
                <Col md="8">
                  <Button className="text-capitalize" onClick={onGetPosts} variant="secondary">
                    Get Posts
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col md="auto">
                  <Button className="btn-rounded" disabled variant="light" size="sm">3</Button>
                </Col>
                <Col md="8">
                  <Card.Text style={{ marginBottom: 10 }}>Select the posts and items for auction comment processing.</Card.Text>
                  {isLoadingPosts &&
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                      <br /><br />
                    </div>
                  }
                  {!isLoadingPosts && !posts &&
                    <Card.Text style={{ marginBottom: 10 }}><i>Press Get Posts button to load posts.</i><br /><br /></Card.Text>
                  }{!isLoadingPosts && posts &&
                    <Form.Group >
                      <Col>
                        {getPostChecks()}
                        <br />
                      </Col>
                    </Form.Group>
                  }
                </Col>
              </Row>
              <Row>
                <Col md="auto">
                  <Button className="btn-rounded" disabled variant="light" size="sm">4</Button>
                </Col>
                <Col md="8">
                  <Button className="text-capitalize" disabled={checkedPosts.count == 0} onClick={onGetBidWinners} variant="secondary">
                    Get Bid Winners
                  </Button>
                  <Button className="btn-rounded" disabled variant="light" size="sm">5</Button>
                  <Button className="text-capitalize" disabled={!winningBids} onClick={onCopyWinners} variant="secondary">
                    Copy Winners
                  </Button>
                  <Button className="btn-rounded" disabled variant="light" size="sm">6</Button>
                  <Button className="text-capitalize" disabled={!winningBids} onClick={onDownload} variant="secondary">
                    Download Winners
                  </Button>
                </Col>
              </Row>                           
              <Table ref={winnersTableRef} responsive >
                  <tbody>
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th>Winner</th>
                      <th>Winning Bid</th>
                      <th>Time of Bid</th>
                    </tr>
                    {winningBids &&
                      winningBids.map((item) => (
                        <tr key={item.id}>
                          <td>{item.itemNum}</td>
                          <td>{item.description}</td>
                          <td>{item.winner.person}</td>
                          <td>{item.winner.winningBid}</td>
                          <td>{item.winner.bidTime}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
                {isLoadingBids &&
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                    <br /><br />
                  </div>
                }
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AnimatedModal visible={showErrorModal.show} onClose={() => setShowErrorModal({ show: false, error: "" })} animation='zoom'>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Facebook Error</Card.Title>
          </Card.Header>
          <Card.Body>
            Posters encountered an error while retreiving data from Facebook. Please try again later.
            <br /><br />
            Error: {showErrorModal.error}
          </Card.Body>
          <Card.Footer className="text-center">
            <Button onClick={() => setShowErrorModal({ show: false, error: "" })} className="btn btn-primary md-close">
              Close
            </Button>
          </Card.Footer>
        </Card>
      </AnimatedModal>
    </React.Fragment>
  );
};

export default postersOnlineAuction;
