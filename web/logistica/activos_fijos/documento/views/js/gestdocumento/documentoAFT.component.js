/**
 * Created by yoendy on 10/30/2015.
 */
LOG.aft.documento.cmbBuscarOperaciones = function(scope) {
    scope.cmbBuscarOperaciones = new LOG.util.ComboBox({
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        hiddenName: 'idoperacion',
        valueField: 'idoperacion',
        displayField: 'denominacion',
        store: scope.getStoreOperaciones(),
        triggerAction: 'all',
        forceSelection: true,
        typeAhead: true,
        mode: 'local',
        width: 200,
        emptyText: scope.idioma.lbCbVacio

    });


    /* scope.cmbBuscarOperaciones.fireEvent = scope.cmbBuscarOperaciones.fireEvent.createSequence(function(e, cmb) {
     if ('select' == e) {
     //if (String(v.idEntidad) !== String(args)) {
     var params = {};
     scope.getStorePrincipal().initBaseParams.idoperacion = cmb.getValue();
     Ext.apply(params, scope.getStorePrincipal().initBaseParams);
     Ext.apply(params, scope.getStorePrincipal().limitParams);
     scope.getStorePrincipal().load({
     params: params
     });
     //}
     }
     });*/
    return scope.cmbBuscarOperaciones;
};
LOG.aft.documento.cmbBuscarEstado = function(scope) {
    scope.cmbBuscarEstado = new LOG.util.ComboBox({
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        hiddenName: 'idestatus',
        valueField: 'idestatus',
        displayField: 'denominacion',
        store: new Ext.data.SimpleStore({
            fields: ['idestatus', 'denominacion'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]]
            ]
        }),
        triggerAction: 'all',
        forceSelection: true,
        typeAhead: true,
        mode: 'local',
        width: 100,
        emptyText: scope.idioma.lbCbVacio,
        enableKeyEvents: true/*,
         listeners: {
         'specialkey': function (cmp, e) {
         if (e.getKey() == Ext.EventObject.ENTER) {
         scope.gridFilter.btnFiltar.handler();
         }
         }
         }*/
    });
    /* scope.cmbBuscarEstado.fireEvent = scope.cmbBuscarEstado.fireEvent.createSequence(function(e, args) {
     if ('select' == e) {
     //if (String(v.idEntidad) !== String(args)) {
     var params = {};
     scope.getStorePrincipal().initBaseParams.idestado = args.getValue();
     Ext.apply(params, scope.getStorePrincipal().initBaseParams);
     Ext.apply(params, scope.getStorePrincipal().limitParams);
     scope.getStorePrincipal().load({
     params: params
     });
     //}
     }
     });*/
    return scope.cmbBuscarEstado;
};
LOG.aft.documento.formBusqAvanzada = function(scope) {


    scope.storeTipoDoc = new Ext.data.Store({
        url: 'gettipodocumentos',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: "iddoc",
            root: 'datos'
        }, [
            {
                name: 'iddoc'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'iddocumentos'
            },
            {
                name: 'invTotal'
            }
        ]),
        listeners: {
            'beforeload': function(st, objeto) {
                if (scope.cmpGeneral != null && scope.cmpGeneral.cmpAreaRespWin) {
                    var nodeEntidad = scope.cmpGeneral.cmpAreaRespWin.dameNodoEntidadPertenece(scope.idarearesp);
                    st.baseParams.idestructura = nodeEntidad.attributes.id;
                } else {
                    st.baseParams.idestructura = scope.idarearesp;
                    st.baseParams.areaseleccionada = 'arearesp';
                    st.baseParams.operacionesEntrada = (scope.operacionesEntrada) ? 2 : -1;
                }
            },
            'load': function(st, records, options) {
                if (records.length > 0) {
                    scope.comboTipoDoc.enable();
                    scope.NroDoc.focus();
                }
            }
        }
    });
    //_this.storeOperaciones = _this.crearStoreOperaciones();
    //_this.createStoreAutor();

    scope.cmbFBuscarEstado = new LOG.util.ComboBox({
        anchor: '98%',
        name: 'idestado',
        fieldLabel: scope.idioma.lbCmbEstatus,
        hiddenName: 'idestado',
        valueField: 'idestatus',
        displayField: 'denominacion',
        emptyText: scope.idioma.lbCbVacio,
        store: new Ext.data.SimpleStore({
            fields: ['idestatus', 'denominacion'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]]
            ]
        }),
        mode: 'local',
        autoCreate: true,
        triggerAction: 'all',
        listeners: {
            /*'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             _this.btnBuscar.handler();
             }
             }*/
        }
    });
    scope.storeOperaciones = new Ext.data.Store({
        url: 'getoperaciones',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idoperacion'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idconcepto'
            },
            {
                name: 'operacioncontable'
            },
            {
                name: 'idcuenta'
            },
            {
                name: 'codigo'
            }
        ]),
        listeners: {
            'load': function(st, records, options) {
                if (records.length > 0) {
                    scope.comboOperaciones.enable();
                    scope.NroDoc.focus();
                }
            }

        }
    });
    scope.comboOperaciones = new LOG.util.ComboBox({
        name: 'idoperacion',
        fieldLabel: scope.idioma.lbcbOperaciones,
        valueField: 'idoperacion',
        disabled: true,
        displayField: 'denominacion',
        store: scope.storeOperaciones,
        mode: 'local',
        editable: true,
        emptyText: scope.idioma.lbCbVacio,
        listeners: {
            /*'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             _this.btnBuscar.handler();
             }
             }*/
        }
    });
    scope.comboAutor = new LOG.util.ComboBox({
        name: 'idusuario',
        fieldLabel: scope.idioma.hdCreador,
        valueField: 'idusuario',
        disabled: true,
        displayField: 'nombreusuario',
        url: 'damecombousuarios',
        mode: 'local',
        //editable: true,
        emptyText: scope.idioma.lbCbVacio,
        listeners: {
            /*'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             scope.btnBuscar.handler();
             }*/

        }
    });
    scope.comboAutor.getStore().on({
        'load': function(st, records, options) {
            if (records.length > 0) {
                scope.comboAutor.enable();
                scope.NroDoc.focus();
            }
        }
    });
    scope.comboAprobado = new LOG.util.ComboBox({
        name: 'aprobadopor',
        fieldLabel: scope.idioma.hdAprobador,
        valueField: 'idusuario',
        disabled: true,
        displayField: 'nombreusuario',
        url: 'damecombousuarios',
        mode: 'local',
        //editable: true,
        emptyText: scope.idioma.lbCbVacio,
        listeners: {
            /*'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             scope.btnBuscar.handler();
             }*/

        }
    });
    scope.comboAprobado.getStore().on({
        'load': function(st, records, options) {
            if (records.length > 0) {
                scope.comboAprobado.enable();
            }
        }
    });
    scope.comboTipoDoc = new LOG.util.ComboBox({
        name: 'iddoc',
        fieldLabel: scope.idioma.lbCMTipoDoc,
        valueField: 'iddoc',
        displayField: 'denominacion',
        store: scope.storeTipoDoc,
        mode: 'local',
        editable: true,
        emptyText: scope.idioma.lbCbVacio,
		resizable: true,
        listeners: {
            'select': function(combo, record, index) {
                scope.comboOperaciones.reset();
                scope.comboOperaciones.disable();
                var iddoc = scope.storeTipoDoc.getAt(index).data.iddoc;
                scope.storeOperaciones.baseParams.iddoc = iddoc;
                scope.storeOperaciones.load({
                    callback: function(records, options, success) {
                        if (records.length == 0) {
                            mostrarMensaje(3, scope.idioma.lbSinOperaciones);
                        }
                    }
                });
            }/*,
             'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             //scope.btnBuscar.handler();
             }
             }*/
        }
    });
    scope.NroDoc = new LOG.util.Prototipos.inputEntero({
        fieldLabel: scope.idioma.lbTxtNroDoc,
        name: 'nrodoc',
        listeners: {
            /*'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             scope.btnBuscar.handler();
             }
             }*/
        }
    });
    var validarFecha = function() {
        if (scope.FechaDesde.getValue()) {
            scope.FechaHasta.setMinValue(scope.FechaDesde.getValue());
        }
        if (scope.FechaHasta.getValue()) {
            scope.FechaDesde.setMaxValue(scope.FechaHasta.getValue());
        }
    };
    scope.FechaDesde = new Ext.form.DateField({
        anchor: '98%',
        fieldLabel: scope.idioma.lbCmbDesde,
        //readOnly: true,
        format: 'd/m/Y',
        name: 'desde',
        enableKeyEvents: true,
        emptyText: scope.idioma.lbCbVacio,
        listeners: {
            'focus': function(datefield, newValue, oldValue) {
                validarFecha();
            }/*,
             'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             scope.btnBuscar.handler();
             }
             }*/
        }
    });
    scope.FechaHasta = new Ext.form.DateField({
        anchor: '98%',
        fieldLabel: scope.idioma.lbCmbHasta,
        //readOnly: true,
        format: 'd/m/Y',
        name: 'hasta',
        enableKeyEvents: true,
        emptyText: scope.idioma.lbCbVacio,
        listeners: {
            'focus': function(datefield, newValue, oldValue) {
                validarFecha();
            }/*,
             'specialkey': function (cmp, e) {
             if (e.getKey() == Ext.EventObject.ENTER) {
             scope.btnBuscar.handler();
             }
             }*/
        }
    });
    var primerPanel = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    primerPanel.addComponent(scope.NroDoc);
    primerPanel.addComponent(scope.comboAutor);
    var segundoPanel = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    segundoPanel.addComponent(scope.comboTipoDoc);
    //segundoPanel.addComponent(scope.comboOperaciones);
  //  segundoPanel.addComponent(scope.cmbFBuscarEstado);
    segundoPanel.addComponent(new LOG.aft.documento.ComboDepositos({idioma: scope.idioma}));
    var tercerPanel = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    var fieldS = new Ext.form.FieldSet({
        style: 'margin-top: 10px;',
        title: scope.idioma.lbTitleRango,
        autoHeight: true,
        items: [scope.FechaDesde, scope.FechaHasta]
    });
    tercerPanel.addComponent(scope.comboAprobado);
    tercerPanel.addComponent(fieldS);
    var cuartoPanel = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    cuartoPanel.addComponent(segundoPanel);
    cuartoPanel.addComponent(tercerPanel);
    scope.formBusqAvanzada = LOG.util.UIManager.initPanel({
        //border: false,
        items: [primerPanel, cuartoPanel]/*,
         buttons : [
         {
         iconCls: 'cancelar',
         text: scope.idioma.lbBtnCancelar,
         tooltip: scope.idioma.lbBtnCancelarBusqAvanz,
         handler: function () {
         //scope.hide();
         }
         },
         {
         text: scope.idioma.lbBtnAceptar,
         iconCls: 'aceptar',
         tooltip: scope.idioma.lbBtnAceptarBusqAvanz,
         handler: function () {
         if (scope.NroDoc.isValid()) {
         scope.fn({
         idusuario: scope.comboAutor.getValue(),
         nrodoc: (scope.NroDoc.getValue() != '') ? scope.NroDoc.getValue() : null,
         idoperacion: scope.comboOperaciones.getValue(),
         idestado: scope.cmbBuscarEstado.getValue(),
         iddoc: scope.comboTipoDoc.getValue(),
         desde: scope.FechaDesde.getRawValue(),
         hasta: scope.FechaHasta.getRawValue()
         });
         //_this.hide();
         }
         }
         }
         ]*/

    });
    scope.panelBusquedaAvanzada.formularioBusqueda.on({
        'clientvalidation': function(fp, valid) {
            var checkdirty = false;
            fp.getForm().items.each(function(field) {
                if (field.isDirty() && valid) {
                    checkdirty = true;
                    scope.panelBusquedaAvanzada.listaBotones.getItem(2).enable();
                }
            });
            if (!checkdirty) {
                scope.panelBusquedaAvanzada.listaBotones.getItem(2).disable();
            }
        }
    });
    return scope.formBusqAvanzada;
};
LOG.aft.documento.winDocAdd = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.layout = 'border';
        this.resizable = false;
        this.width = 750;
        this.height = 450;
        this.modal = true;
        this.formulario = new LOG.util.List();
        this.model = new LOG.aft.documento.Model({
            idioma: config.idioma,
            scope: _this
        });
        LOG.aft.documento.winDocAdd.superclass.constructor.call(this, config);
        this.panelDatos();

    },
    initComponent: function(config) {
        var _this = this;
        LOG.aft.documento.winDocAdd.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                LOG.aft.documento.regNumAReparar.scope = null;
                Ext.getBody().unmask();
                _this.destroy();
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            hidden: (_this.datos_traslado) ? true : false,
            handler: function() {
                _this.scope.onAceprtarAdicionarDocumento('', _this.modificar);
            }
        });
        this.model.addActionButton(_this.listaBotones.getItem(1), true);

        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            handler: function() {
                _this.scope.onAceprtarAdicionarDocumento('close', _this.modificar, _this.datos_traslado);
            }
        });
        this.model.addActionButton(_this.listaBotones.getItem(2), true);

        (_this.modificar) ? this.listaBotones.getItem(1).setVisible(false) : '';
    },
    panelDatos: function() {
        var _this = this;
        this.fpGestionarDoc = LOG.util.UIManager.initForm({
            labelAlign: 'top',
            frame: false,
            autoWidth: true,
            autoHeight: true,
            items: _this.fields,
            trackResetOnLoad: true,
            listeners: {
                'add': function(tabP) {
                    if (_this.fpGestionarDoc) {
                        window.setTimeout(function() {
                            _this.model.bindForm(_this.fpGestionarDoc);
                            _this.fpGestionarDoc.getForm().items.each(function(field, pos) {
                                if (pos > 5) {
                                    field.on({
                                        'select': function() {
                                            field.fireEvent('blur');
                                        },
                                        'keypress': function() {
                                            field.fireEvent('blur');
                                        }
                                    })
                                }
                            });
                        }, 100);
                    }

                }
            }
        });


        /* this.fpGestionarDoc.on({
         'clientvalidation': function(fp, valid) {
         var checkdirty = false;
         fp.getForm().items.each(function(field) {                   
         if (field.getValue() && valid) {
         checkdirty = true;
         _this.listaBotones.getItem(1).enable();
         _this.listaBotones.getItem(2).enable();
         }
         });
         if (!checkdirty) {
         _this.listaBotones.getItem(1).disable();
         _this.listaBotones.getItem(2).disable();
         }
         }
         });*/
        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.clsPanel.addComponent({
            html: _this.idioma.lbEntidad + ':'
        });
        this.clsPanel.addComponent({
            html: _this.dat_fs.entidad
        });
        this.clsPanel.addComponent({
            html: _this.idioma.lbFecha + ':'
        });
        this.clsPanel.addComponent({
            html: _this.dat_fs.fecha
        });
        this.clsPanel.addComponent({
            html: _this.idioma.lbEstadoa + ':'
        });
        this.clsPanel.addComponent({
            html: _this.dat_fs.estado
        });
        this.fieldSet = new Ext.form.FieldSet({
            title: _this.idioma.lbTitleFieldSet,
            autoHeight: true,
            anchor: '100%',
            items: [_this.clsPanel]
        });
        this.datosdelDoc = LOG.util.UIManager.initPanel({
            frame: true,
            border: false,
            region: 'center',
            autoHeight: true,
            items: [_this.fieldSet, _this.fpGestionarDoc
            ]
        });
        this.model.bindForm(_this.fpGestionarDoc);
        this.add(this.datosdelDoc);
    }
});
var globarCentroCosto = null;
LOG.aft.documento.TabPanelWinGestionar = Ext.extend(Ext.TabPanel, {
    constructor: function(config) {
        this.idarea_seleccionada = config.idarea_seleccionada;
        this.idioma = config.idioma;
        this.anchor = '100%';
        this.height = 195;
        this.border = false;
        this.activeTab = 0;
        this.disable_comp = (config.disable_comp) ? true : false;
        this.datos = config.datos;
        this.modificar = config.modificar;
        this.area_selccionada = config.area_seleccinada;
        this.idoperacion = config.idoperacion;
        this.iddoc = config.iddoc;
        this.cmpGeneral = (config.cmpGeneral) ? config.cmpGeneral : null;
        this.nodoPadre = config.nodoPadre;
        this.smGrid = config.smGrid;
        this.iddocrecepcion = config.iddocrecepcion;
        this.idestructuracomun = config.idestructuracomun;
        Ext.apply(this, config);
        this.crearItems();
        this.listeners = {
            'tabchange': function(TabPanel, tab) {
                tab.doLayout();
            }
        }

        this.items = this.tabs;
        LOG.aft.documento.TabPanelWinGestionar.superclass.constructor.call(this, config);
    },
    crearItems: function() {
        this.crearTabPrincipal();
        this.tabs = [this.tabPrincipal];
    },
    crearComboTipoDoc: function(value) {
        var _this = this;
        this.areaseleccionada = 'arearesp';
        this.comboTipoDoc = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCMTipoDoc,
            editable: false,
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/gettipodocumentos',
            hiddenName: 'iddoc',
            valueField: 'iddoc',
            //disabled: true,
            displayField: 'denominacion',
            allowBlank: false,
            autoCreate: true,
            autoLoad: true,
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            anchor: '15%',
            listWidth: 250,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'select': function(combo, record, index) {
                    _this.comboOperaciones.reset();
                    //if (_this.comboCentroCosto)
                    //    _this.comboCentroCosto.reset();

                    var iddoc = _this.comboTipoDoc.store.getAt(index).data.iddoc;
                    _this.comboOperaciones.disable();
                    _this.storeOperaciones.baseParams.iddoc = iddoc;
                    _this.storeOperaciones.load({
                        callback: function(records, options, success) {

                            if (records.length == 0) {
                                mostrarMensaje(3, _this.idioma.lbSinOperaciones);
                                _this.comboOperaciones.disable();
                            } else {
                                _this.comboOperaciones.enable();
                                _this.comboTipoDoc.enable();
                            }
                        }
                    });
                    _this.eliminarTabSecundario();
                    _this.eliminarTabDatos();
                }
            }
        });
        _this.comboTipoDoc.getStore().on({
            'beforeload': function(st, records, options) {
                _this.comboTipoDoc.disable();
                _this.comboTipoDoc.setRawValue(_this.idioma.lbCbCargando);
                if (/*_this.cmpGeneral.idPadreNodoSeleccionado == _this.cmpGeneral.idNodoSeleccionado &&*/ _this.modificar == 'modificar') {
                    st.baseParams.idestructura = _this.smGrid.data.idestructura; //_this.cmpGeneral.idPadreNodoSeleccionado;
                    st.baseParams.areaseleccionada = 'arearesp';
                    st.baseParams.operacionesEntrada = (_this.operacionesEntrada) ? 2 : -1;
                    st.baseParams.iddoc = _this.smGrid.data.iddoc;
                } else {
                    st.baseParams.idestructura = _this.cmpGeneral.idPadreNodoSeleccionado;
                    // Verifico si el nodo seleccionado es una entidad o un area de responsabilidad                   
                    st.baseParams.areaseleccionada = _this.areaseleccionada;
                    st.baseParams.operacionesEntrada = (_this.operacionesEntrada) ? 2 : -1;
                }

            },
            'load': function(st, records, options) {
                _this.comboOperaciones.setRawValue(_this.idioma.lbCbVacio);                                
                if (records.length > 0) {
                    if (value) {
                        _this.comboTipoDoc.setValue(value);
                        _this.storeOperaciones.load();
                    } else {
                        if (_this.disable_comp == false) {
                            _this.comboTipoDoc.setRawValue(_this.idioma.lbCbVacio);
                            //_this.comboTipoDoc.enable();
                        }
                        _this.comboTipoDoc.enable();
                    }
                }
                //_this.comboTipoDoc.enable();
            }
        });
    },
    crearStoreOperaciones: function(value) {
        var _this = this;
        this.storeOperaciones = new Ext.data.Store({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getoperaciones',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            },
                [
                {
                    name: 'idoperacion'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'idconcepto'
                },
                {
                    name: 'operacioncontable'
                },
                {
                    name: 'idcuenta'
                },
                {
                    name: 'signo'
                },
                {
                    name: 'iddatosespecificos'
                },
                {
                    name: 'autogenerada'
                },
                {
                    name: 'idinterfaz'
                },
                {
                    name: 'codigo'
                }
            ]),
            listeners: {
                'beforeload': function(st, objeto) {
                    _this.comboOperaciones.disable();
                    _this.comboOperaciones.setRawValue(_this.idioma.lbCbCargando);
                    st.baseParams.idestructura = _this.cmpGeneral.idPadreNodoSeleccionado;
                    st.baseParams.idfuncionalidad = _this.cmpGeneral.idfuncionalidad;
                    st.baseParams.operacionesEntrada = _this.operacionesEntrada;
                },
                'load': function(st, records, options) {
                    _this.comboOperaciones.setRawValue(_this.idioma.lbCbVacio);
                    LOG.aft.documento.regNumAReparar.scope = null;
                    if (records.length > 0) {
                     
                        if (_this.disable_comp) {
                            _this.comboOperaciones.disable();
                        }
                   

                        if (value) {

                            var iddatosespecificos = null;
                            var signoOperacion = null;
                            var idinterfaz = null;
                            for (var i = 0; i < records.length; i++) {
                                if (records[i].data.idoperacion == value) {
                                    iddatosespecificos = records[i].data.iddatosespecificos;
                                    signoOperacion = records[i].data.signo;
                                    idinterfaz = records[i].data.idinterfaz;                                   
                                    _this.comboOperaciones.setValue(value);
                                    _this.cmpGeneral.operacionSeleccionada = records[i].data.codigo;
                                    break;
                                }
                            }
                            if (iddatosespecificos == null) {
                                mostrarMensaje(3, "La operacion no esta configurada. Revise que se esté usando en la entidad y que su rol tenga permisos para usar esta operacion.");
                            } else {
                                _this.crearTabSecundario(iddatosespecificos);
                                if (signoOperacion === '+' && idinterfaz != 22 && integradoCont && (idinterfaz == 29 || idinterfaz == 30 || idinterfaz == 50 || idinterfaz == 51) && _this.comboCentroCosto.getValue()) {
									_this.crearTabDatosDocumento(iddatosespecificos, idinterfaz);
                                }
                            }
                        } else {
                            //  Para impedir que seleccione una operacion que solo puede ser creada a travez de otro documento
                            for (var i = 0; i < records.length; i++) {
                                if (records[i].get('autogenerada') == '1') {
                                    st.remove(records[i]);
                                }

                            }
                        }
                    }
                }

            }
        });
    },
    crearComboOperaciones: function(value) {

        var _this = this;
        this.crearStoreOperaciones(value);
        this.comboOperaciones = new LOG.util.ComboBox({
            xtype: 'combobox',
            allowBlank: false,
            fieldLabel: _this.idioma.lbcbOperaciones,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabled: true,
            //id: (_this.regOperativo)?'cmboperacinRG':'cmboperacin',
            hiddenName: 'idoperacion',
            valueField: 'idoperacion',
            displayField: 'denominacion',
            store: _this.storeOperaciones,
            autoCreate: true,
            typeAhead: true,
            triggerAction: 'all',
            mode: 'local',
            emptyText: _this.idioma.lbCbVacio,
            anchor: '95%',
            listWidth: 250,
			resizable: true,
            listeners: {
                'select': function(combo, record, index) {
                    LOG.aft.documento.regNumAReparar.scope = null;
                    _this.eliminarTabSecundario();
                    _this.eliminarTabDatos();
                    
                    if(record.data.codigo == 'OPER_ALTA' || record.data.codigo == 'OPER_COMPRA' && _this.comboAreaResp.store.data.length < 0 ){
                        mostrarMensaje(2, "Debe asociar las áreas de responsabilidad de la entidad a los centros de costo.");
    
                    }
                    var iddatosespecificos = _this.storeOperaciones.getAt(index).data.iddatosespecificos;
                    var signooperacion = _this.storeOperaciones.getAt(index).data.signo;
                    var idinterfaz = _this.storeOperaciones.getAt(index).data.idinterfaz;
                    LOG.aft.documento.signooperacion = _this.storeOperaciones.getAt(index).data.signo;
                    _this.cmpGeneral.operacionSeleccionada = _this.storeOperaciones.getAt(index).data.codigo;
                    _this.idoperacion = _this.storeOperaciones.getAt(index).data.idoperacion;

                   /* if (!integradoCont && _this.storeOperaciones.getAt(index).data.codigo == "OPER_REC_INVENTARIO") {
                        _this.comboCentroCosto.show();
                        _this.doLayout();
                    }else if(!integradoCont && _this.storeOperaciones.getAt(index).data.codigo != "OPER_REC_INVENTARIO"){
                        _this.comboCentroCosto.hide();
                        _this.doLayout();
                    }*/


                    if (_this.cmpGeneral.operacionSeleccionada == 'OPER_INV_TOTAL'
                        || _this.cmpGeneral.operacionSeleccionada == 'OPER_INV_TOTAL_UH') {
                        _this.comboAreaResp.setValue(_this.cmpGeneral.idPadreNodoSeleccionado);
                        _this.comboAreaResp.setRawValue(_this.cmpGeneral.denomPadreNodoSeleccionado);


                        _this.comboAreaResp.disable();
                    } else {
                        _this.comboAreaResp.enable();
                    }                    
                    _this.crearTabSecundario(iddatosespecificos, _this.storeOperaciones.getAt(index).data.codigo);
                    if (signooperacion === '+') {
                        if (_this.comboAreaResp && _this.comboAreaResp.getValue() != '') {
                            if (_this.comboCentroCosto && _this.comboCentroCosto.getValue() == '') {
                                _this.comboCentroCosto.getStore().load();
                                if(_this.storeOperaciones.getAt(index).data.codigo != "OPER_REC_INVENTARIO"
                                    && _this.storeOperaciones.getAt(index).data.codigo != "OPER_REC_INV_EXT"
                                ){
                                    _this.comboCentroCosto.allowBlank = false;
                                }else{
                                    _this.comboCentroCosto.allowBlank = false;
                                }
                            }
                        }
                    }

					if (signooperacion === '+' && idinterfaz != 22 && integradoCont 
						&& _this.comboCentroCosto.getValue() != '' 
						&& (idinterfaz == 29 || idinterfaz == 30 || idinterfaz == 50 || idinterfaz == 51)) {
						_this.crearTabDatosDocumento(iddatosespecificos, idinterfaz);
                    }
                    if (signooperacion === '-') {
                        _this.comboCentroCosto.disable();
                        if (_this.comboCentroCosto.getValue() != null) {
                            _this.comboCentroCosto.reset();
                        }
                    }
                },
                'enable': function(cb) {
                    cb.focus();
                    cb.validate();
                    cb.fireEvent('blur');
                }
            }
        });
    },
    crearStoreCentroCosto: function(value) {
        var _this = this;
        this.storeCentroCosto = new Ext.data.Store({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getcentrocosto',
            listeners: {
                'beforeload': function(st, objeto) {
                    _this.comboCentroCosto.disable();
                    _this.comboCentroCosto.setRawValue(_this.idioma.lbCbCargando);
                    var nodeEntidad = {
                        attributes: {
                            text: _this.comboAreaResp.getRawValue(),
                            id: _this.comboAreaResp.getValue()
                        }
                    };
                    //  IdArea seleccionada
                    st.baseParams.idarea = _this.comboAreaResp.getValue();
                    //  IdEstructura padre del area seleccionada
                    st.baseParams.idestructurapadre = _this.cmpGeneral.idPadreNodoSeleccionado;
                    st.baseParams.idcuenta = _this.comboOperaciones.getValue();
                },
                'load': function(st, r, options) {

                    _this.comboCentroCosto.setRawValue(_this.idioma.lbCbVacio);
                    if (r.length == 0 && _this.comboAreaResp.getValue() != 1) {
                        _this.eliminarTabDatos();
                    } else {
                        if (!_this.disable_comp && _this.modificar != 'modificar') {
                            _this.comboCentroCosto.enable();
                        }
                        if (value) {
                            _this.comboCentroCosto.setValue(value);
                        }
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                id: 'idcentro',
                root: "datos",
            }, [
                {
                    name: 'id'
                },
                {
                    name: 'descripcion'
                }
            ])
        });
    },
    crearComboCentroCosto: function(value) {
        var _this = this;
        this.crearStoreCentroCosto(value);
        this.comboCentroCostoHidden = new Ext.form.Hidden({
			name: "idcentrocosto"
		});
        this.comboCentroCosto = new LOG.util.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
            hiddenName: 'idcentrocostocmb',
            fieldLabel: _this.idioma.lbcbCentroCosto,
            valueField: 'id',
            disabled: true,
            displayField: 'descripcion',
            store: _this.storeCentroCosto,
            autoCreate: true,
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            editable: false,
            mode: 'local',
            emptyText: _this.idioma.lbCbVacio,
            anchor: '95%',
            listWidth: 250,
			allowBlank :false,
            listeners: {
                'select': function(combo, record, index) {
                    if (combo.getValue()) {
						_this.comboCentroCostoHidden.setValue(combo.getValue());
					}
                    combo.fireEvent('blur');
                    LOG.aft.documento.centroCosto = _this.comboCentroCosto;
                    globarCentroCosto = record.data.id;
					
                    if (_this.storeOperaciones.data.items.length > 0) {
                        for (var i = 0; i < _this.storeOperaciones.data.items.length; i++) {
                            if (_this.storeOperaciones.data.items[i].data.idoperacion == _this.comboOperaciones.getValue()) {
                                var signooperacion = _this.storeOperaciones.data.items[i].data.signo;
                                var idinterfaz = _this.storeOperaciones.data.items[i].data.idinterfaz;
								var iddatosespecificos = _this.storeOperaciones.data.items[i].data.iddatosespecificos;
                                break;
                            }
                        }
                    }                   
                    if (signooperacion === '+' && (idinterfaz == 29 || idinterfaz == 30 || idinterfaz == 50 || idinterfaz == 51)) {
						_this.crearTabDatosDocumento(iddatosespecificos, idinterfaz);
                    }
                    
                    
                }
            }
        });
    },
    crearTabPrincipal: function() {
        
        var _this = this;
        if (_this.datos) {
            var tipodoc = (_this.datos.get('iddoc')) ? _this.datos.get('iddoc') : false;
            var oper = (_this.datos.get('iddoc')) ? _this.datos.get('idoperacion') : false;
            var centrocosto = (_this.datos.get('iddoc')) ? _this.datos.get('idcentrocosto') : false;
            var idareaResp = (_this.datos.get('iddoc')) ? _this.datos.get('idarearesp') : false;
            var codigooperacion = (_this.datos.get('iddoc')) ? _this.datos.get('codigooperacion') : false;
        } else {
            if (_this.iddoc != null && _this.idoperacion != null) {
                var tipodoc = _this.iddoc;
                var oper = _this.idoperacion;
            }
        }
        this.crearComboTipoDoc(tipodoc);
        this.crearComboOperaciones(oper);
        this.comboAreaResp = new LOG.aft.documento.ComboDepositos({
            allowBlank: false,
            // autoCreate: false,
            disabled: true,
			resizable: true,
            typeAhead: true,
            //name: 'idestructuracomun',
            // triggerAction: 'all',
            //  resizable: true,
            idioma: _this.idioma,
            anchor: '95%',
            listWidth: 250,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'select': function(combo, record, index) {
                    combo.fireEvent('blur');
                    if (this.tabDatos) {
                        this.tabDatos.disable();
                    }
                    if (LOG.aft.documento.signooperacion != "-") {
                        if (_this.comboCentroCosto) {
                            _this.comboCentroCosto.enable();
                            _this.comboCentroCosto.getStore().load();
                        }
                    }
                }
            }
        });
        _this.comboAreaResp.getStore().on({
            'beforeload': function(st, records, options) {
            },
            'load': function(st, records, options) {
                if (records.length > 0) {
                    if (idareaResp) {

                        if (codigooperacion == 'OPER_INV_PARCIAL' || codigooperacion == 'OPER_INV_PAR_MENSUAL' || codigooperacion == 'OPER_INV_TOTAL') {
                            var arrayAreas = _this.datos.get('idareasInventario').split(',');
                            if (arrayAreas.length > 1 || codigooperacion == 'OPER_INV_TOTAL')
                                _this.comboAreaResp.setRawValue(_this.cmpGeneral.denomPadreNodoSeleccionado);
                            else
                                _this.comboAreaResp.setValue(idareaResp);
                        }else{
                            _this.comboAreaResp.setValue(idareaResp);
                        }
                        if (centrocosto) {
                            _this.comboCentroCosto.getStore().load();
                        }


                    } else {
                        if (_this.disable_comp == false) {
                            _this.comboAreaResp.setRawValue(_this.idioma.lbCbVacio);
                            _this.comboAreaResp.enable();
                        }
                    }
                } else {
                    mostrarMensaje(2, _this.idioma.areanull);
                }
            }
        });
        LOG.aft.documento.comboAreaRespAdd = _this.comboAreaResp;

       // if (integradoCont) {
            this.crearComboCentroCosto(centrocosto);
       // }

        this.cPanel = LOG.util.UIManager.initColumnForm({
            columnas: (_this.comboCentroCosto) ? 4 : 3
        });
        this.cPanel.addComponent(_this.comboTipoDoc);
        this.cPanel.addComponent(_this.comboOperaciones);
        this.cPanel.addComponent(_this.comboAreaResp);
        this.cPanel.addComponent((_this.comboCentroCosto) ? _this.comboCentroCosto : {});
        this.cPanel.addComponent((_this.comboCentroCostoHidden) ? _this.comboCentroCostoHidden : {});
        this.norte = LOG.util.UIManager.initPanel({
            frame: false,
            region: 'center',
            layout: 'form',
            anchor: '100%',
            autoHeight: true,
            bodyStyle: 'padding: 10px 10px 0 10px; margin-bottom:10px',
            labelWidth: 50,
            defaults: {
                anchor: '101%',
                msgTarget: 'side'
            },
            items: [this.cPanel]
        });
        /*this.norte = new Ext.Panel({
         layout: 'column',
         region: 'center',
         border: false,
         bodyBorder: false,
         items: [
         {
         columnWidth: .33,
         labelAlign: 'top',
         layout: 'form',
         items: _this.comboTipoDoc
         },
         {
         columnWidth: .33,
         labelAlign: 'top',
         layout: 'form',
         items: _this.comboOperaciones
         },
         {
         columnWidth: .33,
         labelAlign: 'top',
         layout: 'form',
         items: (_this.comboCentroCosto) ? _this.comboCentroCosto : {}
         }
         ]
         });*/

        this.obs = LOG.util.UIManager.initPanel({
            region: 'sourth',
            anchor: '90%',
            border: false,
            bodyBorder: false,
            items: [
                {
                    html: _this.idioma.lbObservaciones + ':'
                },
                new Ext.form.TextArea({
                    name: 'observaciones',
                    id: 'idobservaciones',
                    width: 695,
                    value: (_this.modificar == 'modificar') ? _this.datos.get('observaciones') : '',
                    fieldLabel: _this.idioma.lbObservaciones,
                    disabled: (_this.disable_comp) ? true : false,
                    maxLength: 255,
                    maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
                    minLengthText: _this.idioma.lbMsgMinLongDescripcion
                })
            ]

        });
        this.tabPrincipal = {
            title: _this.idioma.lbTitleTabPrincipal,
            frame: true,
            border: false,
            bodyBorder: false,
            bodyStyle: 'padding:5px 5px 0',
            items: [this.norte, this.obs]
        };
    },
    crearTabDatosDocumento: function(iddatosespecificos, idinterfaz) {
		var _this = this;
        if (_this.datos_traslado == undefined) {
            this.tabDatos = getItemsDatosDocumento(_this.idioma, _this.modificar, _this.datos, 
													_this.iddocrecepcion, _this.idestructuracomun, 
													_this.idarea_seleccionada, _this.nodoPadre, this, 
													LOG.aft.documento.centroCosto,iddatosespecificos, idinterfaz 
			);
            this.add(this.tabDatos);
        }

    },
    crearTabSecundario: function(datosespecificos, codigooperacion) {
        var _this = this;
        switch (datosespecificos) {
            case '1':
                {

                    if (_this.modificar == 'modificar') {
                        var array = new Array();
                        array[0] = _this.datos.data.fechainicioalquiler;
                        array[1] = _this.datos.data.fechafinalquiler;
                        array[2] = _this.datos.data.idcliente;
                        array[3] = _this.datos.data.nrocontratoalquiler;
                        array[4] = _this.datos.data.direccionalquiler;
                        array[5] = _this.datos.data.idcondicionpago;
                    }


                    this.tabSecundario = getItemsAlquiler(_this.idioma, _this.modificar, _this.datos, array);
                    this.add(this.tabSecundario);
                }
                break;
            case '2':
                {

                    this.tabSecundario = getItemsReparar(_this.idioma, _this.modificar, _this.datos, this.nodoPadre);
                    this.add(this.tabSecundario);
                   /*  if (_this.modificar != 'modificar') {
                     this.tabDatos = getItemsRepararEnmantenimiento(_this.idioma, _this.modificar, _this.datos, this.nodoPadre)
                     this.add(this.tabDatos);
                     }*/

                }
                break;
            case '3':
                {
                    this.tabSecundario = getItemsTrasladoInterno(_this.idioma, _this.datos, _this.modificar, this.nodoPadre, (this.comboCentroCosto) ? this.comboCentroCosto.getValue() : null, _this);
                    this.add(this.tabSecundario);
                }
                break;
            case '4':
                {
                    this.tabSecundario = getItemsTrasladoExterno(_this.idioma, _this.datos, _this.modificar, this.nodoPadre);
                    this.add(this.tabSecundario);
                }
                break;
            case '5':
                {
                    if (_this.modificar == 'modificar') {
                        var arrayusu = new Array();
                        arrayusu[0] = _this.datos.data.idcliente;
                        arrayusu[1] = _this.datos.data.idcondicionpago;
                    }                    
                    this.tabSecundario = getItemsBajaPorVenta(_this.idioma, _this.datos, _this.modificar, _this.idestructuracomun, arrayusu, codigooperacion);
                    this.add(this.tabSecundario);
                }
                break;
            case '6':
                {
                    var datos = new Object();
                    datos.tipoInv = 'ParcialMensual';
                    datos.cmpGeneral = _this.cmpGeneral;
                    datos.scope = _this;
                    Ext.apply(datos, (_this.datos) ? _this.datos : {});
                    this.tabSecundario = getItemsInventario(_this.idioma, datos, this.idarea_seleccionada, _this.modificar);
                    this.add(this.tabSecundario);
                }
                break;
            case '7':
                {
                    var datos = new Object();
                    datos.tipoInv = 'Parcial';
                    datos.cmpGeneral = _this.cmpGeneral;
                    datos.scope = _this;
                    Ext.apply(datos, (_this.datos) ? _this.datos : {});
                    this.tabSecundario = getItemsInventario(_this.idioma, datos, this.idarea_seleccionada, _this.modificar);
                    this.add(this.tabSecundario);
                }
                break;
            case '10':
                {
                    this.tabSecundario = getItemsBajaDesarme(_this.idioma, _this.modificar, _this.datos, _this.idestructuracomun);
                    this.add(this.tabSecundario);
                }
                break;
            case '11':
                {
                    this.tabSecundario = getItemsCompra(_this.idioma, _this.modificar, _this.datos);
                    this.add(this.tabSecundario);
                }
                break;
            case '16':
                {
                    this.tabSecundario = getItemsAlta(_this.idioma, _this.modificar, _this.datos);
                    this.add(this.tabSecundario);

                }
                break;
            case '20':
                {
                    this.tabSecundario = getItemsPrestamo(_this.idioma, _this.modificar, _this.datos, this.idarea_seleccionada);
                    this.add(this.tabSecundario);

                }
                break;
            case '100':
                {
                    this.tabSecundario = getItemsTeletrabajo(_this.idioma, _this.modificar, _this.datos, this.idarea_seleccionada);
                    this.add(this.tabSecundario);

                }
                break;
            case '21':
                {
                    if (_this.modificar == 'modificar') {
                        var arrayusu = new Array();
                        arrayusu[0] = _this.datos.data.fechainiciousuf;
                        arrayusu[1] = _this.datos.data.fechafinusuf;
                        arrayusu[2] = _this.datos.data.idcliente;
                        arrayusu[3] = _this.datos.data.nrocontratousuf;
                        arrayusu[4] = _this.datos.data.direccionusuf;
                        arrayusu[5] = _this.datos.data.idcondicionpago;
                    }

                    this.tabSecundario = getItemsAlquiler(_this.idioma, _this.modificar, _this.datos, arrayusu);
                    this.add(this.tabSecundario);
                }
                break;
            case '22':
                {
                    if (_this.modificar == 'modificar') {
                        var arrayarr = new Array();
                        arrayarr[0] = _this.datos.data.fechainicioarr;
                        arrayarr[1] = _this.datos.data.fechafinarr;
                        arrayarr[2] = _this.datos.data.idcliente;
                        arrayarr[3] = _this.datos.data.nrocontratoarr;
                        arrayarr[4] = _this.datos.data.direccionarr;
                        arrayarr[5] = _this.datos.data.idcondicionpago;
                    }

                    this.tabSecundario = getItemsAlquiler(_this.idioma, _this.modificar, _this.datos, arrayarr);
                    this.add(this.tabSecundario);
                }
                break;
            case '23':
                {
                    this.tabSecundario = getItemsCompra(_this.idioma, _this.modificar, _this.datos, true);
                    this.add(this.tabSecundario);
                }
            case '50':
                {
                    this.tabSecundario = getItemsModMasivaResponabilidad(_this.idioma, _this.datos, _this.modificar, this.nodoPadre, (this.comboCentroCosto) ? this.comboCentroCosto.getValue() : null, _this);
                    this.add(this.tabSecundario);
                }
        }
    },
    eliminarTabSecundario: function() {
        if (this.tabSecundario) {
            this.remove(this.tabSecundario);
            this.tabSecundario.destroy();
        }
    },
    eliminarTabDatos: function() {
        if (this.tabDatos) {
            this.remove(this.tabDatos);
            this.tabDatos.destroy();
        }
    }
});
LOG.aft.documento.datDocOrigen = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        
        this.autoLoad = false;
        this.bbarVisible = true;
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.modal = true;
        this.layout = 'border';
		this.iddatosespecificos= config.iddatosespecificos;
		this.idinterfaz = config.idinterfaz;
		this.tipoDocInv = (config.aliasDoc == 'valeLog') ? 2 : 1;
        this.idoperacion = config.scope.idoperacion;
        // this.dirController = '/logistica/activos_fijos/documento/index.php/gestdocumento';
        this.urlBusquedaGridPrincipal = 'getdocumentosentradainventario';
        LOG.aft.documento.datDocOrigen.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = this.idioma.lbTitleDatosDocumento;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(700, 400);
		
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.hdNroDoc,
            dataIndex: 'nrodoc',
            width: 50,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbdenominacion,
            dataIndex: 'tipodocumento',
            width: 80,
            default: true
        });
        this.addGridColumn({
            //header: _this.idioma.lbClave,
            header: 'Dep&oacute;sito',
            dataIndex: 'deposito',
            width: 80,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdFecha,
            dataIndex: 'fechacontable',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdcliente,
            dataIndex: 'cliente',
            width: 150,
            default: true
        });
		this.addGridColumn({
            header: 'Importe',
            dataIndex: 'importecontable',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: 'Importe alternativo',
            dataIndex: 'importealternativo',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: 'Observaciones',
            dataIndex: 'observaciones',
            width: 150,
            default: true
        });		
        this.addGridColumn({
            dataIndex: 'iddocumento',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddoc',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'datDocInventario',
            default: true
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function() {

                var dat = LOG.aft.documento.smIntegracionInventario;

                if (dat) {
                    _this.scope.numero.setValue(dat.data.nrodoc);
                    _this.scope.fecha.setValue(dat.data.fechacontable);
                    _this.scope.iddocumento.setValue(dat.data.iddocumento);
                    _this.scope.denomInventario.setValue(dat.data.iddoc);
                    if(!_this.cmbEntidad.disabled) {
                        _this.scope.idEstructuraOrigenDocSalida.setValue(_this.cmbEntidad.getValue());
                    }

                    // _this.scope.clave.setValue(dat.items[0].data.abreviatura);
                    _this.scope.denomInventario.disable();
                    // _this.scope.clave.disable();
                    _this.scope.fecha.disable();
                    _this.scope.numero.disable();
                    _this.scope.iddocumento.disable();
                    this.close();
                }
            }
        });
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
		
		
		this.cmbEntidad = new LOG.util.ComboBox({
			allowBlank: false,
			anchor: '98%',
			queryParam: 'criterio',
			emptyText: "Seleccine el Origen",
			fieldLabel: _this.idioma.lbCbDepositoEntidadesDominio,
			hiddenName: 'identidaddestino',
			name: 'identidaddestino',
			editable: true,
			disabled: (_this.idinterfaz == 50 || _this.idinterfaz == 51) ? false : true,
			valueField: 'idfila',
			displayField: 'denominacion',
			url: "/logistica/activos_fijos/documento/index.php/gestdocumento/getEntidadTrasladoExterno",
			// Para moncar
			//url: "/logistica/utiles/plugin/index.php/sistemasexternos/cargarEntidadesGrupo",
			//
			mode: 'remote',
			enableKeyEvents: true,
			minChars: 1,
			pageSize: 15,
			resizable: true,
			listeners: {
				'select': function(){
					_this.getStorePrincipal().load()
				}
			}
		});
		this.addToolbarButton('->');
		this.addToolbarButton(this.cmbEntidad);
    },
    render: function() {

        var _this = this;
        var vista = LOG.aft.documento.datDocOrigen.superclass.render.call(this);

		_this.smGridPrincipal.on({
            'rowselect': function(sm) {
                LOG.aft.documento.smIntegracionInventario = sm.getSelected();
                _this.getVistaPrincipal().listaBotones.getItem(2).enable();
            },
            'rowdeselect': function() {
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
            }
        });

        _this.getStorePrincipal().on({
            'beforeload': function(st) {
                // Ext.getBody().mask('Cargando...', 'x-mask-loading');
                // st.initBaseParams.idarea = _this.area_selccionada;
                //st.initBaseParams.idestructura = _this.idestructuracomun;   			
                st.initBaseParams.centrocosto = globarCentroCosto;
				//st.initBaseParams.centrocosto = _this.comboCentroCosto;
                st.initBaseParams.tipo = _this.tipoDocInv;
                st.initBaseParams.idoperacion = _this.idoperacion;
				if(_this.cmbEntidad.getValue() && _this.cmbEntidad.getValue() != "")
					st.initBaseParams.idEntidadDocSalidaOrigen = _this.cmbEntidad.getValue();
				
                // st.initBaseParams.iddocumantoInventario = (_this.scope.iddocumento.getValue()) ? _this.scope.iddocumento.getValue() : null;
            },
            'load': function(st, r, o) {
                //Ext.getBody().unmask();
            }
        });
        _this.getStorePrincipal().load();
        return vista;
    }
});
LOG.aft.documento.ComboDepositos = Ext.extend(LOG.util.ComboBox, {
    dirUrl: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/',
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;
        _this.url = _this.dirUrl + 'cargarareas';
        _this.displayField = 'deposito';
		_this.valueField = 'iddeposito';
        _this.name = 'idarearesp';
        _this.fieldLabel = config.idioma.lbCbDepositoBuscar;
        LOG.aft.documento.ComboDepositos.superclass.constructor.call(this, config);
    }
});
LOG.aft.documento.winComboDepositos = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        Ext.apply(this, config);
        //this.layout = 'border';
        this.resizable = false;
        this.width = 700;
        this.height = 450;
        this.modal = true;
        LOG.aft.documento.winDocAdd.superclass.constructor.call(this, config);
        this.loadMasCmp = new Ext.LoadMask(this.getEl(), {msg: this.idioma.lbMaskCargando}, {msgCls: 'mask-css'});
        this.fireEvent = this.fireEvent.createSequence(function(e) {
            if (e == 'render') {
                this.loadMasCmp.show();
            }
        });
        this.crearItems();
    },
    initComponent: function(config) {
        var _this = this;
        LOG.aft.documento.winDocAdd.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                _this.destroy();
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            handler: function() {

            }
        });
        this.listaBotones.getItem(1).setVisible(false);
    },
    crearItems: function() {
        var _this = this;
        var loader = new Ext.tree.TreeLoader({
            dataUrl: 'cargarareas',
            listeners: {
                'beforeload': function(loader, nodo, fnCallBack) {
                    loader.baseParams.nodosSeleccionados = Ext.encode(_this.chequeados);
                },
                'load': function() {
                    _this.loadMasCmp.hide();
                }
            }
        });
        this.arbolAreas = new Ext.tree.TreePanel({
            region: 'center',
            autoScroll: true,
            animate: false,
            loader: loader,
            enableDD: false,
            containerScroll: true,
            rootVisible: true
        });
        var padreArea = new Ext.tree.AsyncTreeNode({
            text: '<b>' + "Cucpo" + '</b>',
            animate: false,
            draggable: false,
            expanded: true,
            id: 0
        });
        this.arbolAreas.setRootNode(padreArea);
        this.add(this.arbolAreas);
    }
});
LOG.aft.documento.panelEntregadosTemporalmente = Ext.extend(LOG.util.UITemplate, {//lbTitleEntregadosTem
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.autoSelect = false;
        this.concepto = "medios";
        // this.concepto = config.idioma.lbTtBuscar;        
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.urlBusquedaGridPrincipal = 'getEntregadosTemporalmente';
        LOG.aft.documento.panelEntregadosTemporalmente.superclass.constructor.call(this, config);
        this.idioma = config.idioma;
        this.idarearesp = config.idarearesp;
        this.arearesp = config.arearesp;
        this.height = (config.height) ? config.height : 300;
        this.width = (config.width) ? config.width : 700;
        this.storeDocumento = this.scope.storeDocumento;
        // this.tbar = ['-', '->', new LOG.aft.documento.ComboDepositos({idioma: _this.idioma})];
    },
    view: function() {
        var _this = this;
       /* this.comboarea = new LOG.aft.documento.ComboDepositos({
            idioma: _this.idioma,
            disabled: true
        });*/
        /*_this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: ['-', '->', _this.idioma.lbCmAreaResp + ': ', _this.comboarea, '-']
        }));*/
        LOG.util.UIManager.apply(_this.getPanelSuperior(), {
            width: '50%'
        });
        return LOG.aft.documento.panelEntregadosTemporalmente.superclass.view.call(_this);
    },
    initDefaultColumns: function() {

        var _this = this;

        this.addGridColumn({
            header: _this.idioma.lbdenominacion,
            align: 'left',
            dataIndex: 'denominaciondoc',
            //sortable: true,
            width: 40,
           // default: true,
            filter: {
                type: 'string',
                dataIndex: 'denominaciondoc'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbCmbMarcaModelo,
           // default: true,
            tooltip: 'Marca - modelo',
            align: 'left',
            dataIndex: 'marcamodelo',
            width: 80,
            filter: {
                type: 'string',
                dataIndex: 'marcamodelo'
            }
        });
        this.addGridColumn({
            header: 'Identificador',
            align: 'left',
            dataIndex: 'denomidmedio',
            width: 100,
            autoExpand: true,
            //default: true,
            filter: {
                type: 'string',
                dataIndex: 'denomidmedio'
            }
        });

       /* this.addGridColumn({
            header: _this.idioma.lbCbDepositoBuscar,
            align: 'left',
            dataIndex: 'areadenom',
            //agrupador: true,
            filter: {
                type: 'string',
                dataIndex: 'areadenom'
            }
        });*/

        this.addGridColumn({
            header: 'N.\xBA inventario',
            align: 'left',
            dataIndex: 'nroinventario',
            width: 40,
            //default: true,
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        this.addGridColumn({
            header: 'Responsable',
            tooltip: 'Responsable',
            align: 'left',
            dataIndex: 'responsable',
            width: 100,
            default: true
        });

        this.addGridColumn({
            header: 'Valor',
            align: 'right',
            dataIndex: 'valorcontable',
            sortable: false,
            default: true,
            width: 80,
        });
        this.addGridColumn({
            header: _this.idioma.lbTxtNroDoc,
            align: 'left',
            dataIndex: 'nrodoc',
           // sortable: true,
            width: 43,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nrodoc'
            }
        });
        this.addGridColumn({
            header: 'Fecha',
            align: 'left',
            dataIndex: 'fechacontable',
           // sortable: true,
            width: 43,
            default: true
        });

        this.addGridColumn({
            header: 'Operaci&oacute;n',
            tooltip: 'Operaci&oacute;n realizada con el activo',
            align: 'left',
            dataIndex: 'denomOperacion',
            width: 100,
            default: true,
            agrupador: true
        });
        this.addGridColumn({
            dataIndex: 'iddocumento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'activo',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'iddoc',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idmovimiento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idmovregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idprod',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idoperacion',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'identificador',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'codigooperacion',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idarearesp',
            default: false
        });

    },
    render: function() {
        var vista = LOG.aft.documento.panelEntregadosTemporalmente.superclass.render.call(this);
        var _this = this;
        _this.getStorePrincipal().on({
            'beforeload': function(store) {
                store.initBaseParams.idarearesp = Ext.encode(_this.idarearesp);
                store.initBaseParams.tipo = 0;
            },
            'load': function(store) {
                store.initBaseParams.idarearesp = Ext.encode(_this.idarearesp);
                /*if (store.getCount() == 0 && _this.scope.tabGeneral.getActiveTemplate().idComponent == 2) {
                 if (!_this.gridFilter.tfBusqueda.getValue()) {
                 mostrarMensaje(1, _this.idioma.lbSindatosBuscar2);
                 }
                 }*/
            }
        });
        _this.smGridPrincipal.on({
            'rowselect': function(sm, index) {
                var codigooperacion = _this.smGridPrincipal.selections.items[0].data.codigooperacion;
                //var idarearesp = _this.smGridPrincipal.selections.items[0].data.idarearesp;
                for (var i = 1; i < _this.smGridPrincipal.selections.items.length; i++) {


                    if (_this.smGridPrincipal.selections.items[i].data.codigooperacion != codigooperacion) {
                        codigooperacion = _this.smGridPrincipal.selections.items[i].data.codigooperacion;
                       // _this.comboarea.setValue(idarearesp);
                        _this.smGridPrincipal.clearSelections();
                        _this.smGridPrincipal.selectRow(index);
                    }
                  /*  if (_this.smGridPrincipal.selections.items[i].data.idarearesp != idarearesp) {
                     idarearesp = _this.smGridPrincipal.selections.items[i].data.idarearesp;
                     _this.smGridPrincipal.clearSelections();
                     _this.smGridPrincipal.selectRow(rowIndex);
                     _this.comboarea.setValue(idarearesp);

                     }else{
                     idarearesp = _this.smGridPrincipal.selections.items[i].data.idarearesp;
                     _this.comboarea.setValue(idarearesp);
                     }*/
                }
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.scope.listaBotones.getItem(2).enable();
                } else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            },
            'rowdeselect': function(sm) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.scope.listaBotones.getItem(2).enable();
                } else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            }
        });
        vista.fireEvent = vista.fireEvent.createSequence(function(e) {

            if (e == 'activate') {
                if (_this.smGridPrincipal.hasSelection()) {

                    _this.scope.listaBotones.getItem(2).enable();
                }
                else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            }
        });
        return vista;
    },
    doAction: function() {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.lbEnviando, _this.idioma.lbEspere || '...');
        if (_this.smGridPrincipal.hasSelection()) {
            var datos = _this.smGridPrincipal.getSelected();
            var arreglo = new Array();
            for (var i = 0; i < _this.smGridPrincipal.selections.items.length; i++) {
                arreglo[i] = {
                    idprod: _this.smGridPrincipal.selections.items[i].data.idindicador,
                    idregnumerico: _this.smGridPrincipal.selections.items[i].data.idregnumerico,
                    iddocumentoOld: _this.smGridPrincipal.selections.items[i].data.iddocumento,
                    idestructuracomun: _this.smGridPrincipal.selections.items[i].data.idarearesp,
                    idestructuraEntidad: _this.idestructuraEntidad
                };
            }
            _this.enviarDatos(arreglo, datos, _this.cargarInterfazRegNum);
            _this.getStorePrincipal().load();
        } else {
            mostrarMensaje(3, _this.idioma.MsgRecepcion);
        }
    },
    enviarDatos: function(arreglo, datos, post_Action) {
        var _this = this;
        var codigooperacion = null;
        if (_this.smGridPrincipal.selections.items[0].data.codigooperacion == 'OPER_ALQUILER') {
            codigooperacion = 'OPER_ALQUI_ENTRADA';
        } else if (_this.smGridPrincipal.selections.items[0].data.codigooperacion == 'OPER_PRESTAMO') {
            codigooperacion = 'OPER_PRESTA_ENTRADA';
        }
        else if (_this.smGridPrincipal.selections.items[0].data.codigooperacion == 'OPER_ENTREG_TEMPORAL') {
            codigooperacion = 'OPER_REC_ENTREG_TEMP';
        }
        else if (_this.smGridPrincipal.selections.items[0].data.codigooperacion == 'OPER_USUFRUCTO') {
            codigooperacion = 'OPER_USUFR_ENTRADA';
        }
        else if (_this.smGridPrincipal.selections.items[0].data.codigooperacion == 'OPER_ARRENDAMIENTO') {
            codigooperacion = 'OPER_ARREN_ENTRADA';
        } else if (_this.smGridPrincipal.selections.items[0].data.codigooperacion == 'OPER_TELETRABAJO') {
            codigooperacion = 'OPER_TELETRABAJO_ENT';
        } else if (_this.smGridPrincipal.selections.items[0].data.codigooperacion == 'OPER_TELETRABAJO_UH') {
            codigooperacion = 'OPER_TELETRABAJO_ENT_UH';
        }
        Ext.Ajax.request({
            url: 'addDocRecepcion',
            method: 'POST',
            params: {
                datosEntregTemp: Ext.encode(arreglo),
                codigooperacion: codigooperacion
            },
            callback: function(options, success, response) {
                var response = Ext.decode(response.responseText);
                if (success && !response.error) {
                    post_Action.call(_this, response);
                } else {
                    if (response.error == 'NoHayOpersConf') {
                        Ext.getBody().unmask();
                        mostrarMensaje(3, 'No existe una operacion que permita realizar la recepcion');
                    } else {
                        Ext.getBody().unmask();
                        mostrarMensaje(3, _this.idioma.msgErrorAddDoc);
                    }
                }
            }});
    },
    cargarInterfazRegNum: function(datos) {
        var _this = this;

        _this.storeDocumento.load();
        datos.idarearesp = _this.idarearesp;
        datos.idestructurapadre = _this.idPadreNodoSeleccionado;
        datos.arearesp = _this.arearesp;
        if (datos.cantidad > 0) {
            Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
            Ext.aft.regNumerico.controller.init({
                datos: datos
            });
        }
    }
});
LOG.aft.documento.panelEnviadosReparar = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.autoSelect = false;
        this.concepto = "medios";
        this.autoLoad = false;
        this.idGridPrincipal = 'idregnumerico';
        this.idioma = config.idioma;
        this.urlBusquedaGridPrincipal = 'enviadosReparar';
        LOG.aft.documento.panelEnviadosReparar.superclass.constructor.call(this, config);
        this.idarearesp = config.idarearesp;
        this.arearesp = config.arearesp;
        this.height = (config.height) ? config.height : 300;
        this.width = (config.width) ? config.width : 700;
        this.storeDocumento = this.scope.storeDocumento;

    },
    initDefaultColumns: function() {

        var _this = this;

        this.addGridColumn({
            header: _this.idioma.lbdenominacion,
            align: 'left',
            dataIndex: 'denominacion',
            //sortable: true,
           // agrupador: true,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbCmbMarcaModelo,
            align: 'left',
            dataIndex: 'marca-modelo',
            width: 60,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'marca-modelo'
            }
        });
        this.addGridColumn({
            header: 'Identificador',
            align: 'left',
            dataIndex: 'denomidmedio',
            width: 100,
            autoExpand: true,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denomidmedio'
            }
        });
        this.addGridColumn({
            header: 'N.\xBA inventario',
            align: 'left',
            dataIndex: 'nroinventario',
            width: 60,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbTxtNroDoc,
            align: 'left',
            dataIndex: 'nrodoc',
           // sortable: true,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nrodoc'
            }
        });

        this.addGridColumn({
             header: _this.idioma.lbCbDepositoBuscar,
             align: 'left',
             dataIndex: 'areadenom',
             agrupador: true,
             filter: {
             type: 'string',
             dataIndex: 'areadenom'
             }
         });

        this.addGridColumn({
            header: _this.idioma.lbTxtEstadoEjecucion,
            align: 'left',
            dataIndex: 'noRecepcion',
           // sortable: true,
            default: true,
            renderer: function(val) {
                if (val == "No procesado" || val == "En proceso" || val == "Reparado") {
                    return val;
                } else {
                    return "No procesado";
                }
            }
        });

        this.addGridColumn({
            header: 'Valor',
            align: 'right',
            dataIndex: 'valorcontable',
            sortable: false,
            default: true,
            width: 80,
        });
        this.addGridColumn({
            header: _this.idioma.lbTxtNroDoc,
            align: 'left',
            dataIndex: 'nrodoc',
           // sortable: true,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nrodoc'
            }
        });
        this.addGridColumn({
            header:'Fecha',
            align: 'left',
            dataIndex: 'fechacontable',
           // sortable: true,
            default: true
        });

        this.addGridColumn({
            dataIndex: 'estadoregistronumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'iddocumento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'iddoc',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idmovimiento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idmovregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idprod',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idarearesp',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'identificador',
            default: false
        });
    },
    view: function() {
        var _this = this;
       /* this.comboarea = new LOG.aft.documento.ComboDepositos({
            idioma: _this.idioma,
            allowBlank: false,
            disabled:true
        });
        _this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: ['-', '->', _this.idioma.lbCmAreaResp + ': ', _this.comboarea, '-']
        }));*/
        LOG.util.UIManager.apply(_this.getPanelSuperior(), {
            width: '50%'
        });
        return LOG.aft.documento.panelEnviadosReparar.superclass.view.call(_this);
    },
    render: function() {
        var vista = LOG.aft.documento.panelEnviadosReparar.superclass.render.call(this);
        var _this = this;
        _this.getStorePrincipal().on({
            'beforeload': function(store) {
                store.initBaseParams.idarearesp = Ext.encode(_this.idarearesp);
            },
            'load': function(store) {
                store.initBaseParams.idarearesp = Ext.encode(_this.idarearesp);
                /* if (store.getCount() == 0 && _this.scope.tabGeneral.getActiveTemplate().idComponent == 1) {
                 if (!_this.gridFilter.tfBusqueda.getValue()) {
                 mostrarMensaje(1, _this.idioma.lbSindatosBuscar2);
                 }
                 }*/
            }
        });
        _this.smGridPrincipal.on({
            'rowselect': function(sm, rowIndex, r) {

                if (_this.smGridPrincipal.getSelections().length >= 1) {

                    var idarearesp = _this.smGridPrincipal.selections.items[0].data.idarearesp;

                    for (var i = 0; i < sm.selections.items.length; i++) {

                        /*if (sm.selections.items[i].data.estadoregistronumerico == 'terminado' || sm.selections.items[i].data.estadoregistronumerico == 'enespera') {
                            _this.scope.listaBotones.getItem(2).enable();
                        } else {
                            _this.scope.listaBotones.getItem(2).disable();
                            break;
                        }*/
                        _this.scope.listaBotones.getItem(2).enable();
                        if (_this.smGridPrincipal.selections.items[i].data.idarearesp != idarearesp) {
                             idarearesp = _this.smGridPrincipal.selections.items[i].data.idarearesp;
                            _this.smGridPrincipal.clearSelections();
                            _this.smGridPrincipal.selectRow(rowIndex);
                           // _this.comboarea.setValue(idarearesp);

                        }else{
                            idarearesp = _this.smGridPrincipal.selections.items[i].data.idarearesp;
                            //_this.comboarea.setValue(idarearesp);
                        }

                    }

                } else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            },
            'rowdeselect': function(sm, rowIndex, r) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    for (var i = 0; i < sm.selections.items.length; i++) {
                        /*if (sm.selections.items[i].data.estadoregistronumerico == 'terminado' || sm.selections.items[i].data.estadoregistronumerico == 'enespera') {
                            _this.scope.listaBotones.getItem(2).enable();
                        } else {
                            _this.scope.listaBotones.getItem(2).disable();
                            break;
                        }*/
                        _this.scope.listaBotones.getItem(2).enable();
                    }
                    // _this.scope.listaBotones.getItem(2).enable();
                } else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            }
        });
        vista.fireEvent = vista.fireEvent.createSequence(function(e) {

            if (e == 'activate') {

                if (_this.smGridPrincipal.hasSelection()) {

                    _this.scope.listaBotones.getItem(2).enable();
                }
                else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            }

        });
        return vista;
    },
    doAction: function() {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.lbEnviando, _this.idioma.lbEspere || '...');

        if (_this.smGridPrincipal.hasSelection()) {
            var datos = _this.smGridPrincipal.getSelected();
            var arreglo = new Array();
            for (var i = 0; i < _this.smGridPrincipal.selections.items.length; i++) {
                arreglo[i] = {
                    idprod: _this.smGridPrincipal.selections.items[i].data.idindicador,
                    idregnumerico: _this.smGridPrincipal.selections.items[i].data.idregnumerico,
                    iddocumentoOld: _this.smGridPrincipal.selections.items[i].data.iddocumento,
                    idestructuracomun: _this.smGridPrincipal.selections.items[i].data.idarearesp,
                    idestructuraEntidad: _this.idestructuraEntidad
                };
            }
            _this.enviarDatos(arreglo, datos, _this.cargarInterfazRegNum);
            _this.getStorePrincipal().load();
        } else {
            mostrarMensaje(3, _this.idioma.MsgRecepcion);
        }
    },
    cargarInterfazRegNum: function(datos) {
        var _this = this;
        _this.storeDocumento.load();
        datos.idarearesp = _this.idarearesp;
        datos.idestructurapadre = _this.idPadreNodoSeleccionado;
        datos.arearesp = _this.arearesp;
        if (datos.cantidad > 0) {
            Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
            Ext.aft.regNumerico.controller.init({
                datos: datos
            });
        }
    },
    enviarDatos: function(arreglo, datos, post_Action) {
        var _this = this;
        Ext.Ajax.request({
            url: 'addDocRecepcion',
            method: 'POST',
            params: {
                datosEnvRep: Ext.encode(arreglo)
            },
            callback: function(options, success, response) {
                var response = Ext.decode(response.responseText);
                if (success && !response.error) {
                    post_Action.call(_this, response);
                } else {
                    if (response.error == 'NoHayOpersConf') {
                        Ext.getBody().unmask();
                        mostrarMensaje(3, 'No existe una operacion que permita realizar la recepcion');
                    } else {
                        Ext.getBody().unmask();
                        mostrarMensaje(3, _this.idioma.msgErrorAddDoc);
                    }
                }
            }});
    }
});
LOG.aft.documento.panelDevueltos = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.autoSelect = false;
        this.idioma = config.idioma;
        this.idGridPrincipal = 'idregnumerico';
        this.concepto = "medios";
        this.urlBusquedaGridPrincipal = 'cargarMediosDevueltos';
        LOG.aft.documento.panelDevueltos.superclass.constructor.call(this, config);
        LOG.aft.documento.panelDevueltos.rowIndex = null;
        this.height = (config.height) ? config.height : 300;
        this.width = (config.width) ? config.width : 700;
        this.identidad = config.idarearesp;
        this.nodoPadre = config.nodoPadre;
        this.storeDocumento = config.storeDocumento;
    },/*
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'salida',
            text: 'Ignorar',
            tooltip: 'Ignora los medios seleccionados.',
            disabled: true,
            handler: function() {

                var records = _this.getSmPrincipal().getSelections();
                if (records.length > 0) {
                    mostrarMensaje(2, "¿Está seguro que quiere ignorar los medios seleccionados? Esta acción no se puede revertir.", function(btn) {
                        if (btn == 'ok') {
                            var loadMasKT = new Ext.LoadMask(Ext.getBody(), {msg: 'Ignorando medios'}, {msgCls: 'mask-css'});
                            loadMasKT.show();
                            var idregnumericos = [];
                            var i = 0;
                            while (i < records.length) {
                                idregnumericos.push(records[i].get('idregnumerico'));
                                i++;
                            }
                            Ext.Ajax.request({
                                url: 'ignorarmediostrasladados',
                                method: 'POST',
                                params: {
                                    idregistros: Ext.encode(idregnumericos)
                                },
                                callback: function(options, success, response) {
                                    var response = Ext.decode(response.responseText);
                                    if (success && !response.error) {
                                        Ext.getBody().unmask();
                                        _this.getStorePrincipal().load();
                                        mostrarMensaje(1, 'Los medios han sido ignorados satisfactoriamente');
                                    } else {
                                        if (response.error) {
                                            Ext.getBody().unmask();
                                            mostrarMensaje(3, response.error);
                                        }
                                    }
                                }
                            });
                        }
                    });
                } else {
                    mostrarMensaje(1, "Debe seleccionar al menos un medio para devolver.");
                }
            },
            controlFn: function(b, _caller) {
                //if (_this.grantedAction('IGNDEV')) {
                //    b.setVisible(true);
                //    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            if (_caller.getSmPrincipal().getSelections().length == 0)
                                b.disable();
                        }
                    });
                //} else {
                //    b.setVisible(false);
                //}
            }
        }));
    },*/
    initDefaultColumns: function() {

        var _this = this;
        this.addGridColumn({
            dataIndex: 'idestructuraorigen',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'identificador',
            default: false
        });
        this.addGridColumn({
            header: _this.idioma.lbdenominacion,
            align: 'left',
            dataIndex: 'denominacion',
            sortable: true,
            autoExpand: false,
            default: true,
            isFiltroBusqueda: true,
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbCmbMarcaModelo,
            align: 'left',
            dataIndex: 'marcamodelo',
            width: 60,
            default: true,
            isFiltroBusqueda: true,
            filter: {
                type: 'string',
                dataIndex: 'marcamodelo'
            }
        });
        this.addGridColumn({
            header: 'Identificador',
            align: 'left',
            dataIndex: 'denomidmedio',
            width: 100,
            autoExpand: true,
            default: true,
            isFiltroBusqueda: true,
            filter: {
                type: 'string',
                dataIndex: 'denomidmedio'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbTxtNroRegSerie,
            align: 'left',
            dataIndex: 'nroserie',
            sortable: true,
            default: true,
            isFiltroBusqueda: true,
            filter: {
                type: 'string',
                dataIndex: 'nroserie'
            }
        });
        this.addGridColumn({
            header: 'N.\xBA inventario',
            align: 'left',
            dataIndex: 'nroinventario',
            width: 40,
            //default: true,
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });

        this.addGridColumn({
            header: 'Valor',
            align: 'right',
            dataIndex: 'valorcontable',
            sortable: false,
            default: true,
            width: 80,
        });

        this.addGridColumn({
            header: _this.idioma.lbTxtOrigen,
            align: 'left',
            dataIndex: 'estructuraorigen',
            width: 80,
            default: true,
            agrupador: true
        });
    },
    render: function() {
        var vista = LOG.aft.documento.panelDevueltos.superclass.render.call(this);
        var _this = this;
        _this.getStorePrincipal().on({
            'beforeload': function(store) {
                store.initBaseParams.identidad = _this.identidad;
            },
            'load': function(store) {
                store.initBaseParams.identidad = _this.identidad;
                /* if (store.getCount() == 0 && _this.scope.tabGeneral.getActiveTemplate().idComponent == 0) {
                 if (!_this.gridFilter.tfBusqueda.getValue()) {
                 mostrarMensaje(1, _this.idioma.lbSindatosBuscar2);
                 }
                 }*/
            }
        });

        _this.smGridPrincipal.on({
            'rowselect': function(sm) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.scope.listaBotones.getItem(2).enable();
                } else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            },
            'rowdeselect': function(sm) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.scope.listaBotones.getItem(2).enable();
                } else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            }
        });
        vista.fireEvent = vista.fireEvent.createSequence(function(e) {

            if (e == 'activate') {

                if (_this.smGridPrincipal.hasSelection()) {
                    _this.scope.listaBotones.getItem(2).enable();
                }
                else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            }

        });
        return vista;
    },
    getOperRecepcionDevTrasladoEntreEntidades: function(fn) {
        var _this = this;
        Ext.getBody().unmask();

        Ext.MessageBox.wait("Cargando datos...", _this.idioma.lbEspere || '...');
        var resultado = null;
        Ext.Ajax.request({
            url: 'getoperaciones',
            method: 'POST',
            params: {
                //operacionEspecifica: 29,
				codigooper: "OPER_REC_DEVOLUCION",
                idestructura: _this.nodoPadre.attributes.id
            },
            callback: function(options, success, response) {
                resultado = Ext.util.JSON.decode(response.responseText);
                Ext.MessageBox.hide();
                if(resultado.datos.length == 0){
                    mostrarMensaje(1, "La operaci\xf3n recepci\xf3n de devoluciones no est\xe1 configurada.");
                }else{
                    fn(resultado['datos']);
                }

            }
        });
    },
    OrdenarArregloporIDprod: function(arreglo) {
        for (var i = 0; i < arreglo.length; i++) {
            for (var j = 0; j < arreglo.length; j++) {
                if (arreglo[i].idindicador > arreglo[j].idindicador) {
                    var aux = arreglo[i];
                    arreglo[i] = arreglo[j];
                    arreglo[j] = aux;
                }
            }
        }
        return arreglo;
    }
});

LOG.aft.documento.panelTraslado = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        // this.concepto = config.idioma.lbTtBuscar;        
        this.autoLoad = false;
        this.autoSelect = false;
        this.idioma = config.idioma;
        this.idGridPrincipal = 'idregnumerico';
        this.concepto = "medios";
        this.urlBusquedaGridPrincipal = 'traslado';
        LOG.aft.documento.panelTraslado.superclass.constructor.call(this, config);
        LOG.aft.documento.panelTraslado.rowIndex = null;
        this.height = (config.height) ? config.height : 300;
        this.width = (config.width) ? config.width : 700;
        this.idarearesp = config.idarearesp;
        this.nodoPadre = config.nodoPadre;
        this.storeDocumento = config.storeDocumento;
    },
    initDefaultColumns: function() {

        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'iddoc',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idmovimiento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idmovregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idprod',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'identificador',
            default: false
        });
        this.addGridColumn({
            header: _this.idioma.lbdenominacion,
            align: 'left',
            dataIndex: 'denominacion',
            sortable: true,
            width: 250,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }

        });
        this.addGridColumn({
            header: 'Tipo de documento',
            align: 'left',
            dataIndex: 'tipodoc',
            //sortable: true,
            width: 250,
           // default: true,
            filter: {
                type: 'string',
                dataIndex: 'tipodoc'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbCmbMarcaModelo,
            align: 'left',
            dataIndex: 'marca-modelo',
            width: 60,
            default: true,
            sortable: true,
            filter: {
                type: 'string',
                dataIndex: 'marca-modelo'
            }
        });
        this.addGridColumn({
            header: 'Identificador',
            align: 'left',
            dataIndex: 'denomidmedio',
            width: 100,
            autoExpand: true,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denomidmedio'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbTxtNroRegSerie,
            align: 'left',
            dataIndex: 'nserie',
            sortable: true,
            default: true
        });
        this.addGridColumn({
            header: 'N.\xBA inventario',
            align: 'left',
            dataIndex: 'nroinventario',
            width: 40,
            //default: true,
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        
        
        this.addGridColumn({
            header: 'Valor',
            align: 'right',
            dataIndex: 'valorcontable',
            sortable: false,
            default: true,
            width: 80,
        });
        this.addGridColumn({
            header: _this.idioma.lbTxtNroDoc,
            align: 'left',
            dataIndex: 'nrodoc',
            sortable: true,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nrodoc'
            }
        });
        this.addGridColumn({
            header: 'Fecha',
            align: 'left',
            dataIndex: 'fechacontable',
            sortable: true,
            default: true
        });


        this.addGridColumn({
            header: _this.idioma.lbTxtOrigen,
            align: 'left',
            dataIndex: 'estructuradenom',
            width: 80,
            default: true,
            agrupador: true
        });

        this.addGridColumn({
            dataIndex: 'idestructuraorigen',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idnomiddocprim',
            default: false
        });
    },
    render: function() {
    
        var vista = LOG.aft.documento.panelTraslado.superclass.render.call(this);
        var _this = this;
        _this.getStorePrincipal().on({
            'beforeload': function(store) {
                store.initBaseParams.idarearesp = _this.idarearesp;
            },
            'load': function(store) {
                store.initBaseParams.idarearesp = _this.idarearesp;
                /* if (store.getCount() == 0 && _this.scope.tabGeneral.getActiveTemplate().idComponent == 0) {
                 if (!_this.gridFilter.tfBusqueda.getValue()) {
                 mostrarMensaje(1, _this.idioma.lbSindatosBuscar2);
                 }
                 }*/
            }
        });
        // this.smGridPrincipal.selectAll = function() {
        //     var arrayRows = [];
        //     var i = 0;
        //     var j = 0;
        //     console.info(this)
        //     if (_this.iddocumento == null) {
        //         _this.iddocumento = _this.getStorePrincipal().data.items[i].data.iddocumento;
        //         while (_this.getStorePrincipal().data.items[i].data.iddocumento == _this.iddocumento) {
        //             arrayRows.push(i);
        //             i++;
        //         } 
        //     } else {
        //         while (_this.getStorePrincipal().data.items[i].data.iddocumento != _this.iddocumento) {
        //             i++;
        //         }
        //         while (_this.getStorePrincipal().data.items[i].data.iddocumento == _this.iddocumento) {
        //             arrayRows.push(i);
        //             i++;
        //             if (i == _this.getStorePrincipal().getCount()) {
        //                 break;
        //             }
        //         }
        //     }
        //     _this.iddocumento = _this.smGridPrincipal.selectRows(arrayRows);
        // }

        // this.gpPrincipal.on({
        //     'rowclick': function(g, index, e) {

        //         if (_this.iddocumento == null) {
        //             _this.iddocumento = _this.smGridPrincipal.selections.items[0].data.iddocumento;
        //         }

        //         for (var i = 0; i < _this.smGridPrincipal.selections.items.length; i++) {
        //             if (_this.smGridPrincipal.selections.items[i].data.iddocumento != _this.iddocumento) {
        //                 _this.iddocumento = _this.smGridPrincipal.selections.items[i].data.iddocumento;
        //                 _this.smGridPrincipal.clearSelections();
        //                 _this.smGridPrincipal.selectRow(index);
        //                 break;
        //             }
        //         }
        //     }
        // });
        _this.smGridPrincipal.selectAll = function(){
            
            mostrarMensaje(2, '<li>Seleccione un medio del tipo de documento del que desea seleccionar todos </li><li> Solo puede seleccionar medios de un mismo tipo de documento</li>');
            if(_this.smGridPrincipal.isLocked()){
                return;
            }
            //_this.smGridPrincipal.selections.clear();
            for(var i = 0, len = _this.smGridPrincipal.grid.store.getCount(); i < len; i++){
                _this.smGridPrincipal.selectRow(i, true);
            }
        },
        _this.smGridPrincipal.on({
            'rowselect': function(sm, rowIndex, record) {           
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.scope.listaBotones.getItem(2).enable();
                } else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            },
            'rowdeselect': function(sm, rowIndex, record) {
                if (_this.smGridPrincipal.getSelections().length >= 1) {
                    _this.scope.listaBotones.getItem(2).enable();
                } else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            },
            beforerowselect: function (sm, rowIndex, keepExisting, record) {
                var records = sm.getSelections();
                if (records.length > 0) {
                    const regex = new RegExp('^187.*');
                    let lastRecord = records.slice(-1)[0];
                    let util = regex.test(lastRecord.json.concatcta);

                    if (util !== regex.test(record.json.concatcta)) {
                        return false;
                    }
                }
            }
        });
        vista.fireEvent = vista.fireEvent.createSequence(function(e) {

            if (e == 'activate') {

                if (_this.smGridPrincipal.hasSelection()) {
                    _this.scope.listaBotones.getItem(2).enable();
                }
                else {
                    _this.scope.listaBotones.getItem(2).disable();
                }
            }

        });
        return vista;
    },
    getOperacionRecepcionTrasladoEntreEntidades: function(fn, iddocprim) {
        var _this = this;
        var resultado = null;

        Ext.Ajax.request({
            url: 'getoperaciones',
            method: 'POST',
            params: {
                operacionEspecifica: 17,
                idestructura: _this.nodoPadre.attributes.id,
                idDocPrim: iddocprim
            },
            callback: function(options, success, response) {
                resultado = Ext.util.JSON.decode(response.responseText);
                fn(resultado['datos']);
            }
        });
    },
    OrdenarArregloporIDprod: function(arreglo) {
        for (var i = 0; i < arreglo.length; i++) {
            for (var j = 0; j < arreglo.length; j++) {
                if (arreglo[i].idprod > arreglo[j].idprod) {
                    var aux = arreglo[i];
                    arreglo[i] = arreglo[j];
                    arreglo[j] = aux;
                }
            }
        }
        return arreglo;
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'salida',
            text: 'Devolver',
            tooltip: 'Devolver los activos seleccionados',
            disabled: true,
            handler: function() {
                var records = _this.getSmPrincipal().getSelections();
                if (records.length > 0) {
                    mostrarMensaje(2, "¿Está seguro que quiere devolver los medios seleccionados?", function(btn) {
                        if (btn == 'ok') {
                            var loadMasKT = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.lbMaskCargando}, {msgCls: 'mask-css'});
                            loadMasKT.show();
                            var idregnumericos = [];
                            var i = 0;
                            while (i < records.length) {
                                idregnumericos.push(records[i].get('idregnumerico'));
                                i++;
                            }
                            Ext.Ajax.request({
                                url: 'devolverMedios',
                                method: 'POST',
                                params: {
                                    idregistros: Ext.encode(idregnumericos)
                                },
                                callback: function(options, success, response) {
                                    var response = Ext.decode(response.responseText);
                                    if (success && !response.error) {
                                        Ext.getBody().unmask();
                                        _this.getStorePrincipal().load();
                                        mostrarMensaje(1, 'Los medios han sido devueltos satisfactoriamente');
                                    } else {
                                        if (response.error) {
                                            Ext.getBody().unmask();
                                            mostrarMensaje(3, response.error);
                                        }
                                    }
                                }
                            });
                        }
                    });
                } else {
                    mostrarMensaje(1, "Debe seleccionar al menos un medio para devolver.");
                }
            },
            controlFn: function(b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        if (_caller.getSmPrincipal().getSelections().length == 0)
                            b.disable();
                    }
                });
            }
        }));
        /*
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'salida',
            text: 'Ignorar',
            tooltip: 'Ignora los medios seleccionados.',
            disabled: true,
            handler: function() {

                var records = _this.getSmPrincipal().getSelections();
                if (records.length > 0) {
                    mostrarMensaje(2, "¿Está seguro que quiere ignorar los medios seleccionados? Esta acción no se puede revertir.", function(btn) {
                        if (btn == 'ok') {
                            var loadMasKT = new Ext.LoadMask(Ext.getBody(), {msg: 'Ignorando medios'}, {msgCls: 'mask-css'});
                            loadMasKT.show();
                            var idregnumericos = [];
                            var i = 0;
                            while (i < records.length) {
                                idregnumericos.push(records[i].get('idregnumerico'));
                                i++;
                            }
                            Ext.Ajax.request({
                                url: 'ignorarmediostrasladados',
                                method: 'POST',
                                params: {
                                    idregistros: Ext.encode(idregnumericos)
                                },
                                callback: function(options, success, response) {
                                    var response = Ext.decode(response.responseText);
                                    if (success && !response.error) {
                                        Ext.getBody().unmask();
                                        _this.getStorePrincipal().load();
                                        mostrarMensaje(1, 'Los medios han sido ignorados satisfactoriamente');
                                    } else {
                                        if (response.error) {
                                            Ext.getBody().unmask();
                                            mostrarMensaje(3, response.error);
                                        }
                                    }
                                }
                            });
                        }
                    });
                } else {
                    mostrarMensaje(1, "Debe seleccionar al menos un medio para devolver.");
                }
            },
            controlFn: function(b, _caller) {
                //if (_this.grantedAction('IGNTRAS')) {
                //    b.setVisible(true);
                //    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            if (_caller.getSmPrincipal().getSelections().length == 0)
                                b.disable();
                        }
                    });
                //} else {
                //    b.setVisible(false);
                //}
            }
        }));*/
    }
});
LOG.aft.documento.winRecepciones = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        config.resizable = false;
        this.idioma = config.idioma;
        this.valor = config.valor;
        this.usarAplicar = false;
        this.idGridPrincipal = 'idregnumerico';
        var _this = this;
        LOG.aft.documento.winRecepciones.superclass.constructor.call(this, config);
        this.setTitle(this.idioma.lbTitleRecepMedio);
        this.panelDatos();
        this.width = 850;
        this.height = 400;
        this.modal = true;
        this.idioma = config.idioma;
        this.idarearesp = config.idarearesp;
        this.arearesp = config.arearesp;
        this.nodoPadre = config.nodoPadre;
        this.storeDocumento = config.storeDocumento;
        this.fireEvent = this.fireEvent.createSequence(function(e) {
            if (e == 'hide')
            {
                Ext.getBody().unmask();
            }
        })
    },
    initComponent: function() {
        var _this = this;
        LOG.aft.documento.winRecepciones.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                this.listaBotones.getItem(2).disable();
                Ext.getBody().mask("Cargando datos", 'x-mask-loading');
                if (_this.tabGeneral.getActiveTemplate().idComponent == 0) {

                    var datos = _this.panelTraslado.getSmPrincipal().selections.items;
                    
                    var arreglodatos = new Array();
                    for (var i = 0; i < datos.length; i++) {
                        arreglodatos.push(datos[i].data);
                    }

                    if (_this.panelTraslado.getSmPrincipal().hasSelection()) {

                        _this.panelTraslado.getOperacionRecepcionTrasladoEntreEntidades(function(operacion) {
                            if (!operacion) {
                                _this.destroy();
                                return;
                            }
                            _this.hide();
                            //var datos = _this.panelTraslado.getSmPrincipal().selections.items;

                            //var arreglodatos = new Array();
                            //for (var i = 0; i < datos.length; i++) {
                            //    arreglodatos.push(datos[i].data);
                            //}

                            /**
                             * se ordena el arreglo por id producto porque el metodo de que crea los movimiento los
                             * espera de forma ordenada el metodo esta en clase:ActivoFijoMovimientoModel metodo:
                             * crearMovDeDoc
                             */

                            var arraglodaltosordenadosIDProd = _this.panelTraslado.OrdenarArregloporIDprod(arreglodatos);
                            _this.fn({
                                datos: arraglodaltosordenadosIDProd,
                                idoperacion: operacion[0].idoperacion,
                                iddoc: operacion[0].iddoc,
                                recepcion: "recepcion"
                            });
                        }, arreglodatos[0].idnomiddocprim)

                    }
                }
                else if (_this.tabGeneral.getActiveTemplate().idComponent == 1) {
                    if (_this.panelDevoluciones.getSmPrincipal().hasSelection()) {
                        _this.panelDevoluciones.getOperRecepcionDevTrasladoEntreEntidades(
                                function(operacion) {
                                    if (!operacion) {
                                        _this.destroy();
                                        return;
                                    }
                                    _this.hide();
                                    //  ------
									// Esto estaba comentareado no se porque, esto es necesario para la recepcion de la
									// devolucion.
									var datos = _this.panelDevoluciones.getSmPrincipal().selections.items;
									var arreglodatos = new Array();
                                    for (var i = 0; i < datos.length; i++) {
                                        arreglodatos.push(datos[i].data);
                                    }
									//  ------
                                    /**
                                     * se ordena el arreglo por idindicador porque el metodo de que crea los movimiento los
                                     * espera de forma ordenada. El metodo esta en clase:ActivoFijoMovimientoModel metodo:
                                     * crearMovDeDoc
                                     */
									 
                                    var arraglodaltosordenadosIDProd = _this.panelDevoluciones.OrdenarArregloporIDprod(arreglodatos);
                                    _this.fn({
                                        datos: arraglodaltosordenadosIDProd,
                                        idoperacion: operacion[0].idoperacion,
                                        iddoc: operacion[0].iddoc,
                                        recepcion: "recepcion"
                                    });
                                }
                        );
                    }
                }
                else if (_this.tabGeneral.getActiveTemplate().idComponent == 2) {
                    _this.panelEnviadoReparar.doAction();
                    _this.hide();
                  /*  if (_this.panelEnviadoReparar.comboarea && _this.panelEnviadoReparar.comboarea.getValue()) {
                        _this.panelEnviadoReparar.doAction();
                        _this.hide();
                    } else {
                        Ext.getBody().unmask();
                        mostrarMensaje(3, _this.idioma.lbValoresIncorrectos);

                    }*/

                }
                else if (_this.tabGeneral.getActiveTemplate().idComponent == 3) {
                    _this.panelEntregadosTemporalmente.doAction();
                    _this.hide();
                   /* if (_this.panelEntregadosTemporalmente.comboarea && _this.panelEntregadosTemporalmente.comboarea.getValue()) {
                        _this.panelEntregadosTemporalmente.doAction();
                        _this.hide();
                    } else {
                        Ext.getBody().unmask();
                        mostrarMensaje(1, 'Debe seleccionar un área de responsabilidad.');
                    }*/

                }
            }
        });
    },
    panelDatos: function() {
        var _this = this;
        var stor = Array();
        this.tabGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            formaVisualizacion: 'panel'
        });
        this.panelTraslado = new LOG.aft.documento.panelTraslado({
            //id: _this.idtraslados,
            idioma: _this.idioma,
            idarearesp: (_this.nodoPadre.attributes._parent) ? _this.nodoPadre.attributes._parent : _this.nodoPadre.attributes.id,
            nodoPadre: _this.nodoPadre,
            title: _this.idioma.lbtrasladoBtn,
            idComponent: 0,
            scope: _this
        });
        this.panelDevoluciones = new LOG.aft.documento.panelDevueltos({
            idioma: _this.idioma,
            idarearesp: (_this.nodoPadre.attributes._parent) ? _this.nodoPadre.attributes._parent : _this.nodoPadre.attributes.id,
            nodoPadre: _this.nodoPadre,
            title: _this.idioma.lbDevoluciones,
            idComponent: 1,
            scope: _this
        });
        this.panelEnviadoReparar = new LOG.aft.documento.panelEnviadosReparar({
            //id: _this.idenvtemp,
            idioma: _this.idioma,
            idarearesp: _this.idarearesp,
            nodoPadre: _this.nodoPadre,
            idestructuraEntidad: _this.idestructuraEntidad,
            arearesp: _this.arearesp,
            storeDocumento: _this.storeDocumento,
            title: _this.idioma.lbTitleEnviadoReparar,
            idComponent: 2,
            scope: _this
        });
        this.panelEntregadosTemporalmente = new LOG.aft.documento.panelEntregadosTemporalmente({
            //id: _this.idenvtemp,
            idioma: _this.idioma,
            idarearesp: _this.idarearesp,
            idestructuraEntidad: _this.idestructuraEntidad,
            nodoPadre: _this.nodoPadre,
            arearesp: _this.arearesp,
            storeDocumento: _this.storeDocumento,
            title: _this.idioma.lbTitleEntregadosTem,
            idComponent: 3,
            scope: _this
        });
        _this.tabGeneral.addTabToTemplete(_this.panelTraslado);
        _this.tabGeneral.addTabToTemplete(_this.panelDevoluciones);
        _this.tabGeneral.addTabToTemplete(_this.panelEnviadoReparar);
        _this.tabGeneral.addTabToTemplete(_this.panelEntregadosTemporalmente);
        this.add(_this.tabGeneral);
        _this.tabGeneral.init();
        _this.tabGeneral.view();
        _this.panelTraslado.gpPrincipal.fireEvent = _this.panelTraslado.gpPrincipal.fireEvent.createSequence(function(e) {
            if (e == 'render') {
                var loadMasKT = new Ext.LoadMask(_this.panelTraslado.gpPrincipal.getEl(), {msg: _this.idioma.lbMaskCargando}, {msgCls: 'mask-css'});
                loadMasKT.show();
                _this.panelTraslado.getStorePrincipal().load({
                    callback: function() {
                        loadMasKT.hide();
                    }
                });
            }
        });
        _this.panelDevoluciones.gpPrincipal.fireEvent = _this.panelDevoluciones.gpPrincipal.fireEvent.createSequence(function(e) {
            if (e == 'render') {
                var loadMasKT = new Ext.LoadMask(_this.panelDevoluciones.gpPrincipal.getEl(), {msg: _this.idioma.lbMaskCargando}, {msgCls: 'mask-css'});
                loadMasKT.show();
                _this.panelDevoluciones.getStorePrincipal().load({
                    callback: function() {
                        loadMasKT.hide();
                    }
                });
            }
        });
        this.panelEnviadoReparar.gpPrincipal.fireEvent = _this.panelEnviadoReparar.gpPrincipal.fireEvent.createSequence(function(e) {
            if (e == 'render') {
                var loadMaskR = new Ext.LoadMask(_this.panelEnviadoReparar.gpPrincipal.getEl(), {msg: _this.idioma.lbMaskCargando}, {msgCls: 'mask-css'});
                loadMaskR.show();
                _this.panelEnviadoReparar.getStorePrincipal().load({
                    callback: function() {
                        loadMaskR.hide();
                    }
                });
            }
        });
        this.panelEntregadosTemporalmente.gpPrincipal.fireEvent = _this.panelEntregadosTemporalmente.gpPrincipal.fireEvent.createSequence(function(e) {
            if (e == 'render') {
                var loadMaskE = new Ext.LoadMask(_this.panelEntregadosTemporalmente.gpPrincipal.getEl(), {msg: _this.idioma.lbMaskCargando}, {msgCls: 'mask-css'});
                loadMaskE.show();
                _this.panelEntregadosTemporalmente.getStorePrincipal().load({
                    callback: function() {
                        loadMaskE.hide();
                    }
                });
            }
        });
    }
});
LOG.aft.documento.utf8_encode = function(argString) {
    //  discuss at: http://phpjs.org/functions/utf8_encode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: sowberry
    // improved by: Jack
    // improved by: Yves Sucaet
    // improved by: kirilloid
    // bugfixed by: Onno Marsman
    // bugfixed by: Onno Marsman
    // bugfixed by: Ulrich
    // bugfixed by: Rafal Kukawski
    // bugfixed by: kirilloid
    //   example 1: utf8_encode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
            start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128
                    );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                    );
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                    );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}
/*
LOG.aft.documento.VentanaTipoReporte = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;
        _this.etiq = config.etiquetas;
        this.title = _this.etiq.lbTitleWInTipoReporte;
        this.closeAction = 'hide';
        this.resizable = false;
        this.modal = true;
        this.usarAplicar = false;
        this.width = 320;
        this.height = 150;
        this.idoperacion = config.idoperacion;
        this.iddocumento = config.iddocumento;
        this.aprobadopor = config.aprobadopor;
        this.operacion = config.operacion;
        this.entidad = config.entidad;

		
        _this.storeRecords = Array();
        _this.tituloReporte = "Desconocido";
        var i = 0;
        var record = _this.scope.getGridPrincipal().getSelectionModel().getSelected();
        this.codigooperacion = record.data.codigooperacion;
        
        while (i < _this.scope.arregloDocumentosAFT.length) {
            if (_this.scope.arregloDocumentosAFT[i].iddoc == record.get("iddoc")) {
                _this.tituloReporte = _this.scope.arregloDocumentosAFT[i].denominacion;
                break;
            }
            i += 1;
        }
		// ------Agregando Reporte de Utiles -----------
		var idreporte = '4';
		if(/tiles/.test(_this.tituloReporte)){
			idreporte = '20';
		}
		// ---------------------------------------------
        _this.storeRecords.push([_this.tituloReporte, idreporte]);
        for (var i = 0; i < _this.scope.acciones.length; i++) {
            switch (_this.scope.acciones[i].abreviatura) {
                case 'AltaRegVehiculos':
                    _this.storeRecords.push(['Alta en el Reg de Veh\xedculos', '1']);
                    break;
                case 'CartaDejaTecImport':
                    _this.storeRecords.push(['Carta de dejacion de TECNOIMPORT', '2']);
                    break;
                case 'CartaDejaTecTex':
                    _this.storeRecords.push(['Carta de dejacion de Tecnotex', '3']);
                    break;
                case 'CopiaFacOficioTecnoimport':
                    _this.storeRecords.push(['Copia de Factura de Oficio TECNOIMPORT', '5']);
                    break;
                case 'FacOficioTecnotex':
                    _this.storeRecords.push(['Factura de Oficio TECNOTEX', '6']);
                    break;
                case 'BajaTur':
                    _this.storeRecords.push(['Solicitud de Baja tur autos', '7']);
                    break;
                case 'Anexo1':
                    _this.storeRecords.push([' Anexo 1', '8']);
                    break;
                case 'Anexo2':
                    _this.storeRecords.push([' Anexo 2', '9']);
                    break;
                case 'Anexo3':
                    _this.storeRecords.push([' Anexo 3', '10']);
                    break;
                case 'Anexo4':
                    _this.storeRecords.push([' Anexo 4', '11']);
                    break;
                case 'Anexo5':
                    _this.storeRecords.push([' Anexo 5', '12']);
                    break;
                case 'Anexo6':
                    _this.storeRecords.push([' Anexo 6', '13']);
                    break;
                    // case 'AnexoHoja1':
                    //  storeRecords.push([' Anexo Hoja 1', '14']);
                    //  break;
                case 'AnexoHoja4':
                    _this.storeRecords.push([' Anexo Hoja 4', '15']);
                    break;
                case 'AnexoHoja5':
                    _this.storeRecords.push([' Anexo Hoja 5', '16']);
                    break;
                case 'MovimientoInventario':
                    _this.storeRecords.push([' Movimiento de inventario', '17']);
                    break;

            }
        }

        this.cmbTipoReporte = new LOG.util.ComboBox({
            fieldLabel: _this.etiq.lbcmbTipoReporte,
            valueField: 'id',
            displayField: 'name',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            editable: false,
            anchor: '80%',
            listeners: {
                'select': function() {
                    _this.listaBotones.getItem(2).enable();
                }
            },
            store: new Ext.data.SimpleStore({
                fields: ['name', 'id'],
                data: _this.storeRecords
                //[
                // ['Alta en el Reg de Vehículos', '1'],
                // ['Carta de dejacion de TECNOIMPORT', '2'],
                // ['Carta de dejacion de Tecnotex', '3'],
                // ['Movimiento de activo fijo tangible', '4'],
                // ['Copia de Factura de Oficio TECNOIMPORT', '5'],
                // ['Factura de Oficio TECNOTEX', '6']
                // ]
            })
        });
        this.frmReporte = new Ext.form.FormPanel({
            frame: true,
            region: 'center',
            labelAlign: 'top',
            items: [_this.cmbTipoReporte]
        });
        this.items = [_this.frmReporte];

        LOG.aft.documento.VentanaTipoReporte.superclass.constructor.apply(this, arguments);
    },
    initComponent: function() {
        var _this = this;
        LOG.aft.documento.winRecepciones.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {

                Ext.Ajax.request({
                    url: 'cargardatosmoneda',
                    method: 'POST',
                    params: {},
                    callback: function(options, success, response) {
                        resultado = Ext.util.JSON.decode(response.responseText);

                        alternativa = resultado.alternativa;
                        monedacontable = resultado.monedacontable;
                        nommonedacontable = resultado.nommonedacontable;
                        monedaalternativa = resultado.monedaalternativa;
                        nommonedaalternativa = resultado.nommonedaalternativa;


                        var dirReport = "";
                        var dirImg = "";
                        switch (_this.cmbTipoReporte.getValue()) {
                            case '1':
                                dirReport = '/distra/logistica/activofijo/documento/AltaRegVehiculos';
                                break;
                            case '2':
                                dirReport = '/distra/logistica/activofijo/documento/CartaDejaTecImport';
                                dirImg = "/logistica/activos_fijos/documento/views/images/tecnoimport.png";
                                break;
                            case '3':
                                dirReport = '/distra/logistica/activofijo/documento/CartaDejaTecTex';
                                dirImg = "/logistica/activos_fijos/documento/views/images/tecnotex.png";
                                break;
							// ------------------ Reporte general de Modelo de AFT -------------------------
                            case '4':
                                dirReport = _this.codigooperacion == 'OPER_TELETRABAJO' 
                                    ? '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangibleTeletrabajo'
                                    : '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangible';
                                break;
							case '20':
                                // Este es el reporte del modelo de movimiento de los utiles 
                                dirReport = _this.codigooperacion == 'OPER_TELETRABAJO_UH' 
                                    ? '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangibleTeletrabajoUH'
                                    : '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangible_3';
                                break;
							// ------------------ Reporte general de Modelo de UH --------------------------
                            case '5':
                                dirReport = '/distra/logistica/activofijo/documento/CopiaFacOficioTecnoimport';
                                dirImg = "/logistica/activos_fijos/documento/views/images/tecnoimport.png";
                                break;
                            case '6':
                                dirReport = '/distra/logistica/activofijo/documento/FacOficioTecnotex';
                                dirImg = "/logistica/activos_fijos/documento/views/images/tecnotex.png";
                                break;
                            case '7':
                                dirReport = '/distra/logistica/activofijo/documento/BajaTur';
                                break;
                            case '8':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo1';
                                break;
                            case '9':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo2';
                                break;
                            case '10':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo3';
                                break;
                            case '11':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo4';
                                break;
                            case '12':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo5';
                                break;
                            case '13':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo6';
                                break;
                                //case '14':
                                // dirReport = '/distra/logistica/activofijo/documento/AnexoHoja1';
                                // break;
                            case '15':
                                dirReport = '/distra/logistica/activofijo/documento/AnexoHoja4';
                                break;
                            case '16':
                                dirReport = '/distra/logistica/activofijo/documento/AnexoHoja5';
                                break;
                            case '17':
                                dirReport = '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangible_2';
                                break;
                        }

                        var fecha = new Date();
                        var has = _this.scope.getGridPrincipal().getSelectionModel().hasSelection();
                        var record = _this.scope.getGridPrincipal().getSelectionModel().getSelected();
                        var report = new LOG.util.Report({
                            reports: [
                                {
                                    name: 'Vista principal',
                                    params: {
                                        iddocumento: _this.iddocumento,
                                        iddoc: record.get("iddoc"),
                                        idnodo: record.get("idnodo"),
                                        iddir: (idespaciotrabajo && idespaciotrabajo != undefined) ? idespaciotrabajo : null,
                                        aprobadopor: (_this.aprobadopor) ? LOG.aft.documento.utf8_encode(_this.aprobadopor) : '',
                                        operacion: (_this.operacion) ? LOG.aft.documento.utf8_encode(_this.operacion) : '',
                                        idestructura: _this.identidad,
                                        nommonedaalternativa: (nommonedaalternativa) ? LOG.aft.documento.utf8_encode(nommonedaalternativa) : null,
                                        entidad_direccion: (_this.entidadSeleccionada.entidadDireccion) ? LOG.aft.documento.utf8_encode(_this.entidadSeleccionada.entidadDireccion) : '',
                                        codigo_entidad: _this.entidadSeleccionada.entidadCodigo,
                                        mes: LOG.aft.documento.mesActual(fecha.getMonth() + 1),
                                        year: fecha.getFullYear(),
                                        titulo: LOG.aft.documento.utf8_encode(_this.tituloReporte),
                                        yearRev: fecha.getFullYear() - 1958, //logistica\activos_fijos\documento\views\images,
                                        //dirImg: "/logistica/activos_fijos/documento/views/images/tecnoimport.png",
                                        dirImg: dirImg,
                                        dia: fecha.getDate()
                                    },
                                    dirReport: dirReport
                                }
                            ]
                        }).view();                       
                        _this.close();



                    }
                });
            }
        });
        this.fireEvent = this.fireEvent.createSequence(function(e) {
            if (e == 'show' && _this.storeRecords.length == 1) {
                _this.cmbTipoReporte.setValue(_this.storeRecords[0][1]);
                _this.listaBotones.getItem(2).handler();
            }
        })
    }
});*/
LOG.aft.documento.regNumAReparar = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;

        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        // this.concepto = config.idioma.lbTtBuscar;        
        this.autoLoad = false;
        this.autoSelect = false;
        this.idioma = config.idioma;
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/planificacionmantenimiento';
        this.urlBusquedaGridPrincipal = 'cargarRegNumMantenimiento';
        this.idGridPrincipal = 'idregnumerico';
        LOG.aft.documento.regNumAReparar.superclass.constructor.call(this, config);
        this.height = (config.height) ? config.height : 190;
        this.width = (config.width) ? config.width : 200;

        /* 
         this.autoLoad = false;
         this.bbarVisible = true;
         this.formaVisualizacion = 'panel';
         this.busquedaBasica = false;
         this.modoSeleccion = 3;
         this.modal = true;
         this.layout = 'border';
         this.idGridPrincipal = 'idregnumerico';
         this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/planificacionmantenimiento';
         this.urlBusquedaGridPrincipal = 'cargarRegNumMantenimiento';
         LOG.aft.documento.regNumAReparar.superclass.constructor.call(this, config);       
         this.getVistaPrincipal().resizable = false;
         this.getVistaPrincipal().setSize(700, 400);
         this.model = new LOG.aft.documento.Model({
         idioma: config.idioma,
         scope: _this
         });*/
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico'
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            header: _this.idioma.cgCodigo,
            width: 210,
            dataIndex: 'codigo',
            default: true

        });
        this.addGridColumn({
            header: _this.idioma.cgMedio,
            width: 210,
            dataIndex: 'denominacion',
            default: true

        });
        this.addGridColumn({
            header: 'Nro serie',
            width: 100,
            dataIndex: 'nroserie',
            default: true

        });
        this.addGridColumn({
            header: 'Explotaci\xf3n',
            width: 90,
            dataIndex: 'tiempoexplotacion',
            default: true
        });
        this.addGridColumn({
            header: 'Recurso consumido',
            width: 90,
            dataIndex: 'cantidadrecursoconsumido',
            default: true
        });
        this.addGridColumn({
            header: 'Per\xedodo/Recurso',
            width: 90,
            dataIndex: 'planfmantenim',
            agrupador: true,
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idplanificacionmantenimiento',
            hidden: true

        });
    },
    render: function() {

        var _this = this;
        var vista = LOG.aft.documento.regNumAReparar.superclass.render.call(this);

        _this.smGridPrincipal.on({
            'rowselect': function(sm) {
                LOG.aft.documento.regNumAReparar.scope = _this;
            }
        });

        _this.getStorePrincipal().on({
            'beforeload': function(st) {
                Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
                st.initBaseParams.AFT = true;
            },
            'load': function(st, r, o) {
                Ext.getBody().unmask();
                st.initBaseParams.AFT = true;
            }
        });
        _this.getStorePrincipal().load();
        return vista;
    }
});
/*
 LOG.aft.documento.ventanaTipoReporte = Ext.extend(Ext.Window, {
 constructor: function (config) {
 Ext.apply(this, config);
 var _this = this;
 _this.etiq = config.etiquetas;
 this.title = _this.etiq.lbTitleWInTipoReporte;
 this.closeAction = 'hide';
 this.resizable = false;
 this.modal = true;
 this.width = 320;
 this.autoHeight = true;
 this.idoperacion = config.idoperacion;
 this.iddocumento = config.iddocumento;
 this.aprobadopor = config.aprobadopor;
 this.operacion = config.operacion;
 this.entidad = config.entidad;
 this.constrain= true;
 
 this.buttons = [
 {
 icon: perfil.dirImg + 'cancelar.png',
 iconCls: 'btn',
 text: "Cancelar",
 tooltip: _this.etiq.lbTtBtnCancelar,
 handler: function () {
 _this.close();
 }
 },
 {
 icon: perfil.dirImg + 'aceptar.png',
 iconCls: 'btn',
 text: 'Aceptar',
 tooltip: _this.etiq.lbTtBtnAceptar,
 handler: function () {        
 var funcion = _this.storeTipoReporte.getAt(_this.storeTipoReporte.find('id', _this.cmbTipoReporte.getValue())).get('funcion');
 var report = new Ext.erp.LogisticaReport({});
 report.showReport(funcion, {
 iddocumento: _this.iddocumento,
 aprobadopor: _this.aprobadopor,
 operacion: _this.operacion,
 entidad: _this.entidad,
 });
 }
 }
 ];
 
 _this.storeTipoReporte = new Ext.data.Store({
 url: '/logistica/activos_fijos/documento/index.php/gestdocumento/cargartiporeportes',
 autoLoad: true,
 reader: new Ext.data.JsonReader({
 }, [
 {
 name: 'id'
 },
 {
 name: 'nombre'
 },
 {
 name: 'funcion'
 }
 ]),
 baseParams: {
 idoperacion: _this.idoperacion
 },
 listeners: {
 'load': function (st, records, options) {
 if (records.length == 0) {
 mostrarMensaje('1', _this.etiq.lbNoExistenReportes);
 _this.close();
 
 } else if (records.length == 1) {
 var funcion = records[0].get('funcion');
 var report = new Ext.erp.LogisticaReport({});
 report.showReport(funcion, {
 iddocumento: _this.iddocumento,
 aprobadopor: _this.aprobadopor,
 operacion: _this.operacion,
 entidad: _this.entidad
 });
 _this.cmbTipoReporte.setValue(records[0].get('id'));
 }
 }
 }
 });
 this.cmbTipoReporte = new Ext.form.ComboBox({
 fieldLabel: _this.etiq.lbcmbTipoReporte,
 hiddenName: 'id',
 valueField: 'id',
 displayField: 'nombre',
 store: _this.storeTipoReporte,
 triggerAction: 'all',
 forceSelection: true,
 typeAhead: true,
 mode: 'local',
 width: 250,
 emptyText: _this.etiq.lbCbVacio,
 editable: false,
 tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>'
 });
 this.frmReporte = new Ext.form.FormPanel({
 frame: true,
 labelAlign: 'top',
 items: [_this.cmbTipoReporte]
 });
 this.items = [_this.frmReporte];
 
 LOG.aft.documento.ventanaTipoReporte.superclass.constructor.apply(this, arguments);
 this.show();
 },
 
 });*/

LOG.aft.documento.winResponsable = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        Ext.apply(this, config);
        this.resizable = false;
        this.usarAplicar = false;
        this.closeAction = 'close';
        this.width = 800;
        this.height = 400;
        this.modal = true;
        LOG.aft.documento.winResponsable.superclass.constructor.call(this, config);
    },
    initComponent: function(config) {
        var _this = this;
        LOG.aft.documento.winResponsable.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                _this.destroy();
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                _this.onAceprtarFn.call(_this.scope);
            }
        });


    }
});

LOG.aft.documento.mesActual = function(mes) {
    switch (mes)
    {
        case 1:
            return "Enero";
        case 2:
            return "Febrero";
        case 3:
            return "Marzo";
        case 4:
            return "Abril";
        case 5:
            return "Mayo";
        case 6:
            return "Junio";
        case 7:
            return "Julio";
        case 8:
            return "Agosto";
        case 9:
            return "Septiembre";
        case 10:
            return "Octubre";
        case 11:
            return "Noviembre";
        case 12:
            return "Diciembre";
    }
};
