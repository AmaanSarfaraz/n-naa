import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminContext from '../../context/admin/adminContext.js';
import { Link } from 'react-router-dom';
import {API_URL} from '../../services/config.js'


const AdminRegister = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const navigateTo = useNavigate();
  const { setIsAdminAuthenticated, setAdmin, admin } = useContext(AdminContext);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
      setCoverImage(file);
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('gender', gender);
      formData.append('dob', dob);
      formData.append('avatar', avatar);
      formData.append('coverImage', coverImage);

      const response = await axios.post(
        `${API_URL}/api/v1/admin/register`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setAdmin(response.data);
      setIsAdminAuthenticated(true);
      navigateTo("/dashboard");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="font-[sans-serif] text-[#333] ml-[260px] h-screen">
      <div className="text-center bg-black min-h-[172px] sm:p-6 p-4">
        <h4 className="sm:text-3xl text-2xl font-bold text-white">Admin Registration</h4>
      </div>
      <div className="mx-4 mb-4 -mt-16">
        <form onSubmit={handleRegister} className=" max-w-4xl mx-auto bg-white shadow-[0_2px_18px_-3px_rgba(6,81,237,0.4)] sm:p-8 p-4 rounded-md">
            <div className="">
                <div className="flex flex-col items-center">
                    <div className="w-full relative">
                        <div
                            className="w-full h-48 bg-gray-200 flex items-center justify-center cursor-pointer border border-black"
                            style={{borderTopLeftRadius: "92px", borderBottomLeftRadius: "92px"}}
                            onClick={() => document.getElementById('coverImageInput').click()}
                            >
                            {coverImagePreview ? (
                                <img
                                src={coverImagePreview}
                                alt="Cover Image Preview"
                                className="w-full h-full object-cover"
                                style={{borderTopLeftRadius: "92px", borderBottomLeftRadius: "92px"}}
                                />
                            ) : (
                                <span className="text-gray-500">Cover image</span>
                            )}
                        </div>
                        <input
                        type="file"
                        accept="image/*"
                        id="coverImageInput"
                        onChange={handleCoverImageChange}
                        className="hidden"
                        />
                        <div className="absolute bottom-0">
                            <div
                                    className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border border-black"
                                    onClick={() => document.getElementById('avatarInput').click()}
                                >
                                    {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    ) : (
                                    <span className="text-gray-500">Avatar</span>
                                    )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                id="avatarInput"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-y-7 gap-x-12 mt-8">
                <div>
                <label className="text-sm mb-2 block">username</label>
                <input autoComplete="username" name="name" type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-black" placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                <label className="text-sm mb-2 block">Full Name</label>
                <input autoComplete="fullname" name="name" type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-black" placeholder="Enter Full name" onChange={(e) => setFullName(e.target.value)}/>
                </div>
                <div>
                <label className="text-sm mb-2 block">Email Id</label>
                <input autoComplete="email" name="email" type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-black" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                <label className="text-sm mb-2 block">Mobile No.</label>
                <input autoComplete="tel" name="number" type="number" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-black" placeholder="Enter mobile number" onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <div>
                <label className="text-sm mb-2 block">Password</label>
                <input autoComplete="current-password" name="password" type="password" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-black" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                  <label className="text-sm mb-2 block">Gender</label>
                  <div className="relative flex items-center">
                    <select 
                        name="gender"
                        required
                        className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-black"
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="" className='text-sm block mb-2'>Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                <label className="text-sm mb-2 block">Dob</label>
                <input autoComplete="bday" name="dob" type="date" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-black" placeholder="Enter dob" onChange={(e) => setDob(e.target.value)}/>
                </div>
                <div>
                <label className="text-sm mb-2 block">Role</label>
                <input autoComplete="role" name="bloodGroup" type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-black cursor-not-allowed placeholder-black" placeholder="Admin" disabled/>
                </div>
            </div>
            <div className="flex items-center mt-8">
                <input autoComplete="on" id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 rounded" />
                <label htmlFor="remember-me" className="ml-3 block text-sm">
                I accept the <Link className="text-black-500 font-semibold hover:underline ml-1">Terms and Conditions</Link>
                </label>
            </div>
            <div className="!mt-10">
                <button type="submit" className="min-w-[150px] py-3 px-4 text-sm font-semibold rounded-md text-white bg-black hover:bg-white hover:text-black border-2 border-black focus:outline-none">
                Sign up
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}


export default AdminRegister;
