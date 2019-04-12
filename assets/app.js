// Initialize Firebase
var config = {
    apiKey: "AIzaSyC5_WVIPFCiC9v4bSvUK2OaznLhWMoRqfA",
    authDomain: "trainschedule-aa154.firebaseapp.com",
    databaseURL: "https://trainschedule-aa154.firebaseio.com",
    projectId: "trainschedule-aa154",
    storageBucket: "trainschedule-aa154.appspot.com",
    messagingSenderId: "904943365728"
  };
firebase.initializeApp(config);


var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime;
var frequency;



$("#submitBtn").on("click", function (event) {
    event.preventDefault();
    $("#tableBody").html();

    trainName=$("#trainName").val().trim();
    destination=$("#destination").val().trim();
    firstTrainTime=$("#firstTrainTime").val().trim();
    frequency=$("#frequency").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

})

database.ref().on("child_added", function(snapshot, prevChildKey) {

    console.log(prevChildKey);

    //current time
    var currentTime = moment();
    //the time of first train to deploy
    var firstTime = moment(snapshot.val().firstTrainTime,'HH:mm');
    //current time - first train deploy time, result in minutes
    var diffMin = currentTime.diff(firstTime, 'minutes');

    frequency = snapshot.val().frequency;
    //Calculating the minute away to the next train arrive
    //Use the time different and divided by frequency to find out the remaining
    var minAway = frequency-(diffMin%frequency);
    var nextArrival = currentTime.add(minAway, 'minutes').format('HH:mm');


    //var monthWorked = Math.abs(date.diff(moment(),"months"));
    var tableRow = $("<tr>");
    $("#tableBody").append(tableRow);

    var tableTrainName = $("<td>");
    tableRow.append(tableTrainName.text(snapshot.val().trainName));

    var tableDestination = $("<td>");
    tableRow.append(tableDestination.text(snapshot.val().destination));
    
    var tableFirstTrainTime = $("<td>");
    tableRow.append(tableFirstTrainTime.text(firstTime.format('HH:mm')));
    
    var tableFrequency = $("<td>");
    tableRow.append(tableFrequency.text(snapshot.val().frequency));

    var tableNextArrival = $("<td>");
    tableRow.append(tableNextArrival.text(nextArrival));

    var tableMinAway = $("<td>");
    tableRow.append(tableMinAway.text(minAway));
    
})