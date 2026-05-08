const users = [];
let currentUser = null;

const authService = {
  async register({ username, email, password }) {
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const user = { id: Date.now().toString(), username, email, password };
    users.push(user);
    currentUser = user;
    return user;
  },

  async login({ emailOrUsername, password }) {
    const user = users.find(
      u =>
        (u.email === emailOrUsername || u.username === emailOrUsername) &&
        u.password === password
    );
    if (!user) throw new Error('Invalid credentials');
    currentUser = user;
    return user;
  },

  async logout() {
    currentUser = null;
  },

  getCurrentUser() {
    return currentUser;
  },
};

export default authService;
