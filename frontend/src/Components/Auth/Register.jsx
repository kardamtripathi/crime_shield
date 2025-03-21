import React, { useContext, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, Link } from "react-router-dom";
import Logo from "../../assets/logo2.png";
import { FaPencilAlt, FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneFlip } from "react-icons/fa6";
import { RiLock2Fill } from "react-icons/ri";
import RegisterImg from "../../assets/register.png";
import { BACKEND_URL } from "../../BackendUrl";
import { CircularProgress } from "@mui/material";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/register`,
        { name, email, phone, password, role },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      setUserId(data.data.userId);
      setRegisteredEmail(data.data.email);
      setShowOtp(true);
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setPhone("");
      // setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };
  const handleOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/verifyOTP`,
        { userId, otp },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      setIsAuthorized(true);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };
  const resendOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/resendOTP`,
        { userId, email: registeredEmail },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };
  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src={Logo} alt="logo" />
            <h3>Create an Account</h3>
          </div>
          {showOtp === false ? (
            <>
              <form>
                <div className="inputTag">
                  <label>Register As</label>
                  <div>
                    <FaRegUser />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="Official">Official</option>
                      <option value="Citizen">Citizen</option>
                    </select>
                  </div>
                </div>
                <div className="inputTag">
                  <label>Name</label>
                  <div>
                    <FaPencilAlt />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Your Name"
                    />
                  </div>
                </div>
                <div className="inputTag">
                  <label>Email</label>
                  <div>
                    <MdOutlineMailOutline />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email"
                    />
                  </div>
                </div>
                <div className="inputTag">
                  <label>Password</label>
                  <div>
                    <RiLock2Fill />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Your Password"
                    />
                  </div>
                </div>
                <div className="inputTag">
                  <label>Phone Number</label>
                  <div>
                    <FaPhoneFlip />
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter Your Phone Number"
                    />
                  </div>
                </div>
                {loading ? (
                  <div className="loaderContainer">
                    <CircularProgress />
                  </div>
                ) : (
                  <button onClick={handleRegister} type="submit">
                    Register
                  </button>
                )}
                <Link to={"/login"}>Login</Link>
              </form>
            </>
          ) : (
            <>
              <form>
                <div className="inputTag">
                  <label>Enter OTP</label>
                  <div>
                    <MdOutlineMailOutline />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter Your OTP"
                    />
                  </div>
                  <p>
                    <i>
                      Note: The OTP sent to your Email Id is only valid for{" "}
                      <b>5</b> minutes
                    </i>
                  </p>
                  </div>
                  {
                    loading ? 
                    <div className="loaderContainer">
                      <CircularProgress />
                    </div>
                    : 
                    <>
                      <button onClick={handleOTP} type="submit">
                        Verify
                      </button>
                      <button onClick={resendOTP} type="submit">
                        Resend OTP
                      </button>
                    </>
                  }
              </form>
            </>
          )}
        </div>
        <div className="banner">
          <img src={RegisterImg} alt="register" />
        </div>
      </section>
    </>
  );
};

export default Register;
