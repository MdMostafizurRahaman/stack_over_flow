import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function PostList({ token }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileExtension, setFileExtension] = useState("c");
  const [showingUserPosts, setShowingUserPosts] = useState(false); // State to toggle view
  const [codeSnippets, setCodeSnippets] = useState({});
  useEffect(() => {
    fetchPosts(); // Initially fetch posts by others
  }, [token]);

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost/post`, {
     headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
    setShowingUserPosts(false); // Set to false when fetching posts by others
  };

  const fetchUserPosts = async () => {
    const res = await fetch(`http://localhost/post/mypost`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
    setShowingUserPosts(true); // Set to true when fetching user posts
  };

  const fetchCodeSnippet = async (url, postId) => {
    try {
      const res = await fetch(url);
      const content = await res.text();
      setCodeSnippets((prev) => ({ ...prev, [postId]: content })); // Store the content in state
    } catch (error) {
      console.error("Error fetching code snippet:", error);
    }
  };
  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("fileExtension", fileExtension);
    if (content) {
      formData.append("content", content);
    }

    if (file) {
      formData.append("codeSnippet", file);
    }

    const res = await fetch(`http://localhost/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setFile(null);
      alert("Post created successfully");
      fetchPosts(); // Refresh posts after creating a new post
    } else {
      alert("Error creating post");
    }
  };

  return (
    <div>
      <div className="flex justify-between m-4">
        <h2 className="text-xl font-bold mb-4">Create a Post</h2>
        <button
          onClick={showingUserPosts ? fetchPosts : fetchUserPosts} // Toggle between fetching user posts and others' posts
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
        >
          {showingUserPosts ? "View Posts by Others" : "View My Posts"}{" "}
          {/* Dynamic button label */}
        </button>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="block w-full p-2 mb-2 border rounded"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="block w-full p-2 mb-2 border rounded"
      />
      <select
        value={fileExtension}
        onChange={(e) => setFileExtension(e.target.value)}
        className="block w-full p-2 mb-2 border rounded"
      >
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="py">Python</option>
      </select>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full p-2 mb-2"
      />
      <button
        onClick={handleCreatePost}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
      >
        Create Post
      </button>

      <h2 className="text-xl font-bold mb-4">
        {showingUserPosts ? "My Posts" : "Posts by Others"}
      </h2>
      {posts.length ? (
        posts.map((post) => (
          <div key={post._id} className="p-4 mb-4 bg-white rounded shadow">
            <h3 className="text-lg font-bold">{post.title}</h3>

            {post.codeSnippetUrl && (
              <>
                <button
                  onClick={() =>
                    fetchCodeSnippet(post.codeSnippetUrl, post._id)
                  }
                  className="text-blue-500 mb-2"
                >
                  Load Code Snippet
                </button>
                {codeSnippets[post._id] && (
                  <pre className="bg-gray-100 p-2 rounded">
                    <code>{codeSnippets[post._id]}</code>
                  </pre>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

PostList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default PostList;
