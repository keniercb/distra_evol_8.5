Ext.ns('Ext.aft.grupo');
/**
 * Jorge Luis Cuellar Mondeja
 */

Ext.aft.grupo.grid = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(config) {
        var _self = this;
        var etiq = config.etiq;
        var longitud_formato_mostrar;

        this.bodyStyle = 'margin: 0 0 0 0';
        this.iconCls = 'icon-grid';
        this.clicksToEdit = 1;
        this.autoExpandColumn = 'expandir';
        this.enableKeyEvents = true;
        this.tbar = _self.getTbar(etiq);

        this.sm = new Ext.grid.RowSelectionModel({
            moveEditorOnEnter: false,
            singleSelect: false,
            listeners: {
                'rowselect': function(sm, rowIndex, record) {
                    _self.smRowSelect(etiq, sm, rowIndex, record, _self);
                },
                'rowdeselect': function(sm, rowIndex, record) {
                    config.fnConfBotones(config.main);
                }
            }
        });

        this.btnAdicionarSubgrupos = config.btnAdicionarSubgrupos;
        this.btnAdicionarSubgrupos.on('click', function() {
            _self.btnAdicionarSubgrupos.disable();
            _self.gestSubGrupo(_self.etiq, true, longitud_formato_mostrar, _self.getSelectionModel());
        });

        this.btnModificarSubgrupos = config.btnModificarSubgrupos;
        this.btnModificarSubgrupos.on('click', function() {
            _self.btnModificarSubgrupos.disable();
            _self.gestSubGrupo(_self.etiq, false, longitud_formato_mostrar, _self.getSelectionModel());
        });

        this.btnEliminarSubGrupos = config.btnEliminarSubGrupos;
        this.btnEliminarSubGrupos.on('click', function() {
            _self.eliminarSubGrupo(_self.etiq);
        });

        this.store = new Ext.data.Store({
            url: 'cargarsubgrupos',
            listeners: {
                'beforeload': function(store) {
                    Ext.getBody().mask(etiq.lbMsgCargandoDatos, 'x-mask-loading');
                    if (_self.main.tree.getSelectionModel().getSelectedNode()) {
                        if (_self.main.tree.getSelectionModel().getSelectedNode().id != 0)
                            store.baseParams.idpadre = _self.main.tree.getSelectionModel().getSelectedNode().id;
                    }

                    store.baseParams.denominacion = _self.subgrupo.getValue();
                    store.baseParams.codigo = _self.codigosubg.getValue();
                    store.baseParams.idpadre = Ext.aft.grupoNodeSeleccionado.attributes.id;
                    store.baseParams.lft = Ext.aft.grupoNodeSeleccionado.attributes.lft;
                    store.baseParams.rgt = Ext.aft.grupoNodeSeleccionado.attributes.rgt;
                },
                'load': function(store) {
                    Ext.aft.grupo.rowIndexOld = -1;

                    if (store.getCount() > 0) {
                        _self.getSelectionModel().selectFirstRow();
                        _self.btnModificarSubgrupos.enable();
                        _self.btnEliminarSubGrupos.enable();
                    } else {
                        _self.btnModificarSubgrupos.disable();
                        _self.btnEliminarSubGrupos.disable();
                    }
                    Ext.getBody().unmask();
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos',
                id: "idgruposubgrupo"
            }, [
                {
                    name: 'idgruposubgrupo'
                },
                {
                    name: 'idtabla'
                },
                {
                    name: 'idtablageneral'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'nivel'
                },
                {
                    name: 'arrTablas'
                },
                {
                    name: 'arrTablasGeneral'
                },
                {
                    name: 'codigopadre'
                },
                {
                    name: 'codigopropio'
                },
                {
                    name: 'vidautil'
                },
                {
                    name: 'tasafiscalmin'
                },
                {
                    name: 'tasafiscalmax'
                },
                {
                    name: 'porcientorecuperacion'
                },
                {
                    name: 'idformato'
                },
                {
                    name: 'fechainicio'
                },
                {
                    name: 'fechafin'
                }
            ])
        });

        this.cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                width: 30,
                header: 'No.'
            }), {
                header: etiq.lbCodigo,
                width: 85,
                dataIndex: 'codigo',
                align: 'right'
            }, {
                id: 'expandir',
                header: etiq.lbDenominacion,
                width: 180,
                dataIndex: 'denominacion'
            }, {
                header: etiq.lbVidaUtil,
                width: 70,
                dataIndex: 'vidautil',
                align: 'right'
            }, {
                header: etiq.lbTasaFiscalMin,
                width: 100,
                dataIndex: 'tasafiscalmin',
                align: 'right',
                renderer: _self.getPorciento
            }, {
                header: etiq.lbTasaFiscalMax,
                width: 100,
                dataIndex: 'tasafiscalmax',
                align: 'right',
                renderer: _self.getPorciento
            }, {
                header: etiq.lbCmporcientorecuperacion,
                width: 120,
                dataIndex: 'porcientorecuperacion',
                align: 'right',
                renderer: _self.getPorciento
            }, {
                header: 'Fecha inicio',
                width: 80,
                dataIndex: 'fechainicio',
                align: 'center'
            }, {
                header: 'Fecha fin',
                width: 80,
                dataIndex: 'fechafin',
                align: 'center'
            }
        ]);

        this.bbar = new Ext.PagingToolbar({
            pageSize: 20,
            store: _self.store,
            displayInfo: true
        });

        Ext.aft.grupo.grid.superclass.constructor.apply(this, arguments);
    },
    smRowSelect: function(etiq, sm, rowIndex, record, grid) {
        var _self = this;
        grid.btnEliminarSubGrupos.enable();
        grid.btnModificarSubgrupos.enable();

        if (Ext.aft.grupo.rowIndexOld != rowIndex) {
            Ext.aft.grupo.rowIndexOld = rowIndex;
        }
    },
    getTbar: function(etiq) {

        var _self = this;

        this.codigosubg = new Ext.form.TextField({
            enableKeyEvents: true,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            maxLength: 20,
            maxLengthText: 'Solo admite n&uacute;mero(s) entero(s) de 20 dígito(s).',
            regexText: 'Solo admite n&uacute;mero(s) entero(s) de 20 dígito(s).',
            listeners: {
                'keyup': function(textfield, eventObj) {
                    if (eventObj.getCharCode() == 13) {
                        _self.store.reload();
                    }
                    if(_self.subgrupo.isDirty() || _self.codigosubg.isDirty()){
                        _self.btnBuscar.enable();
                        _self.btnLimpiar.enable();
                    }else {
                        _self.btnBuscar.disable();
                        _self.btnLimpiar.disable();
                    }
                },
                'keypress': function(t, e) {
                    validarCantidadCaracteres(t, 20, e);
                }
            }
        });

        this.subgrupo = new Ext.form.TextField({
            enableKeyEvents: true,
            regexText: etiq.lbValorIncorrectoTextArea,
            maxLength: 60,
            maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 60 caracteres.',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñü/(Ñ0-9]+)([/./,]?[-_\s/(]?[a-zA-ZÁÉÍÓÚáéíóúñü/)Ñ0-9])*$/,
            listeners: {
                'keyup': function(textfield, eventObj) {
                    if (eventObj.getCharCode() == 13) {
                        _self.store.reload();
                    }                    
                    if(_self.subgrupo.isDirty() || _self.codigosubg.isDirty()){
                        _self.btnBuscar.enable();
                        _self.btnLimpiar.enable();
                    }else {
                        _self.btnBuscar.disable();
                        _self.btnLimpiar.disable();
                    }
                },
                'keypress': function(t, e) {
                    validarCantidadCaracteres(t, 60, e);
                }
            }
        });
        this.btnBuscar = new Ext.Button({
            text: etiq.lbBtnBuscar,
            tooltip: etiq.lbTtBtnBuscarGrid,
            iconCls: 'buscar',
            disabled: true
        });

        this.btnBuscar.on('click', function() {
            _self.store.load({
                callback: function() {
                    if (_self.store.getCount() == 0) {
                        mostrarMensaje(1, _self.etiq.lbMsgBuscarGrupoSubgrupo);
                    }
                }
            });
        });
        this.btnLimpiar = new Ext.Button({
            text: etiq.lbBtnLimpiar,
            tooltip: etiq.lbTtBtnLimpiarGrid,
            iconCls: 'limpiar',
            disabled: true,
            handler: function() {
                _self.codigosubg.reset();
                _self.subgrupo.reset();
                _self.store.reload();
            }
        });

        return [
            new Ext.Toolbar.TextItem(etiq.lbCodigo + ':'), this.codigosubg, new Ext.Toolbar.TextItem('&nbsp;&nbsp;&nbsp;' + etiq.lbDenominacion + ':'), this.subgrupo, this.btnBuscar, this.btnLimpiar
        ];
    },
    getIcono: function(val) {
        if (val == 'si') {
            return '<img src="/logistica/utiles/comun/views/images/yes.png">';
        } else {
            return '<img src="/logistica/utiles/comun/views/images/no.png">';
        }
    },
    getPorciento: function(val) {
        return val + ' %';
    },
    gestSubGrupo: function(etiq, adicionar, longitud_formato_mostrar, sm) {
        var _self = this;
        if (!_self.ventana || !_self.ventana.isVisible()) {
            var fecha = new Date();
            if (adicionar == true) {
                var titulo = (!adicionar) ? etiq.lbTitleAdicionarSubGrupo : etiq.lbTitleAdicionarSubGrupo;
            } else {
                var titulo = (!adicionar) ? etiq.lbTitleModificarSubGrupo : etiq.lbTitleAdicionarSubGrupo;
            }
            var recordgrid = sm.getSelected();

            var idformato = (adicionar) ? Ext.aft.grupoNodeSeleccionado.attributes.idformato : recordgrid.data.idformato;

            var indexRecord = Ext.aft.grupo.stComboFormat.find('idformato', idformato);

            var recordFormat = Ext.aft.grupo.stComboFormat.getAt(indexRecord);

            var arrayPartes = (idformato) ? recordFormat.data.partes : [];

            var nivelnodo = Ext.aft.grupoNodeSeleccionado.getDepth();
            if (!adicionar) {
                nivelnodo = recordgrid.data.nivel - 1;
            }

            for (var i = 0; i < arrayPartes.length; i++) {
                if (arrayPartes[i].nivel == nivelnodo) {
                    longitud_formato_mostrar = arrayPartes[i].longitud;
                    break;
                }
            }
            _self.btnAceptar = new Ext.Button({
                text: etiq.lbBtnAceptar,
                tooltip: etiq.lbTtBtnAceptar + ' <b>(Enter)</b>',
                iconCls: 'aceptar',
                handler: function() {
                    _self.guardarSubGrupo(etiq, adicionar, true, _self.ventana, longitud_formato_mostrar);
                }
            });
            _self.btnAplicar = new Ext.Button({
                text: etiq.lbBtnAplicar,
                tooltip: etiq.lbTtBtnAplicar + ' <b>(Ctrl+Alt+P)</b>',
                iconCls: 'aplicar',
                hidden: (adicionar) ? false : true,
                handler: function() {
                    _self.guardarSubGrupo(etiq, adicionar, false, _self.ventana, longitud_formato_mostrar);// _self.resetDirty(Ext.getCmp('idFormulario'));
                }
            });
            _self.btnCancelar = new Ext.Button({
                text: etiq.lbBtnCancelar,
                tooltip: etiq.lbTtBtnCancelar + ' <b>(Alt+X)</b>',
                iconCls: 'cancelar',
                handler: function() {
                    _self.ventana.close();
                }
            });

            _self.startDate = new Ext.form.DateField({
                fieldLabel: 'Fecha inicio',
                xtype: 'datefield',
                vtype: 'daterange',
                name: 'fechainicio',
                id: "idFechaInicioSubg",
                //minValue: this.value ? this.value :fecha.format('d/m/Y'),
                endDateField: "idFechaFinSubg",
                value: fecha.format('d/m/Y'),
                anchor: '95%',
                format: 'd/m/Y',
                enableKeyEvents: true,
                mode: 'local',
                readOnly: true
            });
            _self.endDate = new Ext.form.DateField({
                fieldLabel: 'Fecha fin',
                xtype: 'datefield',
                vtype: 'daterange',
                name: 'fechafin',
                id: "idFechaFinSubg",
                startDateField: "idFechaInicioSubg",
                anchor: '95%',
                format: 'd/m/Y',
                enableKeyEvents: true,
                mode: 'local',
                allowBlank: true,
                readOnly: true
            });

            _self.formulario = new Ext.FormPanel({
                id: 'idFormulario',
                layout: 'border',
                labelAlign: 'top',
                frame: true,
                border: false,
                bodyStyle: 'padding:10px 10px 0',
                listeners: {
                    'clientvalidation': function(fp, valid) {
                        var checkdirty = false;

                        fp.getForm().items.each(function(field) {
                            if (field.isDirty() && valid) {
                                checkdirty = true;
                                _self.habilitarbotonesWinGest();
                            }
                        });
                        if (!checkdirty) {
                            _self.desabilitarbotonesWinGest();
                        }
                    }
                },
                items: [
                    {
                        region: 'north',
                        height: 30,
                        html: '<div style ="margin:2 0 0 10; font: 12px tahoma,arial,helvetica,sans-serif;" id="longcodigo_adicGrupoSubgrupo"></div>'
                    },
                    {
                        region: 'center',
                        //style: 'margin-left: 20px;',
                        bodyStyle: 'padding:10px 10px 0',
                        layout: 'form',
                        labelAlign: "top",
                        items: [
                            {
                                fieldLabel: etiq.lbDenominacion,
                                id: 'newdescripcion',
                                xtype: 'textarea',
                                anchor: '98%',
                                heidth: 100,
                                name: 'denominacion',
                                allowBlank: false,
                                regexText: etiq.lbValorIncorrectoTextArea,
                                regex: /^([a-zA-ZÁÉÍÓÚáéíóúñü/(Ñ0-9]+)([/./,]?[-_\s/(]?[a-zA-ZÁÉÍÓÚáéíóúñü/)Ñ0-9])*$/,
//                                regex: /^(([a-zA-ZáéíóúñüÑ0-9]+[\s]{0,1}[\,\.\_\-]{0,1})+|([\(]{1}([a-zA-ZáéíóúñüÑ0-9]+[\s]{0,1}[\,\.\_\-]{0,1}[\s]{0,1})+[\)]{1}[\s]{0,1})+)+$/,
                                enableKeyEvents: true,
                                maxLength: 255,
                                maxLengthText: etiq.lbMsgMaxLongDenominacion/*,
                                 listeners: {
                                 'keypress': function(t, e) {
                                 validarCantidadCaracteres(t, 255, e);
                                 }
                                 }*/
                            },
                            {
                                layout: 'column',
                                items: [
                                    {
                                        columnWidth: .50,
                                        layout: 'form',
                                        labelAlign: "top",
                                        items: [
                                            {
                                                fieldLabel: etiq.lbCodigo,
                                                regexText: "Solo admite número(s) entero(s) de " + longitud_formato_mostrar + " dígito(s).",
                                                xtype: 'textfield',
                                                id: 'newcodigo',
                                                name: 'codigo',
                                                anchor: '95%',
                                                enableKeyEvents: true,
                                                allowBlank: false,
                                                maskRe: /^[0-9]+$/,
                                                regex: /^[0-9]+$/,
                                                validator: function() {
                                                    if (Ext.getCmp('newcodigo').getValue().length == longitud_formato_mostrar) {
                                                        return true;
                                                    } else {
                                                        return "Solo admite número(s) entero(s) de " + longitud_formato_mostrar + " dígito(s).";
                                                    }
                                                },
                                                listeners: {
                                                    'keypress': function(t, e) {
                                                        validarCantidadCaracteres(t, longitud_formato_mostrar, e);
                                                    }
                                                },
                                                enableKeyEvents: true
                                            },
                                            {
                                                fieldLabel: etiq.lbTasaFiscalMin + ' (%)',
                                                xtype: 'numberfield',
                                                id: 'newtasafiscalMin',
                                                anchor: '95%',
                                                value: 0,
                                                name: 'tasafiscalmin',
                                                maxValue: 100,
                                                maxText: "El valor máximo requerido es 100.",
                                                allowBlank: false,
                                                //maskRe: /^([0-9-_/]+ ?[0-9-_/]*)+$/,
                                                regex: /^[\d]{1,3}(\.[\d]{1,2}){0,1}$/,
                                                regexText: etiq.lbValorNumIncorrecto,
                                                enableKeyEvents: true,
                                                maxLength: 5,
                                                maxLengthText: "Solo admite número(s) decimal(es) de hasta 2 dígitos despues de la coma.", //etiq.lbMsgMaxLong + ' ' + 3 + ' d&iacute;gito(s).',
                                                listeners: {
                                                    'valid': function(field) {
                                                        if (field.getValue() > 100) {
                                                            field.markInvalid("El valor máximo requerido es 100.");
                                                        }
                                                    },
                                                    'change': function(cmp) {
                                                        if (cmp.isValid()) {
                                                            if (!Ext.getCmp('newtasafiscalMax').getValue()) {
                                                                Ext.getCmp('newtasafiscalMax').setValue(this.getValue());
                                                            }
                                                            Ext.getCmp('newtasafiscalMax').minValue = this.getValue();
                                                            Ext.getCmp('newtasafiscalMax').validate();
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                fieldLabel: etiq.lbporcientorecuperacion,
                                                xtype: 'numberfield',
                                                anchor: '95%',
                                                id: 'newporcientorecuperacion',
                                                value: 0,
                                                name: 'porcientorecuperacion',
                                                allowBlank: false,
                                                //maskRe: /^([0-9-_/]+ ?[0-9-_/]*)+$/,
                                                regex: /^[\d]{1,3}(\.[\d]{1,2}){0,1}$/,
                                                regexText: "Solo admite número(s) decimal(es) de hasta 2 dígitos después de la coma.", //etiq.lbValorNumIncorrecto,
                                                enableKeyEvents: true,
                                                maxValue: 100,
                                                maxText: "El valor máximo requerido es 100.",
                                                maxLength: 5,
                                                maxLengthText: "Solo admite número(s) decimal(es) de hasta 2 dígitos después de la coma.", //etiq.lbMsgMaxLong + ' ' + 3 + ' d&iacute;gito(s).',
                                                listeners: {
                                                    'valid': function(field) {
                                                        if (field.getValue() > 100) {
                                                            //field.markInvalid("Solo admite número(s) entero(s) de 100 dígito(s).");
                                                            field.markInvalid("El valor máximo requerido es 100.");
                                                        }
                                                    },
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        columnWidth: .50,
                                        layout: 'form',
                                        labelAlign: "top",
                                        items: [
                                            {
                                                fieldLabel: etiq.lbVidaUtil,
                                                id: 'newvidautil',
                                                value: 0,
                                                anchor: '95%',
                                                allowBlank: false,
                                                name: 'vidautil',
                                                xtype: 'numberfield',
                                                maskRe: /^[0-9]+$/,
                                                regex: /^[0-9]+$/,
                                                regexText: "Solo admite número(s) entero(s) de 19 dígito(s).", //etiq.lbValorNumIncorrecto,
                                                enableKeyEvents: true,
                                                maxLength: 19,
                                                maxLengthText: "Solo admite número(s) entero(s) de 19 dígito(s).", //etiq.lbMsgMaxLong + ' ' + 19 + ' d&iacute;gito(s).'

                                            },
                                            {
                                                fieldLabel: etiq.lbTasaFiscalMax + ' (%)',
                                                xtype: 'numberfield',
                                                id: 'newtasafiscalMax',
                                                anchor: '95%',
                                                value: 0,
                                                name: 'tasafiscalmax',
                                                allowBlank: false,
                                                //maskRe: /^[\d]{1,3}(\.[\d]{1,2}){0,1}$/,
                                                maxValue: 100,
                                                maxText: "El valor máximo requerido es 100.",
                                                regex: /^[\d]{1,3}(\.[\d]{1,2}){0,1}$/,
                                                regexText: "Solo admite número(s) decimal(es) de hasta 2 dígitos después de la coma.", //etiq.lbValorNumIncorrecto,
                                                enableKeyEvents: true,
                                                maxLength: 5,
                                                maxLengthText: "Solo admite número(s) decimal(es) de hasta 2 dígitos después de la coma.", //etiq.lbMsgMaxLong + ' ' + 3 + ' d&iacute;gito(s).',
                                                listeners: {
                                                    'valid': function(field) {
                                                        if (field.getValue() > 100) {
                                                            //field.markInvalid("Solo admite número(s) entero(s) de 100 dígito(s).");
                                                            field.markInvalid("El valor máximo requerido es 100.");

                                                        }
                                                    },
                                                    'change': function(cmp) {
                                                        if (cmp.isValid()) {
                                                            if (!Ext.getCmp('newtasafiscalMin').getValue()) {
                                                                Ext.getCmp('newtasafiscalMin').setValue(this.getValue());
                                                            }
                                                            Ext.getCmp('newtasafiscalMin').maxValue = this.getValue();
                                                            Ext.getCmp('newtasafiscalMin').validate();
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            new Ext.form.FieldSet({
                                style: '-moz-border-radius:5px',
                                autoHeight: true,
                                layout: 'column',
                                anchor: '98%',
                                items: [
                                    {
                                        columnWidth: .49,
                                        layout: 'form',
                                        items: [
                                            _self.startDate
                                        ]
                                    },
                                    {
                                        columnWidth: .49,
                                        layout: 'form',
                                        items: [
                                            _self.endDate
                                        ]
                                    }
                                ]
                            })
                        ]
                    }
                ]
            });

            _self.ventana = new Ext.Window({
                title: titulo,
                width: 400,
                autoValidate: (!adicionar) ? false : true,
                constrain: true,
                height: 450,
                resizable: false,
                modal: true,
                layout: 'fit',
                listeners: {
                    'show': function() {

                        var valorCodigo = (longitud_formato_mostrar) ? longitud_formato_mostrar : '#';
                        if (Ext.getDom('longcodigo_adicGrupo')) {
                            Ext.getDom('longcodigo_adicGrupo').innerHTML = etiq.lbNivel + valorCodigo;
                        }

                        if (!adicionar) {
                            var record = _self.getSelectionModel().getSelected();
                            _self.formulario.getForm().loadRecord(record);
                            var longcodhijo = devolverLogitudFormato(record.get('idformato'), record.get('nivel') - 1);
                            var codigocomp = record.get('codigo');
                            Ext.getCmp('newcodigo').setValue(codigocomp.substring(codigocomp.length - longcodhijo));
                            _self.formulario.getForm().items.each(function(field) {
                                field.originalValue = field.getValue();
                            });
                        }
                    },
                    'close': function() {
                        _self.btnAdicionarSubgrupos.enable();
                        _self.btnModificarSubgrupos.enable();
                    },
                    render: function() {
                        _self.ventana.getKeyMap().addBinding({
                            key: Ext.EventObject.ENTER,
                            shift: false,
                            alt: false,
                            ctrl: false,
                            fn: function() {
                                _self.btnAceptar.handler.call(_self, _self.btnAceptar);
                            }
                        });
                        _self.ventana.getKeyMap().addBinding({
                            key: 'P',
                            shift: false,
                            alt: true,
                            ctrl: true,
                            fn: function() {
                                _self.btnAplicar.handler.call(_self, _self.btnAplicar);
                            }
                        });
                        _self.ventana.getKeyMap().addBinding({
                            key: 'X',
                            shift: false,
                            alt: true,
                            ctrl: false,
                            fn: function() {
                                _self.btnCancelar.handler.call(_self, _self.btnCancelar);
                            }
                        });
                    }
                },
                items: [
                    _self.formulario
                ],
                buttons: [
                    _self.btnCancelar,
                    _self.btnAplicar,
                    _self.btnAceptar
                ]
            });
            LOG.util.UIManager.reconfigureButtons(_self.ventana.buttons);
            _self.ventana.show();

            Ext.getDom('longcodigo_adicGrupoSubgrupo').innerHTML = etiq.lbNivel + longitud_formato_mostrar;
            Ext.getCmp('newdescripcion').focus(true, 50);
            _self.ventana.doLayout();
        }
    }, habilitarbotonesWinGest: function() {
        this.btnAplicar.enable();
        this.btnAceptar.enable();
    },
    desabilitarbotonesWinGest: function() {
        var _this = this;
        _this.btnAplicar.disable();
        _this.btnAceptar.disable();
    },
    guardarSubGrupo: function(etiq, adicionar, cerrar, ventana, longitud_formato_mostrar) {

        if (Ext.getCmp('idFormulario').getForm().isValid()) {

            var _self = this;

            var params = {
                'denominacion': Ext.getCmp('newdescripcion').getValue().trim(),
                'vidautil': Ext.getCmp('newvidautil').getValue(),
                'idpadre': Ext.aft.grupoNodeSeleccionado.attributes.id,
                'tasafiscalmin': Ext.getCmp('newtasafiscalMin').getValue(),
                'tasafiscalmax': Ext.getCmp('newtasafiscalMax').getValue(),
                'porcientorecuperacion': Ext.getCmp('newporcientorecuperacion').getValue(),
                'nivel': Ext.aft.grupoNodeSeleccionado.getDepth() + 1,
                'idformato': Ext.aft.grupoNodeSeleccionado.attributes.idformato,
                'longitudformato': Ext.aft.grupo.longitudtodosniveles,
                'fechainicio': _self.startDate.getRawValue(),
                'fechafin': _self.endDate.getRawValue()
            };

            if (!adicionar) {
                var record = _self.getSelectionModel().getSelected();

                params['idgrupo'] = record.get('idgruposubgrupo');

                params['codigo_anterior'] = record.get('codigo');

                params['codigo'] = record.get('codigo').substring(0, (record.get('codigo').length) - longitud_formato_mostrar) + Ext.getCmp('newcodigo').getValue();


            } else {
                params['cod_padre'] = Ext.aft.grupoNodeSeleccionado.attributes.codigo;
                params['codigo'] = Ext.aft.grupoNodeSeleccionado.attributes.codigo + Ext.getCmp('newcodigo').getValue();
            }

            if (_self.esFormularioValido(etiq, params, longitud_formato_mostrar)) {
                Ext.Ajax.request({
                    url: (adicionar) ? 'insertarsubgrupo' : 'modificarsubgrupo',
                    method: 'POST',
                    params: params,
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);

                        if (rd.cod == 1) {
                            mostrarMensaje(1, (adicionar) ? (etiq.lbMsgInsSubgrupo) : (etiq.lbMsgModSubgrupo));
                            acepta();
                        } else
                            mostrarMensaje(1, (adicionar) ? (etiq.lbsMsgDupSubgrupo) : (etiq.lbMsgModDupSubgrupo));

                        function acepta(btnPresionado) {

                            _self.store.reload();

                            if (cerrar)
                                ventana.close();
                            else {
                                Ext.getCmp('idFormulario').getForm().reset();
                            }

                        }
                    }
                });
            }
        } else {
            mostrarMensaje(1, etiq.lbMsgCamposIncorrectos);
            return false;
        }
    },
    esFormularioValido: function(etiq, params, longitud_formato_mostrar) {

        var newcodigo = params['cod_padre'] + params['codigo'];

        if (Ext.getCmp('newdescripcion').getValue().length == 0) {
            msg('newdescripcion');
        } else if (Ext.getCmp('newcodigo').getValue().length != longitud_formato_mostrar) {
            msg('newcodigo');
        } else if (Ext.getCmp('newtasafiscalMin').getValue().length == 0) {
            msg('newtasafiscalMin');
        } else if (Ext.getCmp('newtasafiscalMax').getValue().length == 0) {
            msg('newtasafiscalMax');
        } else if (Ext.getCmp('newtasafiscalMax').getValue().length > 100) {

        } else if (Ext.getCmp('newporcientorecuperacion').getValue().length == 0) {
            msg('newporcientorecuperacion');
        } else if (Ext.getCmp('newvidautil').getValue().length == 0) {
            msg('newvidautil');
        } else {
            return true;
        }

        function msg(id) {
            mostrarMensaje(1, etiq.lbMsgCamposIncorrectos);
            Ext.getCmp(id).focus(true, 50);
            Ext.getCmp(id).markInvalid();
            return false;
        }

    },
    eliminarSubGrupo: function(etiq) {

        var _self = this;

        function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                var arregloIdes = Array();
                var records = _self.getSelectionModel().getSelections();

                for (var i = 0; i < records.length; i++) {
                    arregloIdes[i] = records[i].get('idgruposubgrupo');
                }

                Ext.Ajax.request({
                    url: 'eliminarsubgrupo',
                    method: 'POST',
                    params: {
                        idgrupo: Ext.encode(arregloIdes),
                        idtabla: _self.getSelectionModel().getSelected().data.idtabla
                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);

                        if (rd.cod == 1) {
                            mostrarMensaje(1, etiq.lbMsgDelSubgrupo);
                            _self.store.reload();
                        }
                        else if (rd.cod == 2)
                            mostrarMensaje(3, etiq.lbMesag41);
                        else
                            mostrarMensaje(3, etiq.lbMesag42);
                    }
                });
            }
        }

        mostrarMensaje(2, etiq.lbMsgConfEliminarSubGrupo, eliminar);
    }
});