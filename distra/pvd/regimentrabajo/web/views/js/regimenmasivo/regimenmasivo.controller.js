Ext.ns('Pvd.ControlAsistencia.RegimenMasivo');
//Controlador de la vista del componente
Pvd.ControlAsistencia.RegimenMasivo.Controlador = {
   
    init: function(idioma, vista, modelo) {
        var scope=this;
        this.idestructura = null;
        this.idconcepto = null;
        var idtipo = null;
        var date = new Date();



        modelo.storeRegimenTrabajo.load();
        modelo.storeRegimenTrabajoBusq.load();
        modelo.storeGrupoTrabajoBusq.load();

        vista.cbregimenbusq.on('select', function (cb, rec, ind) {
            vista.cbgrupobusq.reset();
            modelo.storeGrupoTrabajoBusq.load({params: {idregimentrabajo: rec.data.idregimentrabajo}});
        });

        vista.cbregimenbusq.on('deselect', function (cb, rec, ind) {
            modelo.storeGrupoTrabajoBusq.load();
        });

        vista.cbregimen.on('select',function(cb,rec,ind){
             modelo.storeGrupoTrabajo.load({params:{idregimentrabajo:rec.data.idregimentrabajo}});
        });

        Ext.getCmp('panelsur').on('beforeexpand', function(){
            Ext.getCmp('panelsur').doLayout();
        });

        vista.estructura.tree.root.on('expand', function (nodo) {
            vista.estructura.tree.getSelectionModel().select(nodo.childNodes[0]);
            modelo.fuenteDatosListado.baseParams.idestructura=  vista.estructura.inicial;
            //modelo.fuenteDatosListado.baseParams.agrupador = vista.agrupador.value;
            modelo.fuenteDatosListado.load({
                params: {
                    filtro: vista.tfbuscar.getValue(), idregimentrabajo: vista.cbregimenbusq.getValue(),
                    idgrupodescanso: vista.cbgrupobusq.getValue(), start: 0, limit: 15
                }
            });
        });
        var fecha = new Date();
        vista.estructura.on('dameseleccion', function (obj, data) {
            vista.cbgrupo.reset();
            vista.cbregimen.reset();
            vista.cbturno.reset();
            vista.dfFInicio.setRawValue(fecha.format('d/m/Y'));
            Ext.getCmp('panelsur').expand();
            Ext.getCmp('panelsur').doLayout();
            vista.listado.getSelectionModel().clearSelections();
            if(data == false){
                this.idestructura = vista.estructura.inicial;
                this.idconcepto = scope.idtipo;
            }
            else{
                this.idestructura = data.id;
                this.idconcepto = data.attributes.idconcepto;
            }
            modelo.fuenteDatosListado.baseParams.idestructura= scope.idestructura;
            //modelo.fuenteDatosListado.baseParams.agrupador = vista.agrupador.value;
            modelo.fuenteDatosListado.load({
                params: {
                    filtro: vista.tfbuscar.getValue(), idregimentrabajo: vista.cbregimenbusq.getValue(),
                    idgrupodescanso: vista.cbgrupobusq.getValue(), start: 0, limit: 15
                }
            });
        },this);

        vista.listado.getSelectionModel().on('rowselect', function () {
            if(vista.listado.getSelectionModel().getCount() > 0){
                vista.btnEliminar.enable();
                vista.cbregimen.setValue(vista.listado.getSelectionModel().getSelected().data.idregimentrabajo);
                vista.cbgrupo.setValue(vista.listado.getSelectionModel().getSelected().data.idgrupodescanso);
                vista.cbgrupo.setRawValue(vista.listado.getSelectionModel().getSelected().data.grupotrabajo);
                //vista.dfFInicio.setRawValue(vista.listado.getSelectionModel().getSelected().data.fdesde);
                vista.dfFInicio.setRawValue(fecha.format('d/m/Y'));
                Ext.getCmp('panelsur').expand();
                Ext.getCmp('panelsur').doLayout();
            }
        }, this);

        vista.listado.getSelectionModel().on('rowdeselect', function () {
            if(vista.listado.getSelectionModel().getCount() == 0){
                vista.btnEliminar.disable();
            }
        }, this);

        vista.cbregimen.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });

        vista.cbgrupo.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.cbturno.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.dfFInicio.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });

        vista.btnLimpiar.on('click', function(){
            vista.tfbuscar.reset();
            vista.cbregimenbusq.reset();
            vista.cbgrupobusq.reset();
            vista.cbregimen.reset();
            vista.cbgrupo.reset();
            vista.dfFInicio.setValue(fecha.format('d/m/Y'));
            modelo.storeRegimenTrabajoBusq.load();
            modelo.storeGrupoTrabajoBusq.load();
            modelo.fuenteDatosListado.load({params: {start: 0, limit: 15}});
         });

        vista.btnBuscar.on('click', function(){
            //modelo.fuenteDatosListado.baseParams.agrupador = vista.agrupador.value;
            modelo.fuenteDatosListado.load({
                params: {
                    filtro: vista.tfbuscar.getValue(), idregimentrabajo: vista.cbregimenbusq.getValue(),
                    idgrupodescanso: vista.cbgrupobusq.getValue(), start: 0, limit: 15
                }
            });
         });

        vista.btnGuardar.on('click', function(){
            Guardar();
        },this);

		function Guardar(){
            mostrarMensaje(2, 'Se le asociará el régimen '+vista.cbregimen.getRawValue()+' y el grupo '+vista.cbgrupo.getRawValue()+' a partir del '+vista.dfFInicio.getRawValue()+' a personas, si existen asistencias a partir de esta fecha serán eliminadas. &iquest;Est&aacute; seguro que desea cambiar el régimen de la(s) persona(s)?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Asociando régimen a la(s) persona(s)...');
                    if(vista.listado.getSelectionModel().getSelected()){
                        var arreglo = new Array();
                        Ext.each(vista.listado.getSelectionModel().getSelections(), function(rec){
                            arreglo.push({
                                idpersona: rec.data.idpersona,
                                idcargo: rec.data.idcargo,
                                idcargodrt: rec.data.idcargodrt,
                                idregimentrabajo: rec.data.idregimentrabajo,
                                idgrupodescanso: rec.data.idgrupodescanso
                            });
                        })
                    }else{
                        var idestructura = scope.idestructura;
                    }
                    if (vista.formularioGestion.getForm().isValid()){
                        if(vista.listado.getSelectionModel().getSelected() || scope.idestructura != null){
                            Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                            Ext.Ajax.request({
                                url: 'guardarRegimenPersonas',
                                params: {
                                    idregimentrabajo:vista.cbregimen.getValue(),
                                    idgrupodescanso:vista.cbgrupo.getValue(),
                                    fdesde: vista.dfFInicio.getRawValue(),
                                    array: Ext.encode(arreglo),
                                    idestructura: idestructura
                                },
                                method: "POST",
                                callback: function (options, success, response) {
                                    Ext.getBody().unmask();
                                    var responseData = Ext.decode(response.responseText);
                                    if(responseData.cod == 1){
                                        vista.btnEliminar.disable();
                                        mostrarMensaje(1, idioma.lbMsgGuardarExito);
                                        modelo.fuenteDatosListado.reload();
                                        vista.listado.getSelectionModel().clearSelections();
                                    }
                                    else {
                                        if(responseData.cod == 2){
                                            mostrarMensaje(3, 'Ocurrió un error al asignar el regimen y grupo de trabajo a la(s) persona(s) seleccionada(s).');
                                        }
                                        else
                                        {
                                            if(responseData.cod == 3){
                                                mostrarMensaje(3, 'Ocurrió un error al guardar la planificación de la(s) persona(s) seleccionada(s).');
                                            }
                                            else
                                            {
                                                mostrarMensaje(3, 'Ocurrió un error al guardar los datos.');
                                            }
                                        }
                                    }
                                }
                                // ,success: function () {
                                //     mostrarMensaje(1, idioma.lbMsgGuardarExito);
                                //     modelo.fuenteDatosListado.reload();
                                // }
                            });
                        } else mostrarMensaje(3, idioma.lbMsgSelecPersonEst);
                    }else mostrarMensaje(3, idioma.lbTitMsgCamposInc);
                }
            });

        }

        vista.btnEliminar.on('click', function () {
            mostrarMensaje(2, '&iquest;Est&aacute; seguro que desea eliminar el régimen de la(s) persona(s)?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando el régimen de la(s) persona(s)...');
                    var idspersona = new Array();
                    var seleccionados = vista.listado.getSelectionModel().getSelections();
                    if (seleccionados.length > 0) {
                        Ext.each(vista.listado.getSelectionModel().getSelections(), function (rec) {
                            idspersona.push(rec.data.idpersona);
                        });
                    }
                    if (idspersona.length > 0) {
                        Ext.Ajax.request({
                            url: 'eliminarregimen',
                            params: {idspersona: Ext.encode(idspersona)},
                            method: "POST",
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                Ext.getBody().unmask();
                                if (responseData.cod == 1)
                                    mostrarMensaje(1, 'El régimen de la(s) persona(s) ha sido eliminado satisfactoriamente.');
                            },
                            success: function () {
                                modelo.fuenteDatosListado.reload();
                            }
                        });
                    } else {
                        Ext.getBody().unmask();
                        //mostrarMensaje(1, 'La asistencia no pudo ser eliminada');
                    }
                }
            });
        });

        // vista.agrupador.on('select', function (cb, r, i) {
        //     modelo.fuenteDatosListado.removeAll();
        //     modelo.fuenteDatosListado.baseParams.idestructura= this.idestructura;
        //     modelo.fuenteDatosListado.baseParams.idconcepto= this.idconcepto;
        //    // modelo.fuenteDatosListado.baseParams.agrupador = vista.agrupador.value;
        //     modelo.fuenteDatosListado.load({
        //         params: {
        //             filtro: vista.tfbuscar.getValue(), idregimentrabajo: vista.cbregimenbusq.getValue(),
        //             idgrupodescanso: vista.cbgrupobusq.getValue(), start: 0, limit: 15
        //         }
        //     });
        // });

        vista.btnExportar.on('click', function () {
            exportar();
        });

        function exportar() {
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Exportar régimen de trabajo',
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
                            '/pvd/regimentrabajo/index.php/regimenmasivo/exportarPDF?'
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }


        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'blg',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
					case 66:{ //b para buscar
                        //modelo.fuenteDatosListado.baseParams.agrupador = vista.agrupador.value;
                        modelo.fuenteDatosListado.load({
                            params: {
                                filtro: vista.tfbuscar.getValue(),
                                idregimentrabajo: vista.cbregimenbusq.getValue(),
                                idgrupodescanso: vista.cbgrupobusq.getValue(),
                                start: 0,
                                limit: 15
                            }
                        });
                        break;
                    }
					case 76:{ //l para limpiar
                        vista.tfbuscar.reset();
                        vista.cbregimenbusq.reset();
                        vista.cbgrupobusq.reset();
						modelo.fuenteDatosListado.load({params:{start:0, limit:15}});
                        break;
                    }
                    case 71:{ //g para guardar
                        Guardar();
                    }	
                }
            }
        },{
            key: 13,//Enter para buscar
            fn: function(){
                //modelo.fuenteDatosListado.baseParams.agrupador = vista.agrupador.value;
                modelo.fuenteDatosListado.load({
                    params: {
                        filtro: vista.tfbuscar.getValue(),
                        idregimentrabajo: vista.cbregimenbusq.getValue(),
                        idgrupodescanso: vista.cbgrupobusq.getValue(),
                        start: 0,
                        limit: 15
                    }
                });
            }
        }]);
    }
}