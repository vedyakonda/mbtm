let thisModel;
let thisModelClasses;

function trainingData(){
    
}

function setNeuralNetwork() {
    let dataSet = dummy;
    let modelClasses =  Object.keys(dataSet);
    thisModelClasses = modelClasses;
    console.log ("model classes are: " + modelClasses);
    let options = {
      inputs: [
        "xPeaks",
        "xMax",
        "xMin",
        "xStd",
        "yPeaks",
        "yMax",
        "aMin",
        "aStd",
        "zPeaks",
        "zMax",
        "zMin",
        "zStd",
      ],
      outputs: modelClasses,
      task: "classification",
      debug: "false",
      learningRate: 0.5,
    };
  
    thisModel = ml5.neuralNetwork(options);

    for (let i = 0; i < modelClasses.length; i++){
        let elements = dataSet[modelClasses[i]];
        let elementKeys = Object.keys(elements);
        for (let j = 0; j < elementKeys.length; j++){
            let datat = dataSet[modelClasses[i]][elementKeys[j]].m;
            thisModel.addData(datat[1], datat[0]);
        }
    }

    thisModel.normalizeData();
    const trainingOptions = {
        epochs: 500
    }

    thisModel.train(trainingOptions, finishedTraining);
    document.getElementById("trainButton").innerHTML =  "💪🏾💪🏽 training... 💪🏾💪🏽";

}

function finishedTraining(){
    document.getElementById("trainButton").innerHTML =  '<button id="trainButton" onClick="setNeuralNetwork()">Retrain Model</button>';
    console.log("model trained");
}
