const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')

options = { url: 'https://remoteok.io/api', json: true }
const locations = [ 'Ukraine', 'Russia', 'Remote' ]

rp(options).then((jobs) => {
	jobs = jobs.slice(1)
	getMarkdown(jobs)
})

function getMarkdown(jobs) {
	let i = 0
	const mdJobs = []
	function next() {
		if (i < jobs.length) {
			let mdOptions = {
				url: jobs[i].url,
				json: true,
				transform: (body) => cheerio.load(body)
			}
			rp(mdOptions).then(($) => {
				const markdown = $('.markdown')
				jobs[i].markdownDesc = markdown.text()
				jobs[i].location =
					locations[Math.floor(Math.random(locations.length) * 3)]
				mdJobs.push(jobs[i])
				++i
				console.log(i)
				return next()
			})
		} else {
			fs.writeFile('data.json', JSON.stringify(mdJobs, null, 2), (err) =>
				console.log('done')
			)
		}
	}
	return next()
}
