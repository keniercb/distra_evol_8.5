
LOG.aft.trasladomasivo.winDocAdd = Ext.extend(LOG.aft.documento.winDocAdd, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        LOG.aft.trasladomasivo.winDocAdd.superclass.constructor.call(this, config);

    },
});

LOG.aft.trasladomasivo.TabPanelWinGestionar = Ext.extend(LOG.aft.documento.TabPanelWinGestionar, {
    constructor: function(config) {

        LOG.aft.trasladomasivo.TabPanelWinGestionar.superclass.constructor.call(this, config);
    },
    crearTabSecundario: function(datosespecificos, codigooperacion) {
        var _this = this;
        switch (datosespecificos) {

            case '4':
            {
                this.tabSecundario = getItemsTrasladoExterno(_this.idioma, _this.datos, _this.modificar, this.nodoPadre, false, true);
                this.add(this.tabSecundario);
            }
                break;

        }
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
    crearComboTipoDoc: function(value) {
        var _this = this;
        this.areaseleccionada = 'arearesp';
        this.comboTipoDoc = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCMTipoDoc,
            editable: false,
            url: '/logistica/activos_fijos/documento/index.php/gesttrasladomasivo/gettipodocumentos',
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
            url: '/logistica/activos_fijos/documento/index.php/gesttrasladomasivo/getoperaciones',
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
});
