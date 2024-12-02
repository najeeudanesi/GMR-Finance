import React, { useEffect, useState } from 'react';
import { post } from '../../utility/fetch';
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from '../UI/InputField';
import toast from 'react-hot-toast';

import greenz from '../../assets/images/Greenzone.png';
import icon from '../../assets/images/Group-2.png';
import Footer from '../layouts/Footer';

const Home = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const makePostRequest = async (urltoken) => {
    // if (password === "" || email === "") {
    //   toast("Please enter email and password");
    //   return
    // }
    setLoading(true);
    // const payload = {
    //   email: email,
    //   password: password,
    // };
    try {
      // const data = await post(`/auth/login/`, payload);
    console.log(urltoken)
      const data = await post(`/Auth/auth?AuthToken=${urltoken}`);


      sessionStorage.setItem('token', "Bearer " + data.resultList.token);
      sessionStorage.setItem('token-expiry-date', data.resultList.expirationDate)
      localStorage.setItem('name', (data.resultList.firstName || "user") + " " + (data.resultList.lastName || "name"));
      localStorage.setItem('role', data.resultList.role || "Finance Admin");
      localStorage.setItem('userId', data.resultList.userId)
      localStorage.setItem('USER_INFO', JSON.stringify(data));
      navigate('/finance/dashboard');

    } catch (error) {
      console.log(error);
      localStorage.removeItem('USER_INFO');
      toast.error("Invalid login credentials");
    }
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  let urltoken = "";
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // Get the value of the 'username' parameter
    urltoken = params.get("emp");
    console.log(urltoken);
    // isadvance = params.get("isadvance");
    // fromdashboard = params.get("fromdashboard");
    // iscompliance = params.get("iscompliance");
    // isRequisition = params.get("isRequisition");
    // isVariation = params.get("isVariation");
    // requestid = params.get("requestid");

    // console.log(urltoken);
    urltoken
      ? makePostRequest(urltoken)
      : (window.location.href =
          "https://emr-test.greenzonetechnologies.com.ng/home");
    // const query = qs.parse(location.search);
    // // encodeToken({ api: query.base }, 'api');
    // handleAuthentication(query.emp);
    // console.log(isadvance);
  }, []);

  return (
    <div className="w-100">
      <div className="banner">
        <div className="login flex-h-end w-100">
          <div>
            <div className='flex flex-v-center w-100 m-l-20'>
              <div className='margin-lg'>
                <div className='m-l-20'><img src={icon} alt='' width={26} height={26} className='m-l-20' /></div>
                <div> <img src={greenz} alt='' width={100} height={26} /></div>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className=' m-t-40'>
                <label>Email</label>
                <InputField type="text" name={"email"} value={email} placeholder={"username or email"} onChange={(e) => setEmail(e.target.value)} required={true} />
              </div>
              <div className='m-t-40'>
                <label>Password</label>
                <div className='password-input-container'>
                  <InputField type={showPassword ? "text" : "password"} name={"password"} value={password} placeholder={"password"} onChange={(e) => setPassword(e.target.value)} required={true} />
                  <button type="button" onClick={toggleShowPassword} className='password-toggle-btn pointer'>{showPassword ? "Hide" : "Show"}</button>
                </div>
              </div>
              <div className='m-t-40'>
                <button disabled={loading} onClick={makePostRequest} className='w-100 btn' type='submit'>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
