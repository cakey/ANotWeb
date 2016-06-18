//Imaginary center line where the other lines move up and down from
//They all begin at the center line, same size, same distance from each other
//The other lines are 6
//The move up and down and to each other, vertical and horiz
//Then there will be horiz lines and triangles which they will move towards
//bounce back and forth from

//Make 6 lines in the middle, equal distance from each other
//Make the lines move toward each other
//Make the lines bigger and smaller
//Make the lines go up and down
//Small horizontal lines appear
//Make vertical lines move towards horizontal lines, up and down
//Make triangles, same


my_interface = (function() {
    var ready = function(fn) {

        // Sanity check
        if (typeof fn !== 'function') {
            return;
        }

        // If document is already loaded, run method
        if (document.readyState === 'complete') {
            return fn();
        }

        // Otherwise, wait until document is loaded
        // The document has finished loading and the document has been parsed but sub-resources such as images, stylesheets and frames are still loading.
        // The state indicates that the DOMContentLoaded event has been fired.
        document.addEventListener('DOMContentLoaded', fn, false);

    };

    var main = function() {
        console.log("running main"); //skrifar i console
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        var state = {
            lines: [
                [0.5, 0.4, 0.5, 0.6], ///essi lina a ad hverfa
                [0.5, 0.4, 0.5, 0.6],
                [0.5, 0.4, 0.5, 0.6],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]
        }
        var needsRedraw = true;

        var startTime = new Date();
        var lastTime = new Date();

        function initialize() {
            window.addEventListener('resize', resizeCanvas, false);
            resizeCanvas();
            setInterval(redraw, 20);
            setInterval(update, 20);
        }

        function update() {
            var currentTime = new Date();
            var sinceStart = currentTime - startTime;

            var evenSecond = sinceStart % 2000 < 1000;
            needsRedraw = false;
            var waitTime = 50;
            if (sinceStart < 5000 + waitTime && sinceStart > waitTime) {
                var prop = ((sinceStart - waitTime) / 5000)
                    //change x
                state.lines[1][0] = 0.5 - (0.15 * prop)
                state.lines[1][2] = 0.5 - (0.15 * prop)
                state.lines[2][0] = 0.5 + (0.15 * prop)
                state.lines[2][2] = 0.5 + (0.15 * prop)

                //change y
                state.lines[1][1] = 0.4 - (0.15 * prop)
                state.lines[1][3] = 0.6 + (0.15 * prop)
                state.lines[2][1] = 0.4 - (0.15 * prop)
                state.lines[2][3] = 0.6 + (0.15 * prop)
                needsRedraw = true;
            }
            if (sinceStart > 5000 + waitTime && state.lines[3][0] == 0) {
                state.lines[3] = [0.3, 0.2, 0.4, 0.2]
                state.lines[4] = [0.6, 0.2, 0.7, 0.2]
                state.lines[5] = [0.3, 0.8, 0.4, 0.8]
                state.lines[6] = [0.6, 0.8, 0.7, 0.8]
                needsRedraw = true;
            }
            if (sinceStart > 5000 + waitTime && state.lines[3][0] != 0 && sinceStart < 6000 + waitTime) {
                var prop = ((sinceStart - waitTime - 5000) / 1000)
                state.lines[3][0] = 0.35 - (0.05 * prop)
                state.lines[3][2] = 0.35 + (0.05 * prop)
                state.lines[4][0] = 0.65 - (0.05 * prop)
                state.lines[4][2] = 0.65 + (0.05 * prop)
                state.lines[5][0] = 0.35 - (0.05 * prop)
                state.lines[5][2] = 0.35 + (0.05 * prop)
                state.lines[6][0] = 0.65 - (0.05 * prop)
                state.lines[6][2] = 0.65 + (0.05 * prop)

                needsRedraw = true;
            }

            lastTime = currentTime

        }

        function redraw() {
            if (!needsRedraw) {
                return
            }
            console.log("redraw");

            width = canvas.width;
            height = canvas.height;

            context.clearRect(0, 0, width, height);

            state.lines.forEach(function(line, i) {
                context.beginPath();
                context.moveTo(width * line[0], height * line[1]);
                context.lineTo(width * line[2], height * line[3]);
                context.stroke();

            });
            needsRedraw = false;

        }

        // Runs each time the DOM window resize event fires.
        // Resets the canvas dimensions to match window,
        // then draws the new borders accordingly.
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            needsRedraw = true;
            redraw();
        }

        initialize();


    };
    ready(main);

    return {
        hello: function() {
            console.log("hello world");
        }
    }

})();
