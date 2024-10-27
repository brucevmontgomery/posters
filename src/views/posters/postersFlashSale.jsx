import React from 'react';

// react-bootstrap
import { Row, Col, Card, Button } from 'react-bootstrap';

// project import
//import Card from '../../components/Card/MainCard';

import facebookFlashImg from '../../assets/images/auction/facebook-flash-sale.jpg'

// ==============================|| SAMPLE PAGE ||============================== //

const postersFlashSale = () => {
  return (
    <React.Fragment>
      <Row>
        <Col md={6} xl={4}>
          <Card className="d-flex justify-content-center align-items-center">
            <Card.Img variant="top" src={facebookFlashImg} alt="CardImageCap" />
            <Card.Body>

            </Card.Body>
          </Card>
        </Col>        
      </Row>
    </React.Fragment>
  );
};

export default postersFlashSale;
