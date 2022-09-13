import * as React from "react";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Button, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Swal from "sweetalert2";
import { CDNURL } from "../../../CDNURL";
import cityLogo from "../../../assets/logo/dasdsa.jpeg";
import cityTamga from "../../../assets/logo/2.png";
import { GrView } from "react-icons/gr";
import { TbEdit, TbRuler2Off } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { BsCheckCircleFill } from "react-icons/bs";

import { AiOutlineLoading3Quarters, AiOutlineFolderView } from "react-icons/ai";

const Datatable = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [logo, setLogo] = useState(null);
  const [newLogo, setNewLogo] = useState(false);
  const [stamp, setStamp] = useState(null);
  const [newStamp, setNewStamp] = useState(false);
  const [company, setCompany] = useState("");
  const [facebook, setFacebook] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [number, setNumber] = useState("");
  const [invoiceType, setInvoiceType] = useState("");
  const [bank, setBank] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [tax, setTax] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editID, setEditID] = useState("");

  const saveInvoice = async () => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append("avatar", logo[0]);
      formdata.append("thumbnail", stamp[0]);
      formdata.append("name", company);
      formdata.append("social", facebook);
      formdata.append("address", address);
      formdata.append("email", email);
      formdata.append("website", website);
      formdata.append("number", number);
      formdata.append("invoiceType", invoiceType);
      formdata.append("bank", bank);
      formdata.append("bankAccount", bankAccount);
      const { data } = await axios.post("/invoice/register", formdata);
      if (!data.success) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: data.result,
        });
      }
      if (data.success) {
        resetFields();
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: data.result,
        });
      }
    } catch (error) {
      if (error) {
        setLoading(false);
      }
    }
  };

  const [invoiceList, setInvoiceList] = useState([]);

  const getInvoiceTemps = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/invoice/invoices");
      if (data.success) {
        setInvoiceList(data.result);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error) {
        setInvoiceList([]);
        setLoading(false);
      }
    }
  };

  const [switchComp, setSwitchComp] = useState(false);
  const [active, setActive] = useState("");

  const activate = async (item) => {
    const { data } = await axios.post(`/invoice/activate/${item._id}`, {
      invoiceType: item.invoiceType,
    });
    if (data.success) {
      getInvoiceTemps();
      Swal.fire({
        icon: "success",
        title: `${item.name} хэрэглэгдэж байна`,
      });
    }
  };

  const removeInvoice = async (item) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${item.name} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.post(`/invoice/remove/${item._id}`);
        if (data.success) {
          getInvoiceTemps();
          Swal.fire({
            icon: "success",
            title: "Устгагдлаа!",
          });
        } else {
          Swal.fire("Алдаа", "error");
        }
      }
    });
  };

  const setUpView = (item) => {
    setActive("View");
    setCompany(item.name);
    setStamp(item.invoiceStamp);
    setNewStamp(false);
    setLogo(item.invoiceLogo);
    setNewLogo(false);
    setFacebook(item.social);
    setAddress(item.address);
    setEmail(item.email);
    setWebsite(item.website);
    setNumber(item.number);
    setInvoiceType(item.invoiceType);
    setBank(item.bank);
    setBankAccount(item.bankAccount);
  };

  const setUpEdit = async (item) => {
    setActive("Create/Edit");
    setCompany(item.name);
    setStamp(item.invoiceStamp);
    setNewStamp(false);
    setLogo(item.invoiceLogo);
    setNewLogo(false);
    setFacebook(item.social);
    setAddress(item.address);
    setEmail(item.email);
    setWebsite(item.website);
    setNumber(item.number);
    setInvoiceType(item.invoiceType);
    setBank(item.bank);
    setBankAccount(item.bankAccount);
    setEdit(true);
    setEditID(item._id);
  };

  const editInvoice = async () => {
    try {
      setLoading(true);

      let formdata = new FormData();
      formdata.append("newAvatar", newLogo);
      newLogo
        ? formdata.append("avatar", logo[0])
        : formdata.append("oldAvatar", logo);
      formdata.append("newThumbnail", newStamp);
      newStamp
        ? formdata.append("thumbnail", stamp[0])
        : formdata.append("oldThumbnail", stamp);
      formdata.append("name", company);
      formdata.append("social", facebook);
      formdata.append("address", address);
      formdata.append("email", email);
      formdata.append("website", website);
      formdata.append("number", number);
      formdata.append("invoiceType", invoiceType);
      formdata.append("bank", bank);
      formdata.append("bankAccount", bankAccount);

      const { data } = await axios.post(
        `/invoice/editInvoice/${editID}`,
        formdata
      );
      if (!data.success) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: data.result,
        });
      }
      if (data.success) {
        getInvoiceTemps();
        resetFields();
        setActive("List");
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Засагдлаа",
        });
      }
    } catch (error) {
      if (error) {
        Swal.fire({
          icon: "warning",
          title: error.message,
        });
        setLoading(false);
      }
    }
  };

  const resetFields = () => {
    setCompany("");
    setStamp(null);
    setNewStamp(false);
    setLogo(null);
    setNewLogo(false);
    setFacebook("");
    setAddress("");
    setEmail("");
    setWebsite("");
    setNumber("");
    setInvoiceType("");
    setBank("");
    setBankAccount("");
    setEdit(false);
    setEditID("");
  };

  function renderSwitch() {
    switch (active) {
      case "View":
        return (
          <div className="w-full p-2 ">
            <div className="w-full h-10 rounded-md drop-shadow-xl absolute">
              <button
                onClick={() => {
                  setActive("List");
                  resetFields();
                }}
                className="p-2 rounded-md border hover:drop-shadow-2xl hover:underline"
              >
                Буцах
              </button>
            </div>
            <div className="w-[595px] bg-white h-[842px] mx-auto drop-shadow-2xl p-4 flex flex-wrap justify-start items-start">
              <div className="w-3/6 h-[330px]">
                <div className="w-full h-[168px] p-2">
                  {newLogo ? (
                    <img
                      src={
                        logo
                          ? logo
                            ? URL.createObjectURL(logo[0] && logo[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="Лого"
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <img
                      src={`${CDNURL}/${logo}`}
                      alt="Лого"
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>
                <div className="w-full h-[74px] p-2"></div>
                <div className="w-full p-2">
                  <h1 className="text-[12px] w-full break-words">Төлөгч:</h1>
                  <h1 className="text-[12px] w-full break-words">
                    Байгууллагын нэр:
                  </h1>
                  <h1 className="text-[12px] w-full break-words">Регистр №:</h1>
                </div>
              </div>
              <div className="w-3/6  h-[330px] flex justify-start items-end flex-col p-1">
                <div className="w-full flex justify-start items-end flex-col p-1">
                  <h1 className="text-sm w-full font-bold break-words">
                    {company}
                  </h1>
                  <div className="w-full flex flex-col">
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Хаяг:</h1>
                      <h1 className="text-[12px] break-words">{address}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Цахим хаяг:</h1>
                      <h1 className="text-[12px] break-words">{email}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Утас:</h1>
                      <h1 className="text-[12px] break-words">{number}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Веб:</h1>
                      <h1 className="text-[12px] break-words">{website}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Сошиал хаяг:</h1>
                      <h1 className="text-[12px]  break-words">{facebook}</h1>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-start items-start flex-col p-2">
                  <h1 className="text-[30px] font-bold break-words w-full">
                    {invoiceType}
                  </h1>
                </div>
                <div className="flex flex-col justify-start items-start w-full">
                  <div className="w-full flex flex-col justify-start items-start">
                    <h1 className="text-[12px] w-full break-words">
                      Дугаар №:
                    </h1>
                    <h1 className="text-[12px] w-full break-words">
                      Нэхэмжилсэн огноо:
                    </h1>
                    <h1 className="text-[12px] w-full break-words">
                      Төлбөр хийх хугацаа:
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <table className="w-full h-12 p-2 text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 w-full">
                    <tr className="w-full p-2">
                      <th scope="col" className="text-[12px]">
                        №
                      </th>
                      <th scope="col" className="text-[12px]">
                        Бүтээгдхүүн
                      </th>
                      <th scope="col" className="text-[12px]">
                        Үзүүлэлт
                      </th>
                      <th scope="col" className="text-[12px]">
                        Холбоос
                      </th>
                      <th scope="col" className="text-[12px]">
                        Зураг
                      </th>
                      <th scope="col" className="text-[12px]">
                        Тоо ширхэг
                      </th>
                      <th scope="col" className="text-[12px]">
                        Нэгжийн үнэ
                      </th>
                      <th scope="col" className="text-[12px]">
                        Нийт үнэ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        1
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        2
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        3
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        4
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        5
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="w-full flex items-center justify-end">
                  <div className="bg-[#bcbec0] w-2/6 h-full flex flex-col items-center justify-start">
                    <div className="w-full border-b-2 border-b-black flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">Нийт үнэ:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                    <div className="w-full border-b-2 border-b-black flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">НӨАТ:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                    <div className="w-full flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">Нийт дүн:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-[200px] border-b-4 border-b-black relative">
                <div className="w-full flex flex-col">
                  <h1 className="text-[20px] font-bold">НЭХЭМЖЛЭГЧ</h1>
                  <div className="flex justify-start items-start">
                    <h1 className="text-xs font-bold">Банкны нэр:</h1>
                    <h1 className="text-xs">{bank}</h1>
                  </div>
                  <div className="flex justify-start items-start">
                    <h1 className="text-xs font-bold">Дансны дугаар:</h1>
                    <h1 className="text-xs">{bankAccount}</h1>
                  </div>
                </div>
                <div
                  className={`w-full flex absolute h-48 w-48 top-[-55px] right-10`}
                >
                  {newStamp ? (
                    <img
                      src={
                        stamp
                          ? stamp
                            ? URL.createObjectURL(stamp[0] && stamp[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="Тамга"
                      className="w-full h-auto object-contain "
                    />
                  ) : (
                    <img
                      src={`${CDNURL}/${stamp}`}
                      alt="Тамга"
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>
                <div className="w-full flex flex-col justify-center items-end">
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Хүлээн авсан:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Нягтлан бодсон:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">
                      Санхүүгийн албаны дарга:
                    </h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Гүйцэтгэх захирал:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-full h-12 flex flex-col justify-start items-start">
                <p className="text-xs text-gray-400 mt-0">НХМаягт</p>
                <p className="text-xs text-gray-400 mt-0">
                  Сангийн сайдын 2017 оны 12 дугаар сарын 05-ны өдрийн 347 тоот
                  тушаалын хавсралт
                </p>
              </div>
            </div>
          </div>
        );
      case "Create/Edit":
        return (
          <div className="w-full p-2 flex justify-between items-start">
            <div className="p-2 w-2/6 ">
              <label>Лого</label>
              <input
                onChange={(e) => {
                  if (e.target?.files) {
                    setLogo(e.target.files);
                    setNewLogo(true);
                  } else {
                    setLogo(null);
                    setNewLogo(false);
                  }
                }}
                type={"file"}
                className="w-full border p-1 rounded-md mt-1"
              />
              <label>Тамга</label>
              <input
                onChange={(e) => {
                  if (e.target?.files) {
                    setStamp(e.target.files);
                    setNewStamp(true);
                  } else {
                    setStamp(null);
                    setNewStamp(false);
                  }
                }}
                type={"file"}
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                type={"text"}
                placeholder="Компаны нэр"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type={"text"}
                placeholder="Хаяг"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type={"text"}
                placeholder="Цахим хаяг"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                type={"text"}
                placeholder="Утас"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                type={"text"}
                placeholder="Веб"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                type={"text"}
                placeholder="Сошиал хаяг"
                className="w-full border p-1 rounded-md mt-1"
              />
              <select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
                className="w-full border rounded-md p-1 mt-1"
              >
                <option label="Төрөл сонгох" value={"notchosen"} />
                <option label="НЭХЭМЖЛЭХ" value={"НЭХЭМЖЛЭХ"} />
                <option label="ҮНИЙН САНАЛ" value={"ҮНИЙН САНАЛ"} />
              </select>
              <input
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                type={"text"}
                placeholder="Банкы нэр"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                type={"text"}
                placeholder="Дансны дугаар"
                className="w-full border p-1 rounded-md mt-1"
              />
            </div>
            <div className="w-[595px] bg-white h-[842px] mx-auto drop-shadow-2xl p-4 flex flex-wrap justify-start items-start">
              <div className="w-3/6 h-[330px]">
                <div className="w-full h-[168px] p-2">
                  {newLogo ? (
                    <img
                      src={
                        logo
                          ? logo
                            ? URL.createObjectURL(logo[0] && logo[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="Лого"
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <img
                      src={`${CDNURL}/${logo}`}
                      alt="Лого"
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>
                <div className="w-full h-[74px] p-2"></div>
                <div className="w-full p-2">
                  <h1 className="text-[12px] w-full break-words">Төлөгч:</h1>
                  <h1 className="text-[12px] w-full break-words">
                    Байгууллагын нэр:
                  </h1>
                  <h1 className="text-[12px] w-full break-words">Регистр №:</h1>
                </div>
              </div>
              <div className="w-3/6  h-[330px] flex justify-start items-end flex-col p-1">
                <div className="w-full flex justify-start items-end flex-col p-1">
                  <h1 className="text-sm w-full font-bold break-words">
                    {company}
                  </h1>
                  <div className="w-full flex flex-col">
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Хаяг:</h1>
                      <h1 className="text-[12px] break-words">{address}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Цахим хаяг:</h1>
                      <h1 className="text-[12px] break-words">{email}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Утас:</h1>
                      <h1 className="text-[12px] break-words">{number}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Веб:</h1>
                      <h1 className="text-[12px] break-words">{website}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Сошиал хаяг:</h1>
                      <h1 className="text-[12px]  break-words">{facebook}</h1>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-start items-start flex-col p-2">
                  <h1 className="text-[30px] font-bold break-words w-full">
                    {invoiceType}
                  </h1>
                </div>
                <div className="flex flex-col justify-start items-start w-full">
                  <div className="w-full flex flex-col justify-start items-start">
                    <h1 className="text-[12px] w-full break-words">
                      Дугаар №:
                    </h1>
                    <h1 className="text-[12px] w-full break-words">
                      Нэхэмжилсэн огноо:
                    </h1>
                    <h1 className="text-[12px] w-full break-words">
                      Төлбөр хийх хугацаа:
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <table className="w-full h-12 p-2 text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 w-full">
                    <tr className="w-full p-2">
                      <th scope="col" className="text-[12px]">
                        №
                      </th>
                      <th scope="col" className="text-[12px]">
                        Бүтээгдхүүн
                      </th>
                      <th scope="col" className="text-[12px]">
                        Үзүүлэлт
                      </th>
                      <th scope="col" className="text-[12px]">
                        Холбоос
                      </th>
                      <th scope="col" className="text-[12px]">
                        Зураг
                      </th>
                      <th scope="col" className="text-[12px]">
                        Тоо ширхэг
                      </th>
                      <th scope="col" className="text-[12px]">
                        Нэгжийн үнэ
                      </th>
                      <th scope="col" className="text-[12px]">
                        Нийт үнэ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        1
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        2
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        3
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        4
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        5
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="w-full flex items-center justify-end">
                  <div className="bg-[#bcbec0] w-2/6 h-full flex flex-col items-center justify-start">
                    <div className="w-full border-b-2 border-b-black flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">Нийт үнэ:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                    <div className="w-full border-b-2 border-b-black flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">НӨАТ:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                    <div className="w-full flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">Нийт дүн:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-[200px] border-b-4 border-b-black relative">
                <div className="w-full flex flex-col">
                  <h1 className="text-[20px] font-bold">НЭХЭМЖЛЭГЧ</h1>
                  <div className="flex justify-start items-start">
                    <h1 className="text-xs font-bold">Банкны нэр:</h1>
                    <h1 className="text-xs">{bank}</h1>
                  </div>
                  <div className="flex justify-start items-start">
                    <h1 className="text-xs font-bold">Дансны дугаар:</h1>
                    <h1 className="text-xs">{bankAccount}</h1>
                  </div>
                </div>
                <div
                  className={`w-full flex absolute h-48 w-48 top-[-55px] right-10`}
                >
                  {newStamp ? (
                    <img
                      src={
                        stamp
                          ? stamp
                            ? URL.createObjectURL(stamp[0] && stamp[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="Тамга"
                      className="w-full h-auto object-contain "
                    />
                  ) : (
                    <img
                      src={`${CDNURL}/${stamp}`}
                      alt="Тамга"
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>
                <div className="w-full flex flex-col justify-center items-end">
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Хүлээн авсан:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Нягтлан бодсон:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">
                      Санхүүгийн албаны дарга:
                    </h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Гүйцэтгэх захирал:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-full h-12 flex flex-col justify-start items-start">
                <p className="text-xs text-gray-400 mt-0">НХМаягт</p>
                <p className="text-xs text-gray-400 mt-0">
                  Сангийн сайдын 2017 оны 12 дугаар сарын 05-ны өдрийн 347 тоот
                  тушаалын хавсралт
                </p>
              </div>
            </div>
          </div>
        );
      case "List":
        return (
          <div className="w-full flex flex-wrap">
            {invoiceList.length !== 0 ? (
              invoiceList?.map((item, index) => (
                <div
                  className={`w-[180px] h-[400px] flex flex-col p-2 justify-center items-center bg-white drop-shadow-xl rounded-md ${
                    item.inUse && "bg-green-300"
                  } m-2`}
                >
                  <div className="w-full rounded-md bg-white/50 h-12 absolute top-0 flex justify-center items-center">
                    <h1 className="w-3/6 h-full hover:bg-blue-400 rounded-md flex justify-center items-center hover:text-white text-xs text-center">
                      {item.inUse ? "Ашиглагдаж байгаа" : "Ашиглагдаагүй"}
                    </h1>
                    <button
                      onClick={() => activate(item)}
                      className={`w-3/6 h-full ${
                        item.inUse ? "hover:bg-red-400" : "hover:bg-green-400"
                      } ${
                        item.inUse && "text-green-400"
                      } rounded-md flex justify-center items-center hover:text-white text-2xl`}
                    >
                      <BsCheckCircleFill />
                    </button>
                  </div>
                  <h1 className="text-xs text-center">{item.name}</h1>
                  <h1 className="text-xs text-center">{item.invoiceType}</h1>
                  <div
                    key={index}
                    className="w-[120px] bg-white h-[200px] mx-auto p-1 flex flex-wrap justify-start items-start"
                  >
                    <div className="w-3/6 h-[55px]">
                      <div className="w-full h-[28px] p-1">
                        <img
                          src={`${CDNURL}/${item.invoiceLogo}`}
                          alt="Лого"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="w-full h-[12px] p-2"></div>
                      <div className="w-full p-2">
                        <h1 className="text-[2px] w-full break-words">
                          Төлөгч:
                        </h1>
                        <h1 className="text-[2px] w-full break-words">
                          Байгууллагын нэр:
                        </h1>
                        <h1 className="text-[2px] w-full break-words">
                          Регистр №:
                        </h1>
                      </div>
                    </div>
                    <div className="w-3/6  h-[55px] flex justify-start items-end flex-col p-1">
                      <div className="w-full flex justify-start items-end flex-col p-1">
                        <h1 className="text-[2px] w-full font-bold break-words">
                          {item.name}
                        </h1>
                        <div className="w-full flex flex-col">
                          <div className="flex w-full justify-start items-start">
                            <h1 className="text-[2px] font-bold">Хаяг:</h1>
                            <h1 className="text-[2px] break-words">
                              {item.address}
                            </h1>
                          </div>
                          <div className="flex w-full justify-start items-start">
                            <h1 className="text-[2px] font-bold">
                              Цахим хаяг:
                            </h1>
                            <h1 className="text-[2px] break-words">
                              {item.email}
                            </h1>
                          </div>
                          <div className="flex w-full justify-start items-start">
                            <h1 className="text-[2px] font-bold">Утас:</h1>
                            <h1 className="text-[2px] break-words">
                              {item.number}
                            </h1>
                          </div>
                          <div className="flex w-full justify-start items-start">
                            <h1 className="text-[2px] font-bold">Веб:</h1>
                            <h1 className="text-[2px] break-words">
                              {item.website}
                            </h1>
                          </div>
                          <div className="flex w-full justify-start items-start">
                            <h1 className="text-[2px] font-bold">
                              Сошиал хаяг:
                            </h1>
                            <h1 className="text-[2px]  break-words">
                              {item.social}
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-start items-start flex-col p-2">
                        <h1 className="text-[4px] font-bold break-words w-full">
                          {invoiceType}
                        </h1>
                      </div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <div className="w-full flex flex-col justify-start items-start">
                          <h1 className="text-[2px] w-full break-words">
                            Дугаар №:
                          </h1>
                          <h1 className="text-[2px] w-full break-words">
                            Нэхэмжилсэн огноо:
                          </h1>
                          <h1 className="text-[2px] w-full break-words">
                            Төлбөр хийх хугацаа:
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <table className="w-full h-2 p-1 text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 w-full">
                          <tr className="w-full p-1">
                            <th scope="col" className="text-[2px]">
                              №
                            </th>
                            <th scope="col" className="text-[2px]">
                              Бүтээгдхүүн
                            </th>
                            <th scope="col" className="text-[2px]">
                              Үзүүлэлт
                            </th>
                            <th scope="col" className="text-[2px]">
                              Холбоос
                            </th>
                            <th scope="col" className="text-[2px]">
                              Зураг
                            </th>
                            <th scope="col" className="text-[2px]">
                              Тоо ширхэг
                            </th>
                            <th scope="col" className="text-[2px]">
                              Нэгжийн үнэ
                            </th>
                            <th scope="col" className="text-[2px]">
                              Нийт үнэ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="w-full p-1 border ">
                            <td scope="col" className="text-[2px] border">
                              1
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="w-full flex items-center justify-end">
                        <div className="bg-[#bcbec0] w-2/6 h-full flex flex-col items-center justify-start">
                          <div className="w-full border-b-2 border-b-black flex justify-evenly items-center ">
                            <h1 className="text-[2px] text-center w-full">
                              Нийт үнэ:
                            </h1>
                            <h1 className="text-[2px] text-center w-full">
                              0₮
                            </h1>
                          </div>
                          <div className="w-full border-b-2 border-b-black flex justify-evenly items-center ">
                            <h1 className="text-[2px] text-center w-full">
                              НӨАТ:
                            </h1>
                            <h1 className="text-[2px] text-center w-full">
                              0₮
                            </h1>
                          </div>
                          <div className="w-full flex justify-evenly items-center ">
                            <h1 className="text-[2px] text-center w-full">
                              Нийт дүн:
                            </h1>
                            <h1 className="text-[2px] text-center w-full">
                              0₮
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-[33px] border-b-2 border-b-black relative">
                      <div className="w-full flex flex-col">
                        <h1 className="text-[2px] font-bold">НЭХЭМЖЛЭГЧ</h1>
                        <div className="flex justify-start items-start">
                          <h1 className="text-[2px] font-bold">Банкны нэр:</h1>
                          <h1 className="text-[2px]">{item.bank}</h1>
                        </div>
                        <div className="flex justify-start items-start">
                          <h1 className="text-[2px] font-bold">
                            Дансны дугаар:
                          </h1>
                          <h1 className="text-[2px]">{item.bankAccount}</h1>
                        </div>
                      </div>
                      <div
                        className={`w-full flex absolute h-8 w-8 top-[-9px] right-1`}
                      >
                        <img
                          src={`${CDNURL}/${item.invoiceStamp}`}
                          alt="Тамга"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="w-full flex flex-col justify-center items-end">
                        <div className="flex gap-1">
                          <h1 className="text-[2px] font-bold">
                            Хүлээн авсан:
                          </h1>
                          <h1 className="text-[2px]">
                            /................................................................/........................./
                          </h1>
                        </div>
                        <div className="flex gap-1">
                          <h1 className="text-[2px] font-bold">
                            Нягтлан бодсон:
                          </h1>
                          <h1 className="text-[2px]">
                            /................................................................/........................./
                          </h1>
                        </div>
                        <div className="flex gap-1">
                          <h1 className="text-[2px] font-bold">
                            Санхүүгийн албаны дарга:
                          </h1>
                          <h1 className="text-[2px]">
                            /................................................................/........................./
                          </h1>
                        </div>
                        <div className="flex gap-1">
                          <h1 className="text-[2px] font-bold">
                            Гүйцэтгэх захирал:
                          </h1>
                          <h1 className="text-[2px]">
                            /................................................................/........................./
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-2 flex flex-col justify-start items-start">
                      <p className="text-[2px] text-gray-400 mt-0">НХМаягт</p>
                      <p className="text-[2px] text-gray-400 mt-0">
                        Сангийн сайдын 2017 оны 12 дугаар сарын 05-ны өдрийн 347
                        тоот тушаалын хавсралт
                      </p>
                    </div>
                  </div>
                  <div className="w-full rounded-md bg-white/50 h-12 absolute bottom-0 flex justify-center items-center">
                    <button
                      onClick={() => setUpView(item)}
                      className="w-2/6 h-full hover:bg-blue-400 rounded-md flex justify-center items-center hover:text-white text-2xl "
                    >
                      <AiOutlineFolderView />
                    </button>
                    <button
                      onClick={() => setUpEdit(item)}
                      className="w-2/6 h-full hover:bg-yellow-400 rounded-md flex justify-center items-center hover:text-white text-2xl"
                    >
                      <TbEdit />
                    </button>
                    <button
                      onClick={() => removeInvoice(item)}
                      className="w-2/6 h-full hover:bg-red-400 rounded-md flex justify-center items-center hover:text-white text-2xl"
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <h1>Хоосон</h1>
            )}
          </div>
        );
      default:
        return (
          <div className="w-full p-2 flex justify-between items-start">
            <div className="p-2 w-2/6 ">
              <label>Лого</label>
              <input
                onChange={(e) => {
                  if (e.target?.files) {
                    setLogo(e.target.files);
                    setNewLogo(true);
                  } else {
                    setLogo(null);
                    setNewLogo(false);
                  }
                }}
                type={"file"}
                className="w-full border p-1 rounded-md mt-1"
              />
              <label>Тамга</label>
              <input
                onChange={(e) => {
                  if (e.target?.files) {
                    setStamp(e.target.files);
                    setNewStamp(true);
                  } else {
                    setStamp(null);
                    setNewStamp(false);
                  }
                }}
                type={"file"}
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                type={"text"}
                placeholder="Компаны нэр"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type={"text"}
                placeholder="Хаяг"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type={"text"}
                placeholder="Цахим хаяг"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                type={"text"}
                placeholder="Утас"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                type={"text"}
                placeholder="Веб"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                type={"text"}
                placeholder="Сошиал хаяг"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
                type={"text"}
                placeholder="Төрөл бичих"
                className="w-full border p-1 rounded-md mt-1"
              />
              <select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
                className="w-full border rounded-md p-1 mt-1"
              >
                <option label="Төрөл сонгох" value={"notchosen"} />
                <option label="НЭХЭМЖЛЭХ" value={"НЭХЭМЖЛЭХ"} />
                <option label="ҮНИЙН САНАЛ" value={"ҮНИЙН САНАЛ"} />
              </select>
              <input
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                type={"text"}
                placeholder="Банкы нэр"
                className="w-full border p-1 rounded-md mt-1"
              />
              <input
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                type={"text"}
                placeholder="Дансны дугаар"
                className="w-full border p-1 rounded-md mt-1"
              />
            </div>
            <div className="w-[595px] bg-white h-[842px] mx-auto drop-shadow-2xl p-4 flex flex-wrap justify-start items-start">
              <div className="w-3/6 h-[330px]">
                <div className="w-full h-[168px] p-2">
                  {newLogo ? (
                    <img
                      src={
                        logo
                          ? logo
                            ? URL.createObjectURL(logo[0] && logo[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="Лого"
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <img
                      src={`${CDNURL}/${logo}`}
                      alt="Лого"
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>
                <div className="w-full h-[74px] p-2"></div>
                <div className="w-full p-2">
                  <h1 className="text-[12px] w-full break-words">Төлөгч:</h1>
                  <h1 className="text-[12px] w-full break-words">
                    Байгууллагын нэр:
                  </h1>
                  <h1 className="text-[12px] w-full break-words">Регистр №:</h1>
                </div>
              </div>
              <div className="w-3/6  h-[330px] flex justify-start items-end flex-col p-1">
                <div className="w-full flex justify-start items-end flex-col p-1">
                  <h1 className="text-sm w-full font-bold break-words">
                    {company}
                  </h1>
                  <div className="w-full flex flex-col">
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Хаяг:</h1>
                      <h1 className="text-[12px] break-words">{address}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Цахим хаяг:</h1>
                      <h1 className="text-[12px] break-words">{email}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Утас:</h1>
                      <h1 className="text-[12px] break-words">{number}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Веб:</h1>
                      <h1 className="text-[12px] break-words">{website}</h1>
                    </div>
                    <div className="flex w-full justify-start items-start">
                      <h1 className="text-[12px] font-bold">Сошиал хаяг:</h1>
                      <h1 className="text-[12px]  break-words">{facebook}</h1>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-start items-start flex-col p-2">
                  <h1 className="text-[30px] font-bold break-words w-full">
                    {invoiceType}
                  </h1>
                </div>
                <div className="flex flex-col justify-start items-start w-full">
                  <div className="w-full flex flex-col justify-start items-start">
                    <h1 className="text-[12px] w-full break-words">
                      Дугаар №:
                    </h1>
                    <h1 className="text-[12px] w-full break-words">
                      Нэхэмжилсэн огноо:
                    </h1>
                    <h1 className="text-[12px] w-full break-words">
                      Төлбөр хийх хугацаа:
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <table className="w-full h-12 p-2 text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 w-full">
                    <tr className="w-full p-2">
                      <th scope="col" className="text-[12px]">
                        №
                      </th>
                      <th scope="col" className="text-[12px]">
                        Бүтээгдхүүн
                      </th>
                      <th scope="col" className="text-[12px]">
                        Үзүүлэлт
                      </th>
                      <th scope="col" className="text-[12px]">
                        Холбоос
                      </th>
                      <th scope="col" className="text-[12px]">
                        Зураг
                      </th>
                      <th scope="col" className="text-[12px]">
                        Тоо ширхэг
                      </th>
                      <th scope="col" className="text-[12px]">
                        Нэгжийн үнэ
                      </th>
                      <th scope="col" className="text-[12px]">
                        Нийт үнэ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        1
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        2
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        3
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        4
                      </td>
                    </tr>
                    <tr className="w-full p-2 border ">
                      <td scope="col" className="text-[12px] border">
                        5
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="w-full flex items-center justify-end">
                  <div className="bg-[#bcbec0] w-2/6 h-full flex flex-col items-center justify-start">
                    <div className="w-full border-b-2 border-b-black flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">Нийт үнэ:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                    <div className="w-full border-b-2 border-b-black flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">НӨАТ:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                    <div className="w-full flex justify-evenly items-center ">
                      <h1 className="text-xs text-center w-full">Нийт дүн:</h1>
                      <h1 className="text-xs text-center w-full">0₮</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-[200px] border-b-4 border-b-black relative">
                <div className="w-full flex flex-col">
                  <h1 className="text-[20px] font-bold">НЭХЭМЖЛЭГЧ</h1>
                  <div className="flex justify-start items-start">
                    <h1 className="text-xs font-bold">Банкны нэр:</h1>
                    <h1 className="text-xs">{bank}</h1>
                  </div>
                  <div className="flex justify-start items-start">
                    <h1 className="text-xs font-bold">Дансны дугаар:</h1>
                    <h1 className="text-xs">{bankAccount}</h1>
                  </div>
                </div>
                <div
                  className={`w-full flex absolute h-48 w-48 top-[-55px] right-10`}
                >
                  {newStamp ? (
                    <img
                      src={
                        stamp
                          ? stamp
                            ? URL.createObjectURL(stamp[0] && stamp[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="Тамга"
                      className="w-full h-auto object-contain "
                    />
                  ) : (
                    <img
                      src={`${CDNURL}/${stamp}`}
                      alt="Тамга"
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>
                <div className="w-full flex flex-col justify-center items-end">
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Хүлээн авсан:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Нягтлан бодсон:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">
                      Санхүүгийн албаны дарга:
                    </h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                  <div className="flex gap-1">
                    <h1 className="text-xs font-bold">Гүйцэтгэх захирал:</h1>
                    <h1 className="text-xs">
                      /................................................................/........................./
                    </h1>
                  </div>
                </div>
              </div>
              <div className="w-full h-12 flex flex-col justify-start items-start">
                <p className="text-xs text-gray-400 mt-0">НХМаягт</p>
                <p className="text-xs text-gray-400 mt-0">
                  Сангийн сайдын 2017 оны 12 дугаар сарын 05-ны өдрийн 347 тоот
                  тушаалын хавсралт
                </p>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <Card
      style={{ marginLeft: "20px" }}
      title={
        active === "List" ? (
          <button
            onClick={() => {
              setLoading(true);
              setActive("Create/Edit");
              setSwitchComp(!switchComp);
              setLoading(false);
            }}
            className="text-md p-2 flex justify-center items-center mx border rounded-md"
          >
            {loading ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              "Буцах"
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              setLoading(true);
              setActive("List");
              setSwitchComp(!switchComp);
              getInvoiceTemps();
              setLoading(false);
            }}
            className="text-md p-2 flex justify-center items-center mx border rounded-md"
          >
            {loading ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              "Нэхэмжлэлүүд харах"
            )}
          </button>
        )
      }
      extra={
        active === "Create/Edit" ? (
          edit ? (
            <button
              onClick={() => editInvoice()}
              className="text-md p-2 flex justify-center items-center mx border rounded-md"
            >
              {loading ? (
                <AiOutlineLoading3Quarters size={20} className="animate-spin" />
              ) : (
                "Нэхэмжлэл засах"
              )}
            </button>
          ) : (
            <button
              onClick={() => saveInvoice()}
              className="text-md p-2 flex justify-center items-center mx border rounded-md"
            >
              {loading ? (
                <AiOutlineLoading3Quarters size={20} className="animate-spin" />
              ) : (
                "Нэхэмжлэл хадгалах"
              )}
            </button>
          )
        ) : (
          <button
            onClick={() => {
              setLoading(true);
              setActive("Create/Edit");
              resetFields();
              setLoading(false);
            }}
            className="text-md p-2 flex justify-center items-center mx border rounded-md"
          >
            {loading ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              "Нэхэмжлэл нэмэх"
            )}
          </button>
        )
      }
    >
      {renderSwitch()}
    </Card>
  );
};

export default Datatable;
