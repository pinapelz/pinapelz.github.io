---
title: 'Entering the Gilded Araya Early, FFXIV Server Emulation'
description: 'Lets take a look at the state of FFXIV server emulation and walk around the new unreleased trial instance'
pubDate: 'Aug 12 2023'
heroImage: 'https://files.pinapelz.com/astralagos.png'
---

Every once in a while I think back to Final Fantasy XIV's producer's [statement following the outrage regarding using 3rd party plugins](https://na.finalfantasyxiv.com/lodestone/topics/detail/36c4d699763603fadd2e61482b0c5d56cb2e4547) to clear Dragonsong's Repirse (Ultimate). Ultimates are designed to be the hardest difficulty of raid content in the game, and as such often times "Race to World First" events are held to see which group of players can clear the content first.

While there's usually always some controversy surrounding players using damage meters and triggers, interestingly this post was the one time where Yoshi-P (the producer of FFXIV) addressed the use of server emulation.

<p align="center">
<img src="https://files.catbox.moe/406tgu.png" alt="Server Emulation statemnt from Yoshi-P"/>
<br>
 Yoshi-P's statement on server emulation from the <a href=https://na.finalfantasyxiv.com/lodestone/topics/detail/36c4d699763603fadd2e61482b0c5d56cb2e4547>Lodestone post</a>
</p>

There's quite a lot to unpack here so lets break down the current state of FFXIV server emulation and see what is and isn't possible.

### Quick Note
To my knowledge, there is only one server emulator project for FFXIV that is active and that would be [Sapphire](https://github.com/SapphireServer/Sapphire). As such, this post will be focusing on Sapphire and its capabilities.

> FFXIV is run by a variety of independent programs operating on a multitude of specialized servers, so to completely emulate its server environment outside our infrastructure is impossible

Like most MMOs, FFXIV is split into 2 main components: the client and the server. To put it briefly...

- The client is responsible for rendering the game and sending user input to the server

- The server is responsible for handling the game logic and then relating that information to be rendered by the client.

One good example of this dynamic is questing, when you go to accept a quest from an NPC, the client will send a packet to the server saying "Hey, I want to accept this quest" and the server will then respond with "Okay, you've accepted the quest". The client will then render the quest in your quest log.

![Questing server to client diagram](https://files.catbox.moe/4wp77c.png)

All the data pretaining to quest text, textures, and interactions are stored on the client side. The only thing the server needs to handle is recording the state of the quest (accepted, completed, what step you're on, etc) and telling the client what actions should occur based on that state.

Let's tak a look at sidequest `SubSea007` (A Thousand Words) as an example.

First looking at the client side we have access to the EXH (Excel Header) files which contain all the dialogue and quest descriptions.
<details>
    <summary><b>subsea007_00117.exh_en.csv</b></summary>


    Index	0 [0x0][0x0]	1 [0x0][0x4]
    0	TEXT_SUBSEA007_00117_SEQ_00	Latisha needs someone to report a bilking patron.
    1	TEXT_SUBSEA007_00117_SEQ_01	A first-time patron has left without settling his bill, and Latisha wants you to report the incident to the Yellowjackets. First, speak with R'sushmo and receive her sketch of the criminal.
    2	TEXT_SUBSEA007_00117_SEQ_02	A visibly shaken R'sushmo entrusts you with her rendition of the offender. Deliver it to Godebert at the Coral Tower.
    3	TEXT_SUBSEA007_00117_SEQ_03	Unfortunately, the artist's rendition alone will not suffice to identify the offender. Instead, Godebert bids you tell R'sushmo to present herself at the Coral Tower for questioning.
    4	TEXT_SUBSEA007_00117_SEQ_04	R'sushmo cannot comprehend what the problem is with her handiwork. You do not have the heart to tell her the truth.
    5	TEXT_SUBSEA007_00117_SEQ_05	dummy
    6	TEXT_SUBSEA007_00117_SEQ_06	dummy
    7	TEXT_SUBSEA007_00117_SEQ_07	dummy
    8	TEXT_SUBSEA007_00117_SEQ_08	dummy
    9	TEXT_SUBSEA007_00117_SEQ_09	dummy
    10	TEXT_SUBSEA007_00117_SEQ_10	dummy
    11	TEXT_SUBSEA007_00117_SEQ_11	dummy
    12	TEXT_SUBSEA007_00117_SEQ_12	dummy
    13	TEXT_SUBSEA007_00117_SEQ_13	dummy
    14	TEXT_SUBSEA007_00117_SEQ_14	dummy
    15	TEXT_SUBSEA007_00117_SEQ_15	dummy
    16	TEXT_SUBSEA007_00117_SEQ_16	dummy
    17	TEXT_SUBSEA007_00117_SEQ_17	dummy
    18	TEXT_SUBSEA007_00117_SEQ_18	dummy
    19	TEXT_SUBSEA007_00117_SEQ_19	dummy
    20	TEXT_SUBSEA007_00117_SEQ_20	dummy
    21	TEXT_SUBSEA007_00117_SEQ_21	dummy
    22	TEXT_SUBSEA007_00117_SEQ_22	dummy
    23	TEXT_SUBSEA007_00117_SEQ_23	dummy
    24	TEXT_SUBSEA007_00117_TODO_00	Receive R'sushmo's artist's rendition.
    25	TEXT_SUBSEA007_00117_TODO_01	Deliver the artist's rendition to Godebert at the Coral Tower.
    26	TEXT_SUBSEA007_00117_TODO_02	Speak with R'sushmo.
    27	TEXT_SUBSEA007_00117_TODO_03	dummy
    28	TEXT_SUBSEA007_00117_TODO_04	dummy
    29	TEXT_SUBSEA007_00117_TODO_05	dummy
    30	TEXT_SUBSEA007_00117_TODO_06	dummy
    31	TEXT_SUBSEA007_00117_TODO_07	dummy
    32	TEXT_SUBSEA007_00117_TODO_08	dummy
    33	TEXT_SUBSEA007_00117_TODO_09	dummy
    34	TEXT_SUBSEA007_00117_TODO_10	dummy
    35	TEXT_SUBSEA007_00117_TODO_11	dummy
    36	TEXT_SUBSEA007_00117_TODO_12	dummy
    37	TEXT_SUBSEA007_00117_TODO_13	dummy
    38	TEXT_SUBSEA007_00117_TODO_14	dummy
    39	TEXT_SUBSEA007_00117_TODO_15	dummy
    40	TEXT_SUBSEA007_00117_TODO_16	dummy
    41	TEXT_SUBSEA007_00117_TODO_17	dummy
    42	TEXT_SUBSEA007_00117_TODO_18	dummy
    43	TEXT_SUBSEA007_00117_TODO_19	dummy
    44	TEXT_SUBSEA007_00117_TODO_20	dummy
    45	TEXT_SUBSEA007_00117_TODO_21	dummy
    46	TEXT_SUBSEA007_00117_TODO_22	dummy
    47	TEXT_SUBSEA007_00117_TODO_23	dummy
    48	TEXT_SUBSEA007_00117_LATISHA_000_0	We spare no effort to ensure that all our patrons enjoy the finest food and hospitality. And so it is doubly hurtful when someone decides to leave without settling the bill. Nary a bell ago, a first-time patron did just that.
    49	TEXT_SUBSEA007_00117_LATISHA_000_1	R'sushmo is the one who lovingly prepared the man's meal. She is quite upset by the whole affair, and has taken it upon herself to draw an illustration of the offender. Might I trouble you to deliver it to the Yellowjackets on our behalf? R'sushmo should be done adding the finishing touches by now.
    50	TEXT_SUBSEA007_00117_RSUSHMO_000_10	Grrr... I poured my heart and soul into that grilled dodo... If I ever get my hands on that scoundrel, I'll grind his bones to make my bread!
    51	TEXT_SUBSEA007_00117_RSUSHMO_000_11	Here it is, my rendition of the criminal! Please deliver it to Godebert at the Coral Towerâ”€he will know what to do!
    52	TEXT_SUBSEA007_00117_TALK_SCENE00003_000	Textless
    53	TEXT_SUBSEA007_00117_GODEBERT_000_20	A bilker at the Bismarck, and you have an artist's rendition of the man?
    54	TEXT_SUBSEA007_00117_GODEBERT_000_21	Er...what in the seven hells is this supposed to be? It looks more like the prow of a ship than a man's face!
    55	TEXT_SUBSEA007_00117_GODEBERT_000_22	Look, we would like nothing more than to bring the offender to justiceâ”€'tis our duty, after all. However, we will need a little bit more to go on than this piece of...art.
    56	TEXT_SUBSEA007_00117_GODEBERT_000_23	It would be easiest for all involved if R'sushmo were to come here and answer some questions. Please relay to her as much.
    57	TEXT_SUBSEA007_00117_TALK_SCENE00005_000	Textless
    58	TEXT_SUBSEA007_00117_RSUSHMO_000_30	Ah, so you've spoken with Godebert? Bwahahaha! Within the bell, the Yellowjackets will have that swindling scoundrel locked in a dungeon cell, and then I'll take my filleting knife andâ”€
    59	TEXT_SUBSEA007_00117_RSUSHMO_000_31	Huh? Godebert wants me to go to the Coral Tower for <i>questioning</i>!?
    60	TEXT_SUBSEA007_00117_RSUSHMO_000_32	But what more information does he want that my drawing doesn't already provide!? Isn't a picture supposed to paint a thousand words!?
</details>

We also have access to the Lua files which contain mostly information about what should happen during each cutscene and sometimes "expected" quest logic.

<details>
    <summary><b>SubSea007_00117.lua</b></summary>
    <style>
        @import url('https://cdn.rawgit.com/lonekorean/gist-syntax-themes/d49b91b3/stylesheets/idle-fingers.css');
        @import url('https://fonts.googleapis.com/css?family=Open+Sans');
        body .gist .gist-file {
        border-color: #555 #555 #444
        }
        body .gist .gist-data {
        border-color: #555
        }
        body .gist .gist-meta {
        color: #ffffff;
        background: #373737;
        }
        body .gist .gist-meta a {
        color: #ffffff
        }
        body .gist .gist-data .pl-s .pl-s1 {
        color: #a5c261
        }
    </style>
<script src="https://gist.github.com/pinapelz/ac57efac4dcfb78ee73ff47531b62123.js"></script>

</details>

A lot of the data in the Lua script is somewhat obfuscated, but we can see how the quest is split into individual scenes and what the client expects to happen during each scene.

This would probably be where it ends if this were a single player game, but since FFXIV is an MMO, everybody needs to be on the same page in terms of how far you've progressed in the quest. This is where the server comes in.
<details>
    <summary><b>SubSea007.cpp</b></summary>
<style>
    @import url('https://cdn.rawgit.com/lonekorean/gist-syntax-themes/d49b91b3/stylesheets/idle-fingers.css');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    body .gist .gist-file {
    border-color: #555 #555 #444
    }
    body .gist .gist-data {
    border-color: #555
    }
    body .gist .gist-meta {
    color: #ffffff;
    background: #373737;
    }
    body .gist .gist-meta a {
    color: #ffffff
    }
    body .gist .gist-data .pl-s .pl-s1 {
    color: #a5c261
    }
</style>
<script src="https://gist.github.com/pinapelz/5aa4fdf0a26a55b4be8eadd0af5aa1ff.js"></script>
</details>

Since all the data about how NPCs need to move is scripted locally, all we need to do server side is to tell the client which scene needs to play
```cpp
void onTalk( World::Quest& quest, Entity::Player& player, uint64_t actorId ) override
{
switch( actorId )
{
    case Actor0:
    {
    Scene00000( quest, player );
    break;
    }
    case Actor1:
    {
    if( quest.getSeq() == Seq1 )
        Scene00002( quest, player );
    else
        Scene00005( quest, player );
    break;
    }
    case Actor2:
    {
    Scene00003( quest, player );
    break;
    }
}
}
```
The ```onTalk``` function is called whenever the player interacts with an NPC and they have the quest active. So we need to check that the player is interacting with the correct NPC at the correct step of the quest before we call the appropriate function.

Let's have a look at ```Scene00002``` as an example:

```cpp
  void Scene00002( World::Quest& quest, Entity::Player& player )
  {
    eventMgr().playQuestScene( player, getId(), 2, HIDE_HOTBAR, bindSceneReturn( &SubSea007::Scene00002Return ) );
  }

  void Scene00002Return( World::Quest& quest, Entity::Player& player, const Event::SceneResult& result )
  {
    eventMgr().sendNotice( player, getId(), 0, { Item0Icon } );
    quest.setUI8BH( 1 );
    quest.setSeq( Seq2 );
  }
  ```

After confirming that the player is on ```Seq1``` of the quest, we call the ```Scene00002``` function which will play the cutscene and then call ```Scene00002Return``` once the cutscene is finished.

We then send a notice to the player (in this case showing that they've completed this step of the quest)
<p align="center">
    <img src="https://files.catbox.moe/ofkyx8.png" />
</p>

To know what flags to set we can often go back to look at the Lua script and see what the client expects to happen during each particular scene, or we can brute force it by setting each flag manually and seeing what happens.
(Sometimes not all flags are used since the Sapphire emulation is inherently different from the official servers)

In this case `UI8BH` is the flag that gives the player a key item. Turning this flag on makes it so that the necessary item is rendered within the player's Key Item inventory.

This should give you an idea of how the client and server interact with each other. So while emulating the "independent programs operating on a multitude of specialized servers" isn't possible, we can still see that in terms of "casual content" such as questing or just walking around the world, the client is doing most of the heavy lifting.

If all you wanted to do was walk around the world, interact with NPCs, /gpose, do basic story quests, then I'd say we're pretty much there already. *(I will get to instanced content later)*

> it would cost tens of millions of yen just to obtain the necessary servers. Without these servers and their proprietary programming, while one could potentially pull the client software and display model data and the like, the game itself will not operate.

Ok, I'm pretty sure my PC with a i7-9700K and 32GB of RAM does not cost tens of millions of yen. I think running Sapphire is doing a little more than just "pulling the client software and displaying model data". You're able to walk around the world and maps as if you were playing the game normally. You can interact with NPCs, dye your gear, etc.

While I definetly don't think my PC can handle 10 000+ players on at the same time, I'm pretty sure it can handle the 8 players required for a raid. Its not that the hardware can't handle it, its rather that the software isn't there yet.

<p align="center"><img width=700 src="https://files.catbox.moe/ti2bog.png" /></p>

> Even if one were to somehow accomplish such a feat, it would still be physically impossible to run the unique programming introduced to the servers upon the application of each patch before the patch is even released. The progression timeline for each duty exists solely within this server-side code, and is never included in the patch data downloaded to players’ clients.

This is where the biggest challenge lies for server emulation. While we can access a lot of data regarding where NPCs are, what they say, what items they give... We don't have access to the server side code that handles instanced boss fights. Even if we spawned the boss in the correct location, it lacks the timeline and logic (outside of auto attacks) to make the encounter work.

Here's an example script of a instanced battle quite early on in the Ul'dah storyline: [Underneath the Sultantree](https://github.com/pinapelz/Sapphire/blob/master/src/scripts/instances/questbattles/UnderneaththeSultantree.cpp)

You can see that even though we can datamine the location of each object that makes up the environment of the instance, the logic behind where and when to spawn the enemies is still server side (along with logic regarding what friendly NPCs should be doing).

For that reason alone, it is impossible for anyone to emulate instanced battle content (especially before the patch is released) without running off of the official servers (or you're a dev at SE and you leak it).

Implementing the logic for instanced battles would have to be done manually, and while it is possible, it would be a lot of work.
<p align="center">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/nQK6FcVX1eA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></p>
    <p align="center"> A video of an example quest battle implemented in Sapphire </p>

## Its not like they make it easy for us either
Making a server emulator essentially means reverse engineering the game. While we have a lot of data to go off of in terms of the downloaded game files, Square Enix doesn't particularly make it easy for us to make the game function.

The data sent between your game and the server is known as a packet. These packets are what define specific actions and instructions. For example, when you move your character, your client will send a packet to the server saying "Hey, I'm moving my character to this location" and the server will respond with "Okay, you're now at this location".

Each packet is associated with an opcode which is a unique identifier telling the server what the packet is about (and in turn what to do with it). The first task of server emulation is to figure out what each opcode, this step typically isn't a major roadblock since many Dalamud plugins and ACT/damage meters require this information to function.

These opcodes change every patch because I guess for some reason SquareEnix believes that this will deter people from making 3rd party tools (which is certainly has not). I won't get into the specifics here since you can easily find a lot more information done by more credible people elsewhere, but just know that this is probably one reason why the main branch of Sapphire is now locked in Heavensward.

## The Gilded Araya
So then any time that the dev decides to make leave something in the patch data that isn't used in the game, it usually means that we can do something with it by emulating it's server side behavior.

As such is the case with The Gilded Araya, the trial that will be released in patch 6.5 (at the time of writing this it is Patch 6.48). Access to this area is meant as a FanFest 2023 exclusive for attending the event in person, but the data for the trial has already been included in the game files.

While as I've mentioned previously, we can't emulate the server side encounter logic for the trial, we can still walk around the area and see what it looks like.

```cpp
// This code is auto generated by Sapphire
#include <ScriptObject.h>
#include <Territory/InstanceContent.h>

using namespace Sapphire;

class TheGildedAraya : public Sapphire::ScriptAPI::InstanceContentScript
{
public:
  TheGildedAraya() : Sapphire::ScriptAPI::InstanceContentScript( 20014 )
  { }

  void onInit( InstanceContent& instance ) override
  {
    instance.registerEObj( "Entrance", 2007457, 9795764, 5, { 100.000000f, 0.000000f, 115.000000f }, 1.000000f, 0.000000f);
    // States -> vf_lock_on (id: 11) vf_lock_of (id: 12)
    instance.registerEObj( "Exit", 2000139, 0, 4, { 100.000000f, 0.000000f, 85.000000f }, 1.000000f, 0.000000f);

  }

  void onUpdate( InstanceContent& instance, uint64_t tickCount ) override
  {

  }

  void onEnterTerritory( InstanceContent& instance, Entity::Player& player, uint32_t eventId, uint16_t param1,
                         uint16_t param2 ) override
  {

  }

};

EXPOSE_SCRIPT( TheGildedAraya );
```

All it takes is a simple script to tell the client that this content exists and that it should render it. The client will then take care of everything else.


| ![The Gilded Araya - Image 1](https://files.pinapelz.com/araya1.png "The Gilded Araya - Image 1") | ![The Gilded Araya - Image 2](https://files.pinapelz.com/araya2.png "The Gilded Araya - Image 2") |
|:---:|:---:|
| *The Gilded Araya - Image 1* | *The Gilded Araya - Image 2* |
| ![The Gilded Araya - Image 3](https://files.pinapelz.com/araya3.png "The Gilded Araya - Image 3") | ![The Gilded Araya - Image 4](https://files.pinapelz.com/araya4.png "The Gilded Araya - Image 4") |
| *The Gilded Araya - Image 3* | *The Gilded Araya - Image 4* |

Looks like it's a really great spot to take screenshots. I'll leave that one to the expert gposers though...

Hopefully you've learned a little more about how FFXIV works!
