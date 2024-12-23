import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useState } from "react";
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import SectionTitle from '../../components/SectionTitle';
import Lottie from 'lottie-react';
import animation from '../../assets/login.json'

const Login = () => {
    let [showPassword, setShowPassword] = useState(false);
    let { setLoading, setUser } = useAuth();
    let navigate = useNavigate();
    let axiosPublic = useAxiosPublic();

    
    let handleLogin = async (e) => {
        e.preventDefault();
        let email = e.target.email.value;
        let password = e.target.password.value;
        let loginInfo = {
            email,
            password
        }
        setLoading(true);
        let res = await axiosPublic.post('/api/login', loginInfo);
        if (res.data?.result) {
            setUser(res.data?.user);
            localStorage.setItem("user", JSON.stringify(res.data?.user));
            localStorage.setItem("access-token", res.data?.token);
            console.log(res.data?.token)
            Swal.fire({
                position: "center",
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
            setLoading(false);
            navigate('/');
        } else {
            Swal.fire({
                icon: 'error',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    return (
        <div className='w-full mx-auto'>
            <SectionTitle title={'Login Now'} subtitle={'browse more?'}></SectionTitle>

            <div className="flex flex-col md:flex-row px-2 justify-center items-center w-full md:w-[900px] mx-auto gap-20">
                <div className="bg-gray-400 max-w-[500px] text-center p-10 rounded-lg">
                    <form onSubmit={handleLogin}>
                        <div className="relative">
                            <p className="text-left text-base-100 text-lg font-semibold">User Email</p>
                            <AiOutlineMail className="absolute bottom-4 left-2"></AiOutlineMail>
                            <input className="w-full p-2 pl-7 text-base rounded-lg my-1"
                                type="email"
                                name="email"
                                placeholder="Type your email"
                                required />
                        </div>
                        <hr className="my-3" />
                        <div className="relative">
                            <p className="text-left text-base-100 text-lg font-semibold">Password</p>
                            <RiLockPasswordFill className="absolute bottom-4 left-2"></RiLockPasswordFill>
                            <input className="w-full p-2 pl-6 text-base rounded-lg my-1"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Type your password"
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-4">{showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}</span>
                        </div>


                        <button className="bg-green-700 text-white py-2 rounded-md w-full mt-5" type="submit">
                            Login</button>
                    </form>
                    <div className="flex justify-between mt-3">
                        <span>{`Don't have an account?`}</span>
                        <Link className="underline text-base text-blue-600" to='/signup'>Signup now</Link>
                    </div>

                </div>
                <div className='flex-1'>
                    <Lottie animationData={animation} loop={true} />
                </div>
            </div>
        </div>
    );
};

export default Login;