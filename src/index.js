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
import Coupon from "./pages/coupon/coupon";
import Orders from "./pages/orders/order";
import NewsCategory from "./pages/news_category/news_category.jsx";
import News from "./pages/news/news.jsx";
import Online_credit from "./pages/online_credit/online_credit";
import BigCategory from "./pages/BigCategory.js/BigCategory";
import Invoice from "./pages/Invoice/Invoice";
import Pages from "./pages/Contact/Contact.jsx";
import About from "./pages/about/about.jsx";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const token = localStorage.getItem("token");

axios.defaults.headers.post["Content-Type"] = "multipart/formdata";
axios.defaults.headers.common["authorization"] = "Bearer " + token;
axios.defaults.baseURL = "http://localhost:80/api";

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
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/home" element={<Home />} />
        <Route path="/admin/banner_images" element={<Bannerimages />} />
        <Route path="/admin/brand" element={<Brand />} />
        <Route path="/admin/category" element={<Category />} />
        <Route path="/admin/bigcategory" element={<BigCategory />} />
        <Route path="/admin/user" element={<User />} />
        <Route path="/admin/product" element={<Product />} />
        <Route path="/admin/coupon" element={<Coupon />} />
        <Route path="/admin/order" element={<Orders />} />
        <Route path="/admin/invoice" element={<Invoice />} />
        <Route path="/admin/news_category" element={<NewsCategory />} />
        <Route path="/admin/news" element={<News />} />
        <Route path="/admin/online_credit" element={<Online_credit />} />
        <Route path="/admin/pages" element={<Pages />} />
        <Route path="/admin/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
