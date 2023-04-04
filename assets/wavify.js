/*
*   Wavify
*   JavaScript library to make some nice waves
*   by peacepostman @ crezeo
 */
function wavify(wave_element, options) {
  if ("undefined" === typeof options) options = {};

  //  Options
  //
  //
  var settings = Object.assign(
    {},
    {
      container: options.container ? options.container : "body",
      // Height of wave
      height: 140,
      // Amplitude of wave
      amplitude: 120,
      // Animation speed
      speed: 0.15,
      // Total number of articulation in wave
      bones: 12,
      // Color
      color: "rgba(255,255,255, 0.20)"
    },
    options
  );

  var wave = wave_element,
    width = document.querySelector(settings.container).getBoundingClientRect().width,
    height = document.querySelector(settings.container).getBoundingClientRect().height,
    points = [],
    lastUpdate,
    totalTime = 0,
    animationInstance = false,
    tweenMaxInstance = false;

  //  Allow new settings, avoid setting new container for logic purpose please :)
  //
  function rebuilSettings(params) {
    settings = Object.assign({}, settings, params);
  }

  function drawPoints(factor) {
    var points = [];

    // var Rando = Math.random(8,12) * .1;
    var min = 0.95;
    var max = 1.05;
    var Rando = Math.random() * (max - min) + min;
    var Rando2 = Number.parseFloat(Rando).toFixed(3)
    // console.log(Rando2)
    // console.log(factor);
    // var speed = settings.speed;
    // console.log('speed1:' + settings.speed);
    // var speed = 0.02 + Math.sin(settings.speed * factor) / 100;
      var speed = 0.16 + Math.sin(settings.speed * Math.sin(factor)) / 200;
    // console.log('speed1:' + speed);
    // if (factor < 20) {
    //   speed = speed;
    // } else {
    //   // speed = 0.266;
    // }
    // console.log(speed);
    for (var i = 0; i <= settings.bones; i++) {
      if (i == 0) {
        var x = (i / settings.bones) * width;
      }else{
        var x = (i / settings.bones) * width;
        // var x = (i / settings.bones) * width + (Math.abs(settings.amplitude) * (Math.abs(settings.height)) / 1000);
        // console.log((Math.abs(settings.amplitude) * (Math.sin(settings.height)) / 2))
      }
      if (i == 0) {
        // x = x + 10;
      } else if (i == 1) {
        x = x - 3;
      } else if (i == 2) {
        x = x + 8;
      } else if (i == 3) {
        x = x + 4;
      } else if (i == 4) {
        x = x - 8;
      } else if (i == 5) {
        x = x - 3;
      } else if (i == 6) {
        x = x - 5;
      } else if (i == 7) {
        x = x + 9;
      } else if (i == 8) {
        x = x - 5;
      } else if (i == 9) {
        x = x - 8;
      } else if (i == 10) {
        x = x + 7;
      } else if (i == 11) {
        x = x - 3;
      } else if (i == settings.bones) {
        // x = x - 5;
      }
          // if (i == 0) {
      //     // x = x + 10;
      // } else if (i == 1) {
      //   x = x - 5;
      // } else if (i == 2) {
      //   x = x + 15;
      // } else if (i == 3) {
      //   x = x + 8;
      // } else if (i == 4) {
      //   x = x - 12;
      // } else if (i == 5) {
      //   x = x - 5;
      // } else if (i == 6) {
      //   x = x - 10;
      // } else if (i == 7) {
      //   x = x + 10;
      // } else if (i == 8) {
      //   x = x - 5;
      // } else if (i == 9) {
      //   x = x - 10;
      // } else if (i == 10) {
      //   x = x + 10;
      // } else if (i == 11) {
      //   x = x - 0;
      // } else if (i == 12) {
      //   // x = x - 5;
      // }
      // var x = (i / settings.bones) * width * Rando;
      var sinSeed = (factor + (i + (i % settings.bones))) * speed * 100;
      // console.log('sinSeed: ' + sinSeed)
      var sinHeight = Math.sin(sinSeed / 100) * settings.amplitude;
      // console.log('sinSeed: ' + sinHeight)
      var yPos = Math.sin(sinSeed / 100) * sinHeight + settings.height;
      points.push({ x: x, y: yPos });
    }

    return points;
  }

  function drawPath(points) {
    var SVGString = "M " + points[0].x + " " + points[0].y;

    var cp0 = {
      x: (points[1].x - points[0].x) / 2,
      y: points[1].y - points[0].y + points[0].y + (points[1].y - points[0].y)
    };

    SVGString +=
      " C " +
      cp0.x +
      " " +
      cp0.y +
      " " +
      cp0.x +
      " " +
      cp0.y +
      " " +
      points[1].x +
      " " +
      points[1].y;

    var prevCp = cp0;
    var inverted = -1;

    for (var i = 1; i < points.length - 1; i++) {
      var cpLength = Math.sqrt(prevCp.x * prevCp.x + prevCp.y * prevCp.y);
      var cp1 = {
        x: points[i].x - prevCp.x + points[i].x,
        y: points[i].y - prevCp.y + points[i].y
      };

      SVGString +=
        " C " +
        cp1.x +
        " " +
        cp1.y +
        " " +
        cp1.x +
        " " +
        cp1.y +
        " " +
        points[i + 1].x +
        " " +
        points[i + 1].y;
      prevCp = cp1;
      inverted = -inverted;
    }

    SVGString += " L " + width + " " + height;
    SVGString += " L 0 " + height + " Z";
    return SVGString;
  }

  //  Draw function
  //
  //
  function draw() {
    var now = window.Date.now();

    if (lastUpdate) {
      var elapsed = (now - lastUpdate) / 1000;
      lastUpdate = now;

      totalTime += elapsed;

      var factor = totalTime * Math.PI;
      // console.log('speed2:' + settings.speed);
      var speed = 0.15 + Math.sin(settings.speed * factor) / 100;
      tweenMaxInstance = TweenMax.to(wave, speed, {
        attr: {
          d: drawPath(drawPoints(factor))
        },
        ease: Power1.easeInOut
      });
    } else {
      lastUpdate = now;
    }

    animationInstance = requestAnimationFrame(draw);
  }

  //  Pure js debounce function to optimize resize method
  //
  //
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  //  Redraw for resize with debounce
  //
  var redraw = debounce(function() {
    pause();
    points = [];
    totalTime = 0;
    width = document.querySelector(settings.container).getBoundingClientRect().width;
    height = document.querySelector(settings.container).getBoundingClientRect().height;
    lastUpdate = false;
    play();
  }, 250);

  function boot() {
    if (!animationInstance) {
      // tweenMaxInstance = TweenMax.set(wave, { attr: { fill: settings.color } });
      // tweenMaxInstance = TweenMax.set(wave, { attr: { stroke: 'rgba(' + ((Math.random() * 100), (Math.random() * 100), (Math.random() * 100), 1) + ')', fill: 'none' } });
      tweenMaxInstance = TweenMax.set(wave, { attr: { fill: 'none' } });
      // tweenMaxInstance = TweenMax.set(wave, { attr: { stroke: 'rgba(255,0,255,0.5)', fill: 'red' } });
      play();
      window.addEventListener("resize", redraw);
    }
  }

  function reboot(options) {
    kill();
    if (typeof options !== undefined) {
      rebuilSettings(options);
    }
    // tweenMaxInstance = TweenMax.set(wave, { attr: { fill: settings.color } });
    tweenMaxInstance = TweenMax.set(wave, { attr: { stroke: settings.color } });
    play();
    window.addEventListener("resize", redraw);
  }

  function play() {
    if (!animationInstance) {
      animationInstance = requestAnimationFrame(draw);
    }
  }

  function pause() {
    if (animationInstance) {
      cancelAnimationFrame(animationInstance);
      animationInstance = false;
    }
  }

  function updateColor(options) {
    if (typeof options.timing === undefined) {
      options.timing = 1;
    }
    if (typeof options.color === undefined) {
      options.color = settings.color;
    }
    tweenMaxInstance = TweenMax.to(wave, parseInt(options.timing), {
      attr: { fill: options.color },
      // attr: { stroke: 'red' },
      onComplete: function() {
        if (
          typeof options.onComplete !== undefined &&
          {}.toString.call(options.onComplete) === "[object Function]"
        ) {
          options.onComplete();
        }
      }
    });
  }

  function kill() {
    if (animationInstance) {
      pause();
      tweenMaxInstance.kill();
      tweenMaxInstance = TweenMax.set(wave, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 0,
        clearProps: "all",
        attr: {
          d: "M0,0",
          fill: ""
        }
      });
      window.removeEventListener("resize", redraw);
      animationInstance = false;
    }
  }

  //  Boot Wavify
  //
  boot();

  return {
    reboot: reboot,
    play: play,
    pause: pause,
    kill: kill,
    updateColor: updateColor
  };
}
