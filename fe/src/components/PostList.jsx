import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function PostList({ token }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('');
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [showingUserPosts, setShowingUserPosts] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:3000/post`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
    setShowingUserPosts(false);
  };

  const fetchUserPosts = async () => {
    const res = await fetch(`http://localhost:3000/mypost`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
    setShowingUserPosts(true);
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', Array.isArray(content) ? content.join('\n') : content);

    if (isFileUpload && file) {
      formData.append('codeSnippet', file);
    } else {
      formData.append('language', language);
    }

    const res = await fetch(`http://localhost:3000/post`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      setTitle('');
      setContent('');
      setFile(null);
      setLanguage('');
      alert("Post created successfully");
      fetchPosts();
    } else {
      const errorData = await res.json();
      alert(`Error creating post: ${errorData.message}`);
    }
  };

  return (
    <div>
      <div className='flex justify-between m-4'>
        <h2 className="text-xl font-bold mb-4">Create a Post</h2>
        <button
          onClick={showingUserPosts ? fetchPosts : fetchUserPosts}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
        >
          {showingUserPosts ? "View Posts by Others" : "View My Posts"}
        </button>
      </div>
      <div>
        <button onClick={() => setIsFileUpload(!isFileUpload)} className="bg-gray-300 py-2 px-4 rounded mb-4">
          {isFileUpload ? 'Switch to Code Snippet' : 'Switch to File Upload'}
        </button>
      </div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="block w-full p-2 mb-2 border rounded"
      />
      {isFileUpload ? (
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          className="block w-full p-2 mb-2"
        />
      ) : (
        <>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Code Snippet"
            className="block w-full p-2 mb-2 border rounded"
          />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Language</option>
            <option value="c">C</option>
            <option value="html">HTML</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </>
      )}
      <button
        onClick={handleCreatePost}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
      >
        Create Post
      </button>

      <h2 className="text-xl font-bold mb-4">{showingUserPosts ? "My Posts" : "Posts by Others"}</h2>
      {posts.length ? (
        posts.map(post => (
          <div key={post._id} className="p-4 mb-4 bg-white rounded shadow">
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p>{post.content}</p>
            <p className="text-gray-600 text-sm">Posted by: {post.email}</p>
            
            {post.isFileUpload && post.folderName ? (
              <p className="text-gray-600 text-sm">Folder Name: {post.folderName}</p>
            ) : post.language ? (
              <p className="text-gray-600 text-sm">Language: {post.language}</p>
            ) : null}

            {post.codeSnippetUrl && (
              <a
                href={post.codeSnippetUrl}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                View file
              </a>
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
