Ext.namespace('Contabilidad.Reporte.PanelEditor');

Contabilidad.Reporte.PanelEditor.View = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'east',
    width: 500,
    allowBlank: true,
    valor: [],
    disabledToolbar: false,
    initComponent: function () {
        this.crearCuerpo();
        this.addEvents('operadoradicionado');
        this.controller = new Contabilidad.Reporte.PanelEditor.Controller({
            view: this
        });
        this.controller.inicializarEventos();
        Contabilidad.Reporte.PanelEditor.View.superclass.initComponent.call(this);
    },

    crearCuerpo: function () {
        this.editor = new Contabilidad.EditorExpresiones.editor({
            frame: false,
            border: false
        });
        this.toolbar = new Contabilidad.Reporte.PanelEditor.Toolbar({
            disabled: this.disabledToolbar
        });
        this.tbar = this.toolbar;
        this.items = [this.editor];
    },

    esValido: function () {
        var valor = this.obtenerValor(),
            expvalida = this.editor.isValidExpresion();
        if (!this.allowBlank && valor.length != 0 && expvalida) {
            return true;
        } else if (this.allowBlank && expvalida) {
            return true;
        }
        return false;
    },

    cambiado: function () {
        var valor = Ext.encode(this.obtenerValor()),
            original = this.valorOriginal;
        if (valor != original) {
            return true;
        }
        return false;
    },

    obtenerValor: function () {
        return this.editor.controller.arrayElementos.items;
    },

    setValor: function (valor) {
        this.editor.controller.cargarExpresion(valor);
        if (!this.valorOriginal) {
            this.valorOriginal = Ext.encode(this.editor.controller.arrayElementos.items);
        }
    },

    resetar: function () {
        this.editor.controller.handlerBtnLimpiar();
    }
});

Contabilidad.Reporte.PanelEditor.Toolbar = Ext.extend(Ext.Toolbar, {
    operadores: ['+', '-','*','/', '(', ')', 'abs'],
    initComponent: function () {
        this.etiquetas = this.etiquetas || {};
        this.crearCuerpo();
        Contabilidad.Reporte.VentanaReporte.Toolbar.superclass.initComponent.call(this);
    },
    crearCuerpo: function () {
        this.btnSuma = new Ext.Button({
            type: 'operador',
            text: '+',
            eval: '+',
            minWidth: 30
        });

        this.btnResta = new Ext.Button({
            type: 'operador',
            text: '-',
            eval: '-',
            minWidth: 30
        });

        this.btnMultiplicacion = new Ext.Button({
            type: 'operador',
            text: '*',
            eval: '*',
            minWidth: 30
        });

        this.btnDivision = new Ext.Button({
            type: 'operador',
            text: '/',
            eval: '/',
            minWidth: 30
        });

        this.btnAbrir = new Ext.Button({
            type: 'operador',
            text: '(',
            eval: '(',
            minWidth: 30
        });

        this.btnCerrar = new Ext.Button({
            type: 'operador',
            text: ')',
            eval: ')',
            minWidth: 30
        });

        this.btnAbs = new Ext.Button({
            type: 'operador',
            text: 'abs',
            eval: 'Math.abs(',
            fn: 'abs',
            minWidth: 30
        });

        this.btnRetroceder = new Ext.Button({
            text: 'Retroceder',
            iconCls: 'izquierda'
        });

        this.btnLimpiar = new Ext.Button({
            text: 'Limpiar',
            iconCls: 'limpiar'
        });

        this.items = [this.btnSuma, this.btnResta, this.btnMultiplicacion, this.btnDivision, '-', this.btnAbrir, this.btnCerrar, '-', this.btnAbs, '->', this.btnRetroceder, this.btnLimpiar]
    }
});

Contabilidad.Reporte.PanelEditor.Controller = function (params) {

    Ext.apply(this, params);

    this.inicializarEventos = function () {

        this.view.toolbar.btnSuma.on({
            scope: this,
            click: function (btn) {
                this.adicionarOperador(btn);
            }
        });

        this.view.toolbar.btnResta.on({
            scope: this,
            click: function (btn) {
                this.adicionarOperador(btn)
            }
        });

        this.view.toolbar.btnMultiplicacion.on({
            scope: this,
            click: function (btn) {
                this.adicionarOperador(btn)
            }
        });

        this.view.toolbar.btnDivision.on({
            scope: this,
            click: function (btn) {
                this.adicionarOperador(btn)
            }
        });

        this.view.toolbar.btnAbrir.on({
            scope: this,
            click: function (btn) {
                this.adicionarOperador(btn)
            }
        });

        this.view.toolbar.btnCerrar.on({
            scope: this,
            click: function (btn) {
                this.adicionarOperador(btn)
            }
        });

        this.view.toolbar.btnAbs.on({
            scope: this,
            click: function (btn) {
                this.adicionarOperador(btn)
            }
        });

        this.view.toolbar.btnRetroceder.on({
            scope: this,
            click: function (btn) {
                this.view.editor.controller.handlerBtnRetroceder()
            }
        });

        this.view.toolbar.btnLimpiar.on({
            scope: this,
            click: function (btn) {
                this.view.editor.controller.handlerBtnLimpiar()
            }
        });
    };

    this.adicionarOperador = function (btn) {

        this.view.editor.controller.adicionarFuncion(btn, {
            type: btn.type,
            text: btn.text + (btn.fn ? '(' : ''),
            eval: btn.eval,
            fn: btn.fn
        });

        this.view.fireEvent('operadoradicionado');
    };
}