import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const SinglePost = ({ token }) => {
  const { postId } = useParams(); // Get postId from the URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    const res = await fetch(`http://post-service:3002/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPost(data);
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p className="mt-2">{post.content}</p>
      <p className="text-gray-600 text-sm">Posted by: {post.email}</p> {/* Author's email */}
      {post.codeSnippetUrl && (
        <a
          href={post.codeSnippetUrl}
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Code Snippet
        </a>
      )}
    </div>
  );
};

SinglePost.propTypes = {
  token: PropTypes.string.isRequired,
};

export default SinglePost;
