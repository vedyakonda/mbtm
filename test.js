let rawTestData = {x:[],y:[],z:[]};
let dataStream = false, resultChart = false, testChart, cux, mode;
//let confidenceData = {};

function useModel(){
    mode = 'use';
    getRawData();
    dataStream = true; 
}

function liveTest() {
    mode = 'test';
    getRawData();
    dataStream = true;
}

function dataStreamOff() {
    testChart.destroy();
    dataStream = false;
    rawTestData = {x:[],y:[],z:[]};
    cux = null;
    testChart = null;
}

function getRawData() {
    setTimeout(function() {
        if (dataStream){
            if (rawTestData.x == [] || rawTestData.x.length<41){
                rawTestData.x.push(acc.x/1024);
                rawTestData.y.push(acc.y/1024);
                rawTestData.z.push(acc.z/1024);
            } else if (rawTestData.x.length=41){
                rawTestData.x.shift();
                rawTestData.y.shift();
                rawTestData.z.shift();
                rawTestData.x.push(acc.x/1024);
                rawTestData.y.push(acc.y/1024);
                rawTestData.z.push(acc.z/1024);
                liveClassify();
            } 
            getRawData();
        }
    }, 50);
}

function liveClassify(){
    let input = getFeatures(rawTestData);
    thisModel.classify(input, gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    } else {

        if (!resultChart){
            createChart(results);
        } else {
            updateChart(results);
        }
    }
}


function updateChart(results){
    //console.log(results[0].label);
    let dta = [];
    for (let j = 0; j < thisModelClasses.length; j++){
        for (let i = 0; i < results.length; i++){
            if (thisModelClasses[j] == results[i].label){
                let val = results[i].confidence
                val = Math.round(val*100);
                dta.push(val);
            }
        }
    }
    testChart.data.datasets[0].data = dta;
    //console.log(testChart.data.datasets.data);
    testChart.update();

    if (mode == 'use'){
        sendtoMB(results[0].label);
    }

}


function createChart(results){
    //console.log(results);
    if (mode == 'test'){
        cux = document.getElementById('confidence').getContext('2d');
    } else if (mode == 'use'){
        cux = document.getElementById('useConfidence').getContext('2d');
    }
    let dta = [];
    for (let j = 0; j < thisModelClasses.length; j++){
        for (let i = 0; i < results.length; i++){
            if (thisModelClasses[j] == results[i].label){
                let val = results[i].confidence
                val = Math.round(val*100);
                dta.push(val);
            }
        }
    }

    var chartData = {
        labels: thisModelClasses,
        datasets: [{
            label: 'Confidence',
            data: dta,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    // Chart options
    var chartOptions = {
        interaction: {
            mode: 'none',  // Disable all interactions
            intersect: false  // Disable data point hover intersections
          },
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
            x: {
                min: 0,   // Set the minimum value of the y-axis
                max: 100 
            },
            y: {
                beginAtZero: true
            }
        }
    };

    // Create the horizontal bar chart
    testChart = new Chart(cux, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
    resultChart = true;
}

function sendtoMB(label){
    microBit.writeUARTData(label);    
}

