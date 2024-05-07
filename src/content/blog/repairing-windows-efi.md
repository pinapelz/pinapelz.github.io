---
title: 'Fix: Rebuild Windows EFI'
description: 'Rebuilding the Windows EFI partition, dual-boot with systemd-boot on a seperate drive'
pubDate: 'May 5 2024'
---

If I had a dollar for every time that I somehow overwrote or deleted the Windows EFI boot partiton while toying with something on Linux I'd have $3 (which isn't a lot but having it happen 3 times already is pretty annoying). If you ask some enthusiasts, this is secretly a blessing in disguise since you're technically one step closer to escaping the grasp of Microsoft. However like many others who choose to dual-boot, I prefer to keep my Windows installation around in case I need it for some specific use case.

I'm not the most well-versed when it comes to the whole Windows IT stuff, in fact I think most of my knowledge about how to even use the Windows shell has completely gone out the Window. This post serves as a quick guide for how to rebuild the EFI partition that contains the bootloader, as well as how to re-add the Windows to the systemd-boot menu.

# Diagnosis
Depending on the order in which you installed Windows and Linux, the location of where your EFI partition actually is may differ. On my setup, I have Windows on my first drive and Linux on my second. My EFI partition with my current bootloader lives on my second drive which persumably also included my Windows 11 bootloader.

So when I went and installed a different distro, this removed all my files associated about my previous install (since I basically reformatted everything), and among that of course was the Windows bootloader meaning I effectively had no way to boot back into Windows

Chances are that if you find that the Windows boot option is missing, you're in the same boat.

# Rebuild the EFI Partition
1. Flash the Live Media ISO to a USB
Use Balena Etcher or something similar to flash the Disk Image ISO to a USB drive.

2. Reboot into the Live USB
For some reason you have to press something (literately any key) on your keyboard after selecting to boot into the media, or else it'll just kick you back into the UEFI menu.

3. Select `Repair Your Computer` and `Advanced Options`. Launch the `Command Prompt`

Launch the diskpart utility
```
diskpart
```

Select the disk with Windows on it:
```
select disk X
```

It helps to list the disks and examine the partitions to differentiate between them.
Usually if there's 20gb or so Recovery/Reserved partition that'll be a pretty good indicator of the drive Windows was installed on
```
list disk
select disk X
list part
```

**Make sure you've selected the disk with Windows on it!**

4. Shrink a partition for the new EFI
I'd suggest shrinking the partition that holds your current Windows files. Usually it'll have the type `Primary`.

It'll look something like that's below
```
Partition ### Type     Size    Offset
------------- -------- ------- ------
Partition 1   Primary  200 GB   18 KB
Partition 2   Reserved 20 GB    17 KB
```

Select the partition you want to shrink from. (or don't if you have 500MB of freespace somehow)
```
select part X
```
Then shrink it
```
shrink desired=500
```

5. Create the EFI partition
The drive letter can be whatever you want, as long as its not already in use (Y is a good one)
```
create partition efi
format fs=fat32 quick
assign letter=Y
```

Exit diskpart with
```
exit
```

6. Install the bootloader
The drive letter below `Y` will be replaced with whatever letter you chose in the last step
```
bcdboot c:\Windows /s Y: /f ALL
```

Now reboot and see if you can get into Windows

# Re-add Windows to systemd-boot
Ok assuming you can get into Windows, we want to re-add the option for Windows into systemd-boot.

Go ahead and boot into Linux and locate the newly created EFI partition
```bash
lsblk -f
```
Look for something that's `vfat FAT32`
- If you are using an ASUS computer like me, ignore the `MYASUS` partition

There should be 1 on each drive, go ahead and note the names of these 2 down, as well as which one is for which OS
```
Example: (the name is the first column of the output)
nvme0n1p1
nvme1n1p1
```

1. Mount the EFI partitions
First create the mount points for both partitions
```bash
sudo mkdir /mnt/arch_efi
sudo mkdir /mnt/efi
```
You can name them whatever, but I'll use the name `arch_efi` for the Linux EFI partition and `efi` for the Windows partition

Mount both partitions
```bash
sudo mount /dev/your_drive_name_linux /mnt/arch_efi
sudo mount /dev/your_drive_name_windows /mnt/efi
```

2. Find the `Microsoft` folder in Windows EFI
You can also open Dolphin or whatever file manager as root if it helps

```bash
cd /mnt/efi
ls
```
There should be a folder named `EFI`, and inside it there should be a Microsoft folder

Once you have confirmed this, go ahead and copy this folder over to the EFI folder in `/mnt/arch_efi`

```bash
sudo cp -r /mnt/efi/EFI/Microsoft /mnt/arch_efi/EFI/
```

Unmount everything
```bash
sudo umount /mnt/efi
sudo umount /mnt/arch_efi
```

3. Update systemd-boot configuration
```bash
sudo bootctl update
```
This is usually done automatically though

Now go ahead and reboot and you should see the Windows option in systemd-boot again.





