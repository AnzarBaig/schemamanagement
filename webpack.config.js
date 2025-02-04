const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    publicPath: "http://64.227.151.6:3001/",
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      devServer.app.use((req, res, next) => {
        try {
          decodeURIComponent(req.url);
          next();
        } catch (err) {
          console.error("Malformed URL detected:", req.url);
          res.status(400).send("Bad Request: Malformed URL");
        }
      });
  
      return middlewares;
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader","postcss-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      components: path.resolve(__dirname, 'src/components/')
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "schemamanagement",
      filename: "remoteEntry.js",
      exposes: {
        "./schemamanagement": "./src/App",
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
