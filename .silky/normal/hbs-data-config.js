const _global = require('./global')
module.exports = {
  //页面配置的数据引用变量映射
  urlMap: {
    server: "http://10.200.8.234:9810/p"
  },
  //提供http head头，用于一些接口校验
  headers:{
    private_token: "ddb0fbb7-a049-47d5-9fd3-bdc97e1feab0"
  },

  //global全局变量
  global: _global,
  //全局变量在编译页面时的挂载点
  globalRoot: "global",
  formatPageData: (url, context)=>{
    let pageID = url.split('/').pop();
    if(!context[pageID]){throw new Error(`${url} 数据为空！`)}
    return {
      PD: context[`${pageID}`].moduleGroup
    }
  },
  moduleMap: {
            "t-nav-lv1": "<global.__pub_tmpl_comp>header/c-header-lv1-v5", //v5版头部
        "t-nav-lv1-ext": "<global.__pub_tmpl_comp>header/c-header-lv1-extend", //lv1-extend版头部
        "t-nav-lv2": "<global.__pub_tmpl_comp>header/c-header-lv2-v5",
        "t-subNav": "module/function/m-subnav",     //二级导航模块
        "t-focus": "module/function/m-focus",       //首页焦点图模块
        "t-bannerAd": "module/function/m-gglist",   //普通通栏广告
        "t-headerAd": "module/function/m-headgg",   //固定头部广告
        "t-carouselAd": "module/function/m-theatre-carousel",  //carousel广告
        //"t-listText": "module/function/m-hot-focus",            //简单文本竖版模块
        "t-hottag": "module/function/m-hottags",                  //热门标签模块
        "t-listSingle": "module/function/m-list-single-img",       //单排图文横版
        "t-listSinglePortrait": "module/function/m-list-single-portrait",    //单排图文竖版
        "t-listSingleCircle": "module/function/m-list-single-circle", //单排图文圆版
        "t-listStar": "module/function/m-list-star", //单排明星圆版
        "t-listDouble": "module/function/m-list-double-main",           //双排图文排版
        "t-listDoubleImage": "module/function/m-list-double-img-main",  //双排图文(含大图)排版
        "t-likeLandscape": "module/function/m-like-landscape",     //猜你喜欢(横版/竖版)
        //"t-listTop": "module/function/m-list-top",                 //排行榜模块

        //会员频道特殊模块
        "t-vipright": "module/function/m-pub-vip",     //VIP频道VIP特权模块

        //直播频道特殊模块
        "t-livePlayer": "module/live/m-live-player",   //直播首页播放器模块
        // "t-livePreview": "module/live/m-live-preview",   //直播预告模块
        "t-liveList": "module/live/m-live-list",         //直播图文模块
        "t-liveHot": "module/live/m-live-hot",           //热门人气主播

        //新闻频道特殊模块
        "t-listSingleSlider": "module/function/m-list-single-slider", //新闻首页单排slider模块
        "t-imageSplit": "module/function/m-image-split", // 图片内容分隔
        "t-imageList": "module/function/m-image-list",   // 3列图片模块
        "t-newsPlayer": "module/news/m-news-player",     // 新闻频道播放器模块

        //音乐频道独有模块
        't-musicHeader': 'module/music/m-header',
        't-musicSlider': 'module/music/m-slider',
        't-musicAlbum': 'module/music/m-album',
        't-musicSelection': 'module/music/m-selection',
        't-musicLive': 'module/music/m-live',
        't-musicZone': 'module/music/m-zone',
        't-musicFeeling': 'module/music/m-feeling',

        //频道首页组合模板
        "c-listSingle-repeat": "module/group/c-list-single-group",     //左右分列复合模块
        "c-listSingle-listSingle": "module/group/c-list-single-group",     //左右分列复合模块
        "c-listDouble-listText": "module/group/c-list-double-and-list-text",     //左双排图文右文本竖版复合模块
        "c-listDoubleImage-listText": "module/group/c-list-double-img-and-list-text",     //左双排大图图文右文本竖版复合模块
        "c-listDoubleImage-listTop": "module/group/c-list-double-img-and-list-top",//左双排大图图文右排行榜竖版复合模块
        "c-listDouble-listTop": "module/group/c-list-double-and-list-top",         //左双排图文右排行榜复合模块
        "c-listSinglePortrait-listTop": "module/group/c-list-portrait-and-list-top", //左单排竖版图文右排行榜竖版复合模块
        "c-listSinglePortrait-listText": "module/group/c-list-portrait-and-list-text", //左单排竖版图文右文本竖版复合模块

        //直播频道组合模块
        "c-livePreview-repeat": "module/live/m-live-preview",   //直播预告模块

        //新闻频道
        "c-newsPlayer-repeat": "module/news/m-news-player",     // 新闻频道播放器组合模块

        //音乐频道组合模块
        "c-musicAlbum-musicAlbumRank": 'module/music/m-album-rank'
  }
}