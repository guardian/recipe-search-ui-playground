import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainSearchComponent } from './app/MainSearch';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainSearchComponent/>
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
