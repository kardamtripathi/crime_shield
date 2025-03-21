import React, { useContext, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, Link, useNavigate, useParams } from "react-router-dom";
import Logo from "../../assets/logo2.png";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import LoginImg from "../../assets/login.png";
import { BACKEND_URL } from "../../BackendUrl";
import { CircularProgress } from "@mui/material";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/user/resetPassword/${id}/${token}`,
        { password },
        {
          withCredentials: true,
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        // console.log(response);
        if (response.data.Status === "Success") {
          toast.success(response.data.message);
          setLoading(false);
          navigate("/login");
        }
      } else {
        toast.error("Unexpected response from server");
        setLoading(false);
      }
      setEmail("");
      setPassword("");
      setRole("");
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred while logging in"
      );
      setLoading(false);
    }
  };
  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src={Logo} alt="logo" />
            <h3>Reset Password</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Enter New Password</label>
              <div>
                <RiLock2Fill />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Your New Password"
                />
              </div>
            </div>
            {loading ? (
              <div className="loaderContainer">
                <CircularProgress />
              </div>
            ) : (
              <button onClick={handleSubmit} type="submit">
                Submit
              </button>
            )}
          </form>
        </div>
        <div className="banner">
          <img src={LoginImg} alt="login" />
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
