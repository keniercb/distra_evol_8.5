/*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */

Planificacion.Integracion.MatrizrelacionesController = Ext.extend(Std.Base.Controller, {
    constructor: function () {
        var config = {
            labels: Planificacion.Integracion.Etiquetas,
            globals: {
                dirImg: Planificacion.Integracion.Imagenes
            }
        };
        this.init(config);
    },
    mostrarAyuda: function (referencia) {
        var title = 'Ayuda';
        help.show(title, referencia);
    },
    getMatrizXProyecto: function (obj) {
        var me = this;
        console.log(obj);
        Secodena.mostrarMascara('matrizxproyecto', 'Espere', 'Cargando datos...');
        Ext.Ajax.request({
            url: (obj.url) ? obj.url : Planificacion.Integracion.UrlModulo + 'matrizrelaciones/getmatrizxproyecto',
            method: 'POST',
            params: {
                idproyectoplanificacion: obj.idproyectoplanificacion,
                denominacion: obj.denominacionproyecto,
                columnas: Ext.encode(obj.columnas),
                filas: Ext.encode(obj.filas),
                datos: Ext.encode(obj.datos)
            },
            success: function (resp, obje) {
                var response = Ext.decode(resp.responseText);
                if (response.codMsg == 3) {
                    mostrarMensaje(3, response.mensaje);
                    Secodena.ocultarMascara('matrizunidades');
                } else {
                    me.crearMatriz(response, 'winMatriz', 'Matriz de recursos del proyecto:  ' + obj.denominacionproyecto, 'matrizxproyecto', {
                        tipodato: true,
                        nombrerelacion: (obj.nombrerelacion) ? (obj.nombrerelacion) : '',
                        totaldatos: true,
                        valor: true,//se le pasa para mostrar el valor,
                        recursos: true//Se le pasa para mostrar los recursos
                    });
                    Secodena.ocultarMascara('matrizxproyecto');
                }
            }
        });
    },
    getMatrizHibridaTareas: function (obj) {
        var me = this;
        console.log(obj);
        Secodena.mostrarMascara('matrizxproyecto', 'Espere', 'Cargando datos...');
        Ext.Ajax.request({
            url: (obj.url) ? obj.url : Planificacion.Integracion.UrlModulo + 'matrizrelaciones/getmatrizhibridatareas',
            method: 'POST',
            params: {
                idproyectoplanificacion: obj.idproyectoplanificacion,
                denominacion: obj.denominacionproyecto,
                columnas: Ext.encode(obj.columnas),
                filas: Ext.encode(obj.filas),
                datos: Ext.encode(obj.datos)
            },
            success: function (resp, obje) {
                var response = Ext.decode(resp.responseText);
                if (response.codMsg == 3) {
                    mostrarMensaje(3, response.mensaje);
                    Secodena.ocultarMascara('matrizunidades');
                } else {
                    me.crearMatriz(response, 'winMatriz', 'Matriz de h&iacute;brida por tareas del proyecto:  ' + obj.denominacionproyecto, 'matrizxproyecto', {
                        tipodato: true,
                        totaldatos: true,
                        hibridatarea: true,
                        nombrerelacion: 'Actividades'

                    }, ' ');
                    Secodena.ocultarMascara('matrizxproyecto');
                }
            }
        });
    },
    getMatrizHibrida: function (obj) {
        var me = this;
        //console.log(obj);
        Secodena.mostrarMascara('matrizhibrida', 'Espere', 'Cargando datos...');
        Ext.Ajax.request({
            url: (obj.url) ? obj.url : Planificacion.Integracion.UrlModulo + 'matrizrelaciones/getmatrizhibrida',
            method: 'POST',
            params: {
                idproyectoplanificacion: obj.idproyectoplanificacion,
                denominacion: obj.denominacionproyecto,
                columnas: Ext.encode(obj.columnas),
                filas: Ext.encode(obj.filas),
                datos: Ext.encode(obj.datos)
            },
            success: function (resp, obje) {
                var response = Ext.decode(resp.responseText);
                if (response.codMsg == 3) {
                    mostrarMensaje(3, response.mensaje);
                    Secodena.ocultarMascara('matrizhibrida');
                } else {

                    me.crearMatriz(response, 'winMatriz', 'Matriz de h&iacute;brida del proyecto:  ' + obj.denominacionproyecto, 'matrizhibrida', {
                        tipodato: true,
                        codigo: true,
                        totaldatos: false,
                        nombrerelacion: 'Denominaci&oacute;n'
                    }, ' ');
                    Secodena.ocultarMascara('matrizxproyecto');
                }
            }
        });
    },
    getMatrizPresupuesto: function (obj) {
        var me = this;
        Secodena.mostrarMascara('matrizPresupuesto', 'Espere', 'Cargando datos...');
        Ext.Ajax.request({
            url: (obj.url) ? obj.url : Planificacion.Integracion.UrlModulo + 'matrizrelaciones/getmatrizpresupuesto',
            method: 'POST',
            params: {
                idproyectoplanificacion: obj.idproyectoplanificacion,
                denominacion: obj.denominacionproyecto,
                columnas: Ext.encode(obj.columnas),
                filas: Ext.encode(obj.filas),
                datos: Ext.encode(obj.datos)
            },
            success: function (resp, obje) {
                var response = Ext.decode(resp.responseText);
                if (response.codMsg == 3) {
                    mostrarMensaje(3, response.mensaje);
                    Secodena.ocultarMascara('matrizPresupuesto');
                } else {

                    me.crearMatriz(response, 'winMatriz', 'Matriz de presupuesto del proyecto:  ' + obj.denominacionproyecto, 'matrizPresupuesto', {
                        tipodato: true,
                        totaldatos: false, estado: true,
                        nombrerelacion: 'Tareas /Fecha'

                    }, ' ');
                    Secodena.ocultarMascara('matrizPresupuesto');
                }
            }
        });
    },
    getMatrizTiempos: function (obj) {
        var me = this;
        Secodena.mostrarMascara('matrizTiempos', 'Espere', 'Cargando datos...');
        Ext.Ajax.request({
            url: (obj.url) ? obj.url : Planificacion.Integracion.UrlModulo + 'matrizrelaciones/getmatriztiempo',

            method: 'POST',
            params: {
                idproyectoplanificacion: obj.idproyectoplanificacion,
                denominacion: obj.denominacionproyecto,
                columnas: Ext.encode(obj.columnas),
                filas: Ext.encode(obj.filas),
                datos: Ext.encode(obj.datos)
            },
            success: function (resp, obje) {
                var response = Ext.decode(resp.responseText);
                if (response.codMsg == 3) {
                    mostrarMensaje(3, response.mensaje);
                    Secodena.ocultarMascara('matrizTiempos');
                } else {

                    me.crearMatriz(response, 'winMatriz', 'Matriz de tiempos del proyecto:  ' + obj.denominacionproyecto, 'matrizTiempos', {
                        tipodato: true,
                        totaldatos: false, estado: true,
                        nombrerelacion: 'Tareas/Involucrados'

                    }, ' ');
                    Secodena.ocultarMascara('matrizTiempos');
                }
            }
        });
    },
    crearMatriz: function (response, idventana, tituloventana, idmascara, obj, subtitulo) {
        //console.log(response.idproyecto);
        var me = this;
        var cmp = new Planificacion.Integracion.GridEstudioMatrizRelaciones({
            id: 'GridEstudioMatrizRelaciones&' + me.id + '&' + response.idproyecto,
            valor: obj.valor,
            baseCls: ( obj.valor) ? 'header-black' : '',
            title: ( subtitulo) ? subtitulo : '&nbsp;  Distribuci&oacute;n de recursos por proyectos.',
            recursos: obj.recursos,
            codigo: obj.codigo,
            hibridatarea: obj.hibridatarea,
            estado: obj.estado,
            config: {
                createTbar: true,
                createBbar: true,
                editable: true,
                idproyecto: response.idproyecto
            },
            record: response
        });

        var winMatriz = new Ext.Window({
            id: idventana,
            style: 'z-index:990000;',
            width: 900,
            maximizable: true,
            height: 600,
            modal: true,
            closeAction: 'destroy',
            layout: 'border',
            title: tituloventana,
            items: [cmp]
        });

        if (response.filas_columnas) {
            cmp.createMatrix({
                idproyecto: response.idproyecto,
                tipodato: obj.tipodato,
                totaldatos: obj.totaldatos,
                nombrerelacion: obj.nombrerelacion,
                cantrelaciones: obj.cantrelaciones
            }, response.filas_columnas, response.datos);
        } else {
            winMatriz.show();
        }


        cmp.on('mostrarVentana', function (cmp) {
            winMatriz.show();
        });
        cmp.on('cerrarVentana', function (cmp) {
            winMatriz.close();
        })

        Secodena.ocultarMascara(idmascara);

    },
    obtenerConfiguracionMatrizRelaciones: function (idproyecto) {
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgGuardando);
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/loadcolumns',
            method: 'POST',
            params: {
                idproyecto: idproyecto,
                datos: (gridmatrizrelaciones.record.datos) ? Ext.encode(gridmatrizrelaciones.record.datos) : false
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto3');
                if (!responseData.success) {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas[responseData.message]);
                }
                gridmatrizrelaciones.reconfigureGrid(responseData);
                gridmatrizrelaciones.validateButtons();
            }
        });
    },
    saveColumna: function (idcolumna, text, idproyecto) {
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgGuardando);
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/savecolumnas',
            method: 'POST',
            params: {
                idcolumna: idcolumna,
                idproyecto: idproyecto,
                text: text
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto3');
                if (!responseData.success) {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas[responseData.message]);
                }
                gridmatrizrelaciones.reconfigureGrid(responseData);
                gridmatrizrelaciones.validateButtons();
            }
        });
    },
    saveConfig: function (config) {
        var me = this;
//        var etiquetas = me._getLabel('Map');
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgGuardando);
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/saveconfig',
            method: 'POST',
            params: {
                config: Ext.encode(config)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto3');
                if (!responseData.success) {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas[responseData.message]);
                } else {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas.successConfig);
                }
                gridmatrizrelaciones.reconfigureGrid(responseData);
            }
        });
    },
    insertColumnRow: function (params) {
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgGuardando);
        params.idestudiomatrizrelacion = gridmatrizrelaciones.config.idestudiomatrizrelacion;
        params.idproyecto = gridmatrizrelaciones.config.idproyecto;
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/insertrolumnrow',
            method: 'POST',
            params: {
                params: Ext.encode(params)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto3');
                if (responseData.success) {
                    mostrarMensaje(1, params.fila ? gridmatrizrelaciones.etiquetas.successAddRow : gridmatrizrelaciones.etiquetas.successAddColumn);
                } else if (gridmatrizrelaciones.etiquetas.msgNoRowsMatrix) {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas[responseData.message]);
                }
                gridmatrizrelaciones.reconfigureGrid(responseData);
            }
        });
    },
    deleteColumnRow: function (params, callbackfn) {
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgEliminando);
        params.idestudiomatrizrelacion = gridmatrizrelaciones.config.idestudiomatrizrelacion;
        params.idproyecto = gridmatrizrelaciones.config.idproyecto;
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/deletecolumnrow',
            method: 'POST',
            params: {
                params: Ext.encode(params)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto3');
                if (responseData.success) {
                    mostrarMensaje(1, params.fila ? gridmatrizrelaciones.etiquetas.successDelRow : gridmatrizrelaciones.etiquetas.successDelColumn);
                } else {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas[responseData.message]);
                }
                callbackfn(responseData);
            }
        });
    },
    updateColumnRow: function (params) {
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgEliminando);
        params.idestudiomatrizrelacion = gridmatrizrelaciones.config.idestudiomatrizrelacion;
        params.idproyecto = gridmatrizrelaciones.config.idproyecto;
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/updatecolumnrow',
            method: 'POST',
            params: {
                params: Ext.encode(params)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto3');
                if (!responseData.success) {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas[responseData.message]);
                } else {
                    mostrarMensaje(1, params.fila ? gridmatrizrelaciones.etiquetas.successUpdRow : gridmatrizrelaciones.etiquetas.successUpdColumn);
                    gridmatrizrelaciones.reconfigureGrid(responseData);
                }
            }
        });
    },
    createMatrix: function (config, columnrows, datos, calback) {
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgGuardando);
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/creatematrix',
            method: 'POST',
            params: {
                config: Ext.encode(config),
                columnrows: Ext.encode(columnrows),
                datos: Ext.encode(datos)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto3');
                if (!responseData.success) {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas[responseData.message]);
                }
                calback(responseData);
            }
        });

    },
    saveCells: function (params) {
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgEliminando);
        params.idestudiomatrizrelacion = gridmatrizrelaciones.config.idestudiomatrizrelacion;
        params.idproyecto = gridmatrizrelaciones.config.idproyecto;
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/saveCells',
            method: 'POST',
            params: {
                params: Ext.encode(params)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Secodena.ocultarMascara('msgProyecto3');
                if (!responseData.success) {
                    mostrarMensaje(1, gridmatrizrelaciones.etiquetas[responseData.message]);
                } else {
                    gridmatrizrelaciones.loadCells(responseData);
                }
            }
        });
    },
    export: function (type, filename, exporthtml) {
        var gridmatrizrelaciones = this._getItem('matrizrelaciones');
//        Secodena.mostrarMascara('msgProyecto3', gridmatrizrelaciones.etiquetas.msgExportando);
//        document.getElementById('type').value = type;
//        document.getElementById('filename').value = filename;
//        document.getElementById('html').value = exporthtml;
//        var formexport = document.getElementById('exportarResultadoMatriz');
//        formexport.action = '/planificacion/herramientasintegracion/index.php/matrizrelaciones/export';
//        formexport.submit();
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/export',
            method: 'POST',
            form: 'exportarResultadoMatriz',
            params: {
                type: type,
                filename: filename,
                table: exporthtml,
                download: false
            },
            callback: function (options, success, response) {
                window.location.href = '/planificacion/herramientasintegracion/index.php/matrizrelaciones/export?download=true'
            }
        });
    },

    obtenerReporte: function (params) {

        $.when(this.crearMatrixHTML(params.view)).then(function (obj) {
            //console.info(obj)
            obj = {
                view: this,
                path: '/planificacion/herramientasintegracion/index.php/matrizrelaciones/obtenerReporte',
                baseParams: {
                    denominacion: params.denominacion,
                    tabla: obj.table,
                    exportFormat: ['RTF', 'EXCEL']
                },
                fnFailure: function () {
                    mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
                }
            };
            console.log(params.cmp)
            params.cmp.fireEvent('cerrarVentana');
            reportes.create(obj);
        });
    },
    crearMatrixHTML: function (view) {

        page = $(view.el.dom).clone();
        var data = [];
        var columns = [];
        var isFirst = true;

        //Tables
        $(page).find('table').each(function () {

            // tr
            $(this).find('tr').each(function () {

                // td
                $(this).find('td').each(function () {

                    // td del header
                    if ($(this).hasClass('x-grid3-hd')) {

                        if ($(this).css('display') != 'none') {
                            if ($(this).find('div')[0].innerText != "") {
                                columns.push($(this).find('div')[0].innerText);
                            } else if ($(this).css('display') != 'none' && isFirst) {
                                if ($(this).find('div')[0].innerText == "") {
                                    columns.push('/');
                                } else {
                                    columns.push($(this).find('div')[0].innerText);
                                }

                                isFirst = false;
                            }
                        }
                    }

                    else if ($(this).hasClass('x-grid3-col') && !$(this).hasClass('x-grid3-cell-first') &&
                        $(this).css('display') != 'none') {
                        data.push($(this).find('div')[0].innerText);
                    }
                });

            });


        });

        var index = 0;
        var element = '';
        var tds = [];
        var result = [];

        for (var i = 0; i < data.length; i++) {

            if (index == 0) {
                element = {};
                element[columns[index]] = data[i];
                index++;
            }
            else if (index == columns.length - 1) {
                element[columns[index]] = data[i];
                tds.push(element);
                element = '';
                index = 0;
            }
            else {
                element[columns[index]] = data[i];
                index++;
            }
        }

        result['table'] = {columns: columns, data: tds};
        //console.log(result);
        return result;
    }
});
