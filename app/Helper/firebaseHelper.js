// firestoreService.js
import {getAuth, createUserWithEmailAndPassword,sendPasswordResetEmail,signInWithEmailAndPassword,signOut} from "firebase/auth";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, query, where, serverTimestamp} from 'firebase/firestore';
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
    const uid = userCredential.user?.uid;
    console.log("Firebase signup success:", uid);

    // Prepare profile payload (do not store plaintext password)
    const { password: _omitPassword, ...cleanExtra } = extraData || {};
    const payload = {
      uid,
      ...cleanExtra,
      email: emailTrim,
      createdAt: cleanExtra?.createdAt || new Date().toISOString(),
    };

    // Persist to Firestore with uid as document id
    if (uid) {
      await setDoc(doc(db, "users", uid), payload, { merge: true });
    }

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
        // Check if user is authenticated before attempting signout
        const currentUser = auth.currentUser;
        
        if (currentUser) {
            await signOut(auth);
            console.log("User logged out successfully from Firebase Auth");
        } else {
            console.log("No user to logout - already signed out");
        }
    } catch (error) {
        console.error("Error logging out:", error.message);
        // Re-throw error so calling code can handle it
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
           `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
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


// ✅ Save or update additional user details (updates existing document)
export async function addUserDetails(extraData = {}) {
  try {
    const authInstance = getAuth();
    const uid = authInstance.currentUser?.uid;
    if (!uid) {
      throw new Error("No authenticated user. Please sign in first.");
    }

    // Remove password fields from extraData
    const { password, confirmpassword, confirmPassword, confirm_password, ...safeData } = extraData;
    
    const payload = {
      ...safeData,
      updatedAt: new Date().toISOString(),
    };

    // Update existing document instead of creating new one
    await updateData("users", uid, payload);
    console.log("User details updated successfully for uid:", uid);
    return { uid };
  } catch (err) {
    console.error("addUserDetails error:", err);
    throw err;
  }
}

//--------------------------------
// 🔹 Chat Services
//--------------------------------

// ✅ Get or create conversation between two users
export async function getOrCreateConversation(userId1, userId2) {
  try {
    // Create sorted participant array for consistent conversation ID
    const participants = [userId1, userId2].sort();
    
    // Check if conversation already exists
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', '==', participants)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Conversation exists, return its ID
      return querySnapshot.docs[0].id;
    }
    
    // Create new conversation
    const newConversation = {
      participants: participants,
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      unreadCount: {
        [userId1]: 0,
        [userId2]: 0,
      },
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(conversationsRef, newConversation);
    return docRef.id;
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error;
  }
}




