Ext.ns('Costo.Procesos.Nomencladores.GestAct');
Costo.Procesos.Nomencladores.GestAct.View = Ext.extend(Ext.Panel, {
    constructor: function(argument) {
        var scope = this;

        scope.url = '/contabilidad/contabilidad_costos/configuracion/index.php/gestionactividades/',
                Ext.applyIf(this, argument);
        Costo.Procesos.Nomencladores.GestAct.View.superclass.constructor.call(this);

        var model = Costo.Procesos.Nomencladores.GestAct.Model;
        model.init();

        this.init(perfil, model, this.etiquetas);

        //var controller = Costo.Procesos.Nomencladores.GestAct.Controller;
        Costo.Procesos.Nomencladores.GestAct.Controller.init(this.etiquetas, this, model);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();
        return this;
    },
    init: function(perfil, model, etiquetas) {

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
                interval: 300,
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
        };

        this.btnAdicionar = new Ext.Button({
            id: 'btnAdic',
            iconCls: 'adicionar',
            tooltip: etiquetas.tooltipAdicionarAct,
            text: etiquetas.lbAdicionar,
            abreviatura: 'add_actividades'
        });
        validate.addButton(this.btnAdicionar);

        this.btnModificar = new Ext.Button({
            disabled: true,
            id: 'btnMod',
            iconCls: 'modificar',
            tooltip: etiquetas.tooltipModificarAct,
            text: etiquetas.lbModificar,
            abreviatura: 'add_actividades'
        });
        validate.addButton(this.btnModificar);

        this.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEli',
            iconCls: 'eliminar',
            tooltip: etiquetas.tooltipEliminarAct,
            text: etiquetas.lbEliminar,
            abreviatura: 'del_actividades'
        });
        validate.addButton(this.btnEliminar);

        this.btnVistaPrevia = new Ext.Button({
            id: 'btnVistReport',
            iconCls: 'vistareporte',
            tooltip: etiquetas.tooltipVistaReporte,
            text: etiquetas.lbVistaReporte,
            abreviatura: 'vReporte_actividades'
        });
        validate.addButton(this.btnVistaPrevia);

        this.btnHeredar = new Ext.Button({
            id: 'btnHered',
            iconCls: 'heredar',
            tooltip: etiquetas.tooltipHeredarAct,
            text: etiquetas.lbHeredar,
            hidden: true,
            abreviatura: 'heredar_actividades'
        });
        validate.addButton(this.btnHeredar);

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaActividad',
            iconCls: 'ayuda',
            tooltip: etiquetas.tooltipAyuda,
            text: etiquetas.lbAyuda
        });

        this.smActividad = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.searchField = new Ext.Cont.SearchField({
            id: 'searchField',
            //tabIndex: 12,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\:\;\&]*)+$/,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\:\;\&]*)+$/,
            maxLength: 255,
            width: 300,
            //maxLengthText: this.idioma.textMaxLength,
            //invalidText: this.idioma.lbInvalidText,
            //regexText: this.idioma.lbInvalidText,
            //lbTtlElement: this.idioma.lbSearchEntEcon,
            fnOnSearch: function() {
            },
            fnOnClear: function() {
            }
        });

        this.grid = new Ext.grid.GridPanel({
            store: model.stactividades,
            sm: this.smActividad,
            loadMask: true,
            frame: false,
            stripeRows: true,
            border: false,
            autoExpandColumn: 'expandir',
            viewConfig: {forceFit: true},
            columns: [{
                    hidden: true,
                    hideable: false,
                    sortable: true,
                    header: etiquetas.headerId,
                    dataIndex: 'idtipoactividad'
                }, {
                    sortable: true,
                    width: 20,
                    header: etiquetas.lbFormLabelCodigo,
                    dataIndex: 'codigo'
                }, {
                    id: 'expandir',
                    sortable: true,
                    header: etiquetas.lbFormLabelDescrip,
                    dataIndex: 'descripcion'
                }, {
                    width: 30,
                    sortable: true,
                    header: etiquetas.lbFormLabelTipo,
                    dataIndex: 'estado'
                }],
            //tbar: [this.searchField],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                //displayMsg: etiquetas.displayMsg,
                //emptyMsg: etiquetas.emptyMsg,
                //tabIndex: 314,
                store: model.stactividades
            })
        });

        var config = {
            layout: 'fit',
            items: this.grid,
            border: false,
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnHeredar, this.btnVistaPrevia, '->', this.btnAyuda]
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));
        Costo.Procesos.Nomencladores.GestAct.View.superclass.initComponent.apply(this, arguments);

    },
    CrearWindw: function(Adicionar, model, etiquetas) {

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

        this.tfCodigo = new Ext.form.TextField({
            id: 'tfCodigo',
            maskRe: /^\d+$/,
            regex: /^\d+$/,
            maxLength: 8,
            maxLengthText: etiquetas.msgMaxLength8,
            id: 'tfCodigo',
            name: 'numero',
            fieldLabel: etiquetas.lbFormLabelCodigo,
            allowBlank: false,
            anchor: '100%',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        this.txaDescripcion = new Ext.form.TextArea({
            id: 'txaDescripcion',
            name: 'descripcion',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,]*)+$/,
            maxLength: 255,
            maxLengthText: etiquetas.msgMaxLength255,
            fieldLabel: etiquetas.lbFormLabelDescrip,
            allowBlank: false,
            enableKeyEvents: true
        });

        this.cbTipo = new Ext.form.ComboBox({
            store: model.stTipo,
            valueField: 'idtipo',
            displayField: 'descripcion',
            fieldLabel: etiquetas.lbFormLabelTipo,
            anchor: '100%',
            emptyText: etiquetas.msEmptyTextCombo,
            triggerAction: 'all',
            mode: 'local',
            id: 'idTipo',
            name: 'Tipo',
            readOnly: true,
            allowBlank: false,
            blankText: etiquetas.msgCampoObligatorio,
            enableKeyEvents: true
        });

        this.panelGest = new Ext.form.FormPanel({
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            height: 200,
            width: 300,
            trackResetOnLoad: true,
            items: [this.tfCodigo, this.txaDescripcion, this.cbTipo]
        });

        this.ventana = new Ext.Window({
            title: (Adicionar) ? etiquetas.titleAdicionarAct : etiquetas.titleModificarAct,
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
                beforeshow: function(ventana) {
                    this.keys.disable();
                },
                show: function() {
                    Ext.getCmp('tfCodigo').focus(true, 500);
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