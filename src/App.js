import React from 'react'
import { Routes,Route } from 'react-router-dom'
import SignIn from './components/SignIn'
import Register from './components/Register'
import Home from './components/Home'
import TopBar from './components/TopBar'
import Profile from './components/Profile'
import Followers from './components/Followers'
import CreatePost from './components/CreatePost'
import ForgotPassword from './components/ForgotPassword'
import './App.css'
const App = () => {
  return (
    <div style={{background:"url('https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg?w=740&t=st=1686120077~exp=1686120677~hmac=13d448074a0639ab84fd4665f1dc3dc2f277a471e7dde7a65fca30e7a39fb06d')",
    backgroundRepeat:"no-repeat",backgroundSize:"cover",height:"100vh"}}>
    <TopBar />
    <Routes>
      <Route path="/" element={<SignIn/>} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/followers" element={<Followers />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/forgot_password" element={<ForgotPassword/>}/>
      <Route path="/user/:id" element={<Profile/>} />
    </Routes>

    </div>
  )
}

export default App