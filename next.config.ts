
/** @type {import('next').NextConfig} */
const nextConfig = {
 // output: 'export', // Toto vytvo�� statick� soubory
  images: { unoptimized: true } // Statick� export nepodporuje Next.js optimalizaci obr�zk�
};
export default nextConfig;
