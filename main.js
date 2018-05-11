$(document).ready(gogoApp);
function gogoApp(){
    addClickHandlers();
    createBoard();
}
// Global variables
    // Card Handling
var firstImageClick = null;
var secondImageClick = null;
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
    // Stats
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

function addClickHandlers(){
    $('#game-area').on('click', '.card', card_clicked);
    $('.reset').click(function(){
        games_played++;
        reset_stats();
        display_stats();
        match_counter = 0;
        $(".card").replaceWith();
        createBoard();
    });
}
// Card Click Functionality
function card_clicked() {
    if(first_card_clicked === null) {
        first_card_clicked = this;
        firstImageClick = $(this).find('.front img').attr('src');
        $(this).addClass('reveal'); 
        $(first_card_clicked).addClass('viewing');
        return;
    } else {
        second_card_clicked = this;
        secondImageClick = $(this).find('.front img').attr('src');
        $(this).addClass('reveal'); 
        $(second_card_clicked).addClass('viewing');
        revealAdjacentCards(this);
        attempts++;
        if (firstImageClick === secondImageClick) {
            match_counter++;
            matches ++;
            $(first_card_clicked).addClass('viewing');
            $(second_card_clicked).addClass('viewing');
            first_card_clicked = null;
            second_card_clicked = null;
            if (match_counter === total_possible_matches) {
                $('.headerInfo h1').text('You won!');
            } else {
                return;
            }
        } else {
            $('.card').addClass('viewing');
            pauseFlip();       
            return;
        }
    }
}
function hideCard(){
    $(first_card_clicked).removeClass('reveal');
    $(second_card_clicked).removeClass('reveal');
    first_card_clicked = null;
    second_card_clicked = null;
    $('.card').removeClass('viewing');
}
function pauseFlip(){
    window.setTimeout(function(){
        hideCard();
    }, 1000);
}
// Stats Functionality
function display_stats(){
    var accuracy = Math.round((matches)/(attempts)*100);
    $('.games-played .value').text(games_played);
    $('.attempts .value').text(attempts);
    $('.accuracy .value').text(accuracy + '%');
}
function reset_stats(){
    var matches = 0;
    var attempts = 0;
    var accuracy = 0;
    display_stats();
}
// Game Board Generation
function createBoard(){
    for(i=0; i<total_possible_matches*2; i++){
        var card = $('<div>').addClass('card').addClass(`pos-${i}`);
        var front = $('<div>').addClass('front');
        var back = $('<div>').addClass('back');
        $('#game-area').append(card);
    }
    $('.card').append(front, back);
    $('.back').append('<img src= "images/owlogo.png" alt="Overwatch Logo" />');
    addHeroes();
}
// Heroes
var heroRoster = ['bastion', 'brigitte', 'genji', 'hanzo', 'mei', 'mercy', 'sombra', 'tracer', 'zenyatta'];
function addHeroes(){
    var rosterCopy = heroRoster.concat(heroRoster);;
    $('.front').each(function(){
    var heroChoice = Math.floor(Math.random() * rosterCopy.length);
    $(this).append(`<img src= "images/heroes/${rosterCopy[heroChoice]}.png" alt= "${rosterCopy[heroChoice]}"/>`).addClass(`${rosterCopy[heroChoice]}`); 
    rosterCopy.splice(heroChoice, 1);
  });
}

function revealAdjacentCards(currentCard) {
    checkCardAbove();
    checkCardBelow();
    checkCardLeft();
    checkCardRight();
}

var characters = {
    mei: {
        'card-power': revealAdjacentCards
    }
}

function checkCardAbove() {
    // Use math by subtracting six for a valid pos index
    // Select element based off of class with the pos index 
        // While selecting element, find the element with the class of back
        // Apply proper class to reveal
    // Call setTimeout after ~1 sec
        // Will remove class to hide card from reveal
}

function checkCardBelow() {

}

function checkCardLeft() {

}

function checkCardRight() {

}