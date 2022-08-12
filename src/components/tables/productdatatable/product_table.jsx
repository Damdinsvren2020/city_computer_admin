import "./product.scss";
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
  DeleteOutlined,
} from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { Card } from "antd";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation } from "swiper";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";
import { CDNURL } from "../../../CDNURL";
import { FaPercent } from "react-icons/fa";
const Datatable = () => {
  const [data, setData] = useState([]);
  const [createProductModal, setCreateProductModal] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);
  const [subAngilalDrop, setSubAngilalDrop] = useState(false);
  const [matchingIndex, setMatchingIndex] = useState("");
  const [brand, setBrand] = useState([]);

  const [nameOfCategory, setNameOfCategory] = useState("");
  const [nameOfCategorySub, setNameOfCategorySub] = useState("");
  const [subID, setSubID] = useState("");
  const [openSelection, setOpenSelection] = useState(false);
  const [Step, setStep] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [onSaleModal, setOnSaleModal] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  useEffect(() => {
    const getCategory = async () => {
      const { data } = await axios.get(`/angilal`);
      if (data.success) {
        setCategoryList(data.data);
        setFilteredCategoryList(data.data);
      }
    };
    getCategory();
    const getProducts = async () => {
      const { data } = await axios.get("/product");
      if (data.success) {
        setData(data.result);
      }
    };
    getProducts();
  }, [refreshKey]);
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
  }, [refreshKey]);

  const [modalCatergory, setModalCategory] = useState([]);

  const [form] = Form.useForm();

  const searchingCategory = (prop) => {
    if (categoryList) {
      const SearchAngilal = categoryList.filter((el) => {
        if (prop === "") {
          return el;
        } else {
          return el.name.toLowerCase().includes(prop);
        }
      });
      return setFilteredCategoryList(SearchAngilal);
    }
  };

  //create and save product form

  const [editLoading, setEditLoading] = useState(false);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productSKU, setProductSKU] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productEdit, setEditProduct] = useState(false);
  const [productEditId, setProductEditId] = useState("");

  const [productSpecAddName, setProductSpecAddName] = useState("");
  const [productSpecAddDescription, setProductSpecAddDescription] =
    useState("");

  let files = [];
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [images, setImages] = useState(null);
  const [imageNew1, setImageNew1] = useState(false);
  const [imageNew2, setImageNew2] = useState(false);
  const [imagesNew, setImageNew] = useState(false);

  const [productSpecList, setProductSpecList] = useState([]);

  const [editChooseAngilal, setEditChooseAngilal] = useState(false);
  const [chooseAngilalModal, setChooseAngilalModal] = useState("");
  const [cacheProduct, setCacheProduct] = useState([]);

  const addSpecs = () => {
    setProductSpecList((current) => [
      ...current,
      {
        name: productSpecAddName,
        desc: productSpecAddDescription,
      },
    ]);
    setProductSpecAddName("");
    setProductSpecAddDescription("");
  };
  const removeSpecs = (name) => {
    setProductSpecList((current) =>
      current.filter((item) => {
        return item.name !== name;
      })
    );
  };

  const registerProduct = async () => {
    try {
      let formdata = new FormData();
      formdata.append("SubID", subID);
      formdata.append("name", productName);
      formdata.append("content", productDescription);
      formdata.append("brand", productBrand);
      formdata.append("price", productPrice);
      formdata.append("quantity", productQuantity);
      formdata.append("SKU", productSKU);
      productSpecList?.forEach((item) => {
        formdata.append("specs", JSON.stringify(item));
      });
      formdata.append("avatar", image1[0]);
      formdata.append("thumbnail", image2[0]);
      for (const key of Object.keys(images)) {
        formdata.append("images", images[key]);
      }
      const { data } = await axios.post("/product", formdata);
      if (data.success) {
        resetForm();
        setRefreshKey((old) => old + 1);
        setCreateProductModal(false);
        Swal.fire({
          icon: "success",
          title: "Added",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
      });
    }
  };

  const resetForm = () => {
    setBrand([]);
    setSubID("");
    setNameOfCategory("");
    setNameOfCategorySub("");
    setCategoryList([]);
    setImage1(null);
    setImage2(null);
    setImages(null);
    setMatchingIndex("");
    setProductDescription("");
    setProductBrand("");
    setProductName("");
    setProductPrice(0);
    setProductQuantity(0);
    setProductSKU("");
    setProductSpecList([]);
    setFilteredCategoryList([]);
    setStep(null);
  };

  const setUpEditModal = async (item) => {
    setCacheProduct(item);
    if (item.SubID === null) {
      setEditChooseAngilal(true);
      setProductName(item.name);
      setProductEditId(item._id);
      return Swal.fire({
        icon: "warning",
        title: "Ангилал сонгож өгнө үү!",
      });
    }
    setEditLoading(true);
    setProductEditId(item._id);
    setSubID(item?.SubID?._id);
    setImage1(item.avatar);
    setImage2(item.thumbnail);
    setImages(item.imagesProduct);
    setProductDescription(item.content);
    setProductBrand(item.brand._id);
    setProductName(item.name);
    setProductPrice(item.price);
    setProductQuantity(item.quantity);
    setProductSKU(item.SKU);
    setProductSpecList(item.specs);
    const { data } = await axios.get("/productSub/" + item.SubID._id);
    if (data.success) {
      setEditLoading(false);
      setCreateProductModal(true);
      setEditProduct(true);
      setStep("first");
      setNameOfCategory(data.result.angilal.name);
      setNameOfCategorySub(item.SubID.name);
    } else {
      setEditLoading(false);
    }
  };

  const chooseAngilal = async () => {
    let formdata = new FormData();
    formdata.append("SubID", subID);
    const { data } = await axios.post(
      "/productChoseAngilal/" + productEditId,
      formdata
    );
    if (data.success) {
      setEditChooseAngilal(false);
      setRefreshKey((old) => old + 1);
      // setUpEditModal(data.result)
      Swal.fire({
        icon: "success",
        title: "Та одоо барааний засвараа хийж болно",
      });
    }
  };

  const editProduct = async () => {
    try {
      let formdata = new FormData();
      formdata.append("SubID", subID);
      formdata.append("name", productName);
      formdata.append("content", productDescription);
      formdata.append("brand", productBrand);
      formdata.append("price", productPrice);
      formdata.append("quantity", productQuantity);
      formdata.append("SKU", productSKU);
      productSpecList?.forEach((item) => {
        formdata.append("specs", JSON.stringify(item));
      });
      imageNew1
        ? formdata.append("avatar", image1[0])
        : formdata.append("avatarOld", image1);
      imageNew1 && formdata.append("newAvatar", imageNew1);
      imageNew2
        ? formdata.append("thumbnail", image2[0])
        : formdata.append("thumbnailOld", image2);
      imageNew2 && formdata.append("newThumbnail", imageNew2);
      if (imagesNew) {
        for (const key of Object.keys(images)) {
          formdata.append("images", images[key]);
        }
        formdata.append("newImages", imagesNew);
      } else {
        formdata.append("imagesOld", images);
      }
      const { data } = await axios.post("/product/" + productEditId, formdata);
      if (data.success) {
        setEditLoading(false);
        resetForm();
        setRefreshKey((old) => old + 1);
        setCreateProductModal(false);
        Swal.fire({
          icon: "success",
          title: "Засагдлаа",
        });
      }
    } catch (error) {
      setEditLoading(false);
      Swal.fire({
        icon: "error",
        title: "Алдаа гарлаа",
        text: error.message,
      });
    }
  };

  const editChosenAngilal = async () => { };

  const deleteProduct = async (product) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${product.name} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete("/product/" + product._id);
        if (data.success) {
          setRefreshKey((old) => old + 1);
          Swal.fire({
            icon: "success",
            title: "Устгагдлаа!",
          });
        } else {
          Swal.fire({
            icon: "error",
          });
        }
      }
    });
  };

  const [saleProductName, setSaleProductName] = useState("");
  const [saleProductPrice, setSaleProductPrice] = useState("");
  const [saleProductID, setSaleProductID] = useState("");
  const [saleProductOffer, setSaleProductOffer] = useState(0);
  const [saleProductDate, setSaleProductDate] = useState("")

  const onSaleProduct = (product) => {
    setOnSaleModal(true);
    setSaleProductName(product.name);
    setSaleProductPrice(product.price);
    setSaleProductID(product._id);
    setSaleProductOffer(product?.offer);
    setSaleProductDate(product?.saleValidUntill)
  };

  const resetSale = () => {
    setSaleProductPrice("");
    setSaleProductID("");
    setSaleProductName("");
    setSaleProductOffer("");
    setSaleProductDate("")
  };

  const saveSelectedProductSale = async () => {
    const { data } = await axios.post("/productSale/" + saleProductID, {
      offer: saleProductOffer,
      saleValidUntill: saleProductDate
    });
    if (data.success) {
      resetSale();
      setRefreshKey((old) => old + 1);
      setOnSaleModal(false);
      Swal.fire({
        icon: "success",
        title: "Хадгалсан",
      });
    }
  };

  return (
    <Card
      title="Бүтээгдхүүн"
      style={{ marginLeft: "20px" }}
      extra={
        <Button
          onClick={() => setCreateProductModal(true)}
          icon={<PlusOutlined />}
        >
          Бүтээгдхүүн нэмэх
        </Button>
      }
    >
      {editLoading && (
        <div
          style={{ alignSelf: "center" }}
          className=" top-0 bottom-0 left-0 right-0 absolute z-30 justify-center items-center flex bg-gray-200 rounded-xl text-[50px]"
        >
          <LoadingOutlined />
        </div>
      )}

      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Ангилал</TableCell>
              <TableCell className="tableCell">Зураг</TableCell>
              <TableCell className="tableCell">Нэр</TableCell>
              <TableCell className="tableCell">Тоо ширхэг</TableCell>
              <TableCell className="tableCell">Тайлбар</TableCell>
              <TableCell className="tableCell">Үнэ</TableCell>
              <TableCell className="tableCell">Хямдрал</TableCell>
              <TableCell className="tableCell">SKU</TableCell>
              <TableCell className="tableCell">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell className="tableCell">
                    <div>
                      {row?.angilalId === null ? "Ангилалгүй" : "Ангилалтай"}
                    </div>
                    <div>{row?.SubID?.name}</div>
                  </TableCell>
                  <TableCell className="tableCell">
                    <div>
                      <img
                        src={`${CDNURL}/${row.avatar}`}
                        alt=""
                        className="h-48 w-48 object-contain "
                      />
                      {row.product}
                    </div>
                  </TableCell>
                  <TableCell className="tableCell">
                    <h2>{row.name}</h2>
                  </TableCell>
                  <TableCell className="tableCell">
                    <h2>{row.quantity}</h2>
                  </TableCell>
                  <TableCell className="tableCell">
                    <h2>{row.content}</h2>
                  </TableCell>
                  <TableCell className="tableCell">
                    <h2>{row.price}</h2>
                    {row.offer && (
                      <h2 className="text-red-500">
                        {Math.round(row.price - (row.price * row.offer) / 100)}
                      </h2>
                    )}
                  </TableCell>
                  <TableCell className="tableCell">
                    <button
                      onClick={() => onSaleProduct(row)}
                      className="text-xl text-red-500"
                    >
                      <FaPercent />
                    </button>
                  </TableCell>
                  <TableCell className="tableCell">
                    <h2>{row.SKU}</h2>
                  </TableCell>
                  <TableCell className="tableCell">
                    <button
                      onClick={() => setUpEditModal(row)}
                      className="text-xl text-yellow-500"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => deleteProduct(row)}
                      className="text-xl text-red-500"
                    >
                      <DeleteOutlined />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Modal
        title={productName + "-ын " + "ангилал сонгох"}
        width={1000}
        onCancel={() => setEditChooseAngilal(false)}
        okText={editChooseAngilal ? "Засах" : "Өөрчлөх"}
        onOk={
          editChooseAngilal ? () => chooseAngilal() : () => editChosenAngilal()
        }
        visible={editChooseAngilal}
      >
        <div className="w-full p-2 flex flex-col relative h-48">
          <input
            onChange={(e) => searchingCategory(e.target.value)}
            onFocus={() => setOpenSelection(true)}
            type={"search"}
            className="border w-full p-2"
            placeholder="Ангилал нэрээр хайх"
          />
          <div
            className={`absolute transform transition duration-300 origin-top top-16 w-full h-96 border border-t-0 left-0 bg-white z-30 flex flex-col ${openSelection ? "scale-y-100" : "scale-y-0"
              }`}
          >
            <div className="w-full flex-1 p-2 overflow-auto">
              {filteredCategoryList?.map((item, index) => (
                <div key={index} className="w-full p-2 flex flex-col">
                  <button
                    onClick={() => {
                      setSubAngilalDrop(!subAngilalDrop);
                      setMatchingIndex(index);
                      setNameOfCategory(item.name);
                    }}
                    className="w-full p-2 hover:bg-gray-200 flex items-center text-lg"
                  >
                    {subAngilalDrop && matchingIndex === index ? (
                      <UpOutlined />
                    ) : (
                      <DownOutlined />
                    )}
                    {item.name}
                  </button>
                  {subAngilalDrop && matchingIndex === index && (
                    <div className="w-full pl-10 flex flex-col items-start h-[300px] overflow-auto">
                      {item?.SubAngilal?.map((item, index) => (
                        <button
                          onClick={() => {
                            setSubAngilalDrop(false);
                            setNameOfCategorySub(item.name);
                            setSubID(item._id);
                            setOpenSelection(false);
                          }}
                          className=" hover:bg-gray-200 w-full flex items-start"
                          key={index}
                        >
                          <h1 className="p-2">{item.name}</h1>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-xl">
          Таны сонгосон категори: {nameOfCategory}/{nameOfCategorySub}/
          {productName}
        </div>
      </Modal>
      <Modal
        title="Хямдрал"
        visible={onSaleModal}
        okText={"Хадгалах"}
        cancelText={"Болих"}
        onOk={() => saveSelectedProductSale()}
        onCancel={() => {
          setOnSaleModal(false);
          resetSale();
        }}
      >
        <h1 className="text-center text-red-400">
          Анхаар та хямдарсан үнийг сайн шалгаад хадгална уу!
        </h1>
        <h1 className="text-center text-red-400">
          100 гэж бичсэн тохиолдолд 100% буюу бүрэн хямдарсан гэж үзнэ
        </h1>
        <h1>Нэр-{saleProductName}</h1>
        <h1>Үнэ-{saleProductPrice}</h1>
        <input
          maxlength="3"
          value={saleProductOffer}
          onChange={(e) => {
            const limit = 3;
            setSaleProductOffer(e.target.value.slice(0, limit));
            if (e.target.value >= 100) {
              setSaleProductOffer("");
              Swal.fire({
                icon: "warning",
                title: "100% гаас доош байх хэрэгтэй",
              });
            }
          }}
          placeholder="Хямдралын хувь"
          type={"number"}
          className="p-2 border w-full my-2"
        />
        <input
          value={saleProductDate}
          onChange={(e) => setSaleProductDate(e.target.value)}
          type={"date"}
          className="p-2 border w-full my-2"
        />
        <h1>
          Хямдарч байгаа хувь-{saleProductOffer && saleProductOffer + "%"}
        </h1>
        <h1>
          Хямдарч байгаа үнэ-
          {Math.round((saleProductPrice * saleProductOffer) / 100)}
        </h1>
        <h1>
          Хямдарсаны дараах үнэ-
          {Math.round(
            saleProductPrice - (saleProductPrice * saleProductOffer) / 100
          )}
        </h1>
        <h1>
          Хямдаралын хугацаа-
          {
            saleProductDate
          }
        </h1>
      </Modal>

      <Modal
        title={"Бараа бүртгэх"}
        width={1000}
        onCancel={() => setCreateProductModal(false)}
        okButtonProps={{
          disabled: Step === "final" ? false : true,
        }}
        okText={productEdit ? "Засах" : "Илгээх"}
        onOk={productEdit ? () => editProduct() : () => registerProduct()}
        visible={createProductModal}
      >
        <div className="w-full h-[500px]">
          <div className="w-full p-2 flex flex-col relative">
            <input
              onChange={(e) => searchingCategory(e.target.value)}
              onFocus={() => setOpenSelection(true)}
              type={"search"}
              className="border w-full p-2"
              placeholder="Ангилал нэрээр хайх"
            />
            <div
              className={`absolute transform transition duration-300 origin-top top-16 w-full h-96 border border-t-0 left-0 bg-white z-30 flex flex-col ${openSelection ? "scale-y-100" : "scale-y-0"
                }`}
            >
              <div className="w-full flex-1 p-2 overflow-auto">
                {filteredCategoryList?.map((item, index) => (
                  <div key={index} className="w-full p-2 flex flex-col">
                    <button
                      onClick={() => {
                        setSubAngilalDrop(!subAngilalDrop);
                        setMatchingIndex(index);
                        setNameOfCategory(item.name);
                      }}
                      className="w-full p-2 hover:bg-gray-200 flex items-center text-lg"
                    >
                      {subAngilalDrop && matchingIndex === index ? (
                        <UpOutlined />
                      ) : (
                        <DownOutlined />
                      )}
                      {item.name}
                    </button>
                    {subAngilalDrop && matchingIndex === index && (
                      <div className="w-full pl-10 flex flex-col items-start h-[300px] overflow-auto">
                        {item?.SubAngilal?.map((item, index) => (
                          <button
                            onClick={() => {
                              setSubAngilalDrop(false);
                              setNameOfCategorySub(item.name);
                              setSubID(item._id);
                              setOpenSelection(false);
                              setStep("first");
                            }}
                            className=" hover:bg-gray-200 w-full flex items-start"
                            key={index}
                          >
                            <h1 className="p-2">{item.name}</h1>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full h-[400px] overflow-auto">
            <div className="w-full">
              <h1 className="text-lg p-2">
                {nameOfCategory}
                {nameOfCategory && nameOfCategorySub && "/"}
                {nameOfCategorySub}
              </h1>
            </div>
            {nameOfCategory && nameOfCategorySub && (
              <div className="w-full flex justify-center items-center gap-5">
                <div
                  onClick={() => {
                    setStep("first");
                  }}
                  className={`px-2 py-1 rounded-sm  ${Step === "first" ? "bg-blue-200" : "bg-gray-200"
                    } flex justify-center items-center cursor-pointer`}
                >
                  Бараа
                </div>
                <div className="flex jsutify-center items-center">
                  <LineOutlined />
                  <RightOutlined />
                </div>
                <div
                  onClick={() => {
                    setStep("second");
                  }}
                  className={`px-2 py-1 rounded-sm  ${Step === "second" ? "bg-blue-200" : "bg-gray-200"
                    } flex justify-center items-center cursor-pointer`}
                >
                  Бараа үзүүлэлт
                </div>
                <div className="flex jsutify-center items-center">
                  <LineOutlined />
                  <RightOutlined />
                </div>
                <div
                  onClick={() => {
                    setStep("third");
                  }}
                  className={`px-2 py-1 rounded-sm  ${Step === "third" ? "bg-blue-200" : "bg-gray-200"
                    } flex justify-center items-center cursor-pointer`}
                >
                  Барааний зураг
                </div>
                <div className="flex jsutify-center items-center">
                  <LineOutlined />
                  <RightOutlined />
                </div>
                <div
                  onClick={() => {
                    setStep("final");
                  }}
                  className={`px-2 py-1 rounded-sm  ${Step === "final" ? "bg-blue-200" : "bg-gray-200"
                    } flex justify-center items-center cursor-pointer`}
                >
                  Эцэс
                </div>
              </div>
            )}
            {Step === "first" && (
              <div className="w-full flex flex-col">
                <input
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  type={"title"}
                  className="w-full p-2 border my-1"
                  placeholder="Нэр"
                />
                <textarea
                  required
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  type={"text"}
                  className="w-full p-2 border my-1"
                  placeholder="Тайлбар"
                />
                <select
                  className="w-full p-2 border my-1"
                  onChange={(e) => setProductBrand(e.target.value)}
                >
                  <option label={"Брэнд сонгох"} />
                  {brand?.map((item, index) => (
                    <option key={index} label={item.name} value={item.id} />
                  ))}
                </select>
                <input
                  required
                  value={productSKU}
                  onChange={(e) => setProductSKU(e.target.value)}
                  type={"text"}
                  className="w-full p-2 border my-1"
                  placeholder="SKU"
                />
                <input
                  required
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  type={"number"}
                  className="w-full p-2 border my-1"
                  placeholder="Үнэ"
                />
                <input
                  required
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  type={"number"}
                  className="w-full p-2 border my-1"
                  placeholder="Тоо ширхэг"
                />
                <button
                  onClick={() => setStep("second")}
                  className="w-full p-2 bg-green-400 rounded-sm"
                >
                  Дараагийх
                </button>
              </div>
            )}
            {Step === "second" && (
              <div className="w-full flex flex-col">
                <input
                  required
                  value={productSpecAddName}
                  onChange={(e) => setProductSpecAddName(e.target.value)}
                  type={"title"}
                  className="w-full p-2 border my-1"
                  placeholder="Үзүүлэлт нэр"
                />
                <input
                  required
                  value={productSpecAddDescription}
                  onChange={(e) => setProductSpecAddDescription(e.target.value)}
                  type={"text"}
                  className="w-full p-2 border my-1"
                  placeholder="Үзүүлэлт тайлбар"
                />
                <button
                  onClick={() => addSpecs()}
                  className="w-full bg-[#1990ff] p-2 text-white text-xl flex justify-center items-center"
                >
                  {" "}
                  <PlusOutlined />
                </button>
                {productSpecList.length !== 0 &&
                  productSpecList.map((item, index) => (
                    <div
                      key={index}
                      className="w-full p-2 hover:bg-gray-200 rounded-sm flex"
                    >
                      <div className="w-5/6 flex gap-2">
                        <h1>{item.name}</h1>
                        {item.name && <h1>:</h1>}
                        <h1>{item.desc}</h1>
                      </div>
                      <button
                        className="w-1/6 text-lg text-red-400"
                        onClick={() => removeSpecs(item.name)}
                      >
                        <MinusCircleOutlined />
                      </button>
                    </div>
                  ))}
                <button
                  onClick={() => setStep("third")}
                  className="w-full p-2 bg-green-400 rounded-sm"
                >
                  Дараагийх
                </button>
              </div>
            )}
            {Step === "third" && (
              <div className="w-full p-2">
                <input
                  onChange={(e) => {
                    setImage1(e.target.files);
                    setImageNew1(true);
                  }}
                  type={"file"}
                  className="w-full p-2 border my-1"
                  placeholder="Зураг"
                />
                <div className="w-full flex flex-wrap gap-2 mt-4 w-48 h-48">
                  {imageNew1 && (
                    <img
                      src={
                        image1
                          ? image1
                            ? URL.createObjectURL(image1[0] && image1[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {imageNew1 === false && (
                    <img
                      src={CDNURL + "/" + image1}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <input
                  onChange={(e) => {
                    setImage2(e.target.files);
                    setImageNew2(true);
                  }}
                  type={"file"}
                  className="w-full p-2 border my-1"
                  placeholder="Зураг-2"
                />
                <div className="w-full flex flex-wrap gap-2 mt-4 w-48 h-48">
                  {imageNew2 && (
                    <img
                      src={
                        image2
                          ? image2
                            ? URL.createObjectURL(image2[0] && image2[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {imageNew2 == false && (
                    <img
                      src={CDNURL + "/" + image2}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <input
                  multiple
                  onChange={(e) => {
                    if (e.target?.files) {
                      setImages([...files, ...e.target.files]);
                    } else {
                      setImages(null);
                    }
                    setImageNew(true);
                  }}
                  className="w-full p-2 border my-1"
                  type="file"
                  id="images"
                  placeholder="Зурагнууд"
                />
                {imagesNew && (
                  <div className="w-full h-48 overflow-auto flex">
                    {images?.length !== 0 ? (
                      images?.map((item, index) => (
                        <div key={index} className="w-24 h-24 border ">
                          <img
                            src={
                              item
                                ? item
                                  ? URL.createObjectURL(item && item)
                                  : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                                : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                            }
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                )}
                {imagesNew === false && (
                  <div className="w-full h-48 overflow-auto flex">
                    {images?.length !== 0 ? (
                      images?.map((item, index) => (
                        <div key={index} className="w-24 h-24 border ">
                          <img
                            src={`${CDNURL}/${item}`}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <h1></h1>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setStep("final")}
                  className="w-full p-2 bg-green-400 rounded-sm"
                >
                  Дараагийх
                </button>
              </div>
            )}
            {Step === "final" && (
              <div className="w-full flex flex-row p-2 h-[400px]">
                <div className="w-3/6 flex flex-col gap-1 p-2">
                  {imageNew1 && (
                    <img
                      src={
                        image1
                          ? image1
                            ? URL.createObjectURL(image1[0] && image1[0])
                            : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                          : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {imageNew1 === false && (
                    <img
                      src={CDNURL + "/" + image1}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {imagesNew && (
                    <div className="w-full h-48 overflow-auto flex">
                      {images?.length !== 0 ? (
                        images?.map((item, index) => (
                          <div key={index} className="w-24 h-24 border ">
                            <img
                              src={
                                item
                                  ? item
                                    ? URL.createObjectURL(item && item)
                                    : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                                  : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                              }
                              alt="profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <h1></h1>
                      )}
                    </div>
                  )}
                  {imagesNew === false && (
                    <div className="w-full h-48 overflow-auto flex">
                      {images?.length !== 0 ? (
                        images?.map((item, index) => (
                          <div key={index} className="w-24 h-24 border ">
                            <img
                              src={`${CDNURL}/${item}`}
                              alt="profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <h1></h1>
                      )}
                    </div>
                  )}
                </div>
                <div className="w-3/6 p-2 flex flex-col">
                  <div className="w-full flex flex-col">
                    <h1>Барааний нэр: {productName && productName}</h1>
                    <h1>Барааний брэнд: {productBrand && productBrand}</h1>
                    <h1>Барааний код: {productSKU && productSKU}</h1>
                    <h1>Барааний үнэ: {productPrice && productPrice}</h1>
                    <h1>
                      Барааний тоо ширхэг:{productQuantity && productQuantity}
                    </h1>
                  </div>
                  <div className="w-full h-[300px] overflow-auto">
                    <h1>Үзүүлэлтүүд:</h1>
                    {productSpecList.map((item, index) => (
                      <div className="w-full flex flex-row flex-wrap">
                        <h1>{item.name}</h1>:<h1>{item.desc}</h1>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default Datatable;
