Ext.ns('Costo.Procesos.Nomencladores.GestEGOG');
Costo.Procesos.Nomencladores.GestEGOG.View = Ext.extend(Ext.Panel, {
    constructor: function(argument) {
        var scope = this;

        scope.url = '/contabilidad/contabilidad_costos/configuracion/index.php/gestionelementoobjeto/';
        Ext.applyIf(this, argument);
        Costo.Procesos.Nomencladores.GestEGOG.View.superclass.constructor.call(this);

        var type = scope.type;

        var model = Costo.Procesos.Nomencladores.GestEGOG.Model;
        model.init();

        this.init(perfil, model, this.etiquetas, type);

        var controller = Costo.Procesos.Nomencladores.GestEGOG.Controller;
        Costo.Procesos.Nomencladores.GestEGOG.Controller.init(this.etiquetas, this, model);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos(true, true, false);
        return this;
    },
    init: function(perfil, model, etiquetas, type) {

        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        this.runner = new Ext.util.TaskRunner();
        this.tarea;

        this.startTaskValidation = function(form, accion, arrbotones) {
            this.tarea = {
                run: function() {
                    if (accion === 'add') {
                        if (form.isValid()) {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(false);
                            }
                        }
                        else {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(true);
                            }
                        }
                    }
                    else {
                        if (form.isValid() && form.isDirty()) {
//                        if (form.isValid() && this.formElementoChanged()) {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(false);
                            }
                        }
                        else {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(true);
                            }
                        }
                    }
                },
                interval: 100,
                scope: this
            };

            this.runner.start(this.tarea);
        };

        this.stopTaskValidation = function() {
            if (!Ext.isEmpty(this.tarea)) {
                this.runner.stop(this.tarea);
            }
        };
        
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
                key: Ext.EventObject.DELETE,
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
            disabled: !this.esRectora,
            tooltip: (type == 1) ? etiquetas.tooltipAdicionarEG : etiquetas.tooltipAdicionarOG,
            text: etiquetas.lbAdicionar,
            abreviatura: 'add_elementogasto'
        });
        validate.addButton(this.btnAdicionar);

        this.btnModificar = new Ext.Button({
            disabled: true,
            id: 'btnMod',
            iconCls: 'modificar',
            tooltip: (type == 1) ? etiquetas.tooltipModificarEG : etiquetas.tooltipModificarOG,
            text: etiquetas.lbModificar,
            abreviatura: 'add_elementogasto'
        });
        validate.addButton(this.btnModificar);

        this.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEli',
            iconCls: 'eliminar',
            tooltip: (type == 1) ? etiquetas.tooltipEliminarEG : etiquetas.tooltipEliminarOG,
            text: etiquetas.lbEliminar,
            abreviatura: 'del_elementogasto'
        });
        validate.addButton(this.btnEliminar);

        this.btnVistaPrevia = new Ext.Button({
            id: 'btnVistReport',
            iconCls: 'vistareporte',
            tooltip: etiquetas.tooltipVistaReporte,
            text: etiquetas.lbVistaReporte,
            abreviatura: 'vReporte_elementogasto'
        });
        validate.addButton(this.btnVistaPrevia);

        this.btnHeredar = new Ext.Button({
            id: 'btnHered',
            iconCls: 'heredar',
            hidden: true,
            disabled: true,
            tooltip: (type == 1) ? etiquetas.tooltipHeredarEG : etiquetas.tooltipHeredarOG,
            text: etiquetas.lbHeredar,
            abreviatura: 'heredar_elementogasto'
        });
        // validate.addButton(this.btnHeredar);

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaElemento',
            iconCls: 'ayuda',
            tooltip: etiquetas.tooltipAyuda,
            text: etiquetas.lbAyuda
        });

        var config = {
            layout: 'fit',
            items: [{}],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnHeredar, this.btnVistaPrevia, '->', this.btnAyuda]
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Costo.Procesos.Nomencladores.GestEGOG.View.superclass.initComponent.apply(this, arguments);

    },
    CrearWindw: function(Adicionar, model, etiquetas, titulo) {

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
            //name: 'Formato',
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
            //name: 'Estado',
            readOnly: true,
            allowBlank: false,
            blankText: etiquetas.msgCampoObligatorio,
            enableKeyEvents: true
        });
        this.tfCodigo = new Ext.form.TextField({
            maskRe: /^\d+$/,
            regex: /^\d+$/,
            maxLength: 8,
            maxLengthText: etiquetas.msgMaxLength8,
            id: 'tfCodigo',
            //name: 'numero',
            fieldLabel: etiquetas.lbFormLabelCodigo,
            allowBlank: false,
            anchor: '100%',
            selectOnFocus: true,
            enableKeyEvents: true
        });
        this.txaDescripcion = new Ext.form.TextArea({
            id: 'txaDescripcion',
            //name: 'descripcion',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]*)+$/,
            maxLength: 255,
            maxLengthText: etiquetas.msgMaxLength255,
            fieldLabel: etiquetas.lbFormLabelDescrip,
            allowBlank: false,
            enableKeyEvents: true
        });

        // para el modificar
        this.idEOG = new Ext.form.Hidden({
            //name: 'idEOG',
            id: 'idEOG'
        });

        this.checkDirectivo = new Ext.form.Checkbox({
            boxLabel: etiquetas.lbFormLabelDirectivo,
            id: 'directivo',
            hideLabel: true
        });

        this.panelGest = new Ext.form.FormPanel({
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            height: (Adicionar) ? 230 : 280,
            width: 300,
            trackResetOnLoad: true,
            items: (Adicionar) ? [this.cbFormato, this.tfCodigo, this.txaDescripcion, this.checkDirectivo] :
                    [this.cbFormato, this.tfCodigo, this.cbEstado, this.txaDescripcion, this.checkDirectivo]
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
            autoValidate: false,
            buttons: (Adicionar) ? [this.btnCancelar, this.btnAplicar, this.btnAceptar] : [this.btnCancelar, this.btnAceptar],
            listeners: {
                scope: this,
                show: function() {
                    Ext.getCmp('tfCodigo').focus(true, 500);

                    Ext.getCmp('directivo').on({
                        scope: this,
                        check: function(checkbox, checked) {
                            if (this.panelGest.getForm().isValid()) {
                                this.btnAceptar.enable();
                            }
                            else {
                                this.btnAceptar.disable();
                            }
                        }
                    });
                },
                beforeshow: function(ventana) {
                    this.keys.disable();
                },
                close: function(ventana) {
                    this.keys.enable();
                    this.btnAdicionar.focus();

                    this.stopTaskValidation();
                }
            }
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
            constrain: true,
            defaultButton: 0,
            layout: 'fit',
            closeAction: 'close',
            items: [this.panelHeredar],
            buttons: [this.btnCancelarHeredar, this.btnAceptarHeredar]
        });

    }
});