## webpack5-h5
> 构建html5
 
## install
> npm install

## Get started
> npm start
>
> npm start <filename>    #运行某个项目

## build
> npm run build
>
> npm run build --report  #查看当前项目的依赖关系

## 目录结构
```
.
├── README.md
├── common 
│   ├── assets (公共资源)
│   ├── components (公共组件)
│   └── xhr (公共service，可在axios拦截器封装token等)
│    
├── script
│   ├── build.js (打包项目入口)
│   ├── project.config.js (开发项目配置)
│   ├── start.js (开发项目入口)
│   └── webpack.config.js (webpack配置)
│
├── src
│   ├── demo1 (子项目)
│   │   ├── assets (子项目资源)
│   │   ├── components (子项目组件)
│   │   ├── services (子项目api接口分装)
│   │   ├── router (子项目路由配置)
│   │   ├── views (子项目页面)
│   │   ├── config.js (子项目配置)
│   │   ├── index.js (子项目入口文件)
│   │   ├── index.html (子项目html模版)
│   │   └── index.php (子项目打包模版，仅在打包php文件才需要)
│   │  
│   └── demo2 (子项目)
│
├── static (静态资源，项目打包不编译该目录的文件，而是直接把目录复制到打包的目录)
│   ├── img 
│   └── js 

```

## 项目配置
> npm start        #开发环境编译时，依赖project.config.js配置信息运行指定项目
>
> npm start demo   #重置project.config.js的filename项目名称并运行
```javascript
// script/project.config.js
// filename 开发项目名称

module.exports = { "filename" : "px2rem" }
```


