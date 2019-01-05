

$(document).ready(function () {
    $(function() {
                            
        var start = moment().subtract(29, 'days');
        var end = moment();
    
        function cb(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
    
        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
    
        cb(start, end);
          
    });

    $('.timepicker').clockpicker({
        donetext: 'Done'
    });

    $('#minuteBtn').click(() => {
        var time = $('.timepicker').val();
        const hh = time.substr(0, 2);
        const startDate = $('#reportrange').data('daterangepicker').startDate;
        const y = startDate._d.getFullYear(),
        m = startDate._d.getMonth()+1,
        d = startDate._d.getDate();

        const url = 'http://127.0.0.1:3000/motions/' + y + '/' + m + '/' + d + '/' + hh;
        fetch(url)
        .then((res) => res.json())
        .then((motions) => {
            console.log(motions);
            let dataChart = [];
            let labels = [];
            for(let i = 1; i < 61; i++) {
              //  if(i == 1 || i%5==0) 
                    labels.push(i.toString());
            } 
            for(let i = 1; i < 61; i++) {
                 const index = motions.findIndex(x => x.min == i);
                 if(index > -1) dataChart.push(motions[index].count);
                 else dataChart.push(0);
            }
            const chartTitle = 'Motions per minute';
            createChart(labels, dataChart, chartTitle);
       })
    })

    /****** CLICK TO GET NR OF MOTIONS By HOUR *****/
    $('#hourBtn').click(function(){
        
        const startDate = $('#reportrange').data('daterangepicker').startDate;
        const y = startDate._d.getFullYear(),
        m = startDate._d.getMonth()+1,
        d = startDate._d.getDate();

        const url = 'http://127.0.0.1:3000/motions/' + y + '/' + m + '/' + d;
        fetch(url)
        .then((res) => res.json())
        .then((motions_hr) => {
            let dataChart = [];
            let labelsH = [];
            for(let i = 1; i < 25; i++) {
                 let index = motions_hr.findIndex(x => x.h == i);
                 if(index > -1) dataChart.push(motions_hr[index].count);
                 else dataChart.push(0);
                 labelsH.push(i.toString());
             }
             const chartTitle = 'Motions per hour';
             createChart(labelsH, dataChart, chartTitle);
       })
  });


  /****** CLICK TO GET NR OF MOTIONS BETWEEN TWO DATES *****/

  $('#dateBtn').click(function(){
        
    const startDate = $('#reportrange').data('daterangepicker').startDate;
    const endDate = $('#reportrange').data('daterangepicker').endDate;
    const y1 = startDate._d.getFullYear(),
          m1 = startDate._d.getMonth(),
          d1 = startDate._d.getDate(),
          y2 = endDate._d.getFullYear(),
          m2 = endDate._d.getMonth(),
          d2 = endDate._d.getDate();
    
    
    let dates = getDates(new Date(y1, m1, d1), new Date(y2, m2, d2));
	let arrayDates = [];
	dates.forEach(date => {
        const month = date.getMonth()+1,
              day = date.getDate();
        const ddmm = day + "/" + month;
        arrayDates.push(ddmm);
    });
    let url = new URL("http://127.0.0.1:3000/dates"),
        params = {fromYear: y1, fromMonth: m1, fromDay: d1,
                    toYear: y2, toMonth: m2, toDay: d2};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url)
    .then((res) => res.json())
    .then((motions) => {
        let dataChart = [];
        
        for(let i = 0; i < arrayDates.length; i++) {
            const d = arrayDates[i];
            console.log("d: "+d);
            const dayStr = d.substr(0, d.indexOf('/'));
            console.log("dayStr: "+dayStr);
            const index = motions.findIndex(x => x.day == dayStr);
            if(index > -1) dataChart.push(motions[index].count);
            else dataChart.push(0);
        }
       const chartTitle = 'Motions by day';
       createChart(arrayDates, dataChart, chartTitle);
   })
});

});


const createChart = (mylabels, mydata, chartTitle) => {
    let myChart = document.getElementById('myChart').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    //Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    // prevent old data from showing
    if(window.bar != undefined) window.bar.destroy(); 
    
    window.bar = new Chart(myChart, {
    type:'bar', 
    data:{
        labels: mylabels,
        datasets:[{
            label:'Motion',
            data: mydata,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(254,71,103)',
            borderWidth:1,
            hoverBorderWidth:3,
            hoverBorderColor:'#000'
        }]
    },
    options:{
        title:{
            display:true,
            text: `${chartTitle}`,
            fontSize: 14,
            fontColor: "#858C99",
        },
        legend:{
            display:true,
            labels:{
                fontColor:'white',
                fontSize: 12
            }
        },
        layout:{
            padding:{
                left:0,
                right:0,
                bottom:0,
                top:0
            }
        },
        tooltips:{
            enabled:true
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        display: false,
                        color: "#858C99" 
                    },
                }
            ],
            yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {if (value % 1 === 0) {return value;}}
                },
                gridLines: {
                    display: false,
                    color: "#858C99" 
                },
                labelString: 'Number of motions'
              }
            ],
            
        }
    }
    });

}

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const getDates = (startDate, stopDate) => {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
