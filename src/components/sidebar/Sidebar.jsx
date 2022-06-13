import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CategoryIcon from "@mui/icons-material/Category";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const Sidebar = ({ whichComponent, setWhichComponent }) => {
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">City Computer</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <button
            className="flex flex-row hover:bg-violet-100 w-full gap-2.5 items-center"
            onClick={() => setWhichComponent("Dashboard")}
          >
            <DashboardIcon
              className="icon"
              sx={{ color: "#7450f8", fontSize: 40 }}
            />
            <div className="text-[#969696]">Dashboard</div>
          </button>
          <p className="title">Жагсаалт</p>
          <button
            className="flex flex-row hover:bg-violet-100 w-full gap-2.5 items-center p-[5px]"
            onClick={() => setWhichComponent("Хэрэглэгч")}
          >
            <PersonOutlineIcon
              className="icon"
              sx={{ color: "#7450f8", fontSize: 20 }}
            />
            <div className="text-[#969696]">Хэрэглэгч</div>
          </button>
          <button
            className="flex flex-row hover:bg-violet-100 w-full gap-2.5 items-center p-[5px]"
            onClick={() => setWhichComponent("Ангилал")}
          >
            <CategoryIcon
              className="icon"
              sx={{ color: "#7450f8", fontSize: 20 }}
            />
            <div className="text-[#969696]">Ангилал</div>
          </button>
          <button
            className="flex flex-row hover:bg-violet-100 w-full gap-2.5 items-center p-[5px]"
            onClick={() => setWhichComponent("Бүтээгдхүүн")}
          >
            <StoreIcon
              className="icon"
              sx={{ color: "#7450f8", fontSize: 20 }}
            />
            <div className="text-[#969696]">Бүтээгдхүүн</div>
          </button>
          <li>
            <CreditCardIcon className="icon" />
            <span>Захиалга</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>
          <p className="title">Хэрэглэгч</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li>
            <ExitToAppIcon className="icon" />
            <span>Гарах</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
