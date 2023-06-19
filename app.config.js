export default ({ config }) => {
  const baseConfig = { ...config };

  const envConfig =
    process.env.NODE_ENV === 'production'
      ? {}
      : {
          name: 'My app',
          extra: {
            baseUrl: process.env.LOCAL_HOST === 'true' ? 'http://192.168.1.217:5000': 'http://api-dev222222.us-east-2.elasticbeanstalk.com'
          }
        };

  return { ...baseConfig, ...envConfig };
};
