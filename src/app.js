const Vue = require("vue");




/**
 * Fancy card
 */
Vue.component('podcast-card', {
    props: ['title', 'color', 'currentTitle'],

    mounted() {
        const podcast = this.$el
        const height = podcast.clientHeight
        const width = podcast.clientWidth

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
            } else {
                this.$root.currentTitle = this.title
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
                    </div>
            </div>
        </div>
    `
})


let vue = new Vue({
    el: ".app",
    data: {
        currentTitle: null,
        currentAudioSrc: null,
        duration: null,
        progress: null
    }
});
