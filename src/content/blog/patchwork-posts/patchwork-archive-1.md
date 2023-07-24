---
title: 'Archiving 8000 VTuber Songs and Music Covers (and counting) - Part 1: The Introduction'
description: 'VTubers, Archiving Content, and the Idea'
pubDate: 'Jul 23 2023'
heroImage: 'https://files.pinapelz.com/pso2ngs-2232-collab.png'
---
I recently started archiving all the songs and music covers of VTubers. I've been doing this for a couple of weeks now and, I've already archived over 8000 videos. This series of posts will be about the process of how I both archive and serve these videos. But first, let's start with some background information.

## Graduation
If you're familiar with the VTuber scene, then you probably have a mini-heart attack when you hear the "g word" alongside your [oshi's](https://www.urbandictionary.com/define.php?term=oshi) name. 

For those who aren't familiar, the term "VTuber" is short for "virtual YouTuber" (although it extends beyond the scope of YouTube), these are content creators who stream and create videos online using a virtual avatar/character. There are generally 2 types of VTubers, those affiliated with a company such as [Hololive](https://en.hololive.tv/) and those who are independent. 

When a VTuber decides to end all their activities and social media presence, the euphemism "graduation" is used to describe this. This could be for any given reason, perhaps they breached their contract; perhaps they've decided that this career no longer suits them; or perhaps they've gone on to do other things and no longer have the time to continue VTubing.

### They stop making content, so what?
While the content for independent VTubers typically remain visible on YouTube even after they've chosen to graduate, corporate VTubers will typically have their content privated/deleted following their graduation. 

Content corporate VTubers create typically belong to the company they are affiliated, and thus the company has the right to remove the content. However, this means that theoretically if a VTuber ends their career on bad terms with the company, the company could choose to remove all their branding and existence for the internet since they don't wish to be associated with them any more ([we saw this happen with Zaion LanZa and Nijisanji](https://twitter.com/NIJISANJI_World/status/1634147534795841536)). Even if they end on good terms, there's no explict guarantee that the content will remain up forever.

Independent VTubers also sometimes get recruited by companies and may be required to hide content created by their old personalities to better take on their new personas. This is done to avoid any associations with the company and the past/personal life of their talents but also to protect doxxing. There's really no telling if content will return or not should they choose to part ways with the company.

### The Honeymoon Phase
I'd say that we are in the "honeymoon phase". VTubing itself is still in its infancy and as of writing this is still a niche over here in the West. Companies like Hololive and Nijisanji constantly sign new talents and expand their reach globally. 

We saw a huge boom in the number of VTubers in 2020 following the success of the Hololive-EN branch showing that there indeed was a market for this sort of thing in the West. 

However, companies can't just continue signing new talents forever, it costs money to support them and at some point the number of new VTubers signed will need to stagnate. 

As we move out of this "honeymoon" signing phase and initial contracts expire, we'll see an increase in the number of VTubers graduate since this certainly isn't a profession for everyone.

## Archiving
Since VTuber content is in constant flux, it's up to the fans to archive the content they enjoy. Perhaps in the decades when VTubing inevitably dies out, the archives of this content will live on as a testament to the current era of the internet (It's interesting to think that there will be some future generation of people who will inevitably be studying the one we live in now). So for the sake of preservation, we should archive.

### Ragtag Archive
So recently there was some news regarding a virtual YouTuber (VTuber) archival project called [Ragtag Archive](https://archive.ragtag.moe/) shutting down. It's a project that involves automatically downloading the videos, metadata, comments, and live chat of the streams of various VTubers from YouTube. They have an interesting set up going where they have Workers (presumably some sort of AWS EC2-like compute unit) run a script which saves all the data to storage. 

As far as I can tell, they're pretty much the only people doing anything like this, and host the only copies of content in (public) existence for some graduated VTubers. 

The reason they were shutting down was because they were using Google Workspace's Unlimited Drive Storage which has recently come to an end. Seriously, they stored around 1.5 Petabytes of data on that thing. To the surprise of no one, once Google pulled the plug there was no place for the data to go. So that meant data deletion was inevitable.

However, they've since managed to revive the service thanks to the interest of some people on `r/Datahoarders` who have offered to help store and serve the data ([around 2 PB](https://twitter.com/kitsune_cw/status/1680071236683173888?s=20)). I'm quite happy about this as one of the most annoying thing about them previously hosting through Google was the CDN rate limiting which made it difficult to watch/download some of the more popular videos.

### Patchwork
I guess this incident gave me a bit of a scare. It put into place the idea that this sort of stuff doesn't stick around forever, and in all honesty, unless you own a copy of the content no one can guarantee you access to it forever. 

Now I obviously don't have 1.5 petabytes of storage equipment lying around (and let's not get into how much more I'd need for redundancy) so running my own full copy of Ragtag Archive is out of the question. 

However, since falling into the VTuber rabbit hole I've begun listening to more VTuber music covers and original songs. 

In fact, I even made [a small Java Swing application that helps download music covers as MP3s and tag them with metadata and artwork from the video ](https://github.com/pinapelz/ytmp3AutoTag). This gave me the idea to start archiving VTuber music since they're a relatively small subset of VTuber content, usually fairly high quality + effort, and also it's something I enjoy. And hey, since it's a smaller subset of content, it might even be feasible for me to host and serve a copy of it while I'm at it!

And that's how the idea of [Patchwork Archive](https://archive.pinapelz.moe/) (not at all similar to Ragtag Archive) came to be.