const text =
	'#Salary\nFlexibly around £60k\n\t\n\n#Location\n- Europe (+/- 3h from GMT)# How do you apply?\t* Apply'

console.log(text.replace(/((#)(\w))/g, '$2 $3'))
