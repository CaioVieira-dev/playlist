const Storage = {
    get() {
        //pegue o id do ultimo video visto pelo usuario
        //se não existir, pegue um id de video especificado pelo programador
        return JSON.parse(localStorage.getItem("__playlist:lastSeen")) || "nZVpt2zPdNo"
    },
    set(videoId) {
        //armazene o id do video no localStorage
        localStorage.setItem("__playlist:lastSeen", `"${videoId}"`)
    }
}
const Modal = {
    showButton: document.querySelector(".cta"),
    modal: document.querySelector(".modal"),
    closeModal: document.querySelector(".modal form span"),
    configModals: document.querySelectorAll(".modalUpdate"),
    toggleModal() {
        Modal.showButton.classList.toggle('disabled')
        Modal.modal.classList.toggle('hide')
    },
    toggleUpdateModal(id, fromInside) {
        if (fromInside) {
            let modalId = `modalConfig_${id}`
            document.querySelector(`#${modalId}`).classList.toggle('hide');
            let isActive = document.querySelector(`#${modalId}`).getAttribute('isActive') == "true" ? "false" : "true";
            document.querySelector(`#${modalId}`).setAttribute('isActive', isActive);
        } else {

            for (let i = 0; i < Modal.configModals.length; i++) {
                if (Modal.configModals[i].getAttribute('isActive') == "true") {
                    Modal.configModals[i].classList.toggle('hide')
                    Modal.configModals[i].setAttribute('isActive', "false")
                }
            }

            let modalId = `modalConfig_${id}`

            document.querySelector(`#${modalId}`).classList.toggle('hide')
            let isActive = document.querySelector(`#${modalId}`).getAttribute('isActive') == "true" ? "false" : "true";
            document.querySelector(`#${modalId}`).setAttribute('isActive', isActive);
        }

        //toggle no hide
    },
    init() {
        Modal.showButton.addEventListener('click', Modal.toggleModal)
        Modal.closeModal.addEventListener('click', Modal.toggleModal)
        //console.log(Modal.configModals[4].getAttribute('id'))
        for (let i = 0; i < Modal.configModals.length; i++) {
            Modal.configModals[i].setAttribute('isActive', "false")
            let id = Modal.configModals[i].getAttribute('id').replace('modalConfig_', "")
            let queryId = `#config_${id}`
            document.querySelector(queryId).addEventListener("click", () => Modal.toggleUpdateModal(id, false))
            Modal.configModals[i].querySelector("form span").addEventListener("click", () => Modal.toggleUpdateModal(id, true))

            if ((i + 3 >= Modal.configModals.length && Modal.configModals.length > 4) || (i + 2 >= Modal.configModals.length && (Modal.configModals.length == 4 || Modal.configModals.length == 3))) {
                Modal.configModals[i].querySelector('form').classList.add('inversePosition')
                Modal.configModals[i].querySelector('.triangle').classList.add('inversePosition')
            }
        }
    },
}
const Utils = {
    listOfVideo: document.querySelectorAll('li'),
    prepareEvents() {

        //set new form submit event
        $('#newVideoForm').submit(function (eventObj) {

            //console.log(eventObj.currentTarget.querySelector('input').value);

            let url = eventObj.currentTarget.querySelector('input').value
            //TODO: validate link
            $.getJSON('https://noembed.com/embed',
                { format: 'json', url: url }, function (data) {
                    $("<input />").attr('type', 'hidden').attr('value', data.title).attr('name', "title").appendTo('#trickForm');
                    $('#trickLink').attr('value', $('#link').val())
                    $('#trickForm').submit();
                })
            //console.log(eventObj.currentTarget);

            //$(this).append('<input type="hidden" name="title" value=""/>')
            return false;
        })

        //set update event
        for (let i = 0; i < Modal.configModals.length; i++) {
            // console.log(Modal.configModals[i].querySelector('form').getAttribute('id'))
            let formId = Modal.configModals[i].querySelector('form').getAttribute('id')
            $("#" + formId).submit(function (eventObj) {
                let url = eventObj.currentTarget.querySelector('input[type="text"]').value;
                var updateTargetId = eventObj.currentTarget.querySelector('input[type="hidden"]').value;
                $.getJSON('https://noembed.com/embed',
                    { format: 'json', url: url }, function (data) {

                        $('#trickUpdateForm').attr('action', '/update/' + updateTargetId)
                        $("<input />").attr('type', 'hidden').attr('value', data.title).attr('name', "title").appendTo('#trickUpdateForm');
                        $('#trickUpdateLink').attr('value', $('#updateLink_' + formId.replace('updateForm_', "")).val());
                        $('#trickUpdateForm').submit();
                    })

                return false;
            })
        }
        //set click event on delete button
        for (let i = 0; i < Modal.configModals.length; i++) {
            let formId = Modal.configModals[i].querySelector('form').getAttribute('id')


            const deleteButton = document.querySelector(`#${formId} .deleteVideo`);
            let videoId = formId.replace('updateForm_', "")

            let deleteAction = '/delete/' + Number(videoId)
            deleteButton.onclick = () => {

                document.querySelector('#deleteForm').setAttribute('action', deleteAction);
                $('#deleteForm').submit();
                //   alert('clicked')
            }

        }
        //set click event on video list
        for (let i = 0; i < Utils.listOfVideo.length; i++) {
            //$('li .titleWrapper').click(function () { alert('li click') })
            let thumbnail = Utils.listOfVideo[i].querySelector('.thumb');
            let title = Utils.listOfVideo[i].querySelector('.titleWrapper');

            thumbnail.addEventListener('click', function () {
                // console.log('thumb click ', Utils.listOfVideo[i].getAttribute('ytlink'))
                PlayerController.playSelected(Utils.listOfVideo[i].getAttribute('ytlink'), Utils.listOfVideo[i].getAttribute('id'))
            })
            title.addEventListener('click', function () {
                PlayerController.playSelected(Utils.listOfVideo[i].getAttribute('ytlink'), Utils.listOfVideo[i].getAttribute('id'))
            })
        }

    },
    removeAllIsActive() {
        for (let i = 0; i < Utils.listOfVideo.length; i++) {
            Utils.listOfVideo[i].classList.remove('isActive')
        }
    },
    setIsActive(elementId) {
        let query = `#${elementId}`;
        document.querySelector(query).classList.add('isActive')
    },
    changeToPauseButton() {
        PlayerController.isPlaying = true;
        document.querySelector('#play img').setAttribute('src', '/pause.svg')
    },
    changeToPlayButton() {
        PlayerController.isPlaying = false;
        document.querySelector('#play img').setAttribute('src', '/play.svg')
    }
}
const PlayerController = {
    playButton: document.querySelector('#play'),
    previousButton: document.querySelector('#previous'),
    nextButton: document.querySelector('#next'),
    shuffleButton: document.querySelector('#shuffle'),
    repeatButton: document.querySelector('#repeat'),
    player: "",
    playlist: [
        {
            videoId: "bGwL06dBWlA",
            listId: "videoListItem_1"
        },
        {
            videoId: "oiIzKjDQACY",
            listId: "videoListItem_2"
        },
        {
            videoId: "UWkXo5XMTP4",
            listId: "videoListItem_3"
        }],
    playing: 0,
    isRepeatToggled: false,
    isShuffleToggled: false,
    isPlaying: false,
    playPause() {
        if (PlayerController.isPlaying) {
            PlayerController.isPlaying = false;
            document.querySelector('#play img').setAttribute('src', '/play.svg')
            PlayerController.player.pauseVideo();
        } else {
            PlayerController.isPlaying = true;
            document.querySelector('#play img').setAttribute('src', '/pause.svg')
            PlayerController.player.playVideo()
        }

    },
    playSelected(link, videoListId) {
        let videoId = link.substr(link.indexOf('watch?v=') + 8)
        let id;
        for (let i = 0; i < PlayerController.playlist.length; i++) {
            if (PlayerController.playlist[i].videoId.indexOf(videoId) != -1) {
                id = i;
            }
        }
        //rodar video
        PlayerController.player.loadVideoById(PlayerController.playlist[id].videoId)
        //setar indice para controlar eventos da playlist
        PlayerController.playing = id;
        //remove isActive from all elements
        Utils.removeAllIsActive()
        //add isActive to this element
        Utils.setIsActive(videoListId)
        //ja começa rodando, então troque o icone para o pause
        Utils.changeToPauseButton()

    },
    next() {
        //udate index
        PlayerController.playing = PlayerController.playing == PlayerController.playlist.length - 1 ? 0 : PlayerController.playing + 1;
        //change loaded video
        PlayerController.player.loadVideoById(PlayerController.playlist[PlayerController.playing].videoId);
        //remove isActive class from all videos on list
        Utils.removeAllIsActive()
        //add isActive class to current video playing
        Utils.setIsActive(PlayerController.playlist[PlayerController.playing].listId)
        //change play button to pause button
        Utils.changeToPauseButton()
    },
    previous() {
        PlayerController.playing = PlayerController.playing == 0 ? PlayerController.playlist.length - 1 : PlayerController.playing - 1;
        PlayerController.player.loadVideoById(PlayerController.playlist[PlayerController.playing].videoId);
        Utils.removeAllIsActive()
        Utils.setIsActive(PlayerController.playlist[PlayerController.playing].listId)
        Utils.changeToPauseButton()
    },
    repeat() {
        PlayerController.isRepeatToggled = PlayerController.isRepeatToggled ? false : true;
        if (PlayerController.isRepeatToggled) {
            PlayerController.repeatButton.querySelector('img').setAttribute('src', '/greenRepeat.svg')
        } else {
            PlayerController.repeatButton.querySelector('img').setAttribute('src', '/repeat.svg')
        }

    },
    shuffle() {
        PlayerController.isShuffleToggled = PlayerController.isShuffleToggled ? false : true;
        if (PlayerController.isShuffleToggled) {
            PlayerController.shuffleButton.querySelector('img').setAttribute('src', '/greenShuffle.svg')
        } else {
            PlayerController.shuffleButton.querySelector('img').setAttribute('src', '/shuffle.svg')
        }
    },
    init() {
        PlayerController.playButton.addEventListener('click', PlayerController.playPause)
        PlayerController.nextButton.addEventListener('click', PlayerController.next)
        PlayerController.previousButton.addEventListener('click', PlayerController.previous)
        PlayerController.repeatButton.addEventListener('click', PlayerController.repeat)
        PlayerController.shuffleButton.addEventListener('click', PlayerController.shuffle)
    },
    setLastSeenVideo() {
        Storage.set(PlayerController.player.getVideoData()['video_id'])
    },
    stateChange() {
        //0 = fim do video
        if (PlayerController.player.getPlayerState() == 0) {
            //repeat button is toggled on
            if (PlayerController.isRepeatToggled) {
                PlayerController.player.seekTo(0, false)
                if (PlayerController.player.getPlayerState() == 0 ||
                    PlayerController.player.getPlayerState() == -1 ||
                    PlayerController.player.getPlayerState() == 2) {
                    PlayerController.player.playVideo()
                    Utils.changeToPauseButton()
                }
                return;
            }
            //shuffle button is toggled on
            if (PlayerController.isShuffleToggled) {
                //randomize next video
                let randomVideoIndex = Math.floor(Math.random() * PlayerController.playlist.length)
                PlayerController.playing = randomVideoIndex;
                PlayerController.player.loadVideoById(PlayerController.playlist[randomVideoIndex].videoId);
                Utils.removeAllIsActive()
                Utils.setIsActive(PlayerController.playlist[PlayerController.playing].listId)
                Utils.changeToPauseButton()
                return;
            }

            PlayerController.next();//go to next video of the list
        }
        //1 = player running
        if (PlayerController.player.getPlayerState() == 1) {
            PlayerController.setLastSeenVideo();
            Utils.changeToPauseButton();
        }
        //2 - player paused
        if (PlayerController.player.getPlayerState() == 2) {
            Utils.changeToPlayButton()
        }
    },
    setPlaylist() {
        // console.log(PlayerController.playlist)


        const listOfVideoId = Array.from(document.querySelectorAll(".mini-video")).map((item) => {
            let video = item.getAttribute("YTlink")
            let id = item.getAttribute('id')
            return {
                videoId: video.substr(video.indexOf('watch?v=') + 8),
                listId: id
            }
        })

        PlayerController.playlist = listOfVideoId;
        //console.log(PlayerController.playlist)
    },
    setPlaylistIndex() {
        for (let i = 0; i < PlayerController.playlist.length; i++) {
            if (PlayerController.playlist[i].videoId.indexOf(PlayerController.player.getVideoData()['video_id']) != -1) {
                PlayerController.playing = i;
                Utils.setIsActive(PlayerController.playlist[i].listId)
            }
        }
    }
}
function onYouTubeIframeAPIReady() {
    PlayerController.player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: Storage.get(),
        events: {
            onReady: PlayerController.setPlaylistIndex,
            onStateChange: PlayerController.stateChange
        },
    });

}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
PlayerController.init();
Modal.init();
PlayerController.setPlaylist();
Utils.prepareEvents();
