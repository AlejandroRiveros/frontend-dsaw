import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="text-red-600 text-base text-center my-5">
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
