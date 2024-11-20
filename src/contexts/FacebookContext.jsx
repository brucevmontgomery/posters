import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// reducer - state management
import { LOGIN, LOGOUT } from '../store/actions';
import authReducer from '../store/accountReducer';

// project import
import Loader from '../components/Loader/Loader';

const fbOptions = {
  appId: '3973808396174125',
  cookie: true,
  xfbml: true,
  version: 'v20.0'
}

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: {userName: "Login"}
};

// ==============================|| Facebook CONTEXT & PROVIDER ||============================== //


{/* 
  This text and code examples are from the Facebook documentation.

  2. Set Up the Facebook SDK for Javascript
  The Facebook SDK for JavaScript doesn't have any standalone files that need to be downloaded or installed, 
  instead you simply need to include a short piece of regular JavaScript in your HTML that will asynchronously 
  load the SDK into your pages. The async load means that it does not block loading other elements of your page.

  <script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '{fbOptions.appId}',
      cookie     : true,
      xfbml      : true,
      version    : '{fbOptions.sdkVersion}'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script> 

3. Check Login Status
The first step when loading your web page is figuring out if a person is already logged into your app with Facebook login. 
You start that process with a call to FB.getLoginStatus. That function will trigger a call to Facebook to get the login status and call your callback function with the results.
Taken from the sample code above, here's some of the code that's run during page load to check a person's login status:

FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});

The response object that's provided to your callback contains a number of fields:

{
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn:'...',
        signedRequest:'...',
        userID:'...'
    }
}

status specifies the login status of the person using the app. The status can be one of the following:
connected - the person is logged into Facebook, and has logged into your app.
not_authorized - the person is logged into Facebook, but has not logged into your app.
unknown - the person is not logged into Facebook, so you don't know if they've logged into your app or FB.logout() was called before and therefore, it cannot connect to Facebook.

authResponse is included if the status is connected and is made up of the following:
accessToken - contains an access token for the person using the app.
expiresIn - indicates the UNIX time when the token expires and needs to be renewed.
signedRequest - a signed parameter that contains information about the person using the app.
userID - the ID of the person using the app.

Once your app knows the login status of the person using it, it can do one of the following:
If the person is logged into Facebook and your app, redirect them to your app's logged in experience.
If the person isn't logged into your app, or isn't logged into Facebook, prompt them with the Login dialog with FB.login() or show them the Login Button.

4. Add the Facebook Login Button

Including the Login Button into your page is easy. Visit the documentation for the login button and set the button up 
the way you want. Then click Get Code and it will show you the code you need to display the button on your page.
The onlogin attribute on the button to set up a JavaScript callback that checks the login status to see if the person 
logged in successfully:


<fb:login-button 
  scope="public_profile,email"
  onlogin="checkLoginState();">
</fb:login-button>

This is the callback. It calls FB.getLoginStatus() to get the most recent login state. (statusChangeCallback() is 
a function that's part of the example that processes the response.)


function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

*/}

const FacebookContext = createContext(null);

export const FacebookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function checkLoginState() {
    FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }

  function statusChangeCallback(response) {
    console.log("status")
    console.log(response);
    if (response.status === 'connected') {
      console.log("logged in!")
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user: {name: "unknown"}
        }
      });
    } else {
      console.log('please login')
      dispatch({
        type: LOGOUT
      });
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        window.fbAsyncInit = function () {
          FB.init(fbOptions);
          FB.AppEvents.logPageView();
          checkLoginState()
        };

        (function (d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) { return; }
          js = d.createElement(s);
          js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

      } catch (err) {
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (options) => {
    FB.login(function (response) {
      let userInfo = {
        userName: '',
        id: response.authResponse.userID,
        accessToken: response.authResponse.accessToken,
        grantedScopes: response.authResponse.grantedScopes
      }
      console.log(userInfo)
      if (response.status === 'connected') {
        FB.api(`${userInfo.id}`, function (response) {
          userInfo.userName = response.name
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: userInfo
            }
          })
        })
      }
    }, {
      //TODO: reduce permissions to only those that are actually required
      //scope: 'pages_show_list,read_insights,business_management,pages_read_engagement,pages_read_user_content,pages_manage_posts,pages_manage_engagement',
      scope: 'business_management,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_engagement',
      //read_insights,pages_show_list,business_management,pages_read_engagement,pages_read_user_content,pages_manage_posts,pages_manage_engagement
      return_scopes: true
    })
  };

  const logout = () => {
    //use FB.logout....

    dispatch({
      type: LOGOUT
    });
  };

  const resetPassword = async () => { };

  const updateProfile = () => { };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <FacebookContext.Provider value={{ ...state, login, logout, resetPassword, updateProfile, checkLoginState }}>{children}</FacebookContext.Provider>;
};

FacebookProvider.propTypes = {
  children: PropTypes.node
};

export default FacebookContext;
