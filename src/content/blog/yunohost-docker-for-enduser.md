---
title: 'Yunohost, a Docker for end users? A possible future for self-hosting'
description: 'Is this what Web 3.0 is supposed to be like?'
pubDate: 'Aug 6 2023'
heroImage: 'https://files.catbox.moe/3w34mx.jpg'
---

Recently, I was looking to begin my foray into the Fediverse. After having a look at all the social media services that implemented ActivityPub, I decided to go with deploying a [Misskey](https://misskey-hub.net) instance. I'm a fairly regular user of Twitter/X and obviously being a weeb and open-source enthusiast I was pretty much drawn to it immediately.

I was originally going to deploy it on a VPS the "old-fashioned" way through installing all the dependency and build from source manually, but I noticed that they were offering the option to [deploy through something called Yunohost](https://misskey-hub.net/en/docs/install.html#using-yunohost).

This was the first time I heard of Yunohost, and at this point having played around with it for a bit I'm pretty impressed with with it and I think that it's a great step forward for self-hosting, the Fediverse, and even Web 3.0.

## What even is it?
I think the best way to describe Yunohost is as a self-hosting solution. It takes a collection of open-source software and packages them together in a way that makes it simple to deploy and manage. It's typically deployed as a Debian based OS image, but you can also install it on top of an existing Debian 11 install.

## Hardware
Even though the spirit of Yunohost is self-hosting the hardware, I've opted to deploy it onto a 2 vCPU 4GB RAM VPS on Digital Ocean (costs around $24/month). 

I think a lot of people would be looking into a setup similar to this. Even if you were to deploy on a Raspberry Pi (which slashes the entry cost and power consumption), you'd still be looking into having the require technical knowledge to set up/maintain the system and also deal with ISP sheanigans. Plus not having to deal with hardware means you can scale up/down as needed.

## YNH Packages
Having a look at the [extensive list of available packages](https://github.com/YunoHost-Apps), I was actually pleasently surprised with how simple they are. For most of Yunohost's applications, its just a matter of running a bash script that installs the dependencies and changes the necessary config files to get the application up and running.

In fact, after adding the necessary DNS records, it was pretty much just one click through the web interface to install whatever applicated I wanted.
![Example install screen](https://files.catbox.moe/jvc7vr.png)

With my hardware setup, I was able to install and run the following applications without any issues:
- Misskey Instance
- Navidrome (Spotfiy-like music streaming service)
- Gitea (Github like git server)
- Shell In A Box (Web based terminal)
- VSCode Server
- Minecraft Server
- FreshRSS (RSS reader)

and all that gets me to around 40% of CPU usage and 1.5GB of RAM usage. So still a bit of room for lee-way in terms of handling spikes in CPU usage.

![Usage graph](https://files.catbox.moe/ja6avq.png)

## User-friendliness
A massive part of why I think this is a great step forward for self-hosting is the fact that Yunohost is user-friendly. 

![Yunohost admin panel](https://files.catbox.moe/uqmbrd.png)
![Yunohost apps screen](https://files.catbox.moe/e9otsv.png)

It's a nice simple web interface that let's you manage your server and applications. Often times, we cry out for more people to self-host, but the reality is that most people don't have the technical knowledge to do so. Yeah its great that you've got your Plex server running on your home server, but what about your parents? Your grandparents? Your untechnical friends?

Aside from that user-management is also a breeze. You can create users and assign them to groups, and then assign those groups to applications. This means that you can have a group of users that can access your Misskey instance, and another group that can access your Gitea instance, and another group that can access both.

To top it all off, Yunohost also offers a SSO solution. This means that you can have a single account that can be used to log into all your Yunohost installed applications. This is a massive step forward in terms of user-friendliness.

![SSO Screen](https://files.catbox.moe/gkgne3.png)

## Upgradability
Obviously software evolves over time, and one of the major concerns I had (and still have to some degree) is upgrading the packages. Upgrading is just a click of a button for the end-user, but the trouble is that someone has to actually go through the process of changing the scripts within a package to ensure that everything works as intended.

This is currently primarily a community driven effort, with each package given its own Github repo. There's no guarantee that a package will be updated, and even if it is, there's no guarantee that it will be updated in a timely manner. Of course, you can always do it yourself, but is that really something that the average end-user would be able to do?

When a package gets abandoned, then what do we do? Yunohost offers no way for the end-user to change the repo attached to an installed application, so if the package is abandoned then the end-user will be stuck there indefinetly until manual intervention.

I've already actually had an issue with this. The Misskey package is still running version 12 while the latest verison is 13. This means that I'm missing out on some of the latest features. Fortunatly I don't think that the Misskey package is completely abandoned as it still ranked quite high on the integration scale Yunohost has for its packages, but regardless it's still a bit of a pain.

~~(if you'd like to check it out its over at [https://mk.moekyun.me](https:/mk.moekyun.me)~~

### An Example
I don't want to make it seem like all packages have install scripts that are overly complicated, the Minecraft server package is actually a fairly good example of how simple it can be to "revive a package". While the [main repo](https://github.com/YunoHost-Apps/minecraft_ynh/tree/master) seems to be abandoned, I was able to fork the repo, change version numbers, re-hash the sha256sum, and then install my fork through the web interface. [You can find that here](https://github.com/pinapelz/minecraft_ynh/commit/826137a0b4d049009c0523679903d35dcc411aac)

## Conclusion
The idea of Web 3.0 is that we're moving away from the current model of the web where we're reliant on a few big companies to provide us with services. Instead, we're moving towards a model where we're in control of our own data and we can choose who we want to share it with.

I think that Yunohost is a great step forward in terms of making self-hosting more accessible to the average person. It's not perfect, but it's a step in the right direction. If we want people to host their own services, then we need to make it as easy as possible for them to do so.
