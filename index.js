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
	const response = await fetch(url, init)
		.then(function(response) {
			if (!response.ok){
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json()
		});
	// console.log(response)
	const variants = response.variants


	return new Response(variants, init.headers)
}