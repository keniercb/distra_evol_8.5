Ext.ns('Ext.erp.proddeficitingreso');
Ext.erp.proddeficitingreso = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,

    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.proddeficitingreso.Idioma);
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/proddeficitingreso/';

        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this);
            }
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.botonLimpiar();
            }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                key: 'p',
                fn: function () {
                    _this.getReportes();
                }
            },
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        _this.botonLimpiar();
                    }
                }]);
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonDeposito('->');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));

        this.comboDepositos = new LOG.util.LovCombo({
            mode:'remote',
            url:  '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            displayField:'deposito',
            hiddenName: 'deposito',
            editable: false,
            valueField:'iddeposito'
        });
        this.addToolbarButtonDeposito(this.comboDepositos);
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idProductosdeficit'}));

        /*---------------Fieldset Datos de los Producto---*/
        this.dfDesdeProd = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeProd,
            name: 'desdeprod',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeSubProd',
            endDateField: 'hastaSubProd',
            editable: false
        });
        this.dfHastaProd = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaProd,
            name: 'hastaprod',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaSubProd',
            startDateField: 'desdeSubProd',
            editable: false
        });
        this.dfDesdeProd.endDateField = this.dfHastaProd.id; //-------validacion de fecha
        this.dfHastaProd.startDateField = this.dfDesdeProd.id;

        this.cbDefIng = new LOG.util.ComboBox({ //---combobox Tipo de producto
            fieldLabel: _this.idioma.cbDefIng,
            valueField: 'iddeposito',
            //value:3,
            displayField: 'deposito',
            hiddenName: 'deposito',
            editable: false,
            emptyText: _this.idioma.seleccione,
            store: new Ext.data.SimpleStore({
                fields:['iddeposito','deposito'],
                data:[[1,_this.idioma.cbDeficit],[2,_this.idioma.cbIngreso],[3,_this.idioma.cbDefIng]]
            })
        });

        this.clsDatosProd = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        this.clsDatosProd.getColumn(0).columnWidth = 0.13;
        this.clsDatosProd.getColumn(1).columnWidth = 0.13;
        this.clsDatosProd.getColumn(2).columnWidth = 0.13;
        this.clsDatosProd.addComponent(this.dfDesdeProd);
        this.clsDatosProd.addComponent(this.dfHastaProd);
        this.clsDatosProd.addComponent(this.cbDefIng);

        this.fsDatosProd = new Ext.form.FieldSet({ //fieldset Seleccionar Suministrador
            title: _this.idioma.fsDatosProd,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            items: [this.clsDatosProd]
        });

        /*---------------Grid de los Producto--------------*/
        this.fsProducto = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecProducto,
            height: 450
        });
        this.gdProducto = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            type: 'productos',
            tltWinAdd: this.idioma.ttWinAddProductos,
            header: this.idioma.gcProducto,
            ttBtnAdd: this.idioma.ttAddProduct,
            ttBtnDel: this.idioma.ttElimProduct,
            idItem:'producto'
        });
        this.btnSelecProd = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            iconCls: 'adicionar',
            tooltip:  _this.idioma.ttAddProd,
            handler: function () {
                LOG.inv.maestroproductos.Loader.init(function () {
                    var params = _this.collectRecordsP();
                    var v = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        parametros: params,
                        usarAplicar: true,
                        doAction: function (i) {
                            var self = this;
                            var record = [];

                            Ext.each(i, function (obj) {
                                record.push(obj);
                            });
                            _this.gdProducto.storePrincipal.on({
                                'add':function(store,r,i){
                                    LOG.util.UIManager.apply(self.parametros,_this.collectRecordsP());
                                    self.panelProductos.getStorePrincipal().reload();
                                }
                            });

                            LOG.util.UIManager.apply(this.parametros,_this.collectRecordsP());
                            _this.gdProducto.storePrincipal.add(record);
                            if(_this.gdProducto.storePrincipal.length > 0){
                                this.close();
                            }
                        }
                    });
                    v.show();
                });

            }
        });
        this.btnElimProd = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            iconCls: 'eliminar',
            tooltip:  _this.idioma.ttElimProd,
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdProducto.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdProducto.storePrincipal.remove(selected);
                });
                if (_this.gdProducto.storePrincipal.getCount() == 0) {
                    _this.btnElimProd.setDisabled(true);
                }
            }

        });
        this.gdProducto.addToolbarButton(this.btnSelecProd);
        this.gdProducto.addToolbarButton(this.btnElimProd);
        Ext.Ajax.request({
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/categoriaMarcada',
            params: {
                cliente: 'cliente'
            },
            method: 'POST',
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp['datos'] == 0) {
                    _this.gdProducto.getColumnModel().setHidden(4, true);
                }
            }
        });
        this.gdProducto.init();

        this.fsProducto.add(this.gdProducto.view());
        this.fpCentral = LOG.util.UIManager.initForm({ //formulario Seleccionar cliente
            region: 'center',
            style: '-moz-border-radius:20px',
            layout: 'form',
            items: [this.fsDatosProd,this.fsProducto]
        });

        /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()],
                bbar: [this.listaBotonesDeposito.getArray()]
            },
            {
                region: 'center',
                layout:'fit',
                items: [this.fpCentral]
            }
        ];

        Ext.erp.proddeficitingreso.superclass.constructor.call(this, config);

    },
    collectRecordsP: function(){
        var _this = this;
        _this.recordProd = _this.gdProducto.storePrincipal.data.items;
        var idProdSeleccionados = [];
        var parametros = {};

        Ext.each(_this.recordProd, function (rec) {
            if (rec.data.idindicador) {
                idProdSeleccionados.push(rec.data.idindicador);
            }
        });
        parametros.idseleccionados = Ext.encode(idProdSeleccionados);
        return parametros;
    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    getReportes: function (_this) {
        var depositos = "";
        _this.entidades=[];
        _this.entidadesCheck=[];
        var defing = _this.cbDefIng.value? _this.cbDefIng.value:0;

        var stringProd = "";
        for (var i = 0; i < _this.gdProducto.getStorePrincipal().data.items.length; i++) {
            if (i != _this.gdProducto.getStorePrincipal().data.items.length - 1) {
                stringProd += _this.gdProducto.getStorePrincipal().data.items[i].data.idindicador + ",";
            } else {
                stringProd += _this.gdProducto.getStorePrincipal().data.items[i].data.idindicador + "";
            }
        }
        stringProd = "{" + stringProd + "}";
        if(stringProd== "{}") {
            stringProd = null;
        }

        if(this.comboDepositos.view){
            for(var i=0; i < this.comboDepositos.view.store.data.items.length; i++) {
                if (this.comboDepositos.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboDepositos.view.store.data.items[i].data.iddeposito);
                }
                _this.entidades.push(_this.comboDepositos.view.store.data.items[i].data.iddeposito);
            }
            if(_this.entidadesCheck.length > 0){
                depositos = "{" + _this.entidadesCheck.join() + "}";
            }else{
                depositos = "{" + _this.entidades.join() + "}";
            }
        }else{
            for(var i=0; i < this.comboDepositos.store.data.items.length; i++) {
                _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
            }
            depositos = "{" + _this.entidades.join() + "}";
        }

         new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/recuperaciones/ProductoDeficitIngreso',
                    isList: true,
                    params: {
                        fechainicio: (_this.dfDesdeProd.getValue()) ? _this.dfDesdeProd.getValue().format('d-m-Y') : null,
                        fechafin: (_this.dfHastaProd.getValue()) ? _this.dfHastaProd.getValue().format('d-m-Y') : null,
                        arraydeposito: depositos,
                        defing: defing,
                        estado: "{3}",
                        codigo: "{110}",
                        arrayproducto: stringProd,
                        idestructura: idEntidad,
                        idsubsistema: _this.comboDepositos.store.reader.jsonData.idsubsistema
                    }
                }
            ]
        }).view();
    },
    botonLimpiar: function () {
        var _this=this;
        _this.dfDesdeProd.setValue (null);
        _this.dfHastaProd.setValue(null);
        _this.dfDesdeProd.setMaxValue (null);
        _this.dfHastaProd.setMinValue(null);
        _this.comboDepositos.clearValue();
        _this.cbDefIng.clearValue();


    }



});