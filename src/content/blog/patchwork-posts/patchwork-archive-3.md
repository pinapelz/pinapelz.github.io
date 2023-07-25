---
title: 'Archiving 8000 VTuber Songs and Music Covers (and counting) - Part 3: Storage and Serving'
description: "Let's talk storage and serving the content!"
pubDate: 'Jul 25 2023'
heroImage: 'https://files.pinapelz.com/pso2ngs-2232-collab.png'
---
At this point I already had around `230gb` worth of content (along with any metadata and thumbnails) saved, so the next step was to figure out how I was going to store and serve all this content.

## Storage and CDN
Hosting high quality videos aren't exactly cheap. For the uninitiated, when browsers play a video they are essentially downloading the video file in chunks from the server. That means data needs to transferred from wherever you're hosting the content, to a CDN, and then to the user.

There's normally a cost associated with this data transfer, and it's called egress. Egress is the cost of transferring data out of a cloud provider's network.

For example if I wanted to host 1 GB of 4K footage (which let's just say is roughly 3 mins in length at 50 Mbps) and 100 people watched it, I would be...

- Charged for storing 1 GB of data on some cloud storage provider
- Outbound data transfer of 1 GB * 100 people to the CDN = 100 GB of egress 
- Usage of the CDN to serve the content to 100 people (1 GB * 100 people) = 100 GB of CDN usage

*(Of course it's not always re-fetching from the origin server since the CDN caches content, but for illustrative purposes let's just say no data is ever cached)*

Not to mention that CDNs often have different pricing depending on where they need to deliver the content to. For example, [Bunny CDN](https://bunny.net/) charges $0.01 per GB of egress to North America and Europe, but $0.03 per GB of egress to Asia and Oceania. ([Source](https://bunny.net/pricing/))

So the cost of hosting and serving videos in particular add up pretty quickly...
### Setting a baseline
I decided to use `1TB` of storage as a benchmark value since if `230gb` of data was around 6000 videos, then `1TB` should be around 26000 videos (which would be more than enough to store all the content marked as music on Holodex). 

As for serving the content, I wanted to use a CDN to ensure that the content would be served as fast as possible to anyone who wanted to access it. So I'll set 100GB usage through a CDN as the baseline.



### Google Drive, OneDrive?
- I don't have a Google Workspace account set up, but Google One has an offer for 2 TB of storage for `CA$13.99/month` which is pretty decent (no 1 TB option available, but do the math and its `CA$7/month`).

![Google Drive Pricing](https://files.catbox.moe/f6grlv.png)

- OneDrive has an offer for 1 TB of storage for `CA$79/year` which is again also pretty reasonable. This comes out to be about `CA$6.58/month`.

The benefits of going this route is that it'd be pretty easy to set up and store the content. Plus I wouldn't need to worry about the costs of egress or serving the content through a CDN since that's all handled by these services.

```
Cost with Google One: `$7/month` for 1 TB of storage + `$0/month` for 100 GB of egress = $7/month
Cost with OneDrive: `$6.58/month` for 1 TB of storage + `$0/month` for 100 GB of egress = $6.58/month
- But questionable performance and potential rate limiting issues
```
#### Ultimately I decided against this for a few reasons:
- Potential rate limiting issues with downloading the content + the speed at which content loads on Ragtag (while it was on Google Drive) was questionable

- Organizing the content would be a pain since I find the APIs to be cumbersome to work with

- No clear upgrade path if I ever needed more storage. The next tier for Google One is 5 TB for `CA$35.99` and OneDrive's pricing outside a Microsoft 365 subscription is confusing to say the least.

### S3 Buckets
The next best option was finding a cloud storage provider that had an S3 compatible API. This would open up the possibility of using the plethora of S3 compatible tools to manage the data, and also allow me to seamlessly switch providers if I ever needed to.

#### Amazon S3
Of course we first have to set a baseline with the OG S3. Amazon S3 offers `$0.023` per GB for the first 50 TB of storage which comes out to be `$23/month` for 1 TB of storage. Egress is free for the first 100gb and then `$0.09` per GB which is pretty steep for my use case.

![AWS Storage Pricing](https://files.catbox.moe/xanv8c.png)

I know that I could've also gone for [AWS CloudFront](https://aws.amazon.com/cloudfront/pricing/) as my CDN and save the egress costs, but its still pretty expensive at `$0.085/GB` when serving to NA and EU.
```
Cost with CloudFront: `$23/month` for 1 TB of storage + `$8.50/month` for 100 GB of egress = $31.50/month
Cost without CloudFront: `$23/month` for 1 TB of storage + `$9/month` for 100 GB of egress = $32/month + CDN costs
- Expensive for this use case!
```
I think we can do better, so let's look at some other options.
#### Wasabi
The first provider I looked at was [Wasabi](https://wasabi.com/). They offer 1 TB of storage for `US$5.99/month` which is pretty good. Egress is also free.

Now that sounds pretty tempting at first, but there's a catch...

Wasabi (pay-as-you-go pricing) has a "*minimum storage policy*" where you're charged a fee for deleting data that has not been stored for **90 days**. This means that if you were to store a file for 15 days and then delete it, you'd be charged for 15 days of Active Storage + 75 days of Deleted Storage.

Now of course this wasn't a huge problem since I was planning on keeping the content up for a long time, but it was still something to consider.

#### Sample Analysis for 100TB of storage:
![Wasabi pricing vs AWS](https://knowledgebase.wasabi.com/hc/article_attachments/4418329927323/mceclip1.png)
[Source](https://knowledgebase.wasabi.com/hc/en-us/articles/360058734492-How-does-Wasabi-s-minimum-storage-duration-policy-work-)
#
The real dealbreaker for me was the fact they [no longer allow public access to buckets for new accounts](https://knowledgebase.wasabi.com/hc/en-us/articles/13615396482203-Change-in-Ability-to-configure-PUBLIC-Access-to-objects-and-buckets-?source=search). I'd have to use a pre-signed URL to access the content which is a [bit of a pain](https://knowledgebase.wasabi.com/hc/en-us/articles/360022853592).

So the pricing is actually perfect, but the effort required to set up and manage a system to serve the content would make everything far too complex for it to be worth it.

```
Cost with Wasabi: `$5.99/month` for 1 TB of storage + `$0/month` for 100 GB of egress = $5.99/month + CDN costs
- Minimum storage policy and no public access to buckets makes it overly complicated for this use case
- You'll be eating the CDN costs any time someone accesses/downloads the content
```

#### Backblaze B2
The next option I looked at was [Backblaze B2](https://www.backblaze.com/cloud-stroage/pricing). They offer 1 TB of storage for `$5/month` ($0.005/GB/Month) and egress is free for the first 1 GB and then `$0.01` per additional GB.

![Backblaze Pricing](https://files.catbox.moe/6tujle.png)

This was undoubtedly the most tempting option. My monthly cost would come out to be `$5.99` for 1 TB of storage and 100 GB of egress. Backblaze also partners with [Bunny](https://bunny.net/) for free egress to their CDN service which is a huge plus.

*(They actually also do this for Fastly and Cloudflare but the former is meant more for corporate use and the latter doesn't allow for videos to be hosted through their free CDN plan)*

Bunny's Volume network costs `$0.005/GB` for the first 500 TB of content served so I'd be looking at `$0.50` for 100 GB of egress.

```
Cost with Backblaze: `$5/month` for 1 TB of storage + `$0.50/month` for 100 GB of egress + CDN = $5.50/month
- Free egress only to partner CDNs
- You'll be eating the egress + CDN costs any time someone accesses/downloads the content
```

I probably would've gone for this option too if not for the next provider I looked at...

#### Cloudflare R2
[R2](https://developers.cloudflare.com/r2/pricing/) is quite new and offers storage at `$0.015gb/month` with no minimum storage policy and free egress. The big plus here is that storing on R2 means you get free usage of Cloudflare's CDN, even for large files and videos.

The domain I planned to host off of was already also using Cloudflare so this also meant that integration between the storage, CDN, and domain would be practically seamless.

Now I realize that this is nearly triple the cost of Backblaze, but the fact that I'd be free to egress and change providers any time at no cost; serve as much content as I wanted through the CDN; and not need to worry about minimum storage costs convinced me. 

(Plus keep in mind that 1 TB of storage is still a projection and I haven't actually used that much space yet).

```
Cost with Cloudflare: `$15/month` for 1 TB of storage + `$0/month` for 100 GB of egress + CDN = $15/month
- More expensive but highly flexible
```

## Serving the Content
Now that I had the storage sorted out, I uploaded all the content to R2 (and also set up an automatic upload script with rclone with the worker scripts) and then linked my domain with the R2 bucket.

```bash
rclone -P copy DIRECTORY_OF_CONTENT patchworkR2:BUCKET_NAME/PATH_TO_VIDEO_OR_METADATA_DIRECTORY
```

![Cloudflare R2 Setup](https://files.catbox.moe/dncig3.png)

...and theoretically that was it. I could now access all the content through `https://cdn.pinapelz.com` with a CDN and no egress costs.

![R2 Files screen](https://files.catbox.moe/tzos7u.png)

<video width="540" height="310" controls>
  <source src="https://cdn.pinapelz.com/VTuber Covers Archive/NXYhDgylxKU.webm" type="video/webm">
    Your browser does not support the video tag.
</video>

`花の塔(Flower Tower) - さユり // covered by 松永依織&七海うらら - 松永依織 / IORI MATSUNAGA`

Yep, looks good to me! The next part will be to bring it all together with a simple web ui and workflow.



