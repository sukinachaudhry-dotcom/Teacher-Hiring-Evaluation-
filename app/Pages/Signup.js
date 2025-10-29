// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
// import Fontisto from "@expo/vector-icons/Fontisto";
// import { useDispatch } from "react-redux";
// import { setUser, setRole } from "../Redux/Slices/HomeDataSlice";
// import { handleSignUp } from "../Helper/firebaseHelper";

// const Signup = ({ navigation }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [address, setAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmpassword, setConfirmpassword] = useState("");

//   const dispatch = useDispatch();

//   const goToRegister = async () => {
//     const user = await handleSignUp(email, password, {
//       role: "Teacher",
//       name,
//       email,
//       address,
//     });

//     if (user?.uid) {
//       dispatch(setRole("Teacher"));
//       dispatch(setUser(user));
        
//     } else {
//       alert("Error in sign up");
//     }
//   };

//   return (
//     <ScrollView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>
//       {/* Header */}
//       <View
//         style={{
//           height: 200,
//           borderBottomLeftRadius: 80,
//           borderBottomRightRadius: 80,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text style={{ fontSize: 28, fontWeight: "bold", color: "#333" }}>
//           Sign Up
//         </Text>
//       </View>

//       {/* Form Section */}
//       <View
//         style={{
//           padding: 30,
//           marginTop: -25,
//           backgroundColor: "white",
//           borderRadius: 50,
//         }}
//       >
//         {/* Name */}
//         <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
//           Name
//         </Text>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             borderColor: "#ccc",
//             borderWidth: 1,
//             borderRadius: 8,
//             paddingHorizontal: 10,
//             marginBottom: 15,
//             backgroundColor: "#fff",
//           }}
//         >
//           <TextInput
//             onChangeText={(text) => setName(text)}
//             placeholder="Enter Name"
//             style={{ flex: 1, height: 40, color: "#333" }}
//           />
//         </View>

//         {/* Email */}
//         <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
//           Email
//         </Text>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             borderColor: "#ccc",
//             borderWidth: 1,
//             borderRadius: 8,
//             paddingHorizontal: 10,
//             marginBottom: 15,
//             backgroundColor: "#fff",
//           }}
//         >
//           <TextInput
//             onChangeText={(text) => setEmail(text)}
//             placeholder="Enter Email"
//             style={{ flex: 1, height: 40, color: "#333" }}
//           />
//         </View>

//         {/* Address */}
//         <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
//           Address
//         </Text>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             borderColor: "#ccc",
//             borderWidth: 1,
//             borderRadius: 8,
//             paddingHorizontal: 10,
//             marginBottom: 15,
//             backgroundColor: "#fff",
//           }}
//         >
//           <TextInput
//             onChangeText={(text) => setAddress(text)}
//             placeholder="Enter Address"
//             style={{ flex: 1, height: 40, color: "#333" }}
//           />
//         </View>

//         {/* Password */}
//         <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
//           Password
//         </Text>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             borderColor: "#ccc",
//             borderWidth: 1,
//             borderRadius: 8,
//             paddingHorizontal: 10,
//             marginBottom: 15,
//             backgroundColor: "#fff",
//           }}
//         >
//           <TextInput
//             secureTextEntry
//             onChangeText={(text) => setPassword(text)}
//             placeholder="Enter Password"
//             style={{ flex: 1, height: 40, color: "#333" }}
//           />
//         </View>

//         {/* Confirm Password */}
//         <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
//           Confirm Password
//         </Text>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             borderColor: "#ccc",
//             borderWidth: 1,
//             borderRadius: 8,
//             paddingHorizontal: 10,
//             marginBottom: 15,
//             backgroundColor: "#fff",
//           }}
//         >
//           <TextInput
//             secureTextEntry
//             onChangeText={(text) => setConfirmpassword(text)}
//             placeholder="Confirm Password"
//             style={{ flex: 1, height: 40, color: "#333" }}
//           />
//         </View>

//         {/* Terms */}
//         <TouchableOpacity
//           style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}
//         >
//           <Fontisto
//             name="checkbox-passive"
//             size={15}
//             color="#3b3b3bff"
//             style={{ marginRight: 5 }}
//           />
//           <Text style={{ color: "#555", fontSize: 12 }}>
//             I understood the terms & policy
//           </Text>
//         </TouchableOpacity>

//         {/* Sign Up Button */}
//         <TouchableOpacity
//           onPress={goToRegister}
//           style={{
//             backgroundColor: "purple",
//             paddingVertical: 12,
//             borderRadius: 25,
//             alignItems: "center",
//             marginTop: 10,
//           }}
//         >
//           <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
//             Sign Up
//           </Text>
//         </TouchableOpacity>

//         {/* Social Signup */}
//         <Text
//           style={{
//             textAlign: "center",
//             color: "#555",
//             marginTop: 10,
//             marginBottom: 10,
//           }}
//         >
//           or sign up with
//         </Text>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "#F4F4F4",
//             width: 50,
//             height: 50,
//             borderRadius: 25,
//             justifyContent: "center",
//             alignItems: "center",
//             alignSelf: "center",
//             marginBottom: 15,
//           }}
//         >
//           <Text>🔵🟢🟡🔴</Text>
//         </TouchableOpacity>

//         {/* Already have account */}
//         <View style={{ flexDirection: "row", justifyContent: "center" }}>
//           <Text>Already have an account? </Text>
//           <TouchableOpacity >
//             <Text style={{ color: "purple", fontWeight: "bold" }}>Login</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default Signup;
