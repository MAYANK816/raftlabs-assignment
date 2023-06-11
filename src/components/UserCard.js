import React from 'react'
import {Divider} from '@mui/material';
import { useNavigate } from 'react-router-dom';
const UserCard = ({postData}) => {
    const navigate = useNavigate();
  return (
    <>
     <div className='w-full flex flex-col px-5 py-2  mb-3' style={{cursor:"pointer"}}>
    <div className="flex items-center justify-around mb-2 mt-2" onClick={()=>navigate(`/user/${postData.uid}`)} key={postData.uid}> <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="profilepic" className="rounded-full border" style={{height:"50px",width:"50px"}}/><p className='ml-1'>{postData.name}</p></div>
   <Divider />
   </div>
    </>
  )
}

export default UserCard