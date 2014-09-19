var width = 620, height = 500;

var svg = d3.select('#main_content').append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background', 'white');

var data = d3.range(20).map(function(datum, interval) {
  return {
    fr: Math.floor((Math.random() * 2000) + 1)/1000*2, //magic random
    rgbGreen: 255,//default rgb green value for yellow color
    color: 'yellow',
    x: interval * 20,
    y: 0,
    dx: 5,
    dy: -3 * (Math.random() + 1),
    mu: Math.random() * 2
  };
});

var orange = d3.rgb(255, 165, 0);
var yellow = d3.rgb(255, 255, 0);


var circle = svg.selectAll('circle')
  .data(data)
  .enter().append('circle')
  .attr('r', 10)
  .attr('fill', function(d){
    return d.color;
  });

d3.timer(function() {

  circle
    .attr("cx", function(d) {
      d.x += Math.random() * 3 * Math.sin(Math.random() * 3 * d.x + Math.random() * 10);
      if (d.x > width) {
        d.x -= width;
      } else if (d.x < 0) {
        d.x += width;
      }
      return d.x;
    })
    .attr("cy", function(d) {
      d.y += d.dy;
      if (d.y > height) {
        d.y -= height;
      } else if (d.y < 0) {
        d.y += height;
      }
      return d.y;
    })
    .attr('fill', function(d) {
      if (d.color === 'yellow'){ //magic
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