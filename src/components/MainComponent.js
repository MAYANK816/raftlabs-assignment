import React, { useEffect } from 'react';
import Post from './Post';

const MainComponent = ({ info }) => {
  useEffect(() => {
    if (info && info.size > 0) {
      renderItems();
    }
  }, [info]);

  const renderItems = () => {
    if (info && info.size > 0) {
      return Array.from(info).map(([id, value]) => (
        <Post key={id} post={value.data} docId={id} following_id={value.postId} />
      ));
    }
  };

  return (
    <div
      style={{
        background: "url('https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg?w=740&t=st=1686120077~exp=1686120677~hmac=13d448074a0639ab84fd4665f1dc3dc2f277a471e7dde7a65fca30e7a39fb06d')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col items-start px-4 py-24">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest Posts</h2>
      </div>
      <div className="flex flex-col items-center px-4 py-4">
        {renderItems()} 
      </div>
    </div>
  );
};

export default MainComponent;
