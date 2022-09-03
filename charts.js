function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    console.log(data)
    var sampledata = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = sampledata.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var results = resultsArray[0];
   
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var samp_otu_id = results.otu_ids;
    
    var samp_otu_lable = results.otu_labels;
    
    var samp_values = results.sample_values;
    
    
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var samp_otu_id_sort = samp_otu_id.sort((a,b)=> a.value-b.value);
    
    var yticks = samp_otu_id_sort.slice(0,10);
    var samp_values_sort = samp_values.sort((a,b)=> b-a)
    var samp_values_slice = samp_values_sort.slice(0,10)
    var samp_values_right = samp_values_slice.sort((a,b)=> a-b)
    console.log(samp_values_right)
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: samp_values_right,
      
      text: samp_otu_lable,
      type: "bar"
    };
    barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title : "Top 10 Bacteria Cultures Found",
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    var trace2 = {
      x: samp_otu_id,
      y: samp_values,
      text: samp_otu_lable,
      mode: 'markers',
      colorscale: 'Portland',
      marker:{
        size:samp_values, 
        color: samp_otu_id, 
        colorscale: 'Portland'
      } 
      

    };
    
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode: 'closest',
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var metadata = data.metadata;
    var resultdata = metadata.filter(sampleObj => sampleObj.id == sample);
    var resultw = resultdata[0];
    var resultfreq = resultw.wfreq;

    //var resultfreqnum = resultfreq.map(freq => parseInt(freq.value))
    

    var trace3 = {
    domain: { x: [0, 1], y: [0, 1] },
		value: resultfreq,
		title: { text: "Scrubs per Week" },
		type: "indicator",
		mode: "gauge+number",
    gauge:{
      axis: {range: [0, 10]},
      bar: {color: "Black"},
      steps: [
      {range: [0,2], color:'Red'},
      {range: [2,4], color:'Yellow'},
      {range: [4,6], color:'Orange'},
      {range: [6,8], color:'Green'},
      {range: [8,10], color:'Blue'},
    ]}


    };

    var gaugeData = [trace3];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: 'Belly Button Washing Frequency'
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
