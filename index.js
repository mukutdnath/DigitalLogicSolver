var twoVarNo = document.querySelectorAll(".tableValue").length;

for (var i = 0; i < twoVarNo; i++) {
  document.querySelectorAll(".tableValue")[i].addEventListener("click", toggleTableValues);
}

function toggleTableValues() {
  if (this.innerHTML == 0) {
    this.innerHTML = 1;
  } else if (this.innerHTML == 1) {
    this.innerHTML = 'X';
  } else {
    this.innerHTML = 0;
  }
  // console.log(this.id[3]);
  calculateResult(this.id[3]);
}


function calculateResult(noVars) {
  const noOfVars = parseInt(noVars);
  const n = Math.pow(2, noOfVars);
  var minTerms = [];
  var dontCare = [];

  // getting the minterms and the dont care terms.
  for (var i = 0; i < n; i++) {
    var idName = "#Var";
    idName = idName.concat(noOfVars.toString());
    idName = idName.concat("m");
    idName = idName.concat(i.toString());
    var tempValue = document.querySelector(idName).innerHTML;
    if (tempValue == 1) {
      minTerms.push(i);
    } else if (tempValue == 'X') {
      dontCare.push(i);
    }
  }
  // console.log(minTerms);
  // console.log(dontCare);

  // combining mintems and dontcare for the initial part where both are considered without any differnece.
  var minTermsAndDontCareTerms = minTerms;
  minTermsAndDontCareTerms = minTermsAndDontCareTerms.concat(dontCare);
  // sorting for easy future computations
  minTermsAndDontCareTerms = minTermsAndDontCareTerms.sort(function(a, b) {
    return a - b
  });
  // console.log(minTermsAndDontCareTerms);

  // we now have the minterms and the dont care terms combined together for further computations/

  // making the struct constructor
  function StructTerms(minterms, literals, onesSum, matched) {
    this.minterms = minterms;
    this.literals = literals;
    this.onesSum = onesSum;
    this.matched = matched;
  }
  // storing results in array of the structTerms
  structMinAndDCTerms = [];
  // constructor calling function
  function getStructTerms(noOfVars, minTermsAndDontCareTerms) {
    noOfMinandDCTerms = minTermsAndDontCareTerms.length;
    for (var i = 0; i < noOfMinandDCTerms; i++) {
      tempminterms = [];
      templiterals = [];
      temponesSum = 0;

      tempminterms.push(minTermsAndDontCareTerms[i]);
      var temp = minTermsAndDontCareTerms[i];
      // finding templiterals
      for (var j = noOfVars - 1; j >= 0; j--) {
        var tempLiteral = Math.floor(temp / Math.pow(2, j));
        templiterals.push(tempLiteral);
        temp = minTermsAndDontCareTerms[i] % Math.pow(2, j);
        if (tempLiteral) {
          temponesSum += 1;
        }
      }
      // making the structures
      var tempEntry = new StructTerms(tempminterms, templiterals, temponesSum, 0);
      structMinAndDCTerms.push(tempEntry);
    }
    // console.log(structMinAndDCTerms);

  }

  getStructTerms(noOfVars, minTermsAndDontCareTerms);
  structMinAndDCTerms = structMinAndDCTerms.sort(function(a, b) {
    return a.onesSum - b.onesSum
  });

  // generating prime implicants tables
  // we will have no of columns as the number of variables + 1
  var identifier = ".primeImplicantTableVar";
  identifier = identifier.concat(noOfVars.toString());
  var identifierHead = identifier.concat("-head");
  var identifierSubHead = identifier.concat("-subhead");
  var identifierBody = identifier.concat("-body");
  document.querySelector(identifierBody).innerHTML = ""; // used to empty up any previous entries in the table.
  document.querySelector(identifierHead).innerHTML = "";
  document.querySelector(identifierSubHead).innerHTML = "";
  const dictVariables = {
    2: "xy",
    3: "xyz",
    4: "wxyz",
    5: "vwxyz",
    6: "uvwxyz"
  };
  const dictTableNo = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "F",
    7: "G",
    8: "H"
  };
  const dictMatched = {
    0: "<span style=\"color:blue\">PI</style>",
    1: "&#10003;"
  };

  // making the array of computed entries:
  var arrayStructTerms = [];
  arrayStructTerms[0] = structMinAndDCTerms;
  // getting other entries using the computing function
  // console.log(noOfVars);
  // console.log(noOfVars+1);
  for (var i = 1; i < noOfVars+1; i++) { // add +1 for last redundant implicant also
    // call the function that returns computed entries next matchings.
    var currentArray = arrayStructTerms[i - 1];
    var newArray = getNextArrayOfPI(currentArray);
    if (newArray.length == 0){
      break;
    }
    arrayStructTerms[i - 1] = currentArray;
    arrayStructTerms[i] = newArray;
  }
  // console.log(arrayStructTerms);
  var newInnerHTMLHead = "<tr>";
  var newInnerHTMLSubHead = "<tr>";
  var newInnerHTMLBody = "<tr>";
  // console.log(arrayStructTerms);
  for (i = 0; i < arrayStructTerms.length; i++) { // add +1 for last redundant implicant also
    var colWidth = 2 + 2 * Math.pow(2, i);
    // modifying table head
    newInnerHTMLHead = newInnerHTMLHead.concat("<th scope=\"col\">\(");
    newInnerHTMLHead = newInnerHTMLHead.concat(dictTableNo[i + 1]);
    newInnerHTMLHead = newInnerHTMLHead.concat("\)");
    newInnerHTMLHead = newInnerHTMLHead.concat("</th>");

    newInnerHTMLSubHead = newInnerHTMLSubHead.concat("<th scope=\"col\">");
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat("<div class=\"row flex-nowrap\"><div class=\"col-4\" style=\"width: ");
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat(colWidth.toString());
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat("rem\">");
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</div><div class=\"col\" style=\"width: 4rem\">");
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat(dictVariables[noOfVars]);
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</div><div class=\"col matched-tick\"  style=\"width: 3rem\">");
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</div></div>");
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</td>");

    newInnerHTMLBody = newInnerHTMLBody.concat("<td scope=\"col\">");

    // making the table tbody

    var prevSum = -1;
    for (var j = 0; j < arrayStructTerms[i].length; j++) {
      var currSum = arrayStructTerms[i][j].onesSum;
      if (j == 0) {
        prevSum = arrayStructTerms[i][j].onesSum;
      } else {
        if (prevSum != currSum) {
          newInnerHTMLBody = newInnerHTMLBody.concat("<hr>");
          prevSum = currSum;
        }
      }
      newInnerHTMLBody = newInnerHTMLBody.concat("<div class=\"row flex-nowrap\"><div class=\"col-4\" style=\"width: ");
      newInnerHTMLBody = newInnerHTMLBody.concat(colWidth.toString());
      newInnerHTMLBody = newInnerHTMLBody.concat("rem\">");
      for (var k = 0; k < arrayStructTerms[i][j].minterms.length; k++) {
        if (dontCare.includes(arrayStructTerms[i][j].minterms[k])) {
          newInnerHTMLBody = newInnerHTMLBody.concat("<span class=\"dont-care-color\">");
          newInnerHTMLBody = newInnerHTMLBody.concat(arrayStructTerms[i][j].minterms[k].toString());
          newInnerHTMLBody = newInnerHTMLBody.concat("</span>");
        } else {
          newInnerHTMLBody = newInnerHTMLBody.concat(arrayStructTerms[i][j].minterms[k].toString());
        }
        if (k != arrayStructTerms[i][j].minterms.length - 1) {
          newInnerHTMLBody = newInnerHTMLBody.concat(",");
        }
      }
      newInnerHTMLBody = newInnerHTMLBody.concat("\[");
      newInnerHTMLBody = newInnerHTMLBody.concat(arrayStructTerms[i][j].onesSum.toString());
      newInnerHTMLBody = newInnerHTMLBody.concat("\]");
      newInnerHTMLBody = newInnerHTMLBody.concat("</div><div class=\"col\" style=\"width: 4rem\">");
      newInnerHTMLBody = newInnerHTMLBody.concat(arrayStructTerms[i][j].literals.join(""));
      newInnerHTMLBody = newInnerHTMLBody.concat("</div><div class=\"col matched-tick\"  style=\"width: 3rem\">");
      newInnerHTMLBody = newInnerHTMLBody.concat(dictMatched[arrayStructTerms[i][j].matched]);
      newInnerHTMLBody = newInnerHTMLBody.concat("</div></div>");
    }
    newInnerHTMLBody = newInnerHTMLBody.concat("</td>");
  }
  newInnerHTMLBody = newInnerHTMLBody.concat("</tr>");
  newInnerHTMLHead = newInnerHTMLHead.concat("</tr>");
  newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</tr>");
  document.querySelector(identifierHead).innerHTML = newInnerHTMLHead;
  document.querySelector(identifierBody).innerHTML = newInnerHTMLBody;
  document.querySelector(identifierSubHead).innerHTML = newInnerHTMLSubHead;

  // making a function to generate next set of prime implicants after matchings
  function getNextArrayOfPI(currentArray) {
    ni = currentArray.length;
    var nextStage = [];
    // idea here is to match literals in element i and j
    for (var i = 0; i < ni; i++) {
      for (var j = i + 1; j < ni; j++) {
        // if (currentArray[i].minterms.length == 1 && dontCare.includes(currentArray[i].minterms[0]) && dontCare.includes(currentArray[j].minterms[0])){
        //   break;
        // }
        var temp = compareArrays(currentArray[i].literals, currentArray[j].literals);
        var tempminterms = currentArray[i].minterms;
        tempminterms = tempminterms.concat(currentArray[j].minterms);
        tempminterms = removeDuplicates(tempminterms);
        tempminterms = tempminterms.sort(function(a, b) {
          return a - b
        });
        if (temp[1] == 1) {
          var tempEntry = new StructTerms(tempminterms, temp[0], temp[2], 0);
          var flag = 1;
          for (var l = 0; l < nextStage.length; l++) {
            if (compareArrays(temp[0], nextStage[l].literals)[1] == 0) {
              flag = 0;
              break;
            }
          }
          currentArray[i].matched = 1;
          currentArray[j].matched = 1;
          if (flag == 1) {
            nextStage.push(tempEntry);
          }
        }
      }
    }
    // nextStage = removeDuplicates(nextStage);
    return nextStage;

    // function returning matched arrays back and '-' for an unmatched array
    function compareArrays(a, b) {
      var c = [];
      var noOfMismatch = 0;
      var onesSum = 0;
      for (var m = 0; m < a.length; m++) {
        if (a[m] == b[m]) {
          c[m] = a[m];
          if (a[m] == 1) {
            onesSum += 1;
          }
        } else {
          c[m] = '-';
          noOfMismatch += 1;
        }
      }
      return [c, noOfMismatch, onesSum];
    }
    // end of the function
  }

  // next tasks... making the essential prime implicants table.
  // we use a for loop to iterate through all elements of the matrix arrayStructTerms and save those terms in a new matrix
  var arrayPrimeImplicants = [];
  var primeImplicantsMinterms = [];
  for (var i = 0; i < arrayStructTerms.length; i++) {
    for (var j = 0; j < arrayStructTerms[i].length; j++) {
      if (arrayStructTerms[i][j].matched == 0) {
        arrayPrimeImplicants.push(arrayStructTerms[i][j]);
      }
    }
  }
  // console.log(arrayStructTerms);
  // console.log(arrayPrimeImplicants);
  // getting the involved minterms in the found out prime primeImplicants
  for (var i = 0; i < arrayPrimeImplicants.length; i++) {
    primeImplicantsMinterms = primeImplicantsMinterms.concat(arrayPrimeImplicants[i].minterms);
  }
  // console.log(primeImplicantsMinterms);
  primeImplicantsMinterms = removeDuplicates(primeImplicantsMinterms);
  // console.log(primeImplicantsMinterms);
  primeImplicantsMinterms = primeImplicantsMinterms.sort(function(a, b) {
    return a - b
  });

  //  this section of code removes the dont care terms from the prime implicants minterms
  primeImplicantsMintermsFiltered = [];
  for (var i = 0; i < primeImplicantsMinterms.length; i++) {
    if (dontCare.includes(primeImplicantsMinterms[i])) {
      continue;
    } else {
      primeImplicantsMintermsFiltered.push(primeImplicantsMinterms[i]);
    }
  }
  primeImplicantsMinterms = primeImplicantsMintermsFiltered;
  //---------------------------------------------------------


  // console.log(primeImplicantsMinterms);

  // we now mke the table to find the essential prime implicants
  identifier = ".essentialPrimeImplicantsVar";
  identifier = identifier.concat(noOfVars.toString());
  identifierHead = identifier.concat("-head");
  identifierBody = identifier.concat("-body");
  identifierFoot = identifier.concat("-foot");
  identifierResults = identifier.concat("-results");
  document.querySelector(identifierBody).innerHTML = ""; // used to empty up any previous entries in the table.
  document.querySelector(identifierHead).innerHTML = "";
  document.querySelector(identifierFoot).innerHTML = "";
  document.querySelector(identifierResults).innerHTML = "";
  newInnerHTMLHead = "<tr>";
  newInnerHTMLBody = "<tr>";
  newInnerHTMLFoot = "<tr>";

  newInnerHTMLHead = newInnerHTMLHead.concat("<th scope=\"col\"  style=\"width: 5rem\">");
  newInnerHTMLHead = newInnerHTMLHead.concat("Term");
  newInnerHTMLHead = newInnerHTMLHead.concat("</th>");
  newInnerHTMLHead = newInnerHTMLHead.concat("<th scope=\"col\"  style=\"width: 5rem\">");
  newInnerHTMLHead = newInnerHTMLHead.concat("Minterms");
  newInnerHTMLHead = newInnerHTMLHead.concat("</th>");
  for (i = 0; i < primeImplicantsMinterms.length; i++) {
    newInnerHTMLHead = newInnerHTMLHead.concat("<th scope=\"col\" style=\"width: 2rem\">");
    newInnerHTMLHead = newInnerHTMLHead.concat(primeImplicantsMinterms[i].toString());
    newInnerHTMLHead = newInnerHTMLHead.concat("</th>");
  }
  newInnerHTMLBody = newInnerHTMLBody.concat("<td scope=\"col\">");
  for (i = 0; i < arrayPrimeImplicants.length; i++) {
    newInnerHTMLBody = newInnerHTMLBody.concat("<div class=\"row\"><div class=\"col\">");
    newInnerHTMLBody = newInnerHTMLBody.concat(getTermFromLiteral(arrayPrimeImplicants[i].literals));
    newInnerHTMLBody = newInnerHTMLBody.concat("</div></div>");
  }
  newInnerHTMLBody = newInnerHTMLBody.concat("</td>");
  newInnerHTMLBody = newInnerHTMLBody.concat("<td scope=\"col\">");
  for (i = 0; i < arrayPrimeImplicants.length; i++) {
    newInnerHTMLBody = newInnerHTMLBody.concat("<div class=\"row\"><div class=\"col\">");
    // newInnerHTMLBody = newInnerHTMLBody.concat(arrayPrimeImplicants[i].minterms.toString());
    for (var k = 0; k < arrayPrimeImplicants[i].minterms.length; k++) {
      if (dontCare.includes(arrayPrimeImplicants[i].minterms[k])) {
        newInnerHTMLBody = newInnerHTMLBody.concat("<span class=\"dont-care-color\">");
        newInnerHTMLBody = newInnerHTMLBody.concat(arrayPrimeImplicants[i].minterms[k].toString());
        newInnerHTMLBody = newInnerHTMLBody.concat("</span>");
      } else {
        newInnerHTMLBody = newInnerHTMLBody.concat(arrayPrimeImplicants[i].minterms[k].toString());
      }
      if (k != arrayPrimeImplicants[i].minterms.length - 1) {
        newInnerHTMLBody = newInnerHTMLBody.concat(",");
      }
    }
    newInnerHTMLBody = newInnerHTMLBody.concat("</div></div>");
  }
  newInnerHTMLBody = newInnerHTMLBody.concat("</td>");

  var countMatch = [];
  var essentialPIs = [];
  var essentialPIsWOOnlyDC = [];
  var essentialPIsOnlyDC = [];
  for (i = 0; i < primeImplicantsMinterms.length; i++) {
    countMatch[i] = 0;
    newInnerHTMLBody = newInnerHTMLBody.concat("<td scope=\"col\">");
    for (var j = 0; j < arrayPrimeImplicants.length; j++) {
      newInnerHTMLBody = newInnerHTMLBody.concat("<div class=\"row\"><div class=\"col\">");
      for (var k = 0; k < arrayPrimeImplicants[j].minterms.length; k++) {
        if (arrayPrimeImplicants[j].minterms[k] == primeImplicantsMinterms[i]) {
          newInnerHTMLBody = newInnerHTMLBody.concat("<span style=\"color: green\">&#10003;</span>");
          countMatch[i] += 1;
        } else {
          newInnerHTMLBody = newInnerHTMLBody.concat("-");
        }
      }
    }
    newInnerHTMLBody = newInnerHTMLBody.concat("</div></div>");
  }
  newInnerHTMLBody = newInnerHTMLBody.concat("</td>");

  newInnerHTMLFoot = newInnerHTMLFoot.concat("<td scope=\"col\">");
  newInnerHTMLFoot = newInnerHTMLFoot.concat("</td>");
  newInnerHTMLFoot = newInnerHTMLFoot.concat("<td scope=\"col\">");
  newInnerHTMLFoot = newInnerHTMLFoot.concat("</td>");
  for (i = 0; i < countMatch.length; i++) {
    newInnerHTMLFoot = newInnerHTMLFoot.concat("<td scope=\"col\">");
    if (countMatch[i] == 1) {
      newInnerHTMLFoot = newInnerHTMLFoot.concat("<span style=\"color: blue\">&#10003;</span>");
    } else {
      newInnerHTMLFoot = newInnerHTMLFoot.concat("<span>-</span>");
    }
    newInnerHTMLFoot = newInnerHTMLFoot.concat("</td>");
  }
  // --------------------------------------------------------
  newInnerHTMLBody = newInnerHTMLBody.concat("</tr>");
  newInnerHTMLHead = newInnerHTMLHead.concat("</tr>");
  newInnerHTMLFoot = newInnerHTMLFoot.concat("</tr>");
  document.querySelector(identifierHead).innerHTML = newInnerHTMLHead;
  document.querySelector(identifierBody).innerHTML = newInnerHTMLBody;
  document.querySelector(identifierFoot).innerHTML = newInnerHTMLFoot;

  for (var i = 0; i < countMatch.length; i++) {
    if (countMatch[i] == 1) {
      for (var j = 0; j < arrayPrimeImplicants.length; j++) {
        if (arrayPrimeImplicants[j].minterms.includes(primeImplicantsMinterms[i])) {
          essentialPIs.push(arrayPrimeImplicants[j]);
        }
      }
    }
  }
  essentialPIs = removeDuplicates(essentialPIs);
  // getting the only DC essentialPIS deleted
  for (var i = 0; i < essentialPIs.length; i++) {
    var minTermDC = true;
    for (var j = 0; j < essentialPIs[i].minterms.length; j++) {
      if (minTerms.includes(essentialPIs[i].minterms[j]) == true) {
        minTermDC = false;
        break;
      } else {
        continue;
      }
    }
    if (minTermDC) {
      essentialPIsOnlyDC.push(essentialPIs[i]);
    } else {
      essentialPIsWOOnlyDC.push(essentialPIs[i]);
    }
  }


  // console.log(essentialPIs);
  // console.log(essentialPIsOnlyDC);
  // console.log(essentialPIsWOOnlyDC);

  // console.log(essentialPIs);


  var essentialIPsMinterms = [];
  for (var i = 0; i < essentialPIsWOOnlyDC.length; i++) {
    essentialIPsMinterms = essentialIPsMinterms.concat(essentialPIsWOOnlyDC[i].minterms);
  }
  // console.log(primeImplicantsMinterms);
  essentialIPsMinterms = removeDuplicates(essentialIPsMinterms);
  // console.log(primeImplicantsMinterms);
  essentialIPsMinterms = essentialIPsMinterms.sort(function(a, b) {
    return a - b
  });

  var remainingMinterms = [];
  for (var i = 0; i < minTerms.length; i++) {
    if (essentialIPsMinterms.includes(minTerms[i]) == false) {
      remainingMinterms.push(minTerms[i]);
    }
  }
  remainingMinterms = remainingMinterms.sort(function(a, b) {
    return a - b
  });
  // console.log(essentialPIs);
  // console.log(essentialIPsMinterms);
  // console.log(remainingMinterms);
  // console.log(remainingMinterms.toString(", "));

  var newInnerHTMLResults = "";
  if (essentialIPsMinterms.length != 0) {
    newInnerHTMLResults = newInnerHTMLResults.concat("Essential Prime Implicants: <br><span style=\"font-family: 'JetBrains Mono', monospace;\">");
    for (var i = 0; i < essentialPIs.length; i++) {
      newInnerHTMLResults = newInnerHTMLResults.concat(getTermFromLiteral(essentialPIs[i].literals));
      if (i != essentialPIs.length - 1) {
        newInnerHTMLResults = newInnerHTMLResults.concat(", ");
      }
    }
    newInnerHTMLResults = newInnerHTMLResults.concat("</span>");
    if (essentialPIs.length != essentialPIsWOOnlyDC.length) {
      newInnerHTMLResults = newInnerHTMLResults.concat("<br>");
      newInnerHTMLResults = newInnerHTMLResults.concat("Of which <span class=\"dont-care-color\" style=\"font-family: 'JetBrains Mono', monospace;\">");
      for (var i = 0; i < essentialPIsOnlyDC.length; i++) {
        newInnerHTMLResults = newInnerHTMLResults.concat(getTermFromLiteral(essentialPIsOnlyDC[i].literals));
        if (i != essentialPIsOnlyDC.length - 1) {
          newInnerHTMLResults = newInnerHTMLResults.concat(", ");
        }
      }
      newInnerHTMLResults = newInnerHTMLResults.concat("</span> contains only dont care Minterms");
      newInnerHTMLResults = newInnerHTMLResults.concat("<br>Required Essential Prime Implicants: <br><span style=\"font-family: 'JetBrains Mono', monospace;\">");
      for (var i = 0; i < essentialPIsWOOnlyDC.length; i++) {
        newInnerHTMLResults = newInnerHTMLResults.concat(getTermFromLiteral(essentialPIsWOOnlyDC[i].literals));
        if (i != essentialPIsWOOnlyDC.length - 1) {
          newInnerHTMLResults = newInnerHTMLResults.concat(", ");
        }
      }
    }

    // essential prime implicants results outputted.
  } else {
    newInnerHTMLResults = newInnerHTMLResults.concat("There are no essential prime implicants");
  }

  document.querySelector(identifierResults).innerHTML = newInnerHTMLResults;
  // printing finalResults
  var identifierFinalResult = ".finalResultsVar";
  identifierFinalResult = identifierFinalResult.concat(noOfVars.toString());
  var identifierFinalResultS = identifierFinalResult.concat("S");
  document.querySelector(identifierFinalResult).innerHTML = ""; // clearing any previous results
  document.querySelector(identifierFinalResultS).innerHTML = "";

  if (minTerms.length == 0) {
    var resultS = "0";
    var result = "No minterms are present in the truth table, the logic formula is <br><span style=\"font-family: 'JetBrains Mono', monospace;\">0</span>";
  } else if (primeImplicantsMinterms.length == n) {
    var resultS = "1";
    var result = "All the minterms are present in the truth table, the logic formula is <br><span style=\"font-family: 'JetBrains Mono', monospace;\">1</span>";
  } else if (remainingMinterms.length == 0) {
    var ePITerms = [];
    for (var i = 0; i < essentialPIsWOOnlyDC.length; i++) {
      ePITerms = ePITerms.concat(getTermFromLiteral(essentialPIsWOOnlyDC[i].literals));
    }
    var resultS = "";
    var result = "All minterms in the Prime Implicants are covered by the essential Prime Implicants. The final simplified logic formula is<br><span style=\"font-family: 'JetBrains Mono', monospace;\">";
    resultS = resultS.concat(ePITerms.join(" + "));
    result = result.concat(ePITerms.join(" + "));
    result = result.concat("</span>");
  } else {
    var remainingPIs = [];
    for (var i = 0; i < remainingMinterms.length; i++) {
      var temp = [];
      for (var j = arrayPrimeImplicants.length - 1; j >= 0; j--) {
        var flagMatch = false;
        if (arrayPrimeImplicants[j].minterms.includes(remainingMinterms[i])) {
          if (remainingPIs.length == 0) {
            remainingPIs.push(arrayPrimeImplicants[j]);
            break;
          } else {
            if (remainingPIs.includes(arrayPrimeImplicants[j])) {
              flagMatch = true;
              break;
            } else {
              temp.push(arrayPrimeImplicants[j]);
            }
          }
        }
      }
      console.log(temp);
      if (temp.length != 0 && !flagMatch) {
        remainingPIs.push(temp[0]);
      }
    }
    console.log(remainingPIs);
    var resultS = "";
    var result = "The following minterms are not coverd by the essential Prime Implicants<br><span style=\"font-family: 'JetBrains Mono', monospace;\">";
    result = result.concat(remainingMinterms.toString());
    result = result.concat("</span><br>The following terms includes these remaining minterms");
    result = result.concat("<br><span style=\"font-family: 'JetBrains Mono', monospace;\">");
    var ePITerms = [];
    for (var i = 0; i < essentialPIsWOOnlyDC.length; i++) {
      ePITerms = ePITerms.concat(getTermFromLiteral(essentialPIsWOOnlyDC[i].literals));
    }
    var remainingPITerms = [];
    for (var i = 0; i < remainingPIs.length; i++) {
      remainingPITerms = remainingPITerms.concat(getTermFromLiteral(remainingPIs[i].literals));
    }
    result = result.concat(remainingPITerms.join(", "));
    result = result.concat("</span><br>");

    result = result.concat("The final simplified logic formula is<br><span style=\"font-family: 'JetBrains Mono', monospace;\">");
    if (ePITerms.length != 0) {
      result = result.concat(ePITerms.join(" + "));
      result = result.concat(" + ");
      resultS = resultS.concat(ePITerms.join(" + "));
      resultS = resultS.concat(" + ");
    }
    result = result.concat(remainingPITerms.join(" + "));
    result = result.concat("</span>");
    resultS = resultS.concat(remainingPITerms.join(" + "));
    resultS = resultS.concat("</span>");
  }
  document.querySelector(identifierFinalResult).innerHTML = result;
  document.querySelector(identifierFinalResultS).innerHTML = resultS;

  var element = document.querySelector(identifierFinalResultS);
  element.classList.add("border-primary");
  element.classList.add("bg-info-subtle");
  element.classList.add("shadow-sm");
  document.querySelector("#btncheck" + noOfVars.toString()).removeAttribute("disabled");
}


// ---------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------

function calculateResultn() {
  var minTerms = document.querySelector("#nVarsMinterms").value.split(" ");
  var dontCare = document.querySelector("#nVarsDontCares").value.split(" ");
  var noVars = parseFloat(document.querySelector("#nVarsNoVars").value.split(" ")[0]);
  if (isNaN(noVars) || noVars < 2) {
    noVars = 2;
  }
  var flagM = false;
  var flagD = false;
  for (var i = 0; i < minTerms.length; i++) {
    if (isNaN(parseFloat(minTerms[i]))){
      document.querySelector("#nVarsMinterms").classList.add("is-invalid");
      flagM = true;
      break;
    }
    minTerms[i] = parseFloat(minTerms[i]);
  }

  for (var i = 0; i < dontCare.length; i++) {
    if (dontCare[0] == ''){
      break;
    }
    if (isNaN(parseFloat(dontCare[i]))){
      document.querySelector("#nVarsDontCares").classList.add("is-invalid");
      if(dontCare.length != 0){
      flagD = true;
      break;
      }
    }
    dontCare[i] = parseFloat(dontCare[i]);
  }

  if(flagM || flagD){
    return 0;
  }

  document.querySelector("#nVarsMinterms").classList.remove("is-invalid");
  document.querySelector("#nVarsDontCares").classList.remove("is-invalid");

  minTerms = removeDuplicates(minTerms);
  dontCare = removeDuplicates(dontCare);

  var allTerms = minTerms.concat(dontCare);

  var noCommon = true;
  for (var i = 0; i < minTerms.length; i++) {
    for (var j = 0; j < dontCare.length; j++) {
      if (minTerms[i] == dontCare[j]) {
        noCommon = false;
        break;
      }
      if (noCommon) {
        continue;
      } else {
        break;
      }
    }
  }
  // console.log(noCommon);
  if (!noCommon) {
    //document.querySelector("#common-error").show();
    var myModal = new bootstrap.Modal(document.getElementById('common-error'), "data-bs-toggle=\"modal\"");
    myModal.show();
    for (var i = 0; i < document.querySelectorAll(".common-error-btn").length; i++) {
      document.querySelectorAll(".common-error-btn")[i].addEventListener("click", function() {
        if (this.innerHTML == 'Re-enter terms') {
          return 0;
        } else {
          while (dontCare.length > 0) {
            dontCare.pop();
          }
          allTerms = removeDuplicates(allTerms);
          for (var j = 0; j < allTerms.length; j++) {
            if (minTerms.includes(allTerms[j])) {
              continue;
            } else {
              dontCare.push(allTerms[j]);
            }
          }
          calculateResultnNext(allTerms, minTerms, dontCare, noVars);
          document.querySelector("#nVarsDontCares").value = dontCare.join(" ");
        }
      });
    }

  } else {
    calculateResultnNext(allTerms, minTerms, dontCare, noVars);
  }
  //-------------------------------------------------------
  function calculateResultnNext(allTerms, minTerms, dontCare, noVars) {
    if (noVars > 20) {
      var myModal2 = new bootstrap.Modal(document.getElementById('no-terms-error'), "data-bs-toggle=\"modal\"");
      document.querySelector("#nVarsNoVars").classList.add("is-invalid");
      myModal2.show();
      return 0;
    }

    // console.log(minTerms);
    // console.log(dontCare);
    // console.log(noVars);
    //----------------------------------------------
    // next tasks, compare no. of variables and make decision.
    document.querySelector("#nVarsNoVars").classList.remove("is-invalid");
    var maxTerm = getMaxOfArray(allTerms);
    if (maxTerm > Math.pow(2, noVars) - 1) {
      for (var i = noVars + 1; i < 20; i++) { // considering that maximum allowable no of variables is 20
        if (Math.pow(2, i) > maxTerm) {
          noVars = i;
          break;
        } else {
          continue;
        }

        //---------------------------------------------

      }
    }
    document.querySelector("#nVarsNoVars").value = noVars;
    // console.log(allTerms);
    // console.log(minTerms);
    // console.log(dontCare);
    // console.log(noVars);

    function StructTerms(minterms, literals, onesSum, matched) {
      this.minterms = minterms;
      this.literals = literals;
      this.onesSum = onesSum;
      this.matched = matched;
    }

    noOfVars = noVars;
    minTermsAndDontCareTerms = allTerms;
    structMinAndDCTerms = [];

    function getStructTerms(noOfVars, minTermsAndDontCareTerms) {
      noOfMinandDCTerms = minTermsAndDontCareTerms.length;
      for (var i = 0; i < noOfMinandDCTerms; i++) {
        tempminterms = [];
        templiterals = [];
        temponesSum = 0;

        tempminterms.push(minTermsAndDontCareTerms[i]);
        var temp = minTermsAndDontCareTerms[i];
        // finding templiterals
        for (var j = noOfVars - 1; j >= 0; j--) {
          var tempLiteral = Math.floor(temp / Math.pow(2, j));
          templiterals.push(tempLiteral);
          temp = minTermsAndDontCareTerms[i] % Math.pow(2, j);
          if (tempLiteral) {
            temponesSum += 1;
          }
        }
        // making the structures
        var tempEntry = new StructTerms(tempminterms, templiterals, temponesSum, 0);
        structMinAndDCTerms.push(tempEntry);
      }
      // console.log(structMinAndDCTerms);

    }

    getStructTerms(noOfVars, minTermsAndDontCareTerms);
    structMinAndDCTerms = structMinAndDCTerms.sort(function(a, b) {
      return a.onesSum - b.onesSum
    });

    var identifier = ".primeImplicantTableVar";
    identifier = identifier.concat("0");
    var identifierHead = identifier.concat("-head");
    var identifierSubHead = identifier.concat("-subhead");
    var identifierBody = identifier.concat("-body");
    document.querySelector(identifierBody).innerHTML = ""; // used to empty up any previous entries in the table.
    document.querySelector(identifierHead).innerHTML = "";
    document.querySelector(identifierSubHead).innerHTML = "";
    const dictVariables = {
      1: "a",
      2: "ab",
      3: "abc",
      4: "abcd",
      5: "abcde",
      6: "abcdef",
      7: "abcdefg",
      8: "abcdefgh",
      9: "abcdefghi",
      10: "abcdefghij",
      11: "abcdefghijk",
      12: "abcdefghijkl",
      13: "abcdefghijklm",
      14: "abcdefghijklmn",
      15: "abcdefghijklmno",
      16: "abcdefghijklmnop",
      17: "abcdefghijklmnopq",
      18: "abcdefghijklmnopqr",
      19: "abcdefghijklmnopqrs",
      20: "abcdefghijklmnopqrst"
    };
    const dictTableNo = {
      1: "A",
      2: "B",
      3: "C",
      4: "D",
      5: "E",
      6: "F",
      7: "G",
      8: "H",
      9: "I",
      10: "J",
      11: "K",
      12: "L",
      13: "M",
      14: "N",
      15: "O",
      16: "P",
      17: "Q",
      18: "R",
      19: "S",
      20: "T",
      21: "U"
    };
    const dictMatched = {
      0: "<span style=\"color:blue\">PI</style>",
      1: "&#10003;"
    };

    // making the array of computed entries:
    var arrayStructTerms = [];
    arrayStructTerms[0] = structMinAndDCTerms;
    // getting other entries using the computing function
    // console.log(noOfVars+1);
    for (var i = 1; i < noOfVars + 1; i++) { // add +1 for last redundant implicant also
      // call the function that returns computed entries next matchings.
      var currentArray = arrayStructTerms[i - 1];
      var newArray = getNextArrayOfPI(currentArray);
      if (newArray.length == 0){
        break;
      }
      arrayStructTerms[i - 1] = currentArray;
      arrayStructTerms[i] = newArray;
    }
    // console.log(arrayStructTerms);
    var newInnerHTMLHead = "<tr>";
    var newInnerHTMLSubHead = "<tr>";
    var newInnerHTMLBody = "<tr>";
    for (i = 0; i < arrayStructTerms.length; i++) { // add +1 for last redundant implicant also
      var colWidth = 2 + 2 * Math.pow(2, i);
      // modifying table head
      newInnerHTMLHead = newInnerHTMLHead.concat("<th scope=\"col\">\(");
      newInnerHTMLHead = newInnerHTMLHead.concat(dictTableNo[i + 1]);
      newInnerHTMLHead = newInnerHTMLHead.concat("\)");
      newInnerHTMLHead = newInnerHTMLHead.concat("</th>");

      newInnerHTMLSubHead = newInnerHTMLSubHead.concat("<th scope=\"col\">");
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat("<div class=\"row flex-nowrap\"><div class=\"col-4\" style=\"width: ");
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat(colWidth.toString());
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat("rem\">");
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</div><div class=\"col\" style=\"width: ");
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat(noOfVars.toString());
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat("rem\">");
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat(dictVariables[noOfVars]);
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</div><div class=\"col matched-tick\"  style=\"width: 3rem\">");
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</div></div>");
      newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</td>");

      newInnerHTMLBody = newInnerHTMLBody.concat("<td scope=\"col\">");

      // making the table tbody

      var prevSum = -1;
      for (var j = 0; j < arrayStructTerms[i].length; j++) {
        var currSum = arrayStructTerms[i][j].onesSum;
        if (j == 0) {
          prevSum = arrayStructTerms[i][j].onesSum;
        } else {
          if (prevSum != currSum) {
            newInnerHTMLBody = newInnerHTMLBody.concat("<hr>");
            prevSum = currSum;
          }
        }
        newInnerHTMLBody = newInnerHTMLBody.concat("<div class=\"row flex-nowrap\"><div class=\"col-4\" style=\"width: ");
        newInnerHTMLBody = newInnerHTMLBody.concat(colWidth.toString());
        newInnerHTMLBody = newInnerHTMLBody.concat("rem\">");
        for (var k = 0; k < arrayStructTerms[i][j].minterms.length; k++) {
          if (dontCare.includes(arrayStructTerms[i][j].minterms[k])) {
            newInnerHTMLBody = newInnerHTMLBody.concat("<span class=\"dont-care-color\">");
            newInnerHTMLBody = newInnerHTMLBody.concat(arrayStructTerms[i][j].minterms[k].toString());
            newInnerHTMLBody = newInnerHTMLBody.concat("</span>");
          } else {
            newInnerHTMLBody = newInnerHTMLBody.concat(arrayStructTerms[i][j].minterms[k].toString());
          }
          if (k != arrayStructTerms[i][j].minterms.length - 1) {
            newInnerHTMLBody = newInnerHTMLBody.concat(",");
          }
        }
        newInnerHTMLBody = newInnerHTMLBody.concat("\[");
        newInnerHTMLBody = newInnerHTMLBody.concat(arrayStructTerms[i][j].onesSum.toString());
        newInnerHTMLBody = newInnerHTMLBody.concat("\]");
        newInnerHTMLBody = newInnerHTMLBody.concat("</div><div class=\"col\" style=\"width: ");
        newInnerHTMLBody = newInnerHTMLBody.concat(noOfVars.toString());
        newInnerHTMLBody = newInnerHTMLBody.concat("rem\">");
        newInnerHTMLBody = newInnerHTMLBody.concat(arrayStructTerms[i][j].literals.join(""));
        newInnerHTMLBody = newInnerHTMLBody.concat("</div><div class=\"col matched-tick\"  style=\"width: 3rem\">");
        newInnerHTMLBody = newInnerHTMLBody.concat(dictMatched[arrayStructTerms[i][j].matched]);
        newInnerHTMLBody = newInnerHTMLBody.concat("</div></div>");
      }
      newInnerHTMLBody = newInnerHTMLBody.concat("</td>");
    }
    newInnerHTMLBody = newInnerHTMLBody.concat("</tr>");
    newInnerHTMLHead = newInnerHTMLHead.concat("</tr>");
    newInnerHTMLSubHead = newInnerHTMLSubHead.concat("</tr>");
    document.querySelector(identifierHead).innerHTML = newInnerHTMLHead;
    document.querySelector(identifierBody).innerHTML = newInnerHTMLBody;
    document.querySelector(identifierSubHead).innerHTML = newInnerHTMLSubHead;

    // making a function to generate next set of prime implicants after matchings
    function getNextArrayOfPI(currentArray) {
      ni = currentArray.length;
      var nextStage = [];
      // idea here is to match literals in element i and j
      for (var i = 0; i < ni; i++) {
        for (var j = i + 1; j < ni; j++) {
          // if (currentArray[i].minterms.length == 1 && dontCare.includes(currentArray[i].minterms[0]) && dontCare.includes(currentArray[j].minterms[0])){
          //   break;
          // }
          var temp = compareArrays(currentArray[i].literals, currentArray[j].literals);
          var tempminterms = currentArray[i].minterms;
          tempminterms = tempminterms.concat(currentArray[j].minterms);
          tempminterms = removeDuplicates(tempminterms);
          tempminterms = tempminterms.sort(function(a, b) {
            return a - b
          });
          if (temp[1] == 1) {
            var tempEntry = new StructTerms(tempminterms, temp[0], temp[2], 0);
            var flag = 1;
            for (var l = 0; l < nextStage.length; l++) {
              if (compareArrays(temp[0], nextStage[l].literals)[1] == 0) {
                flag = 0;
                break;
              }
            }
            currentArray[i].matched = 1;
            currentArray[j].matched = 1;
            if (flag == 1) {
              nextStage.push(tempEntry);
            }
          }
        }
      }
      // nextStage = removeDuplicates(nextStage);
      return nextStage;

      // function returning matched arrays back and '-' for an unmatched array
      function compareArrays(a, b) {
        var c = [];
        var noOfMismatch = 0;
        var onesSum = 0;
        for (var m = 0; m < a.length; m++) {
          if (a[m] == b[m]) {
            c[m] = a[m];
            if (a[m] == 1) {
              onesSum += 1;
            }
          } else {
            c[m] = '-';
            noOfMismatch += 1;
          }
        }
        return [c, noOfMismatch, onesSum];
      }
      // end of the function
    }

    // next tasks... making the essential prime implicants table.
    // we use a for loop to iterate through all elements of the matrix arrayStructTerms and save those terms in a new matrix
    var arrayPrimeImplicants = [];
    var primeImplicantsMinterms = [];
    for (var i = 0; i < arrayStructTerms.length; i++) {
      for (var j = 0; j < arrayStructTerms[i].length; j++) {
        if (arrayStructTerms[i][j].matched == 0) {
          arrayPrimeImplicants.push(arrayStructTerms[i][j]);
        }
      }
    }
    // console.log(arrayStructTerms);
    // console.log(arrayPrimeImplicants);
    // getting the involved minterms in the found out prime primeImplicants
    for (var i = 0; i < arrayPrimeImplicants.length; i++) {
      primeImplicantsMinterms = primeImplicantsMinterms.concat(arrayPrimeImplicants[i].minterms);
    }
    // console.log(primeImplicantsMinterms);
    primeImplicantsMinterms = removeDuplicates(primeImplicantsMinterms);
    // console.log(primeImplicantsMinterms);
    primeImplicantsMinterms = primeImplicantsMinterms.sort(function(a, b) {
      return a - b
    });

    //  this section of code removes the dont care terms from the prime implicants minterms
    primeImplicantsMintermsFiltered = [];
    for (var i = 0; i < primeImplicantsMinterms.length; i++) {
      if (dontCare.includes(primeImplicantsMinterms[i])) {
        continue;
      } else {
        primeImplicantsMintermsFiltered.push(primeImplicantsMinterms[i]);
      }
    }
    primeImplicantsMinterms = primeImplicantsMintermsFiltered;
    //---------------------------------------------------------


    // console.log(primeImplicantsMinterms);

    // we now mke the table to find the essential prime implicants
    identifier = ".essentialPrimeImplicantsVar";
    identifier = identifier.concat("0");
    identifierHead = identifier.concat("-head");
    identifierBody = identifier.concat("-body");
    identifierFoot = identifier.concat("-foot");
    identifierResults = identifier.concat("-results");
    document.querySelector(identifierBody).innerHTML = ""; // used to empty up any previous entries in the table.
    document.querySelector(identifierHead).innerHTML = "";
    document.querySelector(identifierFoot).innerHTML = "";
    document.querySelector(identifierResults).innerHTML = "";
    newInnerHTMLHead = "<tr>";
    newInnerHTMLBody = "<tr>";
    newInnerHTMLFoot = "<tr>";

    newInnerHTMLHead = newInnerHTMLHead.concat("<th scope=\"col\"  style=\"width: 5rem\">");
    newInnerHTMLHead = newInnerHTMLHead.concat("Term");
    newInnerHTMLHead = newInnerHTMLHead.concat("</th>");
    newInnerHTMLHead = newInnerHTMLHead.concat("<th scope=\"col\"  style=\"width: 5rem\">");
    newInnerHTMLHead = newInnerHTMLHead.concat("Minterms");
    newInnerHTMLHead = newInnerHTMLHead.concat("</th>");
    for (i = 0; i < primeImplicantsMinterms.length; i++) {
      newInnerHTMLHead = newInnerHTMLHead.concat("<th scope=\"col\" style=\"width: 2rem\">");
      newInnerHTMLHead = newInnerHTMLHead.concat(primeImplicantsMinterms[i].toString());
      newInnerHTMLHead = newInnerHTMLHead.concat("</th>");
    }
    newInnerHTMLBody = newInnerHTMLBody.concat("<td scope=\"col\">");
    for (i = 0; i < arrayPrimeImplicants.length; i++) {
      newInnerHTMLBody = newInnerHTMLBody.concat("<div class=\"row\"><div class=\"col\">");
      newInnerHTMLBody = newInnerHTMLBody.concat(getTermFromLiteral(arrayPrimeImplicants[i].literals));
      newInnerHTMLBody = newInnerHTMLBody.concat("</div></div>");
    }
    newInnerHTMLBody = newInnerHTMLBody.concat("</td>");
    newInnerHTMLBody = newInnerHTMLBody.concat("<td scope=\"col\">");
    for (i = 0; i < arrayPrimeImplicants.length; i++) {
      newInnerHTMLBody = newInnerHTMLBody.concat("<div class=\"row\"><div class=\"col\">");
      // newInnerHTMLBody = newInnerHTMLBody.concat(arrayPrimeImplicants[i].minterms.toString());
      for (var k = 0; k < arrayPrimeImplicants[i].minterms.length; k++) {
        if (dontCare.includes(arrayPrimeImplicants[i].minterms[k])) {
          newInnerHTMLBody = newInnerHTMLBody.concat("<span class=\"dont-care-color\">");
          newInnerHTMLBody = newInnerHTMLBody.concat(arrayPrimeImplicants[i].minterms[k].toString());
          newInnerHTMLBody = newInnerHTMLBody.concat("</span>");
        } else {
          newInnerHTMLBody = newInnerHTMLBody.concat(arrayPrimeImplicants[i].minterms[k].toString());
        }
        if (k != arrayPrimeImplicants[i].minterms.length - 1) {
          newInnerHTMLBody = newInnerHTMLBody.concat(",");
        }
      }
      newInnerHTMLBody = newInnerHTMLBody.concat("</div></div>");
    }
    newInnerHTMLBody = newInnerHTMLBody.concat("</td>");

    var countMatch = [];
    var essentialPIs = [];
    var essentialPIsWOOnlyDC = [];
    var essentialPIsOnlyDC = [];
    for (i = 0; i < primeImplicantsMinterms.length; i++) {
      countMatch[i] = 0;
      newInnerHTMLBody = newInnerHTMLBody.concat("<td scope=\"col\">");
      for (var j = 0; j < arrayPrimeImplicants.length; j++) {
        newInnerHTMLBody = newInnerHTMLBody.concat("<div class=\"row\"><div class=\"col\">");
        for (var k = 0; k < arrayPrimeImplicants[j].minterms.length; k++) {
          if (arrayPrimeImplicants[j].minterms[k] == primeImplicantsMinterms[i]) {
            newInnerHTMLBody = newInnerHTMLBody.concat("<span style=\"color: green\">&#10003;</span>");
            countMatch[i] += 1;
          } else {
            newInnerHTMLBody = newInnerHTMLBody.concat("-");
          }
        }
      }
      newInnerHTMLBody = newInnerHTMLBody.concat("</div></div>");
    }
    newInnerHTMLBody = newInnerHTMLBody.concat("</td>");

    newInnerHTMLFoot = newInnerHTMLFoot.concat("<td scope=\"col\">");
    newInnerHTMLFoot = newInnerHTMLFoot.concat("</td>");
    newInnerHTMLFoot = newInnerHTMLFoot.concat("<td scope=\"col\">");
    newInnerHTMLFoot = newInnerHTMLFoot.concat("</td>");
    for (i = 0; i < countMatch.length; i++) {
      newInnerHTMLFoot = newInnerHTMLFoot.concat("<td scope=\"col\">");
      if (countMatch[i] == 1) {
        newInnerHTMLFoot = newInnerHTMLFoot.concat("<span style=\"color: blue\">&#10003;</span>");
      } else {
        newInnerHTMLFoot = newInnerHTMLFoot.concat("<span>-</span>");
      }
      newInnerHTMLFoot = newInnerHTMLFoot.concat("</td>");
    }
    // --------------------------------------------------------
    newInnerHTMLBody = newInnerHTMLBody.concat("</tr>");
    newInnerHTMLHead = newInnerHTMLHead.concat("</tr>");
    newInnerHTMLFoot = newInnerHTMLFoot.concat("</tr>");
    document.querySelector(identifierHead).innerHTML = newInnerHTMLHead;
    document.querySelector(identifierBody).innerHTML = newInnerHTMLBody;
    document.querySelector(identifierFoot).innerHTML = newInnerHTMLFoot;

    for (var i = 0; i < countMatch.length; i++) {
      if (countMatch[i] == 1) {
        for (var j = 0; j < arrayPrimeImplicants.length; j++) {
          if (arrayPrimeImplicants[j].minterms.includes(primeImplicantsMinterms[i])) {
            essentialPIs.push(arrayPrimeImplicants[j]);
          }
        }
      }
    }
    essentialPIs = removeDuplicates(essentialPIs);
    // getting the only DC essentialPIS deleted
    for (var i = 0; i < essentialPIs.length; i++) {
      var minTermDC = true;
      for (var j = 0; j < essentialPIs[i].minterms.length; j++) {
        if (minTerms.includes(essentialPIs[i].minterms[j]) == true) {
          minTermDC = false;
          break;
        } else {
          continue;
        }
      }
      if (minTermDC) {
        essentialPIsOnlyDC.push(essentialPIs[i]);
      } else {
        essentialPIsWOOnlyDC.push(essentialPIs[i]);
      }
    }


    // console.log(essentialPIs);
    // console.log(essentialPIsOnlyDC);
    // console.log(essentialPIsWOOnlyDC);

    // console.log(essentialPIs);


    var essentialIPsMinterms = [];
    for (var i = 0; i < essentialPIsWOOnlyDC.length; i++) {
      essentialIPsMinterms = essentialIPsMinterms.concat(essentialPIsWOOnlyDC[i].minterms);
    }
    // console.log(primeImplicantsMinterms);
    essentialIPsMinterms = removeDuplicates(essentialIPsMinterms);
    // console.log(primeImplicantsMinterms);
    essentialIPsMinterms = essentialIPsMinterms.sort(function(a, b) {
      return a - b
    });

    var remainingMinterms = [];
    for (var i = 0; i < minTerms.length; i++) {
      if (essentialIPsMinterms.includes(minTerms[i]) == false) {
        remainingMinterms.push(minTerms[i]);
      }
    }
    remainingMinterms = remainingMinterms.sort(function(a, b) {
      return a - b
    });
    // console.log(essentialPIs);
    // console.log(essentialIPsMinterms);
    // console.log(remainingMinterms);
    // console.log(remainingMinterms.toString(", "));

    var newInnerHTMLResults = "";
    if (essentialIPsMinterms.length != 0) {
      newInnerHTMLResults = newInnerHTMLResults.concat("Essential Prime Implicants: <br><span style=\"font-family: 'JetBrains Mono', monospace;\">");
      for (var i = 0; i < essentialPIs.length; i++) {
        newInnerHTMLResults = newInnerHTMLResults.concat(getTermFromLiteral(essentialPIs[i].literals));
        if (i != essentialPIs.length - 1) {
          newInnerHTMLResults = newInnerHTMLResults.concat(", ");
        }
      }
      newInnerHTMLResults = newInnerHTMLResults.concat("</span>");
      if (essentialPIs.length != essentialPIsWOOnlyDC.length) {
        newInnerHTMLResults = newInnerHTMLResults.concat("<br>");
        newInnerHTMLResults = newInnerHTMLResults.concat("Of which <span class=\"dont-care-color\" style=\"font-family: 'JetBrains Mono', monospace;\">");
        for (var i = 0; i < essentialPIsOnlyDC.length; i++) {
          newInnerHTMLResults = newInnerHTMLResults.concat(getTermFromLiteral(essentialPIsOnlyDC[i].literals));
          if (i != essentialPIsOnlyDC.length - 1) {
            newInnerHTMLResults = newInnerHTMLResults.concat(", ");
          }
        }
        newInnerHTMLResults = newInnerHTMLResults.concat("</span> contains only dont care Minterms");
        newInnerHTMLResults = newInnerHTMLResults.concat("<br>Required Essential Prime Implicants: <br><span style=\"font-family: 'JetBrains Mono', monospace;\">");
        for (var i = 0; i < essentialPIsWOOnlyDC.length; i++) {
          newInnerHTMLResults = newInnerHTMLResults.concat(getTermFromLiteral(essentialPIsWOOnlyDC[i].literals));
          if (i != essentialPIsWOOnlyDC.length - 1) {
            newInnerHTMLResults = newInnerHTMLResults.concat(", ");
          }
        }
      }

      // essential prime implicants results outputted.
    } else {
      newInnerHTMLResults = newInnerHTMLResults.concat("There are no essential prime implicants");
    }

    document.querySelector(identifierResults).innerHTML = newInnerHTMLResults;
    // printing finalResults
    var identifierFinalResult = ".finalResultsVar";
    identifierFinalResult = identifierFinalResult.concat("0");
    var identifierFinalResultS = identifierFinalResult.concat("S");
    document.querySelector(identifierFinalResult).innerHTML = ""; // clearing any previous results
    document.querySelector(identifierFinalResultS).innerHTML = "";

    if (minTerms.length == 0) {
      var resultS = "0";
      var result = "No minterms are present in the truth table, the logic formula is <br><span style=\"font-family: 'JetBrains Mono', monospace;\">0</span>";
    } else if (primeImplicantsMinterms.length == Math.pow(2, noOfVars)) {
      var resultS = "1";
      var result = "All the minterms are present in the truth table, the logic formula is <br><span style=\"font-family: 'JetBrains Mono', monospace;\">1</span>";
    } else if (remainingMinterms.length == 0) {
      var ePITerms = [];
      for (var i = 0; i < essentialPIsWOOnlyDC.length; i++) {
        ePITerms = ePITerms.concat(getTermFromLiteral(essentialPIsWOOnlyDC[i].literals));
      }
      var resultS = "";
      var result = "All minterms in the Prime Implicants are covered by the essential Prime Implicants. The final simplified logic formula is<br><span style=\"font-family: 'JetBrains Mono', monospace;\">";
      resultS = resultS.concat(ePITerms.join(" + "));
      result = result.concat(ePITerms.join(" + "));
      result = result.concat("</span>");
    } else {
      var remainingPIs = [];
      for (var i = 0; i < remainingMinterms.length; i++) {
        var temp = [];
        for (var j = arrayPrimeImplicants.length - 1; j >= 0; j--) {
          var flagMatch = false;
          if (arrayPrimeImplicants[j].minterms.includes(remainingMinterms[i])) {
            if (remainingPIs.length == 0) {
              remainingPIs.push(arrayPrimeImplicants[j]);
              break;
            } else {
              if (remainingPIs.includes(arrayPrimeImplicants[j])) {
                flagMatch = true;
                break;
              } else {
                temp.push(arrayPrimeImplicants[j]);
              }
            }
          }
        }
        console.log(temp);
        if (temp.length != 0 && !flagMatch) {
          remainingPIs.push(temp[0]);
        }
      }
      console.log(remainingPIs);
      var resultS = "";
      var result = "The following minterms are not coverd by the essential Prime Implicants<br><span style=\"font-family: 'JetBrains Mono', monospace;\">";
      result = result.concat(remainingMinterms.toString());
      result = result.concat("</span><br>The following terms includes these remaining minterms");
      result = result.concat("<br><span style=\"font-family: 'JetBrains Mono', monospace;\">");
      var ePITerms = [];
      for (var i = 0; i < essentialPIsWOOnlyDC.length; i++) {
        ePITerms = ePITerms.concat(getTermFromLiteral(essentialPIsWOOnlyDC[i].literals));
      }
      var remainingPITerms = [];
      for (var i = 0; i < remainingPIs.length; i++) {
        remainingPITerms = remainingPITerms.concat(getTermFromLiteral(remainingPIs[i].literals));
      }
      result = result.concat(remainingPITerms.join(", "));
      result = result.concat("</span><br>");

      result = result.concat("The final simplified logic formula is<br><span style=\"font-family: 'JetBrains Mono', monospace;\">");
      if (ePITerms.length != 0) {
        result = result.concat(ePITerms.join(" + "));
        result = result.concat(" + ");
        resultS = resultS.concat(ePITerms.join(" + "));
        resultS = resultS.concat(" + ");
      }
      result = result.concat(remainingPITerms.join(" + "));
      result = result.concat("</span>");
      resultS = resultS.concat(remainingPITerms.join(" + "));
      resultS = resultS.concat("</span>");
    }
    document.querySelector(identifierFinalResult).innerHTML = result;
    document.querySelector(identifierFinalResultS).innerHTML = resultS;
    var element = document.querySelector(identifierFinalResultS);
    element.classList.add("border-primary");
    element.classList.add("bg-info-subtle");
    element.classList.add("shadow-sm");
    document.querySelector("#btncheck0").removeAttribute("disabled");

    //-------------------------------
  }
}

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

function removeDuplicatesStruct(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getTermFromLiteral(literal) {
  var m = literal.length;
  var term = "";
  const mToVars = {
    2: ['x', 'y'],
    3: ['x', 'y', 'z'],
    4: ['w', 'x', 'y', 'z'],
    5: ['v', 'w', 'x', 'y', 'z'],
    6: ['u', 'v', 'w', 'x', 'y', 'z']
  };
  if (m > 6) {
    var temp = [];
    var dictTableNo = {
      1: "A",
      2: "B",
      3: "C",
      4: "D",
      5: "E",
      6: "F",
      7: "G",
      8: "H",
      9: "I",
      10: "J",
      11: "K",
      12: "L",
      13: "M",
      14: "N",
      15: "O",
      16: "P",
      17: "Q",
      18: "R",
      19: "S",
      20: "T",
      21: "U"
    };
    for (var i = 1; i < m + 1; i++) {
      temp.push(dictTableNo[i].toLowerCase());
    }
    mToVars[m] = temp;
  }
  if (!literal.includes(1) && !literal.includes(0)) {
    term = term.concat("1");
  } else {
    for (var i = 0; i < m; i++) {
      if (literal[i] == 1) {
        term = term.concat(mToVars[m][i]);
      } else if (literal[i] == 0) {
        term = term.concat(mToVars[m][i]);
        term = term.concat("\'");
      } else {
        continue;
      }
    }
  }
  return term;
}

function results(noOfVars){
  var element = document.querySelector("#labelcheck"+noOfVars.toString());
  // console.log(element);
  if (element.innerHTML == "Show Results"){
    showResult(noOfVars);
    element.innerHTML = "Hide Results";
  } else {
    hideResult(noOfVars)
    element.innerHTML = "Show Results";
  }
}

function showResult(noOfVars) {
  var identfier = "#resultsTableVar";
  identfier = identfier.concat(noOfVars.toString());
  document.querySelector(identfier).classList.remove("class-hidden");
}

function hideResult(noOfVars) {
  var identfier = "#resultsTableVar";
  identfier = identfier.concat(noOfVars.toString());
  document.querySelector(identfier).classList.add("class-hidden");
}

function resetResults(noOfVars) {
  // resetting mapTable and short results
  var identifierTableEntrries = "#Var";
  var identifierResultsS = ".finalResultsVar";
  identifierResultsS = identifierResultsS.concat(noOfVars.toString());
  identifierResultsS = identifierResultsS.concat("S");
  identifierTableEntrries = identifierTableEntrries.concat(noOfVars.toString());
  identifierTableEntrries = identifierTableEntrries.concat("m");
  for (var i = 0; i < Math.pow(2, noOfVars); i++) {
    var temp = identifierTableEntrries;
    temp = temp.concat(i.toString());
    document.querySelector(temp).innerHTML = 0;
  }
  document.querySelector(identifierResultsS).innerHTML = 0;
  var element = document.querySelector(identifierResultsS);
  element.classList.remove("border-primary");
  element.classList.remove("bg-info-subtle");
  element.classList.remove("shadow-sm");
  // resetting prime implicants table and essential prime implicants table
  var identifierPITable = ".primeImplicantTableVar";
  identifierPITable = identifierPITable.concat(noOfVars.toString());
  var identifierPITableHead = identifierPITable.concat("-head");
  var identifierPITableSubhead = identifierPITable.concat("-subhead");
  var identifierPITableBody = identifierPITable.concat("-body");
  document.querySelector(identifierPITableHead).innerHTML = "";
  document.querySelector(identifierPITableSubhead).innerHTML = "";
  document.querySelector(identifierPITableBody).innerHTML = "";

  var identifierEPITable = ".essentialPrimeImplicantsVar";
  identifierEPITable = identifierEPITable.concat(noOfVars.toString());
  var identifierEPITableHead = identifierEPITable.concat("-head");
  var identifierEPITableFoot = identifierEPITable.concat("-foot");
  var identifierEPITableBody = identifierEPITable.concat("-body");
  var identifierEPITableResults = identifierEPITable.concat("-results");
  document.querySelector(identifierEPITableHead).innerHTML = "";
  document.querySelector(identifierEPITableFoot).innerHTML = "";
  document.querySelector(identifierEPITableBody).innerHTML = "";
  document.querySelector(identifierEPITableResults).innerHTML = "";

  var identifierFinalResults = ".finalResultsVar";
  identifierFinalResults = identifierFinalResults.concat(noOfVars.toString());
  document.querySelector(identifierFinalResults).innerHTML = "";

  //-----------------------------------

  hideResult(noOfVars);
  document.querySelector("#labelcheck"+noOfVars.toString()).innerHTML = "Show Results";
  document.querySelector("#btncheck"+noOfVars.toString()).checked = false;
  document.querySelector("#btncheck"+noOfVars.toString()).disabled = true;
}

function resetResultsn() {
  document.querySelector("#nVarsMinterms").value = "";
  document.querySelector("#nVarsDontCares").value = "";
  document.querySelector("#nVarsNoVars").value = "";
  // resetting mapTable and short results
  var identifierResultsS = ".finalResultsVar";
  identifierResultsS = identifierResultsS.concat("0");
  identifierResultsS = identifierResultsS.concat("S");
  document.querySelector(identifierResultsS).innerHTML = 0;
  var element = document.querySelector(identifierResultsS);
  element.classList.remove("border-primary");
  element.classList.remove("bg-info-subtle");
  element.classList.remove("shadow-sm");
  // resetting prime implicants table and essential prime implicants table
  var identifierPITable = ".primeImplicantTableVar";
  identifierPITable = identifierPITable.concat("0");
  var identifierPITableHead = identifierPITable.concat("-head");
  var identifierPITableSubhead = identifierPITable.concat("-subhead");
  var identifierPITableBody = identifierPITable.concat("-body");
  document.querySelector(identifierPITableHead).innerHTML = "";
  document.querySelector(identifierPITableSubhead).innerHTML = "";
  document.querySelector(identifierPITableBody).innerHTML = "";
  var identifierEPITable = ".essentialPrimeImplicantsVar";
  identifierEPITable = identifierEPITable.concat("0");
  var identifierEPITableHead = identifierEPITable.concat("-head");
  var identifierEPITableFoot = identifierEPITable.concat("-foot");
  var identifierEPITableBody = identifierEPITable.concat("-body");
  var identifierEPITableResults = identifierEPITable.concat("-results");
  document.querySelector(identifierEPITableHead).innerHTML = "";
  document.querySelector(identifierEPITableFoot).innerHTML = "";
  document.querySelector(identifierEPITableBody).innerHTML = "";
  document.querySelector(identifierEPITableResults).innerHTML = "";

  var identifierFinalResults = ".finalResultsVar";
  identifierFinalResults = identifierFinalResults.concat("0");
  document.querySelector(identifierFinalResults).innerHTML = "";
  document.querySelector("#nVarsNoVars").classList.remove("is-invalid");
  document.querySelector("#nVarsMinterms").classList.remove("is-invalid");
  document.querySelector("#nVarsDontCares").classList.remove("is-invalid");

  hideResult(0);
  document.querySelector("#labelcheck0").innerHTML = "Show Results";
  document.querySelector("#btncheck0").checked = false;
  document.querySelector("#btncheck0").disabled = true;
}

function lightDarkMode() {
  var element = document.getElementsByTagName("BODY")[0];
  // console.log(element.getAttribute("data-bs-theme"));
  var theme = element.getAttribute("data-bs-theme");
  if (theme == "dark") {
    element.removeAttribute("data-bs-theme");
    element.setAttribute("data-bs-theme", "light");
    // var iconBtn = document.querySelector(".btn-icon");
    // iconBtn.classList.remove("btn-dark");
    // iconBtn.classList.add("btn-light");
    var icon = document.querySelector(".bi");
    icon.classList.remove("bi-moon-stars");
    icon.classList.add("bi-brightness-high");
    var resetBtn =  document.querySelectorAll(".btn-input-reset");
    for(var i=0; i<resetBtn.length; i++){
      resetBtn[i].classList.remove("btn-dark");
      resetBtn[i].classList.add("btn-light");
    }
    var finalResults =  document.querySelectorAll(".finalResults");
    for(var i=0; i<finalResults.length; i++){
      finalResults[i].classList.remove("bg-dark");
    }
    document.querySelector("#nVarsMinterms").classList.remove("bg-dark");
    document.querySelector("#nVarsDontCares").classList.remove("bg-dark");
    document.querySelector("#nVarsNoVars").classList.remove("bg-dark");

  } else {
    element.removeAttribute("data-bs-theme");
    element.setAttribute("data-bs-theme", "dark");
    // var iconBtn = document.querySelector(".btn-icon");
    // iconBtn.classList.remove("btn-light");
    // iconBtn.classList.add("btn-dark");
    var icon = document.querySelector(".bi");
    icon.classList.remove("bi-brightness-high");
    icon.classList.add("bi-moon-stars");
    var resetBtn =  document.querySelectorAll(".btn-input-reset");
    for(var i=0; i<resetBtn.length; i++){
      resetBtn[i].classList.remove("btn-light");
      resetBtn[i].classList.add("btn-dark");
    }
    var finalResults =  document.querySelectorAll(".finalResults");
    for(var i=0; i<finalResults.length; i++){
      finalResults[i].classList.add("bg-dark");
    }
    document.querySelector("#nVarsMinterms").classList.add("bg-dark");
    document.querySelector("#nVarsDontCares").classList.add("bg-dark");
    document.querySelector("#nVarsNoVars").classList.add("bg-dark");

  }
}
