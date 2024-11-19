import React, { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from './routes';
import { UserProvider } from './context/UserContext';

const App = () => {
  // Create router once outside of render to avoid recreation
  const router = React.useMemo(() => createBrowserRouter(routes), []);

  return (
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </Suspense>
    </React.StrictMode>
  );
};

export default React.memo(App);
