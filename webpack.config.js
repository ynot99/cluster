const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
   mode: "development",
   context: path.resolve(__dirname, "src"),
   entry: "./index.ts",
   output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.[fullhash].js",
   },
   devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9000,
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: "./index.html",
      }),
      new CleanWebpackPlugin(),
   ],
   optimization: {
      splitChunks: {
         chunks: "all",
      },
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            use: "ts-loader",
         },
         {
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
         },
      ],
   },
   resolve: {
      extensions: [".ts", ".scss"],
   },
};
