import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { login } from "../Helper/firebaseHelper";
import { useDispatch } from "react-redux";
import { setUser, setRole } from "../Redux/Slices/HomeDataSlice";


const Login = ({ navigation }) => {
  const [email, setEmail] = useState("john@gmail.com");
  const [password, setPassword] = useState("Test@1122");
  const dispatch = useDispatch();
  const handleLogin = async () => {
    // navigation.navigate("Bottom")
    const user = await login(email, password)
    if (user?.uid) {
      dispatch(setRole(user.role ));
      dispatch(setUser(user));

    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>

      {/* Header */}
      <View
        style={{
          height: 200,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#333" }}>Log In</Text>
      </View>

      {/* Form Section */}
      <View style={{ padding: 30, marginTop: -25, backgroundColor: "white", borderRadius: 50 }}>

        {/* Username */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5, height: 40 }}>Email</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 20,
          height: 45,
          backgroundColor: "#fff",
        }}>
          <TextInput
            onChangeText={(e) => setEmail(e)}
            placeholder="Enter Email"
            value={email}
            style={{ flex: 1, height: 40, color: "#333" }} />
        </View>

        {/* Password */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5, height: 40 }}>Password</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15,
        }}>
          <TextInput
            value={password}
            onChangeText={(e) => setPassword(e)}
            placeholder="Enter Password"
            style={{
              flex: 1,
              color: "#333",
            }}
          />



        </View>

        {/* Remember Me */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
          <Fontisto
            name="checkbox-passive"
            size={15}
            color="#3b3b3bff"
            style={{ marginRight: 5 }}
          />
          <Text style={{ color: "#555" }}>Remember me</Text>
        </View>

        {/* Log In Button */}
        <TouchableOpacity onPress={handleLogin} style={{
          backgroundColor: "purple",
          paddingVertical: 12,
          borderRadius: 25,
          alignItems: "center", marginTop: 10,
        }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", }} >Log In</Text>
        </TouchableOpacity>



        <Text style={{ textAlign: "center", color: "#555", marginBottom: 5 }}>

        </Text>

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
          <Text style={{ textAlign: "center", color: "purple", marginBottom: 60, fontWeight: "600" }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={{ flexDirection: "row", justifyContent: "center" }} >
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Role")}>
            <Text style={{ color: "purple", fontWeight: "bold" }}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}




export default Login;
