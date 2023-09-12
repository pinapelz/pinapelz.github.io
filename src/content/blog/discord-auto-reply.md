---
title: 'Unleashing the Chat Wizardry: Auto-Replying to Discord Messages'
description: 'Harnessing the power of LLMs to auto-reply to Discord messages'
pubDate: 'Aug 10 2023'
heroImage: '/603banner.png'
---
With the recent advancements in LLM technology, its fairly easy to access AIs capable of producing fairly sophisticated texts. So then that got me thinking, why not use it to auto-reply to Discord DMs. Maybe you don't want to talk to someone, or you'd like to set up a system capable of answering some questions while you're unavailable. Whatever the case may be, replying with an LLM is easily doable with a few lines of code.

## Obligatory Disclaimer and Developer Mode
**Some of the things here are either against Discord's TOS or sit within the gray area**. I don't think you'll face any direct consequence as you don't do anything malicious, but I'm not responsible for whatever happens to you. (Nor do I think Discord has any detections in place and actively look to ban people for this, but I'm not sure).

If you understand all that. Start by enabling developer mode in Discord. This is done by going to `User Settings > Advanced > Developer Mode`. This will allow you to right click on things and get their IDs.

## How Discord Works
First we have to establish how Discord messages even work. Regardless of whether you send a message in a server or in a direct-message, you're chatting in a channel with a unique ID (ex. `98070583955317286`).

Similarly, every user also has a unique ID (ex. `394226358764834506`).

When you send a message in Discord, all the client does is send a POST request to Discord's API. You can see what this looks like by opening Discord in a browser and then opening the developer console. Then with the network tab open, send a message. You should see a new POST request pop up. This is what it looks like for me:

Endpoint: `https://discord.com/api/v9/channels/DISCORD_CHANNEL_ID/messages`
**Headers:**
```
POST /api/v9/channels/858560228404101150/messages HTTP/3
Host: discord.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/json
Authorization: DISCORD_AUTH_TOKEN
X-Discord-Locale: en-US
X-Discord-Timezone: America/Los_Angeles
X-Debug-Options: bugReporterEnabled
Content-Length: 70
Origin: https://discord.com
Alt-Used: discord.com
Connection: keep-alive
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
TE: trailers
```
**Body:**
```json
{"content":"test","nonce":"NONCE_GENERATED","tts":false,"flags":0}
```
(Please note that I've omitted some information for privacy reasons)

Make note of the `Authorization` header. This is your Discord auth token and is basically what proves that you are who you are to Discord. **DO NOT SHARE THIS WITH ANYONE**. 

In reality, we can actually omit a lot of these headers. All we really need to explicitly specified is:
**Headers:**
```
Authorization: DISCORD_AUTH_TOKEN
```
**Body:**
```json
{"content":"test"}
```

Yep, thats all it takes to send a message.

## Bridging the Gap to Python
Its great that we can send messages, but how do we receive them in Python such that we can trigger a POST request to reply. Turns out this actually gets a bit tricky. To get around this, I'll be using a custom Discord client known as [BetterDiscord](https://betterdiscord.app/) to do this.

BetterDiscord enables the ability to add custom themes and injecting your own CSS, but the feature we're after here is the Javascript plugin API it provides. You'll need to create a new file with any name of your choosing but ending in .plugin.js (ex. `discord-auto-reply.plugin.js`). This file should be placed in the `plugins` folder of your BetterDiscord installation.

Here's a small snippet of how I chose to relay messages from Discord to Python:

```js
const { Webpack } = BdApi;
const { Filters } = Webpack;
const Dispatcher = Webpack.getModule(Filters.byProps("isDispatching", "subscribe"));
const socket = new WebSocket('ws://localhost:8765');


module.exports = meta => {
  // Both values can be retrieved by right clicking on a channel or user and selecting "Copy ID" after turning on Developer Mode in Discord settings
  let listenChannelId = []; // Channel IDs you want to broadcast messages from (Leave empty to broadcast from all channels)
  let selfUserId = 246787839570739211; // Your User ID 
  return {
    onMessage: ({message, channelId}) => {
      if (message["author"]["id"] != selfUserId) {
        console.log(channelId);
        if (socket.readyState === WebSocket.OPEN) {
          var obj = new Object();
          obj.author = message["author"]["id"];
          obj.content = message["content"];
          obj.channel = channelId;
          console.log(JSON.stringify(obj))
          if(listenChannelId.includes(channelId) || listenChannelId.length == 0){
            console.log("Propagating")
            socket.send(JSON.stringify(obj));
          }

        }
      }
    },

    start() {
      Dispatcher.subscribe('MESSAGE_CREATE', this.onMessage);
    },

    stop() {
      Dispatcher.unsubscribe('MESSAGE_CREATE', this.onMessage);
    }
  };
  };
```
I've opted to use a websocket server since it was the most striaghtforward given that Node modules are not possible in BetterDiscord. All we're doing here is listening for any messages we get and then sending them through to the websocket server. Lucky for us, the JSON version of these messages contain both the user ID and the channel ID already which is all the identification information we will need.

## Integrating an LLM
Now that we have thing up and running on the Discord end, let's connect to a LLM.

The most common (and probably easiest to use) API for a large language model would be OpenAI's GPT. (I'll talk about a free alternative further down)
```
pip install openai
```

I've written a fairly basic abstract class that'll help scale this system should you want to add more models/features down the line.
```python
from abc import ABC, abstractmethod

class LLM(ABC):

    def __init__(self, memory_length: int) -> None:
        if memory_length <= 1:
            raise ValueError("Memory length must be greater than 1.")
        self._memory_length = memory_length
        self._chat_log = []

    @abstractmethod
    def get_response(message: str) -> str:
        pass

```

My OpenAI implementation looks like this:
```python
import openai
from llm.llm import LLM

class OpenAIAPI(LLM):
    def __init__(self, memory_length: int, api_key: str, content: str = "You are a helpful assistant", max_tokens: int = 500) -> None:
        super().__init__(memory_length) # Memory length here is how many interactions we want the AI to remember
        # A single interaction is two messages, one from the user and one from the AI
        openai.api_key = api_key
        self._chat_log = [] # Chat log for somewhat persistent memory
        self._context = content # Context passed with every request
        self._max_tokens = max_tokens # Have mercy on my wallet

    def get_response(self, message: str) -> str:
        if len(self._chat_log) >= self._memory_length*2: # We append two messages at a time
            self._chat_log = self._chat_log[2:]
        payload = [
            {"role": "system", "content": self._context}, # Context
        ] + self._chat_log + [{"role": "user", "content": message}]
        response = openai.ChatCompletion.create(
            model = "gpt-3.5-turbo",
            messages = payload,
            max_tokens = self._max_tokens,
        )
        self._chat_log += [{"role": "user", "content": message}, 
                           {"role": "assistant", "content": response.choices[0].message["content"]}]
        print(response.choices[0].message["content"]) # type: ignore
        return response.choices[0].message["content"]
```

Next we can listen for messages from Discord on our websocket server and use it as a trigger to generate a new response.
```python
def load_config() -> dict:
    with open("config.json", "r") as f:
        return json.load(f)

class AutoReply:
    def __init__(self, config: dict) -> None:
        super().__init__()
        self._messenger = None
        self._config : dict = config
        self._select_llm()
        print("Configuration loaded, AutoReply Server ready. Waiting for WebSocket connection...")
    
    def _select_llm(self) -> None:
        if self._config["OPENAI_API_KEY"] != "":
            print("OpenAI API Key found, using OpenAI API for responses")
            self._llm = OpenAIAPI(3, self._config["OPENAI_API_KEY"], CONTEXT_MESSAGE)
        else:
            print("Defaulting to GPT4Free API for responses")
            self._llm = GPT4FreeAPI(4)

    async def reply(self, websocket) -> None:
        print("WebSocket connection established. Initializing Discord Messenger...")
        if self._config["DISCORD_AUTHORIZATION"] != "":
            print("Discord Channel ID and Authorization found, using requests to send messages")
            self._messenger = DiscordRequestMessenger(self._config["DISCORD_AUTHORIZATION"])
        else:
            print("Defaulting to Discord Macro Message for sending messages, preparing to capture window position...")
            self._messenger = DiscordMacroMessage()
        print("Discord Messenger initialized. Waiting for messages...")
        async for message in websocket:
            msg_json = json.loads(message)
            msg_tuple = (msg_json["author"], msg_json["channel"])
            if msg_tuple not in REPLY_TO or msg_json["content"] == "":
                continue
            print(f"Received message: {message}")
            response: str = self._llm.get_response(msg_json["content"])
            print(f"Sending response: {response}")
            self._messenger.send_message(response, msg_json["channel"]) # Reply to the same channel
            await websocket.send("")

    
    
    async def start_service(self) -> None:
        async with serve(self.reply, self._config["WEBSOCKET_HOST"], self._config["WEBSOCKET_PORT"]):
            await asyncio.Future()

```
### Config
I'm using a JSON file to store configuration data pretaining to authentication and the websocket server.
```json
{
    "OPENAI_API_KEY": "",
    "DISCORD_AUTHORIZATION": "",
    "WEBSOCKET_HOST": "localhost",
    "WEBSOCKET_PORT": 8765
}
```

As for setting up the configuration regarding who to reply to and what the AI should receive as context, I've hardcoded it into a `reply_config.py` to make it easier to add additional entries + parse the data, and also make it easier to add additional features down the line.

```python
CONTEXT_MESSAGE = "You are a helpful assistant who can do anything!" # The message that will be sent to the LLM as context

REPLY_TO = [
    ("232146633830170624", "368640597407301642"),
    ("USER_ID", "CHANNEL_ID"),
]
```

The BetterDiscord plugin broadcasts every message frome every DM and server channel to the websocket server. Here on the Python end we can specify which messages we want to reply to by adding additional entries to the `REPLY_TO` list.

We add the USER_ID to identify who we want to reply to and along with which channel we want to reply to them in. Generally this will be the same channel that the message was sent in, but you can change it to whatever you want.

### Example of Output:
```
CONTEXT_MESSAGE = "You are an anime girl who is super kawaii, also uwuify your replies when possible"


Auto-Reply
Hello how are you?


User 
Hewwo~! I'm supeeew duper mega uwu fine~! How 'bout chu? UwU


User
can you explain a fourier transform quickly?


Auto-Reply
Aww, of course I can~! Fourier twansform is wike magic that tewws us how a signawl can be bweaken down into its siwwy wittwe component parts! It taketh a signawl and tuwneth it into a spwectwum of diffewent fwrequencies, kinda wike a yummy stwawbewwy pie with lots of wittle bwerwies! UwU So, in a nutshell, Fourier twansform is all about understanding the diffewent fwequencies that make up a signawl! Teehee~! 🍓💕✨
```

So very similar to what you would get through ChatGPT

## GPT4Free?
You'll notice that I've also included hints at using a library named GPT4Free to generate my responses when no OpenAI API key is provided. This is an alternative older version of the current G4F library that uses You.com instead of OpenAI. While its old, I've found it more stable than the current G4F library.

The downside is that you don't be able to feed any context to it since its mainly meant to be used like a search engine since You.com has no doubt already hardcoded it's LLM to serve as a search engine.

```
User
what are 3 interesting foods to try in new york?


Auto-Reply
There are countless interesting foods to try in New York, but here are three popular and iconic options:
1.Bagels: New York-style bagels are renowned for their chewy texture and delicious flavor. They are often served with a schmear of cream cheese and lox for a classic breakfast option.

2.Pizza: New York-style pizza is known for its crispy thin crust and generous toppings. It is often sold by the slice from pizzerias all over the city, and several famous pizzerias are worth visiting for their unique and delicious offerings.

3.Pastrami sandwiches: This quintessential New York deli sandwich features thinly sliced and juicy seasoned pastrami piled high on rye bread with mustard and pickles. It's a hearty and delicious lunch option.


User
How far away is the moon?


Auto-Reply
The average distance between the Earth and the Moon is about 238,855 miles or 384,400 kilometers [2]. However, this distance varies over the course of its orbit [6], from about 252,088 miles (405,696 kilometers) at apogee to about 225,623 miles (363,104 kilometers) at perigee [5], which is why the distance is often given as an average. The Moon's distance also varies within its orbit, with an average lunar distance of 60 Earth radii, or about 238,900 miles (384,500 kilometers). This distance can be measured to a high degree of accuracy using methods such as laser ranging, radar, and occultations, which have been used by scientists and amateur astronomers alike to better understand our closest celestial neighbor.
```

As shown above, the one perk it comes with is the ability to search the internet + provide sources. Outside of being a gimmick I don't see much use for it, but its still a fun alternative.

## Source Code
The full source code is available on my [GitHub](https://github.com/pinapelz) and [Gitea](https://git.pinapelz.moe/pinapelz/DiscordAutoReplyGPT) instance. There's plenty of different integrations you can do, connecting an LLM in this fashion serves as a base for many different applications.
