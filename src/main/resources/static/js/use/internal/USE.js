/**
 * @descriptionThe visualization generation of IPSA is driven by the AngularJS directive coded below. This directive will embed an SVG element into a <div>
 *    Javascript objects are listed as attributes to the div tag and provide the script with the variables needed to generated the interactive annotated spectrum
 * @example <div annotated-spectrum plotdata="set.plotData" peptide="set.peptide" settings="set.settings" class="content"></div>
 * @returns {object} The directive.
 */
angular.module("IPSA.directive", []).directive("annotatedSpectrum", function ($log) {
  /**
   * @description The directive variable used to the initiate the 2-way binding between this template and the controller
   * @property {string} directive.restrict - Restricts the directive to attribute and elements only
   * @property {object} directive.scope - Holds objects containing spectral data, peptide data, and visualization settings
   * @property {object} directive.scope.plotdata - Contains the numerical, ordinal, and categorical data required to generate the visualization
   * @property {object} directive.scope.peptide - Contains ms2 scan number, peptide sequence, precursor mz, charge, and modifications
   * @property {object} directive.scope.settings - Contains tolerance type (ppm/Da), tolerance threshold, and ionization mode
   * @property {object} directive.scope.fileData - Contains data parsed from input file
   */
  var directive = {
    restrict: "AE",
    scope: {
      plotdata: "=?",
      mirrorplotdata: "=?",
      peptide: "=?",
      peptidebottom: "=?",
      settings: "=?",
      score: "=?",
      scoretop: "=?",
      scorebottom: "=?",
      height: "=?",
      fileData: "=filedata",
      fileDataBottom: "=filedatabottom",
      checkModel: "=?",
    },
  };

  /**
   * @description Two arrays containing the unicode superscript and subscripts characters for numbers 0-10
   */
  var superscript = ["\u2070", "\u00B9", "\u00B2", "\u00B3", "\u2074", "\u2075", "\u2076", "\u2077", "\u2078", "\u2079"];
  var subscript = ["\u2080", "\u2081", "\u2082", "\u2083", "\u2084", "\u2085", "\u2086", "\u2087", "\u2088", "\u2089", ",", "\u208D", "\u208E"];

  /**
   * @function Formats fragment ion labels for the annotated spectrum
   * @argument {string} label - The raw text of the fragment ion label i.e. "y3"
   * @argument {string} neutralLoss - The neutral loss of the fragment ion, if applicable
   * @argument {int} charge - The absolute value of the fragment ion charge
   * @argument {string} ionizationMode - "+" or "-"
   * @returns {string} A formatted label ready to be placed into the visualization
   */
  var formatLabel = function (label, neutralLoss, charge, ionizationMode) {
    // string to be returned from function
    var returnString = "";
    // Lazy cast charge to a string
    charge += "";

    // if there is a label to format, format it
    if (label) {
      // special logic to format labels containing brackets i.e. unreacted precursor
      if (label[0] == "[") {
        label = label.slice(1, -1);

        // [M+2H-H₂O]⁺²
        returnString += "[" + label + formatNeutralLoss(neutralLoss) + "]";

        // add unicode superscripts and charges to multiply charged fragment ions
        if (charge > 1) {
          if (ionizationMode == "+") {
            returnString += "\u207a";
          } else {
            returnString += "\u207b";
          }

          // transform every character in the charge variable into superscripts
          for (var i = 0; i < charge.length; i++) {
            returnString += powerUnicode(charge[i], false);
          }
        }
      } else {
        // normal logic to format
        var fragmentNumber = label.slice(1);

        // generate labels for positive mode fragment ions
        if (ionizationMode == "+") {
          // labels for singly-charged ions
          if (charge == 1) {
            // labels for c-1 ions
            if (label[0] == "C") {
              returnString += "[c";
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += "-H" + formatNeutralLoss(neutralLoss) + "]";
              // labels for z+1 ions
            } else if (label[0] == "Z") {
              returnString += "[z";
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += "+H" + formatNeutralLoss(neutralLoss) + "]";
              // logic for a,b,c,x,y,z fragment ions with neutral losses
            } else if (neutralLoss) {
              returnString += "[" + label[0];

              // add a unicode bullet to z-ions to support etd fragmentation
              if (label[0] == "z") {
                returnString += "\u2022";
              }
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += formatNeutralLoss(neutralLoss) + "]";
              // logic for a,b,c,x,y,z fragment ions without neutral losses
            } else {
              returnString += label[0];
              // add a unicode bullet to z-ions to support etd fragmentation
              if (label[0] == "z") {
                returnString += "\u2022";
              }
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
            }
            // labels for multiply-charged ions
          } else {
            // labels for c-1 ions
            if (label[0] == "C") {
              returnString += "[c";
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += "-H" + formatNeutralLoss(neutralLoss) + "]" + "\u207a";
              for (var i = 0; i < charge.length; i++) {
                returnString += powerUnicode(charge[i]);
              }
              // labels for z+1 ions
            } else if (label[0] == "Z") {
              returnString += "[z";
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += "+H" + formatNeutralLoss(neutralLoss) + "]" + "\u207a";
              for (var i = 0; i < charge.length; i++) {
                returnString += powerUnicode(charge[i]);
              }
              // logic for a,b,c,x,y,z fragment ions with neutral losses
            } else {
              if (neutralLoss) {
                console.log(label, neutralLoss)
                returnString += "[" + label[0];
                if (label[0] == "z") {
                  returnString += "\u2022";
                }
                for (var i = 0; i < fragmentNumber.length; i++) {
                  returnString += powerUnicode(fragmentNumber[i], true);
                }
                returnString += formatNeutralLoss(neutralLoss) + "]" + "\u207a";
                for (var i = 0; i < charge.length; i++) {
                  returnString += powerUnicode(charge[i]);
                }
                // logic for a,b,c,x,y,z fragment ions without neutral losses
              } else {
                returnString += label[0];
                if (label[0] == "z") {
                  returnString += "\u2022";
                }
                for (var i = 0; i < fragmentNumber.length; i++) {
                  returnString += powerUnicode(fragmentNumber[i], true);
                }
                returnString += "\u207a";
                for (var i = 0; i < charge.length; i++) {
                  returnString += powerUnicode(charge[i]);
                }
              }
            }
          }
          // generate labels for negative mode fragment ions
        } else {
          // labels for singly-charged ions
          if (charge == 1) {
            // labels for a• ions
            if (label[0] == "a") {
              // a• ions with neutral losses
              if (neutralLoss) {
                returnString += "[a\u2022";
                for (var i = 0; i < fragmentNumber.length; i++) {
                  returnString += powerUnicode(fragmentNumber[i], true);
                }
                returnString += formatNeutralLoss(neutralLoss) + "]";
                // a• ions without neutral losses
              } else {
                returnString += "a\u2022";
                for (var i = 0; i < fragmentNumber.length; i++) {
                  returnString += powerUnicode(fragmentNumber[i], true);
                }
              }
              // logic for b,c,x,y,z fragment ions with neutral losses
            } else if (neutralLoss) {
              returnString += "[" + label[0];
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += formatNeutralLoss(neutralLoss) + "]";
              // logic for b,c,x,y,z fragment ions without neutral losses
            } else {
              returnString += label[0];
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
            }
            // labels for multiply-charged ions
          } else {
            // labels for ions with neutral losses
            if (neutralLoss) {
              returnString += "[" + label[0];
              // labels for a• ions
              if (label[0] == "a") {
                returnString += "\u2022";
              }
              // subscript fragment numbers
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              // add neutral losses
              returnString += formatNeutralLoss(neutralLoss) + "]" + "\u207b";
              // superscript the fragment charge
              for (var i = 0; i < charge.length; i++) {
                returnString += powerUnicode(charge[i]);
              }
              // format regular fragment ion i.e. y3
            } else {
              returnString += label[0];
              if (label[0] == "a") {
                returnString += "\u2022";
              }
              for (var i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += "\u207b";
              for (var i = 0; i < charge.length; i++) {
                returnString += powerUnicode(charge[i]);
              }
            }
          }
        }
      }
    }
    return returnString;
  };

  /**
   * @deprecated Original function used to format labels for visualization. This is no longer used
   * @function Formats fragment ion labels for the annotated spectrum
   * @argument {string} d - The raw text of the fragment ion label i.e. "y3"
   * @returns {string} A formatted label ready to be placed into the visualization.
   */
  var formatLabelPower = function (d) {
    var returnString = d.charAt(0);

    if (returnString == "z") {
      returnString += "\u2022";
    }
    for (var i = 1; i < d.length; i++) {
      returnString += powerUnicode(d.charAt(i), true);
    }
    return returnString;
  };

  /**
   * @function Transforms an input number into a unicode sub/superscript
   * @argument {string} number - An input number, 0-9
   * @argument {boolean} isSubscript - Determines if the number should be transformed into a subscript or superscript
   * @returns {string} The unicode sub/superscript representation of the input number
   */
  var powerUnicode = function (number, isSubscript) {
    if (isSubscript) {
      if (number === "-") {
        return subscript[10];
      }
      if (number === "(") {
        return subscript[11];
      }
      if (number === ")") {
        return subscript[12];
      }
      return subscript[number];
    } else {
      return superscript[number];
    }
  };

  /**
   * @deprecated Absolute intensities are no longer implemented in the visualization
   * @function Transforms a raw absolute intensity to scientific notation for the Y-axis tick labels
   * @argument {integer} d - An input number to be transformed to scientific notation
   * @returns {string} Absolute intensity in scientific notation.
   */
  var formatAxisPower = function (d) {
    return (d + "")
      .split("")
      .map(function (c) {
        return superscript[c];
      })
      .join("");
  };

  /**
   * @function Checks if the provided annotation has been recorded in the master annotation list for generating an annotated peptide sequence
   * @argument {object} obj - An object containing an annotation's type, location, and (not used) color
   * @example {text: "y", location: 3, color: "#be202d"}
   * @argument {object[]} An array of previously recorded annotation objects
   * @returns {boolean} If the object is included in the list
   */
  var containsLabelTick = function (obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].text == obj.text && list[i].location == obj.location) {
        return true;
      }
    }
    return false;
  };

  /**
   * @function Formats neutral loss text into labels for annotation
   * @argument {string} string - A neutral loss associated with the annotated fragment ion. "-H2O"
   * @returns {string} A formatted neutral loss. "-H₂O"
   */
  var formatNeutralLoss = function (string) {
    var returnString = "";

    if (string) {
      var char = "";
      var length = string.length;
      for (var i = 0; i < length; i++) {
        var char = string.charAt(i);
        // subscript numbers
        if (/[0-9]/.test(char)) {
          returnString += subscript[char];
        } else {
          returnString += char;
        }
      }
    }

    return returnString;
  };

  /**
   * @description Define tooltip popups to be later called during interactive mouseovers
   */
  var tip = d3.tip().attr("class", "d3-tip").offset([0, 0]);

  /**
   * @description Set ionization mode to positive by default
   */
  var ionizationMode = "+";

  /**
   * @description Links the IPSA directive to the annotatedSpectrum HTML tag.
   */
  directive.link = function (scope, elements, attr) {
    /**
     * @description Retrieves calculated precursor charge from the scope.peptide object. Additionally, updates the ionization mode from the default "+" if necessary.
     * @returns {number} The peptide precursor mass to charge
     */
    scope.getPrecursorMz = function () {
      return scope.peptide.precursorMz;
    };

    /**
     * @description Retrieves calculated precursor charge from the scope.peptide object. Additionally, updates the ionization mode from the default "+" if necessary.
     * @returns {number} The peptide precursor mass to charge
     */
    scope.getPrecursorMzBottom = function () {
      return scope.peptidebottom.precursorMz;
    };

    /**
     * @description Retrieves the peptide sequence.
     * @returns {string} The peptide amino acid sequence.
     */
    scope.getSequence = function () {
      return scope.peptide.sequence;
    };

    /**
     * @description Retrieves the peptide sequence.
     * @returns {string} The peptide amino acid sequence.
     */
    scope.getSequenceBottom = function () {
      return scope.peptidebottom.sequence;
    };

    scope.getSequences = function () {
      return scope.plotdata.sequences;
    }

    scope.getSequencesBottom = function () {
      return scope.mirrorplotdata.sequences;
    }

    /**
     * @description Retrieves the peptide precursor charge.
     * @returns {number} The peptide precursor charge.
     */
    scope.getPrecursorCharge = function () {
      return scope.peptide.precursorCharge;
    };

    /**
     * @description Retrieves the peptide precursor charge.
     * @returns {number} The peptide precursor charge.
     */
    scope.getPrecursorChargeBottom = function () {
      return scope.peptidebottom.precursorCharge;
    };

    /**
     * @description Retrieves all of the spectral mass to charge values
     * @example [100, 121.3154, 125.9435, ...]
     * @returns {Array} All experimental mass to charge values.
     */
    scope.getX = function () {
      return scope.plotdata.x;
    };

    /**
     * @description Retrieves all of the spectral mass to charge values
     * @example [100, 121.3154, 125.9435, ...]
     * @returns {Array} All experimental mass to charge values.
     */
    scope.getMirrorX = function () {
      return scope.mirrorplotdata.x;
    };

    scope.getId = function () {
      return scope.plotdata.id;
    };

    scope.getIdMirror = function () {
      // return scope.mirrorplotdata.id;
      return scope.plotdata.intensityErrorIdsBottom;
    };

    /**
     * @description Retrieves all of the spectral intensity values
     * @example [10000, 648059, 393403, ...]
     * @returns {Array} All experimental intensities values.
     */
    scope.getIntensities = function () {
      return scope.plotdata.y;
    };

    /**
     * @description Retrieves all of the spectral intensity values
     * @example [10000, 648059, 393403, ...]
     * @returns {Array} All experimental intensities values.
     */
    scope.getMirrorIntensities = function () {
      return scope.mirrorplotdata.y;
    };

    /**
     * @description Retrieves all of the spectral intensity values in percent relative abundance format. Min = 0, Max = 1.
     * @example [0.01, 0.12, .063, ...]
     * @returns {Array} All experimental intensity values in percent relative abundance format.
     */
    scope.getPercentBasePeak = function () {
      return scope.plotdata.percentBasePeak;
    };

    /**
     * @description Retrieves all of the spectral intensity values in percent relative abundance format. Min = 0, Max = 1.
     * @example [0.01, 0.12, .063, ...]
     * @returns {Array} All experimental intensity values in percent relative abundance format.
     */
    scope.getMirrorPercentBasePeak = function () {
      return scope.mirrorplotdata.percentBasePeak;
    };

    /**
     * @description Retrieves the previously specified colors to draw the spectral data with. Each spectral peak will have a color associated with it depending on what fragment types were
     * 		specified and the colors specified in the control form. Colors must be provided in hexadecimal format.
     * @example ["#a6a6a6", "#0d75bc", "#be202d", ...]
     * @returns {Array} All colors in hexidecimal notation.
     */
    scope.getColors = function () {
      return scope.plotdata.color;
    };

    scope.getCustomLossAndGainColor = function () {
      return scope.checkModel;
    }

    /**
     * @description Retrieves the previously specified colors to draw the spectral data with. Each spectral peak will have a color associated with it depending on what fragment types were
     * 		specified and the colors specified in the control form. Colors must be provided in hexadecimal format.
     * @example ["#a6a6a6", "#0d75bc", "#be202d", ...]
     * @returns {Array} All colors in hexidecimal notation.
     */
    scope.getMirrorColors = function () {
      return scope.mirrorplotdata.color;
    };

    /**
     * @description Retrieves all the best matching fragment labels as an array. Spectral peaks which don't have a matching fragment should be listed as an empty string.
     * @example ["", "b1", "y1", ...]
     * @returns {Array} An array containing all annotated labels. Non-annotated peaks will have an empty string as a placeholder.
     */
    scope.getLabels = function () {
      return scope.plotdata.label;
    };

    /**
     * @description Retrieves all the best matching fragment labels as an array. Spectral peaks which don't have a matching fragment should be listed as an empty string.
     * @example ["", "b1", "y1", ...]
     * @returns {Array} An array containing all annotated labels. Non-annotated peaks will have an empty string as a placeholder.
     */
    scope.getMirrorLabels = function () {
      return scope.mirrorplotdata.label;
    };

    /**
     * @description Retrieves all the best matching fragment label charges as an array. Spectral peaks which don't have a matching fragment should be listed as 0.
     * @example ["0", "1", "2", ...]
     * @returns {Array} An array containing all annotated fragment charges. Non-annotated peaks will have 0 as a placeholder.
     */
    scope.getLabelCharges = function () {
      return scope.plotdata.labelCharge;
    };

    /**
     * @description Retrieves all the best matching fragment label charges as an array. Spectral peaks which don't have a matching fragment should be listed as 0.
     * @example ["0", "1", "2", ...]
     * @returns {Array} An array containing all annotated fragment charges. Non-annotated peaks will have 0 as a placeholder.
     */
    scope.getMirrorLabelCharges = function () {
      return scope.mirrorplotdata.labelCharge;
    };

    /**
     * @description Retrieves all the best matching fragment label neutral losses as an array. Spectral peaks which don't have a neutral loss should be listed as an empty string
     * @example ["", "", "2", ...]
     * @returns {Array} An array containing all annotated fragment neutral losses. Spectral peaks without a neutral loss will have an empty string as a placeholder
     */
    scope.getNeutralLosses = function () {
      return scope.plotdata.neutralLosses;
    };

    scope.getMirrorNeutralLosses = function () {
      return scope.mirrorplotdata.neutralLosses;
    };

    /**
     * @description Retrieves an array containing bar widths. These values are used to scale annotated peak widths differently.
     * @example ["1", "3", "3", ...]
     * @returns {Array} An array containing all bar widths. Non-annotated peaks default to width = 1. Annotated peaks have width = 3.
     */
    scope.getWidths = function () {
      return scope.plotdata.barwidth;
    };

    /**
     * @description Retrieves an array containing bar widths. These values are used to scale annotated peak widths differently.
     * @example ["1", "3", "3", ...]
     * @returns {Array} An array containing all bar widths. Non-annotated peaks default to width = 1. Annotated peaks have width = 3.
     */
    scope.getMirrorWidths = function () {
      return scope.mirrorplotdata.barwidth;
    };

    /**
     * @description Retrieves an array containing mass errors of annotated fragments. Non-annotated spectral features should default to empty strings.
     * @example ["", "3", "3", ...]
     * @returns {Array} An array containing all mass errors of annotated fragments. Non-annotated spectral features should default to empty strings.
     */
    scope.getMassErrorX = function () {
      return scope.plotdata.massErrorX;
    };

    scope.getIntensityErrorIdsTop = function () {
      return scope.plotdata.intensityErrorIdsTop;
    };
    scope.getIntensityErrorIdsBottom = function () {
      return scope.plotdata.intensityErrorIdsBottom;
    };

    /**
     * @description Retrieves an array containing mass errors of annotated fragments. Non-annotated spectral features should default to empty strings.
     * @example ["", "3", "3", ...]
     * @returns {Array} An array containing all mass errors of annotated fragments. Non-annotated spectral features should default to empty strings.
     */
    scope.getMassError = function () {
      return scope.plotdata.massError;
    };

    scope.getMassErrorBottomId = function () {
      return scope.mirrorplotdata.id;
    };
    scope.getMassErrorTopId = function () {
      return scope.plotdata.id;
    };

    scope.getIntensityError = function () {
      return scope.plotdata.intensityError;
    };

    /**
     * @description Retrieves an array containing theoratical mass to charges of annotated fragments. Non-annotated spectral features should default to 0.
     * @example ["", "3", "3", ...]
     * @returns {Array} Retrieves an array containing theoratical mass to charges of annotated fragments. Non-annotated spectral features should default to 0.
     */
    scope.getTheoreticalMz = function () {
      return scope.plotdata.theoMz;
    };

    /**
     * @description Retrieves an object which contains the mass error minimum/maximum, mass error unit (ppm or Da), and ionization mode. These values are used in assigning a scale for the
     * 		mass error portion of the visualization and charge signs.
     * @example settings: { toleranceThreshold: 10, toleranceType: "ppm", ionizationMode: "+" }
     * @returns {object} Retrieves an array containing theoratical mass to charges of annotated fragments. Non-annotated spectral features should default to 0.
     */
    scope.getSettings = function () {
      return scope.settings;
    };

    /**
     * @description Retrieves an object which contains the mass error minimum/maximum, mass error unit (ppm or Da), and ionization mode. These values are used in assigning a scale for the
     * 		mass error portion of the visualization and charge signs.
     * @example settings: { toleranceThreshold: 10, toleranceType: "ppm", ionizationMode: "+" }
     * @returns {object} Retrieves an array containing theoratical mass to charges of annotated fragments. Non-annotated spectral features should default to 0.
     */
    scope.getSettingsBottom = function () {
      return scope.settingsBottom;
    };

    /**
     * @description Retrieves an array which contains an entry for every possible modifictaion position on the peptide. Modification locations are shown on the peptide sequence by changing
     * 		the single character amino acid representations to lower case.
     * @example N-terminus (index -1) is unmodified. The first amino acid (index 0) has a water loss. [{site: -1, deltaElement: null, deltaMass: 0}, {site: 0, deltaElement: "H-2 O-1,
     * 		deltaMass: -18.01056468403"}...]
     * @returns {array} retrieves all peptide modifications.
     */
    scope.getModificationsBottom = function () {
      return scope.peptidebottom.mods;
    };

    /**
     * @description Retrieves an array which contains an entry for every possible modifictaion position on the peptide. Modification locations are shown on the peptide sequence by changing
     * 		the single character amino acid representations to lower case.
     * @example N-terminus (index -1) is unmodified. The first amino acid (index 0) has a water loss. [{site: -1, deltaElement: null, deltaMass: 0}, {site: 0, deltaElement: "H-2 O-1,
     * 		deltaMass: -18.01056468403"}...]
     * @returns {array} retrieves all peptide modifications.
     */
    scope.getModifications = function () {
      return scope.peptide.mods;
    };

    scope.getModifications2 = function (topSpectrum) {
      if (topSpectrum) {
        return scope.peptide.origin;
      } else {
        return scope.peptidebottom.origin;
      }
    };

    /**
     * @description The object defined in this method specifies the dimensions of the generated SVG. These can be edited to resize parts of the SVG. However, the perspective is forced into a
     * 		viewbox so zooming on the page doesn't mess with rendering.
     * @property {object} options.svg - Defines the overall height, width, margins, and padding value of the total SVG. All other SVG elements are encompassed in this area.
     * @property {object} options.interactiveTitle - Dimensions used to generate the peptide sequence marked with the location of detected fragment ions
     * @property {object} options.statistics - Dimensions used to place the text elements "precursor m/z: #     Charge: #     Fragmented Bonds: "
     * @property {object} options.annotation - Dimensions used to generate the annotated mass spectrum. "zoomFactor" is the scalar value used to increment/decrement the aspect ratio when zooming.
     * @property {object} options.fragments - Dimensions used to generate the mass error dot chart below the annotated mass spectrum.
     * @returns {array} Plotting options.
     */
    scope.getOptions = function () {
      return _.merge(
        {
          svg: {
            width: 700,
            height: scope.height,
            margin: {
              top: 0,
              right: 15,
              bottom: 35,
              left: 60,
            },
            padding: 0.05,
          },
          renderSize: {
            width: 1080,
            height: 885,
          },
          interactiveTitle: {
            width: 700,
            height: (scope.height * 6) / 100,
            margin: {
              top: 5,
              right: 15,
              bottom: 0,
              left: 60,
            },
            padding: 0.05,
          },
          interactiveTitleBottom: {
            width: 700,
            height: (scope.height * 6) / 100,
            margin: {
              top: scope.height - (scope.height * 6) / 100,
              right: 15,
              bottom: 0,
              left: 60,
            },
            padding: 0.05,
          },
          statistics: {
            width: 700,
            height: (scope.height * 4) / 100,
            margin: {
              top: (scope.height * 10) / 100,
              right: 15,
              bottom: 0,
              left: 60,
              categoryPadding_2: 80,
              categoryPadding_3: 220,
              categoryPadding_4: 65,
              categoryPadding_5: 35,
              dataPadding_1: -100,
              dataPadding_2: -20,
              dataPadding_3: 125,
              dataPadding_4: 40,
              dataPadding_5: 40,
            },
            padding: 0.05,
          },
          statisticsBottom: {
            width: 700,
            height: (scope.height * 4) / 100,
            margin: {
              top: scope.height - (scope.height * 16) / 100,
              right: 15,
              bottom: 35,
              left: 60,
              categoryPadding_2: 80,
              categoryPadding_3: 320,
              categoryPadding_4: 65,
              categoryPadding_5: 35,
              categoryPadding_6: 15,
              dataPadding_1: -100,
              dataPadding_2: -20,
              dataPadding_3: 185,
              dataPadding_4: 40,
              dataPadding_5: 40,
              dataPadding_6: 40,
            },
            padding: 0.05,
          },
          annotation: {
            width: 700,
            zoomFactor: 1.1,
            height: (scope.height * 18) / 100,
            heightBottom: (scope.height * 18) / 100,
            margin: {
              top: (scope.height * 20) / 100,
              right: 15,
              bottom: 26,
              left: 60,
              zoomXHeight: 45,
              zoomXHeightBottom: 30,
              yAxisLabelPadding: 70,
              xAxisLabelPadding: 20,
            },
            padding: 0.05,
          },
          fragments: {
            width: 700,
            height: (scope.height * 9) / 100,
            margin: {
              top: 552,
              right: 15,
              bottom: 35,
              left: 60,
              yAxisLabelPadding: 60,
              xAxisLabelPadding: 20,
            },
            padding: 0.05,
          },
          offsets: {
            middleOffset: (scope.height * 47) / 100,
            bottomOffset: (scope.height * 42) / 100,
          },
        },
        scope.options || {}
      );
    };

    /**
     * @description This function is used for extracting information pertaining to the physical location of fragmentation events along the peptide backbone from the annotation labels.
     * @returns {array} An array containing objects of all detected fragment ions. These objects take the general form {text: "b", location: 1, color:"#0d75bc"}. These will be later used
     * 		to mark where fragmentation events occured along the peptide backbone.
     */
    scope.getTickData = function (topSpectrum = true) {
      var returnArray = [];
      var labels = topSpectrum ? scope.getLabels() : scope.getMirrorLabels();
      var colors = topSpectrum ? scope.getColors() : scope.getMirrorColors();
      var length = topSpectrum ? scope.getSequence().length : scope.getSequenceBottom();
      var labelObj;
      var i;
      var tempLabel;

      for (i = 0; i < labels.length; i++) {
        tempLabel = labels[i];
        if (tempLabel.charAt(0) == "[") {
          continue;
        }
        if (tempLabel.charAt(0) == "I") {
          var loc = tempLabel.includes("-") ? tempLabel.indexOf("-") : tempLabel.length;
          labelObj = {
            text: tempLabel.charAt(0),
            location: parseInt(tempLabel.slice(1, loc)),
            color: colors[i],
          }
        }
        if (tempLabel) {
          labelObj = {
            text: tempLabel.charAt(0),
            location: parseInt(tempLabel.slice(1)),
            color: colors[i],
          };
          if (!containsLabelTick(labelObj, returnArray)) {
            returnArray.push(labelObj);
          }
        }

        returnArray.sort(function (a, b) {
          var aLoc;
          var bLoc;
          if (a.text == "a" || a.text == "b" || a.text == "c" || a.text == "C" || a.text == "I") {
            aLoc = a.location;
          } else {
            aLoc = length - a.location;
          }

          if (b.text == "a" || b.text == "b" || b.text == "c" || b.text == "C" || b.text == "I") {
            bLoc = b.location;
          } else {
            bLoc = length - b.location;
          }

          if (aLoc < bLoc) {
            return -1;
          } else if (aLoc > bLoc) {
            return 1;
          } else {
            if (a.text.toLowerCase() > b.text.toLowerCase()) {
              return -1;
            } else {
              return 1;
            }
          }
        });
      }
      return returnArray;
    };

    /**
     * @description This function counts the unique number of unique fragmentation events, with respect to the peptide backbone. This value is derived from the detected fragment ions.
     * @example If the peptide "PEPTIDEK" has matched fragments y1, y2, y5, b1, b2, b3 this function would return the string "5/7". The fragments b3 and y5 occur at the same location.
     * @argument {array} An array of all detected fragment ion objects taking the form {text: "b", location: 1, color:"#0d75bc"}. This array is derived from scope.getTickData().
     * @argument {number} Length of the peptide.
     * @returns {string} A stringified fraction in the form "UniqueBrokenBonds/TotalBonds". E.g. "5/10"
     */
    scope.getFragmentedBonds = function (fragments, length) {
      var numBonds = length - 1;

      // fill an array representing all the unique peptide bonds. N-terminus index = 0
      // a peptide of length 8 has 7 bonds. E.g the peptide "P-E-P-T-I-D-E-K"
      var bondArray = new Array(numBonds).fill(0);

      // mark the bond array with the locations of fragmentation events. The value 1 means a fragmentation event has happened at the specific bond.
      fragments.forEach(function (fragment) {
        if (fragment.text == "a" || fragment.text == "b" || fragment.text == "c" || fragment.text == "C" || fragment.text == "I") {
          bondArray[fragment.location - 1] = 1;
        } else if (fragment.text == "x" || fragment.text == "y" || fragment.text == "z" || fragment.text == "Z") {
          bondArray[-(fragment.location - numBonds)] = 1;
        }
      });

      // calculate how many bonds were broken.
      var uniqueBondsBroken = bondArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      return uniqueBondsBroken + "/" + numBonds;
    };

    scope.getFileData = function (topSpectrum = true) {
      if (topSpectrum) return scope.fileData;
      else return scope.fileDataBottom;
    };

    /**
     * @description This function initializes the visualization elements. First an svg element is appended to the web page. Then container, or <g>, elements are appended inside the svg.
     *			Invisible rectangles are placed where the X- and Y-axes are to catch future zooming events. X- and Y-axis labels are placed, and the containers which will hold the svg elements
     *			are placed. This function is chained to scope.setSvgSize.
     */
    scope.initialize = function () {
      // get svg dimensions and settings
      var options = scope.getOptions();
      // create svg element to hold charts
      scope.svg = d3.select(elements[0]).append("svg").attr("class", "chart").attr("style", "overflow:initial");
      //.attr("width", options.renderSize.width)
      //.attr("height", options.renderSize.height);

      // svg element to show peptide sequence and fragment locations
      scope.titleContainer = scope.svg.append("g").attr("id", "titleContainer");
      scope.titleContainerBottom = scope.svg.append("g").attr("id", "titleContainerBottom");

      // svg element to show summary data about peptide
      scope.peptideContainer = scope.svg.append("g").attr("id", "peptideContainer");
      scope.peptideContainerBottom = scope.svg.append("g").attr("id", "peptideContainerBottom");
      // svg element to show correlation info about peptide
      scope.statisticsContainer = scope.svg.append("g").attr("id", "statisticsContainer");
      scope.statisticsContainerBottom = scope.svg.append("g").attr("id", "statisticsContainerBottom");

      // svg element to show origin of spectrum
      scope.originContainer = scope.svg.append("g").attr("id", "originContainer");
      scope.originContainerBottom = scope.svg.append("g").attr("id", "originContainerBottom");

      // main svg container to hold spectrum annotations
      scope.container = scope.svg.append("g").attr("id", "topSpectrumContainer");
      // last svg container to hold matched fragment ppm error
      scope.fragmentContainer = scope.svg.append("g").attr("id", "fragmentContainer");
      // main svg container to hold spectrum annotations
      scope.container2 = scope.svg.append("g").attr("id", "bottomSpectrumContainer");

      scope.fileDataContainerWrap = scope.svg.append("g").attr("id", "fileDataContainerWrap");
      scope.fileDataContainerBottomWrap = scope.svg.append("g").attr("id", "fileDataContainerBottomWrap");

      // invisible rectangle on Y axis used to catch zoom events
      scope.zoomY = scope.container
        .append("rect")
        .attr("id", "yZoom")
        .attr("fill", "none")
        .attr("x", -options.annotation.margin.left)
        .attr("y", "0")
        .attr("pointer-events", "all")
        .attr("width", options.annotation.margin.left)
        .attr("height", options.annotation.height)
        .style("cursor", "row-resize");

      // invisible rectangle on X axis used to catch zoom events
      scope.zoomX = scope.container
        .append("rect")
        .attr("id", "xZoom")
        .attr("fill", "none")
        .attr("x", "0")
        .attr("y", options.annotation.height)
        .attr("pointer-events", "all")
        .attr("width", options.annotation.width)
        .attr("height", options.annotation.margin.zoomXHeight)
        .style("cursor", "col-resize");

      // invisible rectangle on Y axis used to catch zoom events
      scope.zoomY2 = scope.container2
        .append("rect")
        .attr("id", "yZoom2")
        .attr("fill", "none")
        .attr("x", -options.annotation.margin.left)
        .attr("y", "0")
        .attr("pointer-events", "all")
        .attr("width", options.annotation.margin.left)
        .attr("height", options.annotation.height)
        .style("cursor", "row-resize");

      // invisible rectangle on X axis used to catch zoom events
      scope.zoomX2 = scope.container2
        .append("rect")
        .attr("id", "xZoom2")
        .attr("fill", "none")
        .attr("x", "0")
        .attr("y", -options.annotation.margin.zoomXHeightBottom)
        .attr("pointer-events", "all")
        .attr("width", options.annotation.width)
        .attr("height", options.annotation.heightBottom)
        .style("cursor", "col-resize");

      // container to hold annotated spectrum
      scope.plotContainer = scope.container.append("g").attr("id", "annotationContainer");
      // container to hold annotated spectrum
      scope.plotContainer2 = scope.container2.append("g").attr("id", "annotationContainer2");

      // container to hold mass error dot plot
      scope.massErrorContainer = scope.fragmentContainer.append("g").attr("id", "massErrorContainer");

      // add x axis container and label
      scope.container
        .append("g")
        .attr("class", "xAnnotation")
        .append("text")
        .attr("class", "xAnnotationLabel")
        .attr(
          "transform",
          "translate(" + (options.annotation.width / 2 - options.annotation.margin.xAxisLabelPadding) + " ," + (options.annotation.margin.bottom + 2) + ")"
        )
        .text("m/z");

      // add y axis container and label
      scope.container
        .append("g")
        .attr("class", "yAnnotation")
        .append("text")
        .attr("class", "yAnnotationLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - options.annotation.margin.left)
        .attr("x", 0 - options.annotation.height / 2)
        .attr("dy", "1em")
        .text("Relative Abundance (%)");
      //        .style("font-size", '13px');

      // place a clip mask over the annotated spectrum container to prevent svg elements from displaying out of the SVG when zooming.
      scope.plotContainer
        .append("clipPath")
        .attr("id", "clippy")
        .append("rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", options.annotation.width)
        .attr("height", options.annotation.height);

      // add x axis container and label
      scope.container2.append("g").attr("class", "xAnnotation").append("text");

      // add y axis container and label
      scope.container2
        .append("g")
        .attr("class", "yAnnotation")
        .append("text")
        .attr("class", "yAnnotationLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - options.annotation.margin.left)
        .attr("x", 0 - options.annotation.height / 2)
        .attr("dy", "1em")
        .text("Relative Abundance (%)");
      //  .style("font-size", '13px');

      //TODO check later
      // place a clip mask over the annotated spectrum container to prevent svg elements from displaying out of the SVG when zooming.
      scope.plotContainer2
        .append("clipPath")
        .attr("id", "clippy2")
        .append("rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", options.annotation.width)
        .attr("height", options.annotation.height);

      // Define location of the mass error chart relative to the rest of the SVG
      scope.fragmentContainer.attr("transform", "translate(" + options.fragments.margin.left + "," + options.offsets.middleOffset + ")");

      // Define mass error chart x-axis
      scope.fragmentContainer.append("g").attr("class", "xAnnotation");

      // Define mass error chart y-axis and axis label
      scope.fragmentContainer
        .append("g")
        .attr("class", "yAnnotation")
        .append("text")
        .attr("class", "yAnnotationLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - options.annotation.margin.left)
        .attr("x", 0 - options.fragments.height / 2)
        .attr("dy", "1em")
        .attr("text-anchor", "middle");

      // Define mass error chart bottom x-axis
      scope.fragmentContainer.append("g").attr("class", "xAnnotation_2");

      // Define mass error chart bottom y-axis
      scope.fragmentContainer.append("g").attr("class", "yAnnotation_2");

      // place a clip mask over the mass error container to prevent svg elements from displaying out of the SVG when zooming.
      scope.massErrorContainer
        .append("clipPath")
        .attr("id", "clippy2")
        .append("rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", options.fragments.width)
        .attr("height", options.fragments.height);

      // // position the container which will hold the marked peptide sequence
      scope.container.attr("transform", "translate(" + options.annotation.margin.left + ", " + options.annotation.margin.top + ")");

      // bind the clip path to the annotated mass spectrum
      scope.plotContainer.attr("clip-path", "url(#clippy)");

      // // position the container which will hold the marked peptide sequence
      scope.container2.attr(
        "transform",
        "translate(" + options.annotation.margin.left + ", " + (options.annotation.margin.top + options.offsets.bottomOffset) + ")"
      );

      // bind the clip path to the annotated mass spectrum
      scope.plotContainer2.attr("clip-path", "url(#clippy)");

      // position the container which will hold the marked peptide sequence
      scope.titleContainer.attr("transform", "translate(" + options.interactiveTitle.margin.left + ", " + options.interactiveTitle.margin.top + ")");
      scope.titleContainerBottom.attr(
        "transform",
        "translate(" + options.interactiveTitleBottom.margin.left + ", " + options.interactiveTitleBottom.margin.top + ")"
      );

      scope.peptideContainer.attr(
        "transform",
        "translate(" + (options.statistics.margin.left + options.statistics.width / 2) + ", " + options.statistics.margin.top + ")"
      );
      scope.peptideContainerBottom.attr(
        "transform",
        "translate(" + (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) + ", " + options.statisticsBottom.margin.top + ")"
      );
      scope.statisticsContainer.attr(
        "transform",
        "translate(" + (options.statistics.margin.left + options.statistics.width / 2) + ", " + options.statistics.margin.top + ")"
      );
      scope.statisticsContainerBottom.attr(
        "transform",
        "translate(" + (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) + ", " + options.statisticsBottom.margin.top + ")"
      );

      scope.fileDataContainerWrap.attr(
        "transform",
        "translate(" + (options.statistics.margin.left + options.statistics.width / 2) + ", " + options.statistics.margin.top + ")"
      );
      scope.fileDataContainerBottomWrap.attr(
        "transform",
        "translate(" + (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) + ", " + options.statisticsBottom.margin.top + ")"
      );

      scope.originContainer.attr(
        "transform",
        "translate(" + (options.statistics.margin.left + options.statistics.width / 2) + ", " + options.statistics.margin.top + ")"
      );
      scope.originContainerBottom.attr(
        "transform",
        "translate(" + (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) + ", " + options.statisticsBottom.margin.top + ")"
      );

      // bind the clip path to the mass error chart
      scope.massErrorContainer.attr("clip-path", "url(#clippy2)");

      // set the svg size. this function scales the svg using the viewBox attribute.
      scope.setSvgSize();
    };

    /**
     * @description This function assigns a viewBox attribute to our SVG HTML tag. This is used to scale IPSA's annotated spectrum correctly independently of screen size and zoom level.
     * 		"The viewBox attribute defines the position and dimension, in user space, of an SVG viewport." https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
     */
    scope.setSvgSize = function () {
      var options = scope.getOptions();

      scope.svg
        .attr(
          "viewBox",
          "0 0 " +
            (options.svg.width + options.svg.margin.left + options.svg.margin.right) +
            " " +
            (options.svg.height + options.svg.margin.top + options.svg.margin.bottom)
        )
        .attr("preserveAspectRatio", "xMinYMin");

      // scope.redraw actually creates the axes and chart elements.
      scope.redraw();
    };

    /**
     * @description Scope.redraw is called whenever the interactive annotated spectrum needs to be updated i.e. initialization or when data is updated. The contained functions
     * 		procedurally draw the interactive annotated spectrum and the rest of the svg.
     */
    scope.redraw = function () {
      // removes any lines created from dragging annotation labels
      scope.clearOldLines();
      // draws the peptide sequence with the locations of bond breakages marked
      scope.drawInteractiveTitle();
      scope.drawInteractiveTitleBottom();
      // draws the text elements which list precursor m/z, charge state, and # fragmented bonds.
      scope.drawPrecursorSummary();
      scope.drawCorrelationSummary();
      scope.drawCorrelationSummary(false);
      scope.drawOriginSummary();
      scope.drawOriginSummary(false);
      // draws the elements contained in the annotated mass spectrum
      scope.drawAnnotation();
      // draws the elements contained in the mass error scatterplot.
      var intensityError = scope.getIntensityError();
      if (intensityError !== undefined) {
        scope.drawMassError();
      }
      scope.drawFileData();
      scope.drawFileData(false);
    };

    /**
     * @description Removes any line elements which exists in the annotated mass spectrum. This specifically targets lines generated when annotation labels were dragged
     */
    scope.clearOldLines = function () {
      var dataset = scope.plotContainer.selectAll(".line").data([]);
      dataset.exit().remove();
    };

    /**
     * @description Draws the peptide sequence demarked with the locations of any detected fragmentation event. This is accomplished within the D3 framework by creating an invisible
     * 		X- and Y-axis. All amino acids in the peptide sequence are then centered and spaced evenly using these invisible axes for scale. All fragment ions are then marked along the
     * 		peptide backbone using colored hashes. The colors were previously specified by the user.
     */
    scope.drawInteractiveTitleBottom = function () {
      var x,
        y,
        xAxis,
        yAxis,
        dataset,
        options = scope.getOptions(),
        sequence = scope.getSequenceBottom(),
        aminoAcidTicks = scope.getTickData(false),
        mods = scope.getModificationsBottom();
      // set variables to plot interactive title

      // the min and max units defined here are somewhat arbitrary. Since the scaling is meant to evenly distribute one letter abbreviations, the actual units aren't important,
      // just the proportions. I chose a scale of [0,1] as it made sense to represent the placement as
      var xMin = 0;
      var xMax = 1;
      var interactiveChartWidth = xMax - xMin;
      var spacingFactor;
      var fontSize;
      var fullTitleSpacing;
      var fullTitleStart = 0.05;
      var fullTitleEnd = 0.95;

      // define a transition delay based on peptide length.
      var delay = 1250 / sequence.length;

      // determine the index of the amino acid(s) to center the visualization generation around.
      var middleAminoAcid = Math.floor(sequence.length / 2);

      // define scales
      x = d3.scale.linear().domain([xMin, xMax]).range([0, options.interactiveTitleBottom.width]);
      y = d3.scale.linear().range([options.interactiveTitleBottom.height, 0]);

      // prepare to add individual text element for each character in the peptide sequence. The class is called "aminoacid".
      dataset = scope.titleContainerBottom.selectAll(".aminoacid").data(sequence);
      dataset.enter().append("text").attr("class", "aminoacid");

      // at a font size of 30, we can fit about 22 amino acids on the chart. This is a nice size for a peptide
      if (sequence.length < 22) {
        fontSize = 20;

        // this spacing factor was determined from trial and error using a font size of 30.
        spacingFactor = 0.041;

        // define the horizontal position of each amino acid
        dataset
          .attr("x", function (d, i) {
            var indexDistance = i - middleAminoAcid;
            // If the number of amino acids is even, shift the text placement over by 50% so it remains centered.
            if (sequence.length % 2 == 0) {
              indexDistance += 0.5;
            }
            return x(interactiveChartWidth / 2 + indexDistance * spacingFactor);
          })
          .attr("opacity", 0)
          // if the amino acid is modified, make it lower case
          .text(function (d, i) {
            if (mods[i + 1].deltaMass == 0) {
              return d;
            } else {
              return d.toLowerCase();
            }
            // center the text vertically
          })
          .attr("y", function () {
            return y(0.5);
          })
          .style("font-size", function () {
            return fontSize + "px";
          })
          .transition()
          .delay(function (d, i) {
            return i * delay;
            // transition the opacity of the amino acid character from 0 to 100% over 1.5 seconds.
          })
          .duration(1500)
          .attr("opacity", 1);
      } else {
        // for longer amino acids, we handle the even spacing by changing the font size.
        fullTitleSpacing = 0.9 / sequence.length;

        // the font size is determined by the following linear equation
        // it solves to font size = 30 at peptide length 22 and font size 20 at peptide length 50.
        // It seems a little hacky, but it will work for any peptide less than ~105 amino acids long.
        fontSize = -0.3571 * sequence.length + 37.857;
        dataset
          .attr("x", function (d, i) {
            // space the amino acid letters out evenly depending on sequence length
            return x(fullTitleSpacing * i + fullTitleStart);
          })
          .attr("opacity", 0)
          // modified amino acids are sent to lower case
          .text(function (d, i) {
            if (mods[i + 1].deltaMass == 0) {
              return d;
            } else {
              return d.toLowerCase();
            }
            // vertically center text.
          })
          .attr("y", function () {
            return y(0.5);
          })
          .style("font-size", function () {
            var temp = fontSize + "px";
            return fontSize + "px";
          })
          .transition()
          .delay(function (d, i) {
            return i * delay;
          })
          .duration(1500)
          .attr("opacity", 1);
      }

      // remove unneeded amino acids
      dataset.exit().remove();

      // now place bar ticks for observed fragments
      // We use svg paths instead of bars since they're easier to orient
      // calculate svg points for each label
      var xValue;
      var xTick;
      var yTick;
      // define d3 line object which will handle line generation from our data.
      var line = d3.svg
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.y);
        })
        .interpolate("linear");

      // Here we define the x and y coordinates to draw fragment markings between the amino acid characters
      if (sequence.length < 22) {
        aminoAcidTicks.forEach(function (labelTick) {
          // these annotations point upwards.
          if (labelTick.text == "a" || labelTick.text == "b" || labelTick.text == "c" || labelTick.text == "C" || labelTick.text == "I") {
            var indexDistance = labelTick.location - middleAminoAcid;
            if (sequence.length % 2 == 1) {
              indexDistance -= 0.5;
            }

            // X location
            xValue = interactiveChartWidth / 2 + indexDistance * spacingFactor;
            // xHook and yHook is used to add a 'hook' at the end the marking to indicate what side the fragment is on.
            yHook = 0.13;
            xHook = -0.01;

            // add different height markings to prevent visualization overlap. Values determined by trial and error. Gives nice spacing between
            if (labelTick.text == "a") {
              yTick = 0.13;
            } else if (labelTick.text == "b") {
              yTick = 0.21;
            } else if (labelTick.text == "c") {
              yTick = 0.27;
            } else if (labelTick.text == "C") {
              yTick = 0.33;
            } else if (labelTick.text == "I") {
              yTick = 0.39;
            }
            // slightly different values for x,y,z fragments. They point downwards instead.
          } else if (labelTick.text == "x" || labelTick.text == "y" || labelTick.text == "z" || labelTick.text == "Z") {
            var indexDistance = -(labelTick.location - middleAminoAcid);
            if (sequence.length % 2 == 1) {
              indexDistance += 0.5;
            }
            xValue = interactiveChartWidth / 2 + indexDistance * spacingFactor;
            yHook = -0.15;
            xHook = 0.01;
            if (labelTick.text == "x") {
              yTick = -0.15;
            } else if (labelTick.text == "y") {
              yTick = -0.23;
            } else if (labelTick.text == "z") {
              yTick = -0.31;
            } else if (labelTick.text == "Z") {
              yTick = -0.39;
            }
          }
          labelTick.points = [
            { x: xValue, y: 0.5 },
            { x: xValue, y: 0.5 + yTick },
            { x: xValue + xHook, y: 0.5 + yTick + yHook },
          ];
        });
      } else {
        // same logic as before, except this section has logic to handle peptides with length > 22.
        aminoAcidTicks.forEach(function (labelTick) {
          if (labelTick.text == "a" || labelTick.text == "b" || labelTick.text == "c" || labelTick.text == "C" || labelTick.text == "I") {
            xValue = fullTitleStart + fullTitleSpacing * (labelTick.location - 0.5);
            yHook = 0.15;
            xHook = -0.01;
            if (labelTick.text == "a") {
              yTick = 0.15;
            } else if (labelTick.text == "b") {
              yTick = 0.23;
            } else if (labelTick.text == "c") {
              yTick = 0.31;
            } else if (labelTick.text == "C") {
              yTick = 0.39;
            } else if (labelTick.text == "I") {
              yTick = 0.47;
            }
          } else if (labelTick.text == "x" || labelTick.text == "y" || labelTick.text == "z" || labelTick.text == "Z") {
            xValue = fullTitleEnd - fullTitleSpacing * (labelTick.location + 0.5);
            yHook = -0.15;
            xHook = 0.01;
            if (labelTick.text == "x") {
              yTick = -0.15;
            } else if (labelTick.text == "y") {
              yTick = -0.23;
            } else if (labelTick.text == "z") {
              yTick = -0.31;
            } else if (labelTick.text == "Z") {
              yTick = -0.39;
            }
          }
          labelTick.points = [
            { x: xValue, y: 0.5 },
            { x: xValue, y: 0.5 + yTick },
            { x: xValue + xHook, y: 0.5 + yTick + yHook },
          ];
        });
      }

      // add the lines
      dataset = scope.titleContainerBottom.selectAll(".line").data(aminoAcidTicks);

      dataset.enter().append("path").attr("class", "line");

      dataset
        .attr("d", function (d) {
          return line(d.points);
        })
        .attr("opacity", 0)
        .style("stroke", function (d) {
          return d.color;
        })
        .transition()
        .delay(function (d, i) {
          return i * delay;
        })
        .duration(1500)
        .attr("opacity", 1);

      dataset.exit().remove();
    };

    /**
     * @description Draws the peptide sequence demarked with the locations of any detected fragmentation event. This is accomplished within the D3 framework by creating an invisible
     * 		X- and Y-axis. All amino acids in the peptide sequence are then centered and spaced evenly using these invisible axes for scale. All fragment ions are then marked along the
     * 		peptide backbone using colored hashes. The colors were previously specified by the user.
     */
    scope.drawInteractiveTitle = function () {
      var x,
        y,
        xAxis,
        yAxis,
        dataset,
        options = scope.getOptions(),
        sequence = scope.getSequence(),
        aminoAcidTicks = scope.getTickData(),
        mods = scope.getModifications();
      // set variables to plot interactive title
      // the min and max units defined here are somewhat arbitrary. Since the scaling is meant to evenly distribute one letter abbreviations, the actual units aren't important,
      // just the proportions. I chose a scale of [0,1] as it made sense to represent the placement as
      var xMin = 0;
      var xMax = 1;
      var interactiveChartWidth = xMax - xMin;
      var spacingFactor;
      var fontSize;
      var fullTitleSpacing;
      var fullTitleStart = 0.05;
      var fullTitleEnd = 0.95;

      // define a transition delay based on peptide length.
      var delay = 1250 / sequence.length;

      // determine the index of the amino acid(s) to center the visualization generation around.
      var middleAminoAcid = Math.floor(sequence.length / 2);

      // define scales
      x = d3.scale.linear().domain([xMin, xMax]).range([0, options.interactiveTitle.width]);
      y = d3.scale.linear().range([options.interactiveTitle.height, 0]);

      // prepare to add individual text element for each character in the peptide sequence. The class is called "aminoacid".
      dataset = scope.titleContainer.selectAll(".aminoacid").data(sequence);
      dataset.enter().append("text").attr("class", "aminoacid");

      // at a font size of 30, we can fit about 22 amino acids on the chart. This is a nice size for a peptide
      if (sequence.length < 22) {
        fontSize = 20;

        // this spacing factor was determined from trial and error using a font size of 30.
        spacingFactor = 0.041;

        // define the horizontal position of each amino acid
        dataset
          .attr("x", function (d, i) {
            var indexDistance = i - middleAminoAcid;
            // If the number of amino acids is even, shift the text placement over by 50% so it remains centered.
            if (sequence.length % 2 == 0) {
              indexDistance += 0.5;
            }
            return x(interactiveChartWidth / 2 + indexDistance * spacingFactor);
          })
          .attr("opacity", 0)
          // if the amino acid is modified, make it lower case
          .text(function (d, i) {
            if (mods[i + 1].deltaMass == 0) {
              return d;
            } else {
              return d.toLowerCase();
            }
            // center the text vertically
          })
          .attr("y", function () {
            return y(0.5);
          })
          .style("font-size", function () {
            return fontSize + "px";
          })
          .transition()
          .delay(function (d, i) {
            return i * delay;
            // transition the opacity of the amino acid character from 0 to 100% over 1.5 seconds.
          })
          .duration(1500)
          .attr("opacity", 1);
      } else {
        // for longer amino acids, we handle the even spacing by changing the font size.
        fullTitleSpacing = 0.9 / sequence.length;

        // the font size is determined by the following linear equation
        // it solves to font size = 30 at peptide length 22 and font size 20 at peptide length 50.
        // It seems a little hacky, but it will work for any peptide less than ~105 amino acids long.
        fontSize = -0.3571 * sequence.length + 37.857;
        dataset
          .attr("x", function (d, i) {
            // space the amino acid letters out evenly depending on sequence length
            return x(fullTitleSpacing * i + fullTitleStart);
          })
          .attr("opacity", 0)
          // modified amino acids are sent to lower case
          .text(function (d, i) {
            if (mods[i + 1].deltaMass == 0) {
              return d;
            } else {
              return d.toLowerCase();
            }
            // vertically center text.
          })
          .attr("y", function () {
            return y(0.5);
          })
          .style("font-size", function () {
            var temp = fontSize + "px";
            return fontSize + "px";
          })
          .transition()
          .delay(function (d, i) {
            return i * delay;
          })
          .duration(1500)
          .attr("opacity", 1);
      }

      // remove unneeded amino acids
      dataset.exit().remove();

      // now place bar ticks for observed fragments
      // We use svg paths instead of bars since they're easier to orient
      // calculate svg points for each label
      var xValue;
      var xTick;
      var yTick;
      // define d3 line object which will handle line generation from our data.
      var line = d3.svg
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.y);
        })
        .interpolate("linear");

      // Here we define the x and y coordinates to draw fragment markings between the amino acid characters
      if (sequence.length < 22) {
        aminoAcidTicks.forEach(function (labelTick) {
          // these annotations point upwards.
          if (labelTick.text == "a" || labelTick.text == "b" || labelTick.text == "c" || labelTick.text == "C" || labelTick.text == "I") {
            var indexDistance = labelTick.location - middleAminoAcid;
            if (sequence.length % 2 == 1) {
              indexDistance -= 0.5;
            }

            // X location
            xValue = interactiveChartWidth / 2 + indexDistance * spacingFactor;
            // xHook and yHook is used to add a 'hook' at the end the marking to indicate what side the fragment is on.
            yHook = 0.13;
            xHook = -0.01;

            // add different height markings to prevent visualization overlap. Values determined by trial and error. Gives nice spacing between
            if (labelTick.text == "a") {
              yTick = 0.13;
            } else if (labelTick.text == "b") {
              yTick = 0.21;
            } else if (labelTick.text == "c") {
              yTick = 0.27;
            } else if (labelTick.text == "C") {
              yTick = 0.33;
            } else if (labelTick.text == "I") {
              yTick = 0.39;
            }
            // slightly different values for x,y,z fragments. They point downwards instead.
          } else if (labelTick.text == "x" || labelTick.text == "y" || labelTick.text == "z" || labelTick.text == "Z") {
            var indexDistance = -(labelTick.location - middleAminoAcid);
            if (sequence.length % 2 == 1) {
              indexDistance += 0.5;
            }
            xValue = interactiveChartWidth / 2 + indexDistance * spacingFactor;
            yHook = -0.15;
            xHook = 0.01;
            if (labelTick.text == "x") {
              yTick = -0.15;
            } else if (labelTick.text == "y") {
              yTick = -0.23;
            } else if (labelTick.text == "z") {
              yTick = -0.31;
            } else if (labelTick.text == "Z") {
              yTick = -0.39;
            }
          }
          labelTick.points = [
            { x: xValue, y: 0.5 },
            { x: xValue, y: 0.5 + yTick },
            { x: xValue + xHook, y: 0.5 + yTick + yHook },
          ];
        });
      } else {
        // same logic as before, except this section has logic to handle peptides with length > 22.
        aminoAcidTicks.forEach(function (labelTick) {
          if (labelTick.text == "a" || labelTick.text == "b" || labelTick.text == "c" || labelTick.text == "C" || labelTick.text == "I") {
            xValue = fullTitleStart + fullTitleSpacing * (labelTick.location - 0.5);
            yHook = 0.15;
            xHook = -0.01;
            if (labelTick.text == "a") {
              yTick = 0.15;
            } else if (labelTick.text == "b") {
              yTick = 0.23;
            } else if (labelTick.text == "c") {
              yTick = 0.31;
            } else if (labelTick.text == "C") {
              yTick = 0.39;
            } else if (labelTick.text == "I") {
              yTick = 0.47;
            }
          } else if (labelTick.text == "x" || labelTick.text == "y" || labelTick.text == "z" || labelTick.text == "Z") {
            xValue = fullTitleEnd - fullTitleSpacing * (labelTick.location + 0.5);
            yHook = -0.15;
            xHook = 0.01;
            if (labelTick.text == "x") {
              yTick = -0.15;
            } else if (labelTick.text == "y") {
              yTick = -0.23;
            } else if (labelTick.text == "z") {
              yTick = -0.31;
            } else if (labelTick.text == "Z") {
              yTick = -0.39;
            }
          }
          labelTick.points = [
            { x: xValue, y: 0.5 },
            { x: xValue, y: 0.5 + yTick },
            { x: xValue + xHook, y: 0.5 + yTick + yHook },
          ];
        });
      }

      // add the lines
      dataset = scope.titleContainer.selectAll(".line").data(aminoAcidTicks);

      dataset.enter().append("path").attr("class", "line");

      dataset
        .attr("d", function (d) {
          return line(d.points);
        })
        .attr("opacity", 0)
        .style("stroke", function (d) {
          return d.color;
        })
        .transition()
        .delay(function (d, i) {
          return i * delay;
        })
        .duration(1500)
        .attr("opacity", 1);

      dataset.exit().remove();
    };

    scope.drawCorrelationSummary = function (topSpectrum = true) {
      var options = scope.getOptions(),
        scoreGeneral = scope.score.sa,
        correlationGeneral = scope.score.corr,
        score = topSpectrum ? scope.scoretop.sa : scope.scorebottom.sa,
        correlation = topSpectrum ? scope.scoretop.corr : scope.scorebottom.corr,
        stat_width = topSpectrum ? options.statistics.width : options.statisticsBottom.width,
        stat_mar_catpad1 = topSpectrum ? options.statistics.margin.categoryPadding_1 : options.statisticsBottom.margin.categoryPadding_1,
        stat_mar_catpad2 = topSpectrum ? options.statistics.margin.categoryPadding_2 : options.statisticsBottom.margin.categoryPadding_2,
        stat_mar_catpad3 = topSpectrum ? options.statistics.margin.categoryPadding_3 : options.statisticsBottom.margin.categoryPadding_3,
        stat_mar_datpad1 = topSpectrum ? options.statistics.margin.dataPadding_1 : options.statisticsBottom.margin.dataPadding_1,
        stat_mar_datpad2 = topSpectrum ? options.statistics.margin.dataPadding_2 : options.statisticsBottom.margin.dataPadding_2,
        stat_mar_datpad3 = topSpectrum ? options.statistics.margin.dataPadding_3 : options.statisticsBottom.margin.dataPadding_3;
      var statisticsData = [];
      statisticsData.push({ title: "SA: ", data: scoreGeneral + " (" + score + ")" });
      statisticsData.push({ title: "PCC: ", data: correlationGeneral + " (" + correlation + ")" });

      if (topSpectrum) {
        dataset = scope.statisticsContainer.selectAll(".precursorstatscategory").data(statisticsData);
        dataset.enter().append("text").attr("class", "precursorstatscategory");
      } else {
        dataset = scope.statisticsContainerBottom.selectAll(".precursorstatscategoryBottom").data(statisticsData);
        dataset.enter().append("text").attr("class", "precursorstatscategoryBottom");
      }

      dataset
        .text(function (d) {
          return d.title;
        })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (i == 0) {
            return "translate(-" + (stat_width / 2 - 170) + ",25)";
          } else if (i == 1) {
            return "translate(-" + (stat_mar_catpad2 - 70) + ",25)";
          } else {
            return "translate(" + (stat_width / 2 - stat_mar_catpad3) + ",25)";
          }
        })
        .attr("text-anchor", "start")
        .transition()
        .delay(function (d, i) {
          return i * 450;
        })
        .duration(1500)
        .attr("opacity", 1);
      //.style("font-size", "13px");

      dataset.exit().remove();

      // From line 1067 to 1086 we write the actual numerical data
      if (topSpectrum) {
        dataset = scope.statisticsContainer.selectAll(".precursorstatsdata").data(statisticsData);
        dataset.enter().append("text").attr("class", "precursorstatsdata");
      } else {
        dataset = scope.statisticsContainerBottom.selectAll(".precursorstatsdataBottom").data(statisticsData);
        dataset.enter().append("text").attr("class", "precursorstatsdataBottom");
      }

      dataset
        .text(function (d) {
          return d.data;
        })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (i == 0) {
            return "translate(-" + (stat_width / 2 + stat_mar_datpad1 - 100) + ",25)";
          } else if (i == 1) {
            //return "translate(-" + (options.statistics.margin.categoryPadding_2 + options.statistics.margin.dataPadding_2) + ",0)";
            return "translate(" + (stat_mar_datpad2 + 50) + ",25)";
          } else {
            return "translate(" + (stat_width / 2 - stat_mar_catpad3 + stat_mar_datpad3) + ",25)";
          }
        })
        .attr("text-anchor", "start")
        .transition()
        .delay(function (d, i) {
          return i * 450;
        })
        .duration(1500)
        .attr("opacity", 1);

      dataset.exit().remove();
    };

    scope.drawFileData = function (topSpectrum = true) {
      var options = scope.getOptions();
      const fileData = scope.getFileData(topSpectrum);
      var extraFileData = [];

      const ignoreList = ["CHARGE", "PEPMASS", "SEQ", "data", "selectedMods", "isValid", "$$hashKey"];
      for (const key in fileData) {
        if (!ignoreList.includes(key)) {
          extraFileData.push({ title: key + ": " + fileData[key], data: fileData[key] });
        }
      }

      if (extraFileData.length == 0) return;

      if (topSpectrum) {
        dataset = scope.fileDataContainerWrap.selectAll(".fileDataContainer").data(extraFileData);
        dataset.enter().append("text").attr("class", "fileDataContainer");
      } else {
        dataset = scope.fileDataContainerBottomWrap.selectAll(".fileDataContainerBottom").data(extraFileData);
        dataset.enter().append("text").attr("class", "fileDataContainerBottom");
      }

      dataset
        .text(function (d) {
          return d.title;
        })
        .attr("display", "block")
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (topSpectrum) height = 50 + i * 20;
          else height = i * 20;
          return "translate(0," + height + ")";
        })
        .attr("text-anchor", "middle")
        .transition()
        .delay(function (d, i) {
          return i * 450;
        })
        .duration(1500)
        .attr("opacity", 1);
      dataset.exit().remove();

      if (topSpectrum) {
        add_height = 20 * extraFileData.length;

        scope.container.attr("transform", "translate(" + options.annotation.margin.left + ", " + (options.annotation.margin.top + add_height) + ")");

        scope.fragmentContainer.attr("transform", "translate(" + options.fragments.margin.left + "," + (options.offsets.middleOffset + add_height) + ")");
        scope.container2.attr(
          "transform",
          "translate(" + options.annotation.margin.left + ", " + (options.annotation.margin.top + options.offsets.bottomOffset + add_height) + ")"
        );

        scope.titleContainerBottom.attr(
          "transform",
          "translate(" + options.interactiveTitleBottom.margin.left + ", " + (options.interactiveTitleBottom.margin.top + add_height) + ")"
        );

        scope.peptideContainerBottom.attr(
          "transform",
          "translate(" +
            (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) +
            ", " +
            (options.statisticsBottom.margin.top + add_height) +
            ")"
        );
        scope.statisticsContainerBottom.attr(
          "transform",
          "translate(" +
            (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) +
            ", " +
            (options.statisticsBottom.margin.top + add_height) +
            ")"
        );
        scope.fileDataContainerBottomWrap.attr(
          "transform",
          "translate(" +
            (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) +
            ", " +
            (options.statisticsBottom.margin.top + add_height) +
            ")"
        );

        scope.originContainer.attr(
          "transform",
          "translate(" + (options.statistics.margin.left + options.statistics.width / 2) + ", " + (options.statistics.margin.top + add_height) + ")"
        );
        scope.originContainerBottom.attr(
          "transform",
          "translate(" +
            (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) +
            ", " +
            (options.statisticsBottom.margin.top + add_height) +
            ")"
        );
      } else {
        add_height = 25 + 20 * (extraFileData.length - 1);
        trans_title = d3.transform(scope.titleContainerBottom.attr("transform")).translate[1];
        trans_stats = d3.transform(scope.statisticsContainerBottom.attr("transform")).translate[1];
        trans_peptide = d3.transform(scope.peptideContainerBottom.attr("transform")).translate[1];

        scope.titleContainerBottom.attr("transform", "translate(" + options.interactiveTitleBottom.margin.left + ", " + (trans_title + add_height) + ")");
        scope.statisticsContainerBottom.attr(
          "transform",
          "translate(" + (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) + ", " + (trans_stats + add_height) + ")"
        );
        scope.peptideContainerBottom.attr(
          "transform",
          "translate(" + (options.statisticsBottom.margin.left + options.statisticsBottom.width / 2) + ", " + (trans_peptide + add_height) + ")"
        );
      }

      scroll_height = d3.select(".content")[0][0].scrollHeight;
      document.querySelector(".content").style.cssText = "height: " + (scroll_height + (20 * extraFileData.length) / 4) + "px;";
    };

    scope.drawOriginSummary = function (topSpectrum = true) {
      var options = scope.getOptions(),
        scoreGeneral = scope.score.sa,
        score = topSpectrum ? scope.scoretop.sa : scope.scorebottom.sa,
        stat_width = topSpectrum ? options.statistics.width : options.statisticsBottom.width,
        stat_mar_catpad1 = topSpectrum ? options.statistics.margin.categoryPadding_1 : options.statisticsBottom.margin.categoryPadding_1,
        stat_mar_catpad2 = topSpectrum ? options.statistics.margin.categoryPadding_2 : options.statisticsBottom.margin.categoryPadding_2,
        stat_mar_datpad1 = topSpectrum ? options.statistics.margin.dataPadding_1 : options.statisticsBottom.margin.dataPadding_1,
        stat_mar_datpad2 = topSpectrum ? options.statistics.margin.dataPadding_2 : options.statisticsBottom.margin.dataPadding_2;

      var statisticsData = [];
      statisticsData.push({ title: "Origin: ", data: scope.getModifications2(topSpectrum) });

      if (topSpectrum) {
        dataset = scope.originContainer.selectAll(".origincategory").data(statisticsData);
        dataset.enter().append("text").attr("class", "origincategory");
      } else {
        dataset = scope.originContainerBottom.selectAll(".origincategoryBottom").data(statisticsData);
        dataset.enter().append("text").attr("class", "origincategoryBottom");
      }
      /*
      dataset.text(function (d) { return (d.title); })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (i == 0) {
            return "translate(-" + (stat_width / 2 - 120) + ",50)";
          } else if (i == 1) {
            return "translate(-" + (stat_mar_catpad2 - 70)  + ",50)"
          } else {
            return "translate(" + (stat_width / 2 - stat_mar_catpad3) + ",50)";
          }
        }).attr("text-anchor", "start").transition().delay(function (d, i) {
          return i * 450;
        }).duration(1500).attr("opacity", 1);
      //.style("font-size", "13px");

      dataset.exit().remove();
*/
      // From line 1067 to 1086 we write the actual numerical data
      if (topSpectrum) {
        dataset = scope.originContainer.selectAll(".origindata").data(statisticsData);
        dataset.enter().append("text").attr("class", "origindata origin");
      } else {
        dataset = scope.originContainerBottom.selectAll(".origindataBottom").data(statisticsData);
        dataset.enter().append("text").attr("class", "origindataBottom origin");
      }

      dataset
        .text(function (d) {
          return d.data;
        })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          return "translate(-" + 0 + ",40)";
          // return "translate(-" + (stat_width / 2 + stat_mar_datpad1 -70) + ",50)";
        })
        .attr("text-anchor", "middle")
        .transition()
        .delay(function (d, i) {
          return i * 450;
        })
        .duration(1500)
        .attr("opacity", 1);
      /*
      dataset.text(function (d) { return (d.data); })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (i == 0) {
            return "translate(-" + (stat_width / 2 + stat_mar_datpad1 -70) + ",50)";
          } else if (i == 1) {
            //return "translate(-" + (options.statistics.margin.categoryPadding_2 + options.statistics.margin.dataPadding_2) + ",0)";
            return "translate(" + (stat_mar_datpad2 +50) + ",50)";
          } else {
            return "translate(" + (stat_width / 2 - stat_mar_catpad3 + stat_mar_datpad3) + ",50)";
          }
        }).attr("text-anchor", "start").transition().delay(function (d, i) {
          return i * 450;
        }).duration(1500).attr("opacity", 1);
*/

      dataset.exit().remove();
    };

    /**
     * @description Draws the text and statistics below the peptide sequence. Retrieves precursor mz, charge, and # fragmented bonds and displays it.
     */
    scope.drawPrecursorSummary = function () {
      var options = scope.getOptions(),
        sequence = scope.getSequence(),
        charge = scope.getPrecursorCharge(),
        precursorMz = scope.getPrecursorMz(),
        fragments = scope.getTickData(),
        sequenceBottom = scope.getSequenceBottom(),
        chargeBottom = scope.getPrecursorChargeBottom(),
        precursorMzBottom = scope.getPrecursorMzBottom(),
        fragmentsBottom = scope.getTickData(false);

      // Retrieve and format mz, charge, and formatted fragment objects. Place them into the array summaryData to be later translated into svg elements.
      var summaryData = [];
      summaryData.push({ title: "Precursor m/z: ", data: d3.format(",.4f")(precursorMz) });
      summaryData.push({ title: "Charge: ", data: ionizationMode + Math.abs(charge) });
      summaryData.push({ title: "Fragmented Bonds: ", data: scope.getFragmentedBonds(fragments, sequence.length) });
      var summaryDataBottom = [];
      summaryDataBottom.push({ title: "Precursor m/z: ", data: d3.format(",.4f")(precursorMzBottom) });
      summaryDataBottom.push({ title: "Charge: ", data: ionizationMode + Math.abs(chargeBottom) });
      summaryDataBottom.push({ title: "Fragmented Bonds: ", data: scope.getFragmentedBonds(fragmentsBottom, sequenceBottom.length) });

      // From line 1047 to 1065 we write the Title text from the summary data objects e.g. "Precursor m/z"
      dataset = scope.peptideContainer.selectAll(".precursorstatscategory").data(summaryData);
      datasetBottom = scope.peptideContainerBottom.selectAll(".precursorstatscategoryBottom").data(summaryDataBottom);

      dataset.enter().append("text").attr("class", "precursorstatscategory");
      dataset
        .text(function (d) {
          return d.title;
        })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (i == 0) {
            return "translate(-" + options.statistics.width / 2 + ",0)";
          } else if (i == 1) {
            return "translate(-" + options.statistics.margin.categoryPadding_2 + ",0)";
          } else if (i == 2) {
            return "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_3) + ",0)";
          } else if (i == 3) {
            return "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_4) + ",0)";
          } else if (i == 4) {
            return "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_5) + ",0)";
          } else {
            return "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_6) + ",0)";
          }
        })
        .attr("text-anchor", "start")
        .transition()
        .delay(function (d, i) {
          return i * 450;
        })
        .duration(1500)
        .attr("opacity", 1);

      datasetBottom.enter().append("text").attr("class", "precursorstatscategoryBottom");
      datasetBottom
        .text(function (d) {
          return d.title;
        })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (i == 0) {
            return "translate(-" + options.statistics.width / 2 + ",0)";
          } else if (i == 1) {
            return "translate(-" + options.statistics.margin.categoryPadding_2 + ",0)";
          } else if (i == 2) {
            return "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_3) + ",0)";
          } else if (i == 3) {
            return "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_4) + ",0)";
          } else if (i == 4) {
            return "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_5) + ",0)";
          } else {
            return "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_6) + ",0)";
          }
        })
        .attr("text-anchor", "start")
        .transition()
        .delay(function (d, i) {
          return i * 450;
        })
        .duration(1500)
        .attr("opacity", 1);

      dataset.exit().remove();
      datasetBottom.exit().remove();

      // From line 1067 to 1086 we write the actual numerical data
      dataset = scope.peptideContainer.selectAll(".precursorstatsdata").data(summaryData);
      datasetBottom = scope.peptideContainerBottom.selectAll(".precursorstatsdataBottom").data(summaryDataBottom);

      dataset.enter().append("text").attr("class", "precursorstatsdata");
      datasetBottom.enter().append("text").attr("class", "precursorstatsdataBottom");
      dataset
        .text(function (d) {
          return d.data;
        })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (i == 0) {
            return "translate(-" + (options.statistics.width / 2 + options.statistics.margin.dataPadding_1) + ",0)";
          } else if (i == 1) {
            //return "translate(-" + (options.statistics.margin.categoryPadding_2 + options.statistics.margin.dataPadding_2) + ",0)";
            return "translate(" + options.statistics.margin.dataPadding_2 + ",0)";
          } else if (i == 2) {
            return (
              "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_3 + options.statistics.margin.dataPadding_3) + ",0)"
            );
          } else if (i == 3) {
            return (
              "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_4 + options.statistics.margin.dataPadding_4) + ",0)"
            );
          } else {
            return (
              "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_5 + options.statistics.margin.dataPadding_5) + ",0)"
            );
          }
        })
        .attr("text-anchor", "start")
        .transition()
        .delay(function (d, i) {
          return i * 450;
        })
        .duration(1500)
        .attr("opacity", 1);

      dataset.exit().remove();
      datasetBottom
        .text(function (d) {
          return d.data;
        })
        .attr("opacity", 0)
        .attr("transform", function (d, i) {
          if (i == 0) {
            return "translate(-" + (options.statistics.width / 2 + options.statistics.margin.dataPadding_1) + ",0)";
          } else if (i == 1) {
            //return "translate(-" + (options.statistics.margin.categoryPadding_2 + options.statistics.margin.dataPadding_2) + ",0)";
            return "translate(" + options.statistics.margin.dataPadding_2 + ",0)";
          } else if (i == 2) {
            return (
              "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_3 + options.statistics.margin.dataPadding_3) + ",0)"
            );
          } else if (i == 3) {
            return (
              "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_4 + options.statistics.margin.dataPadding_4) + ",0)"
            );
          } else {
            return (
              "translate(" + (options.statistics.width / 2 - options.statistics.margin.categoryPadding_5 + options.statistics.margin.dataPadding_5) + ",0)"
            );
          }
        })
        .attr("text-anchor", "start")
        .transition()
        .delay(function (d, i) {
          return i * 450;
        })
        .duration(1500)
        .attr("opacity", 1);

      datasetBottom.exit().remove();
    };

    /**
     * @description Draws lines which connect dragged annotation labels and the annotated spectral peak.
     */
    scope.drawLine = function (x, y, d) {
      // Generate x and y coordinates from the spectral data and the current location of the label.
      d.points = [];
      d.points.push({ x: d.mz, y: d.percentBasePeak });
      d.points.push({ x: d.x, y: d.y });

      // define a linear function to translate numerical data to the svg coordinates
      let lineGenerator = d3.svg
        .line()
        .x(function (e) {
          return x(e.x);
        })
        .y(function (e) {
          return y(e.y);
        });

      // define line interpolation depending on if the label is located above or below the spectral peak.
      lineDataset
        .attr("d", function (d) {
          if (d.y > d.percentBasePeak) {
            lineGenerator.interpolate("step-before");
          } else {
            lineGenerator.interpolate("step-after");
          }
          return lineGenerator(d.points);
        })
        .attr("opacity", 1)
        .style("stroke", function (d) {
          return d.color;
        })
        .style("stroke-dasharray", "4,4")
        .style("stroke-width", 0.5);
    };

    /**
     * @description This function is one of the main workhorse of IPSA. It takes the formatted annotations and processed spectral data from the server and translates it into a D3 SVG. It also
     * 		adds interactivity to most of the svg elements.
     */
    scope.drawAnnotation = function () {
      let x,
        y,
        x2,
        y2,
        xAxis,
        xTopAxis,
        fragxAxis,
        yAxis,
        yAxis2,
        barDataset,
        barDataset2,
        labelDataset,
        labelDataset2,
        options = scope.getOptions(),
        xValues = scope.getX(),
        yValues = scope.getIntensities(),
        percentBasePeak = scope.getPercentBasePeak(),
        xValues2 = scope.getMirrorX(),
        yValues2 = scope.getMirrorIntensities(),
        percentBasePeak2 = scope.getMirrorPercentBasePeak(),
        labels2 = scope.getMirrorLabels(),
        labelCharges2 = scope.getMirrorLabelCharges(),
        colors2 = scope.getMirrorColors(),
        id = scope.getId(),
        id2 = scope.getIdMirror(),
        massError = scope.getMassError(),
        colors = scope.getColors(),
        labels = scope.getLabels(),
        labelCharges = scope.getLabelCharges(),
        neutralLosses = scope.getNeutralLosses(),
        widths = scope.getWidths(),
        widths2 = scope.getMirrorWidths(),
        sequence = scope.getSequence(),
          sequences = scope.getSequences(),
          sequences2 = scope.getSequencesBottom(),
        neutralLosses2 = scope.getMirrorNeutralLosses();

      // since y axis is scaled to % relative abundance, yMax will always be 100%.
      let yMin = 0,
        yMin2 = -100;
      let yMax = 100,
        yMax2 = 0;
      let xMin = d3.min([d3.min(xValues), d3.min(xValues2)]);
      let xMax = d3.max([d3.max(xValues), d3.max(xValues2)]);
      let TIC = 0,
        TIC2 = 0;
      let mirror = xValues2 ? true : false;

      // create a variable to add a bit of a buffer between the edges of the svg so things don't get cut off.
      let xScaleFudgeFactor = (xMax - xMin) * 0.025;

      // Do stuff if there is data to visualize.
      if (xValues && yValues) {
        // define x and y scales
        x = d3.scale
          .linear()
          .domain([xMin - xScaleFudgeFactor, xMax + xScaleFudgeFactor])
          .range([0, options.annotation.width]);
        y = d3.scale
          .linear()
          .domain([yMin, yMax + yMax * 2 * options.annotation.padding])
          .range([options.annotation.height, 0]);

        if (mirror) {
          y2 = d3.scale
            .linear()
            .domain([yMin2 + yMin2 * 2 * options.annotation.padding, yMax2 + yMax2 * options.annotation.padding])
            .range([options.annotation.height, 0]);
        }
        // x-axis will be at the bottom with a suggested 10 axis ticks. That number may change depending on how D3 interprets the m/z range
        xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
        if (mirror) {
          xTopAxis = d3.svg.axis().scale(x).orient("top").ticks(10);
        }
        // fragxAxis is actually the x axis from the fragment mass error chart. It's defined here so it can be updated on zoom.
        fragxAxis = d3.svg.axis().scale(x).orient("top").ticks(10);

        // Format the y-axis ticks to round itself to 2 significant figures. e.g. 50, 5.0, 0.50
        yAxis = d3.svg
          .axis()
          .scale(y)
          .orient("left")
          .tickFormat(function (d) {
            return d3.format("0.2r")(d);
          });

        if (mirror) {
          yAxis2 = d3.svg
            .axis()
            .scale(y2)
            .orient("left")
            .tickFormat(function (d) {
              return d3.format("0.2r")(d === 0 ? d : -d);
            });
        }

        let plotData = [];
        let mirrorPlotData = [];

        // format all the data recieved from the php script in a way that's easier to plot using D3
        for (let i = 0; i < xValues.length; i++) {
          var label = labels[i];
          var charge = labelCharges[i];
          var neutralLoss = neutralLosses[i];

          // compile labels from the label text, neutral losses, charge, and ionization mode. {"y17", "-H2O", 2, "+"} => [y₁₇-H₂O]⁺²
          var label = formatLabel(label, neutralLoss, charge, ionizationMode);

          // sum up all intensities to calculate the total ion current
          TIC += yValues[i];

          // console.log('xval: ', xValues[i]);
          // format our processed data in a format which makes it easier to process using D3.
          plotData.push({
            mz: xValues[i],
            intensity: yValues[i],
            id: id[i],
            x: xValues[i],
            y: percentBasePeak[i],
            percentBasePeak: percentBasePeak[i],
            color: colors[i],
            label: label,
            width: widths[i] * options.annotation.width * 0.001,
            massError: massError[i],
            points: [],
            sequence: sequence,
            sequences: sequences[i],
          });
        }

        if (typeof id2 === "undefined") {
          id2 = [];
        }
        if (id2.length <= xValues2.length) {
          while (id2.length < xValues2.length) {
            id2.push(-1);
          }
        }
        // format all the data recieved from the php script in a way that's easier to plot using D3
        for (let i = 0; i < xValues2.length; i++) {
          var label = labels2[i];
          var charge = labelCharges2[i];
          var neutralLoss = neutralLosses2[i];

          // compile labels from the label text, neutral losses, charge, and ionization mode. {"y17", "-H2O", 2, "+"} => [y₁₇-H₂O]⁺²
          var label = formatLabel(label, neutralLoss, charge, ionizationMode);

          // sum up all intensities to calculate the total ion current
          TIC2 += yValues2[i];

          // format our processed data in a format which makes it easier to process using D3.
          mirrorPlotData.push({
            mz: xValues2[i],
            intensity: yValues2[i],
            x: xValues2[i],
            id: id2[i],
            y: percentBasePeak2[i],
            percentBasePeak: percentBasePeak2[i],
            color: colors2[i],
            label: label,
            width: widths2[i] * options.annotation.width * 0.001,
            massError: [], //massError[i],
            points: [],
            sequence: sequence,
            sequences: sequences2[i],
          });
        }

        // set transition duration depending on the number of spectral features to visualize
        var duration = 1500 / plotData.length;
        var duration2 = 1500 / mirrorPlotData.length;

        // actually render the x- and y-axes
        scope.container
          .selectAll("g.xAnnotation")
          .attr("transform", "translate(0, " + options.annotation.height + ")")
          .call(xAxis);
        scope.container.selectAll("g.yAnnotation").call(yAxis);
        scope.container2.selectAll("g.xAnnotation").call(xTopAxis);
        scope.container2.selectAll("g.yAnnotation").call(yAxis2);

        // bind the plotData variable to potential svg rectangle elements.
        barDataset = scope.plotContainer.selectAll(".bar").data(plotData);
        // bind the plotData variable to potential svg text elements.
        labelDataset = scope.plotContainer.selectAll(".barlabel").data(plotData);
        // bind the plotData variable to potential svg path elements.
        lineDataset = scope.plotContainer.selectAll(".line").data(plotData);

        // bind the plotData variable to potential svg rectangle elements.
        barDataset2 = scope.plotContainer2.selectAll(".bar").data(mirrorPlotData);
        // bind the plotData variable to potential svg text elements.
        labelDataset2 = scope.plotContainer2.selectAll(".barlabel").data(mirrorPlotData);
        // bind the plotData variable to potential svg path elements.
        lineDataset2 = scope.plotContainer2.selectAll(".line").data(mirrorPlotData);

        // bind the popup tooltip to the annotated mass spectrum.
        scope.plotContainer.call(tip);

        // bind the popup tooltip to the annotated mass spectrum.
        scope.plotContainer2.call(tip);

        // create potential bars
        barDataset.enter().append("rect").attr("class", "bar");
        // create potential bars
        barDataset2.enter().append("rect").attr("class", "bar");

        // remove unneeded bars
        barDataset
          .exit()
          .attr("y", function (d) {
            return y(-10);
          })
          .attr("x", function (d) {
            return x(d3.min(xValues)) - d.width / 2;
          })
          .remove();
        // remove unneeded bars
        barDataset2
          .exit()
          .attr("y", function (d) {
            return y(-10);
          })
          .attr("x", function (d) {
            return x(d3.min(xValues2)) - d.width / 2;
          })
          .remove();

        // draw spectral features and transition them from the origin. x coordinate is the spectral feature m/z, and y coordinate is the % relative abundance
        barDataset
          .attr("x", function (d) {
            return x(0);
          })
          .attr("y", function (d) {
            return y(0);
          })
          .transition()
          .delay(function (d, i) {
            return (duration / 2) * i;
          })
          .duration(1000)
          .attr("width", function (d) {
            return d.width;
          })
          .attr("x", function (d) {
            return x(d.mz) - d.width / 2;
          })
          .attr("height", function (d) {
            return options.annotation.height - y(d.percentBasePeak);
          })
          .attr("y", function (d) {
            return y(d.percentBasePeak);
          })
          .attr("fill", function (d) {
            return d.color;
          })
          .attr("opacity", 1)
          .attr("align", "right");

        // draw spectral features and transition them from the origin. x coordinate is the spectral feature m/z, and y coordinate is the % relative abundance
        barDataset2
          .attr("x", function (d) {
            return x(0);
          })
          .attr("y", function (d) {
            return y(0);
          })
          .transition()
          .delay(function (d, i) {
            return (duration2 / 2) * i;
          })
          .duration(1000)
          .attr("width", function (d) {
            return d.width;
          })
          .attr("x", function (d) {
            return x(d.mz) - d.width / 2;
          })
          .attr("height", function (d) {
            return options.annotation.height - y(d.percentBasePeak);
          })
          .attr("y", function (d) {
            return y(0) - 100 + 1;
          })
          .attr("fill", function (d) {
            return d.color;
          })
          .attr("opacity", 1)
          .attr("align", "right");

        // define zoom functionality on the x-axis
        var zoomX = d3.behavior
          .zoom()
          .scaleExtent([1, 1000])
          .x(x)
          .on("zoom", function () {
            // define translation object to move svg elements from original to zoomed position on the svg
            var t = zoomX.translate();
            var maxX = d3.max(x.range());

            var tx = Math.max(Math.min(0, t[0]), options.annotation.width - maxX * zoomX.scale());

            // update translation to new coordinates.
            // zoomX.translate([ 0, 0 ]);
            zoomX.translate([tx, t[1]]);

            // calling the x axes here seems to be necessary to get them to scale correctly.
            scope.container.selectAll("g.xAnnotation").call(xAxis);
            scope.container2.selectAll("g.xAnnotation").call(xTopAxis);
            scope.fragmentContainer.selectAll("g.xAnnotation").call(fragxAxis);

            // using the new scale, update the spectral peak positions
            barDataset
              .attr("x", function (d) {
                return x(d.mz) - d.width / 2;
              })
              .attr("width", function (d) {
                return d.width + options.annotation.zoomFactor * Math.log10(zoomX.scale()) * d.width;
              });
            // using the new scale, update the spectral peak positions
            barDataset2
              .attr("x", function (d) {
                return x(d.mz) - d.width / 2;
              })
              .attr("width", function (d) {
                return d.width + options.annotation.zoomFactor * Math.log10(zoomX.scale()) * d.width;
              });

            // using the new scale, update the annotation label positions
            labelDataset.attr("x", function (d) {
              return x(d.x);
            });

            // using the new scale, update the annotation label positions
            labelDataset2.attr("x", function (d) {
              return x(d.x);
            });

            // using the new scale, update the mass error circles
            circleDataset.attr("cx", function (d) {
              return x(d.mz);
            });
            // using the new scale, update the mass error circles
            //circleDataset2.attr("cx", function(d) {
            //  return x(d.mz);
            //});

            // using the new scale, redraw the lines connecting the spectral peaks to annotation labels.
            lineDataset.forEach(function (d) {
              scope.drawLine(x, y, d);
            });
            // using the new scale, redraw the lines connecting the spectral peaks to annotation labels.
            lineDataset2.forEach(function (d) {
              scope.drawLine(x, y, d);
            });
          });

        // define zoom functionality on the y-axis
        var zoomY = d3.behavior
          .zoom()
          .scaleExtent([1, 1000])
          .y(y)
          .on("zoom", function () {
            // define translation object to move svg elements from original to zoomed position on the svg
            var t = zoomY.translate();
            var maxY = d3.max(y.range());

            var ty = Math.max(Math.min(0, t[1]), options.annotation.height - maxY * zoomY.scale());

            // update translation to new coordinates.
            zoomY.translate([t[0], ty]);

            // make sure y domain keeps min at 0;
            y.domain([0, y.domain()[1]]);

            // calling the y axis here seems to be necessary to get them to scale correctly.
            scope.container.selectAll("g.yAnnotation").call(yAxis);
            //scope.container2.selectAll("g.yAnnotation").call(yAxis2);

            // using the new scale, update the spectral peak rectangle heights
            barDataset
              .attr("y", function (d) {
                return y(d.percentBasePeak);
              })
              .attr("height", function (d) {
                var height = options.annotation.height - y(d.percentBasePeak);
                if (height < 0) {
                  height = 0;
                }
                return height;
              });

            // using the new scale, update the annotation label positions
            labelDataset.attr("y", function (d) {
              return y(d.y + yMax * 0.005) - 5;
            });

            // using the new scale, redraw the lines connecting the spectral peaks to annotation labels.
            lineDataset.forEach(function (d) {
              scope.drawLine(x, y, d);
            });
          });
        // define zoom functionality on the y-axis
        var zoomY2 = d3.behavior
          .zoom()
          .scaleExtent([1, 1000])
          .y(y2)
          .on("zoom", function () {
            // define translation object to move svg elements from original to zoomed position on the svg

            var t = zoomY2.translate();
            var maxY = d3.max(y2.range());

            var ty = Math.max(Math.min(0, t[1]), options.annotation.height - maxY * zoomY2.scale());

            // update translation to new coordinates.
            zoomY2.translate([t[0], ty]);

            // make sure y domain keeps min at 0;
            y2.domain([y2.domain()[0], 0]);

            // calling the y axis here seems to be necessary to get them to scale correctly.
            scope.container2.selectAll("g.yAnnotation").call(yAxis2);
            //scope.container2.selectAll("g.yAnnotation").call(yAxis2);

            // using the new scale, update the spectral peak rectangle heights
            barDataset2
              .attr("y", function (d) {
                // return y(d.percentBasePeak) ;
                return y2(0);
              })
              .attr("height", function (d) {
                var height = -y2(d.percentBasePeak);
                //var height = options.annotation.height - y2(d.percentBasePeak);
                if (height < 0) {
                  height = 0;
                }
                return height;
              });

            // using the new scale, update the annotation label positions
            labelDataset2.attr("y", function (d) {
              // return (y(0) - 170 + options.annotation.height - y(d.percentBasePeak))  ;
              //
              return y2(0) - y2(d.percentBasePeak + yMax * 0.005) + 12;
            });

            // using the new scale, redraw the lines connecting the spectral peaks to annotation labels.
            lineDataset2.forEach(function (d) {
              scope.drawLine(x, y, d);
            });
          });

        // bind a mouseenter event to the rendered spectral peak to highlight the spectral feature and show a tooltip.
        barDataset.on("mouseenter", function (d) {
          // highlight the peak that is being hovered over using a black stroke
          d3.select(this).style("stroke", function (d, i) {
            return "black";
          });

          // define the inner HTML of the tooltip
          tip.html(function () {
            let tipText = "";

            if (d.label) {
              tipText += "<strong>Fragment:</strong> <span style='color:red'>" + d.label + " </span><br><br>";
            }

            tipText +=
              "<strong style='font-style:italic;'>m/z:</strong> <span style='color:red'>" +
              d3.format(",.4f")(d.mz) +
              " </span><br><br>" +
              "<strong>Relative Abundance:</strong> <span style='color:red'>" +
              d3.format("0.2f")(d.percentBasePeak) +
              "%</span><br><br>" +
              "<strong>% TIC:</strong> <span style='color:red'>" +
              d3.format("0.2%")(d.intensity / TIC) +
              "</span>";
            return tipText;
          });

          // show the tooltip
          tip.direction("n");
          tip.show();
        });

        // bind a mouseenter event to the rendered spectral peak to highlight the spectral feature and show a tooltip.
        barDataset2.on("mouseenter", function (d) {
          // highlight the peak that is being hovered over using a black stroke
          d3.select(this).style("stroke", function (d, i) {
            return "black";
          });

          // define the inner HTML of the tooltip
          tip.html(function () {
            let tipText = "";

            if (d.label) {
              tipText += "<strong>Fragment:</strong> <span style='color:red'>" + d.label + " </span><br><br>";
            }

            tipText +=
              "<strong style='font-style:italic;'>m/z:</strong> <span style='color:red'>" +
              d3.format(",.4f")(d.mz) +
              " </span><br><br>" +
              "<strong>Relative Abundance:</strong> <span style='color:red'>" +
              d3.format("0.2f")(d.percentBasePeak) +
              "%</span><br><br>" +
              "<strong>% TIC:</strong> <span style='color:red'>" +
              d3.format("0.2%")(d.intensity / TIC) +
              "</span>";
            return tipText;
          });

          // show the tooltip
          tip.direction("s");
          tip.show();
        });

        // remove the stroke added on mouse-in and hide the tooltip
        barDataset.on("mouseleave", function () {
          d3.select(this).style("stroke", "none");
          tip.hide();
        });
        // remove the stroke added on mouse-in and hide the tooltip
        barDataset2.on("mouseleave", function () {
          d3.select(this).style("stroke", "none");
          tip.hide();
        });

        // annotation label placement is done here. Get ready to render text elements
        labelDataset.enter().append("text").attr("class", "barlabel");

        // annotation label placement is done here. Get ready to render text elements
        labelDataset2.enter().append("text").attr("class", "barlabel");

        // add the annotation labels and center them over annotated spectral peaks
        labelDataset
          .attr("x", function (d) {
            return x(d.x) - d.width / 2;
          })
          .text(function (d) {
            return d.label;
          })
          .attr("y", function (d) {
            return y(yMax + yMax * options.annotation.padding);
          })
          .attr("opacity", 0.0)
          .transition()
          .delay(function (d, i) {
            return duration * i + 250;
          })
          .duration(1000)
          .ease("bounce")
          .attr("y", function (d) {
            return y(d.percentBasePeak + yMax * 0.005) - 5;
          })
          .attr("opacity", 1);
        // add the annotation labels and center them over annotated spectral peaks
        labelDataset2
          .attr("x", function (d) {
            return x(d.x) - d.width / 2;
          })
          .text(function (d) {
            return d.label;
          })
          .attr("y", function (d) {
            return y(0);
          })
          .attr("opacity", 0.0)
          .transition()
          .delay(function (d, i) {
            return duration * i + 250;
          })
          .duration(1000)
          .ease("bounce")
          .attr("y", function (d) {
            //return y(d.percentBasePeak + yMax * .005);
            //return y(-100 - d.percentBasePeak - 5);
            return y(100 - d.percentBasePeak);
          })
          .attr("opacity", 1);

        // transition out unused labels
        labelDataset
          .exit()
          .attr("y", function (d) {
            return y(d3.min(yValues));
          })
          .remove();
        // transition out unused labels
        labelDataset2
          .exit()
          .attr("y", function (d) {
            return y(d3.min(yValues2));
          })
          .remove();

        // return dragged label back to it's original location
        labelDataset.on("dblclick", function (d, i) {
          d.x = d.mz;
          d.y = d.percentBasePeak;

          d3.select(this).attr("x", x(d.x));
          d3.select(this).attr("y", y(d.y + yMax * 0.005));

          scope.drawLine(x, y, d);
        });

        // return dragged label back to it's original location
        labelDataset2.on("dblclick", function (d, i) {
          d.x = d.mz;
          d.y = d.percentBasePeak;

          d3.select(this).attr("x", x(d.x));
          d3.select(this).attr("y", y(d.y + yMax * 0.005));

          scope.drawLine(x, y, d);
        });

        // bind a mouseenter event to the rendered spectral peak to highlight the label and to show a tooltip.
        labelDataset
          .on("mouseenter", function (d, i) {
            // define the tooltip inner html.
            // console.log(d, i)
            tip.html(function () {
              return (
                "<strong>Fragment:</strong> <span style='color:red'>" +
                d.label +
                " </span><br><br>" +
                // "<strong>sequence:</strong> <span style='color:red'>" +
                // d.sequences +
                // " </span><br><br>" +
                "<strong style='font-style:italic;'>m/z:</strong> <span style='color:red'>" +
                d3.format(",.4f")(d.mz) +
                " </span><br><br>" +
                "<strong>Relative Abundance:</strong> <span style='color:red'>" +
                d3.format("0.2f")(d.percentBasePeak) +
                "%</span><br><br>" +
                "<strong>% TIC:</strong> <span style='color:red'>" +
                d3.format("0.2%")(d.intensity / TIC) +
                "</span>"
              );
            });
            // show tooltip
            tip.show();

            // slightly enlarge the selected label
            var labelFontSize = d3.select(this).style("font-size", 18).style("font-weight", "bold");

            // get saved color and text from label. Parse label to get the location of the bond. change color amino acids on the peptide sequence at the top.
            var label = labels[i];
            var fragmentType = label.charAt(0);
            var fragmentNumber = label.slice(1);
            var color = colors[i];
            var sequenceInfo = sequences[i];
            // console.log(label, fragmentType, fragmentNumber, i, label.startsWith("[I"), d)

            // get all text from the peptide sequence
            var interactiveTitleObjects = scope.titleContainer.selectAll("text").data(sequence);

            if(sequenceInfo.isInternalIon){
              interactiveTitleObjects
                  .style("fill", function (d, i) {
                    if (i <= sequenceInfo.end - 1 && i >= sequenceInfo.start - 1) {
                      return color;
                    } else {
                      return "black";
                    }
                    // give it a stoke as well to make the highlighted section 'pop'
                  })
                  .style("stroke", function (d, i) {
                    if (i <= sequenceInfo.end - 1 && i >= sequenceInfo.start - 1) {
                      return color;
                    } else {
                      return "none";
                    }
                  });
            } else if (fragmentType === "a" || fragmentType === "b" || fragmentType === "c" || fragmentType === "C") {
              // if the fragment type is n-Terminal, process the peptide sequence data starting from index 0. update text color if within index, else remain black
                interactiveTitleObjects
                    .style("fill", function (d, i) {
                      if (i < fragmentNumber) {
                        return color;
                      } else {
                        return "black";
                      }
                      // give it a stoke as well to make the highlighted section 'pop'
                    })
                    .style("stroke", function (d, i) {
                      if (i < fragmentNumber) {
                        return color;
                      } else {
                        return "none";
                      }
                    });
              // if the fragment type is c-Terminal, process the peptide sequence data starting from index 0. update text color if within index, else remain black
            } else {
              interactiveTitleObjects
                .style("fill", function (d, i) {
                  if (i < sequence.length - fragmentNumber) {
                    return "black";
                  } else {
                    return color;
                  }
                  // give it a stoke as well to make the highlighted section 'pop'
                })
                .style("stroke", function (d, i) {
                  if (i < sequence.length - fragmentNumber) {
                    return "none";
                  } else {
                    return color;
                  }
                });
            }

            // use the selected label index and highlight the mass error circle
            var massErrorCircles = scope.massErrorContainer.selectAll(".masserror");

            // make it a little bigger
            massErrorCircles
              .style("r", function (e, j) {
                if (d.id === e.top_id) {
                  return 7;
                }
                // give it a stroke
              })
              .style("stroke", function (e, j) {
                if (i === j) {
                  return "black";
                }
              });
          })
          .on("mouseleave", function (d, i) {
            // hide tooltip
            tip.hide();
            // reset annotated peptide sequence back to normal
            scope.titleContainer.selectAll("text").data(sequence).style("fill", "black").style("stroke", "none");
            d3.select(this).style("font-size", 12).style("font-weight", "normal");

            // set all mass error circles back to normal
            var massErrorCircles = scope.massErrorContainer.selectAll(".masserror");
            massErrorCircles
              .style("r", function (d) {
                return d.radius;
              })
              .style("stroke", "none");
          });

        /////////////////////
        labelDataset2
          .on("mouseenter", function (d, i) {
            // define the tooltip inner html.
            tip.html(function () {
              return (
                "<strong>Fragment:</strong> <span style='color:red'>" +
                d.label +
                " </span><br><br>" +
                "<strong style='font-style:italic;'>m/z:</strong> <span style='color:red'>" +
                d3.format(",.4f")(d.mz) +
                " </span><br><br>" +
                "<strong>Relative Abundance:</strong> <span style='color:red'>" +
                d3.format("0.2f")(d.percentBasePeak) +
                "%</span><br><br>" +
                "<strong>% TIC:</strong> <span style='color:red'>" +
                d3.format("0.2%")(d.intensity / TIC) +
                "</span>"
              );
            });
            // show tooltip
            tip.show();

            // slightly enlarge the selected label
            var labelFontSize = d3.select(this).style("font-size", 18).style("font-weight", "bold");

            // get saved color and text from label. Parse label to get the location of the bond. change color amino acids on the peptide sequence at the top.
            var label = labels2[i];
            var fragmentType = label.charAt(0);
            var fragmentNumber = label.slice(1);
            var color = colors2[i];

            // use the selected label index and highlight the mass error circle
            var massErrorCircles = scope.massErrorContainer.selectAll(".masserror");

            // make it a little bigger
            massErrorCircles
              .style("r", function (e, j) {
                if (d.id === e.bottom_id) {
                  return 7;
                }
                // give it a stroke
              })
              .style("stroke", function (e, j) {
                if (i === j) {
                  return "black";
                }
              });
          })
          .on("mouseleave", function (d, i) {
            // hide tooltip
            tip.hide();
            // reset annotated peptide sequence back to normal
            scope.titleContainerBottom.selectAll("text").data(sequenceBottom).style("fill", "black").style("stroke", "none");
            d3.select(this).style("font-size", 12).style("font-weight", "normal");

            // set all mass error circles back to normal
            var massErrorCircles = scope.massErrorContainer.selectAll(".masserror");
            massErrorCircles
              .style("r", function (d) {
                return d.radius;
              })
              .style("stroke", "none");
          });

        /////////////////////

        // create a drag variable which handles the click and drag event when labels need to be moved.
        var drag = d3.behavior.drag().on("drag", function (d, i) {
          // hide the tooltip. It's just a little intrusive during click and drag operations
          tip.hide();

          // determine where the label was dragged to by retrieving the event x and y coordinates.
          var newX = d3.event.x;
          var newY = d3.event.y;

          // bound the label dragging so elements cannot accidently be moved out of the svg clipping mask
          if (newX < options.annotation.width * 0.015) {
            newX = options.annotation.width * 0.015;
          }
          if (newX > options.annotation.width * 0.985) {
            newX = options.annotation.width * 0.985;
          }
          if (newY < options.annotation.height * 0.025) {
            newY = options.annotation.height * 0.025;
          }
          if (newY > options.annotation.height * 0.985) {
            newY = options.annotation.height * 0.985;
          }

          // get the m/z and % relative abundance values associated with where the label now is.
          d.x = x.invert(newX);
          d.y = y.invert(newY);

          // actually move the label now.
          d3.select(this).attr("x", newX);
          d3.select(this).attr("y", newY);

          // draw a line from the spectral peak to the moved annotation label.
          scope.drawLine(x, y, d);

          // remove unused lines
          lineDataset.exit().remove();
        });

        // call drag function creating all the labels. Seem to be hitting a race condition if we try to do it earlier.
        labelDataset.call(drag);

        // give zooming behavior to your invisible zoom rectangles
        scope.zoomX.call(zoomX);
        scope.zoomY.call(zoomY);
        scope.zoomX2.call(zoomX);
        scope.zoomY2.call(zoomY2);

        // also pass zooming behavior onto the actual axis elements (ticks, axis labels ect.). Prevents unexpected page scrolling.
        scope.container.selectAll("g.xAnnotation").call(zoomX);
        scope.container2.selectAll("g.xAnnotation").call(zoomX);
        scope.fragmentContainer.selectAll("g.xAnnotation").call(zoomX);
        scope.container.selectAll("g.yAnnotation").call(zoomY);
        scope.container2.selectAll("g.yAnnotation").call(zoomY2);

        // append line objects to everything in plot data. these will later be generated when labels are dragged.
        // logic to draw annotation lines if elements are dragged
        lineDataset.enter().append("path").attr("class", "line");
        lineDataset2.enter().append("path").attr("class", "line");
      }
    };

    /**
     * @description This function works as a companion to scope.drawAnnotation(). It takes the formatted annotations and processed spectral data from the server and translates it into the mass
     * 		error chart on the bottom of the svg with interactivity. I split it into a different function as scope.drawAnnotation was getting long
     */
    scope.drawMassError = function () {
      var x,
        y,
        xAxis,
        yAxis,
        dummyXAxis,
        dummyYAxis,
        massErrorLabel,
        shiftFactor,
        barDataset,
        options = scope.getOptions(),
        xValues = scope.getMassErrorX(),
        yValues = scope.getMassError(),
        colors = scope.getColors(),
        settings = scope.getSettings(),
        labels = scope.getLabels(),
        sequences = scope.getSequences(),
        labelCharges = scope.getLabelCharges();

      (sequence = scope.getSequence()),
        (theoMz = scope.getTheoreticalMz()),
        (neutralLosses = scope.getNeutralLosses()),
        (sequenceBottom = scope.getSequenceBottom());
      var intensityError = scope.getIntensityError();
      var intensityErrorScale = d3.scale
        .linear()
        .domain([d3.min(intensityError), d3.max(intensityError)])
        .range([0, 1]);
      var bottomId = scope.getMassErrorBottomId();
      var topId = scope.getMassErrorTopId();

      // if x and y values are empty, initialize them to an empty array to squash an error caused by a race condition on page render
      if (isNaN(d3.max(xValues))) {
        xValues = [0];
      }
      if (isNaN(d3.max(yValues))) {
        yValues = [0];
      }
      if (xValues && yValues) {
        // extract what type of mass error we're looking at (ppm or Da)
        massErrorLabel = settings.toleranceType;

        // if we're looking at milliDalton mass error levels, shift the scale by a factor of 1000 to have more meaningful units.
        shiftFactor = 1;
        if (massErrorLabel === "Da" && settings.toleranceThreshold < 1) {
          massErrorLabel = "mDa";
          shiftFactor = 1000;
        }

        // add a fudge factor to prevent svg elements from getting cut off by the clip mask
        var xScaleFudgeFactor = (d3.max(xValues) - d3.min(xValues)) * 0.025;
        var yScaleFudgeFactor = settings.toleranceThreshold * 0.1;

        // define x and y scales.
        x = d3.scale
          .linear()
          .domain([d3.min(xValues) - xScaleFudgeFactor, d3.max(xValues) + xScaleFudgeFactor])
          .range([0, options.fragments.width], 0);
        // y = d3.scale.linear().domain([-shiftFactor * (settings.toleranceThreshold + yScaleFudgeFactor), shiftFactor * (settings.toleranceThreshold + yScaleFudgeFactor)]).range([ options.fragments.height, 0]);
        y = d3.scale
          .linear()
          .domain([d3.max(yValues) + 1, d3.min(yValues) - 1])
          .range([options.fragments.height, 0]);

        // here we define 4 scales instead of just 2. the dummy axes are only used to encapsulate the mass error chart in borders.
        xAxis = d3.svg.axis().scale(x).orient("top").ticks(10);
        yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
        dummyXAxis = d3.svg.axis().scale(x).orient("top").tickValues([]);
        dummyYAxis = d3.svg.axis().scale(y).orient("left").tickValues([]);

        var plotData = [];

        // Prevent non-annotated spectral features from displaying mass error circles
        for (var i = 0; i < xValues.length; i++) {
          var color = colors[i];
          /*
          if (!yValues[i]) {
            color = "none";
          }
          */

          // format our data for easy D3 visualization
          // here we need the IDs
          // TODO: do it tobi
          plotData.push({
            mz: xValues[i],
            theoMz: theoMz[i],
            top_id: scope.getIntensityErrorIdsTop()[i],
            bottom_id: scope.getIntensityErrorIdsBottom()[i],
            neutLoss: formatNeutralLoss(neutralLosses[i]),
            error: yValues[i] * shiftFactor,
            color: yValues[i] === 0 ? "grey" : "black",
            radius: 1.5 + intensityErrorScale(intensityError[i]) * 3,
            intensityDifference: intensityError[i],
            topId: scope.getIntensityErrorIdsTop()[i], // no clue
            bottomId: scope.getIntensityErrorIdsBottom()[i], // no clue
            // topId: topId[i],
            // bottomId: bottomId[i]
          });
        }

        // give the y-axis a label based on the mass error unit
        var massErrorLabel = scope.fragmentContainer.selectAll(".yAnnotationLabel").text("Error (" + massErrorLabel + ")");

        // base transition delay on the number of elements visualized
        var delay = 1250 / plotData.length;

        // bind axes to the fragmentContainer
        scope.fragmentContainer.selectAll("g.xAnnotation").call(xAxis);
        scope.fragmentContainer.selectAll("g.yAnnotation").call(yAxis);
        scope.fragmentContainer
          .selectAll("g.xAnnotation_2")
          .attr("transform", "translate(0, " + options.fragments.height + ")")
          .call(dummyXAxis);
        scope.fragmentContainer
          .selectAll("g.yAnnotation_2")
          .attr("transform", "translate(" + options.fragments.width + ",0)")
          .call(dummyYAxis);

        // bind plotData to the chart to be rendered into circles by D3
        circleDataset = scope.massErrorContainer.selectAll(".masserror").data(plotData);
        circleDataset.enter().append("circle").attr("class", "masserror");

        // actually render the circles and transition them in
        circleDataset
          .attr("cy", function (d) {
            return y(0);
          })
          .style("fill", function (d) {
            return d.color;
          })
          .attr("cx", function (d) {
            return x(d.mz);
          })
          .attr("r", function (d) {
            return d.radius;
          })
          .attr("opacity", 0)
          .transition()
          .delay(function (d, i) {
            return i * delay;
          })
          .duration(1250)
          .attr("cy", function (d) {
            return y(d.error);
          })
          .attr("opacity", 1);

        // remove unneeded circles
        circleDataset.exit().remove();

        // create a linear function
        var line = d3.svg
          .line()
          .x(function (d) {
            return x(d.x);
          })
          .y(function (d) {
            return y(d.y);
          })
          .interpolate("linear");

        // Define the points
        var baseLine = [
          {
            lineData: [
              { x: x.domain()[0], y: 0 },
              { x: x.domain()[1], y: 0 },
            ],
            color: "#A9A9A9",
          },
        ];

        // draw the zero line
        var dataset = scope.massErrorContainer.selectAll(".zeroline").data(baseLine);
        dataset.enter().append("path").attr("class", "zeroline");

        dataset
          .attr("d", function (d) {
            return line(d.lineData);
          })
          .attr("opacity", 0)
          .style("stroke", function (d) {
            return d.color;
          })
          .transition()
          .duration(1500)
          .attr("opacity", 1);

        dataset.exit().remove();

        // attach the tooltip to the fragmentContainer
        scope.fragmentContainer.call(tip);

        // bind interactive events. When a circle is highlighted, emphasize the mass error circle, indicate the fragement amino acid sequence, highlight the annotation label.
        circleDataset.on("mouseenter", function (d, i) {
          var label = labels[i];
          var charge = labelCharges[i];
          var neutralLoss = neutralLosses[i];

          var formattedLabel = formatLabel(label, neutralLoss, charge, ionizationMode);

          let fitting_top_peak = scope.plotContainer.selectAll(".bar").filter(function (e, j) {
            // return e.id == d.bottom_id;
            return e.id == d.top_id;
          });
          let fitting_bottom_peak = scope.plotContainer2.selectAll(".bar").filter(function (e, j) {
            return e.id == d.bottom_id;
          });
          var bottom_mz = fitting_bottom_peak.data()[0] === undefined ? "-" : d3.format(",.4f")(fitting_bottom_peak.data()[0].mz);
          var top_mz = fitting_top_peak.data()[0] === undefined ? "-" : d3.format(",.4f")(fitting_top_peak.data()[0].mz);
          var intensity_diff =
            fitting_top_peak.data()[0] === undefined || fitting_bottom_peak.data()[0] === undefined
              ? "-"
              : Math.abs(d3.format(",.4f")(fitting_top_peak.data()[0].percentBasePeak - fitting_bottom_peak.data()[0].percentBasePeak));
          var intensity_diff =
            fitting_top_peak.data()[0] === undefined || fitting_bottom_peak.data()[0] === undefined
              ? fitting_top_peak.data()[0] === undefined
                ? d3.format(",.4f")(fitting_bottom_peak.data()[0].percentBasePeak)
                : d3.format(",.4f")(fitting_top_peak.data()[0].percentBasePeak)
              : Math.abs(d3.format(",.4f")(fitting_top_peak.data()[0].percentBasePeak - fitting_bottom_peak.data()[0].percentBasePeak));

          fitting_top_peak.style("stroke", "black").style("width", 6);
          fitting_bottom_peak.style("stroke", "black").style("width", 6);
          // build the internal tooltip html
          tip.html(function () {
            return (
              "" +
              "<strong>Mass Error(ppm):</strong> <span style='color:red'>" +
              d3.format(".4f")(d.error) +
              "</span><br><br>" +
              "<strong>Top</strong><strong style='font-style:italic;'> m/z:</strong> <span style='color:red'>" +
              top_mz +
              " </span><br><br>" +
              "<strong>Bottom</strong><strong style='font-style:italic;'> m/z:</strong> <span style='color:red'>" +
              bottom_mz +
              " </span><br><br>" +
              "<strong>Intensity difference(%)</strong>:</strong> <span style='color:red'>" +
              intensity_diff +
              " </span><br>"
            );
          });
          // show the tooltip
          tip.direction("e");
          tip.offset([0, 0]);
          tip.show();

          // highlight all related fragment information on other plots
          var labelObj = scope.plotContainer.selectAll(".barlabel").filter(function (e, j) {
            return e.id == d.top_id;
          });
          // make the label a little bigger
          labelObj.style("font-size", 18).style("font-weight", "bold");
          var labelObj = scope.plotContainer2.selectAll(".barlabel").filter(function (e, j) {
            return e.id == d.bottom_id;
          });
          // make the label a little bigger
          labelObj.style("font-size", 18).style("font-weight", "bold");

          // extract the sequence data and highlight the fragment on the peptide sequence
          var fragmentType = label.charAt(0);
          var fragmentNumber = label.slice(1);
          var color = colors[i];
          var sequenceInfo = sequences[i];

          // select all text elements from the marked peptide sequence
          var interactiveTitleObjects = scope.titleContainer.selectAll("text").data(sequence);

          // if the fragment type is N-terminal, work from index 0
          if(sequenceInfo.isInternalIon){
            interactiveTitleObjects
                .style("fill", function (d, i) {
                  if (i <= sequenceInfo.end - 1 && i >= sequenceInfo.start - 1) {
                    return color;
                  } else {
                    return "black";
                  }
                  // give it a stoke as well to make the highlighted section 'pop'
                })
                .style("stroke", function (d, i) {
                  if (i <= sequenceInfo.end - 1 && i >= sequenceInfo.start - 1) {
                    return color;
                  } else {
                    return "none";
                  }
                });
          } else if (fragmentType === "a" || fragmentType === "b" || fragmentType === "c" || fragmentType === "C") {
            // if the fragment type is n-Terminal, process the peptide sequence data starting from index 0. update text color if within index, else remain black
            interactiveTitleObjects
                .style("fill", function (d, i) {
                  if (i < fragmentNumber) {
                    return color;
                  } else {
                    return "black";
                  }
                  // give it a stoke as well to make the highlighted section 'pop'
                })
                .style("stroke", function (d, i) {
                  if (i < fragmentNumber) {
                    return color;
                  } else {
                    return "none";
                  }
                });
            // if the fragment type is c-Terminal, process the peptide sequence data starting from index 0. update text color if within index, else remain black
          } else {
            interactiveTitleObjects
                .style("fill", function (d, i) {
                  if (i < sequence.length - fragmentNumber) {
                    return "black";
                  } else {
                    return color;
                  }
                  // give it a stoke as well to make the highlighted section 'pop'
                })
                .style("stroke", function (d, i) {
                  if (i < sequence.length - fragmentNumber) {
                    return "none";
                  } else {
                    return color;
                  }
                });
          }

          // highlight the selected circle by making it bigger and giving it a stroke
          circleDataset
            .style("r", function (e, j) {
              // TODO HIGHLIGHT CORRECTLY
              // This is fine => its just self highlight
              if (i === j) {
                return 7;
              }
            })
            .style("stroke", function (e, j) {
              if (i === j) {
                return "black";
              }
            });
        });

        // remove the tooltip and return all svg elements back to normal
        circleDataset.on("mouseleave", function (d, i) {
          tip.hide();

          // turn all text elements back to black
          scope.titleContainer.selectAll("text").data(sequence).style("fill", "black").style("stroke", "none");
          scope.titleContainerBottom.selectAll("text").data(sequenceBottom).style("fill", "black").style("stroke", "none");
          let fitting_top_peak = scope.plotContainer.selectAll(".bar").filter(function (e, j) {
            // return e.id == d.bottom_id;
            return e.id == d.top_id;
          });
          let fitting_bottom_peak = scope.plotContainer2.selectAll(".bar").filter(function (e, j) {
            return e.id == d.bottom_id;
          });

          fitting_top_peak.style("stroke", "none").style("width", (d) => {
            return d.width;
          });
          fitting_bottom_peak.style("stroke", "none").style("width", (d) => {
            return d.width;
          });

          // highlight all related fragment information on other plots
          var labelObj = scope.plotContainer.selectAll(".barlabel").filter(function (e, j) {
            return e.id == d.top_id;
          });
          // make the label a little bigger
          labelObj.style("font-size", 12).style("font-weight", "normal");
          var labelObj = scope.plotContainer2.selectAll(".barlabel").filter(function (e, j) {
            return e.id == d.bottom_id;
          });
          labelObj.style("font-size", 12).style("font-weight", "normal");

          // remove the stroke and resize the circle back to normal
          circleDataset
            .style("r", function (data) {
              return data.radius;
            })
            .style("stroke", function () {
              return "none";
            });
        });
      }
    };

    /**
     * @description These is the event handler which actually triggers the svg drawing event. The redraw function will trigger anytime there is a change in spectral data, detected peptide
     * 		fragments, peptide sequence/charge, and settings/matching tolerances.
     */
    scope.$watch("plotdata", scope.redraw, true);
    scope.$watch("mirrorplotdata", scope.redraw, true);
    scope.$watch("peptide", scope.redraw, true);
    scope.$watch("settings", scope.redraw, true);
    scope.$watch("score", scope.redraw, true);

    // once all our drawing and rendering methods are defined, initialize the chart and let it sit. It will automatically populate with new data when the plothandler detects that the annotated
    // changes
    scope.initialize();
  };

  // return the directive
  return directive;
});
