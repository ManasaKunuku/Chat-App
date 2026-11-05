import React, { useMemo, useRef, useState } from 'react';
import { Hash, Plus, Search, Smile, Send, Paperclip, MoreHorizontal, Users, MessageCircle, X, Menu, ChevronDown, AtSign } from 'lucide-react';

const people = [
  { name: 'Rolande Raimondi', role: 'Research Nurse', initials: 'RR', color: '#d97878' },
  { name: 'Gregory Goolsby', role: 'Product Designer', initials: 'GG', color: '#a8b936' },
  { name: 'Elin Emmanuel', role: 'Software Engineer', initials: 'EE', color: '#d98282' },
  { name: 'Alan Walker', role: 'Team Lead', initials: 'AW', color: '#4e91d4' },
  { name: 'Carol Smith', role: 'Frontend Developer', initials: 'CS', color: '#bd7c98' },
];
const initialChannels = [
  { id: 'poland', name: 'Poland Office', description: 'Updates and conversations from the Poland team' },
  { id: 'introductions', name: 'Introductions', description: 'This channel is for company wide chatter' },
  { id: 'india', name: 'India Office', description: 'Updates and conversations from the India team' },
];
const starter = {
  poland: [
    { id: 1, user: 'Gregory Goolsby', time: '10:18 AM', text: 'Good morning everyone! Hope you are having a great day.', reactions: ['👍'] },
    { id: 2, user: 'Elin Emmanuel', time: '10:24 AM', text: 'Morning! Excited to catch up with the team today.', reactions: ['❤️'] },
  ],
  introductions: [
    { id: 3, user: 'PubNub Bot', time: '12:16 PM', text: 'Welcome to Team Chat. 👋👋 Send a message now to start interacting with other users in the app. ⬇️', reactions: [] },
    { id: 4, user: 'Gregory Goolsby', time: '5:28 PM', text: 'Hey everyone!', reactions: [] },
    { id: 5, user: 'Elin Emmanuel', time: '5:30 PM', text: 'Oh hi, Gregory! Rolande is around, too...', reactions: [] },
    { id: 6, user: 'Rolande Raimondi', time: '5:31 PM', text: 'Hi all! Nice to see you 👋', reactions: ['👋'] },
  ],
  india: [
    { id: 7, user: 'Alan Walker', time: '9:45 AM', text: 'Hello India team! Welcome to the channel.', reactions: ['👋'] },
    { id: 8, user: 'Carol Smith', time: '10:02 AM', text: 'Hi everyone, happy to be here!', reactions: ['❤️'] },
  ],
};
const emojiList = [{e:'😀',k:'grinning smile happy'},{e:'😃',k:'smile happy'},{e:'😄',k:'smile happy'},{e:'😁',k:'grin'},{e:'😆',k:'laugh'},{e:'😅',k:'sweat laugh'},{e:'😂',k:'joy laugh'},{e:'🤣',k:'rofl laugh'},{e:'😊',k:'blush smile'},{e:'🙂',k:'slight smile'},{e:'😉',k:'wink'},{e:'😍',k:'heart eyes love'},{e:'🥰',k:'love hearts'},{e:'😘',k:'kiss kissing face'},{e:'😎',k:'cool sunglasses'},{e:'🤔',k:'thinking'},{e:'🙌',k:'raised hands'},{e:'👏',k:'clap'},{e:'👋',k:'wave waving hand'},{e:'👍',k:'thumbs up'},{e:'❤️',k:'heart love'},{e:'🔥',k:'fire'},{e:'🎉',k:'party'},{e:'🙏',k:'pray thanks'},{e:'💯',k:'hundred'},{e:'🚀',k:'rocket'},{e:'✨',k:'sparkles'},{e:'😢',k:'cry sad'},{e:'😮',k:'surprised'},{e:'🤝',k:'handshake'}];

function Avatar({ person, small = false }) {
  return <div className={`avatar ${small ? 'small' : ''}`} style={{ background: person?.color || '#c65e69' }}>{person?.initials || 'PN'}{!small && <i />}</div>;
}

export default function App() {
  const [channels, setChannels] = useState(initialChannels);
  const [active, setActive] = useState('introductions');
  const [messages, setMessages] = useState(starter);
  const [draft, setDraft] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(emojiList[18]);
  const [emojiCategory, setEmojiCategory] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notice, setNotice] = useState('');
  const inputRef = useRef(null);
  const current = channels.find(c => c.id === active) || channels[0];
  const currentMessages = messages[active] || [];
  const filteredEmoji = useMemo(() => emojiList.filter(item => !emojiSearch || item.k.includes(emojiSearch.toLowerCase()) || item.e.includes(emojiSearch)), [emojiSearch]);

  function sendMessage(event) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const message = { id: Date.now(), user: 'Rolande Raimondi', time: now, text, reactions: [] };
    setMessages(prev => ({ ...prev, [active]: [...(prev[active] || []), message] }));
    setDraft('');
    setEmojiOpen(false);
  }
  function addEmoji(emoji) { setDraft(v => v + emoji); inputRef.current?.focus(); }
  function reactTo(id) {
    setMessages(prev => ({ ...prev, [active]: (prev[active] || []).map(m => m.id === id ? { ...m, reactions: m.reactions.includes('❤️') ? m.reactions.filter(r => r !== '❤️') : [...m.reactions, '❤️'] } : m) }));
  }
  function createChannel() {
    const name = window.prompt('Enter a channel name');
    if (!name?.trim()) return;
    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (channels.some(c => c.id === id)) { setNotice('That channel already exists.'); return; }
    setChannels(prev => [...prev, { id, name: name.trim(), description: 'A new team conversation' }]);
    setMessages(prev => ({ ...prev, [id]: [] }));
    setActive(id); setNotice('Channel created');
  }
  const visibleMessages = currentMessages.filter(m => !search || m.text.toLowerCase().includes(search.toLowerCase()) || m.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>
        <div className="profile"><Avatar person={people[0]} /><div><strong>Rolande Raimondi</strong><span>Research Nurse</span></div><span className="online-dot" /></div>
        <div className="side-heading"><span>Conversations</span><button className="icon-button" onClick={createChannel} title="Create channel"><Plus size={19}/></button></div>
        <nav className="channel-list">
          {channels.map(channel => <button key={channel.id} className={`channel ${active === channel.id ? 'selected' : ''}`} onClick={() => { setActive(channel.id); setMobileNav(false); setSearch(''); }}><Hash size={17}/><span>{channel.name}</span></button>)}
        </nav>
        
      </aside>

      <main className="main-panel">
        <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu/></button><div className="channel-title"><div className="hash-large"><Hash size={22}/></div><div><h1>{current.name}</h1><p>{current.description}</p></div></div><div className="top-actions"><span className="member-count">3 | 100</span><button className="icon-button" onClick={() => setShowMembers(!showMembers)} title="View members"><Users size={19}/></button><button className="icon-button" onClick={() => { setShowSearch(!showSearch); setSearch(''); }} title="Search messages"><Search size={19}/></button></div></header>
        {showSearch && <div className="search-bar"><Search size={17}/><input autoFocus placeholder="Search messages in this channel..." value={search} onChange={e => setSearch(e.target.value)}/><button className="icon-button" onClick={() => { setShowSearch(false); setSearch(''); }}><X size={17}/></button></div>}
        <section className="chat-area">
          <div className="day-divider"><span>Today</span></div>
          {visibleMessages.length === 0 && <div className="empty-state"><div className="empty-icon"><MessageCircle size={27}/></div><h2>{search ? 'No messages found' : 'Start the conversation'}</h2><p>{search ? 'Try a different search term.' : `Be the first to say hello in ${current.name}.`}</p></div>}
          {visibleMessages.map(message => {
            const person = people.find(p => p.name === message.user);
            const bot = message.user === 'PubNub Bot';
            return <article className="message-row" key={message.id}><Avatar person={person} /><div className="message-content"><div className="message-meta"><strong>{message.user}</strong><time>{message.time}</time></div><div className={`bubble ${bot ? 'bot-bubble' : ''}`}>{message.text}</div><div className="message-tools"><button onClick={() => reactTo(message.id)} className="reaction-button" title="React with heart">❤️ <span>{message.reactions.length}</span></button><button className="tiny-action" onClick={() => { setDraft(v => v + `@${message.user} `); inputRef.current?.focus(); }}>Reply</button></div>{message.reactions.length > 0 && <div className="reaction-list">{message.reactions.map((r,i) => <span key={i}>{r}</span>)}</div>}</div></article>;
          })}
        </section>
        <form className="composer" onSubmit={sendMessage}>
          {emojiOpen && <div className="emoji-picker">
            <div className="emoji-tabs">{['◷','☺','♧','🍎','◎','🚙','♟','♬','⚑'].map((item,i)=><button type="button" className={emojiCategory===i?'chosen':''} key={i} onClick={()=>setEmojiCategory(i)}>{item}</button>)}</div>
            <div className="emoji-search"><input placeholder="Search" value={emojiSearch} onChange={e => setEmojiSearch(e.target.value)}/><Search size={15}/></div>
            {emojiSearch ? <><div className="emoji-category-label">Search Results</div><div className="emoji-grid search-results">{filteredEmoji.map((item,i)=><button type="button" key={`${item.e}-${i}`} title={item.k} onMouseEnter={()=>setSelectedEmoji(item)} onClick={() => addEmoji(item.e)}>{item.e}</button>)}</div></> : <><div className="emoji-category-label">{emojiCategory===0?'Frequently Used':['Smileys & People','Animals & Nature','Food & Drink','Travel & Places','Activities','Objects','Symbols','Flags'][emojiCategory-1] || 'Frequently Used'}</div><div className="emoji-grid">{filteredEmoji.map((item,i) => <button type="button" key={`${item.e}-${i}`} title={item.k} onMouseEnter={()=>setSelectedEmoji(item)} onClick={() => addEmoji(item.e)}>{item.e}</button>)}</div><div className="emoji-category-label">Smileys &amp; People</div><div className="emoji-grid">{emojiList.slice(0,18).map((item,i)=><button type="button" key={`sm-${i}`} title={item.k} onMouseEnter={()=>setSelectedEmoji(item)} onClick={()=>addEmoji(item.e)}>{item.e}</button>)}</div></>}
            <div className="emoji-detail"><span>{selectedEmoji.e}</span><div><strong>{selectedEmoji.k.split(' ')[0].replace(/^./,c=>c.toUpperCase())}</strong><small>{selectedEmoji.k.split(' ').join('_')}</small></div></div>
          </div>}
          <div className="composer-tools"><button type="button" className={`icon-button ${emojiOpen ? 'active-tool' : ''}`} onClick={() => setEmojiOpen(!emojiOpen)} title="Emoji"><Smile size={20}/></button><button type="button" className="icon-button mention" onClick={() => { setDraft(v => v + '@'); inputRef.current?.focus(); }} title="Mention someone"><AtSign size={19}/></button><button type="button" className="icon-button attach" onClick={() => setNotice('File attachments can be added in a future update.')} title="Attach file"><Paperclip size={18}/></button></div>
          <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setEmojiOpen(false); }} placeholder="Type Message" aria-label="Type message" />
          <button className="send-button" type="submit" disabled={!draft.trim()}>Send <Send size={15}/></button>
        </form>
        <div className="composer-hint">Messages are shared with everyone in this channel.</div>
        {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}><X size={14}/></button></div>}
      </main>
      {showMembers && <aside className="members-panel"><div className="members-head"><div><h2>Members</h2><span>5 people in this workspace</span></div><button className="icon-button" onClick={() => setShowMembers(false)}><X size={18}/></button></div>{people.map(p => <div className="member-row" key={p.name}><Avatar person={p} small/><div><strong>{p.name}</strong><span>{p.role}</span></div><i /></div>)}</aside>}
      {mobileNav && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    </div>
  );
}
