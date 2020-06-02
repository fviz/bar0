const Vue = require("vue");

let vue = new Vue({
    el: ".app",
    data: {
        message: " hello "
    }
});


/** 
 * Fancy card
 */
addEventListener('load', () => {
    const podcasts = document.querySelectorAll('.podcast')
    for (const podcast of podcasts) {
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
            const string = 'perspective(500px) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)'

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
    }
    
    const cards = document.querySelectorAll('.card')
    for (const card of cards) {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    }
})