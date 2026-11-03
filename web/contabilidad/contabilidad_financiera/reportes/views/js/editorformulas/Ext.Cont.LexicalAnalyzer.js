
if (window.lexerGram)
    var _lexerGram = window.lexerGram;
Ext.namespace('Ext.Confin.Configuracion');
Ext.Confin.Configuracion.LexicalAnalyzer = Ext.extend(Ext.Component, {
    
});
lexerGram : window.lexerGram = (function() {
   return lexicalAnalyzer = {
        version: '3.0',
        cadena_entrada: '',
        caracter_actual: '',
        posicion_actual: 0,
        tk_actual: /^\s*$/,
        nmError: '<b>Error L&eacute;xico</b>',
        msgError: '',
        err: new SyntaxError(),
        stack_Errors: new Array(),
        symbolTable: new Array(),
        tokens: {
            tk_adiccion: /^\+{1}$/,
            tk_sustraccion: /^\-{1}$/,
            tk_multiplicacion: /^\*{1}$/,
            tk_division: /^\/{1}$/,
            tk_igualdad: /^\={1}$/,
            tk_porciento: /^\%{1}$/,
            tk_potencia: /^\^{1}$/,
            tk_parentesisA: /^\({1}$/,
            tk_parentesisC: /^\){1}$/,
            tk_colcheteA: /^\[{1}$/,
            tk_colcheteC: /^\]{1}$/,
            tk_mayor: /^\>{1}$/,
            tk_menor: /^\<{1}$/,
            tk_operador: /^[%^|\/|\+|\-|\*|\>|\<|\=]{1}$/,
            tk_caracter: /^[a-zA-Zá-úÁ-ÚñÑ]*$/,
            tk_alfanumerico: /^\w*$/,
            tk_numero: /^[+-]?\d+([,.]\d*)*?$/,
            tk_rango: /^\[{1}\d+\-{1}\d+\]{1}$/,
            tk_vacio: /^\s*$/,
            tk_espacio: /^\s[ \t\n\r]$/,
            tk_comaPtoFlotante: /^[,.]$/,
            tk_error: "Error",
            tk_final: "EOT"
        },
        lexemas: {
            lxm_adiccion: ' +',
            lxm_sustraccion: ' -',
            lxm_multiplicacion: ' *',
            lxm_division: ' /',
            lxm_igualdad: ' =',
            lxm_porciento: ' %',
            lxm_potencia: ' ^',
            lxm_parentesisA: ' (',
            lxm_parentesisC: ' )',
            lxm_colcheteA: ' [',
            lxm_colcheteC: ' ]',
            lxm_mayor: ' >',
            lxm_menor: ' <',
            lxm_operador: ' +, -, *, /, =, %, ^, >, <',
            lxm_caracter: ' abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚ',
            lxm_alfanumerico: ' abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚ0123456789',
            lxm_numero: ' N&uacute;mero',
            lxm_rango: ' Rango',
            lxm_vacio: '\" \"',
            lxm_espacio: '\" \"',
            lxm_comaPtoFlotante: 'coma o punto flotante',
            lxm_error: 'Error',
            lxm_final: ' o final de la f&oacute;rmula',
            lxm_extrano: ' un error desconocido'
        },
        constructor: function(input) {
            lexerGram = this;
            Ext.apply(this.input, input || {});
            this.setCadena_entrada(this.input);
            this.setCaracter_actual(this.input.toString().charAt(this.getPosicion_actual()));
            this.tk_actual = this.nextToken();
            lexerGram.constructor.call(this);
            return this;
        },
        getSymbolTable: function() {
            return this.symbolTable;
        },
        setSymbolTable: function(newArray) {
            this.symbolTable = newArray;
        },
        getTokenActual: function() {
            return this.tk_actual;
        },
        setCaracter_actual: function(c) {
            this.caracter_actual = c;
        },
        getCaracter_actual: function() {
            return this.caracter_actual;
        },
        setPosicion_actual: function(pos) {
            this.posicion_actual = pos;
        },
        getPosicion_actual: function() {
            return this.posicion_actual;
        },
        getCadena_entrada: function() {
            return this.cadena_entrada;
        },
        setCadena_entrada: function(input) {
            this.cadena_entrada = input;
            this.setCaracter_actual(this.cadena_entrada.toString().charAt(this.getPosicion_actual()));
            return this;
        },
        esLetra: function(letra) {
            if (this.tokens.tk_caracter.test(letra) == true) {
                return true;
            } else {
                return false;
            }
        },
        esNumero: function(numero) {
            if (this.tokens.tk_numero.test(numero) == true) {
                return true;
            } else {
                return false;
            }
        },
        esOperador: function(operador) {
            if (this.tokens.tk_operador.test(operador)) {
                return true;
            } else {
                return false;
            }
        },
        esOperadorAgrupacion: function(operadorA) {
            if (operadorA == '[' || operadorA == ']' || operadorA == '(' || operadorA == ')')
                return true;
            return false;
        },
        esSeparador: function(separador) {
            if (this.tokens.tk_vacio.test(separador) || this.tokens.tk_espacio.test(separador))
                return true;
            return false;
        },
        Parsear: function() {
            this.symbolTable = new Array();
            this.tk_actual = this.nextToken(this.getCadena_entrada().toString().charAt(0), 0);
            for (this.posicion_actual = 0; this.posicion_actual <= this.getCadena_entrada().length; this.posicion_actual++) {
                this.setPosicion_actual(this.posicion_actual);
                this.setCaracter_actual(this.getCadena_entrada().toString().charAt(this.getPosicion_actual()));
                this.match(this.getCadena_entrada().toString().charAt(this.posicion_actual), this.posicion_actual);
            }
        },
        consume: function() {
            this.posicion_actual += 1;
            this.setCaracter_actual(this.cadena_entrada.toString().charAt(this.posicion_actual));
        },
        match: function(terminal, pos) {
            if (this.tk_actual.test(terminal) || this.tk_actual != "Error") {
                this.tk_actual = this.nextToken(terminal, pos);
            } else {
                this.tk_actual = this.tokens.tk_error;
                this.msgError = '<br>Caracter no esperado: <span style="font-weight: bold; font-style: normal; color: blue">' + terminal + '</span> en la posici&oacute;n: ' + pos;
                this.consume();
                this.Reportar_ErrorLexico(this.nmError, this.msgError);
            }
            this.symbolTable.push({
                "Token": this.tk_actual,
                "Caracter": terminal,
                "Posicion": pos
            });

            return this.tk_actual;
        },
        WS: function() {
            while (this.tokens.tk_vacio.test(this.getCaracter_actual()) || this.tokens.tk_espacio.test(this.getCaracter_actual())) {
                this.consume();
            }
        },
        nextToken: function(currentChar, pos) {
            this.setCaracter_actual(currentChar);
            while (pos <= this.getCadena_entrada().length - 1)
            {
                switch (this.caracter_actual)
                {
                    case '.' :
                        {
                            return this.tokens.tk_comaPtoFlotante;
                        }
                    case ',' :
                        {
                            return this.tokens.tk_comaPtoFlotante;
                        }
                    case '+' :
                        {
                            this.consume();
                            return this.tokens.tk_adiccion;
                        }
                    case '-' :
                        {
                            this.consume();
                            return this.tokens.tk_sustraccion;
                        }
                    case '*' :
                        {
                            this.consume();
                            return this.tokens.tk_multiplicacion;
                        }
                    case '/' :
                        {
                            this.consume();
                            return this.tokens.tk_division;
                        }
                    case '=' :
                        {
                            this.consume();
                            return this.tokens.tk_igualdad;
                        }
                    case '%' :
                        {
                            this.consume();
                            return this.tokens.tk_porciento;
                        }
                    case '^' :
                        {
                            this.consume();
                            return this.tokens.tk_potencia;
                        }
                    case '(' :
                        {
                            this.consume();
                            return this.tokens.tk_parentesisA;
                            break;
                        }
                    case ')' :
                        {
                            return this.tokens.tk_parentesisC;
                        }
                    case '[' :
                        {
                            this.consume();
                            return this.tokens.tk_colcheteA;
                        }
                    case ']' :
                        {
                            return this.tokens.tk_colcheteC;
                        }
                    case '>' :
                        {
                            this.consume();
                            return this.tokens.tk_mayor;
                        }
                    case '<' :
                        {
                            this.consume();
                            return this.tokens.tk_menor;
                        }
                    case '\0':
                        {
                            this.tk_actual = this.tokens.tk_final;
                            break;
                        }
                    case 'EOF':
                        {
                            this.tk_actual = this.tokens.tk_final;
                            break;
                        }
                    default :
                        {
                            if (this.esSeparador(this.caracter_actual)) {
                                return this.tokens.tk_vacio;
                                this.WS(); // saltar 
                            }
                            if (this.esLetra(this.caracter_actual)) {
                                return this.tokens.tk_caracter;
                            } else
                            {
                                if (this.esNumero(this.caracter_actual)) {
                                    return this.tokens.tk_numero;
                                } else
                                {
                                    this.msgError = '<br>Caracter no esperado: <span style="font-weight: bold; font-style: normal; color: blue">' + this.getCaracter_actual() + '</span> en la posici&oacute;n: ' + pos;
                                    this.consume();
                                    this.Reportar_ErrorLexico(this.nmError, this.msgError);
                                }
                            }
                        }
                }
            }
            return this.tokens.tk_final;
        },
        Reportar_ErrorLexico: function(arg_nmError, arg_msgError) {
            this.err.name = arg_nmError;
            this.err.message = arg_msgError;
            throw this.err;
        }

    };
})();