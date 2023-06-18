export default ({ config }) => {
  const baseConfig = { ...config };

  const envConfig =
    process.env.NODE_ENV === 'production'
      ? {}
      : {
          name: 'My app',
          extra: {
            baseUrl: 'http://api-dev222222.us-east-2.elasticbeanstalk.com'
          }
        };

  return { ...baseConfig, ...envConfig };
};
