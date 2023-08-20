# Foundation take home excercies

This repo contains my attempt for Foundation Medicals MP3 processing challenge.

## Overall

Overall this attempt has not gone too well. I think the problem is that I got too down-in-the-weeds with the correct specification for each frame header. This took a long time and I think there are still a few hard to flush out errors. My approach was to find the start of the data by looking at the ID3 header or lack thereof. For that point I could look at frame header and work out the frame length in bytes. I used this post (https://hydrogenaud.io/index.php/topic,32036.0.html) explaining how to work this out.

However, I don't know if this advice is incorrect, or if my implementation of getting the header info was incorrect. By this point I have spent a few hours (mainly on the header definition itself). I think I must have missed something because I don't think I could have completed this in anywhere near 2 hours.

I am happy to talk though design choices and improvements.

## Running

Run with

```
npm run start
```

Test with

```
npm run test
```
