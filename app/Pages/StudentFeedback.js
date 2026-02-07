import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";

function StarRating({ value, onChange, size = 28 }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i)}
          activeOpacity={0.7}
          style={{ padding: 2 }}
        >
          <Ionicons
            name={i <= value ? "star" : "star-outline"}
            size={size}
            color="#FFC107"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function StudentFeedback({ navigation }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState({}); // teacherId -> { rating, comment, id }
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Fetch accepted hiring requests (teachers student has worked with)
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "hiring requests"),
      where("studentId", "==", userId),
      where("status", "==", "accepted")
    );
    const unsub = onSnapshot(
      q,
      async (snap) => {
        const list = [];
        for (const d of snap.docs) {
          const data = d.data();
          let teacherName = data.teacherName || "Teacher";
          let teacherPhoto = null;
          if (data.teacherId) {
            try {
              const tDoc = await getDoc(doc(db, "users", data.teacherId));
              if (tDoc.exists()) {
                const u = tDoc.data();
                teacherName = u.fullname || u.name || u.displayName || teacherName;
                teacherPhoto = u.profilePicUrl || u.profileImage || u.photoUrl || null;
              }
            } catch (e) {
              console.warn("Error fetching teacher:", e);
            }
          }
          list.push({
            id: d.id,
            teacherId: data.teacherId,
            teacherName,
            teacherPhoto,
            teacherSubject: data.teacherSubject || "",
          });
        }
        setTeachers(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching hiring requests:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [userId]);

  // Fetch existing feedback by this student for these teachers
  useEffect(() => {
    if (!userId || teachers.length === 0) return;
    const teacherIds = teachers.map((t) => t.teacherId).filter(Boolean);
    if (teacherIds.length === 0) return;

    const loadExistingFeedback = async () => {
      const map = {};
      const q = query(
        collection(db, "feedback"),
        where("studentId", "==", userId)
      );
      const snap = await getDocs(q);
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.teacherId) {
          map[data.teacherId] = {
            feedbackId: d.id,
            rating: data.rating,
            comment: data.comment || "",
          };
        }
      });
      setFeedbackGiven(map);
    };
    loadExistingFeedback();
  }, [userId, teachers]);

  const openFeedbackModal = (teacher) => {
    setSelectedTeacher(teacher);
    const existing = feedbackGiven[teacher.teacherId];
    setRating(existing?.rating ?? 0);
    setComment(existing?.comment ?? "");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTeacher(null);
    setRating(0);
    setComment("");
  };

  const submitFeedback = async () => {
    if (!selectedTeacher || !userId) return;
    if (rating < 1 || rating > 5) {
      Alert.alert("Required", "Please select a star rating (1-5).");
      return;
    }
    setSubmitting(true);
    try {
      const existing = feedbackGiven[selectedTeacher.teacherId];
      const existingId = existing?.feedbackId && existing.feedbackId !== "new" ? existing.feedbackId : null;

      if (existingId) {
        await updateDoc(doc(db, "feedback", existingId), {
          rating: Number(rating),
          comment: comment.trim() || "",
          updatedAt: new Date(),
        });
        setFeedbackGiven((prev) => ({
          ...prev,
          [selectedTeacher.teacherId]: { feedbackId: existingId, rating, comment: comment.trim() },
        }));
      } else {
        const userDoc = await getDoc(doc(db, "users", userId));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const studentName = userData.fullname || userData.name || auth.currentUser?.displayName || "Student";
        const studentPhoto = userData.profilePicUrl || userData.profileImage || userData.photoUrl || null;

        const feedbackData = {
          teacherId: selectedTeacher.teacherId,
          studentId: userId,
          rating: Number(rating),
          comment: comment.trim() || "",
          createdAt: new Date(),
          studentName,
          studentPhoto,
        };

        const ref = await addDoc(collection(db, "feedback"), feedbackData);
        setFeedbackGiven((prev) => ({
          ...prev,
          [selectedTeacher.teacherId]: { feedbackId: ref.id, rating, comment: comment.trim() },
        }));
      }
      closeModal();
      Alert.alert("Thank you", "Your feedback has been submitted.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderTeacher = ({ item }) => {
    const existing = feedbackGiven[item.teacherId];
    const hasGivenFeedback = !!existing;

    return (
      <View style={styles.card}>
        <View style={styles.cardRow}>
          {item.teacherPhoto ? (
            <Image source={{ uri: item.teacherPhoto }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={32} color="purple" />
            </View>
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.teacherName}>{item.teacherName}</Text>
            {item.teacherSubject ? (
              <Text style={styles.teacherSubject}>{item.teacherSubject}</Text>
            ) : null}
            {hasGivenFeedback ? (
              <View style={styles.existingRow}>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons
                      key={i}
                      name={i <= (existing.rating || 0) ? "star" : "star-outline"}
                      size={16}
                      color="#FFC107"
                    />
                  ))}
                </View>
                {existing.comment ? (
                  <Text style={styles.existingComment} numberOfLines={2}>
                    {existing.comment}
                  </Text>
                ) : null}
                <Text style={styles.reviewedLabel}>You already gave feedback</Text>
              </View>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.feedbackBtn, hasGivenFeedback && styles.feedbackBtnDisabled]}
            onPress={() => openFeedbackModal(item)}
            disabled={false}
          >
            <Text style={styles.feedbackBtnText}>
              {hasGivenFeedback ? "View / Update" : "Give Feedback"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Give Feedback to Teachers</Text>
        <Text style={styles.subtitle}>
          Rate teachers you've worked with (accepted requests)
        </Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
        </View>
      ) : teachers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbox-ellipses-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No teachers to review yet</Text>
          <Text style={styles.emptySubtext}>
            After a teacher accepts your hiring request, they will appear here so you can leave feedback.
          </Text>
        </View>
      ) : (
        <FlatList
          data={teachers}
          renderItem={renderTeacher}
          keyExtractor={(item) => item.teacherId || item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedTeacher ? `Feedback for ${selectedTeacher.teacherName}` : "Feedback"}
              </Text>
              <TouchableOpacity onPress={closeModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.ratingLabel}>Rating (tap stars)</Text>
            <StarRating value={rating} onChange={setRating} />
            <Text style={styles.commentLabel}>Comment (optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="How was your experience?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              onPress={submitFeedback}
              disabled={submitting}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#E8D5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  teacherSubject: {
    fontSize: 14,
    color: "purple",
    marginBottom: 4,
  },
  existingRow: {
    marginTop: 4,
  },
  existingComment: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  reviewedLabel: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 4,
    fontWeight: "500",
  },
  feedbackBtn: {
    backgroundColor: "purple",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 8,
  },
  feedbackBtnDisabled: {
    opacity: 0.9,
  },
  feedbackBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  commentLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "purple",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
