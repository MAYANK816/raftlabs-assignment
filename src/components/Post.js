import React,{useEffect, useState} from 'react'
import Heart from "react-animated-heart";
import { BsFillChatLeftDotsFill } from 'react-icons/bs';
import { IconContext } from "react-icons";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth,db } from '../Firebase/Firebase';
import { useNavigate } from 'react-router-dom';
import { updateDoc,getDocs,collection } from 'firebase/firestore';
const Post = ({post,following_id,docId}) => {
    const [user, loading, error] = useAuthState(auth);
    const [isClick, setClick] = useState(post.likes.includes(user?.uid));
    const [isCommentClick, setCommentClick] = useState(false);
    const [likes,setLikes]=useState(post.likes.length);
    const navigate = useNavigate();
    const [comment,setComment]=useState("");

    useEffect(() => {
      if (loading) return;
      else if (!user) navigate('/');
      else {
        setLikes(likes);
      }
    }, [post.likes.length, user, loading, isClick, likes,error,comment]);
    

    const like_post = () => {
      if (isClick === false) {
        setLikes((likes) => likes + 1);
      } else {
        setLikes((likes) => likes - 1);
      }
      setClick(!isClick);
      addUserToLikes();
    };
    

    const addUserToLikes=async()=>{
      // Construct the document reference path
      if (user) {
        const querySnapshot = await getDocs(collection(db, "Posts","allPosts",following_id));       
         querySnapshot.forEach(async (doc) => {
          if(doc.id===docId){
            const userRef = doc.ref;
            const existingLikes= doc.data().likes || [];
              if (existingLikes.includes(user.uid)) {
              const updatedLikes = existingLikes.filter((id) => id !== user.uid);
              try {
                setClick(false);
                await updateDoc(userRef, { likes: updatedLikes });
              } catch (error) {
                alert("Error in updating:", error);
              }
              return;
            }
    
            const updatedLikes = [...existingLikes, user.uid];
    
            try { 
              setClick(true);
              await updateDoc(userRef, { likes: updatedLikes });
              alert("Liked successfully");
            } catch (error) {
              alert("Error in updating:", error);
              console.error("Error updating array field:", error);
            }
          }
        }); 
      }
    
    }
    const handleComment=(e)=>{
      setComment(e.target.value);
    }
    const addUsertoComments = async () => {
      // Construct the document reference path
      if (user) {
        console.log(docId);
        console.log(comment);
        const querySnapshot = await getDocs(collection(db, "Posts", "allPosts", following_id));
        querySnapshot.forEach(async (doc) => {
          if (doc.id === docId) {
            const userRef = doc.ref;
            const existingComments = doc.data().comments || new Map(); // Initialize as an empty map if it's not already present
    
            const updatedCommentsArray = Array.from(existingComments);
            updatedCommentsArray.push([user.uid, comment]);
    
            const updatedComments = Object.fromEntries(updatedCommentsArray);
            try {
              await updateDoc(userRef, { comments: updatedComments });
              alert("Comment added successfully");
            } catch (error) {
              alert("Error in updating:", error);
              console.error("Error updating array field:", error);
            }
          }
        });
      }
    };
    

    return (
    <div className="flex flex-col bg-white border rounded-lg shadow-xl mb-5" style={{height:"100%",minHeight:"440px",width:"60%"}}>
    <div className="flex flex-col items-start px-4 py-6">
     <div className="flex items-center justify-around mb-6"> <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="profilepic" className="rounded-full border" style={{height:"50px",width:"50px"}}/><p className='ml-3'>{post.name}<br/><span className="text-sm text-gray-600">{post.timestamp}</span></p></div>
     
      <img src={post.imageurl} alt="postimage" className='border' style={{height:"100%",backgroundSize:"100% 100%"}} onClick={()=>{window.open(post.imageurl)}}/>
      <p className="mt-2 text-gray-500">{post.posttextData}</p>
      <div className="flex items-center justify-items-start justify-start mb-6 w-full">
        <div className='flex items-center w-1/3'><Heart isClick={isClick} onClick={() =>
        like_post()
          }/><p> {likes} Likes </p></div>
        <div className='flex items-center w-1/3' style={{cursor:"pointer"}} onClick={() => setCommentClick(!isCommentClick)}>
        <IconContext.Provider value={{className: "gray-800" }}>
          <BsFillChatLeftDotsFill /> &nbsp; Comment
          </IconContext.Provider> 
          </div>
      </div>
      <input type='text' onChange={handleComment} className='border rounded-lg w-full h-10' placeholder='Add a comment' style={{display:isCommentClick?"block":"none", paddingLeft:"10px"}}/>
      <button
          type="submit"
          className="rounded-md bg-indigo-600 mt-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          style={{display:isCommentClick?"block":"none"}} onClick={addUsertoComments} >
          Post
        </button>
        {
          post.comments && Object.keys(post.comments).map((key,idx) => {
            return (
              <div className="flex items-center justify-items-start justify-start mt-6 w-full">
                <div className='flex items-center w-1/3'><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="profilepic" className="rounded-full border" style={{height:"30px",width:"30px"}}/><p className='ml-3'>{post.comments[key]}<br/></p></div>
              </div>
            );
          })
        }   
         </div>
    </div>
  )
}

export default Post