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

    var centExpandAnim = new Anim.Simul(
        [new Anim.Line(
                [0.5, 0.4, 0.5, 0.6], [0.5 - 0.15, 0.4 - 0.15, 0.5 - 0.15, 0.6 + 0.15],
                5000,
                true
            ),
            new Anim.Line(
                [0.5, 0.4, 0.5, 0.6], [0.5 + 0.15, 0.4 - 0.15, 0.5 + 0.15, 0.6 + 0.15],
                5000,
                true
            )
        ],
        null,
        true
    )
    var covExpandAnim = new Anim.Simul(
        [new Anim.Line(
                [0.35, 0.15, 0.35, 0.15], [0.35 - 0.03, 0.15, 0.35 + 0.03, 0.15],
                1000,
                true
            ),
            new Anim.Line(
                [0.65, 0.15, 0.65, 0.15], [0.65 - 0.03, 0.15, 0.65 + 0.03, 0.15],
                1000,
                true
            ),
            new Anim.Line(
                [0.35, 0.85, 0.35, 0.85], [0.35 - 0.03, 0.85, 0.35 + 0.03, 0.85],
                1000,
                true
            ),
            new Anim.Line(
                [0.65, 0.85, 0.65, 0.85], [0.65 - 0.03, 0.85, 0.65 + 0.03, 0.85],
                1000,
                true
            ),
        ],
        null,
        true
    )
    var main = new Anim.Consec([
        (new Anim.Wait(5000)),
        centExpandAnim,
        new Anim.Repeat(covExpandAnim, 5, null, true),
    ], null, true)

    var root = new Anim.Simul(
        [main, new Anim.Line([0.5, 0.4, 0.5, 0.6], [0.5, 0.4, 0.5, 0.6], 1000, true)]
    )
    var main = function() {
        console.log("running main"); //skrifar i console
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        var state = {
            lines: []
        }
        var lastState = {
            lines: []
        }
        var skip = 5000;
        var startTime = new Date();

        function initialize() {
            window.addEventListener('resize', resizeCanvas, false);
            resizeCanvas();
            setInterval(redraw, 20);
            setInterval(update, 20);
        }

        function update() {
            var currentTime = new Date();
            var sinceStart = currentTime - startTime + skip;

            state = root.get(sinceStart);

        }

        function redraw(force) {

            var needsRedraw = false
            if (state.lines.length !== lastState.lines.length) {
                needsRedraw = true;
            } else {
                for (var i = 0; i < state.lines.length; i++) {
                    for (var j = 0; j < 4; j++) {
                        if (state.lines[i][j] !== lastState.lines[i][j]) {
                            needsRedraw = true;
                        }
                    }
                }
            }

            if (!(needsRedraw || force)) {
                return
            }
            console.log("redraw");

            width = canvas.width;
            height = canvas.height;


            context.fillStyle = "#444444";
            context.fillRect(0, 0, width, height);

            state.lines.forEach(function(line, i) {
                context.beginPath();
                context.moveTo(width * line[0], height * line[1]);
                context.lineTo(width * line[2], height * line[3]);
                context.strokeStyle = "#ffffff";
                context.lineWidth = 4;
                context.lineCap = "round";
                context.stroke();

            });
            lastState = state;

        }

        // Runs each time the DOM window resize event fires.
        // Resets the canvas dimensions to match window,
        // then draws the new borders accordingly.
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            redraw(true);
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
