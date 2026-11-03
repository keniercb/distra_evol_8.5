/* 
 * Componente para la escritura de fechas.
 * @author Alejandro Mengana P&eacute;rez
 * @package ERP Cuba
 * @subpackage Contabilidad y Finanzas. 
 * @category Contabilidad
 * @namespace Ext.Cont.DateField
 * @extends Ext.form.DateField
 * @copyright XETID
 * @version 2.0-0
 */
Ext.namespace('Ext.Cont.DateField');
Ext.Cont.DateField = Ext.extend(Ext.form.DateField, {
    constructor: function(params) {

        this.addEvents('click', 'mousedown', 'contextmenu');

        params.disabledClass = 'disabled-component';
        params.cadenaFecha = '';
        params.contador = 0;
        params.arrpos = new Array();
        params.format = 'd/m/Y';
        params.enableKeyEvents = true;
        params.selectOnFocus = true;

        Ext.apply(this, params);
        
        Ext.Cont.DateField.superclass.constructor.call(this);

        this.inicioEventos();
    },
    inicioEventos: function() {

        this.on({
            scope: this,
            render: function() {
                this.el.on("click", this.onClick, this);
                this.el.on("mousedown", this.onMousedown, this);
                this.el.on("contextmenu", this.onContextmenu, this);
            },
            click: function(dateField, e) {
                if (this.getEl().dom.value) {
                    this.cadenaFecha = this.getEl().dom.value;
                    this.contador = this.getEl().dom.value.length;
                    if (this.cadenaFecha.length == 10) {
                        this.arrpos = null;
                        this.arrpos = new Array();
                    }
                }
                else {
                    this.cadenaFecha = '';
                    this.contador = 0;
                }

                if (this.arrpos.length > 0) {
                    if (this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                        this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio);
                    }
                    else if (this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                        this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                    }
                }
            },
            mousedown: function(dateField, e) {
                if (this.getEl().dom.value) {
                    this.cadenaFecha = this.getEl().dom.value;
                    this.contador = this.getEl().dom.value.length;
                    if (this.cadenaFecha.length == 10) {
                        this.arrpos = null;
                        this.arrpos = new Array();
                    }
                }
                else {
                    this.cadenaFecha = '';
                    this.contador = 0;
                }
            },
            contextmenu: function(dateField, e) {
                e.stopEvent();
            },
            valid: function(dateField) {
                if (this.getEl().dom.value) {
                    this.cadenaFecha = this.getEl().dom.value;
                    this.contador = this.getEl().dom.value.length;
                    if (this.cadenaFecha.length == 10) {
                        this.arrpos = null;
                        this.arrpos = new Array();
                    }
                }
                else {
                    this.cadenaFecha = '';
                    this.contador = 0;
                }
            },
            keypress: function(dateField, event) {
                if ((event.getKey() < 48 || event.getKey() > 57) && event.getKey() != 8 && event.getKey() != 46 && event.getKey() != 13 && event.getKey() != 37 && event.getKey() != 39) {
                    event.stopEvent();
                }
                else {
                    if (this.cadenaFecha.length == 10 && event.getKey() != 8 && event.getKey() != 46 && event.getKey() != 37 && event.getKey() != 39 && dateField.getEl().dom.selectionStart == dateField.getEl().dom.selectionEnd) {
                        event.stopEvent();
                    }
                    else if (this.cadenaFecha.length == dateField.getEl().dom.selectionStart && event.getKey() == 46) {
                        event.stopEvent();
                    }
                    else if (this.cadenaFecha.length == 0 && (event.getKey() == 8 || event.getKey() == 46)) {
                        event.stopEvent();
                    }
                    else if (this.cadenaFecha == '//' && (event.getKey() == 8 || event.getKey() == 46)) {
                        event.stopEvent();
                    }
                    else if (event.getKey() != 13 && event.getKey() != 37 && event.getKey() != 39) {

                        if (dateField.getEl().dom.selectionStart != dateField.getEl().dom.selectionEnd && event.getKey() != 8 && event.getKey() != 46 && (event.getKey() >= 48 || event.getKey() <= 57)) {

                            if (dateField.getEl().dom.selectionStart != dateField.getEl().dom.selectionEnd) {
                                this.cadenaFecha = this.EliminarRangoCadena(this.cadenaFecha, dateField.getEl().dom.selectionStart, dateField.getEl().dom.selectionEnd);
                                this.contador = this.cadenaFecha.length;
                                this.arrpos.push({
                                    'inicio': dateField.getEl().dom.selectionStart,
                                    'fin': dateField.getEl().dom.selectionEnd,
                                    'intervalo': 1
                                });
                            }

                            if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                ultimo = this.arrpos[this.arrpos.length - 1];
                                if (ultimo.inicio == 3 || ultimo.inicio == 6) {
                                    this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, '/', ultimo.inicio - 1);
                                    this.arrpos.pop();
                                }
                            }
                            else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                ultimo = this.arrpos[this.arrpos.length - 1];

                                if (ultimo.inicio == 2 || ultimo.inicio == 5) {
                                    this.arrpos.pop();
                                    this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, '/', ultimo.inicio);

                                    this.arrpos.push({
                                        'inicio': ultimo.inicio + 1,
                                        'fin': ultimo.fin,
                                        'intervalo': 1
                                    });
                                }

                                if (this.arrpos[this.arrpos.length - 1].inicio == this.arrpos[this.arrpos.length - 1].fin) {
                                    this.arrpos.pop();
                                }
                            }

                            //****************************************************************************************

                            if (this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                var ultimo = this.arrpos.pop();

                                if (ultimo.inicio != 2 || ultimo.inicio != 5) {
                                    this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, String.fromCharCode(event.getKey()), ultimo.inicio);
                                    this.arrpos.push({
                                        'inicio': ultimo.inicio + 1,
                                        'fin': ultimo.fin,
                                        'intervalo': 1
                                    });

                                    if (this.arrpos[this.arrpos.length - 1].inicio == this.arrpos[this.arrpos.length - 1].fin) {
                                        this.arrpos.pop();
                                    }
                                }

                                //Esta parte es para el / de la fecha************************
                                if (this.arrpos.length > 0) {
                                    ultimo = this.arrpos[this.arrpos.length - 1];
                                    if (ultimo.inicio == 2 || ultimo.inicio == 5) {
                                        this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, '/', ultimo.inicio);
                                        this.arrpos.pop();
                                        this.arrpos.push({
                                            'inicio': ultimo.inicio + 1,
                                            'fin': ultimo.fin,
                                            'intervalo': 1
                                        });

                                        if (this.arrpos[this.arrpos.length - 1].inicio == this.arrpos[this.arrpos.length - 1].fin) {
                                            this.arrpos.pop();
                                        }
                                    }
                                }
                                //*********************************************************

                                if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio);
                                }
                                else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                                }
                            }
                            else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                var ultimo = this.arrpos.pop();
                                this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, String.fromCharCode(event.getKey()), ultimo.inicio - 1);

                                if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio);
                                }
                                else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                                }
                            }
                        }
                        else if (event.getKey() != 8 && event.getKey() != 46 && this.arrpos.length == 0) {
                            this.cadenaFecha += String.fromCharCode(event.getKey());
                            this.contador = this.cadenaFecha.length;
                            if (this.contador == 2) {
                                this.cadenaFecha += '/';
                                this.contador = this.cadenaFecha.length;
                            }
                            else if (this.contador == 5) {
                                this.cadenaFecha += '/';
                                this.contador = this.cadenaFecha.length;
                            }
                        }
                        else if (event.getKey() == 8) {	//Backspace								
                            if (dateField.getEl().dom.selectionStart == dateField.getEl().dom.selectionEnd) {

                                if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].inicio == 1) {
                                    event.stopEvent();
                                }
                                else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].inicio == 0) {
                                    event.stopEvent();
                                }
                                else if (this.arrpos.length == 0 || this.arrpos[this.arrpos.length - 1].inicio != 1) {
                                    this.cadenaFecha = this.EliminarCaracter(this.cadenaFecha, dateField.getEl().dom.selectionStart);
                                    this.contador = this.cadenaFecha.length;
                                    this.arrpos.push({
                                        'inicio': dateField.getEl().dom.selectionStart,
                                        'fin': dateField.getEl().dom.selectionEnd,
                                        'intervalo': 0
                                    });
                                }

                                if (this.cadenaFecha.length == 0) {
                                    this.contador = 0;
                                    this.cadenaFecha = '';
                                    this.arrpos = null;
                                    this.arrpos = new Array();
                                }
                            }
                            else if (dateField.getEl().dom.selectionStart == 0 && dateField.getEl().dom.selectionEnd == 10) {
                                this.contador = 0;
                                this.cadenaFecha = '';
                                this.arrpos = null;
                                this.arrpos = new Array();
                            }
                            else if (dateField.getEl().dom.selectionStart != dateField.getEl().dom.selectionEnd) {
                                this.cadenaFecha = this.EliminarRangoCadena(this.cadenaFecha, dateField.getEl().dom.selectionStart, dateField.getEl().dom.selectionEnd);
                                this.contador = this.cadenaFecha.length;
                                this.arrpos.push({
                                    'inicio': dateField.getEl().dom.selectionStart,
                                    'fin': dateField.getEl().dom.selectionEnd,
                                    'intervalo': 1
                                });
                            }

                            if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                ultimo = this.arrpos[this.arrpos.length - 1];
                                if (ultimo.inicio == 3 || ultimo.inicio == 6) {
                                    this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, '/', ultimo.inicio - 1);
                                    this.arrpos.pop();
                                }
                            }
                            else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                ultimo = this.arrpos[this.arrpos.length - 1];

                                if (ultimo.inicio == 2 || ultimo.inicio == 5) {
                                    this.arrpos.pop();
                                    this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, '/', ultimo.inicio);

                                    this.arrpos.push({
                                        'inicio': ultimo.inicio + 1,
                                        'fin': ultimo.fin,
                                        'intervalo': 1
                                    });
                                }

                                if (this.arrpos[this.arrpos.length - 1].inicio == this.arrpos[this.arrpos.length - 1].fin) {
                                    this.arrpos.pop();
                                }
                            }
                        }
                        else if (event.getKey() == 46) {//Delete									
                            if (dateField.getEl().dom.selectionStart == dateField.getEl().dom.selectionEnd) {
                                event.stopEvent();
                            }
                            else if (dateField.getEl().dom.selectionStart == 0 && dateField.getEl().dom.selectionEnd == 10) {
                                this.contador = 0;
                                this.cadenaFecha = '';
                                this.arrpos = null;
                                this.arrpos = new Array();
                            }
                            else if (dateField.getEl().dom.selectionStart != dateField.getEl().dom.selectionEnd) {
                                this.cadenaFecha = this.EliminarRangoCadena(this.cadenaFecha, dateField.getEl().dom.selectionStart, dateField.getEl().dom.selectionEnd);
                                this.contador = this.cadenaFecha.length;
                                this.arrpos.push({
                                    'inicio': dateField.getEl().dom.selectionStart,
                                    'fin': dateField.getEl().dom.selectionEnd,
                                    'intervalo': 1
                                });
                            }

                            if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                ultimo = this.arrpos[this.arrpos.length - 1];
                                if (ultimo.inicio == 3 || ultimo.inicio == 6) {
                                    this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, '/', ultimo.inicio - 1);
                                    this.arrpos.pop();
                                }
                            }
                            else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                ultimo = this.arrpos[this.arrpos.length - 1];

                                if (ultimo.inicio == 2 || ultimo.inicio == 5) {
                                    this.arrpos.pop();
                                    this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, '/', ultimo.inicio);

                                    this.arrpos.push({
                                        'inicio': ultimo.inicio + 1,
                                        'fin': ultimo.fin,
                                        'intervalo': 1
                                    });
                                }

                                if (this.arrpos[this.arrpos.length - 1].inicio == this.arrpos[this.arrpos.length - 1].fin) {
                                    this.arrpos.pop();
                                }
                            }
                        }
                        else if (event.getKey() != 8 && event.getKey() != 46 && this.arrpos.length > 0) {

                            if (this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                var ultimo = this.arrpos.pop();

                                if (ultimo.inicio != 2 || ultimo.inicio != 5) {
                                    this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, String.fromCharCode(event.getKey()), ultimo.inicio);
                                    this.arrpos.push({
                                        'inicio': ultimo.inicio + 1,
                                        'fin': ultimo.fin,
                                        'intervalo': 1
                                    });

                                    if (this.arrpos[this.arrpos.length - 1].inicio == this.arrpos[this.arrpos.length - 1].fin) {
                                        this.arrpos.pop();
                                    }
                                }

                                //Esta parte es para el / de la fecha************************
                                if (this.arrpos.length > 0) {
                                    ultimo = this.arrpos[this.arrpos.length - 1];
                                    if (ultimo.inicio == 2 || ultimo.inicio == 5) {
                                        this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, '/', ultimo.inicio);
                                        this.arrpos.pop();
                                        this.arrpos.push({
                                            'inicio': ultimo.inicio + 1,
                                            'fin': ultimo.fin,
                                            'intervalo': 1
                                        });

                                        if (this.arrpos[this.arrpos.length - 1].inicio == this.arrpos[this.arrpos.length - 1].fin) {
                                            this.arrpos.pop();
                                        }
                                    }
                                }
                                //*********************************************************

                                if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio);
                                }
                                else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                                }
                            }
                            else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                var ultimo = this.arrpos.pop();
                                this.cadenaFecha = this.InsertarCaracter(this.cadenaFecha, String.fromCharCode(event.getKey()), ultimo.inicio - 1);

                                if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio);
                                }
                                else if (this.arrpos.length > 0 && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                                }
                            }
                        }
                    }
                }
            },
            keyup: function(dateField, event) {
                if ((event.getKey() < 96 || event.getKey() > 105) && event.getKey() != 8 && event.getKey() != 46 && event.getKey() != 13 && event.getKey() != 37 && event.getKey() != 39) {
                    if ((event.getKey() < 48 || event.getKey() > 57) && event.getKey() != 8 && event.getKey() != 46 && event.getKey() != 13 && event.getKey() != 37 && event.getKey() != 39) {
                        event.stopEvent();
                    }
                    else {
                        if (event.getKey() != 13) {
                            dateField.setRawValue(this.cadenaFecha);
                            if (this.arrpos.length > 0) {
                                if (this.cadenaFecha == '//' && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                                }
                                else if (this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                                }
                                else if (this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                                    this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio);
                                }
                            }
                        }
                    }
                }
                else if (event.getKey() != 13) {
                    dateField.setRawValue(this.cadenaFecha);
                    if (this.arrpos.length > 0) {
                        if (this.cadenaFecha == '//' && this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                            this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                        }
                        else if (this.arrpos[this.arrpos.length - 1].intervalo == 0) {
                            this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio - 1);
                        }
                        else if (this.arrpos[this.arrpos.length - 1].intervalo == 1) {
                            this.ponCursorEnPos(this.arrpos[this.arrpos.length - 1].inicio);
                        }
                    }
                }
            }
        });
    },
    onClick: function(e) {
        this.fireEvent("click", this, e);
    },
    onMousedown: function(e) {
        this.fireEvent("mousedown", this, e);
    },
    onContextmenu: function(e) {
        this.fireEvent("contextmenu", this, e);
    },
    ponCursorEnPos: function(pos) {
        if (typeof document.selection != 'undefined' && document.selection) {//m�todo IE
            var tex = this.getEl().dom.value;
            this.getEl().dom.value = '';
            this.getEl().dom.value.focus();
            var str = document.selection.createRange();
            this.getEl().dom.value = tex;
            str.move("character", pos);
            str.moveEnd("character", 0);
            str.select();
        }
        else if (typeof this.getEl().dom.selectionStart != 'undefined') {//m�todo est�ndar
            this.getEl().dom.setSelectionRange(pos, pos);
            this.getEl().dom.focus();//deber�a ser focus(), pero nos salta el evento y no queremos
        }
    },
    InsertarCaracter: function(cadena, caracter, pos) {
        var retorno = '';
        retorno = cadena.substring(0, pos) + caracter + cadena.substring(pos);
        return retorno;
    },
    EliminarCaracter: function(cadena, pos) {
        var retorno = '';
        retorno = cadena.substring(0, pos - 1) + cadena.substring(pos);
        return retorno;
    },
    EliminarRangoCadena: function(cadena, inicio, fin) {
        var retorno = '';
        retorno = cadena.substring(0, inicio) + cadena.substring(fin);
        return retorno;
    }
});
Ext.reg('datefieldClass', Ext.Cont.DateField);