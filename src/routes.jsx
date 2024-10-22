import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import GuestGuard from './components/Auth/GuestGuard';
import AuthGuard from './components/Auth/AuthGuard';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    guard: GuestGuard,
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    guard: GuestGuard,
    path: '/signup',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    guard: GuestGuard,
    path: '/reset-password',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    exact: 'true',
    path: '/404',
    element: lazy(() => import('./views/errors/NotFound404'))
  },
  {
    exact: 'true',
    path: '/maintenance/coming-soon',
    element: lazy(() => import('./views/maintenance/ComingSoon'))
  },
  {
    exact: 'true',
    path: '/maintenance/error',
    element: lazy(() => import('./views/maintenance/Error'))
  },
  {
    exact: 'true',
    path: '/maintenance/offline-ui',
    element: lazy(() => import('./views/maintenance/OfflineUI'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    exact: 'true',
    path: '/auth/change-password',
    element: lazy(() => import('./views/auth/ChangePassword'))
  },
  {
    exact: 'true',
    path: '/auth/profile-settings',
    element: lazy(() => import('./views/auth/ProfileSettings'))
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
