let startScreen = document.querySelector(".start")
let quizScreen = document.querySelector(".quiz")
let endScreen = document.querySelector(".end")
let startFrom = document.querySelector(".start form")
let answerBtns = document.querySelectorAll(".quiz__answers button")
let restartBtn = document.querySelector(".end button")
let errorEI = document.querySelector(".error")
let inpName = document.querySelector(".start input")
let quizQuestion = document.querySelector(".quiz__question")
let endTitle = document.querySelector(".end h1")
let quizCounter = document.querySelector(".quiz-counter")
let quizTimer = document.querySelector(".quiz-timer")
let table = document.querySelector(".end table")

let correctAnswFromUser
let allAnswFromUSer
let allAnswer = 10
let currentQuestion
let initialTimer
let signs = ["+", "-"]

let userName = ""
let userStats = []

startFrom.addEventListener("submit", (event) => {
	event.preventDefault()

	if (inpName.value.length >= 3) {
		userName = inpName.value
		startQuiz()
		errorEI.style.opacity = 0
	} else {
		errorEI.style.opacity = 1
	}
})

restartBtn.addEventListener("click", startQuiz)

answerBtns.forEach(btn => {
	btn.addEventListener("click", () => {
		disableBtn(true)
		if (+btn.innerHTML === currentQuestion.correctAnswer) {
			correctAnswFromUser++
			changeColor("#50E94D")
		} else {
			changeColor("#F63232")
		}
		nextQuestion()
	})
})

class Question {
	constructor() {
		this.number1 = generateNumber(30, 50)
		this.number2 = generateNumber(10, 20)
		this.sign = shuffle(signs)[0]

		if (this.sign === "+") this.correctAnswer = this.number1 + this.number2
		if (this.sign === "-") this.correctAnswer = this.number1 - this.number2

		this.allAnswer = [this.correctAnswer]

		this.max = this.correctAnswer + 5
		this.min = this.correctAnswer - 5

		while (this.allAnswer.length < 5) {
			let randomNumber = generateNumber(this.min, this.max)

			if (!this.allAnswer.includes(randomNumber)) {
				this.allAnswer.push(randomNumber)
			}
		}

		shuffle(this.allAnswer)
	}

	render() {
		quizQuestion.innerHTML = `${this.number1} ${this.sign} ${this.number2}`

		answerBtns.forEach((btn, index) => {
			btn.innerHTML = this.allAnswer[index]
		})
	}
}

function startQuiz() {
	quizScreen.classList.add("show-screen")
	endScreen.classList.remove("show-screen")
	startScreen.classList.remove("show-screen")

	correctAnswFromUser = 0
	allAnswFromUSer = 0

	generateQuestion()
}

function generateQuestion() {
	quizCounter.innerHTML = `${allAnswFromUSer + 1} / ${allAnswer}`
	currentQuestion = new Question()
	currentQuestion.render()
	startTimer()
}

function endQuiz() {
	table.innerHTML = ""
	let userInfo = { userName, correctAnswFromUser, allAnswFromUSer }
	let userIndex = userStats.findIndex(user => user.userName == userInfo.userName)

	if (userIndex >= 0) {
		userStats[userIndex] = userInfo
	} else {
		userStats.push(userInfo)
	}

	userStats.sort((a, b) => b.correctAnswFromUser - a.correctAnswFromUser)

	userStats.forEach((el, index) => {
		table.innerHTML += `<tr>
			<td class="table-number">${index + 1}</td>
			<td class="table-name">${el.userName}</td>
			<td class="table-point">${el.correctAnswFromUser}/${el.allAnswFromUSer}</td>
  		</tr>`
	})

	quizScreen.classList.remove("show-screen")
	endScreen.classList.add("show-screen")
	endTitle.innerHTML = `Вітаю Ви завершили опитування <br>і ви отримали ${correctAnswFromUser} із ${allAnswFromUSer} балів `
	saveData()
}

function saveData() {
	localStorage.setItem("matvey-quiz", JSON.stringify(userStats))
}

function getData() {
	let data = JSON.parse(localStorage.getItem("matvey-quiz"))

	if (data) {
		userStats = data
	}
}

function nextQuestion() {
	allAnswFromUSer++
	clearInterval(initialTimer)

	setTimeout(() => {
		if (allAnswFromUSer === allAnswer) {
			endQuiz()
		} else {
			generateQuestion()
		}
		disableBtn(false)
	}, 1000)
}

function changeColor(color) {
	quizScreen.style.backgroundColor = color

	setTimeout(() => { quizScreen.style.backgroundColor = "white" }, 1000)
}

function startTimer() {
	let counter = 15

	quizTimer.innerHTML = counter

	initialTimer = setInterval(() => {
		if (counter === 1) {
			quizTimer.innerHTML = 0
			changeColor("#F63232")
			nextQuestion()
		} else {
			counter--
			quizTimer.innerHTML = counter
		}
	}, 1000);
}

function generateNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

function shuffle(array) {
	return array.sort(() => Math.random() - 0.5);
}

function disableBtn(status) {
	answerBtns.forEach(Btn => {
		Btn.disabled = status
	});
}

getData()

