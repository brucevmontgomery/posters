// third party
import { FormattedMessage } from 'react-intl';

const menuItems = {
  items: [
    {
      id: 'pages',
      title: <FormattedMessage id="pages" />,
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: <FormattedMessage id="auth" />,
          type: 'collapse',
          icon: 'feather icon-lock',
          children: [
            {
              id: 'signup-1',
              title: <FormattedMessage id="signup-1" />,
              type: 'item',
              url: '/auth/signup-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'signin-1',
              title: <FormattedMessage id="signin-1" />,
              type: 'item',
              url: '/auth/signin-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'reset-password-1',
              title: <FormattedMessage id="reset-password-1" />,
              type: 'item',
              url: '/auth/reset-password-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'change-password',
              title: <FormattedMessage id="change-password" />,
              type: 'item',
              url: '/auth/change-password',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'profile-settings',
              title: <FormattedMessage id="profile-settings" />,
              type: 'item',
              url: '/auth/profile-settings',
              target: true,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'maintenance',
          title: <FormattedMessage id="maintenance" />,
          type: 'collapse',
          icon: 'feather icon-sliders',
          children: [
            {
              id: 'error',
              title: <FormattedMessage id="error" />,
              type: 'item',
              url: '/maintenance/error',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'coming-soon',
              title: <FormattedMessage id="coming-soon" />,
              type: 'item',
              url: '/maintenance/coming-soon',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'offline-ui',
              title: <FormattedMessage id="offline-ui" />,
              type: 'item',
              url: '/maintenance/offline-ui',
              target: true,
              breadcrumbs: false
            }
          ]
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'sample-page',
          title: <FormattedMessage id="sample-page" />,
          type: 'item',
          url: '/sample-page',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'documentation',
          title: <FormattedMessage id="documentation" />,
          type: 'item',
          icon: 'feather icon-book',
          classes: 'nav-item',
          url: 'https://codedthemes.gitbook.io/datta/',
          target: true,
          external: true
        }
      ]
    }
  ]
};

export default menuItems;
