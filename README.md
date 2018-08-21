# jsonwebtoken 总结
### jwt
  jwt是 json web token 的简写，一个方便的一种实现服务器与客服端安全通讯的一种规范方案，是目前最流行的跨域认证解决方案。
-------------
http是一种无状态协议，服务器并不知道请求是哪个用户发的，通常做法是：
1. 用户向服务器发送用户名和密码
2. 服务器验证通过后，在当前对话（session）里保存相关数据
3. 服务器向用户返回一个sessionId，保存到cookie里
4. 之后用户的每一次请求带上cookies,服务器通过sessionId找到对应的用户。
-------
这种做法只适合单机，如果是服务器集群，或者是跨域的服务导向架构，就要求 session 数据共享，每台服务器都能够读取 session；而session通常存在服务器中，量大的话对服务器性能开销很大。  
一种方案是session数据持久化，写入数据库或者别的持久层。各服务器收到请求后都向持久层请求数据，这种做法工作量大，如果持久层挂了，就是单点失败。  
其次，写入cookies容易受xss攻击。  
于是，jsonwebtoken就可以解决这些问题，jwt不关心那个用户发过来的请求，只要验证token通过，就可以找到对应的用户。

#### 生成的jwt(已点.分为三段，分别为header,payload,signature)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzQ5Mjg0Mzg2NzYsImRhdGEiOnsidWlkIjoiMTU3NjdiYzAtODVjOC0xMWU4LWJjOWYtOGQ0ZDlmMmU1NjEzIiwidW5pb25JZCI6Im9qTTZfdl9WVTFqakxWVTJkeFF2bnY5Tk4wVzgiLCJuaWNrbmFtZSI6IuaigeS8n-aIkCIsInBvcnRyYWl0IjoiaHR0cDovL3RoaXJkd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL1YwaFNkSHJGcFhiTkhrUXY1dGQzSkJjaWMyUU9NMkxiZGxsdDFZakk5c1RNZUEzbm5HWW5pYmVEazhKZEl5QjZ0SEMwZzd3TE5Zb3ZWWDZyNWlhODJzWU9nLzEzMiJ9LCJpYXQiOjE1MzQ4MTc2ODV9.bbouFZBnQC7Bj15xWWC3G2bnklYajC6rvUUdHPjmXJ8
```
### jwt 组成
1. header,header里面说明类型和使用的算法，比如类型为jwt，加密算法为hs256
```
{
  "alg": "HS256",
  "typ": "JWT"
}
```
2.payload,payload是一组claim的值。claim包含claim name和claim value。前者是string类型，后者可以是任意的json对象。
claims有三种类型：reserved claim，public claim 和 private claim。
reserved claim是预先定义好的，不强制使用但推荐使用的一组claim，比如 iss(issuer 发布者), exp(expiration time 失效时间)，sub(subject 主题），aud(audience 听众) 等。
用于说明一些有用的交互信息。public claim,是指由JTWs所定义的，但是为了防止和其他名字发生重名的claims。
它们需要定义成IANA JSON web token registery 里面 或者定义成一个URI，这个URI包含一组固定的命名。private claim 是客户自己创建的用于彼此分享信息。
```
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```
3.signature 就是用点号将header和payload联系起来，然后用header里面指定的加密方法进行加密后的字符串。
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```
--------
### 使用
npm i jsonwebtoken  
jsonwebtoken提供了多个api，多数用两个（sign生成，verify校验）
jwt生成token  
jwt.sign（payload，secretOrPrivateKey，[options，callback]）
secretOrprivateKey 是一个字符串，缓冲区或对象，包含HMAC算法的秘密或RSA和ECDSA的PEM编码私钥。
```
const exp = Date.now() + 5 * 60 * 1000;
		const uid = uuid();   //用户登录，给用户生成唯一的uid存到token中
		//生成token
		const loginToken = jwt.sign({
			exp,    //token有效期
			data: {	
				uid
			}
		},'token')
```
![image](http://p94d2qxd7.bkt.clouddn.com/%E7%94%9F%E6%88%90wt.png)
解码(异步)
jwt.verify（token，secretOrPublicKey，[options，callback])  
```
 const pk = 'token';
        return new Promise((resolve) => {
            jwt.verify(jwtValue, pk, (err, result) => {
                if(err) {
                    resolve();
                    return
                }
                resolve(result)   //验证通过，返回用户的uid等信息。
            })
        })
```
![image](http://p94d2qxd7.bkt.clouddn.com/%E8%A7%A3jwt.png)

#### jwt缺点
固定生成签名的方法，如果更换密钥，前期生成的token就失效，如果secretOrPublicKey泄漏，就有可能解出token的信息等。


