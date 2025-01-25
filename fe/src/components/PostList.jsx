import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import config from '../config';

function PostList({ token }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('');
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [showingUserPosts, setShowingUserPosts] = useState(false);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        console.error('No token found in localStorage.');
        return;
      }
  
      console.log('Full Authorization Header:', `Bearer ${token}`);

      const response = await fetch('http://localhost:3003/post?myPosts=false', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch posts: ${errorText}`);
      }
  
      const posts = await response.json();
      console.log('Posts fetched:', posts);
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };  
  
  const handleCreatePost = async () => {
    if (isFileUpload && !file) {
      alert('Please upload a file.');
      return;
    }

    if (!isFileUpload && !language) {
      alert('Please select a language.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', Array.isArray(content) ? content.join('\n') : content);

    if (isFileUpload && file) {
      formData.append('codeSnippet', file);
    } else {
      formData.append('language', language);
    }

    // Retrieve the token from localStorage
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      alert('Token is missing');
      return;
    }

    try {
      const res = await fetch(`${config.postServiceUrl}/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
        body: formData,
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setFile(null);
        setLanguage('');
        alert('Post created successfully');
        fetchPosts(); // Fetch updated posts based on the filter
      } else {
        const errorData = await res.json();
        alert(`Error creating post: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    }
  };

  // Effect hook to fetch posts when the component loads
  useEffect(() => {
    fetchPosts(); // Fetch posts on mount
  }, [showingUserPosts]);

  return (
    <div>
      <div className='flex justify-between m-4'>
        <h2 className="text-xl font-bold mb-4">Create a Post</h2>
        <button
          onClick={() => setShowingUserPosts(!showingUserPosts)} // Update the state correctly
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
