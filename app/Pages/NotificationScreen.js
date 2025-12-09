import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";

export default function Notifications({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch notifications for current user
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifList = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        notifList.push({
          id: docSnap.id,
          ...data,
        });
      });
      setNotifications(notifList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "Recently";
    }
  };

  const getIconName = (type) => {
    switch (type) {
      case "hiring_request":
        return "person-add-outline";
      case "request_accepted":
        return "checkmark-done-outline";
      case "request_rejected":
        return "close-outline";
      case "request_cancelled":
        return "close-circle-outline";
      default:
        return "notifications-outline";
    }
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === "hiring_request" && notification.requestId) {
      navigation.navigate("ViewDetails", {
        requestId: notification.requestId,
        studentId: notification.studentId,
        studentName: notification.studentName,
      });
    } else if (notification.type === "request_accepted" || notification.type === "request_rejected") {
      // For students, just show in My Teachers
      navigation.navigate("HirePage");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10 }}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Notifications
      </Text>

      {notifications.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Ionicons name="notifications-off-outline" size={50} color="gray" />
          <Text style={{ marginTop: 10, color: "#666" }}>No notifications yet</Text>
        </View>
      ) : (
        notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => handleNotificationPress(notification)}
            style={{
              backgroundColor: notification.read ? "#f5f5f5" : "#d8b4e2",
              padding: 15,
              borderRadius: 10,
              marginBottom: 15,
              borderLeftWidth: notification.read ? 0 : 4,
              borderLeftColor: "purple",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={getIconName(notification.type)}
                size={22}
                color="black"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: notification.read ? "normal" : "bold" }}>
                  {notification.title || notification.message}
                </Text>
                {notification.message && notification.title && (
                  <Text style={{ marginTop: 4, fontSize: 13, color: "#666" }}>
                    {notification.message}
                  </Text>
                )}
              </View>
            </View>
            <Text style={{ color: "gray", marginTop: 5, fontSize: 12 }}>
              {getTimeAgo(notification.createdAt)}
            </Text>
            {notification.type === "hiring_request" && (
              <TouchableOpacity
                style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, marginTop: 10 }}
                onPress={() => handleNotificationPress(notification)}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>View</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
