import { initializeApp} from "firebase/app";
import { getStorage,ref,uploadBytesResumable,getDownloadURL  } from "firebase/storage";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD4UYnH15D9_2q4fF_DsIQ4m6_7iyoqIlo",
    authDomain: "raftmedia-5c1dd.firebaseapp.com",
    projectId: "raftmedia-5c1dd",
    storageBucket: "raftmedia-5c1dd.appspot.com",
    messagingSenderId: "1038811918803",
    appId: "1:1038811918803:web:0216edcfc1d00e7ca27f26"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);


const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
    console.log(user);
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log(res.user);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      following:[],
      followers:[],
      createdAt: new Date().toLocaleString()
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const createPost = async (name,posttextData, postImage) => {
  try {
    const storageRef = ref(storage, `/files/${postImage.name}`)
    const uploadTask = uploadBytesResumable(storageRef, postImage);
    const user = auth.currentUser.uid;
    let imageurl="";    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
          const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          console.log(percent + "% done");
      },
      (err) => console.log(err),
       () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url)  => {
            imageurl=url;
          }).then(async()=>{
            let generalref=collection(db, `Posts/allPosts/${user}/`);
            await addDoc(generalref, {
                uid:user,
                Pk:new Date().getTime(),
                name:name,
                posttextData,
                imageurl,
                timestamp:new Date().toLocaleString(),
                likes:[],
                comments:{},
                shares:[]
              });
              alert("Post Created");
              return true;
          })
      }
  )} 
  catch (err) {
    console.error(err);
    alert("Please Verify Your Details");
    return false;
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  createPost,
  logout,
};