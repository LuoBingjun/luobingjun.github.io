---
title: Ubuntu 命令行和GUI程序开机自启动配置
date: 2019-04-08 21:23:36
tags: ubuntu
---

## 命令行自启动：rc.local
在Ubuntu 18.04中，默认是没有rc.local服务的，但我们可以手动安装rc-local服务，并将其指向/etc/rc.local文件，就可以一劳永逸，在rc.local中管理开机启动项了。

```
sudo vim /etc/systemd/system/rc-local.service
```

```
[Unit]
Description=/etc/rc.local Compatibility
ConditionPathExists=/etc/rc.local

[Service]
Type=forking
ExecStart=/etc/rc.local start
TimeoutSec=0
StandardOutput=tty
RemainAfterExit=yes
SysVStartPriority=99

[Install]
WantedBy=multi-user.target
```

```
sudo vim /etc/rc.local
```

```
#!/bin/sh 
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.
# echo "看到这行字，说明添加自启动脚本成功。" > /usr/local/test.log
# 在此处添加命令
exit 0
```

```
sudo chmod +x /etc/rc.local
sudo systemctl enable rc-local
sudo service rc-local start
sudo service rc-local status #查看rc-local服务状态和日志
```

## GUI自启动：autostart.sh.desktop
```
sudo vim /etc/autostart.sh
```

```
#!/bin/sh

# 在此处添加命令
exit 0
```

```
sudo chmod +x /etc/autostart.sh
sudo vim ~/.config/autostart/autostart.sh.desktop
```
