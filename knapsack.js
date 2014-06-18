/* Burglar's Dilemma: interactive lesson of Knapsack Problem */

//if in "house" itemBox (left), move to "sack" itemBox (right) and vice versa
function moveItem(item) { 
    if (item.attr("data-location") == "house") {
        item.attr("data-location","sack");
        //display item in new itemBox with animation
        var new_item = $(item.parent()).hide();
        $('#sack').append(new_item);
        new_item.show("slow");
    }
    else{
        item.attr("data-location","house");
        //display item in new itemBox with animation
        var new_item = $(item.parent()).hide();
        $('#house').append(new_item);
        new_item.show("slow");
    }
};


//check whether totalWeight is still under 20 after new item possibly moved
function canAddToTotal(weight, totalWeight) {
    return (totalWeight + weight <=  parseInt($('.knapsack').attr("data-maxweight")));   
};


//a tasteful alert alerting the user that they have exceeded the knapsack capacity
function tastefulAlert() {
    //classic failure noise
    //from http://www.youtube.com/watch?v=iMpXAknykeg
    var audio = new Audio('SadTrombone.mp3');
    audio.play();
    $('.alert').animate({opacity: 1}, 1500);
    $('.alert').animate({opacity: 0}, 1500);
};


//d3 pie chart of knapsack contents (how much room left/how much already filled)
function updatePieChart(totalWeight){
    //used to fill in pie chart
    var maxWeight = parseInt($('.knapsack').attr("data-maxweight"));
    var dataset = [totalWeight, maxWeight- totalWeight];
    var labels = [' kg used', ' kg available'];

    var pie = d3.layout.pie();
    var color = d3.scale.ordinal()
                        .range(["red", "gray"]);
    
    //set pie chart dimensions
    var width = 300;
    var height = 300;
    var outerRadius = width / 2;
    var innerRadius = 0;
    var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
    
    //update the chart from last move of user
    $("#chart").html("");
    var svg = d3.select('#chart')
                .append("svg")
                .attr("width", width)
                .attr("height", height);
    
    //set up groups
    var arcs = svg.selectAll("g.arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");
    
    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);
    
    //generate text labels for each wedge
    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        //make sure text label isn't hidden (just omit label if pie slice to be covered too small)
        .text(function(d, i) {
            if ((d.value > 2) || (d.value == 0)) {
                return d.value + labels[i];
            } else {
                return d.value;
            };
    });
};

//load items of item type user has chosen to steal from flickr
function loadItems(item) {

  var url = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  var data = {
    tags: item,
    tagmode: "any",
    format: "json"
  };
  var promise = $.ajax({
    dataType: "json",
    url: url,
    data: data
  });
    
  promise.done(function(data) {
      var weights=["10", "9", "4", "2", "1", "20"];
      var values=["175", "90", "20", "50", "10", "200"];
      for (var i = 0; i < 6; i++) {
      var imgLink = data.items[i].media.m;
      //appended images to already existing divs 
      var newImg = $('<img src="' + imgLink + '" data-value= "' + values[i] + '" data-weight= "' + weights[i] +'" />');
      var id = i + 1;
      $('#'+id).append(newImg);
      $('#'+id).append("<br> $" + values[i] + ", " + weights[i] + "kg");
      }
  });
    
  promise.fail(function(reason) {
    console.log(reason);
  });

};
 


//happens after web page is loaded
$(function() {
    
    var chosenItem = prompt("Please enter what you would like to steal: ","default");

    if (chosenItem != null)
      {
      loadItems(chosenItem);
      }
    
    //wait for images to load from flickr
    setTimeout(function(){
    //burglar on creaky floor noise loops every duration of mp3 file (approx 95 seconds)
    //from https://www.youtube.com/watch?v=XBSsaK-r9nU
    var backgroundNoise = new Audio('FloorCreak.mp3');
    backgroundNoise.play();
    setInterval(function(){var backgroundNoise = new Audio('FloorCreak.mp3'); backgroundNoise.play();}, 94000);

    var totalValue = 0;
    var totalWeight = 0;
    var items = $('.item img');
    //initialize values
    items.attr("data-location","house");
    var sack = $('#sack').html();
    localStorage.setItem('sack', sack);
    var house = $('#house').html();
    localStorage.setItem('house', house);
    
    //controls movement of the items
    items.on('click', function(event) {
        var target = $(event.target);
        var weight = parseInt(target.attr('data-weight'))
        //can always move item if it's in the "sack" (right) itemBox
        if (target.attr('data-location') == "sack")
        {
            moveItem(target);
            totalWeight -= weight;
            totalValue -= parseInt(target.attr("data-value"));
            updatePieChart(totalWeight);
            $('#weight').html(totalWeight);
            $('#value').html(totalValue);
        }
        
        //must check if can add weight from "house" (left) itemBox to "sack" itemBox
        else if (canAddToTotal(weight, totalWeight)) 
        {
            moveItem(target);
            totalWeight += weight;
            totalValue += parseInt(target.attr("data-value"));
            updatePieChart(totalWeight);
            $('#weight').html(totalWeight);
            $('#value').html(totalValue);
        }
        else{
            tastefulAlert();
        }            
    });
    }, 3000);
});


    
    /* THINGS I NEED TO DO IN ORDER OF PRIORITY
    
    LOCALSTORAGE() SAVE INTERACTION STATE-- ask wednesday (hard to do with constant prompt unless counter)
    PIE CHART TRANSITIONS-- ask Philip wednesday
    
    DETAILS FROM CODE REVIEW DOCS
    MORE COMPLICATED ANIMATION
    */
