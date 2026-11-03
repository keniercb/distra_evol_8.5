/**
 * Created by Tony on 24/10/2014.
 */
Ext.ns('Ext.erp');
Ext.erp.cilindros = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        var _this = this;
        config.codigo = false;
        this.bussinesModel = 'NomCilindroModel';
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idnomcilindro';
        this.storeFields = [{
            name: 'capacidad'
        },{
            name: 'abreviaturaunidadmedida'
        }, {
            name: 'idumedida'
        }];
        this.columnsFields = [{
            header: 'Capacidad',
            dataIndex: 'capacidad',
            width: 120
        },{
            dataIndex: 'abreviaturaunidadmedida',
            header: 'U/M',
            width: 70
        },{
            dataIndex: 'idumedida',
            hidden: true
        }];
        Ext.erp.cilindros.superclass.constructor.call(this, config);

        this.btnAdicionarProducto = new Ext.Button({
            text: _this.idioma.lbBtnAdicionar,
            //tooltip: _this.idioma.lbTtBtnAdicionarModelo,
            iconCls: 'adicionar',
            handler: function () {
                LOG.inv.maestroproductos.Loader.init(function () {
                    var v = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        //parametros: params,
                        usarAplicar: true,
                        doAction: function (i) {
                            var self = this;
                            var record = [];

                            Ext.each(i, function (obj) {
                                record.push(obj.data.idindicador);
                            });
                            Ext.MessageBox.wait('Guardando datos', 'Espere' || '...');
                            Ext.Ajax.request({
                                url: '/logistica/facturacion/facturacion/comun_fact/index.php/cilindros/adicionarcilindro',
                                method: 'POST',
                                params: {
                                    ids: Ext.encode(record)
                                },
                                callback: function(o, s, r) {
                                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                    Ext.MessageBox.hide();
                                    if (resp.success) {
                                        mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                                        _this.stProducto.load();
                                    } else {
                                        mostrarMensaje(1, 'Ha ocurrido un error al guardar los datos');
                                    }
                                }
                            });
                            /*_this.gdProducto.storePrincipal.on({
                                'add':function(store,r,i){
                                    LOG.util.UIManager.apply(self.parametros,_this.collectRecords());
                                    self.panelProductos.getStorePrincipal().reload();
                                }
                            });

                            LOG.util.UIManager.apply(this.parametros,_this.collectRecords());
                            _this.gdProducto.storePrincipal.add(record);
                            if(_this.gdProducto.storePrincipal.length > 0){
                                this.close();
                            }*/
                        }
                    });
                    v.show();
                });
            }
        });

        this.btnEliminarProducto = new Ext.Button({
            text: _this.idioma.lbBtnEliminar,
            //tooltip: _this.idioma.lbTtBtnEliminarModelo,
            iconCls: 'eliminar',
            handler: function () {
                mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar el(los) producto(s) seleccionado(s)\x3f', function(btn, text) {
                    if (btn === 'ok') {
                        var seleccion = _this.gridPanelProductos.getSelectionModel().getSelections();
                        var idDel = [];
                        Ext.each(seleccion, function(record) {
                            idDel.push(record.data.idindicador)
                        })
                        Ext.MessageBox.wait('Eliminando...', _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: '/logistica/facturacion/facturacion/comun_fact/index.php/cilindros/eliminarProdCilindro',
                            method: 'post',
                            params: {
                                datos: Ext.encode(idDel)
                            },
                            success: function(rp) {
                                let respuesta = Ext.decode(rp.responseText);
                                _this.gridPanelProductos.getStore().load();
                                Ext.MessageBox.hide();
                            }
                        });
                    }
                });
            }
        });

        this.panelBotonesProductos = new Ext.Panel({
            tbar: [this.btnAdicionarProducto, this.btnEliminarProducto],
            border: false,
            region: 'north'
        });
        this.stProducto = new Ext.data.Store({
            url: '/logistica/facturacion/facturacion/comun_fact/index.php/cilindros/getProductos',
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
                        name: 'idindicador'
                    }
                ]
            })
        });

        this.stProducto.on({
            'beforeload': function(st) {
                st.baseParams.idcilindro = (_this.selectionModeNomenclador.getSelected()) ? _this.selectionModeNomenclador.getSelected().idnomcilindro : -1;
                st.initBaseParams.idcilindro = (_this.selectionModeNomenclador.getSelected()) ? _this.selectionModeNomenclador.getSelected().idnomcilindro : -1;
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
                _this.panelProductos.expand();
            }
        });

        this.smProductos = new Ext.grid.RowSelectionModel();

        this.cmProductos = new Ext.grid.ColumnModel([
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

        this.gridPanelProductos = new Ext.grid.GridPanel({
            region: 'center',
            border: false,
            /*tbar: ['', new Ext.menu.TextItem({
                text: _this.idioma.lbDenominacion + ':'
            }), '', this.tfDenomModelo, '', _this.btnBuscarModelos, '', this.btnLimpiarModelos],*/
            autoExpandColumn: 'expndirproductos',
            cm: _this.cmProductos,
            store: _this.stProducto,
            sm: _this.smProductos,
            loadMask: {
                store: _this.stProducto
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stProducto,
                displayInfo: true,
                pageSize: 15
            })
        });

        this.panelProductos = new Ext.Panel({
            region: 'south',
            collapsible: true,
            collapsed: true,
            split: true,
            collapseMode: 'mini',
            height: 240,
            layout: 'border',
            items: [this.panelBotonesProductos, this.gridPanelProductos]
        });

        this.add(_this.panelProductos);

        this.selectionModeNomenclador.on({
            'rowselect': function() {
                /*_this.activarBotones();*/
                /*_this.stProducto.load({params: {start: 0, limit: 15}});*/
                _this.panelProductos.expand();
            },
            'rowdeselect': function() {
                //_this.activarBotones();
            }
        });
        _this.stProducto.load({params: {start: 0, limit: 15}});
    },
    initFormFields: function(){
        var _this = this;
        this.txtCapacidad = LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Capacidad',
            name: 'capacidad',
            allowBlank: false,
            anchor: '95%'
        });
        this.cbUM = new LOG.util.ComboBox({
            fieldLabel: 'U/M',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
            name: 'abreviaturaunidadmedida',
            valueField: 'abreviaturaunidadmedida',
            displayField: 'abreviaturaunidadmedida',
            selectOnlyLeaf: true,
            anchor: '95%',
            listeners : {
                select: function(cmb, rd){
                    Ext.getCmp('idhdumedida').setValue(rd.json.idunidadmedida);
                }
            }
        });

        this.formFields = [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                layout: 'form',
                items: this.txtCapacidad
            },{
                columnWidth: 0.5,
                layout: 'form',
                items: this.cbUM
            },{
                xtype : 'hidden',
                name : 'idumedida',
                id : 'idhdumedida'
            }]
        }];
    }
});