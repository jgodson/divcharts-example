function DivChart(element, options) {
  // If there is no data we can't do anything
  if (!options.data) {
    console.log("No data object given");
    return;
  }
  // Check to see if all data has a percentage or value
  var calculatePercentage = false;
  Object.keys(options.data).forEach(function(key) {
    if (!options.data[key].percentage && !calculatePercentage) {
      calculatePercentage = true;
    }
    if (calculatePercentage && calculatePercentage != 'error') {
      if (!options.data[key].value) {
        calculatePercentage = 'error';
      }
    }
  });
  if (calculatePercentage == 'error') {
    console.log('If percentage is not specified, a value needs to be present');
    return;
  }

  // Set up object variables
  this._element = element;
  this._options = options;
  // Set up object functions
  this.setValue = setValue;
  this.calcPercentage = calcPercentage;
  this.drawChart = drawChart;

  // Verify the important ones exist and set to a default if they don't
  if (!this._options.id) this._options.id = 0; // each one needs a unique id for css
  // Set default bar width if none specified
  if (!this._options.bar_width) this._options.bar_width = 100 / Object.keys(this._options.data).length;
  if (calculatePercentage) this.calcPercentage(); // calculate percentages, if needed
  
  // Create the chart container inside the element
  this._element.innerHTML = "<div class='divchart-container' id='divchart-" + this._options.id +"'>";

  // Create the chart inside the container
  this.drawChart();

  function setValue(identifier, number) {
    if (this._options.data[identifier] != 'undefined') {
      this._options.data[identifier].value = number;
      this.calcPercentage();
      this.drawChart();
    }
    else {
      console.log("Chart identifer " + identifier + "could not be found");
    }
  }

  function calcPercentage() {
    var maxValue = 0;
    var dataKeys = Object.keys(this._options.data);
    for (var i = 0; i < dataKeys.length ; i++) {
      maxValue += this._options.data[dataKeys[i]].value;
    }
    var self = this;
    dataKeys.forEach(function(key) {
      self._options.data[key].percentage = self._options.data[key].value / maxValue * 100; // set percentage
    });
  }
  
  function drawChart() {
    var self = this;
    var html = "";
    var labels = "<div class='divchart-labels' style='height: " + this._options.label_height + "px;'>";
    Object.keys(this._options.data).forEach(function(id) {
      var dataID = self._options.data[id].id;
      labels += "<span style='width: " + (self._options.data[id].width || self._options.bar_width)
        + "%;'>" + id + "</span>";
      html += "<div class='divchart-bar divchart-chart-" + dataID + "' style='height: calc(100% - " 
        + self._options.label_height + "px); width: " + (self._options.data[id].width || self._options.bar_width) 
        + "%;'>";
      html += "<div class='divchart-space divchart-data-" + dataID + "-space' style='height: calc(100% - " 
        + self._options.data[id].percentage + "%);'></div>";
      html += "<div class='divchart-data-bar divchart-data-" + dataID + "-bar' style='height: calc(100% - " 
        + (100 - self._options.data[id].percentage) + "%);'></div></div>";
    });
    labels += "</div>";
    html += labels + "</div>";
    document.getElementById("divchart-" + this._options.id).innerHTML = html;
  }
}

// First Chart
var el = document.getElementById('container');
var ops = {
  type: 'bar', // doesn't currently do anything
  id: 1, // Each should have id to allow for css customization
  label_height: 20, // specify height for labels (then increase font-sizes using css)
  bar_width: 25, // can specify chart bar widths here (in %)
  data: {
    "Windows": { // This is also the label for this bar
      id: 1, // id used for css selector
      percentage: 52.1 // if you have exact percentage then can specify, else use values
    },
    "MacOS/OSX": {
      id: 2,
      percentage: 26.2,
      width: 50 // Also individual widths here (you must make sure they add up to 100% or may look odd)
    },
    "Linux": {
      id: 3,
      percentage: 21.7
    }
  }
}
var dc = new DivChart(el, ops);

// Second Chart
el = document.getElementById('container2');
ops = {
  type: 'bar',
  id: 2,
  label_height: 20,
  data: {
    "Java": { // This is also the label for this bar
      id: 1, // id used for css selector
      value: 18.755 // use a value and it will calculate the percentage/size of bars
    },
    "C": {
      id: 2,
      value: 9.203
    },
    "C++": {
      id: 3,
      value: 5.415
    },
    "C#": {
      id: 4,
      value: 3.659
    },
    "Python": {
      id: 5,
      value: 3.567
    }
  }
}
dc2 = new DivChart(el, ops);