
export default ({ config }) => {

  console.log(process.env.ENV)
  console.log(process.env.API_URL)
  
  return { 
    ...config, 
    owner: 'seanbarker6',
    name: process.env.ENV === 'dev' ? 'MusicFans (Dev)' : 'MusicFans',
    slug: 'music-fans',
    ios: {
      bundleIdentifier: process.env.ENV === 'dev' ? 'com.myapp.dev' : 'com.myapp',
    },
    android: {
      package: process.env.ENV ? 'com.myapp.dev' : 'com.myapp',
    },
    extra: {
      eas: {
      projectId: "0135b451-fb20-4ad5-bca8-dc931ae8b774"
      },
      baseUrl: (process.env.LOCAL_HOST === 'true' && process.env.ENV === 'dev') ? 'http://192.168.1.217:5000': process.env.API_URL,
    }
   }
  };
