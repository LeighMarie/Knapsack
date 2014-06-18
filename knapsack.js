/* Burglar's Dilemma: interactive lesson of Knapsack Problem */

//checks to see how page should be initialized
//determines if local storage should be used or not
function pageInitialization(){  
    var totalWeight = 0;
    var totalValue = 0;
    //if not the first time opening page or not following a start-over click
    if (!(localStorage.getItem('check') == 'yes')) {   
        //check if local storage should be restored for each DOM and make sure DOM's properties are correct
        if(localStorage.getItem('sack')) {
            $('#sack').html(localStorage.getItem('sack'));
            $('.item').attr("style","");
            $('.item').css("display", "inline-block");       
        }

        if(localStorage.getItem('house')) {
            $('#house').html(localStorage.getItem('house'));
            $('.item').attr("style","");
            $('.item').css("display", "inline-block");   
        }

        if(localStorage.getItem('weight')) {
            $('#weight').html(localStorage.getItem('weight'));
            var totalWeight = parseInt(localStorage.getItem('weight'));
        }

        if(localStorage.getItem('value')) {
            $('#value').html(localStorage.getItem('value'));
            var totalValue= parseInt(localStorage.getItem('value'));
        }
        
        if(localStorage.getItem('chart')) {
            $('#chart').html(localStorage.getItem('chart'));
        } 
    }
    //first time loading page or following a start-over click
    else{
        //initialize data-location value of each item
        var items = $('.item img');
        items.attr("data-location","house"); 
        //set flag indicating a start-over button click to 'no'
        localStorage.setItem('check', 'no');
    }
    //to be used in main function
    return [totalWeight, totalValue];
};

//updates the local storage of all the html on the page that may be changed
function updateLocalStorage() {
    var sack = $('#sack').html();
    localStorage.setItem('sack', sack);
    var house = $('#house').html();
    localStorage.setItem('house', house);
    var weight = $('#weight').html();
    localStorage.setItem('weight', weight);
    var value = $('#value').html();
    localStorage.setItem('value', value);
    var chart = $('#chart').html();
    localStorage.setItem('chart', chart);
};

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
    var dataset = [totalWeight, 20- totalWeight];
    var labels = [' kg used', ' kg available'];

    var pie = d3.layout.pie();
    var color = d3.scale.ordinal()
                        .range(["red", "gray"]);
    
    //set pie chart dimensions
    var width = 347;
    var height = 347;
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
            return d.value + labels[i];}
            else {return d.value};
    });
};

//happens after web page is loaded
$(function() {
    //set up page and get totalWeight and totalValue 
    var dataArray = pageInitialization();
    var totalWeight = dataArray[0];
    var totalValue = dataArray[1];  
    //burglar on creaky floor noise loops every duration of mp3 file (approx 95 seconds)
    //from https://www.youtube.com/watch?v=XBSsaK-r9nU
    var backgroundNoise = new Audio('FloorCreak.mp3');
    backgroundNoise.play();
    setInterval(function(){var backgroundNoise = new Audio('FloorCreak.mp3'); backgroundNoise.play();}, 94000);  
    
    //controls movement of the items when user clicks each item
    var items = $('.item img');
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
        //update local storage of all changeable html
        updateLocalStorage();
        });
    
      //when user clicks start-over button
      var button = $('#startOver');
      button.on('click', function(event) {
          var target = $(event.target);
          //set flag indicating start-over
          localStorage.setItem('check', 'yes');
          //reload the page
          location.reload();
      });
    
    });

