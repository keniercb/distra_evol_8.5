Ext.ns('Ext.erp');

Ext.erp.categoriaprecio = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        config.codigo = false;
        var _this = this;
        Ext.apply(this, config);
        this.bussinesModel = 'NomCategoriaprecioModel';
        this.campoIdNomenclador = 'idcategoriaprecio';
        this.storeFields = [{
            name: 'concepto'
        }, {
            name: 'porciento'
        }, {
            name: 'conformaprecio'
        }, {
            name: 'aplicartodos'
        }, {
            name: 'valor'
        }, {
            name: 'idmoneda'
        }, {
            name: 'idnommonedatotal'
        },{
            name: 'idtipo'
        },{
            name: 'base'
        },{
            name: 'codigo'
        },{
            name: 'exentoexterior'
        }];

        this.columnsFields = [{
            dataIndex: 'concepto',
            header: _this.idioma.lbConcepto,
            width: 95,
            renderer: function(value, metaData) {
                if (value == '+') {
                    return 'Suma';
                } else if (value == '-') {
					return 'Resta';
				} else {
                    return 'Ninguna';
                }
            }
        },{
            dataIndex: 'idmoneda',
            header: 'Moneda',
            width: 65,
            renderer: function(value, metaData) {
                var codiso = '';
                Ext.each(monedas, function(m) {
                    if (value == m.idmoneda) {
                        codiso = m.codigoiso;
                    }
                });
                return codiso;
                /*if (value == idmoneda) {
                    return moneda;
                } else if (value == idmonedaalternativa){
                    return monedaalternativa;
                }*/
            }
        },{
            dataIndex: 'idnommonedatotal',
            header: 'Totalizar en moneda',
            width: 65,
            hidden: (idmonedaalternativa) ? false : true,
            renderer: function(value, metaData) {
                if (value == idmoneda) {
                    return moneda;
                } else if (value == idmonedaalternativa){
                    return monedaalternativa;
                }
            }
        },{
            dataIndex: 'idtipo',
            header: 'Tipo documento',
            width: 100,
            renderer: function (value, metaData) {
                if (value == 1) {
                    return 'Recepci\xf3n';
                } else if (value == 2) {
                    return 'Facturaci\xf3n';
                } else {
                    return '';
                }
            }
        },{
            dataIndex: 'base',
            header: 'Base',
            width: 75,
            renderer: function (value, metaData) {
                if (value == 1) {
                    return 'Productos';
                } else if (value == 2) {
                    return 'Servicios';
                } else {
                    return '';
                }
            }
        }, {
            dataIndex: 'porciento',
            header: _this.idioma.lbPorciento,
            width: 75,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        }, {
            dataIndex: 'conformaprecio',
            header: _this.idioma.lbConforma,
            width: 95,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        }, {
            dataIndex: 'aplicartodos',
            header: _this.idioma.lbAplicarTodos,
            width: 95,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        },{
            dataIndex: 'exentoexterior',
            header: 'Exento pago exterior',
            width: 95,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        },{
            dataIndex: 'codigo',
            header: 'C\xf3digo',
            width: 75
        }];
        this.chbxProciento = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbPorciento,
            name: 'porciento',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    Ext.getCmp('idhdporciento').setValue(checked == true ? 1 : 0);
                }
            }
        });
        this.chbxConforma = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbConforma,
            name: 'conformaprecio',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    Ext.getCmp('idhdconformaprecio').setValue(checked == true ? 1 : 0);
                }
            }
        });
        this.chbxAplicarTodos = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbAplicarTodos,
            name: 'aplicartodos',
            hideLabel: true,
            listeners: {
                'check': function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    Ext.getCmp('idhdaplicartodos').setValue(checked == true ? 1 : 0);
                    if (checked == true) {
                        _this.txtValor.enable();
                    } else {
                        _this.txtValor.disable();
                    }
                }
            }
        });
        this.chbxExentoext = new Ext.form.Checkbox({
            boxLabel: 'Exento pago exterior',
            name: 'exentoexterior',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    Ext.getCmp('idhdexentoexterior').setValue(checked == true ? 1 : 0);
                }
            }
        });



        Ext.erp.categoriaprecio.superclass.constructor.call(this, config);

        this.btnAdicionarCategoria = new Ext.Button({
            text: 'Adicionar',
            //tooltip: _this.idioma.lbTtBtnAdicionarModelo,
            iconCls: 'adicionar',
            handler: function () {
                console.log(_this.selectionModeNomenclador.getSelected())
                _this.windowCategorias = new Ext.erp.subcategorias({
                    idioma: _this.idioma,
                    usarAplicar: false,
                    title: 'Categor\xedas de precio',
                    idcategoriaprecio: (_this.selectionModeNomenclador.getSelected()) ? _this.selectionModeNomenclador.getSelected().data.idcategoriaprecio : -1,
                    _parent: _this
                });

                _this.windowCategorias.show();

                _this.windowCategorias.aceptarFn = function() {
                    let seleccion = _this.windowCategorias.smGrid.getSelections();
                    let record = [];
                    Ext.each(seleccion, function(obj) {
                        record.push(obj.data.idcategoriaprecio)
                    })
                    Ext.MessageBox.wait('Guardando datos', 'Espere' || '...');
                    Ext.Ajax.request({
                        url: '/logistica/facturacion/facturacion/comun_fact/index.php/subcategorias/adicionarrelacion',
                        method: 'POST',
                        params: {
                            ids: Ext.encode(record),
                            idpadre: _this.selectionModeNomenclador.getSelected().data.idcategoriaprecio
                        },
                        callback: function(o, s, r) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            Ext.MessageBox.hide();
                            if (resp.success) {
                                mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                                _this.stSubCategorias.load();
                            } else {
                                mostrarMensaje(1, 'Ha ocurrido un error al guardar los datos');
                            }
                        }
                    });
                };
            }
        });

        this.btnEliminarCategoria = new Ext.Button({
            text: 'Eliminar',
            //tooltip: _this.idioma.lbTtBtnEliminarModelo,
            iconCls: 'eliminar',
            handler: function () {
                mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar la(s) categor\xeda(s) seleccionada(s)\x3f', function(btn, text) {
                    if (btn === 'ok') {
                        var seleccion = _this.smSubCategorias.getSelections();
                        var idDel = [];
                        Ext.each(seleccion, function(record) {
                            console.log(record)
                            idDel.push(record.data.idsubcategoria)
                        })
                        Ext.MessageBox.wait('Eliminando...', _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: '/logistica/facturacion/facturacion/comun_fact/index.php/subcategorias/eliminarSubcategorias',
                            method: 'post',
                            params: {
                                datos: Ext.encode(idDel)
                            },
                            success: function(rp) {
                                let respuesta = Ext.decode(rp.responseText);
                                _this.stSubCategorias.load();
                                Ext.MessageBox.hide();
                            }
                        });
                    }
                });
            }
        });

        this.panelBotonesSubCategoria = new Ext.Panel({
            tbar: [this.btnAdicionarCategoria, this.btnEliminarCategoria],
            border: false,
            region: 'north'
        });
        this.stSubCategorias = new Ext.data.Store({
            url: '/logistica/facturacion/facturacion/comun_fact/index.php/subcategorias/getCategorias',
            /*baseParams: {
                modelos: true,
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel,
                idnaturaleza: (_this.naturalezacombo && _this.naturalezacombo.isXType('combo')) ?
                    _this.naturalezacombo.getValue() : false

            },*/
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idindicador',
                fields: [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'idsubcategoria'
                    }
                ]
            })
        });

        this.stSubCategorias.on({
            'beforeload': function(st) {
                st.baseParams.idpadre = (_this.selectionModeNomenclador.getSelected()) ? _this.selectionModeNomenclador.getSelected().data.idcategoriaprecio : -1;
                st.initBaseParams.idpadre = (_this.selectionModeNomenclador.getSelected()) ? _this.selectionModeNomenclador.getSelected().data.idcategoriaprecio : -1;
            },
            'load': function(st, rec) {
                /*if (rec.length > 0) {
                    _this.smModelos.selectFirstRow();
                } else {
                    if (_this.buscarModelos) {
                        mostrarMensaje(1, _this.idioma.lbMsgNoModelos);
                        _this.buscarModelos = false;
                    } else
                        mostrarMensaje(1, _this.idioma.lbMsgNoModelosAsociados);
                }*/
            }
        });

        this.selectionModeNomenclador.on({
            'rowselect': function() {
                //_this.stProducto.removeAll();
                _this.panelSubCategorias.expand();
            }
        });

        this.smSubCategorias = new Ext.grid.RowSelectionModel();

        this.cmSubCategorias = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                header: 'No.',
                width: 30
            }), {
                header: 'Denominaci\xf3n',
                width: 55,
                dataIndex: 'denominacion',
                id: 'expndirproductos'
            }
        ]);

        this.gridPanelSubCategorias = new Ext.grid.GridPanel({
            region: 'center',
            border: false,
            /*tbar: ['', new Ext.menu.TextItem({
                text: _this.idioma.lbDenominacion + ':'
            }), '', this.tfDenomModelo, '', _this.btnBuscarModelos, '', this.btnLimpiarModelos],*/
            autoExpandColumn: 'expndirproductos',
            cm: _this.cmSubCategorias,
            store: _this.stSubCategorias,
            sm: _this.smSubCategorias,
            loadMask: {
                store: _this.stSubCategorias
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stSubCategorias,
                displayInfo: true,
                pageSize: 15
            })
        });

        this.panelSubCategorias = new Ext.Panel({
            region: 'south',
            collapsible: true,
            collapsed: true,
            split: true,
            collapseMode: 'mini',
            height: 240,
            layout: 'border',
            items: [this.panelBotonesSubCategoria, this.gridPanelSubCategorias]
        });

        this.add(_this.panelSubCategorias);

        this.selectionModeNomenclador.on({
            'rowselect': function() {
                /*_this.activarBotones();*/
                _this.stSubCategorias.load({params: {start: 0, limit: 15}});
                _this.panelSubCategorias.expand();
            },
            'rowdeselect': function() {
                //_this.activarBotones();
            }
        });
        _this.stSubCategorias.load({params: {start: 0, limit: 15}});
    },
    initFormFields: function(){
        var _this = this;
        this.txtValor = LOG.util.Prototipos.inputDecimal({
            disabled: true,
            name: 'valor',
            allowBlank: false,
            anchor: '98%',
            hideLabel: true
        });
        this.storecmbConcepto = new Ext.data.SimpleStore({
            fields: ['no', 'operacion'],
            data: [['N', 'Ninguna'], ['+', 'Suma'], ['-', 'Resta']]
        });
        this.storecmbMoneda = new Ext.data.SimpleStore({
            fields: ['idnomnoneda', 'codigoiso'],
            data: [[idmoneda, moneda], [idmonedaalternativa, monedaalternativa]]
        });
        this.cmbMonedas = new LOG.util.ComboBox({
            fieldLabel: 'Moneda',
            tpl: '<tpl for="."><div ext:qtip="{nombremoneda}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            hiddenName: 'idmoneda',
            anchor: '98%',
            url: '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/cargarTipoMonedas'
        });
        /*this.cmbMonedas = new Ext.form.ComboBox({
            store: this.storecmbMoneda,
            fieldLabel: 'Moneda',
            displayField: 'codigoiso',
            id: 'idnomnoneda',
            valueField: 'idnomnoneda',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'idmoneda'
        });*/
        this.storecmbMonedaTotal = new Ext.data.SimpleStore({
            fields: ['idmonedatotal', 'codigoiso'],
            data: [[idmoneda, moneda], [idmonedaalternativa, monedaalternativa]]
        });
        this.storecmbRecepcion = new Ext.data.SimpleStore({
            fields: ['tipo', 'documento'],
            data: [[0, 'S/D'], [1, 'Recepci\xf3n'], [2, 'Facturaci\xf3n']]
        });
        this.cmbMonedasTotal = new Ext.form.ComboBox({
            store: this.storecmbMonedaTotal,
            fieldLabel: 'Totalizar en moneda',
            displayField: 'codigoiso',
            id: 'idmonedatotal',
            valueField: 'idmonedatotal',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'idnommonedatotal'
        });

        this.cmbRecepcion = new Ext.form.ComboBox({
            store: this.storecmbRecepcion,
            fieldLabel: 'Tipo documento',
            displayField: 'documento',
            id: 'tipo',
            valueField: 'tipo',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'idtipo'
        });
        this.storecmbTipo = new Ext.data.SimpleStore({
            fields: ['idbase', 'denom'],
            data: [[0, 'S/D'], [1, 'Productos'], [2, 'Servicios']]
        });
        this.cmbTipo= new Ext.form.ComboBox({
            store: this.storecmbTipo,
            fieldLabel: 'Base',
            displayField: 'denom',
            id: 'idbase',
            valueField: 'idbase',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'base'
        });
        this.cmbConcepto = new Ext.form.ComboBox({
            store: this.storecmbConcepto,
            fieldLabel: _this.idioma.lbConcepto,
            displayField: 'operacion',
            id: 'cmbconcepto',
            valueField: 'no',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: _this.idioma.tiplbConcepto,
            selectOnFocus: true,
            hiddenName: 'concepto'
        });
        this.cmbCodigo= new LOG.util.ComboBox({
            url: 'cargarCodigo',
            fieldLabel: 'C\xf3digo',
            displayField: 'codigo',
            id: 'idCodigo',
            valueField: 'codigo',
            typeAhead: true,
            autoLoad: true,
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'codigo'
        });
        this.cmbCodigo.getStore().on('beforeload', function(st,opts){
            st.baseParams.bussines = 'NomCategoriaprecioModel';
        });
        this.formFields = [{
            layout: 'column',
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: this.cmbConcepto
            }, {
                columnWidth: .5,
                layout: 'form',
                items: this.cmbMonedas
            }]
        },{
            layout: 'column',
            items: [ {
                columnWidth: 1,
                layout: 'form',
                hidden: (idmonedaalternativa) ? false : true,
                items: this.cmbMonedasTotal
            }]
        },{
            layout: 'column',
            items: [ {
                columnWidth: 0.5,
                layout: 'form',
                items: this.cmbRecepcion
            },{
                columnWidth: 0.5,
                layout: 'form',
                items: this.cmbTipo
            }]
        }, {
            layout: 'column',
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [
                    this.chbxProciento,
                    this.chbxConforma,
                    this.chbxExentoext
                ]
            }, {
                columnWidth: .5,
                layout: 'form',
                items: [
                    this.chbxAplicarTodos,
                    this.txtValor,
                    this.cmbCodigo
                ]
            }]
        },{
            xtype: 'hidden',
            name: 'conformaprecio',
            id: 'idhdconformaprecio',
            value: 0
        },{
            xtype: 'hidden',
            name: 'aplicartodos',
            id: 'idhdaplicartodos',
            value: 0
        },{
            xtype: 'hidden',
            name: 'porciento',
            id: 'idhdporciento',
            value: 0
        },{
            xtype: 'hidden',
            name: 'exentoexterior',
            id: 'idhdexentoexterior',
            value: 0
        }];
    }
});


Ext.erp.subcategorias = Ext.extend(LOG.util.Window, {
    _parent: undefined,
    constructor: function(config) {
        this.idioma = config.idioma;
        this.constrain = true;
        this.idcategoriaprecio = config.idcategoriaprecio || null;
        Ext.erp.subcategorias.superclass.constructor.call(this, config);

        this.on('show', function(w) {
            /*this.store.load({
                start: 0,
                limit: 30,
                idcategoriaprecio: -2
            })*/
        });
    },
    initComponent: function () {
        var _this = this;
        var config = {
            layout: 'border',
            modal: true,
            closeAction: 'hide',
            width: 700,
            frame: true,
            height: 400,
            items: _this.createItems()
        };
        Ext.apply(this, config);
        Ext.erp.subcategorias.superclass.initComponent.call(this, arguments);
    },
    createItems: function () {
        var _this = this;
        this.listCol = new LOG.util.List();
        this.listCol.add({
            dataIndex: 'idcategoriaprecio'
        });
        this.listCol.add({
            header: 'Denominaci\xf3n',
            dataIndex: 'denominacion',
            width: 350,
            default: true
        });
        this.listCol.add({
            dataIndex: 'concepto',
            header: _this.idioma.lbConcepto,
            width: 95,
            renderer: function(value, metaData) {
                if (value == '+') {
                    return 'Suma';
                } else if (value == '-') {
                    return 'Resta';
                } else {
                    return 'Ninguna';
                }
            }
        });
        this.listCol.add({
            dataIndex: 'porciento',
            header: 'Porcentual',
            width: 75,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        });

        this.smGrid = LOG.util.UIManager.initSelectionModel(3, false);

        var cls = LOG.util.UIManager.proccessColumns(this.listCol, this.smGrid);
        this.cmGrid = new Ext.grid.ColumnModel(cls.columns);
        this.recStGrid = Ext.data.Record.create(cls.fields);
        this.store = new Ext.data.Store({
            url: '/logistica/facturacion/facturacion/comun_fact/index.php/subcategorias/getCategoriasPrecio',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: "idproducto",
                root: "datos",
                totalProperty: 'cantidad',
            }, this.recStGrid),
            listeners: {
                beforeload: function(st, op) {
                    st.initBaseParams.idcategoriaprecio = _this.idcategoriaprecio;
                    st.baseParams.idcategoriaprecio = _this.idcategoriaprecio;
                },
                load: function(st){
                    if(!_this.gp.getSelectionModel().hasSelection()){

                    }
                }
            }
        });
        this.gp = LOG.util.UIManager.initGrid(this.cmGrid, this.store, this.smGrid, {nobbar: false});
        this.panel = LOG.util.UIManager.initPanel({
            title: '',
            layout: 'fit',
            region: 'center',
            //height: 200,
            listeners: {

            },
            items: [this.gp]
        });
        return this.panel;
    },
    aceptarFn: function () {


    },
    postSalvar: function (r, a) {

    }
});