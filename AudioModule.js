// CHECK IF AUDIOCONTEXT IS AVAILABLE
if ('AudioContext' in window || 'webkitAudioContext' in window) {
    console.log('Yay, AudioContext is supported. Go have fun!');
} else { // AUDIOCONTEXT NOT SUPPORTED
    alert('It seems that your browser does not support the Web Audio API (AudioContext). Please use the latest Chrome, Firefox, Edge or Safari to use this system.');
}

// SET CTX VARIABLE
 var ctx = new AudioContext() || new webkitAudioContext();

// CHECK IF ELEMENT IS PRESENT AND OR IS A NUMBER
function chk(element, number) {
    'use strict';
    if (typeof number === 'undefined' || typeof number === null || number === false) {
        if (typeof element === 'undefined' || typeof element === null) {
            return true;
        } else {
            return false;
        }
    } else {
        if (typeof element === 'undefined' || typeof element === null || isNaN(element)) {
            return true;
        } else {
            return false;
        }
    }
}

// GET SINGLE SOURCE FOR AUDIOBUFFER
function AudioSource(url, callback) {
    'use strict';
    var self = this;

    // GET THE SOURCES
    function getBuffer(url) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function () {
            ctx.decodeAudioData(request.response, function (buffer) {
                if (!buffer) {
                    console.error('AudioSource - Error decoding file data: ' + url);
                    return;
                }
                self.buffer = buffer;
                // FIRE CALLBACK
                if (callback) {
                    callback();
                }
            },
                function (error) {
                    console.error('AudioSource - DecodeAudioData error: ', error);
                });
            
        };
        request.send();
    }

    if (chk(url)) {
        console.error('AudioSource url is missing or not found.');
    } else {
        getBuffer(url, callback);
    }
}

// GET MULTIPLE SOURCES FOR AUDIOBUFFER
function AudioMultiSource(url, callback, callLast) {
    'use strict';
    var self = this;
    var urlLength = url.length - 1
    this.buffer = [];

    // SEND ALL THE URL'S TO THE GETBUFFER FUNCTION
    function pushBuffer(input) {
        for (var i = 0; i < input.length; i += 1) {
            getBuffer(input[i], i);
        }
    }

    // GET THE SOURCES
    function getBuffer(url, index) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function () {
            ctx.decodeAudioData(request.response, function (buffer) {
                if (!buffer) {
                    console.error('error decoding file data: ' + url);
                    return;
                }
                self.buffer[index] = buffer;
                // FIRE CALLBACK
                if (callback) {
                    if (callLast === true) {
                        if (index === urlLength) {
                            callback();
                        }
                    } else {
                        callback();
                    }
                }
            },
                function (error) {
                    console.error('decodeAudioData error', error);
                });
        };
        request.send();
    }

    if (chk(url)) {
        console.error('AudioMultiSource url is missing or not found.');
    } else {
        pushBuffer(url);
    }
}

// CREATE AUDIOFX
function AudioEffect(options) {
    'use strict';
    this.source = ctx.createBiquadFilter();

    if (chk(options)) {
        console.error('AudioEffect options not set. Please set the filter type. Other options are optional.');
    } else {
        // SET FILTER TYPE
        if (chk(options.type)) {
            console.error('AudioEffect filter type is not set or recognized. Please set the filter type. Try: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch or allpass.');
        } else {
            this.source.type = options.type;

            if (chk(options.frequency, true)) {
                console.info('AudioEffect frequency is not set or not a number. Default is set to ' + this.source.frequency.defaultValue);
            } else {
                this.source.frequency.value = options.frequency;
            }

            if (chk(options.Q, true)) {
                console.info('AudioEffect Q is not set or not a number. Default is set to ' + this.source.Q.defaultValue + '.');
            } else {
                this.source.Q.value = options.Q;
            }

            if (chk(options.destination)) {
                console.info('AudioEffect destination is not set. Default is set to AudioContext().destination.');
                this.source.connect(ctx.destination);
            } else {
                this.source.connect(options.destination.source);
            }
        }
    }
}

// FUNCTION MADE BY Kevin Ennis
// TAKEN FROM http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
function distortionCurve( amount ) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
};

// CREATE DISTORTION
function AudioDistortion(options) {
    'use strict';
    // CREATE NEW WAVE SHAPER
    this.source = ctx.createWaveShaper();
    
    // SET VALUES
    if (chk(options)) {
        this.source.curve = distortionCurve(50);
        console.info('AudioDistortion options are not set. Default is set to 50.');
    } else {
        
        // SET DISTORTIONVALUE
        if (chk(options.curve, true)) {
            this.source.curve = distortionCurve(50);
        } else {
            this.source.curve = distortionCurve(options.curve);
        }
        
        // SET DISTORTIONOVERSAMPLING
        if (chk(options.oversample)) {
            this.source.oversample = 'none';
            console.info('AudioDistortion oversample is not set. Default is set to "none". Options are: "none", "2x" and "4x".');
        } else {
            this.source.oversample = options.oversample;
        }
        
        // SET DESTINATION
        if (chk(options.destination)) {
            this.source.connect(ctx.destination);
            console.info('AudioDistortion destination is not set. Default is set to AudioContext().destination.');
        } else {
            this.source.connect(options.destination.source);
        }
    }
}

// CREATE AUDIOGAINNODE
function AudioGain(options) {
    'use strict';
    // CREATE NEW GAINNODE
    this.source = ctx.createGain();

    // SET VALUES
    if (chk(options)) {
        this.source.gain.value = this.node.gain.defaultValue;
        this.source.connect(ctx.destination);
        console.info('AudioGain options are not set. Default value is set to 1 and destination is set to AudioContext().destinations.');
    } else {

        // SET GAINVALUE
        if (chk(options.gainValue, true)) {
            this.source.gain.value = this.source.gain.defaultValue;
            console.info('AudioGain gainValue is not set. Default is set to 1.');
        } else {
            this.source.gain.value = options.gainValue;
        }

        // SET DESTINATION
        if (chk(options.destination)) {
            this.source.connect(ctx.destination);
            console.info('AudioGain destination is not set. Default is set to AudioContext().destination.');
        } else {
            this.source.connect(options.destination.source);
        }
    }
}

// CREATE AUDIOPAN
function AudioPan(options) {
    'use strict';
    // CREATE NEW STEREOPANNER
    this.source = ctx.createStereoPanner();

    if (chk(options)) {
        this.source.connect(ctx.destination);
        console.info('AudioPan value and destination not set. Default value is set to 0 and default destination is set to  AudioContext().destination.');
    } else {

        // SET PAN VALUE
        if (chk(options.pan, true)) {
            this.source.pan.value = this.source.pan.defaultValue;
            console.info('AudioPan pan value is not set. Default is set to 0.');
        } else {
            this.source.pan.value = options.pan;
        }

        // SET DESTINATION
        if (chk(options.destination)) {
            this.source.connect(ctx.destination);
            console.info('AudioPan destination is not set. Default is set to AudioContext().destination.');
        } else {
            this.source.connect(options.destination.source);
        }
    }
}

// CREATE AUDIOPLAYER
function AudioPlayer(options) {
    'use strict';
    // CREATE NEW BUFFERSOURCE
    this.source = ctx.createBufferSource();

    if (chk(options)) {
        console.error('AudioPlayer options not set. Please set the source. Other options are optional.');
        console.info('AudioPlayer options are: source, name, loop, onended(callback).');
    } else {
        // SET SOURCE
        if (chk(options.source)) {
            console.error('AudioPlayer is missing source. Please create a source with the AudioSource constructor en set the AudioPlayer source to the created source.');
        } else {
            this.source.buffer = options.source.buffer;
        }

        // SET DETUNE
        if (chk(options.detune)) {
            this.source.detune.value = this.source.detune.defaultValue;
        } else {
            this.source.detune.value = options.detune;
        }

        // SET LOOP
        if (chk(options.loop)) {
            this.source.loop = false;
            console.info('AudioPlayer loop is not set. Default is set to false');
        } else {
            this.source.loop = options.loop;

            // SET LOOPSTART
            if (chk(options.loopStart, true)) {
                this.source.loopStart = 0;
            } else {
                this.source.loopStart = options.loopStart / 1000;
            }

            // SET LOOPEND
            if (chk(options.loopEnd, true)) {
                this.source.loopEnd = 0;
            } else {
                this.source.loopEnd = options.loopEnd / 1000;
            }
        }

        // SET PLAYBACKRATE
        if (chk(options.playbackRate)) {
            this.source.playbackRate.value = this.source.playbackRate.defaultValue;
        } else {
            this.source.playbackRate.value = options.playbackRate;
        }

        // ONENDED CALLBACK
        if (chk(options.onended)) {
            this.source.onended = null;
        } else {
            this.source.onended = options.onended;
        }

        // SET NAME
        if (chk(options.name)) {
            this.source.name = 'AudioPlayer';
            console.info('AudioPlayer name is not set. Default is set to AudioPlayer.');
        } else {
            this.source.name = options.name;
        }
    }
}

// START PLAYING - DELAY CAN BE SET IS MILLISECONDS
AudioPlayer.prototype.play = function (options) {
    'use strict';
    // IF NO OPTIONS ARE SET, JUST PLAY
    if (chk(options)) {
        this.source.connect(ctx.destination);
        this.source.start(ctx.currentTime);
    } else {
        // CONNECT SOURCE
        if (chk(options.destination)) {
            this.source.connect(ctx.destination);
            console.info('AudioPlayer.play destination is not set. Default set to AudioContext().destination.');
        } else if (options.destination === 'destination') {
            this.source.connect(ctx.destination);
        } else {
            this.source.connect(options.destination.source);
        }

        // SET DELAY - DEFAULT = 0
        if (chk(options.delay, true)) {
            console.info('AudioPlayer.start delay is not set or NaN. Default set to 0.');
            this.source.start(ctx.currentTime);
        } else {
            this.source.start(ctx.currentTime + (options.delay / 1000));
        }
    }

    console.info('Playing ' + this.source.name);
    this.source.playing = true;
};

// STOP PLAYING - DELAY CAN BE SET IS MILLISECONDS
AudioPlayer.prototype.stop = function (options) {
    'use strict';
    var self = this;
    
    if (chk(options)) {
        this.source.stop(ctx.currentTime);
        this.source.disconnect();
    } else {
        if (chk(options.delay, true)) {
            console.info('AudioPlayer.stop delay is not set or NaN. Default set to 0.');
            this.source.stop(ctx.currentTime);
            this.source.disconnect();
        } else {
            this.source.stop(ctx.currentTime + (options.delay / 1000));
            setTimeout(function () {
                self.source.disconnect();
            }, options.delay)
        }
    }

    console.info('Stopped ' + this.source.name);
    this.source.playing = false;
};

// CREATE AUDIOOSC - OSCILLATOR
function AudioOsc(options) {
    'use strict';
    
    // CREATE OSCILLATORNODE
    this.source = ctx.createOscillator();
    
    if (chk(options)) {
        this.source.type = 'sine';
        this.source.frequency.value = 440;
    } else {
        
        // SET VALUES
        if (chk(options.type)) {
            this.source.type = 'sine';
        } else if (options.type !== 'sine' && options.type !== 'square' && options.type !== 'sawtooth' && options.type !== 'triangle') {
            this.source.type = 'sine';
            console.error('AudioOsc.type is not correct. Type can be: "sine", "square", "sawtooth" or "triangle".');
        } else {
            this.source.type = options.type;
        }
        
        if (chk(options.frequency, true)) {
            this.source.frequency.value = this.sourc.frequency.defaultValue;
        } else {
            this.source.frequency.value = options.frequency;
        }
        
        if (chk(options.detune, true)) {
            this.source.detune.value = this.source.detune.defaultValue;
        } else {
            this.source.detune.value = options.detune;
        }
    }
}

// PLAY OSCILLATOR
AudioOsc.prototype.play = function (options) {
    'use strict';
    if (chk(options)) {
        this.source.connect(ctx.destination);
        this.source.start(ctx.currentTime);
    } else {
        
        // SET VALUES
        if (chk(options.destination)) {
            this.source.connect(ctx.destination);
        } else {
            this.source.connect(options.destination.source);
        }
        
        if (chk(options.delay, true)) {
            this.source.start(ctx.currentTime);
        } else {
            this.source.start(ctx.currentTime + (options.delay / 1000));
        }
    }
    this.source.playing = true;
};

// STOP OSCILLATOR
AudioOsc.prototype.stop = function (options) {
    'use strict';
    var self = this;
    
    if (chk(options)) {
        this.source.stop(ctx.currentTime);
        this.source.disconnect();
    } else {
        
        // SET VALUES
        if (chk(options.delay, true)) {
            this.source.stop(ctx.currentTime);
            this.source.disconnect();
        } else {
            this.source.stop(ctx.currentTime + (options.delay / 1000));
            setTimeout(function () {
                self.source.disconnect();
            }, options.delay)
        }
        
    }
    this.source.playing = false;
};

// CREATE CONVOLVERNODE
function AudioConvolver(options) {
    'use strict';
    this.source = ctx.createConvolver();
    
    if (chk(options)) {
        console.error('AudioConvolver options not set. Please at least set the source.');
    } else {
        // SET VALUES
        if (chk(options.normalize)) {
            this.source.normalize = true;
        } else {
            this.source.normalize = options.normalize;
        }
        
        if (chk(options.source)) {
            console.error('AudioConvolver is missing source. Please create a source with the AudioSource constructor en set the AudioPlayer source to the created source.');
        } else {
            this.source.buffer = options.source.buffer;
        }
        
        if (chk(options.destination)) {
            this.source.connect(ctx.destination);
        } else {
            this.source.connect(options.destination.source);
        }
    }
}
