const {Client} = require('discord.js');
const client = new Client();

const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
const dcEmojiRegex = /<:.+?:\d+>/g;

const token = process.env.TOKEN;

if (!token) {
    console.log('No token provided!')
    return;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: "dnd",
        activity: {
            name: 'Emotes are my breakfast!',
            type: "PLAYING"
        }
    }).then(presence => {
        const activities = presence.activities;
        if (activities.length < 1) {
            return;
        }

        const type = activities[0].type;
        const name = activities[0].name;

        console.log(`I am now ${type} ${name}`)
    });
});

const checkMessage = (msg) => {
    try {
        const attachments = msg.attachments;
        if (attachments && attachments.size > 0) {
            return;
        }

        const embeds = msg.embeds;
        if (embeds && embeds.length > 0) {
            return;
        }

        let replaced = msg.content.replace(dcEmojiRegex, '');
        replaced = replaced.replace(emojiRegex, '');
        replaced = replaced.replace(' ', '').trim();
        let length = replaced.length;
        if (length === 0) {
            if (msg.content.includes("pdikov")) {
                warn(msg, true);
            } else {
                warn(msg);
            }
        }

    } catch (e) {
        console.error('Error occurred', e);
    }
}

const warn = (msg, pecata) => {
    const msgToSend = pecata ?
        `<@${msg.author.id}> Стига си се ебавал с пецата...` :
        `<@${msg.author.id}> Моля те, стига си пращал емотикони на един ред! :poop:`;

    msg.channel.startTyping(1);
    setTimeout(() => {
        msg.channel.send(msgToSend)
            .then(msg => {
                msg.channel.stopTyping();

                setTimeout(() => {
                    msg.delete();
                }, 5000);

            })
    }, 1000);
}

client.on('message', msg => checkMessage(msg));
client.on('messageUpdate', (oldMsg, newMsg) => checkMessage(newMsg));

client.login(token);