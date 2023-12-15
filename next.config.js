/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'assets.coingecko.com',
				port: '',
				pathname: '/coins/images/**'
			}
		]
	}
};

module.exports = nextConfig;
