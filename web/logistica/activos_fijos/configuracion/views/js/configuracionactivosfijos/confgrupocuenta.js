Ext.erp.ComboCuenta = Ext.extend(LOG.util.TreeCombo, {
    constructor: function(params) {
        var _this = this;
        this.name = 'idcuenta';
        this.url = '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCuentas';
        this.method = 'POST';
        this.selectOnlyLeaf = false;
        this.valores = Array();
        this.selectFn = function(nodo){
            _this.valores.push(nodo.attributes);
            params.grid.setArray(_this.valores);
            var gp = params.grid;
            var sm = params.grid.getSelectionModel();
            var store = gp.getStore();
            var rec = store.getAt(store.indexOf(sm.getSelected()));
            if (params.deno && params.deno.length > 0) {
                rec.set(params.columna, nodo.attributes.idcuenta);
                rec.set(params.deno, nodo.attributes.text);
            } else {
                if(params.columna == 'idcuentaactivo') {
                    rec.set('idcuentaactivo', nodo.attributes.idcuenta);
                    rec.set('desccuentaActivos', nodo.attributes.text);
                }
                if(params.columna == 'idcuentadepreciacion'){
                    rec.set('idcuentadepreciacion', nodo.attributes.idcuenta);
                    rec.set('desccuentaDepreciacion', nodo.attributes.text);
                }
            }

        };

        this.listeners = {
            'blur' : function() {
                var recordSel = params.grid.getSelectionModel().getSelected();
                if(_this.valores.length > 0) {
                    Ext.each(_this.valores, function(r) {
                        if(r.idcuenta == recordSel.data[params.columna])
                            recordSel.set(params.deno, recordSel.data[params.deno]);
                    });
                } else {
                    window.setTimeout(function() {
                        recordSel.set(_this.valoresMod.nom, _this.valoresMod.value);
                    }, 100);
                }
            },
            'focus' :function() {
                var recordSel = params.grid.getSelectionModel().getSelected();
                if(_this.valores.length > 0) {
                    Ext.each(_this.valores, function(r) {
                        if(r.idcuenta == recordSel.data[params.columna]) {
                            _this.setValue(recordSel.data[params.deno])
                            recordSel.set(params.deno, recordSel.data[params.deno]);
                        }
                    });
                } else {
                    _this.valoresMod = {};
                    _this.setValue(recordSel.data[params.deno])
                    recordSel.set(params.deno, recordSel.data[params.deno]);
                    _this.valoresMod['nom'] = params.columna;
                    _this.valoresMod['value'] = recordSel.data[params.columna];
                }
            }
        };
        this.autoLoad= false;
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
        this.array = Array();


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
                editable:true,
                editor: _this.comboCuentasActivos
            }, {
                header: config.etiquetas.lbCuentaDepreciacion,
                width: 250,
                dataIndex: 'desccuentaDepreciacion',
                editable: true,
                editor: _this.comboCuentasDepreciacion
            }
        ]);
        this.clicksToEdit = 1;
        Ext.erp.GridGruposCuentas.superclass.constructor.apply(this, arguments);

    },

    getArray: function() {
        return this.array;
    },

    setArray: function(array) {
        this.array = array;
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

        this.items = [_this.gridgruposcuentas];
        this.buttons = [
            {
                text: config.etiquetas.lbBtnGuardar,
                //iconCls: 'btn',
                iconCls: 'guardar',
                //icon: perfil.dirImg + 'guardar.png',
                id: 'idBtnguardarcunetas',
                disabled: true,
                tooltip: config.etiquetas.lbTtBtnGuardarGC,
                handler: function() {
                    Ext.MessageBox.wait(config.etiquetas.msgEsperaGuardarCnf, "Por favor espere...");
                    var parametros = {};
                    if(_this.dualidad)
                        var arr_gruposcuentas = getParametrosGruposCuentas(_this.monedas);
                    else
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
                            Ext.MessageBox.hide();
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

        });
        this.gridgruposcuentas.getStore().on('update',function(){
            if (_this.gridgruposcuentas.getStore().getModifiedRecords().length > 0) {
                Ext.getCmp('idBtnguardarcunetas').enable();
            } else {
                Ext.getCmp('idBtnguardarcunetas').disable();
            }
        });
        this.fireEvent = this.fireEvent.createSequence(function(e){
            if(e == 'activate')
            {
                _this.setConfigGridPanel(config);
            }
        });
        Ext.erp.gruposcuentas.superclass.constructor.apply(this, arguments);
    },
    dameGrid: function() {
        return this.gridgruposcuentas;
    },

    setConfigGridPanel : function(config) {
        var _this = this;
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/configuracion/index.php/confgruposcuentas/cargarMonedasDeLaEntidad',
            method: 'POST',
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                var array = [new Ext.grid.RowNumberer(
                    {
                        header: 'N\xBA.',
                        width: 30
                    }), {
                    id: 'expandir',
                    width: 320,
                    header: config.etiquetas.lbCmDescripcionGrupo,
                    dataIndex: 'denominacion',
                    renderer: function (v, p, record) {
                        return record.get('codigo') + ' - ' + v;
                    }
                }];

                if(resp.alternativa) {
                    _this.dualidad = resp.alternativa;
                    _this.monedas = resp.monedas;

                    array.push({
                        header: config.etiquetas.lbCuentaActivos+' '+_this.monedas['nomacontable'],
                        width: 180,
                        dataIndex: 'idcuentaactivo',
                        editor: new Ext.erp.ComboCuenta({
                            grid: _this.gridgruposcuentas,
                            columna: 'idcuentaactivo',
                            deno: 'desccuentaActivos'+_this.monedas['nomacontable'].toLowerCase()
                        }),
                        renderer: function(value, metaData, record) {
                            var valores = _this.gridgruposcuentas.getArray();
                            var result = _this.renderColumnas(valores, value);
                            if(result != '')
                                return result;
                            return record.data['desccuentaActivos'+_this.monedas['nomacontable'].toLowerCase()];
                        }
                    });

                    array.push({
                        header: config.etiquetas.lbCuentaActivos+' '+_this.monedas['nomalternativa'],
                        width: 180,
                        dataIndex: 'idcuentaactivoalternativa',
                        editor: new Ext.erp.ComboCuenta({
                            grid: _this.gridgruposcuentas,
                            columna: 'idcuentaactivoalternativa',
                            deno: 'desccuentaActivos'+_this.monedas['nomalternativa'].toLowerCase()
                        }),
                        renderer: function(value, metaData, record) {
                            var valores = _this.gridgruposcuentas.getArray();
                            var result = _this.renderColumnas(valores, value);
                            if(result != '')
                                return result;
                            return record.data['desccuentaActivos'+_this.monedas['nomalternativa'].toLowerCase()]
                        }
                    });

                    array.push({
                        header: config.etiquetas.lbCuentaDepreciacion+' '+_this.monedas['nomacontable'],
                        width: 180,
                        dataIndex: 'idcuentadepreciacion',
                        editor: new Ext.erp.ComboCuenta({
                            grid: _this.gridgruposcuentas,
                            columna: 'idcuentadepreciacion',
                            deno: 'desccuentaDepreciacion'+_this.monedas['nomacontable'].toLowerCase()
                        }),
                        renderer: function(value, metaData, record) {
                            var valores = _this.gridgruposcuentas.getArray();
                            var result = _this.renderColumnas(valores, value);
                            if(result != '')
                                return result;
                            return record.data['desccuentaDepreciacion'+_this.monedas['nomacontable'].toLowerCase()]
                        }
                    });

                    array.push({
                        header: config.etiquetas.lbCuentaDepreciacion+' '+_this.monedas['nomalternativa'],
                        width: 180,
                        dataIndex: 'idcuentadepreciacionalternativa',
                        editor: new Ext.erp.ComboCuenta({
                            grid: _this.gridgruposcuentas,
                            columna: 'idcuentadepreciacionalternativa',
                            deno: 'desccuentaDepreciacion'+_this.monedas['nomalternativa'].toLowerCase()
                        }),
                        renderer: function(value, metaData, record) {
                            var valores = _this.gridgruposcuentas.getArray();
                            var result = _this.renderColumnas(valores, value);
                            if(result != '')
                                return result;
                            return record.data['desccuentaDepreciacion'+_this.monedas['nomalternativa'].toLowerCase()]
                        }
                    });
                    _this.gridgruposcuentas.getColumnModel().setConfig(array);
                    Ext.apply(_this.gridgruposcuentas.getStore(), {
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
                                name: 'desccuentaActivos'+_this.monedas['nomacontable'].toLowerCase()
                            },
                            {
                                name: 'idcuentadepreciacion'
                            },
                            {
                                name: 'desccuentaDepreciacion'+_this.monedas['nomacontable'].toLowerCase()
                            },
                            {
                                name: 'idcuentaactivoalternativa'
                            },
                            {
                                name: 'desccuentaActivos'+_this.monedas['nomalternativa'].toLowerCase()
                            },
                            {
                                name: 'idcuentadepreciacionalternativa'
                            },
                            {
                                name: 'desccuentaDepreciacion'+_this.monedas['nomalternativa'].toLowerCase()
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
                        ])
                    });

                }else{
                    _this.comboCuentasActivos = new Ext.erp.ComboCuenta({
                        grid: _this.gridgruposcuentas,
                        columna: 'idcuentaactivo'
                    });
                    _this.comboCuentasDepreciacion = new Ext.erp.ComboCuenta({
                        grid: _this.gridgruposcuentas,
                        columna: 'idcuentadepreciacion'
                    });
                    array.push({
                        header: config.etiquetas.lbCuentaActivos,
                        width: 250,
                        dataIndex: 'desccuentaActivos',
                        editor: _this.comboCuentasActivos
                    });
                    array.push({
                        header: config.etiquetas.lbCuentaDepreciacion,
                        width: 250,
                        dataIndex: 'desccuentaDepreciacion',
                        editor: _this.comboCuentasDepreciacion
                    });
                    _this.gridgruposcuentas.getColumnModel().setConfig(array);
                }
                _this.doLayout();
                _this.gridgruposcuentas.getStore().load();

            }
        });
    },

    renderColumnas: function(valoresSt, valor) {
        var value = '';
        Ext.each(valoresSt, function(r) {
            if(r.idcuenta == valor)
                value = r.text;
        });
        return value;
    }
});

function getParametrosGruposCuentas(monedas) {
    var modificadosGruposCuentas = Ext.getCmp('gridgrupos').getStore().getModifiedRecords();    
    var arreglo_records = Array();
    
    for (var i = 0; i < modificadosGruposCuentas.length; i++) {
        if(monedas) {
             arreglo_records.push({
                 idgrupocuenta: modificadosGruposCuentas[i].get('idgrupocuenta'),
                 idcuentaactivo: modificadosGruposCuentas[i].get('idcuentaactivo'),
                 idcuentaactivoalternativa: modificadosGruposCuentas[i].get('idcuentaactivoalternativa'),
                 idcuentadepreciacion: modificadosGruposCuentas[i].get('idcuentadepreciacion'),
                 idcuentadepreciacionalternativa: modificadosGruposCuentas[i].get('idcuentadepreciacionalternativa'),
                 idgruposubgrupo: modificadosGruposCuentas[i].get('idgruposubgrupo'),
                 idmonedacontable: monedas['monedacontable'],
                 idmonedaalternativa: monedas['monedaalternativa']
             });

        } else {
            arreglo_records.push({
                idgrupocuenta: modificadosGruposCuentas[i].get('idgrupocuenta'),
                idcuentaactivo: modificadosGruposCuentas[i].get('idcuentaactivo'),
                idcuentadepreciacion: modificadosGruposCuentas[i].get('idcuentadepreciacion'),
                idgruposubgrupo: modificadosGruposCuentas[i].get('idgruposubgrupo')
            });
        }
    }
    return arreglo_records;
}

function cargarStoresGrupos() {
    Ext.getCmp('gridgrupos').getSelectionModel().clearSelections();
    //Ext.getCmp('gridgrupos').getStore()
    //Ext.getCmp('gridgrupos').getStore().load();
}
