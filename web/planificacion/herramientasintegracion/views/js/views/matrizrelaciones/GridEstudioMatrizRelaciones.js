/*
 * Configuracion de la matriz de relacion.
 *
 * @copyright XETID Cuba
 * @author Roberto Yasel Garcia Quintana.
 * @version 1.0.0.0 Alfa
 */
Planificacion.Integracion.GridEstudioMatrizRelaciones = Ext.extend(ExtExtend.Components.containers.grids.rowEditorGrid, {//Ext.grid.EditorGridPanel
    id: this.id ? this.id : 'GridEstudioMatrizRelaciones&' + this.id + '&' + this.idproyecto,
    title: this.title ? this.title : 'Matriz',
    region: this.region ? this.region : 'center',
    enableHdMenu: false,
    sm: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (thisSM, rInd, rec) {
                rec.set("denominacion", '<font color="#2528DA" >' + rec.data.denominacion + '</font>');
            },
            rowdeselect: function (thisSM, rInd, rec) {
                rec.set("denominacion", rec.modified.denominacion);
            }
        }
    }),
    closable: true,
    clicksToEdit: 1,
    columns: [],
    frame: true,
    columnLines: true,
    border: false,
    //iconCls: 'icon-grid',
    stripeRows: true,
    plugins: [new Ext.grid.TotalSummary()],
    viewConfig: {
        forceFit: true,
        getRowClass: function (rec, idx, p, store) {
            //console.log(rec);
            if (rec.get('estado')) {
                var aux = 'x-grid-row-';
                if (rec.get('estado') == 'ejecutadas') {
                    aux = aux + 'ejecutadas';
                } else if (rec.get('estado') == 'ejecucion') {
                    aux = aux + 'ejecucion';
                } else {
                    aux = aux + 'atrasada';

                }
                //console.log(aux)
                return aux;
            } else
                return '';
        }
    },
    listeners: {
        render: function (thisg) {
            //console.log(thisg.config.idproyecto)
            thisg.loadConfig(thisg.config.idproyecto);
        },
        cellclick: function (tgr, row, col, e) {
            if (col == 2) {
                tgr.updateRow();
            }
        },
        mouseover: function (e) {
            if (this.valor || this.mostrartooltip) {
                //Obtengo el item al que se le aplicara el tooltip
                var t = e.getTarget();
                //Obtengo la vista del gridpanel
                var v = this.getView()
                var total = (this.getColumnModel()).config.length;
                //Obtengo la posicion de la fila
                var rowIndex = v.findRowIndex(t);
                //Obtener la posicion de la columna
                var cellColumn = v.findCellIndex(t);
                //Para que distinga bien entre 0 y false
                if (rowIndex !== false && cellColumn === 2 || rowIndex !== false && cellColumn === total - 4) {
                    //Obtengo el record de la fila
                    var rec = this.getStore().getAt(rowIndex);
                    //Creo el contenido del tooltip
                    var html = '<div class="notify info header"><div class="notify-text">'
                        + '<h3 style="color:white"> Tarea: ' + rec.get('denominacion') + '</h3>' + '<span> Recursos: ' + rec.get('recursos') + '. </br> ' + ' Valor CUP: $' + rec.get('valor') + '. </br> ' + ' Valor CUC: $' + rec.get('valor1') + '.</span>' +
                        '</div></div>';
                    //Creo el tooltip
                    new Ext.ToolTip({
                        target: t,
                        Width: 250,
                        html: html,
                        trackMouse: true,
                        frame: false
                    });
                }
            }else if(this.codigo){
                var t = e.getTarget();
                //Obtengo la vista del gridpanel
                var v = this.getView()
                var total = (this.getColumnModel()).config.length;
                //Obtengo la posicion de la fila
                var rowIndex = v.findRowIndex(t);
                //Obtener la posicion de la columna
                var cellColumn = v.findCellIndex(t);
                //Para que distinga bien entre 0 y false
                if (rowIndex !== false) {
                    //Obtengo el record de la fila
                    var rec = this.getStore().getAt(rowIndex);
                    //Creo el contenido del tooltip
                    var html = '<div class="notify info header"><div class="notify-text">'
                        + '<h3 style="color:white"> Tarea: ' + rec.get('denominacion') + '</h3>' +
                        '</div></div>';
                    //Creo el tooltip
                    new Ext.ToolTip({
                        target: t,
                        Width: 250,
                        html: html,
                        trackMouse: true,
                        frame: false
                    });
                }}
            else {
                var t = e.getTarget();
                //Obtengo la vista del gridpanel
                var v = this.getView()
                var total = (this.getColumnModel()).config.length;
                //Obtengo la posicion de la fila
                var rowIndex = v.findRowIndex(t);
                //Obtener la posicion de la columna
                var cellColumn = v.findCellIndex(t);
                //Para que distinga bien entre 0 y false
                if (rowIndex !== false && cellColumn === 2) {
                    //Obtengo el record de la fila
                    var rec = this.getStore().getAt(rowIndex);
                    //Creo el contenido del tooltip
                    var html = '<div class="notify info header"><div class="notify-text">'
                        + '<h3 style="color:white"> Tarea: ' + rec.get('denominacion') + '</h3>'
                        +'</br>'
                        +'<h1 style="color:white"> Antecesores: ' + rec.get('Antecesores') + '</h3>' +
                        +'<h1 style="color:white"> Sucesores: ' + rec.get('Sucesores') + '</h3>' +
                        '</div></div>';
                    //Creo el tooltip
                    new Ext.ToolTip({
                        target: t,
                        Width: 250,
                        html: html,
                        trackMouse: true,
                        frame: false
                    });
                }

            }

        },
        headerdblclick: function (thisg, colind, ev) {
            var me = this;
            if (thisg.colModel.config[colind].data && thisg.colModel.config[colind].selectable) {
                for (var i = 0; i < thisg.colModel.config.length; i++) {
                    if (thisg.colModel.config[i].data && thisg.colModel.config[i].selectable) {
                        if (thisg.colModel.config[i].id == thisg.colModel.getColumnId(colind)) {
                            thisg.colModel.setColumnHeader(colind, '<b><font color="#2528DA" >' + thisg.colModel.config[i].data.denominacion + '</font></b>');
                            thisg.colselected = thisg.colModel.config[i];
                            me.mod.updateColumn();

                        } else {
                            thisg.colModel.setColumnHeader(i, '<b>' + thisg.colModel.config[i].data.denominacion + '</b>');
                        }
                    }
                }
            }
            thisg.validateButtons();
        },
        afteredit: function (ev) {
            var me = this;
            if (me.store.modified.length > 0) {
                //me.btnCancelSave.enable();
                me.btnDeshacer.enable();
                me.btnGuardarProyecto.enable();
            } else {
                //me.btnCancelSave.disable();
                me.btnDeshacer.disable();
                me.btnGuardarProyecto.disable();
            }


        }
    },
    initComponent: function () {
        var me = this;
        me.mod = me;
        me.columnas;
        me.filas;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizrelacionesController();
        me.sologd = (me.sologd) ? true : false;
        me.hibridatarea = (me.hibridatarea) ? true : false;
        me.soloact = (me.soloact) ? true : false;
        me.solodirectas = (me.solodirectas) ? true : false;
        me.etiquetas = me.controller._getLabel('Matrizrelaciones');
        me.config = me.config ? me.config : {
            createTbar: true,
            createBbar: true,
            editable: true
        };
        me.colselected = null;
        me.viewConfig.emptyText = me.etiquetas.msgNoRowsMatrix;
        me.store = new Ext.data.JsonStore({
            proxy: new Ext.data.HttpProxy({
                method: 'POST',
                url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/loadmatriz'
            }),
            root: 'rows',
            fields: [],
            listeners: {

                load: function (thist, recs, opts) {
                    me.getView().refresh();
                    if (me.config.createBbar) {
                        //me.btnCancelSave.disable();
                        me.btnGuardarProyecto.disable();
                    }
                },
                beforeload: function () {
                    if (me.config.idestudiomatrizrelacion) {
                        return true;
                    } else {
                        mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix, function () {
                        });
                        return false;
                    }
                }
            },
            baseParams: {
                idproyecto: me.config.idproyecto
            }
        });
        if (me.config.createTbar) {
            me.splitAdicionar = new Ext.SplitButton({//typeof me.config.idconfiguracionmatrizrelacion != 'undefined'
                //text: me.etiquetas.btnAdicionar,
                tooltip: me.etiquetas.ttpAdicionar,
                iconCls: 'adicionar',
                disabled: !me.config.hasOwnProperty("idconfiguracionmatrizrelacion"),
                handler: function () {
                    me.splitAdicionar.showMenu();
                },
                menu: new Ext.menu.Menu({
                    items: [
                        {
                            text: me.etiquetas.btnAdicionarFila,
                            iconCls: 'adicionar',
                            tooltip: me.etiquetas.ttpAdicionarFila,
                            handler: function () {
                                me.addRow();
                            }
                        }, {
                            text: me.etiquetas.btnAdicionarColumna,
                            iconCls: 'adicionar',
                            tooltip: me.etiquetas.ttpAdicionarColumna,
                            handler: function () {
                                me.addColumn();
                            }
                        }

                    ]
                })
            });

            me.itmUpdateRow = new Ext.menu.Item({
                text: me.etiquetas.btnModificarFila,
                iconCls: 'extExtend_modificar',
                tooltip: me.etiquetas.ttpModificarFila,
                disabled: true,
                handler: function () {
                    me.updateRow();
                }
            });
            me.itmUpdateColumn = new Ext.menu.Item({
                text: me.etiquetas.btnModificarColumna,
                iconCls: 'extExtend_modificar',
                tooltip: me.etiquetas.ttpModificarColumna,
                disabled: true,
                handler: function () {
                    me.updateColumn();
                }
            });
            me.splitModificar = new Ext.SplitButton({
                //text: me.etiquetas.btnModificar,
                tooltip: me.etiquetas.ttpModificar,
                iconCls: 'modificar',
                disabled: !me.config.hasOwnProperty("idconfiguracionmatrizrelacion"),
                handler: function () {
                    me.splitModificar.showMenu();
                },
                menu: new Ext.menu.Menu({
                    items: [me.itmUpdateRow, me.itmUpdateColumn]
                })
            });
            me.itmDeleteRow = new Ext.menu.Item({
                text: me.etiquetas.btnEliminarFila,
                iconCls: 'eliminar',
                tooltip: me.etiquetas.ttpEliminarFila,
                disabled: true,
                handler: function () {
                    me.delRow();
                }
            });
            me.itmDeleteColumn = new Ext.menu.Item({
                text: me.etiquetas.btnEliminarColumna,
                iconCls: 'eliminar',
                tooltip: me.etiquetas.ttpEliminarColumna,
                disabled: true,
                handler: function () {
                    me.delColumn();
                }
            });
            me.splitEliminar = new Ext.SplitButton({
                //text: me.etiquetas.btnEliminar,
                tooltip: me.etiquetas.ttpEliminar,
                iconCls: 'eliminar',
                disabled: !me.config.hasOwnProperty("idconfiguracionmatrizrelacion"),
                handler: function () {
                    me.splitEliminar.showMenu();
                },
                menu: new Ext.menu.Menu({
                    items: [me.itmDeleteRow, me.itmDeleteColumn]
                })
            });
            me.btnConfigurarMatriz = new me.comps.Button({
                //text: me.etiquetas.btnConfigurar,
                iconCls: 'icondistra-configuracion',
                tooltip: me.etiquetas.ttpConfigurar,
                handler: function () {
                    me.configureMatrix();
                }
            });
            me.btnExportarResultado = new me.comps.buttons.btnExportar({
                text: '',
                iconCls: 'icondistra-exportar',
                tooltip: me.etiquetas.ttpExportarV,
                handler: function () {

                    params = {
                        view: me.getView(),
                        cmp: me,
                        denominacion: '123'
                    }
                    me.controller.obtenerReporte(params);
                }
            })
            ;
            me.btnExportarResultadoimagen = new me.comps.buttons.btnExportar({
                text: 'Prueba',
                iconCls: 'icondistra-exportar',
                tooltip: me.etiquetas.ttpExportar,
                handler: function () {
                    me.exportarImagen();
                }
            });
            me.btnDeshacer = new me.comps.Button({
                iconCls: 'icondistra-deshacer',
                tooltip: 'Deshacer',
                disabled: true,
                handler: function () {
                    me.store.rejectChanges();
                    me.btnDeshacer.disable();
                    me.btnGuardarProyecto.disable();
                }
            });
            me.btnAyudaMatrizRelaciones = new me.comps.buttons.btnAyuda({
                tooltip: 'Mostrar ayuda de la funcionalidad',
                iconCls: 'icondistra-ayuda',
                handler: function () {
                    me.controller.mostrarAyuda('diagrama_flujos_causales');
                }
            });
            me.tbar = new Ext.Toolbar({
                items: [me.splitAdicionar, me.splitModificar, me.splitEliminar, me.btnConfigurarMatriz, me.btnExportarResultado,/*me.btnExportarResultadoimagen,*/ me.btnDeshacer, '->'/*, me.btnAyudaMatrizRelaciones*/]
            });
        } else {
            me.btnExportarResultado = new me.comps.buttons.btnExportar({
                iconCls: 'icondistra-exportar',
                tooltip: me.etiquetas.ttpExportar,
                handler: function () {
                    params = {
                        view: me.getView(),
                        denominacion: '123'
                    }
                    me.controller.obtenerReporte(params);
                }
            });
            me.tbar = ['->', me.btnExportarResultado];
        }
        if (me.config.createBbar) {
            me.btnCancelSave = new me.comps.buttons.btnCancelar({
                text: 'Cerrar',
                //disabled: true,
                handler: function () {
                    me.store.rejectChanges();
                    //me.btnCancelSave.disable();
                    me.btnGuardarProyecto.disable();
                    me.fireEvent('cerrarVentana');
                }
            });


            me.btnGuardarProyecto = new me.comps.buttons.btnAceptar({
                text: 'Aceptar',
                disabled: true,
                handler: function () {
                    me.saveCells()
                }
            });
            if (me.sologd) {
                me.bbar = new Ext.Toolbar({
                    id: "toolbarid",
                    items: ['<b>Leyenda:</b>', '-',
                        '<span style="font-size:12px; margin: 0 -1px;color: #fefefe; background-color: #0e7801 !important; border: 1px solid floralwhite;">    &nbsp;&nbsp;Alto(3)&nbsp;&nbsp  </span>', '-',
                        '<span style=" color: #fefefe;  font-size:12px;    margin: 0 -1px;  background-color: #12ad49;    border: 1px solid floralwhite;">    &nbsp;&nbsp;Medio(2) &nbsp;&nbsp  </span>', '-',
                        '<span style=" color: #fefefe;  font-size:12px;    margin: 0 -1px;  background-color: #16ff68;    border: 1px solid floralwhite;">    &nbsp;&nbsp;Poco(1) &nbsp;&nbsp  </span>', '-',
                        '<span style=" color: #000000;  font-size:12px;    margin: 0 -1px;  background-color: white;    border: 1px solid floralwhite;">    &nbsp;&nbsp;Ninguno(0) &nbsp;&nbsp  </span>', '->', ' ', '-', me.btnCancelSave, me.btnGuardarProyecto]
                });

            }
            if (me.estado) {
                me.bbar = new Ext.Toolbar({
                    id: "toolbarid",
                    items: ['<b>Leyenda:</b>', '-',
                        '<span style="font-size:14px; margin: 0 -1px;color: #60a917; border-radius:5px;background-color: white; border: 1px solid floralwhite;">    &nbsp;&nbsp;Ejecutadas&nbsp;&nbsp  </span>', '-',
                        '<span style=" color: gold;  font-size:14px;    margin: 0 -1px;   border-radius:5px;background-color: white;border: 1px solid floralwhite;">    &nbsp;&nbsp;En ejecuci&oacute;n &nbsp;&nbsp  </span>', '-',
                        '<span style=" color: #ce352c;  font-size:14px;    margin: 0 -1px;  border-radius:5px; background-color: white;    border: 1px solid floralwhite;">    &nbsp;&nbsp;Atrasadas &nbsp;&nbsp  </span>', '-',
                        '->', ' ', '-', me.btnCancelSave, me.btnGuardarProyecto]
                });

            } else if (me.soloact) {
                me.bntMostrarDoc = new me.comps.buttons.btnAbrir({
                    text: 'Tipo de acciones',
                    handler: function () {
                        me.abrirArchivo()
                    }
                });
                me.bbar = new Ext.Toolbar({
                    id: "toolbarid",
                    items: [me.bntMostrarDoc, '->', '-', me.btnCancelSave, me.btnGuardarProyecto]
                });
            } else {
                me.bbar = new Ext.Toolbar({
                    id: "toolbarid",
                    items: ['->', ' ', '-', me.btnCancelSave, me.btnGuardarProyecto]
                });
            }
        }
        Planificacion.Integracion.GridEstudioMatrizRelaciones.superclass.initComponent.call(me);
        me.getSelectionModel().on("selectionchange", function (ThisSM) {
            me.validateButtons();
        });

        me.on('beforedestroy', function (p) {
            me.cargarDatosTotal(p);
        });
    },
    cargarDatosRecursosValor: function (objeto) {
        var me = this;
        var st = objeto.store;
        var filas = objeto.filas;
        //console.log(filas);
        Ext.each(st.data.items, function (itemA) {
            Ext.each(filas, function (itemB) {
                //console.log(itemB)
                //console.log(itemB.denominacion)
                //console.log(itemA.data.denominacion)
                if (itemB.denominacion == itemA.data.denominacion) {
                    itemA.set('recursos', itemB.recursos);
                    itemA.set('totalrecursos', itemB.totalrecursos);
                    itemA.set('valor', (itemB.valor));
                    itemA.set('valor1', (itemB.valor1));
                    //console.log(itemA);
                    itemA.commit();
                }
            });
        });
        me.getView().refresh();


    },
    cargarDatosCodigo: function (objeto) {
        var me = this;
        var st = objeto.store;
        var filas = objeto.filas;
        Ext.each(st.data.items, function (itemA) {
            Ext.each(filas, function (itemB) {
                if (itemB.denominacion == itemA.data.denominacion) {
                    itemA.set('codigo', (itemB.codigo));
                    itemA.commit();
                }
            });
        });
        me.getView().refresh();


    }, cargarDatosEstado: function (objeto) {
        var me = this;
        var st = objeto.store;
        var filas = objeto.filas;
        Ext.each(st.data.items, function (itemA) {
            Ext.each(filas, function (itemB) {
                if (itemB.denominacion == itemA.data.denominacion) {
                    itemA.set('estado', (itemB.estado));
                    itemA.set('fechaini', (itemB.fechaini));
                    itemA.commit();
                }
            });
        });
        me.getView().refresh();


    }
    , abrirArchivo: function (objeto) {
        var me = this;
        Secodena.mostrarMascara('nip01', 'Por favor espere... ', 'Abriendo documento anexo');
        Ext.Ajax.request({
            url: '/gestion_incidencias/opciones_solucion/index.php/opcionessolucion/abrirdocumento',
            callback: function (options, success, response) {
                Secodena.ocultarMascara('nip01');
                var responseData = Ext.decode(response.responseText);
                if (responseData.url)
                    mostrarMensaje(1, 'El documento ha sido cargado satisfactoriamente', function () {
                        window.open(responseData.url);

                    });
                else {
                    mostrarMensaje(1, 'El documento asociado no existe.', function () {
                    });
                }
            },
            method: 'POST'
        });
    },
    cargarDatosTotal: function (p) {
        var me = this;
        var data = {}, r, rs = p.store.data.items, totalgral = me.totalgral();
        if (p.config.totaldatos) {
            data.total = {
                total: totalgral
            };
        }
        for (var j = 0, jlen = rs.length; j < jlen; j++) {
            r = rs[j].data;
            for (var key in r) {
                if (r.hasOwnProperty(key)) {
                    if (key !== "promedio" && key !== "relaciones" && key !== "total" && key !== "porciento" && key !== "denominacion" && key !== "idcolumnafila" && key !== "descripcion") {
                        if (p.config.totaldatos) {
                            data.total[key] = Ext.grid.TotalSummary.Calculations["totaldatos"](r[key], key, data.total);
                        }
                    }
                }
            }
        }
        me.fireEvent('mostrardatos', me, data);
    },
    loadConfig: function (idproyecto) {
        var me = this;
        me.controller._insertItem('matrizrelaciones', me);
        me.controller.obtenerConfiguracionMatrizRelaciones(idproyecto);
    },
    loadCells: function (params) {
        var me = this;
        me.store.commitChanges();
        me.store.loadData(params);
    },
    reconfigureGrid: function (params) {
        var me = this;
        if (params.config && params.config.idestudiomatrizrelacion) {
            params.config.editable = me.config.editable;
            params.config.createTbar = me.config.createTbar;
            params.config.createBbar = me.config.createBbar;
            params.config.denommatrix = me.config.denommatrix;
            me.config = params.config;
            var st = me.getStore();
            var col = [
                {
                    sortable: false,
                    locked: true,
                    hideable: false,
                    hidden: true,
                    dataIndex: "idcolumnafila",
                    name: "idcolumnafila",
                    editable: false,
                    selectable: false,
                    id: 'ColId&' + me.id
                }, {
                    sortable: false,
                    locked: true,
                    hideable: false,
                    hidden: true,
                    dataIndex: "descripcion",
                    name: "descripcion",
                    editable: false,
                    selectable: false,
                    id: 'ColDescription&' + me.id
                }, {
                    sortable: false,
                    locked: true,
                    hideable: false,
                    dataIndex: "denominacion",
                    name: "denominacion",
                    header: (params.config.nombrerelacion) ? '<b>' + params.config.nombrerelacion + '</b>' : '',
                    align: 'left',
                    editable: false,
                    selectable: false,
                    width: 100,
                    id: 'ColDenom&' + me.id,
                    renderer: me.denomRender
                }
            ];
            col.push({
                header: '<i><b>C&oacute;digo</i></b>',
                hideable: true,
                hidden: true,
                align: 'center',
                name: "codigo",
                width: 60,
                editable: false,
                selectable: false,
                //renderer: me.columnRender
            });
            if (me.estado) {
                col.push({
                    header: '<i><b>Fecha inicial</i></b>',
                    hideable: false,
                    hidden: !me.estado,
                    align: 'center',
                    name: "fechaini",
                    width: 50,
                    editable: false,
                    selectable: false,
                    renderer: me.columnRender
                });
            }
            if (params.columns) {
                var header = "";
                for (var i = 0; i < params.columns.length; i++) {
                    if (me.colselected !== null && me.colselected.name === params.columns[i].idcolumnafila) {
                        header = '<b><font color="#2528DA" >' + params.columns[i].denominacion + '</font></b>';
                        me.colselected.data = params.columns[i];
                        me.colselected.header = header;
                    } else {
                        header = "<b>" + params.columns[i].denominacion + "</b>";
                    }
                    col.push({
                        header: header,
                        tooltip: header,
                        hideable: false,
                        dataIndex: params.columns[i].idcolumnafila,
                        name: params.columns[i].idcolumnafila,
                        align: 'center',
                        width: 50,
                        editable: (me.valor || me.codigo) ? !me.esColumnaProyecto(params.columns[i], me.record.columnas) : true,
                        selectable: (me.valor || me.codigo) ? !me.esColumnaProyecto(params.columns[i], me.record.columnas) : true,
                        data: params.columns[i],
                        editor: me.config.editable ? (me.config.tipodato ? new Planificacion.Integracion.WincSetText({
                            id: "Text&" + params.columns[i].idcolumnafila + "&" + me.id
                        }) : new Planificacion.Integracion.EditorNF({
                            id: "Numb&" + params.columns[i].idcolumnafila + "&" + me.id,
                            sologd: me.sologd
                        })) : null,
                        renderer: (me.sologd) ? me.datarender : (me.hibridatarea) ? me.datarenderHibrida : me.datarendernormal
                    });
                }
            }
            if (me.config.cantrelaciones) {
                col.push({
                    header: me.etiquetas.headerRelaciones,
                    hideable: false,
                    hidden: !me.config.cantrelaciones,
                    name: "relaciones",
                    align: 'center',
                    width: 30,
                    editable: false,
                    selectable: false,
                    renderer: me.relacionesRender
                });
            }
            if (me.config.porciento) {
                col.push({
                    header: me.etiquetas.headerPorciento,
                    hideable: false,
                    hidden: !me.config.porciento,
                    align: 'center',
                    name: "porciento",
                    width: 30,
                    editable: false,
                    selectable: false,
                    renderer: me.porcientoRender
                });
            }
            if (me.config.promedio) {
                col.push({
                    header: me.etiquetas.headerPromedio,
                    hideable: false,
                    hidden: !me.config.promedio,
                    align: 'center',
                    name: "promedio",
                    width: 30,
                    editable: false,
                    selectable: false,
                    renderer: me.promedioRender
                });
            }

            if (me.config.totaldatos) {
                col.push({
                    header: me.etiquetas.headerTotal,
                    hideable: false,
                    hidden: !me.config.totaldatos,
                    align: 'center',
                    name: "total",
                    width: 30,
                    editable: false,
                    selectable: false,
                    renderer: me.totalRender
                });
                col.push({
                    header: '<i><b>Total de directas</i></b>',
                    hideable: false,
                    hidden: !me.solodirectas,
                    align: 'center',
                    name: "directas",
                    width: 30,
                    editable: false,
                    selectable: false,
                    renderer: me.totalRender1
                });
            }
            col.push({
                header: '<i><b>Recursos</i></b>',
                hideable: false,
                hidden: !me.recursos,
                align: 'left',
                name: "recursos",
                width: 100,
                editable: false,
                selectable: false,
                renderer: me.columnRender1
            });
            col.push({
                header: '<i><b>Valor CUP</i></b>',
                hideable: false,
                hidden: !me.valor,
                align: 'right',
                name: "valor",
                width: 60,
                editable: false,
                selectable: false,
                renderer: me.columnRender
            });
            col.push({
                header: '<i><b>Estado</i></b>',
                hideable: false,
                hidden: true,
                align: 'right',
                name: "estado",
                width: 60,
                editable: false,
                selectable: false,
                renderer: me.columnRender
            });

            col.push({
                header: '<i><b>Valor CUC</i></b>',
                hideable: false,
                hidden: !me.valor,
                align: 'right',
                name: "valor1",
                width: 60,
                editable: false,
                selectable: false,
                renderer: me.columnRender
            });
            col.push({
                header: '<i><b>Total recursos</i></b>',
                hideable: true,
                hidden: true,
                align: 'left',
                name: "totalrecursos",
                width: 100,
                editable: false,
                selectable: false,
                renderer: me.columnRender1
            });


            var columnas = new Ext.grid.LockingColumnModel(col);//new Ext.grid.ColumnModel(col); //
            me.columnas = params.columns;
            me.filas = (me.filas) ? me.filas : me.record.filas;
            me.reconfigure(new Ext.data.JsonStore({
                proxy: st.proxy,
                totalProperty: st.totalProperty,
                root: st.root,
                fields: col,
                baseParams: st.baseParams,
                listeners: {
                    load: function (thist, recs, opts) {
                        if (me.valor) {
                            me.cargarDatosRecursosValor({
                                store: thist,
                                filas: me.filas
                            });
                        } else if (me.codigo) {
                            me.cargarDatosCodigo({
                                store: me.store,
                                filas: me.filas
                            });
                        } else if (me.estado) {
                            me.cargarDatosEstado({
                                store: me.store,
                                filas: me.filas
                            });
                        }
                        me.btnDeshacer.disable();
                        //me.btnCancelSave.disable();
                        me.btnGuardarProyecto.disable();
                    },
                    beforeload: function (thist, opts) {
                        if (me.config.idestudiomatrizrelacion) {
                            return true;
                        } else {
                            mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix);
                            return false;
                        }
                    }
                }
            }), columnas);
            me.loadCells(params);
            if (me.valor) {
                console.log(me)
                me.cargarDatosRecursosValor({
                    store: me.store,
                    filas: me.filas
                });
            } else if (me.codigo) {
                me.cargarDatosCodigo({
                    store: me.store,
                    filas: me.filas
                });
            } else if (me.estado) {
                me.cargarDatosEstado({
                    store: me.store,
                    filas: me.filas
                });
            }
        } else {
            mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix);
        }

    },
    esColumnaProyecto: function (columnasProyect, columnas) {
        var existe = false;
        Ext.each(columnas, function (item1, index1) {
            if (columnasProyect.denominacion == item1.denominacion) {
                existe = true;
                return existe;
            }
        });
        return existe;
    },
    relacionesRender: function (c, metaData, record) {
        var data = record.data, c = 0, obj = {};
        metaData.css = "x-grid3-colname";
        obj = Planificacion.Integracion.functions.getTotalFila(record);
        c = obj.relaciones;
        return '<i>' + c + '</i>';
    },
    totalRender: function (c, metaData, record) {
        var c = 0, obj = {};
        metaData.css = "x-grid3-colname header-black-column";
        obj = Planificacion.Integracion.functions.getTotalFila(record);
        c = obj.total;
        return '<i>' + c + '</i>';
    },
    totalRender1: function (c, metaData, record) {
        var c = 0, obj = {};
        metaData.css = "x-grid3-colname";
        obj = Planificacion.Integracion.functions.getTotalFila1(record);
        c = obj.directas;
        return '<i>' + c + '</i>';
    },
    columnRender: function (c, metaData, record) {
        metaData.css = "header-black-column";
        return (!c) ? 0 : '<i>' + c + '</i>';
    },
    columnRender1: function (c, metaData, record) {
        metaData.css = "header-black-column";
        return '<i>' + c + '</i>';
    },
    totalgral: function () {
        var _this = this, obj = {
            total: 0
        };
        obj = Planificacion.Integracion.functions.getTotalGeneral(_this.store);
        return obj.total;
    },
    promedioRender: function (c, metaData, record) {
        var obj = {}, c = total = columns = 0;
        metaData.css = "x-grid3-colname";
        obj = Planificacion.Integracion.functions.getTotalFila(record)
        total = obj.total;
        columns = obj.cantc;
        c = (columns === 0 ? 0 : Math.round(total * 100 / columns) / 100);
        return '<i>' + c + '</i>';
    },
    porcientoRender: function (c, metaData, record, rowIndex, colIndex, store) {
        var obj = obj1 = {}, c = total = totalgral = 0;
        metaData.css = "x-grid3-colname";
        obj = Planificacion.Integracion.functions.getTotalFila(record);
        total = obj.total;
        obj1 = Planificacion.Integracion.functions.getTotalGeneral(store);
        totalgral = obj1.total;
        c = (total === 0 ? 0 : Math.round(total * 10000 / totalgral) / 100);
        return '<i>' + c + '</i>';
    },
    datarender: function (c, metaData, record, rowIndex, colIndex, store) {
        var me = this, res = "", first = true;
        if (typeof c === "string" || typeof c === "number" || typeof c === "boolean") {
            res = c.toString();
        } else {
            for (var key in c) {
                if (c.hasOwnProperty(key)) {
                    for (var key1 in c[key]) {
                        if (c[key].hasOwnProperty(key1) && c[key][key1] !== null) {
                            if (key1 == "number") {
                                res = c[key][key1];
                            } else {
                                res += (!first ? ", " : "") + c[key][key1];
                                first = false;
                            }
                        }
                    }
                } else {
                    res = "";
                }
            }
        }
        switch (res) {
            case '3':
                metaData.css = "x-grid-cell-3";
                break;
            case '2':
                metaData.css = "x-grid-cell-2";
                break;
            case '1':
                metaData.css = "x-grid-cell-1";
                break;
        }
        return res;
    },
    datarendernormal: function (c, metaData, record, rowIndex, colIndex, store) {
        var me = this, res = "", first = true;
        if (typeof c === "string" || typeof c === "number" || typeof c === "boolean") {
            res = c.toString();
        } else {
            for (var key in c) {
                if (c.hasOwnProperty(key)) {
                    for (var key1 in c[key]) {
                        if (c[key].hasOwnProperty(key1) && c[key][key1] !== null) {
                            if (key1 == "number") {
                                res = c[key][key1];
                            } else {
                                res += (!first ? ", " : "") + c[key][key1];
                                first = false;
                            }
                        }
                    }
                } else {
                    res = "";
                }
            }
        }

        return res;
    }, datarenderHibrida: function (c, metaData, record, rowIndex, colIndex, store, grid) {
        var me = this, res = "", first = true;
        if (typeof c === "string" || typeof c === "number" || typeof c === "boolean") {
            res = c.toString();
        } else {
            for (var key in c) {
                if (c.hasOwnProperty(key)) {
                    for (var key1 in c[key]) {
                        if (c[key].hasOwnProperty(key1) && c[key][key1] !== null) {
                            if (key1 == "number") {
                                res = c[key][key1];
                            } else {
                                res += (!first ? ", " : "") + c[key][key1];
                                first = false;
                            }
                        }
                    }
                } else {
                    res = "";
                }
            }
        }

        if (rowIndex === (colIndex - 4)) {
            metaData.css = "group";
        }
        return res;
    },
    denomRender: function (c, metaData) {
        metaData.css = "x-grid3-colname header-black-column";
        return '<b>' + c + '</b>';
    },
    configureMatrix: function () {
        var me = this;
        var wind = new Planificacion.Integracion.WincConfigMatriz({
            matriz: me,
            nombrerelacion: me.config.nombrerelacion
        });
        wind.show();
    },
    addColumn: function () {
        var me = this;
        if (me.config) {
            var windMR = new Planificacion.Integracion.WincAddColumnMR({
                matriz: me
            });
            windMR.show();
        } else {
            mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix);
        }
    },
    delColumn: function () {
        var me = this;
        if (me.config) {
            if (me.colselected !== null) {
                mostrarMensaje(2, me.etiquetas.msgConfirmDeleteColumn, function (btnP) {
                    if (btnP === 'ok') {
                        me.controller._insertItem('matrizrelaciones', me);
                        me.controller.deleteColumnRow({
                            idcolumnrow: me.colselected.data.idcolumnafila,
                            fila: false
                        }, function (responseData) {
                            me.colselected = null;
                            me.reconfigureGrid(responseData);
                        });
                    }
                }.createDelegate(this));
            } else {
                mostrarMensaje(1, me.etiquetas.msgNoSelColumn);
            }
        } else {
            mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix);
        }
    },
    updateColumn: function () {
        var me = this;
        if (me.config) {
            if (me.colselected) {
                me.controller._insertItem('matrizrelaciones', me);
                var windMR = new Planificacion.Integracion.WincUpdColumnMR({
                    matriz: me,
                    idcolumnrow: me.colselected.data.idcolumnafila,
                    denomcolumnrow: me.colselected.data.denominacion,
                    desccolumnrow: me.colselected.data.descripcion
                });
                windMR.show();
            } else {
                mostrarMensaje(1, me.etiquetas.msgNoSelColumn);
            }
        } else {
            mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix);
        }
    },
    addRow: function () {
        var me = this;
        if (me.config) {
            var windMR = new Planificacion.Integracion.WincAddRowMR({
                matriz: me
            });
            windMR.show();
        } else {
            mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix);
        }
    },
    delRow: function () {
        var me = this, selRow = me.getSelectionModel().getSelected();
        if (me.config) {
            if (selRow) {
                mostrarMensaje(2, me.etiquetas.msgConfirmDeleteRow, function (btnP) {
                    if (btnP === 'ok') {
                        me.controller._insertItem('matrizrelaciones', me);
                        me.controller.deleteColumnRow({
                            idcolumnrow: selRow.data.idcolumnafila,
                            fila: true
                        }, function (responseData) {
                            me.reconfigureGrid(responseData);
                        });
                    }
                });
            } else {
                mostrarMensaje(1, me.etiquetas.msgNoSelRow);
            }
        } else {
            mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix);
        }
    },
    updateRow: function () {
        var me = this, selRow = me.getSelectionModel().getSelected();
        if (me.config) {
            if (selRow) {
                me.controller._insertItem('matrizrelaciones', me);
                var windMR = new Planificacion.Integracion.WincUpdRowMR({
                    matriz: me,
                    idcolumnrow: selRow.data.idcolumnafila,
                    denomcolumnrow: selRow.modified.denominacion,
                    desccolumnrow: selRow.data.descripcion
                });
                windMR.show();
            } else {
                mostrarMensaje(1, me.etiquetas.msgNoSelRow);
            }
        } else {
            mostrarMensaje(1, me.etiquetas.msgNoConfiguredMatrix);
        }
    },
    saveCells: function () {
        var me = this, modified = me.store.modified, data = values = {}, cells = [];
        for (var i = 0, max = modified.length; i < max; i++) {
            data = modified[i].data, values = modified[i].modified;
            for (var column in values) {
                if (data.hasOwnProperty(column) && values.hasOwnProperty(column) && column !== "promedio" && column !== "relaciones" && column !== "total" && column !== "porciento" && column !== "denominacion" && column !== "idcolumnafila" && column !== "descripcion") {
                    cells.push({
                        column: column,
                        row: data.idcolumnafila,
                        value: data[column]
                    });
                }
            }
        }
        me.controller._insertItem('matrizrelaciones', me);
        me.controller.saveCells({
            cells: cells
        });
    },
    export: function () {
        var me = this;
        var windexportar = new Planificacion.Integracion.ExportarWindowRelaciones({
            controller: me.controller,
            closable: true,
            matrix: me
        });
        windexportar.show();
    }, exportarImagen: function () {
        var me = this;
        var windexportar = new Planificacion.Integracion.ExportarWindowImage({
            controller: me.controller,
            closable: true,
            flujo: true,
            matrix: me
        });
        windexportar.show();
    },
    existentColumnRow: function (row, denom) {
        var me = this;
        if (row) {
            for (var key in me.store.data.items) {
                if (me.store.data.items[key].hasOwnProperty("data") && me.store.data.items[key].data.hasOwnProperty("denominacion") && me.store.data.items[key].data.denominacion === denom) {
                    return true;
                }
            }
        } else {
            for (var key in me.colModel.config) {
                if (me.colModel.config[key].hidden !== true && typeof me.colModel.config[key] !== "function" && me.colModel.config[key].header === "<b>" + denom + "</b>") {
                    return true;
                }
            }
        }
        return false;
    },
    createMatrix: function (config, columnrows, datos) {
        var me = this;
        me.controller._insertItem('matrizrelaciones', me);
        me.controller.createMatrix(config, columnrows, datos, function (responseData) {
            me.colselected = null;
            me.reconfigureGrid(responseData);
            me.fireEvent('mostrarVentana', me);
        });
    },
    hasAditionalColumns: function () {
        var _this = this;
        return _this.getColumnModel().config.length > 7;
    },
    validateButtons: function () {
        var me = this;
        if (me.config.createTbar) {
            if (me.config.idconfiguracionmatrizrelacion !== null) {
                me.splitAdicionar.enable();
                if ((me.hasAditionalColumns() || me.store.data.length > 0) && (me.getSelectionModel().hasSelection() || me.colselected !== null)) {
                    me.splitModificar.enable();
                    me.splitEliminar.enable();
                    me.btnExportarResultado.enable();
                    if (me.hasAditionalColumns() && me.colselected !== null) {
                        me.itmUpdateColumn.enable();
                        me.itmDeleteColumn.enable();
                    } else {
                        me.itmUpdateColumn.disable();
                        me.itmDeleteColumn.disable();
                    }
                    if (me.store.data.length > 0 && me.getSelectionModel().hasSelection()) {
                        me.itmDeleteRow.enable();
                        me.itmUpdateRow.enable();
                    } else {
                        me.itmDeleteRow.disable();
                        me.itmUpdateRow.disable();
                    }
                }
            } else {
                me.splitEliminar.disable();
                me.splitAdicionar.disable();
                me.splitModificar.disable();
                me.btnExportarResultado.disable();
            }
        }
    }
});
Ext.reg('Planificacion.Integracion.GridEstudioMatrizRelaciones', Planificacion.Integracion.GridEstudioMatrizRelaciones);