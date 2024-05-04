"use client";

export default function RejectButton({ recipient, sender }) {
  const handleRejectFriendRequest = async () => {
    try {
      const response = await fetch('/api/friends/rejectFriendRequest', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipient, sender }),
      });

      if (response.ok) {
        console.log("Rejected friend request")
      } else {
        console.log("Failed to reject friend request")
      }

    } catch (e) {
      console.log(e);
    }
  }

  return (
    // <button onClick={handleSendFriendRequest} disabled={isFriend}>
    //   {isFriend ? 'Added as Friend' : 'Add Friend'}
    // </button>
    <button className="text-black font-medium" onClick={handleRejectFriendRequest}>Ignore</button>
  );
}