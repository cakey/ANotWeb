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


var ready = function ( fn ) {

    // Sanity check
    if ( typeof fn !== 'function' ) {
      return;
    }

    // If document is already loaded, run method
    if ( document.readyState === 'complete'  ) {
        return fn();
    }

    // Otherwise, wait until document is loaded
    // The document has finished loading and the document has been parsed but sub-resources such as images, stylesheets and frames are still loading.
    // The state indicates that the DOMContentLoaded event has been fired.
    document.addEventListener( 'DOMContentLoaded', fn, false );

};

var main = function(){
  console.log("running main");
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  context.beginPath();
  context.moveTo(100, 150);
  context.lineTo(450, 50);
  context.stroke();
};

ready(main);
