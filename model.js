let thisModel;

function trainingData(){
    
}

function setNeuralNetwork() {
    let dataSet = dummy;
    let modelClasses =  Object.keys(dataSet);
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
        epochs: 1000
    }

    thisModel.train(trainingOptions, finishedTraining);

}

function finishedTraining(){
    console.log("model trained");
    let input = {
        "xPeaks": 10,
        "xMax": -0.4453125,
        "xMin": -0.46875,
        "xStd": 0.00572606219011202,
        "yPeaks": 9,
        "yMax": 0.1171875,
        "aMin": 0.09765625,
        "aStd": 0.004166716288449438,
        "zPeaks": 12,
        "zMax": 0.875,
        "zMin": 0.84765625,
        "zStd": 0.006251190816434546
    };
    thisModel.classify(input, gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }

    console.log(results);
}