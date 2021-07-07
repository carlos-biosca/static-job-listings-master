const jobList = document.getElementById('job-list')
const filterList = document.getElementById('filter-list')
const clearTags = document.getElementById('filter-clear')
let data = []
let tags = []

//Functions
const checkTags = (jobs, tag) => jobs.filter(job => tag === job.role || tag === job.level || job.languages.includes(tag) || job.tools.includes(tag))


const filterData = () => {
  let filteredJobs = data
  if (tags.length == 0) {
    return filteredJobs
  } else {
    for (tag of tags) {
      filteredJobs = checkTags(filteredJobs, tag)
    }
    return filteredJobs
  }
}

const drawTag = (text) => {
  const item = document.createElement('div')
  item.classList.add('filter__item')
  const tag = document.createElement('div')
  tag.classList.add('tag', 'tag--filter')
  tag.innerText = text
  item.appendChild(tag)
  const span = document.createElement('span')
  span.classList.add('tag__remove')
  item.appendChild(span)
  filterList.appendChild(item)
}

const drawCards = (data) => {
  jobList.innerHTML = ''
  const fragment = document.createDocumentFragment();
  for (card of data) {
    const newCard = document.createElement('div')
    newCard.classList.add('card')

    const header = document.createElement('div')
    header.classList.add('card__header')
    const img = document.createElement('img')
    img.classList.add('card__img')
    img.src = `./assets/images/${card.company.toLowerCase().replace(/ /g, "-").replace(".", "")}.svg`
    header.appendChild(img)
    const title = document.createElement('h2')
    title.classList.add('card__title')
    title.innerText = card.company
    header.appendChild(title)
    if (card.new) {
      const labelNew = document.createElement('span')
      labelNew.classList.add('card__label')
      labelNew.innerText = 'NEW!'
      header.appendChild(labelNew)
    }
    if (card.featured) {
      const labelFeatured = document.createElement('span')
      labelFeatured.classList.add('card__label', 'card__label--black')
      labelFeatured.innerText = 'FEATURED'
      header.appendChild(labelFeatured)
    }
    newCard.appendChild(header)

    const body = document.createElement('div')
    body.classList.add('card__body')
    const position = document.createElement('p')
    position.classList.add('card__position')
    position.innerText = card.position
    body.appendChild(position)
    const listInfo = document.createElement('ul')
    listInfo.classList.add('card__info')
    const infoCard = [card.postedAt, card.contract, card.location]
    for (info of infoCard) {
      const li = document.createElement('li')
      li.classList.add('card__job-info')
      li.innerText = info
      listInfo.appendChild(li)
    }
    body.appendChild(listInfo)
    newCard.appendChild(body)

    const footer = document.createElement('div')
    footer.classList.add('card__footer')
    const role = document.createElement('span')
    role.classList.add('tag')
    role.innerText = card.role
    footer.appendChild(role)
    const level = document.createElement('span')
    level.classList.add('tag')
    level.innerText = card.level
    footer.appendChild(level)
    for (language of card.languages) {
      const lang = document.createElement('span')
      lang.classList.add('tag')
      lang.innerText = language
      footer.appendChild(lang)
    }
    for (tech of card.tools) {
      const tool = document.createElement('span')
      tool.classList.add('tag')
      tool.innerText = tech
      footer.appendChild(tool)
    }
    newCard.appendChild(footer)
    fragment.appendChild(newCard)
  }
  jobList.appendChild(fragment)
}

const getData = async () => {
  try {
    const request = await fetch('data/data.json')
    data = await request.json()
    drawCards(data)
  } catch (e) {
    console.log('Error', e)
  }
}

//Events
jobList.addEventListener('click', (e) => {
  if (e.target.classList.contains('tag')) {
    if (!tags.includes(e.target.innerText)) {
      drawTag(e.target.innerText)
      tags.push(e.target.innerText)
      const newList = filterData()
      drawCards(newList)
    }
    if (tags.length > 0) filterList.parentElement.classList.add('filter--show')
  }
})

filterList.addEventListener('click', (e) => {
  if (e.target.classList.contains('tag__remove')) {
    e.target.parentElement.remove()
    tags = tags.filter(tag => tag !== e.target.parentElement.innerText)
    const newList = filterData()
    drawCards(newList)
    if (tags.length == 0) filterList.parentElement.classList.remove('filter--show')
  }
})

clearTags.addEventListener('click', () => {
  tags = []
  filterList.innerHTML = ''
  filterList.parentElement.classList.remove('filter--show')
  drawCards(data)
})

//Init
getData()
