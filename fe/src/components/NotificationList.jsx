import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function NotificationList({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching notifications with token:', token);
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost/notification/unseen`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch notifications: ${res.statusText}`);
      }
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewPost = async (postId) => {
    try {
      const res = await fetch(`http://localhost/notification/markSeen`, {
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

      navigate(`/post/${postId}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as seen:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className="p-4 mb-4 bg-white rounded shadow flex justify-between items-center"
          >
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
        !loading && <p>No notifications available.</p>
      )}
    </div>
  );
}

NotificationList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default NotificationList;
