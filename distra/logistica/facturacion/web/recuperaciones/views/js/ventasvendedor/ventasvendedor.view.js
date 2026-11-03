Ext.ns('Ext.erp.ventasvendedor');
Ext.erp.ventasvendedor = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,
   idCmp : null,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.ventasvendedor.Idioma);
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/';

        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this)
            }
            /*controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_this.dfDesde, 'fireEvent', function (e) {
                    if (_this.dfDesde.getValue() && _this.dfHasta.getValue()) {
                        b.enable();
                    } else {
                        b.disable();
                    }

                }, 'FECHAD');
                LOG.util.UIManager.encadenaFn(_this.dfHasta, 'fireEvent', function (e) {
                    if (_this.dfDesde.getValue() && _this.dfHasta.getValue()) {
                        b.enable();
                    } else {
                        b.disable();
                    }

                }, 'FECHAH');
            }*/

        }));
        this.idCmp = Ext.id();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.btnLimpiar();
            }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        _this.btnLimpiar();
                    }
                },
                {
                    alt: true,
                    key: 'p',
                    fn: function () {
                        _this.getReportes(_this)

                    }
                }
            ]);
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idventasvendedor' + this.idCmp}));

        this.addToolbarButtonDeposito('->');

        this.comboOperaciones = new LOG.util.LovCombo({ //---combobox Tipo de producto
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'subsistema',
            editable: false,
            //disabled: true,
            url: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarSubsistemas',
            width: 150,
            listWidth: 250,
            listeners: {
                select: function(cmb, rd) {
                    _this.idsubsistema = rd.json.idsubsistema;
                    if (_this.idsubsistema != 10) {
                        _this.comboDepositos.disable();
                        _this.comboDepositos.clearValue();
                    } else {
                        _this.comboDepositos.enable();
                    }
                }
            }
        });
       /* this.comboDepositos = new LOG.util.LovCombo({
            mode:'remote',
            url:  '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            displayField:'deposito',
            valueField:'iddeposito'
        });*/
        this.cmbEstructuras = new LOG.util.LovCombo({
            fieldLabel: 'Entidades',
            url:'getEstructuras',
            name:'idestructura',
            displayField : 'denominacion',
            valueField : 'idestructura',
            minChars:3,
            resizable:true,
            width: 150,
            listWidth: 250,
            hidden: (!_this.grantedAction('REntidades')) ? true : false
        });
        this.comboDepositos = new LOG.util.LovCombo({
            editable: false,
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            hiddenName: 'iddeposito',
            valueField: 'iddeposito',
            displayField: 'deposito',
            mode: 'remote',
            editable: false,
            disabled: true,
            width: 150,
            listWidth: 250,
            listeners: {
                select: function (cmb, rd) {
                    _this.gdCliente.storePrincipal.removeAll();
                }
            }
        });
        /*this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.comboDepositos);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbOperaciones
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.comboOperaciones);*/

        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbOperaciones
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.comboOperaciones);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));
        this.addToolbarButtonDeposito(this.comboDepositos);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbEntidades
        }));
        this.addToolbarButtonDeposito(this.cmbEstructuras);



        /*--------------Fieldset RangoFecha-----------------*/
        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'desdevend',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeVend' + this.idCmp,
            endDateField: 'hastaVend' + this.idCmp,
            editable: false
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'hastavend',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaVend' + this.idCmp,
            startDateField: 'desdeVend' + this.idCmp,
            editable: false
        });
        this.dfDesde.endDateField = this.dfHasta.id; //-------validacion de fecha
        this.dfHasta.startDateField = this.dfDesde.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesde);
        this.clsFecha.addComponent(this.dfHasta);

        this.fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true,
            width: 200,
            items: [this.clsFecha]
        });

        /*--------------Fieldset Clientes-----------------*/
        this.fsCliente = new Ext.form.FieldSet({
            layout: 'border',
            title: 'Selecci\xf3n de vendedores',
            //disabled: true,
            height: 350
        });
        this.gdCliente = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            region: 'center',
            tltWinAdd: this.idioma.ttWinAddCliente,
            header: this.idioma.gcVendedor,
            ttBtnAdd: this.idioma.ttAddClient,
            ttBtnDel: this.idioma.ttElimClient,
            idItem:'vendedor'
        });
        this.btnSelecCliente = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.ttAddSumin,
            iconCls: 'adicionar',
            handler: function () {
                _this.recordClientes = _this.gdCliente.storePrincipal.data.items;
                var iddocumentos = [];

                Ext.each(_this.recordClientes, function (rec) {
                    if (rec.data.idpersona) {
                        iddocumentos.push(rec.data.idpersona);
                    }
                });

                var ventanaDocumento = new Ext.erp.ventanaDocumento({
                    iddocumentos: Ext.encode(iddocumentos),
                    iddeposito: _this.comboDepositos.getValue(),
                    concepto: 'documentos',
                    urlBusquedaGridPrincipal: 'cargarVendedor',
                    initDefaultColumns: function(){
                        this.addGridColumn({
                            dataIndex: 'idpersona',
                            default: true
                        });
                        this.addGridColumn({
                            dataIndex: 'nombre',
                            default: true
                        });
                        this.addGridColumn({
                            header: 'No. identidad',
                            width: 100,
                            dataIndex: 'numid',
                            default: true
                        });
                        this.addGridColumn({
                            header: 'Nombre y apellidos',
                            width: 200,
                            dataIndex: 'nombreapellidos',
                            default: true
                        });
                        this.addGridColumn({
                            header: 'Sexo',
                            width: 50,
                            dataIndex: 'sexo',
                            default: true,
                            renderer: function (val) {
                                if (val === 'Femenino' || val === '0') {
                                    return '<center><img ext:qtip="<b>Femenina</b> "src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHgSURBVDjLjZLNbtNAFIXrJ8mL+QVQoVUWICFEFZCAbrJCAdpFWCC1i1QgVLEoZYFAgrY0rhPHTmwnThP/BKetU9vxT7I5zHWEhEBuWBxpFnO+c+6dWQGw8qfUisQNdnR+tD+ojQ9txz2wHPvdea1f7fDtssj9ff8fs7VnlCbCJRIzwsxNMfuZIuoGuPriwtjqlOSndS4XQMlkJuPcm2F+yXSxUGrHcD9YUDcbfC6AalMyGaNuiIvDEdx9C0FjwqAJfMGD/qRZywXQvFk6SxwfOOhvdwpGRSnYb/pslASxMYX6UHRuaDB0aGYCuO9N9J4rhW65VTC39AWgN0XnnpAPMHeN2lT1F3XrHqzXBsxXOq4+u0idGN7XMeTiaf4IvRcKP/5oIxlEWSKJjCTayeClhubaUf4SlWcCp5el0ujtEGHrOtt8asUIxQmGzCzdOS6JxW/5z5hBHguc9qjJdzekfqQGSM4jdFaFsHX7hG+sf7/5I5HaG2dV7UFD0+6K2lTxs8W1b536yuoPTVo72lwKUO+Lc6pP5nQYZ/uIeyGCMw+shbYUoBTrGYBE9UmhdI1A9CD/D0BaP6nKrC6rrZGRRGc5G+H401LAb5HBZ7WpOp3z7uUC2HtXqDKJJe/k3fsF8TkmWq5zP6gAAAAASUVORK5CYII=" /></center>';
                                } else {
                                    return '<center><img ext:qtip="<b>Maculino</b>" src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIHSURBVDjLpVNNaxNRFH0fgzNxRlNIm6QVsSRQ1IUiVCSCS8FF4kokO/9BF7oUstBll4IuunBpl61RNy4suhgF21WhJVU0WiHUksmQr2bex/TeMJEoxog+uMzjzT3nnXPmDg3DkPzPMsY1PHrpdaWUZFBCDJ6C3L91NjaWAAH5SwkLhaJaTfBJyOOnmwf4no0lkIJUqg2hAKUAqKMKQMFfEdy5PhN7X/Ge1L22QqACCUFPhCIIvv6UwdJaiyopi1KqAnjMRZ5dUDBzbta5fDxuc99vafuYw9SQgj7B0qsmBeDdTJKXUhMWi5mcaRKSVrt30uCcHrFMtrv7Xb5wq8+uzp/Ip1MJLoYJ4KZiZsoozU5bBqWM9r8slO0c5bjvdrr6uVt9B6CF1dcfrgm5JVHhDwJIuoA3QyS0tteUGzueEtBwIRvnyXTC6HR76PnLw9tX0HdsOCMWJZ0zLZANt63v1NV+ozO377Xn3M2a0hCabdsMPOdGDhL60dFASthjQHgmOOufK/Az8PzrYhGB22wdaGw+n5ngjkkrjsUqF88kOZ75dV9jz2gFgSh/+ubfOJ012VR60sinJg0UhGApgnDrYw0IZHkkAUheXt/ey/aCoHRqOs4cx+7n4TcaehvAbzY+34PUl39HQAd/48KDtxT8FyH9ghQyhyOMgwRVRvDK4s3wjwT/ug4BPyZOkZTlSM0AAAAASUVORK5CYII=" /></center>';
                                }
                            }
                        });
                    }
                });
                ventanaDocumento.init();
                /*ventanaDocumento.getPanelSuperior().onRender = ventanaDocumento.getPanelSuperior().onRender.createSequence(function() {
                    ventanaDocumento.getPanelSuperior().add(ventanaDocumento.createComboDeposito());
                    ventanaDocumento.getPanelSuperior().doLayout();
                });*/
                ventanaDocumento.getVistaPrincipal().title = 'Vendedores';
                ventanaDocumento.view();
                ventanaDocumento.getGridPrincipal().store.load();
                var botonAceptar = ventanaDocumento.getVistaPrincipal().listaBotones.getItem(2);

               /* ventanaClientes.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaClientes.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaClientes.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });*/
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaDocumento.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.gdCliente.storePrincipal, records);

                });


            }
        });
        this.btnElimCliente = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimSumin,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdCliente.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdCliente.storePrincipal.remove(selected);
                });
                if (_this.gdCliente.storePrincipal.getCount() == 0) {
                    _this.btnElimCliente.setDisabled(true);
                }
            }
        });
        this.gdCliente.addToolbarButton(this.btnSelecCliente);
        this.gdCliente.addToolbarButton(this.btnElimCliente);
        this.gdCliente.init();
        this.fsCliente.add(this.gdCliente.view());



        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 1
        });
        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsCliente);

        this.clsGeneral.getColumn(0).getComponent(0).anchor = '30%';
        //this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({

            region: 'center',
            style: '-moz-border-radius:20px',
            items: [this.clsGeneral]
        });
        /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()],
                bbar: [this.listaBotonesDeposito.getArray()]
            },
            this.fpCentral
        ];

        Ext.erp.ventasvendedor.superclass.constructor.call(this, config);

        this.listaBotonesVentanaToolbar.each(function(b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));

    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    arrayToString: function(store, nrodoc){
        var stringGeneric = "";
        for (var i = 0; i < store.data.items.length; i++) {
            if (i != store.data.items.length - 1) {
                stringGeneric += (nrodoc) ? store.data.items[i].data.nrodoc + "," : store.data.items[i].data.idpersona + ",";
            } else {
                stringGeneric += (nrodoc) ? store.data.items[i].data.nrodoc + "" : store.data.items[i].data.idpersona + "";
            }
        }
        stringGeneric = (nrodoc) ? stringGeneric : "{" + stringGeneric + "}";
        if(stringGeneric== "{}") {
            stringGeneric = null;
        }
        return stringGeneric;
    },
    getReportes: function (_this) {
        var depositos = "";
        _this.entidades=[];
        _this.entidadesCheck=[];
        if(this.comboDepositos.view){
            for(var i=0; i < this.comboDepositos.view.store.data.items.length; i++) {
                if (this.comboDepositos.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboDepositos.view.store.data.items[i].data.iddeposito);
                }
                _this.entidades.push(_this.comboDepositos.view.store.data.items[i].data.iddeposito);
            }
            if(_this.entidadesCheck.length > 0){
                depositos = "{" + _this.entidadesCheck.join() + "}";
            }
            else{
            //    depositos = "{" + _this.entidades.join() + "}";
                depositos = null;
            }
        }
        else{
            for(var i=0; i < this.comboDepositos.store.data.items.length; i++) {
                _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
            }
            //depositos = "{" + _this.entidades.join() + "}";
            depositos = null;
        }



        var cadenaIdsT = "";
        var cadenaIdsC = "";
        var cadenaFinal = "";
        for (var i = 0; i < _this.gdCliente.storePrincipal.data.items.length; i++) {
            if (i != _this.gdCliente.storePrincipal.data.items.length - 1) {
                cadenaIdsC += _this.gdCliente.storePrincipal.data.items[i].data.idpersona + "," ;
            } else {
                cadenaIdsC += _this.gdCliente.storePrincipal.data.items[i].data.idpersona + "" ;
            }
        }


        if(cadenaIdsC)
        {
            cadenaFinal +=  cadenaIdsC+",";
        }
        cadenaFinal="{"+ cadenaFinal +"}"
        if(cadenaFinal== "{}") {
            cadenaFinal = null;
        }
        var dual = (alternativa) ? 'Dual' : '';
        this.tipoReportes =  new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/recuperaciones/VentasVendedor'+dual,
                    isList: true,
                    params: {
                        //iddoc: iddocFac,
                        arrayidnomoperaciones: (_this.comboOperaciones.getValue())? "{" + _this.comboOperaciones.getValue() + "}": null,
                        //deposito: (_this.comboDepositos.getValue()) ? _this.comboDepositos.getValue() : null,
                        arrayiddeposito: depositos,
                        arrayidpersona: _this.arrayToString(_this.gdCliente.storePrincipal),//cadenaFinal,
                        fechafin: (_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                        fechainicio: (_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                        idestructuras: (_this.cmbEstructuras.getValue()) ?  "{"+ _this.cmbEstructuras.getValue() +"}" : "{"+idEntidad +"}",
                        //arraydeposito: depositos,
                        monedaalternativa: (monedaalternativa) ? monedaalternativa: null,
                        monedacontable: monedacontable
                    }

                }
            ]
        });
        this.tipoReportes.view();
    },
    btnLimpiar: function(){
        var _this=this;
        _this.dfDesde.setValue(null);
        _this.dfHasta.setValue(null);
        _this.dfDesde.setMaxValue(null);
        _this.dfHasta.setMinValue(null);
        _this.comboDepositos.clearValue();
        _this.comboDepositos.disable();
        _this.comboOperaciones.clearValue();
    },
    addRecords: function (store, records) {
        var _this = this;

        Ext.each(records, function (record, index) {
            if (!_this.existsRecord(store, record)) {
                var recordType;
                if (store.idItem === 'producto') {
                    recordType = new store.recordType({
                        idproducto: record.get('idproducto'),
                        codigoproveedor: record.get('codigoproveedor'),
                        codigo: record.get('codigo'),
                        denominacion: record.get('denominacion')
                    });
                } else if(store.idItem === 'documento'){
                    recordType = new store.recordType({
                        iddocumento: record.get('iddocumento'),
                        nrodoc: record.get('nrodoc'),
                        fechacontable: record.get('fechacontable')
                    });
                } else {
                    recordType = new store.recordType({
                        idpersona: record.get('idpersona'),
                        nombre: record.get('nombre')
                    });
                }
                store.add(recordType);
            }
        });

    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(acciones_reportes, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    existsRecord: function (store, record) {

        var flags = false;
        Ext.each(store.data.items, function (nRecord, index) {
            if (store.idItem === 'producto') {
                if ( nRecord.get('idproducto') === record.get('idproducto')) {
                    flags = true;
                }
            } else if (store.idItem === 'documento') {
                if ( nRecord.get('iddocumento') === record.get('iddocumento')) {
                    flags = true;
                }
            } else {
                if (nRecord.get('idpersona') === record.get('idpersona')) {
                    flags = true;
                }
            }
        });
        return flags;
    }

});
