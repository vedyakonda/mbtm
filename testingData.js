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

    let thisprediction = await classifySample(thisdata);
    console.log(thisprediction);

    let testclass = thisclass.substring(0, thisclass.length - 4);
    let predIcon = '';
    if (thisprediction === testclass) {
        thisprediction = 1;
        predIcon = '🤩';
    } else {
        thisprediction = -1;
        predIcon = '😡';
    }

    testingData[thisclass][sampleId] = { data: thisdata, image: base64Image, m: [target, inputs], prediction: thisprediction };

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