Anim = (function() {
    var mergeState = function(state1, state2) {
        state2.lines.forEach(function(line) {
            state1.lines.push(line);
        });
        return state1;
    }

    var LineAnim = function(start, end, duration, remain) {
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
                lines: [
                    [
                        this.start[0] * (1 - perc) + this.end[0] * perc,
                        this.start[1] * (1 - perc) + this.end[1] * perc,
                        this.start[2] * (1 - perc) + this.end[2] * perc,
                        this.start[3] * (1 - perc) + this.end[3] * perc,
                    ]
                ]
            }
        } else {
            if (this.remain) {
                return {
                    lines: [this.end]
                }
            } else {
                return {
                    lines: []
                }
            }
        }
    }
    LineAnim.prototype.done = function(duration) {
        return duration > this.totDuration;
    }
    LineAnim.prototype.duration = function() {
        return this.totDuration;
    }

    var SimulAnim = function(animations, duration, remain) {
        this.animations = animations;
        this.remain = remain;
    };
    SimulAnim.prototype.get = function(duration) {
        var state = {
            lines: []
        };
        this.animations.forEach(function(anim) {
            var stateToAdd = anim.get(duration);
            stateToAdd.lines.forEach(function(line) {
                state.lines.push(line);
            });
        });
        return state;
    }
    SimulAnim.prototype.done = function(duration) {
        this.animations.forEach(function(anim) {
            if (!anim.done(duration)) {
                return false;
            }
        })
        return true;
    }
    SimulAnim.prototype.duration = function() {
        var d = 0;
        this.animations.forEach(function(anim) {
            d = Math.max(d, anim.duration());
        });
        return d;
    }

    var ConsecAnim = function(animations) {
        this.animations = animations;
        this.lastStart = 0;
    };
    ConsecAnim.prototype.get = function(duration) {
        var currState = {
            lines: []
        }
        for (var i = 0; i < this.animations.length; i++) {
            var d = this.animations[i].duration();
            if (duration > d) {
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
        this.animations.forEach(function(anim) {
            d += anim.duration();
        });
        return d;
    }

    var WaitAnim = function(duration) {
        this.totDuration = duration;
    };
    WaitAnim.prototype.get = function() {
        return {
            lines: []
        };
    };
    WaitAnim.prototype.done = function(duration) {
        return duration > this.duration();
    };
    WaitAnim.prototype.duration = function() {
        return this.totDuration;
    };

    return  {
      Line: LineAnim,
      Simul: SimulAnim,
      Consec: ConsecAnim,
      Wait: WaitAnim
    }
})()
