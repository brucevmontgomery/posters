import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';

// third party
import { IntlProvider } from 'react-intl';

// auth provider
import { FacebookProvider as AuthProvider } from './contexts/FacebookContext';

// project import
import routes, { renderRoutes } from './routes';
import { ConfigContext } from 'contexts/ConfigContext';

function loadLocaleData(i18n) {
  return import('utils/locales/en.json');
}

// ==============================|| APP ||============================== //

const App = () => {
  const configContext = useContext(ConfigContext);
  const { i18n } = configContext.state;
  const [messages, setMessages] = useState();

  useEffect(() => {
    loadLocaleData(i18n).then((d) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <>
      {messages && (
        <IntlProvider locale={i18n} defaultLocale="en" messages={messages}>
          <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
            <AuthProvider>{renderRoutes(routes)}</AuthProvider>
          </BrowserRouter>
        </IntlProvider>
      )}
    </>
  );
};

export default App;
