window.addEventListener('load', () => {
    
    let currentTrack = -1;

    const trackList = [
        'Jonathan Parecki - One Punch Man',
        'Twisted Sister - We\'re Not Gonna Take It',
        'Vickeblanka - Black Clover',
        'MARRY ME, BELLAMY - Genshin Impact',
        'JT Music - To The Bone'
    ]

    let audio = new Audio(`./assets/audio/${trackList[0]}.mp3`);
    const time = document.getElementById('currentTime');
    const trackImg = document.getElementById('songImg');
    const duration = document.getElementById('trackDuration');
    const moveForvard = document.getElementById('moveForvard');
    const moveBack = document.getElementById('moveBack');
    const play = document.getElementById('play');
    const progress = document.getElementById('progress');
    const nextTrack = document.getElementById('next');
    const prevTrack = document.getElementById('prev');  
    const progressContainer = document.getElementById('progressContainer');
    const name = document.getElementById('name');
    const author = document.getElementById('author');
    const pp = document.getElementById('pp');
    const volume = document.getElementById('volume');
    const volInput = document.getElementById('volInput');
    const repeat = document.getElementById('repeat');
    const shuffle = document.getElementById('shuffle');

    let repeatValue = false;

    let playInterval;

    let shuffleMode = false;
    let shuffledSongs = [...trackList].sort(() => Math.random() - 0.5);

    let mouseDown = 0;

    document.body.onmousedown = function() { 
        ++mouseDown;
    }
    document.body.onmouseup = function() {
        --mouseDown;
    }

    disableBtns();

    audio.volume = 0.5;

    repeat.addEventListener('click', () => {
        repeatValue = !repeatValue;
        repeat.classList.toggle('active-repeat');
    })

    function track() {
        return setInterval(() => {
            changeTime();
            progress.style.width = (audio.currentTime / audio.duration) * 100 + '%';
        }, 500);
    }

    audio.addEventListener('ended', () => {
        clearInterval(playInterval);
        setTimeout(() => {
            if (!repeatValue) {
                changeSong(true);
            } else {
                audio.play();
            }
        }, 500);
    });

    progressContainer.addEventListener('mousemove', changeTimeFromProgress);
    progressContainer.addEventListener('click', changeTimeFromWithClick);
    

    play.addEventListener('click', () => {
        if (!audio.paused) {
            audio.pause();
            disableBtns();
            pp.src = './assets/img/play-button.png';
        } else if (audio.paused) {
            if (trackImg.src.includes('no-image-available')) {
                changeSong(true);
            }    
            enableBtns();             
            clearInterval(playInterval);
            playInterval = track;
            playInterval();
            audio.play();
            pp.src = './assets/img/pause.png';
        }        
    });
    moveForvard.addEventListener('click', () => {
        audio.currentTime += 10;
    });

    moveBack.addEventListener('click', () => {
        audio.currentTime -= 10;
    });

    nextTrack.addEventListener('click', () => {
        changeSong(true);
    });

    prevTrack.addEventListener('click', () => {
        changeSong(false);
    });

    shuffle.addEventListener('click', () => {
        shuffle.classList.toggle('active-repeat');
        shuffledSongs = [...trackList].sort(() => Math.random() - 0.5);
        shuffleMode = !shuffleMode;
    })

    volInput.onchange = () => {
        audio.volume = volInput.value / 100;
        volume.innerHTML = volInput.value;
    }

    function changeTimeFromProgress(event) {
        if(mouseDown) {
            audio.currentTime = (audio.duration / progressContainer.offsetWidth) * event.offsetX;
            changeTime();
        }
    }
    function changeTimeFromWithClick(event) { 
        audio.currentTime = (audio.duration / progressContainer.offsetWidth) * event.offsetX;
        changeTime();
    }

    function changeSong(flag) {
        const currentTrackList = shuffleMode ? shuffledSongs : trackList;
        if (flag === true) {
            currentTrack++;
        } else {
            currentTrack--;
        }
        currentTrack = currentTrack > currentTrackList.length - 1 ? 0 : currentTrack < 0 ? currentTrackList.length - 1 : currentTrack;
        audio.src = `./assets/audio/${currentTrackList[currentTrack]}.mp3`;
        changeTrackInfo();
        audio.play();
        audio.onloadedmetadata = () => {
            changeTrackDuration();  
        }
    }

    function changeTime() {
        let firstPart = Math.trunc(audio.currentTime / 60) + '';
        let lastPart = (audio.currentTime % 60).toFixed() + '';
        firstPart = firstPart.length === 1 ? `0${firstPart}` : `${firstPart}`;
        lastPart = lastPart.length === 1 ? `0${lastPart}` : `${lastPart}`;
        time.innerHTML = `${firstPart}.${lastPart}`;
    }

    function changeTrackDuration() {
        let firstPart = Math.trunc(audio.duration / 60) + '';
        let lastPart = (audio.duration % 60).toFixed() + '';
        firstPart = firstPart.length === 1 ? `0${firstPart}` : `${firstPart}`;
        lastPart = lastPart.length === 1 ? `0${lastPart}` : `${lastPart}`;
        duration.innerHTML = `${firstPart}.${lastPart}`;
    }

    function changeTrackInfo() {
        const currentTrackList = shuffleMode ? shuffledSongs : trackList;
        trackImg.src = `./assets/img/track-img/${currentTrackList[currentTrack].split(' - ')[1]}.jpg`;
        author.innerHTML = `Singer: ${currentTrackList[currentTrack].split('-')[0]}`;
        name.innerHTML = `Song title: ${currentTrackList[currentTrack].split('-')[1]}`;
    }

    function disableBtns() {
        prevTrack.disabled = true;
        nextTrack.disabled = true;
        moveForvard.disabled = true;
        moveBack.disabled = true;
        shuffle.disabled = true;
        repeat.disabled = true;
    }

    function enableBtns() {
        prevTrack.disabled = false;
        nextTrack.disabled = false;
        moveForvard.disabled = false;
        moveBack.disabled = false;  
        shuffle.disabled = false;
        repeat.disabled = false;
    }
})