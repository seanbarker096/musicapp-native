
export default ({ config }) => {

  return { 
    ...config, 
    owner: 'seanbarker6',
    name: process.env.ENV === 'dev' ? 'Gigstory (Dev)' : process.env.ENV == 'stg' ? 'Gigstory (Stg)' : 'Gigstory',
    slug: 'music-fans',
    ios: {
      bundleIdentifier: process.env.ENV === 'dev' ? 'gigstory.dev' : process.env.ENV == 'stg' ? 'gigstory.stg' : 'gigstory',
    },
    android: {
      package: process.env.ENV === 'dev' ? 'gigstory.dev' : process.env.ENV == 'stg' ? 'gigstory.stg' : 'gigstory',
    },
    extra: {
      eas: {
      projectId: "0135b451-fb20-4ad5-bca8-dc931ae8b774"
      },
      baseUrl: getApiUrl(),
    }
   }
  };


  /**
   * For local development we don't have access to env variables defined in eas.json, so manually enter them here for dev environment
   */
  function getApiUrl() {
    if (process.env.LOCAL_HOST === 'true' && process.env.ENV === 'dev') {
      return 'http://192.168.1.217:5000';
    } 

    // eas.json variables should be available in EAS builds, but not local development
    if (process.env.API_URL){
      return process.env.API_URL;
    }

    // Handle case of local development against real dev backend
    return 'https://gigsstory-api-prod.eba-c662d9mj.us-east-2.elasticbeanstalk.com';
  }