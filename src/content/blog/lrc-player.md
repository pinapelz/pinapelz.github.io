---
title: 'A LRC + YouTube TimedText Karaoke Player'
description: 'Might be useful to you?'
pubDate: 'Aug 15 2024'
heroImage: 'https://files.catbox.moe/hm76ek.png'
---

I'd like to share this cobbled together thing I've made a while back where you can play lyrics (LRC files), video, secondary audio, and YouTube SRV3 timed text all in 1 single player.

It all runs locally and nothing you play in it ever touches a server.

I recently wrote an about page for it so I've sort of lazily taken that and converted that mess of styled components into some nice markdown. I hope you find this tool useful.

https://lrc-karaoke-player.pages.dev/

## What is this player?

This player is capable of simultaneously playing back a lyric file (LRC), a main video/audio file, a SRV3 YouTube Timed Text, and a backing audio file.  
The idea is that this helps with not only karaoke but also checking how well a LRC or SRV3 file syncs with the main video/audio.

## How to use this player?

You'll need to prepare a few files for the media you want to play back first.  
Theoretically, you can mix/match any of the files below since the main video/audio is all that's mandatory for playback.  
In this guide, I'll assume that you're after a karaoke experience and want the works.

To add any files to the player, simply drag them onto the right part of the player page.  
**EVERYTHING IS RAN LOCALLY, NO FILES ARE EVER UPLOADED TO ANY SERVERS.**

## 1. Main video/audio file

**Note:** I've renamed the second button seen in the demos from Video to Media to avoid confusion since it can support audio/video files.

This is the file that you want to play back. It can be a video or an audio file.  
Supported formats: mp4, webm, ogg, mp3, wav, flac, and more.  
If you choose to use an audio file here, the right part of the player will not show a video preview.

A good way would be to download some video from YouTube. You may need to make adjustments to the offset later depending on how well the LRC files sync with the video.  
How you do that will be up to you, but I recommend using [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download the video.

## 2. Lyric File (LRC)

This is the file that contains the lyrics of the song you want to sing.  
An example LRC file is shown below...

```
[ti:CRUSH]
[al:CRUSH]
[ar:IVE]
[length: 03:29.49]
[00:00.11] La, la, la-la-la-la
[00:07.83] 瞳の奥 重なる eyes
[00:11.88] 今宵 二人を照らす moon
[00:16.06] Nine to five dreaming, これじゃまるで恋ね
[00:20.12] But the odds were high, 夢見たい気分?
[00:25.23] 待ってるだけじゃ何も始まんない
```

The player will highlight the current line of the lyrics as the main media progresses.

If you need a LRC file, a good way is to rip it from Spotify using [Syrics](https://github.com/akashrchandran/syrics).

At this point, you should already be able to play back the main media and have the lyrics highlighted as the media progresses.  
Depending on how well the LRC file syncs with the main media, you may need to adjust the main offset labeled as "Offset (±ms)".

<video controls width="100%">
    <source src="https://files.catbox.moe/mfaei6.mp4" type="video/mp4">
</video>

## 3. Instrumental/Vocals (Audio 2)

If you only wanted one or the other, simply add that as the main media then you're done.  
There are a ton of tools online to remove this, but you'll want to make sure you get the instrumental track in an audio format (mp3, wav, etc.).  
Then hover over the right side of the player, click the "Audio #2" button, and find your instrumental track.

(TIP!) I suggest going back and setting the main media in step 1 (Media button) in the previous step to a vocal-only video/audio.  
This will make it significantly easier to offset the 2 tracks. You can always mux a video file on top of that if you want visuals too!  
Ultimately it doesn't matter which "slot" the instrumental or "vocals" go into, it's just better to have them separated!

Now adjust the offset using the numerical inputs; the "Sync" button will adjust Audio 2 relative to the main media.  
I recommend positioning the playhead at 00:00 and then adding the secondary audio, this will make adjustments much easier.

Now you should be able to control the balance between both of these files (which one is louder) by using the slider!

## 4. YouTube Timed Text

If the YouTube video you downloaded has subtitles (sometimes they look really cool and fancy), you can download that using yt-dlp for use in the player as well.

Unfortunately, there is no way to adjust the offset for this; it'll play according to the main media.

<video controls  width="100%">
    <source src="https://files.catbox.moe/ir6bs3.mp4" type="video/mp4">
</video>
