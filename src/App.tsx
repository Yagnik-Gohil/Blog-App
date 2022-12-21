import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import BlogGrid from './components/BlogGrid';
import Navbar from './components/Navbar';
import BlogPost from './components/BlogPost';
import Footer from './components/Footer';
import CreateBlog from './components/CreateBlog';
import Login from './components/Login';
import Signup from './components/Signup';
import Account from './components/Account';
import MyBlogs from './components/MyBlogs';
import EditBlog from './components/EditBlog';
function App() {
  return (
    <div className='container-fluid p-0'>
      <Navbar></Navbar>
      <br></br>
        <Routes>
          <Route path="/" element={<BlogGrid></BlogGrid>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/account" element={<Account></Account>}></Route>
          <Route path="/my-blogs" element={<MyBlogs></MyBlogs>}></Route>
          <Route path="/:slug" element={<BlogPost></BlogPost>}></Route>
          <Route path="/create-blog" element={<CreateBlog></CreateBlog>}></Route>
          <Route path="/edit/:slug" element={<EditBlog></EditBlog>}></Route>
        </Routes>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default App;
