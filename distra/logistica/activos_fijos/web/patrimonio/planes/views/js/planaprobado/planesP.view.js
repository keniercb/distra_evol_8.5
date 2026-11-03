Ext.ns('LOG.aft.planes');
LOG.aft.planes.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.idioma = config.idioma;
        this.acciones = config.acciones;
        this.gridEditable = true;
        config.urlBusquedaGridPrincipal = 'cargarplanes';
        config.dirController = '/logistica/activos_fijos/patrimonio/planes/index.php/plan';
        //config.busquedaBasica = true;       
        LOG.aft.planes.View.superclass.constructor.call(this, config);
        this.modelo = new Ext.LOG.planes.Model({
            idioma: this.idioma,
            scope: this
        });

    },
    initDefaultButtons: function() {
        var _this = this;
        this.adicionarBtn = new LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.btnTtAdicionar,
            disabled: true,
            handler: function() {
                var winAdd = new LOG.aft.planes.adicionar({
                    idioma: _this.idioma,
                    scope: _this,
                });
                winAdd.show();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('btnAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.adicionarBtn);

        this.eliminarBtn = new LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.btnTtEliminar,
            disabled: true,
            handler: function() {
                mostrarMensaje(2, '¿Est&aacute; seguro que decea eliminar el plan seleccionado?', function(btnOK) {
                    if (btnOK == 'ok') {
                        // console.info(_this.smGridPrincipal);
                        //  console.info(_this.smGridPrincipal.selections);
                        var record = _this.smGridPrincipal.selections;
                        var arrayIdplan = new Array();
                        if (record.items.length > 0) {
                            for (var i = 0; i < record.items.length; i++) {
                                arrayIdplan.push(record.items[i].data.idplan);
                            }
                        }
                        _this.modelo.eliminarPlan(arrayIdplan);
                    }
                });
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('btnEliminar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.eliminarBtn);

        this.confirmarBtn = new LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.btnTtConfirmar,
            disabled: true,
            key: {
                ctrl: true,
                alt: true,
                shift: false,
                key: 'F'
            },
            handler: function() {
                mostrarMensaje(2, _this.idioma.msgConfirmar, function(btnOK) {
                    if (btnOK == 'ok') {

                        var record = _this.smGridPrincipal.selections;
                        var arrayIdplan = new Array();
                        if (record.items.length > 0) {
                            for (var i = 0; i < record.items.length; i++) {
                                if (record.items[i].data.estado == 1) {
                                    arrayIdplan.push(record.items[i].data.idplan);
                                }
                            }
                        }
                        var params = {
                            idplan: arrayIdplan,
                            idestado: 2
                        };
                        _this.modelo.confirmarAprobarCancelarPlan(params, _this.idioma.msgConfirmando);
                    }
                });
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('btnConfirmar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.confirmarBtn);

        this.aprobarBtn = new LOG.util.Prototipos.botonAprobar({
            tooltip: _this.idioma.btnTtAprobar,
            key: {
                key: "Q",
                shift: false,
                alt: true,
                ctrl: false
            },
            disabled: true,
            handler: function() {
                mostrarMensaje(2, _this.idioma.msgAprobar, function(btnOK) {
                    if (btnOK == 'ok') {

                        var record = _this.smGridPrincipal.selections;
                        var arrayIdplan = new Array();
                        if (record.items.length > 0) {
                            for (var i = 0; i < record.items.length; i++) {
                                if (record.items[i].data.estado == 2) {
                                    arrayIdplan.push(record.items[i].data.idplan);
                                }
                            }
                        }
                        var params = {
                            idplan: arrayIdplan,
                            idestado: 5
                        };
                        _this.modelo.confirmarAprobarCancelarPlan(params, _this.idioma.msgAprobandoPlan);
                    }
                });
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('btnAprobar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.aprobarBtn);

        this.cancelarestado = new LOG.util.Prototipos.botonAnularEstado({
            text: _this.idioma.tltCancelar,
            tooltip: _this.idioma.btnTtCancelar,
            disabled: true,
            handler: function() {
                mostrarMensaje(2, _this.idioma.msgCancelar, function(btnOK) {
                    if (btnOK == 'ok') {

                        var record = _this.smGridPrincipal.selections;
                        var arrayIdplan = new Array();
                        if (record.items.length > 0) {
                            for (var i = 0; i < record.items.length; i++) {
                                if (record.items[i].data.estado == 2) {
                                    arrayIdplan.push(record.items[i].data.idplan);
                                }
                            }
                        }
                        var params = {
                            idplan: arrayIdplan,
                            idestado: 1
                        };
                        _this.modelo.confirmarAprobarCancelarPlan(params, _this.idioma.msgCancelandoEstado);
                    }
                });
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('btnCancelEstatus')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.cancelarestado);
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idplan',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'estado',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idespecialidad',
            default: false
        });
        this.addGridColumn({
            header: _this.idioma.lbAnno,
            width: 150,
            dataIndex: 'ano',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'ano'
            }
        });
        var storeEstado = new Ext.data.SimpleStore({
                    fields: ['idestado', 'denominacionEstado'],
                    data: [
                        [1, 'Elaboraci\xF3n'],
                        [2, 'Preparado'],
                        [5, 'Aprobado']
                    ]
                });
        this.addGridColumn({
            header: _this.idioma.lbEstado,
            width: 150,
            //align: 'right',
            dataIndex: 'denominacionEstado',
            default: true,
           /* filter: {
                type: 'combo',
                store: storeEstado,
               // url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza',
                valueField: 'idestado',
                displayField: 'denominacionEstado',
                dataIndex: 'denominacionEstado',
            }   */
            filter: {
                type: 'list',
                options: [
                    [1, 'Elaboraci&oacute;n'],
                    [2, 'Preparado'],
                    [5, 'Aprobado']
                ],
                dataIndex: 'denominacionEstado'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbPlan,
            width: 150,
            //align: 'right',
            dataIndex: 'plan',
            default: true,
            editable: true,
            filter: {
                type: 'numeric',
                dataIndex: 'plan'
            },
            editor: new Ext.form.TextField({
                allowBlank: false,
                allowNegative: false,
                maskRe: /^[0-9]/,
                regex: /^[0-9]/,
                maxLength: 19,
                listeners: {
                    'change': function(field, newValue, oldValue) {
                        _this.modelo.onModificarPlan(newValue);
                    }
                }
            })
        });
        this.addGridColumn({
            header: _this.idioma.lbPropuestopor,
            width: 150,
            // align: 'right',
            dataIndex: 'propuestopor',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbAprobadopor,
            width: 150,
            //align: 'right',
            dataIndex: 'aprobadopor',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbEspecialidad,
            width: 150,
            dataIndex: 'denomespecialidad',
            default: true
        });
    },
    init: function() {
        LOG.aft.planes.View.superclass.init.call(this);
        var v = this;
        // v.getComboDepositos();
        var accionesData = new Array();
        for (var i = 0; i < v.acciones.length; i++) {
            switch (v.acciones[i].abreviatura) {
                case 'constAloj':
                    accionesData.push(['constAloj', 'Especialidad de Campamento']);
                    break;
                case 'sistemaEmp':
                    accionesData.push(['sistemaEmp', 'Especialidad de sistema empresarial']);
                    break;
                case 'ingenieria':
                    accionesData.push(['ingenieria', 'Especialidad de ingenieria']);
                    break;
                case 'vivienda':
                    accionesData.push(['vivienda', 'Especialidad de vivienda']);
                    break;
            }
        }
        v.storeEspecialidad = new Ext.data.SimpleStore({
            fields: ['idespecialidad', 'denominacionespecialidad'],
            data: accionesData,
            autoLoad: false
        });

        this.cmbEspecialidad = new LOG.util.ComboBox({
            name: 'idespecialidad',
            // fieldLabel: '',
            allowBlank: false,
            valueField: 'idespecialidad',
            displayField: 'denominacionespecialidad',
            store: v.storeEspecialidad,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            // emptyText: v.idioma.lbCbVacio,
            mode: 'local',
            //anchor: '100%',
            width: 250,
            listeners: {
                'select': function(combo, record) {

                    if (v.comboAreaResp.isDirty() && combo.isDirty()) {
                        v.adicionarBtn.enable();
                        v.getStorePrincipal().load({
                            params: {
                                identidad: v.comboAreaResp.getValue()
                            }
                        });
                    }
                }
            }
        });

        this.comboAreaResp = new LOG.util.ComboBox({
            name: 'idespecialidad',
            allowBlank: false,
            valueField: 'identidad',
            displayField: 'entidad',
            url: 'getentidad',
            editable: false,
            mode: 'local',
            width: 300,
            listeners: {
                'select': function(combo, record, index) {

                    if (v.cmbEspecialidad.isDirty() && combo.isDirty()) {
                        v.adicionarBtn.enable();
                    }
                    v.getStorePrincipal().load({
                        params: {
                            identidad: v.comboAreaResp.getValue()
                        }
                    });
                }
            }
        });

        /*   this.comboAreaResp = new LOG.aft.planes.ComboDepositos({
         allowBlank: false,
         disabled: false,
         typeAhead: true,
         idioma: v.idioma,
         anchor: '100%',
         listeners: {
         'select': function(combo, record, index) {
         v.getStorePrincipal().load({
         params: {
         identidad: v.comboAreaResp.getValue()
         }
         });
         }
         }
         });*/


        v.getPanelSuperior().onRender = v.getPanelSuperior().onRender.createSequence(function() {
            v.getPanelSuperior().add({
                border: false,
                tbar: ['-', '->', v.idioma.lbEspecialidad + ":", v.cmbEspecialidad, " ", v.idioma.lbareaResponsabilidad, v.comboAreaResp]
            });
            //  v.listaBotones.getItem(0).disable();
            v.getPanelSuperior().doLayout();
        });
    },
    render: function(cfg) {
        var vista = LOG.aft.planes.View.superclass.render.call(this, cfg);
        var _this = this;

        _this.getStorePrincipal().on({
            /* 'update': function(st, record) {               
             record.commit();   
             console.info(record);return;
             _this.modelo.onModificarPlan(record);
             },*/
            'beforeload': function(st) {
                st.initBaseParams.identidad = (_this.comboAreaResp.getValue()) ? _this.comboAreaResp.getValue() : null;
                st.initBaseParams.especialidad = (_this.cmbEspecialidad.getValue()) ? _this.cmbEspecialidad.getValue() : null;

            },
            'load': function(st) {

                /* if (st.getCount() == 0 )
                 mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificado.');
                 */
                if (st.getCount() == 0 /*&& busc == false*/)
                    mostrarMensaje(1, 'No existen datos que mostrar.');
                //  busc = false;            
                _this.eliminarBtn.disable();
                _this.confirmarBtn.disable();
                _this.aprobarBtn.disable();
                _this.cancelarestado.disable();
            }
        });

        _this.smGridPrincipal.on({
            'rowselect': function(sm, rowIndex, record) {
                /*Ext.each(sm.selections.items, function(rec, p) {
                 console.info(rec);
                 if (rec.data.estado != record.data.estado) {
                 sm.deselectRow(p);
                 }
                 });*/

                var index = rowIndex;
                _this.getValidarBtn(sm, index, record);
            },
            'rowdeselect': function(sm, rowIndex, record) {
                if (sm.getSelections().length == 0) {
                    _this.eliminarBtn.disable();
                    _this.confirmarBtn.disable();
                    _this.aprobarBtn.disable();
                    _this.cancelarestado.disable();
                }
            },
            'beforerowselect': function(sm, rowIndex, keepExisting, record) {
                if (record.data.estado != 1) {
                    _this.getGridPrincipal().getColumnModel().setEditable(2, false);
                } else {
                    _this.getGridPrincipal().getColumnModel().setEditable(2, true);
                }
            }

        });


        return vista;
    },
    getValidarBtn: function(sm, rowIndex, record) {
        var _this = this;
        if (sm.selections.items.length > 0) {
            var estad = sm.selections.items[0].data.estado;
            for (var i = 1; i < sm.selections.items.length; i++) {
                if (sm.selections.items[i].data.estado != estad) {
                    sm.clearSelections();
                    sm.selectRow(rowIndex);
                }
            }
            if (record.json.estado == 1) {
                _this.eliminarBtn.enable();
                _this.confirmarBtn.enable();
                _this.aprobarBtn.disable();
                _this.cancelarestado.disable();
            }
            if (record.json.estado == 2) {
                _this.eliminarBtn.disable();
                _this.confirmarBtn.disable();
                _this.aprobarBtn.enable();
                _this.cancelarestado.enable();
            }
            if (record.json.estado == 5) {
                _this.eliminarBtn.disable();
                _this.confirmarBtn.disable();
                _this.aprobarBtn.disable();
                _this.cancelarestado.disable();
            }
        } else {
            _this.eliminarBtn.disable();
            _this.confirmarBtn.disable();
            _this.aprobarBtn.disable();
            _this.cancelarestado.disable();
        }
    }
});