// unpack function that will return information in object 
function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
};

// load in csv 
d3.json("samples.json").then(data => {
    var ids = unpack(data.metadata, "id");
    var dropdown = d3.select("#selDataset");
    // append dropdown with ids 
    dropdown.selectAll("select").data(ids).enter().append("option")
        .html(function (x) {
            return `<option value= "${x}">${x}</option>`;
        });
});

function init() {
    d3.json("samples.json").then(data => {
        var val = data.metadata[0].id.toString();
        buildPlot(val)
        console.log(`init ${val}`);
        buildInfo(val)
    });
};

function optionChanged() {
    var inputEl = d3.select("select");
    var val = inputEl.property("value");
    console.log(val);
    buildPlot(val)
};

function buildPlot(val) {
    // making sure data is loaded 
    d3.json("samples.json").then(data => {
        // console.log(data);
        // console.log(val)

        /*MAKING HORIZONTAL CHART */

        // getting correct sample 
        var sample = data.samples.find(({ id }) => id === val);
        // console.log(sample);

        // getting sample values and reversing order 
        var sample_values = sample.sample_values;
        var topSamps = sample_values.slice(0, 10).reverse();

        // getting sample OTU id's
        var otu_ids = sample.otu_ids;
        var top_Otu = (otu_ids.slice(0, 10)).reverse();

        // getting OTU labels 
        var labels = sample.otu_labels;
        var otu_labels = labels.slice(0, 10).reverse();

        // creating trace 
        var trace = {
            x: topSamps,
            y: top_Otu.map(x => `OTU ${x}  `),
            text: otu_labels,
            type: "bar",
            orientation: "h"
        }

        // making trace an array 
        var data = [trace];

        // creating layout 
        var layout = {
            title: "",
            margin: {
                l: 100,
                r: 10,
                t: 20,
                b: 40
            }
        };

        // plotting horizontal bar chart 
        Plotly.newPlot("bar", data, layout);

        /*MAKING BUBBLE CHART */

        var bubble_trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            },
        }

        var bubble_data = [bubble_trace];
        var bubble_layout = {
            showlegend: true,
            height: 800,
            width: 1000
        };

        Plotly.newPlot("bubble", bubble_data, bubble_layout);
    });
};

function buildInfo(val) {
    d3.json("samples.json").then(data => {
        var sample = data.metadata.find(({ id }) => id.toString() === val);
        console.log(sample);

        // Object.entries(sample).forEach(([k,v])=> console.log(`${k}: ${v}`));

        // d3.select("#sample-metadata").selectAll("li")
        // .data(sample).enter()
        // .append("ul")
        // .html(function(d) {
        //     Object.entries(sample).forEach(([k,v])=> (`${k}: ${v}`));
        //     return `<li>${k}: ${v}<\li>`;
        // });


        d3.select("#sample-metadata")
            .selectAll("li")
            .data(sample)
            .enter()
            .append("ul")
            .html(function (d) {
                return `<li>${d.key}:${d.value}</li>`;
            });




    });
};


init();