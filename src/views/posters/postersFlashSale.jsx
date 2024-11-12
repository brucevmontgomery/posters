import React, { useState, useRef } from 'react'

// react-bootstrap
import { Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import AnimatedModal from '../../components/Modal/AnimatedModal'

// project import
//import Card from '../../components/Card/MainCard';

import { useDownloadExcel } from 'react-export-table-to-excel'

import facebookFlashImg from '../../assets/images/auction/facebook-flash-sale.jpg'

import { useTestData, groupPosts, testFlashSale } from '../posters/postersTestData'

// ==============================|| SAMPLE PAGE ||============================== //

const postersFlashSale = () => {
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState({ show: false, error: "" })
  const [posts, setPosts] = useState(null)
  const [checkedPosts, setcheckedPosts] = useState({ count: 0 })
  const [isLoadingBids, setIsLoadingBids] = useState(false)
  const [winningBids, setWinningBids] = useState(null)
  const winnersTableRef = useRef(null)

  //Online auction group id = 2119358545044791
  function getGroupPosts(callback) {
    FB.api(`2119358545044791?fields=feed`, function (response) {
      callback(response)
    })
  }

  function onGetPosts() {

    function setPostsAndDefaultChecks(posts) {
      let postTitlePattern = useTestData ? /^\s*\bTEST\s*Flash\s*\s*Sale\s*/ : /^\s*\bFlash\s*\s*Sale\s*/
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

  function onGetBuyers() {
    let cancelAPI = false
    let APITimers = []
    setIsLoadingBids(true)
    if (useTestData == true) {
      setTimeout(() => {
        determineWinningBids(testFlashSale)
        setIsLoadingBids(false)
      }, 2000)
    } else {
      let postIds = Object.entries(checkedPosts).filter(([key, value]) => key != "count").map((e) => e[0])
      let allPostsAndAttachments = postsAndAttachments
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
            let internalTimer = setTimeout(() => {
              if (cancelAPI) {
                reject("cancel")
              } else {
                FB.api(`${postId}?fields=attachments{subattachments.limit(${postAttachmentsLimit}){target{id},description}}`, function (response) {
                  if (response?.error) {
                    reject(response.error.message)
                  } else {
                    let postIdx = allPostsAndAttachments.findIndex(post => post.id === postId)
                    allPostsAndAttachments[postIdx].items = transformPostAttachments(response.attachments.data[0].subattachments.data)
                    resolve()
                  }
                })
              }
            }, apiCallWaitTime)
            APITimers.push(internalTimer)
          })
        })
      ).then(() => {
        let apiCount = 0
        let apiCallGroupSize = 1
        let apiCallWaitStep = 3000
        let apiCallWaitTime = -apiCallWaitStep
        let commentAPICalls = postIds.map((postId) => {
          let postIdx = allPostsAndAttachments.findIndex(post => post.id === postId)
          let pItems = allPostsAndAttachments[postIdx].items
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
            let internalTimer = setTimeout(() => {
              if (cancelAPI) {
                reject("cancel")
              } else {
                FB.api(a.apiCall, function (response) {
                  if (response?.error) {
                    apiReject(response.error.message)
                  } else {
                    let itemIdx = allPostsAndAttachments[a.postIdx].items.findIndex(aItem => aItem.id === a.itemId)
                    allPostsAndAttachments[a.postIdx].items[itemIdx].comments = (response.hasOwnProperty("comments") && response.comments.hasOwnProperty("data")) ? response.comments.data : []
                    apiResolve()
                  }
                })
              }
            }, a.waitTime)
            APITimers.push(internalTimer)
          })
        })).then(() => {
          determineWinningBids(allPostsAndAttachments)
          setIsLoadingBids(false)
        }).catch((error) => {
          setIsLoadingBids(false)
          cancelAPI = true
          APITimers.forEach((t) => {
            clearTimeout(t)
          })
          setShowErrorModal({ show: true, error: error })
        })
      }).catch((error) => {
        setIsLoadingBids(false)
        cancelAPI = true
        APITimers.forEach((t) => {
          clearTimeout(t)
        })
        setShowErrorModal({ show: true, error: error })
      })
    }
  }

  function determineWinningBids(postsItemsAndComments) {
    const firstNumRegEx = /\d+/
    let aeDate = auctionEndDateTime.current
    let postsWithItems = postsItemsAndComments.filter((p) => p.items != null)
    let allItems = postsWithItems.map((a) => a.items).flat()
    let bidWinners = allItems.map((a) => {
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
        if (winningBids.length > 0) {
          return ({ id: a.id, itemNum: a.itemNum, description: a.description, winner: { person: 'unknown', winningBid: maxBid, bidTime: winningBids[0].created_time } })
        } else {
          return ({ id: a.id, itemNum: a.itemNum, description: a.description, winner: { person: 'no bidders', winningBid: 0, bidTime: null } })
        }
      } else {
        return ({ id: a.id, itemNum: a.itemNum, description: a.description, winner: { person: 'no bidders', winningBid: 0, bidTime: null } })
      }
    })
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
                  <Card.Img src={facebookFlashImg} alt="CardImageCap" />
                </Col>
              </Row>
              <br />
              <Row>
                <Col md="auto">
                  <Button className="btn-rounded" disabled variant="light" size="sm">1</Button>
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
                  <Button className="btn-rounded" disabled variant="light" size="sm">2</Button>
                </Col>
                <Col md="8">
                  <Card.Text style={{ marginBottom: 10 }}>Select the posts and items for flash sale comment processing.</Card.Text>
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
                  <Button className="btn-rounded" disabled variant="light" size="sm">3</Button>
                </Col>
                <Col md="8">
                  <Button className="text-capitalize" disabled={checkedPosts.count == 0} onClick={onGetBuyers} variant="secondary">
                    Get Buyers
                  </Button>
                  <Button className="btn-rounded" disabled variant="light" size="sm">4</Button>
                  <Button className="text-capitalize" disabled={!winningBids} onClick={onDownload} variant="secondary">
                    Download Buyers
                  </Button>
                </Col>
              </Row>
              <Table ref={winnersTableRef} responsive >
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Buyer</th>
                    <th>Quantity</th>
                    <th>Time of Offer</th>
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

export default postersFlashSale;
