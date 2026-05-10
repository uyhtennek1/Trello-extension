import './reset.css'
import './style.css'

const TRELLO_API_KEY = import.meta.env.VITE_TRELLO_KEY;
const TRELLO_TOKEN = import.meta.env.VITE_TRELLO_TOKEN;

const QUERY_LIST_ID = '69fb7677316b4d686c1a9138'

const $content = document.querySelector('#content')

async function getMirrorSourceCard(mirrorSourceId) {
  const res = await fetch(`https://api.trello.com/1/cards/${mirrorSourceId}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`)
  const card = await res.json()

  let result = card
  if (card.mirrorSourceId) {
    result = await getMirrorSourceCard(card.mirrorSourceId)
  }
  return result
}

async function main() {
  const res = await fetch(`https://api.trello.com/1/lists/${QUERY_LIST_ID}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`)
  const list = await res.json()

  if (list.length <= 0) {
    $content.textContent = 'No pending cards.'
    return;
  }

  const topCard = list[0]
  if (topCard.mirrorSourceId) {
    const mirrorSourceCard = await getMirrorSourceCard(topCard.mirrorSourceId)
    $content.textContent = mirrorSourceCard.name
  }
  else {
    $content.textContent = topCard.name
  }
}

main()
