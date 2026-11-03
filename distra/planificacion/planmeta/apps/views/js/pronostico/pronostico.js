var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('pronostico', cargarInterfaz);
var esHoja, offset = 0, offsetdin = 0, identidadselected = null, winImp, columnasdinamicas, coldin;
function cargarInterfaz() {
    var _this = this;
    _this.myMaskPron = new Ext.LoadMask(Ext.getBody(), {msg: "cargando..."});
    _this.idByOrgano = {};
    _this.pronosticoModific = {};
    _this.totalOrganos = 0;
    _this.mymask = new Ext.LoadMask(
            Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    _this.arrayColunmasOS = [];
    /**
     * buttons del grid Pronostico
     */
    _this.btnAyudaPronostico = new Ext.Toolbar.Button({
        id: 'idbtnAyudaPronostico',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbAyudaT,
        text: perfil.etiquetas.lbAyuda
    });

    _this.btnAdicionarInd = new Ext.Toolbar.Button({
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        tooltip: 'Adicionar Indicador',
        handler: function () {
            crearIUAddIndicadores();
        }
    });

    _this.btnGuardar = new Ext.Button({
        handler: function () {
            _this.btnGuardar.disable();
            guardarCambios();
        },
        tooltip: perfil.etiquetas.lbTooltipGuardar,
        disabled: true,
        text: '',
        icon: perfil.dirImg + 'guardar.png',
        iconCls: 'btn'
    });

    _this.btnExportarPron = new Ext.Button({
        iconCls: 'exportar',
        tooltip: 'Exportar indicadores Pronosticados',
        //disabled: true,
        handler: function () {
            exportarIndPronosticados();
        }
    });

    _this.stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }]),
        listeners: {
            load: function (t, n, e) {
                _this.cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        }
    });

    _this.stMeses = new Ext.data.Store({
        url: 'getMeses',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'mes'
            }]),
        listeners: {
            load: function (t, n, e) {
                var fechaActual = new Date();
                _this.cmMeses.setValue(t.reader.jsonData.data[fechaActual.getMonth() + 1].iddatosnomenclador);
                _this.btnImportar.enable();
            }
        }
    });

    _this.cmMeses = new Ext.form.ComboBox({
        id: 'iddatosnomenclador',
        store: _this.stMeses,
        displayField: 'mes',
        region: 'north',
        valueField: 'iddatosnomenclador',
        typeAhead: true,
        mode: 'local',
        disabled: false,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        width: 100,
        loadingText: perfil.etiquetas.lbCargando,
        allowBlank: false,
        listeners: {
            select: function () {
                _this.stPronostico.reload();
                _this.btnImportar.enable();
            }
        }
    });

    //Para el trabajo con las UM
    _this.stum = new Ext.data.Store({
        url: 'cargarum',
        id: 'stum',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        },
                [{
                        name: 'idunidadmedida'
                    }, {
                        name: 'denominacionunidadmedida'
                    }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
            }
        }
    });

    _this.cmbEjercicio = new Ext.form.ComboBox({
        width: 100,
        id: 'idejercicioplanif',
        store: _this.stCbejercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        typeAhead: true,
        mode: 'local',
        disabled: false,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: perfil.etiquetas.lbCargando,
        allowBlank: false,
        listeners: {
            select: function () {
                _this.stPronostico.reload();
            }
        }
    });
    /**************IMPORTAR*************************************/
    _this.btnImportar = new Ext.Button({
        id: 'btnImportar',
        iconCls: 'importar',
        tooltip: perfil.etiquetas.lbImportar,
        disabled: true,
        handler: function () {
            winImportar(_this.fpbuscar);
        }
    });


    _this.fpbuscar = new Ext.FormPanel({
        id: 'idFpBuscar',
        labelAlign: 'top',
        region: 'center',
        width: 600,
        frame: true,
        fileUpload: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                xtype: 'fileuploadfield',
                regex: /^.+\.(xls|xlsx)$/i,
                fieldLabel: perfil.etiquetas.lbCargarDoc,
                name: 'file',
                id: 'form-file',
                prevTab: 'idBtnAceptarImp',
                emptyText: perfil.etiquetas.lbSeleccioneArch,
                allowBlank: false,
                anchor: '100%',
                buttonCfg: {
                    text: ':',
                    id: 'idbutton',
                    iconCls: 'importar',
                    icon: perfil.dirImg + 'buscar.png'
                }
            }]
    });
    /**************IMPORTAR*************************************/
    _this.tpEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 600
            });
    _this.tpEntidades.btnBuscar.setText("");
    _this.tpEntidades.btnLimpiar.setText("");
    _this.tpEntidades = tpEntidades.items.items[0];
    _this.tpEntidades.getRootNode().expand();
    _this.tpEntidades.region = 'west';
    _this.tpEntidades.addListener('click', function (n) {
        if (n.text != "Estructuras") {
            _this.gridPronost.enable();
            _this.cmbEjercicio.enable();
            identidadselected = n.id;
            _this.stPronostico.reload();
            _this.tpEntidades.getSelectionModel().select(n);
            if (n.leaf == true) {
                esHoja = 1;
            } else if (n.leaf == false) {
                esHoja = 0;
            }
        } else {
            _this.gridPronost.disable();
            _this.cmbEjercicio.disable();
            var storeGridPr = _this.gridPronost.getStore();
            storeGridPr.removeAll();
        }
    });
    _this.arrayNameColumnas = [];
    _this.arrayColunmasOS = [{
            header: perfil.etiquetas.colHeaderCodigo,
            tooltip: perfil.etiquetas.colTooltipCodigo,
            dataIndex: 'codigo',
            align: 'left',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.colHeaderProducto,
            id: 'expandir',
            align: 'left',
            tooltip: perfil.etiquetas.colTooltipProducto,
            dataIndex: 'denominacion',
            renderer: crearToolTip

        }, {header: 'UM',
            align: 'left',
            tooltip: 'Unidad de medida',
            dataIndex: 'idunidadmedida',
            width: 80,
            renderer: renderUM

        }, {
            header: perfil.etiquetas.colHeaderCantPlan,
            tooltip: perfil.etiquetas.colTooltipCantPlan,
            width: 120,
            dataIndex: 'cantplanif',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.colHeaderCantPron,
            tooltip: perfil.etiquetas.colTooltipCantPron,
            width: 140,
            dataIndex: 'cantpron',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.colHeaderPorcientoPron,
            tooltip: perfil.etiquetas.colTooltipPorcientoPron,
            width: 140,
            dataIndex: 'pocientopron',
            align: 'right',
            renderer: crearToolTip
        }];
    _this.gridPronost = gestGridPronostico(_this.arrayColunmasOS, _this.btnImportar, _this.btnGuardar,_this.btnAdicionarInd,_this.btnExportarPron);
    _this.pPronostico = new Ext.Panel({
        layout: 'border',
        region: 'center',
        border: false,
        items: [_this.gridPronost]
    });
    _this.pGeneral = new Ext.Panel({
        layout: 'border',
        border: false,
        tbar: [],
        items: [_this.tpEntidades, _this.pPronostico]
    });
    view = new Ext.Viewport({
        layout: 'fit',
        items: [_this.pGeneral]
    });
}

/**
 * funcion que devuelve el grid de pronostico (El prinicpal)
 * @param colDinamicas
 * @param btnImportar
 * @param btnGuardar
 * @returns {*}
 */
function gestGridPronostico(colDinamicas, btnImportar, btnGuardar,btnAdicionarInd,btnExportarPron) {
    var _this = this;
    _this.cmDinamicas = new Ext.grid.ColumnModel(colDinamicas);
    _this.smPronostico = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    _this.filtrosPronostico = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'listado',
                dataIndex: 'idunidadmedida',
                idcombo: 'idcbunidadmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: _this.stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'cantplanif'
            }, {
                type: 'numeric',
                dataIndex: 'cantpron'
            }, {
                type: 'numeric',
                dataIndex: 'pocientopron'
            }]
    });
    _this.stPronostico = new Ext.data.Store({
        url: 'getOrganosbyIndicador',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idunidadmedida'
            }, {
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'cantplanif'
            }, {
                name: 'pronostico'
            }, {
                name: 'organo'
            }, {
                name: 'idorganosatisface'
            }, {
                name: 'cantpron'
            }, {
                name: 'pocientopron'
            }]),
        listeners: {
            beforeload: function () {

                _this.myMaskPron.show();
                Ext.Ajax.timeout = 600000;
                this.baseParams.idEntidad = identidadselected;
                this.baseParams.idMes = _this.cmMeses.getValue();
                this.baseParams.idEjercicio = _this.cmbEjercicio.getValue();
                this.baseParams.start = offset;
                this.baseParams.Arrayfiltros = Ext.encode(_this.filtrosPronostico.getFilterData());
            },
            beforechange: function (p, e) {

            },
            load: function (me, rec) {
                cambiarTituloFiltrar(_this.gPronostico, _this.filtrosPronostico, "Indicadores", _this.gPronostico);
                _this.myMaskPron.hide();
                if (rec.length == 0) {
                    mostrarMensaje(1, perfil.etiquetas.emptyLoadGrid);
                } else {
                    gestionarColumnas(rec, colDinamicas);
                }
            }
        }
    });
    _this.gPronostico = new Ext.grid.EditorGridPanel({
        store: _this.stPronostico,
        title: 'Indicadores',
        disabled: true,
        cm: _this.cmDinamicas,
        sm: _this.smPronostico,
        tbar: ['Mes: ', _this.cmMeses, '-', perfil.etiquetas.lbEjerc, _this.cmbEjercicio, btnImportar, btnGuardar,btnAdicionarInd, btnExportarPron, '->', _this.btnAyudaPronostico],
        autoExpandColumn: 'expandir',
        region: 'center',
        width: 100,
        height: '60%',
        plugins: [_this.filtrosPronostico],
        listeners: {
            celldblclick: function () {
            },
            beforeedit: function (object) {
                if (object.value == "-") {
                    object.cancel = true;
                } else {
                    object.cancel = false;
                    _this.btnGuardar.enable();
                }
            },
            afteredit: function (record) {
                _this.pronosticoModific[parseFloat(record.record.data.codigo)] = record.record.data;
                var valueOld = parseFloat(record.originalValue);
                var dataPron = parseFloat(record.record.data.cantpron);
                var valueNew = parseFloat(record.value);
                var valueCantPron = (dataPron - valueOld) + valueNew;
                record.record.set('cantpron', Math.round(valueCantPron * Math.pow(10, 6)) / Math.pow(10, 6));
                var cantPlanif = parseFloat(record.record.data.cantplanif);
                var porcPron = cantPlanif > 0 ? Math.round(((valueCantPron * 100) / cantPlanif) * Math.pow(10, 6)) / Math.pow(10, 6) :0;
                record.record.set('pocientopron',porcPron);
            }
        },
        bbar: new Ext.PagingToolbar({
            store: _this.stPronostico,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: perfil.etiquetas.lbLimp,
                    handler: function () {
                        _this.filtrosPronostico.clearFilters();
                    }
                }],
            displayMsg: perfil.etiquetas.displayMsg,
            emptyMsg: perfil.etiquetas.emptyMsg,
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        })
    });
    return _this.gPronostico;
}

/**
 * funcion para addicionar las columnas de formar dinamica
 * @param record
 * @param colDinamicas
 */
function gestionarColumnas(record, colDinamicas) {
    var _this = this;

    for (var i = 0; i < record.length; i++) {
        if (record[i].data.organo != null) {
            var col = record[i].data.organo.split(',');
            var idOrganos = record[i].data.idorganosatisface.split(',');
            _this.dataCol = record[i].data.pronostico.split(',');
            for (var j = 0; j < col.length; j++) {
                if (!existColumna(col[j], colDinamicas)) {
                    _this.idByOrgano[col[j].toLocaleLowerCase()] = idOrganos[j];
                    _this.arrayNameColumnas.push(col[j]);
                    colDinamicas.push({
                        header: col[j],
                        tooltip: col[j],
                        width: 100,
                        renderer: crearToolTip,
                        align: 'right',
                        dataIndex: col[j].toLocaleLowerCase(),
                        editor: new Ext.form.NumberField({
                            allowNegative: false,
                            decimalPrecision: 6,
                            allowBlank: false,
                            regex: /^([0-9.]+ ?[0-9.]*)+$/,
                            regexText: 'El tama?o m?ximo requerido es 9 d?gitos',
                            maxLength: 9,
                            maxLengthText: 'El tama?o m?ximo requerido es 9 d?gitos.',
                            listeners: {}
                        })
                    });
                }
                record[i].set(col[j].toLocaleLowerCase(), _this.dataCol[j] == "" ? 0.000000 : _this.dataCol[j]);
            }
        }
    }
    setRecordAll(record, _this.arrayNameColumnas);
    _this.cmDinamicas = new Ext.grid.ColumnModel(colDinamicas);
    _this.totalOrganos = colDinamicas.length;
    _this.gPronostico.reconfigure(_this.stPronostico, _this.cmDinamicas);
}

/**
 * funcion para revisar si existe una colunmma(X) en el arreglo de colunmas (X) si esta la devuelvo y si no return false
 * @param columna
 * @param colDinamicas
 * @returns {*}
 */
function existColumna(columna, colDinamicas) {
    var band = false;
    var columnaSel = null;
    for (var i = 0; i < colDinamicas.length; i++) {
        if (colDinamicas[i].header === columna) {
            band = true;
            columnaSel = i;
        }
    }
    return columnaSel != null ? columnaSel : band;
}

/**
 * funcion para rellenar las filas en blancos en el grid de pronostico por parte de los organos demandantes
 * @param record
 * @param colDinamicas
 */
function setRecordAll(record, colDinamicas) {
    var organosRec = record;
    var contRec = 0;
    for (var i = 0; i < record.length; i++) {
        for (var j = 0; j < colDinamicas.length; j++) {
            if (record[i].data[colDinamicas[j].toLocaleLowerCase()] == undefined) {
                record[i].set(colDinamicas[j].toLocaleLowerCase(), "-");
            }
        }
    }
}

function setRecordsCantPronos(record) {

    var contRec = 0;
    for (var i = 0; i < record.length; i++) {
        var pronostico = record[i].data.pronostico.split(',');
        var total = 0;
        for (var j = 0; j < pronostico.length; j++) {
            total = +parseInt(pronostico[j]);
        }
    }
}

/**
 * funcion para guardar los cambios del grid de pronostico
 */
function guardarCambios() {
    var _this = this;
    var modified = [];
    var modified = _this.pronosticoModific;
    var options = _this.idByOrgano;
    gestionarActionPronosticos(modified, 'mod', options);
}

/**
 * funcion para el envio de datos para el servidor
 * @param arrayPronostico
 * @param action
 * @param options
 */
function gestionarActionPronosticos(arrayPronostico, action, options) {
    var _this = this;
    var idMes = _this.cmMeses.getValue();
    var idEjercicio = _this.cmbEjercicio.getValue();
    var idEntidad = identidadselected;

    Ext.Ajax.request({
        url: 'gestionarPronostico',
        params: {
            pronosticos: Ext.encode(arrayPronostico),
            options: Ext.encode(options),
            idMes: idMes,
            idEjercicio: idEjercicio,
            idEntidad: idEntidad,
            total: _this.totalOrganos,
            action: action
        },
        callback: function (options, success, response) {
            _this.pronosticoModific = {};
            _this.stPronostico.reload();

        }
    });
}
/**
 * Gestionar el titulo del grid de indicadores con la informacion de los filtros activos
 * @param gridPanel
 * @param filtro
 * @param etiqueta
 * @param panel
 */
function cambiarTituloFiltrar(gridPanel, filtro, etiqueta, panel) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        panel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        panel.setTitle(etiqueta + ' <i>' + 'Filtrado por: ' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

/**
 * funcion para exportar los datos
 */
function exportarIndPronosticados() {
    var _this = this;
    var idEntidad = identidadselected;
    var textEntidad = _this.tpEntidades.text;
    var idMes = _this.cmMeses.getValue();
    var idEjercicio = _this.cmbEjercicio.getValue();
    Ext.encode(_this.filtrosPronostico.getFilterData());
    var win = window.open('exportar?idEntidad=' + idEntidad + '&idMes=' + idMes + '&idEjercicio=' + idEjercicio +
        '& filtros=' + Ext.encode(_this.filtrosPronostico.getFilterData())+'&textEntidad=' + textEntidad+
        '&colunmasDinamicas='+Ext.encode(_this.arrayNameColumnas));
}

function winImportar() {
    var _this = this;
    if (!_this.winImp) {
        _this.winImp = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            title: perfil.etiquetas.lbImportarExcel,
            width: 400,
            height: 150,
            buttons: [{
                    iconCls: 'cancelar',
                    text: perfil.etiquetas.lbBtnCancelar,
                    tooltip: perfil.etiquetas.lbTtbtnCancelar,
                    handler: function () {
                        _this.winImp.hide();
                    }
                }, {
                    iconCls: 'aceptar',
                    text: perfil.etiquetas.lbBtnAceptar,
                    tooltip: perfil.etiquetas.lbTtbtnAceptar,
                    handler: function () {
                        importar();
                    }
                }]
        });
    }
    _this.fpbuscar.getForm().reset();
    _this.winImp.show();
    _this.winImp.add(_this.fpbuscar);
    _this.winImp.doLayout();
}

function importar() {
    var _this = this;
    try {
        if (_this.fpbuscar.getForm().isValid()) {
            _this.barra = Ext.MessageBox.show({
                msg: perfil.etiquetas.lbEspere,
                width: 270,
                wait: true,
                progress: true,
                closable: false
            });
            _this.btnCerrarWin = new Ext.Button({
                text: perfil.etiquetas.lbCerrar,
                disabled: true,
                id: 'btn',
                tooltip: perfil.etiquetas.lbCerrar,
                iconCls: 'aceptar'
            });
            _this.fpbuscar.getForm().submit(
                    {
                        url: 'importarFicheroPronostico',
                        timeout: 1800000, //milisegundos = 30 min
                        method: 'POST',
                        params: {
                            idejercicio: _this.cmbEjercicio.getValue(),
                            identidad: identidadselected

                        },
                        failure: function (form, action) {
                            _this.barra.hide();
                            _this.winImp.hide();
                            _this.coldin = action.result.columnasdinamicas;

                            //creando el objeto fila de las columnas dinamicas
                            _this.FilaOS = Ext.data.Record.create([
                                {
                                    name: 'denominacionOS',
                                    type: 'string'
                                },
                                {
                                    name: 'posicionOS',
                                    type: 'numeric'
                                },
                                {
                                    name: 'idOS',
                                    type: 'numeric'
                                }]);

                            //creando el objeto fila de las columnas excel
                            _this.FilaExcel = Ext.data.Record.create([
                                {
                                    name: 'denomcolumnaExcel',
                                    type: 'string'
                                },
                                {
                                    name: 'posicioncolumnaExcel',
                                    type: 'numeric'
                                }]);

                            Fila = Ext.data.Record.create([
                                {
                                    name: 'denominacionOS',
                                    type: 'string'
                                },
                                {
                                    name: 'denomcolumnaExcel',
                                    type: 'string'
                                },
                                {
                                    name: 'posicionOS',
                                    type: 'numeric'
                                },
                                {
                                    name: 'posicioncolumnaExcel',
                                    type: 'numeric'
                                },
                                {
                                    name: 'relacion',
                                    type: 'string'
                                },
                                {
                                    name: 'idOS',
                                    type: 'numeric'
                                }]);

                            _this.btnAsociarOrden = new Ext.Button({
                                disabled: true,
                                id: 'btnAsociarOrden',
                                tooltip: perfil.etiquetas.lbRelColOrden,
                                style: 'margin-left:10px;margin-rigth:10px;margin-top:50px',
                                icon: perfil.dirImg + 'incluir.png',
                                iconCls: 'btn',
                                handler: function () {
                                    addRelacionTodas();
                                }
                            });

                            _this.btnSiguiente = new Ext.Button({
                                disabled: true,
                                id: 'btnsiguiente',
                                tooltip: perfil.etiquetas.lbRelCol,
                                style: 'margin-left:10px;margin-rigth:10px;margin-top:40px',
                                icon: perfil.dirImg + 'siguiente.png',
                                iconCls: 'btn',
                                handler: function () {
                                    addRelacion();
                                }
                            });

                            _this.btnAnterior = new Ext.Button({
                                disabled: true,
                                id: 'btnAnterior',
                                tooltip: perfil.etiquetas.lbelimRel,
                                style: 'margin-left:10px;margin-rigth:10px;margin-top:10px',
                                icon: perfil.dirImg + 'anterior.png',
                                iconCls: 'btn',
                                handler: function () {
                                    eliminarnom();
                                }
                            });

                            _this.btnDesociarTodas = new Ext.Button({
                                disabled: true,
                                id: 'btnDesociarTodas',
                                tooltip: perfil.etiquetas.lbelimRels,
                                style: 'margin-left:10px;margin-rigth:10px;margin-top:40px',
                                icon: perfil.dirImg + 'deshacer.png',
                                iconCls: 'btn',
                                handler: function () {
                                    eliminarnomTodas();
                                }
                            });

                            //grid panel para columnas
                            _this.stNomen = new Ext.data.SimpleStore({
                                fields: ['denominacionOS', 'posicionOS', 'idOS'],
                                data: action.result.columnas,
                                sorters: [{
                                        property: 'posicionOS',
                                        direction: 'ASC'
                                    }],
                                sortRoot: 'posicionOS',
                                sortOnLoad: true,
                                remoteSort: false
                            });
                            _this.cmNomencladores = new Ext.grid.ColumnModel([{
                                    id: 'expandir',
                                    header: perfil.etiquetas.lbDenom,
                                    tooltip: perfil.etiquetas.lbDenom,
                                    dataIndex: 'denominacionOS',
                                    sortable: true,
                                    renderer: crearToolTip
                                }]);
                            _this.smNomencladores = new Ext.grid.RowSelectionModel({
                                singleSelect: true
                            });
                            _this.smNomencladores.on('selectionchange', function (sm) {
                                if (sm.getSelections().length == 1 && _this.smNomencladoresExcel.getSelections().length == 1 && _this.stNomen.getCount() <= _this.stNomenExcel.getCount()) {
                                    _this.btnSiguiente.enable();
                                } else {
                                    _this.btnSiguiente.disable();
                                }
                            });
                            _this.gpNomencladores = new Ext.grid.GridPanel({
                                loadMask: {
                                    msg: perfil.etiquetas.lbEspere
                                },
                                store: _this.stNomen,
                                sm: _this.smNomencladores,
                                cm: _this.cmNomencladores,
                                region: 'east',
                                autoExpandColumn: 'expandir',
                                margins: '2 2 2 2',
                                anchor: '100%'
                            });
                            _this.pgpNomencladores = new Ext.Panel({
                                labelAlign: 'top',
                                title: perfil.etiquetas.lbCol,
                                height: 285,
                                frame: true,
                                border: true,
                                anchor: '95%',
                                layout: 'fit',
                                items: [_this.gpNomencladores]

                            });

                            //grid panel para columnas del excel
                            _this.stNomenExcel = new Ext.data.SimpleStore({
                                fields: ['denomcolumnaExcel', 'posicioncolumnaExcel'],
                                data: action.result.columnasExcel,
                                sorters: [{
                                        property: 'posicioncolumnaExcel',
                                        direction: 'ASC'
                                    }],
                                sortRoot: 'posicioncolumnaExcel',
                                sortOnLoad: true,
                                remoteSort: false
                            });
                            _this.cmNomencladoresExcel = new Ext.grid.ColumnModel([{
                                    id: 'expandir',
                                    header: perfil.etiquetas.lbDenominacion,
                                    tooltip: perfil.etiquetas.lbDenominacion,
                                    dataIndex: 'denomcolumnaExcel',
                                    sortable: true,
                                    renderer: crearToolTip
                                }]);
                            _this.smNomencladoresExcel = new Ext.grid.RowSelectionModel({
                                singleSelect: true
                            });
                            _this.smNomencladoresExcel.on('selectionchange', function (sm) {
                                if (sm.getSelections().length == 1 && _this.smNomencladores.getSelections().length == 1 && _this.stNomen.getCount() <= _this.stNomenExcel.getCount()) {
                                    _this.btnSiguiente.enable();
                                } else {
                                    _this.btnSiguiente.disable();
                                }
                            });
                            _this.gpNomencladoresExcel = new Ext.grid.GridPanel({
                                loadMask: {
                                    msg: perfil.etiquetas.lbEspere
                                },
                                store: _this.stNomenExcel,
                                sm: _this.smNomencladoresExcel,
                                cm: _this.cmNomencladoresExcel,
                                region: 'east',
                                autoExpandColumn: 'expandir',
                                margins: '2 2 2 2',
                                anchor: '100%'
                            });
                            _this.pgpNomencladoresExcel = new Ext.Panel({
                                labelAlign: 'top',
                                title: perfil.etiquetas.lbColExcel,
                                height: 285,
                                frame: true,
                                border: true,
                                anchor: '100%',
                                layout: 'fit',
                                items: [_this.gpNomencladoresExcel]
                            });

                            //grid panel para relacionar columnas
                            _this.stNomenRelacion = new Ext.data.Store({
                                enableKeyEvents: true,
                                reader: new Ext.data.JsonReader({
                                    root: 'data'
                                }, [{
                                        name: 'denominacionOS'
                                    }, {
                                        name: 'denomcolumnaExcel'
                                    }, {
                                        name: 'posicionOS'
                                    }, {
                                        name: 'posicioncolumnaExcel'
                                    }, {
                                        name: 'relacion'
                                    }, {
                                        name: 'idOS'
                                    }]),
                                sorters: [{
                                        property: 'posicionOS',
                                        direction: 'ASC'
                                    }],
                                sortRoot: 'posicionOS',
                                sortOnLoad: true,
                                remoteSort: false
                            });
                            _this.cmNomencladoresRelacion = new Ext.grid.ColumnModel([{
                                    id: 'expandir',
                                    header: perfil.etiquetas.lbDenominacion,
                                    tooltip: perfil.etiquetas.lbDenominacion,
                                    dataIndex: 'relacion',
                                    sortable: true,
                                    renderer: crearToolTip
                                }]);
                            _this.smNomencladoresRelacion = new Ext.grid.RowSelectionModel({
                                singleSelect: false
                            });
                            _this.smNomencladoresRelacion.on('selectionchange', function (sm) {
                                if (sm.getSelections().length != 0) {
                                    _this.btnAnterior.enable();
                                } else {
                                    _this.btnAnterior.disable();
                                }
                            });
                            _this.gpNomencladoresRelacion = new Ext.grid.GridPanel({
                                loadMask: {
                                    msg: perfil.etiquetas.lbEspere
                                },
                                store: _this.stNomenRelacion,
                                sm: _this.smNomencladoresRelacion,
                                cm: _this.cmNomencladoresRelacion,
                                region: 'east',
                                autoExpandColumn: 'expandir',
                                margins: '2 2 2 2',
                                anchor: '100%', listeners: {
                                    rowdblclick: function () {
                                        eliminarnom();
                                    }
                                }
                            });
                            _this.pgpNomencladoresRelacion = new Ext.Panel({
                                labelAlign: 'top',
                                title: perfil.etiquetas.lbColRel,
                                height: 285,
                                frame: true,
                                border: true,
                                anchor: '100%',
                                layout: 'fit',
                                items: [_this.gpNomencladoresRelacion]

                            });
                            _this.pRelacionarColumnas = new Ext.Panel({
                                labelAlign: 'top',
                                height: 300,
                                width: 800,
                                frame: true,
                                layout: 'form',
                                items: [{
                                        layout: 'column',
                                        items: [{
                                                columnWidth: .40,
                                                layout: 'form',
                                                items: [_this.pgpNomencladores]
                                            },
                                            {
                                                columnWidth: .27,
                                                layout: 'form',
                                                items: [_this.pgpNomencladoresExcel]
                                            },
                                            {
                                                columnWidth: .06,
                                                layout: 'form',
                                                items: [_this.btnAsociarOrden, _this.btnSiguiente, _this.btnAnterior, _this.btnDesociarTodas]
                                            },
                                            {
                                                columnWidth: .27,
                                                layout: 'form',
                                                items: [_this.pgpNomencladoresRelacion]
                                            }]
                                    }]

                            });
                            _this.winRelacionarColumnas = new Ext.Window({
                                modal: true,
                                id: 'winRelacionarColumnas',
                                closeAction: 'destroy',
                                layout: 'fit',
                                constrain: true,
                                items: [_this.pRelacionarColumnas],
                                title: perfil.etiquetas.lbRelCol,
                                buttons: [{
                                        icon: perfil.dirImg + 'cancelar.png',
                                        iconCls: 'btn',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.lbTtbtnCancelar,
                                        handler: function () {
                                            _this.winRelacionarColumnas.destroy();
                                        }
                                    }, {
                                        icon: perfil.dirImg + 'validar.png',
                                        iconCls: 'btn',
                                        id: 'btnValidar',
                                        disabled: true,
                                        text: perfil.etiquetas.lbValidar,
                                        tooltip: perfil.etiquetas.lbValidarD,
                                        handler: function () {
                                            _this.mymask.show();
                                            var rel = _this.stNomenRelacion.getRange();
                                            var relaciones = [];
                                            for (var index = 0; index < _this.stNomenRelacion.getCount(); index++) {
                                                relaciones.push({
                                                    denominacionOS: rel[index].data.denominacionOS,
                                                    denomcolumnaExcel: rel[index].data.denomcolumnaExcel,
                                                    posicionOS: rel[index].data.posicionOS,
                                                    idOS: rel[index].data.idOS,
                                                    posicioncolumnaExcel: rel[index].data.posicioncolumnaExcel
                                                });
                                            }
                                            ;
                                            Ext.Ajax.request({
                                                url: 'importarDatosRelacionados',
                                                params: {
                                                    coldin: Ext.encode(_this.coldin),
                                                    relaciones: Ext.encode(relaciones),
                                                    idejercicio: _this.cmbEjercicio.getValue(),
                                                    identidad: identidadselected
                                                },
                                                callback: function (options, success, response) {
                                                    _this.winRelacionarColumnas.destroy();
                                                    response = Ext.decode(response.responseText);
                                                    _this.tabla = response.tabla;
                                                    _this.campos = response.campos;
                                                    _this.columnasdinamicasindex = response.columnasdinamicasindex;
                                                    mostrarResultadoValidacion();
                                                }
                                            });
                                        }
                                    }]
                            });
                            _this.winRelacionarColumnas.show();
                            if (_this.stNomen.getCount() <= _this.stNomenExcel.getCount())
                                _this.btnAsociarOrden.enable();
                            if (_this.stNomenRelacion.getCount() != 0)
                                _this.btnDesociarTodas.enable();
                        }

                    }
            );
        } else {
            mostrarMensaje(1, perfil.etiquetas.lbCamposIncorrectos);
        }

    } catch (e) {
    }
}

function addRelacion() {
    var _this = this;
    var recordSel = _this.smNomencladores.getSelections();
    var recordSelExc = _this.smNomencladoresExcel.getSelections();

    _this.stNomen.remove(recordSel[0]);
    _this.stNomenExcel.remove(recordSelExc[0]);

    var p = new Fila({
        denominacionOS: recordSel[0].data.denominacionOS,
        posicionOS: recordSel[0].data.posicionOS,
        idOS: recordSel[0].data.idOS,
        denomcolumnaExcel: recordSelExc[0].data.denomcolumnaExcel,
        posicioncolumnaExcel: recordSelExc[0].data.posicioncolumnaExcel,
        relacion: recordSel[0].data.denominacionOS + " / " + recordSelExc[0].data.denomcolumnaExcel
    });

    _this.stNomenRelacion.add(p);

    _this.stNomenRelacion.sort('posicionOS', 'ASC');
    _this.stNomen.sort('posicionOS', 'ASC');
    _this.stNomenExcel.sort('posicioncolumnaExcel', 'ASC');

    if (_this.stNomen.getCount() == 0)
        Ext.getCmp('btnValidar').enable();

    if (_this.stNomen.getCount() <= _this.stNomenExcel.getCount())
        _this.btnAsociarOrden.enable();
    else
        _this.btnAsociarOrden.disable();

    if (_this.stNomenRelacion.getCount() != 0)
        _this.btnDesociarTodas.enable();
    else
        _this.btnDesociarTodas.disable();
}

function addRelacionTodas() {
    var _this = this;
    var records = _this.stNomen.getRange();
    var recordsExcel = _this.stNomenExcel.getRange();
    var contador = _this.stNomen.getCount();

    for (var index = 0; index < contador; index++) {
        var p = new Fila({
            denominacionOS: records[index].data.denominacionOS,
            posicionOS: records[index].data.posicionOS,
            idOS: records[index].data.idOS,
            denomcolumnaExcel: recordsExcel[index].data.denomcolumnaExcel,
            posicioncolumnaExcel: recordsExcel[index].data.posicioncolumnaExcel,
            relacion: records[index].data.denominacionOS + " / " + recordsExcel[index].data.denomcolumnaExcel
        });

        _this.stNomenRelacion.add(p);
        _this.stNomen.remove(records[index]);
        _this.stNomenExcel.remove(recordsExcel[index]);
    }

    _this.stNomenRelacion.sort('posicionOS', 'ASC');
    _this.stNomen.sort('posicionOS', 'ASC');
    _this.stNomenExcel.sort('posicioncolumnaExcel', 'ASC');

    if (_this.stNomen.getCount() == 0)
        Ext.getCmp('btnValidar').enable();

    if (_this.stNomen.getCount() <= _this.stNomenExcel.getCount())
        _this.btnAsociarOrden.enable();
    else
        _this.btnAsociarOrden.disable();

    if (_this.stNomenRelacion.getCount() != 0)
        _this.btnDesociarTodas.enable();
    else
        _this.btnDesociarTodas.disable();
}

function eliminarnom() {
    var _this = this;
    var recordsSel = _this.smNomencladoresRelacion.getSelections();

    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++) {
            var recordSel = recordsSel[i];
            var pTipMod = new FilaOS({
                denominacionOS: recordSel.data.denominacionOS,
                posicionOS: recordSel.data.posicionOS,
                idOS: recordSel.data.idOS
            });

            _this.stNomen.add(pTipMod);

            var pExcel = new FilaExcel({
                denomcolumnaExcel: recordSel.data.denomcolumnaExcel,
                posicioncolumnaExcel: recordSel.data.posicioncolumnaExcel
            });
            _this.stNomenExcel.add(pExcel);
            _this.stNomenRelacion.remove(recordSel);
        }

        if (_this.stNomen.getCount() != 0)
            Ext.getCmp('btnValidar').disable();
    }

    _this.stNomenRelacion.sort('posicionOS', 'ASC');
    _this.stNomen.sort('posicionOS', 'ASC');
    _this.stNomenExcel.sort('posicioncolumnaExcel', 'ASC');

    if (_this.stNomen.getCount() <= _this.stNomenExcel.getCount())
        _this.btnAsociarOrden.enable();
    else
        _this.btnAsociarOrden.disable();

    if (_this.stNomenRelacion.getCount() != 0)
        _this.btnDesociarTodas.enable();
    else
        _this.btnDesociarTodas.disable();
}

function eliminarnomTodas() {
    var _this = this;
    var records = _this.stNomenRelacion.getRange();
    var contador = _this.stNomenRelacion.getCount();

    for (var i = 0; i < contador; i++) {

        var pTipMod = new FilaOS({
            denominacionOS: records[i].data.denominacionOS,
            posicionOS: records[i].data.posicionOS,
            idOS: records[i].data.idOS
        });

        _this.stNomen.add(pTipMod);

        var pExcel = new FilaExcel({
            denomcolumnaExcel: records[i].data.denomcolumnaExcel,
            posicioncolumnaExcel: records[i].data.posicioncolumnaExcel
        });

        _this.stNomenExcel.add(pExcel);
        _this.stNomenRelacion.remove(records[i]);
    }

    _this.stNomenRelacion.sort('posicionOS', 'ASC');
    _this.stNomen.sort('posicionOS', 'ASC');
    _this.stNomenExcel.sort('posicioncolumnaExcel', 'ASC');

    if (_this.stNomen.getCount() != 0)
        Ext.getCmp('btnValidar').disable();

    if (_this.stNomen.getCount() <= _this.stNomenExcel.getCount())
        _this.btnAsociarOrden.enable();
    else
        _this.btnAsociarOrden.disable();

    if (_this.stNomenRelacion.getCount() != 0)
        _this.btnDesociarTodas.enable();
    else
        _this.btnDesociarTodas.disable();
}

function mostrarResultadoValidacion() {
    var _this = this;

    //grid panel para mostrar la validacion de los datos
    _this.readerdina = [];
    _this.readerdina.push({
        name: 'codigo'
    });

    _this.cmdina = [];
    _this.cmdina.push({
        header: perfil.etiquetas.lbCodigo,
        tooltip: perfil.etiquetas.lbCodigo,
        dataIndex: 'codigo',
        id: 'expandir',
        renderer: crearToolTip,
        sortable: true
    });

    _this.filterDinamico = [];

    _this.filterDinamico.push({
        type: 'string',
        dataIndex: 'codigo'
    });

    for (var index = 0; index < _this.coldin.length; index++) {
        _this.readerdina.push({
            name: _this.columnasdinamicasindex[index]
        });
        _this.cmdina.push({
            header: _this.coldin[index][0],
            sortable: true,
            align: 'center',
            dataIndex: _this.columnasdinamicasindex[index],
            tooltip: _this.coldin[index][0],
            renderer: crearToolTipDin
        });
        _this.filterDinamico.push({
            type: 'numeric',
            dataIndex: _this.columnasdinamicasindex[index]
        });
    }
    _this.readerdina.push({
        name: 'denominaciondato'
    });
    _this.cmdina.push({
        header: 'Error',
        sortable: true,
        hidden: true,
        align: 'center',
        dataIndex: 'denominaciondato',
        tooltip: 'Error',
        renderer: crearToolTip
    });
    _this.stDatosVal = new Ext.data.GroupingStore({
        url: 'listarDatosValidados',
        sortInfo: {
            field: 'denominaciondato',
            direction: "ASC"
        },
        groupField: 'denominaciondato',
        listeners: {
            beforeload: function (st) {
                st.baseParams.coldin = Ext.encode(_this.columnasdinamicasindex);
                st.baseParams.start = _this.offsetdin;
            },
            load: function (t, n, e) {
                _this.winDatosVal.show();
                Ext.getCmp('btnAdicionar').enable();
                _this.mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            fields: _this.readerdina
        })
    });
    _this.cmDatosVal = new Ext.grid.ColumnModel(_this.cmdina);
    _this.smDatosVal = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    _this.filtrosDin = new Ext.grid.GridFilters({
        filters: _this.filterDinamico
    });

    _this.btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiarImp,
        handler: function () {
            _this.filtrosDin.clearFilters();
        }
    });

    _this.gpDatosVal = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        store: _this.stDatosVal,
        sm: _this.smDatosVal,
        cm: _this.cmDatosVal,
        region: 'east',
        autoExpandColumn: 'expandir',
        margins: '2 2 2 2',
        anchor: '100%',
        plugins: _this.filtrosDin,
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Indicadores" : "Indicador"]})'
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stDatosVal,
            displayInfo: true,
            items: [_this.btnLimpiarFiltros],
            listeners: {
                beforechange: function (p, e) {
                    _this.offsetdin = e.start;
                }
            }
        })
    });

    _this.pgpDatosVal = new Ext.Panel({
        labelAlign: 'top',
        title: perfil.etiquetas.lbDatVal,
        frame: true,
        border: true,
        anchor: '100%',
        layout: 'fit',
        items: [_this.gpDatosVal]
    });

    _this.winDatosVal = new Ext.Window({
        modal: true,
        id: 'winDatosVal',
        closeAction: 'destroy',
        layout: 'fit',
        constrain: true,
        height: 500,
        width: 1000,
        items: [_this.pgpDatosVal],
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtbtnCancelar,
                handler: function () {
                    _this.winDatosVal.destroy();
                }
            }, {
                icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'btn',
                id: 'btnAdicionar',
                disabled: true,
                text: perfil.etiquetas.lbIns,
                tooltip: perfil.etiquetas.lbInsD,
                handler: function () {
                    _this.mymask.show();
                    insertarDatos();
                }
            }]
    });

    _this.stDatosVal.reload();
}

function insertarDatos() {
    var _this = this;
    Ext.Ajax.request({
        url: 'insertarDatosImportar',
        params: {
            columnasdinamicas: Ext.encode(_this.columnasdinamicasindex),
            idejercicio: _this.cmbEjercicio.getValue(),
            identidad: identidadselected,
            idmes: _this.cmMeses.getValue()

        },
        callback: function (options, success, response) {
            _this.winDatosVal.destroy();
            _this.mymask.hide();
            mostrarMensaje(1, perfil.etiquetas.msgImportadoOK);
            _this.stPronostico.reload();
        }
    });
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function crearToolTipDin(v, m) {
    var temp = v.split("_")[0];
    m.attr = 'ext:qtip="' + temp + '"';
    return temp;
}

function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stum.data.items)
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.denominacionunidadmedida;
        }
}
