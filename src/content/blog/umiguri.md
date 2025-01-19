---
title: 'An English Guide/Intro to UMIGURI, a CHUNITHM simulator'
description: 'What is CHUNITHM, What is UMIGURI, the state of playing CHUNITHM'
pubDate: 'Jan 18 2025'
heroImage: 'https://files.catbox.moe/amat6a.jpg'
---
### Table of Contents

1. **Background and What is CHUNITHM?**
   - [What is CHUNITHM?](#background-and-what-is-chunithm)
   - [We "Have CHUNITHM at Home" (kinda)](#we-have-chunithm-at-home-kinda)
   - [What are my choices?](#what-are-my-choices)

2. **UMIGURI**
   - [Introduction to UMIGURI](#umiguri)
   - [Controller and Controls](#controller-and-controls)
     - [Using a TASOLLER/Yubideck or other CHUNITHM-specific controller](#using-a-tasoller-yubideck-or-other-chunithm-specific-controller)
     - [Using a WIRELESS touchscreen device](#using-a-wireless-touchscreen-device)
     - [Using a WIRED connection to an iOS device](#using-a-wired-connection-to-an-ios-device)
   - [Navigating](#navigating)
     - [Keybinds](#keybinds)
   - [Getting Songs](#getting-songs)
   - [Directory Format](#directory-format)
   - [Charting](#charting)

3. **Customizations**
   - [LED Server](#led-server)
   - [Course](#course)
   - [Characters](#characters)
   - [Character Skills](#character-skills)
   - [Titles](#titles)
   - [Nameplates](#nameplates)
   - [Voices](#voices)
   - [3D Backgrounds](#3d-backgrounds)

# Background and What is CHUNITHM?

CHUNITHM is one of my favorite arcade rhythm games (and is my favorite out of SEGA's Geki-Chu-Mai trio). It's a lot like SEGA's mobile rhythm game Project Sekai, but with the added gimmick of an millimeter-wave sensor which requires you to lift your hand up and down to hit air notes.

<iframe width="560" height="315" src="https://www.youtube.com/embed/kIAqag8NQAc?si=3nySa0R-AnJgFnQD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The game itself is fairly easy to pick up, but still requires a lot of skill and practice to clear the harder songs.

## We "Have CHUNITHM at Home" (kinda)
However, here in the west we don't get a lot of CHUNITHM, like at all. The only way to legally play the latest version of CHUNITHM (as of writing this its VERSE) is to be in Japan and go to an arcade that has it.

Outside of Japan, the only legal way to play the game is to go to a Round1 USA location. 

Even when you do go however, you'll be sorely disappointed to find that the overseas version we get is both offline (no way to tap a card to save your progress or use any online functionalities), has an extremely limited songlist, and is also very outdated (PARADISE LOST which is 7 versions behind, released in Jan 2021).

If you're anywhere else then you're likely playing on an imported machine which may or may not be connected to a private server depending on how knowledgeable the operator is. As for how they get the update data, well, somethings are better left unanswered.

## What are my choices?
So if arcades outside of Japan are either non-existent or extremely limited, what are your options?

Well, one option is to go the illegal route and play a dump of the game on a PC (assuming you're able to find the data and get things working on your own hardware to begin with). The process itself requires a bit of technical know-how since there's currently no easy GUI to set things up, and you'll also need to connect to or host an ALL.Net server for the game to even allow you to get past the title screen.

<div style="text-align: center;">
<img src="https://files.catbox.moe/uddfr3.png"/>
<p>Map from Zenius showing all the CHUNITHM machines</p>
</div>

Another option is to play a simulator, meaning its not the actual game itself but a recreation of it. There are a few out there, however the most modern and arguably popular one right now is UMIGURI.

# UMIGURI
As mentioned, UMIGURI is a simulator for CHUNITHM. It's a free but closed-source program.

Official site: https://umgr.inonote.jp
Download: https://umgr.inonote.jp/download

Unfortunately, you'll notice that much of the site is in Japanese, don't worry though there is **some** English available in the actual program itself. You can set this up by launching the launcher -> clicking the 2nd option (Config) -> then setting UI Language at the bottom [(Guide](https://umgr.inonote.jp/help/#/disp-lang))

## Controller and Controls
The CHUNITHM controller itself is made up of 32 touch zones, and 6 air zones.

For the most part, the game can be played with just 16 zones.

In some of the higher difficulty charts there may be tap notes on top of hold notes which requires you to be both holding a key but also tap it at the same time

![CHUNITHM touch zones and air sensor layout diagram](https://files.catbox.moe/4qyexq.png)

Whatever your input method is, you'll need to get it mapped to keys on the keyboard. The default layout is as follows:

![UMIGURI Default Layout](https://files.catbox.moe/7n0zwc.png)

### Using a TASOLLER/Yubideck or other CHUNITHM specific controller
For CHUNITHM specific controllers, such as TASOLLERs, the best way to get them working with UMIGURI is to use a program called [slidershim](https://github.com/4yn/slidershim)

This will basically simplify all the annoying IO stuff that you'd neeed to do otherwise, it'll even handle making use of your LED lights on the controller itself.

The downside is these controllers typically cost a pretty penny. [Usually 300 USD or more](https://www.dj-dao.com/en/tasoller). There's always the option to build your own, but that's a whole other can of worms.

### Using a WIRELESS touchscreen device
[slidershim](https://github.com/4yn/slidershim), also provides a way to use a touchscreen to control the game over WiFi called Brokenithm (since you're playing broke CHUNITHM).

The setup itself is intuitive and all you need to do is select the option from the slidershim configuration tool and then connect to the IP address it provides on your phone (via a web browser).

As you will have quickly noticed, there is a big tradeoff here and its that you have no air-sensor. 

The alternative provided by Brokenithm is to instead slide your finger up towards the top of the screen which act as the air sensors.

<iframe width="560" height="315" src="https://www.youtube.com/embed/xhxCB26Jqf4?si=t1x6d3tpc07_rjwu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This actually works surprisingly alright for playing, and its much better than having nothing at all. The biggest downside however is that if there is any network congestion or large network activity (such as downloading a large file) then you will experience input latency.

### Using a WIRED connection to an iOS device
I built a personal solution to solve the latency issue. There is an existing project known as [Brokenithm-iOS](https://github.com/esterTion/Brokenithm-iOS) which uses a USB TCP connection to send touch events to a shared memory region on Windows.

I built a solution on top of this which taps into this shared region and converts them to keystrokes on the keyboard. While I was at it, I also added support for LED lights (more on this later).

More details can be found on the repository: [brokenithm-evolved-ios-umi](https://github.com/pinapelz/brokenithm-evolved-ios-umi)

## Navigating
The UI itself is fairly self explanatory if you've played CHUNITHM before. Its pretty much the same thing so I won't get into it (plus you'll probably pick it up after a few minutes of playing).

There also are some nice keybinds that you can also use

| Key             | Meaning                               |
|------------------|---------------------------------------|
| ← Left Arrow     | Return to the previous measure        |
| → Right Arrow    | Proceed to the next measure           |
| Shift + ← Left Arrow | Go back by 1 second                |
| Shift + → Right Arrow | Advance by 1 second               |
| ↑ Up Arrow       | Increase the note scroll speed by one step |
| ↓ Down Arrow     | Decrease the note scroll speed by one step |
| Shift + ↑ Up Arrow | Increase the playback speed by one step  |
| Shift + ↓ Down Arrow | Decrease the playback speed by one step  |
| Space            | Play / Pause                         |
| F3               | Toggle Auto Play                     |
| F5               | Reload the chart                     |
| F6               | Return to the first measure          |
| F9               | Return to the song selection screen  |
| F10              | Toggle judgment zone display         |

## Getting Songs
Now here's the real hard part. UMIGURI doesn't come with any songs, nor does it come with any stores/repositories to download songs from.

Similar to BMS, Sharing converts of CHUNITHM songs is frowned upon and charts are made by the community. The best place to start is on the UMIGURI Discord server, you can usually find the latest invite link on [@inonote's X](https://x.com/inonote).

Alternatively you can look on YouTube for charts, usually people who play UMIGURI charts will link the chart in the description and have "UMIGURI" in the title.

The charts from here will usually come in the form of a `.ugc` or `.mgxc` file. They may or may not come with the jacket/art or even the music file itself (yes, I know they really really play by the rules here).

If it doesn't then you'll have to source both files yourself. This basically means matching the chart to the timing of an audio file by hand, the jacket image can be whatever you want. I'd say its pretty annoying to do, and is usually only feasible if there exists some video footage of the chart being played (unless you get lucky on timing).

Here's a video showing the process of doing this

<iframe width="560" height="315" src="https://www.youtube.com/embed/TE7qEQBrCIE?si=C5CqWGyTHL7s8mDB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Umiguri can also play `.sus` files which is a format used by some older simulators like SeaUrchin and SUSPlayer. So charts from other indexes like [this one](https://w0a4t0a3ru.wixsite.com/uniokiba/%E8%AD%9C%E9%9D%A2%E7%BD%AE%E3%81%8D%E5%A0%B4-1) will work as well.

There's a nice tool online for converting Project Sekai charts to UMIGURI charts, [PjskSUSPatcher](https://qrael.github.io/PjskSUSPatcher/index.html). These are nice since they already come with the music file, jacket, as well as multiple difficulties.

One thing to note is that the patcher usually doesn't add the path to the audio file in the `.sus` file, so you'll need to do that yourself. You can do this by opening the `.sus` file in a text editor and changing the following lines:

```txt
#WAVE "<PATH TO AUDIO FILE WITH QUOTES>"
#WAVEOFFSET 0
#JACKET "jacket_s_003.png"
```
Additionally `WAVEOFFSET` is the offset from the start of the audio file to the first note in seconds (if you need to adjust it for some reason), and the `JACKET` line is the path to the jacket image.

More details about the `.sus` format is available [here](https://gist.github.com/waki285/dafa254a9de56ba43d177ae0913d4263)

## Directory Format
Once you have your charts you should put it in the UMIGURI directory in the following format:
```
UMIGURI.exe
data/
  music/
    <GENRE_NAME>/
        <SONG1_FOLDER>
            <file>.ugc/mgxc/sus
            <file>.mp3
            <file>.png
        <SONG2_FOLDER>
            <file>.ugc/mgxc/sus
            <file>.mp3
            <file>.png
``` 
The name of the outermost folder in `music` will be the genre name that appears in the game (basically a category). The other names don't really matter as long as your audio and jacket files are named correctly according to what it written in teh chart file. UMIGURI will automatically parse through all your charts during the game's startup.

## Charting
The tool for editing charts is called Margrete. You can grab it from the [same Download link as UMIGURI](https://umgr.inonote.jp/download). All the text however is in Japanese, so you'll need to rely on machine translations to get around it.

## Customizations
Here are some additional customizations you can make. If you want more details, machine translations of these pages will get you in the right direction. Then ask on the UMIGURI Discord server if you need help. These are technically all optional stuff, but they're nice to have.

-  LED Server
    - UMIGURI sends information about LED lights over websocket
    - [Specifications](https://gist.github.com/inonote/00251fed881a82c9df1e505eef1722bc), [SampleLEDServer](https://github.com/inonote/UmiguriSampleLedServer)
- [Course](https://umgr.inonote.jp/help/#/add-courses)
    - Configure through the Margrete editor (ツール > コース), then place the resulting file in `data/courses`
- [Characters](https://umgr.inonote.jp/help/#/add-chara)
    - You'll need to do some photo editing work that involves making a f
- [Character Skills](https://umgr.inonote.jp/help/#/add-skills)
    - Create a `.ucsl` file (UMIGURI Character Skill Language) and place it in `data/skills`
    - [Specifications](https://gist.github.com/inonote/d4f9a1ee84da849b5b8962db13d42220)
- [Titles](https://umgr.inonote.jp/help/#/add-titles)
    - Can be added in `data/titles/user.txt` or create a new file in the same folder for seperate title files
    - One title per line in the following format `TitleID<TAB>TitleColor(0-5)<TAB>TitleText`
- [Nameplates](https://umgr.inonote.jp/help/#/add-nameplates)
    - Involves creating a 576x228 image
    - Then create a file called `meta.txt` in the following format `Name<TAB><plate_name>`
    - Place both of these in a new folder named whatever, and move the folder to the game files like this: `data/nameplates/<folder_name>`
- [Voices](https://umgr.inonote.jp/help/#/add-sysvoices)
    - Involves creating the wave files listed, an image for the voice pack, and a `meta.txt` file
    - Place all 3 as specified into `data/voices/<folder_name>`
- [3D Backgrounds](https://umgr.inonote.jp/help/#/add-3dcgbg)
    - 3D backgrounds can be read if they are in the `glTF 2.0` (`.glb`) format
    - There must be a camera included in the scene
    - Place the `.glb` file in `data/player_scenes`
- [3D Scenes](https://umgr.inonote.jp/help/#/add-3dcgfield)
    - [Specifications](https://gist.github.com/inonote/4d100277f797b55581d4317ffb4f2ce0)
