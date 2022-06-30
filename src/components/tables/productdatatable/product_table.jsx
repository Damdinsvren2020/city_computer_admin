import "./product.scss";
import { useEffect, useState } from "react";
import { Dropdown, Modal } from "antd";
import { UploadOutlined, DownOutlined, PlusOutlined, UpOutlined, RightOutlined, LineOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Tag, Space } from "antd";
const { Column, ColumnGroup } = Table;

const Datatable = () => {
  const [data, setData] = useState([]);
  const [createProductModal, setCreateProductModal] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [filteredCategoryList, setFilteredCategoryList] = useState([])
  const [subAngilalDrop, setSubAngilalDrop] = useState(false)
  const [matchingIndex, setMatchingIndex] = useState("")

  const [nameOfCategory, setNameOfCategory] = useState("")
  const [nameOfCategorySub, setNameOfCategorySub] = useState("")
  const [subID, setSubID] = useState("")
  const [openSelection, setOpenSelection] = useState(false)
  const [FirstStep, setFirstStep] = useState(null)
  const [SecondStep, setSecondStep] = useState(null)

  useEffect(() => {
    const getCategory = async () => {
      const { data } = await axios.get(`/angilal`)
      if (data.success) {
        setCategoryList(data.data)
        setFilteredCategoryList(data.data)
      }
    }
    getCategory()
  }, [])

  const [modalCatergory, setModalCategory] = useState([])

  const [form] = Form.useForm();

  const searchingCategory = (prop) => {

    if (categoryList) {
      const SearchAngilal = categoryList.filter((el) => {
        if (prop === '') {
          return el;
        }
        else {
          return el.name.toLowerCase().includes(prop)
        }
      })
      return setFilteredCategoryList(SearchAngilal)
    }
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Бүтээгдэхүүн
        <Button onClick={() => setCreateProductModal(true)} type="primary">
          Бүтээгдэхүүн нэмэх
        </Button>
      </div>

      {/* <Table dataSource={data}>
        <ColumnGroup title="Name">
          <Column title="First Name" dataIndex="firstName" key="firstName" />
          <Column title="Last Name" dataIndex="lastName" key="lastName" />
        </ColumnGroup>
        <Column title="Email" dataIndex="email" key="email" />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <button onClick={() => EditUserHandle(record)}>Edit</button>
              <button onClick={() => deleteHandle(record._id)}>Delete</button>
            </Space>
          )}
        />
      </Table> */}

      <Modal
        title={"Бараа бүртгэх"}
        width={1000}
        onCancel={
          () => setCreateProductModal(false)
        }
        visible={createProductModal}
      >
        <div className="w-full h-[500px]">
          <div className="w-full p-2 flex flex-col relative">
            <input onChange={(e) => searchingCategory(e.target.value)} placeholder="Хайх" onFocus={() => setOpenSelection(true)} type={"search"} className="border w-full p-2" placeholder="Ангилал нэрээр хайх" />
            <div className={`absolute transform transition duration-300 origin-top top-16 w-full h-96 border border-t-0 left-0 bg-white z-30 flex flex-col ${openSelection ? "scale-y-100" : "scale-y-0"}`}>
              <div className="w-full flex-1 p-2 overflow-auto">
                {
                  filteredCategoryList?.map((item, index) => (
                    <div key={index} className="w-full p-2 flex flex-col" >
                      <button onClick={() => {
                        setSubAngilalDrop(!subAngilalDrop)
                        setMatchingIndex(index)
                        setNameOfCategory(item.name)
                      }} className="w-full p-2 hover:bg-gray-200 flex items-center text-lg">
                        {
                          subAngilalDrop && matchingIndex === index ? <UpOutlined /> : <DownOutlined />
                        }
                        {item.name}
                      </button>
                      {
                        subAngilalDrop && matchingIndex === index &&
                        <div className="w-full pl-10 flex flex-col items-start h-[300px] overflow-auto">
                          {
                            item?.SubAngilal?.map((item, index) => (
                              <button onClick={() => {
                                setSubAngilalDrop(false)
                                setNameOfCategorySub(item.name)
                                setSubID(item._id)
                                setOpenSelection(false)
                                setFirstStep(true)
                              }} className=" hover:bg-gray-200 w-full flex items-start" key={index}>
                                <h1 className="p-2">
                                  {item.name}
                                </h1>
                              </button>
                            ))
                          }
                        </div>
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className="w-full h-[400px] overflow-auto">
            <div className="w-full">
              <h1 className="text-lg p-2">
                {nameOfCategory}{nameOfCategory && nameOfCategorySub && "/"}{nameOfCategorySub}
              </h1>
            </div>
            {
              nameOfCategory && nameOfCategorySub &&
              <div className="w-full flex justify-center items-center gap-5">
                <div onClick={() => {
                  setFirstStep(true)
                  setSecondStep(false)
                }} className={`h-16 w-16 rounded-full ${FirstStep ? "bg-blue-200" : "bg-gray-200"} flex justify-center items-center cursor-pointer`}>1</div>
                <div className="flex jsutify-center items-center" ><LineOutlined /><RightOutlined /></div>
                <div onClick={() => {
                  setFirstStep(false)
                  setSecondStep(true)
                }} className={`h-16 w-16 rounded-full ${SecondStep ? "bg-blue-200" : "bg-gray-200"} flex justify-center items-center cursor-pointer`}>2</div>
              </div>
            }
            {
              FirstStep &&
              <div className="w-full flex flex-col">
                <input type={"title"} className="w-full p-2 border my-1" placeholder="Нэр" />
                <textarea type={"text"} className="w-full p-2 border my-1" placeholder="Тайлбар" />
                <input type={"search"} className="w-full p-2 border my-1" placeholder="Брэнд" />
                <input type={"text"} className="w-full p-2 border my-1" placeholder="SKU" />
                <input type={"number"} className="w-full p-2 border my-1" placeholder="Үнэ" />
                <input type={"number"} className="w-full p-2 border my-1" placeholder="Тоо ширхэг" />
              </div>
            }
            {
              SecondStep &&
              <div>
                <input type={"file"} className="w-full p-2 border my-1" placeholder="Зураг" />
                <input type={"file"} className="w-full p-2 border my-1" placeholder="Зураг-2" />
                <input multiple type={"file"} className="w-full p-2 border my-1" placeholder="Зурагнууд" />
              </div>
            }
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Datatable;
