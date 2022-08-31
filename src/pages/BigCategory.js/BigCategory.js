import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Big_category_table from "../../components/tables/big_category/big_category_table";
import { useNavigate } from "react-router-dom";

const BigCategory = () => {
    const [refresh, setRefresh] = useState(0);
    const [user, setUser] = useState([]);

    const history = useNavigate();

    const user_token = localStorage.getItem("token");
    useEffect(() => {
        if (user_token) {
            const authorize = async () => {
                try {
                    const { data } = await axios.get("authorize", {
                        headers: {
                            authorization: "Bearer " + user_token,
                        },
                    });
                    if (data.success) {
                        setUser(data.user);
                        if (data.role === "user") {
                            return history("/admin/home");
                        }
                        if (data.role === "admin") {
                            return history("/admin/bigcategory");
                        }
                    } else {
                        history("/admin/Login");
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            authorize();
        } else {
            history("/admin/Login");
        }
    }, [history, refresh]);
    return (
        <div className="flex ">
            <div className=" flex flex-col h-screen">
                <Sidebar />
            </div>
            <div className="w-full bg-white	">
                <Navbar />
                <Big_category_table />
            </div>
        </div>
    );
};

export default BigCategory;
