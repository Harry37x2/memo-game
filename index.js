const boardContainer = document.querySelector('.board-container')
const board = document.querySelector('.board')
const moves = document.querySelector('.moves')
const timer = document.querySelector('.timer')
const start = document.querySelector('.startButton')
const win = document.querySelector('.win')
const easy = document.querySelector('.lvl-easy')

let gameStarted = false;
let flippedCards = 0;
let totalFlips = 0;
let totalTime = 0;
let loop = null;

const pickRandom = (array, items) => {
    const copiedArr = [...array]
    const randomPicks = []

    for (i=0; i<items; i++) {
        const randomI = Math.floor(Math.random()*copiedArr.length)

        randomPicks.push(copiedArr[randomI])
        copiedArr.splice(randomI,1)
    }
    return randomPicks
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]
        
        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }    
    return clonedArray
}

const generateBoard = () => {
    const dimensions = board.getAttribute('data-dimension')
    if (dimensions % 2 !== 0) {
        throw new Error('Dimension of the board must be even')
    }
    
    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'];
    const picks = pickRandom(emojis, (dimensions*dimensions)/2);
    const items = shuffle([...picks, ...picks])
    const cards = `
     <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
        ${items.map((item)=>`
        <div class="card">
            <div class="card-front"></div>
            <div class="card-back">${item}</div>
        </div>
        `).join('')}
    </div>
    `
    const parser = new DOMParser().parseFromString(cards, 'text/html')
    board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    gameStarted = true
    start.classList.add('disabled')

    loop = setInterval(() => {
        totalTime++

        moves.innerText = `${totalFlips} moves`
        timer.innerText = `time: ${totalTime} sec`
    }, 1000)
}

const flipCard = card => {
    flippedCards++
    totalFlips++

    if (!gameStarted) {
        startGame()
    }

    if (flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    if (!document.querySelectorAll('.card:not(.flipped)').length) {
    setTimeout(() => {
        boardContainer.classList.add('flipped')
        win.innerHTML = `
            <span class="win-text">
                You won!<br />
                with <span class="highlight">${totalFlips}</span> moves<br />
                under <span class="highlight">${totalTime}</span> seconds
            </span>
        `

        clearInterval(loop)
    }, 1000)
}
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    flippedCards = 0
}


const attachEventListeners = () => {
    document.addEventListener('click', e => {
        const eventTarget = e.target
        const eventParent = eventTarget.parentElement

         if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

// function startEasy() {
// console.log('easy')
// }

// easy.addEventListener('click', startEasy)

generateBoard();
attachEventListeners();