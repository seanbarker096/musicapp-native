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
        ],
        ["module-resolver", {
          "root": ["./src/"],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
            '.png',
            '.svg'
          ],
          "alias": {
            "app": "./src/app",
            "assets": "./src/assets",
            "components": "./src/components"
          }
        }]
      ],
  };
};