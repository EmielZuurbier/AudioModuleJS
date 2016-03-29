# AudioModuleJS - V0.1
Javascript module for Web Audio API.  
It is designed to make it easier to create sound in the browser.


## How does it work?
This module is built for the AudioContext() API. It has built in object constructors in which you can create sources, effects, panners, audioplayers and controls.  
Download the script and link the script in your site.
```
<script src="AudioModule.js"></script>
<script src="YourScript.js"></script>
```
  
  
### Step 1 - Create a source
Before a audio file can be played, it first has to be loaded into the script with a HTTPRequest and then decoded with the AudioContext().decodeAudioData() method.
This has been built in so that the process is super easy.  
  
First we use the `AudioSource()` constructor, which takes a single parameter, create a source like so:  
```var source = new AudioSource('../path/to/sound.mp3');```  

By doing this we've created an AudioSource that we can use on our player.  
We can also create multiple sources with the `AudioMultiSource()` constructor.  
This constructor takes an array with multiple strings as input:
```var source = new AudioMultiSource(['../path/to/sound1.mp3', '../path/to/sound2.mp3', '../path/to/sound3.mp3'])```
  
The audiosource is stored in the `AudioSource.source` property.
  
  
### Step 2 - Create a player  
The AudioContext works in a way that a BufferSource has to be created everytime a sound is played. You can only start and stop a BufferSource once.
This is why we build the player in a function so that is created everytime you play the sound.  
The player is built with the `AudioPlayer` constructor which takes multiple properties in an object parameter.  
It could look like this. 
**Only the `source: ...` property is mandatory. The AudioPlayer cannot run without a source.**
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
  var player = new AudioPlayer({
    ...
  
  });
  
  player.play({
    destination: effect.source // Push the destination through the effect and to the speakers
  });
}
```
  
  

## All the object constructors

__AudioSource(url);__  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------
url              |*string*   |Yes      |Set the path to the soundfile that you want to store in the variable
- - - -

__AudioMultiSource([url]);__  

parameter        |type       |required |description
-----------------|-----------|---------|---------------------------------------------------------------------------
url              |*string*   |Yes      |Set multiple paths to the soundfile in a array that you want to store in the variable
- - - -

__AudioEffect({options});__  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
type             |*string*   |Yes      |Types of different effects. Options are: *lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch or allpass*
frequency        |*integer*  |No       |Frequency of the filter
Q                |*integer*  |No       |Peaking frequency of filter
destination      |*string*   |No       |Connect destination to other filter, panner or AudioContext.destination  
- - - -

__AudioGain({options});__  

parameter        |type       |required |description
-----------------|-----------|---------|-------------------------------------------------------------
gainValue        |*integer*  |No       |Set the gain.value. Default is 1
destination      |*string*   |No       |Connect destination to other filter, panner or AudioContext.destination 
- - - -

__AudioPan({options});__  

parameter        |type       |required |description
-----------------|-----------|---------|-------------------------------------------------------------
pan              |*integer*  |No       |Set the pan value. -1 is left, 1 is right. Default is 0
destination      |*string*   |No       |Connect destination to other filter, panner or AudioContext.destination
- - - -

__AudioPlayer({options});__  

parameter        |type       |required |description
-----------------|-----------|---------|-------------------------------------------------------------
source           |*string*   |Yes      |Connect the source to the created AudioSource.source
detune           |*value*    |No       |Set a value for detuning the source. Default is 0
loop             |*bool*     |No       |Set loop true or false
loopStart        |*integer*  |No       |If loop is true, start the loop from loopStart
loopEnd          |*integer*  |No       |If loop is true, end the loop at loopEnd
onended          |*callback* |No       |Callback function that is fired when the Audio is finished
name             |*string*   |No       |Give the object a name

__AudioPlayer().play({options});__

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
delay            |*integer*  |No       |Delay set in milliseconds
destination      |*string*   |No       |Connect destination to other filter, panner or AudioContext.destination 


__AudioPlayer().stop({options});__

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
delay            |*integer*  |No       |Delay set in milliseconds

