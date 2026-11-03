Ext.ns('Pvd.Nomina.Recuperacion.Reclistadocuotas');
Pvd.Nomina.Recuperacion.Reclistadocuotas.Controlador = {
    init: function (idioma, vista, modelo) {
        var self = this;
        var variables = {
            identidad: -1,
            arridfechas: new Array(),
            idconfafiliacion: -1,
            idorganizacion: -1,
            denominacion: '',
        };
        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();
        //Eventos del objeto del árbol de entidades.
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
                variables.identidad = nodo.id;
                vista.identidad = nodo.id;
                vista.btnAceptarEntidades.enable();
            /*} else {
                variables.identidad = null;
                //vista.identidad = null;
                vista.btnAceptarEntidades.disable();
            }*/
        });

        vista.btnAceptarEntidades.setHandler(function () {
            vista.ventanaResumenPeriodos.show();
            modelo.stFechasCierre.load({params: {identidad: variables.identidad}});
        });

        vista.gpFechasCierre.getSelectionModel().on('selectionchange', function (sm, index, record) {
            var seleccion = vista.gpFechasCierre.getSelectionModel().getSelections();
            (seleccion.length > 0) ? vista.btnAceptarResumenPeriodos.enable() : vista.btnAceptarResumenPeriodos.disable();
        });

        vista.btnAceptarResumenPeriodos.setHandler(function () {
            var arridfechascierre = new Array();
            var datos = vista.gpFechasCierre.getSelectionModel().getSelections();
            Ext.each(datos, function (rec) {
                arridfechascierre.push(rec.get('idfechascierre'));
            });
            variables.arridfechas = arridfechascierre;
            vista.idestructura = variables.identidad;
            vista.winPersonasAfiliadas.show();

            modelo.stAfiliaciones.load();
        });

        vista.cbConfAfiliaciones.on('select', function (cb, record, index) {
            vista.btnExportarListado.enable();
            variables.idconfafiliacion = record.get('idconfafiliacion');
            variables.idorganizacion = record.get('idafiliacion');
            variables.denominacion = record.get('denominacion');
            PVD.mostrarMascara('idmaskafiliados', 'Por favor espere…', 'Buscando las personas afiliadas a esta organizaci&oacute;n...');
            Ext.Ajax.request({
                timeout: 50000000000000000,
                url: 'obtenerPersonasAfiliadas',
                method: 'POST',
                params: {
                    identidad: variables.identidad,
                    arrfechas: Ext.encode(variables.arridfechas),
                    idconfafiliacion: record.get('idconfafiliacion'),
                    idorganizacion: record.get('idafiliacion')
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    self.fnReconfigurarGridDinamico(respuesta, vista.gpListadoPersonasAfiliadas);
                    PVD.ocultarMascara('idmaskafiliados');
                }.createDelegate(this)
            });

        });

        /* vista.btnAcpReporte.on('click', function () {
         var winload = new Ext.PVD.comun.window.winLoad({
         title: 'Por favor espere...',
         mensaje: 'Generando reporte'
         });
         winload.showMask();
         window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/reclistadocuotas/exportarListadoAfiliados?identidad=' + variables.identidad + '&tipoafiliacion=' + vista.tipoafiliacion + '&arrfechas=' + Ext.encode(variables.arridfechas));
         winload.hideMask();

         vista.winTipoAfilacionReporte.hide();
         }); */

        vista.btnExportarListado.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/reclistadocuotas/exportarListadoAfiliados?identidad=' +
            variables.identidad + '&arrfechas=' + Ext.encode(variables.arridfechas) + '&idconfafiliacion=' + variables.idconfafiliacion +
            '&idorganizacion=' + variables.idorganizacion + '&denominacion=' + variables.denominacion);
            winload.hideMask();

            vista.winTipoAfilacionReporte.hide();
        });


    },
    fnOrdenarPorAreas: function (val) {
        var arrArea = val.split("-");
        //val = arrArea[1] + "-" + arrArea[2];
        val = (arrArea.length > 1) ? arrArea[1] : arrArea[0];
        return val;
    },
    fnReconfigurarGridDinamico: function (respuesta, grid) {
        //console.info(respuesta.datos.columnas);
        //console.info(respuesta.datos.personas);
        //modelo.stPersonasAfiliadas
        var columns = new Array();
        var indexs = new Array();
        columns.push(
            new Ext.grid.RowNumberer(),
            {
                dataIndex: 'idpersona',
                header: 'idpersona',
                hidden: true,
                hideable: false
            },
            {
                dataIndex: 'area',
                header: 'Area',
                hidden: true,
                hideable: false, renderer: this.fnOrdenarPorAreas
            },
            {
                dataIndex: 'ci',
                header: '<center>CI</center>',
                width: 120,
                hideable: false,
                sortable: true,
                renderer: function (val) {
                    return '<center>' + val + '</center>';
                }
            },
            {
                dataIndex: 'nombreapellidos',
                header: '<center>Nombre y apellidos</center>',
                width: 280,
                hideable: false,
                sortable: true
            },
            {
                dataIndex: 'organizacion',
                header: '<center>Organizaci&oacute;n</center>',
                width: 120,
                hideable: false,
                sortable: true,
                renderer: function (val) {
                    return '<center>' + val + '</center>';
                }
            }
        );
        indexs.push({name: 'idpersona'}, {name: 'area'}, {name: 'ci'}, {name: 'nombreapellidos'}, {name: 'organizacion'});
        Ext.each(respuesta.datos.columnas, function (value) {
            columns.push({
                dataIndex: value,
                sortable: true,
                header: (
                    (value == "Total" || value == "Redondeo")
                        ? '<span style="color:maroon;"><center>' + value + '</center></span>'
                        : (value == "Pago") ? '<span style="color:green;"><center>' + value + '</center></span>'
                            : '<center>' + value + '</center>'),
                width: 150,
                renderer: function (val) {
                    if (value == "Total" || value == "Redondeo")
                        return '<span style="color:maroon;"><center>' + val + '</center></span>';
                    else if(value == "Pago")
                        return '<span style="color:green;"><center>' + val + '</center></span>';
                    else
                        return '<center>' + val + '</center>';
                }
            });
            indexs.push({name: value});
        });

        var cm = new Ext.grid.ColumnModel(columns);
        var record = new Ext.data.Record.create(indexs);
        var reader = new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos"
        }, record);
        var datosGrid = {
            'datos': respuesta.datos.personas,
            'cantidad': respuesta.datos.personas.length

        };
        var storeGrid = new Ext.data.GroupingStore({
            reader: reader,
            sortInfo: {field: 'nombreapellidos', direction: "ASC"},
            groupField: 'area'
        });
        storeGrid.loadData(datosGrid);
        grid.reconfigure(storeGrid, cm);
    }
};