---
title: MongoDB升级后启动失败的解决方案
keywords: Mongodb,Mongodb版本兼容,后端,NoSql
description: 记录一次Mongodb数据库版本升级后无法启动问题的解决过程
---

## 问题描述

很久之前，在我的Mac book上使用`homebrew`安装并使用过MongoDB社区版数据库(`mongodb-community`)，后来不知哪一次运行`brew upgrade`命令更新软件包时，将Mongo DB也更新到了较新的的版本(`8.0.9`);\
今天本地起一个项目，需要使用到Mongo DB,结果启动失败：

```bash
brew services start mongodb-community
> Bootstrap failed: 5: Input/output error
> Try re-running the command as root for richer errors.
> Error: Failure while executing; `/bin/launchctl bootstrap gui/501 /Users/loong/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist` exited with 5.
```

使用`tail`打印日志：

```bash
tail -n 200 /opt/homebrew/var/log/mongodb/mongo.log
```

输出如下：

```bash
27 > ...
28 > {"t":{"$date":"2025-05-04T10:23:29.318+08:00"},"s":"I",  "c":"CONTROL",  "id":20698,   "ctx":"thread1","msg":"***** SERVER RESTARTED *****"}
...
37 > {"t":{"$date":"2025-05-04T10:23:29.329+08:00"},"s":"I",  "c":"CONTROL",  "id":21951,   "ctx":"initandlisten","msg":"Options set by command line","attr":{"options":{"config":"/opt/homebrew/etc/mongod.conf","net":{"bindIp":"127.0.0.1, ::1","ipv6":true},"replication":{"replSetName":"rs0"},"storage":{"dbPath":"/opt/homebrew/var/mongodb"},"systemLog":{"destination":"file","logAppend":true,"path":"/opt/homebrew/var/log/mongodb/mongo.log"}}}}
...
67 > {"t":{"$date":"2025-05-04T10:23:30.191+08:00"},"s":"F",  "c":"CONTROL",  "id":20573,   "ctx":"initandlisten","msg":"Wrong mongod version","attr":{"error":"UPGRADE PROBLEM: Found an invalid featureCompatibilityVersion document (ERROR: Location4926900: Invalid featureCompatibilityVersion document in admin.system.version: { _id: \"featureCompatibilityVersion\", version: \"6.0\" }. See https://docs.mongodb.com/master/release-notes/7.0-compatibility/#feature-compatibility. :: caused by :: Invalid feature compatibility version value '6.0'; expected '7.0' or '7.3' or '8.0'. See https://docs.mongodb.com/master/release-notes/7.0-compatibility/#feature-compatibility.). If the current featureCompatibilityVersion is below 7.0, see the documentation on upgrading at https://docs.mongodb.com/master/release-notes/7.0/#upgrade-procedures."}}
68 > ...
```

从日志中`***** SERVER RESTARTED *****`位置向下查看，发现了这个`UPGRADE PROBLEM`错误(上面日志第`67`行)。

## 解决过程

- 1、使用7.X版本修改`featureCompatibilityVersion`配置项 \
到MongoDB官网下载[最新7.x版压缩包](https://fastdl.mongodb.org/osx/mongodb-macos-arm64-7.0.20.tgz); \
解压包，在解压后文件夹内打开终端，启动Mongodb，**并指定数据库路径(`dbPath`)选项**：

```bash
./bin/mongod --dbpath  /opt/homebrew/var/mongodb
```

>**`--dbpath`参数的值是从日志找到的(上面日志第`37`行)**

再打开一个终端窗口，登录到Mongodb:

```bash
mongosh
```

然后修改`featureCompatibilityVersion`:

```bash
db.adminCommand( { setFeatureCompatibilityVersion: "7.0", confirm: true } )
> { ok: 1 }
```

修改成功后退出`mongosh`即可；\
然后到运行Mongodb的终端`Ctrl-C`停止数据库。

- 2、修改`featureCompatibilityVersion`至最新版本(可选) \
步骤与第一步相同，只不过需要下载`mongodb-macos-arm64-8.0.9.tgz`包，并调整`mongosh`指令的`setFeatureCompatibilityVersion`选项值为`8.0`。

- 3、验证问题是否解决 \
至此，问题应该已被解决，重新启动MongoDB服务：

```bash
brew services -d restart mongodb-community
```
