(function(d3) {

  var RGB_RED = 0
    , RGB_YELLOW = 255
    , circles
    , data
    , svg
    , width = 620
    , height = 500
    , dotsCount = 50
    , radius = 2
    , mouseImpact = 35
    , distance = mouseImpact - radius
    , mousePosition = {
      x: -1,
      y: -1
    };

  var randomFromInterval = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  var randMovementSpeed = function(multiplier) {
    var k = multiplier || 1;
    return (Math.random() * 2 - 1) * (Math.random() + 1) * k;
  };

  var randColorFrequency = function() {
    var min = 0.5, max = 3;
    return randomFromInterval(min, max);
  };

  svg = d3.select('#main_content').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'black')
    .on('mousemove', function() {
      var mouseXY = d3.mouse(this);
      mousePosition.x = mouseXY[0];
      mousePosition.y = mouseXY[1];
    })
    .on('mouseleave', function() {
      mousePosition.x = 0;
      mousePosition.y = 0;
    });

  data = d3.range(dotsCount).map(function() {
    return {
      fr: randColorFrequency(),
      rgbGreen: randomFromInterval(RGB_RED, RGB_YELLOW),
      saturate: true,
      x: Math.random() * width,
      y: Math.random() * height,
      dx: randMovementSpeed(),
      dy: randMovementSpeed()
    };
  });

  circles = svg.selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr('r', radius)
    .attr('fill', 'yellow');

  /**
   * Checks that circle is near mouse
   * @param element - circle data
   * @returns {boolean} - is circle near mouse
   */
  var isClosely = function(element) {
    if (mousePosition.x === -1 && mousePosition.y === -1) {
      return false;
    }
    var currentDistance = Math.sqrt(
      Math.pow(element.x - mousePosition.x, 2) + Math.pow(element.y - mousePosition.y, 2));
    return distance > currentDistance;
  };

  /**
   * based on mouse position changes circle direction and *speed*
   * @param d - circle data
   */
  var handleMousePosition = function(d) {
    if (isClosely(d)) {
      if (d.x > mousePosition.x) {
        d.dx = Math.abs(randMovementSpeed(1.5));
      } else {
        d.dx = -Math.abs(randMovementSpeed(1.5));
      }
      if (d.y > mousePosition.y) {
        d.dy = Math.abs(randMovementSpeed(1.5));
      } else {
        d.dy = -Math.abs(randMovementSpeed(1.5));
      }
    }
  };

  /**
   * changes circle X position
   * @param d - circle data
   * @returns {number} - new circle x position
   */
  var changeX = function(d) {
    d.x += d.dx;
    if (d.x > width - radius) {
      d.x = width - radius;
      d.dx = -d.dx;
    } else if (d.x < radius) {
      d.x = radius;
      d.dx = -d.dx;
    }
    return d.x;
  };

  /**
   * changes circle Y position
   * @param d - circle data
   * @returns {number} - new circle y position
   */
  var changeY = function(d) {
    d.y += d.dy;
    if (d.y > height - radius) {
      d.y = height - radius;
      d.dy = -d.dy;
    } else if (d.y < radius) {
      d.y = radius;
      d.dy = -d.dy;
    }
    return d.y;
  };

  /**
   * changes circle color
   * @param d - circle data
   * @returns {string} - new hexadecimal color value
   */
  var changeColor = function(d) {
    if (d.saturate) {
      if ((d.rgbGreen - d.fr) > RGB_RED) {
        d.rgbGreen -= d.fr;
      } else {
        d.rgbGreen = RGB_RED;
      }
    } else {
      if ((d.rgbGreen - d.fr) < RGB_YELLOW) {
        d.rgbGreen += d.fr;
      } else {
        d.rgbGreen = RGB_YELLOW;
      }
    }
    if (d.rgbGreen >= RGB_YELLOW) {
      d.saturate = true;
    } else {
      if (d.rgbGreen <= RGB_RED) {
        d.saturate = false;
      }
    }
    return d3.rgb(255, Math.round(d.rgbGreen), 0).toString();
  };


  d3.timer(function() {
    circles
      .each(handleMousePosition)
      .attr('cx', changeX)
      .attr('cy', changeY)
      .attr('fill', changeColor);
  });

})(d3);