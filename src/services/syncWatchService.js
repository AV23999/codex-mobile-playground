// Nova Sync Watch — synchronized watching with friends
const FEATURED_CONTENT = [
  { id: '1', title: 'Stranger Things S4', platform: 'Netflix', thumbnail: 'https://picsum.photos/seed/stranger/400/220', duration: 3720 },
  { id: '2', title: 'Dune: Part Two', platform: 'Max', thumbnail: 'https://picsum.photos/seed/dune2/400/220', duration: 9780 },
  { id: '3', title: 'The Bear S3', platform: 'Hulu', thumbnail: 'https://picsum.photos/seed/thebear3/400/220', duration: 2400 },
  { id: '4', title: 'Oppenheimer', platform: 'Peacock', thumbnail: 'https://picsum.photos/seed/oppen1/400/220', duration: 11100 },
  { id: '5', title: 'Wednesday S2', platform: 'Netflix', thumbnail: 'https://picsum.photos/seed/wednesday2/400/220', duration: 2700 },
];

let activeRoom = null;
let roomListeners = [];

export function getFeaturedContent() { return FEATURED_CONTENT; }
export function getActiveRoom() { return activeRoom; }

export function onRoomUpdate(listener) {
  roomListeners.push(listener);
  return () => { roomListeners = roomListeners.filter(l => l !== listener); };
}

function notify() { roomListeners.forEach(l => l(activeRoom)); }

export function createWatchRoom(content, host) {
  activeRoom = {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    content, host,
    participants: [host],
    playbackPosition: 0,
    isPlaying: false,
    createdAt: Date.now(),
  };
  return activeRoom;
}

export function joinWatchRoom(roomId, username) {
  if (!activeRoom || activeRoom.id !== roomId) return null;
  if (!activeRoom.participants.includes(username)) activeRoom.participants.push(username);
  notify();
  return activeRoom;
}

export function togglePlayback() {
  if (!activeRoom) return;
  activeRoom.isPlaying = !activeRoom.isPlaying;
  notify();
  return activeRoom;
}

export function leaveRoom(username) {
  if (!activeRoom) return;
  activeRoom.participants = activeRoom.participants.filter(p => p !== username);
  if (activeRoom.participants.length === 0) activeRoom = null;
  notify();
}
