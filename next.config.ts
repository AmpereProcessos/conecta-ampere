import type { NextConfig } from "next";
import createMDX from "@next/mdx";
const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "sc-erp.s3.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
		],
	},
	/* config options here */
};

const withMDX = createMDX({
	// Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
