Ext.QuickTips.init();
Ext.ns('Ext.Zeolides.Diasnolaborables');

Ext.Zeolides.Diasnolaborables.Controlador = {

    init: function (idioma, vista, modelo) {
        var scope = this;
        var rectipodia;
        var rectipodiaplanif;
        this.fechasConAsistencia = new Array();
        this.fechasConAsistenciaPlanif = new Array();
        var fecha = new Date();
        this.annoactual = fecha.getFullYear();
        this.configurado = 0;

        modelo.storeCbRegimentrabajoPer.load({
            callback: function (r, opt, succ) {
                vista.cbRegimenTrabajoPers.setValue(r[0].data.idregimentrabajo);
                modelo.fuenteDatosListado.load({
                    params: {
                        filtro: vista.tfbuscar.getValue(),
                        idregimentrabajo: r[0].data.idregimentrabajo
                    }
                })
            }
        });

        Ext.Ajax.request({
            url: 'isPeriodoConfigurado',
            method: 'POST',
            params: {
                anno: scope.annoactual
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData == 1) {
                    Ext.getCmp('rangoquincenal').enable();
                    Ext.getCmp('rangomensual').disable();
                    scope.configurado = 1;
                }
                else if (responseData == 2) {
                    Ext.getCmp('rangomensual').enable();
                    Ext.getCmp('rangoquincenal').disable();
                    scope.configurado = 2;
                }
                else if (responseData == 0) {
                    Ext.getCmp('rangomensual').enable();
                    Ext.getCmp('rangoquincenal').enable();
                    scope.configurado = 0;
                }
            }
        });

        modelo.storeGruposRegimen.load({
            params: {limit: 25, start: 0}, callback: function (recs, opt, sucs) {
            }
        });
        modelo.storeTurnoTrabajo.load();
        modelo.storeTipodia.load({
            callback: function (recs, opt, sucs) {
                var string = '<table width="450" height="200">';
                Ext.each(recs, function (rec) {
                    var fila = '<tr>' +
                        '<td  width="50"><span style="background-color:' + rec.data.color + ' "></span></td>' +
                        '<td  width="250">' + rec.data.denominacion + '</td>' +
                        '</tr>';
                    string += fila;
                });
                string += '</table>';

                vista.panelLeyenda.html = string;
                vista.panelLeyenda.doLayout();

            }
        });

        var rowselected = false;

        vista.cbRegimenTrabajoPers.on('select', function (cb, rec, ind) {
            modelo.fuenteDatosListado.load({
                params: {
                    filtro: vista.tfbuscar.getValue(),
                    idregimentrabajo: rec.data.idregimentrabajo
                }
            })
        });

        vista.btnBuscarpers.on('click', function () {
            modelo.fuenteDatosListado.load({
                params: {
                    filtro: vista.tfbuscar.getValue(),
                    idregimentrabajo: vista.cbRegimenTrabajoPers.getValue()
                }
            })
        });

        vista.btnLimpiarpers.on('click', function () {
            vista.tfbuscar.reset();
            modelo.fuenteDatosListado.load({
                params: {
                    filtro: vista.tfbuscar.getValue(),
                    idregimentrabajo: vista.cbRegimenTrabajoPers.getValue()
                }
            })
        });

        vista.tabs.on('tabchange', function (tp, tab) {
            if (tab.getId() == 'gridPersonas1') {
                vista.btnLimpiar.disable();
                vista.smgridGruposRegimen.clearSelections();
            }else{
                vista.smPersona.clearSelections();
            }
        });

        vista.smPersona.on('rowselect', function (th) {
            //vista.btnLimpiar.enable();
            vista.tipodia.enable();
            vista.btnEliminar.enable();
            vista.btnGuardar.enable();
            if (scope.configurado == 1) {
                vista.panelInformativo.getLayout().setActiveItem(1);
                if (vista.smPersona.getSelected())
                    cargarResumenQuincena();
            }
            else if (scope.configurado == 2 || scope.configurado == 0) {
                vista.panelInformativo.getLayout().setActiveItem(0);
                if (vista.smPersona.getSelected())
                    cargarResumen();
            }
            vista.panelInformativo.doLayout();console.log(vista.smPersona.getSelected().get('idcargo'))
            paintDates(vista.smPersona.getSelected().get('idgrupodescanso'), vista.smPersona.getSelected().get('idpersona'), vista.smPersona.getSelected().get('idcargo'));
        }, this);

        vista.smPersona.on('rowdeselect', function (th, ind, rec) {
            vista.tipodia.disable();
            vista.panelDatepicker.disable();
            vista.btnEliminar.disable();
            vista.btnGuardar.disable();
        });

        vista.smgridGruposRegimen.on('rowselect', function (th) {
            vista.tipodia.enable();
            vista.btnLimpiar.enable();
            vista.btnEliminar.enable();
            vista.btnGuardar.enable();
            // vista.btnPlanificar.enable();
            vista.btnPlanificacion.menu.items.items[0].enable();
            vista.btnLimitar.enable();
            rowselected = true;

            if (scope.configurado == 1) {
                vista.panelInformativo.getLayout().setActiveItem(1);
                if (vista.gridGruposRegimen.getSelectionModel().getSelected())
                    cargarResumenQuincena();
            }
            else if (scope.configurado == 2 || scope.configurado == 0) {
                vista.panelInformativo.getLayout().setActiveItem(0);
                if (vista.gridGruposRegimen.getSelectionModel().getSelected())
                    cargarResumen();
            }
            vista.panelInformativo.doLayout();
            paintDates(vista.smgridGruposRegimen.getSelected().get('idgrupodescanso'), -1, -1);
        });

        vista.smgridGruposRegimen.on('rowdeselect', function (th, ind, rec) {
            vista.tipodia.disable();
            vista.panelDatepicker.disable();
            vista.btnLimpiar.disable();
            vista.btnEliminar.disable();
            vista.btnGuardar.disable();
            vista.btnLimitar.disable();
            vista.btnPlanificacion.menu.items.items[0].disable();

            if (th.getCount() == 0 && !rowselected) {
                var rowselected = false;
            }
            else {
                var rowselected = false;
            }

        });

        vista.btnExportar.on('click', function () {
            exportar();
        });

        function exportar() {
            var params = Ext.urlEncode({
                anno: scope.annoactual
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Configuración del año',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrainHeader: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                            '/pvd/regimentrabajo/index.php/diasnolaborables/generarPdfReporte?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

        vista.btnGuardarFechas.on('click', function () {
            GuardarPeriodos();
        }, this);

        function GuardarPeriodos() {
            var arreglo = new Array();
            var anno = scope.annoactual;
            if (modelo.storeRangoFechas.modified.length > 0) {
                Ext.each(modelo.storeRangoFechas.modified, function (recs) {
                    if (recs.data.desde != null)
                        var fech = new Date(recs.data.desde).format("d/m/Y");
                    arreglo.push({
                        fdesde: fech,
                        fhasta: recs.data.hasta,
                        mes: recs.data.key,
                        anno: anno
                    });
                });
                PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
                Ext.Ajax.request({
                    url: 'guardarPeriodos',
                    method: 'POST',
                    params: {
                        arreglo: Ext.encode(arreglo)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mascaraEnviarDatos');
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.cod == 1) {
                            mostrarMensaje(1, idioma.msgPERok);
                        }
                        modelo.storeRangoFechas.load({params: {anno: scope.annoactual}});
                        Ext.getCmp('rangoquincenal').disable();
                        scope.configurado = 2;
                        vista.panelInformativo.getLayout().setActiveItem(0);
                        vista.panelInformativo.doLayout();
                        if (vista.gridGruposRegimen.getSelectionModel().getSelected())
                            cargarResumen();
                    }
                });
            } else {
                mostrarMensaje(1, 'No ha realizado cambio en los períodos.');
            }
        }

        vista.btnEliminarPeriodo.on('click', function () {
            EliminarPeriodoMes();
        }, this);

        function EliminarPeriodoMes() {
            mostrarMensaje(2, idioma.msgDELPeriodo, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgDELPeriodo);
                    Ext.Ajax.request({
                        url: 'delPeriodosMes',
                        params: {anno: scope.annoactual},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.codMsg == 3)
                                mostrarMensaje(3, idioma.lbTitMsgPeriodoUso);
                            else {
                                mostrarMensaje(1, idioma.msgDELPeriodook);
                                mostrarMensaje(1, idioma.msgDELPeriodook);
                            }
                            modelo.storeRangoFechas.reload();
                            Ext.getCmp('rangoquincenal').enable();
                            scope.configurado = 0;
                            vista.panelInformativo.getLayout().setActiveItem(1);
                            vista.panelInformativo.doLayout();
                            if (vista.gridGruposRegimen.getSelectionModel().getSelected())
                                cargarResumen();
                        }
                    });
                }
            });
        }

        vista.btnCerrarWinMes.on('click', function () {
            vista.winRangoFechas.hide();
        });

        vista.gpRangoFechas.on('afteredit', function (e) {
            var fecha = e.record.data.desde;
            var fech = new Date(fecha).format("m/d/Y");
            var indanterior = e.record.data.key - 1;
            if (indanterior == 0)
                indanterior = 12;
            var x = mostrarFecha(-1, fech);
            if (!Ext.isEmpty(e.record.data.desde)) {
                modelo.storeRangoFechas.getAt(indanterior - 1).set('hasta', x);
            } else {
                modelo.storeRangoFechas.getAt(indanterior - 1).set('hasta', ' ');
            }

            var estavacio = false;
            Ext.each(modelo.storeRangoFechas.getRange(), function (recs) {
                if (Ext.isEmpty(recs.data.desde) || Ext.isEmpty(recs.data.hasta)) {
                    estavacio = true;
                }
            });
            if (estavacio == true) {
                vista.btnGuardarFechas.disable();
            } else {
                vista.btnGuardarFechas.enable();
            }
        });

        vista.datePicker.on('afteryearchange', function (th, oldstartyear, newstartyear, picker) {
            scope.annoactual = newstartyear;
            vista.annoactual = newstartyear;
            if (vista.tabs.getActiveTab().id == 'gridGruposRegimen1' && vista.smgridGruposRegimen.getCount() > 0) {
                paintDates(vista.smgridGruposRegimen.getSelected().data.idgrupodescanso, -1, -1);
            }
            else if (vista.tabs.getActiveTab().id == 'gridPersonas1' && vista.smPersona.getCount() > 0) {
                paintDates(vista.smPersona.getSelected().get('idgrupodescanso'), vista.smPersona.getSelected().get('idpersona'), vista.smPersona.getSelected().get('idcargo'));
            }
            cargarResumen();
        },this);

        vista.gpRangoFechas.on('beforeedit', function (e) {
            var year = scope.annoactual;
            var month = e.record.data.key;
            var mes = (month < 10) ? ("0" + month) : month;
            var fecha = '01/' + mes + '/' + year;
            modelo.storeRangoFechas.getAt(e.record.data.key - 1).set('desde', fecha);
            var day = e.record.data.desde.split('/');
            if (day[0] == '01' && day[1] == '01') {
                var anno = year - 1
                var f = '12/01/' + anno;
                vista.desde.minValue = new Date(f);
            } else {
                var m = parseInt(mes) - 1
                var f = m + '/01/' + year;
                vista.desde.minValue = new Date(f);
            }

            if (day[0] == '01' && day[1] == '12') {
                var anno = year + 1
                var f = '01/' + daysInMonth('01', anno) + '/' + anno;
                vista.desde.maxValue = new Date(f);
            } else {
                var m = parseInt(mes) + 1
                var f = m + '/' + daysInMonth(m, year) + '/' + year;
                vista.desde.maxValue = new Date(f);
            }

        });

        function mostrarFecha(d, fech) {
            milisegundos = parseInt(35 * 24 * 60 * 60 * 1000);
            var fecha = new Date(fech);

            day = fecha.getDate();
            // el mes es devuelto entre 0 y 11
            month = fecha.getMonth() + 1;
            year = scope.annoactual;

            //Obtenemos los milisegundos desde media noche del 1/1/1970
            tiempo = fecha.getTime();

            //Calculamos los milisegundos sobre la fecha que hay que sumar o restar...
            milisegundos = parseInt(d * 24 * 60 * 60 * 1000);

            //Modificamos la fecha actual
            total = fecha.setTime(tiempo + milisegundos);

            day = fecha.getDate();
            month = fecha.getMonth() + 1;
            year = scope.annoactual;
            var mes = (month < 10) ? ("0" + month) : month;
            var dia = (day < 10) ? ("0" + day) : day;
            return dia + "/" + mes + "/" + year;
        }

        vista.btnGuardarFechasQuincenal.on('click', function () {
            GuardarPeriodosQuincenal();
        }, this);

        function GuardarPeriodosQuincenal() {
            var arreglo = new Array();
            var anno = scope.annoactual;
            if (modelo.storeRangoFechasQuincenal.modified.length > 0) {
                Ext.each(modelo.storeRangoFechasQuincenal.modified, function (recs) {
                    if (recs.data.desdeprimquincena != null)
                        var fechprimquincena = new Date(recs.data.desdeprimquincena).format("d/m/Y");
                    arreglo.push({
                        fdesdeprimquincena: fechprimquincena,
                        fdesdesegquincena: recs.data.desdesegquincena,
                        fhastaprimquincena: recs.data.hastaprimquincena,
                        fhastasegquincena: recs.data.hastasegquincena,
                        mes: recs.data.key,
                        anno: anno
                    });
                });
                PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
                Ext.Ajax.request({
                    url: 'guardarPeriodosQuincenal',
                    method: 'POST',
                    params: {
                        arreglo: Ext.encode(arreglo)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mascaraEnviarDatos');
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.cod == 1) {
                            mostrarMensaje(1, idioma.msgPERok);
                        }
                        modelo.storeRangoFechasQuincenal.load({params: {anno: scope.annoactual}});
                        Ext.getCmp('rangomensual').disable();
                        scope.configurado = 1;
                        vista.panelInformativo.getLayout().setActiveItem(1);
                        vista.panelInformativo.doLayout();
                        if (vista.gridGruposRegimen.getSelectionModel().getSelected())
                            cargarResumenQuincena();
                    }
                });
            } else {
                mostrarMensaje(1, 'No ha realizado cambio en los períodos.');
            }
        }

        vista.btnEliminarPeriodosQuin.on('click', function () {
            EliminarPeriodoQuin();
        }, this);

        function EliminarPeriodoQuin() {
            mostrarMensaje(2, idioma.msgDELPeriodo, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgDELPeriodo);
                    Ext.Ajax.request({
                        url: 'delPeriodosQuincenal',
                        params: {anno: scope.annoactual},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.codMsg == 3)
                                mostrarMensaje(3, idioma.lbTitMsgPeriodoUso);
                            else {
                                mostrarMensaje(1, idioma.msgDELPeriodook);
                            }
                            modelo.storeRangoFechasQuincenal.reload();
                            Ext.getCmp('rangomensual').enable();
                            scope.configurado = 0;
                            vista.panelInformativo.getLayout().setActiveItem(0);
                            vista.panelInformativo.doLayout();
                            if (vista.gridGruposRegimen.getSelectionModel().getSelected())
                                cargarResumen();

                        }
                    });
                }
            });
        }

        vista.btnCerrarWinQuin.on('click', function () {
            vista.winRangoFechasQuincenal.hide();
        });

        vista.gpRangoFechasQuincenal.on('afteredit', function (e) {
            var estavacio = false;
            Ext.each(modelo.storeRangoFechasQuincenal.getRange(), function (recs) {
                if (Ext.isEmpty(recs.data.desdeprimquincena) || Ext.isEmpty(recs.data.desdesegquincena) ||
                    Ext.isEmpty(recs.data.hastaprimquincena) || Ext.isEmpty(recs.data.hastasegquincena)) {
                    estavacio = true;
                }
            });

            if (estavacio == true) {
                vista.btnGuardarFechasQuincenal.disable();
            } else {
                vista.btnGuardarFechasQuincenal.enable();
            }
        });

        vista.gpRangoFechasQuincenal.on('beforeedit', function (e) {
            var year = scope.annoactual;
            var month = e.record.data.key;
            var mes = (month < 10) ? ("0" + month) : month;
            var fechadesdeprimquin = '01/' + mes + '/' + year;
            var fechahastaprimquin = '15/' + mes + '/' + year;
            var fechadesdesegquin = '16/' + mes + '/' + year;
            var cantdias = daysInMonth(mes, year);
            var fechahastasegquin = cantdias + '/' + mes + '/' + year;
            modelo.storeRangoFechasQuincenal.getAt(e.record.data.key - 1).set('desdeprimquincena', fechadesdeprimquin);
            modelo.storeRangoFechasQuincenal.getAt(e.record.data.key - 1).set('desdesegquincena', fechadesdesegquin);
            modelo.storeRangoFechasQuincenal.getAt(e.record.data.key - 1).set('hastaprimquincena', fechahastaprimquin);
            modelo.storeRangoFechasQuincenal.getAt(e.record.data.key - 1).set('hastasegquincena', fechahastasegquin);


            var f = mes + '/01/' + year;
            vista.desdeprimquincena.minValue = new Date(f);
            vista.desdesegquincena.minValue = new Date(f);
            vista.hastaprimquincena.minValue = new Date(f);
            vista.hastasegquincena.minValue = new Date(f);


            var ff = mes + '/' + daysInMonth(mes, year) + '/' + year;
            vista.desdeprimquincena.maxValue = new Date(ff);
            vista.desdesegquincena.maxValue = new Date(ff);
            vista.hastaprimquincena.maxValue = new Date(ff);
            vista.hastasegquincena.maxValue = new Date(ff);

        });

        function mostrarFechaQuincena(d, fech) {
            milisegundos = parseInt(35 * 24 * 60 * 60 * 1000);
            var fecha = new Date(fech);

            day = fecha.getDate();
            // el mes es devuelto entre 0 y 11
            month = fecha.getMonth() + 1;
            year = scope.annoactual;

            //Obtenemos los milisegundos desde media noche del 1/1/1970
            tiempo = fecha.getTime();

            //Calculamos los milisegundos sobre la fecha que hay que sumar o restar...
            milisegundos = parseInt(d * 24 * 60 * 60 * 1000);

            //Modificamos la fecha actual
            total = fecha.setTime(tiempo + milisegundos);

            day = fecha.getDate();
            month = fecha.getMonth() + 1;
            year = scope.annoactual;
            var mes = (month < 10) ? ("0" + month) : month;
            var dia = (parseInt(day) < 10) ? ("0" + parseInt(day)) : parseInt(day);
            return dia + "/" + mes + "/" + year;
        }

        function daysInMonth(humanMonth, year) {
            return new Date(year || new Date().getFullYear(), humanMonth, 0).getDate();
        }

        vista.btnGuardar.on('click', function () {
            getDates('ADD')
        }, this);

        vista.btnLimitar.on('click', function () {
            vista.winLimitar.show();
            modelo.stLimites.load();
        }, this);

        // vista.btnPlanificar.on('click', function () {
        //     vista.formularioPlanif.getForm().reset();
        //     vista.winPlanif.show();
        // }, this);

        vista.btnPlanificacion.menu.items.items[0].setHandler(function () {
            vista.formularioPlanif.getForm().reset();
            vista.winPlanif.show();
        });

        vista.btnPlanificacion.menu.items.items[1].setHandler(function () {
            modelo.storeTurnos.load();
            modelo.storeCbRegimentrabajo.load();
            vista.winPlaniftt.show();
        });

        vista.cbRegimenTrabajo.on('select', function (cb, rec, ind) {
            modelo.storeGrupos.load({params: {idregimentrabajo: rec.data.idregimentrabajo}})
        });

        vista.btnAceptar.on('click', function () {
            Planificar();
            vista.winPlanif.hide();
        }, this);

        vista.btnAplicar.on('click', function () {
            Planificar();
        }, this);

        vista.btnGuardarLim.on('click', function () {
            guardarLimites();
        }, this);

        vista.btnAceptartt.setHandler(function () {
            planificarRotativo('acep');
        });

        vista.btnAplicartt.setHandler(function () {
            planificarRotativo('apli');
        });

        vista.btnSubirGrupo.on('click', function () {
            var s = vista.gridGrupos.getSelectionModel().getSelected();
            var index1 = modelo.storeGrupos.indexOf(s);
            var cant = modelo.storeGrupos.getCount();
            var valores = modelo.storeGrupos.getRange(0, cant);
            if (index1 > 0) {
                for (i = 1; i < valores.length; i++) {
                    if (s.id == valores[i].data.id) ;
                    {
                        modelo.storeGrupos.remove(s);
                        modelo.storeGrupos.insert(index1 - 1, s);
                        vista.gridGrupos.getSelectionModel().selectRow(index1 - 1);
                    }
                }
            }
            else mostrarMensaje(3, 'No se puede subir esta fila');

        });

        vista.btnBajarGrupo.on('click', function () {
            var s = vista.gridGrupos.getSelectionModel().getSelected();
            var index1 = modelo.storeGrupos.indexOf(s);
            var cant = modelo.storeGrupos.getCount();
            var valores = modelo.storeGrupos.getRange(0, cant);
            if (index1 < cant - 1) {
                for (i = 0; i < valores.length; i++) {
                    if (s.id == valores[i].data.id) ;
                    {
                        modelo.storeGrupos.remove(s);
                        modelo.storeGrupos.insert(index1 + 1, s);
                        vista.gridGrupos.getSelectionModel().selectRow(index1 + 1);
                    }
                }
            }
            else mostrarMensaje(3, 'No se puede bajar esta fila');
        });

        vista.smgridGrupos.on('selectionchange', function (th) {
            if (th.getCount() == 1) {
                if (modelo.storeGrupos.indexOf(th.getSelected()) == 0) {
                    vista.btnSubirGrupo.disable();
                    vista.btnBajarGrupo.enable();
                }
                else {
                    if (modelo.storeGrupos.indexOf(th.getSelected()) == (modelo.storeGrupos.getCount() - 1)) {
                        vista.btnBajarGrupo.disable();
                        vista.btnSubirGrupo.enable();
                    }
                    else {
                        vista.btnSubirGrupo.enable();
                        vista.btnBajarGrupo.enable();
                    }
                }
            }
            else {
                vista.btnSubirGrupo.disable();
                vista.btnBajarGrupo.disable();
            }
        });


        function planificarRotativo(btn) {
            if (vista.smgridTurnos.getCount() > 0) {
                if (vista.smgridTurnos.getCount() <= modelo.storeGrupos.getCount()) {
                    var grupos = new Array();
                    Ext.each(modelo.storeGrupos.getRange(), function (recs) {
                        grupos.push(recs.data.idgrupodescanso);
                    });

                    var turnos = new Array();
                    var hiturno = new Array();
                    var hfturno = new Array();
                    var otrodia = new Array();
                    Ext.each(vista.smgridTurnos.getSelections(), function (recs) {
                        turnos.push(recs.data.idturnotrabajo);
                        hiturno.push(recs.data.horainicio);
                        hfturno.push(recs.data.horafin);
                        otrodia.push(recs.data.otrodia);
                    });

                    PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Planificando...');
                    Ext.Ajax.request({
                        url: 'planificarTurnosRotativos',
                        method: 'POST',
                        params: {
                            grupos: Ext.encode(grupos),
                            turnos: Ext.encode(turnos),
                            fdesde: vista.desdeTT.getRawValue(),
                            fhasta: vista.hastaTT.getRawValue(),
                            horainicio: Ext.encode(hiturno),
                            horafin: Ext.encode(hfturno),
                            otrodia: Ext.encode(otrodia),
                            rotate: (vista.rotar.getValue()) ? 1 : 0

                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('mascaraEnviarDatos');
                            var responseData = Ext.decode(response.responseText);
                            if (responseData == true) {
                                mostrarMensaje(1, 'La planificación de los turnos ha sido guardada satisfactoriamente.');
                                if (btn == 'acep')
                                    vista.winPlaniftt.hide();
                            }
                            else {
                                mostrarMensaje(3, 'Ha ocurrido un error al planificar.');
                            }
                        }
                    });
                }
                else {
                    mostrarMensaje(3, 'La cantidad de turnos seleccionados debe ser menor o igual a la cantidad de grupos del régimen seleccionado');
                }
            } else {
                mostrarMensaje(3, 'Debe seleccionar los turnos para planificar el trabajo de los grupos del régimen seleccionado.');
            }
        }

        function guardarLimites() {
            var datos = new Array();
            if (modelo.stLimites.modified.length > 0) {
                Ext.each(modelo.stLimites.modified, function (recs) {
                    datos.push(recs.data);
                });

                PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
                Ext.Ajax.request({
                    url: 'setLimites',
                    method: 'POST',
                    params: {
                        datos: Ext.encode(datos)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mascaraEnviarDatos');
                        var responseData = Ext.decode(response.responseText);
                        if (responseData == true) {
                            mostrarMensaje(1, 'Los límites para horas extras han sido guardados satisfactoriamente.');
                        }
                        vista.winLimitar.hide();
                    }
                });
            } else {
                mostrarMensaje(1, 'No ha realizado cambio en los valores.');
            }
        }

        vista.btnEliminar.on('click', function () {
            getDates('DEL');
        }, this);

        vista.btnLimpiar.on('click', function () {
            limpiarcalendario()
        }, this);

        vista.tabs.on('tabchange', function (th, tab) {
            var response = {
                datos: new Array()
            };
            cleanPaintedDates(response)
        });

        function cleanPaintedDates(responseData) {
            var arrDates = new Array();
            var cont = 0;
            Ext.each(responseData.datos, function (date) {
                var fecha = date.fecha.split('/');

                // function getContrastYIQ(hexcolor){
                var r = parseInt(date.color.substr(0, 2), 16);
                var g = parseInt(date.color.substr(2, 2), 16);
                var b = parseInt(date.color.substr(4, 2), 16);
                var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                var texto = (yiq >= 128) ? '#000000' : '#ffffff';
                if (date.horas != null) {
                    var h = date.horas.split('/');
                    var t = '';
                    if (date.turno != null)
                        t = 'Turno: ' + date.turno;
                    var txt = date.dentipodia + ' (' + h[0] + ':' + h[1] + ' horas) <br> ' + t;
                } else {
                    var txt = date.dentipodia
                }

                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '.tipodia' + cont + ' {color:#ee0000 ; background-color:' + date.color + ' !important;}';
                document.getElementsByTagName('head')[0].appendChild(style);
                var x = {
                    cls: 'tipodia' + cont + '',
                    date: new Date(fecha[2], fecha[1] - 1, fecha[0]),
                    text: txt
                }
                arrDates.push(x);
                cont++;
            });
            vista.datePicker.setEventDates(arrDates);
        }

        function limpiarcalendario() {
            mostrarMensaje(2, idioma.msgDELMasivo, function (btn) {
                if (btn == 'ok') {
                    vista.MsgCargandoGrid.show();
                    Ext.Ajax.request({
                        url: 'limpiarConfiguracion',
                        method: 'POST',
                        params: {
                            idgrupodescanso: (vista.tabs.getActiveTab().id != 'gridPersonas1') ? vista.smgridGruposRegimen.getSelected().get('idgrupodescanso') : vista.smPersona.getSelected().data.idgrupodescanso,
                            idpersona: (vista.tabs.getActiveTab().id == 'gridPersonas1') ? vista.smPersona.getSelected().data.idpersona : -1,
                            anno: scope.annoactual
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.datos.length > 0) {
                                cleanPaintedDates(responseData);
                                vista.MaskEnviarDatos.hide();
                            }
                            else {
                                vista.datePicker.setEventDates(new Array());
                                vista.MaskEnviarDatos.hide();
                                mostrarMensaje(1, idioma.msgNoConf);
                            }
                        }
                    });
                }
            }, this);
        }

        function paintDates(idgrupodescanso, idpersona, idcargo) {
            Ext.Ajax.request({
                url: 'cargarDias',
                method: 'POST',
                params: {idgrupodescanso: idgrupodescanso, idpersona: idpersona, year: scope.annoactual, idcargo : idcargo},
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.predeterminado == 1) {
                        if(responseData.existe == 0){
                            vista.btnGuardar.disable();
                            vista.btnEliminar.disable();
                            vista.btnPlanificacion.disable();
                        }else{
                            vista.btnGuardar.enable();
                            vista.btnEliminar.enable();
                            vista.btnPlanificacion.enable();
                        }
                    }else{
                        vista.btnGuardar.enable();
                        vista.btnEliminar.enable();
                        vista.btnPlanificacion.enable();
                    }
                    if (responseData.datos.length > 0) {
                        modelo.storegridDiasNoLaborables.loadData(responseData);
                        var arrDates = new Array();
                        var cont = 0;
                        Ext.each(responseData.datos, function (date) {

                            var fecha = date.fecha.split('/');

                            var r = parseInt(date.color.substr(0, 2), 16);
                            var g = parseInt(date.color.substr(2, 2), 16);
                            var b = parseInt(date.color.substr(4, 2), 16);
                            var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                            var texto = (yiq >= 128) ? '#000000' : '#ffffff';
                            var txt = '';
                            if (date.horas != null) {
                                var h = date.horas.split(':');
                                if (parseInt(h[0]) > 0) {
                                    var t = '';
                                    if (date.turno != null)
                                        t = 'Turno: ' + date.turno;
                                    txt = date.dentipodia + ' (' + h[0] + ':' + h[1] + ' horas) <br> ' + t;
                                }
                                else
                                    txt = date.dentipodia;
                            } else {
                                txt = date.dentipodia;
                            }

                            var style = document.createElement('style');
                            style.type = 'text/css';
                            style.innerHTML = '.tipodia' + cont + ' {color:#ee0000 ; background-color:' + date.color + ' !important;}';
                            document.getElementsByTagName('head')[0].appendChild(style);

                            var x = {
                                cls: 'tipodia' + cont + '',
                                date: (new Date(fecha[2], fecha[1] - 1, fecha[0])).clearTime(),
                                text: txt
                            }
                            arrDates.push(x);
                            cont++;
                        });
                        
                        vista.datePicker.setEventDates(arrDates);
                        vista.panelDatepicker.enable();
                        vista.MsgCargandoGrid.show();
                        vista.MaskEnviarDatos.hide();
                    }
                    else {
                        vista.datePicker.setEventDates(new Array());
                        vista.panelDatepicker.enable();
                        vista.MsgCargandoGrid.show();
                        vista.MaskEnviarDatos.hide();
                        mostrarMensaje(1, idioma.msgNoConf);
                    }
                }
            });
        }

        function getDates(btn) {
            vista.datePicker.copyPreToSelectedDays();
            var selectedDates = vista.datePicker.selectedDates.sortDates();
            var allStringDates = [];
            if (Ext.isDate(selectedDates)) {
                allStringDates.push(date.format('d/m/Y'));
            }
            else {
                Ext.each(selectedDates, function (c) {
                    allStringDates.push(c.format('d/m/Y'));
                }, this);
            }
            scope.fechasConAsistencia = new Array();

            Ext.each(modelo.storegridDiasNoLaborables.getRange(), function (rec) {
                for (var i = 0; i < allStringDates.length; i++) {
                    if (Date.parse(rec.data.fecha) == Date.parse(allStringDates[i]) && rec.data.tieneasistencia == 1) {
                        if (btn == 'ADD') {
                            if (rec.data.idtipodedia != vista.tipodia.getValue())
                                scope.fechasConAsistencia.push(allStringDates[i]);
                        }
                        else
                            scope.fechasConAsistencia.push(allStringDates[i]);
                    }
                }
            });
            if (btn == 'ADD') {
                if (scope.fechasConAsistencia.length > 0) {
                    var fechas = scope.fechasConAsistencia.join(',');
                    mostrarMensaje(2, idioma.msgFechasConDatos1 + fechas + idioma.msgFechasConDatos2, function (btn) {
                        if (btn == 'ok') {
                            ADDdays(allStringDates);
                        }
                    })
                }
                else {
                    ADDdays(allStringDates);
                }
            }
            else {
                if (scope.fechasConAsistencia.length > 0) {
                    var fechas = scope.fechasConAsistencia.join(',');
                    var msgPlural = idioma.msgFechasConDatos1 + fechas + idioma.msgFechasConDatos2;
                    var msgSingular = idioma.msgFechasConDatos3 + fechas + idioma.msgFechasConDatos2;

                    mostrarMensaje(2, 'Al eliminar la planificación de la(s) fecha(s) seleccionada(s) también se eliminará(n) el(los) registro(s) de asistencia en dicha(s) fecha(s). ¿Está seguro de que desea eliminar la planificación en el(los) día(s) seleccionado(s)?', function (btn) {
                        if (btn == 'ok') {
                            DELdays(allStringDates);
                        }
                    })
                }
                else {
                    mostrarMensaje(2, idioma.msgDELfechas, function (btn) {
                        if (btn == 'ok') {
                            DELdays(allStringDates);
                        }
                    })

                }
            }
        }

        rectipodia = -1;
        vista.tipodia.on('select', function (select, rec, num) {
            rectipodia = rec;
            if ((rectipodia.data.trabajo == 1 || rectipodia.data.feriado == 1 || rectipodia.data.idtipodedia == 13) && vista.cbturno.getValue() == '' && rectipodia.data.idtipodedia != 12/* && rectipodia.data.idtipodedia != 8*/) {
                vista.cbturno.enable();
            } else {
                vista.cbturno.disable();
            }
        });

        //Funcion para adicionar los dias no laborables a un grupo dentro de un regimen de trabajo
        function ADDdays(dates) {
            if (rectipodia != -1) {
                if (((rectipodia.data.trabajo == 1 && rectipodia.data.idtipodedia != 8) /*|| rectipodia.data.feriado == 1 */ || rectipodia.data.idtipodedia == 13) && vista.cbturno.getValue() == '' && rectipodia.data.idtipodedia != 12/* && rectipodia.data.idtipodedia != 8*/) {
                    vista.cbturno.allowBlank = false;
                    //if (/*rectipodia.data.feriado == 1 && */rectipodia.data.trabajo == 0)
                    //mostrarMensaje(3, idioma.msgADDerrorFe);
                    /*else */
                    if (rectipodia.data.idtipodedia != 8)
                        mostrarMensaje(3, idioma.msgADDerror1);
                } else {
                    vista.cbturno.allowBlank = true;
                    if (dates.length > 0 && vista.formularioGuardar.getForm().isValid()) {
                        vista.MaskEnviarDatos.show();
                        Ext.Ajax.request({
                            url: 'addDias',
                            method: 'POST',
                            params: {
                                idgrupodescanso: (vista.tabs.getActiveTab().id != 'gridPersonas1') ? vista.smgridGruposRegimen.getSelected().get('idgrupodescanso') : vista.smPersona.getSelected().data.idgrupodescanso,
                                idpersona: (vista.tabs.getActiveTab().id == 'gridPersonas1') ? vista.smPersona.getSelected().data.idpersona : -1,
                                idcargo: (vista.tabs.getActiveTab().id == 'gridPersonas1') ? vista.smPersona.getSelected().data.idcargo : -1,
                                turnotrabajo: vista.cbturno.getValue(),
                                idtipodedia: vista.tipodia.getValue(),
                                fechas: Ext.encode(dates),
                                delAsistencia: (scope.fechasConAsistencia.length > 0) ? 1 : 0,
                                delDates: Ext.encode(scope.fechasConAsistencia)
                            },
                            callback: function (options, success, response) {
                                vista.MaskEnviarDatos.hide();
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.cod == 1) {
                                    vista.formularioGuardar.getForm().reset();
                                    vista.datePicker.clearSelectedDates();
                                    if (vista.tabs.getActiveTab().id == 'gridPersonas1')
                                        paintDates(vista.smPersona.getSelected().data.idgrupodescanso, vista.smPersona.getSelected().data.idpersona, vista.smPersona.getSelected().data.idcargo);
                                    else
                                        paintDates(vista.smgridGruposRegimen.getSelected().get('idgrupodescanso'), -1, -1);
                                    mostrarMensaje(1, idioma.msgADDok
                                    );
                                }
                                else {
                                    mostrarMensaje(3, idioma.msgADDerror);
                                }
                            }
                        });
                    }
                    else {
                        mostrarMensaje(3, idioma.msgADDerror4);
                    }
                }
            } else {
                mostrarMensaje(3, idioma.msgADDerror4);
            }
        }

        rectipodiaplanif = -1;
        vista.tipodiaPlanif.on('select', function (select, rec, num) {
            rectipodiaplanif = rec;
            if ((rectipodiaplanif.data.trabajo == 1 || rectipodiaplanif.data.feriado == 1 || rectipodiaplanif.data.idtipodedia == 13) && vista.cbturnoPlanif.getValue() == '' && rectipodiaplanif.data.idtipodedia != 12/* && rectipodiaplanif.data.idtipodedia != 8*/) {
                vista.cbturnoPlanif.enable();
            } else {
                vista.cbturnoPlanif.disable();
            }
        });

        function Planificar() {
            if (rectipodiaplanif != -1) {
                if ((rectipodiaplanif.data.trabajo == 1 || rectipodiaplanif.data.feriado == 1 || rectipodiaplanif.data.idtipodedia == 13) && vista.cbturnoPlanif.getValue() == '' && rectipodiaplanif.data.idtipodedia != 12/* && rectipodiaplanif.data.idtipodedia != 8*/) {
                    vista.cbturnoPlanif.allowBlank = false;
                    if (rectipodiaplanif.data.feriado == 1 && rectipodiaplanif.data.trabajo == 0)
                        mostrarMensaje(3, idioma.msgADDerrorFe);
                    else
                        mostrarMensaje(3, idioma.msgADDerror1);
                } else {
                    vista.cbturnoPlanif.allowBlank = true;
                    if (vista.formularioPlanif.getForm().isValid()) {
                        var diassemana = new Array();
                        Ext.each(vista.formularioPlanif.getForm().items.items[2].items.items, function (recs) {
                            if (recs.checked == true) {
                                diassemana.push(recs.id);
                            }
                        });
                        PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
                        Ext.Ajax.request({
                            url: 'guardardiasplanificar',
                            method: 'POST',
                            params: {
                                desde: vista.desdeplanif.getRawValue(),
                                hasta: vista.hastaplanif.getRawValue(),
                                idturnotrabajo: vista.cbturnoPlanif.getValue(),
                                idtipodia: vista.tipodiaPlanif.getValue(),
                                diassemana: Ext.encode(diassemana),
                                idgrupodescanso: vista.smgridGruposRegimen.getSelected().get('idgrupodescanso')
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('mascaraEnviarDatos');
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.cod == 1) {
                                    vista.formularioPlanif.getForm().reset();
                                    vista.datePicker.clearSelectedDates();
                                    paintDates(vista.smgridGruposRegimen.getSelected().get('idgrupodescanso'), -1, -1);
                                    mostrarMensaje(1, idioma.msgADDok
                                    );
                                }
                                else {
                                    mostrarMensaje(3, idioma.msgADDerror);
                                }
                            }
                        });
                    }
                    else {
                        mostrarMensaje(3, idioma.msgADDerror4);
                    }
                }
            } else {
                mostrarMensaje(3, idioma.msgADDerror4);
            }
        }

        //funcion para eliminar los dias seleccionados de un grupo determinado dentro de un regimen de trabajo
        function DELdays(dates) {
            if (dates.length > 0) {
                vista.MaskEliminarDatos.show();
                Ext.Ajax.request({
                    url: 'delDias',
                    method: 'POST',
                    params: {
                        seleccion: Ext.encode(dates),
                        idgrupodescanso: (vista.tabs.getActiveTab().id != 'gridPersonas1') ? vista.smgridGruposRegimen.getSelected().get('idgrupodescanso') : vista.smPersona.getSelected().data.idgrupodescanso,
                        idpersona: (vista.tabs.getActiveTab().id == 'gridPersonas1') ? vista.smPersona.getSelected().data.idpersona : -1,
                        idcargo: (vista.tabs.getActiveTab().id == 'gridPersonas1') ? vista.smPersona.getSelected().data.idcargo : -1,
                        delAsistencia: (scope.fechasConAsistencia.length > 0) ? 1 : 0,
                        delDates: new Array()
                    },
                    callback: function (options, success, response) {
                        vista.MaskEliminarDatos.hide();
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.cod == 1) {
                            vista.datePicker.clearSelectedDates();
                            var idgrupodescanso = (vista.tabs.getActiveTab().id != 'gridPersonas1') ? vista.smgridGruposRegimen.getSelected().get('idgrupodescanso') : vista.smPersona.getSelected().data.idgrupodescanso;
                            var idpersona = (vista.tabs.getActiveTab().id == 'gridPersonas1') ? vista.smPersona.getSelected().data.idpersona : -1;
                            var idcargo = (vista.tabs.getActiveTab().id == 'gridPersonas1') ? vista.smPersona.getSelected().data.idcargo : -1;
                            paintDates(idgrupodescanso, idpersona, idcargo);
                            cargarResumen();
                            mostrarMensaje(1, idioma.msgDELok
                            );
                        }
                        else {
                            mostrarMensaje(3, idioma.msgDELerror);
                        }
                    }
                });
            }
            else {
                mostrarMensaje(3, idioma.msgDELerror2);
            }

        }

        function cargarResumen() {
            if (vista.smgridGruposRegimen.getSelections().length > 0) {
                var idregimentrabajo = vista.smgridGruposRegimen.getSelected().get('idregimentrabajo');
                var idgrupodescanso = vista.smgridGruposRegimen.getSelected().get('idgrupodescanso');
                var idpersona = -1;
                var x = vista.smgridGruposRegimen.getSelected().get('tipofondotiempo');
            } else if (vista.smPersona.getSelections().length > 0) {
                var idregimentrabajo = vista.cbRegimenTrabajoPers.getValue();
                var idgrupodescanso = vista.smPersona.getSelected().get('idgrupodescanso');
                var idpersona = vista.smPersona.getSelected().get('idpersona');
                var x = modelo.storeCbRegimentrabajoPer.getAt(modelo.storeCbRegimentrabajoPer.find('idregimentrabajo', vista.cbRegimenTrabajoPers.getValue())).data.tipofondotiempo;
            }
            var dentipofondotiempo = '';
            if (x == 1)
                dentipofondotiempo = 'Mensual';
            else if (x == 2)
                dentipofondotiempo = 'Promedio anual';
            else
                dentipofondotiempo = 'Fijo';

            modelo.storeResumenRTD.load({
                params: {
                    idgrupodescanso: idgrupodescanso,
                    idregimentrabajo: idregimentrabajo,
                    anno: scope.annoactual
                }
            });
            Ext.Ajax.request({
                url: 'getResumenAnual',
                params: {idgrupodescanso: idgrupodescanso, idregimentrabajo: idregimentrabajo, anno: scope.annoactual},
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    vista.lInfo.setText('Tipo de fondo de tiempo: ' + dentipofondotiempo + ' - Total anual: ' + responseData.total + ' -' +
                        ' Promedio mensual: ' + responseData.promedio);
                }
            });
        }

        function cargarResumenQuincena() {
            if (vista.smgridGruposRegimen.getSelections().length > 0) {
                var idregimentrabajo = vista.smgridGruposRegimen.getSelected().get('idregimentrabajo');
                var idgrupodescanso = vista.smgridGruposRegimen.getSelected().get('idgrupodescanso');
                var idpersona = -1;
                var x = vista.smgridGruposRegimen.getSelected().get('tipofondotiempo');
            } else if (vista.smPersona.getSelections().length > 0) {
                var idregimentrabajo = vista.cbRegimenTrabajoPers.getValue();
                var idgrupodescanso = vista.smPersona.getSelected().get('idgrupodescanso');
                var idpersona = vista.smPersona.getSelected().get('idpersona');
                var x = modelo.storeCbRegimentrabajoPer.getAt(modelo.storeCbRegimentrabajoPer.find('idregimentrabajo', vista.cbRegimenTrabajoPers.getValue())).data.tipofondotiempo;
            }
            var dentipofondotiempo = '';
            if (x == 1)
                dentipofondotiempo = 'Mensual';
            else if (x == 2)
                dentipofondotiempo = 'Promedio anual';
            else
                dentipofondotiempo = 'Fijo';
            modelo.storeResumenQuincenal.load({
                params: {
                    idgrupodescanso: idgrupodescanso,
                    idregimentrabajo: idregimentrabajo,
                    anno: scope.annoactual
                }
            });
            Ext.Ajax.request({
                url: 'getResumenAnualQuincenal',
                params: {idgrupodescanso: idgrupodescanso, idregimentrabajo: idregimentrabajo, anno: scope.annoactual},
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    vista.lInfoQuin.setText('Tipo de fondo de tiempo: ' + dentipofondotiempo + ' - Total anual: ' + responseData.total + ' -' +
                        ' Promedio mensual: ' + responseData.promedio);
                }
            });
        }

        vista.btnCancelar.on('click', function () {
            vista.winPlanif.hide();
        }, this);

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'glex',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 71: { //g para guardar
                        if (vista.winLimitar.isVisible()) {
                            guardarLimites();
                        } else if (vista.winRangoFechas.isVisible() && !vista.btnGuardarFechas.disabled) {
                            GuardarPeriodos();
                        } else if (vista.winRangoFechasQuincenal.isVisible() && !vista.btnGuardarFechasQuincenal.disabled) {
                            GuardarPeriodosQuincenal();
                        } else {
                            if (!vista.btnGuardar.disabled) {
                                getDates('ADD');
                            }
                        }
                        break;
                    }
                    case 76: { //l para limpiar
                        if (!vista.btnLimpiar.disabled) {
                            limpiarcalendario();
                        }
                        break;
                    }
                    case 69: { //e para exportar
                        exportar();
                        break;
                    }
                    case 88: { //x para cancelar
                        if (vista.winRangoFechas.isVisible()) {
                            vista.winRangoFechas.hide();
                        } else if (vista.winRangoFechasQuincenal.isVisible()) {
                            vista.winRangoFechasQuincenal.hide();
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar
            fn: function () {
                if (vista.winRangoFechas.isVisible()) {
                    EliminarPeriodoMes();
                } else if (vista.winRangoFechasQuincenal.isVisible()) {
                    EliminarPeriodoQuin();
                } else if (!vista.btnEliminar.disabled) {
                    getDates('DEL');
                }
            }
        }, {
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'l',
            fn: function () {
                if (!vista.btnLimitar.disabled) {
                    vista.winLimitar.show();
                    modelo.stLimites.load();
                }
            }
        }, {
            key: 13,//Enter para buscar
            fn: function () {
                modelo.fuenteDatosListado.load({
                    params: {
                        filtro: vista.tfbuscar.getValue(),
                        idregimentrabajo: vista.cbRegimenTrabajoPers.getValue()
                    }
                })
            }
        }]);

    }
}
 
