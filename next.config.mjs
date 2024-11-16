/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Permitindo qualquer domínio
          port: '',
          pathname: '/**', // Permitindo qualquer caminho
        },
      ],
    },
  };
  
  export default nextConfig;  