const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const history = require('connect-history-api-fallback')
// const convert = require('koa-connect')

// 检查环境，测试环境才开启webpack-serve
const dev = Boolean(process.env.WEBPACK_SERVE)

module.exports = {
  /*
    配置环境
    development:开发环境，在配置文件调试相关选项，如moduleId
    production：生产环境，webpack会将代码打包压缩
  */
  mode: dev ? 'development' : 'production',

  /*
    配置 source map
    开发模式下：cheap-module-eval-source-map 生产的source map对应每一行代码 方便打断点
    生产模式下：hidden-source-map,生成独立的source map ，只能在error report工具中查看
  */
  devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',

  // 配置入口文件
  entry: './src/index.js',

  // 配置打包输出文件
  output: {
    // 打包输出目录
    path: resolve(__dirname, 'dist'),
    // 入口 js 的打包输出文件名
    filename: 'index.js'
  },

  module: {
    // 配置各种类型的文件加载器，称之为loader,webpack遇到import...时，会调用这里配置的loader对引入的文件进行编译
    rules: [
      {
        // 使用babel编译源代码为ES5 正则匹配
        test: /\.js$/,
        // 排除node_mocule文件夹
        exclude: /node_modules/,
        /*
          use 指文件的loader,值可以是字符串或者数组，这里先用eslint-loader 处理，结果返回给babel-loader处理
          处理顺序是 最后一个到第一个
          eslint-loader 用来检查代码，如果有错误，编译时会报错
          babel-loader 用来编译代码
        */
        use: ['babel-loader', 'eslint-loader']
      },
      {
        // 匹配html文件
        test: /\.html$/,
        /*
          使用html-loader，将 html内容存为js字符串
          例如：import htmlString from './template.html',html的文件的内容会被转为一个js的字符串，合并到js文件中
        */
        use: 'html-loader'
      },
      {
        // 匹配css文件
        test: /\.css$/,
        /*
          使用css-loader处理，返回的结果交给style-loader处理
          css-loader将css内容存为js字符串，并将bg.font-face等引用的图片字体交给loader打包
        */
        use: ['css-loader', 'style-loader']
      },
      {
        // 匹配各种字体/文件/图片
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        /*
          使用url-loader，它接受一个limit 参数，单位字节(byte)
          当体积小于limit时，url-loader把文件转化为Data URI的格式内联到引用的地方
          当文件大于limit时，url-loader 会调用file-loader，把文件存储到目录,并把引用文件路径写成输出后的路径
          例如：小于limit <img src="small.png"/> 会被编译输出为 <img src="data:image/png;base64,iVB......"/>
               大于limit <img src="n=big.png"/> 会被编译输出为 <img src="/fueuwyu343ghsgdhs.png"/>
        */
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  /*
    配置webpack的loader和plugin的区别 ：
    loader是在import时根据不同文件名，匹配不同的loader对这个文件做处理
    plugin，关注的不是文件格式，而是在编译的各个阶段，会触发不同的事件，让你可以干预每个编译阶段
  */
  plugins: [
    /*
       html-webpack-plugin 用来打包入口html文件
       entry 配置的入口是js文件，webpack以js文件为入口，遇到import，用loader加载引入文件
       但作为浏览器打开的html文件，是引入入口js文件，它在整个编译过程的外面，所以需要html-webpack-plugin打包
    */
    new HtmlWebpackPlugin({
    /*
      template 参数指定入口html文件路径，插件会把这个文件交给webpack去编译
      webpack按照正常流程，找到loaders中test条件匹配的loader编译，html-loader就是匹配的loader
      html-loader编译后会生产字符串，会由html-webpack-plugin存储到html文件输出目录，文件默认为index.html
      可以通过filename参数编译输出的文件名
      html-webpack-plugin 也可以不指定 template参数 它会使用默认的html模版
     */

      template: './src/index.html',

      // 考虑到webpack的兼容性，fchunksSortMode的参数要设置为none
      chunksSortMode: 'none'
    })
  ]

}

/*
  配置开发使用的服务器，直接使用localhost来打开页面调试
  并且带有热更新的功能，打代码时保存文件，浏览器自动刷新，比nginx方便
  如果是修改css文件，甚至都不需要刷新页面

  因为webpack-cli无法正确识别serve选项，使用webpack-cli执行打包时会报错，因此这边需要判断一下：
  仅当使用webpack-serve 时插入serve选项
*/

if (dev) {
  module.exports.serve = {
    // 监听端口
    port: 8084
    // add 给服务koa 实例注入 middleware 增加功能
    /*
      配置 SPA 入口

      SPA 的入口是一个统一的 html 文件，比如
      http://localhost:8080/foo
      我们要返回给它
      http://localhost:8080/index.html
      这个文件
    */
    // add: app => {
    //   app.use(convert(history()))
    // }

  }
}