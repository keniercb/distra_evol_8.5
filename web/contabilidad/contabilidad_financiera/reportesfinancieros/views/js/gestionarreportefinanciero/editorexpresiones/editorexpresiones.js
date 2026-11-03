Ext.ns('Contabilidad.EditorExpresiones');

Ext.QuickTips.init();

Contabilidad.EditorExpresiones.operadores = {
    aritmeticos: ['+', '-'/*, '*', '/', '%'*/],
    logicos: ['&&', '||', '!'],
    comparacion: ['<', '<=', '>', '>=', '!=', '=='],
    agrupacion: ['(', ')']
};

Contabilidad.EditorExpresiones.funciones = {
    Math: ['abs']
}

Contabilidad.EditorExpresiones.ClickedLabel = Ext.extend(Ext.form.Label, {
    initComponent: function () {
        Contabilidad.EditorExpresiones.ClickedLabel.superclass.initComponent.call(this);
        this.addEvents("click", "dblclick");
    },
    onRender: function (ct, position) {
        Contabilidad.EditorExpresiones.ClickedLabel.superclass.onRender.apply(this, arguments);
        var c = this.getEl();
        c.on("click", this.onClick, this);
        c.on("dblclick", this.ondblClick, this);
    },
    onClick: function (e) {
        this.fireEvent("click", this, e);
    },
    ondblClick: function (e) {
        this.fireEvent("dblclick", this, e);
    }
});
Ext.reg('clickedlabel', Contabilidad.EditorExpresiones.ClickedLabel);

Contabilidad.EditorExpresiones.view_ToolbarOperadores = Ext.extend(Ext.Toolbar, {
    cls: 'toolbar-border',
    autoWidth: true,
    initComponent: function () {
        var me = this;
        var operadores = Contabilidad.EditorExpresiones.operadores;

        this.items = ['-',
            this.getArrayBtnOperadores(operadores.aritmeticos),
            /*'-',
             this.getArrayBtnOperadores(operadores.logicos),
             '-',
             this.getArrayBtnOperadores(operadores.comparacion),*/
            '-',
            this.getArrayBtnOperadores(operadores.agrupacion),
            '-'
        ];

        Contabilidad.EditorExpresiones.view_ToolbarOperadores.superclass.initComponent.call(this);

        me.addEvents('presionarboton');
    },
    getArrayBtnOperadores: function (arrayOperadores) {
        var arrayBtnOperadores = new Array();
        Ext.each(arrayOperadores, function (elem) {
            arrayBtnOperadores.push(this.getBtnOperador(elem));
        }, this);
        return arrayBtnOperadores;
    },
    getBtnOperador: function (operador) {
        return {
            xtype: 'button',
            text: operador,
            minWidth: 30,
            listeners: {
                click: this.handlerPresionadoBoton.createDelegate(this),
            }
        };
    },
    handlerPresionadoBoton: function (button) {
        this.fireEvent('presionarboton', button, this.getElementoOperador(button.getText()));
    },
    getElementoOperador: function (text) {
        return {
            type: 'operador',
            text: text,
            eval: text,
        };
    }
});

Contabilidad.EditorExpresiones.view_ToolbarFunciones = Ext.extend(Ext.Toolbar, {
    cls: 'toolbar-border',
    autoWidth: true,
    initComponent: function () {
        var me = this;
        var funciones = Contabilidad.EditorExpresiones.funciones;

        this.items = ['-',
            this.getArrayBtnFunciones('Math', funciones.Math),
            '-'
        ];

        Contabilidad.EditorExpresiones.view_ToolbarFunciones.superclass.initComponent.call(this);

        me.addEvents('presionarboton');
    },
    getArrayBtnFunciones: function (clase, arrayFunciones) {
        var arrayBtnFunciones = new Array();
        Ext.each(arrayFunciones, function (elem) {
            arrayBtnFunciones.push(this.getBtnFuncion(clase, elem));
        }, this);
        return arrayBtnFunciones;
    },
    getBtnFuncion: function (clase, funcion) {
        return {
            xtype: 'button',
            text: clase + '.' + funcion,
            minWidth: 30,
            listeners: {
                click: this.handlerPresionadoBoton.createDelegate(this)
            }
        };
    },
    handlerPresionadoBoton: function (button) {
        this.fireEvent('presionarboton', button, this.getElementoFuncion(button.getText()));
    },
    getElementoFuncion: function (text) {
        var fn = text,
            text = text + '(';
        return {
            type: 'operador',
            text: text,
            eval: text,
            fn: fn
        };
    }
});

Contabilidad.EditorExpresiones.view_ToolbarValoresEntrada = Ext.extend(Ext.Toolbar, {
    cls: 'toolbar-border',
    autoWidth: true,
    initComponent: function () {
        this.idiomaComun = Contabilidad.Comun.idioma;
        this.idioma = Contabilidad.EditorExpresiones.idioma;

        this.initCamposValores();

        this.items = [
            '-',
            this.idioma.lbLabelNumerico, this.nfValorNumerico, this.btnAddValorNumerico,
            '-',
            this.idioma.lbLabelTexto, this.tfValorTexto, this.btnAddValorTexto,
            '-',
        ];

        Contabilidad.EditorExpresiones.view_ToolbarValoresEntrada.superclass.initComponent.call(this);
    },
    initCamposValores: function () {

        this.nfValorNumerico = new Ext.form.NumberField({
            enableKeyEvents: true,
            width: 50,
            decimalPrecision: 5,
            allowNegative: false,
            maxValue: 999999,
            maxText: this.idioma.lbErrorValorNumericoMaxValue,
        });

        this.btnAddValorNumerico = new Ext.Button({
            iconCls: 'adicionar'
        });

        this.tfValorTexto = new Ext.form.TextField({
            width: 105,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d. ]+(\d*)?)+$/,
            regexText: this.idiomaComun.lbErrorCampoAlfaNumEspPunto,
            maxLength: 50,
            maxLengthText: this.idiomaComun.lbErrorCampoLongitud_50,
        });

        this.btnAddValorTexto = new Ext.Button({
            iconCls: 'adicionar'
        });
    },
    getElementoValorNumerico: function () {
        return {
            type: 'numero',
            text: this.nfValorNumerico.getValue(),
            eval: this.nfValorNumerico.getValue(),
        };
    },
    getElementoValorTexto: function () {
        return {
            type: 'texto',
            text: "'" + this.tfValorTexto.getValue() + "'",
            eval: "'" + this.tfValorTexto.getValue() + "'",
        };
    },
    resetValoresEntrada: function () {
        this.nfValorNumerico.reset();
        this.tfValorTexto.reset();
    },
});

Contabilidad.EditorExpresiones.view_ToolbarHerramientas = Ext.extend(Ext.Toolbar, {
    cls: 'toolbar-border',
    autoWidth: true,
    initComponent: function () {
        this.idiomaComun = Contabilidad.Comun.idioma;

        this.initBotonesHerramientas();

        this.items = [
            '-',
            this.btnRetroceder,
            '-',
            this.btnLimpiar,
            '-',
        ];

        Contabilidad.EditorExpresiones.view_ToolbarValoresEntrada.superclass.initComponent.call(this);
    },
    initBotonesHerramientas: function () {

        this.btnRetroceder = new Ext.Button({
            text: this.idiomaComun.lbBtnRetroceder,
            iconCls: 'izquierda'
        });

        this.btnLimpiar = new Ext.Button({
            text: this.idiomaComun.lbBtnLimpiar,
            iconCls: 'limpiar'
        });
    }
});

Contabilidad.EditorExpresiones.view_PanelElementosEdicion = Ext.extend(Ext.Panel, {
    region: 'south',
    height: 160,
    frame: true,
    border: false,
    initComponent: function () {
        this.idioma = Contabilidad.EditorExpresiones.idioma;

        this.initElementos();

        this.items = [
            {
                layout: 'column',
                border: false,
                items: [
                    {width: 180, border: false, layout: 'form', items: [this.fsOperadores]},
                    {width: 200, border: false, layout: 'form', items: [this.fsHerramientas]}
                ]
            }, this.fsFunciones
        ];

        Contabilidad.EditorExpresiones.view_PanelElementosEdicion.superclass.initComponent.call(this);
    },
    initElementos: function () {

        this.fsValores = new Ext.form.FieldSet({
            title: this.idioma.lbFsValores,
            width: 340,
            layout: 'form',
            autoHeight: true,
            items: this.vistas.tb_valores,
        });

        this.fsOperadores = new Ext.form.FieldSet({
            title: this.idioma.lbFsOperadores,
            width: 170,
            layout: 'form',
            autoHeight: true,
            items: this.vistas.tb_operadores,
        });

        this.fsHerramientas = new Ext.form.FieldSet({
            title: this.idioma.lbFsHerramientas,
            width: 200,
            layout: 'form',
            autoHeight: true,
            items: this.vistas.tb_herramientas,
        });

        this.fsFunciones = new Ext.form.FieldSet({
            title: this.idioma.lbFsFunciones,
            width: 170,
            layout: 'form',
            autoHeight: true,
            items: this.vistas.tb_funciones
        });
    }
});

Contabilidad.EditorExpresiones.view_ToolbarMsgValidator = Ext.extend(Ext.Toolbar, {
    cls: 'x-validationbar',
    error_cls: 'icondistra-false rojo',
    valid_cls: 'icondistra-true verde',

    initComponent: function () {
        this.idioma = Contabilidad.EditorExpresiones.idioma;
        this.error_text = this.idioma.lbMsgErrorExpresion,
            this.valid_text = this.idioma.lbMsgValidExpresion,

            Contabilidad.EditorExpresiones.view_ToolbarMsgValidator.superclass.initComponent.call(this);
    },
    afterRender: function () {
        Contabilidad.EditorExpresiones.view_ToolbarMsgValidator.superclass.afterRender.call(this);

        var right = this.validationAlign == 'right', td = Ext.get(this.nextBlock());
        if (right) {
            this.tr.appendChild(td.dom);
        } else {
            td.insertBefore(this.tr.firstChild);
        }

        this.validationEl = td.createChild({
            cls: (this.valid_cls || this.initIconCls || ''),
            html: this.valid_text || this.initText || ''
        });

        this.currIconCls = (this.valid_cls || this.initIconCls || '');

        this.validationEl.unselectable();
    },
    markInvalid: function (text) {
        this.error_text = text || this.error_text;
        this.setText(this.error_text);
        this.setIcon(this.error_cls);
        return this;
    },
    markValid: function (text) {
        this.valid_text = text || this.valid_text;
        this.setText(this.valid_text);
        this.setIcon(this.valid_cls);
        return this;
    },
    setText: function (text) {
        if (this.rendered) {
            this.validationEl.update(text);
        }
        return this;
    },
    setIcon: function (cls) {
        if (this.rendered) {
            if (this.currIconCls) {
                this.validationEl.removeClass(this.currIconCls);
                this.currIconCls = null;
            }
            if (cls.length > 0) {
                this.validationEl.addClass(cls);
                this.currIconCls = cls;
            }
        } else {
            this.currIconCls = cls;
        }
        return this;
    },
});

Contabilidad.EditorExpresiones.view_PanelEdicionExpresion = Ext.extend(Ext.Panel, {
    region: 'center',
    bodyStyle: 'body{cursor:link; padding:5px 5px 5px 5px;}',
    initComponent: function () {
        this.bbar = this.vistas.tb_msgvalidator;
        Contabilidad.EditorExpresiones.view_PanelEdicionExpresion.superclass.initComponent.call(this);
        this.addEvents('dblclickelem');
    },
    getElementoFormateado: function (config) {
        var element = {
            xtype: 'clickedlabel',
            style: 'cursor: pointer;',
            tooltip: config.tooltip,
            listeners: {
                dblclick: this.onDblClickElem.createDelegate(this),
                render: this.crearToolTipElemento,
                escope: this
            }
        }

        if (!Ext.isEmpty(config.text))
            element.text = " " + config.text;

        if (config.type)
            element.style = element.style + this.getStyleByTipoElemento(config.type);

        return element;
    },
    onDblClickElem: function (comp) {
        this.fireEvent('dblclickelem', comp.getItemId());
        this.remove(comp);
    },
    crearToolTipElemento: function (elem) {
        if (!Ext.isEmpty(elem.tooltip)) {
            new Ext.ToolTip({
                target: elem.getEl(),
                html: elem.tooltip.descripcion,
                title: elem.tooltip.title,
                autoHide: true,
                trackMouse: true,
            });
        }
    },
    getStyleByTipoElemento: function (type) {
        switch (type) {
            case 'operador' :
                return 'color: green;';
                break;
            case 'numero' :
                return 'color: red;';
                break;
            case 'texto' :
                return 'color: black;';
                break;
            case 'variable' :
                return 'color: blue;';
                break;
        }
    },
    pushElemento: function (config) {
        var compInsert = this.add(this.getElementoFormateado(config));
        this.doLayout();
        return compInsert.getItemId();
    },
    popElemento: function () {
        this.remove(this.items.last());
    },
    removeAllElementos: function () {
        if (this.items)
            this.items.each(function (comp) {
                this.remove(comp);
            }, this);
    },

});

Contabilidad.EditorExpresiones.controller_EditorExpresiones = function (config) {
    var idioma = Contabilidad.EditorExpresiones.idioma;
    var idiomaComun = Contabilidad.Comun.idioma;

    this.arrayElementos = new Ext.util.MixedCollection();

    this.init = function () {

        config.vistas.tb_operadores.on({
            'presionarboton': this.adicionarOperador,
            scope: this,
        });

        config.vistas.tb_funciones.on({
            'presionarboton': this.adicionarFuncion,
            scope: this
        });

        config.vistas.tb_valores.nfValorNumerico.on({
            'specialkey': this.handlerSpecialKeyValorNum,
            scope: this,
        });

        config.vistas.tb_valores.tfValorTexto.on({
            'specialkey': this.handlerSpecialKeyValorTexto,
            scope: this,
        });

        config.vistas.tb_valores.btnAddValorNumerico.on({
            'click': this.adicionarValorNum,
            scope: this,
        });

        config.vistas.tb_valores.btnAddValorTexto.on({
            'click': this.adicionarValorTexto,
            scope: this,
        });

        config.vistas.tb_herramientas.btnRetroceder.on({
            'click': this.handlerBtnRetroceder,
            scope: this,
        });

        config.vistas.tb_herramientas.btnLimpiar.on({
            'click': this.handlerBtnLimpiar,
            scope: this,
        });

        config.vistas.p_edicion.on({
            'dblclickelem': this.handlerDblClickElemento,
            scope: this,
        });

        if (config.vistas.comp_variableref) {
            config.vistas.comp_variableref.on({
                'insertarvariableref': this.adicionarVariableRef,
                scope: this,
            });
        }
    };

    this.handlerDblClickElemento = function (idelem) {
        this.arrayElementos.removeKey(idelem);
        this.validarExpresion();
    };

    this.getElementoVariableReferencia = function (configElem) {
        if (!Ext.isEmpty(configElem)) {
            return {
                type: 'variable',
                text: configElem.text,
                eval: 1,
                idref: configElem.id,
                tooltip: configElem.tooltip,
                config: configElem
            };
        }
        return null;
    };

    this.adicionarVariableRef = function (config) {
        var elem = this.getElementoVariableReferencia(config);
        if (!Ext.isEmpty(elem))
            this.adicionarElemento(elem);
    };

    this.adicionarOperador = function (button, elemOperador) {
        this.adicionarElemento(elemOperador);
    };

    this.adicionarFuncion = function (button, elemOperador) {
        this.adicionarElemento(elemOperador);
    };

    this.isValidValorEntrada = function (field) {
        return (field.isValid() && !Ext.isEmpty(field.getValue()) ) ? true : false;
    };

    this.handlerSpecialKeyValorNum = function (f, e) {
        if (e.getKey() == e.ENTER)
            this.adicionarValorNum();
    };

    this.handlerSpecialKeyValorTexto = function (f, e) {
        if (e.getKey() == e.ENTER)
            this.adicionarValorTexto();
    };

    this.adicionarValorNum = function () {
        var tb_valores = config.vistas.tb_valores;
        this.adicionarValorEntrada(tb_valores.nfValorNumerico, tb_valores.getElementoValorNumerico());
    };

    this.adicionarValorTexto = function () {
        var tb_valores = config.vistas.tb_valores;
        this.adicionarValorEntrada(tb_valores.tfValorTexto, tb_valores.getElementoValorTexto());
    };

    this.adicionarValorEntrada = function (field, elem) {
        if (this.isValidValorEntrada(field)) {
            this.adicionarElemento(elem);
            field.reset();
        }
    };

    this.adicionarElemento = function (elem) {
        var key = config.vistas.p_edicion.pushElemento(elem);
        this.arrayElementos.add(key, elem);
        this.validarExpresion();
    };

    this.handlerBtnRetroceder = function () {
        config.vistas.p_edicion.popElemento();
        this.arrayElementos.remove(this.arrayElementos.last());
        this.validarExpresion();
    };

    this.handlerBtnLimpiar = function () {
        config.vistas.p_edicion.removeAllElementos();
        this.arrayElementos.clear();
        this.validarExpresion();
    };

    this.validarExpresion = function () {
        if (this.isValidExpresion())
            config.vistas.tb_msgvalidator.markValid();
        else
            config.vistas.tb_msgvalidator.markInvalid();
    };

    this.isValidExpresion = function () {
        try {
            eval(this.getStringEspresionEvaluar());
        } catch (error) {
            return false;
        }
        return true;
    };

    this.getStringEspresionEvaluar = function () {
        var expresion = '';
        Ext.each(this.getArrayElementos(), function (elem) {
            expresion = expresion + ' ' + elem.eval;
        }, this);
        return expresion + ';';
    };

    this.getStringEspresionMostrar = function () {
        var expresion = '';
        Ext.each(this.getArrayElementos(), function (elem) {
            expresion = expresion + ' ' + elem.text;
        }, this);
        return expresion;
    };

    this.getArrayElementos = function () {
        return this.arrayElementos.getRange(0);
    };

    this.cargarExpresion = function (expresion) {
        if (Ext.isArray(expresion)) {
            this.handlerBtnLimpiar();
            Ext.each(expresion, function (elem) {
                this.adicionarElemento(elem);
            }, this);
        }
    };

    this.resetAllComponents = function () {
        this.handlerBtnLimpiar();
        config.vistas.tb_valores.resetValoresEntrada();
    };
};

Contabilidad.EditorExpresiones.editor = Ext.extend(Ext.Panel, {
    layout: 'border',
    border: false,
    initComponent: function () {
        var me = this;
        this.initApp();

        this.items = [{
            region: 'center',
            layout: 'border',
            border: false,
            frame: false,
            items: [this.panelEdicionExpresion/*, this.panelElementos*/]
        }];

        Contabilidad.EditorExpresiones.editor.superclass.initComponent.call(this);

        if (this.itemVarRef)
            this.add(this.panelVariablesRef);
    },
    initApp: function () {

        this.toolbar_Operadores = new Contabilidad.EditorExpresiones.view_ToolbarOperadores();

        this.toolbar_Funciones = new Contabilidad.EditorExpresiones.view_ToolbarFunciones();

        this.toolbar_Valores = new Contabilidad.EditorExpresiones.view_ToolbarValoresEntrada();

        this.toolbar_Herramientas = new Contabilidad.EditorExpresiones.view_ToolbarHerramientas();

        this.toolbar_msgvalidator = new Contabilidad.EditorExpresiones.view_ToolbarMsgValidator();

        this.panelEdicionExpresion = new Contabilidad.EditorExpresiones.view_PanelEdicionExpresion({
            margins: '5 5 5 5',
            vistas: {tb_msgvalidator: this.toolbar_msgvalidator},
        });

        this.panelElementos = new Contabilidad.EditorExpresiones.view_PanelElementosEdicion({
            vistas: {
                tb_operadores: this.toolbar_Operadores,
                tb_funciones: this.toolbar_Funciones,
                tb_valores: this.toolbar_Valores,
                tb_herramientas: this.toolbar_Herramientas
            },
            margins: '5 5 5 5',
        });

        this.panelVariablesRef = new Ext.Panel({
            layout: 'fit',
            autoWidth: true,
            region: 'west',
            margins: '5 0 5 5',
            border: false,
        });

        if (this.itemVarRef)
            this.panelVariablesRef.add(this.itemVarRef);

        this.controller = new Contabilidad.EditorExpresiones.controller_EditorExpresiones({
            vistas: {
                tb_operadores: this.toolbar_Operadores,
                tb_funciones: this.toolbar_Funciones,
                tb_valores: this.toolbar_Valores,
                tb_herramientas: this.toolbar_Herramientas,
                p_edicion: this.panelEdicionExpresion,
                tb_msgvalidator: this.toolbar_msgvalidator,
                comp_variableref: (this.itemVarRef) ? this.itemVarRef : null,
            }
        });

        this.controller.init();
    },
    cargarExpresion: function (expresion) {
        this.controller.cargarExpresion(expresion);
    },
    resetComponente: function () {
        this.controller.resetAllComponents();
    },
    getExpresion: function () {
        return {
            expresionstring: this.controller.getStringEspresionMostrar(),
            expresion: this.controller.getArrayElementos(),
        };
    },
    isValidExpresion: function () {
        return this.controller.isValidExpresion();
    }
});