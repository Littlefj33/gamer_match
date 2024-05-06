"use client";

export default function AcceptButton({ recipient, sender }) {
  const handleAcceptFriendRequest = async () => {
    try {
      const response = await fetch('/api/friends/acceptFriendRequest', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipient, sender }),
      });

      if (response.ok) {
        console.log("Accepted friend request")
      } else {
        console.log("Failed to accept friend request")
      }

    } catch (e) {
      console.log(e);
    }
  }

  return (
    // <button onClick={handleSendFriendRequest} disabled={isFriend}>
    //   {isFriend ? 'Added as Friend' : 'Add Friend'}
    // </button>
    <button className="text-black font-medium" onClick={handleAcceptFriendRequest}>Accept</button>
  );
}