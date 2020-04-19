addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with variants
 * @param {Request} resquest
 */
async function handleRequest(request) {
	const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
	const init = {
		headers: {
			'content-type':'application/json;charset=UTF-8'
		}
	}
	let response = await fetch(url, init)
		.then(function(response) {
			if (!response.ok){
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json()
		});

	const variants = response.variants
	let index = selectRandomIndex(variants.length)

	response = await fetch(variants[index], init)
	return new HTMLRewriter().on('*', new ElementHandler(index)).transform(response)
}

function selectRandomIndex(maxNumber) {
	return Math.floor(Math.random() * maxNumber)
}

class ElementHandler {
	constructor(index) {
		this.variants_index = index
	}
	element(element) {
		// An incoming element, such as `div`
  		customizePage(element, this.variants_index)
  	}
}

function customizePage(elementTag, variants_index) {
	if (elementTag.tagName == "title"){
		elementTag.setInnerContent("Su Ji's Cloudflare Internship Application")
	}
	else if (elementTag.tagName == "h1" && elementTag.getAttribute("id") == "title"){
		elementTag.prepend("Su Ji's")
		elementTag.append("App")
	}
	else if (elementTag.tagName == "p" && elementTag.getAttribute("id") == "description") {
		if (variants_index == 0) {
			elementTag.setInnerContent("Hello! This is my GitHub profile. You can also visit my personal website with the other variant.\
				Thank you and stay safe!")
		}
		else {
			elementTag.setInnerContent("Hello! This is my personal website. You can also visit my GitHub profile with the other variant.\
				Thank you and stay safe!")
		}
	}
	else if (elementTag.tagName == "a" && elementTag.getAttribute("id") == "url") {
		if (variants_index == 0) {
			elementTag.setAttribute("href", "https://github.com/SujiKim6")
			elementTag.setInnerContent("Visit Su Ji's GitHub profile")
		}
		else {
			elementTag.setAttribute("href", "https://sujikim6.github.io/")
			elementTag.setInnerContent("Visit Su Ji's Personal website")
		}
	}
}