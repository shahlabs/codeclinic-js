(function() {

    let fromDate = '2015-01-01';
    let fromTime = '01:00:00';

    let toDate = '2015-01-01';
    let toTime = '10:00:00';

    document.querySelector('#fromDate').value = moment(fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    
    document.querySelector('#toDate').value = moment(toDate, 'YYYY-MM-DD').format('YYYY-MM-DD');

    document.querySelector('#fromTime').value = moment(fromTime, 'hh:mm:ss').format('hh:mm:ss');

    document.querySelector('#toTime').value = moment(toTime, 'hh:mm:ss').format('hh:mm:ss');

    function generateChart(data) {
        c3.generate({
            data:{
                y: 'barometric_pressure',
                x: 'dates',
                xFormat: '%Y-%m-%d %H:%M:%S',
                json : data,
                type: 'scatter',
                types:{
                    barometric_pressure : 'scatter',
                    coefficient: 'line'
                }
            },
            point: {
                show: false
            },
            axis :{
                x: {
                    type: 'timeseries',
                    tick: {
                        count: 4,
                        format: '%Y-%m-%d %H:%M:%S',
                    }
                },
            },
            subchart: {
                show: true
            }
        })
    }

    function loadChart(){
        fetch('http://pixelprowess.com/i/lake.php', {
            method: 'POST',
            body: JSON.stringify({
                fromDate: fromDate + ' ' + fromTime,
                toDate: toDate + ' ' +  toTime,
            })
        }).then(response => response.json())
        .then(response => {
           let pressure = response.barometric_pressure;
           let sum = pressure.reduce((a,b)=> a+b,0 );
           let size = pressure.length;
           let average = sum/size;
           let begx = (pressure[0] + average)/2;
           let endx = (pressure[size - 1] + average)/2;
           let slope = (endx-begx)/size;

        //    response.average = pressure.map(()=> average);
        //    response.delta = pressure.map(x => (x+average)/2);
           response.coefficient = pressure.map((x, i)=> 
            begx + i * slope
           );
           generateChart(response);
        }).catch(error => console.error(error));
    }

    document.querySelector('#fromDate').addEventListener('blur', ()=>{
        fromDate = document.querySelector('#fromDate').value;
        loadChart();
    });


    document.querySelector('#fromTime').addEventListener('blur', ()=>{
        fromDate = document.querySelector('#fromTime').value;
        loadChart();
    });


    document.querySelector('#toDate').addEventListener('blur', ()=>{
        fromDate = document.querySelector('#toDate').value;
        loadChart();
    });


    document.querySelector('#toTime').addEventListener('blur', ()=>{
        fromDate = document.querySelector('#toTime').value;
        loadChart();
    });

    loadChart();

})();