import { useEffect, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedId, setSelectedId] = useState(null);

  return <div className="container">
    <div className="add-from">

      <FriendList selectedId={selectedId} setSelectedId={setSelectedId} friends={friends} />
      <AddFriend setFriends={setFriends} />

    </div>
    <div className={`split-bill ${selectedId ? 'active' : 'block'}`}>
      <Bill friends={friends} selectedId={selectedId} setFriends={setFriends} />
    </div>
  </div>
}

function FriendList({ friends, selectedId, setSelectedId }) {
  return <div className="friend-list">
    {
      friends.map(el => <Friend selectedId={selectedId} setID={setSelectedId} id={el.id} name={el.name} image={el.image} balance={el.balance} key={el.id} />)
    }
  </div>
}

function Friend({ id, name, image, balance, selectedId, setID }) {
  return <div className="friend">
    <div className="profile-pic">
      <img src={image} alt={name} />
    </div>
    <div className="info">
      <h2 className="name">{name}</h2>
      <p className="amount" style={balance === 0 ? { color: '#393e46' } : balance < 0 ? { color: 'red' } : balance > 0 ? { color: 'green' } : ''}>
        {balance === 0 && 'You Both are even'}
        {balance < 0 && `You owe ${name} $${Math.abs(balance)}`}
        {balance > 0 && `${name} owe you ${Math.abs(balance)}`}
      </p>
    </div>
    <button onClick={() => setID(selectedId === id ? null : id)} className="btn">{id === selectedId ? 'Close' : 'Select'}</button>
  </div>
}

function AddFriend({ setFriends }) {
  const [isOpen, setIsOpen] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [url, setUrl] = useState('https://thispersondoesnotexist.com');
  function handleSubmit(e) {
    e.preventDefault();
    if (friendName && url) {
      const newObj = {
        id: Date.now(),
        name: friendName,
        image: url,
        balance: 0
      }
      setFriends((friends) => [...friends, newObj]);
      setFriendName(() => '')
      setUrl(() => 'https://thispersondoesnotexist.com')
      setIsOpen(!isOpen);
    } else {
      alert('Enter Fields Properly')
    }
  }
  return <>
    <form onSubmit={handleSubmit} className={`friend-form ${isOpen ? 'active' : 'block'}`}>
      <span>🧑‍🤝‍🧑 Friend's Name <input type="text" value={friendName} onChange={(e) => setFriendName(e.target.value)} placeholder="Enter Friend Name" name="" id="" /></span>
      <span>🖼️Image Url <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter Image Url" name="" id="" /></span>
      <button style={{ marginLeft: 'auto' }} type="submit" className="btn">Add Now</button>
    </form>
    <button style={{ marginLeft: 'auto' }} onClick={() => setIsOpen(!isOpen)} className="btn">{isOpen ? 'Close' : 'Add Friend'}</button>
  </>
}

function Bill({ selectedId, friends, setFriends }) {
  const [bill, setBill] = useState(0);
  const [expense, setExpense] = useState(0)
  const [paying, setPaying] = useState('You');

  useEffect(() => {
    setBill(0);
    setExpense(0);
    setPaying('You');
  }, [selectedId]);

  const selectedFriend = friends.filter(el => selectedId === el.id);

  function handleSubmit(e) {
    e.preventDefault();
    if (bill <= 0 || expense <= 0 || expense > bill) {
      alert('Invalid inputs! Please ensure all fields are correctly filled.');
      return;
    }
    if (paying === 'You') {
      setFriends((friends) => friends.map(fr => fr.id === selectedId ? { ...fr, balance: fr.balance + (bill - expense) } : fr));
    }
    if (paying === selectedFriend[0].name) {
      setFriends((friends) => friends.map(fr => fr.id === selectedId ? { ...fr, balance: fr.balance - expense } : fr));
    }
    setBill(0)
    setExpense(0);
  }
  return (
    <>
      {selectedFriend.length > 0 ? (
        <>
          <h2>Split a Bill with {selectedFriend[0].name}</h2>
          <form className="bill-form" onSubmit={handleSubmit}>
            <span>💰Bill Value <input onChange={(e) => setBill(+e.target.value)} value={bill} type="number" name="" id="" /></span>
            <span>🧍Your Expense <input onChange={(e) => setExpense(+e.target.value)} type="number" value={expense} name="" id="" /></span>
            <span>🧑‍🤝‍🧑{selectedFriend[0].name} Expense <input value={bill - expense} readOnly type="number" name="" id="" /></span>
            <span>
              🤑Who is Paying Bill
              <select value={paying} onChange={(e) => setPaying(e.target.value)}>
                <option value="You">You</option>
                <option value={selectedFriend[0].name}>{selectedFriend[0].name}</option>
              </select>
            </span>
            <button style={{ marginLeft: 'auto', marginTop: '10px' }} className="btn">Split Bill</button>
          </form>
        </>
      ) : (
        <h2>No friend selected</h2>
      )}
    </>
  );
}