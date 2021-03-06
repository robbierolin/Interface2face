var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var interfacePlayer;
var interfaceNoise;
var noInterfacePlayer;
var playerWindow;
var centreX;
var centreY;
var maxDistance;
var isPlaying = false;
function onYouTubeIframeAPIReady() {
  interfacePlayer = new YT.Player('interfacePlayer', {
    height: '200',
    width: '300',
    videoId: 'lEvXcTYqtKU',
    origin: 'https://www.youtube.com/embed/lEvXcTYqtKU?start=0&end=170&version=3',
  });


  playerWindow = document.getElementById('interfacePlayer').getBoundingClientRect();
  centreX = playerWindow.left + playerWindow.width / 2;
  centreY = playerWindow.top + playerWindow.height / 2;
  maxDistance = Math.abs(document.body.clientHeight - playerWindow.bottom + document.body.clientWidth - playerWindow.right);
  console.log(playerWindow);
  // Canvas.context.fillStyle = "rgba("+200+","+10+","+10+","+(255/255)+")";
  // Canvas.context.fillRect(playerWindow.left - 1, playerWindow.top - 1, 10, 10)
  // Canvas.context.fillRect(playerWindow.right + 1, playerWindow.top - 1, 10, 10)
  // Canvas.context.fillRect(playerWindow.left - 1, playerWindow.bottom - 1, 10, 10)
  // Canvas.context.fillRect(playerWindow.right + 1, playerWindow.bottom - 1, 10, 10)
}

function onXlabsReady() {
  window.addEventListener( "beforeunload", function() {
        xLabs.setConfig( "system.mode", "off" );
    });
  xLabs.setConfig( "system.mode", "learning" );
  xLabs.setConfig( "browser.canvas.paintLearning", "0" ); 
  Canvas.add();
}

var videoTime = 0;
var videoLookingTime = 0;
function onXlabsUpdate() {
  Gaze.update();
  recordGaze();
}
function recordGaze() {
  Canvas.clear();

  if (isPlaying) {    
    // Get gaze position.
    var xs = parseFloat(xLabs.getConfig("state.gaze.estimate.x")); // screen coords
    var ys = parseFloat(xLabs.getConfig("state.gaze.estimate.y")); // screen coords

    if( !xLabs.documentOffsetReady() ) {
      return;
    }

    var x = xLabs.scr2docX( xs ); // document coords
    var y = xLabs.scr2docY( ys ); // document coords

    // Draw gaze point on screen.
    // var ctx = Canvas.context;
    // ctx.fillStyle = "rgba("+100+","+100+","+100+","+(255/255)+")";
    // ctx.fillRect( x, y, 10, 10 );

    // Compare gaze position to video area, if in video area increment videoLookingTime.
    var trackingSuspended = parseInt( xLabs.getConfig( "state.trackingSuspended" ) );

    // Set volume of noise according to distance between gaze and video.
    if (trackingSuspended) {
      // interfaceNoise.setVolume(maxNoiseVolume);
    } else {
      var dist = GazeVideoDistance(x,y);
      // console.log(dist);
      // interfaceNoise.setVolume(maxNoiseVolume * dist / maxDistance);
      // console.log(maxNoiseVolume * dist / maxDistance);
      if (dist == 0) {
        videoLookingTime++;
      }
    }
    videoTime++;
  }
  // window.requestAnimationFrame( function() { recordGaze(); });
}


var GazeVideoDistance = function(x,y) {
  if (x > playerWindow.left && x < playerWindow.right) {
    if (y > playerWindow.top && y < playerWindow.bottom) {
      return 0;
    }
  }

  if (x > playerWindow.right || x < playerWindow.left) {
    if (y > playerWindow.top || y < playerWindow.bottom) {
      return Math.min(Math.abs(x - playerWindow.right), Math.abs(x - playerWindow.left)) + Math.min(Math.abs(y - playerWindow.top), Math.abs(y - playerWindow.bottom));
    } else {
      return Math.min(Math.abs(x - playerWindow.right), Math.abs(x - playerWindow.left));
    }
  } else {
    return Math.min(Math.abs(y - playerWindow.top), Math.abs(y - playerWindow.bottom));
  }
};

document.getElementById("start").addEventListener("click", function() {
  interfacePlayer.playVideo();
  isPlaying = true;
  // xLabs.setup( onXlabsReady, onXlabsUpdate, null, "ed90835d-064a-4f5d-b5bf-1433f4fbcfa9" );
});
document.getElementById("stop").addEventListener("click", function() {
  interfacePlayer.stopVideo();
  console.log(videoLookingTime/videoTime);
  isPlaying = false;
  // xLabs.setup( null, null, null, "ed90835d-064a-4f5d-b5bf-1433f4fbcfa9" );
});

xLabs.setup(onXlabsReady, onXlabsUpdate, null, "ed90835d-064a-4f5d-b5bf-1433f4fbcfa9")