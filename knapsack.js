/* Burglar's Dilemma: interactive lesson of Knapsack Problem */

//if in "house" itemBox (left), move to "sack" itemBox (right) and vice versa
function moveItem(item) { 
    if (item.attr("data-location") == "house") {
        item.attr("data-location","sack");
        $('#sack').append(item.parent());
    }
    else{
        item.attr("data-location","house");
        $('#house').append(item.parent());
    }
};
 /*$elem.animate({
        'left': endpoint +'px'
    });*/

//check whether totalWeight is still under 20 after new item possibly moved
function canAddToTotal(weight, totalWeight) {
    return (totalWeight + weight <=  parseInt($('.knapsack').attr("data-maxweight")));   
};

function tastefulAlert() {
    $('.alert').animate({opacity: 1}, 1500);
    $('.alert').animate({opacity: 0}, 1500);
};


/*function loadEnemies(enemyName) {

  var url = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  var data = {
    tags: enemyName,
    tagmode: "any",
    format: "json"
  };
  var promise = $.ajax({
    dataType: "json",
    url: url,
    data: data
  });
  $('img.enemy').remove();
  promise.done(function(data) {
      var imgLink = data.items[0].media.m;
      var newImg = $('<img class="enemy" src="' + imgLink + '" />');
      $('body').append(newImg);
  });
  promise.fail(function(reason) {
    console.log(reason);
  });

};

//if spaceship and enemy get close enough, spaceship destroys enemy and a laser sound is played
function checkCollision($elem) {
    var enemyChosen = $('.enemy');
    //if both entities are not null
    if ((enemyChosen) && ($elem)) {
        if ((Math.abs($elem.position().left - enemyChosen.position().left) < 75) &&
        (Math.abs($elem.position().top - enemyChosen.position().top) < 75)) {
            var audio = new Audio('laser1.mp3');
            audio.play();
            enemyChosen.remove();
        }
        else{}
    }
    };*/ 


//happens after web page is loaded
$(function() {
    var totalValue = 0;
    var totalWeight = 0;
    var items = $('.item img');
    //initialize values
    items.attr("data-location","house");
    
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
            $('#weight').html(totalWeight);
            $('#value').html(totalValue);
        }
        //must check if can add weight from "house" (left) itemBox to "sack" itemBox
        else if (canAddToTotal(weight, totalWeight)) {
            moveItem(target);
            totalWeight += weight;
            totalValue += parseInt(target.attr("data-value"));
            $('#weight').html(totalWeight);
            $('#value').html(totalValue);
        }
        else{
            tastefulAlert();
        }            
    });

});

  /*//text box to enter enemy's name
  var input = $('<input> CHOOSE AN ENEMY </input>');
  $("#controls").append(input);*/

  /*//check if user has entered enemy name to fetch picture
  input.on('keyup', function(evt) {
    if (evt.keyCode == 13) {
      var enemyName = input.val();
      loadEnemies(enemyName);
    }
  });
  */
  /*//check whether spaceship and enemy are close together
  setInterval(function(){checkCollision(spaceship)}, 300);*/
    
    /* THINGS I NEED TO DO IN ORDER OF PRIORITY
    TASTEFUL ALERT
    MOVE TOTAL VALUE/TOTAL WEIGHT UP
    
    ALLOW FOR USER TO PICK IMAGES
    ADD SOUND
    D3 BAR/PIE CHART
    
    LOCALSTORAGE() SAVE INTERACTION STATE
    ANIMATE THE APPEND 
    DETAILS FROM CODE REVIEW DOCS
    */
