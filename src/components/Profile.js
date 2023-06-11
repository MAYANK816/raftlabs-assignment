import { Box, Button, Card, CardContent,Modal, styled, Typography, TextField, ButtonGroup } from '@mui/material'
import React, { useState, useEffect } from 'react'
import './Profile.css'
import { auth, db } from '../Firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/system';
import {
  getDocs,
  collection,
  updateDoc
} from "firebase/firestore";

const Profilecontent = (props) => {
  const [user] = useAuthState(auth);
  let userId=useParams().id;
  let profilePic = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  let coverPic = 'https://wallpapers.com/images/featured/mvehfqz6w2ges2dj.jpg'
  const Styledmodal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  });

  let bio="Bio..."
  const [open, setOpen] = useState(false);
  const [name, setname] = useState("");
  const [following, setfollowing] = useState(0);
  const [follow, setfollow] = useState(0);
  const [followers, setFollowers] = useState([]);
  
  // eslint-disable-next-line 
  const [Posts, setPosts] = useState(0);
  const [status, setstatus] = useState(false);

  // eslint-disable-next-line 
  useEffect(() => {
      getFollowing();
  // eslint-disable-next-line 
    }, [user,setfollowing,setFollowers,userId]);

    const getFollowing = async () => {
      if(user)
      {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        if (doc.data().uid === userId) {
          if(doc.data().followers.includes(user.uid))
          {
            setstatus(true);
          }
          else
          {
            setstatus(false);
          }

          setFollowers(doc.data().followers.length);
          setfollowing(doc.data().following.length);
          setfollow(doc.data().followers.length);
          setname(doc.data().name);
        }
      })
    }
    }

    const handleFollow = async () => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach(async (doc) => {
          if (doc.data().uid === userId) {
            const userRef = doc.ref;
            const existingFollowers = doc.data().followers || [];
    
            if (existingFollowers.includes(user.uid)) {
              alert("User is already in the followers array. Removing user...");
              const updatedFollowers = existingFollowers.filter((id) => id !== user.uid);
              try {
                await updateDoc(userRef, { followers: updatedFollowers });
                await addUserToFollowing(userId);
                alert("Unfollowed successfully!");
              } catch (error) {
                alert("Error in updating:", error);
              }
              return;
            }
    
            const updatedFollowers = [...existingFollowers, user.uid];
    
            try {
              await updateDoc(userRef, { followers: updatedFollowers });
              await addUserToFollowing(userId);
              alert("Followed successfully!");
            } catch (error) {
              console.error("Error updating array field:", error);
            }
          }
        });
      }
    };

    const addUserToFollowing = async (userId) => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach(async (doc) => {
          if (doc.data().uid === user.uid) {
            const userRef = doc.ref;
            const existingFollowing = doc.data().following || [];
    
            if (existingFollowing.includes(userId)) {
              alert("User is already in the followers array. Removing user...");
              const updatedFollowers = existingFollowing.filter((id) => id !== user.uid);
              try {
                await updateDoc(userRef, { following: updatedFollowers });
                await addUserToFollowing(userId);
                alert("Unfollowed successfully!");
              } catch (error) {
                alert("Error in updating:", error);
              }
              return ;
            }
    
            const updatedFollowing = [...existingFollowing, userId];
    
            try {
              await updateDoc(userRef, { following: updatedFollowing });
              alert("User added to following successfully!");
            } catch (error) {
              console.error("Error updating following array:", error);
            }
          }
        });
      }
    };
    
  const viewcover = () => {
    window.open(coverPic, 'width=800, height=600');
  }

  return (
    <Box flex={6} paddingTop={1} sx={{ margin: "2px" }}>
      <Box className="profile" >
        <Box className="profileRight">
          <Box className="profileRightTop">
            <Box className="profileCover">
              <img
                className="profileCoverImg"
                src={coverPic}
                alt="cover img"
                onClick={viewcover}
              />
              <img
                className="profileUserImg"
                src={profilePic}
                alt="profile pic"
              />
             
              {user && user.uid !== userId ? <>
                {status ? <>
                  <Button variant="outlined" color="primary"
                    sx={{
                      display: { sm: "inline-flex", xs: "none" },
                      float: "right",
                    }}  onClick={handleFollow}
                     >Following</Button>
                  <Button variant="outlined" color="primary"
                    sx={{
                      display: { sm: "none", xs: "inline-flex" },
                      float: "right",
                    }}
                    onClick={handleFollow}  >Following</Button>
                </> : <>
                  <Button variant="outlined" color="primary"
                    sx={{
                      display: { sm: "inline-flex", xs: "none" },
                      float: "right",
                    }} onClick={handleFollow}>Follow</Button>
                  <Button variant="outlined" color="primary"
                    sx={{
                      display: { sm: "none", xs: "inline-flex" },
                      float: "right",
                    }} >Follow</Button>
                </>
                }
              </> :
                <></>
              }
            
            </Box>

          </Box>
        </Box>
      </Box>
      <Box className="profileInfo">
        <h4 className="profileInfoName">{name}</h4>
        <Stack direction="row">
          <Box sx={{
            fontWeight: "300",
            height: "auto",
            width: "100%"
          }}>
            {bio}
          </Box>
         
        </Stack>
      </Box>
      <Box>
        <br></br>

        {/** DesktopView*/}
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ display: { xs: "none", sm: "flex" } }}>
          <Box sx={{ width: "10%" }}></Box>
          <Card sx={{ width: "10%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" textAlign="center" >
                {Posts}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Posts
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ width: "10%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                {followers}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Followers
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ width: "10%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                {following}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Following
              </Typography>
            </CardContent>
          </Card>
          <Box sx={{ width: "10%" }}></Box>
        </Stack>

        {/**Mobile View */}
        <Stack direction="row" spacing={2} justifyContent="space-evenly" sx={{ display: { xs: "flex", sm: "none" } }}>
          {/* <Box sx={{ width: "3%" }}></Box> */}
          <Card sx={{ width: "25%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                {Posts}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Posts
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ width: "25%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                {followers}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Followers
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ width: "25%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" textAlign="center">
                {follow}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Following
              </Typography>
            </CardContent>
          </Card>
          {/* <Box sx={{ width: "3%" }}></Box> */}
        </Stack>


      </Box>
      
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Box sx={{
          display: { xs: 'none', sm: 'block' },
          width: '10%',
        }} >
        </Box>
        
        <Box sx={{
          display: { xs: 'none', sm: 'block' },
          width: '10%',
        }} >
        </Box>
      </Stack>
      <Styledmodal
        open={open}
        onClose={e => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component='form' bgcolor={"background.default"} color={"text.primary"} height={250} p={3} borderRadius={5} width={400} >
          <Typography variant='h6' color="gray" textAlign="center" marginBottom={5}>Update Bio</Typography>
          <TextField
            id="standard-multiline-static"
            multiline
            rows={4}
            name="bio"
            defaultValue={bio}
            placeholder="Let people know about you !"
            sx={{ width: "100%" }}
            variant="standard"
          />
          <br />
          <br />
          <br />
          <ButtonGroup variant="contained" aria-label="outlined primary button group" fullWidth>
            <Button type='submit'>Update</Button>
          </ButtonGroup>
        </Box>
      </Styledmodal>

    </Box>
  )
}

export default Profilecontent