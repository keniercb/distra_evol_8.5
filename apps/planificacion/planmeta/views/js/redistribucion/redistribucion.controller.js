
Ext.ns('Planificacion.BalanceMaterial.Redistribucion')

//Controlador de la vista
Planificacion.BalanceMaterial.Redistribucion.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     * 
     * @author María Elena y Olennis Durán
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Usuario (Tipo: Planificacion.Presupuesto.Actividad.Vista)
     * @param modelo Modelo de la vista del componente Usuario (Tipo: Planificacion.Presupuesto.Actividad.Modelo)
     */
    idcb: null,
    init: function(idioma, vista, modelo) {
        this.vista = vista;
        _this = this;
        Ext.Ajax.timeout = 3600000; //600000 = 10min  3600000=1h


        modelo.stgpIndDemandados.on('load', function(st, record, ob) {
            _this.calcularLosImportes(vista, st);
            _this.cambiarTituloFiltrarIndDem(_this.vista);
        }, this);

        modelo.stgpIndDemandados.on('beforeload', function(st, record, ob) {
            st.baseParams.idcentrobalance = vista.cbCtroBalance.getValue();
            st.baseParams.idejercicio = vista.cbEjercicio.getValue();
        }, this);

        vista.cbEjercicio.on('select', function(cmb, record, index) {
            modelo.stgpIndDemandados.reload({
                params: {
                    start: 0,
                    limit: 10
                }
            });
            modelo.stgpEntidadesAbast.reload();
        }, this);

        vista.cbCtroBalance.on('select', function(cmb, record, index) {
            vista.btnRedistribuir.enable();
            this.idcb = record.data.idcentrobalance;
            vista.cbEjercicio.enable();
        }, this);


        vista.btnRedistribuir.on('click', function() {
            mostrarMensaje(2, "¿Está seguro que quiere redistribuir el(los) indicador(es) seleccionado(s)?", this.confredist);

        }, this);

        vista.btnAyudaRedist.on('click', function() {
           // this.mostrarAyuda('Redistribucion');
        }, this);

        vista.btnProductos.on('click', function() {
            vista.winproducto.show();
        }, this);

        /*************TECLAS CALIENTES****************/
        vista.globalKeyMap.accessKey({
            key: 'Hh',
            alt: true
        }, function() {
           // this.mostrarAyuda('Redistribucion');
        }, this);

        vista.globalKeyMap.accessKey({
            key: 'Rr',
            alt: true
        }, function() {
            this.redistribuir(_this.vista, this.idcb);
        }, this);

        vista.globalKeyMap.accessKey({
            key: 'Ll',
            alt: true,
            ctrl: true
        }, function() {
            this.limpiarIndDem(vista);
        }, this);

        vista.globalKeyMap.accessKey({
            key: 'Ll',
            alt: true,
            ctrl: false
        }, function() {
            this.limpiarEspAbast(vista);
        }, this);


        /************* FIN TECLAS CALIENTES*************/


        modelo.stProductos.on('load', function(st, record, ob) {
            _this.cambiarTituloFiltrarProdPorEsp(_this.vista);
        }, this);
        modelo.stProductos.on('beforeload', function(st, record, ob) {
            modelo.stProductos.baseParams.identidad = identidadselected;
            modelo.stProductos.baseParams.hoja = hoja;
            modelo.stProductos.baseParams.idejercicio = Planificacion.BalanceMaterial.Redistribucion.Vista.cbEjercicio.getValue();
        }, this);
        modelo.stgpIndDemandados.on('load', function(st, record, ob) {

            vista.gridIndDemandados.getSelectionModel().selectFirstRow();
            if (vista.gridIndDemandados.getStore().getCount() == 0) {
                modelo.stgpEntidadesAbast.reload();
            }
        }, this);

        modelo.stgpIndDemandados.on('load', function() {
            if (vista.filtrosindidemandados.getFiltrosActivos().length > 0 && modelo.stgpIndDemandados.getCount() == 0) {
                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }

        })

        modelo.stgpEntidadesAbast.on('load', function() {
            if (vista.filtrosespecialidades.getFiltrosActivos().length > 0 && modelo.stgpEntidadesAbast.getCount() == 0) {
                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }

        })

        modelo.stProductos.on('load', function() {
            if (vista.filtroproductos.getFiltrosActivos().length > 0 && modelo.stProductos.getCount() == 0) {
                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }

        })

        modelo.stgpEntidadesAbast.on('beforeload', function(st, record, ob) {
            if (vista.gridIndDemandados.getSelectionModel().getSelected() != undefined) {
                modelo.stgpEntidadesAbast.baseParams.idcentrobalance = vista.cbCtroBalance.getValue();
                modelo.stgpEntidadesAbast.baseParams.idindicador = vista.gridIndDemandados.getSelectionModel().getSelected().data.idindicador;
                modelo.stgpEntidadesAbast.baseParams.idejercicio = vista.cbEjercicio.getValue();
            } else {
                modelo.stgpEntidadesAbast.baseParams.idcentrobalance = null;
                modelo.stgpEntidadesAbast.baseParams.idindicador = null;
            }
        }, this);
        modelo.stgpEntidadesAbast.on('load', function(st, record, ob) {
            _this.cambiarTituloFiltrarEspAbast(_this.vista);
        }, this);

        modelo.stEnconProd.on('load', function(st, record, ob) {
            _this.cambiarTituloFiltrarProdPorEsp(_this.vista);
        }, this);

        vista.btnLimpiarRedt.on('click', function() {
            _this.limpiarIndDem(vista);
        }, this);
        vista.btnLimpiarRedtEA.on('click', function() {
            this.limpiarEspAbast(vista);
        }, this);
        //limpiarProductos
        vista.btnLimpiarProductos.on('click', function() {
            this.limpiarProductos(vista);
        }, this);
        vista.smGpIndDemandados.on("rowselect", function(sm, rowIndex, record) {
            modelo.stgpEntidadesAbast.reload({
                params: {
                    start: 0,
                    limit: 10
                }
            });
        });

        vista.cbCtroBalance.on('select', function(st, record, ob) {
            modelo.stgpIndDemandados.reload({
                params: {
                    start: 0,
                    limit: 20
                }
            });
        }, this);
        vista.btnExportar.on('click', function(st, record, ob) {
            this.exportar(vista);
        }, this);
//EXPORTAR LOS REPORTES
        vista.btnExportarReportes.on('click', function(st, record, ob) {
            this.ExportarReportes(vista);
        }, this);

        vista.btnLimpiarFiltrosProdPorEsp.on('click', function(st, record, ob) {
            this.limpiarIUProdPorEsp(vista);
        }, this);

        modelo.stEnconProd.on('beforeload', function(st, record, ob) {
            modelo.stEnconProd.baseParams.idespecialidad = vista.gridEntAbastecedoras.getSelectionModel().getSelected().data.idespecialidad;
            modelo.stEnconProd.baseParams.idindicador = vista.gridIndDemandados.getSelectionModel().getSelected().data.idindicador;
        }, this);

        Ext.getCmp('btnubicarprod').on('click', function(st, record, ob) {
            vista.winEnconProd.show();
            vista.gpEnconProd.getStore().load({
                params: {
                    start: 0,
                    limit: 20
                }
            });
        }, this);
    },
    importeTotal: function(valor) {
        if (valor)
        {
            _this.vista.importeTotal.setValue(valor);
        }
    },
    confredist: function(btn) {
        if (btn == 'ok') {
            var progressbar = Ext.MessageBox.show({
                title: 'Por favor espere...',
                msg: 'Redistribuyendo indicadores',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6'
            });

            Ext.Ajax.request({
                url: 'ejecutarRedistribucion',
                params: {
                    idcentrobalance: this.idcb
                },
                callback: function(options, success, response) {
                    progressbar.hide();
                    var response = Ext.decode(response.responseText);
                    if (response.codMsg == 21) {
                        mostrarMensaje(1, "El(los) indicadores ha(n) sido redistribuido(s) satisfactoriamente.");
                        _this.vista.gridIndDemandados.getStore().reload();

                    } else {
                        mostrarMensaje(3, response.mensaje);
                    }
                }
            });

        }
    },
    redistribuir: function(vista, idcentrobalance) {
        var progressbar = Ext.MessageBox.show({
            title: 'Por favor espere...',
            msg: 'Redistribuyendo indicadores',
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6'
        });

        Ext.Ajax.request({
            url: 'ejecutarRedistribucion',
            params: {
                idcentrobalance: idcentrobalance
            },
            callback: function(options, success, response) {
                progressbar.hide();
                var response = Ext.decode(response.responseText);
                if (response.codMsg == 21) {
                    mostrarMensaje(1, "El(los) indicadores ha(n) sido redistribuido(s) satisfactoriamente.");
                    vista.gridIndDemandados.getStore().reload();

                } else {
                    mostrarMensaje(3, response.mensaje);
                }
            }
        });
    },
    cambiarTituloFiltrarIndDem: function(vista) {
        var filtrado_por = "";
        var sep = "/";
        if (vista.filtrosindidemandados.getFiltrosActivos() == undefined || vista.filtrosindidemandados.getFiltrosActivos().length == 0) {
            vista.gridIndDemandados.setTitle('Indicadores Demandados');
        } else {
            for (i = 0; i < vista.filtrosindidemandados.getFiltrosActivos().length; i++) {
                var numberCol = vista.gridIndDemandados.getColumnModel().findColumnIndex(vista.filtrosindidemandados.getFiltrosActivos()[i].dataIndex);
                if (i == vista.filtrosindidemandados.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += vista.gridIndDemandados.getColumnModel().getColumnHeader(numberCol) + sep;
            }
            vista.gridIndDemandados.setTitle('Indicadores Demandados ' + "<i> " + 'Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    },
    cambiarTituloFiltrarEspAbast: function(vista) {
        var filtrado_por = "";
        var sep = "/";
        if (vista.filtrosespecialidades.getFiltrosActivos() == undefined || vista.filtrosespecialidades.getFiltrosActivos().length == 0) {
            vista.gridEntAbastecedoras.setTitle('Especialidades Abastecedoras');
        } else {
            for (i = 0; i < vista.filtrosespecialidades.getFiltrosActivos().length; i++) {
                var numberCol = vista.gridEntAbastecedoras.getColumnModel().findColumnIndex(vista.filtrosespecialidades.getFiltrosActivos()[i].dataIndex);
                if (i == vista.filtrosespecialidades.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += vista.gridEntAbastecedoras.getColumnModel().getColumnHeader(numberCol) + sep;
            }
            vista.gridEntAbastecedoras.setTitle('Especialidades Abastecedoras ' + "<i> " + 'Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    },
    cambiarTituloFiltrarProdPorEsp: function(vista) {
        var filtrado_por = "";
        var sep = "/";
        if (vista.filtrosprodporesp.getFiltrosActivos() == undefined || vista.filtrosprodporesp.getFiltrosActivos().length == 0) {
            vista.gpEnconProd.setTitle('Productos');
        } else {
            for (i = 0; i < vista.filtrosprodporesp.getFiltrosActivos().length; i++) {
                var numberCol = vista.gpEnconProd.getColumnModel().findColumnIndex(vista.filtrosprodporesp.getFiltrosActivos()[i].dataIndex);
                if (i == vista.filtrosprodporesp.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += vista.gpEnconProd.getColumnModel().getColumnHeader(numberCol) + sep;
            }
            vista.gpEnconProd.setTitle('Productos ' + "<i> " + 'Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    },
    limpiarIndDem: function(vista) {
        vista.filtrosindidemandados.clearFilters();
        vista.gridIndDemandados.getStore().reload();
       // vista.cbCtroBalance.clearValue();
    },
    limpiarProductos: function(vista) {
        Planificacion.BalanceMaterial.Redistribucion.Vista.filtroproductos.clearFilters();
        Planificacion.BalanceMaterial.Redistribucion.Vista.gpProductos.getStore().reload();
    },
    limpiarEspAbast: function(vista) {
        vista.filtrosespecialidades.clearFilters();
        vista.gridEntAbastecedoras.getStore().reload();
    },
    limpiarIUProdPorEsp: function(vista) {
        vista.filtrosprodporesp.clearFilters();
    },
    exportar: function(vista) {
        var win = window.open('exportar?idcentrobalance=' + this.idcb
                + '&filtros=' + Ext.encode(vista.filtrosindidemandados.getFilterData()));
    },
    ExportarReportes: function(vista) {
        var start = 0;
        var limit = 20;
        var win = window.open('exportarReportes?identidad=' + identidadselected + '&idejercicio=' + Planificacion.BalanceMaterial.Redistribucion.Vista.cbEjercicio.getValue()
                + '&hoja=' + hoja + '&start' + start + '$limit' + limit + '&filtros=' + Ext.encode(vista.filtroproductos.getFilterData()));
    },
    setLosImportes: function(vista) {
        vista.importes = [];
        vista.importes.push('0.000'); //indice 0
        vista.importes.push('0.000'); //indice 1 SATISFECHA
        vista.importes.push('0.000'); //indice 2 DNS

    },
    calcularLosImportes: function(vista, st) {
        _this.setLosImportes(vista);
        if (st.getCount() > 0) {
            vista.importes[1] = st.reader.jsonData.importetotal;
            vista.importes[2] = st.reader.jsonData.importesatisfecha;
            vista.importes[3] = st.reader.jsonData.importedns;
            vista.importeTotal.setValue(vista.importes[vista.cbImportes.getValue()]);
        }
    }


}

