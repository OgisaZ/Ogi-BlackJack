"use strict";
let playerNumberSelector = document.querySelector(`.player-numbers`);
let dealerNumberSelector = document.querySelector(`.dealer-numbers`);
let playerCardSum = document.querySelector(`.player-number`);
let dealerCardSum = document.querySelector(`.dealer-number`);
let winOrLossText = document.querySelector(`.win-or-loss`);
let hiddenPlace = document.querySelectorAll(`.hidden`);

//Object for Players Cards
const player = {
  FirstCard: randomNumber(),
  SecondCard: randomNumber(),
  LastCard: randomNumber(),
  Sum: 0,
};
let playerFirstCardAce = false;
let playerSecondCardAce = false;
let playerLastCardAce = false;
//Object for Dealer card
const dealer = {
  FirstCard: randomNumber(),
  SecondCard: randomNumber(),
  LastCard: randomNumber(),
  Sum: 0,
};

//Function for editing text
function textEdit(variableName, text) {
  variableName.textContent = `${text}`;
}
//Function which returns a random number
function randomNumber() {
  return Math.trunc(Math.random() * 10) + 2;
}
//Check if player won
function checkIfBlackJackWin(playerCardSum) {
  if (playerCardSum === 21) {
    document.querySelector(`.hit`).style.display = `none`;
    document.querySelector(`.stand`).style.display = `none`;
    document.querySelector(`.again`).classList.remove(`hidden`);
    return true;
  } else return false;
}
function checkIfLoss(playerCardSum) {
  if (playerCardSum > 21) {
    document.querySelector(`.hit`).style.display = `none`;

    document.querySelector(`.stand`).style.display = `none`;

    document.querySelector(`.again`).classList.remove(`hidden`);
    return true;
  } else return false;
}
function decideWinner(playerSum, dealerSum) {
  if (Number(playerSum) > Number(dealerSum))
    textEdit(winOrLossText, `PLAYER WON`);
  else if (Number(playerSum) < Number(dealerSum))
    textEdit(winOrLossText, `DEALER WON`);
  else if (Number(playerSum) === Number(dealerSum))
    textEdit(winOrLossText, `PUSH`);
}

//On START click
document.querySelector(".start").addEventListener("click", function () {
  //Removes START button and adds text for cards and sums
  document.querySelector(`.hidden-after-click`).style.display = `none`;
  for (let i = 0; i < hiddenPlace.length; i++) {
    //za svaki put kad pretisnes start da ti se pojave dugmici hit and stand
    hiddenPlace[i].classList.remove(`hidden`);
  }
  document.querySelector(`.again`).classList.add(`hidden`);
  //PLAYER pisanje
  if (player.FirstCard !== 11 && player.SecondCard !== 11) {
    textEdit(playerNumberSelector, `${player.FirstCard},${player.SecondCard}`);
    textEdit(playerCardSum, player.FirstCard + player.SecondCard);
  }
  player.Sum = player.FirstCard + player.SecondCard;
  if (player.FirstCard === 11) {
    playerFirstCardAce = true;
    textEdit(playerNumberSelector, `A,${player.SecondCard}`);
    textEdit(playerCardSum, player.FirstCard + player.SecondCard);
  }
  //Same for the second card
  if (player.SecondCard === 11) {
    playerSecondCardAce = true;
    textEdit(playerNumberSelector, `${player.FirstCard},A`);
    textEdit(playerCardSum, player.FirstCard + player.SecondCard);
  }

  //DEALER pisanje
  textEdit(dealerNumberSelector, dealer.FirstCard + `,?`);
  textEdit(dealerCardSum, dealer.FirstCard);
  if (dealer.FirstCard === 11) {
    textEdit(dealerNumberSelector, `A,?`);
  }
  //Ako si dobio 21 odmah
  if (checkIfBlackJackWin(player.FirstCard + player.SecondCard)) {
    textEdit(playerCardSum, player.FirstCard + player.SecondCard);
    textEdit(winOrLossText, `You won, Blackjack`);
  }

  if (player.FirstCard === 11 && player.SecondCard === 11) {
    textEdit(playerNumberSelector, `A,A`);
  }
});

//HIT
//take ??? on the ace system

let hitOnce = false;
//take 3

document.querySelector(`.hit`).addEventListener(`click`, function () {
  //Math is different if its the first time you hit
  //If you already hit, take the sum, a new number,get a new sum via previous sum + new card, print the RIGHT text
  if (hitOnce === true) {
    player.LastCard = randomNumber();
    player.Sum = player.Sum + player.LastCard;
    //Check if this new card is 11, if it is turn it into an A
    if (player.LastCard === 11) {
      textEdit(playerNumberSelector, `${playerNumberSelector.textContent},A`);
      playerLastCardAce = true;
      //If not just print normally
    } else {
      textEdit(
        playerNumberSelector,
        `${playerNumberSelector.textContent},${player.LastCard}`
      );
    }
    textEdit(playerCardSum, player.Sum);
    //If you didn't hit before, sum up the first,second and new card, and confirm that you have hit once already.
    //This 'else' is to check if you haven't hit before
  } else {
    //Okay, so check if players first card is 11, if it is turn it into an A
    if (player.FirstCard === 11) {
      playerFirstCardAce = true;
      textEdit(
        playerNumberSelector,
        `A,${player.SecondCard},${player.LastCard}`
      );
    }
    //Same for the second card
    if (player.SecondCard === 11) {
      playerSecondCardAce = true;
      //BUG happens if both second card and last card are 11
      if (player.LastCard === 11) {
        playerLastCardAce = true;
        textEdit(playerNumberSelector, `${player.FirstCard},A,A`);
      } else {
        textEdit(
          playerNumberSelector,
          `${player.FirstCard},A,${player.LastCard}`
        );
      }
    }
    //And samo for the last card
    if (player.LastCard === 11 && player.SecondCard !== 11) {
      textEdit(playerNumberSelector, `${playerNumberSelector.textContent},A`);
      playerLastCardAce = true;
      //And if none of these cards are 11's then just print normally.
    } else if (
      player.FirstCard !== 11 &&
      player.SecondCard !== 11 &&
      player.LastCard !== 11
    ) {
      textEdit(
        playerNumberSelector,
        `${player.FirstCard},${player.SecondCard},${player.LastCard}`
      );
    }
    //continuation of the "if you haven't hit before"
    player.Sum = player.FirstCard + player.SecondCard + player.LastCard;
    textEdit(playerCardSum, player.Sum);
    hitOnce = true;
  }
  //So if you're about to lose(>21) BUT you have an ace(if any card has a value of 11) then turn the ace into a 1
  if (playerFirstCardAce === true && player.Sum > 21) {
    player.Sum = player.Sum - 10;
    player.FirstCard = 1;
    playerFirstCardAce = false;
    textEdit(playerCardSum, player.Sum);
  }
  //Do this for the second and last card
  if (playerSecondCardAce === true && player.Sum > 21) {
    player.Sum = player.Sum - 10;
    player.SecondCard = 1;
    playerSecondCardAce = false;
    textEdit(playerCardSum, player.Sum);
  }
  if (playerLastCardAce === true && player.Sum > 21) {
    player.Sum = player.Sum - 10;
    player.LastCard = 1;
    playerLastCardAce = false;
    textEdit(playerCardSum, player.Sum);
  }

  //If you lost via card sum being above 21
  if (checkIfLoss(player.Sum)) {
    textEdit(winOrLossText, `You lost >21`);
    textEdit(dealerNumberSelector, `${dealer.FirstCard},${dealer.SecondCard}`);
    textEdit(dealerCardSum, dealer.FirstCard + dealer.SecondCard);
  }
  //If you won via card sum being exactly 21
  if (checkIfBlackJackWin(player.Sum)) {
    textEdit(winOrLossText, `You won, Blackjack`);
    textEdit(dealerNumberSelector, `${dealer.FirstCard},${dealer.SecondCard}`);
    textEdit(dealerCardSum, dealer.FirstCard + dealer.SecondCard);
  }
});

//STAND
let dealerFirstCardAce = false;
let dealerSecondCardAce = false;
let dealerLastCardAce = false;
//So when you press stand:
document.querySelector(`.stand`).addEventListener(`click`, function () {
  //Remove hit and stand buttons, add AGAIN button
  document.querySelector(`.hit`).style.display = `none`;
  document.querySelector(`.stand`).style.display = `none`;
  document.querySelector(`.again`).classList.remove(`hidden`);

  //Enter a loop, the dealer equivalent of hitting until:

  for (let i = 1; i <= 10; i++) {
    //Math is different if its the first time dealer hit
    if (i === 1) {
      dealer.Sum = dealer.FirstCard + dealer.SecondCard;
      if (dealer.FirstCard === 11) {
        dealerFirstCardAce = true;
        textEdit(dealerNumberSelector, `A,${dealer.SecondCard}`);
      }
      //Same for the second card
      if (dealer.SecondCard === 11) {
        dealerSecondCardAce = true;
        textEdit(dealerNumberSelector, `${dealer.FirstCard},A`);
      } else {
        textEdit(
          dealerNumberSelector,
          `${dealer.FirstCard},${dealer.SecondCard}`
        );
      }

      textEdit(dealerCardSum, dealer.Sum);
    }
    //If not the first hit, get a new card value, sum up the previous sum with the new card
    if (i > 1) {
      dealer.LastCard = randomNumber();
      dealer.Sum = dealer.Sum + dealer.LastCard;
      //Check if this new card is 11, if it is turn it into an A
      if (dealer.LastCard === 11) {
        textEdit(dealerNumberSelector, `${dealerNumberSelector.textContent},A`);
        dealerLastCardAce = true;
        //If not just print normally
      } else {
        textEdit(
          dealerNumberSelector,
          `${dealerNumberSelector.textContent},${dealer.LastCard}`
        );
      }
      textEdit(dealerCardSum, dealer.Sum);
    }
    //So if you're about to lose(>21) BUT you have an ace(if any card has a value of 11) then turn the ace into a 1
    if (dealerFirstCardAce === true && dealer.Sum > 21) {
      dealer.Sum = dealer.Sum - 10;
      dealer.FirstCard = 1;
      dealerFirstCardAce = false;
      textEdit(dealerCardSum, dealer.Sum);
    }
    //Do this for the second and last card
    if (dealerSecondCardAce === true && dealer.Sum > 21) {
      dealer.Sum = dealer.Sum - 10;
      dealer.SecondCard = 1;
      dealerSecondCardAce = false;
      textEdit(dealerCardSum, dealer.Sum);
    }
    if (dealerLastCardAce === true && dealer.Sum > 21) {
      dealer.Sum = dealer.Sum - 10;
      dealer.LastCard = 1;
      dealerLastCardAce = false;
      textEdit(dealerCardSum, dealer.Sum);
    }

    //Pretty self  explanatory, if dealer sum is exactly 21
    if (checkIfBlackJackWin(dealer.Sum)) {
      decideWinner(player.Sum, dealer.Sum);
      break;
    }
    //Again self explanatory, check if dealer has over 21
    if (checkIfLoss(dealer.Sum)) {
      textEdit(winOrLossText, `DEALER LOST`);
      break;
    }
    //If the dealer has a card sum thats above 17, but below 21, dealer stands. But also if dealer sum is BIGGER than player sum, but still below 21, dealer stands
    if (
      (dealer.Sum >= 17 && dealer.Sum < 21) ||
      (dealer.Sum > player.Sum && dealer.Sum < 21)
    ) {
      decideWinner(player.Sum, dealer.Sum);
      break;
    }
  }
});
//PLAY AGAIN/RESET
document.querySelector(`.again`).addEventListener(`click`, function () {
  //hello this is some testing text
  location.reload();
  //reset the values of the player
  // player.FirstCard = randomNumber();
  // player.SecondCard = randomNumber();
  // player.LastCard = randomNumber();
  // player.Sum = 0;
  // //reset the values of the dealer
  // dealer.FirstCard = randomNumber();
  // dealer.SecondCard = randomNumber();
  // dealer.LastCard = randomNumber();
  // dealer.Sum = 0;

  // document.querySelector(`.hidden-after-click`).style.display = `block`;
  // document.querySelector(`.again`).classList.add(`hidden`);
  // document.querySelector(`.hit`).classList.add(`hidden`);
  // document.querySelector(`.stand`).classList.add(`hidden`);
});
