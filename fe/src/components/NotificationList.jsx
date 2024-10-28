import  { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom'


function NotificationList({ token }) {
  const [notifications, setNotifications] = useState([]);

  const navigate=useNavigate();
  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    const res = await fetch(`http://localhost:3000/notification`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotifications(data);
  };
  const viewPost=(id)=>{
       navigate(`/post/${id}`)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length ? (
        notifications.map(notification => (
          <div key={notification._id} className="p-4 mb-4 bg-white rounded shadow flex justify-between items-center">
            <p className="mr-4">{notification.message}</p>
            <button
              onClick={()=>viewPost(notification.postId)} // Redirect to the post
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              View Post
            </button>
          </div>
        ))
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
}

NotificationList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default NotificationList;
