import React, { useState, useRef } from 'react'

import { toZonedTime } from 'date-fns-tz'
import { isSunday, isWednesday, previousSunday, isAfter, previousWednesday } from "date-fns"

// react-bootstrap
import { Row, Col, Card, Button, InputGroup, Form, FormControl, DropdownButton, Dropdown, Table } from 'react-bootstrap'
import AnimatedModal from '../../components/Modal/AnimatedModal'

import Datetime from 'react-datetime'
import 'moment-timezone'

import { useDownloadExcel } from 'react-export-table-to-excel'
import copy from 'copy-to-clipboard'

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
  const [showErrorModal, setShowErrorModal] = useState({ show: false, error: "" })
  const [posts, setPosts] = useState(null)
  const [winningBids, setWinningBids] = useState(null)
  const winnersTableRef = useRef(null)

  function setAuctionEndDateTime(newValue) {
    auctionEndDateTime.current = newValue
  }

  //Online auction group id = 2119358545044791

  function onGetBidWinners() {

  }

  function onCopyWinners() {

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
                  <Card.Text style={{ marginBottom: 10 }}>Copy and paste online auction post ids from Facebook URLs.</Card.Text>
                  <Form.Group className="d-inline-flex align-items-center" style={{ marginBottom: 15 }}>
                    <Form.Label column sm={4} className="mb-0">Post 1 of #:</Form.Label>
                    <FormControl  placeholder="Post Id" aria-label="Post Id" aria-describedby="basic-addon2" />
                  </Form.Group>
                  <br />
                  <Form.Group className="d-inline-flex align-items-center" style={{ marginBottom: 15 }}>
                    <Form.Label column sm={4} className="mb-0">Post 2 of #:</Form.Label>
                    <FormControl placeholder="Post Id" aria-label="Post Id" aria-describedby="basic-addon2" />
                  </Form.Group>
                  <br /><Form.Group className="d-inline-flex align-items-center" style={{ marginBottom: 15 }}>
                    <Form.Label column sm={4} className="mb-0">Post 3 of #:</Form.Label>
                    <FormControl placeholder="Post Id" aria-label="Post Id" aria-describedby="basic-addon2" />
                  </Form.Group>
                  <br /><Form.Group className="d-inline-flex align-items-center" style={{ marginBottom: 15 }}>
                    <Form.Label column sm={4} className="mb-0">Post 4 of #:</Form.Label>
                    <FormControl placeholder="Post Id" aria-label="Post Id" aria-describedby="basic-addon2" />
                  </Form.Group>
                  <br /><Form.Group className="d-inline-flex align-items-center" style={{ marginBottom: 15 }}>
                    <Form.Label column sm={4} className="mb-0">Post 5 of #:</Form.Label>
                    <FormControl placeholder="Post Id" aria-label="Post Id" aria-describedby="basic-addon2" />
                  </Form.Group>
                  <br />
                </Col>
              </Row>
              <br />
              <Row>
                <Col md="auto">
                  <Button className="btn-rounded" disabled variant="light" size="sm">3</Button>
                </Col>
                <Col md="8">
                  <Button className="text-capitalize" onClick={onGetBidWinners} variant="secondary">
                    Get Bid Winners
                  </Button>
                  <Button className="btn-rounded" disabled variant="light" size="sm">4</Button>
                  <Button className="text-capitalize" disabled={!winningBids} onClick={onCopyWinners} variant="secondary">
                    Copy Winners
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Button Addons</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InputGroup className="mb-3">
                    <Button>Button</Button>
                    <FormControl aria-describedby="basic-addon1" />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <FormControl placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <Button>Button</Button>
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <InputGroup className="mb-3">
                    <Button>Button</Button>
                    <Button variant="secondary">Button</Button>
                    <FormControl aria-describedby="basic-addon1" />
                  </InputGroup>


                  <InputGroup className="mb-3">

                    <FormControl placeholder="Sale post" aria-label="Sale post" aria-describedby="basic-addon2" />
                    <Button variant="secondary">Button</Button>
                    <Button>Button</Button>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <FormControl placeholder="Sale post" aria-label="Sale post" aria-describedby="basic-addon2" />
                    <Button variant="secondary">Button</Button>
                    <Button>Button</Button>
                  </InputGroup><InputGroup className="mb-3">
                    <FormControl placeholder="Sale post" aria-label="Sale post" aria-describedby="basic-addon2" />
                    <Button variant="secondary">Button</Button>
                    <Button>Button</Button>
                  </InputGroup><InputGroup className="mb-3">
                    <FormControl placeholder="Sale post" aria-label="Sale post" aria-describedby="basic-addon2" />
                    <Button variant="secondary">Button</Button>
                    <Button>Button</Button>
                  </InputGroup><InputGroup className="mb-3">
                    <FormControl placeholder="Sale post" aria-label="Sale post" aria-describedby="basic-addon2" />
                    <Button variant="secondary">Button</Button>
                    <Button>Button</Button>
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <h6 className="mt-5 text-muted">Buttons With Dropdown</h6>
                  <hr />
                  <InputGroup className="mb-3">
                    <DropdownButton as={InputGroup.Prepend} title="Dropdown" id="input-group-dropdown-1">
                      <Dropdown.Item href="#">Action</Dropdown.Item>
                      <Dropdown.Item href="#">Another action</Dropdown.Item>
                      <Dropdown.Item href="#">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="#">Separated link</Dropdown.Item>
                    </DropdownButton>
                    <FormControl aria-describedby="basic-addon1" />
                  </InputGroup>

                  <InputGroup>
                    <FormControl placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />

                    <DropdownButton as={InputGroup.Append} title="Dropdown" id="input-group-dropdown-2">
                      <Dropdown.Item href="#">Action</Dropdown.Item>
                      <Dropdown.Item href="#">Another action</Dropdown.Item>
                      <Dropdown.Item href="#">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="#">Separated link</Dropdown.Item>
                    </DropdownButton>
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <h6 className="mt-5 text-muted">Segmented Buttons</h6>
                  <hr />
                  <InputGroup className="mb-3">
                    <Dropdown as={InputGroup.Prepend}>
                      <Button variant="secondary">Action</Button>
                      <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic-1" />
                      <Dropdown.Menu>
                        <Dropdown.Item hred="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item hred="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item hred="#/action-3">Something else</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <FormControl aria-describedby="basic-addon1" />
                  </InputGroup>

                  <InputGroup>
                    <FormControl placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />

                    <Dropdown as={InputGroup.Append}>
                      <Button variant="secondary">Action</Button>
                      <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic-2" />
                      <Dropdown.Menu>
                        <Dropdown.Item hred="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item hred="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item hred="#/action-3">Something else</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </InputGroup>
                </Col>
              </Row>
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
