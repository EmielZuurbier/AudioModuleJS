# AudioModuleJS - V0.2
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
  
First we use the `AudioSource()` constructor, which takes two parameter (url, callback), create a source like so:  
```var source = new AudioSource('../path/to/sound.mp3');```  

By doing this we've created an AudioSource that we can use on our player.  
**The soundfile has been decoded and stored in `AudioSource.buffer`.**  
  
**Note:** the callback parameter is optional and fires when the loading is done.

We can also create multiple sources with the `AudioMultiSource()` constructor.  
This constructor takes an array with multiple strings, a callback, and a callLast parameter as input:  
```var source = new AudioMultiSource(['../path/to/sound1.mp3', '../path/to/sound2.mp3', '../path/to/sound3.mp3'])```
  
  
### Step 2 - Create a player  
The AudioContext works in a way that a BufferSource has to be created everytime a sound is played. You can only start and stop a BufferSource once.
This is why we build the player in a function so that is created everytime you play the sound.  
The player is built with the `AudioPlayer()` constructor which takes multiple properties in an object parameter.  
It could look like this:  

**Note: Only the `source: ...` property is mandatory. The AudioPlayer cannot run without a source.**
```
var sound = new AudioSource('../path/to/sound.mp3');

function PlaySound() {
  var player = new AudioPlayer({
    name: 'note',
    source: sound.buffer,
    detune: 100,
    loop: true,
    loopStart: 7000,
    loopEnd: 9000,
    playbackRate: 1.2,
    onended: function () {
      console.log(this.name + ' has stopped playing');
    }
  }).play();
}
```
  
  
  
### Step 3 (optional) - Create effects and panner  
With the AudioContext comes great possibilities. We can create effects that we can customize and manipulate and the sound. Pretty cool huh?
We'll do this by creating a new AudioEffect object like so: 
```
var effect = new AudioEffect({
  type: 'bandpass'
});
```

**Note:** To connect the AudioPlayer with the AudioFilter, give the AudioPlayer.play method a 'destination' property which links to the AudioFilter. The example below shows how to connect the two.  
  
This way the sounds goes like this:  
*AudioPlayer -> AudioEffect -> AudioContext().destination*  
  
**Example:**

```
var sound = new AudioSource('../path/to/sound.mp3'); // Create AudioSource

var effect = new AudioEffect({ // Create new effect of type: highpass
  type: 'highpass',
  frequency: 3000
});

function PlaySound() {
  var player = new AudioPlayer({ // Create new AudioPlayer
    source: sound.buffer
  });
  
  player.play({
    destination: effect// Connect the AudioPlayer to the effect
  });
}
```
  
### Step 4 (optional) - Create a Convolver  
So a convolver is basically an equasion that takes two soundswaves and creates a new one out of the average. This way we can reshape the sound and add a reverb for example.  
The `AudioConvolver()` constructor does this for you. Create a new `AudioConvoler` with a source property in an object as parameter and link your `AudioPlayer()` to the `AudioConvolver()`.  
  
The example below shows how you can do that. We've also used the `AudioMultiSource()`' callback to create and play them as soon as the sounds are loaded. Be sure to set the third parameter of the `AudioMultiSource()` to true so that the convolver and player are created after the last url has been loaded.  
  
**Example:**  
```
var source = new AudioMultiSource(['../path/to/reverb.mp3', '../path/to/melody.mp3'], function () {
    
  var reverb = new AudioConvolver({
      source: source.buffer[0],
      normalize: true
  });
  
  var melody = new AudioPlayer({
      source: source.buffer[1]
  });
  
  melody.play({
      destination: convolver
  });
    
}, true);
```  


## Full overview

**AudioSource(url, callback);**  
Constructor takes two parameters in which the path or url to the sound file (.mp3, .ogg, etc.) and a callback is given.
The object decodes the audiofile to a usable audio source object.  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------
url              |*string*   |Yes      |Set the path to the soundfile that you want to store in the variable
callback         |*function* |No       |Callback function for when loading is finished
- - - -

**AudioMultiSource([url], callback, callLast);**  
Decodes multiple sources and saves these in the AudioMultiSource.source. The AudioMultiSource has 3 parameters. The *url* parameter takes an array of strings that lead to the selected soundfiles. *callback* fires a callback function after every sound has been fetched and loaded. *callLast* is a boolean that indicates if the callback has to be fired with every load, or only the last load.  

parameter        |type       |required |description
-----------------|-----------|---------|---------------------------------------------------------------------------
url              |*string*   |Yes      |Set multiple paths to the soundfile in a array that you want to store in the variable
callback         |*function* |No       |Callback function for when loading is finished  
callLast         |*bool*     |No       |true: The callback is fired after the last url is loaded. false: The callback is fired after every loaded url. Default = false
- - - -

**AudioEffect({options});**  
Creates an Effect node which manipulates the sound.  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
type             |*string*   |Yes      |Types of different effects. Options are: *"lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch" or "allpass"*
frequency        |*integer*  |No       |Frequency of the filter
Q                |*integer*  |No       |Peaking frequency of filter
destination      |*string*   |No       |Connect destination to effect, gain, etc. or leave blank for AudioContext().destination   
- - - -

**AudioGain({options});**  
Creates a GainNode which can change levels like volume or intesity.  

parameter        |type       |required |description
-----------------|-----------|---------|-------------------------------------------------------------
gainValue        |*integer*  |No       |Set the gain.value. Default is 1
destination      |*string*   |No       |Connect destination to effect, gain, etc. or leave blank for AudioContext().destination  
- - - -

**AudioPan({options});**  
Creates a StereoPannerNode which enables stereopanning.  

parameter        |type       |required |description
-----------------|-----------|---------|-------------------------------------------------------------
pan              |*integer*  |No       |Set the pan value. -1 is left, 1 is right. Default is 0
destination      |*string*   |No       |Connect destination to effect, gain, etc. or leave blank for AudioContext().destination 
- - - -

**AudioDistortion({options});**  
Creates a DistortionNode for distortion  

parameter        |type       |required |description
-----------------|-----------|---------|-------------------------------------------------------------
curve            |*integer*  |No       |Sets the distortion curve
oversample       |*string*   |No       |Distortion oversampling. Options are: *"none", "2x", "4x". Default = "none"*
destination      |*string*   |No       |Connect destination to effect, gain, etc. or leave blank for AudioContext().destination 
- - - -

**AudioConvolver({options});**  
Creates a Convolvernode which makes a delay.  
Build a new source with an impulse response sound file and link the AudioPlayer to the Convolver.  

parameter        |type       |required |description
-----------------|-----------|---------|-------------------------------------------------------------
normalize        |*bool*     |No       |true: The convolver amplitude is leveled with the AudioPlayer. false: The convolver amplitude is not leveled with the AudioPlayer. Default = true
source           |*string*   |Yes      |Connect the source to the created `AudioSource.buffer`
destination      |*string*   |No       |Connect destination to effect, gain, etc. or leave blank for AudioContext().destination 
- - - -

**AudioPlayer({options});**  
Creates an player object that connects to a source and plays a sound. Multiple properties can be tweaked.  

parameter        |type       |required |description
-----------------|-----------|---------|-------------------------------------------------------------
source           |*string*   |Yes      |Connect the source to the created `AudioSource.buffer`
detune           |*value*    |No       |Set a value for detuning the source. Default is 0
loop             |*bool*     |No       |Set loop true or false
loopStart        |*integer*  |No       |If loop is true, start the loop from loopStart
loopEnd          |*integer*  |No       |If loop is true, end the loop at loopEnd
onended          |*callback* |No       |Callback function that is fired when the Audio is finished
name             |*string*   |No       |Give the object a name

**AudioPlayer().play({options});**  
Connect and play the AudioPlayer sound.  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
delay            |*integer*  |No       |Delay set in milliseconds
destination      |*string*   |No       |Connect destination to effect, gain, etc. or leave blank for AudioContext().destination 


**AudioPlayer().stop({options});**  
Stop and disconnect the AudioPlayer.  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
delay            |*integer*  |No       |Delay set in milliseconds
- - - -

**AudioOsc({options});**  
Creates and oscillator with a given frequency.  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
type             |*string*   |No       |Types of different oscillator waves. Options are: *"sine", "square", "sawtooth" and "triangle"*
frequency        |*integer*  |No       |Frequency of the filter
detune           |*integer*  |No       |Detunes the oscillator with a given value. Default = 0  


**AudioOsc().play({options});**  
Play the oscillator with or without delay value  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
delay            |*integer*  |No       |Delay set in milliseconds
destination      |*string*   |No       |Connect destination to effect, gain, etc. or leave blank for AudioContext().destination  


**AudioOsc().stop({options});**  
Stop and disconnect the AudioPlayer.  

parameter        |type       |required |description
-----------------|-----------|---------|-----------------------------------------------------------------
delay            |*integer*  |No       |Delay set in milliseconds
