import React,{ Fragment,useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {logout,auth,db} from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link,useNavigate } from 'react-router-dom';
import {Box,Typography,Divider,Menu as Menu1} from '@mui/material';

import {
  getDocs,
  collection,
} from "firebase/firestore";
const navigation = [
  { name: 'Home', href: '/home' },
  { name: 'Followers', href: '/followers'},
  { name: 'Create Post', href: '/createpost'},
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function TopBar() {
    let set= new Set();
    let setUid= new Set();
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [users, setUsers] = useState([]);
    const [usersUid, setUsersUid] = useState([]);
    const [anchorEl1, setAnchorEl1] =useState(false);
    const open1 = Boolean(anchorEl1);


    const handleClose1 = () => {
      setAnchorEl1(false);
    };
    const logout_fun=()=>{
      logout();
    }
    const handleClick1 = (event) => {
      setAnchorEl1(true);
    };
  const handleUser = async (e) => {
    e.preventDefault();
    setUsers([]);
    let search_item=document.getElementById("search").value;
    if (user && search_item !== "") {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.data().name.toLowerCase().includes(search_item.toLowerCase())) {
        set.add(doc.data().name);
        setUid.add(doc.data().uid);
        setUsersUid([...setUid]);
        setUsers([...set]);
      }
    });
    }
    handleClick1(e);
  }
  

  return (
    <>
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
               
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>  
                <form className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start ml-6" onSubmit={handleUser} >
                <input type='text' id="search" name="search" className='border rounded-lg w-1/2 h-10 outline-none' placeholder='Search User....' style={{display:"block", paddingLeft:"10px"}} />
                </form>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/user/${user.uid}`}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                     
                      {
                      user?  
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/"
                            onClick={logout_fun}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </Link>
                        )}
                      </Menu.Item>
                      :""
                    }
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  
                  to={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>

    {/*Menu for Search*/}
    <Menu1
        sx={{
          width: 400, height: "140",
          left: "14%",
          top:"40px",
          display: { xs: "none", sm: "block" }
        }}
        open={open1}
        onClose={handleClose1}
        anchorEl={anchorEl1}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ width: 340, height: "auto"}}>
          <Typography variant='h6' sx={{ marginLeft: "10px", marginTop: "10px", marginBottom: "10px" }}>Search Results</Typography>
          <>
            <Divider />
            {
              users.length === 0 ? <Typography sx={{ marginLeft: "10px", marginTop: "10px", marginBottom: "10px" }}>No Results</Typography> : <></>
            }
          </>
          <>
            {
              users.map((item,idx) => {
                return (<div className="flex items-center justify-around mb-2 mt-2" key="123" onClick={()=>navigate(`/user/${usersUid[idx]}`)}> <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="profilepic" className="rounded-full border" style={{height:"50px",width:"50px"}}/><p className='ml-1'>{item}</p></div>)
              })
            }
          </>
        </Box>
      </Menu1>
    </>
  )
}
