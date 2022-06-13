import "./User.scss";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";

const User = () => {
  return (
    <div className="User">
      <div className="UserContainer">
        <Navbar />
        <Datatable />
      </div>
    </div>
  );
};

export default User;
