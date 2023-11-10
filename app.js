/** Интерфейс игры
 * кнопки "старт", "играть снова"
 * затемнение поля, очистка от шаров
 */
class Interface {
	/** индикатор типа игры
	 * @type {boolean}
	 * - true - новая сгенерированная игра
	 * - false - игра создана из сохраненной игры
	 */
	static #isNewGame

	/** Экран Welcome.
	 * Обработчик для кнопки "Начать игру" */
	static screenWelcome() {
		const displayWelcome = document.querySelector('.welcome')
		const startBtn = document.querySelector('.start-btn')
		startBtn.addEventListener('click', () => {
			displayWelcome.classList.add('up')
		})
	}

	///------///
	/** Экран Settings */
	static screenSettings() {
		this.generateBtnListener()
		this.gameLoadBtnListener()
	}

	/** Обработчик для кнопки "Сгенерировать поле" */
	static generateBtnListener() {
		const displaySettings = document.querySelector('.settings')
		const generateBtn = document.querySelector('.generate-btn')
		generateBtn.addEventListener('click', () => {
			Settings.get()
			displaySettings.classList.add('up')
			this.#isNewGame = true
		})
	}

	/** Обработчик событий для кнопки "Загрузить игру" */
	static gameLoadBtnListener() {
		const displaySettings = document.querySelector('.settings')
		const gameLoadBtn = document.querySelector('.game-load-btn')
		gameLoadBtn.addEventListener('click', () => {
			if (GameSaver.load()) {
				displaySettings.classList.add('up')
				this.#isNewGame = false
			} else {
				alert('Сохраненная игра не найдена :(')
			}
		})
	}

	///------///
	/** Экран Game.
	 * Игровое поле, информационный блок */
	static screenGame() {
		const displayGame = document.querySelector('.game')

		const observer = new IntersectionObserver(entries => {
			// Отработает после того, как displayGame начнет появляться на экране
			if (entries[0].isIntersecting) {
				if (this.#isNewGame) {
					Game.start()
				}

				Game.process()
				this.menuBtnListener()
			}
		}, { threshold: 0.2 })

		observer.observe(displayGame)
	}

	/** Обработчик событий для кнопки "Меню" */
	static menuBtnListener() {
		let isClick = false
		const menuBtn = document.querySelector('.menu-btn')
		menuBtn.addEventListener('click', () => {

			if (isClick) {
				isClick = false

				this.restartBtnRemover()
				this.changeSettingsBtnRemover()
				this.gameSaveBtnRemover()

				if (InfoUpdater.freeCells !== 0) {
					this.cellsEnable()
				}

			} else {
				isClick = true

				this.cellsDisable()

				this.restartBtnCreator()
				this.changeSettingsBtnCreator()
				this.gameSaveBtnCreator()

				this.restartBtnListener()
				this.changeSettingsBtnListener()
				this.gameSaveBtnListener()
			}
		})
	}

	/** Генерирует кнопку "Рестарт" */
	static restartBtnCreator() {
		const board = document.querySelector('.board')

		const button = document.createElement('button')
		button.classList.add('btn', 'menu-drop-down-btn', 'restart-btn')
		button.innerText = 'Играть снова'

		board.append(button)
	}

	/** Обработчик событий для кнопки "Рестарт" */
	static restartBtnListener() {
		const restartBtn = document.querySelector('.restart-btn')
		restartBtn.addEventListener('click', () => {
			this.cellsEnable()
			this.ballsTotalRemover()
			restartBtn.remove()
			InfoUpdater.refresh()
			Game.start()
		})
	}

	/** Удаление кнопки "Рестарт" */
	static restartBtnRemover() {
		const restartBtn = document.querySelector('.restart-btn')
		restartBtn.remove()
	}

	/** Генерирует кнопку "Изменить настройки" */
	static changeSettingsBtnCreator() {
		const board = document.querySelector('.board')

		const button = document.createElement('button')
		button.classList.add('btn', 'menu-drop-down-btn', 'change-settings-btn')
		button.innerText = 'Изменить настройки'

		board.append(button)
	}

	/** Обработчик событий для кнопки "Изменить настройки" */
	static changeSettingsBtnListener() {
		const changeSettingsBtn = document.querySelector('.change-settings-btn')
		changeSettingsBtn.addEventListener('click', () => {
			const displaySettings = document.querySelector('.settings')
			displaySettings.classList.remove('up')
		})
	}

	/** Удаление кнопки "Изменить настройки" */
	static changeSettingsBtnRemover() {
		const changeSettingsBtn = document.querySelector('.change-settings-btn')
		changeSettingsBtn.remove()
	}

	/** Генерирует кнопку "Сохранить игру" */
	static gameSaveBtnCreator() {
		const board = document.querySelector('.board')

		const button = document.createElement('button')
		button.classList.add('btn', 'menu-drop-down-btn', 'game-save-btn')
		button.innerText = 'Сохранить игру'

		board.append(button)
	}

	/** Обработчик событий для кнопки "Сохранить игру" */
	static gameSaveBtnListener() {
		const gameSaveBtn = document.querySelector('.game-save-btn')
		gameSaveBtn.addEventListener('click', () => {
			if (GameSaver.save()) {
				alert('Игра сохранена!')
			} else {
				alert('При сохранении игры возникли ошибки :(')
			}
		})
	}

	/** Удаление кнопки "Сохранить игру" */
	static gameSaveBtnRemover() {
		const gameSaveBtn = document.querySelector('.game-save-btn')
		gameSaveBtn.remove()
	}

	/** Блокировка клеток и затемнение поля */
	static cellsDisable() {
		const cells = document.querySelectorAll('.cell')
		for (const cell of cells) {
			cell.classList.add('cell-disable')
		}
	}

	/** Активация клеток, отмена затемнения
	 *  и очистка поля от шаров */
	static cellsEnable() {
		const cells = document.querySelectorAll('.cell')
		for (const cell of cells) {
			cell.classList.remove('cell-disable')
		}
	}

	/** Полная очистка поля от шаров */
	static ballsTotalRemover() {
		const cells = document.querySelectorAll('.cell')
		for (const cell of cells) {
			let ball = cell.querySelector('.ball')
			if (ball) {
				ball.remove()
			}
		}
	}
}

/** Настройки игры */
class Settings {
	/** Размер поля от 8 до 12 строк/колонок
	 * @type {number} */
	static boardSize

	/** Количество цветов у шариков от 6 до 9
	 * @type {number} */
	static colorsCount

	/** Разрешить диагональные линии как фигуры
	 * @type {bool}
	 * - true - диагонали разрешены
	 * - false - диагонали запрещены
	*/
	static diagonalLines

	/** Передвижение шарика по диагонали
	 * @type {bool} 
	 * - true - перемещение разрешено
	 * - false - перемещение запрещено
	 */
	static diagonalMoving

	/** Количество шариков, выбрасываемых за один раз от 3 до 5
	 * @type {number} */
	static ballsCount

	/** Управление выбрасыванием шариков:
	 * @type {string}
	 * - every-moving - После каждого хода
	 * - without-figures - Если не удалось составить фигуру */
	static ballsRendering

	/** Маркировка пути шарика:
	 * @type {string}
	 * - shortest - кратчайший путь
	 * - humanoid - человеческий */
	static wayMarking


	/** Применение настроек игры */
	static get() {
		this.boardSize = this.#getBoardSize()

		this.colorsCount = this.#getColorsCount()

		this.diagonalLines = this.#getDiagonalLines()

		this.diagonalMoving = this.#getDiagonalMoving()

		this.ballsCount = this.#getBallsCount()

		this.ballsRendering = this.#getBallsRendering()

		this.wayMarking = this.#getWayMarking()

		console.log(this.boardSize, this.colorsCount, this.diagonalLines, this.diagonalMoving, this.ballsCount, this.ballsRendering, this.wayMarking)
	}

	/** Загрузка настроек из сохраненных данных
	 * @param {Obj} loadedSettings 
	 * - сохраненные настройки
	 */
	static load(loadedSettings) {
		for (const key in loadedSettings) {
			if (Object.hasOwnProperty.call(loadedSettings, key)) {
				this[key] = loadedSettings[key]
			}
		}
	}

	/** Размер поля.
	 * количество строк/колонок от 8 до 12
	 * @returns {number} */
	static #getBoardSize() {
		let value = document.querySelector('input[name="board-size"]:checked').value
		return Number(value)
	}

	/** Количество цветов для шариков от 6 до 9
	 * @returns {number} */
	static #getColorsCount() {
		let value = document.querySelector('input[name="colors-count"]:checked').value
		return Number(value)
	}

	/** Диагональные линий для фигур
	 * @returns {bool}
	 * - true - разрешены
	 * - false - запрещены
	 */
	static #getDiagonalLines() {
		let value = document.querySelector('input[name="diagonal-lines"]:checked').value
		if (value === 'true') return true
		return false
	}

	/** Перемещение шарика по диагонали
	 * @returns {bool}
	 * - true - разрешены
	 * - false - запрещены
	 */
	static #getDiagonalMoving() {
		let value = document.querySelector('input[name="diagonal-moving"]:checked').value
		if (value === 'true') return true
		return false
	}

	/** Количество выбрасываемых шариков за один раз от 3 до 5
	 * @returns {number} */
	static #getBallsCount() {
		let value = document.querySelector('input[name="balls-count"]:checked').value
		return Number(value)
	}

	/** Выбрасывание шариков
	 * @returns {string}
	 * - every-moving - После каждого хода 
	 * - without-figures - Если не удалось составить фигуру */
	static #getBallsRendering() {
		let value = document.querySelector('input[name="balls-rendering"]:checked').value
		return value
	}

	/** Маркировка пути шарика
	 * @returns {string}
	 * - shortest - кратчайший путь 
	 * - humanoid - человеческий */
	static #getWayMarking() {
		let value = document.querySelector('input[name="way-marking"]:checked').value
		return value
	}
}

/** Сохранение и загрузка сохраненной игры */
class GameSaver {
	/** Сохранение игры
	 * @returns {boolean}
	 * - true - игра сохранена
	 * - false - при сохранении возникли ошибки
	 */
	static save() {
		let storedData = {
			settings: Object.assign({}, Settings),
			info: InfoUpdater.forSave(),
			balls: BallsRender.getBallsDataArray()
		}
		let storedJson = JSON.stringify(storedData)

		localStorage.setItem('gameData', storedJson)

		// проверка сохранения
		let uploadJson = localStorage.getItem('gameData')
		let uploadData = JSON.parse(uploadJson)
		if (uploadData) {
			return true
		}
		return false
	}

	/** Загрузка игры из сохраненных данных
	 * @returns {boolean}
	 * - true - сохраненная игра найдена и загружена
	 * - false - сохраненная игра не найдена
	 */
	static load() {
		let uploadJson = localStorage.getItem('gameData')
		let uploadData = JSON.parse(uploadJson)

		if (uploadData) {
			Settings.load(uploadData.settings)
			InfoUpdater.load(uploadData.info)
			BoardRender.make()
			BallsRender.load(uploadData.balls)
			return true
		}
		return false
	}
}

/** Создание игрового поля по указанным параметрам */
class BoardRender {
	/** Генератор игровой доски */
	static make() {
		const boardSize = Settings.boardSize
		const board = document.querySelector('.board')
		board.innerHTML = ''

		for (let rowIndex = 1; rowIndex <= boardSize; rowIndex++) {
			let boardRow = this.#getBoardRow()
			let cells = this.#cellsMaker(rowIndex)
			boardRow.append(...cells)
			board.prepend(boardRow)
		}
	}

	/** Строка на игровом поле
	 * @returns {HTMLDivElement} */
	static #getBoardRow() {
		const boardRow = document.createElement('div')
		boardRow.classList.add("board-row")
		return boardRow
	}

	/** Клетка на игровом поле
	 * @returns {HTMLDivElement} */
	static #getCell() {
		const cell = document.createElement('div')
		cell.classList.add('cell')
		return cell
	}

	/** Генератор клеток
	 * @param {number} rowNumber - номер строки для вставки в атрибут data-row
	 * @returns {HTMLDivElement[]}
	 * - массив клеток для вставки в строку
	 */
	static #cellsMaker(rowNumber) {
		const boardSize = Settings.boardSize
		let cells = []
		for (let i = 1; i <= boardSize; i++) {
			let cell = this.#getCell()
			cell.setAttribute('data-row', rowNumber)
			cell.setAttribute('data-col', i)
			cells.push(cell)
		}
		return cells
	}
}

/** Обновление блока информации над игровым полем */
class InfoUpdater {
	/** количество очков
	 * @type {number}
	 */
	static scores

	/** Сложено фигур 
	 * @type {number}
	*/
	static figureComplete

	/** Ходов сделано 
	 * @type {number}
	*/
	static moves

	/** Серия успешных ходов 
	 * @type {number}
	*/
	static goodSeries

	/** Свободных клеток на поле
	 * @type {number}
	*/
	static freeCells

	/** Обновляет количество очков, сложенных фигур и совершенных ходов
	 * @param {Array<{
	 * row: number; 
	 * col: number; 
	 * block: number; 
	 * diagonalA: number;
	 * diagonalB: number; 
	 * }>} figuresArray
	 * - массив с объектами, в которых в качестве названия свойства указана фигура, а значения - количество шаров в ней
	 * @returns {{
	 * scores: number;
	 * totalFigureCounter: number;
	 * }}
	 * - scores - количество очков полученных за ход
	 * - totalFigureCounter - количество фигур сделанных за ход
	 */
	static updater(figuresArray) {
		const result = this.#scoresCounter(figuresArray)
		const seriesCount = this.#seriesUpdater(result.scores)
		this.#scoresUpdater(result.scores, seriesCount)
		this.#figureCompleteUpdater(result.totalFigureCounter)
		this.#movesUpdater()

		return result
	}

	/** Подсчитывает количество очков за совершенный ход
	 * @param {Array<{
	 * row: number; 
	 * col: number; 
	 * block: number; 
	 * diagonalA: number;
	 * diagonalB: number; 
	 * }>} figuresArray
	 * - массив с объектами, в которых в качестве названия свойства указана фигура, а значения - количество шаров в ней
	 * @returns {{scores: number; totalFigureCounter: number;}}
	 * - scores - количество очков полученных за ход
	 * - totalFigureCounter - количество фигур сделанных за ход
	 */
	static #scoresCounter(figuresArray) {
		// количество очков
		let scores = 0
		/**  счетчик на случай, если за один ход было перемещено 2 шара, и каждый из них составил какую-то фигуру */
		let goodMoveCounter = 0
		/** Общее количество составленных фигур для всех шаров */
		let totalFigureCounter = 0

		for (const figure of figuresArray) {

			if (figure.row ||
				figure.col ||
				figure.block ||
				figure.diagonalA ||
				figure.diagonalB) {
				goodMoveCounter += 1
			}

			/** счетчик составленных фигур с конкретным шаром */
			let figureCounter = 0

			// шарики в ряду
			if (figure.row) {
				figureCounter++

				scores += figure.row
				if (figure.row === 4) {
					scores += 2
				}
				if (figure.row >= 5) {
					scores += 3
				}
			}

			// шарики в колонке
			if (figure.col) {
				figureCounter++

				scores += figure.col
				if (figure.col === 4) {
					scores += 2
				}
				if (figure.col >= 5) {
					scores += 3
				}
			}

			// шарики в блоке
			if (figure.block) {
				figureCounter++
				scores += figure.block
			}

			// шарики в диагонали А
			if (figure.diagonalA) {
				figureCounter++

				scores += figure.diagonalA
				if (figure.diagonalA === 4) {
					scores += 2
				}
				if (figure.diagonalA >= 5) {
					scores += 3
				}
			}

			// шарики в диагонали Б
			if (figure.diagonalB) {
				figureCounter++

				scores += figure.diagonalB
				if (figure.diagonalB === 4) {
					scores += 2
				}
				if (figure.diagonalB >= 5) {
					scores += 3
				}
			}

			if (figureCounter === 2) scores += 7
			if (figureCounter === 3) scores += 10
			if (figureCounter === 4) scores += 15
			if (figureCounter === 5) scores += 30
			if (figureCounter > 5) scores += 50

			totalFigureCounter += figureCounter
		}

		if (goodMoveCounter === 2) {
			scores += Math.ceil(scores / 2)
		}

		return { scores, totalFigureCounter }
	}

	/** Обновляет количество очков в блоке информации
	 * @param {number} scores 
	 * - количество очков полученных за текущий ход
	 * @param {number} seriesCount
	 * - количество удачных ходов в текущей серии
	 */
	static #scoresUpdater(scores, seriesCount) {
		const scoresInfo = document.querySelector('.scores')
		let scoresCount = Number(scoresInfo.innerHTML)
		scoresCount += scores
		scoresCount += seriesCount
		scoresInfo.innerText = scoresCount

		this.scores = scoresCount
	}

	/** Обновляет количество сложенных фигур в блоке информации
	 * @param {number} figures 
	 * - количество сложенных фигур за текущий ход
	 */
	static #figureCompleteUpdater(figures) {
		const figureComplete = document.querySelector('.figure-complete')
		let figureCount = Number(figureComplete.innerHTML)
		figureCount += figures
		figureComplete.innerText = figureCount

		this.figureComplete = figureCount
	}

	/** Обновляет количество ходов */
	static #movesUpdater() {
		const moves = document.querySelector('.moves')
		let movesCount = Number(moves.innerHTML)
		movesCount += 1
		moves.innerHTML = movesCount

		this.moves = movesCount
	}

	/** Обновляет количество удачных ходов в серии
	 * @param {number} scores 
	 * - количество очков полученных за текущий ход
	 * @returns {number}
	 * - количество удачных ходов в текущей серии
	 */
	static #seriesUpdater(scores) {
		const seriesInfo = document.querySelector('.series')
		let seriesCount = 0
		if (scores > 0) {
			seriesCount = Number(seriesInfo.innerHTML)
			seriesCount += 1
		}

		seriesInfo.innerText = seriesCount
		this.goodSeries = seriesCount
		return seriesCount
	}

	/** Подсчитывает и обновляет количество пустых клеток на поле
	 * @returns {number} количество пустых клеток оставшихся на поле
	 */
	static freeCellCounter() {
		const freeCells = document.querySelector('.free-cells')

		const totalCells = document.querySelectorAll('.cell')
		const totalBall = document.querySelectorAll('.ball')

		let diff = totalCells.length - totalBall.length

		freeCells.innerHTML = diff

		this.freeCells = diff

		return diff
	}

	/** Обнуление значений в блоке информации */
	static refresh() {
		const scoresInfo = document.querySelector('.scores')
		scoresInfo.innerText = 0
		const figureComplete = document.querySelector('.figure-complete')
		figureComplete.innerText = 0
		const moves = document.querySelector('.moves')
		moves.innerText = 0
	}

	/** Подготовка данных для сохранения
	 * @returns {Obj}
	 * - подготовленные данные для сохранения в виде объекта
	 */
	static forSave() {
		let info = Object.assign({}, this)
		for (const key in info) {
			if (Object.hasOwnProperty.call(info, key)) {
				if (!info[key]) {
					info[key] = 0
				}
			}
		}
		return info
	}

	/** Загрузка данных для блока информации из сохраненных данных
	 * @param {Obj} loadedInfo 
	 * - сохраненные настройки
	 */
	static load(loadedInfo) {
		for (const key in loadedInfo) {
			if (Object.hasOwnProperty.call(loadedInfo, key)) {
				this[key] = loadedInfo[key]
			}
		}

		const scoresInfo = document.querySelector('.scores')
		scoresInfo.innerText = this.scores

		const figureComplete = document.querySelector('.figure-complete')
		figureComplete.innerText = this.figureComplete

		const moves = document.querySelector('.moves')
		moves.innerText = this.moves

		const seriesInfo = document.querySelector('.series')
		seriesInfo.innerText = this.goodSeries

		const freeCells = document.querySelector('.free-cells')
		freeCells.innerText = this.freeCells
	}
}

/** Генерирует шары на игровом поле */
class BallsRender {
	/** Основной массив с цветами */
	static #COLORS = [
		'rgb(153, 0, 0)',
		'rgb(0, 153, 0)',
		'rgb(0, 0, 153)',

		'rgb(153, 153, 0)',
		'rgb(0, 153, 153)',
		'rgb(153, 0, 153)',

		'rgb(50, 50, 50)',
		'rgb(153, 153, 153)',
		'rgb(255, 255, 255)',
	]

	/** Массив цветов для текущей игры */
	static #colorsArray = []

	/** Генерирует шары случайного цвета на свободных клетках поля,
	 * если свободных клеток меньше трех, шаров будет по количеству свободных клеток
	 * @returns {Array<Element | null>}
	 * - возвращает массив со сгенерированными шарами
	 */
	static make() {
		let cellsArray = [...document.getElementsByClassName('cell')]
		const gottenBalls = []
		this.#colorsArrayForGame()

		for (let i = 1; i <= Settings.ballsCount; i++) {
			let loopAgain = false
			do {
				if (cellsArray.length === 0) {
					break
				}

				let index = this.#getRandomNumber(0, cellsArray.length - 1)
				let cell = cellsArray[index]
				let ball = cell.querySelector('.ball')

				if (ball === null) {
					let gottenBall = this.#getBall()
					cell.append(gottenBall)
					gottenBalls.push(gottenBall)
					loopAgain = false
				} else {
					cellsArray.splice(index, 1)
					loopAgain = true
				}
			} while (loopAgain)
		}

		if (this.#makeAgain(gottenBalls)) this.make()

		return gottenBalls
	}

	/** Получить шар случайного цвета */
	static #getBall() {
		const color = this.#getRandomColor()
		const ball = document.createElement('div')
		ball.classList.add('ball')
		ball.style.background = `radial-gradient(circle at 10px 10px, ${color}, #000)`
		return ball
	}

	/** Получить случайный цвет шарика из массива colorsArray */
	static #getRandomColor() {
		const index = this.#getRandomNumber(0, this.#colorsArray.length - 1)
		return this.#colorsArray[index]
	}

	/** Генерирует массив цветов для текущей игры */
	static #colorsArrayForGame() {
		let COLORS_Copy = this.#COLORS.slice()

		for (let i = 0; i < Settings.colorsCount; i++) {
			let num = this.#getRandomNumber(0, COLORS_Copy.length - 1)
			let color = COLORS_Copy.splice(num, 1)
			this.#colorsArray.push(color[0])
		}
	}

	/** Получить случайное число в указанном диапазоне
	 * @param {number} min - минимальное число
	 * @param {number} max - максимальное число
	 * @returns {number}
	 */
	static #getRandomNumber(min, max) {
		return Math.round(Math.random() * (max - min) + min)
	}

	/** Получить общее количество шаров на поле
	 * @returns {number}
	 * - количество шаров на поле
	 */
	static #totalBallsCount() {
		const balls = document.querySelectorAll('.ball')
		return balls.length
	}

	/** Если поле было пустым и выпавшие шарики образовали фигуру
	 * @param {Array<Element | null>} balls - сгенерированные шары
	 * @returns {bool}
	 * - true - образовалась фигура, надо сгенерировать еще раз
	 * - false - фигуры нет, генерировать не требуется
	 */
	static #makeAgain(balls) {

		// Если шаров на поле больше, чем было сгенерировано 
		if (this.#totalBallsCount() > Settings.ballsCount) return false

		// в остальных случаях проверяю возможные фигуры
		FigureChecker.check(...balls)

		// если после этого на поле осталось шаров меньше 3
		if (this.#totalBallsCount() < 3) return true

		// если шаров больше 3 или 3
		return false
	}


	/** Создает массив шариков для сохранения игры
	 * @returns {Array<{
	 *  row: number,
	 *  col: number,
	 *  color: string }>}
	 */
	static getBallsDataArray() {
		const balls = document.querySelectorAll('.ball')

		let array = []

		for (const ball of balls) {
			let ballData = {
				row: ball.parentElement.dataset.row,
				col: ball.parentElement.dataset.col,
				color: ball.style.background
			}

			array.push(ballData)
		}

		return array
	}

	/** Восстанавливает шарики из сохраненной игры
	 * @param {Array<{
	 *  row: number,
	 *  col: number,
	 *  color: string }>} loadData 
	 */
	static load(loadData) {
		for (const ballData of loadData) {
			const cell = document.querySelector(`.cell[data-row="${ballData.row}"][data-col="${ballData.col}"]`)

			const ball = this.#getBall()
			ball.style.background = ballData.color
			cell.append(ball)
			console.log(ballData, cell, ball)
		}

	}
}

/** Ищет путь между клетками и помечает его */
class WayChecker {
	/** Шаг между начальной и конечной клетками
	 * @typedef {Object} Step
	 * @property {Element} cell - текущая клетка
	 * @property {Number} distance - расстояние между текущей и конечной клеткой
	 * @property {Array<Element>} way - массив клеток образующих путь от стартовой клетки поиска к текущей клетке
	*/

	/** Поиск пути от текущей кликнутой клетки к целевой клетке для перемещения шара
	 * @param {Element} activeCell - текущая клетка с шаром
	 * @param {Element} targetCell - клетка для перемещения шара
	 * @returns {Array<Element>|false}
	 * - Cells[] - путь между activeCell и targetCell
	 * - false - путь не найден
	 */
	static check(activeCell, targetCell) {
		/** Очередь шагов на проверку
		 * @type {Array<Step>} */
		const stepsQueue = []

		/** Список проверенных шагов
		 * @type {Array<Step>} */
		const stepsReady = []

		/** Путь между activeCell и targetCell
		 * @type {Array<Element>}
		 */
		let finalPath = []

		/** Шаг между начальной и конечной клетками
		 * @type {Step} */
		let step = {
			cell: activeCell,
			distance: this.#getDistanceToTarget(activeCell, targetCell),
			way: []
		}

		stepsQueue.push(step)

		let iteration = 0
		loop_while: while (stepsQueue.length > 0) {
			// защита от зависания для тестов
			iteration++
			if (iteration > 100) break

			let checkingStep = stepsQueue.shift()
			stepsReady.push(checkingStep)

			// Массив смежных клеток для проверяемой
			let cellsSet = this.#cellSetChecker(checkingStep.cell)

			loop_forOf: for (const cell of cellsSet) {
				// путь к текущей клетке от стартовой
				let path = checkingStep.way.slice()
				path.push(checkingStep.cell)

				// проверяю является ли текущая клетка конечной
				if (cell === targetCell) {
					path.push(cell)
					finalPath = path
					break loop_while
				}

				// если в клетке шар, пропускаю ее
				if (cell.querySelector('.ball')) continue loop_forOf

				step = {
					cell: cell,
					distance: this.#getDistanceToTarget(cell, targetCell),
					way: path
				}

				// Если такого шага еще нет в очереди и среди готовых, добавляю в очередь
				if (!this.#isStepInArray(step, stepsQueue) && !this.#isStepInArray(step, stepsReady)) {
					stepsQueue.push(step)
				}
			}

			if (Settings.wayMarking === 'shortest') {
				// сортирую очередь шагов по расстоянию до конечной клетки
				stepsQueue.sort((a, b) => {
					return a.distance - b.distance
				})
			}

		}

		if (finalPath.length > 0) return finalPath
		return false
	}

	/** Маркировка пути между активной и целевой клетками
	 * очистка маркеров через указанное время
	 * @param {Array<Element>} way - массив клеток полученный из метода проверяющего путь
	 * @param {number} ms - время в миллисекундах 
	*/
	static marking(way, ms) {
		this.#marksMake(way)

		setTimeout(() => {
			WayChecker.#marksClear()
		}, ms)
	}

	/** Маркировка пути между активной и целевой клетками
	 * @param {Array<Element>} way - массив клеток полученный из метода проверяющего путь
	*/
	static #marksMake(way) {
		let ball = way[0].querySelector('.ball')
		let lastCell = way.pop()
		let ballInLastCell = lastCell.querySelector('.ball')

		for (const cell of way) {
			if (cell === way[0] && ballInLastCell) {
				continue
			}

			let wayMarker = document.createElement('div')
			wayMarker.classList.add('way-marker')
			wayMarker.style.background = ball.style.background
			cell.append(wayMarker)
		}
	}

	/** Очистка маркеров пути */
	static #marksClear() {
		const markers = document.querySelectorAll('.way-marker')
		markers.forEach(marker => marker.remove())
	}

	/** Рассчитывает расстояние от текущей клетки до целевой
	 * @param {Element} currentCell - текущая клетка
	 * @param {Element} targetCell - целевая клетка
	 * @returns {Number} расстояние между клетками 
	 */
	static #getDistanceToTarget(currentCell, targetCell) {
		const currRow = Number(currentCell.dataset.row)
		const currCol = Number(currentCell.dataset.col)

		const targetRow = Number(targetCell.dataset.row)
		const targetCol = Number(targetCell.dataset.col)

		const diffRow = currRow - targetRow
		const diffCol = currCol - targetCol

		const distance = Math.sqrt(Math.pow(diffRow, 2) + Math.pow(diffCol, 2))

		return Number(distance.toFixed(2))
	}

	/** Проверяет клетки прилегающие к указанной
	 * @param {Element} cell
	 * @returns {Array<Element>}
	 * - возвращает массив с клетками
	 */
	static #cellSetChecker(cell) {
		const row = Number(cell.dataset.row)
		const col = Number(cell.dataset.col)

		let cellsSet = []
		// основные клетки
		// левая клетка
		cellsSet.push(document.querySelector(`.cell[data-row="${row}"][data-col="${col - 1}"]`))
		// правая клетка
		cellsSet.push(document.querySelector(`.cell[data-row="${row}"][data-col="${col + 1}"]`))
		// нижняя клетка
		cellsSet.push(document.querySelector(`.cell[data-row="${row - 1}"][data-col="${col}"]`))
		// верхняя клетка
		cellsSet.push(document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col}"]`))

		// если в настройках выбрано Перемещение по диагонали
		if (Settings.diagonalMoving) {
			// клетка в левом нижнем углу
			cellsSet.push(document.querySelector(`.cell[data-row="${row - 1}"][data-col="${col - 1}"]`))
			// клетка в левом верхнем углу
			cellsSet.push(document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col - 1}"]`))

			// клетка в правом нижнем углу
			cellsSet.push(document.querySelector(`.cell[data-row="${row - 1}"][data-col="${col + 1}"]`))
			// клетка в правом верхнем углу
			cellsSet.push(document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col + 1}"]`))
		}

		let result = cellsSet.filter(cellInSet => {
			if (cellInSet) return true
			return false
		})

		return result
	}

	/** Проверяет содержит ли указанный массив текущий "шаг".
	 * При нахождении, сравнивает длину пути от стартовой клетки до текущей у элемента массива и проверяемого "шага", если у "шага" путь короче, данные у элемента массива оптимизируются 
	 * 
	 * @param {Step} step 
	 * @param {Array<Step>} array
	 * 
	 * @returns {boolean}
	 * - true - если "шаг" найден
	 * - false - в противном случае
	 */
	static #isStepInArray(step, array) {
		for (const element of array) {
			if (element.cell === step.cell) {
				if (element.way.length > step.way.length) {
					element.way = step.way
				}
				return true
			}
		}
		return false
	}
}

/** Проверяет фигуры на поле и удаляет их */
class FigureChecker {
	/** Проверка наличия фигур на поле.
	 * Удаление фигур
	 * @param {Element | null} balls - один или несколько шаров для проверки
	 * @returns {Array<{
	 * row: number;
	 * col: number; 
	 * block: number;
	 * diagonalA: number; 
	 * diagonalB: number;
	 * }>}
	 * - возвращает массив с объектами, в которых в качестве свойства указана фигура, а значения - количество шаров в ней
	*/
	static check(...balls) {
		/** массив с объектами содержащий количество шаров в каждой фигуре */
		let moveResult = []
		for (const ball of balls) {
			if (!(ball && ball instanceof Element)) continue

			const ballsInRow = this.#ballsInRow(ball)
			const ballsInCol = this.#ballsInCol(ball)
			const ballsInBlock = this.#ballsInBlock(ball)

			let ballsInDiagonalA = []
			let ballsInDiagonalB = []

			// если диагонали разрешены настройками игры
			if (Settings.diagonalLines) {
				ballsInDiagonalA = this.#ballsInDiagonalA(ball)
				ballsInDiagonalB = this.#ballsInDiagonalB(ball)
			}

			/** Фигуры образованные для текущего шара */
			const ballsInFigures = {
				row: ballsInRow,
				col: ballsInCol,
				block: ballsInBlock,
				diagonalA: ballsInDiagonalA,
				diagonalB: ballsInDiagonalB
			}

			this.#remove(ballsInFigures)

			moveResult.push({
				row: ballsInRow.length,
				col: ballsInCol.length,
				block: ballsInBlock.length,
				diagonalA: ballsInDiagonalA.length,
				diagonalB: ballsInDiagonalB.length
			})

		}
		return moveResult
	}

	// #### Методы помощники #### //

	/** получить номер ряда клетки, в которой находится шар 
	 * @param {Element} ball
	 * @returns {number}
	*/
	static #getRowNumber(ball) {
		return Number(ball.parentElement.dataset.row)
	}

	/** получить номер колонки клетки, в которой находится шар 
	 * @param {Element} ball
	 * @returns {number}
	*/
	static #getColNumber(ball) {
		return Number(ball.parentElement.dataset.col)
	}

	/** Получить шар по указанным координатам
	 * @param {number} row - ряд шара 
	 * @param {number} col - колонка шара
	 * @returns { Element | null}
	 * - Element -  шар, если он есть в указанной клетке
	 * - null - если клетка пустая или не существует
	 */
	static #getBallByCoordinates(row, col) {
		const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
		if (cell) {
			return cell.querySelector('.ball')
		}
		return null
	}

	/** Сравнить цвет двух шаров
	 * @param {Element|null} currentBall - текущий шар
	 * @param {Element|null} checkBall - проверяемый шар
	 * @returns {boolean}
	 * - true - цвет шаров совпадает
	 * - false - цвета разные, либо один из шаров не существует
	 */
	static #ballsColorChecker(currentBall, checkBall) {
		if (currentBall && checkBall) {
			if (currentBall.style.background === checkBall.style.background) {
				return true
			}
		}
		return false
	}

	// #### Поиск фигур на поле #### //

	/** Проверяет одноцветные шары в ряду
	 * и возвращает массив подходящих
	 * @param {Element} ball
	 * @returns {Array<Element|null>}
	 * - массив  шаров совпадающих по цвету и примыкающих к проверяемому
	 * - пустой массив, если подходящих шаров нет
	*/
	static #ballsInRow(ball) {
		const row = this.#getRowNumber(ball)
		const col = this.#getColNumber(ball)

		/** массив для подходящих шариков */
		let rowBalls = []

		// добавление кликнутого шара
		rowBalls.push(ball)

		// шарики слева от кликнутого
		for (let i = 1; i <= Settings.boardSize; i++) {
			let ballLeft = this.#getBallByCoordinates(row, col - i)
			if (this.#ballsColorChecker(ball, ballLeft)) {
				rowBalls.push(ballLeft)
			} else {
				break
			}
		}

		// шарики справа от кликнутого
		for (let i = 1; i <= Settings.boardSize; i++) {
			let ballRight = this.#getBallByCoordinates(row, col + i)
			if (this.#ballsColorChecker(ball, ballRight)) {
				rowBalls.push(ballRight)
			} else {
				break
			}
		}

		if (rowBalls.length >= 3) return rowBalls
		return []
	}

	/** Проверяет одноцветные шары в колонке
	 * и возвращает массив подходящих
	 * @param {Element} ball
	 * @returns {Array<Element|null>}
	 * - массив  шаров совпадающих по цвету и примыкающих к проверяемому
	 * - пустой массив, если подходящих шаров нет
	*/
	static #ballsInCol(ball) {
		const row = this.#getRowNumber(ball)
		const col = this.#getColNumber(ball)

		/** массив для подходящих шариков */
		let colBalls = []

		// добавление кликнутого шара
		colBalls.push(ball)

		// шарики снизу от кликнутого
		for (let i = 1; i <= Settings.boardSize; i++) {
			let ballBottom = this.#getBallByCoordinates(row - i, col)
			if (this.#ballsColorChecker(ball, ballBottom)) {
				colBalls.push(ballBottom)
			} else {
				break
			}
		}

		// шарики сверху от кликнутого
		for (let i = 1; i <= Settings.boardSize; i++) {
			let ballTop = this.#getBallByCoordinates(row + i, col)
			if (this.#ballsColorChecker(ball, ballTop)) {
				colBalls.push(ballTop)
			} else {
				break
			}
		}

		if (colBalls.length >= 3) return colBalls
		return []
	}

	/** Проверяет одноцветные шары в блоке 2х2
	 * и возвращает массив с подходящими шарами
	 * @param {Element} ball
	 * @returns {Array<Element|null>}
	 * - массив  шаров совпадающих по цвету и примыкающих к проверяемому
	 * - пустой массив, если подходящих шаров нет
	 */
	static #ballsInBlock(ball) {
		const row = this.#getRowNumber(ball)
		const col = this.#getColNumber(ball)

		/** массив для подходящих шариков */
		let ballsInBlock = []

		// расположение шаров относительно проверяемого
		// нижний шар
		let ballBottom = this.#getBallByCoordinates(row - 1, col)
		// верхний шар
		let ballTop = this.#getBallByCoordinates(row + 1, col)

		// левый шар
		let ballLeft = this.#getBallByCoordinates(row, col - 1)
		// правый шар
		let ballRight = this.#getBallByCoordinates(row, col + 1)

		// проверка квадратов
		if (this.#ballsColorChecker(ball, ballBottom)) {
			// Если нижний шар совпал по цвету

			if (this.#ballsColorChecker(ball, ballLeft)) {
				// Если левый шар совпал по цвету
				let ballBottomLeft = this.#getBallByCoordinates(row - 1, col - 1)
				if (this.#ballsColorChecker(ball, ballBottomLeft)) {
					// Если шар по диагонали совпал по цвету
					// текущий шар сверху справа
					ballsInBlock.push(ball, ballBottom, ballLeft, ballBottomLeft)
				}
			}

			if (this.#ballsColorChecker(ball, ballRight)) {
				// Если правый шар совпал по цвету
				let ballBottomRight = this.#getBallByCoordinates(row - 1, col + 1)
				if (this.#ballsColorChecker(ball, ballBottomRight)) {
					// Если шар по диагонали совпал по цвету
					// текущий шар сверху слева
					ballsInBlock.push(ball, ballBottom, ballRight, ballBottomRight)
				}
			}
		}

		if (this.#ballsColorChecker(ball, ballTop)) {
			// Если верхний шар совпал по цвету

			if (this.#ballsColorChecker(ball, ballLeft)) {
				// Если левый шар совпал по цвету
				let ballTopLeft = this.#getBallByCoordinates(row + 1, col - 1)
				if (this.#ballsColorChecker(ball, ballTopLeft)) {
					// Если шар по диагонали совпал по цвету
					// текущий шар снизу справа
					ballsInBlock.push(ball, ballTop, ballLeft, ballTopLeft)
				}
			}

			if (this.#ballsColorChecker(ball, ballRight)) {
				// Если правый шар совпал по цвету
				let ballTopRight = this.#getBallByCoordinates(row + 1, col + 1)
				if (this.#ballsColorChecker(ball, ballTopRight)) {
					// Если шар по диагонали совпал по цвету
					// текущий шар снизу слева
					ballsInBlock.push(ball, ballTop, ballRight, ballTopRight)
				}
			}
		}

		return ballsInBlock
	}

	/** Проверяет одноцветные шары в диагонали А:
	 * направление из нижнего левого угла в правый верхний.
	 * Возвращает массив подходящих шаров
	 * @param {Element} ball
	 * @returns {Array<Element|null>}
	 * - массив  шаров совпадающих по цвету и примыкающих к проверяемому
	 * - пустой массив, если подходящих шаров нет
	*/
	static #ballsInDiagonalA(ball) {
		const row = this.#getRowNumber(ball)
		const col = this.#getColNumber(ball)

		/** массив для подходящих шариков */
		let diagonalA = []

		// добавление кликнутого шара
		diagonalA.push(ball)

		// диагональ влево и вниз
		for (let i = 1; i <= Settings.boardSize; i++) {
			let ballLeftBottom = this.#getBallByCoordinates(row - i, col - i)
			if (this.#ballsColorChecker(ball, ballLeftBottom)) {
				diagonalA.push(ballLeftBottom)
			} else {
				break
			}
		}

		//диагональ вправо и вверх
		for (let i = 1; i <= Settings.boardSize; i++) {
			let ballRightTop = this.#getBallByCoordinates(row + i, col + i)
			if (this.#ballsColorChecker(ball, ballRightTop)) {
				diagonalA.push(ballRightTop)
			} else {
				break
			}
		}

		if (diagonalA.length >= 3) return diagonalA
		return []
	}

	/** Проверяет одноцветные шары в диагонали Б:
	 * направление из верхнего левого угла в правый нижний.
	 * Возвращает массив подходящих шаров
	 * @param {Element} ball
	 * @returns {Array<Element|null>}
	 * - массив  шаров совпадающих по цвету и примыкающих к проверяемому
	 * - пустой массив, если подходящих шаров нет
	*/
	static #ballsInDiagonalB(ball) {
		const row = this.#getRowNumber(ball)
		const col = this.#getColNumber(ball)

		/** массив для подходящих шариков */
		let diagonalB = []

		// добавление кликнутого шара
		diagonalB.push(ball)

		//диагональ влево и вверх
		for (let i = 1; i <= Settings.boardSize; i++) {
			let ballLeftTop = this.#getBallByCoordinates(row + i, col - i)
			if (this.#ballsColorChecker(ball, ballLeftTop)) {
				diagonalB.push(ballLeftTop)
			} else {
				break
			}
		}

		// диагональ вправо и вниз
		for (let i = 1; i <= Settings.boardSize; i++) {
			let ballRightBottom = this.#getBallByCoordinates(row - i, col + i)
			if (this.#ballsColorChecker(ball, ballRightBottom)) {
				diagonalB.push(ballRightBottom)
			} else {
				break
			}
		}

		if (diagonalB.length >= 3) return diagonalB
		return []
	}

	// #### Удаление шаров #### //

	/** Подготавливает шары для удаления,
	 * удаляет одинаковые шары из фигур,
	 * создает массив шаров
	 * @param {{
	 * row: (Element | null)[];
	 * col: (Element | null)[];
	 * block: (Element | null)[]; 
	 * diagonalA: (Element | null)[]; 
	 * diagonalB: (Element | null)[]; 
	 * }} figuresObject	
	 * @returns {Array<Element | null>}
	 */
	static #ballsRemovePreparing(figuresObject) {
		let ballsForRemove = []

		for (const key in figuresObject) {
			if (Object.hasOwnProperty.call(figuresObject, key)) {
				for (const ball of figuresObject[key]) {
					if (!ballsForRemove.includes(ball)) {
						ballsForRemove.push(ball)
					}
				}
			}
		}

		return ballsForRemove
	}

	/** Удаляет с поля шары
	 * @param {{
	 * row: (Element | null)[];
	 * col: (Element | null)[];
	 * block: (Element | null)[]; 
	 * diagonalA: (Element | null)[]; 
	 * diagonalB: (Element | null)[]; 
	 * }} figuresObject
	*/
	static #remove(figuresObject) {
		let balls = this.#ballsRemovePreparing(figuresObject)
		for (const ball of balls) {
			ball.remove()
		}
	}
}

/** Основной класс игры */
class Game {
	/** Начало игры.
	 * Выбрасывание первых шариков */
	static start() {

		BoardRender.make()

		BallsRender.make()

		InfoUpdater.freeCellCounter()
	}

	/** Процесс игры. 
	 * Отслеживание нажатия на клетки поля, 
	 * перемещение шариков, удаление фигур, 
	 * обновление информации */
	static process() {
		const cells = document.querySelectorAll('.cell')
		/** Кликнутая клетка с шаром
		 * @type {Element} */
		let activeCell = ''
		/** шар в кликнутой клетке 
		 * @type {Element} */
		let activeBall = ''
		// добавление слушателя событий для всех клеток
		for (const targetCell of cells) {
			targetCell.addEventListener('click', () => {
				/** шар в целевой клетке */
				let targetBall = targetCell.querySelector('.ball')
				// если активной клетки нет
				if (!activeCell) {
					// если в целевой клетке есть шар, делаю клетку активной
					if (targetBall) {
						activeCell = targetCell
						activeBall = targetBall
						activeBall.classList.add('active-ball')
					}
					// если активная клетка уже есть 
				} else {
					/** клетки между activeCell, targetCell */
					let way = WayChecker.check(activeCell, targetCell)

					if (way && activeCell !== targetCell) {
						// если путь найден и клетки разные

						if (targetBall) {
							// если в целевой клетке уже есть шар
							if (activeBall.style.background !== targetBall.style.background) {
								// если шары разного цвета
								WayChecker.marking(way, 500)
								targetCell.append(activeBall)
								activeCell.append(targetBall)

								this.#moveHandler(activeBall, targetBall)
							}

						} else {
							// если клетка пустая
							WayChecker.marking(way, 500)
							targetCell.append(activeBall)

							this.#moveHandler(activeBall, targetBall)
						}

					} else {
						// если путь к целевой клетке не найден
						targetCell.style.background = 'red'
						setTimeout(() => {
							targetCell.style.background = ''
						}, 300)
					}

					activeBall.classList.remove('active-ball')
					activeCell = ''
					activeBall = ''
				}
			})
		}
	}

	/** При завершении игры затеняет игровое поле,
	 * показывает кнопки: "Играть снова", "Изменить настройки" */
	static finish() {
		Interface.cellsDisable()
		alert('Игра завершена!')
	}

	/** Устанавливает задержку перед дальнейшим выполнением скрипта
	 * @param {number} ms - длительность задержки в миллисекундах
	 * @returns {Promise}
	*/
	static #delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}


	/** Обработчик хода:
	 * проверка составленных фигур,
	 * обновление очков,
	 * добавление новых шаров
	 * @param {Element | null} activeBall - активный шар
	 * @param {Element | null} targetBall - целевой шар
	 */
	static async #moveHandler(activeBall, targetBall) {

		//задержка 600 миллисекунд
		await this.#delay(600)
		// проверка фигур на поле, удаление шариков
		let figureComplete = FigureChecker.check(activeBall, targetBall)
		// обновление информации
		let result = InfoUpdater.updater(figureComplete)


		if (!(Settings.ballsRendering === 'without-figures' && result.scores > 0)) {
			await this.#delay(300)
			let ballsFromRender = BallsRender.make()
			FigureChecker.check(...ballsFromRender)
		}

		if (InfoUpdater.freeCellCounter() <= 0) {
			Game.finish()
		}
	}
}

// Экраны игры
Interface.screenWelcome()
Interface.screenSettings()
Interface.screenGame()