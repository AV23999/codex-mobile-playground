// Guaranteed unique ID — timestamp + random suffix to prevent collisions
let _msgCounter = 0;
function uniqueId() {
  return `msg_${Date.now()}_${++_msgCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

const mockChats = [
  { id: 'chat_1', name: 'Alice', lastMessage: 'Hey there!', online: true },
  { id: 'chat_2', name: 'Bob', lastMessage: 'See you later', online: false },
  { id: 'chat_3', name: 'Carol', lastMessage: 'Sounds good!', online: true },
];

const mockMessages = {
  chat_1: [
    { id: 'msg_alice_1', from: 'Alice', text: 'Hey there!', timestamp: Date.now() - 60000, sent: false },
    { id: 'msg_me_1', from: 'me', text: 'Hi Alice!', timestamp: Date.now() - 30000, sent: true },
  ],
  chat_2: [
    { id: 'msg_bob_1', from: 'Bob', text: 'See you later', timestamp: Date.now() - 120000, sent: false },
  ],
  chat_3: [
    { id: 'msg_carol_1', from: 'Carol', text: 'Sounds good!', timestamp: Date.now() - 90000, sent: false },
  ],
};

const chatService = {
  async getChats() {
    return mockChats;
  },

  async getMessages(chatId) {
    return mockMessages[chatId] || [];
  },

  async sendMessage(chatId, text) {
    const msg = { id: uniqueId(), from: 'me', text, timestamp: Date.now(), sent: true };
    if (!mockMessages[chatId]) mockMessages[chatId] = [];
    mockMessages[chatId].push(msg);
    return msg;
  },
};

export default chatService;
