---
title: "FFXIV - Frontline PVP Losing Bonus"
description: "Some documentation about how the Frontline losing bonus actually works"
pubDate: "2024-09-12"
---
I'd like to document exactly how the Frontline PVP losing bonus works in Final Fantasy XIV. There's a vast amount of uncertainity online about how
rewards are handed out in Frontline. I believe that a vast majority of players don't even know such a bonus exists, the remaining people who know about the bonus aren't exactly able to explain it or chalk it up to seemingly random things (such as how long the PVP match takes).

First, I'll share with you what is officially posted on the [Lodestone](https://na.finalfantasyxiv.com/lodestone/playguide/contentsguide/frontline/):
> * In the event that your affiliated team previously ranked third, PvP EXP, Series EXP, and Wolf Marks earned will be increased by 10% for each subsequent third-place ranking, up to a maximum of 50%. This bonus will carry over to the next match upon ranking second, and be reset entirely upon ranking first.

I'll use Series EXP as the measured value here, but do note that the same bonus applies to Wolf Marks and PVP EXP.
- First Place: 1500 EXP
- Second Place: 1250 EXP
- Third Place: 1000 EXP

These are the guaranteed base rewards.

Let's define an imaginary variable that tracks the number of times you've consecutively placed 3rd in Frontline matches. Let's also imagine
that this value starts at 0.
```
var consecutiveThirds = 0
```

For the buff to begin, `consecutiveThirds` must equal `2`.

For everytime you place 3rd in a Frontline match, this counter will increase by `1`. Placing 2nd **DOES NOT** reset the counter, but placing 3rd **will reset the counter**.

This means that when `consecutiveThirds = 1`, you can place 2nd n-times and not have this counter reset.

# On Reward Bonus
Once you lose that 2nd game, your reward bonus becomes 10%. This reward bonus also applies to the game in which you earn it on.

This means if you played a match, place 3rd, and `consecutiveThirds = 1`, then on that very match your rewards will be increased by 10% (and you get to keep the buff for the next game).


Similarly, if you have a buff already active and place 3rd again, your buff increases again, and this new increased reward bonus also applies to the current match.


If you place 2nd and have a reward bonus active, you **DO NOT LOSE IT**. You get rewarded according to the bonus percentage you have currently obtained
and get to keep it for the next match.

The only case you lose the buff is if you place 1st. Even if you lose your buff, you'll still get whatever reward bonus you've accumulated for that particular match before the buff resets to 0.

This loop keeps repeating until you hit 50%. Then the reward bonus will no longer increase. You'll still keep the buff until you place 1st though.



Let's seen an example of everything above in action:
- Match 1: Place 3rd (`consecutiveThirds = 1`, `bonus = 0%`), awarded 1000 EXP
- Match 2: Place 2nd (`consecutiveThirds = 1`, `bonus = 0%`), awarded 1250 EXP
- Match 3: Place 3rd (`consecutiveThirds = 2`, `bonus = 10%`) awarded 1100 EXP
- Match 4: Place 3rd (`consecutiveThirds = 3`, `bonus = 20%`) awarded 1200 EXP
- Match 5: Place 1st (`consecutiveThirds = 0`, `bonus = 20%`) awarded 1800 EXP
- Match 5: Place 1st (`consecutiveThirds = 0`, `bonus = 0%`) awarded 1500 EXP
