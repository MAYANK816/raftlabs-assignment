import React,{useEffect,useState} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate,Link } from 'react-router-dom';
import { auth,createPost } from '../Firebase/Firebase';
import { PhotoIcon } from '@heroicons/react/24/solid'
import {Box} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

const CreatePost = () => {
  const [loader,setLoader] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [postText, setpostText] = useState("");
 
  // Handles input change event and updates state
  function handleChange(event) {
      setFile(event.target.files[0]);
  }

    useEffect(() => {
      if (loading) return;
      if (!user) 
      {
        navigate("/");
      }
      if(error){
        alert(error);
      }
      // eslint-disable-next-line
    }, [user, loading,error]);

    const handleSubmit =async (e) => {
      e.preventDefault();
      setLoader(true);
    if (!file) {
        alert("Please choose a file first!")
        setLoader(false);
        return;
    }
       createPost(user.email,postText,file).then((result)=>{
        setLoader(false);
        navigate("/home");
       })
    

  }
  return (
    <div >
    <form className='m-10' onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  onChange={(e) => setpostText(e.target.value)}
                  className="focus:outline-none focus:shadow-outline outline-none border-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={' '}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>

            </div>
            {loader===true && <Box sx={{ display: 'flex' }}>
            <CircularProgress />
            </Box>}

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span className='outline-none border-none focus:outline-none focus:shadow-outline'>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link type="button" className="text-sm font-semibold leading-6 text-gray-900" to="/home">
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Post
        </button>
      </div>
    </form>
    </div>
  )
}

export default CreatePost