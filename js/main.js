var width = 620, height = 500;

var svg = d3.select('#main_content').append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background', 'black');

var data = d3.range(1).map(function(datum, interval) {
  return {
    fr: Math.floor((Math.random() * 2000) + 1) / 1000 * 2, //magic random
    rgbGreen: 255,//default rgb green value for yellow color
    color: 'yellow',
    x: interval * 20,
    y: 0,
    dx: -1 * (Math.random() + 1),
    dy: -1 * (Math.random() + 1)
  };
});


var mousePosition = {
  x: 0,
  y: 0
};

svg.on('mousemove', function() {
  var mouseXY = d3.mouse(this);
  mousePosition.x = mouseXY[0];
  mousePosition.y = mouseXY[1];
});

svg.on('mouseleave', function() {
  mousePosition.x = 0;
  mousePosition.y = 0;
});


var orange = d3.rgb(255, 165, 0);
var yellow = d3.rgb(255, 255, 0);


var circle = svg.selectAll('circle')
  .data(data)
  .enter().append('circle')
  .attr('r', 2)
  .attr('fill', function(d) {
    return d.color;
  });

var distance = 35;

var isClosely = function(element) {
  if (mousePosition.x === 0 || mousePosition.y === 0) {
    return false;
  }

  var currentDistance = Math.sqrt(Math.pow(element.x - mousePosition.x, 2) + Math.pow(element.y - mousePosition.y, 2));
  return distance > currentDistance;
};

var sign = function(x) {
  return (x > 0) - (x < 0);
};


d3.timer(function() {


  circle
    .each(function(d) {
      if (isClosely(d)) {
        if (d.x > mousePosition.x) {
          d.dx = Math.abs(d.dx);
        } else {
          d.dx = -Math.abs(d.dx);
        }
        if (d.y > mousePosition.y) {
          d.dy = Math.abs(d.dy);
        } else {
          d.dy = -Math.abs(d.dy);
        }
      }
    })
    .attr("cx", function(d) {
      d.x += d.dx;
      if (d.x > width) {
        d.x = width;
        d.dx = -d.dx;
      } else if (d.x < 0) {
        d.x = 0;
        d.dx = -d.dx;
      }
      return d.x;
    })
    .attr("cy", function(d) {
      d.y += d.dy;
      if (d.y > height) {
        d.y = height;
        d.dy = -d.dy;
      } else if (d.y < 0) {
        d.y = 0;
        d.dy = -d.dy;
      }
      return d.y;
    })
    .attr('fill', function(d) {
      if (d.color === 'yellow') { //magic
        if ((d.rgbGreen - d.fr) > 165) {
          d.rgbGreen -= d.fr;
        } else {
          d.rgbGreen = 165;
        }
      } else {
        d.rgbGreen += d.fr;
      }

      if (d.rgbGreen >= 255) {
        d.color = 'yellow';
      } else {
        if (d.rgbGreen <= 165) {
          d.color = 'orange';
        }
      }
      return d3.rgb(255, Math.round(d.rgbGreen), 0).toString();
    });
});