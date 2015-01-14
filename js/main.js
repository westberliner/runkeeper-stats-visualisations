$(function() {
  var activities,
      runningWithBpm = [],
      bpm = [],
      pace = [],
      distance = [],
      xAxis = [];

  $.get('runkeeper-data/cardioActivities.csv', function(data) {
    activities = $.csv.toObjects(data).reverse();
    createActivities();
  });
  function createActivities() {
    // chart with bpm, pace of type running
    $.each(activities,function(k,v) {
      if(v["Average Heart Rate (bpm)"] && v.Type == 'Running' && k%2 == 0) {
        runningWithBpm.push({bpm:v["Average Heart Rate (bpm)"], pace:v["Average Pace"]})
        pace.push(parsePace(v["Average Pace"]));
        bpm.push(parseInt(v["Average Heart Rate (bpm)"])/100);
        distance.push(parseInt(v["Distance (km)"]));
        xAxis.push(v.Date);
      };
    });
    console.log(activities);
    $('#bpm-pace').highcharts({
        title: {
            text: 'BPM / Pace'
        },
        xAxis: {
          type: 'datetime',
          labels: {
            formatter: function() {
              d = new Date(this.value);
              return Highcharts.dateFormat('%e.%m.%y', d);
            }
          },
          categories: xAxis
        },
        yAxis: {
          plotLines: [{
            value: 1.6,
            color: 'red',
            width: 1,
            zIndex: 100,
            label: {
                text: '160 BPM',
                align: 'center',
                style: {
                    color: 'red'
                }
            }
          },
          {
            value: 5.5,
            color: 'red',
            width: 1,
            zIndex: 100,
            label: {
                text: '5:30 pace',
                align: 'center',
                style: {
                    color: 'red'
                }
            }
          }]
        },
        labels: {
        },
        series: [
        {
          type: 'area',
          name: 'distance',
          data: distance
        },
        {
            type: 'line',
            name: 'pace',
            data: pace
        },
        {
          type: 'area',
          name: 'bpm',
          data: bpm
        }],
    });
  }
});

function parsePace(string) {
  var time = string.split(':');
  return parseFloat(time[0]+'.'+parseInt(time[1])*100/60);
}