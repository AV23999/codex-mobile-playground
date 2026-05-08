const mockChats = [
  { id: '1', name: 'Alice', lastMessage: 'Hey there!', online: true },
  { id: '2', name: 'Bob', lastMessage: 'See you later', online: false },
  { id: '3', name: 'Carol', lastMessage: 'Sounds good!', online: true },
];

const mockMessages = {
  '1': [
    { id: 'm1', from: 'Alice', text: 'Hey there!', timestamp: Date.now() - 60000, sent: false },
    { id: 'm2', from: 'me', text: 'Hi Alice!', timestamp: Date.now() - 30000, sent: true },
  ],
  '2': [
    { id: 'm3', from: 'Bob', text: 'See you later', timestamp: Date.now() - 120000, sent: false },
  ],
  '3': [
    { id: 'm4', from: 'Carol', text: 'Sounds good!', timestamp: Date.now() - 90000, sent: false },
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
    const msg = { id: Date.now().toString(), from: 'me', text, timestamp: Date.now(), sent: true };
    if (!mockMessages[chatId]) mockMessages[chatId] = [];
    mockMessages[chatId].push(msg);
    return msg;
  },
};

export default chatService;
