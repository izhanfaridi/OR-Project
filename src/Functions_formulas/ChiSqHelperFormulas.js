// export const chiSquareObservedFreqs = (data, numBins) => {
//   // Calculate the range of the data
//   const dataMin = Math.min(...data);
//   const dataMax = Math.max(...data);
//   // console.log("min", dataMin);
//   // console.log("max", dataMax);
//   let newData = [];

//   // if max interArrival is 13, and min is 0 and no. of bins = 5 then binWidth = 2.6
//   // Calculate the bin width
//   const binWidth = (dataMax - dataMin) / numBins;

//   // Initialize an array to hold the observed frequencies
//   const observedFreqs = new Array(numBins).fill(0);

//   // Loop through the data and increment the appropriate frequency bin
//   for (const datum of data) {
//     const binIndex = Math.floor((datum - dataMin) / binWidth);
//     if (binIndex < numBins) {
//       observedFreqs[binIndex]++;
//     }
//   }
//   console.log(observedFreqs);
//   for (let index = 0; index < observedFreqs.length; index++) {
//     newData.push({
//       bins: index,
//       OFcount: observedFreqs[index],
//     });
//   }

//   return newData
// };

//HELPERS
const e = 2.718281828;
let answer;

//usage chiSquareTableee.get(dof);
const chiSquareTable = new Map([
  [1, 5.024],
  [2, 7.378],
  [3, 9.348],
  [4, 11.143],
  [5, 12.833],
  [6, 14.449],
  [7, 16.013],
  [8, 17.535],
  [9, 19.023],
  [10, 20.483],
  [11, 21.92],
  [12, 23.337],
  [13, 24.736],
  [14, 26.119],
  [15, 27.488],
  [16, 28.845],
  [17, 30.191],
  [18, 31.526],
  [19, 32.852],
  [20, 34.17],
  [21, 35.479],
  [22, 36.781],
  [23, 38.076],
  [24, 39.364],
  [25, 40.646],
  [26, 41.923],
  [27, 43.195],
  [28, 44.461],
  [29, 45.722],
  [30, 46.979],
  [40, 59.342],
  [50, 71.42],
  [60, 83.298],
  [70, 95.023],
  [80, 106.629],
  [90, 118.136],
  [100, 129.561],
]);
// const chiSquareTable = new Map([
//   [1, 3.8415],
//   [2, 5.9915],
//   [3, 7.8147],
//   [4, 9.4877],
//   [5, 11.0705],
//   [6, 12.5916],
//   [7, 14.0671],
//   [8, 15.5073],
//   [9, 16.919],
//   [10, 18.307],
//   [11, 19.6751],
//   [12, 21.0261],
//   [13, 22.362],
//   [14, 23.6848],
//   [15, 25.005],
//   [16, 26.2962],
//   [17, 27.5871],
//   [18, 28.8693],
//   [19, 30.1435],
//   [20, 31.4104],
//   [21, 32.6706],
//   [22, 33.9244],
//   [23, 35.1725],
//   [24, 36.415],
//   [25, 37.6525],
//   [26, 38.8851],
//   [27, 40.1133],
//   [28, 41.3372],
//   [29, 42.557],
//   [30, 51.8051],
//   [40, 63.1671],
//   [50, 74.397],
//   [60, 85.5271],
//   [70, 96.5782],
//   [80, 107.565],
//   [90, 118.498],
//   [100, 124.342],
// ]);

const ChiSqProbabilityValues = (lambda, x) => {
  return (e ** (lambda * -1) * lambda ** x) / factorialize(x);
};

const chiSqValues = (obsFreq, expecFreq) => {
  return (obsFreq - expecFreq) ** 2 / expecFreq;
};

function factorialize(num) {
  var result = num;
  if (num === 0 || num === 1) return 1;
  while (num > 1) {
    num--;
    result *= num;
  }
  return result;
}
//HELPERS

export const chiSqCalculation = (data) => {
  console.log(data);
  let observedFreq = chiSqObservedFreqCount(data);
  observedFreq.sort((a, b) => {
    return a.bins - b.bins;
  });
  chiSqMLE(observedFreq);
  return answer;
};

const chiSqObservedFreqCount = (data) => {
  let observedFreq = [];

  for (let i = 0; i < data.length; i++) {
    if (observedFreq.findIndex((elem) => elem.bins === data[i]) === -1) {
      for (let j = 0; j < data.length; j++) {
        if (data[i] === data[j]) {
          if (
            observedFreq.filter((elem) => elem.bins === data[i]).length === 0
          ) {
            observedFreq.push({
              bins: data[i],
              OFcount: 1,
            });
          } else {
            let index = observedFreq.findIndex((elem) => elem.bins === data[i]);
            observedFreq[index].OFcount++;
          }
        }
      }
    } else {
      //do nothing
    }
  }

  return observedFreq;
};

const chiSqMLE = (data) => {
  let freqAndMle = [];
  for (const element of data) {
    freqAndMle.push({ ...element, MLE: element.bins * element.OFcount });
  }
  // console.log(freqAndMle);
  chiSqLambda(freqAndMle);
};

const chiSqLambda = (data) => {
  let obsFreqSum = 0;
  let mleSum = 0;

  for (const element of data) {
    obsFreqSum += element.OFcount;
    mleSum += element.MLE;
  }

  let chiSqLambda = mleSum / obsFreqSum;
  console.log("lambdaChiSQ", chiSqLambda);

  ChiSqProbabilityCalculation(chiSqLambda, data, obsFreqSum);
};

const ChiSqProbabilityCalculation = (lambda, dataTable, obsFreqSum) => {
  let newData = [];
  // let sumProb = 0;
  for (const element of dataTable) {
    newData.push({
      ...element,
      Probability: ChiSqProbabilityValues(lambda, element.bins),
    });
  }

  expectedFrequency(newData, obsFreqSum);
};

const expectedFrequency = (data, n) => {
  let newData = [];
  for (const element of data) {
    newData.push({
      ...element,
      expectedFrequency: n * element.Probability,
    });
  }

  chiSqColumn(newData);
};

const chiSqColumn = (data) => {
  let newData = [];
  let chiSqSum = 0;
  for (const element of data) {
    newData.push({
      ...element,
      ChiSq: chiSqValues(element.OFcount, element.expectedFrequency),
    });
  }

  for (const element of newData) {
    chiSqSum += element.ChiSq;
  }

  chiSqMapping(newData, chiSqSum);
};

const chiSqMapping = (data, chiSqTabulated) => {
  console.log(data);
  let dof = data.length - 1 - 1;
  let chiSqCalculated = chiSquareTable.get(dof);

  console.log("ChiSqTabulated", chiSqTabulated);
  console.log("chisqcalculated", chiSqCalculated);

  if (chiSqTabulated < chiSqCalculated) {
    answer = true;
  } else {
    answer = false;
  }
};
