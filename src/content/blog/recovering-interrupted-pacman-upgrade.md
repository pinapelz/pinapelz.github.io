---
title: 'Fix: Recovering from an interrupted pacman upgrade'
description: 'Fixing broken/corrupt packages due to an interrupted pacman upgrade'
pubDate: 'May 6 2024'
---

For those unaware `pacman` is the package manager used on Arch/Arch based Linux distributions. One of the dangers that plagues basically every computer out there is if your device crashes or the power cuts during a full-system upgrade. We all see of the warnings and dangers about not to power off your PC during updates on Windows, for the most part, Linux desktops are no exception to this.

Let's say in theory you run `pacman -Syu` to trigger a full-system upgrade. We get through the downloading phase fine as well as any necessary compilations, `pacman` removes the packages that are being upgraded from the system but our system crashes before everything is able to install.

Since our system crashed, `pacman` is unable to issue a rollback to restore the system to the previous state. When we power on the computer again we find a plethora of errors and perhaps we even find ourselve unable to boot into the desktop environment. This unfortunatly means you likely find yourself in a mess of corrupted/broken packages.

Not all hope is lost, before you go backing up files and doing a clean re-install, its very likely you're able to recover your system through `chroot`.

# Chroot
We'll obviously need a terminal or some sort of shell to fix the problem, but how can we get one when our system can't even boot.

`chroot`, short for change root, is a command that allows us to change the root directory of some process to a different one. Since the rest of your system is (most likely) intact, we can "chroot" into our system and fix these broken/corrupted packages.

Lucky for us, since Linux distros can generally run off of a Live-USB environment, all we have to do is boot into Arch from a USB and perform our necessary operations.

# Steps
1. Boot into Live USB environment and mount drives

Once you've booted into the Live-USB, I reccomend getting Ethernet hooked up. Sometimes there can be corrupted packages left in the `.cache`, so those need to be redownloaded. You can use WiFi, but sometimes there are issues with connecting via Live USB.

Identify the drive/partition with your OS installed (where the root directory is) and mount it
```bash
lsblk -f
sudo mkdir /mnt
sudo mount /dev/nvme0n1p1
```
Replace `nvme0n1p1` with the name of your partition.

2. Chroot
```bash
sudo arch-chroot /mnt
```

and now every command we run will be like as if we were actually on the broken system.

3. Re-install all packages

Pacman actually maintains a database of what packages it has installed. So we can pipe this information into another pacman command to ask it to re-install everything.

You could also triage the broken packages by verifying the checksum of each one and then individually uninstalling or re-installing it, but I think for the most part its far easier to just ask it to re-install everything (also dependency issues really mess this up)

```bash
pacman -Qqn | pacman -S --overwrite '*'
```

Be warned as `--overwrite` will replace any conflicting files. If you're worried about config files, if the developers were following proper conventions then this shouldn't affect the configs in your `.config` folder.


At this point, you should have recovered your system.

Note: This post will be continuously updated