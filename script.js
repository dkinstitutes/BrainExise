// getting game data from the server
let lock = 0, star;
const featch = (function () {
    async function getData() {
        const data = await fetch("https://ahmedkorim.github.io/udamemoerygame/remotedata.json");
        const list = await data.json();
        return list
    }

    return {
        getData
    }
})();
// creating cards

const cardsCreartor = (function () {

    //getting random cards
    function getCareds(cards) {
        let number = cards.length,
            randomCards = [],
            indexes = [],
            rand;
        //make sure that only a random number from 1 to cards.lenght added to the indexes array
        for (let i = 0; i < number; i++) {
            rand = Math.floor(Math.random() * number);
            if (!indexes.includes(rand) && randomCards.length <= cards.length) {
                indexes.push(rand);
                randomCards[i] = cards[rand];

            } else {
                i--
            }
        }
        return randomCards;

    }

    function eventLoeder(deck) {
        deck.addEventListener("click", function (e) {
            game.runer(e);
        })
    }

    return {
        getCards: getCareds,
        eventLoeder
    }
})(); //game data per user  take player name game type and cards from fetch api makes the html ready for drow and saves the current game state
// makeing it easy to create multiple players profiles and player can rest current level
function creatProfile(playerName, gameType, cards) {
    const data = (function (playerName, gameType, cards) {
        class gameState {
            constructor() {
                this.playerName = playerName;
                this.moves = 0;
                this.level = 0;
                this.gameType = gameType;
                this.time = {seconds: 0, minutes: 0, hours: 0};
                this.interval;
                this.deck = ui.gttingDeck();
                this.gameData;
                this.intialHtml;
                this.initialRate = document.querySelector('.stars').innerHTML;
                this.curentRate = document.querySelector(".stars").children.length;
                this.matched = 0;
            };

            addMatched() {
                this.matched += 1
            }

            levelUp() {
                this.level += 1;
            };

            addMove() {
                this.moves += 1;
                ui.moverUpdate()
            };

            timer() {
                const time = this.time;
                this.interval = setInterval(function () {
                    if (time.seconds < 59) {
                        time.seconds++
                    }
                    else if (time.seconds === 59) {
                        time.seconds = 0;
                        if (time.minutes <= 59) {
                            time.minutes++;
                        } else {
                            time.minutes = 0;
                            time.hours++;
                        }
                    }
                    ui.timerUpdate(time);
                }, 1000)
            };

            gameHtml() {
                this.gameData = this.deck.innerHTML;
            };

            sethtml(cards) { //array
                this.gameData = cards;
                cards = cards[this.gameType];
                cards = cardsCreartor.getCards(cards);
                let placeHodlder = "";
                cards.forEach(function (i) {
                    placeHodlder += i;
                })
                this.intialHtml = placeHodlder;
                console.log(placeHodlder);

            };

            rating() {
                if (this.moves / 9 > 1 && this.curentRate > 1) {
                    this.curentRate--;
                    ui.rate(this.curentRate);
                }
            };

            plusTry() {
                if (this.moves / 9 > 1 && this.curentRate <= 8) {
                    this.curentRate++;
                    star = document.createElement("li");
                    star.innerHTML = "<i class=\"fa fa-star\"></i>";
                    document.querySelector("ul").appendChild(star)
                }
            }

        }

        return ({gameState})
    })(playerName, gameType, cards);
    // // // // // // // console.log(data);
    return {data, current: null};
}

const ui = (function () { // drow and up date the ui
    function updateRate() {
        let data = document.querySelector('.stars').innerHTML;
        current.initialRate = data;
        document.querySelector('#result .stars').innerHTML = data;
    }

    document.querySelector('.restart').addEventListener('click', function () {
        ui.playAgain()
    })

    // modal
    function hideNow() {
        document.querySelector('.modal').style.transform = "translate(2000px)";
        setTimeout(function () {
            document.querySelector('#result').className = "";
        }, 600)

    }

    function showNow() {

        document.querySelector('#play-again').addEventListener('click', function () {
            ui.hideNow();
            ui.playAgain();
        });


        document.querySelector('#result').className = "active";
        document.querySelector('.modal').style.transform = "translate(0px)";

    }

    function gameOver(state) {
        ui.showNow();
    }

    function playAgain() {
        document.querySelector(".stars").innerHTML = current.initialRate;
        clearInterval(current.interval);
        lock = 0;
        current.moves = 0;
        ui.moverUpdate();
        current.level = 0;
        current.time = {seconds: 0, minutes: 0, hours: 0};
        ui.timerUpdate(current.time);
        current.interval = void 0;
        game.currentClicked=[];
        // current.gameData = void 0;
        // current.curentRate = document.querySelector(".stars").children.length;
        current.matched = 0;
        current.sethtml(current.gameData);
        ui.drow(current.intialHtml);
    }

    function rate(star) { //ramoves a star
        document.querySelector(".stars").children[star].remove()

    }

    function gttingDeck() {
        return document.querySelector(".deck");

    }

    function drow(html) {  //draw html and call event loader
        let deck = gttingDeck();
        deck.innerHTML = "";
        deck.innerHTML = html;
        document.querySelector("#player-name").innerHTML = `${current.gameType} matching `;
        const height = parseInt(getComputedStyle(document.querySelector('.card')).width.slice(0, -2));
        deck.querySelectorAll('.card').forEach(function (i) {
            i.style.height = height + "px";
        });
        cardsCreartor.eventLoeder(deck);
    }

    function moverUpdate() {
        document.querySelector(".moves").innerHTML = `Moves : ${current.moves}`
    }

    function timerUpdate(time) { // time OBJEECT
        const timer = document.querySelector('.timer span');

        let time0;

        function editTime(time) {
            time0 = Object.create(time);
            for (i in time) {
                time0[i] = time[i]
                if (time[i] < 10) {
                    time0[i] = "0" + time[i]
                    if (parseInt(time[i]) <= 0) {
                        time[i] = 0;
                    }
                    ;
                }
                ;

            }

        }

        editTime(time);
        timer.innerHTML = `${time0.hours} : ${time0.minutes} : ${time0.seconds}`
    }

    function clicked(i) {
        i.className = "card animated flipInY open show";
    }

    function correct(i) {
        i.className = "card animated match rubberBand open show";
    }

    function worong(i) {
        i.className = "card animated wrong shake open show";
    }

    return ({
        drow,
        gttingDeck,
        clicked,
        correct,
        worong,
        timerUpdate,
        moverUpdate,
        rate, showNow, hideNow, updateRate, playAgain,
        gameOver
    })
})();

const game = (function () {
    let currentClicked = [];


    // run game ui score etc
    function runer(even) {
        ui.updateRate();
        if (even.target.className === "card") {
            if(lock=== 0){
                lock=1;
                current.timer();
            }

            if (currentClicked.length <= 2) {
                fliping(even.target);
                currentClicked.push(even.target);
                if (currentClicked.length == 2) {
                    current.addMove();
                    gap(currentClicked);
                    currentClicked = [];
                }
            }
        }
    }

    function fliping(tareget) {
        ui.clicked(tareget);

    }

    function gap(currentClicked) {

        setTimeout(function () {
            judger(currentClicked)
        }, 300)// checking for correct guess

    }

    function judger(currentClicked) {
        let first = currentClicked[0].firstElementChild.className;
        let second = currentClicked[1].firstElementChild.className;
        if (first === second) {

            correctGuess(currentClicked);
        } else {

            wrongGuess(currentClicked);
        }

    }

    function correctGuess(items) {
        current.plusTry();
        current.addMatched();
        if (current.matched === 8) {
            document.querySelector('#playername').innerHTML=current.playerName;
            ui.updateRate();
            ui.showNow()
        }
        items.forEach(function (i) {
            //two items coorect match ui function
            ui.correct(i);
        })
    }

    function wrongGuess(items) {
        //two items wrong match ui function
        current.rating();
        items.forEach(function (i) {
            ui.worong(i);
            setTimeout(function () {
                i.className = "card";
            }, 800)
        })
    }

    return ({runer, wrongGuess, correctGuess, judger, gap, fliping,currentClicked })
})();


function int() {
    let gameStarter = document.querySelector(".chose");
    gameStarter.querySelectorAll(".chose-item").forEach(function (i) {
        i.addEventListener("click", function () {
            if (this.classList.contains("chose-item")) {
                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                } else {
                    if (gameStarter.querySelector(".active")) {
                        gameStarter.querySelector(".active").classList.remove("active");
                        this.classList.add("active");
                    } else {
                        this.classList.add("active");

                    }
                }
            }
        })
    });
    document.querySelector("#startTheGame").addEventListener('click', function (e) {
        let playername = document.getElementById("palyername");
        if (playername.value !== "" && gameStarter.querySelector(".active")) {
            let gameType = gameStarter.querySelector(".active").getAttribute("data-type");
            let data = featch.getData();
            data.then(function (data) {
                const gameObject = creatProfile(playername.value, gameType, data);
                gameObject.current = new gameObject.data.gameState();
                const current = gameObject.current;
                window.current = current; // make the object global
                current.sethtml(data);

                function exe() {
                    document.querySelector(".loading").style.zIndex = 50;
                    setTimeout(function () {
                        document.querySelector("#gamestarting").remove();
                        document.querySelector("main").style.display = "block";
                        ui.drow(current.intialHtml);
                    }, 2000)

                }

                exe();

            });
        } else {
            alert("make sure you enterd you name and there is a card chosed")
        }


    })

}


int();