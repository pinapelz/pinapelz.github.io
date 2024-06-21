---
title: 'A Comparison: Kernel-level Virtual Machine Part 1'
description: 'A comparison of the options for running Windows software'
pubDate: 'Jun 21 2024'
---

One recurring issue with modern day software is being incompatible with Linux. While the best solution is to either push companies to support the Linux platform or find alternatives to the software, sometimes that simply isn't possible. A solution I've found that satisfies all my needs (both gaming and productivity) is running a KVM with PCI pass through (VFIO).

# The Other Options
But before all that, Below are some of the other options that you may want to consider before setting up a KVM.

## Virtual Machine
A good but generally resource intensive option since you're technically emulating an entire system. I won't get into this option since setting up a VM using something like Virtualbox or VMware is pretty standard.

## Compatability Layers
At a high level, compatability layers will map the "syscalls" from binaries of some other system to the native ones. This means that programs compiled for a different operating system will run just fine (assuming that all required calls have been handled). This means that its much less resource intensive than running a VM, since its more of a "handle the syscalls as its needed" basis.

While compatability layers for Windows software, such as Wine, exist on Linux; these systems are far from being feature complete and often times do not replicate the experience perfectly. However, its always a good idea to check if your non-compatible software will run using this method since its probably both the easiest and the most convenient.

## Dual Boot
Another option that many people opt for is to "dual boot", allocating room for 2 operating systems on the same machine. This will let you keep both operating systems seperate to an extent, while still maintaining a Windows system running on bare metal without any of the "funny business" above.

If you need to deal with thing such as game anti-cheats that dive deeply into the kernel level, this is probably the ideal method since you're pretty much just running an ordinary Windows machine.

But paritioning and managing the storage for both Linux and Windows at the same time is quite annoying. Problems arise when trying to expand or shrink partitions. It can be a real pain to move partitions around to allow for expansion or shrinkage. Then on top of all that you run the risk of either system somehow destroying the boot process of the other (as commonly documented online).

To simply put it, you miss out on the flexibility of the other two options above.

# Kernel-based Virtual Machine (KVM)
KVMs are a solution I've found that tackles pretty much all of the problems above. Since its a "type-1 hypervisor", all OS level components such as memory management or I/O is implemented as some Linux process. This means that all the resouces your Linux machine has will be made available to the VM and it'll be like you're running on bare-metal. This gets you performance that far surpasses a traditional type-2 VM, and it comes very close to what you would've gotten running on bare metal.

Additionally, its flexible since you can store the VM's disk as a single qcow2 file (or allocate actual space on the SSD). Paritioning and resizing becomes much easier and you won't need to run the risk of accidentally wiping Windows' EFI partition.

Finally, it'll also get you the compatability that Wine lacks since you're running the actual OS.


