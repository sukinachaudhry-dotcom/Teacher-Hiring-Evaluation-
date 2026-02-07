import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";

function renderStars(rating) {
  const stars = [];
  const r = Math.min(5, Math.max(0, Number(rating) || 0));
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= r ? "star" : "star-outline"}
        size={18}
        color="#FFC107"
        style={{ marginRight: 2 }}
      />
    );
  }
  return <View style={{ flexDirection: "row", alignItems: "center" }}>{stars}</View>;
}

export default function TeacherFeedback({ navigation }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = auth.currentUser?.uid;

  const loadFeedbacksFromSnap = async (snap) => {
    const list = [];
    for (const d of snap.docs) {
      const data = { id: d.id, ...d.data() };
      const createdAt = data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : null);
      let studentName = data.studentName || "Student";
      let studentPhoto = data.studentPhoto || null;
      if (data.studentId) {
        try {
          const userDoc = await getDoc(doc(db, "users", data.studentId));
          if (userDoc.exists()) {
            const u = userDoc.data();
            studentName = u.fullname || u.name || u.displayName || studentName;
            studentPhoto = u.profilePicUrl || u.profileImage || u.photoUrl || studentPhoto;
          }
        } catch (e) {
          console.warn("Error fetching student:", e);
        }
      }
      list.push({
        ...data,
        studentName,
        studentPhoto,
        createdAt,
      });
    }
    list.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
    setFeedbacks(list);
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setFeedbacks([]);
      return;
    }
    const q = query(
      collection(db, "feedback"),
      where("teacherId", "==", userId)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLoading(false);
        setRefreshing(false);
        loadFeedbacksFromSnap(snap);
      },
      (err) => {
        console.error("Feedback snapshot error:", err);
        setFeedbacks([]);
        setLoading(false);
        setRefreshing(false);
      }
    );
    return () => unsub();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    if (!userId) {
      setRefreshing(false);
      return;
    }
    const q = query(
      collection(db, "feedback"),
      where("teacherId", "==", userId)
    );
    getDocs(q)
      .then(async (snap) => {
        await loadFeedbacksFromSnap(snap);
        setRefreshing(false);
      })
      .catch(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrap}>
          {item.studentPhoto ? (
            <Image source={{ uri: item.studentPhoto }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={28} color="purple" />
            </View>
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <View style={styles.starsRow}>{renderStars(item.rating)}</View>
          {item.createdAt && (
            <Text style={styles.date}>
              {item.createdAt.toLocaleDateString?.() || String(item.createdAt)}
            </Text>
          )}
        </View>
      </View>
      {item.comment ? (
        <Text style={styles.comment}>{item.comment}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feedback from Students</Text>
        <Text style={styles.subtitle}>
          {feedbacks.length} review{feedbacks.length !== 1 ? "s" : ""}
        </Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
        </View>
      ) : (
        <FlatList
          data={feedbacks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["purple"]}
              tintColor="purple"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbox-ellipses-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No feedback yet</Text>
              <Text style={styles.emptySubtext}>
                Feedback from students will appear here once they leave reviews.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listContent: {
    padding: 15,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: "#E8D5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  starsRow: {
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  comment: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
});
