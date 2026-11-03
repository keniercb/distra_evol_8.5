Ext
    .ns('Pvd.Nomina.Cierre');

Pvd.Nomina.Cierre.Controlador = {
    init: function(idioma, vista, modelo) {

            var variables = {
                identidad: -1,
                denominacionentidad: '',
                fechainicioperiodo: null,
                fechafinperiodo:null,
                estado: null,
                idperiodo:null,
                idestado:0,
                idperiodo:0
            };

            //Mostrar interfaz para selecionar entidad.
            vista.btnestructura.on('click',function(btn) {
              vista.winEstructura.show();
            });

            //Eventos del objeto del ábol de entidades.
            vista.pEstructura.on('estructuraselecionada', function (o, nodo) {
                variables.identidad = nodo.id;
                variables.denominacionentidad = nodo.text;
                vista.btnAceptarEstructura.enable();
            });

  
            vista.btnAceptarEstructura.on('click', function(btn){
                if(variables.identidad!=null){
                    //Verificar que el subsistema Nomina contiene habilitado el cierre en la gestion de subsistemas en datos maestros y
                    Ext.Ajax.request({
                        url: 'CierreSubsistema',
                        params: {identidad: variables.identidad},
                        callback: function(options, success, response){
                            var responseData= Ext.decode(response.responseText);
                            if(responseData.c == 1 ) {
                                vista.winEstructura.hide();
                                vista.ventanaResumenPeriodos.show();
                                modelo.stPeriodoPago.load({params:{identidad: variables.identidad}})
                            }
                            else {

                                    mostrarMensaje(3, "No se puede llevar a cabo la funcionalidad del cierre de la Nómina. Verifique que el subsistema tiene habilitado la funcionalidad de cierre en la gestion de subsistemas en datos maestros");
                                }
                        }
                    });
                }
            });

            vista.btnAceptarResumenPeriodos.on('click',function(btn) {
                if (vista.gpPago.getSelectionModel().getSelected()) {
                    variables.fechainicioperiodo = vista.gpPago.getSelectionModel().getSelected().get('fechainicioperiodo');
                    variables.fechafinperiodo = vista.gpPago.getSelectionModel().getSelected().get('fechafinperiodo');
                   // variables.estado = vista.gpPago.getSelectionModel().getSelected().get('estado');console.log(variables.estado)
                    vista.ventanaResumenPeriodos.hide();
                    vista.principal.show();
                    modelo.stCuentasNomina.load({
                        params: {
                            identidad: variables.identidad,
                            inicio: variables.fechainicioperiodo,
                            fin: variables.fechafinperiodo,
                            estado: vista.gpPago.getSelectionModel().getSelected().get('estado'),
                           // idperiodo: vista.gpPago.getSelectionModel().getSelected().get('idperiodo'),
                            start: 0,
                            limit: modelo.stCuentasNomina.pagingSize
                        }
                    });
                    modelo.stPersonal.load({
                        params: {
                            identidad: variables.identidad,
                            inicio:variables.fechainicioperiodo,
                            fin:variables.fechafinperiodo,
                            estado:variables.estado,
                            start: 0,
                            limit: 1000}
                    });
                    vista.btnexportar.enable();
                    empresa();
                    buscarFechaDatosMaestros();
                    periodoActual();
                }

            });

            vista.gpPago.getSelectionModel().on('selectionchange', function (sm) {
                if (sm.getSelected()) {
                    vista.btnAceptarResumenPeriodos.enable();
                } else{
                    vista.btnAceptarResumenPeriodos.disable();
                }
            });

            function buscarFechaDatosMaestros(){
             //Peticion al servidor para saber si el subsistema Nomina en Datos Maestros tiene la fecha en configuracion manual
                Ext.Ajax.request({
                    url: 'buscarfechaDatosMaestros',
                    params: {identidad: variables.identidad},
                    callback: function(options, success, response){
                        var idestado = vista.gpPago.getSelectionModel().getSelected().get('idestado');console.log(idestado)
                        var responseData = Ext.decode(response.responseText);
                        if(responseData.c == 2 && idestado == 1) {
                            vista.btnCierrediario.enable();
                            vista.btnCierreperiodo.enable();
                            vista.btnCierreejercicio.enable();
                        }
                        if(responseData.c == 2 && idestado == 2) {
                        vista.btnCierrediario.disabled=trzue;
                        vista.btnCierreperiodo.disabled=true;
                        vista.btnCierreejercicio.disabled=true;   
                        }   
                    }
                });
            }
        
            vista.btnCancelarResumenPeriodos.on('click',function(btn){
                vista.ventanaResumenPeriodos.hide();
                vista.winEstructura.show();
            });

            modelo.stPeriodoPago.on('load', function () {
                vista.btnAceptarResumenPeriodos.disable;
            });

            vista.btnexportar.on('click', function () {
                let identidad = variables.identidad;
                let inicio = variables.fechainicioperiodo;
                let fin =  variables.fechafinperiodo;
                let start=0;
                let limit=1000;
                //let arrdatos = vista.gpGridCierre.getStore().getRange();
                let  estado =  vista.gpPago.getSelectionModel().getSelected().get('estado');
                //let  idperiodo =  vista.gpPago.getSelectionModel().getSelected().get('idperiodo');

                let params = Ext.urlEncode({
                    identidad: identidad,
                    inicio:inicio,
                    fin:fin,
                    start:start,
                    //idperiodo:idperiodo,
                    limit:limit,
                    estado:estado
                   });
                let idIframe = Ext.id();

                new Ext.Window({
                    title: '',
                    width: '100%',
                    height: '100%',
                    id: 'winreporte',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrain: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/cierre/exportar?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winreporte').maximize();
                PVD.mostrarMascara('repmodelo1', 'Por favor espere...', 'Generando reporte');
                document.getElementById(idIframe).onload = function () {
                    PVD.ocultarMascara('repmodelo1');
                }
            });

            function empresa() {
                var text1 = variables.denominacionentidad;
                vista.lfempresa.setText(text1);
            }

            function periodoActual(){
                    Ext.Ajax.request({
                        url: 'PeriodoActual',
                        params: {
                            identidad:variables.identidad,
                            inicio:variables.fechainicioperiodo,
                            fin:variables.fechafinperiodo,
                          //  idperiodo:vista.gpPago.getSelectionModel().getSelected().get('idperiodo'),
                        // estado: vista.gpPago.getSelectionModel().getSelected().get('estado')
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            var estado =  vista.gpPago.getSelectionModel().getSelected().get('estado');
                            if (responseData.flag && estado=='Abierto') {
                                var text1 = 'Período:  ' + responseData.nombre +'. Desde: ' + variables.fechainicioperiodo +' hasta ' + variables.fechafinperiodo+'. Fecha contable: '+ responseData.fechacont;
                                vista.lffecha.setText(text1);
                            }else{
                                var text1 = 'Período:  ' + responseData.nombre +'. Desde: ' + variables.fechainicioperiodo +' hasta ' + variables.fechafinperiodo+'. Período '+ estado;
                                vista.lffecha.setText(text1);
                            }
                        }
                    });
            }

            vista.btncambioperiodo.setHandler(function(){
                vista.ventanaResumenPeriodos.show();
                modelo.stPeriodoPago.load({params:{identidad: variables.identidad}});
            });

            vista.btnCierreperiodo.setHandler(function(){
                    Ext.Msg.show({
                        title: 'Confirmaci&oacute;n',
                        msg: 'Este proceso dar&aacute; por terminadas las operaciones en el período de la nómina. <br> &iquest;Est&aacute; seguro que desea efectuar el cierre?',
                        buttons: Ext.Msg.OKCANCEL,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn, text) {
                            if (btn == 'ok') {
                                let arrdatos = vista.gpGridCierre.getStore().data.items,
                                    arrSend = [];
                                Ext.each(arrdatos, function(e, a){
                                    arrSend.push(e.data);
                                });
                                Ext.Msg.wait('Cerrando período ...');
                                Ext.Ajax.request({
                                    method: "POST",
                                    url: 'cierrePeriodo',
                                    params: {
                                            identidad: variables.identidad,
                                            inicio:vista.gpPago.getSelectionModel().getSelected().get('fechainicioperiodo'),
                                            fin:vista.gpPago.getSelectionModel().getSelected().get('fechafinperiodo'),
                                            arrdatos: Ext.encode(arrSend),
                                            //idperiodo:vista.gpPago.getSelectionModel().getSelected().get('idperiodo'),
                                            //idejercicio:vista.gpPago.getSelectionModel().getSelected().get('idejercicio'),
                                            estado: vista.gpPago.getSelectionModel().getSelected().get('estado'),
                                            start: 0,
                                            limit: 1000
                                        },
                                    callback: function(options, success, response) {
                                        var responseData = Ext.decode(response.responseText);console.log(responseData);
                                        if(responseData.final.success) {
                                            mostrarMensaje(1, responseData.final.responsetext);
                                            Ext.Msg.hide();
                                            //Actualizar el label
                                            var text =  'Período: '+ responseData.final.nombreperiodosig + '  Desde: ' + responseData.final.inicioperiodosig + ' hasta ' + responseData.final.finperiodosig + '. Fecha contable: ' + responseData.final.fecha;
                                            vista.lffecha.setText(text);
                                        }
                                        else
                                        {
                                            Ext.Msg.hide();
                                            mostrarMensaje(2, responseData.responsetext);
                                        }
                                        vista.btnCierreperiodo.disabled= false;
                                    }
                                });
                            }
                        }
                    });

            });

            vista.btnCierreejercicio.setHandler(function(){

                CierreEjercicio();
             });

            function CierreEjercicio() {
                        Ext.Msg.show({
                            title: 'Confirmaci&oacute;n',
                            msg: 'Este proceso dar&aacute; por terminadas las operaciones en el ejercicio de la Nómina. <br> &iquest;Est&aacute; seguro que quiere efectuar el cierre?',
                            buttons: Ext.Msg.OKCANCEL,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function(btn, text) {
                                if (btn == 'ok') {
                                    let arrdatos = vista.gpGridCierre.getStore().data.items,
                                        arrSend = [];
                                    Ext.each(arrdatos, function(e, a){
                                        arrSend.push(e.data);
                                    });
                                    Ext.Msg.wait('Cerrando ejercicio de la Nómina...');
                                    Ext.Ajax.request({
                                        method: "POST",
                                        url: 'cierreEjercicio',
                                        params: {
                                            identidad: variables.identidad,
                                            inicio:vista.gpPago.getSelectionModel().getSelected().get('fechainicioperiodo'),
                                            fin:vista.gpPago.getSelectionModel().getSelected().get('fechafinperiodo'),
                                            arrdatos: Ext.encode(arrSend),
                                           // idperiodo:vista.gpPago.getSelectionModel().getSelected().get('idperiodo'),
                                           // idejercicio:vista.gpPago.getSelectionModel().getSelected().get('idejercicio'),
                                            estado: vista.gpPago.getSelectionModel().getSelected().get('estado'),
                                            start: 0,
                                             limit: 1000
                                            },
                                        callback: function(options, success, response) {
                                            var responseData = Ext.decode(response.responseText);
                                            if(responseData.final.success) {
                                                mostrarMensaje(1, responseData.final.responsetextsucces);
                                                Ext.Msg.hide();
                                                var text = 'Per\u00EDodo:  ' + responseData.final.nombreejesig + '. Desde ' + responseData.final.inicioejesig + ' hasta ' + responseData.final.finejesig + '. Fecha contable: ' + responseData.final.fecha;
                                                vista.lffecha.setText(text);
                                                vista.btnCierreejercicio.disabled = true ;
                                            }
                                            else
                                                Ext.Msg.hide();
                                                mostrarMensaje(3,responseData.responsetext);

                                             vista.btnCierreejercicio.disabled = true;
                                            }
                                    });
                                }
                            }
                        });
            }

            vista.btnCierrediario.setHandler(function(){
              CierreDiario();
            });

            function CierreDiario() {
                Ext.Msg.show({
                    title: 'Confirmaci&oacute;n',
                    msg: 'Este proceso dar&aacute; por terminado las operaciones diarias de la Nómina. <br> &iquest;Est&aacute; seguro que quiere efectuar el cierre diario?',
                    buttons: Ext.Msg.OKCANCEL,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn, text) {
                         if (btn == 'ok') {
                                    let arrdatos = vista.gpGridCierre.getStore().data.items,
                                    arrSend = [];
                                    Ext.each(arrdatos, function(e, a){
                                    arrSend.push(e.data);
                                    });
                                    Ext.Msg.wait('Cerrando los procesos del d\u00EDa ...', 'Por favor espere...');
                                    Ext.Ajax.request({
                                        method:"POST",
                                        url: 'cierreDiario',
                                        params: {identidad: variables.identidad,
                                               inicio:vista.gpPago.getSelectionModel().getSelected().get('fechainicioperiodo'),
                                               fin:vista.gpPago.getSelectionModel().getSelected().get('fechafinperiodo'),
                                               arrdatos: Ext.encode(arrSend),
                                              // idperiodo:vista.gpPago.getSelectionModel().getSelected().get('idperiodo'),
                                              // idejercicio:vista.gpPago.getSelectionModel().getSelected().get('idejercicio'),
                                               estado: vista.gpPago.getSelectionModel().getSelected().get('estado'),
                                               start: 0,
                                                limit: 1000
                                        },
                                        callback: function(options, success, response) {
                                            var responseData = Ext.decode(response.responseText);
                                            if(responseData.final.success) {
                                                mostrarMensaje(1, responseData.final.responsetextsucces);
                                                Ext.Msg.hide();
                                                //Actualizar el label
                                                var text =  'Período: '+ responseData.final.nombreperiodo + '  Desde: ' + responseData.final.inicioperiodo + ' hasta ' + responseData.final.finperiodo + '. Fecha contable: ' + responseData.final.fecha;
                                                vista.lffecha.setText(text);
                                            }
                                           else{
                                                    Ext.Msg.hide();
                                                    mostrarMensaje(2,  responseData.responsetext);
                                            }

                                        }
                                        });
                        }
                    }
                });

            }


    }
}