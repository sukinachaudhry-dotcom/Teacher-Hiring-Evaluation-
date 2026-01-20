import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { addData } from "../Helper/firebaseHelper";
import { useSelector } from 'react-redux';

const Complaint = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    complaint: "",
  });
  const [loading, setLoading] = useState(false);
  const reduxUser = useSelector(state => state.home.user);
  const userRole = useSelector(state => state.home.role);

  // Pre-fill form with user data if available
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user && reduxUser) {
      const displayName = reduxUser.name || reduxUser.fullname || reduxUser.institutionname || "";
      const displayEmail = reduxUser.email || user.email || "";
      
      setFormData(prev => ({
        ...prev,
        name: displayName,
        email: displayEmail,
      }));
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [reduxUser]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!formData.subject.trim()) {
      Alert.alert("Error", "Please enter a subject");
      return;
    }

    if (!formData.complaint.trim()) {
      Alert.alert("Error", "Please enter your complaint");
      return;
    }

    try {
      setLoading(true);
      
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || null;
      
      // Save complaint to Firestore for admin to handle
      const complaintData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        complaint: formData.complaint.trim(),
        userId: userId,
        userRole: userRole || "Guest",
        status: "pending", // pending, in-progress, resolved
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Admin can add these fields later:
        // adminNotes: "",
        // resolvedAt: null,
        // handledBy: null,
      };

      // Save to Firestore "complaints" collection
      await addData("complaints", complaintData);

      Alert.alert(
        "Success",
        "Your complaint has been submitted successfully. Our admin team will review it and get back to you soon.",
        [
          {
            text: "OK",
            onPress: () => {
              setFormData({
                name: "",
                email: "",
                subject: "",
                complaint: "",
              });
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert(
        "Error", 
        "Failed to submit complaint. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Submit a Complaint</Text>
          <Text style={styles.subheading}>We value your feedback</Text>

          {/* Name Input */}
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
          />

          {/* Email Input */}
          <Text style={styles.label}>Your Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Subject Input */}
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter complaint subject"
            placeholderTextColor="#999"
            value={formData.subject}
            onChangeText={(value) => handleChange("subject", value)}
          />

          {/* Complaint Textarea */}
          <Text style={styles.label}>Your Complaint</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Write your complaint here..."
            placeholderTextColor="#999"
            value={formData.complaint}
            onChangeText={(value) => handleChange("complaint", value)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Complaint</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8b4e2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 34,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  subheading: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    marginTop: 5,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
  },
  textarea: {
    width: "100%",
    padding: 12,
    height: 120,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "purple",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Complaint;
