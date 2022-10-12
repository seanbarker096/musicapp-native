module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: 
      [ 
        [
          "module:react-native-dotenv", {
          "moduleName": "@env",
          "path": `./config/.env.${process.env.ENV}`,
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true
          }
        ]
      ],
  };
};