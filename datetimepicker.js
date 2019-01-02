

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

    $('.clockpicker').clockpicker({
        donetext: 'Done'
    });

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
             createChart(labelsH, dataChart);
       })
  });


  /****** CLICK TO GET NR OF MOTIONS BETWEEN TWO DATES *****/

  $('#dateBtn').click(function(){
        
    const startDate = $('#reportrange').data('daterangepicker').startDate;
    const endDate = $('#reportrange').data('daterangepicker').endDate;
    const y1 = startDate._d.getFullYear(),
    m1 = startDate._d.getMonth()+1,
    d1 = startDate._d.getDate(),
    y2 = endDate._d.getFullYear(),
    m2 = endDate._d.getMonth()+1,
    d2 = endDate._d.getDate();

    let url = new URL("127.0.0.1:3000//dates"),
        params = {fromYear: y1, fromMonth: m1, fromDay: d1,
                    toYear: y2, toMonth: m2, toDay: d2};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    //const url = 'http://127.0.0.1:3000/motions/' + y + '/' + m + '/' + d;
    fetch(url)
    .then((res) => res.json())
    .then((motions) => {
        let dataChart = [];
        let labelDays = [];
        
        
        createChart(labelDays, dataChart);
   })
});

});


const createChart = (mylabels, mydata) => {
    let myChart = document.getElementById('myChart').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    new Chart(myChart, {
    type:'bar', 
    data:{
        labels: mylabels,
        datasets:[{
        label:'Motion',
        data: mydata,
        //backgroundColor:'green',
        borderWidth:1,
        borderColor:'#777',
        hoverBorderWidth:3,
        hoverBorderColor:'#000'
        }]
    },
    options:{
        title:{
        display:true,
        text:'Number of Camera Motions',
        fontSize:25
        },
        legend:{
        display:true,
        position:'right',
        labels:{
            fontColor:'#000'
        }
        },
        layout:{
        padding:{
            left:50,
            right:0,
            bottom:0,
            top:0
        }
        },
        tooltips:{
        enabled:true
        }
    }
    });

}

