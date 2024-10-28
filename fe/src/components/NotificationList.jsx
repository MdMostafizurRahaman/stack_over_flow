// import { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';

// function NotificationList({ token }) {
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchNotifications();
//   }, [token]);

//   const fetchNotifications = async () => {
//     const res = await fetch(`http://localhost:3000/notification`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setNotifications(data);
//   };

//   const viewPost = async (postId) => {
//     await fetch(`http://localhost:3000/notification/markSeen`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ postId }),
//     });
//     navigate(`/post/${postId}`);
//   };
  
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Notifications</h2>
//       {notifications.length ? (
//         notifications.map(notification => (
//           <div key={notification._id} className="p-4 mb-4 bg-white rounded shadow flex justify-between items-center">
//             <p className="mr-4">{notification.message}</p>
//             <button
//               onClick={() => viewPost(notification.postId)}
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
//             >
//               View Post
//             </button>
//           </div>
//         ))
//       ) : (
//         <p>No notifications available.</p>
//       )}
//     </div>
//   );
// }

// NotificationList.propTypes = {
//   token: PropTypes.string.isRequired,
// };

// export default NotificationList;


import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function NotificationList({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:3000/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  const viewPost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:3000/notification/markSeen`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        throw new Error('Failed to mark notification as seen');
      }

      // Navigate to the post after marking the notification as seen
      navigate(`/post/${postId}`);
      // Optionally refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as seen:", error);
      setError(error.message); // Set error message
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {loading && <p>Loading notifications...</p>} {/* Show loading state */}
      {error && <p className="text-red-500">{error}</p>} {/* Show error if exists */}
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <div key={notification._id} className="p-4 mb-4 bg-white rounded shadow flex justify-between items-center">
            <p className="mr-4">{notification.message}</p>
            <button
              onClick={() => viewPost(notification.postId)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              View Post
            </button>
          </div>
        ))
      ) : (
        !loading && <p>No notifications available.</p> // Show only if not loading
      )}
    </div>
  );
}

NotificationList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default NotificationList;
