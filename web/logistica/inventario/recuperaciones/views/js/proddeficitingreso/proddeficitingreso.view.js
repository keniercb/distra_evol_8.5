Ext.ns('Ext.erp.proddeficitingreso');

Ext.erp.proddeficitingreso = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.idioma = log.inv.proddeficitingreso.Idioma;
        this.dirController = '/logistica/inventario/recuperaciones/index.php/proddeficitingreso/';
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
        this.comboDepositos = new LOG.util.ComboBox({ //---combobox Depositos
            valueField: 'iddeposito',
            displayField: 'deposito',
            hiddenName: 'deposito',
            autoSelect: true,
            editable: false,
            url: _this.dirController + 'cargardepositos'
        });
        this.addToolbarButtonDeposito(this.comboDepositos);
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idProdDeficitIngreso'}));

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
            endDateField: 'desdeSubProd',
            editable: false
        });
        this.dfDesdeProd.endDateField = this.dfHastaProd.id; //-------validacion de fecha
        this.dfHastaProd.startDateField = this.dfDesdeProd.id;

        this.cbDefIng = new LOG.util.ComboBox({ //---combobox Tipo de producto
            fieldLabel: _this.idioma.cbDefIng,
            valueField: 'iddeposito',
            value:2,
            displayField: 'deposito',
            hiddenName: 'deposito',
            editable: false,
            store: new Ext.data.SimpleStore({
                fields:['iddeposito','deposito'],
                data:[[1,_this.idioma.cbDeficit],[2,_this.idioma.cbIngreso]]
            })
        });

        this.clsDatosProd = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
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
        var listaTipoProd = new LOG.util.List();
        var checkProd = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        listaTipoProd.add(checkProd);
        listaTipoProd.add({
            header: _this.idioma.gcCodigo,
            width: 150,
            dataIndex: 'codigo',
            default: true
        });
        listaTipoProd.add({
            header: _this.idioma.gcNroPieza,
            width: 150,
            dataIndex: 'nropieza',
            default: true
        });
        listaTipoProd.add({
            header: _this.idioma.gcDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });
        listaTipoProd.add({
            dataIndex: 'idproducto',
            default: true
        });

        var clsTipoProd = LOG.util.UIManager.proccessColumns(listaTipoProd);
        var cmTipoProd = new Ext.grid.ColumnModel(clsTipoProd.columns);
        var smTipoProd = checkProd;
        var recTipoProd = Ext.data.Record.create(clsTipoProd.fields);
        this.stTipoProd = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos'
            }, recTipoProd)
        });
        smTipoProd.on({
            'rowselect': function () {
                if (smTipoProd.getSelections().length >= 1) {
                    _this.btnElimProd.enable();
                } else {
                    _this.btnElimProd.disable();
                }
            },
            'rowdeselect': function () {
                if (smTipoProd.getSelections().length >= 1) {
                    _this.btnElimProd.enable();
                } else {
                    _this.btnElimProd.disable();
                }
            }
        });

        this.btnSelecProd = LOG.util.Prototipos.botonAdicionar({
            text:_this.idioma.btnElimProducto,
            tooltip: _this.idioma.ttAddProductos,
            handler: function () {
                var winProductos = new LOG.lb.producto.View({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.comboDepositos.getValue()
                    },
                    doAction: function (i) {
                        var record = [];
                        Ext.each(i, function (obj) {
                            for (var j = 0; j < _this.stTipoProd.data.items.length; j++) {
                                if (_this.stTipoProd.data.items[j].data.codigo == obj.data.codigo) {
                                    Ext.MessageBox.alert(_this.idioma.lbInformacion, _this.idioma.msgRedundancia);
                                }
                            }
                            record.push(obj);
                        });
                        _this.stTipoProd.add(record);
                    }
                });
                winProductos.init();
                winProductos.busquedaAvanzada = false;
                winProductos.getVistaPrincipal().buttons[1].setVisible(false);
                winProductos.getVistaPrincipal().width = 750;
                winProductos.getVistaPrincipal().height = 350;
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();

            }
        });
        this.btnElimProd = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimProductos,
            disabled: true,
            handler: function () {
                var seleccion = smTipoProd.getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    _this.stTipoProd.remove(seleccion[i]);
                }
                if (_this.stTipoProd.getCount() == 0) {
                    _this.btnElimProd.setDisabled(true);
                }
            }
        });
        this.tbTipoProd = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecProd, this.btnElimProd]
        });
        this.gridProd = LOG.util.UIManager.initGrid(cmTipoProd, _this.stTipoProd, smTipoProd, {
            tbar: this.tbTipoProd,
            height: 405
        });



        this.fpCentral = LOG.util.UIManager.initForm({ //formulario Seleccionar cliente
            region: 'center',
            style: '-moz-border-radius:20px',
            layout: 'form',
            items: [this.fsDatosProd, this.gridProd]
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
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    getReportes: function (_this) {
        var valorComboDeposito = _this.comboDepositos.value;
        var defing = _this.cbDefIng.value;

        var stringProd = "";
        for (var i = 0; i < _this.gridProd.getStore().data.items.length; i++) {
            if (i != _this.gridProd.getStore().data.items.length - 1) {
                stringProd += _this.gridProd.getStore().data.items[i].data.idproducto + ",";
            } else {
                stringProd += _this.gridProd.getStore().data.items[i].data.idproducto + "";
            }
        }
        stringProd = "{" + stringProd + "}";
        if(stringProd== "{}") {
            stringProd = null;
        }

        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/ProductosDeficitIngresos',
                    name: 'ProductosDeficitIngresos',
                    isList:true,
                    params: {
                        fechainicio: (_this.dfDesdeProd.getValue()) ? _this.dfDesdeProd.getValue().format('d/m/Y') : null,
                        fechafin: (_this.dfHastaProd.getValue()) ? _this.dfHastaProd.getValue().format('d/m/Y') : null,
                        iddeposito: valorComboDeposito,
                        defing: defing,
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema,
                        estado: "{3}",
                        codigo: "{110}"
                    }
                }
            ]
        }).view();
    },
    botonLimpiar: function () {
        var _this=this;
        _this.dfDesdeProd.setValue (null);
        _this.dfHastaProd.setValue(null);
        _this.stTipoProd.removeAll();
        _this.comboDepositos.clearValue();
    }



});