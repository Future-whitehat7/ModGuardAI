import React, { useEffect, useState } from 'react';

export default function Media() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('https://your-n8n-instance/webhook/modguard-blog') // Replace with your real webhook URL
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error fetching blog posts:", err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-6 py-20 font-[Inter]">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black mb-6">
          ModGuard Media & Press
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          We cover the intersection of synthetic media, AI governance, content creation, and the future of trust. Join us to spotlight visionaries, creators, and movements shaping the world ahead.
        </p>
      </div>

      {/* Press Submission Form */}
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Submit Your Story</h2>
        <form
          action="https://your-n8n-instance/webhook/modguard-press" // Replace with real webhook
          method="POST"
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="border p-3 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="border p-3 rounded w-full"
          />
          <input
            type="text"
            name="organization"
            placeholder="Organization"
            className="border p-3 rounded w-full"
          />
          <textarea
            name="message"
            placeholder="Your pitch or request..."
            rows={5}
            required
            className="border p-3 rounded w-full"
          />
          <button
            type="submit"
            className="bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition"
          >
            Submit for Review
          </button>
        </form>
      </div>

      {/* Auto Blog Feed */}
      <section className="mt-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Latest Insights & Coverage</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <>
              <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
              <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
              <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
            </>
          ) : (
            posts.map((post, idx) => (
              <a
                key={idx}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border rounded-lg shadow hover:shadow-lg transition p-4"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.summary}</p>
              </a>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
