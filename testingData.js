function testDiv() {
    let divContent = '';
    document.getElementById("upldButton").classList.remove('hideContent');
    document.getElementById("upldButton").classList.add('showContent');
    openTestData();
    document.getElementById("addTestClass").innerHTML = divContent;
    testDivy = true;
}

async function storeTestData(thisclass, thisdata, base64Image, sampleId) {
    let inputs = getFeatures(thisdata);
    let target = { class: thisclass };
    modeTest = true;
    let predIcon = '';
    if (trained){
    let thisprediction = await classifySample(thisdata);
    console.log(thisprediction);
        let testclass = thisclass.substring(0, thisclass.length - 4);
        if (thisprediction === testclass) {
            thisprediction = 1;
            predIcon = '🤩';
        } else {
            thisprediction = -1;
            predIcon = '😡';
        }
    // if (!(thisclass in predData)) {
    //     predData[thisclass] = {}
    // }

    // predData[thisclass][thisdata] = thisprediction;

    if (!(thisclass in testingAccuracy)) {
        console.log("Add new")
        testingAccuracy[thisclass] = 0
        prevTotal = -1;
    }

    // let sum = 0
    // let elementKeys = Object.keys(testingData[thisclass])
    // for (let i = 0; i < elementKeys.length; i++) {
    //     if (predData[thisclass][elementKeys[i]] == 1) {
    //         sum ++
    //     }
    // }
    // testingAccuracy[thisclass] = (sum / elementKeys.length).toFixed(2)

    if (thisprediction == 1 && prevTotal[thisclass] != Object.keys(testingData[thisclass]).length) {
        console.log("Add new")
        // testingAccuracy[thisclass] = ((testingAccuracy[thisclass] * prevTotal[thisclass] + 1) / (Object.keys(testingData[thisclass]).length)).toFixed(2)
        testingAccuracy[thisclass] = ((testingAccuracy[thisclass] * Object.keys(testingData[thisclass]).length + 1) / (Object.keys(testingData[thisclass]).length + 1)).toFixed(2)
        prevTotal = Object.keys(testingData[thisclass]).length;
    } else {
        // testingAccuracy[thisclass] = ((testingAccuracy[thisclass] * prevTotal[thisclass]) / (Object.keys(testingData[thisclass]).length)).toFixed(2)
        testingAccuracy[thisclass] = ((testingAccuracy[thisclass] * Object.keys(testingData[thisclass]).length) / (Object.keys(testingData[thisclass]).length + 1)).toFixed(2)
        prevTotal = Object.keys(testingData[thisclass]).length;
    }
    

    console.log(`Test Accuracy ${thisclass}: ${testingAccuracy[thisclass]}`)
    testingData[thisclass][sampleId] = { data: thisdata, image: base64Image, m: [target, inputs], prediction: thisprediction };
    document.getElementById(thisclass + 'Accuracy').innerHTML = testingAccuracy[thisclass];    
} else {
        testingData[thisclass][sampleId] = { data: thisdata, image: base64Image, m: [target, inputs]};
        document.getElementById(thisclass + 'Accuracy').innerHTML = 'train a model to calculate accuracy';    
    }
    datalines = { x: [], y: [], z: [] };
    document.getElementById(thisclass + sampleId + '_pred').innerHTML = predIcon;
    

}

function classifySample(testData) {
    data = getFeatures(testData);
    return new Promise((resolve) => {
        thisModel.classify(data, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result[0].label);
                resolve(result[0].label);
            }

        });
    });
}