parserGram = (function(){
  
  var result = {
    parse: function(input, startRule) {
      var parseFunctions = {
        "colchete": parse_colchete,
        "colcheteA": parse_colcheteA,
        "colcheteC": parse_colcheteC,
        "integer": parse_integer,
        "multiplicacion": parse_multiplicacion,
        "por": parse_por,
        "porciento": parse_porciento,
        "potencia": parse_potencia,
        "primary": parse_primary,
        "rango": parse_rango,
        "resta": parse_resta,
        "start": parse_start,
        "suma": parse_suma
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Nombre de regla inv&aacute;lida: " + quote(startRule) + ".");
        }
      } else {
        startRule = "start";
      }
      
      var pos = 0;
      var reportMatchFailures = true;
      var rightmostMatchFailuresPos = 0;
      var rightmostMatchFailuresExpected = [];
      var cache = {};
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        
        if (charCode <= 0xFF) {
          var escapeChar = 'x';
          var length = 2;
        } else {
          var escapeChar = 'u';
          var length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function quote(s) {
        /*
         * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
         * string literal except for the closing quote character, backslash,
         * carriage return, line separator, paragraph separator, and line feed.
         * Any character may appear in the form of an escape sequence.
         */
        return '"' + s
          .replace(/\\/g, '\\\\')            // backslash
          .replace(/"/g, '\\"')              // closing quote character
          .replace(/\r/g, '\\r')             // carriage return
          .replace(/\n/g, '\\n')             // line feed
          .replace(/[\x80-\uFFFF]/g, escape) // non-ASCII characters
          + '"';
      }
      
      function matchFailed(failure) {
        if (pos < rightmostMatchFailuresPos) {
          return;
        }
        
        if (pos > rightmostMatchFailuresPos) {
          rightmostMatchFailuresPos = pos;
          rightmostMatchFailuresExpected = [];
        }
        
        rightmostMatchFailuresExpected.push(failure);
      }
      
      function parse_start() {
        var cacheKey = 'start@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var result3 = parse_suma();
        if (result3 !== null) {
          var result0 = result3;
        } else {
          var result2 = parse_rango();
          if (result2 !== null) {
            var result0 = result2;
          } else {
            var result1 = parse_integer();
            if (result1 !== null) {
              var result0 = result1;
            } else {
              var result0 = null;;
            };
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_rango() {
        var cacheKey = 'rango@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var savedPos1 = pos;
        var result3 = parse_colcheteA();
        if (result3 !== null) {
          var result4 = parse_integer();
          if (result4 !== null) {
            if (input.substr(pos, 1) === "-") {
              var result5 = "-";
              pos += 1;
            } else {
              var result5 = null;
              if (reportMatchFailures) {
                matchFailed("\"-\"");
              }
            }
            if (result5 !== null) {
              var result6 = parse_integer();
              if (result6 !== null) {
                var result7 = parse_colcheteC();
                if (result7 !== null) {
                  var result1 = [result3, result4, result5, result6, result7];
                } else {
                  var result1 = null;
                  pos = savedPos1;
                }
              } else {
                var result1 = null;
                pos = savedPos1;
              }
            } else {
              var result1 = null;
              pos = savedPos1;
            }
          } else {
            var result1 = null;
            pos = savedPos1;
          }
        } else {
          var result1 = null;
          pos = savedPos1;
        }
        var result2 = result1 !== null
          ? (function(izq, der) {return izq-der;})(result1[0], result1[3])
          : null;
        if (result2 !== null) {
          var result0 = result2;
        } else {
          var result0 = null;
          pos = savedPos0;
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_colcheteA() {
        var cacheKey = 'colcheteA@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        if (input.substr(pos, 1) === "[") {
          var result2 = "[";
          pos += 1;
        } else {
          var result2 = null;
          if (reportMatchFailures) {
            matchFailed("\"[\"");
          }
        }
        if (result2 !== null) {
          var result0 = result2;
        } else {
          if (input.substr(pos, 2) === " [") {
            var result1 = " [";
            pos += 2;
          } else {
            var result1 = null;
            if (reportMatchFailures) {
              matchFailed("\" [\"");
            }
          }
          if (result1 !== null) {
            var result0 = result1;
          } else {
            var result0 = null;;
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_colcheteC() {
        var cacheKey = 'colcheteC@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        if (input.substr(pos, 1) === "]") {
          var result2 = "]";
          pos += 1;
        } else {
          var result2 = null;
          if (reportMatchFailures) {
            matchFailed("\"]\"");
          }
        }
        if (result2 !== null) {
          var result0 = result2;
        } else {
          if (input.substr(pos, 2) === "] ") {
            var result1 = "] ";
            pos += 2;
          } else {
            var result1 = null;
            if (reportMatchFailures) {
              matchFailed("\"] \"");
            }
          }
          if (result1 !== null) {
            var result0 = result1;
          } else {
            var result0 = null;;
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_suma() {
        var cacheKey = 'suma@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var savedPos1 = pos;
        var result5 = parse_por();
        if (result5 !== null) {
          if (input.substr(pos, 3) === " + ") {
            var result6 = " + ";
            pos += 3;
          } else {
            var result6 = null;
            if (reportMatchFailures) {
              matchFailed("\" + \"");
            }
          }
          if (result6 !== null) {
            var result7 = parse_suma();
            if (result7 !== null) {
              var result3 = [result5, result6, result7];
            } else {
              var result3 = null;
              pos = savedPos1;
            }
          } else {
            var result3 = null;
            pos = savedPos1;
          }
        } else {
          var result3 = null;
          pos = savedPos1;
        }
        var result4 = result3 !== null
          ? (function(left, right) {return left + right;})(result3[0], result3[2])
          : null;
        if (result4 !== null) {
          var result2 = result4;
        } else {
          var result2 = null;
          pos = savedPos0;
        }
        if (result2 !== null) {
          var result0 = result2;
        } else {
          var result1 = parse_por();
          if (result1 !== null) {
            var result0 = result1;
          } else {
            var result0 = null;;
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_por() {
        var cacheKey = 'por@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var savedPos1 = pos;
        var result5 = parse_primary();
        if (result5 !== null) {
          if (input.substr(pos, 3) === " * ") {
            var result6 = " * ";
            pos += 3;
          } else {
            var result6 = null;
            if (reportMatchFailures) {
              matchFailed("\" * \"");
            }
          }
          if (result6 !== null) {
            var result7 = parse_por();
            if (result7 !== null) {
              var result3 = [result5, result6, result7];
            } else {
              var result3 = null;
              pos = savedPos1;
            }
          } else {
            var result3 = null;
            pos = savedPos1;
          }
        } else {
          var result3 = null;
          pos = savedPos1;
        }
        var result4 = result3 !== null
          ? (function(left, right) {return left * right;})(result3[0], result3[2])
          : null;
        if (result4 !== null) {
          var result2 = result4;
        } else {
          var result2 = null;
          pos = savedPos0;
        }
        if (result2 !== null) {
          var result0 = result2;
        } else {
          var result1 = parse_multiplicacion();
          if (result1 !== null) {
            var result0 = result1;
          } else {
            var result0 = null;;
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_multiplicacion() {
        var cacheKey = 'multiplicacion@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var savedPos1 = pos;
        var result5 = parse_primary();
        if (result5 !== null) {
          if (input.substr(pos, 3) === " / ") {
            var result6 = " / ";
            pos += 3;
          } else {
            var result6 = null;
            if (reportMatchFailures) {
              matchFailed("\" / \"");
            }
          }
          if (result6 !== null) {
            var result7 = parse_por();
            if (result7 !== null) {
              var result3 = [result5, result6, result7];
            } else {
              var result3 = null;
              pos = savedPos1;
            }
          } else {
            var result3 = null;
            pos = savedPos1;
          }
        } else {
          var result3 = null;
          pos = savedPos1;
        }
        var result4 = result3 !== null
          ? (function(left, right) {return left / right;})(result3[0], result3[2])
          : null;
        if (result4 !== null) {
          var result2 = result4;
        } else {
          var result2 = null;
          pos = savedPos0;
        }
        if (result2 !== null) {
          var result0 = result2;
        } else {
          var result1 = parse_resta();
          if (result1 !== null) {
            var result0 = result1;
          } else {
            var result0 = null;;
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_resta() {
        var cacheKey = 'resta@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var savedPos1 = pos;
        var result5 = parse_primary();
        if (result5 !== null) {
          if (input.substr(pos, 3) === " - ") {
            var result6 = " - ";
            pos += 3;
          } else {
            var result6 = null;
            if (reportMatchFailures) {
              matchFailed("\" - \"");
            }
          }
          if (result6 !== null) {
            var result7 = parse_por();
            if (result7 !== null) {
              var result3 = [result5, result6, result7];
            } else {
              var result3 = null;
              pos = savedPos1;
            }
          } else {
            var result3 = null;
            pos = savedPos1;
          }
        } else {
          var result3 = null;
          pos = savedPos1;
        }
        var result4 = result3 !== null
          ? (function(left, right) {return left - right;})(result3[0], result3[2])
          : null;
        if (result4 !== null) {
          var result2 = result4;
        } else {
          var result2 = null;
          pos = savedPos0;
        }
        if (result2 !== null) {
          var result0 = result2;
        } else {
          var result1 = parse_porciento();
          if (result1 !== null) {
            var result0 = result1;
          } else {
            var result0 = null;;
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_porciento() {
        var cacheKey = 'porciento@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var savedPos1 = pos;
        var result5 = parse_primary();
        if (result5 !== null) {
          if (input.substr(pos, 3) === " % ") {
            var result6 = " % ";
            pos += 3;
          } else {
            var result6 = null;
            if (reportMatchFailures) {
              matchFailed("\" % \"");
            }
          }
          if (result6 !== null) {
            var result7 = parse_por();
            if (result7 !== null) {
              var result3 = [result5, result6, result7];
            } else {
              var result3 = null;
              pos = savedPos1;
            }
          } else {
            var result3 = null;
            pos = savedPos1;
          }
        } else {
          var result3 = null;
          pos = savedPos1;
        }
        var result4 = result3 !== null
          ? (function(left, right) {return left % right;})(result3[0], result3[2])
          : null;
        if (result4 !== null) {
          var result2 = result4;
        } else {
          var result2 = null;
          pos = savedPos0;
        }
        if (result2 !== null) {
          var result0 = result2;
        } else {
          var result1 = parse_potencia();
          if (result1 !== null) {
            var result0 = result1;
          } else {
            var result0 = null;;
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_potencia() {
        var cacheKey = 'potencia@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var savedPos0 = pos;
        var savedPos1 = pos;
        var result5 = parse_primary();
        if (result5 !== null) {
          if (input.substr(pos, 3) === " ^ ") {
            var result6 = " ^ ";
            pos += 3;
          } else {
            var result6 = null;
            if (reportMatchFailures) {
              matchFailed("\" ^ \"");
            }
          }
          if (result6 !== null) {
            var result7 = parse_por();
            if (result7 !== null) {
              var result3 = [result5, result6, result7];
            } else {
              var result3 = null;
              pos = savedPos1;
            }
          } else {
            var result3 = null;
            pos = savedPos1;
          }
        } else {
          var result3 = null;
          pos = savedPos1;
        }
        var result4 = result3 !== null
          ? (function(left, right) {return left ^ right;})(result3[0], result3[2])
          : null;
        if (result4 !== null) {
          var result2 = result4;
        } else {
          var result2 = null;
          pos = savedPos0;
        }
        if (result2 !== null) {
          var result0 = result2;
        } else {
          var result1 = parse_primary();
          if (result1 !== null) {
            var result0 = result1;
          } else {
            var result0 = null;;
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_primary() {
        var cacheKey = 'primary@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var result9 = parse_integer();
        if (result9 !== null) {
          var result0 = result9;
        } else {
          var result8 = parse_rango();
          if (result8 !== null) {
            var result0 = result8;
          } else {
            var savedPos0 = pos;
            var savedPos1 = pos;
            if (input.substr(pos, 1) === "(") {
              var result5 = "(";
              pos += 1;
            } else {
              var result5 = null;
              if (reportMatchFailures) {
                matchFailed("\"(\"");
              }
            }
            if (result5 !== null) {
              var result6 = parse_suma();
              if (result6 !== null) {
                if (input.substr(pos, 1) === ")") {
                  var result7 = ")";
                  pos += 1;
                } else {
                  var result7 = null;
                  if (reportMatchFailures) {
                    matchFailed("\")\"");
                  }
                }
                if (result7 !== null) {
                  var result3 = [result5, result6, result7];
                } else {
                  var result3 = null;
                  pos = savedPos1;
                }
              } else {
                var result3 = null;
                pos = savedPos1;
              }
            } else {
              var result3 = null;
              pos = savedPos1;
            }
            var result4 = result3 !== null
              ? (function(suma) {return suma;})(result3[1])
              : null;
            if (result4 !== null) {
              var result2 = result4;
            } else {
              var result2 = null;
              pos = savedPos0;
            }
            if (result2 !== null) {
              var result0 = result2;
            } else {
              var result1 = parse_colchete();
              if (result1 !== null) {
                var result0 = result1;
              } else {
                var result0 = null;;
              };
            };
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_colchete() {
        var cacheKey = 'colchete@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        
        var result8 = parse_integer();
        if (result8 !== null) {
          var result0 = result8;
        } else {
          var result7 = parse_rango();
          if (result7 !== null) {
            var result0 = result7;
          } else {
            var savedPos0 = pos;
            var savedPos1 = pos;
            if (input.substr(pos, 1) === "[") {
              var result4 = "[";
              pos += 1;
            } else {
              var result4 = null;
              if (reportMatchFailures) {
                matchFailed("\"[\"");
              }
            }
            if (result4 !== null) {
              var result5 = parse_suma();
              if (result5 !== null) {
                if (input.substr(pos, 1) === "]") {
                  var result6 = "]";
                  pos += 1;
                } else {
                  var result6 = null;
                  if (reportMatchFailures) {
                    matchFailed("\"]\"");
                  }
                }
                if (result6 !== null) {
                  var result2 = [result4, result5, result6];
                } else {
                  var result2 = null;
                  pos = savedPos1;
                }
              } else {
                var result2 = null;
                pos = savedPos1;
              }
            } else {
              var result2 = null;
              pos = savedPos1;
            }
            var result3 = result2 !== null
              ? (function(suma) {return suma;})(result2[1])
              : null;
            if (result3 !== null) {
              var result1 = result3;
            } else {
              var result1 = null;
              pos = savedPos0;
            }
            if (result1 !== null) {
              var result0 = result1;
            } else {
              var result0 = null;;
            };
          };
        }
        
        
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function parse_integer() {
        var cacheKey = 'integer@' + pos;
        var cachedResult = cache[cacheKey];
        if (cachedResult) {
          pos = cachedResult.nextPos;
          return cachedResult.result;
        }
        
        var savedReportMatchFailures = reportMatchFailures;
        reportMatchFailures = false;
        var savedPos0 = pos;
        if (input.substr(pos).match(/^[0-9]/) !== null) {
          var result3 = input.charAt(pos);
          pos++;
        } else {
          var result3 = null;
          if (reportMatchFailures) {
            matchFailed("[0-9]");
          }
        }
        if (result3 !== null) {
          var result1 = [];
          while (result3 !== null) {
            result1.push(result3);
            if (input.substr(pos).match(/^[0-9]/) !== null) {
              var result3 = input.charAt(pos);
              pos++;
            } else {
              var result3 = null;
              if (reportMatchFailures) {
                matchFailed("[0-9]");
              }
            }
          }
        } else {
          var result1 = null;
        }
        var result2 = result1 !== null
          ? (function(digits) {return parseInt(digits.join(""), 10);})(result1)
          : null;
        if (result2 !== null) {
          var result0 = result2;
        } else {
          var result0 = null;
          pos = savedPos0;
        }
        reportMatchFailures = savedReportMatchFailures;
        if (reportMatchFailures && result0 === null) {
          matchFailed("un n&uacute;mero");
        }
        
        cache[cacheKey] = {
          nextPos: pos,
          result:  result0
        };
        return result0;
      }
      
      function buildErrorMessage() {
        function buildExpected(failuresExpected) {
          failuresExpected.sort();
          
          var lastFailure = null;
          var failuresExpectedUnique = [];
          for (var i = 0; i < failuresExpected.length; i++) {
            if (failuresExpected[i] !== lastFailure) {
              failuresExpectedUnique.push(failuresExpected[i]);
              lastFailure = failuresExpected[i];
            }
          }
          
          switch (failuresExpectedUnique.length) {
            case 0:
              return 'el final de la cadena';
            case 1:
              return failuresExpectedUnique[0];
            default:
              return failuresExpectedUnique.slice(0, failuresExpectedUnique.length - 1).join(', ')
                + ' o '
                + failuresExpectedUnique[failuresExpectedUnique.length - 1];
          }
        }
        
        var expected = buildExpected(rightmostMatchFailuresExpected);
        var actualPos = Math.max(pos, rightmostMatchFailuresPos);
        var actual = actualPos < input.length
          ? quote(input.charAt(actualPos))
          : 'el final de la cadena';
        var errorPos = computeErrorPosition();
        return '<br>Se esperaba <b>' + expected + '</b> pero fue encontrado <b>' + actual + '</b> en la l&iacute;nea ' + errorPos.line + ' , columna ' +errorPos.column;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i <  rightmostMatchFailuresPos; i++) {
          var ch = input.charAt(i);
          if (ch === '\n') {
            if (!seenCR) {line++;}
            column = 1;
            seenCR = false;
          } else if (ch === '\r' | ch === '\u2028' || ch === '\u2029') {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return {line: line, column: column};
      }
      
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostMatchFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostMatchFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostMatchFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var errorPosition = computeErrorPosition();
        throw new this.SyntaxError(
          buildErrorMessage(),
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() {return this._source;}
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(message, line, column) {
    this.name = '<b>Error Sint&aacute;ctico</b>';
    this.message = message;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();