import { useState } from "react";
import Auth from "./components/Auth";
import PostList from "./components/PostList";
import SinglePost from "./components/SinglePost";
import NotificationList from "./components/NotificationList";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import NavBar from "./components/NavBar";

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
            <NavBar onLogout={handleLogout} /> 

            <Routes>
              <Route path="/" element={<PostList token={token} />} />
              <Route path="/posts" element={<PostList token={token} />} />
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
