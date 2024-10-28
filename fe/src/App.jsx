import { useState } from "react";
import Auth from "./components/Auth"
import PostList from "./components/PostList";
import SinglePost from "./components/SinglePost";
import NotificationList from "./components/NotificationList";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // Combine imports

function App() {
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <BrowserRouter>
        {!token ? (
          <Auth setToken={setToken} />
        ) : (
          <div className="container mx-auto">
            <header className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Welcome to the App</h1>
              <div className="flex gap-2">
                <Link className="font-bold text-white bg-black rounded-md p-2 m-2" to="/notifications">
                  Notification
                </Link>
                <button onClick={handleLogout} className="ml-2 bg-red-500 hover:bg-red-600 text-white mt-2 py-2 px-4 rounded">
                  Logout
                </button>
              </div>
            </header>

            <Routes>
              <Route path="/" element={<PostList token={token} />} />
              <Route path="/post/:postId" element={<SinglePost token={token} />} />
              <Route path="/notifications" element={<NotificationList token={token} />} />
            </Routes>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
