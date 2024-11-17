import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./Routes/root.jsx"
import './index.css';
import './App.css';
import App from './App.js';
import Bounties from './Components/Bounties.js';
// import BountyClaim from './Components/BountyClaim.js';
import Form from './Components/Form.js';
import reportWebVitals from './reportWebVitals';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
  },
  {
    path: "/form",
    element: <Form/>
  },
  {
    path:"/bounties",
    element: <Bounties/>,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <div className="App">
        <RouterProvider router={router} />
     </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
