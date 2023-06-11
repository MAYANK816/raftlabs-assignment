import React,{useEffect,useState} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth,db } from '../Firebase/Firebase';
import { getDocs,collection } from 'firebase/firestore';
import UserCard from './UserCard';
const Followers = () => {
  
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [info, setInfo] = useState([]);
    useEffect(() => {
      if (loading) return;
      else if (!user) 
      {
        navigate("/");
      }
      else if(error){
        alert(error);
      }
      else{
        fetchData();
      }
    }, [user, loading,error]);

    const fetchData = async () => {
      try {
        let followersData = await getFollowers();
        setFollowers(followersData);
        fetchUserDetail(followersData);
      } catch (error) {
        console.error("Error fetching following:", error);
        // Handle the error
      }
    };
    

    const getFollowers = async () => {
      if (user) {
        try {
          let followers2 = [];
          const querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc) => {
            if (doc.data().uid === user.uid) {
             followers2=doc.data().followers;
            }
          });
          return followers2; // Return the following data
        } catch (error) {
          throw new Error("Error fetching following: " + error);
        }
      }
    };
    const fetchUserDetail = async (followersData2) => {
      if (user) {
      let postData = [];
        for ( let id of followersData2){
          const querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc) => {
            if(doc.data().uid === id){
            let data = doc.data();
            postData.push(data);
            }
          });
        }
        setInfo(postData);
      }
      else{
        console.log("no");
      }
    };

  return (
    <div style={{background:"url('https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg?w=740&t=st=1686120077~exp=1686120677~hmac=13d448074a0639ab84fd4665f1dc3dc2f277a471e7dde7a65fca30e7a39fb06d')",
    backgroundRepeat:"no-repeat",backgroundSize:"cover",height:"100vh"}} >
    {loading ? (
      "Loading..."
    ) : followers.length > 0 ? (
      info.map((postData,idx) => (
        <UserCard postData={postData}/>
      ))
    ) : null}
    {!loading && followers.length === 0 && <div>No Followers</div>}
  </div>
  
  )
}

export default Followers