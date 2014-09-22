(function(d3) {

  var width = 620, height = 500;

  var rgbOrange = 165;
  var rgbYellow = 255;
  var mousePosition = {
    x: 0,
    y: 0
  };
  var distance = 35;
  var radius = 2;

  var svg = d3.select('#main_content').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'black');

  var data = d3.range(50).map(function() {
    return {
      fr: Math.floor((Math.random() * 2000) + 1) / 1000 * 2, //magic random
      rgbGreen: rgbYellow,//default rgb green value for yellow color
      saturate: true,
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() * 2 - 1) * (Math.random() + 1),
      dy: (Math.random() * 2 - 1) * (Math.random() + 1)
    };
  });

  svg.on('mousemove', function() {
    var mouseXY = d3.mouse(this);
    mousePosition.x = mouseXY[0];
    mousePosition.y = mouseXY[1];
  });

  svg.on('mouseleave', function() {
    mousePosition.x = 0;
    mousePosition.y = 0;
  });

  var circle = svg.selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr('r', radius)
    .attr('fill', 'yellow');

  var isClosely = function(element) {
    if (mousePosition.x === 0 || mousePosition.y === 0) {
      return false;
    }
    var currentDistance = Math.sqrt(Math.pow(element.x - mousePosition.x, 2) + Math.pow(element.y - mousePosition.y, 2));
    return distance > currentDistance;
  };

  d3.timer(function() {

    circle
      .each(function(d) {
        if (isClosely(d)) {
          if (d.x > mousePosition.x) {
            d.dx = Math.abs((Math.random() * 2 - 1) * (Math.random() + 1)) * 2;
          } else {
            d.dx = -Math.abs((Math.random() * 2 - 1) * (Math.random() + 1)) * 2;
          }
          if (d.y > mousePosition.y) {
            d.dy = Math.abs((Math.random() * 2 - 1) * (Math.random() + 1)) * 2;
          } else {
            d.dy = -Math.abs((Math.random() * 2 - 1) * (Math.random() + 1)) * 2;
          }
        }
      })
      .attr("cx", function(d) {
        d.x += d.dx;
        if (d.x > width - radius) {
          d.x = width - radius;
          d.dx = -d.dx;
        } else if (d.x < 0 + radius) {
          d.x = radius;
          d.dx = -d.dx;
        }
        return d.x;
      })
      .attr("cy", function(d) {
        d.y += d.dy;
        if (d.y > height - radius) {
          d.y = height - radius;
          d.dy = -d.dy;
        } else if (d.y < 0 + radius) {
          d.y = radius;
          d.dy = -d.dy;
        }
        return d.y;
      })
      .attr('fill', function(d) {
        if (d.saturate) {
          if ((d.rgbGreen - d.fr) > rgbOrange) {
            d.rgbGreen -= d.fr;
          } else {
            d.rgbGreen = rgbOrange;
          }
        } else {
          if ((d.rgbGreen - d.fr) < rgbYellow) {
            d.rgbGreen += d.fr;
          } else {
            d.rgbGreen = rgbYellow;
          }
        }

        if (d.rgbGreen >= rgbYellow) {
          d.saturate = true;
        } else {
          if (d.rgbGreen <= rgbOrange) {
            d.saturate = false;
          }
        }
        return d3.rgb(255, Math.round(d.rgbGreen), 0).toString();
      });
  });

})(d3);

