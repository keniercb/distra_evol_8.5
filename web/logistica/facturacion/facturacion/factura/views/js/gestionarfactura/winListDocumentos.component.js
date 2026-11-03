Ext.ns('LOG.fact');
LOG.fact.winAddFact = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        var _this = this;
        this.constrain = true;
        this.listadoDocumentos = true;
        config = Ext.apply(_this, config);
        LOG.fact.winAddFact.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        var _this = this;
        var config = {
            layout: 'border',
            modal: true,
            closeAction: 'hide',
            width: 920,
            frame: true,
            height: 470,
            items: _this.createItems()/*,
            buttons: this.buttons || this.listaBotones.getArray()*/
        };
        this.on({
            /*'render': {
                fn: this.onRenderHandler,
                scope: this
            },*/
            'beforeclose': {
                fn: this.onCloseHandler,
                scope: this
            },
            'show':function(){
                _this.onRenderHandler
            }
        });
        Ext.apply(this, config);
        LOG.fact.winAddFact.superclass.initComponent.call(this, arguments);
    },
    createItems: function() {
        var _this = this;
        var retorno = new Array();
        if((!_this.notadebito) && (_this.subsistema == LOG.util.Subsistemas.inventario || _this.subsistema == LOG.util.Subsistemas.activosfijos || _this.subsistema == LOG.util.Subsistemas.talleres)){
            this.pNorth = _this.createItem({
                region: 'north',
                height: 25,
                tbar: _this.createTools(_this.subsistema)
            });
            retorno.push(this.pNorth);
        }

        this.pMiddle = _this.createItemGrid();
        retorno.push(this.pMiddle);
        return retorno;
    },
    createItem: function(config) {
        var _this = this;
        _this.Item =
            new LOG.util.Panel({
                region: config.region,
                height: config.height,
                //frame: true,
                tbar: config.tbar
            });
        return _this.Item;
    },
    createItemGrid: function() {
        var _this = this;
        var columns = _this.crearColumns(true);
        _this.pGdList = new LOG.fact.gridGeneral({
            region: 'center',
            idioma: _this.idioma,
            url: _this.urlAction,
            frame: true,
            filter: _this.filter,
            tipoDoc: _this.tipoDoc,
            subsistema: _this.subsistema,
            concepto: this.idioma.conceptoDocumentos,
            gColumns: columns,
            model: new LOG.fact.facturacionModel({
                idioma: _this.idioma,
                parent: _this
            })
        });
        _this.pGdList.init();
        return _this.pGdList.view();
    },
    crearColumns: function(tipoDoc) {
        var _this = this;
        var arrayColumns = new LOG.util.List();
        if(tipoDoc){
            arrayColumns.add({
                header: this.idioma.cmTipoDocumento,
                dataIndex: 'tipodistribucion',
                width: 200,
                default: true,
                hidden:(tipoDoc != 4)?true:false,
                renderer: function(v) {
                    return LOG.lb.documento.TipoDistribucion[v];
                }
            });
            arrayColumns.add({
                header: this.idioma.cmNroDocumento,
                dataIndex: 'nrodoc',
                width: 90,
                align: 'left'
            });
            arrayColumns.add({
                header: (_this.tipoDoc != 8)?this.idioma.cmFecha:this.idioma.cmFechaCierre,
                dataIndex: (_this.tipoDoc != 8)?'fechacontable':'fechacierre',
                width: 90,
                align: 'left'
            });
            arrayColumns.add({
                dataIndex: 'cliente',
                hidden:true
            });
            arrayColumns.add({
                header: (_this.tipoDoc != 4)?this.idioma.cmEntregarA:this.idioma.cmEntregarPendiente,
                dataIndex: 'cant_clientes',
                width: 150,
                renderer: function(v, m, r) {
                    //  console.info(r);
                    return (v > 1) ? v + " "+_this.idioma.cellClientes : r.get('cliente');
                },
                align: 'left'
            });
            arrayColumns.add({
                header: (_this.tipoDoc != 6)?this.idioma.cmProducto:this.idioma.lbMedios,
                dataIndex: (_this.tipoDoc != 6) ? 'productos' : 'cant_movimientos',
                width: 80,
                align: 'left',
                hidden: (_this.tipoDoc == 8) ?true:false
            });
            arrayColumns.add({
                header: this.idioma.cmServicio,
                dataIndex: 'servicios',
                width: 80,
                align: 'left',
                hidden: (_this.subsistema == LOG.util.Subsistemas.inventario || _this.subsistema == LOG.util.Subsistemas.activosfijos)? true:false
                //hidden: (_this.tipoDoc && _this.tipoDoc != 5)? true:((_this.subsistema != -1)?true:false)
            });
            /*arrayColumns.add({
                header: this.idioma.lbAreasResponsabilidad,
                dataIndex: 'areasresponsabilidad',
                width: 200,
                align: 'left',
                hidden: (_this.tipoDoc != 6)? true:false
            });*/
            arrayColumns.add({
                header: _this.idioma.cmServicio,
                width: 65,
                sortable: true,
                dataIndex: 'servicios',
                align: 'center',
                hidden: (_this.tipoDoc != 7 && _this.tipoDoc != 9)? true:false
            });
            arrayColumns.add({
                header: this.idioma.cmEstado,
                dataIndex: 'estado',
                width: 80,
                renderer: function(v) {
                    return LOG.lb.documento.Estado[v];
                },
                align: 'left'
            });
        }else{
            arrayColumns.add({
                header: this.idioma.cmCliente,
                dataIndex: 'cliente',
                sortable:true,
                autoExpand: true
            });
        }
        arrayColumns.add({
            sortable: true,
            dataIndex: 'iddocumento',
            hidden:true
        });
        return arrayColumns;
    },
    createTools: function(subsistema) {
        var _this = this;
        _this.btnCalcular= LOG.util.UIManager.createBtn({
            text: 'Mostrar todas',
            tooltip: 'Muestra todos los documentos',
            iconCls: 'ver',
            disabled: true,
            handler: function () {
                var params = {
                    all: 1,
                    tipoDoc: _this.tipoDoc,
                    idoperacion: _this.idoperacion
                };
                _this.pGdList.getGridPrincipal().getStore().initBaseParams.all = 1;
                _this.pGdList.getGridPrincipal().getStore().baseParams.all = 1;
                _this.setFilter(params);
                _this.pGdList.getGridPrincipal().getStore().reload({
                    params: params
                });
            }
        });
        if (subsistema == LOG.util.Subsistemas.inventario) {
            if (!_this.notadebito) {
                _this.toolTipoDocumento = new LOG.util.ComboBox({
                    fieldLabel: 'Tipo',
                    editable: false,
                    url: 'cargarTiposDocumentos',
                    valueField: 'tipoDoc',
                    displayField: 'denominacion',
                    width: 150
                });

            _this.toolTipoDocumento.getStore().on({
                'load': function (st, rd, op) {
                    if (rd.length > 0) {
                        _this.toolTipoDocumento.setValue(rd[0].data.tipoDoc);

                        _this.tipoDoc = rd[0].data.tipoDoc;
                        var columnas = LOG.util.UIManager.proccessColumns(_this.crearColumns(_this.tipoDoc), _this.pGdList.getGridPrincipal().getSelectionModel());

                        //var columnas = new Ext.grid.ColumnModel(_this.crearColumns(_this.tipoDoc).getArray());
                        _this.pGdList.getGridPrincipal().reconfigure(_this.pGdList.getGridPrincipal().getStore(), new Ext.grid.ColumnModel(columnas.columns));
                        var params = {
                            tipoDoc: _this.tipoDoc,
                            idoperacion: _this.idoperacion
                        };
                        if (_this.tipoDoc != 4) {
                            params.iddeposito = _this.toolDeposito.getValue();
                            _this.toolDeposito.setDisabled(false);
                            _this.toolDocuments.setDisabled(true);
                        } else {
                            //_this.toolDeposito.setDisabled(true);
                            _this.toolDocuments.setDisabled(false);
                        }
                        _this.setFilter(params);
                        _this.tipoDocumentoCargo = true;
                        if (isFinite(_this.tipoDoc) && _this.depositoCargo) {
                            _this.btnCalcular.enable();
                            _this.pGdList.getGridPrincipal().getStore().reload({
                                params: params
                            });
                        }
                    }
                }
            });
            _this.toolTipoDocumento.on({
                'select': function (th, record) {
                    _this.tipoDoc = record.data.tipoDoc;
                    /*_this.setFilter({
                     tipoDoc: _this.tipoDoc,
                     iddeposito: _this.toolDeposito.getValue()
                     });*/
                    _this.pGdList.getGridPrincipal().getStore().removeAll();
                    var params = {
                        idoperacion: _this.idoperacion
                    };
                    if (_this.tipoDoc != 7 && _this.tipoDoc != 4) {
                        params.iddeposito = _this.toolDeposito.getValue();
                    }
                    params.tipoDoc = _this.tipoDoc;
                    if (_this.tipoDoc != 4) {
                        _this.toolDocuments.setDisabled(true);
                        _this.toolDocuments.setValue(_this.iddocFactura);
                        _this.toolDeposito.setDisabled(false);
                    } else {
                        _this.toolDocuments.setDisabled(false);
                        _this.toolDeposito.setDisabled(true);
                    }
                    if (_this.tipoDoc == 7) {
                        _this.toolDepositoTree.setVisible(true);
                        _this.toolDeposito.setVisible(false);
                        _this.toolDepositoTree.beforeSelect();
                    } else {
                        _this.toolDepositoTree.setVisible(false);
                        _this.toolDeposito.setVisible(true);
                    }
                    _this.setFilter(params);
                    _this.pGdList.getGridPrincipal().getStore().load({
                        params: params
                    });
                    var columnas = LOG.util.UIManager.proccessColumns(_this.crearColumns(_this.tipoDoc), _this.pGdList.getGridPrincipal().getSelectionModel());

                    //var columnas = new Ext.grid.ColumnModel(_this.crearColumns(_this.tipoDoc).getArray());
                    _this.pGdList.getGridPrincipal().reconfigure(_this.pGdList.getGridPrincipal().getStore(), new Ext.grid.ColumnModel(columnas.columns));
                }
            });

                this.lblDocumentoGenerar = new Ext.form.Label({text: _this.idioma.lbDocumentosaGenerar/*, hidden:(_this.tipoDoc != 4)?true:false*/});
                this.lblDocumentoListar = new Ext.form.Label({text: _this.idioma.lblDocumentoListar});
                this.toolDocuments = new LOG.util.ComboBox({
                    fieldLabel: _this.idioma.lbDocumentosaGenerar,
                    editable: false,
                    allowBlack: false,
                    url: 'getDocumentosaGenerar',
                    hiddenName: 'iddoc',
                    valueField: 'iddoc',
                    displayField: 'denominacion',
                    disabled: (_this.tipoDoc != 4) ? true : false
                });
                this.separator = new Ext.Toolbar.Separator();
                this.espacio = new Ext.Toolbar.Spacer();
                this.toolDocuments.store.on('load', function (st, rd) {
                    _this.toolDocuments.setValue(rd[0].data.iddoc);
                    _this.iddocFactura = rd[0].data.iddoc;
                });
            }


            if (this.tipoDoc != 7 && this.tipoDoc != 9) {
                this.toolDeposito = new LOG.util.ComboBox({
                    fieldLabel: _this.idioma.lbDepositoPuntos,
                    editable: false,
                    url: 'cargarDepositosBusqueda',
                    hiddenName: 'iddeposito',
                    valueField: 'iddeposito',
                    displayField: 'deposito',
                    resizable: true,
                    tpl: '<tpl for="."><div style="color:{color}" class="x-combo-list-item"> <div><b>Dep\xf3sito:</b> {deposito}</div><div><b>Estado:</b> {denestado}</div> </div></tpl>',
                    otherFields: [{
                        name: 'codigo'
                    }, {
                        name: 'estado'
                    }, {
                        name: 'denestado'
                    }, {
                        name: 'color'
                    }, {
                        name: 'text'
                    }]
                });
                this.toolDeposito.getStore().on({
                    'load': function (st, rd, op) {
                        if (rd.length > 0) {
                            _this.toolDeposito.setValue(rd[0].data.iddeposito);
                            var params = {
                                tipoDoc: _this.tipoDoc,
                                idoperacion: _this.idoperacion
                            };
                            //if (_this.tipoDoc != 4) {
                                params.iddeposito = _this.toolDeposito.getValue();
                            //}
                            _this.setFilter(params);
                            _this.depositoCargo = true;
                            if ((isFinite(_this.tipoDoc) && _this.tipoDocumentoCargo) || (isFinite(_this.tipoDoc) && !_this.toolTipoDocumento)) {
                                _this.btnCalcular.enable();
                                _this.pGdList.getGridPrincipal().getStore().reload({
                                    params: params
                                });
                            }
                        } else if (_this.tipoDoc == 4) {
                            _this.btnCalcular.enable();
                            var params = {
                                tipoDoc: _this.tipoDoc,
                                idoperacion: _this.idoperacion
                            };
                            _this.depositoCargo = true;
                            _this.pGdList.getGridPrincipal().getStore().reload({
                                params: params
                            });
                        }
                    }
                });
                this.toolDeposito.on({
                    'select': function (th, record) {
                        var params = {
                            tipoDoc: _this.tipoDoc,
                            idoperacion: _this.idoperacion
                        };
                        //if (_this.tipoDoc != 4) {
                            params.iddeposito = _this.toolDeposito.getValue();
                        //}
                        _this.setFilter(params);
                        if (isFinite(_this.tipoDoc) /*&& _this.tipoDoc != 4*/) {
                            _this.pGdList.getGridPrincipal().getStore().reload({
                                params: params
                            });
                        }

                    }
                });
                this.toolDepositoTree = LOG.fact.comboDeposito.combo('add', null, _this.idioma, _this);
                this.toolDepositoTree.setVisible(false);
                if (this.tipoDoc == 7) {
                    this.toolDepositoTree.setVisible(true);
                    this.toolDeposito.setVisible(false);
                    this.toolDepositoTree.beforeSelect();
                }
                this.toolDepositoTree.on({
                    'selectchange': function (th, value) {
                        /*_this.pGdList.getGridPrincipal().getStore().reload({
                         params: {
                         iddeposito: value
                         }
                         });*/
                    }
                });
            } else if(this.tipoDoc == 7){
             this.toolDeposito = LOG.fact.comboDeposito.combo('add', null, _this.idioma);
             this.toolDeposito.beforeSelect();
             this.toolDeposito.on({
             'selectchange': function(th, value) {
             _this.pGdList.getGridPrincipal().getStore().reload({
             params: {
             iddeposito: value
             }
             });
             }
             });
             }

            return ['-',_this.btnCalcular,'-', this.lblDocumentoListar, ' ', this.toolTipoDocumento, '-', _this.lblDocumentoGenerar, this.espacio, this.toolDocuments, this.separator, {html: _this.idioma.lbDepositoPuntos}, ' ', this.toolDeposito, this.toolDepositoTree];
        } else {
            if (this.tipoDoc == 8) {
                this.btnCalcular.enable();
                return ['-', this.btnCalcular];
            }
            this.opActivo = new LOG.util.ComboBox({
                fieldLabel: _this.idioma.lblDocumentoListar,
                editable: false,
                allowBlack: false,
                url: 'getOperacionesActivo',
                hiddenName: 'idoperacion',
                valueField: 'idoperacion',
                displayField: 'denominacion'
            });

            this.opActivo.getStore().on({
                'load': function (st, rd, op) {
                    if (rd.length > 0) {
                        _this.opActivo.setValue(rd[0].data.idoperacion);
                        _this.tipoOper = (rd[0].json.codigo == 'OPER_ALQUILER') ? 1 : 2;//1 operacion de alquiler 2 ventas
                        var params = {
                            tipoDoc: _this.tipoDoc,
                            idoperacion: _this.opActivo.getValue()
                        };
                        _this.setFilter(params);
                        _this.pGdList.getGridPrincipal().getStore().reload({
                            params: params
                        });
                    }
                }
            });
            this.opActivo.on({
                'select': function (th, record) {
                    _this.tipoOper = (record.json.codigo == 'OPER_ALQUILER') ? 1 : 2;
                    var params = {
                        tipoDoc: _this.tipoDoc,
                        idoperacion: _this.opActivo.getValue()
                    };
                    _this.setFilter(params);
                    if (isFinite(_this.tipoDoc)) {
                        _this.pGdList.getGridPrincipal().getStore().reload({
                            params: params
                        });
                    }

                }
            });


            return ['-', _this.idioma.lblDocumentoListar, ' ', this.opActivo];
        }

    },
    habilitarIsValidDeposito: function(){
        var _this = this;
        _this.listaBotones.arrayData[2].enable();
    },
    habilitarIsNotValidDeposito: function(){
        var _this = this;
        _this.listaBotones.arrayData[2].disable();
    },
    setFilter: function(object){
        var _this = this;
        if(object.iddeposito){
            _this.filter.iddeposito = object.iddeposito;
        }else{
            _this.filter.iddeposito = null;
        }
        if (object.idoperacion) {
            _this.filter.idoperacion = object.idoperacion;
        } else {
            _this.filter.idoperacion = null;
        }
        if(object.tipoDoc){
            _this.filter.tipoDoc = object.tipoDoc;
        }
    },
    onCancelarHandler: function() {
        this.scope.destroy();
    },
    onAceptarHandler: function() {
        this.scope.addDoc();
    },
    onRenderHandler: function(){
        var _this = this;
        if (_this.notadebito) {
            _this.pGdList.getGridPrincipal().getStore().on('beforeload', function(st){
                st.initBaseParams.idoperacion = _this.idoperacion;
                st.baseParams.idoperacion = _this.idoperacion;
            });
        }
        if(_this.subsistema != LOG.util.Subsistemas.inventario && _this.subsistema != LOG.util.Subsistemas.activosfijos){
            _this.tipoDoc = (_this.subsistema == -1) ? ((_this.tipoDoc) ? _this.tipoDoc : 5) : _this.tipoDoc;
            var params = {
                tipoDoc: _this.tipoDoc
            };
            if(_this.subsistema == -1){
                params.idsubsistema = -1;
            }
            _this.pGdList.getGridPrincipal().getStore().on('beforeload', function(st){
                st.initBaseParams.tipoDoc = _this.tipoDoc;
                st.baseParams.tipoDoc = _this.tipoDoc;

                if (_this.subsistema == -1) {
                    st.initBaseParams.idsubsistema = -1;
                    st.baseParams.idsubsistema = -1;
                }
            });
            /*_this.pGdList.getGridPrincipal().getStore().load({
                params:params
            });*/
        }
        _this.listaBotones.each(function(b) {
            LOG.util.UIManager.applyKey(b, _this);
        }, _this);
    },
    onCloseHandler: function(p) {
        p.destroy();
    },
    addDoc: function() {
        var sm = this.pGdList.getGridPrincipal().getSelectionModel();
        var _this = this;
        if ((sm.hasSelection())) {
            if (!_this.notadebito && _this.isValid(this.toolDocuments)) {
                _this.showDiffCase();
            } else if (_this.notadebito) {
                _this.showDiffCase();
            } else {
                mostrarMensaje(1, _this.idioma.lbMsgVacios);
            }
        } else {
            mostrarMensaje(1, _this.idioma.lbMsgNoExisteElementosSelecionados);
        }
    },
    estaEnArray: function(elemento, array){
        for(var i = 0; i < array.length; i++){
            if(array[i] == elemento){
                return true;
            }
        }
        return false;
    },
    estaId: function(id, array){
        for(var i = 0; i < array.length; i++){
            if(array[i] == id){
                return true;
            }
        }
        return false;
    },
    estaCliente: function(idcliente, arrayClientes, deposito){
        if(deposito){
            for(var i = 0; i < arrayClientes.length; i++){
                if(arrayClientes[i].idcliente == idcliente && arrayClientes[i].deposito == deposito){
                    return i;
                }
            }
        }else{
            var clientes = new Array();
            for(var i = 0; i < arrayClientes.length; i++){
                if(arrayClientes[i].idcliente == idcliente){
                    clientes.push(arrayClientes[i]);
                }
            }
            return clientes;
        }
        return -1;
    },
    showDiffCase: function() {
        var _this = this;
        var sm = this.pGdList.getGridPrincipal().getSelectionModel();
        var parametros = {};
        parametros.title = this.idioma.tAdicionarFactura;
        parametros.accion = 'add';
        parametros.tipoDoc = _this.tipoDoc;
        parametros.deshabilitarBotonesGrids = _this.deshabilitarBotonesGrids;
        parametros.configFacturacion = _this.configFact;
        parametros.stDocumentos = _this;
        parametros.notadebito = _this.notadebito || null;
        this.records = sm.getSelections();
        var iddocumentos = new Array();
        var clientes = new Array();
        var idclientes = new Array();
        var documentos = new Array();
        Ext.each(this.records, function(sel){
            iddocumentos.push(sel.data.iddocumento);//este arreglo es para verificar que no tenga documentos generados
            if(_this.tipoDoc != 4){
                sel.json.arrayClientes = [sel.json.idcliente];
                if(_this.tipoDoc == 7){
                    sel.json.depositos[sel.json.idcliente] = [_this.toolDepositoTree.getValue()];
                }else{
                    if(sel.json.iddeposito){
                        if(!sel.json.depositos){
                            sel.json.depositos = {};
                        }
                        sel.json.depositos[sel.json.idcliente] = (sel.json.iddeposito) ? [sel.json.iddeposito] : null;
                    }
                    else{
                        sel.json.depositos = {};
                        sel.json.depositos[sel.json.idcliente] = [null];
                    }
                }
				
            }else{
                if (_this.configFact.completardistribucion != 1) {
                    sel.json.depositos[sel.json.idcliente] = [_this.toolDeposito.getValue()];
                }
			}
            Ext.each(sel.json.arrayClientes, function(idcliente){
                if(_this.tipoDoc == 4 || _this.subsistema == LOG.util.Subsistemas.activosfijos){
                    if (!_this.estaId(idcliente, idclientes)) {
                        idclientes.push(idcliente);
                    }
                }else{
                    idclientes.push(idcliente);
                }
                Ext.each(sel.json.depositos[idcliente], function(deposito){
                    if(deposito == null)
                        deposito = -1;
                    var posCliente = (_this.tipoDoc == 4 || _this.subsistema == LOG.util.Subsistemas.activosfijos)
                                     ? _this.estaCliente(idcliente, clientes, deposito) : -1;
					//posCliente = -1;
                    if(posCliente == -1){
                        var cliente = {};
                        cliente.idcliente = idcliente;
                        cliente.documentos = [];
                        cliente.documentos.push(sel.data.iddocumento);
                        cliente.tipoDocumento = [];
                        //cliente.depositoAreas = [];
                        var tipoDocumento = (_this.tipoDoc == 4)?sel.data.tipodistribucion:
                                            (((_this.tipoDoc == 5 || _this.tipoDoc == 7) && _this.subsistema != -1)?_this.toolTipoDocumento.getRawValue():sel.json.tipodocumento);
                        cliente.tipoDocumento.push(tipoDocumento);
                        cliente.reserva = (sel.json.tipodistribucion && sel.json.tipodistribucion == 4) ? 1 : 0;
                        cliente.rotacion = (sel.json.rotacion) ? 1 : 0;
                        cliente.nroDocumento = [];
                        /*if(sel.json.depositoAreas){
                            Ext.each(sel.json.depositoAreas, function(area){
                                cliente.depositoAreas.push(area.idarea);
                            });
                        }*/
                        cliente.nroDocumento.push(sel.data.nrodoc);
                        cliente.fechaDocumento = [];
                        cliente.fechaDocumento.push(sel.data.fechacontable);
                        cliente.cliente = sel.json.cliente;
                        cliente.codigo = sel.json.codigo;
                        if(sel.json.idcuentabancaria){
                            cliente.idcuentabancaria = sel.json.idcuentabancaria;
                            cliente.idcuentabancliente = sel.json.idcuentabancliente;
                            cliente.idmoneda = sel.json.idmoneda;
                        }
                        cliente.deposito = deposito;
                        clientes.push(cliente);
                    }else{
                        clientes[posCliente].documentos.push(sel.data.iddocumento);
                        if(_this.tipoDoc == 4)
                            clientes[posCliente].tipoDocumento.push(sel.data.tipodistribucion);
                        else if(_this.tipoDoc == 5 || _this.tipoDoc == 6 || _this.tipoDoc == 7 || _this.tipoDoc == 8)
                            clientes[posCliente].tipoDocumento.push(sel.json.tipodocumento);
                        clientes[posCliente].nroDocumento.push(sel.data.nrodoc);
                        clientes[posCliente].fechaDocumento.push(sel.data.fechacontable);
                    }
                });
            });
        });
		
        if(idclientes.length == 1){
			console.log(clientes)
            if(clientes.length == 1){
                parametros.abrir = 1;
                parametros.values = {
                    case: 2,
                    cliente: clientes,
                    configFact: _this.configFact,
                    iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                };
                if(_this.tipoOper == undefined || (_this.tipoOper && _this.tipoOper == 2))
                    _this.pGdList.model.enviarDatos(_this.winFact.createDatosComunes(parametros));
                else{
                    LOG.inv.maestroproductos.Loader.init(function () {
                        var v = new LOG.lb.maestroproductos.UIProductos({
                            tipo: 2,
                            constrain: true,
                            usarAplicar: false,
                            modoSeleccion: 1,
                            //parametros: parametros,
                            doAction: function (r) {
                                parametros.alquiler = 1;
                                var servicios = new Array();
                                Ext.each(r, function(record){
                                     servicios.push({
                                         idindicador: record.json.idindicador,
                                         cantidad: 1,
                                         tipo: 2
                                     });
                                });
                                parametros.servicios = servicios;
                                _this.pGdList.model.enviarDatos(_this.winFact.createDatosComunes(parametros));
                            }
                        });
                        v.show();
                    });
                }

            }else{
                mostrarMensaje(2, _this.idioma.lbQuestVariasFacturas, function(btn, text) {
                    parametros.datosComunes = true;
                    if (btn === 'ok') {
                        parametros.height = 510;
                        parametros.width = 750;
                        parametros.parent = _this;
                        //parametros.iddeposito = _this.toolDeposito.getValue();

                        _this.winFact.createWinFactura(parametros, {
                            case: 2,
                            cliente: clientes,
                            configFact: _this.configFact,
                            iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                        });
                    }else{
                        parametros.values = {
                            case: 2,
                            cliente: clientes,
                            configFact: _this.configFact,
                            iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                        };
                        _this.pGdList.model.enviarDatos(_this.winFact.createDatosComunes(parametros));
                    }
                });
            }
        }else if(idclientes.length > 1){
            if(_this.tipoDoc == 4){
                var filter = {
                    arrDocumentos: Ext.encode(iddocumentos),
                    idclientes: Ext.encode(idclientes)
                };
                this.pGdListClientes = new LOG.fact.gridGeneral({
                    region: 'center',
                    idioma: this.idioma,
                    url: 'getClientesByDocumentos',
                    frame: true,
                    filter: filter,
                    //tipoDoc:
                    idGridPrincipal: 'idcliente',
                    gColumns: this.crearColumns(),
                    concepto: this.idioma.conceptoCliente,
                    model: new LOG.fact.facturacionModel({
                        idioma: _this.idioma,
                        parent: _this
                    })
                });
                this.pGdListClientes.init();
                this.panelListClientes = this.pGdListClientes.view();
                this.wListClientes = new LOG.util.Window({
                    layout: 'border',
                    width: 780,
                    frame: true,
                    height: 470,
                    title: this.idioma.lbCliente,
                    usarAplicar: false,
                    items: [this.panelListClientes],
                    aceptarFn: function() {
                        _this.recordSelection = _this.pGdListClientes.smGridPrincipal.getSelections();
						console.log(_this.recordSelection);
                        var clientesSelecionados = new Array();
                        Ext.each(_this.recordSelection, function(record, index) {
                            clientesSelecionados = clientesSelecionados.concat(_this.estaCliente(parseInt(record.json.idcliente), clientes));
                        });
                        if(clientesSelecionados.length == 1){
                            parametros.abrir = 1;
                            parametros.values = {
                                case: 2,
                                cliente: clientesSelecionados,
                                configFact: _this.configFact,
                                iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                            };
                            _this.pGdListClientes.model.enviarDatos(_this.winFact.createDatosComunes(parametros));
                        }else{
                            mostrarMensaje(2, _this.idioma.lbQuestVariasFacturas, function(btn, text) {
                                parametros.datosComunes = true;
                                if (btn === 'ok') {
                                    parametros.height = 510;
                                    parametros.width = 750;
                                    parametros.parent = _this;
                                    _this.winFact.createWinFactura(parametros, {
                                        case: 2,
                                        cliente: clientesSelecionados,
                                        configFact: _this.configFact,
                                        iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                                    });
                                }else{
                                    parametros.values = {
                                        case: 2,
                                        cliente: clientesSelecionados,
                                        configFact: _this.configFact,
                                        iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                                    };
                                    _this.pGdListClientes.model.enviarDatos(_this.winFact.createDatosComunes(parametros));
                                }
                            });

                        }
                        //}
                    }
                });
                this.wListClientes.listaBotones.arrayData[2].disable();
                this.pGdListClientes.getGridPrincipal().on('rowclick', function(g) {
                    if(g.getSelectionModel().getSelections().length > 0){
                        _this.wListClientes.listaBotones.arrayData[2].enable();
                    }else{
                        _this.wListClientes.listaBotones.arrayData[2].disable();
                    }
                });
                this.pGdListClientes.getGridPrincipal().getSelectionModel().on('selectionchange', function(sm) {
                    if(sm.getSelections().length > 0){
                        _this.wListClientes.listaBotones.arrayData[2].enable();
                    }else{
                        _this.wListClientes.listaBotones.arrayData[2].disable();
                    }
                });
                this.wListClientes.show();
                this.wListClientes.doLayout();
                this.pGdListClientes.getGridPrincipal().getStore().load();
            }else{


                if (_this.tipoOper == undefined || (_this.tipoOper && _this.tipoOper == 2)) {
                    mostrarMensaje(2, _this.idioma.lbQuestVariasFacturas, function (btn, text) {
                        parametros.datosComunes = true;
                        var clientesSelecionados = new Array();
                        Ext.each(idclientes, function (id, index) {
                            clientesSelecionados = (_this.tipoDoc == 5) ? clientes : clientesSelecionados.concat(_this.estaCliente(parseInt(id), clientes));
                        });
                        if (btn === 'ok') {
                            parametros.height = 510;
                            parametros.width = 750;
                            parametros.parent = _this;
                            _this.winFact.createWinFactura(parametros, {
                                case: 2,
                                cliente: clientesSelecionados,
                                configFact: _this.configFact,
                                iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                            });
                        } else {
                            parametros.values = {
                                case: 2,
                                cliente: clientesSelecionados,
                                configFact: _this.configFact,
                                iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                            };
                            _this.pGdList.model.enviarDatos(_this.winFact.createDatosComunes(parametros));
                        }
                    });
                } else {
                    LOG.inv.maestroproductos.Loader.init(function () {
                        var v = new LOG.lb.maestroproductos.UIProductos({
                            tipo: 2,
                            constrain: true,
                            usarAplicar: false,
                            modoSeleccion: 1,
                            doAction: function (r) {
                                mostrarMensaje(2, _this.idioma.lbQuestVariasFacturas, function (btn, text) {
                                    parametros.datosComunes = true;
                                    var clientesSelecionados = new Array();
                                    Ext.each(idclientes, function (id, index) {
                                        clientesSelecionados = (_this.tipoDoc == 5) ? clientes : clientesSelecionados.concat(_this.estaCliente(parseInt(id), clientes));
                                    });
                                    if (btn === 'ok') {
                                        parametros.height = 510;
                                        parametros.width = 750;
                                        parametros.alquiler = 1;
                                        parametros.parent = _this;
                                        var servicios = new Array();
                                        Ext.each(r, function (record) {
                                            servicios.push({
                                                idindicador: record.json.idindicador,
                                                cantidad: 1,
                                                tipo: 2
                                            });
                                        });
                                        parametros.servicios = servicios;
                                        _this.winFact.createWinFactura(parametros, {
                                            case: 2,
                                            cliente: clientesSelecionados,
                                            configFact: _this.configFact,
                                            iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                                        });
                                    } else {
                                        parametros.values = {
                                            case: 2,
                                            cliente: clientesSelecionados,
                                            configFact: _this.configFact,
                                            iddoc: (_this.toolDocuments) ? _this.toolDocuments.getValue() : null
                                        };
                                        parametros.alquiler = 1;
                                        var servicios = new Array();
                                        Ext.each(r, function (record) {
                                            servicios.push({
                                                idindicador: record.json.idindicador,
                                                cantidad: 1,
                                                tipo: 2
                                            });
                                        });
                                        parametros.servicios = servicios;
                                        _this.pGdList.model.enviarDatos(_this.winFact.createDatosComunes(parametros));
                                    }
                                });
                            }
                        });
                        v.show();
                    });
                }
            }
        }
    },
    getDepositosCliente: function(depositosCliente, depositosSeleccionados){
        var depositos = depositosCliente;
        for(var i = 0; i < depositosSeleccionados.length; i++){
            var esta = false;
            for(var j = 0; j < depositosCliente.length; j++){
                if(depositosSeleccionados[i] == depositosCliente[j]){
                    esta = true;
                    break;
                }
            }
            if(!esta){
               depositos.push(depositosSeleccionados[i]);
            }
        }
        return depositos;
    },
    isValid: function(field) {
        //  console.info(field);
        if (field != undefined) {
            if (field.hiddenField.value != "") {
                return true;
            } else {
                field.markInvalid();
                return false;
            }
        } else {
            return true;
        }
    },
    getDocumentosId: function(records) {
        var _this = this;
        var arrayId = new Array();
        Ext.each(records, function(record, index) {
            arrayId.push(record.get('iddocumento'));
        }, this);
        return arrayId;
    },
    mySelfClientes: function(recordSelection, key) {
        var _this = this;
        var records = recordSelection;
        var arrElementos = new Array();
        var arrayId = new Array();
        var flags = true;
        Ext.each(records, function(record, index) {
            if (!key)
                arrayId = record.get('arrayClientes');
            else
                arrayId.push(record.get('idcliente'));
            Ext.each(arrayId, function(elem, index) {
                if (!_this.existVeryElement(arrElementos, elem)) {
                    arrElementos.push(elem);
                } else {
                    flags = false;
                }
            });
        }, this);
        return flags;
    },
    existVeryElement: function(arrElementos, elem) {
        var _this = this;
        var flags = false;
        Ext.each(arrElementos, function(record, index) {
            if (parseInt(record) != parseInt(elem)) {
                flags = true;
            }
        }, this);
        return flags;
    }
});