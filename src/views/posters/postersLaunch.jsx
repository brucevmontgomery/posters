import React from 'react';

// react-bootstrap
import { Row, Col, Card, Button } from 'react-bootstrap';

// project import
//import Card from '../../components/Card/MainCard';

import facebookLiveImg from '../../assets/images/auction/facebook-live-sale.jpg'
import facebookFlashImg from '../../assets/images/auction/facebook-flash-sale.jpg'
import facebookAuctionImg from '../../assets/images/auction/facebook-online-auction.jpg'
import { Link } from 'react-router-dom';

// ==============================|| SAMPLE PAGE ||============================== //

const postersLaunch = () => {
  return (
    <React.Fragment>
      <Row>
        <Col md={6} xl={4}>
          <Card className="d-flex justify-content-center align-items-center">
            <Card.Img variant="top" src={facebookLiveImg} alt="CardImageCap" />
            <Card.Body>
              <Link to="/posters-live-sale">
                <Button className="text-capitalize" variant="primary" style={{ width: '180px' }}>
                  Clerk Live Sale
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4}>
          <Card className="d-flex justify-content-center align-items-center">
            <Card.Img variant="top" src={facebookFlashImg} alt="CardImageCap" />
            <Card.Body>
              <Link to="/posters-flash-sale">
                <Button className="text-capitalize" variant="primary" style={{ width: '180px' }}>
                  Clerk Flash Sale
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4} >
          <Card className="d-flex justify-content-center align-items-center">
            <Card.Img variant="top" src={facebookAuctionImg} alt="CardImageCap" />
            <Card.Body>
              <Link to="/posters-online-auction">
                <Button className="text-capitalize" variant="primary" style={{ width: '180px' }}>
                  Clerk Online Auction
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default postersLaunch;
