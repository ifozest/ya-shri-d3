var width = 620, height = 500;

var svg = d3.select('#main_content').append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background', 'white');

var data = d3.range(20).map(function(datum, interval) {
  return {
    fr: 1,//frequency
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
      var element = d3.select(this);
      var color = d.color;
      var rgb = d3.rgb(element.attr('fill'));



      if (color === 'yellow' && rgb.g > 165){ //magic
        rgb.g -= d.fr;
      } else {
        rgb.g += d.fr;
      }

      if (rgb.g === 255) {
        d.color = 'yellow';
      } else if (rgb.g === 165) {
        d.color = 'orange';
      }

      return rgb.toString();
    });
});