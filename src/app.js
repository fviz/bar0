const Vue = require("vue");
const {Howl, Howler} = require('howler')



/**
 * Fancy card
 */
Vue.component('podcast-card', {
    props: ['title', 'color', 'currentTitle', 'url'],

    mounted() {
        const podcast = this.$el
        const height = podcast.clientHeight
        const width = podcast.clientWidth

        // We need to do this to force a recalc. The overflow of the back side caused weird bugs in chrome
        const string = 'perspective(500px)'
        podcast.style.transform = string

        podcast.addEventListener('mousemove', e => {
            /*
            * Get position of mouse cursor
            * With respect to the element
            * On mouseover
            */

            /* Store the x position */
            const xVal = e.layerX
            /* Store the y position */
            const yVal = e.layerY

            /*
              * Calculate rotation valuee along the Y-axis
              * Here the multiplier 20 is to
              * Control the rotation
              * You can change the value and see the results
              */
            const yRotation = 20 * ((xVal - width / 2) / width)

            /* Calculate the rotation along the X-axis */
            const xRotation = -20 * ((yVal - height / 2) / height)

            /* Generate string for CSS transform property */
            const string = 'scale(1.1) perspective(500px) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)'

            /* Apply the calculated transformation */
            podcast.style.transform = string
        })

        podcast.addEventListener('mouseover', e => {
            podcast.classList.add('lifted')
        })

        /* Add listener for mouseout event, remove the rotation */
        podcast.addEventListener('mouseout', function () {
            podcast.style.transform = 'perspective(500px) rotateX(0) rotateY(0)'
            podcast.classList.remove('lifted')
        })
    },

    methods: {
        makeCurrent() {
            if (this.currentTitle == this.title) {
                this.$root.currentTitle = null
                this.$root.currentAudioSrc = null
            } else {
                this.$root.currentTitle = this.title
                this.$root.currentAudioSrc = this.url
            }
        }
    },

    computed: {
        filpped() {
            return this.currentTitle ==  this.title
        }
    },

    template: `
          <div class="podcast" @click="makeCurrent">
                <div class="card" :class="{'is-flipped': filpped}" :style="{'--card-color': color}">
                    <div class="card__face card__face--front">
                        <slot name="front"></slot>
                        <div class="podcastTitle">{{title}}</div>
                    </div>
                    <div class="card__face card__face--back">
                        <slot name="back"></slot>
                        <br>
                        <br>
                        <a download :href="url">Download podcast</a>
                        <br>
                    </div>
            </div>
        </div>
    `
})


let sound


let vue = new Vue({
    el: ".app",
    data: {
        currentTitle: null,
        currentAudioSrc: '',
        duration: 0,
        progress: 0,
        loading: false,
        paused: false
    },

    mounted() {
        setInterval(() => {
            if (this.currentAudioSrc && sound) {
                this.progress = sound.seek()
            }
        }, 50)
    },

    methods: {
        scrub(e) {
            const seconds = e.target.value
            console.log(seconds)
            sound.seek(seconds)
        },

        play() {
            sound.play()
            this.paused = false
        },

        pause() {
            sound.pause()
            this.paused = true
        }
    },

    watch: {
        currentAudioSrc(src) {
            /**
             * Always stop the current one
             */
            if (sound) {
                sound.stop()
                Howler.unload()
            }

            /**
             * When we're not closing the player
             */
            if (src != null) {
                this.loading = true
                this.paused = false

                sound = new Howl({
                    src: [src]
                })

                sound.on('load', () => {
                    this.loading = false
                    this.duration = sound.duration()
                });
                sound.play();
            }
        }
    }
});
