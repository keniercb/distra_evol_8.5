Ext.ns('LOG.fac.puntoventa.devolucion');
/**
 * <Componente de Devolución>
 */
LOG.fac.puntoventa.devolucion.winDevolucion = Ext.extend(LOG.util.UITemplate, {
    regVentasRealizadas: undefined,
    constructor: function(config) {
        this.dirController = '/logistica/facturacion/puntoventa/index.php/devolucionpuntoventa';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.autoLoad= true,
        this.urlBusquedaGridPrincipal = 'devoluciones';
        this.concepto = config.idioma.ttBtnBuscarVenta;
        this.textBusquedaSimple = config.idioma.lbTxtIntroducir;
        LOG.fac.puntoventa.devolucion.winDevolucion.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;

        LOG.fac.puntoventa.devolucion.winDevolucion.superclass.init.call(this);
        this.cmbArea = new LOG.util.ComboBox({
            autoLoad: true,
            name: 'idareaventa',
            url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarAreas',
            valueField: 'idestructuraop',
            displayField: 'coddenominacion',
            width:350,
            anchor: '90%',
            listWidth:350,
            mode: 'remote',
            //pageSize: 10,
            //mode: 'remote',
            //allowBlank: false,
            baseParams:{
                addAll: true
            },
            editable: false,
            listeners: {
                /*expand: function () {
                    this.store.reload();
                },*/
                select: function (combo,record,index) {
                    /*me.listaBotones.getItem(0).enable();
                    me.listaBotones.getItem(1).enable();
                    me.listaBotones.getItem(2).enable();
                    me.listaBotones.getItem(3).enable();
                    me.listaBotones.getItem(4).enable();*/
                    //_this.getPanelGrid().enable();
                    _this.datosConf = record.json;
                    //me.idareaventa = record.json.idareaventa;
                    _this.getStorePrincipal().reload({
                        params: {
                            idestructura: combo.getValue(),
                            idareaventa: record.json.idareaventa
                        }
                    });
                }
            }
        });
        this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: ['->', '-', this.idioma.lbCmbArea + ':', this.cmbArea]
        }));
        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: 10
        });
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            dataIndex: 'tipodevolucion',
            header: 'Tipo de devoluci&oacute;n',
            width: 110,
            renderer: function(v) {
                if(v == 1){
                    return "Devoluci&oacute;n total";
                }else if(v == 2){
                    return "Devoluci&oacute;n parcial";
                }else{
                    return v;
                }
            }
        });

        this.addGridColumn({
            header: this.idioma.cgNroDev,
            width: 100,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgFechadev,
            dataIndex: 'fechadevolucion',
            align: 'center',
            width: 100,
            default: true
        });

        this.addGridColumn({
            header: 'Cliente',
            width: 150,
            dataIndex: 'cliente',
            default: true,
            hidden: true,
            agrupador: true
        });

        this.addGridColumn({
            header: this.idioma.cgNroVenta,
            width: 100,
            dataIndex: 'nroventa',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgFechaVenta,
            dataIndex: 'fechaventa',
            align: 'center',
            width: 100,
            default: true
        });

       /* this.addGridColumn({
            header: this.idioma.cgFechaexp,
            dataIndex: 'fechaexpiracion',
            align: 'center',
            width: 70,
            default: true
        });*/

        this.addGridColumn({
            header: 'Importe',
            width: 60,
            dataIndex: 'totalefectdevuelto',
            align: 'right',
            default: true,
            renderer: function(v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });

        this.addGridColumn({
            header: 'Productos',
            align: 'center',
            width: 100,
            dataIndex: 'cantidadproddevolver',
            default: true
        });
        
        this.addGridColumn({
            header: 'Nro. comprobante',
            align: 'right',
            width: 100,
            dataIndex: 'nrocomprobante',
            default: true
        });

        this.addGridColumn({
            header: 'Motivo de devoluci&oacute;n',
            width: 250,
            dataIndex: 'motivodevolucion',
            default: true
        });

        this.addGridColumn({dataIndex: 'iddevolucion'});
        this.addGridColumn({dataIndex: 'idventas'});
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'registro',
            //disabled: true,
            text: this.idioma.lbBtnRegistrarDevolucion,
            tooltip: this.idioma.ttBtnRegistrarDevolucion,
            handler: function() {
                //this.disable();
                _this.regVentasRealizadas = new LOG.fac.puntoventa.devolucion.regVentasRelizadas({
                    idioma: _this.idioma,
                    idestructura: _this.cmbArea.getValue(),
                    _parent: _this,
                    btnDevolucion: this
                });
                _this.regVentasRealizadas.init();
                _this.regVentasRealizadas.view();
            }
        }));

        this.btnImprimirListado = LOG.util.UIManager.createMenuItem({
            text: 'Listado de devoluciones',
            iconCls: 'imprimir',
            isList: true,
            dirReport: '/distra/logistica/puntoventa/terminalpuntoventa/ListadoDevolucionesModelo',
            handler: _this.onReport.createDelegate(this)
        });
        this.btnImprimirModelo = LOG.util.UIManager.createMenuItem({
            text: 'Modelo de devoluciones',
            iconCls: 'imprimir',
            isList: false,
            name: 'Modelo de devoluciones',
            dirReport: '/distra/logistica/puntoventa/terminalpuntoventa/ReciboDevolucionModelo',
            disabled: true,
            handler: _this.onReport.createDelegate(this),
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                } else {
                    b.hide();
                }
            }
        });
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.lbBtnImprimir,
            text: this.idioma.lbBtnImprimir,
            iconCls: 'imprimir',
            menu: [this.btnImprimirListado, this.btnImprimirModelo]
        }));
    },
    onReport: function (btn) {
        var _this = this;
        var has = _this.getGridPrincipal().getSelectionModel().hasSelection();
        if (has){
            if(btn.isList == false){
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                var report = new LOG.util.Report({
                    idioma: _this.idioma,
                    reports: [
                        {
                            name: 'Modelo de devoluci&oacute;n',
                            isList: btn.isList,
                            params: {
                                iddocumento: record.get("iddevolucion") ? record.get("iddevolucion") : null
                            },
                            dirReport: btn.dirReport //'/distra/logistica/puntoventa/terminalpuntoventa/ReciboDevolucionModelo'
                        }
                    ]
                });
                report.view();
            }else{
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                var report = new LOG.util.Report({
                    idioma: _this.idioma,
                    reports: [
                        {
                            name: 'LISTADO DE DOCUMENTOS DE DEVOLUCIÓN',
                            isList: btn.isList,
                            params: {
                                //iddeposito: (_this.panelBusquedaAvanzada.findByType('combo')[5].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[5].getValue() : null,
                                fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
                                //fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
                                idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
                                //docorigen: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
                                //anno: (_this.panelBusquedaAvanzada.findByType('textfield')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('textfield')[4].getValue() : null,
                                entregar: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
                                //tipodocumento: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? "{" + _this.panelBusquedaAvanzada.findByType('combo')[0].getValue()+"}" : null,
                                creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
                                idproducto: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
                                modopago: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
                                busqueda: (_this.gridFilter.tfBusqueda.getValue()) ? _this.gridFilter.tfBusqueda.getValue() : null,
                            },
                            dirReport: btn.dirReport //'/distra/logistica/puntoventa/terminalpuntoventa/ReciboDevolucionModelo'
                        }
                    ]
                });
                report.view();
            }
        }
    },
    view: function() {
        var me = this;

        this.btnLimpiar = LOG.util.Prototipos.botonLimpiar({            
            tooltip: this.idioma.ttBtnLimpiar + ' <b>(Alt+L)</b>',
            handler: function () {            
                me.cmbArea.reset();
                me.getStorePrincipal().reload({
                    params: {
                        ordenarcaja: 1,
                        idestructura: ''
                    },
                    callback: function() {
                        
                    }
                });
            }
        });
        this.btnLimpiar.key.fn = function () {         
            me.cmbArea.reset();
            me.getStorePrincipal().reload({
                params: {
                    ordenarcaja: 1,
                    idestructura: ''
                },
                callback: function() {
                    
                }
            });
        };
        this.btnLimpiar.setText(LOG.util.UIManager.ireplaceStyle(this.btnLimpiar.getText(), this.btnLimpiar.key.key, 'span', 'text-decoration: underline;'));

        this.cmbArea = new LOG.util.ComboBox({
            name: 'idareaventa',
            url: this.dirController + '/cargarAreas',
            valueField: 'idestructuraop',
            displayField: 'coddenominacion',
            width:350,
            anchor: '90%',
            listWidth:350,
            //editable: false,
            emptyText: this.idioma.lbTxtSelect,
            listeners: {
                select: function(cmb, rd) {
                    //me.getPanelGrid().enable();
                    me.getStorePrincipal().reload({
                        params: {
                            ordenarcaja: 1,
                            idestructura: rd.data.codigo
                        },
                        callback: function() {
							
                        }
                    });
                }
            }
        });
        
        return LOG.fac.puntoventa.devolucion.winDevolucion.superclass.view.call(this);
    },
    render: function() {
        var p = LOG.fac.puntoventa.devolucion.winDevolucion.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e) {
            if (e === 'beforeload') {
                if (me.cmbArea.isDirty() && me.cmbArea.isValid()) {
                    this.initBaseParams.idestructura = me.cmbArea.getValue();
                    this.baseParams.idestructura = me.cmbArea.getValue();
                }
            } else if (e === 'load') {
                if (this.data.items.length === 0 && !this.filtrado) {
                    mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
                }
            }
        }, 'CMBAREADEVOLUCION');
        return p;
    }
});

LOG.fac.puntoventa.devolucion.regVentasRelizadas = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'ventana',
    modoSeleccion: 1,
    autoLoad: false,
    busquedaBasica: true,
    dirController: '/logistica/facturacion/puntoventa/index.php/devolucionpuntoventa',
    urlBusquedaGridPrincipal: 'ventasRealizadas',
    constructor: function(config) {
        var _this = this;
        this.concepto = config.idioma.ttBtnBuscarVenta;
        this.textBusquedaSimple = config.idioma.lbTxtIntroducir;
        LOG.fac.puntoventa.devolucion.regVentasRelizadas.superclass.constructor.call(this, config);
        this.getVistaPrincipal().width = 900;
        this.getVistaPrincipal().height = 500;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().title = this.idioma.tVentasRealizas;
        this.deldia = (!this._parent.grantedAction('RangoFecha') && !this._parent.grantedAction('CT')) || null;
        if (typeof TV_EXIST !== 'undefined' && TV_EXIST == true) {
            this.cmbDescuento = new Ext.erp.comboNomenclador({
                controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                fieldLabel: 'Descuento',
                modelo: 'NomDescuento',
                idnom: 'porciento',
                name: 'iddescuento',
                //anchor: '90%',
                editable: false,
                autoCargar: true
            });
            this.cmbDescuento.getStore().on('load', function(st, rd, opt){
                if(rd.length > 0){
                    Ext.each(rd, function(r){
                        r.data.denominacion = r.data.denominacion+' '+r.data.porciento+'%';
                    });
                    _this.cmbDescuento.view.refresh();
                }
            });
        }
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgNroVenta,
            width: 100,
            dataIndex: 'nrofactura',
            default: true
        });

        this.addGridColumn({
            header: 'Cliente',
            width: 150,
            dataIndex: 'clientereal',
            default: true,
            hidden: true,
            agrupador: true
        });

        this.addGridColumn({
            header: this.idioma.cgFechaVenta,
            dataIndex: 'fechacontable',
            align: 'center',
            width: 100,
            default: true
        });

        /*this.addGridColumn({
            header: this.idioma.cgFechaexp,
            dataIndex: 'fechaexpiracion',
            align: 'center',
            width: 70,
            default: true
        });*/

        this.addGridColumn({
            header: 'Importe',
            width: 50,
            dataIndex: 'importe',
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.importedevuelto > 0) {
                     var v = value - record.json.importedevuelto;
                     return Ext.util.Format.number(v, '0,000.00');
                }
                return Ext.util.Format.number(value, '0,000.00');
            }/*
            renderer: function(v) {
                return parseFloat(v).toFixed(2);
            }*/
        });

        this.addGridColumn({
            header: 'Productos',
            align: 'center',
            width: 45,
            dataIndex: 'cantproductos',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbCmbArea,
            width: 200,
            dataIndex: 'areaventa',
            default: true
        });

        this.addGridColumn({
            header: 'Vendedor',
            width: 100,
            dataIndex: 'vendedor',
            default: true
        });

        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({dataIndex: 'idpersona'});
        this.addGridColumn({dataIndex: 'idcliente'});
        this.addGridColumn({dataIndex: 'idoperacion'});
        this.addGridColumn({dataIndex: 'idoperaciondev'});
        this.addGridColumn({dataIndex: 'idestructuracomun'});
    },
    init: function() {
        var me = this;
        LOG.fac.puntoventa.devolucion.regVentasRelizadas.superclass.init.call(this);
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(true);

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(1), {
            text: 'Devoluci&oacute;n parcial',
            tooltip: 'Devoluci&oacute;n parcial',
            disabled: true,
            handler: function() {
                var s = me.getSmPrincipal().getSelected();
                var regDevolucion = new LOG.fac.puntoventa.devolucion.regDevolucion({
                    idioma: me.idioma,
                    _parent: me
                });
                regDevolucion.init();
                regDevolucion.view();
                console.info(s);
                var titulo = "Devoluci&oacute;n de la venta <u>No.</u> "+s.data.nrofactura+" <u>Fecha:</u> "+s.data.fechacontable
                    +" <u>Cliente:</u> "+s.data.clientereal+ "<u>  Importe total: </u>"+parseFloat(s.data.importe).toFixed(2);
                regDevolucion.getVistaPrincipal().setTitle(titulo);
            }
        });
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            text: 'Devoluci&oacute;n total',
            tooltip: 'Devoluci&oacute;n total',
            disabled: true,
            key: {
                key: 13
            },
            handler: function() {
                var _this = this;
                var s = me.getSmPrincipal().getSelected();
                var texto = "Desea realizar la devoluci&oacute;n total de la venta <b>No. </b>"+s.data.nrofactura+" <b>Fecha:</b> "
                    +s.data.fechacontable+" <b>Cliente:</b> "+s.data.clientereal+ "<b> Importe total: </b>"+parseFloat(s.data.importe-s.json.importedevuelto).toFixed(2)+
                    "?";
                this.taMotivoDevolucion = new Ext.form.TextArea({
                    fieldLabel: 'Motivo de la devoluci&oacute;n',
                    name: 'motivodevolucion',
                    allowBlank: false,
                    enableKeyEvents: true,
                    maxLength: 255,
                    minLength: 2,
                    minLengthText: me.idioma.ttLongitudMinima,
                    anchor: '100%',
                    maxRe: LOG.util.Regex.cadena,
                    regex: LOG.util.Regex.cadena
                });
                if (typeof TV_EXIST !== 'undefined' && TV_EXIST == true) {
                    this.cmbDescuento = new Ext.erp.comboNomenclador({
                        controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                        fieldLabel: 'Descuento',
                        modelo: 'NomDescuento',
                        idnom: 'porciento',
                        name: 'iddescuento',
                        //anchor: '90%',
                        editable: false,
                        autoCargar: true
                    });
                    this.cmbDescuento.getStore().on('load', function(st, rd, opt){
                        if(rd.length > 0){
                            Ext.each(rd, function(r){
                                r.data.denominacion = r.data.denominacion+' '+r.data.porciento+'%';
                            });
                            _this.cmbDescuento.view.refresh();
                        }
                    });
                }
                var descuento = (this.cmbDescuento && s.json.tiendavirtual && s.json.tiendavirtual == 1) ? true : false;
                this.frmMotivoDevolucion = LOG.util.UIManager.initForm({
                    frame: true,
                    region: 'center',
                    labelAlign: 'top',
                    layout: 'form',
                    height: (descuento) ? 175 : 100
                });
                if (descuento) {
                    this.frmMotivoDevolucion.add(this.cmbDescuento);
                }

                this.frmMotivoDevolucion.add(this.taMotivoDevolucion);
                this.winMotivoDevolucion = new Ext.Window({
                    region: 'center',
                    layout: 'border',
                    title: 'Motivo de la devoluci&oacute;n',
                    height: (descuento) ? 225 : 150,
                    width: 350,
                    modal: true,
                    items: [this.frmMotivoDevolucion],
                    buttons:[{
                        text: 'Cancelar',
                        iconCls: 'cancelar',
                        handler: function(){
                            this.winMotivoDevolucion.close();
                        }.createDelegate(this)
                    },{
                        text: 'Aceptar',
                        iconCls: 'aceptar',
                        handler: function(){
                            if(this.frmMotivoDevolucion.getForm().isValid()){
                                mostrarMensaje(2, texto, function (btnPresionado) {
                                    if (btnPresionado == 'ok') {
                                        let idoperacion = (typeof TPV_OPER_DEV !== 'undefined' && parseInt(TPV_OPER_DEV) == 2) ? s.data.idoperaciondev : s.data.idoperacion;
                                        var motivo = this.taMotivoDevolucion.getValue();
                                        var valorDescuento = (_this.cmbDescuento) ? _this.cmbDescuento.getValue() : 0;
                                        this.winMotivoDevolucion.close();
                                        Ext.getBody().mask('Realizando devoluci&oacute;n...');
                                        Ext.Ajax.request({
                                            url: 'devolverventa',
                                            params: {
                                                tipodevolucion: 1, //Devolucion total
                                                idventas: s.data.iddocumento,
                                                idventacliente: s.data.idpersona,
                                                idcliente: s.data.idcliente,
                                                iddeposito: s.data.idestructuracomun,
                                                idoperacion: idoperacion,
                                                motivo: motivo,
                                                totalefectivodevuelto: s.data.importe-s.json.importedevuelto,
                                                descuento: (descuento) ? valorDescuento : 0
                                            },
                                            callback: function(o, s, r) {
                                                Ext.getBody().unmask();
                                                var responseData = LOG.util.UIManager.decodeAjaxResponse(r);
                                                if(responseData.codigo == 1){
                                                    mostrarMensaje(1, "La devoluci&oacute;n se realiz&oacute; satisfactoriamente.");
                                                    //this.winMotivoDevolucion.close();
													me.getStorePrincipal().removeAll();
                                                    me.getStorePrincipal().load({
                                                        params: {
                                                            idestructura: me.idestructura
                                                        }
                                                    });
                                                }else{
                                                    mostrarMensaje(3, responseData.mensaje);
                                                }

                                            }.createDelegate(this)
                                        });
                                    }
                                }.createDelegate(this));
                            }
                        }.createDelegate(this)
                    }]
                });

                this.winMotivoDevolucion.show();
            }
        });
    },
    view: function() {
        var me = this;
        //this.getPanelGrid().disable();
        this.btnBuscar = LOG.util.Prototipos.botonBuscar({
            tooltip: this.idioma.ttBtnBuscarDView + ' <b>(Alt+B)</b>',
            handler: function () {
                if(Ext.isEmpty(me.gridFilter.tfBusqueda.getValue())) {
                  if(me.desde.getValue() != '' || me.hasta.getValue() != ''){
                      me.getStorePrincipal().load(/*{
                          params: {
                              desde: me.desde.getValue(),
                              hasta: me.hasta.getValue()
                          },
                          callback: function() {*/
                              /*if (record.length == 0) {
                                  mostrarMensaje(1, me.idioma.msgNoResultados);
                                  return;
                              }*/
                          /*}
                      }*/);
                  }   
                } else {
                  me.gridFilter.onTriggerSearch();
                }
                
            }
        });
        this.btnBuscar.key.fn = function () {
            if(me.desde.getValue() != '' || me.hasta.getValue() != ''){
                me.getStorePrincipal().load(/*{
                    params: {
                        desde: me.desde.getValue(),
                        hasta: me.hasta.getValue()
                    },
                    callback: function() {*/
                        /*if (record.length == 0) {
                            mostrarMensaje(1, me.idioma.msgNoResultados);
                            return;
                        }*/
                    /*}
                }*/);
            }
        };
        this.btnBuscar.setText(LOG.util.UIManager.ireplaceStyle(this.btnBuscar.getText(), this.btnBuscar.key.key, 'span', 'text-decoration: underline;'));

        this.btnLimpiar = LOG.util.Prototipos.botonLimpiar({            
            tooltip: this.idioma.ttBtnLimpiar + ' <b>(Alt+L)</b>',
            handler: function () {
                me.desde.reset();
                me.hasta.reset();
                me.gridFilter.onTriggerClear();
                me.getStorePrincipal().load(/*{
                    params: {
                        desde: me.desde.getValue(),
                        hasta: me.hasta.getValue()
                    },
                    callback: function() {
                        
                    }
                }*/);
            }
        });
        this.btnLimpiar.key.fn = function () {
            me.desde.reset();
            me.hasta.reset();
            me.getStorePrincipal().load(/*{
                params: {
                    desde: me.desde.getValue(),
                    hasta: me.hasta.getValue()
                },
                callback: function() {
                    
                }
            }*/);
        };
        this.btnLimpiar.setText(LOG.util.UIManager.ireplaceStyle(this.btnLimpiar.getText(), this.btnLimpiar.key.key, 'span', 'text-decoration: underline;'));
 
        this.desde = new Ext.form.DateField({
            fieldLabel: me.idioma.fDesde,
            name: 'desde',
            vtype: 'daterange',
            //setMaxValue: fechaSistPV,
            id: 'fechainicio',
            endDateField: 'fechafin'
        });
        this.hasta = new Ext.form.DateField({
            fieldLabel: me.idioma.fHasta,
            name: 'hasta',
            vtype: 'daterange',
            //setMaxValue: fechaSistPV,
            id: 'fechafin',
            startDateField: 'fechainicio'            
        });
        if(this._parent.grantedAction('RangoFecha') || this._parent.grantedAction('CT')){
            this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
                tbar: ['-', '->', '-', 'Desde: ', this.desde,'-','Hasta: ',this.hasta,'-',this.btnBuscar,'-',this.btnLimpiar]
            }));
            LOG.util.UIManager.apply(this.getPanelSuperior(), {
                width: '50%'
            });
        }
        return LOG.fac.puntoventa.devolucion.regVentasRelizadas.superclass.view.call(this);
    },
    render: function() {
        var p = LOG.fac.puntoventa.devolucion.regVentasRelizadas.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.gridFilter.btnLimpiar, 'handler', function () {
            me.desde.reset();
            me.hasta.reset();
        });
        this.getStorePrincipal().load({
            params: {
                idestructura: me.idestructura,
                deldia: me.deldia || null,
                desde: me.desde.getValue() || null,
                hasta: me.hasta.getValue() || null
            }
        });
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e) {
            if (e == 'beforeload') {
                this.initBaseParams.idestructura = me.idestructura;
                this.baseParams.idestructura = me.idestructura;
                this.initBaseParams.deldia = me.deldia;
                this.baseParams.deldia = me.deldia;
                this.initBaseParams.desde = me.desde.getValue() || null;
                this.baseParams.desde = me.desde.getValue() || null;
                this.initBaseParams.hasta = me.hasta.getValue() || null;
                this.baseParams.hasta = me.hasta.getValue() || null;
                if (existeInv === 0) {
                    this.initBaseParams.prodareas = 1;
                    this.baseParams.prodareas = 1;
                }
            } else if (e === 'load') {
                if (this.data.length > 0) {
                    me.getVistaPrincipal().listaBotones.getItem(1).enable();
                    me.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    me.getVistaPrincipal().listaBotones.getItem(1).disable();
                    me.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        }, 'REGVENTAS1');
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function(e) {
            if (e == 'selectionchange') {
                if (this.hasSelection()) {
                    me.getVistaPrincipal().listaBotones.getItem(1).enable();
                    me.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    me.getVistaPrincipal().listaBotones.getItem(1).disable();
                    me.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        }, 'REGVENTAS2');
        LOG.util.UIManager.encadenaFn(this.getVistaPrincipal(), 'fireEvent', function(e) {
            if (e === 'beforeclose') {
                me._parent.getStorePrincipal().reload();
                me.btnDevolucion.enable();
            }
        }, 'REGVENTAS3');
        LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function(e) {
            if (e === 'celldblclick') {
                me.getVistaPrincipal().listaBotones.getItem(1).handler();
            }
        }, 'REGVENTAS4');
        return p;
    }
});

LOG.fac.puntoventa.devolucion.regDevolucion = Ext.extend(LOG.util.UITemplate, {
    _parent: undefined,
    constructor: function(config) {
        var _this = this;
        this.autoLoad = false;
        this.gridEditable = true;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/devolucionpuntoventa';
        this.urlBusquedaGridPrincipal = 'cargaProductosVendidos';
        this.formaVisualizacion = 'ventana';
        this.bbarVisible = false;
        this.modoSeleccion = 1;
        this.rowexpander = '';
        if (typeof TV_EXIST !== 'undefined' && TV_EXIST == true) {
            this.cmbDescuento = new Ext.erp.comboNomenclador({
                controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                fieldLabel: 'Descuento',
                modelo: 'NomDescuento',
                idnom: 'porciento',
                name: 'iddescuento',
                //anchor: '90%',
                editable: false,
                autoCargar: true
            });
            this.cmbDescuento.getStore().on('load', function(st, rd, opt){
                if(rd.length > 0){
                    Ext.each(rd, function(r){
                        r.data.denominacion = r.data.denominacion+' '+r.data.porciento+'%';
                    });
                    _this.cmbDescuento.view.refresh();
                }
            });
        }
        this.nfImporteTotalDevolver = new Ext.form.NumberField({
            id: 'nfImporteTotalDevolver',
            allowBlank: false,
            readOnly: true,
            width: 100,
            value: 0.00,
            allowDecimals: true,
            decimalPrecision: 2,
            allowNegative: false,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.puntoventa.devolucion.regDevolucion.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.puntoventa.devolucion.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/devolucionpuntoventa/'
        });
        this.getVistaPrincipal().width = 1000;
        this.getVistaPrincipal().height = 550;
        this.getVistaPrincipal().resizable = true;
        this.getVistaPrincipal().title = this.idioma.tlDevolucion;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: 'Producto/Servicio',
            width: 105,
            dataIndex: 'tipo',
            align: 'right',
            default: true,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'log-producto';
                    metaData.attr = 'ext:qtip="' + 'Producto' + '"';
                } else {
                    metaData.css = 'log-servicio';
                    metaData.attr = 'ext:qtip="' + 'Servicio' + '"';
                }
                return '';
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCodigoDenom,
            width: 200,
            dataIndex: 'codigodenominacionproducto',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: 'Precio',
            width: 70,
            dataIndex: 'precio',
            align: 'right',
            default: true,
            renderer: function(v) {
                if (v)
                    return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: 'Cantidad',
            align: 'right',
            width: 70,
            dataIndex: 'cantidadvendida',
            default: true,
            renderer: function(v) {
                if (v)
                    return parseFloat(v);
            }
        });
        /*this.addGridColumn({
            header: 'Recargo',
            align: 'right',
            width: 70,
            dataIndex: 'recargo',
            default: true,
            renderer: function(v) {
                if (v)
                    return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: 'Descuento',
            align: 'right',
            width: 70,
            dataIndex: 'descuento',
            default: true,
            renderer: function(v) {
                if (v)
                    return parseFloat(v).toFixed(2);
            }
        });*/
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte,
            align: 'right',
            width: 80,
            dataIndex: 'importetotal',
            default: true,
            renderer: function(v, m, rd) {
                if (v)
                    return Ext.util.Format.number(v, '0,000.00');
                    //return parseFloat(v).toFixed(2);
            }
        }));
        this.addGridColumn({
            header: this.idioma.cgCantidadDevolver,
            width: 105,
            dataIndex: 'cantidaddevolver',
            align: 'right',
            default: true,           
            editable: true, 
            editor: LOG.util.Prototipos.inputDecimal({}),
            renderer: function(v, m, r) {
                if (v)
                    return Ext.util.Format.number(v, '0,000.00');
                    //return parseFloat(v);
            }
        });

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Importe a devolver',
            align: 'right',
            width: 100,
            dataIndex: 'importedevolver',
            default: false,
            hideable: false,
            summaryType: 'importetotaldevolver',
            align: 'center',
            renderer: function(v, m, rd) {
                if (v >= 0)
                    return Ext.util.Format.number(v, '0,000.00');
                    //return parseFloat(v).toFixed(2);
            }
        }));
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
        this.addGridColumn({
            dataIndex: 'idventas'
        });
        this.addGridColumn({
            dataIndex: 'idmoneda'
        });
        this.addGridColumn({
            dataIndex: 'idventaproducto'
        });
    },
    getPanelEste: function(){
        var _this = this;
        this.nfImportePagoDevolver = new Ext.form.NumberField({
            id: 'nfImportePagoDevolver',
            allowBlank: false,
            readOnly: true,
            width: 100,
            value: 0.00,
            allowDecimals: true,
            decimalPrecision: 2,
            allowNegative: false,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.panelEste = LOG.util.UIManager.initPanel({
            region: 'east',
            title: 'Desglose de pago',
            border: true,
            width: 350,
            layout: 'border',
            listeners: {
                /*expand: function (p) {
                    p.setHeight(_this.getPanelPrincipal().getHeight() / 2);
                }*/
            },
            view: function () {
                return this;
            }
        });
        this.pnGridEste = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            view: function () {
                return this;
            }
        });

        this.columnasEste = new LOG.util.List();
        this.columnasEste.add({
            dataIndex: 'idpago'
        });
        this.columnasEste.add({
            dataIndex: 'idppedidotienda'
        });
        this.columnasEste.add({
            header: 'Modo de pago',
            dataIndex: 'denominacion',
            width: 200,
            default: true,
            renderer: function (v, md, rd) {
                if (rd.data.denominacion == 'Total:') {
                    md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                }
                return v;
            }
        });
        this.columnasEste.add(LOG.util.Prototipos.columnaImporte({
            header: 'Importe',
            align: 'right',
            dataIndex: 'importedevolver',
            default: true,
            editor: LOG.util.Prototipos.inputDecimal({}),
            width: 90,
            renderer: function (v, md, rd) {
                if (rd.data.denominacion == 'Total:') {
                    md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                }
                return v;
            }
        }));


        this.smGridEste = LOG.util.UIManager.initSelectionModel(3, true);

        var clsEste = LOG.util.UIManager.proccessColumns(this.columnasEste, this.smGridEste);
        this.cmGridEste = new Ext.grid.ColumnModel(clsEste.columns);
        this.recStGridEste = Ext.data.Record.create(clsEste.fields);

        this.storeEste = new Ext.data.Store({
            autoLoad: true,
            url: '/logistica/facturacion/puntoventa/index.php/ventasdevolucion/devolverPagos',
            reader: new Ext.data.JsonReader({
                id: "idpago",
                root: "datos"
            }, this.recStGridEste),
            listeners: {
                load: function(st){
                    let importe = 0;
                    Ext.each(st.reader.jsonData.datos, function (r) {
                        importe += parseFloat(r.importedevolver);
                    })
                }
            }
        });

        this.storeEste.on({
            'beforeload': function () {
                _this.storeEste.baseParams.iddocumento = _this._parent.getSmPrincipal().getSelected().json.iddocumento;
                _this.storeEste.initBaseParams.iddocumento = _this._parent.getSmPrincipal().getSelected().json.iddocumento;
            }
        });

        this.gpEste = LOG.util.UIManager.initEditableGridPanel(this.cmGridEste, this.storeEste, this.smGridEste, {nobbar: false});

        this.gpEste.on('afteredit', function(e) {
            if (parseFloat(e.record.data.importedevolver) > 0) {
                var mr = e.record.store.getModifiedRecords();
                var importe = 0;
                for(var i = 0; i < mr.length; i++){
                    importe = importe + parseFloat(mr[i].data.importedevolver);
                }
                _this.nfImportePagoDevolver.setValue(importe);
                if(importe <= 0){
                    b.disable();
                }
            }
        });

        this.pnGridEste.add(this.gpEste);

        this.panelEste.add(this.pnGridEste);
        return this.panelEste;
    },
    init: function() {
        LOG.fac.puntoventa.devolucion.regDevolucion.superclass.init.call(this);

        var me = this;
        this.txtDevolucion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbMotivoDevolucion,
            name: 'motivodevolucion',
            allowBlank: false,
            enableKeyEvents: true,
            maxLength: 255,
            minLength: 2,
            minLengthText: this.idioma.ttLongitudMinima,
            anchor: '100%',
            maxRe: LOG.util.Regex.cadena,
            regex: LOG.util.Regex.cadena
        });
        var s = me._parent.getSmPrincipal().getSelected();
        var descuento = (me.cmbDescuento && s.json.tiendavirtual && s.json.tiendavirtual == 1) ? true : false;
        this.frmRegistarDevolucion = LOG.util.UIManager.initForm({
            frame: true,
            region: 'north',
            labelAlign: 'top',
            height: (descuento) ? 150 : 100
        });

        if (me.cmbDescuento && s.json.tiendavirtual && s.json.tiendavirtual == 1) {
            this.frmRegistarDevolucion.add(me.cmbDescuento);
        }
        this.frmRegistarDevolucion.add(this.txtDevolucion);
        LOG.util.UIManager.encadenaFn(this.getVistaPrincipal(), 'onRender', function() {
            me.getVistaPrincipal().add(me.frmRegistarDevolucion);

            //me.summary.toggleSummaries(true);
        }, 'REGDEVOLUCION');
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);

        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            title: this.idioma.tlListadoProductos
        });


        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
            if (me._parent.getSmPrincipal().getSelected().json.tienedesglose) {
                me.getPanelPrincipal().add(me.getPanelEste());
                me.gpEste.getTopToolbar().add(['->', '<b>Importe total a devolver:</b> ',me.nfImportePagoDevolver]);
            }

        });
    },
    view: function() {
        var me = this;

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            text: this.idioma.lbBtnAceptar,
            tooltip: this.idioma.ttBtnAceptar,
            disabled: true,
            key: {
                key: 13
            },
            handler: function() {
                if (me._parent.getSmPrincipal().getSelected().json.tienedesglose) {
                    if (me.nfImportePagoDevolver.getValue() != me.nfImporteTotalDevolver.getValue()) {
                        mostrarMensaje(3, "Los importes a devolver no coinciden.");
                        return;
                    }
                }
                var p = me.getDataGeneral();
                if (p && me.frmRegistarDevolucion.getForm().isValid()) {
                    mostrarMensaje(2, 'Desea realizar la devoluci&oacute;n parcial?', function (btnPresionado) {
                        if (btnPresionado == 'ok') {
                            me.getVistaPrincipal().close();
                            Ext.getBody().mask('Realizando devoluci&oacute;n parcial...');
                            Ext.Ajax.request({
                                url: 'devolverventa',
                                params: p,
                                callback: function(o, s, r) {
                                    Ext.getBody().unmask();
                                    var responseData = LOG.util.UIManager.decodeAjaxResponse(r);
                                    if(responseData.codigo == 1){
                                        mostrarMensaje(1, "La devoluci&oacute;n parcial se realiz&oacute; satisfactoriamente.");
                                        me._parent.getStorePrincipal().reload();
                                    }else{
                                        mostrarMensaje(3, responseData.mensaje);
                                    }

                                }.createDelegate(this)
                            });
                        }
                    }.createDelegate(this));

                }
            },
            controlFn: function(b, _caller) {
                b.disable();
                var css = '';
                LOG.util.UIManager.encadenaFn(_caller.getGridPrincipal(), 'fireEvent', function(e, rd) {
                    if (e == 'afteredit') {
                        if (me.txtDevolucion.isValid() && me.txtDevolucion.isDirty() && rd.record.get('cantidadvendida') >= rd.record.get('cantidaddevolver')
                                && rd.record.get('cantidaddevolver') > 0  ) {
                            b.enable();
                            css = '';

                        }
                        else if (rd.record.get('cantidadvendida') >= rd.record.get('cantidaddevolver')
                            && rd.record.get('cantidaddevolver') > 0 && !me.txtDevolucion.isValid() && !me.txtDevolucion.isDirty()){
                            b.disable();

                            css = '';
                        } else if (rd.record.get('cantidadvendida') < rd.record.get('cantidaddevolver')){
                            b.disable();
                            css='red-row';
                        }else {
                            b.disable();
                        }

                        if(rd.record.get('cantidadvendida') >= rd.record.get('cantidaddevolver')) {
                            var precio = parseFloat(rd.record.get('precio'));
                            var cantidadDevolver = parseFloat(rd.record.get('cantidaddevolver'));
                            var recargo = 0;//parseFloat(rd.record.get('recargo'));
                            var descuento = 0;//parseFloat(rd.record.get('descuento'));
                            var importeDevolver = (cantidadDevolver * precio) + recargo - descuento;
                            rd.record.set('importedevolver', importeDevolver);
                        }else{
                            rd.record.set('importedevolver', 0);
                        }

                        Ext.fly(this.getView().getCell(rd.row,rd.column)).addClass(css);
                        rd.grid.doLayout();

                        var mr = rd.record.store.getModifiedRecords();
                        var importe = 0;
                        for(var i = 0; i < mr.length; i++){
                            importe = importe + parseFloat(mr[i].data.importedevolver);
                        }
                        me.nfImporteTotalDevolver.setValue(importe);
                        if(importe <= 0){
                            b.disable();
                        }
                        for(var i = 0; i < mr.length; i++){
                            if(parseFloat(mr[i].data.cantidaddevolver) > 0 && parseFloat(mr[i].data.importedevolver) == 0){
                                b.disable();
                            }
                        }

                    }
                    /*if (e == 'beforeedit') {
                        var datos = new Array();
                        var cant = parseInt(rd.record.get('cantidadvendida'));
                        for(var i = cant; i >= 1; i--){
                            datos.push([i, i]);
                        }
                        var cb = new Ext.form.ComboBox({
                            valueField: 'valor',
                            displayField: 'valor',
                            hiddenName: 'id',
                            allowBlank: false,
                            mode: 'local',
                            anchor: '100%',
                            store: new Ext.data.SimpleStore({
                                fields:['id','valor'],
                                data: datos
                            }),
                            blankText: 'Este campo es obligatorio',
                            readOnly: false,
                            triggerAction: 'all'
                        });
                        rd.grid.getColumnModel().getColumnAt(rd.column).setEditor(cb);

                    }*/
                }, 'ACTIVATEBTN!!!');
                LOG.util.UIManager.encadenaFn(me.txtDevolucion, 'fireEvent', function(e) {
                    if (e == 'keyup') {
                        var records = me.getStorePrincipal().getModifiedRecords();
                        var importe = 0;
                        for(var i = 0; i < records.length; i++){
                            importe = importe + parseFloat(records[i].data.importedevolver);

                        }
                        if (me.txtDevolucion.isValid() && me.txtDevolucion.isDirty() && importe > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                        for(var i = 0; i < records.length; i++){
                            if(parseFloat(records[i].data.cantidaddevolver) > 0 && parseFloat(records[i].data.importedevolver) == 0){
                                b.disable();
                            }
                        }
                    }
                }, 'ACTIVATEBTN!!!+');
            }
        });
        return LOG.fac.puntoventa.devolucion.regDevolucion.superclass.view.call(this);
    },

    render: function() {
        var me = this;
        Ext.grid.GroupSummary.Calculations['importetotaldevolver'] = function (_v, _record, field) {
            return _v + (_record.data.cantidaddevolver * _record.data.precio);// + _record.data.recargo - _record.data.descuento;
        };
        me.summary = new Ext.grid.GroupSummary({
            summaryType: 'sum',
            doAllWidths: Ext.emptyFn,
            doHidden: Ext.emptyFn/**/
        });

        this.addGridPlugin(me.summary);

        var p = LOG.fac.puntoventa.devolucion.regDevolucion.superclass.render.call(this);

        this.getSmPrincipal().moveEditorOnEnter = true;

        this.getVistaPrincipal().listaBotones.getItem(2).controlFn.createDelegate(this, [this.getVistaPrincipal().listaBotones.getItem(2), this]).call();
        var params = {
            idventas: this._parent.getSmPrincipal().getSelected().data.iddocumento
        };
        if (existeInv === 0) {
            params.prodareas = 1;
        }
        this.getGridPrincipal().getTopToolbar().add(['->', '<b>Importe total a devolver:</b> ',this.nfImporteTotalDevolver]);

        this.getStorePrincipal().load({
            params: params
        });
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e, rd) {
            if (e == 'beforeload') {
                this.initBaseParams.idventas = me._parent.getSmPrincipal().getSelected().data.iddocumento;
                this.baseParams.idventas = me._parent.getSmPrincipal().getSelected().data.iddocumento;
                if (existeInv === 0) {
                    this.initBaseParams.prodareas = 1;
                    this.baseParams.prodareas = 1;
                }
            }
        }, 'REGDEVOLUCION2');
        return p;
    },
    getDataGeneral: function() {
        var products = this.getStorePrincipal().getModifiedRecords(),
                prodDevueltos = [], efectivodevuelto = 0, desgloseDevuelto = [];
        var desglosePago = [], importepagodevuelto = 0;
        if (this._parent.getSmPrincipal().getSelected().json.tienedesglose) {
            desglosePago = this.storeEste.getModifiedRecords();
        }
        let idoperacion = (typeof TPV_OPER_DEV !== 'undefined' && (parseInt(TPV_OPER_DEV) == 1 || parseInt(TPV_OPER_DEV) == 2))
            ? this._parent.getSmPrincipal().getSelected().data.idoperaciondev
            : this._parent.getSmPrincipal().getSelected().data.idoperacion;
        this.devolucion = {
            tipodevolucion: 2,
            motivo: this.txtDevolucion.getValue(),
            idventas: this._parent.getSmPrincipal().getSelected().data.iddocumento,
            totalefectivodevuelto: this.nfImporteTotalDevolver.getValue(),
            idventacliente: this._parent.getSmPrincipal().getSelected().data.idpersona,
            idcliente: this._parent.getSmPrincipal().getSelected().data.idcliente,
            iddeposito: this._parent.getSmPrincipal().getSelected().data.idestructuracomun,
            idoperacion: idoperacion
        };
        if (this.cmbDescuento) {
            this.devolucion.descuento = this.cmbDescuento.getValue();
        }
        var prodDevueltos = {};
        var servDevueltos = {};
        var enviar = 0;
        for (var i = 0; i < products.length; i++) {
            var prod = products[i].data;
            var importetotal = parseFloat(prod.precio).toFixed(2) * parseFloat(prod.cantidaddevolver).toFixed(2);
            if (prod.cantidadvendida >= prod.cantidaddevolver && prod.cantidaddevolver > 0) {
                //efectivodevuelto = parseFloat(efectivodevuelto) + (parseFloat(prod.cantidaddevolver) * parseFloat(prod.precio))
                if (prod.idproducto != -1) {
                    prodDevueltos[prod.idproducto] = {
                        idproducto: prod.idproducto,
                        idmoneda: prod.idmoneda,
                        cantidadcomprada: parseFloat(prod.cantidadvendida).toFixed(2),
                        precioventa: parseFloat(prod.precio).toFixed(2),
                        recargo: 0,//parseFloat(prod.recargo).toFixed(2),
                        descuento: 0,//parseFloat(prod.descuento).toFixed(2),
                        importe: parseFloat(importetotal).toFixed(2),
                        cantidad: parseFloat(prod.cantidaddevolver).toFixed(2),
                        cantidaddevolver: parseFloat(prod.cantidaddevolver).toFixed(2),
                        idventaproducto: prod.idventaproducto
                    };
                } else {
                    servDevueltos[prod.idventaproducto] = {
                        idproducto: prod.idproducto,
                        idmoneda: prod.idmoneda,
                        cantidadcomprada: parseFloat(prod.cantidadvendida).toFixed(2),
                        precioventa: parseFloat(prod.precio).toFixed(2),
                        recargo: 0,//parseFloat(prod.recargo).toFixed(2),
                        descuento: 0,//parseFloat(prod.descuento).toFixed(2),
                        importe: parseFloat(importetotal).toFixed(2),
                        cantidad: parseFloat(prod.cantidaddevolver).toFixed(2),
                        cantidaddevolver: parseFloat(prod.cantidaddevolver).toFixed(2),
                        idventaproducto: prod.idventaproducto
                    };
                }
                enviar = 1;
            }
        }
        this.devolucion.productos = Ext.encode(prodDevueltos);
        this.devolucion.servicios = Ext.encode(servDevueltos);

        for (var i = 0; i < desglosePago.length; i++) {
            var desg = desglosePago[i].data;
            if (parseFloat(desg.importedevolver) > 0) {
                desgloseDevuelto.push(desg);
                enviar = 1;
            }
        }
        if (desgloseDevuelto.length > 0)
            this.devolucion.desglose = Ext.encode(desgloseDevuelto);
        //this.devolucion.totalefectdevuelto = efectivodevuelto;
        return (enviar == 1) ? this.devolucion : false;
    }
});