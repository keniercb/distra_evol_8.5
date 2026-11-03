
if (window.parserGram)
    var _parserGram = window.parserGram;
Ext.namespace('Ext.Confin.Configuracion');
Ext.Confin.Configuracion.SintaxAnalyzer = Ext.extend(Ext.Component, {
    
});
parserGram : window.parserGram = (function() {
    return sintaxAnalyzer = {
        version: '3.0',
        input: '',
        lookahead: /^\s*$/,
        nmError: '<b>Error Sint&aacute;ctico</b>',
        msgError: '',
        lexemas_esperados: new Array(),
        tk_esperado: /^\s*$/,
        tk_encontrado: /^\s*$/,
        tokens_formula: new Array(),
        error_sintactico: {},
        err: new SyntaxError(),
        stack_Errors: new Array(),
        tkLast: {},
        constructor: function(input) {
            parserGram = this;
            Ext.apply(this.input, input || {});
            this.input = lexerGram.getCadena_entrada();
            this.lookahead = lexerGram.nextToken(lexerGram.getCadena_entrada().toString().charAt(lexerGram.posicion_actual), lexerGram.posicion_actual);
            parserGram.constructor.call(this);
            return this;
        },
        getTokenEsperado: function() {
            return this.tk_esperado;
        },
        getTokensEncontrados: function(tkFound) {
            var array_lexemas = new Array();
            switch (tkFound) {
                case lexerGram.tokens.tk_adiccion :
                    array_lexemas.push(lexerGram.lexemas.lxm_adiccion);
                    break;
                case lexerGram.tokens.tk_sustraccion :
                    array_lexemas.push(lexerGram.lexemas.lxm_sustraccion);
                    break;
                case lexerGram.tokens.tk_multiplicacion :
                    array_lexemas.push(lexerGram.lexemas.lxm_multiplicacion);
                    break;
                case lexerGram.tokens.tk_division :
                    array_lexemas.push(lexerGram.lexemas.lxm_division);
                    break;
                case lexerGram.tokens.tk_igualdad :
                    array_lexemas.push(lexerGram.lexemas.lxm_igualdad);
                    break;
                case lexerGram.tokens.tk_porciento :
                    array_lexemas.push(lexerGram.lexemas.lxm_porciento);
                    break;
                case lexerGram.tokens.tk_potencia :
                    array_lexemas.push(lexerGram.lexemas.lxm_potencia);
                    break;
                case lexerGram.tokens.tk_parentesisA :
                    array_lexemas.push(lexerGram.lexemas.lxm_parentesisA);
                    break;
                case lexerGram.tokens.tk_parentesisC :
                    array_lexemas.push(lexerGram.lexemas.lxm_parentesisC);
                    break;
                case lexerGram.tokens.tk_colcheteA :
                    array_lexemas.push(lexerGram.lexemas.lxm_colcheteA);
                    break;
                case lexerGram.tokens.tk_colcheteC :
                    array_lexemas.push(lexerGram.lexemas.lxm_colcheteC);
                    break;
                case lexerGram.tokens.tk_mayor :
                    array_lexemas.push(lexerGram.lexemas.lxm_mayor);
                    break;
                case lexerGram.tokens.tk_menor :
                    array_lexemas.push(lexerGram.lexemas.lxm_menor);
                    break;
                case lexerGram.tokens.tk_operador :
                    array_lexemas.push(lexerGram.lexemas.lxm_operador);
                    break;
                case lexerGram.tokens.tk_caracter :
                    array_lexemas.push(lexerGram.lexemas.lxm_caracter);
                    break;
                case lexerGram.tokens.tk_alfanumerico :
                    array_lexemas.push(lexerGram.lexemas.lxm_alfanumerico);
                    break;
                case lexerGram.tokens.tk_numero :
                    array_lexemas.push(lexerGram.lexemas.lxm_numero);
                    break;
                case lexerGram.tokens.tk_rango :
                    array_lexemas.push(lexerGram.lexemas.lxm_rango);
                    break;
                case lexerGram.tokens.tk_vacio :
                    array_lexemas.push(lexerGram.lexemas.lxm_vacio);
                    break;
                case lexerGram.tokens.tk_espacio :
                    array_lexemas.push(lexerGram.lexemas.lxm_espacio);
                    break;
                case lexerGram.tokens.tk_comaPtoFlotante :
                    array_lexemas.push(lexerGram.lexemas.lxm_comaPtoFlotante);
                    break;
                case lexerGram.tokens.tk_error :
                    array_lexemas.push(lexerGram.lexemas.lxm_error);
                    break;
                case lexerGram.tokens.tk_final :
                    array_lexemas.push(lexerGram.lexemas.lxm_final);
                    break;
                default :
                    array_lexemas.push(lexerGram.lexemas.lxm_extrano);
            }

            return array_lexemas;
        },
        consume_SgteToken: function() {
            this.tkLast = this.tokens_formula.shift();
            if (this.tkLast == undefined) {
                this.error_sintactico.posicion_actual = lexerGram.getPosicion_actual();
                this.error_sintactico.caracter_actual = lexerGram.getCaracter_actual();
                this.error_sintactico.tk_actual = lexerGram.getTokenActual();
                this.error_sintactico.tk_encontrado = this.getTokensEncontrados(this.tk_encontrado);
                this.error_sintactico.tk_esperado = this.getTokenEsperado();
                this.error_sintactico.lexemas_esperados = this.lexemas_esperados;
                this.msgError = '<br>En la posici&oacute;n <b>' + this.error_sintactico.posicion_actual + '</b> fue encontrado <span style="font-weight: bold; font-style: normal; color: blue">' + this.error_sintactico.tk_encontrado + '</span>  y se espera <span style="font-weight: bold; font-style: normal; color: red">' + this.error_sintactico.lexemas_esperados + '</span>. <br>';
                this.Reportar_ErrorSintactico(this.nmError, this.msgError);
            }
            this.lookahead = this.tkLast["Token"];
            return this.tkLast;
        },
        mach: function(tk_encontrado) {
            if (this.lookahead == tk_encontrado) {
                var tokeng = this.consume_SgteToken();
                this.error_sintactico.posicion_actual = tokeng["Posicion"];
                this.error_sintactico.caracter_actual = tokeng["Caracter"];
            } else {
                var tokenm = this.consume_SgteToken();
                this.error_sintactico.posicion_actual = tokenm["Posicion"];
                this.error_sintactico.caracter_actual = tokenm["Caracter"];
                this.lookahead = lexerGram.tokens.tk_error;
                this.msgError = '<br>En la posici&oacute;n <b>' + this.error_sintactico.posicion_actual + '</b> fue encontrado <span style="font-weight: bold; font-style: normal; color: blue">' + this.error_sintactico.tk_encontrado + '</span>  y se espera <span style="font-weight: bold; font-style: normal; color: red">' + this.error_sintactico.lexemas_esperados + '</span>. <br>';
                this.Reportar_ErrorSintactico(this.nmError, this.msgError);
            }
            return this.lookahead;
        },
        ParsearSintaxis: function(input) {
            this.msgError = '';
            this.err = new SyntaxError(this.msgError);
            this.stack_Errors = new Array();
            this.lexemas_esperados = new Array();
            this.input = input.toString();
            lexerGram.setCadena_entrada(input.toString());
            lexerGram.Parsear();
            this.tokens_formula = lexerGram.getSymbolTable();
            var token = this.consume_SgteToken();
            this.error_sintactico.posicion_actual = token["Posicion"];
            this.error_sintactico.caracter_actual = token["Caracter"];
            this.Parsear_Formula();
        },
        Parsear_Formula: function() {
            while (this.lookahead != lexerGram.tokens.tk_final) {
                switch (this.lookahead) {
                    case lexerGram.tokens.tk_vacio:
                        this.consume_SgteToken();
                        break;
                    case lexerGram.tokens.tk_espacio:
                        this.consume_SgteToken();
                        break;
                    case lexerGram.tokens.tk_comaPtoFlotante:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero];
                        this.tk_encontrado = lexerGram.tokens.tk_comaPtoFlotante;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_numero:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_comaPtoFlotante, lexerGram.lexemas.lxm_operador, lexerGram.lexemas.lxm_parentesisC, lexerGram.lexemas.lxm_colcheteC, lexerGram.lexemas.lxm_espacio, lexerGram.lexemas.lxm_final];
                        this.tk_encontrado = lexerGram.tokens.tk_numero;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_comaPtoFlotante && this.lookahead != lexerGram.tokens.tk_adiccion && this.lookahead != lexerGram.tokens.tk_sustraccion && this.lookahead != lexerGram.tokens.tk_multiplicacion && this.lookahead != lexerGram.tokens.tk_division && this.lookahead != lexerGram.tokens.tk_igualdad && this.lookahead != lexerGram.tokens.tk_porciento && this.lookahead != lexerGram.tokens.tk_potencia && this.lookahead != lexerGram.tokens.tk_mayor && this.lookahead != lexerGram.tokens.tk_menor && this.lookahead != lexerGram.tokens.tk_parentesisC && this.lookahead != lexerGram.tokens.tk_colcheteC && this.lookahead != lexerGram.tokens.tk_final && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_adiccion:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_adiccion;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_sustraccion:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_sustraccion;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_multiplicacion:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_multiplicacion;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }

                        break;
                    case lexerGram.tokens.tk_division:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_division;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_igualdad:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_igualdad;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_porciento:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_porciento;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_potencia:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_potencia;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_mayor:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_mayor;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_menor:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_menor;
                        this.mach(this.tk_encontrado);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_parentesisA:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_parentesisA;
                        this.mach(this.tk_encontrado);
                        this.ParentesisBalanceados(this.input);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_parentesisC:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_parentesisC, lexerGram.lexemas.lxm_colcheteC, lexerGram.lexemas.lxm_operador, lexerGram.lexemas.lxm_espacio, lexerGram.lexemas.lxm_final];
                        this.tk_encontrado = lexerGram.tokens.tk_parentesisC;
                        this.mach(this.tk_encontrado);
                        this.ParentesisBalanceados(this.input);
                        if (this.lookahead != lexerGram.tokens.tk_parentesisC && this.lookahead != lexerGram.tokens.tk_colcheteC && this.lookahead != lexerGram.tokens.tk_vacio && this.lookahead != lexerGram.tokens.tk_adiccion && this.lookahead != lexerGram.tokens.tk_sustraccion && this.lookahead != lexerGram.tokens.tk_multiplicacion && this.lookahead != lexerGram.tokens.tk_division && this.lookahead != lexerGram.tokens.tk_igualdad && this.lookahead != lexerGram.tokens.tk_porciento && this.lookahead != lexerGram.tokens.tk_potencia && this.lookahead != lexerGram.tokens.tk_mayor && this.lookahead != lexerGram.tokens.tk_menor && this.lookahead != lexerGram.tokens.tk_operador && this.lookahead != lexerGram.tokens.tk_final) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_colcheteA:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_numero, lexerGram.lexemas.lxm_parentesisA, lexerGram.lexemas.lxm_colcheteA, lexerGram.lexemas.lxm_espacio];
                        this.tk_encontrado = lexerGram.tokens.tk_colcheteA;
                        this.mach(this.tk_encontrado);
                        this.ColchetesBalanceados(this.input);
                        if (this.lookahead != lexerGram.tokens.tk_numero && this.lookahead != lexerGram.tokens.tk_parentesisA && this.lookahead != lexerGram.tokens.tk_colcheteA && this.lookahead != lexerGram.tokens.tk_vacio) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_colcheteC:
                        this.lexemas_esperados = [lexerGram.lexemas.lxm_parentesisC, lexerGram.lexemas.lxm_colcheteC, lexerGram.lexemas.lxm_operador, lexerGram.lexemas.lxm_espacio, lexerGram.lexemas.lxm_final];
                        this.tk_encontrado = lexerGram.tokens.tk_colcheteC;
                        this.mach(this.tk_encontrado);
                        this.ColchetesBalanceados(this.input);
                        if (this.lookahead != lexerGram.tokens.tk_parentesisC && this.lookahead != lexerGram.tokens.tk_colcheteC && this.lookahead != lexerGram.tokens.tk_vacio && this.lookahead != lexerGram.tokens.tk_adiccion && this.lookahead != lexerGram.tokens.tk_sustraccion && this.lookahead != lexerGram.tokens.tk_multiplicacion && this.lookahead != lexerGram.tokens.tk_division && this.lookahead != lexerGram.tokens.tk_igualdad && this.lookahead != lexerGram.tokens.tk_porciento && this.lookahead != lexerGram.tokens.tk_potencia && this.lookahead != lexerGram.tokens.tk_mayor && this.lookahead != lexerGram.tokens.tk_menor && this.lookahead != lexerGram.tokens.tk_operador && this.lookahead != lexerGram.tokens.tk_final) {
                            this.lookahead = lexerGram.tokens.tk_error;
                        }
                        break;
                    case lexerGram.tokens.tk_error:
                        this.error_sintactico.caracter_actual = lexerGram.getCaracter_actual();
                        this.error_sintactico.tk_actual = lexerGram.getTokenActual();
                        this.error_sintactico.tk_encontrado = this.getTokensEncontrados(this.tk_encontrado);
                        this.error_sintactico.tk_esperado = this.getTokenEsperado();
                        this.error_sintactico.lexemas_esperados = this.lexemas_esperados;
                        this.msgError = '<br>En la posici&oacute;n <b>' + this.error_sintactico.posicion_actual + '</b> fue encontrado <span style="font-weight: bold; font-style: normal; color: blue">' + this.error_sintactico.tk_encontrado + '</span>  y se espera <span style="font-weight: bold; font-style: normal; color: red">' + this.error_sintactico.lexemas_esperados + '</span>. <br>';
                        this.Reportar_ErrorSintactico(this.nmError, this.msgError);
                        break;
                }
            }
            return this.tk_encontrado;
        },
        Reportar_ErrorSintactico: function(arg_nmError, arg_msgError) {
            this.err.name = arg_nmError;
            this.err.message = arg_msgError;
            this.stack_Errors.push(this.err);
            throw this.err;
        },
        ParentesisBalanceados: function(cadena) {
            var contador = 0;
            for (i = 0; i < cadena.length; i++) {
                if (cadena.charAt(i) == '(') {
                    contador++;
                } else if (cadena.charAt(i) == ')') {
                    contador--;
                }
            }
            if (contador == 0) {
                return true;
            }
            else {
                var msg_error = '<br>Par&eacute;ntesis mal balanceados';
                this.Reportar_ErrorSintactico(this.nmError, msg_error);
            }
        },
        ColchetesBalanceados: function(cadena) {
            var contador = 0;
            for (i = 0; i < cadena.length; i++) {
                if (cadena.charAt(i) == '[') {
                    contador++;
                } else if (cadena.charAt(i) == ']') {
                    contador--;
                }
            }
            if (contador == 0) {
                return true;
            }
            else {
                var msg_error = '<br>Colchetes mal balanceados';
                this.Reportar_ErrorSintactico(this.nmError, msg_error);
            }
        }
    };
})();