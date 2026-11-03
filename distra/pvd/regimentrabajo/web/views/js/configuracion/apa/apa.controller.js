Ext.ns('Pvd.ControlAsistencia.Apa');

Pvd.ControlAsistencia.Apa.Controlador = {

    init: function (idioma, vista, modelo) {

        this.accion = 'add';
        this.accion1 = 'addGD';
        var scope = this;
        var fecfainireporte = '';
        var fecfafinreporte = '';
        var estructrura = '';
        var idestructura = '';
        var idreporte = '';
        var stgpRepor = '';

        modelo.stTregimen.load({
            callback: function (r, opt, suc) {
                fecfainireporte = modelo.stTregimen.reader.jsonData.fechainicio;
                fecfafinreporte = modelo.stTregimen.reader.jsonData.fechafin;
                estructura = modelo.stTregimen.reader.jsonData.estructura;
                idestructura = modelo.stTregimen.reader.jsonData.idestructura;

            }

        });
        vista.gplistadoreporte.focus();
        var idregimentrabajo;
        vista.gplistadoreporte.getSelectionModel().on('rowselect', function () {


            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.btnEliminarP.disable();


        }, this);

        vista.btnExportarReporte.on('click', function () {
            var params = Ext.urlEncode({
                idreporte: idreporte,
                idestructuta: vista.tcbEstructura.getValue(),
                fechaini: vista.dfIReporte.getRawValue(),
                fechafin: vista.dfFReporte.getRawValue()
            });

            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Reporte',
                width: 800,
                height: 500,
                id: 'winregistro',
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
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/regimentrabajo/index.php/apa/exportar?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }

        });

        vista.btnLimpiar.on('click', function () {
            //  vista.
        });

        vista.btnBuscar.on('click', function () {
           // idreporte = vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte');
            stgpRepor.baseParams.idreporte = vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte');
            stgpRepor.baseParams.idestructura = vista.tcbEstructura.getValue();
            stgpRepor.baseParams.fechaini = vista.dfIReporte.getRawValue();
            stgpRepor.baseParams.fechafin = vista.dfFReporte.getRawValue();

            stgpRepor.load();
        });

        vista.btnAdicionar.on('click', function () {
            modelo.stIndicadores.load(/*{params: {idreporte:1,start:0,limit:10}}*/);
            vista.btnAplicar.show();
            vista.winAdicionarRT.setTitle(idioma.lbTitVentAddRegimen);
            vista.winAdicionarRT.show();
            vista.tfdenominacion.focus();
            self.accion = 'add';

        }, this);


        vista.btnVisualizar.on('click', function () {
            // Ext.Ajax.request({
            //     url: 'getVistaReporte',
            //     params: {
            //         idreporte: vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte')
            //
            //     },
            //     callback: function (options, success, response) {
            //         var responseData = Ext.decode(response.responseText);
            //         //  var field = new Array();
            //         var colums = new Array();
            //
            //         colums.push({
            //             header: 'Entidad', width: 100, dataIndex: 0, menuDisabled: true
            //         });
            //
            //         Ext.each(responseData.data, function (r) {
            //             colums.push({
            //                 header: r.denominacion, width: 100, dataIndex: 0, menuDisabled: true
            //             })
            //         });
            //
            //         //   var record = new Ext.data.Record.create(field);
            //
            //         modelo.stIndicadoresReportesVisualizar = new Ext.data.Store({
            //             url: 'getVistaReporte',
            //             autoLoad: true,
            //             reader: new Ext.data.JsonReader(
            //                 {totalProperty: "quantity", root: "data"}
            //                 /*field*/),
            //             baseParams: {
            //                 idreporte: vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte')
            //
            //             }
            //         });
            //
            //         var colModel = new Ext.grid.ColumnModel(colums);
            //
            //         vista.gpReportesVisualizar.reconfigure(modelo.stIndicadoresReportesVisualizar, colModel);
            //         vista.gpReportesVisualizar.doLayout();
            //         // }
            //     }
            // });
            //
            // /* modelo.stIndicadoresReportesVisualizar.load({
            //      params: {
            //      idreporte:vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte'),start:0,limit:10
            //      }
            //
            //  });*/
            // //  vista.btnAplicar.show();
            // vista.winVisualizar.setTitle(idioma.titleVisualizar);
            // vista.gpReportesVisualizar.setTitle(vista.gplistadoreporte.getSelectionModel().getSelected().get('denominacion'));
            // vista.winVisualizar.show();

            Ext.getBody().mask('Cargando...');
            idreporte = vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte');

            Ext.Ajax.request({
                url: 'obtenerReporte',
                params: {
                    idreporte: vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte'),
                    idestructura: vista.tcbEstructura.getValue(),
                    fechaini: fecfainireporte,
                    fechafin: fecfafinreporte
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    // console.log(responseData);
                    Ext.getBody().unmask();
                    var field = new Array();
                    var colums = new Array();

                    colums.push({
                        header: 'Entidad', width: 120, dataIndex: 'denom', menuDisabled: true
                    });
                    field.push({name: 'denom'});

                    Ext.each(responseData.indicadores, function (r) {
                        field.push({name: r.idindicador});
                        colums.push({
                            header: r.denominacion, width: 100, dataIndex: r.idindicador, menuDisabled: true
                        });
                    });

                    var record = new Ext.data.Record.create(field);

                    stgpRepor = new Ext.data.Store({
                        url: 'obtenerReporte',
                        reader: new Ext.data.JsonReader(
                            {totalProperty: "quantity", root: "data"},
                            field),
                        baseParams: {
                            idreporte: vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte'),
                            idestructura: vista.tcbEstructura.getValue(),
                            fechaini: fecfainireporte,
                            fechafin: fecfafinreporte
                        }
                    });

                    var colModel = new Ext.grid.ColumnModel(colums);
                    vista.gpReporte.reconfigure(stgpRepor, colModel);
                    //  vista.pgtoobal.bind(stgpRepor);
                    vista.gpReporte.doLayout();

                    stgpRepor.load();


                }
            });


            vista.tcbEstructura.setValue(estructura);
            vista.dfIReporte.setRawValue(fecfainireporte);
            vista.dfFReporte.setRawValue(fecfafinreporte);

        }, this);

        vista.btnCancelarV.on('click', function () {
            vista.winVisualizar.hide();

        }, this);


        vista.winAdicionarRT.on('hide', function (th) {
            vista.fadicionarRT.getForm().reset();
        });

        vista.btnModificar.on('click', function () {
            var idreporte = vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte');
            vista.winAdicionarRT.setTitle(idioma.lbTitVentModRegimen);
            modelo.stIndicadores.load({params: {idreporte: idreporte}});
            vista.winAdicionarRT.show();
            vista.winAdicionarRT.doLayout();
            vista.fadicionarRT.getForm().loadRecord(vista.gplistadoreporte.getSelectionModel().getSelected());
            vista.tfdenominacion.focus();
            self.accion = 'mod';
        }, this);

        vista.btnCancelar.on('click', function () {
            vista.fadicionarRT.getForm().reset();
            vista.winAdicionarRT.hide();
        }, this);

        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');

        }, this);

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL');

        }, this);

        /* vista.gpListadoGrupoDescanso.getSelectionModel().on('rowselect', function () {
             vista.btnModificarP.enable();
             vista.btnEliminarP.enable();
             //vista.btnAdicionarP.focus();

         }, this);*/

        vista.btnAdicionarP.on('click', function () {
            /*   if(vista.gplistadoreporte.getSelectionModel().getSelected()){
                   var regimentrabajo = vista.gplistadoreporte.getSelectionModel().getSelected().get('idregimentrabajo');
                   vista.combo.setValue(regimentrabajo);
               }else{
                   vista.combo.setValue('');
               }*/
            modelo.stGestIndicadores.load();
            vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
            vista.winAdicionarGD.show();
            self.accion1 = 'addGD';

        }, this);


        vista.winAdicionarGD.on('hide', function (th) {
            vista.fadicionarGD.getForm().reset();
        });

        vista.btnModificarP.on('click', function () {
            vista.fadicionarGD.getForm().reset();
            var idregimentrabajo = vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idgrupodescanso');
            vista.winAdicionarGD.setTitle(idioma.lbTitVentModGrupo);
            vista.winAdicionarGD.show();
            vista.winAdicionarGD.doLayout();
            vista.fadicionarGD.getForm().loadRecord(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected());
            self.accion1 = 'modGD';
        }, this);

        vista.btnCancelarGD.on('click', function () {
            vista.winAdicionarGD.hide();
        }, this);

        vista.btnAceptarGD.on('click', function () {
            guardarDatosGD('ACP');

        }, this);

        vista.btnAplicarGD.on('click', function () {
            guardarDatosGD('APL');
        }, this);

        vista.btnArriba.on('click', function () {
            var recordselect = vista.gpIndicadores.getSelectionModel().getSelected();
            if (vista.gpIndicadores.getSelectionModel().hasPrevious()) {
                var ord1 = parseInt(recordselect.get('orden'));
                vista.gpIndicadores.getSelectionModel().selectPrevious();
                var siguiente = vista.gpIndicadores.getSelectionModel().getSelected();
                var ord = parseInt(siguiente.get('orden'));
                recordselect.set('orden', ord1 - 1);
                siguiente.set('orden', ord + 1);
                vista.gpIndicadores.getSelectionModel().selectRow(ord1 - 1);
                vista.gpIndicadores.store.sort('orden', 'ASC');
            }
        }, this);

        vista.btnAbajo.on('click', function () {

            var recordselect = vista.gpIndicadores.getSelectionModel().getSelected();
            if (vista.gpIndicadores.getSelectionModel().hasNext()) {
                var ord1 = parseInt(recordselect.get('orden'));
                vista.gpIndicadores.getSelectionModel().selectNext();
                var siguiente = vista.gpIndicadores.getSelectionModel().getSelected();
                var ord = parseInt(siguiente.get('orden'));
                recordselect.set('orden', ord1 + 1);
                siguiente.set('orden', ord - 1);
                vista.gpIndicadores.getSelectionModel().selectRow(ord1 - 1);
                vista.gpIndicadores.store.sort('orden', 'ASC');
            }

        }, this);

        vista.gpIndicadores.getSelectionModel().on('rowselect', function (a, n, rec) {
            vista.btnEliminarP.enable();

        }, this);


        function cargarListadoEventos(idregimentrabajo) {
            Ext.Ajax.request({
                url: 'getEventosxGrupo',
                params: {
                    idregimentrabajo: idregimentrabajo,
                },
                callback: function () {
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText).datos;
                    var objrec = [];
                    for (i = 0; i < responseData.length; i++) {
                        var obj = modelo.stListadoEventos.getById(responseData[i].idevento);
                        objrec.push(obj);
                    }
                    vista.smListadoEventos.selectRecords(objrec);
                }
            });
        }


        function guardarDatos(btnpress) {

            var arrIndicadores = new Array();
            var arrIndicadoresCausa = new Array();

            Ext.each(vista.gpIndicadores.store.getRange(), function (rec) {
                if (rec.get('causa') === 0) {
                    arrIndicadores.push({
                        idindicador: rec.get('idindicador'),
                        orden: rec.get('orden')
                    });
                }
                else if (rec.get('causa') === 1) {
                    arrIndicadoresCausa.push({
                        idindicador: rec.get('idindicador'),
                        orden: rec.get('orden')
                    });
                }
            });

            console.log(arrIndicadores);
            console.log(arrIndicadoresCausa);

            if (vista.fadicionarRT.getForm().isValid() && ((arrIndicadores.length > 0) || (arrIndicadoresCausa.length > 0))) {
                if (accion == 'add')
                    Ext.getBody().mask(idioma.lbTitMsgAdicionandoR);
                else
                    Ext.getBody().mask(idioma.lbTitMsgModificandoR);
                Ext.Ajax.request({
                    url: (self.accion == 'add' ? 'addReporte' : 'modReporte'),
                    params: {
                        idreporte: self.accion == 'add' ? -1 : vista.gplistadoreporte.getSelectionModel().getSelected().get('idreporte'),
                        denominacion: vista.tfdenominacion.getValue(),
                        descripcion: vista.taDescripcion.getValue(),
                        fdesde: vista.dfIregimen.getRawValue(),
                        fhasta: vista.dfFregimen.getRawValue(),
                        arrIndicadores: Ext.encode(arrIndicadores),
                        arrIndicadoresCausa: Ext.encode(arrIndicadoresCausa)

                    },
                    success: function (r) {
                        Ext.getBody().unmask();
                        var responseData = Ext.decode(r.responseText);

                        /*if(self.accion == 'mod'&&responseData.success) {
                            mostrarMensaje(1, idioma.lbMsgModRegimenExito);

                        } else if(self.accion == 'add'&&responseData.success){
                            mostrarMensaje(1, idioma.lbMsgInsRegimenExito);

                        }
                         else if(!responseData.success){
                            mostrarMensaje(3, responseData.mensaje);
                        }
                        if (btnpress == 'ACP') {
                            vista.fadicionarRT.getForm().reset();
                            vista.winAdicionarRT.hide();

                        }
                        if (btnpress == 'APL') {
                            vista.fadicionarRT.getForm().reset();
                        }

                        modelo.stTregimen.reload();	*/
                        if (!responseData.success) {
                            mostrarMensaje(3, responseData.mensaje);
                        } else {
                            if (self.accion == 'mod' && responseData.success) {
                                mostrarMensaje(1, idioma.lbMsgModRegimenExito);

                            } else if (self.accion == 'add' && responseData.success) {
                                mostrarMensaje(1, idioma.lbMsgInsRegimenExito);

                            }
                            if (btnpress == 'ACP') {
                                vista.fadicionarRT.getForm().reset();
                                vista.winAdicionarRT.hide();

                            }
                            if (btnpress == 'APL') {
                                vista.fadicionarRT.getForm().reset();
                            }

                            modelo.stTregimen.reload();
                        }
                    }
                });
            } else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
        }

        function guardarDatosGD(btnpress) {


            //if (this.a == 'nocarga') {
            var arrIds = new Array();


            var cant = vista.gpGestIndicadores.getSelectionModel().getSelections().length;

            var cont = vista.gpIndicadores.store.getCount() + 1;
            for (i = 0; i < cant; i++) {

                var contact = new vista.gpIndicadores.store.recordType({

                    denominacion: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('denominacion'),
                    idindicador: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('idindicador'),
                    fdesde: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('fdesde'),
                    fhasta: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('fhasta'),
                    descripcion: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('descripcion'),
                    unidadmedida: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('unidadmedida'),
                    idexpresionmatematica: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('idexpresionmatematica'),
                    formula: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('formula'),
                    causa: vista.gpGestIndicadores.getSelectionModel().getSelections()[i].get('causa'),
                    orden: cont

                });

                contact.id = vista.gpGestIndicadores.getSelectionModel().getSelections()[i].id;

//alert(existe(contact.id));
//alert(contact.id);

                if (!existe(contact.id)) {
                    vista.gpIndicadores.store.insert(vista.gpIndicadores.store.getCount(), contact);
                    cont++;
                }


            }
            if (btnpress == 'ACP') {
                vista.winAdicionarGD.hide();
            }

            // }


        }

        function existe(nueva) {

            if (vista.gpIndicadores.store.getCount() > 0) {
                var bandera = false;
                for (var i = 0; i < vista.gpIndicadores.store.getCount(); i++) {
//alert(vista.gpIndicadores.store.getAt(i).id);
//alert(nueva);
                    if (vista.gpIndicadores.store.getAt(i).id == nueva) {
                        bandera = true;
                        return bandera;
                        break;
                    }


                }
                return bandera;
            }
            else return false;


        }

        vista.btnEliminar.on('click', function () {
            Eliminar();
        }, this);

        function Eliminar() {
            var cantelim = vista.gplistadoreporte.getSelectionModel().getSelections().length;
            mostrarMensaje(2, cantelim > 1 ? idioma.lbTitMsgSeguroEliminarRVarios : idioma.lbTitMsgSeguroEliminarRUno, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    var ids = new Array();
                    for (i = 0; i < vista.gplistadoreporte.getSelectionModel().getSelections().length; i++) {
                        var id = vista.gplistadoreporte.getSelectionModel().getSelections()[i].get('idreporte');
                        ids.push({idreporte: id});
                    }
                    Ext.getBody().mask(cantelim > 1 ? idioma.lbTitMsgEliminandoRVarios : idioma.lbTitMsgEliminandoRUno);
                    Ext.Ajax.request({
                        url: 'eliminarReporte',
                        params: {arrreporte: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            //mostrarMensaje(1, idioma.lbMsgDelModeloExito);
                            var responseData = Ext.decode(r.responseText);
                            //console.info(responseData);
                            var aux = '';
                            var regimen = '';

                            mostrarMensaje(1, cantelim > 1 ? idioma.lbMsgDelRegimenExitoVarios : idioma.lbMsgDelRegimenExitoUno);

                            modelo.stTregimen.reload();
                            modelo.stListadoGrupoDescanso.reload();
                        }
                    });
                }
            });
        }


        vista.btnEliminarP.on('click', function () {
            EliminarGD();
        }, this);

        function EliminarGD() {

            var rows = vista.gpIndicadores.getSelectionModel().getSelections();
            var arrIds = new Array();

            if (rows.length === 0) {
                return false;
            }
            else {
                mostrarMensaje(2, idioma.lbTitMsgSeguroEliminarG, function (btnPresionado) {
                    if (btnPresionado == 'ok') {

                        for (i = 0; i < rows.length; i++) {
                            vista.gpIndicadores.store.remove(rows[i]);

                        }
                        var orden = 1;
                        Ext.each(vista.gpIndicadores.store.data.items, function (Record) {
                            Record.data.orden = orden;
                            orden++;
                        });
                        //mostrarMensaje(1, idioma.lbMsgDelGrupoExito);

                        // modelo.stListadoGrupoDescanso.reload();
                        //  modelo.stTregimen.reload();

                    }
                });
            }
        }


        function Notificar(mens, icon) {
            Ext.Notification.show({
                title: 'Informaci&oacute;n',
                icon: icon,
                msg: mens,
                time: 3
            });
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imx',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 73: { //i para adicionar
                        if (vista.gplistadoreporte.focus()) {
                            vista.winAdicionarRT.setTitle(idioma.lbTitVentAddRegimen);
                            vista.winAdicionarRT.show();
                            vista.btnAplicar.show();
                            self.accion = 'add';
                        } else {
                            if (vista.gplistadoreporte.getSelectionModel().getSelected()) {
                                var regimentrabajo = vista.gplistadoreporte.getSelectionModel().getSelected().get('idregimentrabajo');
                                vista.combo.setValue(regimentrabajo);
                            } else {
                                vista.combo.setValue('');
                            }
                            vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                            vista.winAdicionarGD.show();
                            self.accion1 = 'addGD';
                        }
                        break;
                    }
                    case 77: { //m para modificar
                        if (vista.gplistadoreporte.focus()) {
                            if (!vista.btnModificar.disabled) {
                                var idregimentrabajo = vista.gplistadoreporte.getSelectionModel().getSelected().get('idregimentrabajo');
                                vista.fadicionarRT.getForm().loadRecord(vista.gplistadoreporte.getSelectionModel().getSelected());
                                vista.winAdicionarRT.setTitle(idioma.lbTitVentAddRegimen);
                                vista.winAdicionarRT.show();
                                vista.winAdicionarRT.doLayout();
                                self.accion = 'mod';
                            }
                        } else {
                            if (!vista.btnModificarP.disabled) {
                                vista.fadicionarGD.getForm().reset();
                                var idregimentrabajo = vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idgrupodescanso');
                                vista.fadicionarGD.getForm().loadRecord(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected());
                                vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                                vista.winAdicionarGD.show();
                                self.accion1 = 'modGD';
                            }
                        }

                        break;
                    }
                    case 88: { //x para cancelar
                        if (vista.gplistadoreporte.focus()) {
                            vista.fadicionarRT.getForm().reset();
                            vista.winAdicionarRT.hide();
                        } else {
                            vista.winAdicionarGD.hide();
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar
            fn: function () {
                if (vista.gplistadoreporte.focus()) {
                    if (!vista.btnEliminar.disabled) {
                        Eliminar();
                    }
                } else {
                    if (!vista.btnEliminarP.disabled) {
                        EliminarGD();
                    }
                }
            }
        }, {
            key: 13,//enter para aceptar
            fn: function () {
                if (vista.gplistadoreporte.focus()) {
                    if (vista.btnAceptar.isVisible()) {
                        vista.btnAceptar.focus();
                        guardarDatos('ACP');
                    }
                } else {
                    if (vista.btnAceptarGD.isVisible()) {
                        vista.btnAceptarGD.focus();
                        guardarDatosGD('ACP');
                    }
                }
            }
        }, {
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'p',
            fn: function () {
                if (vista.gplistadoreporte.focus()) {
                    if (vista.btnAplicar.isVisible()) {
                        guardarDatos('APL');
                    }
                } else {
                    if (vista.btnAplicarGD.isVisible()) {
                        guardarDatosGD('APL');
                    }
                }
            }
        }]);

        //Manipulador de HotKeys
        /* var teclaAltGD = new Ext.KeyMap(Ext.getDoc(), [{
             key: 'imx',
             alt: true,
             stopEvent: true,
             handler: function(k, e) {
                 switch(k) {
                     case 73:{ //i para adicionar
                         if(vista.gplistadoreporte.getSelectionModel().getSelected()){
                             var regimentrabajo = vista.gplistadoreporte.getSelectionModel().getSelected().get('idregimentrabajo');
                             vista.combo.setValue(regimentrabajo);
                         }else{
                             vista.combo.setValue('');
                         }
                         vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                         vista.winAdicionarGD.show();
                         self.accion = 'addGD';
                         break;
                     }
                     case 77:{ //m para modificar
                         if(!vista.btnModificarP.disabled){
                             vista.fadicionarGD.getForm().reset();
                             var idregimentrabajo=vista.gpListadoGrupoDescanso.getSelectionModel().getSelected().get('idgrupodescanso');
                             vista.fadicionarGD.getForm().loadRecord(vista.gpListadoGrupoDescanso.getSelectionModel().getSelected());
                             vista.winAdicionarGD.setTitle(idioma.lbTitVentAddGrupo);
                             vista.winAdicionarGD.show();
                             self.accion = 'modGD';
                         }
                         break;
                     }
                     case 88:{ //x para cancelar
                         vista.winAdicionarGD.hide();
                         break;
                     }
                 }
             }
         },{
             key: 46,//del para eliminar
             fn: function(){
                 if(!vista.btnEliminarP.disabled){
                     EliminarGD();
                 }
             }
         },{
             key: 13,//enter para aceptar
             fn: function(){

                 if(vista.btnAceptarGD.isVisible()){
                     vista.btnAceptarGD.focus();
                     guardarDatosGD('ACP');
                 }
             }
         },{
             alt: true,
             ctrl: true,
             stopEvent: true,
             key: 'p',
             fn: function(){
                 if(vista.btnAplicarGD.isVisible()){
                     guardarDatosGD('APL');
                 }
             }
         }]);*/
    }
}