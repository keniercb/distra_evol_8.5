Ext.erp.ComboCuenta = Ext.extend(Ext.form.ComboBox, {
    constructor: function(params) {
        this.tpl = '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>';
        this.enableKeyEvents = true;
        this.displayField = 'text';
        this.valueField = 'text';
        this.hiddenName = 'idcuenta';
        this.store = params.store;
        //this.readOnly = true;
        this.triggerAction = 'all';
        this.mode = 'remote';
        this.listeners = {
            'beforeselect': function(cb, record, index) {
                var gp = params.grid;
                var sm = params.grid.getSelectionModel();
                var store = gp.getStore();
                var rec = store.getAt(store.indexOf(sm.getSelected()));
                rec.set(params.columna, record.data.idcuenta);
            }
        };
        Ext.erp.ComboCuenta.superclass.constructor.apply(this, arguments);
    }
});

/**
 * Tree editable
 */
Ext.erp.GridGruposCuentas = Ext.extend(Ext.ux.maximgb.EditorGridPanel, {
    constructor: function(config) {

        var _this = this;

        this.id = 'gpGruposCuentas';
        this.region = 'center';
        this.loadMask = true;
        this.master_column_id = 'expandir';
        this.stripeRows = true;
        this.autoExpandColumn = 'expandir';
        this.margins = '1 1 1 -4';

        var stCuentas = this.crearStoreCuentas(config.etiquetas);
        this.comboCuentasActivos = new Ext.erp.ComboCuenta({
            store: stCuentas,
            grid: _this,
            columna: 'idcuentaactivo'
        });
        this.comboCuentasDepreciacion = new Ext.erp.ComboCuenta({
            store: stCuentas,
            grid: _this,
            columna: 'idcuentadepreciacion'
        });

        this.sm = new Ext.grid.RowSelectionModel({
            id: 'smgridgruposcuentas',
            singleSelect: true
        });
        Ext.Ajax.timeout = 6000000;
        this.store = new Ext.ux.maximgb.AdjacencyListStore({
            url: '/logistica/activos_fijos/configuracion/index.php/confgruposcuentas/cargargruposcuentas',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idgruposubgrupo'
            }, [
                {
                    name: 'idgrupocuenta'
                },
                {
                    name: 'idgruposubgrupo'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'idcuentaactivo'
                },
                {
                    name: 'desccuentaActivos'
                },
                {
                    name: 'idcuentadepreciacion'
                },
                {
                    name: 'desccuentaDepreciacion'
                },
                {
                    name: 'tipo'
                },
                {
                    name: '_is_leaf'
                },
                {
                    name: '_parent'
                }
            ]),
            listeners: {
                'load': function(st, records, options) {
                    st.baseParams.codigo = null;
                    st.baseParams.descripcion = null;
                    st.baseParams.idgruposubgrupo = null;

                },
                'beforeexpandnode': function(st, record) {
                    _this.getSelectionModel().selectRecords([record])
                }
            }
        });

        this.cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                header: 'N\xBA.',
                width: 30
            }), {
                id: 'expandir',
                width: 100,
                header: config.etiquetas.lbCmDescripcionGrupo,
                dataIndex: 'denominacion',
                renderer: function(v, p, record) {
                    return record.get('codigo') + ' - ' + v;
                }
            }, {
                header: config.etiquetas.lbCuentaActivos,
                width: 250,
                dataIndex: 'desccuentaActivos',
                editor: _this.comboCuentasActivos
            }, {
                header: config.etiquetas.lbCuentaDepreciacion,
                width: 250,
                dataIndex: 'desccuentaDepreciacion',
                editor: _this.comboCuentasDepreciacion
            }
        ]);
        this.clicksToEdit = 1;

        Ext.erp.GridGruposCuentas.superclass.constructor.apply(this, arguments);
    },
    crearStoreCuentas: function(etiquetas) {

        var storeCuentas = new Ext.data.Store({
            //autoLoad: true,
            url: '/logistica/activos_fijos/configuracion/index.php/confgruposcuentas/cargarcuentascontroladas',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idstcuentas'
            }, [
                {
                    name: 'idcuenta'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'text'
                },
                {
                    name: 'descripnaturaleza'
                }
            ]),
            listeners: {
                'load': function(store, records, options) {
                    if (records.length == 0) {
                        mostrarMensaje(1, etiquetas.msgNoHayCuentasControladas);
                    }
                }
            }
        });

        return storeCuentas;
    }
});

/**
 *  Crear el tab de tipos de medios
 **/
Ext.erp.gruposcuentas = new Ext.extend(Ext.FormPanel, {
    constructor: function(config) {
        var _this = this;
        this.id = 'gruposcuentas';
        this.title = config.etiquetas.lbTitleTabCuentasGrupos;
        this.frame = true;
        this.layout = 'border';

        this.gridgruposcuentas = new Ext.erp.GridGruposCuentas({
            etiquetas: config.etiquetas,
            id: 'gridgrupos'
        });

        var btnBuscar = new Ext.Button({
            id: 'btnBuscargrupo',
            icon: perfil.dirImg + 'buscar.png',
            iconCls: 'btn',
            text: config.etiquetas.lbBuscar,
            tooltip: config.etiquetas.lbTpBuscarGrupos,
            handler: function() {
                _this.gridgruposcuentas.store.load();
            }
        });
        this.buttonAlign = 'right';
        /*this.tbar = [
         new Ext.Toolbar.TextItem(config.etiquetas.lbCodigo+':'),
         new Ext.form.TextField({enableKeyEvents: true, id: 'tfCodigoBuscar'}),'',
         new Ext.Toolbar.TextItem(config.etiquetas.lbCmDescripcion+':'),
         new Ext.form.TextField({enableKeyEvents: true, id: 'tfDescripcionBuscar'}),'',
         btnBuscar];*/

        this.items = [_this.gridgruposcuentas];
        this.buttons = [
            {
                text: config.etiquetas.lbBtnGuardar,
                iconCls: 'btn',
                icon: perfil.dirImg + 'guardar.png',
                id: 'idBtnguardarcunetas',
                disabled: true,
                tooltip: config.etiquetas.lbTtBtnGuardarGC,
                handler: function() {
                    var parametros = {};
                    var arr_gruposcuentas = getParametrosGruposCuentas();
                    if (arr_gruposcuentas.length > 0)
                        parametros = arr_gruposcuentas;
                    //barraProgreso(config.etiquetas.msgBPCuentasGuardar,config.etiquetas.titleBP);
                    Ext.Ajax.request({
                        url: '/logistica/activos_fijos/configuracion/index.php/confgruposcuentas/salvargruposcuentas',
                        method: 'POST',
                        params: {
                            parametros: Ext.encode(parametros)
                        },
                        callback: function(options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.CodMsg == 1) {
                                mostrarMensaje(1, config.etiquetas.lbModCorrecGC);
                                Ext.getCmp('idBtnguardarcunetas').disable();;
                                _this.gridgruposcuentas.getSelectionModel().clearSelections();
                                _this.gridgruposcuentas.store.rejectChanges();
                                _this.gridgruposcuentas.store.load();
                            }
                        }
                    })
                }
            }
        ];
        /* this.gridgruposcuentas.getStore().on('load', function(obj){
         for (var i = 0; i < obj.data.items.length; i++) {
         obj.data.items[i].
         }
         });*/

        this.gridgruposcuentas.on('afteredit', function(e) {            
            if (e.field == 'desccuentaActivos') {
                if (e.value == '')
                    e.record.data.idcuentaactivo = '';
                if (e.record.data.idcuentaactivo == e.record.json.idcuentaactivo) {
                    delete e.record.modified['desccuentaActivos'];
                    delete e.record.modified['idcuentaactivo'];
                    _this.gridgruposcuentas.getView().refresh();
                }
            } else if (e.field == 'desccuentaDepreciacion') {
                if (e.value == '')
                    e.record.data.idcuentadepreciacion = '';
                if (e.record.data.idcuentadepreciacion == e.record.json.idcuentadepreciacion) {
                    delete e.record.modified['desccuentaDepreciacion'];
                    delete e.record.modified['idcuentadepreciacion'];
                    _this.gridgruposcuentas.getView().refresh();
                }
            }
            for (var i = 0; i < _this.gridgruposcuentas.getStore().getModifiedRecords().length; i++) {
                if (_this.gridgruposcuentas.getStore().getModifiedRecords()[i] == e.record) {
                    var tiene = false;
                    for (var i in e.record.modified) {
                        tiene = true;
                    }
                    if (!tiene) {
                        _this.gridgruposcuentas.getStore().modified.remove(e.record);
                    }
                }
            }
            if (_this.gridgruposcuentas.getStore().getModifiedRecords().length > 0) {
                Ext.getCmp('idBtnguardarcunetas').enable();
            } else {
                Ext.getCmp('idBtnguardarcunetas').disable();
            }

        })
       
        Ext.erp.gruposcuentas.superclass.constructor.apply(this, arguments);
    },
    dameGrid: function() {
        return this.gridgruposcuentas;
    }
});

function getParametrosGruposCuentas() {
    var modificadosGruposCuentas = Ext.getCmp('gridgrupos').getStore().getModifiedRecords();    
    var arreglo_records = Array();
    
    for (var i = 0; i < modificadosGruposCuentas.length; i++) {
        
        arreglo_records.push({
            idgrupocuenta: modificadosGruposCuentas[i].get('idgrupocuenta'),
            cuentaactivo: modificadosGruposCuentas[i].get('idcuentaactivo'),
            cuentadepreciacion: modificadosGruposCuentas[i].get('idcuentadepreciacion'),
            idgruposubgrupo: modificadosGruposCuentas[i].get('idgruposubgrupo')
        });
    }
    return arreglo_records;
}

function cargarStoresGrupos() {
    Ext.getCmp('gridgrupos').getSelectionModel().clearSelections();
    //Ext.getCmp('gridgrupos').getStore()
    Ext.getCmp('gridgrupos').getStore().load();
}
