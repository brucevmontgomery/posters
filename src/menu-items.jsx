// third party
import { FormattedMessage } from 'react-intl';

const menuItems = {
  items: [   
    {
      id: 'autoClerk',
      title: 'Auto-Clerk On-Line Sales',
      type: 'group',
      icon: 'icon-autoclerk',
      children: [
        {
          id: 'posters-launch',
          title: <FormattedMessage id="posters-launch" />,
          type: 'item',
          url: '/posters-launch',
          classes: 'nav-item',
          icon: 'fa fa-comments-dollar'
        },
        {
          id: 'posters-live-sale',
          title: <FormattedMessage id="posters-live-sale" />,
          type: 'item',
          url: '/posters-live-sale',
          classes: 'nav-item',
          icon: 'fa fa-comments-dollar'
        },
        {
          id: 'posters-flash-sale',
          title: <FormattedMessage id="posters-flash-sale" />,
          type: 'item',
          url: '/posters-flash-sale',
          classes: 'nav-item',
          icon: 'fa fa-comments-dollar'
        },
        {
          id: 'posters-online-auction',
          title: <FormattedMessage id="posters-online-auction" />,
          type: 'item',
          url: '/posters-online-auction',
          classes: 'nav-item',
          icon: 'fa fa-comments-dollar'
        }
      ]
    }
  ]
};

export default menuItems;
