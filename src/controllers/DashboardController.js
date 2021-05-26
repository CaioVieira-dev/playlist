const Playlist = require('../model/Playlist')


module.exports = {
    async index(req, res) {
        //pegar playlist
        const playlist = await Playlist.get();
        //console.log(playlist)
        //playlist tem link, titulo
        //http://img.youtube.com/vi/<insert-youtube-video-id-here>/mqdefault.jpg

        const data = playlist.map((video) => {
            let imgId = `http://img.youtube.com/vi/${video.link.substr(video.link.indexOf('watch?v=') + 8)}/mqdefault.jpg`

            return {
                ...video,
                imgId
            }
        })

        //exibir na tela

        return res.render('index', { playlist: data });

    },
    async save(req, res) {
        //console.log(req.body)
        console.log("rota save", req.body.title)

        await Playlist.create({
            title: req.body.title,
            link: req.body.link
        })
        //console.log(req)
        return res.redirect('/')
    },
    async update(req, res) {
        const videoId = req.params.id;

        const updateVideo = {
            title: req.body.title,
            link: req.body.link
        }

        Playlist.update(updateVideo, videoId);

        return res.redirect('/');
    },
    async delete(req, res) {

        const videoId = req.params.id;
        await Playlist.delete(videoId);

        return res.redirect('/')
    }
}