import React, { useState, useRef } from 'react'

import { toZonedTime } from 'date-fns-tz'
import { isSunday, isWednesday, previousSunday, isAfter, previousWednesday } from "date-fns"

// react-bootstrap
import { Row, Col, Card, Button, Form, Table } from 'react-bootstrap';

import Datetime from 'react-datetime'
import 'moment-timezone'

import facebookAuctionImg from '../../assets/images/auction/facebook-online-auction.jpg'

// test data
import { useTestData, groupPosts } from '../posters/postersTestData'

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
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [posts, setPosts] = useState(null)
  const [checkedPosts, setcheckedPosts] = useState({ count: 0 })

  function setAuctionEndDateTime(newValue) {
    auctionEndDateTime.current = newValue
  }

  function getGroupPosts(callback) {
    FB.api(`2119358545044791?fields=name,feed`, function (response) {
      callback(response)
    })
  }

  function onGetPosts() {

    if (useTestData == true) {
      setIsLoadingPosts(true)
      setTimeout(() => {
        let data = groupPosts.feed.data.map((p) =>
        ({
          id: p.id,
          post: p.message,
          items: null
        }))
        setIsLoadingPosts(false)
        setPosts(data)
      }, 2000)
    } else {
      setIsLoadingPosts(true)
      getGroupPosts(function (response) {
        if (response?.error) {
          console.log("Facebook Error: ", response)
          setIsLoadingPosts(false)
        } else {
          let data = response.feed.data.map((p) =>
          ({
            id: p.id,
            post: p.message,
            items: null
          }))
          setIsLoadingPosts(false)
          setPosts(data)
        }
      })
    }
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

  const handlePostCheckChange = (event) => {
    const { name, checked } = event.target;
    let count = checkedPosts.count
    if (checked == true) {
      count = count + 1
    } else {
      count = count - 1
    }
    setcheckedPosts((prev) => ({ ...prev, [name]: checked, count: count }));
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default postersOnlineAuction;
