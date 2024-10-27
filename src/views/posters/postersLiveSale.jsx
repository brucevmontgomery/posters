import React from 'react';

// react-bootstrap
import { Row, Col, Card, Button } from 'react-bootstrap';

// project import
//import Card from '../../components/Card/MainCard';

import facebookLiveImg from '../../assets/images/auction/facebook-live-sale.jpg'

// ==============================|| SAMPLE PAGE ||============================== //

const postersLiveSale = () => {
  return (
    <React.Fragment>
      <Row>
        <Col md={6} xl={4}>
          <Card className="d-flex justify-content-center align-items-center">
            <Card.Img variant="top" src={facebookLiveImg} alt="CardImageCap" />
            <Card.Body>

            </Card.Body>
          </Card>
        </Col>        
      </Row>
    </React.Fragment>
  );
};

export default postersLiveSale;
