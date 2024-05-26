---
title: '2024, the year of the Linux Desktop'
description: 'Maybe its time to consider'
pubDate: 'Feb 6 2024'
heroImage: 'https://files.catbox.moe/bn190a.png'
---
Like most people, the first operating system I ever interacted with was Windows. I can also say that Windows has been my primary operating system for a majority of the time I've spent on a computer.

A few months back I decided to take a leap of faith and install EndeavourOS onto my secondary SSD. While Windows is still on my primary drive, for the past few months I've had very little reason to ever boot into it. For me, the Linux "ecosystem" has reached a point to where it can satisfy everything I need to do.

This isn't aimed to convince you to switch over to Linux (there are already thousands of videos that aim to do that), but rather for me to provide some thoughts on what use cases Linux already fulfills for me personally.

# Its Lightweight
I primarily use a laptop. When I get home I plug in my mouse, keyboard, charger, and monitor and then continue using it as a Desktop. One recurring issue I've had on Windows is battery life. I do have a gaming laptop, but even by that standard 1-2 hours of notetaking shouldn't result in draining 80% of my power.

I think the sheer amount of random garbage Windows ships with these days is horrendous. All the crazy forced telemetry background tasks, GameDVR, OneDrive, etc. Its just absolute insanity. Switching to Linux actually increased my battery life to around 3-4 hours, and my fans don't spin like crazy when idling on the Desktop.

You can probably find some tweaks or go through the process of debloating Windows, but why go through the effort of trying to figure out how to remove all these things if they just didn't exist to begin with.

# A Bootloader to the Web Browser
I think that a majority of computer owners treat their machines to some degree as a Google Chrome bootloader. So much of what we do these days is on the web and for good reason. Write your code once and have it work anywhere, need to update something? Just push the code to production and it'll update globally for all users.

There's a lot done through a web browser these days, whether it be watching videos, checking emails, or using social media. For many, there's very little reason to close out of the browser. In fact I'm sure that for a subset of those users if you were to install KDE and customize it to look like Windows, many of them wouldn't realize that they weren't on Windows anymore.

A majority of applications these days are also just all running a glorified web browser behind the scenes. Discord runs on Electron which runs on Chromium, Spotify runs on CEF which stands for Chromium Embedded Framework, VS Code is also an Electron app. You'll get the same experience out of these on whatever OS you're running.

# Gaming
Gaming was also one of my major concerns when switching over. Maybe 2-3 years ago I would've been much more unwilling to switch, but these days gaming on Linux has taken off like a rocket ship thanks largely in part to Valve's adoption of Arch on the Steam Deck.

As of writing this, 76% of the top 1000 games on Steam have achieved Platnium or Gold status in terms of compatability according to [ProtonDB](https://www.protondb.com/). Pretty much all the games I want to play on Steam are working very well if not better than if I had run them on Windows.

<img src="https://files.catbox.moe/6zqxhz.png">

There are also tools such as Lutris and Heroic Games Launcher that help you manage the task of installing games to make them compatible for Linux, its not any harder than if you had installed them through Windows.

One caveat for many though is Riot's Vanguard Anticheat which doesn't support Linux. This doesn't matter to me since I have no interest in any of Riot's online games and I also have some security concerns about having to continuously keep a kernel level anticheat open even when I'm not playing the game (if you aren't aware Riot requires you to reboot if you close the anticheat and want to play a game again).

# Its Confusing and Difficult to Navigate
I was under this perception too but I found that on a lot of the beginner friendly distros are just as user friend as Windows. I wouldn't go as far to say that you'll never have to interface with a command line (some things are just easier to do this way than navigating through a menu), but I certainly felt that 99.9% of the time on Linux Mint I was never obligated to open the terminal.

The desktop experience itself isn't a farcry from Windows either. In my current set up I daily drive KDE which has a window manager that mimics the experience on Windows.

If you want a crazy amount of customizability, a tiling window manager, and more you can do that. Everything in Linux can be customized, nearly all of the time there's very little reason to have to "work around" something UI related. I'd encourage you to go look into the art of "ricing" if you'd like to see the level of customizability some people have been able to achieve.

---

I won't even get into aspects for why programming itself is a nicer experience on Linux (even when WSL exists) since its a pretty fleshed out conversation on the internet (for me its for sure the excellent dependency management).

The point here isn't that Windows has no good features at all, I'm sure you can think of loads of things that Windows does an excellent job with (or else people wouldn't be using it). But perhaps this is the year you'll consider if your needs for an OS are actually better met elsewhere.