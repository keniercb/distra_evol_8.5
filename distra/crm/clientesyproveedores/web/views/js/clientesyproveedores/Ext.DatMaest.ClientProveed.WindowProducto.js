Ext.DatMaest.ClientProveed.WindowProducto = Ext.extend(Ext.Window, {
    autoScroll: false,
    maximizable: true,
    refhelp: '',
    layout: 'border',
    height: 670,
    width: 700,
    planificacion: false,
    resizable: false,
    modal: true,
    baseUrl: "/configuracion/clientesyproveedores/index.php/clientesyproveedores/",
    constructor: function (params) {
        var me = this;
        this.etiquetas = params.etiquetas || {};
        this.createInitialConfig();
        Ext.DatMaest.ClientProveed.WindowProducto.superclass.constructor.call(this, params);
    },
    createInitialConfig: function () {
        var me = this,
            bodyHeight = Ext.getBody().dom.offsetHeight;
        this.height = this.height >= bodyHeight ? bodyHeight - 20 : this.height;
        this.title = 'Seleccionar equipo/vehículo';
        this.action = 'select';

        me.store = new Ext.data.Store({
            url: this.baseUrl + 'cargarproductos',
            baseParams: {
                start: 0,
                limit: 20,
                //naturaleza: 1000006 //1000006 //1000257   //cambiar siempre para subir (poner 1000006)
            },
            reader: new Ext.data.JsonReader({
                    root: 'datos',
                    totalProperty: 'cantidad',
                    successProperty: 'success'
                },
                [
                    {name: 'idindicador', type: 'int'},
                    {name: 'denominacion', type: 'string'},
                    {name: 'tipo', type: 'int'},
                    {name: 'dumedida', type: 'string'},
                    {name: 'precio', type: 'float'},
                    {name: 'preciodivisa', type: 'float'},
                    {name: 'tipo', type: 'int'},
                    {name: 'arridtablas'},
                    {name: 'marca'},
                    {name: 'modelo'},
                    {name: 'marcamodelo'},
                    {name: 'idmarca'},
                    {name: 'idmodelo'},
                    {name: 'nacionalidad'},
                    {name: 'datos_json'},
                ]
            ),
            filters: [{property: 'tipo', value: me.planificacion ? 2 : 1}]
        });
        me.selModel = this.sm = this.smClienteProveedor = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                selectionchange: function (yo) {
                    me.btnAccept.setDisabled(yo.getSelections().length == 0);
                    me.btnApply.setDisabled(yo.getSelections().length == 0);
                }
            }
        });
        me.grid = new Ext.grid.GridPanel({
            loadMask: this.etiquetas.lbCargando,
            store: me.store,
            multiSelect: true,
            sm: me.selModel,
            region: 'center',
            columns: [
                {
                    header: 'Nombre',
                    dataIndex: 'denominacion',
                    width: 480,
                    flex: 1
                }, {
                    header: 'CUP',
                    dataIndex: 'precio',
                    renderer: function (value) {
                        return Ext.util.Format.usMoney(value).replace('$', '');
                    }
                }, {
                    header: 'CUC',
                    dataIndex: 'preciodivisa',
                    renderer: function (value) {
                        return Ext.util.Format.usMoney(value).replace('$', '');
                    }
                }
            ],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                displayMsg: this.etiquetas.lbDisplayMsg,
                emptyMsg: this.etiquetas.lbNoResults,
                store: this.store,
                firstText: this.etiquetas.lbPrimeraPagina || 'Primera P&aacute;gina',
                lastText: this.etiquetas.lbUltimaPagina || '&Uacute;ltima P&aacute;gina'
            })
        });
        me.PanelCampos = new Ext.Panel({
            layout: 'column',
            labelAlign: 'top',
            margin: 5,
            defaults: {
                columnWidth: .5,
                labelAlign: 'top'
            }
        });
        me.datosAdicionales = new Ext.FormPanel({
            title: 'Adicionar datos adicionales',
            collapsible: true,
            collapsed: true,
            height: 300,
            region: 'south',
            labelAlign: 'top',
            items: [
                me.PanelCampos
            ]
        });
        me.selModel.on('selectionchange', function (yo) {
            var select = yo.getSelections();
            for (var k = me.PanelCampos.items.length - 1; k >= 0; k--) {
                me.PanelCampos.remove(me.PanelCampos.getComponent(k))
            }
            me.PanelCampos.doLayout();
            if (select.length == 1) {
                if (select[0].get('arridtablas') && select[0].get('arridtablas') != '-1,-1,-1,-1') {
                    me.datosAdicionales.collapse();
                    me.datosAdicionales.maskL = new Ext.LoadMask(me.el, {
                        msg: 'Cargando datos adicionales'//me.etiquetas.msgLoading
                    });
                    me.datosAdicionales.maskL.show();
                    me.peticion = Ext.Ajax.request({
                        scope: this,
                        url: me.baseUrl + 'obtenerAtributosVehiculos',
                        params: {
                            arridtablas: select[0].get('arridtablas')
                        },
                        callback: function (options, success, response) {
                            if (me.datosAdicionales.maskL)me.datosAdicionales.maskL.hide();
                            var datos = Ext.decode(response.responseText);
                            if (datos.data.length > 0) {

                                var cont = 0;
                                Ext.each(datos.data, function (value, index) {
                                    value.name = value.hiddenName;
                                    value.regex = null;
                                    if (value.margin == null)value.margin = '5 5 5 5';
                                    value.columnWidth = 0.5;
                                    var campo = null;
                                    if (value.xtype == 'combo') {
                                        value.mode = 'local';
                                        value.lazyRender = true;
                                        value.typeAhead = true;
                                        value.triggerAction = 'all';
                                        value.editable = false;
                                        var tupla = value;
                                        var str = tupla.store.replace("new Ext.data.JsonStore({", '');
                                        str = str.replace("})", '');

                                        var config = Ext.decode("{" + str + "}");

                                        var _data = Array();
                                        var _fields = Array();

                                        for (var i = 0; i < config.data.length; i++) {
                                            var _subData = Array();

                                            for (var key in config.data[i]) {
                                                _subData.push(config.data[i][key]);
                                            }

                                            if (_subData.length > 0) {
                                                _data.push(_subData.reverse());
                                            }
                                        }

                                        var store = new Ext.data.SimpleStore({
                                            fields: config.fields,
                                            data: _data
                                        });
                                        value.store = store;
                                        campo = new Ext.form.ComboBox(value);
                                    } else if (value.xtype == 'numberfield') {
                                        campo = new Ext.form.NumberField(value);
                                    } else if (value.xtype == 'textfield') {
                                        campo = new Ext.form.TextField(value);
                                    } else if (value.xtype == 'checkbox') {
                                        campo = new Ext.form.Checkbox(value);
                                    } else if (value.xtype == 'textareafield' || value.xtype == 'textarea') {
                                        campo = new Ext.form.TextArea(value);
                                    } else if (value.xtype == 'datefield') {
                                        campo = new Ext.form.DateField(value);
                                    }
                                    if (campo != null) {
                                        cont += 1;
                                        me.PanelCampos.add(
                                            {
                                                columnWidth: .50,
                                                layout: 'form',
                                                border: false,
                                                bodyBorder: false,
                                                items: [
                                                    campo
                                                ]
                                            }
                                        );
                                    }
                                });
                                me.datosAdicionales.expand();

                                me.PanelCampos.setHeight(Math.round(cont / 2) * 60);
                                me.datosAdicionales.height = Math.round(cont / 2) * 60;
                                me.datosAdicionales.setHeight(Math.round(cont / 2) * 60);
                                me.PanelCampos.doLayout();
                                me.datosAdicionales.doLayout();
                                me.datosAdicionales.collapse();
                                var index = me.store.find('idindicador', select[0].get('idindicador'));
                                if (index != -1) {
                                    aux = me.store.getAt(index);
                                    var jsondato = aux.get('datos_json');
                                    if (typeof jsondato == 'string' && jsondato != '') {
                                        jsondato = Ext.decode(jsondato);
                                    }
                                    var dato = {
                                        getData: function () {
                                            return jsondato
                                        }
                                    };
                                }
                                me.datosAdicionales.collapse();
                                setTimeout(function () {
                                    me.datosAdicionales.expand();
                                }, 500);
                            }
                            else {
                                me.datosAdicionales.collapse();
                            }

                        }
                    });
                }
                else {
                    me.datosAdicionales.collapse();
                }
            } else {
                me.datosAdicionales.collapse();
            }
        });

        me.items = [me.grid, me.datosAdicionales];

        me.search = new Ext.Cont.SearchField({
            width: 216,
            emptyText: this.etiquetas.lbCriterioBuscar,
            searchTooltip: 'Buscar producto',
            regex: /([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+/,
            maskRe: /([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+/,
            fnOnSearch: function () {
                var filtro = me.search.getValue();
                me.store.load({
                    params: {
                        start: 0,
                        limit: 20,
                        denominacion: filtro
                    }
                });
            },
            fnOnClear: function () {
                me.store.baseParams.filtro = '';
                me.store.load({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        });

        me.tbar = [
            me.search
        ];

        this.defaultButton = this.btnCancel = new Ext.Button({
            iconCls: 'cancelar',
            text: this.etiquetas.lbBtnCancelar,
            tooltip: this.etiquetas.lbTtCancelar,
            handler: function () {
                me.destroy();
            }
        });

        this.btnAccept = new Ext.Button({
            iconCls: 'aceptar',
            action: 'accept',
            disabled: true,
            text: this.etiquetas.lbBtnAceptar,
            tooltip: this.etiquetas.lbTtAceptar
        });

        this.btnApply = new Ext.Button({
            iconCls: 'aplicar',
            action: 'apply',
            disabled: true,
            text: this.etiquetas.lbBtnAplicar,
            tooltip: this.etiquetas.lbTtAplicar
        });

        this.btnAccept.on({
            scope: this,
            click: this.adicionarVehiculo
        });

        this.btnApply.on({
            scope: this,
            click: this.adicionarVehiculo
        });

        this.buttons = [this.btnCancel, this.btnApply, this.btnAccept];

    },
    rendererClasificacion: function (value, metadata, record) {
        var icono = 'icondistra-',
            tipo = this.etiquetas.lbProd;
        if (value == 1) {
            icono += 'producto';
        } else {
            icono += 'servicio';
            tipo = this.etiquetas.lbServ;
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    },
    crearRecord: function (store, values, include) {
        var arrTemp = [];
        var objTemp = {};
        Ext.each(store.fields.keys, function (key) {
            arrTemp.push({name: key});
            if (include) {
                objTemp[key] = values[key];
            } else {
                objTemp[key] = '';
            }
        });
        var RecordDinamico = Ext.data.Record.create(arrTemp);
        return new RecordDinamico(objTemp);
    },
    adicionarVehiculo: function (btn) {
        var gridproducto = this.gridvehiculo,
            stproducto = gridproducto.getStore(),
            records = this.sm.getSelections(),
            accion = btn.action,
            datos_json = {}, provincia = null, chapa = null, medio = null,modelo=null;
        if (records.length == 1)
            if (this.PanelCampos) {
                if (this.PanelCampos.items.items.length != 0) {
                    datos_json = this.datosAdicionales.getForm().getValues();
                    this.PanelCampos.items.items.forEach(function (x) {
                        var comp = x.items.items[0];
                        if (/provincia/i.test(comp.fieldLabel)) {
                            provincia = comp.getRawValue();
                        } else if (/chapa/i.test(comp.fieldLabel)) {
                            chapa = comp.getRawValue();
                        } else if (/medio/i.test(comp.fieldLabel)) {
                            medio = comp.getRawValue();
                        }else if (/modelo/i.test(comp.fieldLabel)) {
                            modelo = comp.getRawValue();
                        }
                    });
                }
            }
        Ext.each(records, function (record) {
            var objeto = {
                idindicador: record.data.idindicador,
                denominacion: record.data.denominacion,
                cantidad: 1,
                idactividad: record.data.idactividad,
                unidadmedida: record.data.dumedida || 'Unidad',
                precio: record.data.precio,
                preciodivisa: record.data.preciodivisa,
                preciototal: parseFloat(record.data.precio),
                preciodivisatotal: parseFloat(record.data.preciodivisa),
                tipo: record.data.tipo || 2,
                monto: 0,
                datos_json: datos_json,               
                marca: record.data.marca,
                idmodelo: record.data.idmodelo,
                idmarca: record.data.idmarca,
                provincia: provincia,
                chapa: chapa,
				modelo:modelo,
                tipomedio: medio
            };
            if (!this.existeVehiculo(objeto)) {
                stproducto.loadData([objeto], true);
                stproducto.fireEvent('datachange', stproducto);
            }
        }, this);
        if (accion != 'apply') {
            this.close();
        }
    },
    existeVehiculo: function (n) {
        var store = this.gridvehiculo.getStore(),
            index = store.findBy(function (rec) {
                var o = rec.data;
                return n.idindicador == o.idindicador && n.provincia == o.provincia && n.chapa == o.chapa && n.tipomedio == o.tipomedio && n.modelo == o.modelo;
            }, this);
        return index != -1;
    }
});