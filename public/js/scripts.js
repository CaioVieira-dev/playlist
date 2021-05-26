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

const PlayerController = {
    playButton: document.querySelector('#play'),
    previousButton: document.querySelector('#previous'),
    nextButton: document.querySelector('#next'),
    shuffleButton: document.querySelector('#shuffle'),
    repeatButton: document.querySelector('#repeat'),
    player: "",
    playlist: ["bGwL06dBWlA", "oiIzKjDQACY", "UWkXo5XMTP4"],
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
    next() {
        // console.log(PlayerController.playlist)
        if (PlayerController.playing == PlayerController.playlist.length - 1) {
            PlayerController.player.loadVideoById(PlayerController.playlist[0]);
        } else {
            PlayerController.playing++;
            PlayerController.player.loadVideoById(PlayerController.playlist[PlayerController.playing]);
        }

        PlayerController.isPlaying = true;
        document.querySelector('#play img').setAttribute('src', '/pause.svg')

    },
    previous() {
        if (PlayerController.playing == 0) {
            PlayerController.player.loadVideoById(PlayerController.playlist[PlayerController.playlist.length - 1]);
        } else {
            PlayerController.playing--;
            PlayerController.player.loadVideoById(PlayerController.playlist[PlayerController.playing]);
        }
        PlayerController.isPlaying = true;
        document.querySelector('#play img').setAttribute('src', '/pause.svg')


    },
    repeat() {
        //TODO criar logica para voltar a lista do começo

        PlayerController.isRepeatToggled = PlayerController.isRepeatToggled ? false : true;
        //console.log(PlayerController.isRepeatToggled)


    },
    shuffle() {
        //setar estado de shuffle
        PlayerController.isShuffleToggled = PlayerController.isShuffleToggled ? false : true;
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

            if (PlayerController.isRepeatToggled) {
                PlayerController.player.seekTo(0, false)
                if (PlayerController.player.getPlayerState() == 0 ||
                    PlayerController.player.getPlayerState() == -1 ||
                    PlayerController.player.getPlayerState() == 2) {

                    PlayerController.player.playVideo()
                    PlayerController.isPlaying = true;
                    document.querySelector('#play img').setAttribute('src', '/pause.svg')

                }

                return;

            }

            if (PlayerController.isShuffleToggled) {
                let randomVideoIndex = Math.floor(Math.random() * PlayerController.playlist.length)
                PlayerController.playing = randomVideoIndex;
                PlayerController.player.loadVideoById(PlayerController.playlist[randomVideoIndex]);
                PlayerController.isPlaying = true;
                document.querySelector('#play img').setAttribute('src', '/pause.svg')

                return;
            }

            PlayerController.next();//vai para o proximo video
        }
        //1 = player running
        if (PlayerController.player.getPlayerState() == 1) {
            PlayerController.setLastSeenVideo();
        }
    },
    setPlaylist() {
        // console.log(PlayerController.playlist)


        const listOfVideoId = Array.from(document.querySelectorAll(".mini-video")).map((item) => {
            let video = item.getAttribute("YTlink")

            return video.substr(video.indexOf('watch?v=') + 8)
        })

        PlayerController.playlist = listOfVideoId;
        //console.log(PlayerController.playlist)
    },
    setPlaylistIndex() {
        PlayerController.playing = PlayerController.playlist.indexOf(PlayerController.player.getVideoData()['video_id'])
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

PlayerController.init();
Modal.init();

PlayerController.setPlaylist();
