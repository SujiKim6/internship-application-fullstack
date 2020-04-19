addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const URL = 'https://cfw-takehome.developers.workers.dev/api/variants'

/**
 * Respond with variants
 * @param {Request} resquest
 */
async function handleRequest(request) {
	const init = {
		headers: {
			'content-type':'application/json;charset=UTF-8'
		}
	}
	let response = await fetch(URL, init)
		.then(function(response) {
			if (!response.ok){
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json()
		});

	const variants = response.variants
	let index = selectRandomIndex(variants.length)

	response = await fetch(variants[index], init)
	return new HTMLRewriter().on('*', new ElementHandler()).transform(response)

	// return new Response(variants[index], init)
	// return new Response(variants, init)
}

function selectRandomIndex(maxNumber) {
	return Math.floor(Math.random() * maxNumber)
}

class ElementHandler {
  element(element) {
    // An incoming element, such as `div`
    console.log(`Incoming element: ${element.tagName}`)
  }
  comments(comment) {
    // An incoming comment
  }

  text(text) {
    // An incoming piece of text
  }
}