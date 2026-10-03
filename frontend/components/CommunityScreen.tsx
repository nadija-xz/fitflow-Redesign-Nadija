import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './mainScreenStyles';
import { AuthUser } from '../services/auth';
import { ChatMessage, getMessages, sendMessage } from '../services/community';

function mergeMessages(previous: ChatMessage[], incoming: ChatMessage[]) {
  return [...new Map([...previous, ...incoming].map(message => [message.id, message])).values()].sort((a, b) => a.id.localeCompare(b.id));
}

export default function CommunityScreen({ user }: { user: AuthUser }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');
  const [sendError, setSendError] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [retry, setRetry] = useState(0);
  const alive = useRef(false);
  const sendLock = useRef(false);
  const initialized = useRef(false);
  const chatScroll = useRef<ScrollView>(null);
  const followLatest = useRef(true);

  useEffect(() => {
    alive.current = true;
    let active = true;
    let busy = false;
    async function refresh() {
      if (busy || AppState.currentState !== 'active') return;
      busy = true;
      try {
        const page = await getMessages();
        if (active) {
          setMessages(previous => mergeMessages(previous, page.messages));
          if (!initialized.current) { setHasMore(page.hasMore); initialized.current = true; }
          setError('');
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Could not load messages. Please try again.');
      } finally { busy = false; if (active) setLoading(false); }
    }
    void refresh();
    const timer = setInterval(() => void refresh(), 5000);
    const subscription = AppState.addEventListener('change', state => { if (state === 'active') void refresh(); });
    return () => { active = false; alive.current = false; clearInterval(timer); subscription.remove(); };
  }, [retry]);

  async function loadOlder() {
    if (loadingOlder || !messages.length) return;
    setLoadingOlder(true);
    try {
      const page = await getMessages(messages[0].id);
      if (alive.current) { setMessages(previous => mergeMessages(previous, page.messages)); setHasMore(page.hasMore); setError(''); }
    } catch (err) { if (alive.current) setError(err instanceof Error ? err.message : 'Could not load earlier messages.'); }
    finally { if (alive.current) setLoadingOlder(false); }
  }
  async function send() {
    const text = draft.trim();
    if (!text || sendLock.current) return;
    sendLock.current = true;
    setSending(true);
    setSendError('');
    try {
      const message = await sendMessage(text);
      if (alive.current) { followLatest.current = true; setMessages(previous => mergeMessages(previous, [message])); setDraft(''); }
    } catch (err) { if (alive.current) setSendError(err instanceof Error ? err.message : 'Could not send your message. Please try again.'); }
    finally { sendLock.current = false; if (alive.current) setSending(false); }
  }

  return (
    <>
      <Text style={styles.pageTitle}>Community</Text>
      <Text style={styles.muted}>Share your questions, challenges, and wins.</Text>
      <View style={local.group}>
        <View style={local.groupIcon}><Ionicons name="people" size={26} color="#067647" /></View>
        <View style={styles.grow}>
          <Text style={local.groupName}>Fit Flow Community</Text>
          <Text style={styles.small}>Main group · All registered members</Text>
        </View>
      </View>
      <Text style={local.note}>Everyone in the community can read and reply here.</Text>
      {loading && <ActivityIndicator color="#079455" style={{ marginVertical: 24 }} />}
      {!!error && <View style={local.feedback}>
        <Text accessibilityLiveRegion="polite" style={local.error}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)} style={local.retry}><Text style={styles.greenText}>Retry connection</Text></Pressable>
      </View>}
      <ScrollView ref={chatScroll} nestedScrollEnabled keyboardShouldPersistTaps="handled" style={local.chatScroll} onScroll={event => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        followLatest.current = contentOffset.y + layoutMeasurement.height >= contentSize.height - 60;
      }} scrollEventThrottle={100} onContentSizeChange={() => { if (followLatest.current && !loadingOlder) chatScroll.current?.scrollToEnd({ animated: false }); }}>
      {hasMore && <Pressable accessibilityRole="button" disabled={loadingOlder} onPress={() => { followLatest.current = false; void loadOlder(); }} style={local.retry}>
        {loadingOlder ? <ActivityIndicator color="#079455" /> : <Text style={styles.greenText}>Load earlier messages</Text>}
      </Pressable>}
      {!loading && !error && !messages.length && <View style={styles.empty}>
        <Ionicons name="chatbubbles-outline" size={36} color="#079455" />
        <Text style={styles.emptyTitle}>Start the conversation</Text>
        <Text style={styles.mutedCenter}>Ask a question or share what you are working on.</Text>
      </View>}
      <View style={local.messages}>
        {messages.map(message => {
          const own = message.senderId === user.id;
          return <View key={message.id} style={[local.message, own && local.ownMessage]}>
            <Text style={local.sender}>{own ? 'You' : message.senderName}</Text>
            <Text selectable style={local.messageText}>{message.text}</Text>
            <Text style={local.time}>{new Date(message.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>;
        })}
      </View>
      </ScrollView>
      <View style={local.composer}>
        <TextInput accessibilityLabel="Message Fit Flow Community" placeholder="Share a question or message…" placeholderTextColor="#667085" multiline maxLength={1000} editable={!sending} value={draft} onChangeText={setDraft} style={local.input} />
        <Pressable accessibilityRole="button" accessibilityLabel="Send message" accessibilityState={{ disabled: sending || !draft.trim() }} disabled={sending || !draft.trim()} onPress={send} style={[local.send, (sending || !draft.trim()) && local.disabled]}>
          {sending ? <ActivityIndicator color="#FFFFFF" /> : <Ionicons name="send" size={20} color="#FFFFFF" />}
        </Pressable>
      </View>
      <Text style={local.note}>{draft.length}/1000</Text>
      {!!sendError && <Text accessibilityLiveRegion="polite" style={local.error}>{sendError}</Text>}
    </>
  );
}

const local = StyleSheet.create({
  group: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EAECF0' },
  groupIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#E7F8ED', alignItems: 'center', justifyContent: 'center' },
  groupName: { fontSize: 18, fontWeight: '800', color: '#101828' },
  note: { fontSize: 12, lineHeight: 18, color: '#667085', marginTop: 8 },
  messages: { gap: 12, marginTop: 20 },
  chatScroll: { maxHeight: 360, marginTop: 8 },
  message: { alignSelf: 'flex-start', maxWidth: '90%', padding: 14, borderRadius: 14, backgroundColor: '#F2F4F7', minWidth: 100 },
  ownMessage: { alignSelf: 'flex-end', backgroundColor: '#E7F8ED' },
  sender: { fontSize: 12, fontWeight: '800', color: '#067647', marginBottom: 5 },
  messageText: { fontSize: 14, lineHeight: 21, color: '#101828' },
  time: { fontSize: 10, color: '#667085', marginTop: 8 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 24 },
  input: { flex: 1, borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 14, minHeight: 50, maxHeight: 140, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#101828', textAlignVertical: 'top' },
  send: { width: 50, height: 50, borderRadius: 14, backgroundColor: '#079455', alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  feedback: { marginTop: 16 },
  error: { color: '#B42318', fontSize: 13, lineHeight: 19, marginTop: 8 },
  retry: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
});
