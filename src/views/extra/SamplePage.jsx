import React from 'react';

// react-bootstrap
import { Row, Col, Card } from 'react-bootstrap';

// project import
//import Card from '../../components/Card/MainCard';

import facebookLiveImg from '../../assets/images/auction/facebook-live-sale.jpg'

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => {
  return (
    <React.Fragment>
      <Row>
        <Col md={6} xl={4}>
          <h5>Live Sale</h5>
          <hr />
          <Card>
            <Card.Img variant="top" src={facebookLiveImg} alt="CardImageCap" />
            <Card.Body>
              <Card.Title as="h5">Live Sale</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit
                longer.
              </Card.Text>
              <Card.Text>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4}>
          <h5>Flash Sale</h5>
          <hr />
          <Card>
            <Card.Img variant="top" src={facebookLiveImg} alt="CardImageCap" />
            <Card.Body>
              <Card.Title as="h5">Flash Sale</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit
                longer.
              </Card.Text>
              <Card.Text>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4}>
          <h5>Online Auction</h5>
          <hr />
          <Card>
            <Card.Img variant="top" src={facebookLiveImg} alt="CardImageCap" />
            <Card.Body>
              <Card.Title as="h5">Online Auction</Card.Title>
              <Card.Text>
                This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit
                longer.
              </Card.Text>
              <Card.Text>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SamplePage;
