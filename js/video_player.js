class VideoPlayerBasic {
  constructor(settings) {
    this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings);
    this._videoContainer = null;
    this._video = null;
    this._toggleBtn = null;
    this._progress = null;
    this._mouseDown = false;
  }

/*
* @desc checks if the video and container are transferred, creates markup and adds it to the page, finds all controls, sets event handlers
* @param (*) 
* @returns (*) 
*/

  init() {
    // Проверить передані ли  видео и контейнер
    if (!this._settings.videoUrl) return console.error("Передайте адрес видео");
    if (!this._settings.videoPlayerContainer) return console.error("Передайте селектор контейнера");
    
    // Создадим разметку и добавим ее на страницу
    this._addTemplate();
    // Найти все элементы управления
    this._setElements();
    // Установить обработчики событий
    this._setEvents();
  }

/*
* @desc switches from pause to play and vice versa
* @param (*) 
* @returns (*) 
*/

  toggle() {
    const method = this._video.paused ? 'play' : 'pause';
    this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
    this._video[method]();
  }

/*
* @desc sets the progress bar style
* @param (*) 
* @returns (*)
*/

  _handlerProgress() {
    const percent = (this._video.currentTime / this._video.duration) * 100;
    this._progress.style.flexBasis = `${percent}%`;
  }

/*
* @desc rewinds video
* @param (e) 
* @returns (*) 
*/
  _scrub(e) {
    this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
  }

/*
* @desc sets the volume
* @param (e) 
* @returns (*) 
*/

  _volume(e) {
    this._video.volume = (e.offsetX / this._volumeInput.offsetWidth);
  }

/*
* @desc sets the playback rate
* @param (e) 
* @returns (*) 
*/

  _playbackRate(e) {
    this._video.playbackRate = (e.offsetX / this._playbackRateInput.offsetWidth) * 3;
  }

/*
* @desc rewind video forward
* @param (e) 
* @returns (*) 
*/

  _skipNext(e) {
    this._video.currentTime = this._video.currentTime + this._settings.skipNext;
  }

/*
* @desc rewind video back
* @param (e) 
* @returns (*) 
*/

  _skipPrev(e) {
    this._video.currentTime = this._video.currentTime + this._settings.skipPrev;
  }

/*
* @desc finds items
* @param () 
* @returns (*) 
*/

  _setElements() {
    this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
    this._video = this._videoContainer.querySelector('video');
    this._toggleBtn = this._videoContainer.querySelector('.toggle');
    this._progress = this._videoContainer.querySelector('.progress__filled');
    this._progressContainer = this._videoContainer.querySelector('.progress');
    this._volumeInput = this._videoContainer.querySelector('input[name="volume"]');
    this._playbackRateInput = this._videoContainer.querySelector('input[name="playbackRate"]');
    this._skipNextBtn = this._videoContainer.querySelector('.player__button2');
    this._skipPrevBtn = this._videoContainer.querySelector('.player__button1');
    this._viewer = this._videoContainer.querySelector('.player');
  }

/*
* @desc sets event handlers
* @param () 
* @returns (*) 
*/

  _setEvents() {
    this._video.addEventListener('click', () => this.toggle());
    this._toggleBtn.addEventListener('click', () => this.toggle());
    this._video.addEventListener('timeupdate', () => this._handlerProgress());
    this._progressContainer.addEventListener('click', (e) => this._scrub(e));
    this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._scrub(e));
    this._progressContainer.addEventListener('mousedown', (e) => this._mouseDown = true);
    this._progressContainer.addEventListener('mouseup', (e) => this._mouseDown = false);
    this._volumeInput.addEventListener('click', (e) => this._volume(e));
    this._volumeInput.addEventListener('mousemove', (e) => this._mouseDown && this._volume(e));
    this._volumeInput.addEventListener('mousedown', (e) => this._mouseDown = true);
    this._volumeInput.addEventListener('mouseup', (e) => this._mouseDown = false);
    this._playbackRateInput.addEventListener('click', (e) => this._playbackRate(e));
    this._playbackRateInput.addEventListener('mousemove', (e) => this._mouseDown && this._playbackRate(e));
    this._playbackRateInput.addEventListener('mousedown', (e) => this._mouseDown = true);
    this._playbackRateInput.addEventListener('mouseup', (e) => this._mouseDown = false);
    this._skipNextBtn.addEventListener('click', (e) => this._skipNext(e));
    this._skipPrevBtn.addEventListener('click', (e) => this._skipPrev(e));
    this._viewer.addEventListener ('dblclick', (e) => {
      if (e.offsetX > 120) {
        this._skipNext(e)
      } else {
        this._skipPrev(e)
      }
    });
  }

/*
* @desc adds markup to the page
* @param () 
* @returns (*) 
*/

  _addTemplate() {
    const template = this._createVideoTemplate();
    const container = document.querySelector(this._settings.videoPlayerContainer);
    container ? container.insertAdjacentHTML("afterbegin", template) : console.error('контейнер не найден');
  }

/*
* @desc creates markup 
* @param () 
* @returns (*) 
*/

  _createVideoTemplate() {
    return `
    <div class="player">
      <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
      <div class="player__controls">
        <div class="progress">
        <div class="progress__filled"></div>
        </div>
        <button class="player__button toggle" title="Toggle Play">►</button>
        <input type="range" name="volume" class="player__slider" min=0 max="1" step="0.05" value="${this._settings.volume}">
        <input type="range" name="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="${this._settings.playbackRate}">
        <button data-skip="${this._settings.skipPrev}" class="player__button1">« ${this._settings.skipPrev}s</button>
        <button data-skip="${this._settings.skipNext}" class="player__button2">${this._settings.skipNext}s »</button>
      </div>
    </div>
    `;
  }

/*
* @desc sets default settings
* @param () 
* @returns {settings}
*/

  static getDefaultSettings() {
      /**
       * Список настроек
       * - адрес видео
       * - тип плеера "basic", "pro"
       * - controls - true, false
       */
      return {
        videoUrl: '',
        videoPlayerContainer: '.myplayer',
        volume: 1,
        playbackRate: 1,
        skipNext: 2,
        skipPrev: -2
      }
  }
}

const myPlayer = new VideoPlayerBasic({
videoUrl: 'video/mov_bbb.mp4',
videoPlayerContainer: 'body',
skipNext: 2,
skipPrev: -2
});

myPlayer.init();