/**
 * Jorge Luis Cuellar Mondeja Para crea el panel de Movimiento de activo, en
 * dependencia del movimiento seleccionado
 */
function getItemsDatosDocumento(idioma, modificar, datos, iddocrecepcion, idestructuracomun, area_selccionada, nodoPadre, _this, comboCentroCosto, iddatosespecificos, idinterfaz) {

	var desabilitarCMB = false;
    _this.btnEditarDocPrim = LOG.util.UIManager.createBtn({
        iconCls: 'limpiar',
        style: 'margin-top: 18px;',
        buttonAlign: 'left',
        tooltip: idioma.lbTtEditarInventario,
        handler: function () {
            _this.numero.reset();
            _this.fecha.reset();
            _this.iddocumento.reset();
            _this.denomInventario.reset();
            _this.numero.enable();
            _this.fecha.enable();
            _this.iddocumento.enable();
            _this.denomInventario.enable();
            LOG.aft.documento.camposInventarios = null;
            LOG.aft.documento.smInventario = null;
        }
    });
	
	var btnBuscarDocPrim = LOG.util.UIManager.createBtn({
        iconCls: 'buscar',
        style: 'margin-top: 18px;',
        buttonAlign: 'left',
        tooltip: idioma.lbTtBuscarInventario,
        handler: function () {
			
			this.winDatDocOrigen = new LOG.aft.documento.datDocOrigen({
                idioma: idioma,
                idestructuracomun: idestructuracomun,
                area_selccionada: idestructuracomun,
                scope: _this,
                comboCentroCosto: comboCentroCosto,
				//idcentrocosto : comboCentroCosto,
				aliasDoc: _this.denomInventario.getStore().getAt(_this.denomInventario.selectedIndex).data.alias,
				iddatosespecificos: iddatosespecificos,
				idinterfaz: idinterfaz
            });
			

            this.winDatDocOrigen.init();
            this.winDatDocOrigen.view();
        }
    });
    _this.numero = new LOG.util.Prototipos.inputEntero({
        name: 'numero',
        maxLength: 11,
        maxLengthText: _this.idioma.msgNumerosEnteros + '11 ' + 'd&iacute;gito(s).',
        fieldLabel: idioma.lbNumero,
        value: (modificar == 'modificar') ? datos.json.numero : '',
        maskRe: /^([0-9]*)+$/,
        regex: /^([0-9]*)+$/,
        regexText: _this.idioma.msgNumerosEnteros + '11 ' + 'd&iacute;gito(s).',
		disabled: true
    });
    _this.iddocumento = new Ext.form.Hidden();
    _this.idEstructuraOrigenDocSalida = new Ext.form.Hidden();
    _this.fecha = new Ext.form.DateField({
        name: 'fecha',
        fieldLabel: idioma.lbFecha,
        format: 'd/m/Y',
        anchor: '90%',
        //disabled: desabilitarCMB,
		disabled: true,
        editable: false,
        value: (modificar == 'modificar') ? datos.json.fecha : ''
    });
    _this.storedenominacion = new Ext.data.Store({
        url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getdocumentoinventario',
        autoLoad: true,
        listeners: {
            'beforeload': function (store) {
                store.baseParams.idestructura = idestructuracomun;
            },
            'load': function (st, r, options) {
                if (r.length == 0) {
                    _this.denomInventario.disable();
                }
                else {
                    if (modificar == 'modificar') {
                        _this.denomInventario.setValue(datos.data.iddocinventario);
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idclavedoc',
            root: 'datos',
            totalProperty: 'cantidad'
        }, [{
                name: 'iddoc'
            },{
                name: 'denominacion'
            }, {
                name: 'iddocumentos'
            },{
                name: 'alias'
            }
        ])
    });
    _this.denomInventario = new LOG.util.ComboBox({
        hiddenName: 'idclavedoc',
        fieldLabel: idioma.lbdenominacion,
        anchor: '95%',
        valueField: 'iddoc',
        displayField: 'denominacion',
        store: _this.storedenominacion,
        triggerAction: 'all',
        forceSelection: true,
        typeAhead: true,
        mode: 'local',
        enableKeyEvents: true,
        disabled: desabilitarCMB,
        emptyText: idioma.lbCbVacio,
        editable: false,
		resizable: true,
		otherFields : {name: 'alias'}
    });
    var camposInventarios = {
        iddocinventario: _this.denomInventario,
        fecha: _this.fecha,
        numero: _this.numero,
        iddocumentoInventario: _this.iddocumento,
        denomInventario: _this.denomInventario,
        idEstructuraOrigenDocSalida: _this.idEstructuraOrigenDocSalida
    };
    LOG.aft.documento.camposInventarios = camposInventarios;
    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 3
    });
    var columnsNumero = LOG.util.UIManager.initColumnForm({
        columnas: 3
    });

    columnsNumero.addComponent(_this.numero);
    columnsNumero.addComponent(btnBuscarDocPrim);
    columnsNumero.addComponent(_this.btnEditarDocPrim);
    columnsNumero.getColumn(0).columnWidth = 0.7;
    columnsNumero.getColumn(1).columnWidth = 0.1;
    columnsNumero.getColumn(2).columnWidth = 0.1;

    columnsInferior.addComponent(_this.denomInventario);
    columnsInferior.addComponent(columnsNumero);
    columnsInferior.addComponent(_this.fecha);

    var panel = new LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosDocumento,
        labelAlign: 'top',
        layout: 'form',
        id: 'tab22',
        frame: true,
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columnsInferior],
        getItems: function () {
            var cmps = Array();
            cmps[0] = _this.fecha;
            cmps[1] = _this.numero;
            cmps[2] = _this.denomInventario;
        }
    });
    if (modificar == 'modificar') {
        _this.denomInventario.disable();
        _this.numero.disable();
        _this.btnEditarDocPrim.disable();
        btnBuscarDocPrim.disable();
        _this.fecha.disable();
        if (datos.data.estado == 3) {
            desabilitarCMB = true;
        }
    };
    return panel;
}

function getItemsAlquiler(idioma, modificar, datos, array) {

    var _this = this;
    var desabilitarCMB = false;

    if (modificar == 'modificar') {
        if (datos.data.estado == 2 || datos.data.estado == 3) {
            desabilitarCMB = true;
        }
    }


    var tiempoInicial = new Ext.form.DateField({
        fieldLabel: 'Tiempo de inicio',
        allowBlank: false,
        name: 'fechainicio',
        //id: 'tiempo_inicioAlquiler',
        xtype: 'datefield',
        format: 'd/m/Y',
        editable: false,
        disabled: desabilitarCMB,
        value: (modificar == 'modificar') ? array[0] : '',
        listeners: {
            'change': function (obj, newValue, oldValue) {
                tiempofin.setMinValue(newValue);
            }
        }
    });

    var tiempofin = new Ext.form.DateField({
        fieldLabel: 'Tiempo final',
        allowBlank: false,
        name: 'fechafin',
        //id: 'tiempo_finalAlquiler',
        xtype: 'datefield',
        format: 'd/m/Y',
        editable: false,
        disabled: desabilitarCMB,
        value: (modificar == 'modificar') ? array[1] : '',
        listeners: {
            'change': function (obj, newValue, oldValue) {
                tiempoInicial.setMaxValue(newValue);
            }
        }
    });
    var storeProvedor = new Ext.data.Store({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',// cargarProveedores
        autoLoad: modificar,
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idcliente'
            },
            {
                name: 'idclientesproveedores'
            },
            {
                name: 'direccion'
            },
            {
                name: 'entidad'
            },
            {
                name: 'nombre'
            }, {
                name: 'telefono'
            }
        ]),
        listeners: {
            'beforeload' : function(st, objeto) {
                st.baseParams.criterio = _this.cliente.getRawValue();
            }
        }
    });
    var direccion = new LOG.util.Prototipos.inputTexto({
        width: 535,
        allowBlank: false,
        maxLength: 255,
        name: 'direccion',
        fieldLabel: 'Direcci\xf3n',
        disabled: desabilitarCMB,
        // id: 'dirEntidadAlquiler',
        value: (modificar == 'modificar') ? array[4] : ''
    });
    //  var condicionPago = getCondicionPago(desabilitarCMB);

    this.cliente = new LOG.util.ComboBox({
        fieldLabel: 'Cliente',
        // url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
        hiddenName: 'idcliente',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        store: storeProvedor,
        allowBlank: false,
        mode: 'remote',
        resizable: true,
        disabled: desabilitarCMB,
        anchor: '98%',
        autoSelect: false,
		pageSize: 30,
        listeners: {
            select: function (cmb, record, index) {
                direccion.setValue(cmb.getStore().data.items[index].data.direccion);
            }
        }

    });
    /*storeProvedor.on('beforeload', function(st, records) {
     if (modificar)
     _this.cliente.disable();
     });*/
    storeProvedor.on('load', function (st, records) {
        if (modificar == 'modificar') {
            // _this.cliente.enable();
            _this.cliente.setValue(array[2]);
        }
    });
    /* 
     condicionPago.getStore().on('load', function(st, records) {
     if (modificar == 'modificar') {
     condicionPago.setValue(array[5]);
     }
     });*/
//inputEntero
    this.nrocontrato = new LOG.util.Prototipos.inputEntero({
        width: 50,
        name: 'nrocontrato',
        allowBlank: false,
        maxLength: 9,
        fieldLabel: 'N.\xb0 contrato',
        value: (modificar == 'modificar') ? array[3] : '',
        maskRe: /^([0-9]*)+$/,
        regex: /^([0-9]*)+$/,
        disabled: desabilitarCMB,
        regexText: 'Solo admite n&uacute;meros enteros.' //idioma.lbMsgValorIncorrecto
    });
    var cPanel = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    cPanel.addComponent(this.cliente);
    cPanel.addComponent(this.nrocontrato);
    cPanel.addComponent(tiempoInicial);
    cPanel.addComponent(tiempofin);
    cPanel.addComponent(direccion);
    // cPanel.addComponent(condicionPago);
    this.panelAlquiler = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        border: false,
        bodyBorder: false,
        items: [cPanel/*, dPanel*/],
        getItems: function () {
            var cmps = Array();
            cmps[0] = _this.cliente;
            cmps[1] = _this.nrocontrato;
            cmps[2] = tiempoInicial;
            cmps[3] = tiempofin;
            cmps[4] = direccion;
            // cmps[5] = condicionPago;
            return cmps;
        }
    });
    Ext.ns('Ext.aft');
    Ext.aft.panelAlquiler = _this.panelAlquiler;

    return _this.panelAlquiler;
}

function getItemsInventario(idioma, datos, idarea, modificar) {
    var string_valores_combo_areaseleccionadas = (datos && datos.data && datos.data.areasInventario) ?
        datos.data.areasInventario : "";
    var idareas = (datos && datos.data && datos.data.idareasInventario) ?
        datos.data.idareasInventario.replace(/['"']/gi, "") : "";
    var valores_combo_areaseleccionadas = (datos && datos.data && datos.data.idareasInventario) ?
        idareas.split(',') : new Array();
    var obj_area_formulario = {};
    var self = datos.scope;
    if (datos.cmpGeneral.tipo_area_seleccionada != 'arearesp') {
        function crearWin(cmpGeneral, elments_seleccionados) {
        }

        var valorCmbArea = "";
        self.comboArea = new LOG.util.LovCombo({
            url: 'cargarareas',
            name: 'areas',
            hiddenName: 'areas',
            valueField: 'id',
            anchor: '75%',
            autoLoad: true,
            value: idareas,
            mode: 'local',
            displayField: 'text',
            fieldLabel: idioma.lbCbDeposito2,
            isCombo: true,
			resizable: true,
            listeners: {
                select: function (cmb, record, index) {
                    if (!idareas) {
                        var arrayAreas = cmb.getCheckedValue().split(',');
                        if (arrayAreas.length == 0)
                            datos.scope.comboAreaResp.enable();
                        else if (arrayAreas.length == 1) {
                            datos.scope.comboAreaResp.setValue(cmb.getValue());
                            datos.scope.comboAreaResp.disable();
                        }
                        else if (arrayAreas.length > 1) {
                            datos.scope.comboAreaResp.setValue(datos.cmpGeneral.idPadreNodoSeleccionado);
                            datos.scope.comboAreaResp.setRawValue(datos.cmpGeneral.denomPadreNodoSeleccionado);
                            datos.scope.comboAreaResp.disable();
                        }
                    }
                }
            }
        });
        self.comboArea.getStore().fireEvent = self.comboArea.getStore().fireEvent.createSequence(function (e) {
            if (e == 'load') {
                self.comboArea.enable();
                if (valorCmbArea)
                    self.comboArea.setValue(valorCmbArea);
            }
            if (e == 'beforeload') {
                self.comboArea.disable();
            }
        });
        datos.scope.comboAreaResp.fireEvent = self.comboArea.getStore().fireEvent.createSequence(function (e) {
            if (e == 'select') {
                valorCmbArea = datos.scope.comboAreaResp.getValue();
                self.comboArea.setValue(valorCmbArea);
            }
        });

        var obj_area_formulario = {
            columnWidth: .98,
            labelAlign: 'top',
            layout: 'form',
            items: [self.comboArea]
        }
    }


    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        layout: 'column',
        frame: true,
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:-1px 5px 0',
        items: [
            obj_area_formulario
        ]
    });
    return panel;
}

/**
 * Caso de que se cree un doc por Campos de enviados a reparar/traspaso
 */
function getItemsReparar(idioma, modificar, datos, nodoPadre) {

    var _this = this;
    var entidadDenominacion = idioma.lbDominioEntidades;
    var entidadIdentificador = -1
    var desabilitarCMB = false;

    if (modificar == 'modificar') {
        if (datos.data.estado == 2 || datos.data.estado == 3) {
            desabilitarCMB = true;
        }
    }

    _this.entidad = new LOG.util.ComboBox({
        disabled: desabilitarCMB,
        anchor: '98%',
        emptyText: idioma.lbCbVacio,
        fieldLabel: idioma.lbCbDepositoEntidadesDominio,
        hiddenName: 'identidaddestino',
        name: 'identidaddestino',
        editable: false,
        valueField: 'idfila',
        allowBlank: false,
        value: (modificar == 'modificar') ? datos.data.denomestructuradocenvrep : null,
        url: "/logistica/activos_fijos/documento/index.php/gestdocumento/getEntidadTrasladoExterno",
        displayField: 'denominacion',
		resizable: true,
         listeners: {
            select: function (cmb, record, index) {
                
                if(cmb.getValue()){
                    _this.comboProveedor.clearValue();
                    _this.comboProveedor.allowBlank = true;
                }
                else {
                    _this.comboProveedor.allowBlank = false;
                }
              
            }

        //  'focus': function(combo) {
        //  getWinAreasResponsabilidad(combo, idioma, true, entidadDenominacion, entidadIdentificador, nodoPadre, _this.comboProveedor);
        //  },
         }
    });
    _this.entidad.getStore().on('load', function (st, records) {
        if (modificar == 'modificar') {
            _this.entidad.setValue(datos.data.identidaddestinoenvrep);
        }
    });

    var storeProvedor = new Ext.data.Store({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idclientesproveedores'
            },
            {
                name: 'direccion'
            },
            {
                name: 'entidad'
            },
            {
                name: 'nombre'
            }, {
                name: 'telefono'
            }
        ]),
        listeners: {
            'beforeload' : function(st, objeto) {
                st.baseParams.criterio = _this.comboProveedor.getRawValue();
            }
        }
    });
    _this.comboProveedor = new LOG.util.ComboBox({
        fieldLabel: 'Proveedor',
        hiddenName: 'idclientesproveedores',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        store: storeProvedor,
        autoLoad: true,
        allowBlank: false,
        mode: 'remote',
        resizable: true,
        disabled: desabilitarCMB,
        anchor: '98%',
        autoSelect: false,
		pageSize: 30,
        listeners: {
            select: function (cmb, record, index) {
                if(cmb.getValue()){
                    _this.entidad.clearValue()
                    _this.entidad.allowBlank = true;
                }
                else {
                    _this.entidad.allowBlank = true;
                }
              
            }

        //  'focus': function(combo) {
        //  getWinAreasResponsabilidad(combo, idioma, true, entidadDenominacion, entidadIdentificador, nodoPadre, _this.comboProveedor);
        //  },
         }
        
    });

    var columns = LOG.util.UIManager.initColumnForm({
        columnas: 3
    });
    var condicionPago = getCondicionPago(desabilitarCMB);
    var chapaTransportador = LOG.util.Prototipos.inputTexto({
        name: 'chapatransportador',
        width: '97%',
        fieldLabel: "Chapa",
        disabled: desabilitarCMB
    });
    var ciTransportador = new LOG.util.Prototipos.inputTexto({
        name: 'citransportador',
        width: '97%',
        fieldLabel: "CI",
        disabled: true,
        listeners: {
            'focus': function (field) {
                cmpEditablefireEvent('focus');
            }
        }
    });

    var cmpHideEditable = new Ext.form.Hidden({
        name: "idtransportador"
    });

    var cmpEditable = new LOG.util.Prototipos.inputTexto({
        name: 'nombretransprtador',
        width: '97%',
        //allowBlank: false,
        fieldLabel: "Transportador",
        disabled: desabilitarCMB,
        listeners: {
            'focus': function (field) {
                Ext.getBody().mask(idioma.lbLoad, 'x-mask-loading');
                if (!Responsable) {
                    var panelBusPer = getPanelPersonas({
                        'personaselecionada': function () {
                            Responsable.listaBotones.getItem(2).enable();
                        },
                        'personadeselecionada': function () {
                            Responsable.listaBotones.getItem(2).disable();
                        }
                    });
                    var Responsable = new LOG.aft.documento.winResponsable({
                        title: 'Personas',
                        layout: 'fit',
                        onAceprtarFn: function () {
                            //comboProveedor.allowBlank = true;
                            if (panelBusPer.getSeleccion()) {
                                cmpHideEditable.setValue(panelBusPer.getSeleccion().get('idpersona'));

                                field.setValue(panelBusPer.getSeleccion().get('nombreyapellidos') );
                                ciTransportador.setValue(panelBusPer.getSeleccion().get('numid'));
                                Responsable.destroy();
                            }
                        }
                    });
                    Responsable.add(panelBusPer);
                    Responsable.show();
                }
                else {
                    Responsable.show();
                }
            }
        }
    });


    columns.addComponent(_this.entidad);
    columns.addComponent(_this.comboProveedor);
    columns.addComponent(condicionPago);

    columns.addComponent(ciTransportador);
    columns.addComponent(cmpEditable);
    columns.addComponent(chapaTransportador);
    columns.addComponent(cmpHideEditable);



    // columnsDircc.addComponent(this.direccion);


    if (modificar == 'modificar' && datos.data.idpersona != null) {
        Ext.Ajax.request({
            url: 'buscarDatTransportadorEvnReparar',
            method: 'POST',
            params: {
                idpersona: datos.data.idpersona
            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.datos.length > 0) {

                    //field.setValue(panelBusPer.getSeleccion().get('nombreyapellidos') );
                    //ciTransportador.setValue(panelBusPer.getSeleccion().get('numid'));
                    cmpEditable.setValue(rd.datos[0].nombreprestamo + ' ' + rd.datos[0].papelprestamo + ' ' + rd.datos[0].sapleprestamo);
                    cmpHideEditable.setValue(rd.datos[0].idpersona);
                }
            }
        });
    }

    if(modificar == 'modificar' && datos.json.chapatransportador != null){

        chapaTransportador.setValue(datos.json.chapatransportador);

    }




    var columnsDat = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    var ididentificador = (datos != null) ? datos.data.iddocumento : 1;
    columnsDat.addComponent({
        html: '',
        id: 'dir' + ididentificador
    });
    var direccion = '';

    columnsDat.addComponent({
        html: '',
        id: 'idHtmlDireccion' + ididentificador
    });
    columnsDat.addComponent({
        html: '',
        id: 'telf' + ididentificador
    });
    var telefono = '';
    columnsDat.addComponent({
        html: '',
        id: 'idHtmlTelefono' + ididentificador
    });

    _this.comboProveedor.on({
        'select': function (combo, record, index) {
            //_this.entidad.reset();
            document.getElementById('dir' + ididentificador).innerHTML = "Direcci&oacute;n:";
            document.getElementById('telf' + ididentificador).innerHTML = "Tel&eacute;fono";

            document.getElementById('idHtmlDireccion' + ididentificador).innerHTML = (combo.getStore().getAt(index).data.direccion) ? combo.getStore().getAt(index).data.direccion : "-";
            document.getElementById('idHtmlTelefono' + ididentificador).innerHTML = (combo.getStore().getAt(index).data.telefono) ? combo.getStore().getAt(index).data.telefono : "-";

        }
    });
    storeProvedor.on('beforeload', function (st) {
     
        st.baseParams.idclasificacion = 1;
    });
    storeProvedor.on('load', function (st, records) {
        if (modificar == 'modificar') {
                     if (datos.data.idclientesproveedoresenvrep != '') {
                _this.entidad.disable();
            } else if (datos.data.denomestructuradocenvrep != '') {
                _this.comboProveedor.disable();
            }
            _this.comboProveedor.setValue(datos.data.idcliente);
            _this.comboProveedor.originalValue = _this.comboProveedor.getValue();
            for (var i = 0; i < _this.comboProveedor.getStore().data.items.length; i++) {
                if (_this.comboProveedor.getStore().data.items[i].data.idclientesproveedores == datos.data.idclientesproveedoresenvrep) {
                    document.getElementById('dir' + ididentificador).innerHTML = "Direcci&oacute;n:";
                    document.getElementById('telf' + ididentificador).innerHTML = "Tel&eacute;fono";
                    document.getElementById('idHtmlDireccion' + ididentificador).innerHTML = (_this.comboProveedor.getStore().data.items[i].data.direccion) ? _this.comboProveedor.getStore().data.items[i].data.direccion : "-";
                    document.getElementById('idHtmlTelefono' + ididentificador).innerHTML = (_this.comboProveedor.getStore().data.items[i].data.telefono) ? _this.comboProveedor.getStore().data.items[i].data.telefono : "-";

                    break;
                }
            }
        }
    });

    condicionPago.getStore().on('load', function (st, records) {

        if (modificar == 'modificar') {
            condicionPago.setValue(datos.data.idcondicionpago);
        }
    });

    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        border: false,
        bodyBorder: false,
        listeners:
            {
                'activate': function () {
                    storeProvedor.load();
                    condicionPago.getStore().load();
                }
            },
        items: [columns, columnsDat/*,columnsDircc*/],
        getItems: function () {
            var cmps = Array();
            cmps[0] = (_this.entidad.getValue()) ? _this.entidad : _this.comboProveedor;
            cmps[1] = condicionPago;
            return cmps;
        }
    });
    return panel;
}

function getItemsRepararEnmantenimiento(idioma, modificar, datos, nodoPadre) {

    /* var regNumAReparar = new LOG.aft.documento.regNumAReparar({
     idioma: idioma,
     nodoPadre: nodoPadre,
     idComponent: 0,
     });*/

    var panel2 = new LOG.aft.documento.regNumAReparar({
        idioma: idioma
    });
    panel2.init();
    var aux = panel2.view();
    var arrayDat = new Array();

    var panel = LOG.util.UIManager.initPanel({
        title: "Activos a reparar",
        frame: true,
        border: false,
        bodyBorder: false,
        layout: 'border',
        items: [aux]
    });
    return panel;
}

function getItemsBajaDesarme(idioma, modificar, datos, idestructuracomun) {
    var _this = this;
    var desabilitarCMB = false;
    if (modificar == 'modificar') {
        if (datos.data.estado == 2 || datos.data.estado == 3) {
            desabilitarCMB = true;
        }
    }

    _this.storedestinofinal = new Ext.data.Store({
        url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getDestinoFinal',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            // id: "iddestinofinal",
            root: 'datos'
        }, [
            {
                name: 'iddestinofinal'
            },
            {
                name: 'denominacion'
            }
        ]),
        listeners: {
            'beforeload': function (store, objeto) {
                store.baseParams.idestructura = idestructuracomun;
            },
            'load': function (store) {
                if (modificar == 'modificar' && datos.get('iddestinofinalBajadesarme')) {
                    _this.destinofinal.setValue(datos.get('iddestinofinalBajadesarme'));
                    //_this.direccion.disabled();
                }
                if (modificar == 'modificar' && datos.get('informetecnicoBajadesarme')) {
                    _this.informetecnico.setValue(datos.get('informetecnicoBajadesarme'));
                    //_this.informetecnico.disabled();
                }
                if (modificar == 'modificar' && datos.get('entidadBajadesarme')) {
                    _this.entidad.setValue(datos.get('entidadBajadesarme'));
                    //_this.informetecnico.disabled();
                }
            }
        }
    });
    this.destinofinal = new LOG.util.ComboBox({
        hiddenName: 'iddestinofinal',
        fieldLabel: idioma.lbDDestinoFinal,
        anchor: '95%',
        valueField: 'iddestinofinal',
        displayField: 'denominacion',
        store: _this.storedestinofinal,
        allowBlank: true,
        triggerAction: 'all',
        forceSelection: true,
        typeAhead: true,
        mode: 'local',
        enableKeyEvents: true,
        disabled: desabilitarCMB,
        emptyText: idioma.lbCbVacio,
        editable: false,
		resizable: true
    });

    /* this.destinofinal = new Ext.form.TextArea({
     anchor: '95%',
     name: 'destinofinal',
     fieldLabel: idioma.lbDestinoFinal,
     maxLength: 255,
     disabled: desabilitarCMB,
     maxLengthText: idioma.lbMsgMaxLongDescripcion,
     value: (modificar) ? datos.json.destinofinal : ''
     });*/
    this.informetecnico = new Ext.form.TextArea({
        anchor: '95%',
        maxLength: 255,
        name: 'informetecnico',
        fieldLabel: idioma.lbInformeTecnico,
        disabled: desabilitarCMB,
        // maxLengthText: idioma.lbMsgMaxLongDescripcion,
        value: (modificar) ? datos.json.informetecnico : ''
    });
    this.entidad = new LOG.util.Prototipos.inputTexto({
        width: '97%',
        name: 'entidad',
        disabled: desabilitarCMB,
        allowBlank: true,
        fieldLabel: idioma.lbEntidad,
        maxLength: 255,
        disabled: desabilitarCMB,
        //maxLengthText: idioma.lbMsgMaxLongDescripcion,
        value: (modificar) ? datos.data.entidad : ''
    });
    var columns = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    columns.addComponent(this.informetecnico);
    columnsInferior.addComponent(this.entidad);
    columnsInferior.addComponent(this.destinofinal);
    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columns, columnsInferior],
        getItems: function () {
            var cmps = Array();
            cmps[0] = _this.entidad;
            cmps[1] = _this.informetecnico;
            cmps[2] = _this.destinofinal;
            return cmps;
        }
    });
    return panel;
}

function getItemsBajaPorVenta(idioma, datos, modificar, idestructuracomun, array, codigooperacion) {
    var _this = this;
    var desabilitarCMB = false;
    if (modificar == 'modificar') {
        if (datos.get('estado') == 2 || datos.get('estado') == 3) {
            desabilitarCMB = true;
        }
    }
    _this.storedestinofinal = new Ext.data.Store({
        url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getDestinoFinal',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            // id: "iddestinofinal",
            root: 'datos'
        }, [
            {
                name: 'iddestinofinal'
            },
            {
                name: 'denominacion'
            }
        ]),
        listeners: {
            'beforeload': function (store, objeto) {
                store.baseParams.idestructura = idestructuracomun;
            },
            'load': function (store) {
                if (modificar == 'modificar' && datos.get('iddestinofinal')) {
                    _this.destinofinal.setValue(datos.get('iddestinofinal'));
                    //_this.destinofinal.disabled();
                }
                if (modificar == 'modificar' && datos.get('informetecnico')) {
                    _this.informetecnico.setValue(datos.get('informetecnico'));
                    //_this.informetecnico.disabled();
                }
            }
        }
    });
    this.destinofinal = new LOG.util.ComboBox({
        hiddenName: 'iddestinofinal',
        fieldLabel: idioma.lbDDestinoFinal,
        anchor: '95%',
        valueField: 'iddestinofinal',
        displayField: 'denominacion',
        store: _this.storedestinofinal,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: true,
        typeAhead: true,
        mode: 'local',
        enableKeyEvents: true,
        disabled: desabilitarCMB,
        emptyText: idioma.lbCbVacio,
        editable: false,
		resizable: true
    });
    
    this.informetecnico = new Ext.form.TextArea({
        anchor: '95%',
        name: 'informetecnico',
        fieldLabel: idioma.lbInformeTecnico,
        disabled: desabilitarCMB,
        maxLength: 255,
        value: (modificar == 'modificar') ? datos.get('informetecnicoBajaVenta') : ''
    });

    var storeProvedor = new Ext.data.Store({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
        autoLoad: modificar,
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idclientesproveedoresbajaventa'
            },
            {
                name: 'idclientesproveedores'
            },
            {
                name: 'direccion'
            },
            {
                name: 'entidad'
            },
            {
                name: 'nombre'
            }, {
                name: 'telefono'
            }
        ]),
        listeners: {
            'beforeload' : function(st, objeto) {
                st.baseParams.criterio = _this.cliente.getRawValue();
            }
        }
    });

    this.cliente = new LOG.util.ComboBox({
        fieldLabel: 'Cliente',
        // url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
        hiddenName: 'idcliente',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        store: storeProvedor,
        allowBlank: (codigooperacion == "OPER_BAJA_VENTA") ? false : true,
        mode: 'remote',
        resizable: true,
        disabled: desabilitarCMB,
        anchor: '98%',
        autoSelect: false,
		pageSize: 30
    });

    storeProvedor.on('load', function (st, records) {
        if (modificar == 'modificar') {
            //_this.cliente.enable();
            _this.cliente.setValue(array[0]);
        }
    });
    
    var columns = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });

    var columnsdos = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    columnsdos.addComponent(this.destinofinal);
    columnsdos.addComponent(//this.
            cliente);


    columns.addComponent(this.informetecnico);
    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columns, columnsdos],
        getItems: function () {
            var cmps = Array();
            cmps[0] = _this.destinofinal;
            cmps[1] = _this.informetecnico;
            cmps[2] = _this.cliente;
            return cmps;
        }
    });
    return panel;
}

/**
 * Caso de que se cree un doc por Campos de Externo
 */
function getItemsTrasladoExterno(idioma, data, modificar, nodoPadre, obligatorio, masivo = false) {


    var entidadDenominacion = idioma.lbDominioEntidades;
    var entidadIdentificador = -1;
    var desabilitarCMB = false;
    var _this = this;
    if (modificar == 'modificar') {
        if (data.data.estado == 2 || data.data.estado == 3) {
            desabilitarCMB = true;
        }
    }
    this.comboAreas = new LOG.util.ComboBox({
        allowBlank: false,
        autoLoad: (modificar == 'modificar') ? true : false,
        disabled: desabilitarCMB,
        anchor: '98%',
        queryParam: 'criterio',
        emptyText: idioma.lbCbVacio,
        fieldLabel: idioma.lbCbDepositoEntidadesDominio,
        hiddenName: 'identidaddestino',
        name: 'identidaddestino',
        editable: true,
        valueField: 'idfila',
        displayField: 'denominacion',
        value: (modificar == 'modificar') ? data.data.denomestructuradocgenerado : null,
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
            'select': function (combo) {
                if (masivo) {
                    _this.comboAreasResponsabilidad.getStore().removeAll();
                    _this.comboAreasResponsabilidad.getStore().load();
                }
            },
        }
    });

    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: masivo ? 2 : 1
    });

    columnsInferior.addComponent(this.comboAreas);
    if (masivo) {

        this.comboAreasResponsabilidad = new LOG.util.ComboBox({
            allowBlank: false,
            autoLoad: (modificar == 'modificar') ? true : false,
            disabled: desabilitarCMB,
            anchor: '98%',
            queryParam: 'criterio',
            emptyText: idioma.lbCbVacio,
            fieldLabel: idioma.lbCbDepositoBuscar,
            hiddenName: 'idareadestino',
            name: 'idareadestino',
            editable: true,
            valueField: 'idarea',
            displayField: 'text',
            value: (modificar == 'modificar') ? data.json.denomarearespdestino : null,
            url: "/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas",
            // Para moncar
            //url: "/logistica/utiles/plugin/index.php/sistemasexternos/cargarEntidadesGrupo",
            //
            mode: 'remote',
            enableKeyEvents: true,
            minChars: 1,
            pageSize: 15,
            resizable: true,
            listeners: {
                'select': function (combo) {

                },
            }
        });
        this.comboAreasResponsabilidad.getStore().on({
            'beforeload': function(st, records, options) {
                let identidaddestino = isNaN(_this.comboAreas.getValue()) ? data.json.identidaddestino : _this.comboAreas.getValue();
                st.baseParams.idestructuradestino = identidaddestino;
                st.initBaseParams.idestructuradestino = identidaddestino;
            }
        });
        columnsInferior.addComponent(_this.comboAreasResponsabilidad);
    }

    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columnsInferior],
        getItems: function () {
            var cmps = Array();
            cmps.push(_this.comboAreas);
            if (masivo)
                cmps.push(_this.comboAreasResponsabilidad);
            return cmps;
        }
    });
    return panel;
}

function getItemsRecepcionTrasladoExterno(idioma, data, modificar, nodoPadre, obligatorio) {

    var desabilitarCMB = false;
    if (modificar == 'modificar') {
        if (data.data.estado == 2 || data.data.estado == 3) {
            desabilitarCMB = true;
        }
    }

    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });

    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columnsInferior],
        getItems: function () {
            var cmps = Array();
            cmps.push(_this.comboAreas);
            return cmps;
        }
    });
    return panel;

}

function getCondicionPago(desabilitarCMB, requerid = false, autoLoad = true) {
    let actionCP = (autoLoad) ? 'getCondicionPago' : 'getCondicionPagoByProv';

    var condicionPago = new LOG.util.ComboBox({
        fieldLabel: 'Condición de pago',
        hiddenName: 'idcondicionpago',
        valueField: 'idterminodepago',
        displayField: 'nombre',
        url: '/logistica/activos_fijos/documento/index.php/gestdocumento/'+actionCP, //getCondicionPago
        allowBlank: !requerid,
        mode: 'local',
        resizable: true,
        autoLoad: autoLoad,
        disabled: desabilitarCMB,
        anchor: '98%'
    });
    return condicionPago;
}

/**
 * Caso de que se cree un doc de tipo compra, hay que poner el proveedor
 */
function getItemsCompra(idioma, modificar, data, service) {

    var desabilitarCMB = false;
    var identificador = (data != null) ? data.data.iddocumento : 1;
    if (modificar == 'modificar') {
        if (data.data.estado == 2 || data.data.estado == 3) {
            desabilitarCMB = true;
        }
    }

    var storeProvedor = new Ext.data.Store({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idclientesproveedores'
            },
            {
                name: 'direccion'
            },
            {
                name: 'entidad'
            },
            {
                name: 'nombre'
            }, {
                name: 'telefono'
            }
        ]),
        listeners: {
            'beforeload' : function(st, objeto) {
                st.baseParams.criterio = comboProveedor.getRawValue();
            }
        }
    });

    var comboProveedor = new LOG.util.ComboBox({
        fieldLabel: 'Proveedor',
        hiddenName: 'idclientesproveedores',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        store: storeProvedor,
        autoLoad: true,
        allowBlank: false,
        mode: 'remote',
        resizable: true,
        disabled: desabilitarCMB,
        anchor: '98%',
        autoSelect: false
    });

    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 3//(service) ? 3 : 2
    });
    var condicionPago = getCondicionPago(desabilitarCMB, true, false);
    columnsInferior.addComponent(comboProveedor);
    columnsInferior.addComponent(condicionPago);
    // if (service) {
    var nrofactura = new LOG.util.Prototipos.inputTexto({
        width: 535,
        allowBlank: false,
        maxLength: 30,
        name: 'nrofactura',
        fieldLabel: 'Nro factura',
        disabled: desabilitarCMB,
        value: (modificar == 'modificar') ? data.data.nrofactura : ''
    });
    columnsInferior.addComponent(nrofactura);
    // }


    var columnsDat = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    var dir = "";
    var telf = "";
    var direccion = '';
    var telefono = '';
    columnsDat.addComponent({
        html: 'Direcci&oacute;n:',
        id: 'dir' + identificador
    });
    columnsDat.addComponent({
        html: '',
        id: 'idHtmlDireccioncompra' + identificador
    });
    columnsDat.addComponent({
        html: 'Telefono:',
        id: 'telf' + identificador
    });
    columnsDat.addComponent({
        html: '',
        id: 'idHtmlTelefono' + identificador
    });

    comboProveedor.on({
        'select': function (combo, record, index) {
            condicionPago.reset();
            condicionPago.getStore().load();
            document.getElementById('dir' + identificador).innerHTML = "Direcci&oacute;n:";
            document.getElementById('telf' + identificador).innerHTML = "Tel&eacute;fono";
            document.getElementById('idHtmlDireccioncompra' + identificador).innerHTML = (comboProveedor.getStore().getAt(index).data.direccion) ? comboProveedor.getStore().getAt(index).data.direccion : "-";
            document.getElementById('idHtmlTelefono' + identificador).innerHTML = (comboProveedor.getStore().getAt(index).data.telefono) ? comboProveedor.getStore().getAt(index).data.telefono : "-";
        }
    });

    storeProvedor.on('beforeload', function (st) {
        st.baseParams.idclasificacion = 1;
    });

    condicionPago.getStore().on('beforeload', function (st) {
        st.baseParams.idclienteproveedor = (comboProveedor.getValue()) ? comboProveedor.getValue() : ((data.data.idcliente) ? data.data.idcliente : -1);
        st.initBaseParams.idclienteproveedor = (comboProveedor.getValue()) ? comboProveedor.getValue() : ((data.data.idcliente) ? data.data.idcliente : -1);
    });

    storeProvedor.on('load', function (st, records) {
        if (modificar == 'modificar') {
            comboProveedor.setValue(data.data.idcliente);
            for (var i = 0; i < comboProveedor.getStore().data.items.length; i++) {
                if (comboProveedor.getStore().data.items[i].data.idclientesproveedores == data.data.idcliente) {
                    document.getElementById('dir' + identificador).innerHTML = "Direcci&oacute;n:";
                    document.getElementById('telf' + identificador).innerHTML = "Tel&eacute;fono";
                    document.getElementById('idHtmlDireccioncompra' + identificador).innerHTML = (comboProveedor.getStore().data.items[i].data.direccion) ? comboProveedor.getStore().data.items[i].data.direccion : "-";
                    document.getElementById('idHtmlTelefono' + identificador).innerHTML = (comboProveedor.getStore().data.items[i].data.telefono) ? comboProveedor.getStore().data.items[i].data.telefono : "-";
                    break;
                }
            }
        }
    });
    condicionPago.getStore().on('load', function (st, records) {
        if (modificar == 'modificar') {
            condicionPago.setValue(data.data.idcondicionpago);
        }
    });

    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        listeners:
            {
                'activate': function () {
                    storeProvedor.load();
                    condicionPago.getStore().load();
                }
            },
        items: [columnsInferior, columnsDat],
        getItems: function () {
            var cmps = Array();
            cmps[0] = comboProveedor;
            cmps[1] = condicionPago;
            cmps[2] = nrofactura;
            // (service) ? cmps[2] = nrofactura : "";
            return cmps;
        }
    });
    return panel;
}


/**
 * Caso de que se cree un doc por Campos de traslado interno/activos a ociosos/ociosos a activos
 */
function getItemsTrasladoInterno(idioma, data, modificar, nodoPadre, idcentrocostoDatosGenerales, _this) {

    var entidadIdentificador = _this.idNodoSeleccionado;
    var desabilitarCMB = false;

    if (modificar == 'modificar') {

        if (data.data.estado == 2 || data.data.estado == 3) {
            desabilitarCMB = true;
        }
    }

    if (integradoCont) {
		var cmpHideEditable = new Ext.form.Hidden({
			name: "idcentrocostoDestino"
		});
        var storeCentroCosto = new Ext.data.Store({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getcentrocosto',
            listeners: {
                'beforeload': function (st, objeto) {

                    if (modificar == 'modificar') {
                        comboCentroCosto.setValue(null);
                    }
                    comboCentroCosto.reset();
                    comboCentroCosto.disable();
                    st.baseParams.idarea = (modificar == 'modificar') ? data.data.idestructuradocgenerado : comboAreas.getValue();
                    st.baseParams.idcuenta = _this.comboOperaciones.getValue();
                    st.baseParams.idestructurapadre = nodoPadre.attributes.id;
                },
                'load': function (st, r, options) {
                    if (r.length == 0 && comboAreas.getValue() != 1) {
						mostrarMensaje(3, idioma.lbSinCentrosCosto);
					} else {
						if (modificar == 'modificar') {
							comboCentroCosto.setValue(data.data.idcentrocostodocgenerado);
							if (desabilitarCMB != true) {
								comboCentroCosto.enable();
							}
						} else {
							comboCentroCosto.enable();
						}
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "datos",
               // totalProperty: "cantidad",
                /*fields: [
                    {name: 'id'},
                    {name: 'idcentro'},
                    {name: 'descripcion'}
                ]*/
                id: 'id'
            }, [
                {
                    name: 'id'
                },
                {
                    name: 'descripcion'
                }
            ])
            //})
        });
        var comboCentroCosto = new LOG.util.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',

            hiddenName: 'idccostoDestino',

            fieldLabel: idioma.lbcbCentroCosto,
            valueField: 'id',
            allowBlank: false,
            disabled: desabilitarCMB,
            //disabled: true,
            displayField: 'descripcion',
            store: storeCentroCosto,
            autoCreate: true,
            typeAhead: true,
            value: (modificar == 'modificar') ? data.data.idcentrocostodocgenerado : null,
            triggerAction: 'all',
            editable: false,
            mode: 'local',
            emptyText: idioma.lbCbVacio,
            anchor: '98%',
			resizable: true,
            listeners: {
                'beforeselect': function (combo, record, index) {
                    if (entidadIdentificador == comboAreas.getValue()) {

                        if (idcentrocostoDatosGenerales) {
                            if (record.id == idcentrocostoDatosGenerales) {
                                mostrarMensaje(1, idioma.MsgNomismoCentroCosto);
                                return false;
                            }
                        }
                    }
                },
				'select': function (combo, record, index) {
					if (combo.getValue()) {
						cmpHideEditable.setValue(combo.getValue());
					}
				}
            }
        });
    }


    var comboAreas = new LOG.aft.documento.ComboDepositos({
        allowBlank: false,
        autoCreate: true,
        typeAhead: true,
        triggerAction: 'all',
        resizable: true,
        value: (modificar == 'modificar') ? data.data.denomestructuradocgenerado : null,
        idioma: idioma,
        hiddenName: 'idAreaDestino',
        name: 'idAreaDestino',
        disabled: desabilitarCMB,
        anchor: '95%',
        emptyText: idioma.lbCbVacio,
		resizable: true,
        listeners: {
            'select': function (combo, record, index) {
                if (combo.getValue()) {
                    if (storeCentroCosto) {
                        storeCentroCosto.load({
							params: {
								idarea: combo.getValue()
							}
						});
                    }
                }
            }
        }
    });
    comboAreas.getStore().on('load', function (st, records) {
        if (data.data.idestructuradocgenerado != null) {
            comboAreas.setRawValue(data.data.denomestructuradocgenerado);
            comboAreas.setValue(data.data.idestructuradocgenerado);
        }
        comboCentroCosto.getStore().load();
        if (storeCentroCosto) {
            storeCentroCosto.load();
        }
    });

    /*comboAreas.getStore().on('afterload', function(st, records) {
        if (storeCentroCosto) {
            storeCentroCosto.load();
        }
    });*/


    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    columnsInferior.addComponent(comboAreas);
    columnsInferior.addComponent((comboCentroCosto) ? comboCentroCosto : {});
	columnsInferior.addComponent((cmpHideEditable) ? cmpHideEditable : {});
    columnsInferior.addComponent({
        xtype: 'hidden',
        name: 'identidadpadre',
        value: nodoPadre.attributes.id
    });
    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columnsInferior],
        getItems: function () {
            var cmps = Array();
            cmps[0] = comboAreas;
            return cmps;
        }
    });
    return panel;

}


function getItemsModMasivaResponabilidad(idioma, data, modificar, nodoPadre, idcentrocostoDatosGenerales, _this) {
    var entidadIdentificador = _this.idNodoSeleccionado;
    var desabilitarCMB = false;

    if (modificar == 'modificar') {

        if (data.data.estado == 2 || data.data.estado == 3) {
            desabilitarCMB = true;
        }
    }

    if (integradoCont) {
		var cmpHideEditable = new Ext.form.Hidden({
			name: "idcentrocostodestino"
		});
        var storeCentroCosto = new Ext.data.Store({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getcentrocosto',
            listeners: {
                'beforeload': function (st, objeto) {

                    if (modificar == 'modificar') {
                        comboCentroCosto.setValue(null);
                    }
                    comboCentroCosto.reset();
                    comboCentroCosto.disable();
                    st.baseParams.idarea = (modificar == 'modificar') ? data.data.idareadestino : comboAreas.getValue();
                    st.baseParams.idcuenta = _this.comboOperaciones.getValue();
                    st.baseParams.idestructurapadre = nodoPadre.attributes.id;
                },
                'load': function (st, r, options) {
                    if (r.length == 0 && comboAreas.getValue() != 1) {
                        mostrarMensaje(3, idioma.lbSinCentrosCosto);
                    } else {
                        if (modificar == 'modificar') {
                            comboCentroCosto.setValue(data.data.idcentrocostodestino);
                            if (desabilitarCMB != true) {
                                comboCentroCosto.enable();
                            }
                        } else {
                            comboCentroCosto.enable();
                        }
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "datos",
                id: 'id'
            }, [
                {
                    name: 'id'
                },
                {
                    name: 'descripcion'
                }
            ])
            //})
        });
        var comboCentroCosto = new LOG.util.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',

            hiddenName: 'idccostoDestino',

            fieldLabel: idioma.lbcbCentroCosto,
            valueField: 'id',
            allowBlank: false,
            disabled: desabilitarCMB,
            //disabled: true,
            displayField: 'descripcion',
            store: storeCentroCosto,
            autoCreate: true,
            typeAhead: true,
            //value: (modificar == 'modificar') ? data.data.idcentrocostodestino : null,
            triggerAction: 'all',
            editable: false,
			resizable: true,
            mode: 'local',
            emptyText: idioma.lbCbVacio,
            anchor: '98%',
            listeners: {
                'beforeselect': function (combo, record, index) {
                    if (entidadIdentificador == comboAreas.getValue()) {

                        if (idcentrocostoDatosGenerales) {
                            if (record.id == idcentrocostoDatosGenerales) {
                                mostrarMensaje(1, idioma.MsgNomismoCentroCosto);
                                return false;
                            }
                        }
                    }
                },
				'select': function (combo, record, index) {
					if (combo.getValue()) {
						cmpHideEditable.setValue(combo.getValue());
					}
				}
            }
        });
    }


    var comboAreas = new LOG.aft.documento.ComboDepositos({
        allowBlank: false,
        autoCreate: true,
        typeAhead: true,
        triggerAction: 'all',
        resizable: true,
        //value: (modificar == 'modificar') ? data.data.idareadestino : null,
        idioma: idioma,
        hiddenName: 'idareadestino',
        name: 'idareadestino',
        disabled: desabilitarCMB,
        anchor: '95%',
        emptyText: idioma.lbCbVacio,
        listeners: {
            'select': function (combo, record, index) {
                if (combo.getValue()) {
                    if (storeCentroCosto) {
                        storeCentroCosto.load({
                            params: {
                                idarea: combo.getValue()
                            }
                        });
                    }
                }
            }
        }
    });
    comboAreas.getStore().on('load', function (st, records) {
        if (data.data.idareadestino != null) {
            comboAreas.setValue(data.data.idareadestino);
        }
        //comboCentroCosto.getStore().load();
        if (storeCentroCosto) {
            storeCentroCosto.load();
        }
    });

    var hiddenNewResponsable = new Ext.form.Hidden({
        name: 'idresponsabledestino',
        value: (modificar == 'modificar') ? data.data.idresponsabledestino : null,
    });

    var panelBusPer = getPanelPersonas({
        'personaselecionada': function () {
            winBuscarPersona.listaBotones.getItem(2).enable();
        },
        'personadeselecionada': function () {
            winBuscarPersona.listaBotones.getItem(2).disable();
        }
    });
    
    var winBuscarPersona = new LOG.aft.documento.winResponsable({
        title: 'Personas',
        layout: 'fit',
        initComponent: function (config) {
            LOG.aft.documento.winResponsable.superclass.initComponent.call(this);
            LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
                handler: function () {
                    winBuscarPersona.destroy();
                }
            });
            LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
                disabled: true,
                handler: function () {
                    if (panelBusPer.getSeleccion()) {
                        campoResponsable.setValue(panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel'));
                        hiddenNewResponsable.setValue(panelBusPer.getSeleccion().get('idpersona'));
                    } else {
                        campoResponsable.setValue('');
                        hiddenNewResponsable.setValue(null);
                    }
                    winBuscarPersona.close();
                }
            });
        }
    });
    winBuscarPersona.add(panelBusPer);
    

    var campoResponsable = new Ext.form.TextField({
        allowBlank: true,
        readOnly: true,
        editable: false,
        fieldLabel: 'Nuevo responsable',
        emptyText: 'Seleccione...',
        name: 'camporesponsable',
        value: (modificar == 'modificar') ? data.data.nombreresponsabledestino : null,
        listeners: {
            'focus': function (field) {
                if(!desabilitarCMB) {
                    
                    winBuscarPersona.show();
                    
                }
            }
        }
    });


    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    columnsInferior.addComponent(comboAreas);
    columnsInferior.addComponent(campoResponsable);
    columnsInferior.addComponent(hiddenNewResponsable);
    columnsInferior.addComponent((comboCentroCosto) ? comboCentroCosto : {});
	columnsInferior.addComponent((cmpHideEditable) ? cmpHideEditable : {});
	columnsInferior.addComponent({
        xtype: 'hidden',
        name: 'identidadpadre',
        value: nodoPadre.attributes.id
    });
    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columnsInferior],
        getItems: function () {
            var cmps = Array();
            cmps[0] = comboAreas;
            return cmps;
        }
    });
    return panel;

}



function getWinAreasResponsabilidad(combo, idioma, entidadexterna, denomentidad, identidad, storeCentroCostoONodePadre, comboexterno) {
    Ext.getBody().mask(idioma.lbMsgCargandoDatos, 'x-mask-loading');
    if (!cmpAreaRespWin) {
        var cmpAreaRespWin = new Log.AF.Utiles.WinContainer({
            modal: true,
            constrain: true,
            entidadesdelDominio: entidadexterna,
            doAction: function (nodo) {
                function funcion() {
                    combo.setValue(nodo.attributes.id);
                    combo.setRawValue(removeTags(nodo.attributes.text));
                    cmpAreaRespWin.hide();

                    if (!entidadexterna) {
                        if (storeCentroCostoONodePadre) {
                            storeCentroCostoONodePadre.load();
                        }
                    }
                }

                if (!entidadexterna) {
                    if (nodo.getDepth() == 0) {
                        //  Es padre
                        if (comboexterno) {
                            comboexterno.reset();
                        }
                        funcion();
                    } else if (nodo.attributes.interna) {
                        //  Es un area de responzabilidad
                        if (comboexterno) {
                            comboexterno.reset();
                        }
                        funcion();
                    } else {
                        mostrarMensaje(1, idioma.lbNoEsAreaResp);
                    }
                } else {
                    if (nodo.attributes.id != -1 && nodo.attributes.id != storeCentroCostoONodePadre.attributes.id) {
                        //if (nodo.attributes.id == nodo.attributes._parent) {
                        funcion();
                        //}
                    }
                }
            },
            entidad: denomentidad,
            identidad: identidad,
            listeners: {
                'beforeshow': function () {
                    Ext.getBody().unmask();
                }
            }
        });
    } else {
        cmpAreaRespWin.show();
    }

    function removeTags(string) {
        return string.replace(/(?:<(?:script|style)[^>]*>[\s\S]*?<\/(?:script|style)>|<[!\/]?[a-z]\w*(?:\s*[a-z][\w\-]*=?[^>]*)*>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>)[\r\n]*/gi, '');
    }
}

function getItemsAlta(idioma, modificar, data) {

    var desabilitarCMB = false;
    if (modificar == 'modificar') {
        if (data.data.estado == 2 || data.data.estado == 3) {
            desabilitarCMB = true;
        }
    }


    var storeProvedor = new Ext.data.Store({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idcliente'
            },
            {
                name: 'idclientesproveedores'
            },
            {
                name: 'direccion'
            },
            {
                name: 'entidad'
            },
            {
                name: 'nombre'
            }, {
                name: 'telefono'
            }
        ]),
        listeners: {
            'beforeload' : function(st, objeto) {
                st.baseParams.criterio = comboProveedor.getRawValue();
            }
        }
    });


    var comboProveedor = new LOG.util.ComboBox({
        fieldLabel: 'Proveedor',
        hiddenName: 'idclientesproveedores',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        store: storeProvedor,
        allowBlank: false,
        mode: 'remote',
        resizable: true,
        disabled: desabilitarCMB,
        anchor: '98%',
        autoSelect: false,
		pageSize: 30
    });


    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    columnsInferior.addComponent(comboProveedor);

    var columnsDat = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    var dir = "";
    var telf = "";

    columnsDat.addComponent({
        html: dir,
        id: 'dir'
    });
    var direccion = '';
    columnsDat.addComponent({
        html: '',
        id: 'idHtmlDireccion'
    });
    columnsDat.addComponent({
        html: telf,
        id: 'telf'
    });
    var telefono = '';
    columnsDat.addComponent({
        html: '',
        id: 'idHtmlTelefono'
    });
    //}

    comboProveedor.on({
        'select': function (combo, record, index) {
            // document.getElementById('nombre_entidad').innerHTML = (comboProveedor.getStore().getAt(index).data.entidad) ? "Entidad" : "Nombre";
            if (modificar != 'modificar') {
                document.getElementById('dir').innerHTML = "Direcci&oacute;n:";
                document.getElementById('telf').innerHTML = "Tel&eacute;fono";
            }

            Ext.ns('LOG.aft.documento');

            // LOG.aft.documento.nombre = comboProveedor.getStore().getAt(index).data.nombre;
            LOG.aft.documento.direccion = comboProveedor.getStore().getAt(index).data.direccion;
            LOG.aft.documento.telefono = comboProveedor.getStore().getAt(index).data.telefono;

            //document.getElementById('idHtmlNombre').innerHTML = (LOG.aft.documento.nombre) ? LOG.aft.documento.nombre : "-";
            document.getElementById('idHtmlDireccion').innerHTML = (LOG.aft.documento.direccion) ? LOG.aft.documento.direccion : "-";
            document.getElementById('idHtmlTelefono').innerHTML = (LOG.aft.documento.telefono) ? LOG.aft.documento.telefono : "-";

        }
    });
    storeProvedor.on('beforeload', function (st) {
        st.baseParams.idclasificacion = 1;
    });
    storeProvedor.on('load', function (st, records) {
        if (modificar == 'modificar') {
            comboProveedor.setValue(data.data.idclientesproveedores);

            for (var i = 0; i < comboProveedor.getStore().data.items.length; i++) {
                if (comboProveedor.getStore().data.items[i].data.idclientesproveedores == data.data.idclientesproveedores) {
                    Ext.ns('LOG.aft.documento');

                    LOG.aft.documento.direccion = comboProveedor.getStore().data.items[i].data.direccion;
                    LOG.aft.documento.telefono = comboProveedor.getStore().data.items[i].data.telefono;

                    columnsDat.addComponent({
                        html: "Direcci&oacute;n:"
                    });

                    columnsDat.addComponent({
                        html: (LOG.aft.documento.direccion) ? LOG.aft.documento.direccion : "-",
                        id: 'idHtmlDireccion'
                    });
                    columnsDat.addComponent({
                        html: "Tel&eacute;fono"
                    });

                    columnsDat.addComponent({
                        html: (LOG.aft.documento.telefono) ? LOG.aft.documento.telefono : "-",
                        id: 'idHtmlTelefono'
                    });

                    break;
                }
            }
        }
    });


    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columnsInferior, columnsDat],
        getItems: function () {
            var cmps = Array();
            cmps[0] = comboProveedor;
            return cmps;
        }
    });


    return panel;
}

function getItemsPrestamo(idioma, modificar, data, idarea_seleccionada) {

    var desabilitarCMB = false;
    var identificador = (data != null) ? data.data.iddocumento : 1;
    if (modificar == 'modificar') {
        if (data.data.estado == 2 || data.data.estado == 3) {
            desabilitarCMB = true;
        }

    }
    var storeProvedor = new Ext.data.Store({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {
                name: 'idcliente'
            },
            {
                name: 'idclientesproveedores'
            },
            {
                name: 'direccion'
            },
            {
                name: 'entidad'
            },
            {
                name: 'nombre'
            }, {
                name: 'telefono'
            }
        ]),
        listeners: {
            'beforeload' : function(st, objeto) {
                st.baseParams.criterio = comboProveedor.getRawValue();
            }
        }
    });

    var comboProveedor = new LOG.util.ComboBox({
        fieldLabel: 'Cliente',
        hiddenName: 'idclientesproveedores',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        store: storeProvedor,
        allowBlank: false,
        mode: 'local',
        resizable: true,
        disabled: desabilitarCMB,
        anchor: '98%',
        autoSelect: false,
		pageSize: 30
    });
    var condicionPago = getCondicionPago(desabilitarCMB);
    var cmpHideEditable = new Ext.form.Hidden({
        name: "idpersona"
    });
    var cmpEditable = new LOG.util.Prototipos.inputTexto({
        width: '97%',
        allowBlank: false,
        fieldLabel: "Responsable",
        disabled: desabilitarCMB,
        listeners: {
            'focus': function (field) {
                Ext.getBody().mask(idioma.lbLoad, 'x-mask-loading');
                if (!Responsable) {

                    var panelBusPer = getPanelPersonas({
                        'personaselecionada': function () {
                            Responsable.listaBotones.getItem(2).enable();
                        },
                        'personadeselecionada': function () {
                            Responsable.listaBotones.getItem(2).disable();
                        }
                    }); 

                    var Responsable = new LOG.aft.documento.winResponsable({
                        title: 'Personas',
                        layout: 'fit',
                        onAceprtarFn: function () {
                            comboProveedor.allowBlank = true;
                            if (panelBusPer.getSeleccion()) {

                                cmpHideEditable.setValue(panelBusPer.getSeleccion().get('idpersona'));
                                field.setValue((panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel')));

                                comboProveedor.reset();

                                // document.getElementById('nombre_entidad').innerHTML = "Nombre";
                                if (modificar != 'modificar') {
                                    document.getElementById('dir' + identificador).innerHTML = "Direcci&oacute;n:";
                                    document.getElementById('telf' + identificador).innerHTML = "Tel&eacute;fono";
                                }

                                Ext.ns('LOG.aft.documento');
                                //LOG.aft.documento.nombre = panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel');
                                LOG.aft.documento.direccion = panelBusPer.getSeleccion().get('direccion');
                                LOG.aft.documento.telefono = panelBusPer.getSeleccion().get('telefono');

                                //document.getElementById('idHtmlNombre').innerHTML = (LOG.aft.documento.nombre) ? LOG.aft.documento.nombre : "-";
                                document.getElementById('idHtmlDireccionPrestamo' + identificador).innerHTML = (LOG.aft.documento.direccion) ? LOG.aft.documento.direccion : "-";
                                document.getElementById('idHtmlTelefonoPrestamo' + identificador).innerHTML = (LOG.aft.documento.telefono) ? LOG.aft.documento.telefono : "-";
                                Responsable.destroy();
                            }
                        }

                    });
                    Responsable.add(panelBusPer);
                    Responsable.show();
                }
                else {
                    Responsable.show();
                }
            }
        }
    });
    /* if (modificar == 'modificar' && data.data.idpersona!= null) {
     cmpHideEditable.setValue(data.data.idpersona);
     cmpEditable.setValue(data.data.nompersona);      
     }*/

    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 3
    });
    columnsInferior.addComponent(comboProveedor);
    columnsInferior.addComponent(cmpEditable);

    var columnsDat = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    var dir = "";
    var telf = "";

    columnsDat.addComponent({
        html: dir,
        id: 'dir' + identificador
    });
    columnsDat.addComponent({
        html: '',
        id: 'idHtmlDireccionPrestamo' + identificador
    });
    columnsDat.addComponent({
        html: telf,
        id: 'telf' + identificador
    });
    var telefono = '';
    columnsDat.addComponent({
        html: '',
        id: 'idHtmlTelefonoPrestamo' + identificador
    });
    columnsInferior.addComponent(condicionPago);
    condicionPago.getStore().on('load', function (st, records) {
        if (modificar == 'modificar') {
            //condicionPago.enable();
            condicionPago.setValue(data.data.idcondicionpago);
        }
    });


    if (modificar == 'modificar' && data.data.idpersona != null) {
        comboProveedor.disable();

        Ext.Ajax.request({
            url: 'buscarDatPersonaDePrestamo',
            method: 'POST',
            params: {
                idpersona: data.data.idpersona
            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.datos.length > 0) {

                    cmpEditable.setValue(rd.datos[0].nombreprestamo + ' ' + rd.datos[0].papelprestamo + ' ' + rd.datos[0].sapleprestamo);
                    cmpHideEditable.setValue(rd.datos[0].idpersona);

                    Ext.ns('LOG.aft.documento');
                    //LOG.aft.documento.nombre = rd.datos[0].nombreprestamo + ' ' + rd.datos[0].papelprestamo + ' ' + rd.datos[0].sapleprestamo;
                    LOG.aft.documento.direccion = rd.datos[0].direccion;
                    LOG.aft.documento.telefono = rd.datos[0].telefono;

                    columnsDat.addComponent({
                        html: "Direcci&oacute;n:"
                    });
                    columnsDat.addComponent({
                        html: (LOG.aft.documento.direccion) ? LOG.aft.documento.direccion : "-",
                        id: 'idHtmlDireccionPrestamo' + identificador
                    });
                    columnsDat.addComponent({
                        html: "Tel&eacute;fono"
                    });
                    columnsDat.addComponent({
                        html: (LOG.aft.documento.telefono) ? LOG.aft.documento.telefono : "-",
                        id: 'idHtmlTelefonoPrestamo' + identificador
                    });


                }
            }

        });
    }
    comboProveedor.on({
        'select': function (combo, record, index) {
            cmpEditable.reset();
            cmpEditable.allowBlank = true;
            document.getElementById('dir' + identificador).innerHTML = "Direcci&oacute;n:";
            document.getElementById('telf' + identificador).innerHTML = "Tel&eacute;fono";
            document.getElementById('idHtmlDireccionPrestamo' + identificador).innerHTML = (comboProveedor.getStore().getAt(index).data.direccion) ? comboProveedor.getStore().getAt(index).data.direccion : "-";
            document.getElementById('idHtmlTelefonoPrestamo' + identificador).innerHTML = (comboProveedor.getStore().getAt(index).data.telefono) ? comboProveedor.getStore().getAt(index).data.telefono : "-";

        }
    });

    /*storeProvedor.on('beforeload', function(st) {
        st.baseParams.idclasificacion = 1;
    });*/

    storeProvedor.on('load', function (st, records) {
        if (modificar == 'modificar' && !desabilitarCMB) {
            if (data.data.idpersona == "") {
                cmpEditable.disable();
                comboProveedor.enable();
            } else {
                comboProveedor.disable();
            }
            comboProveedor.setValue(data.data.idcliente);
            for (var i = 0; i < comboProveedor.getStore().data.items.length; i++) {
                if (comboProveedor.getStore().data.items[i].data.idclientesproveedores == data.data.idcliente) {
                    document.getElementById('dir' + identificador).innerHTML = "Direcci&oacute;n:";
                    document.getElementById('telf' + identificador).innerHTML = "Tel&eacute;fono";
                    document.getElementById('idHtmlDireccionPrestamo' + identificador).innerHTML = (comboProveedor.getStore().data.items[i].data.direccion) ? comboProveedor.getStore().data.items[i].data.direccion : "-";
                    document.getElementById('idHtmlTelefonoPrestamo' + identificador).innerHTML = (comboProveedor.getStore().data.items[i].data.telefono) ? comboProveedor.getStore().data.items[i].data.telefono : "-";
                    break;
                }
            }
        }
    });

    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        listeners:
            {
                'activate': function () {
                    storeProvedor.load();
                }
            },
        items: [columnsInferior, columnsDat, cmpHideEditable],
        getItems: function () {
            var cmps = Array();
            cmps[0] = (comboProveedor.getValue() != null) ? comboProveedor : cmpEditable;
            cmps[1] = condicionPago;
            return cmps;
        }
    });


    return panel;
}

function getItemsTeletrabajo(idioma, modificar, data, idarea_seleccionada) {

    var desabilitarCMB = false;
    if (modificar == 'modificar') {
        if (data.data.estado == 2 || data.data.estado == 3) {
            desabilitarCMB = true;
        }
    }
    
    var cmpHideEditable = new Ext.form.Hidden({
        name: "idpersona"
    });

    var carnetIdentidad = new Ext.form.TextField({
        allowBlank: false,
        readOnly: true,
        editable: false,
        fieldLabel: 'Carnet',        
        name: 'carnet',
        value: null,
    });

    var telefono = new Ext.form.TextField({
        allowBlank: true,
        fieldLabel: 'Tel&eacute;fono',        
        name: 'telefono',
        value: null,
    });

    var direccionCmp = new Ext.form.TextArea({
        allowBlank: false,
        anchor: '95%',
        name: 'direccion',
        fieldLabel: "Direcci&oacute;n:",
        value:  null
    });
    

    var cmpEditable = new LOG.util.Prototipos.inputTexto({
        width: '97%',
        allowBlank: false,
        fieldLabel: "Responsable",
        disabled: desabilitarCMB,
        listeners: {
            'focus': function (field) {
                Ext.getBody().mask(idioma.lbLoad, 'x-mask-loading');
                if (!Responsable) {

                    var panelBusPer = getPanelPersonas({
                        'personaselecionada': function () {
                            Responsable.listaBotones.getItem(2).enable();
                        },
                        'personadeselecionada': function () {
                            Responsable.listaBotones.getItem(2).disable();
                        }
                    }); 



                    var Responsable = new LOG.aft.documento.winResponsable({
                        title: 'Personas',
                        layout: 'fit',
                        onAceprtarFn: function () {
                            if (panelBusPer.getSeleccion()) {
                                cmpHideEditable.setValue(panelBusPer.getSeleccion().get('idpersona'));
                                field.setValue((panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel')));

                                Ext.ns('LOG.aft.documento');
                                LOG.aft.documento.direccion = panelBusPer.getSeleccion().get('direccion');
                                LOG.aft.documento.telefono = panelBusPer.getSeleccion().get('telefono');
                                LOG.aft.documento.carnetId = panelBusPer.getSeleccion().get('numid');
                                
                                carnetIdentidad.setValue(LOG.aft.documento.carnetId ? LOG.aft.documento.carnetId : null);
                                telefono.setValue(LOG.aft.documento.telefono ? LOG.aft.documento.telefono : null);
                                carnetIdentidad.setValue(LOG.aft.documento.carnetId);

                                Responsable.destroy();
                            }
                        }

                    });
                    Responsable.add(panelBusPer);
                    Responsable.show();
                }
                else {
                    Responsable.show();
                }
            }
        }
    });

    var columnsInferior = LOG.util.UIManager.initColumnForm({
        columnas: 3
    });
    
    columnsInferior.addComponent(cmpEditable);

    var columnsDat = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    columnsInferior.addComponent(carnetIdentidad);
    columnsInferior.addComponent(telefono);
    columnsInferior.addComponent(direccionCmp);

    if (modificar == 'modificar' && data.data.idpersona != null) {
        
        Ext.Ajax.request({
            url: 'buscarDatPersonaDePrestamo',
            method: 'POST',
            params: {
                idpersona: data.data.idpersona
            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.datos.length > 0) {

                    cmpEditable.setValue(rd.datos[0].nombreprestamo + ' ' + rd.datos[0].papelprestamo + ' ' + rd.datos[0].sapleprestamo);
                    cmpHideEditable.setValue(rd.datos[0].idpersona);

                    Ext.ns('LOG.aft.documento');
                    LOG.aft.documento.direccion = rd.datos[0].direccion;
                    LOG.aft.documento.telefono = rd.datos[0].telefono;
                    LOG.aft.documento.telefono = rd.datos[0].carnet;
                }
            }
        });
    }

    var panel = LOG.util.UIManager.initPanel({
        title: idioma.lbTitleDatosEspecificos,
        frame: true,
        labelAlign: 'top',
        border: false,
        bodyBorder: false,
        bodyStyle: 'padding:5px 5px 0',
        items: [columnsInferior, columnsDat, cmpHideEditable],
        getItems: function () {
            var cmps = Array();
            cmps[0] = cmpEditable;
            return cmps;
        }
    });


    return panel;
}

function getPanelPersonas(listeners) {
    var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
        region: 'center',
        id: 'panelBusPer',
        singleSelect: true,
        identidad: perfil.idestructuracomun,
        showBtnAdicionar: true,
        modulo: 'LOGISTICA',
        showBtnAyuda: false,
        seguridad: 0,
        limit: 30,
        start: 0,
        height: 100,
        listeners: listeners
    });

    // Se agrega esto porque sino el boton limpiar del componente de persona no funciona
    // -----------------------------------------------
    panelBusPer.runSearch = function (condiciones) {
        if (condiciones && condiciones.length > 0 && condiciones[0] != " ") {
            condiciones[condiciones.length - 1].logico = '';
            panelBusPer.hasSearch = true;
        } else {
            panelBusPer.hasSearch = false;
        }
        panelBusPer.stPersonas.baseParams.condiciones = condiciones; 
        panelBusPer.stPersonas.load();
    };
    panelBusPer.cleanSearch = function () {
        panelBusPer.tfbuscar.reset();
        panelBusPer.stPersonas.baseParams.condiciones = '';
        panelBusPer.stPersonas.baseParams.start = 0;
        panelBusPer.stPersonas.baseParams.limit = 25;
        panelBusPer.stPersonas.reload();
    };
    // -----------------------------------------------
    return panelBusPer;
}