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
var currentCard = null;
    // Stats
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

function addClickHandlers(){
    $('#game-area').on('click', '.card', card_clicked);
    $("#splashModal").click(closeModal);
    $("#winModal").click(hideWin);
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
        $('.attemptValue').text(attempts);
        if (firstImageClick === secondImageClick) {
            currentCard = $(this).attr('position');
            powerDetection();
            heroMatchSound();
            match_counter++;
            matches ++;
            attempts++;
            $('.attemptValue').text(attempts);
            $('.accuracyValue').text(accuracy + '%');
            $(first_card_clicked).addClass('viewing');
            $(second_card_clicked).addClass('viewing');
            first_card_clicked = null;
            second_card_clicked = null;
            if (match_counter === total_possible_matches) {
                victoryPose();
                $('#winModal').removeClass('hideWinModal');
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
    $('.games-played .playedValue').text(games_played);
    $('.attempts .attemptValue').text(attempts);
    $('.accuracy .accuracyValue').text(accuracy + '%');
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
        power: 'none',
        clickSound: new Audio('sounds/bastion-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/bastion-ult.ogg'),
        victoryPose: 'images/heroes/bastion-victory.png',
        src: 'images/heroes/bastion.png'
    },
    brigitte: {
        power: 'none',
        clickSound: new Audio('sounds/brigitte-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/brigitte-ult.ogg'),
        victoryPose: 'images/heroes/brigitte-victory.png',
        src: 'images/heroes/brigitte.png'
    },
    genji: {
        power: revealDiagonalCards,
        clickSound: new Audio('sounds/genji-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/genji-ult.ogg'),
        victoryPose: 'images/heroes/genji-victory.png',
        src: 'images/heroes/genji.png'
    },
    hanzo:{
        power: revealEdgeCards,
        clickSound: new Audio('sounds/hanzo-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/hanzo-ult.ogg'),
        victoryPose: 'images/heroes/hanzo-victory.png',
        src: 'images/heroes/hanzo.png' 
    },
    mei: {
        power: revealAdjacentCards,
        clickSound: new Audio('sounds/mei-click.mp3'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/mei-ult.ogg'),
        victoryPose: 'images/heroes/mei-victory.png',
        src: 'images/heroes/mei.png'
    },
    mercy: {
        power: 'none',
        clickSound: new Audio('sounds/mercy-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/mercy-ult.ogg'),
        victoryPose: 'images/heroes/mercy-victory.png',
        src: 'images/heroes/mercy.png'
    },
    sombra: {
        power: 'none',
        clickSound: new Audio('sounds/sombra-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/sombra-ult.ogg'),
        victoryPose: 'images/heroes/sombra-victory.png',
        src: 'images/heroes/sombra.png'
    },
    tracer: {
        power: 'none',
        clickSound: new Audio('sounds/tracer-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/tracer-ult.ogg'),
        victoryPose: 'images/heroes/tracer-victory.png',
        src: 'images/heroes/tracer.png'
    },
    zenyatta: {
        power: 'none',
        clickSound: new Audio('sounds/zenyatta-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('sounds/zenyatta-ult.ogg'),
        victoryPose: 'images/heroes/zenyatta-victory.png',
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
function victoryPose(){
    var heroVictoryPoses = ['bastion', 'brigitte', 'genji', 'hanzo', 'mei', 'mercy', 'sombra', 'tracer', 'zenyatta'];
    var randomPose = heroVictoryPoses[Math.floor(Math.random() * heroVictoryPoses.length)];
    switch(randomPose){
        case 'bastion':
            $('#winModal').append(`<img src= "${heroes.bastion.victoryPose}" alt= "You Won"/>)`); 
            break;  
        case 'brigitte':
            $('#winModal').append(`<img src= "${heroes.brigitte.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'genji':
            $('#winModal').append(`<img src= "${heroes.genji.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'hanzo':
            $('#winModal').append(`<img src= "${heroes.hanzo.victoryPose}" alt= "You Won"/>)`); 
            break;  
        case 'mei':
            $('#winModal').append(`<img src= "${heroes.mei.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'mercy':
            $('#winModal').append(`<img src= "${heroes.mercy.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'sombra':
            $('#winModal').append(`<img src= "${heroes.sombra.victoryPose}" alt= "You Won"/>)`); 
            break;  
        case 'tracer':
            $('#winModal').append(`<img src= "${heroes.tracer.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'zenyatta':
            $('#winModal').append(`<img src= "${heroes.zenyatta.victoryPose}" alt= "You Won"/>)`); 
            break;
    }  
    var winner = $('<p>').text('YOU WON!');
    $('#winModal').append(winner);
}

// Hero Power Invocation
function powerDetection(){
    function removeAbility() {
        $('.abilities').text('Choose a card');
    }
    if(secondImageClick == heroes.mei.src) {
        $('.abilities').text('You\'ve triggered Mei\'s Ice Wall!');
        setTimeout(removeAbility, 4000);
        revealAdjacentCards();
    } else if(secondImageClick == heroes.genji.src) {
        $('.abilities').text('You\'ve triggered Genji\'s Dragon Blade!');
        setTimeout(removeAbility, 4000);
        revealDiagonalCards();
    } else if(secondImageClick == heroes.hanzo.src) {
        $('.abilities').text('You\'ve triggered Hanzo\'s Sonic Arrow!');
        setTimeout(removeAbility, 4000);
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
    setTimeout(removeElement, 2000);
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
        if(range == true && position !== 6 && position !== 12 && position !== 18) {
            $(topLeftSelector).addClass('reveal');
            $(bottomLeftSelector).addClass('reveal');
        }  
    }
    function rightCheck(){
        if(range == true && position !== 5 && position !== 11 && position !== 17) {
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
    setTimeout(removeElement, 2000);
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
    setTimeout(removeElement, 2000);
}

// Sounds
function heroClickSound(){
    var heroName = firstImageClick.slice(14, -4);
    switch(heroName){  
        case 'bastion': 
            if(heroes.bastion.clickSoundLimiter == false){
                heroes.bastion.clickSound.play();
                heroes.bastion.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'brigitte': 
            if(heroes.brigitte.clickSoundLimiter == false){
                heroes.brigitte.clickSound.play();
                heroes.brigitte.clickSoundLimiter = true;
            } else {
                break;
            }            
            break;
        case 'genji': 
            if(heroes.genji.clickSoundLimiter == false){
                heroes.genji.clickSound.play();
                heroes.genji.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'hanzo': 
            if(heroes.hanzo.clickSoundLimiter == false){
                heroes.hanzo.clickSound.play();
                heroes.hanzo.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'mei': 
            if(heroes.mei.clickSoundLimiter == false){
                heroes.mei.clickSound.play();
                heroes.mei.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'mercy': 
            if(heroes.mercy.clickSoundLimiter == false){
                heroes.mercy.clickSound.play();
                heroes.mercy.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'sombra': 
            if(heroes.sombra.clickSoundLimiter == false){
                heroes.sombra.clickSound.play();
                heroes.sombra.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'tracer': 
            if(heroes.tracer.clickSoundLimiter == false){
                heroes.tracer.clickSound.play();
                heroes.tracer.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'zenyatta': 
            if(heroes.zenyatta.clickSoundLimiter == false){
                heroes.zenyatta.clickSound.play();
                heroes.zenyatta.clickSoundLimiter = true;
            } else {
                break;
            }
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
function hideWin(){
    $("#winModal").addClass('hideWinModal');     
}
