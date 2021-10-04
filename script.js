var parameters = new URLSearchParams(window.location.search);
var songname = document.querySelector('#tablaturename');
var songname2 = document.querySelector('#tablaturename2');
var spotify = document.querySelector('#spotify');
var ultimateguitar = document.querySelector('#ug');
var youtube = document.querySelector('#yt');

var inputs = {
    type: parameters.get('type'),
    difficulty: parameters.get('difficulty'),
    tuning: parameters.get('tuning'),
    key: parameters.get('key'),
    capo: parameters.get('capo')
};
console.log(inputs)

var options = {
    type: "classification"
};

var modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin"
};

var neuralNetwork = ml5.neuralNetwork(options);

function predict() {
    neuralNetwork.classify(inputs, function(err, results) {
        if (err) {
            console.log(err);
            songname2.innerHTML = "We weren't able to recommend you any tablature with your specified preferences! Please try again with different preferences."
            return;
        }

        var result = results[0];
        var confidence = result.confidence * 100;
        // We hebben een voorspelling
        console.log(result);
       songname.innerHTML = result.label;
       songname2.innerHTML = "Based on your given inputs we recommend you to learn the tab for the song: " + result.label + " ! <br>We came to this decision with a confidence of " + confidence.toFixed(0) + "% because you told us you were looking for tablature perfect for a " + inputs.difficulty + " level guitar player.<br> For the specific preferences we've kept in mind that it is a " + inputs.type + " type of tablature. Also we've kept " + inputs.tuning + " tuning in mind! <br> And last but not least, this song is played with " + inputs.capo  + " !";
       spotify.innerHTML = "Listen to " + result.label + " on spotify: <a target=\"_blank\"href=\"https://open.spotify.com/search/" + result.label + "\"><i class=\"fa fa-spotify fa-2x\" aria-hidden=\"true\" style=\"color: #1ED760; vertical-align: middle; margin-left: 5px;\"></i></a> ";
       youtube.innerHTML = "Listen to " + result.label + " on YouTube: <a target=\"_blank\"href=\"https://www.youtube.com/results?search_query=" + result.label + "\"><i class=\"fa fa-youtube-play fa-2x\" aria-hidden=\"true\" style=\"color: #FF0000; vertical-align: middle; margin-left: 5px;\"></i></a> ";
       ultimateguitar.innerHTML = "<a target=\"_blank\" href=\"https://www.ultimate-guitar.com/search.php?search_type=title&value=the%20" + result.label  + "\" class=\"btn btn-primary\" style=\"width: 35%;\">Show me my tablature!</a>";
    });
}
neuralNetwork.load(modelDetails, predict);