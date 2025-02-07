const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    publicPath: "auto",
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
        use: [
          MiniCssExtractPlugin.loader, // ✅ Extracts CSS into a separate file
          "css-loader",
          "postcss-loader",
        ],
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
      shared: {
        react: { singleton: true, requiredVersion: "18", eager: true },
        "react-dom": { singleton: true, requiredVersion: "18", eager: true },
        "react-redux": { singleton: true, requiredVersion: "^9.2.0", eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "index.css", // ✅ Ensures CSS is saved as a separate file
    }),
  ],
};
