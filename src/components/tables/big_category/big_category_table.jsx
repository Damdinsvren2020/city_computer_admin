import * as React from "react";

import "./category_table.scss";
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

import { IoMdRemoveCircleOutline } from "react-icons/io"

import { AiOutlineLoading3Quarters } from "react-icons/ai"

const Datatable = () => {


  const [refreshKey, setRefreshKey] = useState(0);
  const [angilal, setAngilal] = useState([]);

  const [filteredCategory, setFilteredCategory] = useState([])
  const [edit, setEdit] = useState(false)
  const [editID, setEditID] = useState("")


  const [BigCategoryList, SetBigCategoryList] = useState([])
  const [FilteredBigCategoryList, setFilteredBigCategoryList] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [order, setOrder] = useState(null)

  const [dropDownAngilal, setDropDownAngilal] = useState(false);
  const [matchingIndex, setMatchingIndex] = useState("");
  const [Name, setName] = useState("");
  const [selectedCategoryList, setSelectedCategoryList] = useState([])
  const [Description, setDescription] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, angilal.length - page * rowsPerPage);


  useEffect(() => {
    axios
      .get("/angilal")
      .then((response) => {
        const data = response.data.data;
        setAngilal(data);
        setFilteredCategory(data);
      })
      .catch((error) => {
        console.log(error);
      });

    const getBigCategories = async () => {
      const { data } = await axios.get("/bigcategory")
      if (data.success) {
        SetBigCategoryList(data.result.sort(function (a, b) {
          return a.order - b.order;
        }))
        setFilteredBigCategoryList(data.result.sort(function (a, b) {
          return a.order - b.order;
        }))
      }
    }
    getBigCategories()
  }, [refreshKey]);




  const addSelectedCategory = (category) => {

    const converText = category.split("~")
    let obj = {
      name: converText[0],
      _id: converText[1]
    }
    if (obj.name === "notchosen" || obj._id === undefined) return Swal.fire({
      icon: "warning",
      title: "Ангилал сонгоно уу!"
    })
    const exists = containsObject(obj, selectedCategoryList)
    if (exists) {
      return Swal.fire({
        icon: "warning",
        title: "Аль хэдийн нэмэгдсэн байна !"
      })
    } else {
      return setSelectedCategoryList([...selectedCategoryList, obj])
    }
  }

  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].name === obj.name) {
        return true;
      }
    }
    return false;
  }

  const removeFromSelected = (category) => {
    let filteredArray = selectedCategoryList.filter(item => item._id !== category._id)
    return setSelectedCategoryList(filteredArray);
  }


  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const createBigAngilal = async () => {
    setConfirmLoading(true)
    let formdata = new FormData()
    formdata.append("name", Name)
    formdata.append("order", order)
    formdata.append("category", JSON.stringify(selectedCategoryList))
    const { data } = await axios.post("/bigCategory", formdata)
    if (!data.success) {
      resetCreate()
      Swal.fire({
        icon: "error",
        title: "Алдаа гарсан"
      })
    }
    if (data.success) {
      resetCreate()
      Swal.fire({
        icon: "success",
        title: "Нэмэгдсэн"
      })
    }
  }

  const setUpEdit = (item) => {
    setName(item.name)
    setSelectedCategoryList(item.angilals)
    setEditID(item._id)
    setOrder(item.order)
    setEdit(true)
    setIsModalVisible(true)
  }

  const editBigAngilal = async () => {
    setConfirmLoading(true)
    let formdata = new FormData()
    formdata.append("name", Name)
    formdata.append("order", order)
    formdata.append("category", JSON.stringify(selectedCategoryList))
    const { data } = await axios.put(`/bigCategory/${editID}`, formdata)
    if (!data.success) {
      resetEdit()
      Swal.fire({
        icon: "error",
        title: "Алдаа гарсан"
      })
    }
    if (data.success) {
      resetEdit()
      Swal.fire({
        icon: "success",
        title: "Засагдсан"
      })
    }
  }

  const resetEdit = () => {
    setRefreshKey(old => old + 1)
    setName("")
    setOrder(0)
    setSelectedCategoryList([])
    setIsModalVisible(false)
    setEdit(false)
    setEditID(false)
    setConfirmLoading(false)
  }
  const resetCreate = () => {
    setIsModalVisible(false)
    setConfirmLoading(false)
    setOrder(0)
    setRefreshKey(old => old + 1)
    setName("")
    setSelectedCategoryList([])
  }

  const deleteBigcategory = async (item) => {
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
        const { data } = await axios.delete(`/bigcategory/${item._id}`);
        if (data.success) {
          setRefreshKey(old => old + 1)
          Swal.fire({
            icon: "success",
            title: "Устгагдлаа!",
          });
        } else {
          Swal.fire("Алдаа", "error");
        }
      }
    });
  }

  const searchingBigCategory = (prop) => {
    if (BigCategoryList) {
      const SearchBigCategory = BigCategoryList.filter((el) => {
        if (prop === "") {
          return el;
        } else {
          return el.name.toLowerCase().includes(prop);
        }
      });
      return setFilteredBigCategoryList(SearchBigCategory);
    }
  }

  return (
    <Card
      style={{ marginLeft: "20px" }}
      title={<input type={"search"} onChange={(e) => searchingBigCategory(e.target.value)} placeholder="Хайх..." className="p-2 border rounded-md" />}
      extra={
        <Button
          onClick={() => setIsModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Ангилал заах
        </Button>
      }
    >
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Дараалал</TableCell>
              <TableCell className="tableCell">Super ангилал нэр</TableCell>
              <TableCell className="tableCell">Дотор байгаа ангилал</TableCell>
              <TableCell className="tableCell">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {

              loading ?
                <div className="animate-spin">
                  <AiOutlineLoading3Quarters size={40} />
                </div>
                :
                FilteredBigCategoryList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="tableCell">
                        {
                          "№" + row.order
                        }
                      </TableCell>
                      <TableCell className="tableCell">
                        <h2>{row.name}</h2>
                      </TableCell>
                      <TableCell className="tableCell">
                        <div className="w-[300px] h-[100px] gap-2 overflow-auto flex flex-wrap">
                          {row?.angilals?.map((item, index) => (
                            <h1 className="bg-gray-300/50 rounded-md p-2" key={index}>{item.name}</h1>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="tableCell">

                        <button
                          onClick={() => setUpEdit(row)}
                          className="text-yellow-500 text-xl mx-2"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() => deleteBigcategory(row)}
                          className="text-red-500 text-xl mx-2"
                        >
                          <DeleteOutlined />
                        </button>

                      </TableCell>
                    </TableRow>
                  ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={angilal.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Modal confirmLoading={confirmLoading} title="Ангилал ангилах" width={600} visible={isModalVisible} cancelText={'Болих'} okText={edit ? "Засах" : "Бүртгэх"} onOk={edit ? () => editBigAngilal() : () => createBigAngilal()} onCancel={handleCancel}>
        <div className="w-full h-[500px]">
          <div className="p-2 border rounded-md">
            <input placeholder="Ангилах ангилалын нэр өгөх" className="w-full border rounded-md p-2 mt-2" value={Name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Ангилах ангилалын дараалал" type={"number"} className="w-full border rounded-md p-2 mt-2" value={order} onChange={(e) => setOrder(e.target.value)} />

            <div className="flex flex-wrap mt-2 h-[200px] overflow-auto">
              {
                selectedCategoryList?.map((item, index) => (
                  <div key={index} className="p-2 bg-gray-300/50 rounded-md flex justify-center items-center m-2 gap-2 h-10">
                    <h1 className="text-sm">{item.name}</h1>
                    <button onClick={() => removeFromSelected(item)}>
                      <IoMdRemoveCircleOutline color="red" size={20} />
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
          <select onChange={(e) => addSelectedCategory(e.target.value)} className="w-full border rounded-md p-2 mt-2">
            <option label="Ангилал сонгох" value={"notchosen"} />
            {
              angilal.map((item, index) => (
                item.chosen === false &&
                <option key={index} value={`${item.name}~${item._id}`} >{item.name}</option>
              ))
            }
          </select>
        </div>
      </Modal>
    </Card >
  );
};

export default Datatable;
