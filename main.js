$(document).ready(gogoApp);
function gogoApp(){
    addClickHandlers();
    createBoard();   
    // playgound();
}
// Global variables
    // Card Handling
var firstImageClick = null;
var secondImageClick = null;
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var currentCard = null;
    // Stats
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

function addClickHandlers(){
    $('#game-area').on('click', '.card', card_clicked);
    $("#splashModal").click(closeModal);
    $('.reset').click(function(){
        games_played++;
        reset_stats();
        display_stats();
        match_counter = 0;
        $(".card").replaceWith();
        createBoard();
    });
}
function closeModal(){
    $('#splashModal').replaceWith();
    bgMusicPlay();
}
// Card Click Functionality
function card_clicked() {
    $(this).addClass('matched'); 
    if(first_card_clicked === null) {
        first_card_clicked = this;
        firstImageClick = $(this).find('.front img').attr('src');
        heroClickSound();
        $(first_card_clicked).addClass('viewing');
        return;
    } else {
        second_card_clicked = this;
        secondImageClick = $(this).find('.front img').attr('src');
        $(second_card_clicked).addClass('viewing');
        attempts++;
        if (firstImageClick === secondImageClick) {
            currentCard = $(this).attr('position');
            powerDetection();
            heroMatchSound();
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
    $(first_card_clicked).removeClass('matched');
    $(second_card_clicked).removeClass('matched');
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
        var card = $('<div>').addClass('card').attr('position',i);
        var front = $('<div>').addClass('front');
        var back = $('<div>').addClass('back');
        $('#game-area').append(card);
    }
    $('.card').append(front, back);
    addHeroes();
}
// Heroes
var heroRoster = ['bastion', 'brigitte', 'genji', 'hanzo', 'mei', 'mercy', 'sombra', 'tracer', 'zenyatta'];
var heroes = {
    bastion: {
        power: revealDiagonalCards,
        clickSound: new Audio('sounds/bastion-click.ogg'),
        matchSound: new Audio('sounds/bastion-ult.ogg'),
        src: 'images/heroes/bastion.png'
    },
    brigitte: {
        power: revealDiagonalCards,
        clickSound: new Audio('sounds/brigitte-click.ogg'),
        matchSound: new Audio('sounds/brigitte-ult.ogg'),
        src: 'images/heroes/brigitte.png'
    },
    genji: {
        power: revealDiagonalCards,
        clickSound: new Audio('sounds/genji-click.ogg'),
        matchSound: new Audio('sounds/genji-ult.ogg'),
        src: 'images/heroes/genji.png'
    },
    hanzo:{
        power: revealEdgeCards,
        clickSound: new Audio('sounds/hanzo-click.ogg'),
        matchSound: new Audio('sounds/hanzo-ult.ogg'),
        src: 'images/heroes/hanzo.png' 
    },
    mei: {
        power: revealAdjacentCards,
        clickSound: new Audio('sounds/mei-click.mp3'),
        matchSound: new Audio('sounds/mei-ult.ogg'),
        src: 'images/heroes/mei.png'
    },
    mercy: {
        power: revealDiagonalCards,
        clickSound: new Audio('sounds/mercy-click.ogg'),
        matchSound: new Audio('sounds/mercy-ult.ogg'),
        src: 'images/heroes/mercy.png'
    },
    sombra: {
        power: revealDiagonalCards,
        clickSound: new Audio('sounds/sombra-click.ogg'),
        matchSound: new Audio('sounds/sombra-ult.ogg'),
        src: 'images/heroes/sombra.png'
    },
    tracer: {
        power: revealDiagonalCards,
        clickSound: new Audio('sounds/tracer-click.ogg'),
        matchSound: new Audio('sounds/tracer-ult.ogg'),
        src: 'images/heroes/tracer.png'
    },
    zenyatta: {
        power: revealDiagonalCards,
        clickSound: new Audio('sounds/zenyatta-click.ogg'),
        matchSound: new Audio('sounds/zenyatta-ult.ogg'),
        src: 'images/heroes/zenyatta.png'
    },
}
function addHeroes(){
    var rosterCopy = heroRoster.concat(heroRoster);
    $('.front').each(function(){
    var heroChoice = Math.floor(Math.random() * rosterCopy.length);
    $(this).append(`<img src= "images/heroes/${rosterCopy[heroChoice]}.png" alt= "${rosterCopy[heroChoice]}"/>`).addClass(`${rosterCopy[heroChoice]}`); 
    rosterCopy.splice(heroChoice, 1);
  });
}

// Hero Power Invocation
function powerDetection(){
    if(secondImageClick == heroes.mei.src) {
        revealAdjacentCards();
    } else if(secondImageClick == heroes.genji.src) {
        revealDiagonalCards();
    } else if(secondImageClick == heroes.hanzo.src) {
        revealEdgeCards();
    } else {
        return;
    }
}
function revealAdjacentCards() {
    var position = parseInt(currentCard);
    var range = position >= 0 && position < 18;
    var topPosition = parseInt(currentCard)-6;
    var bottomPosition = parseInt(currentCard)+6;
    var leftPosition = parseInt(currentCard)-1;
    var rightPosition = parseInt(currentCard)+1;
    var topElementSelector = `div[position="${topPosition}"]`;
    var bottomElementSelector = `div[position="${bottomPosition}"]`;
    var leftElementSelector = `div[position="${leftPosition}"]`;
    var rightElementSelector = `div[position="${rightPosition}"]`;
    topBottomCheck();
    leftCheck();
    rightCheck();
    function topBottomCheck(){      
        if(range == true){
            $(topElementSelector).addClass('reveal');
            $(bottomElementSelector).addClass('reveal');   
        } else if(range == true && position !== 0 && position !== 6 && position !== 12) {
            $(rightElementSelector).addClass('reveal');
        }
    } 
    function leftCheck(){
        if(range == true && position !== 6 && position !== 12) {
            $(leftElementSelector).addClass('reveal');
        }  
    }
    function rightCheck(){
        if(range == true && position !== 5 && position !== 11) {
            $(rightElementSelector).addClass('reveal');
        }
    }
    function removeElement() {
        $(topElementSelector).removeClass('reveal');
        $(bottomElementSelector).removeClass('reveal');
        $(leftElementSelector).removeClass('reveal');
        $(rightElementSelector).removeClass('reveal');
    }
    setTimeout(removeElement, 1000);
}
function revealDiagonalCards() {
    var position = parseInt(currentCard);
    var range = position >= 0 && position < 18;
    var topLeft = parseInt(currentCard)-7;
    var topRight = parseInt(currentCard)-5;
    var bottomLeft = parseInt(currentCard)+5;
    var bottomRight = parseInt(currentCard)+7;
    var topLeftSelector = `div[position="${topLeft}"]`;
    var topRightSelector = `div[position="${topRight}"]`;
    var bottomLeftSelector = `div[position="${bottomLeft}"]`;
    var bottomRightSelector = `div[position="${bottomRight}"]`;
    leftCheck();
    rightCheck();
    function leftCheck(){
        if(range == true && position !== 6 && position !== 12) {
            $(topLeftSelector).addClass('reveal');
            $(bottomLeftSelector).addClass('reveal');
        }  
    }
    function rightCheck(){
        if(range == true && position !== 5 && position !== 11) {
            $(topRightSelector).addClass('reveal');
            $( bottomRightSelector).addClass('reveal');
        }
    }
    function removeElement() {
        $(topLeftSelector).removeClass('reveal');
        $(topRightSelector).removeClass('reveal');
        $(bottomLeftSelector).removeClass('reveal');
        $(bottomRightSelector).removeClass('reveal');
    }
    setTimeout(removeElement, 1000);
}
function revealEdgeCards() {
    addElement();
    function addElement() {
        $('div[position="0"]').addClass('reveal');
        $('div[position="6"]').addClass('reveal');
        $('div[position="12"]').addClass('reveal');
        $('div[position="5"]').addClass('reveal');
        $('div[position="11"]').addClass('reveal');
        $('div[position="17"]').addClass('reveal');
    }
    function removeElement() {
        $('div[position="0"]').removeClass('reveal');
        $('div[position="6"]').removeClass('reveal');
        $('div[position="12"]').removeClass('reveal');
        $('div[position="5"]').removeClass('reveal');
        $('div[position="11"]').removeClass('reveal');
        $('div[position="17"]').removeClass('reveal');
    }
    setTimeout(removeElement, 1000);
}

// Sounds
function heroClickSound(){
    var heroName = firstImageClick.slice(14, -4);
    switch(heroName){  
        case 'bastion': 
            heroes.bastion.clickSound.play();
            break;
        case 'brigitte': 
            heroes.brigitte.clickSound.play();
            break;
        case 'genji': 
            heroes.genji.clickSound.play();
            break;
        case 'hanzo': 
            heroes.hanzo.clickSound.play();
            break;
        case 'mei': 
            heroes.mei.clickSound.play();
            break;
        case 'mercy': 
            heroes.mercy.clickSound.play();
            break;
        case 'sombra': 
            heroes.sombra.clickSound.play();
            break;
        case 'tracer': 
            heroes.tracer.clickSound.play();
            break;
        case 'zenyatta': 
            heroes.zenyatta.clickSound.play();
            break;
    }
}
function heroMatchSound(){
    var heroName = secondImageClick.slice(14, -4);
    switch(heroName){
        case 'bastion': 
            heroes.bastion.matchSound.play();
            break;
        case 'brigitte': 
            heroes.brigitte.matchSound.play();
            break;
        case 'genji': 
            heroes.genji.matchSound.play();
            break;
        case 'hanzo': 
            heroes.hanzo.matchSound.play();
            break;
        case 'mei': 
            heroes.mei.matchSound.play();
            break;
        case 'mercy': 
            heroes.mercy.matchSound.play();
            break;
        case 'sombra': 
            heroes.sombra.matchSound.play();
            break;
        case 'tracer': 
            heroes.tracer.matchSound.play();
            break;
        case 'zenyatta': 
            heroes.zenyatta.matchSound.play();
            break;
    }
}
var bgMusic = new Audio('sounds/owlst17.mp3');    
function bgMusicPlay(){
    bgMusic.play();
    bgMusic.loop=true;
}
function bgMusicPause(){
  bgMusic.pause();
}

//Win Modal
function youWon(){
    $("#winModal").click(closeWinModal);  
}






  // function playground(){
//     var current = null;
//     for(var bob=0;bob<18;bob++){
//         $('.pos-'+(bob)).addClass('reveal');
//         var current = $('.pos-'+(bob));
//         console.log(current);
//         flipCard();
//     }
//     function flipCard(bob){
//         setTimeout(function(){
//         $('.card').removeClass('reveal');
//         }, 1000);
//     }
// }
