import React, { useEffect, useState } from "react";

interface User {
  id: string;
  videoId: string;
  frameId: string;
  isTrue: boolean;
  timeLeft: number;
}

const UsersUpdate = ({ videoId, frameId, timeLeft }: any) => {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (updatedData: any) => {
    setUsers((prevUsers) => {
      const usersArray = Array.isArray(prevUsers) ? prevUsers : [];

      const existingUsersCount = usersArray.filter(
        (user) => user.id == updatedData.users.id
      ).length;

      if (existingUsersCount < 3) {
        return [
          ...usersArray,
          {
            ...updatedData.users,
            isTrue: true,
            timeLeft: timeLeft < 0 ? 0 : timeLeft,
          },
        ];
      }

      return usersArray;
    });
  };

  useEffect(() => {
    const socket = new WebSocket("https://aic24.onrender.com");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const updatedData = JSON.parse(event.data);
        console.log("Received updated users:", updatedData);

        if (updatedData && updatedData.users) {
          addUser(updatedData);
        } else {
          console.warn("Unexpected data format:", updatedData);
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [users]);

  return (
    <div className="mt-8">
      {users && Array.isArray(users) && users.length > 0 ? (
        <div>
          {users.map((user) =>
            user.videoId != videoId ? (
              <div key={user.id} className="text-red-600 font-bold text-xl">
                {user.id} - Video ID: {user.videoId} - Frame ID: {user.frameId}{" "}
                - Time Left: {user.timeLeft}
              </div>
            ) : (
              <div key={user.id} className="text-green-500 font-bold text-xl">
                {user.id} - Video ID: {user.videoId} - Frame ID: {user.frameId}{" "}
                - Time Left: {user.timeLeft}
              </div>
            )
          )}
        </div>
      ) : (
        <div>No user data available</div>
      )}
    </div>
  );
};

export default UsersUpdate;
