import React, { useState, useRef } from 'react'

// react-bootstrap
import { Row, Col, Card, Button, InputGroup, Form, FormControl, DropdownButton, Dropdown, Table } from 'react-bootstrap'
import AnimatedModal from '../../components/Modal/AnimatedModal'

import { useDownloadExcel } from 'react-export-table-to-excel'

import facebookLiveImg from '../../assets/images/auction/facebook-live-sale.jpg'

import { useTestData, attachmentCommentsLimit, groupPosts } from '../posters/postersTestData'
import { testDataLiveSale } from '../posters/postersTestDataLiveSale'

// ==============================|| SAMPLE PAGE ||============================== //

const postersLiveSale = () => {
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState({ show: false, error: "" })
  const [posts, setPosts] = useState(null)
  const [checkedPosts, setcheckedPosts] = useState({ count: 0 })
  const pageAccessToken = useRef(null)
  const [isLoadingBids, setIsLoadingBids] = useState(false)
  const [winningBids, setWinningBids] = useState(null)
  const winnersTableRef = useRef(null)

  function getGroupPosts(callback) {
    FB.api(`308365803341085?fields=access_token`, function (response) {
      if (response?.error) {
        callback(response)
      } else {
        FB.api(`308365803341085?fields=name,feed.limit(10)&access_token=${response.access_token}`, function (feedResponse) {
          if (feedResponse?.error) {
            callback(feedResponse)
          } else {
            pageAccessToken.current = response.access_token
            callback(feedResponse)
          }
        })
      }
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
        post: p?.message ? p.message : p.story,
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
          console.log(response)
          setIsLoadingPosts(false)
          setPostsAndDefaultChecks(response)
        }
      })
    }
  }

  function onGetBuyers() {

    function transformComments(comments) {
      let sortedComments = comments.sort((a, b) => {
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
      return sortedComments.map((c) => {
        let ct = new Date(c.created_time)
        let bt = `${ct.getMonth().toString().padStart(2, '0')}/${ct.getDate().toString().padStart(2, '0')}/${ct.getFullYear()} ${ct.getHours().toString().padStart(2, '0')}:${ct.getMinutes().toString().padStart(2, '0')}:${ct.getSeconds().toString().padStart(2, '0')}`
        return ({
          person: c?.from?.name ? c?.from?.name : "unknown",
          message: c.message,
          bidTime: bt
        })
      })
    }

    //TODO: look at playground2 to handle recursive promises with error handling
    function getComments(postId, nextAPICall, apiCallWaitStep, results = []) {
      let apiCall = ''
      if (postId != null) {
        apiCall = `${postId}/?fields=comments.limit(${attachmentCommentsLimit})&access_token=${pageAccessToken.current}`
      } else {
        apiCall = nextAPICall
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          FB.api(apiCall, function (response) {
            if (response?.error) {
              reject(response.error.message)
            } else {
              if (response?.comments?.data || response?.data) {
                let comments = []
                let pagingObj = null
                if (response?.data) {
                  comments = response.data
                  pagingObj = response
                } else {
                  comments = response.comments.data
                  pagingObj = response.comments
                }
                results.push(...comments)
                if (pagingObj?.paging?.next) {
                  getComments(null, pagingObj.paging.next, apiCallWaitStep, results)
                    .then((val) => {
                      resolve(val)
                    })
                    .catch((error) => {reject(error)})
                } else {
                  resolve(results)
                }
              } else {
                resolve(results)
              }
            }
          })
        }, apiCallWaitStep)
      })
    }

    setIsLoadingBids(true)
    if (useTestData == true) {
      setTimeout(() => {
        console.log(testDataLiveSale)
        setIsLoadingBids(false)
        setWinningBids(transformComments(testDataLiveSale))
      }, 2000)
    } else {
      let postIds = Object.entries(checkedPosts).filter(([key, value]) => key != "count").map((e) => e[0])
      let apiCallWaitStep = 3000
      //TODO: handle error handling for getComments
      getComments(postIds[0], null, apiCallWaitStep)
        .then(allComments => {
          console.log("allComments")
          console.log(allComments)
          setIsLoadingBids(false)
          setWinningBids(transformComments(allComments))
        })
        .catch((error) => {
          console.log(error)
          setIsLoadingBids(false)
          setShowErrorModal({ show: true, error: error })
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

export default postersLiveSale;
