 let ctx, trainDivy = false; mbconnected = false;
 let myChart;
 let datalines = {x:[],y:[],z:[]};
 let chartTime;
 let classes = {};

 function trainDiv(){
  let divContent = '<button onclick="newClass()"> ➕ new class</button>';
  document.getElementById("addClass").innerHTML = divContent;
  trainDivy = true;
  /*let divContent = '<button id="recordButton" onClick="record()">record</button><div id="chart-wrapper"><canvas id="myChart"></canvas></div>'
  document.getElementById("record").innerHTML =  divContent;
  recordDivy = true;*/
 }


 function nameClass(){
  let className = prompt("Please enter a name for your new class:", "Class 1");
  let thisClassMod = className.replace(/\s/g, '');
  if (classes[thisClassMod]){
    return "errorClassName";   
  } else {
    return className;
  }
 }

 function newClass(){
  let thisClass = nameClass();
  if (thisClass == "errorClassName") {
    alert("This class already exists, use a different name to create a new class");
  } else {
    let thisClassMod = thisClass.replace(/\s/g, '');
    classes[thisClassMod] = {};
    let node = document.createElement("div");
    node.id = thisClassMod;
    let rec = "'"+thisClassMod+"'";
    node.innerHTML = '<h2>'+thisClass+'</h2><div id = "'+thisClassMod+'recordDiv"><button id="'+thisClassMod+'recordButton" onClick="record('+rec+')">➕ new data</button></div><div id="'+thisClassMod+'chart-wrapper"></div><div id="'+thisClassMod+'Data"></div>';
    document.getElementById("myClasses").appendChild(node)
  } 
 }

 function record(thisclass){
  document.getElementById(thisclass+'chart-wrapper').classList.add('chart-wrapper');
  document.getElementById(thisclass+'recordDiv').innerHTML = "🔴 recording";
  document.getElementById(thisclass+'chart-wrapper').innerHTML = '<canvas id="'+thisclass+'Canvas"></canvas>';
  ctx = document.getElementById(thisclass+'Canvas').getContext('2d');
  let chrlabels = new Array(81);
  chrlabels.fill("");
  datalines.x.push(acc.x/1024);
  datalines.y.push(acc.y/1024);
  datalines.z.push(acc.z/1024);


  let initialData = {
    labels: chrlabels,
    datasets: [{
        label: 'X',
        data: datalines.x,
        borderColor: 'red',
        fill: false,
        pointStyle: false
    }, {
        label: 'Y',
        data: datalines.y,
        borderColor: 'blue',
        fill: false,
        pointStyle: false
    },{
       label: 'Z',
       data: datalines.z,
       borderColor: 'purple',
       fill: false,
       pointStyle: false
   }]
  };


  chartTime = 1;
   // Create the chart with the initial data
  myChart = new Chart(ctx, {
    type: 'line',
    data: initialData,
    options: {
        animation: {
          duration: 0
        },
        tooltips: {enabled: false},
        hover: {mode: null},
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            y: {
                min: -2,
                max: 2
            }
        }
    }
  });

  callUpdate(thisclass);

}

 // Function to update the data and redraw the chart
function updateData(thisclass) {
     // Simulate new data
    datalines.x.push(acc.x/1024);
    datalines.y.push(acc.y/1024);
    datalines.z.push(acc.z/1024);
     // Update the chart's data
     myChart.data.datasets[0].data = datalines.x;
     myChart.data.datasets[1].data = datalines.y;
     myChart.data.datasets[2].data = datalines.z;

     // Update the chart
     myChart.update();
     callUpdate(thisclass);
}

function callUpdate(thisclass){
  setTimeout(function() {
    if (chartTime > 4000){
      stopChart(thisclass);
    } else {
      chartTime = chartTime+50;
      updateData(thisclass);
    }
  }, 50);
  //console.log(chartTime);
}

function stopChart(thisclass){
  let base64Image = myChart.toBase64Image();
  let thisdata = datalines;
  myChart.destroy();
  myChart = null;
  ctx = null;
  datalines = {x:[],y:[],z:[]};
  document.getElementById(thisclass+'chart-wrapper').innerHTML = '';
  let rec = "'"+thisclass+"'";
  document.getElementById(thisclass+'recordDiv').innerHTML = '<button id="'+thisclass+'recordButton" onClick="record('+rec+')">➕ new data</button>';
  document.getElementById(thisclass+'chart-wrapper').classList.remove('chart-wrapper');
  if (Object.keys(classes[thisclass]).length === 0){
    classes[thisclass]['el'+1] = {data: thisdata, image: base64Image};
  } else{
    let keys = Object.keys(classes[thisclass]);
    let lastKey = keys[keys.length - 1];
    let newKey = parseInt(lastKey.replace(/^el/, '')) + 1;
    classes[thisclass]['el' + newKey] = {data: thisdata, image: base64Image};
  }
  //classes[thisclass][] = {data:'', image: base64Image};
  showChartImage(base64Image, thisclass);

}

function showChartImage(b64, thisclass){
  var img = document.createElement('img');
  img.src = b64;
  img.style.height=200;
  var imageContainer = document.getElementById(thisclass+'Data');
  //imageContainer.innerHTML = '';
  imageContainer.appendChild(img);

}


// Start the microBit
 microBit=new uBitWebBluetooth();
 plotReady = false;
 console.log("mbit",microBit);
 microBit.onConnect(function(){
   console.log("connected");
 
   document.getElementById("connected").innerHTML="true";
   document.getElementById("properties").classList.toggle('inactive');

 });
 
 microBit.onDisconnect(function(){
   console.log("disconnected");
   document.getElementById("connected").innerHTML="false";
 });
 
 function searchDevice(){
   microBit.searchDevice();
 }
 
 microBit.onBleNotify(function(){
  if (!mbconnected){
    document.getElementById("connectMicro").innerHTML =  "Your microBit is connected!";
    mbconnected = true;
  }
  acc = microBit.getAccelerometer();
   //console.log(acc);
  if (!trainDivy){
    trainDiv();
  } 
 });