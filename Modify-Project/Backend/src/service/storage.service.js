const ImageKit = require('@imagekit/nodejs')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile({ buffer, filename, folder = "" }) {
    const file = await imagekit.files.upload({
        file: buffer.toString('base64'),
        fileName: filename,
        folder: folder,
        isPrivateFile: false
    })
    return file
}
module.exports = { uploadFile }
