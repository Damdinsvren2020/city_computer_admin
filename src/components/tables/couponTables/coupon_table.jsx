import "./coupon.scss";
import { useEffect, useState } from "react";
import { Dropdown, Modal } from "antd";
import {
  DownOutlined,
  PlusOutlined,
  UpOutlined,
  RightOutlined,
  LineOutlined,
  MinusCircleOutlined,
  EditOutlined,
  LoadingOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { Card } from "antd";
import { Switch } from 'antd';
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation } from "swiper";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";
import { CDNURL } from "../../../CDNURL";

import { FaPercent, } from "react-icons/fa"
import { TbCodePlus } from "react-icons/tb"
import { BsCircleFill } from "react-icons/bs"

// const { Column, ColumnGroup } = Table;

const CouponTable = () => {
  const [couponModal, setCouponModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0)
  const [productList, setProductList] = useState([])
  const [filteredProductList, setFilteredProductList] = useState([])
  const [couponList, setCouponList] = useState([])

  useEffect(() => {
    const getProductList = async () => {
      const { data } = await axios.get("/product")
      if (data.success) {
        setProductList(data.result)

      }
    }
    getProductList()
    const getCouponList = async () => {
      const { data } = await axios.get("/coupon")
      if (data.success) {
        setCouponList(data.result)
        console.log(data.result)
      }
    }
    getCouponList()
  }, [refreshKey])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [offer, setOffer] = useState("")
  const [date, setDate] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [couponType, setCouponType] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editID, setEditID] = useState("")

  const [copy, setCopy] = useState("Copy")

  const handleOk = () => {
    saveCoupon()
  };

  const handleCancel = () => {
    setCouponModal(false);
    resetCoupon()
    setEditMode(false)
  };

  const searchingProduct = (prop) => {
    if (productList) {
      const SearchProduct = productList.filter((el) => {
        if (prop === "") {
          setFilteredProductList([])
          return el;
        } else {
          return el.name.toLowerCase().includes(prop);
        }
      });
      return setFilteredProductList(SearchProduct);
    }
  };

  const handleEdit = () => {
    editCoupon()
  }

  const generateCodeForProduct = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return setCouponCode("promo_code-" + result);
  }

  const resetCoupon = () => {
    setCouponCode("")
    setName("")
    setDate("")
    setDescription("")
    setOffer("")
    setEditID("")
  }

  const saveCoupon = async () => {
    try {
      let formdata = new FormData()
      formdata.append("name", name)
      formdata.append("description", description)
      formdata.append("offer", offer)
      formdata.append("couponType", couponType)
      formdata.append("date", date)
      formdata.append("offerCode", couponCode)
      const { data } = await axios.post("/coupon", formdata)
      if (data.success) {
        setCouponModal(false)
        resetCoupon()
        setRefreshKey(old => old + 1)
        Swal.fire({
          icon: "success",
          title: data.title,
          text: data.result,
        })
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message,
      })
    }
  }

  const editCoupon = async () => {
    try {
      let formdata = new FormData()
      formdata.append("name", name)
      formdata.append("description", description)
      formdata.append("offer", offer)
      formdata.append("date", date)
      formdata.append("offerCode", couponCode)
      const { data } = await axios.put("/coupon/" + editID, formdata)
      if (data.success) {
        setCouponModal(false)
        setRefreshKey(old => old + 1)
        resetCoupon()
        Swal.fire({
          icon: "success",
          title: data.title,
          text: data.result,
        })
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message,
      })
    }
  }

  const setUpEditCoupon = async (coupon) => {
    setEditMode(true)
    setCouponModal(true)
    setCouponCode(coupon.offerCode)
    setName(coupon.name)
    setDescription(coupon.description)
    setDate(coupon.validUntill)
    setCouponType(coupon.couponType)
    setOffer(coupon.offer)
    setEditID(coupon._id)
  }

  const changeStateOfCoupon = async (id) => {
    const { data } = await axios.post("/couponValue/" + id)
    if (data.success) {
      setRefreshKey(old => old + 1)
    }
  }

  const removeCoupon = async (id) => {
    const { data } = await axios.delete("/coupon/" + id)
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Устгагдсан"
      })
      setRefreshKey(old => old + 1)
    }
  }


  return (
    <Card
      title="Купон"
      style={{ marginLeft: "20px" }}
      extra={
        <Button
          onClick={() => {
            setCouponModal(true)
            setEditMode("")
          }}
          icon={< PlusOutlined />}
        >
          Купон нэмэх
        </Button >
      }
    >
      <Modal title="Купон нэмэх" visible={couponModal} okText={editMode ? "Хадгалах" : "Бүртгэх"} cancelText={"Болих"} onOk={editMode ? () => handleEdit() : () => handleOk()} onCancel={handleCancel}>
        <div className="w-full">
          <input maxLength={10} value={name} onChange={(e) => setName(e.target.value)} type={"text"} className="w-full border p-2 my-2" placeholder="coupon name" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} type={"text"} className="w-full border p-2 my-2" placeholder="coupon description" />
          <select onChange={(e) => setCouponType(e.target.value)} className="w-full p-2 border">
            <option label="Купон төрөл сонгох" value={"notchosen"} />
            <option label="Хувиар" value={"percentage"} />
            <option label="Мөнгөөр" value={"amount"} />
          </select>
          {
            couponType === "percentage" ?
              <input value={offer} onChange={(e) => {
                const limit = 3;
                setOffer(e.target.value.slice(0, limit))
                if (e.target.value >= 100) {
                  setOffer("")
                  Swal.fire({
                    icon: "warning",
                    title: "100% гаас доош байх хэрэгтэй"
                  })
                }
              }} type={"number"} className="w-full border p-2 my-2" placeholder={`${couponType === "percentage" && "coupon offer %"}`} />
              :
              <input value={offer} onChange={(e) => setOffer(e.target.value)} type={"number"} className="w-full border p-2 my-2" placeholder={`${couponType === "amount" && "coupon offer ₮"}`} />
          }
          <label>Хүчинтэй хугацаа</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} type={"date"} className="w-full border p-2 my-2" placeholder="coupon valid through" />
          <label>Купон код</label>
          <div className="w-full flex justify-center items-center p-2 gap-1">
            <input className="w-11/12 border p-2" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon Code" />
            <button onClick={() => generateCodeForProduct(7)} className="w-1/12 border p-2 hover:bg-green-400 cursor-pointer text-xl">
              <TbCodePlus />
            </button>
          </div>
        </div>
      </Modal>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Идэвх</TableCell>
              <TableCell className="tableCell">Нэр</TableCell>
              <TableCell className="tableCell">Ашиглах код</TableCell>
              <TableCell className="tableCell">Тайлбар</TableCell>
              <TableCell className="tableCell">Купон төрөл</TableCell>
              <TableCell className="tableCell">Хөнгөлөлт</TableCell>
              <TableCell className="tableCell">Хүчинтэй хугацаа</TableCell>
              <TableCell className="tableCell">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {couponList.map((row) => (
              <TableRow key={row._id} className={`${row.isActive ? "opacity-1" : "opacity-20"}`}>
                <TableCell className="tableCell">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <div>
                      {row.isActive ? <BsCircleFill color="#77c66f" /> : <BsCircleFill color="red" />}
                    </div>
                    <div>
                      <Switch defaultChecked={row.isActive} onChange={() => changeStateOfCoupon(row._id)} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  <div>
                    {row.name}
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  <button onClick={() => {
                    navigator.clipboard.writeText(row.offerCode)
                    setCopy("Copied!")
                  }}>
                    {row.offerCode} {copy}
                  </button>
                </TableCell>
                <TableCell className="tableCell">
                  <div>
                    {row.description}
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row?.couponType === "percentage" && "Хувиар"}</h2>
                  <h2>{row?.couponType === "amount" && "Мөнгөн дүн"}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.couponType === "percentage" && row?.offer + "%"}</h2>
                  <h2>{row.couponType === "amount" && row?.offer + "₮"}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.validUntill}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <div>
                    <button onClick={() => setUpEditCoupon(row)} className="mx-2 text-xl text-yellow-400"><EditOutlined /></button>
                    <button onClick={() => removeCoupon(row._id)} className="mx-2 text-xl text-red-400"><DeleteOutlined /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Card >
  );
};

export default CouponTable;

