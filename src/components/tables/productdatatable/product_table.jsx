import "./product.scss";
import { useEffect, useState } from "react";
import { Dropdown, Modal } from "antd";
import { UploadOutlined, DownOutlined, PlusOutlined, UpOutlined, RightOutlined, LineOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Tag, Space } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";

const { Column, ColumnGroup } = Table;


const Datatable = () => {
  const [data, setData] = useState([]);
  const [createProductModal, setCreateProductModal] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [filteredCategoryList, setFilteredCategoryList] = useState([])
  const [subAngilalDrop, setSubAngilalDrop] = useState(false)
  const [matchingIndex, setMatchingIndex] = useState("")
  const [brand, setBrand] = useState([])

  const [nameOfCategory, setNameOfCategory] = useState("")
  const [nameOfCategorySub, setNameOfCategorySub] = useState("")
  const [subID, setSubID] = useState("")
  const [openSelection, setOpenSelection] = useState(false)
  const [Step, setStep] = useState("")

  useEffect(() => {
    const getCategory = async () => {
      const { data } = await axios.get(`/angilal`)
      if (data.success) {
        setCategoryList(data.data)
        setFilteredCategoryList(data.data)
      }
    }
    getCategory()
    const getProducts = async () => {
      const { data } = await axios.get("/product")
      if (data.success) {
        setData(data.result)
      }
    }
    getProducts()
  }, [])
  useEffect(() => {
    axios
      .get("/brand")
      .then((response) => {
        const data = response.data.data;
        // console.log("dataaaaaa", response.data.data);
        setBrand(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  //create and save product form

  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productBrand, setProductBrand] = useState("")
  const [productSKU, setProductSKU] = useState("")
  const [productPrice, setProductPrice] = useState(0)
  const [productQuantity, setProductQuantity] = useState(0)


  const [productSpecAddName, setProductSpecAddName] = useState("")
  const [productSpecAddDescription, setProductSpecAddDescription] = useState("")

  let files = [];
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [images, setImages] = useState(null)

  const [productSpecList, setProductSpecList] = useState([])

  const addSpecs = () => {
    setProductSpecList(current => [...current, {
      name: productSpecAddName,
      desc: productSpecAddDescription
    }])
    setProductSpecAddName("")
    setProductSpecAddDescription("")
  }
  const removeSpecs = (name) => {
    setProductSpecList(current =>
      current.filter(item => {
        return item.name !== name;
      }),
    );
  };

  const registerProduct = async () => {
    try {
      let formdata = new FormData()
      formdata.append("SubID", subID)
      formdata.append("name", productName)
      formdata.append("content", productDescription)
      formdata.append("brand", productBrand)
      formdata.append("price", productPrice)
      formdata.append("quantity", productQuantity)
      formdata.append("SKU", productSKU)
      productSpecList?.forEach(item => { formdata.append("specs", JSON.stringify(item)) })
      formdata.append("avatar", image1[0])
      formdata.append("thumbnail", image2[0])
      for (const key of Object.keys(images)) {
        formdata.append('images', images[key])
      }
      const { data } = await axios.post("/product", formdata)
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Added"
        })
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error"
      })
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
        okButtonProps={
          {
            disabled: Step === "final" ? false : true
          }
        }
        onOk={
          () => registerProduct()
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
                                setStep("first")
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
                  setStep("first")
                }} className={`px-2 py-1 rounded-sm  ${Step === "first" ? "bg-blue-200" : "bg-gray-200"} flex justify-center items-center cursor-pointer`}>Бараа</div>
                <div className="flex jsutify-center items-center" ><LineOutlined /><RightOutlined /></div>
                <div onClick={() => {
                  setStep("second")
                }} className={`px-2 py-1 rounded-sm  ${Step === "second" ? "bg-blue-200" : "bg-gray-200"} flex justify-center items-center cursor-pointer`}>Бараа үзүүлэлт</div>
                <div className="flex jsutify-center items-center" ><LineOutlined /><RightOutlined /></div>
                <div onClick={() => {
                  setStep("third")
                }} className={`px-2 py-1 rounded-sm  ${Step === "third" ? "bg-blue-200" : "bg-gray-200"} flex justify-center items-center cursor-pointer`}>Барааний зураг</div>
                <div className="flex jsutify-center items-center" ><LineOutlined /><RightOutlined /></div>
                <div onClick={() => {
                  setStep("final")
                }} className={`px-2 py-1 rounded-sm  ${Step === "final" ? "bg-blue-200" : "bg-gray-200"} flex justify-center items-center cursor-pointer`}>Эцэс</div>
              </div>
            }
            {
              Step === "first" &&
              <div className="w-full flex flex-col">
                <input required value={productName} onChange={(e) => setProductName(e.target.value)} type={"title"} className="w-full p-2 border my-1" placeholder="Нэр" />
                <textarea required value={productDescription} onChange={(e) => setProductDescription(e.target.value)} type={"text"} className="w-full p-2 border my-1" placeholder="Тайлбар" />
                <select className="w-full p-2 border my-1" onChange={(e) => setProductBrand(e.target.value)} >
                  <option label={"Брэнд сонгох"} />
                  {
                    brand?.map((item, index) => (
                      <option key={index} label={item.name} value={item.id} />
                    ))
                  }
                </select>
                <input required value={productSKU} onChange={(e) => setProductSKU(e.target.value)} type={"text"} className="w-full p-2 border my-1" placeholder="SKU" />
                <input required value={productPrice} onChange={(e) => setProductPrice(e.target.value)} type={"number"} className="w-full p-2 border my-1" placeholder="Үнэ" />
                <input required value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} type={"number"} className="w-full p-2 border my-1" placeholder="Тоо ширхэг" />
                <button onClick={() => setStep("second")} className="w-full p-2 bg-green-400 rounded-sm">Дараагийх</button>
              </div>
            }
            {
              Step === "second" &&
              <div className="w-full flex flex-col">
                <input required value={productSpecAddName} onChange={(e) => setProductSpecAddName(e.target.value)} type={"title"} className="w-full p-2 border my-1" placeholder="Үзүүлэлт нэр" />
                <input required value={productSpecAddDescription} onChange={(e) => setProductSpecAddDescription(e.target.value)} type={"text"} className="w-full p-2 border my-1" placeholder="Үзүүлэлт тайлбар" />
                <button onClick={() => addSpecs()} className="w-full bg-[#1990ff] p-2 text-white text-xl flex justify-center items-center"> <PlusOutlined /></button>
                {
                  productSpecList.length !== 0 &&
                  productSpecList.map((item, index) => (
                    <div key={index} className="w-full p-2 hover:bg-gray-200 rounded-sm flex">
                      <div className="w-5/6 flex gap-2">
                        <h1>
                          {
                            item.name
                          }
                        </h1>
                        {
                          item.name &&
                          <h1>
                            :
                          </h1>
                        }
                        <h1>
                          {
                            item.desc
                          }
                        </h1>
                      </div>
                      <button className="w-1/6 text-lg text-red-400" onClick={() => removeSpecs(item.name)}>
                        <MinusCircleOutlined />
                      </button>
                    </div>
                  ))
                }
                <button onClick={() => setStep("third")} className="w-full p-2 bg-green-400 rounded-sm">Дараагийх</button>
              </div>
            }
            {
              Step === "third" &&
              <div className="w-full p-2">
                <input onChange={(e) => setImage1(e.target.files)} type={"file"} className="w-full p-2 border my-1" placeholder="Зураг" />
                <div className="w-full flex flex-wrap gap-2 mt-4 w-48 h-48">
                  {
                    <img src={image1 ? (image1 ? URL.createObjectURL(image1[0] && image1[0]) : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg") : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"} alt="profile" className="w-full h-full object-cover" />
                  }
                </div>
                <input onChange={(e) => setImage2(e.target.files)} type={"file"} className="w-full p-2 border my-1" placeholder="Зураг-2" />
                <div className="w-full flex flex-wrap gap-2 mt-4 w-48 h-48">
                  {
                    <img src={image2 ? (image2 ? URL.createObjectURL(image2[0] && image2[0]) : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg") : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"} alt="profile" className="w-full h-full object-cover" />
                  }
                </div>
                <input multiple onChange={(e) => {
                  if (e.target?.files) {
                    setImages([...files, ...e.target.files])
                  }
                  else {
                    setImages(null);
                  }
                }} className="w-full p-2 border my-1" type="file" id="images" placeholder="Зурагнууд" />
                <div className="w-full h-48 overflow-auto flex">
                  {
                    images?.length !== 0 ? images?.map((item, index) => (
                      <div key={index} className="w-24 h-24 border ">
                        <img src={item ? (item ? URL.createObjectURL(item && item) : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg") : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"} alt="profile" className="w-full h-full object-cover" />
                      </div>))
                      :
                      <h1></h1>
                  }
                </div>
                <button onClick={() => setStep("final")} className="w-full p-2 bg-green-400 rounded-sm">Дараагийх</button>
              </div>
            }
            {
              Step === "final" &&
              <div className="w-full flex flex-row p-2 h-[400px]">
                <div className="w-3/6 flex flex-col gap-1 p-2">
                  {
                    <img src={image1 ? (image1 ? URL.createObjectURL(image1[0] && image1[0]) : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg") : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"} alt="profile" className="w-full h-full object-cover" />
                  }
                  <div className="flex gap-2 h-48 w-full">
                    {
                      images?.length !== 0 ? images?.map((item, index) => (
                        <div key={index} className="w-24 h-24 border ">
                          <img src={item ? (item ? URL.createObjectURL(item && item) : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg") : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"} alt="profile" className="w-full h-full object-cover" />
                        </div>))
                        :
                        <h1></h1>
                    }
                  </div>
                </div>
                <div className="w-3/6 p-2 flex flex-col">
                  <div className="w-full flex flex-col">

                    <h1>
                      Барааний нэр: {productName && productName}
                    </h1>
                    <h1>
                      Барааний брэнд:  {productBrand && productBrand}
                    </h1>
                    <h1>
                      Барааний код: {productSKU && productSKU}
                    </h1>
                    <h1>
                      Барааний үнэ: {productPrice && productPrice}
                    </h1>
                    <h1>
                      Барааний тоо ширхэг:{productQuantity && productQuantity}
                    </h1>
                  </div>
                  <div className="w-full h-[300px] overflow-auto">
                    <h1>
                      Үзүүлэлтүүд:
                    </h1>
                    {
                      productSpecList.map((item, index) => (
                        <div className="w-full flex flex-row flex-wrap">
                          <h1>{item.name}</h1>
                          :
                          <h1>{item.desc}</h1>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </Modal>

      {
        data.length !== 0 && data?.map((item, index) => (
          <div className="w-full p-2">
            <img src={`http://localhost:3001/` + item.avatar} style={{ width: 200 }} />
          </div>
        ))
      }
    </div>
  );
};

export default Datatable;
