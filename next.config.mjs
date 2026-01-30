/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow dev server access from same network (e.g. phone at 192.168.x.x or 169.254.x.x)
  allowedDevOrigins: ["192.168.*.*", "169.254.*.*", "10.*.*.*"],
};

export default nextConfig;
