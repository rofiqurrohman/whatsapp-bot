const { create, vf } = require('@open-wa/wa-automate')
const { color, options } = require('./function')
const left = require('./lib/left')
const welcome = require('./lib/welcome')
const figlet = require('figlet')
const fs = require('fs-extra')
const ms = require('parse-ms')
const HandleMsg = require('./HandleMsg')

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const start = async (dombago = new dombago()) => {
    console.log(color('------------------------------------------------------------------------', 'white'))
    console.log(color(figlet.textSync('Dombago Bot', { font: 'Ghost', horizontalLayout: 'default' })))
    console.log(color('------------------------------------------------------------------------', 'white'))
    console.log(color('[CREATOR]', 'aqua'), color('Rofiqur Rohman', 'magenta'))
    console.log(color('[BOT]', 'aqua'), color('DOMBAGO BOT is now Online!', 'magenta'))
    console.log(color('[VER]', 'aqua'), color('2.10.0', 'magenta'))
    dombago.onStateChanged((state) => {
        console.log(color('-> [STATE]'), state)
        if (state === 'CONFLICT') dombago.forceRefocus()
        if (state === 'UNPAIRED') dombago.forceRefocus()
    })

    dombago.onAddedToGroup(async (chat) => {
        await dombago.sendText(chat.groupMetadata.id, 'Terima kasih sudah memasukkan bot kedalam grup kalian\nKetik /menu untuk menampilkan command')
    })

    dombago.onGlobalParticipantsChanged((async (heuh) => {
        await welcome(dombago, heuh)
        left(dombago, heuh)
    }))

    dombago.onMessage((message) => {
        dombago.getAmountOfLoadedMessages()
            .then(msg => {
                if (msg >= 3000) {
                    dombago.cutMsgCache()
                }
            })
        HandleMsg(dombago, message)
    })

    dombago.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await dombago.sendText(callData.peerJid, 'Maaf sedang tidak bisa menerima panggilan.\n\n-bot')
            .then(async () => {
                await sleep(3000)
                // bot akan memblock nomor itu
                await dombago.contactBlock(callData.peerJid)
            })
    })
}
create(options(start))
    .then((dombago) => start(dombago))
    .catch((err) => console.error(err))
