Ext.ns('Costo.Procesos.Nomencladores.GestCCNAE');
Costo.Procesos.Nomencladores.GestCCNAE.View = Ext.extend(Ext.Panel, {
    constructor: function(argument) {
        var scope = this;
        scope.url = '/contabilidad/contabilidad_costos/configuracion/index.php/gestioncentronivel/';

        Ext.applyIf(this, argument);
        Costo.Procesos.Nomencladores.GestCCNAE.View.superclass.constructor.call(this);

        var type = scope.type;

        var model = Costo.Procesos.Nomencladores.GestCCNAE.Model;
        model.init();

        this.init(perfil, model, this.etiquetas, type);

        var contoller = Costo.Procesos.Nomencladores.GestCCNAE.Controller;
        Costo.Procesos.Nomencladores.GestCCNAE.Controller.init(this.etiquetas, this, model);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();
        return this;
    },
    init: function(perfil, model, etiquetas, type) {

        this.crearMapadeTeclas = function() {
            //mapa de teclas
            this.keys = new Ext.KeyMap(this.getEl());
            this.keys.accessKey = function(key, handler, scope) {
                var h = function(n, e) {
                    e.preventDefault();
                    handler.call(scope || this, n, e);
                };
                this.on(key, h, scope);
            };

            //Adicionar
            this.keys.accessKey({
                key: 'i',
                alt: true
            }, function() {
                if (!this.btnAdicionar.disabled) {
                    this.btnAdicionar.handler.call();
                }
            }, this);

            //Modificar
            this.keys.accessKey({
                key: 'm',
                alt: true
            }, function() {
                if (!this.btnModificar.disabled) {
                    this.btnModificar.handler.call();
                }
            }, this);

            //Eliminar
            this.keys.accessKey({
                key: Ext.EventObject.DELETE
            }, function() {
                if (!this.btnEliminar.disabled) {
                    this.btnEliminar.handler.call();
                }
            }, this);

            //Heredar
            this.keys.accessKey({
                key: 'h',
                alt: true,
                ctrl: true
            }, function() {
                if (!this.btnHeredar.disabled) {
                    this.btnHeredar.handler.call();
                }
            }, this);

            //Vista reporte
            this.keys.accessKey({
                key: 'r',
                alt: true
            }, function() {
                if (!this.btnVistaPrevia.disabled) {
                    this.btnVistaPrevia.handler.call();
                }
            }, this);

            //Búsqueda avanzada
            this.keys.accessKey({
                key: 'b',
                alt: true
            }, function() {
                if (Ext.getCmp('btnBuscar')) {
                    this.keys.disable();
                    Ext.getCmp('btnBuscar').fireEvent('click');
                }
            }, this);
        };

        this.btnAdicionar = new Ext.Button({
            id: 'btnAdic',
            iconCls: 'adicionar',
            tooltip: (type == 1) ? etiquetas.tooltipAdicionarCC : etiquetas.tooltipAdicionarNAE,
            text: etiquetas.lbAdicionar,
            abreviatura: 'add_centrocostoNAE'
        });
        // validate.addButton(this.btnAdicionar);

        this.btnModificar = new Ext.Button({
            disabled: true,
            id: 'btnMod',
            iconCls: 'modificar',
            tooltip: (type == 1) ? etiquetas.tooltipModificarCC : etiquetas.tooltipModificarNAE,
            text: etiquetas.lbModificar,
            abreviatura: 'add_centrocostoNAE'
        });
        // validate.addButton(this.btnModificar);

        this.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEli',
            iconCls: 'eliminar',
            tooltip: (type == 1) ? etiquetas.tooltipEliminarCC : etiquetas.tooltipEliminarNAE,
            text: etiquetas.lbEliminar,
            abreviatura: 'del_centrocostoNAE'
        });
        validate.addButton(this.btnEliminar);
        this.btnVistaPrevia = new Ext.Button({
            id: 'btnVistReport',
            iconCls: 'vistareporte',
            tooltip: etiquetas.tooltipVistaReporte,
            text: etiquetas.lbVistaReporte,
            abreviatura: 'vReporte_centrocostoNAE'
        });
        validate.addButton(this.btnVistaPrevia);

        this.btnHeredar = new Ext.Button({
            id: 'btnHered',
            iconCls: 'heredar',
            hidden: (type == 1) ? false : true,
            disabled: (type == 1) ? false : true,
            tooltip: (type == 1) ? etiquetas.tooltipHeredarCC : etiquetas.tooltipHeredarNAE,
            text: etiquetas.lbHeredar,
            abreviatura: 'heredar_centrocostoNAE'
        });
        this.btnImportar = new Ext.Button({
            id:'btnImportar',
            hidden: (type == 1) ? false : true,
            disabled: (type == 1) ? false : true,
            text:'Importar', //etiquetas.lbBtnImportar,
            tooltip: etiquetas.lbTtImportar,
            //hidden: true,
            tabIndex: 314,
            iconCls: 'importar'
        });

        if(type == 1)
            validate.addButton(this.btnHeredar);

        this.btnAyuda = new Ext.Button({
            id: (type == 1) ? 'btnHelpCentro' : 'btnHelpNivel',
            iconCls: 'ayuda',
            tooltip: etiquetas.tooltipAyuda,
            text: etiquetas.lbAyuda
        });

        var config = {
            layout: 'fit',
            items: [{}],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnHeredar,this.btnImportar, this.btnVistaPrevia, '->', this.btnAyuda],
            listeners: {
                render: function() {
                    this.btnAdicionar.focus();
                }
            }
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Costo.Procesos.Nomencladores.GestCCNAE.View.superclass.initComponent.apply(this, arguments);

    },
    CrearWindw: function(Adicionar, model, etiquetas, titulo, tipo) {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            tooltip: etiquetas.tooltipCancelar,
            text: etiquetas.lbCancelar
        });
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            disabled: true,
            iconCls: 'aplicar',
            tooltip: etiquetas.tooltipAplicar,
            text: etiquetas.lbAplicar
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            disabled: true,
            iconCls: 'aceptar',
            tooltip: etiquetas.tooltipAceptar,
            text: etiquetas.lbAceptar
        });

        this.cbFormato = new Ext.form.ComboBox({
            store: model.stFormato,
            valueField: 'idformato',
            displayField: 'nombre',
            fieldLabel: etiquetas.lbFormLabelFormato,
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{nombre}</div></tpl>',
            emptyText: etiquetas.msEmptyTextCombo,
            triggerAction: 'all',
            mode: 'local',
            id: 'idFormato',
            name: 'formato',
            readOnly: true,
            editable: false,
            allowBlank: false,
            blankText: etiquetas.msgCampoObligatorio,
            enableKeyEvents: true
        });
        this.cbEstado = new Ext.form.ComboBox({
            store: model.stEstado,
            valueField: 'idestado',
            displayField: 'descripcion',
            fieldLabel: etiquetas.lbFormLabelEstado,
            anchor: '100%',
            emptyText: etiquetas.msEmptyTextCombo,
            triggerAction: 'all',
            mode: 'local',
            id: 'idEstado',
            name: 'estado',
            readOnly: true,
            allowBlank: false,
            blankText: etiquetas.msgCampoObligatorio,
            enableKeyEvents: true
        });
        this.tfCodigo = new Ext.form.TextField({
            // maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc])*$/,
            // regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc])*$/,
            maskRe: /^\d+$/,
            regex: /^\d+$/,
            maxLength: 8,
            name: 'codigo',
            fieldLabel: etiquetas.lbFormLabelCodigo,
            allowBlank: false,
            anchor: '100%',
            enableKeyEvents: true
        });

        this.txaDescripcion = new Ext.form.TextArea({
            name: 'descripcion',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\%\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\%\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\%\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\%\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]*)+$/,
            maxLength: 255,
            maxLengthText: etiquetas.msgMaxLength255,
            fieldLabel: etiquetas.lbFormLabelDescrip,
            allowBlank: false,
            enableKeyEvents: true
        });

        this.cbxCuenta = new Ext.contabilidad.util.linkedCombo({
            allowBlank: true,
            store: model.stCuenta,
            fieldLabel: 'Cuenta contable',
            maskRe: /[0-9.X|-]$/,
            displayField: 'denominacion',
            valueField: 'idcuenta',
            listHeight: 300,
            resizable: true,
            leafSelect: false,
            fnCreateNew: Ext.emptyFn
        });

        // para el modificar
        this.idCCNAE = new Ext.form.Hidden({
            name: 'idCCNAE',
            id: 'idCCNAE'
        });

        this.panelGest = new Ext.form.FormPanel({
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            height: (Adicionar) ? 250 : 300,
            width: 300,
            items: (Adicionar && tipo == 1) ?
                    [this.cbFormato, this.tfCodigo, /*this.cbxCuenta,*/ this.txaDescripcion]
                    : (!Adicionar && tipo == 1) ?
                    [this.idCCNAE, this.cbFormato, this.tfCodigo, this.cbEstado, /*this.cbxCuenta,*/ this.txaDescripcion]
                    : (Adicionar && tipo == 2) ?
                    [this.cbFormato, this.tfCodigo, this.txaDescripcion]
                    : [this.idCCNAE, this.cbFormato, this.tfCodigo, this.cbEstado, this.txaDescripcion]
        });

        this.ventana = new Ext.Window({
            title: (Adicionar) ? etiquetas.titleAdicionar + titulo : etiquetas.titleModificar + titulo,
            modal: true,
            resizable: false,
            constrain: true,
            defaultButton: 0,
            layout: 'fit',
            closeAction: 'close',
            items: [this.panelGest],
            buttons: (Adicionar) ? [this.btnCancelar, this.btnAplicar, this.btnAceptar] : [this.btnCancelar, this.btnAceptar]
        });

    },
    CrearWindwHeredar: function(model, etiquetas, titulo) {

        this.btnCancelarHeredar = new Ext.Button({
            id: 'btnCancelarHeredar',
            iconCls: 'cancelar',
            tooltip: etiquetas.tooltipCancelar,
            text: etiquetas.lbCancelar
        });

        this.btnAceptarHeredar = new Ext.Button({
            id: 'btnAceptarHeredar',
            disabled: true,
            iconCls: 'aceptar',
            tooltip: etiquetas.tooltipAceptar,
            text: etiquetas.lbAceptar
        });

        this.panelHeredar = new Ext.form.FormPanel({
            layout: 'fit',
            labelAlign: 'top',
            frame: true,
            items: [{}]
        });

        this.ventana = new Ext.Window({
            title: etiquetas.titleHeredar + titulo,
            modal: true,
            resizable: false,
            layout: 'fit',
            closeAction: 'close',
            constrain: true,
            defaultButton: 0,
            items: [this.panelHeredar],
            buttons: [this.btnCancelarHeredar, this.btnAceptarHeredar]
        });
    }
});

