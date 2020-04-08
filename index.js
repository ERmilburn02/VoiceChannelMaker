const Discord = require('discord.js');
const {Client} = Discord;
const client = new Client();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const {token, channelID} = require('./config.json');
client.login(token);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});
client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.channelID == channelID) {
        const newVC = await newState.guild.channels.create(newState.member.user.username, {type: 'voice', parent: newState.channel.parent, position: newState.channel.position});
        newState.member.voice.setChannel(newVC);
        db.get('channels').push({name: newState.member.user.username, id: newVC.id}).write();
    };
    if (searchDB(oldState.channelID)) {
        if (oldState.channel.members.size == 0) {
            oldState.channel.delete();
            db.get('channels').remove({id: oldState.channelID}).write();
        }
    }
});

function searchDB(CID) {
    let output = db.get('channels').find({ id: CID }).value();
    if (output === undefined) return false;
    return true;
}