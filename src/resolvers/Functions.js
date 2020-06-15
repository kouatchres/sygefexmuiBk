import React from 'react'


const calcCandAve = (candScores) => {
	const aveTotal = candScores.reduce((tally, item) => tally + item.subjectAve * item.coeff, 0);
	const coeffTotal = candScores.reduce((tally, item) => (item.subjectAve === null ? tally : tally + item.coeff), 0);
	const candAve = aveTotal / coeffTotal;
	console.log(`aveTotal is = ${aveTotal}`);
	console.log(`coeffTotal is = ${coeffTotal}`);
	console.log(`ave is = ${candAve}`);
	return candAve;
};
export default {calcCandAve}