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
		if (i < 20) {
			let mdOptions = {
				url: jobs[i].url,
				json: true,
				transform: (body) => cheerio.load(body)
			}
			rp(mdOptions).then(($) => {
				const markdown = $('.markdown')
				let job = {
					application_url: jobs[i].url,
					company: jobs[i].company,
					company_logo: jobs[i].company_logo,
					date: jobs[i].date,
					epoch: jobs[i].epoch,
					location: locations[Math.floor(Math.random(locations.length) * 3)],
					markdown_desc: markdown.text().replace(/\\n/g, '\n'),
					position: jobs[i].position,
					remoteok_id: jobs[i].id,
					slug: jobs[i].slug,
					tags: jobs[i].tags
				}
				mdJobs.push(job)
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
