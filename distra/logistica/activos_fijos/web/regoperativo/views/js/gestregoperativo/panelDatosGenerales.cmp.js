Ext.ns('Ext.LOG.RegNumOperativo');
Ext.LOG.RegNumOperativo.PanelDatosGenerales = Ext.extend(Ext.form.FormPanel, {
    constructor: function(config) {
        console.info(config);
        this.listaAcciones = (config.listaAcciones)?config.listaAcciones:new LOG.util.List(config.acciones_reportes);
        Ext.apply(this, config);
        Ext.LOG.RegNumOperativo.PanelDatosGenerales.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        var _this = this;
        _this.chekbosesCmps = new Array();
        _this.textfieldCmps = new Array();
        _this.combosCmps = new Array();
        _this.dateCmps = new Array();
        _this.texAreasCmps = new Array();

        var config = {
            frame: true
        };
        config.formulario = new LOG.util.ColumnForm/*LOG.util.ColumnPanel*/({
            autoHeight: true,
            columnWidth: .99,
            columnas: 4
        });

        this.plugins = new Array();
        //this.attatchPlugin(Ext.aft.regoperativo.plugins.Transportacion.Campos);

        for (var i = 0; i < arrCampos.length; i++) {
            this.attatchPlugin(arrCampos[i]);
        }


        this.campos = LOG.aft.RegOperativo.Campos;
        this.elementosXtablaConst = new Array();
        this.elementosXtabla = new Array();

        Ext.each(this.plugins, function(plugin) {
            plugin.init(_this);
        });

        if (!_this.componentes) {
            Ext.Ajax.request({
                url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/mandarElementos',
                method: 'POST',
                params: {
                    idnaturaleza: _this.idnaturaleza,
                    identidad: _this.idestructurapadre
                },
                callback: function(opt, success, resp) {
                    var respData = Ext.decode(resp.responseText);
                    var result = {};
                    result.datos = [];
                    for (var i = 0; i < respData.datos.length; i++) {
                        if (respData.datos[i] && respData.datos[i].ownerPlugins) {
                            var pluginData = _this.existeObjInArray(result.datos, {name: respData.datos[i].idPlugin});
                            if (!pluginData) {
                                var plug = {
                                    name: respData.datos[i].idPlugin,
                                    idPlugin: respData.datos[i].idPlugin,
                                    pugins: true,
                                    namePlugin: respData.datos[i].namePlugin,
                                    atributos: []
                                };
                                plug.atributos.push(respData.datos[i]);
                                result.datos.push(plug);
                            } else {
                                pluginData.atributos.push(respData.datos[i]);
                            }
                        } else {
                            result.datos.push(respData.datos[i]);
                        }
                    }
                    if (respData.datos.length) {
                        _this.configurarCamposNaturaleza(result, config);
                    } else {
                        _this.tabDatosGenerales.remove(_this);
                    }
                }
            });

        } else if (_this.datosEspesificosPlugins) {
            _this.configurarCamposNaturaleza(_this.componentes, config);
        }
        else {
            for (var i = 0; i < _this.componentes.length; i++) {
                //config.formulario.addComponent(_this.componentes[i]);
                if (_this.componentes[i].xtype == 'textfield') {
                    _this.textfieldCmps.push(_this.componentes[i])
                }
                else if (_this.componentes[i].xtype == 'numberfield') {
                    _this.textfieldCmps.push(_this.componentes[i])
                }
                else if (_this.componentes[i].xtype == 'datefield') {
                    _this.dateCmps.push(_this.componentes[i])
                }
                else if (_this.componentes[i].xtype == 'textarea') {
                    _this.texAreasCmps.push(_this.componentes[i])
                }

                else if (_this.componentes[i].xtype == 'checkbox') {
                    _this.chekbosesCmps.push(_this.componentes[i])
                }
                else {
                    _this.combosCmps.push(_this.componentes[i])
                }
                _this.elementosXtabla.push({
                    idtabla: _this.componentes[i].idtabla,
                    name: _this.componentes[i].name
                });
                config.formulario.doLayout();
            }


            for (var i = 0; i < _this.textfieldCmps.length; i++) {
                config.formulario.addComponent(_this.textfieldCmps[i]);
            }

            for (var i = 0; i < _this.dateCmps.length; i++) {
                config.formulario.addComponent(_this.dateCmps[i]);
            }

            for (var i = 0; i < _this.combosCmps.length; i++) {
                config.formulario.addComponent(_this.combosCmps[i]);
            }
            for (var i = 0; i < _this.chekbosesCmps.length; i++) {
                config.formulario.addComponent(_this.chekbosesCmps[i]);
            }
            for (var i = 0; i < _this.texAreasCmps.length; i++) {
                config.formulario.addComponent(_this.texAreasCmps[i]);
            }
            if (_this.componentesAux) {
                for (var j = 0; j < _this.componentesAux.length; j++) {
                    config.formulario.addComponent(_this.componentesAux[j]);
                    _this.elementosXtabla.push({
                        idtabla: _this.componentesAux[j].idtabla,
                        name: _this.componentesAux[j].name
                    });
                    config.formulario.doLayout();
                }
            }
            config.formulario.doLayout();
            _this.doLayout();
            Ext.apply(_this.elementosXtablaConst, _this.elementosXtabla);
            //_this.elementosXtablaConst = _this.elementosXtabla;
        }
        config.autoScroll = true;

        config.items = [
            {
                layout: 'column',
                items: [config.formulario]
            }
        ];
        Ext.apply(this, config);
        Ext.LOG.RegNumOperativo.PanelDatosGenerales.superclass.initComponent.call(this, arguments);
    },
    existeObjInArray: function(arr, obj) {
        var result = null;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == obj.name) {
                result = arr[i];
                break;
            }
        }
        return result;
    },
    configurarCamposNaturaleza: function(respData, config) {
        var _this = this;
        var componentesAuxdelTab = new Array();
        for (var i = 0; i < respData.datos.length; i++) {
            if (respData.datos[i].name != "idubicacion")
            {
                if (respData.datos[i].pugins) {
                    this.fnDatosEspesificosNaturaleza(respData.datos[i]);
                    //break;
                }
                if (respData.datos[i].name == 'idtipocombustible') {
                    componentesAuxdelTab.push({
                        xtype: 'hidden',
                        name: 'idtipocombustible',
                        id: 'idCombotipocombustible' + _this.cant,
                        value: (_this.recordTree) ? _this.recordTree.data.idtipocombustible : null
                    });
                    var combo = _this.getComboTipoCombustible();
                    if (_this.recordTree &&
                            _this.recordTree.data.idtipocombustible) {
                        combo.value = _this.recordTree.data.denomtipocombustible;
                    } else {
                        combo.value = null;
                    }
                    //config.formulario.addComponent(combo);
                    _this.combosCmps.push(combo);
                }
                else if (_this.campos[respData.datos[i].name] &&
                        _this.campos[respData.datos[i].name].xtype == "checkbox") {
                    _this[respData.datos[i].name] = _this.campos[respData.datos[i].name];
                    componentesAuxdelTab.push({
                        xtype: 'hidden',
                        name: _this[respData.datos[i].name].valorEnviar,
                        id: 'idcheckbox' + _this[respData.datos[i].name].valorEnviar + _this.cant,
                        value: (_this.recordTree) ? _this.recordTree.data[_this[respData.datos[i].name].valorEnviar] : null
                    });

                    if (_this.recordTree && (_this.recordTree.data[_this[respData.datos[i].name].valorEnviar] == 1)) {
                        _this[respData.datos[i].name].checked = true;
                    } else {
                        _this[respData.datos[i].name].checked = false;
                    }
                    _this[respData.datos[i].name].handler = function(cmb, newValue) {
                        if (newValue == false) {
                            Ext.getCmp('idcheckbox' + cmb.valorEnviar + _this.cant).setValue("0");
                        } else {
                            Ext.getCmp('idcheckbox' + cmb.valorEnviar + _this.cant).setValue("1");
                        }
                    };
                    if (_this.busqAvanzada) {
                        _this[respData.datos[i].name].allowBlank = true;
                    }
                    //config.formulario.addComponent(_this[respData.datos[i].name]);
                    _this.chekbosesCmps.push(_this[respData.datos[i].name]);

                }
                else if (respData.datos[i].name == 'idresponsable') {
                    componentesAuxdelTab.push({
                        xtype: 'hidden',
                        name: 'idpersona',
                        value: (_this.recordTree) ? _this.recordTree.data.idpersona : null,
                        id: 'idResponsable' + _this.cant
                    });

                    _this[respData.datos[i].name] = new Ext.form.TextField({
                        allowBlank: true,
                        readOnly: true,
                        editable: false,
                        id: 'textfieldResponsable' + _this.cant,
                        fieldLabel: respData.datos[i].label,
                        value: (_this.recordTree) ? _this.recordTree.data[_this.campos[respData.datos[i].name].nameInRecord] : null, //(_this.recordTree) ? _this.recordTree.data.nombrepersona : null,
                        emptyText: 'Seleccione...',
                        listeners: {
                            'focus': function(field) {
                                //Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');

                                var panelBusPer;
                                if (!winBuscarPersona) {
                                    var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                        region: 'center',
                                        id: 'panelBusPer',
                                        singleSelect: true,
                                        identidad: perfil.idestructuracomun,
										seguridad: 0,
                                        showBtnAdicionar: true,
                                        //modulo: 'LOGISTICA',
                                        showBtnAyuda: false,
										limit: 15,
										start: 0
                                    });

                                    var winBuscarPersona = new Ext.LOG.RegNumOperativo.winResponsable({
                                        title: 'Personas',
                                        layout: 'fit',
                                        initComponent: function(config) {
                                            Ext.LOG.RegNumOperativo.winResponsable.superclass.initComponent.call(this);
                                            LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
                                                handler: function() {
                                                    winBuscarPersona.destroy();
                                                }
                                            });
                                            LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
                                                disabled: true,
                                                handler: function() {
                                                    if (panelBusPer.getSeleccion()) {
                                                        Ext.getCmp('idResponsable' + _this.cant).setValue(panelBusPer.getSeleccion().get('idpersona'));
                                                        Ext.getCmp('textfieldResponsable' + _this.cant).setValue((panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel')));
                                                    }
                                                    winBuscarPersona.close();
                                                }
                                            });
                                        }
                                    });
                                    winBuscarPersona.add(panelBusPer);
                                    winBuscarPersona.show();
                                    panelBusPer.smPersonas.on({
                                        'rowselect': function(sm, rowIndex, r) {
                                            if (sm.selections.items.length > 0) {
                                                winBuscarPersona.listaBotones.getItem(2).enable();
                                            } else {
                                                winBuscarPersona.listaBotones.getItem(2).disable();
                                            }
                                        },
                                        'rowdeselect': function(sm, rowIndex, r) {
                                            if (sm.selections.items.length > 0) {
                                                winBuscarPersona.listaBotones.getItem(2).enable();
                                            } else {
                                                winBuscarPersona.listaBotones.getItem(2).disable();
                                            }
                                        }
                                    });
                                    panelBusPer.runSearch = function(condiciones) {
                                        if (condiciones.length > 0) {
                                            condiciones[condiciones.length - 1].logico = '';
                                            panelBusPer.hasSearch = true;
                                            panelBusPer.searchField.setVisibleBtnClear(panelBusPer.hasSearch);
                                        } else {
                                            panelBusPer.hasSearch = false;
                                            panelBusPer.searchField.setVisibleBtnClear(this.hasSearch);
                                        }
                                        panelBusPer.stPersonas.baseParams.condiciones = condiciones;
										panelBusPer.stPersonas.baseParams.limit = 20;
										panelBusPer.stPersonas.baseParams.start = 0;
                                        panelBusPer.stPersonas.load();
                                    }
                                    panelBusPer.cleanSearch = function() {

                                        panelBusPer.fpAdvancedSearch.getForm().reset();
                                        panelBusPer.stPersonas.baseParams.condiciones = '';
                                        if (panelBusPer.fpAdvancedSearch.isVisible())
                                            panelBusPer.tfNumero.focus(true, 100);
                                        panelBusPer.btnCleanSearch.disable();
                                        panelBusPer.btnSearch.disable();
                                        panelBusPer.searchField.setValue(" ");
                                    }
                                }
                                else {
                                    winBuscarPersona.show();
                                }
                            }
                        }
                    });
                    if (_this.busqAvanzada) {
                        _this[respData.datos[i].name].allowBlank = true;
                    }
                    //config.formulario.addComponent(_this[respData.datos[i].name]);
                    _this.textfieldCmps.push(_this[respData.datos[i].name]);
                }
                else {
                    if (_this.campos[respData.datos[i].name]) {
                        if (_this.campos[respData.datos[i].name].xtype == "combobox") {
                            var cmpTemp = _this.campos[respData.datos[i].name];
                            if (respData.datos[i].name != 'idarearesp') {
                                var arrURL = cmpTemp.url.split('/');
                                if (arrURL.length == 1) {
                                    cmpTemp.url = '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/' + cmpTemp.url;
                                }
                            }
                            if (_this.validarCmpArea()) {
                                var cmpTemp = _this.campos.idarearesp;
                                _this.idarearesp = new Ext.LOG.RegNumOperativo.ComboDepositos({
                                    allowBlank: cmpTemp.allowBlank,
                                    fieldLabel: cmpTemp.fieldLabel,
                                    valueField: cmpTemp.valueField,
                                    valorEnviar: cmpTemp.valorEnviar,
                                    autoCreate: true,
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    resizable: true,
                                    forceSelection: true,
                                    idioma: _this.idioma,
                                    width: 216,
                                    editable: false,
                                    emptyText: _this.idioma.lbCbVacio,
                                    listeners: {
                                        'select': function(combo, record, index) {
                                            Ext.getCmp('idarearesp'+ _this.cant).setValue(record.data.iddeposito);
                                        }
                                    }
                                });
                                if (_this.recordTree) {
                                    _this.idarearesp.getStore().on('load', function (st, rd) {
                                        _this.idarearesp.setValue(_this.recordTree.data.idarearesp);
                                    });
                                }

                                componentesAuxdelTab.push({
                                    xtype: 'hidden',
                                    name: 'idarearesp',
                                    value: (_this.recordTree) ? _this.recordTree.data.idarearesp : null,
                                    id: 'idarearesp' + _this.cant
                                });

                                if (_this.busqAvanzada) {
                                    _this.idarearesp.allowBlank = true;
                                }

                                // config.formulario.addComponent(_this[respData.datos[i].name]);
                                _this.combosCmps.push(_this.idarearesp);
                                continue;

                            } else {

                                var combo2 = new LOG.util.ComboBox(cmpTemp);
                                _this[respData.datos[i].name] = new Ext.form.ComboBox({
                                    fieldLabel: combo2.fieldLabel,
                                    valueField: combo2.displayField,
                                    displayField: combo2.displayField,
                                    valorEnviar: combo2.valorEnviar,
                                    forceSelection: true,
                                    url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/' + combo2.url,
                                    store: combo2.store,
                                    width: 216,
                                    editable: false,
                                    triggerAction: 'all',
                                    value: (_this.recordTree) ? _this.recordTree.data[_this.campos[respData.datos[i].name].nameInRecord] : null,
                                    allowBlank: combo2.allowBlank,
                                    emptyText: _this.idioma.lbCbVacio,
                                    listeners: {
                                        'select': function(combo, record, index) {
                                            Ext.getCmp(combo.valorEnviar + _this.cant).setValue(record.data[combo.valorEnviar]);
                                        }
                                    }
                                });
                            }
                            if (respData.datos[i].name == 'idcolorprim') {
                                _this[respData.datos[i].name].store.baseParams.colorPrimario = 1;
                            }

                            componentesAuxdelTab.push({
                                xtype: 'hidden',
                                name: cmpTemp.valorEnviar,
                                value: (_this.recordTree) ? _this.recordTree.data[respData.datos[i].name] : null,
                                id: cmpTemp.valorEnviar + _this.cant
                            });

                            if (_this.busqAvanzada) {
                                _this[respData.datos[i].name].allowBlank = true;
                            }

                            // config.formulario.addComponent(_this[respData.datos[i].name]);
                            _this.combosCmps.push(_this[respData.datos[i].name]);

                        }
                        else {
                            if (respData.datos[i].name == "fechaadq") {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: cmpMuestra.allowBlank
                                });
                            }
                            else if (respData.datos[i].name == 'vidautil') {
                                var cmpMuestra = _this.campos[respData.datos[i].name];

                                _this[respData.datos[i].name] = new Ext.form.TextField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'vidautil',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: cmpMuestra.allowBlank,
                                    listeners: {
                                        'change': function(f, newV, oldV) {
                                            if (Ext.getCmp(_this.cant + 'fechaexpini').getValue() != 'undefined' && Ext.getCmp(_this.cant + 'fechaexpfin').getValue() != 'undefined') {
                                                if (Ext.getCmp(_this.cant + 'fechaexpfin').isValid() && Ext.getCmp(_this.cant + 'fechaexpini').isValid()) {
                                                    var fecha = Ext.getCmp(_this.cant + 'fechaexpini').getValue();
                                                    var dia = fecha.getDate();
                                                    var mes = fecha.getMonth() + 1;
                                                    var anio = fecha.getFullYear();
                                                    var calculo = (parseInt(anio) + parseInt(f.getValue()));
                                                    dia = (dia < 10) ? '0' + dia : dia;
                                                    mes = (mes < 10) ? '0' + mes : mes;
                                                    var total = dia + '/' + mes + '/' + calculo;
                                                    var id = _this.cant + 'fechaexpfin';
                                                    Ext.getCmp(id).setValue(total);
                                                }
                                            }
                                        }
                                    }
                                });
                            }

                            else if (respData.datos[i].name == "fechaexpini" && _this.campos['fechaexpfin']) {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'fechaexpini',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: cmpMuestra.allowBlank,
                                    listeners: {
                                        'change': function(f, newV, oldV) {
                                            Ext.getCmp(_this.cant + 'fechaexpfin').setMinValue(newV);
                                            if (Ext.getCmp(_this.cant + 'vidautil').getValue() != 'undefined' && Ext.getCmp(_this.cant + 'fechaexpfin').getValue() != 'undefined') {
                                                if (Ext.getCmp(_this.cant + 'fechaexpfin').isValid() && Ext.getCmp(_this.cant + 'vidautil').isValid()) {
                                                    var fecha = f.getValue();

                                                    var dia = fecha.getDate();
                                                    var mes = fecha.getMonth() + 1;
                                                    var anio = fecha.getFullYear();

                                                    var calculo = (parseInt(anio) + parseInt(Ext.getCmp(_this.cant + 'vidautil').getValue()));

                                                    dia = (dia < 10) ? '0' + dia : dia;
                                                    mes = (mes < 10) ? '0' + mes : mes;
                                                    var total = dia + '/' + mes + '/' + calculo;
                                                    var id = _this.cant + 'fechaexpfin';
                                                    if (calculo && dia && mes) {
                                                        Ext.getCmp(id).setValue(total);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            else if (respData.datos[i].name == "fechaexpfin" && _this.campos['fechaexpini']) {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'fechaexpfin',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: cmpMuestra.allowBlank,
                                    listeners: {
                                        'change': function(f, newV, oldV) {
                                            Ext.getCmp(_this.cant + 'fechaexpini').setMaxValue(newV);

                                            if (Ext.getCmp(_this.cant + 'vidautil').getValue() != 'undefined' && Ext.getCmp(_this.cant + 'fechaexpini').getValue() != 'undefined') {
                                                if (Ext.getCmp(_this.cant + 'fechaexpini').isValid() && Ext.getCmp(_this.cant + 'vidautil').isValid()) {
                                                    var fecha = f.getValue();
                                                    var dia = fecha.getDate();
                                                    var mes = fecha.getMonth() + 1;
                                                    var anio = fecha.getFullYear();
                                                    var calculo = (parseInt(anio) - parseInt(Ext.getCmp(_this.cant + 'vidautil').getValue()));
                                                    dia = (dia < 10) ? '0' + dia : dia;
                                                    mes = (mes < 10) ? '0' + mes : mes;
                                                    var total = dia + '/' + mes + '/' + calculo;
                                                    var id = _this.cant + 'fechaexpini';
                                                    if (calculo && dia && mes) {
                                                        Ext.getCmp(id).setValue(total);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            else if (respData.datos[i].name == "vencimientolot" && _this.campos['vencimientolot']) {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'vencimientolot',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: !cmpMuestra.obligatorio,
                                    listeners: {
                                        'change': function(f, newV, oldV) {
                                        }
                                    }
                                });
                            }
                            else if (respData.datos[i].name == "lot" && _this.campos['lot']) {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'lot',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: !cmpMuestra.obligatorio,
                                    listeners: {
                                        'change': function(f, newV, oldV) {
                                            if (Ext.getCmp(_this.cant + 'vencimientolot')) {
                                                if (Ext.getCmp(_this.cant + 'lot').isValid()) {
                                                    var fecha = f.getValue();
                                                    var dia = fecha.getDate();
                                                    var mes = fecha.getMonth() + 1;
                                                    var anio = fecha.getFullYear();
                                                    var calculo = (parseInt(anio) +3);
                                                    dia = (dia < 10) ? '0' + dia : dia;
                                                    mes = (mes < 10) ? '0' + mes : mes;
                                                    var total = dia + '/' + mes + '/' + calculo;
                                                    if (calculo && dia && mes) {
                                                        Ext.getCmp(_this.cant + 'vencimientolot').setValue(total);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            else if (respData.datos[i].name == "vencimientoficav" && _this.campos['vencimientoficav']) {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'vencimientoficav',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: !cmpMuestra.obligatorio,
                                    listeners: {
                                        'change': function (f, newV, oldV) {
                                        }
                                    }
                                });
                            }
                            else if (respData.datos[i].name == "ficav" && _this.campos['ficav']) {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'ficav',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: !cmpMuestra.obligatorio,
                                    listeners: {
                                        'change': function(f, newV, oldV) {
                                            if (Ext.getCmp(_this.cant + 'vencimientoficav')) {
                                                if (Ext.getCmp(_this.cant + 'ficav').isValid()) {
                                                    var fecha = f.getValue();
                                                    var dia = fecha.getDate();
                                                    var mes = fecha.getMonth() + 1;
                                                    var anio = fecha.getFullYear();
                                                    var calculo = (parseInt(anio) +1);
                                                    dia = (dia < 10) ? '0' + dia : dia;
                                                    mes = (mes < 10) ? '0' + mes : mes;
                                                    var total = dia + '/' + mes + '/' + calculo;
                                                    if (calculo && dia && mes) {
                                                        Ext.getCmp(_this.cant + 'vencimientoficav').setValue(total);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            else if (respData.datos[i].name == "vencimientocirculacion" && _this.campos['vencimientocirculacion']) {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'vencimientocirculacion',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: !cmpMuestra.obligatorio,
                                    listeners: {
                                        'change': function(f, newV, oldV) {
                                        }
                                    }
                                });
                            }
                            else if (respData.datos[i].name == "expedicioncirculacion" && _this.campos['expedicioncirculacion']) {
                                var cmpMuestra = _this.campos[respData.datos[i].name];
                                _this[respData.datos[i].name] = new Ext.form.DateField({
                                    fieldLabel: cmpMuestra.fieldLabel,
                                    id: _this.cant + 'expedicioncirculacion',
                                    name: cmpMuestra.name,
                                    format: cmpMuestra.format,
                                    width: cmpMuestra.width,
                                    allowBlank: !cmpMuestra.obligatorio,
                                    listeners: {
                                        'change': function(f, newV, oldV) {
                                            if (Ext.getCmp(_this.cant + 'vencimientocirculacion')) {
                                                if (Ext.getCmp(_this.cant + 'expedicioncirculacion').isValid()) {
                                                    var fecha = f.getValue();
                                                    var dia = fecha.getDate();
                                                    var mes = fecha.getMonth() + 1;
                                                    var anio = fecha.getFullYear();
                                                    var calculo = (parseInt(anio) +5);
                                                    dia = (dia < 10) ? '0' + dia : dia;
                                                    mes = (mes < 10) ? '0' + mes : mes;
                                                    var total = dia + '/' + mes + '/' + calculo;
                                                    if (calculo && dia && mes) {
                                                        Ext.getCmp(_this.cant + 'vencimientocirculacion').setValue(total);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            else if (respData.datos[i].name == "nroinventario") {
                                _this[respData.datos[i].name] = _this.campos[respData.datos[i].name];
                                if (respData.datos[i].autogenerado) {
                                    _this[respData.datos[i].name].allowBlank = true;
                                    _this[respData.datos[i].name].disabled = true;
                                    _this[respData.datos[i].name].editable = false;
                                }
                            }
                            else {
                                _this[respData.datos[i].name] = _this.campos[respData.datos[i].name];

                            }
                            if (_this.campos[respData.datos[i].obligatorio]) {
                                _this[respData.datos[i].name].allowBlank = false;
                            }
                            var nombre = respData.datos[i].name;
                             if (respData.datos[i].name == "nrochasis") {
                                nombre = "nroserie";
                            }
                            if (_this.recordTree && _this.recordTree.data[nombre]) {
                                var modif = true;
                                _this[respData.datos[i].name].value = _this.recordTree.data[nombre];
                            } else {
                                _this[respData.datos[i].name].value = null;
                            }
                            if (_this.busqAvanzada) {
                                _this[respData.datos[i].name].allowBlank = true;
                            }
                            if (alternativa && _this.campos[respData.datos[i].name].contable) {
                                _this.camposMultimoneda(config, respData.datos[i].name, modif);
                            }
                            else {
                                if (_this.campos[respData.datos[i].name].xtype == "datefield")
                                {
                                    _this.dateCmps.push(_this[respData.datos[i].name])
                                } else if (_this.campos[respData.datos[i].name].xtype == "textarea")
                                {
                                    _this.texAreasCmps.push(_this[respData.datos[i].name])
                                } else {
                                    if (respData.datos[i].name == 'valoradquisicion')
                                        var text = _this.idioma.msgRangoMax;
                                    if (respData.datos[i].name == 'depreciacionacumulada')
                                        var text = _this.idioma.msgRangoMin;
                                    if (text) {
                                        Ext.apply(_this[respData.datos[i].name], {
                                            disabled: (respData.datos[i].name == 'valorcontable' && !modif) ? true : false,
                                            invalidText: text,
                                            id: respData.datos[i].name+_this.cant,
                                            validator: function (value) {
                                                return _this.validarCampos(value, respData.datos[i].name, modif)
                                            }
                                        });
                                    }
                                    _this.textfieldCmps.push(_this[respData.datos[i].name]);
                                }
                            }
                        }
                    }
                }
            }

        }

        const valAdqusicionIndex = _this.textfieldCmps.findIndex(cmp => cmp.dataIndex === "valoradquisicion");
        const valAdqusicionAltIndex = _this.textfieldCmps.findIndex(cmp => cmp.dataIndex === "valoradquisicionalternativo");
        const valContableIndex = _this.textfieldCmps.findIndex(cmp => cmp.dataIndex === "valorcontable");
        const valContableAltIndex = _this.textfieldCmps.findIndex(cmp => cmp.dataIndex === "valorcontablealternativo");
        _this.textfieldCmps[valContableIndex].value = _this.textfieldCmps[valAdqusicionIndex].value;
        _this.textfieldCmps[valContableAltIndex].value = _this.textfieldCmps[valAdqusicionAltIndex].value;

        for (var i = 0; i < _this.textfieldCmps.length; i++) {
            config.formulario.addComponent(_this.textfieldCmps[i]);
        }
        for (var i = 0; i < _this.combosCmps.length; i++) {
            config.formulario.addComponent(_this.combosCmps[i]);
        }
        for (var i = 0; i < _this.dateCmps.length; i++) {
            config.formulario.addComponent(_this.dateCmps[i]);
        }
        for (var i = 0; i < _this.chekbosesCmps.length; i++) {
            config.formulario.addComponent(_this.chekbosesCmps[i]);
        }
        for (var i = 0; i < _this.texAreasCmps.length; i++) {
            config.formulario.addComponent(_this.texAreasCmps[i]);
        }
        for (var i = 0; i < componentesAuxdelTab.length; i++) {
            config.formulario.addComponent(componentesAuxdelTab[i]);
        }
        config.formulario.doLayout();
    },
    validarCmpArea: function () {
        var _this = this;
        return (!_this.grantedAction('btnAsociarNuevoDoc') && !_this.grantedAction('btnAsociarDoc') && !_this.idarearesp && _this.principal/*respData.datos[i].name == 'idarearesp'*/);
    },
    camposMultimoneda: function(config, name, modif) {
        //debugger;
        var _this = this;
        var campocontable = _this.campos[name];
        var label = campocontable.fieldLabel;
        var valueCont = 0;
        var valueAlt = 0;
        var text = '';
        if (modif) {
            if (parseFloat(_this.recordTree.data['valorcontable']) == parseFloat(_this.recordTree.data['valoradquisicion']))
                valueCont = parseFloat(_this.recordTree.data['valoradquisicion'] - _this.recordTree.data['depreciacionacumulada']).toFixed(6);
            else
                valueCont = parseFloat(_this.recordTree.data['valorcontable'] - _this.recordTree.data['depreciacionacumulada']).toFixed(6);


            if (parseFloat(_this.recordTree.data['valorcontablealternativo']) == parseFloat(_this.recordTree.data['valoradquisicionalternativo']))
                valueAlt = parseFloat(_this.recordTree.data['valoradquisicionalternativo'] - _this.recordTree.data['depreciacionacumuladaalternativo']).toFixed(6);
            else
                valueAlt = parseFloat(_this.recordTree.data['valorcontablealternativo'] - _this.recordTree.data['depreciacionacumuladaalternativo']).toFixed(6);
            if (name == 'valorcontable' || name == 'valorcontablealternativo')
                text = _this.idioma.msgRangoMaxV;
            if (name == 'depreciacionacumulada' || name == 'depreciacionacumuladaalternativo')
                text = _this.idioma.msgRangoMinV;
        } else {
            if (name == 'valoradquisicion' || name == 'valoradquisicionalternativo')
                text = _this.idioma.msgRangoMax;
            if (name == 'depreciacionacumulada' || name == 'depreciacionacumuladaalternativo')
                text = _this.idioma.msgRangoMin;
        }
        var valuecmp = (typeof(campocontable.value) == 'object') ? 0 : campocontable.value;
        Ext.apply(campocontable, {
            disabled: (campocontable.name == 'valorcontable' && !modif) ? true : false,
            id: campocontable.name + _this.cant,
            fieldLabel: (label.indexOf(nommonedacontable) == -1) ? label + ' ' + nommonedacontable : label,
            value:  (campocontable.name == 'valorcontable') ? valueCont : parseFloat(valuecmp),
            invalidText: text,
            validator: function(value) {
                return _this.validarCampos(value, campocontable.name, modif)
            }
        });
        _this.textfieldCmps.push(campocontable);
        var campoalternativo = _this.campos[name + 'alternativo'];
        var label = campoalternativo.fieldLabel;
        var valueCmp = (typeof(campoalternativo.value) == 'undefined') ? 0 : campoalternativo.value;
        Ext.apply(campoalternativo, {
            name: name + 'alternativo',
            id: name + 'alternativo'+_this.cant,
            disabled: (campoalternativo.name == 'valorcontablealternativo' && !modif) ? true : false,
            fieldLabel: (label.indexOf(nommonedaalternativa) == -1) ? label + ' ' + nommonedaalternativa : label,
            invalidText: text,
            //value: (campoalternativo.name == 'valorcontablealternativo') ? valueAlt : parseFloat(valueCmp),
            value: valueAlt,
            validator: function(value) {
                return _this.validarCampos(value, campoalternativo.name, modif)
            }
        });
        _this.textfieldCmps.push(campoalternativo);

    },
    validarCampos: function(value, name, modif) {
        var _this = this;
        var valor = parseFloat(value);
        if (modif) {
            if (name == 'valorcontable') {
                var dep = 0;
                if (Ext.getCmp('depreciacionacumulada' + _this.cant)) {
                    dep = parseFloat(Ext.getCmp('depreciacionacumulada' + _this.cant).getValue());

                    if (valor >= dep) {
                        return true;
                    } else
                        return false;
                }else{
                    return true;
                }

            }

            if (name == 'depreciacionacumulada') {
                if (Ext.getCmp('valorcontable' + _this.cant)) {
                    var cont = parseFloat(Ext.getCmp('valorcontable' + _this.cant).getValue());
                    if (valor <= cont) {
                        return true;
                    } else
                        return false;
                } else {
                    return true;
                }
            }
            if (alternativa) {
                if (name == 'valorcontablealternativo') {
                    var dep = 0;
                    if (Ext.getCmp('depreciacionacumuladaalternativo' + _this.cant)) {
                        dep = parseFloat(Ext.getCmp('depreciacionacumuladaalternativo' + _this.cant).getValue());
                        if (valor >= dep) {
                            return true;
                        } else
                            return false;
                    }else{
                        return true;
                    }
                }

                if (name == 'depreciacionacumuladaalternativo') {
                    if (Ext.getCmp('valorcontablealternativo' + _this.cant)) {
                        var cont = parseFloat(Ext.getCmp('valorcontablealternativo' + _this.cant).getValue());
                        if (valor <= cont) {
                            return true;
                        } else
                            return false;
                    } else {
                        return true;
                    }
                }
            }
        } else {
            if (name == 'valoradquisicion') {
                var dep = 0;
                if (Ext.getCmp('depreciacionacumulada')) {
                    dep = parseFloat(Ext.getCmp('depreciacionacumulada' + _this.cant).getValue());
                    if (valor >= dep) {
                        return true;
                    } else
                        return false;
                }else{
                    return true;
                }
            }

            if (name == 'depreciacionacumulada') {
                if (Ext.getCmp('valoradquisicion' + _this.cant)) {
                    var adq = parseFloat(Ext.getCmp('valoradquisicion' + _this.cant).getValue());
                    if (valor <= adq) {
                        return true;
                    } else
                        return false;
                } else {
                    return true;
                }
            }
            if (alternativa) {
                if (name == 'valoradquisicionalternativo') {
                    var dep = 0;
                    if (Ext.getCmp('depreciacionacumuladaalternativo' + _this.cant)){
                        dep = parseFloat(Ext.getCmp('depreciacionacumuladaalternativo' + _this.cant).getValue());
                    if (valor >= dep) {
                        return true;
                    } else
                        return false;
                    }else{
                        return true;
                    }
                }

                if (name == 'depreciacionacumuladaalternativo') {
                    if (Ext.getCmp('valoradquisicionalternativo' + _this.cant)) {
                        var adq = parseFloat(Ext.getCmp('valoradquisicionalternativo' + _this.cant).getValue());
                        if (valor <= adq) {
                            return true;
                        } else
                            return false;
                    } else {
                        return true;
                    }
                }
            }
        }
    },
    getComboTipoCombustible: function() {
        var _this = this;
        var store = new Ext.data.SimpleStore({
            fields: ['id', 'value']
        });
        var combo = new Ext.form.ComboBox({
            width: 216,
            fieldLabel: 'Tipo de combustible',
            valueField: 'id',
            //  id: 'idtipocombustibleRNO' + _this.cant,
            displayField: 'value',
            triggerAction: 'all',
            autoCreate: true,
            // emptyText: _this.idioma.lbCbVacio,
            store: store,
            minChars: 0,
            forceSelection: true,
            mode: 'local',
            listeners: {
                'focus': function(cmb) {
                    var arbol = new Ext.erp.arbolTipoCombustible({//Ext.aft.arbolTipoCombustible
                        id: 'idarbTCRNO' + _this.cant + 'Div',
                        dataUrl: '/logistica/activos_fijos/configuracion/index.php/nomencladoresgeneralesaft/cargarnomenclador',
                        textRootNode: 'Tipos de combustible',
                        listeners: {
                            'click': function(nodo) {
                                if (nodo.id != 0) {
                                    Ext.getCmp('idCombotipocombustible' + _this.cant).setValue(nodo.attributes.idtipocombustible);
                                    combo.setRawValue(nodo.attributes.denominacion);
                                    win.close();
                                }
                            }
                        }
                    });
                    var win = new Ext.Window({
                        width: 280,
                        height: 300,
                        constrain: true,
                        modal: true,
                        resizable: false,
                        autoScroll: true,
                        frame: true,
                        title: 'Tipo de combustible',
                        items: [arbol],
                        listeners: {
                            'show': function() {
                                arbol.render();
                            }
                        }, buttons: [
                            {
                                xtype: 'button',
                                iconCls: 'cancelar',
                                text: 'Cerrar',
                                tooltip: 'Cerar ventana.',
                                handler: function() {
                                    win.hide();
                                }
                            }
                        ]

                    });
                    win.show();
                }
            }
        });
        return combo;
    },
    retornarValoresCmp: function() {
        var _this = this;
        var seModifico = (_this.modificar && _this.getForm().isValid() && _this.getForm().isDirty());
        var seAdiciono = (_this.getForm().isValid() && !_this.modificar);

        if(seAdiciono || seModifico){
            var valores = _this.validarValoresConEspacios();
            _this.agruparElementosXtabla();
            valores.elementosXtabla = _this.elementosXtabla;
            return valores;
        } else {
            console.info("fue paneldatosgenerales");
            return -1;
        }
    },
    validarValoresConEspacios: function() {
        var _this = this;
        var valores = _this.getForm().getValues();
        for (var propiedad  in valores) {
            if (valores[propiedad] == "") {
                valores[propiedad] = undefined;
            } else {
                if (_this.dinamico == 1) {
                    for (var i = 0; i < _this.elementosXtabla.length; i++) {
                        if (_this.elementosXtabla[i].name == propiedad) {
                            _this.elementosXtabla[i][propiedad] = valores[propiedad];
                            _this.elementosXtabla[i].value = valores[propiedad];
                        }
                    }
                }
            }
        }
        return valores;
    },
    agruparElementosXtabla: function() {
        var _this = this;
        var arrResul = new Array();
        var a = 0;
        while (a < _this.elementosXtabla.length) {
            var obj = {};
            obj.idtabla = _this.elementosXtabla[a].idtabla;
            obj.datos = new Array();
            for (var i = 0; i < _this.elementosXtabla.length; i++) {
                if (_this.elementosXtabla[a].idtabla == _this.elementosXtabla[i].idtabla) {
                    var objPropieValor = new Object();
                    objPropieValor[_this.elementosXtabla[i].name] = _this.elementosXtabla[i].value;
                    obj.datos.push(objPropieValor);
                }
            }
            a++;
            arrResul.push(obj);
        }
        _this.elementosXtabla = arrResul;
    },
    cargarValoresCmp: function() {
        var _this = this;
        if (_this.recordTree) {
            _this.getForm().loadRecord(_this.recordTree);
        }
    },
    LimpiarValoresCmp: function() {
        var _this = this;
        _this.elementosXtabla = _this.elementosXtablaConst;

        for(var i=0;i< _this.formulario.items.length;i++)
        {
            for(var j=0;j< _this.formulario.items.items[i].items.length;j++)
            {
                var originalValue = _this.formulario.items.items[i].items.items[j].originalValue;
                _this.formulario.items.items[i].items.items[j].setValue(originalValue);
            }
        }

    },
    attatchPlugin: function(plugin) {
        this.plugins.push(plugin);
    },
    grantedAction: function (idAccion) {
        var existe = false;
        var acciones = this.listaAcciones;
        for(var i = 0, len = acciones.length; i<len;i++)
        {
            if (acciones['abreviatura'] == idAccion) {
                existe = true;
            }
        }

        return existe;
    }
});

Ext.LOG.RegNumOperativo.winResponsable = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        Ext.apply(this, config);
        this.resizable = false;
        this.usarAplicar = false;
        this.closeAction = 'close';
        this.width = 800;
        this.height = 600;
        this.modal = true;
        Ext.LOG.RegNumOperativo.winResponsable.superclass.constructor.call(this, config);
    }
});
