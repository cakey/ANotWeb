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

    var leftXMid = 0.35;
    var leftXExpandFinal = [leftXMid, 0.4 - 0.15, leftXMid, 0.6 + 0.15];
    var topHorBord = 0.05;
    var botHorBord = 0.95;


    var rightExpandLine = new Anim.Line(
        [0.5, 0.4, 0.5, 0.6], [0.5 + 0.15, 0.4 - 0.15, 0.5 + 0.15, 0.6 + 0.15],
        1000,
        true
    );
    var centExpandAnim = new Anim.Simul(
        [new Anim.Line(
                [0.5, 0.4, 0.5, 0.6], leftXExpandFinal,
                1000,
                true
            ),
            rightExpandLine
        ],
        null,
        true
    )

    var centExpandAnim2 = new Anim.Simul(
        [new Anim.Line(
                [0.5, 0.4, 0.5, 0.6], [0.5 - 0.3, 0.4 - 0.3, 0.5 - 0.3, 0.6 + 0.3],
                4000, //hraði vinstri lína
                true
            ),
            new Anim.Line(
                [0.5, 0.4, 0.5, 0.6], [0.5 + 0.3, 0.4 - 0.3, 0.5 + 0.3, 0.6 + 0.3],
                4000, //hraði hægri lína
                true
            )
        ],

        null,
        true
    )

    var covExpandAnim = new Anim.Simul(
        [new Anim.Line(
                [leftXMid, topHorBord, leftXMid, topHorBord], [leftXMid - 0.03, topHorBord, leftXMid + 0.03, topHorBord],
                1000,
                true
            ),
            new Anim.Line(
                [0.65, topHorBord, 0.65, topHorBord], [0.65 - 0.03, topHorBord, 0.65 + 0.03, topHorBord],
                1000,
                true
            ),
            new Anim.Line(
                [leftXMid, botHorBord, leftXMid, botHorBord], [leftXMid - 0.03, botHorBord, leftXMid + 0.03, botHorBord],
                1000,
                true
            ),
            new Anim.Line(
                [0.65, botHorBord, 0.65, botHorBord], [0.65 - 0.03, botHorBord, 0.65 + 0.03, botHorBord],
                1000,
                true
            ),
        ],
        null,
        true
    )
    var outwards = new Anim.Consec([
        centExpandAnim,
        centExpandAnim2,
        covExpandAnim,
    ], null, false)

    var smallSlideUp = new Anim.Line([leftXMid, botHorBord-0.1, leftXMid, botHorBord], [leftXMid, topHorBord, leftXMid, topHorBord+0.1], 5000, false);
    var makeSmallSlideUpDown = new Anim.Consec([
        new Anim.Line(leftXExpandFinal, [leftXMid, 0.45, leftXMid, 0.55], 5000, false),
        new Anim.Line([leftXMid, 0.45, leftXMid, 0.55], [leftXMid, botHorBord-0.1, leftXMid, botHorBord], 2500, false),
        new Anim.Repeat(new Anim.Consec([ smallSlideUp, new Anim.Reverse(smallSlideUp)]), 10)
        ], null, true)


    var slide = new Anim.Simul([
            new Anim.Final(covExpandAnim, null, true),
            new Anim.Final(rightExpandLine, null, true),
            new Anim.Final(centExpandAnim2, null, true),
            makeSmallSlideUpDown
        ], null, true)


    var main = new Anim.Consec([
        new Anim.Wait(5000),
        outwards,
        slide,
    ], null, true)

    var root = new Anim.Simul(
        [main, new Anim.Line([0.5, 0.4, 0.5, 0.6], [0.5, 0.4, 0.5, 0.6], 1000, true)]
    )
    root = new Anim.Speed(root, 1);

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


            context.fillStyle = "#444249";
            context.fillRect(0, 0, width, height);

            state.lines.forEach(function(line, i) {
                context.beginPath();
                context.moveTo(width * line[0], height * line[1]);
                context.lineTo(width * line[2], height * line[3]);
                context.strokeStyle = "#ffffff";
                context.lineWidth = 3;
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
    main();

    return {
        hello: function() {
            console.log("hello world");
        }
    }

})();
