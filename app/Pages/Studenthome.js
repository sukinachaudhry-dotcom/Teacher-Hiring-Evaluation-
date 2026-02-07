import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView ,Dimensions,} from 'react-native';
import { Ionicons , MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { getOrCreateConversation, getDataById } from '../Helper/firebaseHelper';


const { width } = Dimensions.get("window");

export default function App({ navigation }) {
    const [images, setImages] = React.useState([
        "https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg",
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
      ]);
    const [teachers, setTeachers] = React.useState([]);
    const [recentTeachers, setRecentTeachers] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        try {
            // Query without orderBy to avoid needing a composite index
            // We'll sort the results in JavaScript instead
            const q = query(collection(db, 'sliders'), where('role', '==', 'student'));
            const unsub = onSnapshot(q, (snap) => {
                const arr = [];
                snap.forEach((doc) => {
                    const d = doc.data();
                    if (d && d.url) {
                        arr.push({
                            url: d.url,
                            order: d.order || 0, // Get order value for sorting
                        });
                    }
                });
                // Sort by order in JavaScript (ascending)
                arr.sort((a, b) => (a.order || 0) - (b.order || 0));
                // Extract just the URLs after sorting
                const sortedUrls = arr.map(item => item.url);
                if (sortedUrls.length) setImages(sortedUrls);
            }, (error) => {
                console.error('slider subscribe error', error);
            });
            return () => unsub();
        } catch (e) {
            console.error('slider subscribe error', e);
        }
    }, []);

    // Fetch categories from Firestore collection "categories student"
    React.useEffect(() => {
        try {
            // Query the "categories student" collection
            // Note: Collection name has a space: "categories student"
            const q = query(collection(db, 'categories student'));
            const unsub = onSnapshot(q, (snap) => {
                const catArray = [];
                snap.forEach((doc) => {
                    const data = doc.data();
                    // Get document ID as cid and add it to the data
                    catArray.push({
                        id: doc.id, // Document ID (cid)
                        cid: doc.id, // Also store as cid for consistency
                        icon: data.icon || 'book-outline', // Icon name from Firestore
                        title: data.title || 'Category', // Title from Firestore
                    });
                });
                console.log('Fetched categories:', catArray.length, 'items');
                setCategories(catArray);
            }, (error) => {
                // Error callback for onSnapshot
                console.error('Error fetching categories:', error);
                setCategories([]);
            });
            return () => unsub();
        } catch (e) {
            console.error('categories subscribe error', e);
            setCategories([]);
        }
    }, []);

    // Fetch Popular Teachers - sorted by experience (or createdAt as fallback)
    React.useEffect(() => {
        try {
            // Query without orderBy to avoid needing a composite index
            // We'll sort in JavaScript instead
            const q = query(
                collection(db, 'users'),
                where('role', '==', 'Teacher')
            );
            const unsub = onSnapshot(q, (snap) => {
                const arr = [];
                const now = new Date();
                const fifteenDaysAgo = new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000)); // 15 days ago
                
                snap.forEach((doc) => {
                    const d = doc.data();
                    // Extract experience years for sorting - handle formats like "2 Years", "2+ Years", "2 years", etc.
                    const expStr = (d?.experience ?? '').toString();
                    // Extract first number from experience string
                    const years = Number(expStr.match(/\d+/)?.[0] || 0);
                    
                    // Check if teacher has enough experience (2 years or more)
                    // This includes exactly 2 years as well
                    const hasEnoughExperience = years >= 2;
                    
                    // Check if account is old enough (created 15+ days ago)
                    const accountCreatedAt = d.createdAt ? new Date(d.createdAt) : null;
                    const isOldAccount = accountCreatedAt && accountCreatedAt.getTime() < fifteenDaysAgo.getTime();
                    
                    // Only add if both conditions are met (more experience AND old account)
                    if (hasEnoughExperience && isOldAccount) {
                    arr.push({ 
                        id: doc.id, 
                        ...d,
                        experienceYears: years
                    });
                    }
                });
                
                // Sort by experience (highest first), then by account age (oldest first)
                arr.sort((a, b) => {
                    // First sort by experience
                    const expDiff = (b.experienceYears || 0) - (a.experienceYears || 0);
                    if (expDiff !== 0) return expDiff;
                    
                    // If experience is same, sort by account age (oldest first)
                    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return aTime - bTime; // Ascending (oldest first)
                });
                
                setTeachers(arr);
            }, (error) => {
                console.error('popular teachers subscribe error', error);
            });
            return () => unsub();
        } catch (e) {
            console.error('popular teachers subscribe error', e);
        }
    }, []);

    // Fetch Recent Teachers - only teachers who recently created accounts
    React.useEffect(() => {
        try {
            // Query without orderBy to avoid needing a composite index
            // We'll sort by createdAt in JavaScript instead
            const q = query(
                collection(db, 'users'),
                where('role', '==', 'Teacher')
            );
            const unsub = onSnapshot(q, (snap) => {
                const arr = [];
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
                
                snap.forEach((doc) => {
                    const d = doc.data();
                    // Check if account was created recently (within last 30 days)
                    const accountCreatedAt = d.createdAt ? new Date(d.createdAt) : null;
                    const isRecentAccount = accountCreatedAt && accountCreatedAt.getTime() >= thirtyDaysAgo.getTime();
                    
                    // Only add teachers with recently created accounts
                    if (isRecentAccount) {
                        arr.push({ 
                            id: doc.id, 
                            ...d
                        });
                    }
                });
                // Sort by createdAt desc (most recent first)
                arr.sort((a, b) => {
                    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return bTime - aTime; // Descending order (most recent first)
                });
                setRecentTeachers(arr);
            }, (error) => {
                console.error('recent teachers subscribe error', error);
            });
            return () => unsub();
        } catch (e) {
            console.error('recent teachers subscribe error', e);
        }
    }, []);

    // Filter teachers based on search query (by name or subject)
    const filterTeachers = (teacherList) => {
        if (!searchQuery.trim()) {
            return teacherList;
        }
        
        const query = searchQuery.toLowerCase().trim();
        return teacherList.filter(teacher => {
            const name = (teacher.name || '').toLowerCase();
            const subjects = (teacher.teachingsubjects || '').toLowerCase();
            
            // Check if search query matches name or any subject
            return name.includes(query) || subjects.includes(query);
        });
    };

    const filteredTeachers = filterTeachers(teachers);
    const filteredRecentTeachers = filterTeachers(recentTeachers);
    
    // Combine all teachers when searching
    const allFilteredTeachers = searchQuery.trim() 
        ? [...filteredTeachers, ...filteredRecentTeachers]
        : [];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={{ flex: 1 }}>

                {/* Header */}
                <View
                    style={{
                        backgroundColor: 'purple',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                

                    <TextInput
                        placeholder="Search Teachers by Name or Subject"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            marginHorizontal: 10,
                            borderRadius: 20,
                            paddingHorizontal: 15,
                            height: 40,
                        }}
                    />

                   

                    <TouchableOpacity onPress={() => navigation.navigate("Settings")} >
                    <Ionicons name="settings" size={28} color='#fff' />

                </TouchableOpacity>
                </View>

                {/* <View style={{ height: 20 }} /> */}
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Carousel
            loop
            width={width}
            height={150}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: 340, height: "100%", borderRadius: 22, alignSelf: "center", marginTop: 5 }}
                resizeMode="cover"
              />
            )}
          />
        </View>

                {/* Search Results Section - Show when searching */}
                {searchQuery.trim() && (
                    <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                            Search Results ({allFilteredTeachers.length})
                        </Text>
                        {allFilteredTeachers.length === 0 ? (
                            <Text style={{ textAlign: 'center', marginTop: 10, color: '#555' }}>
                                No teachers found matching "{searchQuery}"
                            </Text>
                        ) : (
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                                {allFilteredTeachers.map((teacher, index) => (
                                    <View
                                        key={`search_${teacher.id || index}`}
                                        style={{
                                            width: "48%",
                                            backgroundColor: '#fff',
                                            borderRadius: 10,
                                            padding: 10,
                                            marginBottom: 15,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.1,
                                            shadowRadius: 4,
                                            elevation: 3,
                                        }}
                                    >
                                        <Image
                                            key={`search-${teacher.id}-${teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl || 'default'}`}
                                            source={(teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl) ? { uri: (teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl) } : require("./Ali.jpeg")}
                                            style={{ width: 60, height: 60, borderRadius: 30, alignSelf: "center" }}
                                            resizeMode="cover"
                                        />
                                        <Text style={{ marginTop: 5, fontWeight: 'bold', textAlign: "center" }}>{teacher.name || 'Unnamed'}</Text>
                                        <Text style={{ marginTop: 2, fontWeight: 'bold', textAlign: "center" }}>{teacher.teachingsubjects || ''}</Text>
                                        <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.location || ''}</Text>
                                        <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.experience ? `${teacher.experience}` : ''}</Text>

                                        {/* Buttons */}
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                            <TouchableOpacity
                                                style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}
                                                onPress={() => navigation.navigate("Studentviewprofile", { teacherId: teacher.id })}
                                            >
                                                <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Detail</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}
                                                onPress={async () => {
                                                    try {
                                                        const auth = getAuth();
                                                        const currentUser = auth.currentUser;
                                                        
                                                        if (!currentUser) {
                                                            console.log('No user logged in');
                                                            return;
                                                        }
                                                        
                                                        if (!teacher.id) {
                                                            console.log('No teacher ID');
                                                            return;
                                                        }
                                                        
                                                        const conversationId = await getOrCreateConversation(currentUser.uid, teacher.id);
                                                        const otherUser = await getDataById('users', teacher.id);
                                                        
                                                        navigation.navigate('ChatScreen', {
                                                            conversationId,
                                                            otherUser: {
                                                                id: teacher.id,
                                                                name: otherUser?.name || otherUser?.fullname || 'User',
                                                                photoUrl: otherUser?.profilePicUrl || otherUser?.profileImage || otherUser?.photoUrl || null,
                                                            }
                                                        });
                                                    } catch (error) {
                                                        console.error('Error starting chat:', error);
                                                    }
                                                }}
                                            >
                                                <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Learning System Section */}
                {!searchQuery.trim() && (
                    <>
                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>
                    Learning System
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                    {categories.length === 0 ? (
                        <View style={{ marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#555' }}>Loading categories...</Text>
                        </View>
                    ) : (
                        categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id || cat.cid}
                                onPress={() => {
                                    // Navigate based on category title
                                    // Map category titles to navigation routes (case-insensitive)
                                    const categoryTitle = (cat.title || '').trim();
                                    const pageMap = {
                                        'computer': 'Computer',
                                        'physics': 'Physics',
                                        'math': 'Maths',
                                        'maths': 'Maths',
                                        'chemistry': 'Chemistry',
                                        'courses': 'CoursesJobs',
                                        // Only include routes that exist in navigation stack
                                    };
                                    
                                    // Get route name (case-insensitive lookup)
                                    const routeName = pageMap[categoryTitle.toLowerCase()];
                                    
                                    // Only navigate if route exists in pageMap
                                    if (routeName) {
                                        navigation.navigate(routeName);
                                    } else {
                                        // For categories without specific pages, navigate to Viewall
                                        // This will show all teachers and user can filter manually
                                        navigation.navigate('Viewall', { category: categoryTitle });
                                    }
                                }}
                            >
                                <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#d8b4e2', padding: 20, borderRadius: 10 }}>
                                        {/* Display icon from Firestore - using Ionicons */}
                                    <Ionicons name={cat.icon || 'grid-outline'} size={30} color="#000" />
                                </View>
                                <Text style={{ marginTop: 5 }}>{cat.title || 'Category'}</Text>
                            </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
                    </>
                )}

                {/* Popular Teachers Section - Hide when searching */}
                {!searchQuery.trim() && (
                    <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Popular Teachers</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Viewall")}>
                        <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Popular Teacher Cards Grid (2 per row) */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", margin: 10 }}>
                    {filteredTeachers.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 10, width: '100%' }}>No popular teachers yet.</Text>
                    ) : (
                    filteredTeachers.slice(0, 6).map((teacher, index) => (
                        <View
                            key={teacher.id || index}
                            style={{
                                width: "48%",
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                padding: 10,
                                marginBottom: 15,
                                shadowColor: "#000",
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Image
                                key={`popular-${teacher.id}-${teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl || 'default'}`}
                                source={(teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl) ? { uri: (teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl) } : require("./Ali.jpeg")}
                                style={{ width: 60, height: 60, borderRadius: 30, alignSelf: "center" }}
                                resizeMode="cover"
                            />
                            <Text style={{ marginTop: 5, fontWeight: 'bold', textAlign: "center" }}>{teacher.name || 'Unnamed'}</Text>
                            <Text style={{ marginTop: 2, fontWeight: 'bold', textAlign: "center" }}>{teacher.teachingsubjects || ''}</Text>
                            <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.location || ''}</Text>
                            <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.experience ? `${teacher.experience}` : ''}</Text>

                            {/* Buttons */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}
                                    onPress={() => navigation.navigate("Studentviewprofile", { teacherId: teacher.id })}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Detail</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}
                                    onPress={async () => {
                                        try {
                                            const auth = getAuth();
                                            const currentUser = auth.currentUser;
                                            
                                            if (currentUser && teacher.id) {
                                                const conversationId = await getOrCreateConversation(currentUser.uid, teacher.id);
                                                const otherUser = await getDataById('users', teacher.id);
                                                navigation.navigate('ChatScreen', {
                                                    conversationId,
                                                    otherUser: {
                                                        id: teacher.id,
                                                        name: otherUser?.name || otherUser?.fullname || 'User',
                                                        photoUrl: otherUser?.profilePicUrl || otherUser?.profileImage || otherUser?.photoUrl || null,
                                                    }
                                                });
                                            }
                                        } catch (error) {
                                            console.error('Error starting chat:', error);
                                        }
                                    }}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                    )}
                </View>
                    </>
                )}

                {/* Recent Teachers Section - Hide when searching */}
                {!searchQuery.trim() && (
                    <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Recent Teachers</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Viewall")}>
                        <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Teacher Cards Grid (2 per row) */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", margin: 10 }}>
                    {filteredRecentTeachers.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 10, width: '100%' }}>No recent teachers yet.</Text>
                    ) : (
                    filteredRecentTeachers.slice(0, 6).map((teacher, index) => (
                        <View
                            key={`recent_${teacher.id || index}`}
                            style={{
                                width: "48%",
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                padding: 10,
                                marginBottom: 15,
                                shadowColor: "#000",
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Image
                                key={`recent-${teacher.id}-${teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl || 'default'}`}
                                source={(teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl) ? { uri: (teacher.photoUrl || teacher.profileImage || teacher.profilePicUrl) } : require("./Ali.jpeg")}
                                style={{ width: 60, height: 60, borderRadius: 30, alignSelf: "center" }}
                                resizeMode="cover"
                            />
                            <Text style={{ marginTop: 5, fontWeight: 'bold', textAlign: "center" }}>{teacher.name || 'Unnamed'}</Text>
                            <Text style={{ marginTop: 2, fontWeight: 'bold', textAlign: "center" }}>{teacher.teachingsubjects || ''}</Text>
                            <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.location || ''}</Text>
                            <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.experience ? `${teacher.experience}` : ''}</Text>

                            {/* Buttons */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}
                                    onPress={() => navigation.navigate("Studentviewprofile", { teacherId: teacher.id })}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Detail</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}
                                    onPress={async () => {
                                        try {
                                            const auth = getAuth();
                                            const currentUser = auth.currentUser;
                                            
                                            if (currentUser && teacher.id) {
                                                const conversationId = await getOrCreateConversation(currentUser.uid, teacher.id);
                                                const otherUser = await getDataById('users', teacher.id);
                                                navigation.navigate('ChatScreen', {
                                                    conversationId,
                                                    otherUser: {
                                                        id: teacher.id,
                                                        name: otherUser?.name || otherUser?.fullname || 'User',
                                                        photoUrl: otherUser?.profilePicUrl || otherUser?.profileImage || otherUser?.photoUrl || null,
                                                    }
                                                });
                                            }
                                        } catch (error) {
                                            console.error('Error starting chat:', error);
                                        }
                                    }}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                    )}
                </View>
                    </>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
