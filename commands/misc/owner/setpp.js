const { ICommand } = require('@libs/builders/command/command.builder')
const moment = require('moment-timezone')
const Jimp = require('jimp');
/**
 * @type { ICommand }
 */
module.exports = {
    category: 'owner',
    description: '',
    ownerOnly: true,
    minArgs: 1,
    expectedArgs: '',
    example: '',
    callback: async ({ msg, client, args }) => {
      async function generateProfilePicture(buffer) {
        const jimp = await Jimp.read(buffer)   
        const min = jimp.getWidth()
        const max = jimp.getHeight()
        const cropped = jimp.crop(0, 0, min, max)
        return {
          img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
          preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG)
        } 
      }
      
      const media = (await msg.download('buffer')) || (msg.quoted && (await msg.quoted.download('buffer')))
      var { preview } = await generateProfilePicture(media)
      await client.query({
        tag: 'iq',
        attrs: {
          to: msg.sender,
          type:'set',
          xmlns: 'w:profile:picture' 
        },
        content: [{
          tag: 'picture',
          attrs: { type: 'image' },
          content: preview 
        }]
      })
    },
}
