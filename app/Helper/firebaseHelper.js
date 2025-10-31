// firestoreService.js
import {getAuth, createUserWithEmailAndPassword,sendPasswordResetEmail,signInWithEmailAndPassword,signOut} from "firebase/auth";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc} from 'firebase/firestore';
import { auth, db } from '../../firebase'; // make sure you export both db and auth in firebase.js

//--------------------------------
// 🔹 Firestore Services
//--------------------------------

// ✅ Add data
export const addData = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};


// ✅ Get all data
export const getAllData = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (e) {
        console.error("Error getting documents: ", e);
    }
};

// ✅ Get single document
export const getDataById = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
    }
};

// ✅ Update document
export const updateData = async (collectionName, id, newData) => {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, newData);
        console.log("Document updated successfully");
    } catch (e) {
        console.error("Error updating document: ", e);
    }
};

// ✅ Delete document
export const deleteData = async (collectionName, id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        console.log("Document deleted successfully");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};

//--------------------------------
// 🔹 Firebase Auth Services
//--------------------------------

// ✅ Sign Up
export async function handleSignUp(email, password, extraData = {}) {
  console.log("handleSignUp called - types/values:", {
    emailType: typeof email,
    emailValue: `"${email}"`,
    passwordType: typeof password,
    passwordValue: !!password ? "[REDACTED]" : password,
    extraData,
  });

  const emailTrim = (email || "").toString().trim().toLowerCase();
  if (!emailTrim || typeof password !== "string" || password.length < 6) {
    const err = new Error("Invalid email or password before Firebase call");
    console.error(err);
    throw err;
  }

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, emailTrim, password);
    console.log("Firebase signup success:", userCredential.user?.uid);
    // save extraData to Firestore/Realtime DB here if needed
    return userCredential.user;
  } catch (err) {
    console.error("Firebase createUserWithEmailAndPassword error:", err);
    throw err;
  }
};

// ✅ Login
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = await getDataById("users", userCredential.user.uid);
        return userData;
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};

// ✅ Forgot Password
export const forgotPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent!");
    } catch (error) {
        console.error("Error sending reset email:", error.message);
        throw error;
    }
};

// ✅ Logout
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully");
    } catch (error) {
        console.error("Error logging out:", error.message);
        throw error;
    }
};

export const uploadImageToCloudinary = async (imageUri) => {
    const CLOUD_NAME = "djeiiaeyl";
    const UPLOAD_PRESET = "react_native_uploads";


    try {
       

        let data = new FormData();
        data.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "upload.jpg",
        });
        data.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
           ` https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const result = await res.json();

        return result.secure_url; // 🔥 Cloudinary hosted URL
    } catch (err) {
        console.error("Cloudinary upload failed", err);
        throw err;
    }
};


// ✅ Save or update additional user details (uses addDoc)
export async function addUserDetails(extraData = {}) {
  try {
    const authInstance = getAuth();
    const uid = authInstance.currentUser?.uid;
    if (!uid) {
      throw new Error("No authenticated user. Please sign in first.");
    }

    const payload = {
      uid,
      ...extraData,
      updatedAt: new Date().toISOString(),
    };

    const docId = await addData("users", payload);
    return { docId, uid };
  } catch (err) {
    console.error("addUserDetails error:", err);
    throw err;
  }
}




