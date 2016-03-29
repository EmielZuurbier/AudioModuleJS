# AudioModuleJS
Javascript module for Web Audio API. It is designed to make it easier to create and play sounds by creating Audio objects.


## How does it work?
This module is built for the AudioContext() API. It has built in object constructors in which you can create sources, effects, panners, audioplayers and controls.  
Download the script and load it in your site.

### Step 1 - Create a source
Before a audio file can be played, it first has to be loaded into the script with a HTTPRequest and then decoded with the AudioContext().decodeAudioData() method.
This has been built in so that the process is super easy.  
  
First we create a source like so:  
```var source = new AudioSource('../path/to/sound.mp3');```  

By doing this we've created an AudioSource that we can use on our player.  

### Step 2 - Create a player  
The AudioContext works in a way that a BufferSource has to be created everytime a sound is played. You can only start and stop a BufferSource once.
This is way we build the player in a function. It could look like this.  
**Only the `source: ...` options is mandatory. The AudioPlayer cannot run without a source.**
```
var source = new AudioSource('../path/to/sound.mp3');

function PlaySound() {
  var player = new AudioPlayer({
    name: 'note',
    source: source.buffer,
    detune: 100,
    loop: true,
    loopStart: 7000,
    loopEnd: 9000,
    playbackRate: 1.2,
    onended: function () {
      console.log(this.name + ' has stopped playing');
    }
  });
  
  player.play()
}
```

### Step 3 (optional) - Create effects and panner  
With the AudioContext comes great possibilities. We can create effects that we can customize and manipulate and the sound. Pretty cool huh?
We'll do this by creating a new AudioEffect object like so:  

**Note:**  
When you initiate AudioPlayer.play method, you have to give it a 'destination' parameter.  
This way the sounds goes like this:  
*AudioPlayer -> effect -> AudioContext().destination*  

```
var source = new AudioSource('../path/to/sound.mp3');

var effect = new AudioEffect({
  type: 'highpass',
  frequency: 3000
});

function PlaySound() {
  
    ...
  
  });
  
  player.play({
    destination: effect // Push the destination through the effect and to the speakers
  });
}
```




### All the object constructors

__AudioSource(url);__  

parameter        |type       |description
-----------------|-----------|--------------------------------------------------------------------
url              |*string*   |Set the path to the soundfile that you want to store in the variable
- - - -

__AudioMultiSource([url]);__  

parameter        |type       |description
-----------------|-----------|-------------------------------------------------------------------------------------
url              |*string*   |Set multiple paths to the soundfile in a array that you want to store in the variable
- - - -

__AudioEffect({options});__  

parameter        |type       |description
-----------------|-----------|---------------------------------------------------------------------------
type             |*string*   |Types of different effects. Options are: *lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch or allpass*
frequency        |*integer*  |Frequency of the filter
Q                |*integer*  |Peaking frequency of filter
destination      |*string*   |Connect destination to other filter, panner or AudioContext.destination  
- - - -

__AudioGain({options});__  

parameter        |type       |description
-----------------|-----------|-----------------------------------------------------------------------
gainValue        |*integer*  |Set the gain.value. Default is 1
destination      |*string*   |Connect destination to other filter, panner or AudioContext.destination 
- - - -

__AudioPan({options});__  

parameter        |type       |description
-----------------|-----------|-----------------------------------------------------------------------
pan              |*integer*  |Set the pan.value. Default is 0
destination      |*string*   |Connect destination to other filter, panner or AudioContext.destination
- - - -

__AudioPlayer({options});__  

parameter        |type       |description
-----------------|-----------|-----------------------------------------------------------------------
source           |*string*   |Connect the source to the created AudioSource.source
detune           |*value*    |Set a value for detuning the source. Default is 0
loop             |*bool*     |Set loop true or false
loopStart        |*integer*  |If loop is true, start the loop from loopStart
loopEnd          |*integer*  |If loop is true, end the loop at loopEnd
onended          |*callback* |Callback function that is fired when the Audio is finished
name             |*string*   |Give the object a name

__AudioPlayer().play({options});__

parameter        |type       |description
-----------------|-----------|---------------------------------------------------------------------------
delay            |*integer*  |Delay set in milliseconds
destination      |*string*   |Connect destination to other filter, panner or AudioContext.destination 


__AudioPlayer().stop({options});__

parameter        |type       |description
-----------------|-----------|---------------------------------------------------------------------------
delay            |*integer*  |Delay set in milliseconds

