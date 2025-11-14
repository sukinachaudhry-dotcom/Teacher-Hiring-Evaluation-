import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function Applicants() {
  const [applicants, setApplicants] = React.useState([]);

  React.useEffect(() => {
    let userUnsubs = [];
    try {
      const instUid = auth?.currentUser?.uid;
      if (!instUid) return;

      const appsQ = query(
        collection(db, 'applications'),
        where('institutionUid', '==', instUid),
        orderBy('createdAt', 'desc')
      );

      const unsubApps = onSnapshot(appsQ, (snap) => {
        const teacherUids = [];
        snap.forEach((d) => {
          const a = d.data();
          if (a && a.teacherUid && !teacherUids.includes(a.teacherUid)) {
            teacherUids.push(a.teacherUid);
          }
        });

        // clean previous listeners
        userUnsubs.forEach((u) => u && u());
        userUnsubs = [];

        const map = {};
        teacherUids.forEach((uid) => {
          const uUnsub = onSnapshot(doc(db, 'users', uid), (uSnap) => {
            if (uSnap.exists()) {
              const data = uSnap.data();
              map[uid] = {
                id: uid,
                name: data?.name || data?.fullname || 'Unnamed',
                subject: data?.teachingsubjects || data?.subjects || '',
                experience: data?.experience || '',
                location: data?.location || data?.address || '',
                photoUrl: data?.profileImage || data?.photoUrl || null,
              };
            } else {
              delete map[uid];
            }

            const arr = teacherUids.map((id) => map[id]).filter(Boolean);
            setApplicants(arr);
          });
          userUnsubs.push(uUnsub);
        });

        if (teacherUids.length === 0) setApplicants([]);
      }, () => setApplicants([]));

      return () => {
        unsubApps && unsubApps();
        userUnsubs.forEach((u) => u && u());
      };
    } catch (e) {
      setApplicants([]);
    }
  }, []);

  const renderApplicant = ({ item }) => (
    <View style={styles.card}>
      {/* Profile Row */}
      <View style={styles.row}>
        <Image source={item.photoUrl ? { uri: item.photoUrl } : require("./Ali.jpeg")} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>{item.subject ? `${item.subject} Teacher` : ''}</Text>
          <Text style={styles.detail}>Experience: {item.experience}</Text>
          <Text style={styles.detail}>
            <Icon name="location-on" size={14} color="purple" /> {item.location}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: "purple" }]}>
          <Text style={styles.btnText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: "purple" }]}>
          <Text style={styles.btnText}>Take E.Test</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: "purple" }]}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
      <Text style={styles.header}>Applicants</Text>

      {applicants.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#555' }}>No Applicants Yet</Text>
      ) : (
        <FlatList
          data={applicants}
          renderItem={renderApplicant}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "purple",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "purple",
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detail: { fontSize: 13, color: "#555", marginTop: 2 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
});
