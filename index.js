addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const COOKIE_NAME = "variant_id"

/**
 * Respond with a random variant webpage
 * @param {Request} resquest
 */
async function handleRequest(request) {
	const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
	const init = {
		headers: {
			'content-type':'application/json;charset=UTF-8'
		}
	}

	// Get variants from given url
	let response = await fetch(url, init)
		.then(function(response) {
			if (!response.ok){
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json()
		});
	const variants = response.variants

	// If cookie value exists, get it
	const cookie = getCookie(request, COOKIE_NAME)
	console.log(cookie)
	let index = cookie == null ? selectRandomIndex(variants.length) : cookie

	// Fetch a variant webpage
	response = await fetch(variants[index], init)

	// Set cookie if it doesn't exist & set number of seconds until the cookie expires
	if (!cookie) {
		response = new Response(response.body, response.headers)
		response.headers.append('Set-Cookie', `${COOKIE_NAME}=${index}; Max-Age=60`)
	}

	return new HTMLRewriter().on('*', new ElementHandler(index)).transform(response)
}

/**
 * Return a random integer which is 0 or 1
 * @param {integer} maxNumber
 */
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

/**
 * Customize the page with my own text and url
 * According to variants_index, it shows github link or personal website link
 * @param {element} elementTag
 * @param {integer} variants_index
 */
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
			elementTag.setInnerContent("Hello! This is my GitHub profile. You can also visit my personal website with the other variant.(FYI: I set cookie to expire in 60 seconds!)\
				Thank you and stay safe!")
		}
		else {
			elementTag.setInnerContent("Hello! This is my personal website. You can also visit my GitHub profile with the other variant.(FYI: I set cookie to expire in 60 seconds!)\
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

// Ref: https://developers.cloudflare.com/workers/templates/pages/cookie_extract/
/**
 * Grabs the cookie with name from the request headers
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to grab
 */
function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}