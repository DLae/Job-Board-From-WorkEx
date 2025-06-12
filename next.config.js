/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
    prependData: `$govuk-assets-path: '/assets/';
                 $govuk-font-family: "GDS Transport", arial, sans-serif;`,
    // Add SASS options to handle compatibility issues
    outputStyle: 'expanded', // Makes debugging easier
    quietDeps: true, // Suppresses warnings from dependencies
  },
  // Add this section to help with asset handling
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
      },
    });
    return config;
  }
}

module.exports = nextConfig;