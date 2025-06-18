import React from 'react';
const Contact = () => {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Contact Us</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Name" className="w-full border p-2 rounded" />
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <textarea placeholder="Message" className="w-full border p-2 rounded h-32"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
};

export default Contact;
