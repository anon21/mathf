
var mathf = function() {
	
	const TOKEN_EOF = 0;
	const TOKEN_OP = 1;
	const TOKEN_NUM = 2;
	const TOKEN_STR = 3;
	const TOKEN_SYM = 4;
	const TOKEN_CMD = 5;
	const TOKEN_SUB = 95; /* _ */
	const TOKEN_SUP = 94; /* ^ */
	const TOKEN_BBLK = 123; /* { */
	const TOKEN_EBLK = 125; /* } */
	
	const opTable = {
		"+-": "&plusmn;",
		"-+": "&mnplus;",
		"<=": "&lE;",
		">=": "&gE;",
		"<_": "&le;",
		">_": "&ge;",
		"+": "&plus;",
		"-": "&minus;",
		"*": "&InvisibleTimes;",
		"=": "=",
		"<": "&lt;",
		">": "&gt;",
		"(": "&lpar;",
		")": "&rpar;",
		"[": "&lsqb;",
		"]": "&rsqb;",
	};
	
	const cmdTable = {
		"frac": function(input, token) {
			return "<mfrac>" + parseBlk(input, token) + parseBlk(input, token) + "</mfrac>";
		},
		
		"bfrac": function(input, token) {
			return "<mfrac bevelled=\"true\">" + parseBlk(input, token) + 
				parseBlk(input, token) + "</mfrac>";
		},
		
		"sqrt": function(input, token) {
			return "<msqrt>" + parseBlk(input, token) + "</msqrt>";
		},
		
		"root": function(input, token) {
			var idx = parseBlk(input, token);
			
			return "<mroot>" + parseBlk(input, token) + idx + "</mroot>";
		},
		
		"func": function(input, token) {
			return "<mrow>" + parseBlk(input, token) + "<mo>&ApplyFunction;</mo></mrow>";
		},
		
		// 記号
		"cross": function(input, token) { return "<mo>&times;</mo>"; },
		"dot": function(input, token) { return "<mo>&sdot;</mo>"; },
		"div": function(input, token) { return "<mo>&divide;</mo>"; },
		"inf": function(input, token) { return "<mi>&infin;</mi>"; },
		"DD": function(input, token) { return "<mo>&DD;</mo>"; },
		"dd": function(input, token) { return "<mo>&dd;</mo>"; },
		"int": function(input, token) { return "<mo>&int;</mo>"; },
		"sum": function(input, token) { return "<mo>&sum;</mo>"; },
		
		// ギリシャ文字
		"alpha": function(input, token) { return "<mi>&alpha;</mi>"; },
		"beta": function(input, token) { return "<mi>&beta;</mi>"; },
		"delta": function(input, token) { return "<mi>&delta;</mi>"; },
		"Delta": function(input, token) { return "<mi>&Delta;</mi>"; },
		"gamma": function(input, token) { return "<mi>&gamma;</mi>"; },
		"Gamma": function(input, token) { return "<mi>&Gamma;</mi>"; },
		"epsilon": function(input, token) { return "<mi>&epsilon;</mi>"; },
		"varepsilon": function(input, token) { return "<mi>&varepsilon;</mi>"; },
		"zeta": function(input, token) { return "<mi>&zeta;</mi>"; },
		"eta": function(input, token) { return "<mi>&eta;</mi>"; },
		"theta": function(input, token) { return "<mi>&theta;</mi>"; },
		"Theta": function(input, token) { return "<mi>&Theta;</mi>"; },
		"vartheta": function(input, token) { return "<mi>&vartheta;</mi>"; },
		"iota": function(input, token) { return "<mi>&iota;</mi>"; },
		"kappa": function(input, token) { return "<mi>&kappa;</mi>"; },
		"lambda": function(input, token) { return "<mi>&lambda;</mi>"; },
		"Lambda": function(input, token) { return "<mi>&Lambda;</mi>"; },
		"mu": function(input, token) { return "<mi>&mu;</mi>"; },
		"nu": function(input, token) { return "<mi>&nu;</mi>"; },
		"xi": function(input, token) { return "<mi>&xi;</mi>"; },
		"Xi": function(input, token) { return "<mi>&Xi;</mi>"; },
		"pi": function(input, token) { return "<mi>&pi;</mi>"; },
		"Pi": function(input, token) { return "<mi>&Pi;</mi>"; },
		"varpi": function(input, token) { return "<mi>&varpi;</mi>"; },
		"rho": function(input, token) { return "<mi>&rho;</mi>"; },
		"varrho": function(input, token) { return "<mi>&varrho;</mi>"; },
		"sigma": function(input, token) { return "<mi>&sigma;</mi>"; },
		"Sigma": function(input, token) { return "<mi>&Sigma;</mi>"; },
		"varsigma": function(input, token) { return "<mi>&varsigma;</mi>"; },
		"tau": function(input, token) { return "<mi>&tau;</mi>"; },
		"upsilon": function(input, token) { return "<mi>&upsilon;</mi>"; },
		"Upsilon": function(input, token) { return "<mi>&Upsilon;</mi>"; },
		"phi": function(input, token) { return "<mi>&phi;</mi>"; },
		"varphi": function(input, token) { return "<mi>&varphi;</mi>"; },
		"Phi": function(input, token) { return "<mi>&Phi;</mi>"; },
		"chi": function(input, token) { return "<mi>&chi;</mi>"; },
		"psi": function(input, token) { return "<mi>&psi;</mi>"; },
		"Psi": function(input, token) { return "<mi>&Psi;</mi>"; },
		"omega": function(input, token) { return "<mi>&omega;</mi>"; },
		"Omega": function(input, token) { return "<mi>&Omega;</mi>"; },
		
		// 関数
		"sin": function(input, token) {
			return "<mrow><mi>sin</mi><mo>&ApplyFunction;</mo></mrow>";
		},
		
		"cos": function(input, token) {
			return "<mrow><mi>cos</mi><mo>&ApplyFunction;</mo></mrow>";
		},
		
		"tan": function(input, token) {
			return "<mrow><mi>tan</mi><mo>&ApplyFunction;</mo></mrow>";
		},
		
		"log": function(input, token) {
			return "<mrow><mi>log</mi><mo>&ApplyFunction;</mo></mrow>";
		},
		
		"ln": function(input, token) {
			return "<mrow><mi>ln</mi><mo>&ApplyFunction;</mo></mrow>";
		},
		
		"lim": function(input, token) {
			return "<mrow><mi>lim</mi><mo>&ApplyFunction;</mo></mrow>";
		},
		
		// スタイル
		"b": function(input, token) {
			return "<mstyle mathvariant=\"bold\">" + parseBlk(input, token) + "</mstyle>";
		},
		
		"i": function(input, token) {
			return "<mstyle mathvariant=\"italic\">" + parseBlk(input, token) + "</mstyle>";
		},
		
		"bi": function(input, token) {
			return "<mstyle mathvariant=\"bold-italic\">" + parseBlk(input, token) + "</mstyle>";
		},
		
		"scr": function(input, token) {
			return "<mstyle mathvariant=\"script\">" + parseBlk(input, token) + "</mstyle>";
		},
		
		"frak": function(input, token) {
			return "<mstyle mathvariant=\"fraktur\">" + parseBlk(input, token) + "</mstyle>";
		},
		
		"bb": function(input, token) {
			return "<mstyle mathvariant=\"double-struck\">" + parseBlk(input, token) + "</mstyle>";
		},
		
	};
	
	function htmlEscape(str) {
		return str.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}
	
	function skipWhiteSpace(input) {
		var m = input.src.match(/^\s+/);
		
		if( m ) {
			input.src = input.src.substr(m[0].length);
		}
	}
	
	function getToken(input, token) {
		skipWhiteSpace(input);
		
		if( input.src.length == 0 ) {
			token.type = TOKEN_EOF;
			token.val = null;
			return;
		}
		
		var m;
		
		if( m = input.src.match(/^(?:\+-|-\+|<=|>=|<_|>_|[+\-*=<>()\[\]])/) ) {
			token.type = TOKEN_OP;
			token.val = m[0];
		} else if( m = input.src.match(/^[_^{}]/) ) {
			token.type = m[0].charCodeAt(0);
			token.val = null;
		} else if( m = input.src.match(/^(?:(?:[0-9]+(?:\.[0-9]*)?)|[0-9]*\.[0-9]+)/) ) {
			token.type = TOKEN_NUM;
			token.val = m[0];
		} else if( m = input.src.match(/^[A-Za-z][A-Za-z0-9]*/) ) {
			token.type = TOKEN_SYM;
			token.val = m[0];
		} else if( m = input.src.match(/^"((?:[^"]|\\")*)"/) ) {
			token.type = TOKEN_STR;
			token.val = m[1];
		} else if( m = input.src.match(/^\\[A-Za-z][A-Za-z0-9]*/) ) {
			token.type = TOKEN_CMD;
			token.val = m[0].substr(1);
		} else {
			throw "mathf: illegal character '" + input.src[0] + "'";
		}
		
		input.src = input.src.substr(m[0].length);
	}
	
	function parsePrim(input, token, output) {
		var output = null;
		
		switch( token.type ) {
		case TOKEN_OP:
			output = "<mo>" + opTable[token.val] + "</mo>";
			getToken(input, token);
			break;
		case TOKEN_NUM:
			output = "<mn>" + token.val + "</mn>";
			getToken(input, token);
			break;
		case TOKEN_SYM:
			output = "<mi>" + token.val + "</mi>";
			getToken(input, token);
			break;
		case TOKEN_STR:
			output = "<mtext>" + htmlEscape(token.val) + "</mtext>";
			getToken(input, token);
			break;
		case TOKEN_CMD:
			var cmd = cmdTable[token.val];
			if( !cmd ) {
				throw "mathf: no such command '" + token.val + "'";
			}
			
			getToken(input, token);
			output = cmd(input, token);
			break;
		case TOKEN_BBLK:
			output = parseBlk(input, token);
			break;
		}
		
		return output;
	}
	
	function parseFactIt(input, token, output) {
		switch( token.type ) {
		case TOKEN_SUB:
			getToken(input, token);
			output += parsePrim(input, token);
			
			if( token.type == TOKEN_SUP ) {
				getToken(input, token);
				output = "<msubsup>" + output + parsePrim(input, token) + "</msubsup>";
			} else {
				output = "<msub>" + output + "</msub>";
			}
			break;
		case TOKEN_SUP:
			getToken(input, token);
			output = "<msup>" + output + parsePrim(input, token) + "</msup>";
			break;
		default:
			return output;
		}
		
		return parseFactIt(input, token, output);
	}
	
	function parseFact(input, token) {
		var output = parsePrim(input, token);
		
		return output ? parseFactIt(input, token, output) : output;
	}
	
	function parseBlk(input, token) {
		if( token.type != TOKEN_BBLK ) {
			throw "mathf: unexptected token";
		}
		
		getToken(input, token);
		
		var output = parseForm(input, token);
		
		if( token.type != TOKEN_EBLK ) {
			throw "mathf: unexptected token";
		}
		
		getToken(input, token);
		
		return "<mrow>" + output + "</mrow>";
	}
	
	function parseForm(input, token) {
		var output = "";
		var tmp;
		
		while( tmp = parseFact(input, token) ) {
			output += tmp;
		}
		
		return output;
	}
	
	return {
		interpret: function(src, disp) {
			var input = { src: src };
			var token = {};
			
			getToken(input, token);
			
			var output = parseForm(input, token);
			
			if( disp ) {
				return "<math><mstyle displaystyle=\"true\">" + output + "</mstyle></math>";
			} else {
				return "<math><mstyle displaystyle=\"false\">" + output + "</mstyle></math>";
			}
		},
		
		interpretAll: function() {
			var elems;
			
			elems = document.getElementsByClassName("mathf");
			for(var i = 0; i < elems.length; ++i) {
				elems[i].innerHTML = this.interpret(elems[i].textContent, true);
			}
		}
	};
}();
