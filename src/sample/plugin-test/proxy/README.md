```
 "proxy": {
      "source": "/Users/hyh/workspace/silky-plugins/new/proxy",
      "setting": [{
        "from": ["^/p"], // or "^/p"
        "attribute": "i", // optional
        "to": "http://10.200.8.234:9810/" 
        // or replace 'to' attr
        //"options": {xxx}  // https://github.com/nodejitsu/node-http-proxy#options
      }],
      //or
      // "setting": {from: 'xxx', "to": "xx"}
    }
```