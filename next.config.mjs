/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      new URL("https://res.cloudinary.com/dccgxueof/**"),
    ],
  },
};

export default nextConfig;
