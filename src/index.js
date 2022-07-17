import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import introduction from "./redux/reducers/introduction";
import "antd/dist/antd.css";
import "antd/dist/antd.less";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Bannerimages from "./pages/banner_images/banner_images.jsx";
import Brand from "./pages/brand/brand";
import Category from "./pages/category/category";
import User from "./pages/users/User";
import Product from "./pages/product/product";

import axios from "axios";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const token = localStorage.getItem("token");

axios.defaults.headers.post["Content-Type"] = "multipart/formdata";
axios.defaults.headers.common["authorization"] = "Bearer " + token;
axios.defaults.baseURL = "http://localhost:3001/api";

const rootReducer = combineReducers({
  introduction: introduction,
});
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/banner_images" element={<Bannerimages />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/category" element={<Category />} />
        <Route path="/user" element={<User />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
