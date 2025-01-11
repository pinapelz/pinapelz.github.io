---
title: 'Running Jagex Launcher and Runelite on Arch Linux'
description: 'How I got the Jagex Launcher and Runelite to work on Arch Linux'
pubDate: 'Oct 22 2023'
heroImage: 'https://files.catbox.moe/bpk2h8.png'
---
# Update
I highly reccomend you use Bolt, an unofficial launcher
https://github.com/Adamcake/Bolt

Sometime this year Jagex started incentivizing players to migrate their Runescape accounts to Jagex accounts. This was done by offering 20 additional bank slots to players who migrated. Me, being the sucker for free stuff that I am, decided to migrate my account not knowing that [Jagex Launcher does not and has no plans to support Linux](https://help.jagex.com/hc/en-gb/articles/13413514881937-Downloading-the-Jagex-Launcher-on-Linux).

This issue is not with the fact that the game itself doesn't launch, in fact the Runelite 3rd party client itself has great support for Linux, but the issue is that after migrating your account you are forced to use the Jagex Launcher to login/launch the game. And in case you haven't already caught on, there's no Linux support for this launcher.

I get that Linux is probably 0.1% of the playerbase, but it sort of sucks that they don't put up some warning or disclaimer that you won't be able to play the game on Linux after migrating. Its even more ridiculous that after you've already migrated, all they leave you with is links to Reddit posts and community run guides on how to get the game working on Linux (which I greatly appreciate, but would nevertheless prefer an official guide from Jagex).

## The Solution
Thanks to some work from the community, there's a relatively simple workaround to all this. The first thing to look into is [TomStorm's Jagex Launcher Install Script for Lutris](https://github.com/TormStorm/jagex-launcher-linux). All you need to do is download the script and choose `Install from a local install script` in Lutris, and then just follow the regular prompts you'd get when installing a game.

To be honest this gets you 90% of the way, and in fact for some people this might be all you need. However, I ran into some issues with installing this on Arch Linux. While the Jagex Launcher itself installed fine, clicking on the "Play" button for Runelite would do nothing.

The workaround I found was to download the Runelite AppImage from [the Runelite website](https://runelite.net/), extract the AppImage, and then copy the executables into where the script installed Runelite.

```bash
sudo chmod +x RuneLite.AppImage
./RuneLite.AppImage --appimage-extract
```

Then, you should get a `squashfs-root` folder. Copy the `Runlite` executable and `Runelite.jar` to `/home/USER/Games/jagex-launcher/drive_c/Program Files (x86)/Jagex Launcher/Games/RuneLite/` or wherever Jagex Launcher installed.

Inside the install directory there should also already be a `RuneLite.exe` file. We can create a symlink between this file and the jar file to trick the Jagex Launcher into thinking that the jar file is the Windows executable.

```bash
ln -s Runelite.jar Runelite.exe
```
Also try: `ln -s Runelite RuneLite.exe` if that doesn't work.

I should also note that I had some performance related issues when running this from Wayland, but it worked fine after switching back to X11. I can't exactly say why this is the case, I know that Wayland and Nvidia sometimes don't play nice with each other, but I'm not sure if that's the case here.

Now, when you click on the "Play" button for Runelite in the Jagex Launcher, it should launch the Runelite client. Have fun!

**EDIT: If you have issues with the audio, I was able to solve this by removing `pipewire-alsa` and changing to `pulseaudio-alsa`**
