import PropTypes from 'prop-types';
import React, { useState } from 'react';

// react-bootstrap
import { Row, Col, Alert, Button } from 'react-bootstrap';

// project import
import useAuth from '../../../hooks/useAuth';
import useScriptRef from '../../../hooks/useScriptRef';

// ==============================|| AUTH0 LOGIN ||============================== //

const Auth0Login = ({ className, ...rest }) => {
  const { isInitialized, login, checkLoginState } = useAuth();
  const [error, setError] = useState(null);
  const scriptedRef = useScriptRef();

  console.log(`isInitialized = ${isInitialized}`)

  const loginHandler = async () => {
    try {
      await login();
    } catch (err) {
      if (scriptedRef.current) {
        setError(err.message);
      }
    }
  };

  return (
    <React.Fragment>
      <div className={className} {...rest}>
        <Row>
          {error && (
            <Col sm={12}>
              <Alert variant="danger">{error}</Alert>
            </Col>
          )}
          <Col sm={12}>
            <Button onClick={loginHandler} disabled={!isInitialized} variant="primary" className="btn-block mb-4">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <i className="fab fa-3x fa-facebook-square" style={{ marginRight: '10px' }}/> Connect with Facebook
              </div>
            </Button> 
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

Auth0Login.propTypes = {
  className: PropTypes.string
};

export default Auth0Login;
