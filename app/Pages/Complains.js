import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { getDataById, getOrCreateConversation } from '../Helper/firebaseHelper';

export default function Complains({ navigation }) {
  const [conversationId, setConversationId] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUnavailable, setAdminUnavailable] = useState(false);
  const flatListRef = useRef(null);

  // Resolve admin and open chat (same flow as normal chat, but always with Admin)
  useEffect(() => {
    let cancelled = false;
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigation.goBack();
      return;
    }

    (async () => {
      try {
        const userData = await getDataById('users', user.uid);
        if (cancelled) return;
        if (userData) {
          setCurrentUser({
            _id: user.uid,
            name: userData.name || userData.fullname || userData.institutionname || 'User',
            avatar: userData.profilePicUrl || userData.profileImage || userData.photoUrl || null,
          });
        }

        const adminSnap = await getDocs(
          query(
            collection(db, 'users'),
            where('role', '==', 'Admin'),
            limit(1)
          )
        );
        if (cancelled) return;
        if (adminSnap.empty) {
          setAdminUnavailable(true);
          setLoading(false);
          return;
        }

        const adminDoc = adminSnap.docs[0];
        const adminUid = adminDoc.id;
        const adminData = adminDoc.data();
        const convId = await getOrCreateConversation(user.uid, adminUid);
        if (cancelled) return;

        setOtherUser({
          id: adminUid,
          name: adminData.name || adminData.fullname || adminData.institutionname || 'Admin',
          photoUrl: adminData.profilePicUrl || adminData.profileImage || adminData.photoUrl || null,
        });
        setConversationId(convId);
      } catch (e) {
        if (!cancelled) {
          console.error('Complains load error:', e);
          setAdminUnavailable(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [navigation]);

  // Real-time messages (same as simple chat)
  useEffect(() => {
    if (!conversationId) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = [];
      snapshot.forEach((d) => {
        const data = d.data();
        messageList.push({
          id: d.id,
          text: data.text || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          senderId: data.senderId,
          senderName: data.senderName || 'User',
          senderAvatar: data.senderAvatar || null,
        });
      });
      setMessages(messageList);
      setTimeout(() => {
        if (flatListRef.current && messageList.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    });

    markAsRead(conversationId, user.uid);
    return () => unsubscribe();
  }, [conversationId]);

  const markAsRead = async (convId, userId) => {
    try {
      const convRef = doc(db, 'conversations', convId);
      await updateDoc(convRef, {
        [`unreadCount.${userId}`]: 0,
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !currentUser || !conversationId || sending) {
      return;
    }

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      await addDoc(messagesRef, {
        text: text,
        senderId: currentUser._id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        createdAt: serverTimestamp(),
      });

      const convRef = doc(db, 'conversations', conversationId);
      const auth = getAuth();
      const user = auth.currentUser;
      const otherUserId = otherUser?.id;

      if (otherUserId) {
        const convDoc = await getDoc(convRef);
        const currentUnread = convDoc.data()?.unreadCount?.[otherUserId] || 0;
        await updateDoc(convRef, {
          lastMessage: text,
          lastMessageTime: serverTimestamp(),
          [`unreadCount.${otherUserId}`]: currentUnread + 1,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = date instanceof Date ? date : new Date(date);
    const diff = now - messageDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
           messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUser?._id;

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.messageRight : styles.messageLeft
      ]}>
        {!isCurrentUser && (
          <Image
            source={item.senderAvatar ? { uri: item.senderAvatar } : require('./Ali.jpeg')}
            style={styles.avatar}
          />
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft
        ]}>
          {!isCurrentUser && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.messageTextRight : styles.messageTextLeft
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.messageTimeRight : styles.messageTimeLeft
          ]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
        {isCurrentUser && (
          <Image
            source={currentUser.avatar ? { uri: currentUser.avatar } : require('./Ali.jpeg')}
            style={styles.avatar}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (adminUnavailable) {
    return (
      <SafeAreaView style={styles.container}>
        {/* <View style={styles.header}> */}
          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity> */}
          {/* <Text style={styles.headerName}>Chat with Admin</Text>
        </View> */}
        <View style={styles.loadingContainer}>
          <Ionicons name="construct-outline" size={60} color="#ccc" />
          <Text style={styles.loadingText}>Admin chat is not available</Text>
          <Text style={styles.emptySubtext}>Please try again later.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser || !conversationId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Unable to load chat</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Same UI as simple chat – user complains here, admin replies in this thread
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {otherUser?.photoUrl ? (
          <Image source={{ uri: otherUser.photoUrl }} style={styles.headerAvatar} />
        ) : (
          <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
            <Ionicons name="person" size={20} color="#666" />
          </View>
        )}
        <Text style={styles.headerName}>{otherUser?.name || 'Admin'}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.flex}
          contentContainerStyle={[styles.messagesList, messages.length === 0 && styles.messagesListFlex]}
          onContentSizeChange={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Type your complain below. Admin will reply here.</Text>
            </View>
          }
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!messageText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerAvatarPlaceholder: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 10,
  },
  messagesListFlex: {
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  messageBubbleLeft: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageBubbleRight: {
    backgroundColor: 'purple',
    borderBottomRightRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTextLeft: {
    color: '#000',
  },
  messageTextRight: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  messageTimeLeft: {
    color: '#999',
  },
  messageTimeRight: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
