# rover

[chirimen-oh/MakerFaireTokyo2016/mft_rover]のClone。

- mft2016 : [元ソース](https://github.com/chirimen-oh/MakerFaireTokyo2016/tree/master/mft_rover) にserver対応するため一部修正したもの
- server : WebSocket server
- remocon : リモコン

# つかいかた

1. `./server/bridge3.js` を起動します。(ws://mz4u.net:3003を利用する場合は不要)

注意：
node.jsは 新しいものだと動かないようです。
v0.10.48 で動作確認しました。

```.shell
> $ npm install ws    
> $ npm install date-utils     
> $ node bridge3.js    
````

2. `./mft2016/mft_rover` をCHIRIMENにインストールして起動

> 1. で local環境に bridge3.jsを起動した場合には、 app.js 10行目のURLを書き換えてください

3. `./remocon/` をローカルhttpサーバーで起動 (あるいは`http://mz4u.net/chirimen/remocon/`にアクセス) 

> これがコントローラーになります。


