---
title: 'Unleashing the Chat Wizardry: Auto-Replying to Discord Messages'
description: 'Harnessing the power of LLMs to auto-reply to Discord messages'
pubDate: 'Aug 9 2023'
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

With this you should start to see messages being logged to the console. To get them into a Python program, As shwon, I've opted to use a websocket server since it was the most striaghtforward given that Node modules are not possible in BetterDiscord.

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
The config file is where I store my API keys along with the context I want to give the AI before replying

## GPT4Free?
You'll notice that I've used a library named GPT4Free to generate my responses when no OpenAI API key is provided. This is an alternative older version of the current G4F library that uses You.com instead of OpenAI. While its old, I've found it more stable than the current G4F library.

The library is great but you don't be able to feed any context to it since its mainly meant to be used like a search engine. Still, its not a terrible altenrative if you just want to have some fun by having a super genius AI reply to your contacts.

## Source Code
The full source code is available on my [GitHub](https://github.com/pinapelz) and [Gitea](https://git.pinapelz.moe/pinapelz/DiscordAutoReplyGPT) instance. 
