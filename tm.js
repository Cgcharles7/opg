function gibbs(LdaGibbs) 
{
	// initial state of the Markov chain:
	document.getElementById("output").innerHTML += "Sampling " + LdaGibbs.ITERATIONS + " iterations with alpha = " + LdaGibbs.alpha + " and beta = " + LdaGibbs.beta + ".<br>";
	LdaGibbs = resetCounts(LdaGibbs);
	LdaGibbs = firstState(LdaGibbs);
	for (var iter = 0; iter < LdaGibbs.ITERATIONS; iter++) 
	{
		// for all z_{iter}
		for (var doc = 0; doc < LdaGibbs.docWdTopAsmt.length; doc++) 
		{
			for (var word = 0; word < LdaGibbs.docWdTopAsmt[doc].length; word++) 
			{
				// (z_{iter} = z[doc][word])
				// sample from p(z_{iter}|z_-{iter}, w)
				LdaGibbs.docWdTopAsmt[doc][word] = sampleFullConditional(LdaGibbs, doc, word);
			}
		}
	}
	return LdaGibbs;
}
 
function resetCounts(LdaGibbs) 
{
	// initialise count variables.
	LdaGibbs.wdTopCnt = {};
	for (var wd = 0; wd < LdaGibbs.vocab.length; wd++)
	{
		LdaGibbs.wdTopCnt[LdaGibbs.vocab[wd]] = [];
		for (var top = 0; top < LdaGibbs.numTopics; top++)
		{
			LdaGibbs.wdTopCnt[LdaGibbs.vocab[wd]][top] = 0;
		}
	}
	LdaGibbs.docTopCnt = [];
	for (var doc = 0; doc < LdaGibbs.documents.length; doc++)
	{
		LdaGibbs.docTopCnt[doc] = [];
		for (var top = 0; top < LdaGibbs.numTopics; top++)
		{
			LdaGibbs.docTopCnt[doc][top] = 0;
		}
	}
	
	LdaGibbs.numWdsTopic = [];
	for (var top = 0; top < LdaGibbs.numTopics; top++)
	{
		LdaGibbs.numWdsTopic[top] = 0;
	}
	
	LdaGibbs.numDocsTopic = [];
	for (var doc = 0; doc < LdaGibbs.documents.length; doc++)
	{
		LdaGibbs.numDocsTopic[doc] = 0;
	}
	LdaGibbs.docWdTopAsmt = [];
	for (var doc = 0; doc < LdaGibbs.documents.length; doc++)
	{
		LdaGibbs.docWdTopAsmt[doc] = [];
	}
	
	return LdaGibbs;
}
function firstState(LdaGibbs) 
{
	for (var doc = 0; doc < LdaGibbs.documents.length; doc++)
	{
		LdaGibbs.docWdTopAsmt[doc] = [];
		for (var wd = 0; wd < LdaGibbs.documents[doc].length; wd++)
		{
			var topic = Math.floor(Math.random() * LdaGibbs.numTopics);
			LdaGibbs.docWdTopAsmt[doc][wd] = topic;
			LdaGibbs.wdTopCnt[LdaGibbs.documents[doc][wd]][topic]++;
			LdaGibbs.docTopCnt[doc][topic]++;
			LdaGibbs.numWdsTopic[topic]++;
		}
		LdaGibbs.numDocsTopic[doc] = LdaGibbs.documents[doc].length;
	}
	
	return LdaGibbs;
}
/**
 * Sample a topic z_i from the full conditional distribution: p(z_i = j |
 * z_-i, w) = (n_-i,j(w_i) + beta)/(n_-i,j(.) + W * beta) * (n_-i,j(d_i) +
 * alpha)/(n_-i,.(d_i) + K * alpha)
 * 
 * @param m
 *	document
 * @param n
 *	word
 */
function sampleFullConditional(LdaGibbs, doc, wd) 
{
	// remove z_i from the count variables
	var topic = LdaGibbs.docWdTopAsmt[doc][wd];
	
	LdaGibbs.wdTopCnt[LdaGibbs.documents[doc][wd]][topic]--;
	LdaGibbs.docTopCnt[doc][topic]--;
	LdaGibbs.numWdsTopic[topic]--;
	LdaGibbs.numDocsTopic[doc]--;
	
	// do multinomial sampling via cumulative method:
	var prob = [];
	for (var top = 0; top < LdaGibbs.numTopics; top++) 
	{
		var num1 = (LdaGibbs.wdTopCnt[LdaGibbs.documents[doc][wd]][top] + LdaGibbs.beta);
		var num2 = (LdaGibbs.docTopCnt[doc][top] + LdaGibbs.alpha);
		var den1 = (LdaGibbs.numWdsTopic[top] + LdaGibbs.vocab.length * LdaGibbs.beta);
		var den2 = (LdaGibbs.numDocsTopic[doc] + LdaGibbs.numTopics * LdaGibbs.alpha);
		prob[top] =  (num1 / den1) * (num2 / den2);
	}
	// cumulate multinomial parameters
	for (var top = 1; top < prob.length; top++) 
	{
		prob[top] += prob[top - 1];
	}
	// scaled sample because of unnormalised p[]
	var u = Math.random() * prob[LdaGibbs.numTopics - 1];
	for (topic = 0; topic < prob.length; topic++) 
	{
		if (u < prob[topic])
			break;
	}
	// add newly estimated z_i to count variables
	LdaGibbs.wdTopCnt[LdaGibbs.documents[doc][wd]][topic]++;
	LdaGibbs.docTopCnt[doc][topic]++;
	LdaGibbs.numWdsTopic[topic]++;
	LdaGibbs.numDocsTopic[doc]++;
	
	return topic;
}
/**
 * Retrieve estimated document--topic associations. If sample lag > 0 then
 * the mean value of all sampled statistics for theta[][] is taken.
 * 
 * @return theta multinomial mixture of document topics (M x K)
 */
function getTheta(LdaGibbs) 
{
	var theta = [];
	for (var doc = 0; doc < LdaGibbs.documents.length; doc++)
	{
		theta[doc] = [];
		for (var top = 0; top < LdaGibbs.numTopics; top++)
		{
			theta[doc][top] = 0;
		}
	}
	for (var doc = 0; doc < LdaGibbs.documents.length; doc++) 
	{
		for (var top = 0; top < LdaGibbs.numTopics; top++) 
		{
			theta[doc][top] = (LdaGibbs.docTopCnt[doc][top] + LdaGibbs.alpha) / (LdaGibbs.numDocsTopic[doc] + LdaGibbs.numTopics * LdaGibbs.alpha);
		}
	}
	return theta;
}
/**
 * Retrieve estimated topic--word associations. If sample lag > 0 then the
 * mean value of all sampled statistics for phi[][] is taken.
 * 
 * @return phi multinomial mixture of topic words (K x V)
 */
function getPhi(LdaGibbs) 
{
	var phi = [];
	for (var top = 0; top < LdaGibbs.numTopics; top++)
	{
		phi[top] = [];
		for (var wd = 0; wd < LdaGibbs.vocab.length; wd++)
		{
			phi[top][wd] = 0;
		}
	}
	for (var top = 0; top < LdaGibbs.numTopics; top++) 
	{
		for (var wd = 0; wd < LdaGibbs.vocab.length; wd++) 
		{
			phi[top][wd] = (LdaGibbs.wdTopCnt[LdaGibbs.vocab[wd]][top] + LdaGibbs.beta) / (LdaGibbs.numWdsTopic[top] + LdaGibbs.vocab.length * LdaGibbs.beta);
		}
	}
	return phi;
}
/**
 * Print table of multinomial data
 * 
 * @param data
 *	vector of evidence
 * @param fmax
 *	max frequency in display
 * @return the scaled histogram bin values
 */
/*function hist(data, fmax) 
{
	var hist = new Array(data.length);
	var text = "";
	var hmax = 0;
	for (var i = 0; i < data.length; i++) 
	{
		hmax = Math.max(data[i], hmax);
	}
	var shrink = fmax / hmax;
	for (var i = 0; i < data.length; i++) 
	{
		hist[i] = shrink * data[i];
	}
	var scale = "";
	for (var i = 1; i < fmax / 10 + 1; i++) 
	{
		scale += "	.	" + i % 10;
	}
	text += "x" + nf.format(hmax / fmax) + " 0" + scale + "<br>";
	for (var i = 0; i < hist.length; i++) 
	{
		text += i + " |";
		for (var j = 0; j < Math.round(hist[i]); j++) 
		{
			if ((j + 1) % 10 == 0)
			{
				text += "]";
			}
			else
			{
				text += "|";
			}
		}
		text += "<br>";
	}
	text += "<br>";
	document.getElementById("output").innerHTML += text;
}*/
/**
 * Driver with example data.
 * 
 * @param args
 */
function main(divLoc, corpus1, corpus2) 
{
	LdaGibbs = new Object();
	LdaGibbs.documents = []
	LdaGibbs.documents2 = []
	LdaGibbs.stopwords = document.getElementById("stopwds").value;
	LdaGibbs.stopwords = LdaGibbs.stopwords.split(",");
	
	LdaGibbs.vocab = [];
	LdaGibbs.wdCts = {};
	var words = [];
	
	for (var i = 0; i < corpus1.length; i++)
	{
		LdaGibbs.documents2[i] = corpus2[i];
		LdaGibbs.documents[i] = corpus1[i];
		
		while (LdaGibbs.documents[i].indexOf("") != -1)
		{
			var loc = LdaGibbs.documents[i].indexOf("");
			LdaGibbs.documents[i].splice(loc, 1);
		}
		
		for (var j = 0; j < LdaGibbs.documents[i].length; j++)
		{
			if (LdaGibbs.stopwords.indexOf(LdaGibbs.documents[i][j]) != -1)
			{
				LdaGibbs.documents[i].splice(j, 1);
			}
		}
		
		for (var j = 0; j < LdaGibbs.documents[i].length; j++)
		{
			var temp = LdaGibbs.documents[i][j];
			
			if (temp != "" && LdaGibbs.vocab.indexOf(temp) == -1)
			{
				LdaGibbs.vocab.push(temp);
				LdaGibbs.wdCts[temp] = 1;
			}
			else if (temp != "")
			{
				LdaGibbs.wdCts[temp]++;	
			}
			words.push(temp);
		}
	}
	
	LdaGibbs.numTopics = parseInt(document.getElementById("numTopics").value);
	LdaGibbs.alpha = 0.1
	LdaGibbs.beta = 0.001;
	var text = "Latent Dirichlet Allocation using Gibbs Sampling.<br>";
	LdaGibbs.ITERATIONS = parseInt(document.getElementById("iterations").value);
	LdaGibbs = gibbs(LdaGibbs);
	LdaGibbs.theta = getTheta(LdaGibbs);
	LdaGibbs.phi = getPhi(LdaGibbs);
	
	var phi2 = [];
	for (var wd = 0; wd < LdaGibbs.vocab.length; wd++)
	{
		phi2[wd] = [];
		for (var top = 0; top < LdaGibbs.numTopics; top++)
		{
			phi2[wd][top] = LdaGibbs.phi[top][wd];	
		}
	}
	
	text += "<span onclick=showHideDiv('ovrl');>Overall</span><br>";
	text += "<div id='ovrl' style='display:none'>";
	
	text += "<span onclick=showHideDiv('wdCts');>Word Counts Matrix</span><input type='button' onclick=chColor('wdCts') value='Change Colors'<br>";
	text += "<div id='wdCts' style='display:none;'>";
	text += "<table><tr><td>Word</td><td>Count</td>";
	for (var k = 0; k < LdaGibbs.numTopics; k++)
	{
		text += "<td>" + k + "</td>";	
	}
	
	var data = {};
	
	for (var i = 0; i < words.length; i++)
	{
		if (!(words[i].toLowerCase() in data))
		{
			data[words[i].toLowerCase()] = [];
			var temp = [];
			temp[0] = 1;
			temp[1] = i;
			data[words[i].toLowerCase()].push(temp);
		}
		else
		{
			var temp = [];
			temp[0] = data[words[i].toLowerCase()][data[words[i].toLowerCase()].length-1][0] + 1;
			temp[1] = i;
			data[words[i].toLowerCase()].push(temp);
		}
	}
	
	text += "<td>Entropy</td><td>Regression</td></tr><tr>";
	
	for (var j = 0; j < LdaGibbs.vocab.length; j++)
	{
		if (LdaGibbs.wdCts[LdaGibbs.vocab[j]] >= 25)
		{
			regEq = linReg(data[LdaGibbs.vocab[j].toLowerCase()]);
			var ent = 0;
			text += "<tr><td>" + LdaGibbs.vocab[j] + "</td><td>" + LdaGibbs.wdCts[LdaGibbs.vocab[j]] + "</td>";
			for (var k = 0; k < LdaGibbs.numTopics; k++)
			{
				text += "<td style='background-color:rgba(255, 0, 0, " + (LdaGibbs.phi[k][j]*100).toFixed(4) + ")'>" + (LdaGibbs.phi[k][j]*100).toFixed(4) + "</td>";
				ent += LdaGibbs.phi[k][j] * Math.log(LdaGibbs.phi[k][j]);
			}
			text += "<td>" + ent.toFixed(4) + "</td>";
			if (ent > 0.3 && LdaGibs.stopwords.indexOf(LdaGibbs.vocab[j].toLowerCase()) == -1)
			{
				LdaGibbs.stopwords.push(LdaGibbs.vocab[j].toLowerCase());
			}
			text += "<td>" + regEq[0].toFixed(4) + " + " + regEq[1].toFixed(4) + "*x</td>";
			text += "</tr>";
		}
	}
	text += "</table>";
	text += "</div>";
	
	text += "<span onclick=showHideDiv('wdDist');>Word Distance</span><input type='button' onclick=chColor('wdDist') value='Change Colors'><br>";
	text += "<div id='wdDist' style='display:none;'>";
	text += "<table>";
	var wdSim = [];
	for (var i = 0; i < LdaGibbs.vocab.length; i++)
	{
		wdSim[i] = [];
		for (var j = 0; j < i; j++)
		{
			if (j < i)
			{
				wdSim[i][j] = cosSim(phi2[i], phi2[j]).toFixed(4);	
			}
			
			if (j < i && LdaGibbs.wdCts[LdaGibbs.vocab[i]] > 2 && wdSim[i][j] >= 0.75)
			{
				text += "<tr><td>" + LdaGibbs.vocab[i] + "</td><td>" + LdaGibbs.vocab[j] + "</td><td>" + wdSim[i][j] + "</td></tr>";
			}
		}
		
		for (var k = 0; k < LdaGibbs.numTopics; k++)
		{
			if (LdaGibbs.phi[k][i] >= LdaGibbs.beta)
			{
				text += "<tr><td>" + LdaGibbs.vocab[i] + "</td><td>Topic " + k + "</td><td>1</td></tr>";
			}
		}
	}
	text += "</table>";
	text += "</div>";
	
	for (var i = 0; i < LdaGibbs.vocab.length; i++)
	{
		for (var j = i; j < LdaGibbs.vocab.length; j++)
		{
			if (j == i)
			{
				wdSim[i][j] = 1;
			}
			else
			{
				wdSim[i][j] = wdSim[j][i];
			}
		}
	}
	
	text += "<span onclick=showHideDiv('docTopMtx');>Document Topic Matrix</span><input type='button' onclick=chColor('docTopMtx') value='Change Colors'><br>";
	text += "<div id='docTopMtx' style='display:none;'>";
	text += "<table><tr><td></td>";
	for (var k = 0; k < LdaGibbs.numTopics; k++)
	{
		text += "<td>" + k + "</td>";
	}
	text += "</tr>";
	
	for (var i = 0; i < LdaGibbs.documents.length; i++)
	{
		text += "<tr><td>" + i + "</td>";
		for (var j = 0; j < LdaGibbs.numTopics; j++)
		{
			text += "<td style='background-color:rgba(255, 0, 0, " + LdaGibbs.theta[i][j].toFixed(6) + "'>" + LdaGibbs.theta[i][j].toFixed(6) + "</td>";
		}
		text += "</tr>";
	}
	text += "</table>";
	text += "</div>";
	
	text += "<span onclick=showHideDiv('stwdsTbl');>Stopwords Table</span><br>";
	text += "<div id='stwdsTbl' style='height: 300px; width: 400px; font-size: 12px; overflow: auto;'>";
	text += "<table>";
	
//	var words = document.getElementById("input").value;
//	words = words.replace(/&nbsp;/g, " ");
//	words = words.replace(/\\r/g, " ");
//	words = words.replace(/\\n/g, " ");
//	words = words.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|>|,|\.|\?|\/|\\|\||-|_|\+|=)/g, " ");
//	words = words.replace(/\s/g, " ");
//	words = words.replace(/  /g, " ");	
//	words = words.split(" ");
	
	var ans = arrCntVals(words);
	ans = arsort(ans);
	
	var ratios = [];
	var added = [];
	
	for (var i = 0; i < ans.words.length; i++)
	{
		ratios[i] = 0;
		for (var j = 0; j < LdaGibbs.documents.length; j++)
		{
			if (LdaGibbs.documents[j].indexOf(ans.words[i]) != -1)
			{
				ratios[i]++;
			}
		}
		ratios[i] /= LdaGibbs.documents.length;
		if (added.indexOf(ratios[i]) == -1 && ratios[i] != 0)
		{
			added.push(ratios[i]);
		}
	}
	
	added.sort(function(o1, o2) {return o1 < o2 ? -1 : o1 > o2 ? 1 : 0});
	
	for (var i = 0; i < added.length; i++)
	{
		var opt = document.createElement("option");
		opt.text = parseFloat(added[i].toFixed(5));
		opt.value = parseFloat(added[i]);
//		document.getElementById("minSup").add(opt);
		if (opt.value < 0.09)
		{
			opt.selected = true;
		}
	}
	
	for (var i = 0; i < ans.words.length; i++)
	{
		if (LdaGibbs.stopwords.indexOf(ans.words[i]) == -1)
		{
			text += "<tr><td id='cell_" + i + "_0' value='" + ans.words[i] + "' style='width: 200px; max-width: 200px; font-size: 12px; overflow: auto;'>" + ans.words[i] + "</td>";
			text += "<td id='cell_" + i + "_1' onClick='process(\"cell_" + i + "_1\")'>true</td></tr>";
		}
		else
		{
			text += "<tr><td id='cell_" + i + "_0' value='" + ans.words[i] + "' style='width: 200px; max-width: 200px; font-size: 12px; overflow: auto;'>" + ans.words[i] + "</td>";
			text += "<td id='cell_" + i + "_1' onClick='process(\"cell_" + i + "_1\")'>false</td></tr>";
		}
	}
	
	text += "</table></div>";
	
	var docSim = [];
	for (var i = 0; i < LdaGibbs.theta.length; i++)
	{
		docSim[i] = [];
		for (var j = 0; j < LdaGibbs.theta.length; j++)
		{
			docSim[i][j] = cosSim(LdaGibbs.theta[i], LdaGibbs.theta[j]);
		}
	}
		
	text += "<span onclick=showHideDiv('docSimMtx');>Document-Document Matrix</span><input type='button' onclick=chColor('wdDist') value='Change Colors'><br>";
	text += "<div id='docSimMtx' style='display:none;'>";
	text += "<table>";	
	for (var i = 0; i < LdaGibbs.theta.length; i++)
	{
		text += "<tr><td>" + i + "</td>";
		for (var j = 0; j < LdaGibbs.theta.length; j++)
		{
			if (docSim[i][j] >= 0.9 && i != j)
			{
				text += "<td style='background-color:rgba(255, 0, 0, " + docSim[i][j].toFixed(6) + ")'>" + j + ": " + docSim[i][j].toFixed(4) + "</td>";
			}
		}
		text += "</tr>";
	}
	text += "</table>";
	text += "</div>";
	
	text += "</div>";	
	
	text += "<span onclick=showHideDiv('topics');>Topics</span><br>";
	text += "<div id='topics' style='display:none;'>";
	
	LdaGibbs.data = [];
	LdaGibbs.asc = [];
	
	for (var i = 0; i < LdaGibbs.numTopics; i++)
	{
		text += "<span onclick=showHideDiv('div" + i + "');>Topic " + i + "</span><br>";
		text += "<div id='div" + i + "' style='display:block;'>";
		
		LdaGibbs.data[i] = "";
		LdaGibbs.asc[i] = [];
		LdaGibbs.asc[i][0] = 1;
		LdaGibbs.asc[i][1] = 1;
		LdaGibbs.asc[i][2] = 1;
		LdaGibbs.asc[i][3] = 1;
		LdaGibbs.asc[i][4] = 1;
		LdaGibbs.asc[i][5] = 1;
		LdaGibbs.asc[i][6] = 1;
		LdaGibbs.asc[i][7] = 1;
		LdaGibbs.asc[i][8] = 1;
		LdaGibbs.asc[i][9] = 1;
		LdaGibbs.asc[i][10] = 1;
		text += "<br>";
		
		text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onclick=showHideDiv('div" + i + "wc');>Word Cloud " + i + "</span><input type='button' onclick=chColor('div" + i + "wc') value='Change Colors'><br>";
		text += "<div id='div" + i + "wc'>";
		text += "</div><div style='clear:both'></div>";
		
		text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onclick=showHideDiv('div" + i + "kwds');>Topic " + i + " Keyword Ranking</span><input type='button' onclick=chColor('div" + i + "kwds') value='Change Colors'><br>";
		text += "<div id='div" + i + "kwds' style='display:none;'>";
		text += "</div>";
		
		text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onclick=showHideDiv('div" + i + "asmt');>Document Assignment Matrix " + i + "</span><input type='button' onclick=chColor('div" + i + "asmt') value='Change Colors'><br>";
		text += "<div id='div" + i + "asmt' style='display:none;'>";
		text += "<table>";
		
		text += "<tr><td></td>";
		for (var j = 0; j < LdaGibbs.numTopics; j++)
		{
			text += "<td>Topic " + j + "</td>";
		}
		text += "</tr>";
		
		for (var j = 0; j < LdaGibbs.documents.length; j++)
		{
			if (LdaGibbs.theta[j][i] >= (1 / LdaGibbs.numTopics))
			{
				text += "<tr><td>" + j + "</td>";
				for (var k = 0; k < LdaGibbs.numTopics; k++)
				{
					text += "<td style='background-color:rgba(0, 0, 255, " + LdaGibbs.theta[j][k].toFixed(6) + ")'>" + LdaGibbs.theta[j][k].toFixed(6) + "</td>";
				}
			}
			text += "</tr>";
		}
		text += "</table>";
		text += "</div>";
		
		text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onclick=showHideDiv('div" + i + "asmtWd');>Word Assignment Matrix " + i + "</span><input type='button' onclick=chColor('div" + i + "asmtWd') value='Change Colors'><br>";
		text += "<div id='div" + i + "asmtWd' style='display:none;'>";
		text += "<table>";
				
		text += "<tr><td></td>";
		for (var j = 0; j < LdaGibbs.numTopics; j++)
		{
			text += "<td>Topic " + j + "</td>";
		}
		text += "<td>Entropy</td><td>Regression</td>";
		text += "</tr>";
		
		for (var j = 0; j < LdaGibbs.vocab.length; j++)
		{
			if (LdaGibbs.phi[i][j] >= LdaGibbs.beta)
			{
				text += "<tr><td>" + LdaGibbs.vocab[j] + "</td>";
				for (var k = 0; k < LdaGibbs.numTopics; k++)
				{
					text += "<td style='background-color:rgba(0, 0,255, " + LdaGibbs.phi[k][j].toFixed(6) + ")'>" + LdaGibbs.phi[k][j].toFixed(6) + "</td>";
				}
				var regEq = linReg(data[LdaGibbs.vocab[j].toLowerCase()]);
				var ent = 0; 
				for (var k = 0; k < LdaGibbs.nuMTopics; k++)
				{
					ent -= LdaGibbs.phi[k][j] * Math.log(LdaGibbs.phi[k][j]);
				}
				text += "<td>" + ent.toFixed(4) + "</td>";
				text += "<td>" + regEq[0].toFixed(4) + " + " + regEq[1].toFixed(4) + "*x</td>";
			}
			text += "</tr>";
		}
		text += "</table>";
		text += "</div>";
		
		text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onclick=showHideDiv('div" + i + "docs');>Topic " + i + " Docs</span><input type='button' onclick=chColor('div" + i + "docs') value='Change Colors'><br>";
		text += "<div id='div" + i + "docs' style='display:none;'>";
		text += "<ul>";
		
		for (var j = 0; j < LdaGibbs.documents.length; j++)
		{
			if (LdaGibbs.theta[j][i] >= LdaGibbs.alpha)
			{
				var tmpDoc = LdaGibbs.documents2[j];
				tmpDoc = tmpDoc.replace(/&nbsp;/g, " ");
				tmpDoc = tmpDoc.replace(/\\r/g, " ");
				tmpDoc = tmpDoc.replace(/\\n/g, " ");
				tmpDoc = tmpDoc.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|>|,|\.|\?|\/|\\|\||-|_|\+|=)/g, " ");
				tmpDoc = tmpDoc.replace(/\s/g, " ");
				tmpDoc = tmpDoc.replace(/  /g, " ");
				text += "<li>";
				
				for (var wd = 0; wd < tmpDoc.length; wd++)
				{
					var locWd = LdaGibbs.vocab.indexOf(tmpDoc[wd]);
					if (LdaGibbs.phi[i][locWd] >= LdaGibbs.beta)
					{
						text += "<div style='background-color:rgb(0, 255, 0); float:left'>" + tmpDoc[wd] + "&nbsp;</div>";
					}
					else
					{
						text += "<div style='float:left'>" + tmpDoc[wd] + "&nbsp;</div>";
					}
				}
			}
		}
		text += "</ul>";
		text += "</div>";
		
		text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onclick=showHideDiv('wdDist" + i + "');>Word Distance for Topic " + i + "</span><input type='button' onclick=chColor('wdDist" + i + "') value='Change Colors'><br>";
		text += "<div id='wdDist" + i + "' style='display:none;'>";
		text += "<table width='100%'>";
		
		for (var j1 = 0; j1 < LdaGibbs.vocab.length; j1++)
		{
			if (LdaGibbs.phi[i][j1] < LdaGibbs.beta || LdaGibbs.wdCts[LdaGibbs.vocab[j1]] < 2)
			{
				continue;
			}
			for (var j2 = 0; j2 < LdaGibbs.vocab.length; j2++)
			{
				if (LdaGibbs.phi[i][j2] < LdaGibbs.beta || LdaGibbs.wdCts[LdaGibbs.vocab[j2]] < 2)
				{
					continue;
				}
				var sim = cosSim(phi2[j1], phi2[j2]);
				
				if (sim >= 0.75)
				{
					text += "<tr><td style='background-color:rgba(0, 0, 255, " + sim + ")'>" + LdaGibbs.vocab[j1] + "</td><td>" + LdaGibbs.vocab[j2] + "</td><td>" + sim.toFixed(6) + "</td></tr>";
				}
			}
		}
		text += "</table>";
		text += "</div>";
		
		text += "</div>";
	}
	text += "</div>";
	text += "<br><input type=button value='Output LDA to JSON' onclick=ldatoJson(LdaGibbs)><br>";
	
	document.getElementById(divLoc).innerHTML += text;
	
	for (var i = 0; i < LdaGibbs.numTopics; i++)
	{
		writeWC(LdaGibbs, i);
		writeKwds(LdaGibbs, i);
		markov(LdaGibbs, i);
	}
	
	return LdaGibbs;
}

async function runConjectureLDA() {
  const manifest = await (await fetch('manifest.json')).json();
  const corpus1 = []; // tokenized conjecture words
  const corpus2 = []; // original text

  for (const file of manifest) {
    const data = await (await fetch(`conjectures/${file}`)).json();
    const text = `${data.name} ${data.summary}`;
    corpus2.push(text);
    const words = text
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);
    corpus1.push(words);
  }

  // set default stopwords, iterations, and topics
  document.getElementById('stopwds').value =
    'the,of,and,to,in,a,is,for,that,by,as,with,on,from,at,are,this,be';
  document.getElementById('iterations').value = 500;
  document.getElementById('numTopics').value = 10;

  // Run LDA and output into #lda-output div
  main('lda-output', corpus1, corpus2);
}
function summarizeTopics(LdaGibbs) {
  const topWords = [];
  for (let t = 0; t < LdaGibbs.numTopics; t++) {
    const pairs = LdaGibbs.vocab.map((w, i) => [w, LdaGibbs.phi[t][i]]);
    pairs.sort((a, b) => b[1] - a[1]);
    topWords.push(pairs.slice(0, 10).map(p => p[0]));
  }
  console.log('Top words per topic:', topWords);
}
function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function getSimilarConjectures(LdaGibbs, idx, topK = 5) {
  const sims = LdaGibbs.theta.map((v, i) => ({
    i,
    sim: cosineSim(LdaGibbs.theta[idx], v)
  }));
  return sims
    .filter(x => x.i !== idx)
    .sort((a, b) => b.sim - a.sim)
    .slice(0, topK);
}
function ldatoJson(LdaGibbs) {
  const blob = new Blob([JSON.stringify(LdaGibbs)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'lda-results.json';
  a.click();
}
