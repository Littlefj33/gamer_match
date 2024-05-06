"use client";

export default function SendButton({ sender, recipient }) {
  const handleSendFriendRequest = async () => {
    try {
      const response = await fetch('/api/friends/sendFriendRequest', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sender, recipient }),
      });

      if (response.ok) {
        console.log("Sent friend request")
      } else {
        console.log("Failed to send friend request")
      }

    } catch (e) {
      console.log(e);
    }
  }

  return (
    //TODO: need to make the send request button disappear if users are already friends or pending
    // <button onClick={handleSendFriendRequest} disabled={isFriend}>
    //   {isFriend ? 'Added as Friend' : 'Add Friend'}
    // </button>
    <button className="text-black font-medium" onClick={handleSendFriendRequest}>+ Add Friend</button>
  );
}