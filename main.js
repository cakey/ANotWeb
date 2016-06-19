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

    var mergeState = function(state1, state2) {
        state2.lines.forEach(function(line){
            state1.lines.push(line);
        });
        return state1;
    }

    var LineAnim = function(start, end, duration, remain){
        //start and end are [x1%, y1%, x2%, y2%]
        // duration is how long we transition from start to end
        // remain is if we keep the line after duration is finished or delete it
        this.start = start;
        this.end = end;
        this.totDuration = duration;
        this.remain = remain;
    };
    LineAnim.prototype.get = function(duration) {
        var perc = duration / this.totDuration;
        if (perc <= 1) {
            return {
                lines: [[
                this.start[0]*(1-perc) + this.end[0]*perc,
                this.start[1]*(1-perc) + this.end[1]*perc,
                this.start[2]*(1-perc) + this.end[2]*perc,
                this.start[3]*(1-perc) + this.end[3]*perc,
            ]]
            }
        } else {
            if (this.remain) {
                return {
                    lines: [this.end]
                }
            } else {
                return {lines: []}
            }
        }
    }
    LineAnim.prototype.done = function(duration) {
        return duration > this.totDuration;
    }
    LineAnim.prototype.duration = function() {
        return this.totDuration;
    }

    var SimulAnim = function(animations, duration, remain){
        this.animations = animations;
        this.remain = remain;
    };
    SimulAnim.prototype.get = function(duration){
        var state = {lines:[]};
        this.animations.forEach(function(anim){
            var stateToAdd = anim.get(duration);
            stateToAdd.lines.forEach(function(line){
                state.lines.push(line);
            });
        });
        return state;
    }
    SimulAnim.prototype.done = function(duration){
        this.animations.forEach(function(anim){
            if (!anim.done(duration)) {
                return false;
            }
        })
        return true;
    }
    SimulAnim.prototype.duration = function() {
        var d = 0;
        this.animations.forEach(function(anim){
            d = Math.max(d, anim.duration());
        });
        return d;
    }

    var ConsecAnim = function(animations){
        this.animations = animations;
        this.lastStart = 0;
    };
    ConsecAnim.prototype.get = function(duration){
        var currState = {lines:[]}
        for (var i=0; i<this.animations.length; i++){
            var d = this.animations[i].duration();
            if (duration > d){
                if (this.animations[i].remain) {
                    var addState = this.animations[i].get(duration);
                    currState = mergeState(currState, addState);
                }
                duration -= d;
            } else {
                var addState = this.animations[i].get(duration);
                currState = mergeState(currState, addState);
                break;
            }
        }
        return currState;
    }
    ConsecAnim.prototype.done = function(duration) {
        return duration > this.duration();
    }
    ConsecAnim.prototype.duration = function() {
        var d = 0;
        this.animations.forEach(function(anim){
            d += anim.duration();
        });
        return d;
    }

    var WaitAnim = function(duration){
        this.totDuration = duration;
    };
    WaitAnim.prototype.get = function(){
        return {lines:[]};
    };
    WaitAnim.prototype.done = function(duration){
        return duration > this.duration();
    };
    WaitAnim.prototype.duration = function() {
        return this.totDuration;
    };

    var centExpandAnim = new SimulAnim(
        [new LineAnim(
            [0.5, 0.4, 0.5, 0.6],
            [0.5-0.15, 0.4-0.15, 0.5-0.15, 0.6+0.15],
            1000,
            true
        ),
        new LineAnim(
            [0.5, 0.4, 0.5, 0.6],
            [0.5+0.15, 0.4-0.15, 0.5+0.15, 0.6+0.15],
            1000,
            true
        )],
        null,
        true
    )
    var covExpandAnim = new SimulAnim(
        [new LineAnim(
            [0.35, 0.2, 0.35, 0.2],
            [0.35-0.05, 0.2, 0.35+0.05, 0.2],
            1000,
            true
        ),
        new LineAnim(
            [0.65, 0.2, 0.65, 0.2],
            [0.65-0.05, 0.2, 0.65+0.05, 0.2],
            1000,
            true
        ),
        new LineAnim(
            [0.35, 0.8, 0.35, 0.8],
            [0.35-0.05, 0.8, 0.35+0.05, 0.8],
            1000,
            true
        ),
        new LineAnim(
            [0.65, 0.8, 0.65, 0.8],
            [0.65-0.05, 0.8, 0.65+0.05, 0.8],
            1000,
            true
        ),
        ],
        null,
        true
    )
    var main = new ConsecAnim([
      (new WaitAnim(5000)),
      centExpandAnim,
      covExpandAnim
    ], null, true)

    var root = new SimulAnim(
      [main, new LineAnim([0.5,0.4, 0.5, 0.6], [0.5,0.4, 0.5, 0.6], 1000, true)]
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
                        for (var j = 0; j < 4; j++){
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
