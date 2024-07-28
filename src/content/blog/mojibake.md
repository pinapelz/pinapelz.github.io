---
title: 'Japanese Mojibake - L�ss �f D�t�'
description: 'Some encoding errors can result in loss of data'
pubDate: 'May 6 2024'
---
For the uninitiated, "mojibake" is the garbled text you see as a result of *encoding errors*. In the age of digital communication, bytes are sent across the globe in the blink of an eye. Different encoding and decoding schemes are used to interpret these bytes into human-readable text. 

Below is an example of the word "Hello World" encoded in UTF-8 and then decoded in hexadecimal form:
```
\x48\x65\x6c\x6c\x6f\x20\x57\x6f\x72\x6c\x64
```

When data is encoded using one scheme and decoded using another, the result is often mojibake (especially when it comes to non-ASCII characters).

Different schemes were developed in the first place to accommodate different languages and scripts. ASCII, for example, is a 7-bit encoding scheme that can represent 128 characters. This was fine for English, but not so much for other languages.

These days we have more universal encoding schemes like UTF-8, which can represent every character in the Unicode standard.

# The Problem
There are still many legacy programs and systems that use older encoding schemes. When data is passed between systems that use different encoding schemes, the result can be mojibake.

If you have a sequence of bytes that were encoded using one scheme and then try to decode it assuming its another scheme, you'll get mojibake. 

*Examples from [A Field Guide to Japanese Mojibake](https://www.dampfkraft.com/mojibake-field-guide.html])*


Let's take the following sentence as an example

>東京タワーの高さは333mです。


A larger problem arises when you try to convert mojibake back to its original form. Sometimes the original data is lost in the process of encoding and decoding. This is especially true when the original encoding scheme doesn't have a one-to-one/injective mapping with the target scheme.

And in some cases if the sequence of bytes aren't actually valid in the target encoding, it will usually get replaced with the NULL character (�) making that data lost for good.
