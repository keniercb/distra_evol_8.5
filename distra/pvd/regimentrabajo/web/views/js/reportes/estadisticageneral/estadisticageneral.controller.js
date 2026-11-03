Ext.ns('Pvd.ControlAsistencia.EstadisticaGeneral');
//Controlador de la vista del componente
Pvd.ControlAsistencia.EstadisticaGeneral.Controlador = {

    init: function (idioma, vista, modelo) {
        this.limite = 15;
        var _self = this;
        this.fecha = new Date();
        this.denomEstructuraExportNominal = '';
        var self = this;
        var clickDelayedTask;
        var graphData;
        var columns;
        var Listadonew;
        var resumen;
        this.idestructura = perfil.idestructuracomun;

        cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);

        vista.EstructuraTree.on('dameseleccion', function (obj, data) {
            if (data == false)
                this.idestructura = vista.EstructuraTree.inicial;
            else {
                this.denomestructura = data.attributes.denominacion;
                this.idestructura = data.id;
            }

            modelo.stListado.removeAll();
            cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
        }, this);

        function Estilo(val, meta, rec, row, col, store) {
            meta.css = 'weekend';
            if (!Ext.isEmpty(val)) {
                return '<p><b>' + val + '</b></p>';
            }
        }

        function datosRender(val, meta, rec, row, col, store) {

            if (rec.data.estructura == "Total") {
                meta.css = 'weekend';
                return '<p><b>' + val + '</b></p>';
            }
            return val;
        }

        function mostrarFila(val, metaData, record, rowIndex, colIndex, store) {
            metaData.attr = 'ext:qtip="Doble click para mostrar las personas"';
            if (record.data.estructura == "Total") {
                metaData.css = 'weekend';
                return '<p><b>' + val + '</b></p>';
            } else if ((vista.tiporeporte.getValue() == 3 && colIndex == 5) || ((vista.tiporeporte.getValue() == 1 || vista.tiporeporte.getValue() == 2) && colIndex == 7)
                || (vista.tiporeporte.getValue() == 4 && colIndex == 6) || (self.columns[colIndex].dataIndex && self.columns[colIndex].dataIndex == "totalfuera")) {
                metaData.css = 'weekend';
                return '<p><b>' + val + '</b></p>';
            }
            return val;
        }

        vista.tiporeporte.on('select', function (cb, r, i) {
            cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
        });

        // vista.desde.on('setValue', function (th, gv, v) {
        //     if (formatDate(gv.dateFormat('d/m/Y')) != formatDate(v.dateFormat('d/m/Y'))) {
        //         cargardatos(v.dateFormat('d/m/Y'), vista.hasta.getRawValue(), self.idestructura);
        //     }
        // });
        //
        // vista.hasta.on('setValue', function (th, gv, v) {
        //     if (formatDate(gv.dateFormat('d/m/Y')) != formatDate(v.dateFormat('d/m/Y'))) {
        //         cargardatos(vista.desde.getRawValue(), v.dateFormat('d/m/Y'), self.idestructura);
        //     }
        // });

        vista.btnBuscar.on('click', function () {
            cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
        }, this);

        function formatDate(date) {
            var explodeDate = date.split('/');
            return parseInt(explodeDate[2] + explodeDate[1] + explodeDate[0]);
        }

        function cargardatos(desde, hasta, idestructura) {
            Ext.Ajax.timeout = 90000;
            vista.Maskara.show();
            Ext.Ajax.request({
                url: 'getasistencia',
                method: 'POST',
                params: {
                    causas: 1,
                    desde: desde,
                    hasta: hasta,
                    tiporeporte: vista.tiporeporte.value,
                    idestructura: idestructura
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    var causasAgrupadasP = responseData.causasP;
                    var causasAgrupadasA = responseData.causasA;
                    var tienecategoria = responseData.tienecategoria;
                    self.resumen = responseData.resumen;
                    self.columns = new Array();
                    var indexs = new Array();
                    var continentGroupRow = new Array();

                    self.columns.push(new Ext.grid.RowNumberer());

                    self.columns.push({
                        header: 'idestructura', width: 300, hidden: true, dataIndex: 'idestructura'
                    });
                    if (vista.tiporeporte.getValue() == 1) {
                        self.columns.push({
                            header: 'Estructura', width: 200, dataIndex: 'estructura', renderer: datosRender
                        });
                    } else if (vista.tiporeporte.getValue() == 2) {
                        self.columns.push({
                            header: 'Categoría ocupacional', width: 150, dataIndex: 'estructura', renderer: datosRender
                        });
                    } else if (vista.tiporeporte.getValue() == 3) {
                        self.columns.push({
                            header: 'Fecha', width: 120, dataIndex: 'estructura', renderer: datosRender
                        });
                    } else if (vista.tiporeporte.getValue() == 4) {
                        self.columns.push({
                            header: 'Género', width: 120, dataIndex: 'estructura', renderer: datosRender
                        });
                    }
                    if (vista.tiporeporte.getValue() != 3) {
                        if (vista.tiporeporte.getValue() != 4) {
                            self.columns.push({
                                header: 'Por plantilla', width: 70, dataIndex: 'porplantilla', renderer: datosRender,
                            });
                        }
                        self.columns.push({
                            header: 'Real',
                            width: 50,
                            dataIndex: 'cubierto',
                            renderer: mostrarFila,
                            tooltip: 'Cantidad real de personas'
                        });
                        // self.columns.push({
                        //     header: 'Sin registro',
                        //     width: 80,
                        //     dataIndex: 'sinregistro',
                        //     renderer: mostrarFila,
                        //     tooltip: 'Cantidad total de personas sin registro de asistencia'
                        // });
                    }

                    // if (vista.tiporeporte.getValue() == 3) {
                    //     self.columns.push({
                    //         header: 'Sin registro',
                    //         width: 80,
                    //         dataIndex: 'sinregistro',
                    //         renderer: mostrarFila,
                    //         tooltip: 'Cantidad total de personas sin registro de asistencia'
                    //     });
                    // }

                    self.columns.push({
                        header: 'Con asistencia',
                        width: 85,
                        dataIndex: 'totalasistencia',
                        renderer: mostrarFila,
                        tooltip: 'Cantidad total de personas con asistencia'
                    });

                    self.columns.push({
                        header: 'Entidad', width: 300, hidden: true, dataIndex: 'entidad'
                    });
                    indexs.push({name: 'idestructura'});
                    indexs.push({name: 'estructura'});
                    if (vista.tiporeporte.getValue() != 3) {
                        if (vista.tiporeporte.getValue() != 4)
                            indexs.push({name: 'porplantilla'});
                        indexs.push({name: 'cubierto'});
                    }
                    // if (vista.tiporeporte.getValue() == 3)
                    //     indexs.push({name: 'sinregistro'});
                    indexs.push({name: 'totalasistencia'});
                    indexs.push({name: 'entidad'});

                    if (vista.tiporeporte.getValue() == 1 || vista.tiporeporte.getValue() == 2)
                        continentGroupRow.push({header: 'Datos generales', align: 'center', colspan: 7});
                    else if (vista.tiporeporte.getValue() == 3)
                        continentGroupRow.push({header: 'Datos generales', align: 'center', colspan: 5});
                    else if (vista.tiporeporte.getValue() == 4)
                        continentGroupRow.push({header: 'Datos generales', align: 'center', colspan: 6});

                    var x = causasAgrupadasP.length + 2;

                    continentGroupRow.push({header: 'Presentes', align: 'center', colspan: x});

                    self.columns.push({
                        dataIndex: 'presente',
                        sortable: false,
                        header: 'Total presentes',
                        width: 90,
                        renderer: mostrarFila,
                        tooltip: 'Cantidad total de personas presentes'
                    });
                    indexs.push({name: 'presente'});

                    self.columns.push({
                        dataIndex: 'presentesreal',
                        sortable: false,
                        header: 'En la entidad',
                        width: 80,
                        renderer: mostrarFila,
                        tooltip: 'Personal que se encuentra laborando en la entidad',
                    });
                    indexs.push({name: 'presentesreal'});

                    Ext.each(causasAgrupadasP, function (causa) {
                        self.columns.push({
                            dataIndex: causa.dataindex,
                            sortable: false,
                            header: causa.denom,
                            width: 50,
                            summaryType: 'sum',
                            renderer: mostrarFila,
                            tooltip: causa.denominacion,
                        });
                        indexs.push({name: causa.dataindex});
                    });

                    var y = causasAgrupadasA.length + 1;
                    continentGroupRow.push({header: 'Ausentes', align: 'center', colspan: y});

                    self.columns.push({
                        dataIndex: 'totalfuera',
                        sortable: false,
                        header: 'Total ausentes',
                        width: 90,
                        summaryType: 'sum',
                        renderer: mostrarFila,
                        tooltip: 'Personal ausente a la entidad',
                    });
                    indexs.push({name: 'totalfuera'});

                    Ext.each(causasAgrupadasA, function (causa) {
                        self.columns.push({
                            dataIndex: causa.dataindex,
                            sortable: false,
                            header: causa.denom,
                            width: 50,
                            summaryType: 'sum',
                            renderer: mostrarFila,
                            tooltip: causa.denominacion,
                        });
                        indexs.push({name: causa.dataindex});
                    });

                    var group = new Ext.ux.grid.ColumnHeaderGroup({
                        rows: [continentGroupRow]
                    });

                    _self.cmNew = new Ext.grid.ColumnModel(self.columns);
                    var plantilla = new Ext.data.Record.create(indexs);
                    var myReader = new Ext.data.JsonReader({
                        totalProperty: "cantidad",
                        root: "datos"
                    }, plantilla);

                    _self.stNew = new Ext.data.GroupingStore({
                        url: 'getasistencia',
                        loadMask: {msg: idioma.lbMsgmasklistado},
                        reader: myReader,
                        sortInfo: {field: 'entidad', direction: "ASC"},
                        groupField: 'entidad',
                        remoteSort: true,
                        listeners: {
                            load: function (st, recs, opt) {
                                vista.Maskara.show();
                                self.graphData = {
                                    resumen: {
                                        name: [''],
                                        data: {
                                            data: [['Real', parseInt(responseData.datos[responseData.datos.length - 1].cubierto)],
                                                ['Presentes', parseInt(responseData.datos[responseData.datos.length - 1].presente)]]
                                        }
                                    }
                                };

                                crearGrafica(self.graphData, recs, 'pie', 'Resumen de asistencia', 'Cantidad de personas');

                            },
                            beforeload: function (st, o) {
                                st.baseParams.causas = 1;
                                st.baseParams.desde = vista.desde.getRawValue();
                                st.baseParams.hasta = vista.hasta.getRawValue();
                            }
                        }
                    });

                    modelo.stListado.on('load', function (st2, recs2, opt2) {
                        if (vista.desde.isValid() && vista.hasta.isValid()) {
                            vista.btnBuscar.enable();
                        } else {
                            vista.btnBuscar.disable();
                        }
                        crearGrafica(modelo.stListado.reader.jsonData, recs2, 'pie');
                    });

                    vista.Maskara.hide();

                    var smListado = new Ext.grid.RowSelectionModel({
                        singleSelect: true,
                        listeners: {
                            rowselect: function (th, indx, rec) {
                                self.clickDelayedTask = new Ext.util.DelayedTask(function () {
                                    vista.Maskara.show();
                                    if (vista.combografica.getValue() == 1) {
                                        self.graphData = {
                                            resumen: {
                                                name: [rec.data.estructura],
                                                data: {
                                                    data: [['Real', parseInt(rec.data.cubierto)],
                                                        ['Presentes', parseInt(rec.data.presente)]]
                                                }
                                            }
                                        };
                                        crearGrafica(self.graphData, [''], 'pie', 'Resumen de asistencia', 'Cantidad de personas');
                                    } else if (vista.combografica.getValue() == 2) {
                                        self.graphData = {
                                            resumen: {
                                                name: [rec.data.estructura],
                                                data: {
                                                    data: [['Presentes', parseInt(rec.data.presente)],
                                                        ['Ausentes', parseInt(rec.data.totalfuera)]]
                                                }
                                            }
                                        };
                                        crearGrafica(self.graphData, [''], 'pie', 'Resumen de asistencia', 'Cantidad de personas');
                                    }
                                    else if (vista.combografica.getValue() == 3) {
                                        var gdata;
                                        if (!self.Listadonew.getSelectionModel().hasSelection())
                                            gdata = self.resumen.data[self.Listadonew.store.data.length - 1];
                                        else
                                            gdata = self.resumen.data[self.Listadonew.getSelectionModel().last];


                                        self.graphData = {
                                            resumen: {
                                                name: [gdata.name],
                                                data: {
                                                    data: gdata.causa
                                                }
                                            }
                                        };
                                        crearGrafica(self.graphData, [''], 'pie', 'Resumen de asistencia', 'Cantidad de personas');
                                    } else if (vista.combografica.getValue() == 4) {
                                        var gdata = {categorias: [], datos: []};
                                        if (!self.Listadonew.getSelectionModel().hasSelection())
                                            gdata = self.resumen.tardanza[self.Listadonew.store.data.length - 1];
                                        else if (self.resumen.tardanza[self.Listadonew.getSelectionModel().last])
                                            gdata = self.resumen.tardanza[self.Listadonew.getSelectionModel().last];

                                        var horas = new Array();
                                        var suma = 0;
                                        for (var i = 0; i < gdata.datos.length; i++) {
                                            var a = new Date(gdata.datos[i]);
                                            a.setTime(a.getTime() - a.getTimezoneOffset() * 60 * 1000);
                                            horas[i] = Date.parse(a);
                                            suma += horas[i];
                                        }
                                        var media = new Array();
                                        for (var i = 0; i < gdata.datos.length; i++) {
                                            media[i] = suma / gdata.datos.length;
                                        }

                                        self.graphData = {
                                            resumen: {
                                                name: gdata.categorias,
                                                data: {
                                                    data: [{
                                                        name: 'Hora de entrada',
                                                        data: horas
                                                    }, {name: 'Hora media de tardanza', data: media}],
                                                }
                                            }
                                        };
                                        crearGrafica(self.graphData, [''], 'dtline', 'Tardanza media', 'Hora');
                                    }
                                    vista.Maskara.hide();
                                });
                                self.clickDelayedTask.delay(300);

                            }
                        }
                    });

                    var summary = new Ext.grid.GroupSummary();

                    self.Listadonew = new Ext.grid.GridPanel({
                        id: 'listadonew',
                        store: _self.stNew,
                        loadMask: {msg: idioma.lbMsgmasklistado},
                        layout: 'fit',
                        view: new Ext.grid.GroupingView({
                            showGroupName: false,
                            groupTextTpl: '{text}'
                        }),
                        sm: smListado,
                        plugins: (tienecategoria) ? [group] : [group],
                        cm: _self.cmNew,
                        listeners: {
                            celldblclick: function (grd, rowIndex, columnIndex) {
                                self.clickDelayedTask.cancel();
                                var record = grd.getStore().getAt(rowIndex);
                                modelo.stListadonominal.baseParams = {};
                                if (columnIndex != 0 && columnIndex != 1 && columnIndex != 2){
                                    if(((vista.tiporeporte.value == 1 || vista.tiporeporte.value == 2) && columnIndex != 3) ||
                                        ((vista.tiporeporte.value == 3 || vista.tiporeporte.value == 4) && columnIndex > 2)){
                                        vista.agrupador.setValue(1);
                                        var dataindex = grd.getColumnModel().config[columnIndex].dataIndex;

                                        /*if(vista.tiporeporte.value != 3 && columnIndex == 4){
                                         vista.agrupador.hide();
                                         }else{
                                         vista.agrupador.show();
                                         }*/
                                        if (dataindex == 'totalfuera' || dataindex == 'sinregistro') {
                                            modelo.stListadonominal.baseParams.identidad = grd.getSelectionModel().getSelected().data.identidad;
                                        }/* else if (((vista.tiporeporte.value == 1 || vista.tiporeporte.value == 2) && columnIndex > 9 && dataindex != 'totalfuera')
                                            || (vista.tiporeporte.value == 3 && columnIndex > 6 && dataindex != 'totalfuera')
                                            || (vista.tiporeporte.value == 4 && columnIndex > 8 && dataindex != 'totalfuera')) {
                                        }*/
                                        modelo.stListadonominal.baseParams.idcausa = dataindex;
                                        modelo.stListadonominal.baseParams.columnIndex = columnIndex;
                                        self.denomEstructuraExportNominal = grd.getSelectionModel().getSelected().data.estructura;
                                        vista.winReporteNominal.setTitle('Listado de personas');
                                        if (grd.getSelectionModel().getSelected().data.estructura == 'Total')
                                            var est = grd.getSelectionModel().getSelected().data.entidad;
                                        else
                                            var est = grd.getSelectionModel().getSelected().data.estructura;
                                        vista.Listado.setTitle('Relación nominal sobre la situación del personal' + ' -> ' + est + ' [' + grd.getColumnModel().config[columnIndex].tooltip + ']');
                                        vista.winReporteNominal.show();
                                        vista.winReporteNominal.maximize();
                                        modelo.stListadonominal.removeAll();
                                        modelo.stListadonominal.baseParams.idestructura = grd.getSelectionModel().getSelected().data.idestructura;
                                        modelo.stListadonominal.baseParams.estructura = grd.getSelectionModel().getSelected().data.estructura;
                                        modelo.stListadonominal.baseParams.identidad = self.idestructura;
                                        modelo.stListadonominal.baseParams.desde = vista.desde.getRawValue();
                                        modelo.stListadonominal.baseParams.hasta = vista.hasta.getRawValue();
                                        modelo.stListadonominal.baseParams.tiporeporte = vista.tiporeporte.value;
                                        modelo.stListadonominal.baseParams.agrupador = vista.agrupador.value;
                                        modelo.stListadonominal.load();
                                    }

                                }
                            }
                        }
                    });
                    vista.vp.getComponent('listadovp').add(self.Listadonew);
                    vista.vp.getComponent('listadovp').doLayout();

                    _self.stNew.loadData({
                        datos: responseData.datos,
                        cantidad: responseData.cantidad
                    }, true);
                }
            });
        }

        vista.combografica.on('select', function (cb, rec, num) {
            var gdata = {categorias: [], datos: []};
            if (!self.Listadonew.getSelectionModel().hasSelection())
                gdata = self.Listadonew.store.data.items[self.Listadonew.store.data.length - 1].data;
            else
                gdata = self.Listadonew.getSelectionModel().getSelected().data;

            if (vista.combografica.getValue() == 1) {
                self.graphData = {
                    resumen: {
                        name: ['Total'],
                        data: {
                            data: [['Real', parseInt(gdata.cubierto)],
                                ['Presentes', parseInt(gdata.presente)]]
                        }
                    }
                };
                crearGrafica(self.graphData, [''], 'pie', 'Resumen de asistencia', 'Cantidad de personas');
            } else if (vista.combografica.getValue() == 2) {
                self.graphData = {
                    resumen: {
                        name: [gdata.estructura],
                        data: {
                            data: [['Presentes', parseInt(gdata.presente)],
                                ['Ausentes', parseInt(gdata.totalfuera)]]
                        }
                    }
                };
                crearGrafica(self.graphData, [''], 'pie', 'Resumen de asistencia', 'Cantidad de personas');
            }
            else if (vista.combografica.getValue() == 3) {
                if (!self.Listadonew.getSelectionModel().hasSelection())
                    gdata = self.resumen.data[self.Listadonew.store.data.length - 1];
                else
                    gdata = self.resumen.data[self.Listadonew.getSelectionModel().last];


                self.graphData = {
                    resumen: {
                        name: [gdata.name],
                        data: {
                            data: gdata.causa
                        }
                    }
                };
                crearGrafica(self.graphData, [''], 'pie', 'Resumen de asistencia', 'Cantidad de personas');
            } else if (vista.combografica.getValue() == 4) {
                gdata = {categorias: [], datos: []};
                if (!self.Listadonew.getSelectionModel().hasSelection() && self.resumen.tardanza[self.Listadonew.store.data.length - 1])
                    gdata = self.resumen.tardanza[self.Listadonew.store.data.length - 1];
                else if (self.resumen.tardanza[self.Listadonew.getSelectionModel().last])
                    gdata = self.resumen.tardanza[self.Listadonew.getSelectionModel().last];

                var horas = new Array();
                var suma = 0;
                for (var i = 0; i < gdata.datos.length; i++) {
                    var a = new Date(gdata.datos[i]);
                    a.setTime(a.getTime() - a.getTimezoneOffset() * 60 * 1000);
                    horas[i] = Date.parse(a);
                    suma += horas[i];
                }
                var media = new Array();
                for (var i = 0; i < gdata.datos.length; i++) {
                    media[i] = suma / gdata.datos.length;
                }

                self.graphData = {
                    resumen: {
                        name: gdata.categorias,
                        data: {
                            data: [{name: 'Hora de entrada', data: horas}, {
                                name: 'Hora media de tardanza',
                                data: media
                            }],
                        }
                    }
                };
                crearGrafica(self.graphData, [''], 'dtline', 'Tardanza media', 'Hora');
            }
        });

        function crearGrafica(responseData, recs, type, Title, yAxisTitle) {
            if (recs.length > 0) {
                vista.Maskara.hide();
                vista.grafica.chartType = type;
                vista.grafica.chartDatas = responseData.resumen.data;
                vista.grafica.chartTitle = Title;
                vista.grafica.chartDataElement = yAxisTitle;
                vista.grafica.yAxisTitle = yAxisTitle;
                vista.grafica.chartCategories = responseData.resumen.name;

                if (type == 'dtline') {
                    vista.grafica.topToolbar.items.items[1].setVisible(true);
                    vista.grafica.topToolbar.items.items[4].setVisible(false);
                    vista.grafica.topToolbar.items.items[5].setVisible(false);
                } else {
                    vista.grafica.topToolbar.items.items[1].setVisible(false);
                    vista.grafica.topToolbar.items.items[4].setVisible(true);
                    vista.grafica.topToolbar.items.items[5].setVisible(true);
                    vista.grafica.dataLabels = true;
                }

                if (responseData.resumen.name.length > 5 && type != 'pie') {
                    vista.grafica.xAxisMin = 0;
                    vista.grafica.xAxisMax = 5;
                    vista.grafica.scrollbar.enabled = true;
                } else {
                    vista.grafica.xAxisMin = null;
                    vista.grafica.xAxisMax = null;
                    vista.grafica.scrollbar.enabled = false;
                }

                vista.grafica.renderChart();
                vista.grafica.enable();
                vista.grafica.enable();
            }
            else {
                vista.Maskara.hide();
                vista.grafica.chartType = 'column';
                vista.grafica.chartDatas = [{name: 'Cantidad', data: [['No exiten datos.', 0]]}];
                vista.grafica.chartTitle = 'Resumen de la asistencia del ' + /*vista.fechaBuscar.getRawValue()*/vista.desde.getRawValue() + ' al ' + vista.hasta.getRawValue();
                vista.grafica.chartDataElement = 'Cantidad de personas';
                vista.grafica.dataLabels = true;
                vista.grafica.renderChart();
                mostrarMensaje(1, idioma.MsgNoDataAsistencia);
                vista.grafica.disable();
                vista.grafica.disable();
            }
        }

        vista.btnCerrar.on('click', function () {
            vista.winReporteNominal.hide();
            vista.filtro.reset();
        }, this);

        vista.btnBuscar.on('click', function () {
            cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
        }.createDelegate(this));

        vista.btnGrafica.on('toggle', function (but, press) {
            if (press == true) {
                vista.panelgrafica.expand();
            } else {
                vista.panelgrafica.collapse();
            }
        }, this);

        vista.btnBuscarNominal.on('click', function () {
            buscarpersona();
        }, this);

        function buscarpersona() {
            modelo.stListadonominal.baseParams.idestructura = self.Listadonew.getSelectionModel().getSelected().data.idestructura;
            modelo.stListadonominal.baseParams.desde = vista.desde.getRawValue();
            modelo.stListadonominal.baseParams.hasta = vista.hasta.getRawValue();
            modelo.stListadonominal.baseParams.agrupador = vista.agrupador.value;
            modelo.stListadonominal.load({params: {filtro: vista.filtro.getRawValue()}});
        }

        vista.btnLimpiar.on('click', function () {
            Limpiar();
        }, this);

        vista.agrupador.on('select', function (cb, r, i) {
            modelo.stListadonominal.removeAll();
            modelo.stListadonominal.baseParams.idestructura = self.Listadonew.getSelectionModel().getSelected().data.idestructura;
            modelo.stListadonominal.baseParams.desde = vista.desde.getRawValue();
            modelo.stListadonominal.baseParams.hasta = vista.hasta.getRawValue();
            modelo.stListadonominal.baseParams.agrupador = vista.agrupador.value;
            modelo.stListadonominal.load({params: {filtro: vista.filtro.getRawValue()}});
        });

        function Limpiar() {
            vista.filtro.reset();
            modelo.stListadonominal.removeAll();
            modelo.stListadonominal.baseParams.idestructura = self.Listadonew.getSelectionModel().getSelected().data.idestructura;
            modelo.stListadonominal.baseParams.desde = vista.desde.getRawValue();
            modelo.stListadonominal.baseParams.hasta = vista.hasta.getRawValue();
            modelo.stListadonominal.load();
        }

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'ble',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 66: { //b para buscar
                        if (vista.winReporteNominal.isVisible()) {
                            buscarpersona();
                        } else {
                            cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
                        }
                        break;
                    }
                    case 76: { //l para limpiar
                        Limpiar()
                        break;
                    }
                    case 69: { //e para exportar
                        if (vista.winReporteNominal.isVisible()) {
                            ExportarNominal();
                        } else {
                            exportar();
                        }
                        break;
                    }
                }
            }
        }, {
            key: 13,//Enter para buscar
            fn: function () {
                if (vista.winReporteNominal.isVisible()) {
                    buscarpersona();
                } else {
                    cargardatos(vista.desde.getRawValue(), vista.hasta.getRawValue(), self.idestructura);
                }
            }
        }]);


    }
}