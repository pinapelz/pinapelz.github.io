---
title: "Is xQc's AMD CPU holding him back from taking back the Minecraft record"
description: "Exploring if xQc's claims of statistical \"ANNA MOLLIES\" hold up at all..."
pubDate: 'May 21 2025'
---

For many years now the "juicer" (xQc) and the "homeless man" (Forsen) have been at arms at each other when it comes to who can achieve the faster time in random seed Minecraft speed running. As of writing this, the homeless man holds the record with an in-game time of 15min 28s.

The juicer has just recently gotten back into the runs, however in several of his recent streams he constantly complains of the game generating systematically bad seeds for speed running for him to a point where its become a "statistical anomaly". xQc has blamed this on his relatively-new PC's `AMD Ryzen 9 9950X3D` CPU having a bias and generating difficult to run seeds (such as constantly giving his Basalt biomes on Nether entires, buried treasure with a singular iron-ingot, and difficult to navigate structures)

<iframe src="https://clips.twitch.tv/embed?clip=VibrantCleverDunlinDuDudu-yUuKNt8QeLLXTzR6&parent=blog.pinapelz.com" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>

As a juicer myself, I felt the need to investigate these claims to see if there is actually any truth to them.

# Java Edition
First its important to note that we are working with Java edition 1.16.1 here. xQc also runs several mods that aid with speedrunning (such as seedqueue) however none of these alter the core behaviors of the game (including world generation).

Although Minecraft itself is not open-source, because the game is written in Java it becomes trivial to decompile it. Projects such as [MCP](https://github.com/Hexeption/MCP-Reborn) have very well documented processes for how to do so.

As such, even if we don't have the exact same source code, examining behaviors such as seed generation is simple as we don't even need to get the source to re-compile.

# World Generation
The first thing we need to understand is that for the same version of the game, inputting the same seed will create the exact same world. This means same terrain, location of structures, and even the loot inside chests. All of the "randomness" is derived from a singular value known as a the "world/level seed". So regardless of what CPU you have, the same seed will always generate the same world.

The object that stores these random values for world generation is stored in a file called `SharedSeedRandom.java`. We can see several references and calls to fetch values from this class in key world generation features such as `BastionRemantsStructure.java` and `FortressStructure.java`.

However, the first thing to notice is that even this file requires some sort of "base seed" to be passed in. Tracing a backwards a bit more, we find that the game first stores the level seed is actually stored as a setting first in `DimensionGeneratorSettings.java`.

It is here that we find the function that generates seeds, on the particular decompilation I'm looking at this is marked as `func_242751_a` (it has a funky name because it hasn't been labelled or named yet).
```java
// DimensionGeneratorSettings.java
public static DimensionGeneratorSettings func_242751_a(Registry<DimensionType> p_242751_0_, Registry<Biome> p_242751_1_, Registry<DimensionSettings> p_242751_2_)
{
    long i = (new Random()).nextLong();
    return new DimensionGeneratorSettings(i, true, false, func_242749_a(p_242751_0_, DimensionType.getDefaultSimpleRegistry(p_242751_0_, p_242751_1_, p_242751_2_, i), func_242750_a(p_242751_1_, p_242751_2_, i)));
}
```
A long is can be though of essentially as a 64-bit number in this particular context.

This static helper function builds a `DimensionGeneratorSettings` object, we see that on the first line of this function it generates a new random long number using the built-in Java Random object from `java.util.Random`. But we can't be 100% sure that this is actually the seed, so let's follow the constructor for `DimensionGeneratorSettings` and see what this first value is used for.

```java
// DimensionGeneratorSettings.java
public DimensionGeneratorSettings(long seed, boolean generateFeatures, boolean bonusChest, SimpleRegistry<Dimension> p_i231914_5_)
{
    this(seed, generateFeatures, bonusChest, p_i231914_5_, Optional.empty());
    Dimension dimension = p_i231914_5_.getValueForKey(Dimension.OVERWORLD);

    if (dimension == null)
    {
        throw new IllegalStateException("Overworld settings missing");
    }
}

private DimensionGeneratorSettings(long seed, boolean generateFeatures, boolean bonusChest, SimpleRegistry<Dimension> p_i231915_5_, Optional<String> p_i231915_6_)
{
    this.seed = seed;
    this.generateFeatures = generateFeatures;
    this.bonusChest = bonusChest;
    this.field_236208_h_ = p_i231915_5_;
    this.field_236209_i_ = p_i231915_6_;
}
```

Luckily for us, this value has already been labelled. `func_242751_a` calls the bottom "private constructor" for `DimensionGeneratorSettings` since the arguments provided match up with that one. Regardless, both of the constructors have `long seed` as the first parameter which confirms our suspicions that this indeed is the function which chooses a random seed.

# How does `Random` work

`java.util.Random` is apart of the Java Standard Library, as such there are very tight and strict specifications for how the logic works. This means that across nearly all versions of compliant Java Virtual Machines, we can expect the logic to work the same way to avoid breaking compatability.

So looking through the source code for OpenJDK we see the following logic is used for the `nextLong` function.
```java
//Random.java
@Override
public long nextLong() {
    // it's okay that the bottom word remains signed.
    return ((long)(next(32)) << 32) + next(32);
}
```

Then zooming into the `next()` method...

```java
//Random.java
protected int next(int bits) {
    long oldseed, nextseed;
    AtomicLong seed = this.seed;
    do {
        oldseed = seed.get();
        nextseed = (oldseed * multiplier + addend) & mask;
    } while (!seed.compareAndSet(oldseed, nextseed));
    return (int)(nextseed >>> (48 - bits));
}
```

Interesting, we see that even here a seed is being used to generate some number of bits. Lets see where the `Random` object gets the seed from anyways, because if you recall from what we see above, there certainly wasn't any sort of value passed to the Random object.

```java
//Random.java
public Random() {
    this(seedUniquifier() ^ System.nanoTime());
}

private static long seedUniquifier() {
    // L'Ecuyer, "Tables of Linear Congruential Generators of
    // Different Sizes and Good Lattice Structure", 1999
    for (;;) {
        long current = seedUniquifier.get();
        long next = current * 1181783497276652981L;
        if (seedUniquifier.compareAndSet(current, next))
            return next;
    }
}

@SuppressWarnings("this-escape")
public Random(long seed) {
    if (getClass() == Random.class)
        this.seed = new AtomicLong(initialScramble(seed));
    else {
        // subclass might have overridden setSeed
        this.seed = new AtomicLong();
        setSeed(seed);
    }
}
```

Aha! We see here that when there is no seed generated, the seed is based on `System.nanoTime()` and scrambled by some constant value generated by `seedUniquifier`.

If we take a look at Oracle's description for what the `nanoTime()` function does:

>`public static long nanoTime()`
>
>Returns the current value of the running Java Virtual Machine's high-resolution time source, in nanoseconds.
>This method can only be used to measure elapsed time and is not related to any other notion of system or wall-clock time. The value returned represents nanoseconds since some fixed but arbitrary origin time (perhaps in the future, so values may be negative). The same origin is used by all invocations of this method in an instance of a Java virtual machine; other virtual machine instances are likely to use a different origin.
>
>This method provides nanosecond precision, but not necessarily nanosecond resolution (that is, how frequently the value changes) - no guarantees are made except that the resolution is at least as good as that of currentTimeMillis().
>
>Differences in successive calls that span greater than approximately 292 years (263 nanoseconds) will not correctly compute elapsed time due to numerical overflow.

So this is essentially a very precise counter/timer that counts upwards...

# Conclusion
The conclusion to be gained here is that seed generation has **pretty much nothing to do with the CPU at all**. Minecraft's random seed selection does not make use of the CPU's hardware random number generation instructions at all. In fact due to the nature of how the random number is chosen in combination with Minecraft's own generation algorithms, even generating a seed a a singular millisecond apart leads to vastly different worlds from being generated.

Now it is a possibility that Mr.Cow's CPU's `TSC` (Time Stamp Counter) which is in charge of measuring change in time has gone haywire, but this is extremely extremely unlikely as this module is used for things such as CPU core synchronization and he would've already experienced larger breaking changes in not just Minecraft but probably his whole PC.

Is it still possible for xQc to get these repeated "anamolous seeds" constantly? Well statistically, nothing is ever impossible. Although blaming it on his AMD CPU is a largely unfounded claim. Get good, lock in.

<img src="https://files.catbox.moe/dcnga8.png" width=10% />
