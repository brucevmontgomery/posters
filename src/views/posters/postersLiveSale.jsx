import React, { useState, useRef } from 'react'

// react-bootstrap
import { Row, Col, Card, Button, InputGroup, Form, FormControl, DropdownButton, Dropdown, Table } from 'react-bootstrap'
import AnimatedModal from '../../components/Modal/AnimatedModal'

import { useDownloadExcel } from 'react-export-table-to-excel'

import facebookLiveImg from '../../assets/images/auction/facebook-live-sale.jpg'

import { useTestData, postAttachmentsLimit, attachmentCommentsLimit, groupPosts, testAllPostsAndAttachments } from '../posters/postersTestData'

// ==============================|| SAMPLE PAGE ||============================== //

const postersLiveSale = () => {
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState({ show: false, error: "" })
  const [posts, setPosts] = useState(null)
  const [checkedPosts, setcheckedPosts] = useState({ count: 0 })
  const pageAccessToken = useRef(null)
  const [winningBids, setWinningBids] = useState(null)
  const winnersTableRef = useRef(null)

  function getGroupPosts(callback) {
    FB.api(`308365803341085?fields=access_token`, function (response) {
      FB.api(`308365803341085?fields=name,feed.limit(10)&access_token=${response.access_token}`, function (feedResponse) {
        pageAccessToken.current = response.access_token
        callback(feedResponse)
      })
    })
  }

  function onGetPosts() {

    function setPostsAndDefaultChecks(posts) {
      let postTitlePattern = /^\s*\bwas live/
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

  function onGetBuyers() {

    function transformComments(comments) {
      return comments.map((c) => {
        let ct = new Date(c.created_time)
        let bt = `${ct.getMonth().toString().padStart(2, '0')}/${ct.getDate().toString().padStart(2, '0')}/${ct.getFullYear()} ${ct.getHours().toString().padStart(2, '0')}:${ct.getMinutes().toString().padStart(2, '0')}:${ct.getSeconds().toString().padStart(2, '0')}`
        return ({
          person: "unknown",
          message: c.message,
          bidTime: bt
        })
      })
    }

    function getComments(postId, nextAPICall, apiCallWaitStep, results = []) {
      let apiCall = ''
      if (postId != null) {
        apiCall = `${postId}/?fields=comments.limit(${attachmentCommentsLimit})&access_token=${pageAccessToken.current}`
      } else {
        apiCall = nextAPICall
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("apiCall")
          console.log(apiCall)
          FB.api(apiCall, function (response) {
            console.log("response")
            console.log(response)
            if (response?.comments?.data || response?.data) {
              let comments = []
              let pagingObj = null
              if(response?.data) {
                comments = response.data
                pagingObj = response
              } else {
                comments = response.comments.data
                pagingObj = response.comments
              }               
              console.log(results)
              console.log(comments)
              results.push(...comments)
              console.log("comments")
              console.log(results)
              if (pagingObj?.paging?.next) {
                console.log("recurse")
                resolve(getComments(null, pagingObj.paging.next, apiCallWaitStep, results))
              } else {
                resolve(results)
              }
            } else {
              resolve(results)
            }
          })
        }, apiCallWaitStep)
      })
    }

    if (useTestData == true) {
      console.log("before call to determineWinningBids")
      console.log(testItemsAndBidders)
      setWinningBids(transformComments(testLiveAuctionComments)) 
    } else {
      let postIds = Object.entries(checkedPosts).filter(([key, value]) => key != "count").map((e) => e[0])
      let allPostsAndAttachments = posts
      let apiCount = 0
      let apiCallGroupSize = 1
      let apiCallWaitStep = 2000
      let apiCallWaitTime = -apiCallWaitStep
      console.log("get bid winners")
      console.log(postIds)
      console.log("start")
      console.log(new Date())
      //TODO: This just needs to get the comments on the selected post. Does not need to process attachments.
      //TODO: Need to page through the comments. We can expect 100s to 1000s of comments per live auction
      //This code just sets up the first call. Will need to modify to use setTimeout around each page call
      console.log("page access token")
      console.log(pageAccessToken.current)
      let postIdx = allPostsAndAttachments.findIndex(post => post.id === postIds[0])
      getComments(postIds[0], null, apiCallWaitStep)
        .then(allComments => {
          console.log("allComments")
          console.log(allComments)
          allPostsAndAttachments[postIdx].comments = allComments
          setWinningBids(transformComments(allComments))
        })
    }
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
                  <Card.Img src={facebookLiveImg} alt="CardImageCap" />
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
                  <Card.Text style={{ marginBottom: 10 }}>Select the posts and items for sale comment processing.</Card.Text>
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
                <br /><br /><br />
              </Row>
              <Table ref={winnersTableRef} responsive >
                <tbody>
                  <tr>
                    <th>id</th>
                    <th>from</th>
                    <th>from_id</th>
                    <th>created_time</th>
                    <th>message</th>
                    <th>comments_count</th>
                    <th>reactions_count</th>
                  </tr>
                  {winningBids &&
                    winningBids.map((item, index) => (
                      <tr key={index}>
                        <td></td>
                        <td>{item.person}</td>
                        <td></td>
                        <td>{item.bidTime}</td>
                        <td>{item.message}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
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

export default postersLiveSale;
