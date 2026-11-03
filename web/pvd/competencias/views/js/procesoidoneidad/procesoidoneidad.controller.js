/*
 * Gestionar procesos de idoneidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Idoneidad
 * @uses Pvd.Idoneidad.Procesoidoneidad
 * @copyright XETID
 * @version 1.0
 */


Ext.ns('Pvd.Idoneidad.Procesoidoneidad');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Idoneidad.Procesoidoneidad.Controlador = {
    init: function (idioma, vista, modelo) {
        var objselect, node, accion;

        modelo.stComisiones.load();
        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            vista.btnAdicionar.enable();
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stProcesos.baseParams = {idestructura: node.attributes.id};
            modelo.stProcesos.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            vista.pMiembros.stPersonasAll.baseParams.idestructura =  node.attributes.id;
            vista.pMiembros.stPersonasAll.load({params: {start: 0, limit: 15}});
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            // if (node.attributes.idconcepto == 1 || node.attributes.idconcepto == 3 || node.attributes.idtipo == 1 || node.attributes.idtipo == 3) {
                vista.btnAdicionar.enable();
            // } else {
            //    vista.btnAdicionar.disable();
            // }
            modelo.stProcesos.baseParams.idestructura =  node.attributes.id;
            modelo.stProcesos.removeAll();
            modelo.stProcesos.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            vista.pMiembros.stPersonasAll.baseParams.idestructura =  node.attributes.id;
            vista.pMiembros.stPersonasAll.load({params: {start: 0, limit: 15}});
        });

        vista.gpProcesos.getSelectionModel().on('rowselect', function () {
            objselect = vista.gpProcesos.getSelectionModel().getSelected().data;
            vista.pMiembros.idproceso = objselect.idproceso;
            vista.pMiembros.btnAdicionar.enable();
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.pMiembros.stImplicados.baseParams.idproceso = objselect.idproceso;
            vista.pMiembros.stImplicados.load({params: {start: 0, limit: 15}});
        });

        modelo.stProcesos.on('beforeload', function () {
            vista.pMiembros.btnAdicionar.disable();
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
            vista.pMiembros.stImplicados.removeAll();
            vista.pMiembros.stRecomendaciones.removeAll();
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            vista.winAdd.setTitle('Adicionar proceso de idoneidad');
            vista.winAdd.show();
            vista.btnAplicar.show();
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            vista.winAdd.setTitle('Modificar proceso de idoneidad');
            vista.tfdenom.setValue(objselect.denominacion);
            vista.cbComisiones.setValue(objselect.idcomision);
            vista.dfFInicio.setValue(objselect.fdesde);
            vista.dfFFin.setValue(objselect.fhasta);
            vista.winAdd.show();
            vista.btnAplicar.hide();
        });

        vista.btnEliminar.on('click', function () {
            eliminar();
        });

        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');
        });

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL')
        });

        vista.winAdd.on('show', function () {
            if (accion == 'add') {
                limpiar();
            }
        });
        
        function limpiar() {
            vista.tfdenom.reset();
            vista.cbComisiones.reset();
            vista.dfFInicio.reset();
            vista.dfFFin.reset();
        }

        function guardarDatos(btnpress) {
            if (vista.formularioGestion.getForm().isValid()) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addProceso' : 'updateProceso'),
                    params: {
                        idproceso: accion == 'add' ? -1 : objselect.idproceso,
                        idestructura: node.id,
                        denominacion: vista.tfdenom.getValue(),
                        fdesde: vista.dfFInicio.getRawValue(),
                        fhasta: vista.dfFFin.getRawValue(),
                        idcomision: vista.cbComisiones.getValue()
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if (accion == 'mod') {
                                mostrarMensaje(1, 'El proceso de idoneidad ha sido modificado satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'El proceso de idoneidad ha sido adicionado satisfactoriamente.');
                            }
                            if (btnpress == 'ACP') {
                                vista.winAdd.hide();
                            }
                            limpiar();
                            modelo.stProcesos.removeAll();
                            modelo.stProcesos.reload();
                        } else {
                            mostrarMensaje(6, 'Ocurrió un error mientras se guardaban lod datos.');
                        }
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = vista.gpProcesos.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idproceso);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = idioma.msgDeletepreg1;
            } else {
                mensaje = idioma.msgDeletepreg2;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteProceso',
                        params: {procesos: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = idioma.msgDeleteFail1;
                                } else {
                                    mensaje = idioma.msgDeleteFail2;
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = idioma.msgDeleteSucces1;
                                } else {
                                    mensaje = idioma.msgDeleteSucces2;
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stProcesos.removeAll();
                            modelo.stProcesos.reload();
                        }
                    });
                }
            });
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imlb',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if (!vista.pMiembros.btnAdicionarR.disabled) {
                            vista.pMiembros.btnAdicionarR.handler();
                        } else if (!vista.pMiembros.btnAdicionar.disabled) {
                            vista.pMiembros.btnAdicionar.handler();
                        } else if(!vista.btnAdicionar.disabled){
                            accion = 'add';
                            vista.winAdd.setTitle('Adicionar proceso de idoneidad');
                            vista.winAdd.show();
                            vista.btnAplicar.show();
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if (!vista.pMiembros.btnModificarR.disabled) {
                            vista.pMiembros.btnModificarR.handler();
                        } else if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            vista.winAdd.setTitle('Modificar proceso de idoneidad');
                            vista.tfdenom.setValue(objselect.denominacion);
                            vista.cbComisiones.setValue(objselect.idcomision);
                            vista.dfFInicio.setValue(objselect.fdesde);
                            vista.dfFFin.setValue(objselect.fhasta);
                            vista.winAdd.show();
                            vista.btnAplicar.hide();
                        }
                        break;
                    }
                    case 76:{ //l para limpiar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger1Click();
                        }
                        break;
                    }
                    case 66:{ //b para buscar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger2Click();
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if (!vista.pMiembros.btnEliminarR.disabled) {
                    vista.pMiembros.btnEliminarR.handler();
                } else if (!vista.pMiembros.btnEliminar.disabled) {
                    vista.pMiembros.btnEliminar.handler();
                } else if(!vista.btnEliminar.disabled){
                    eliminar();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptar.isVisible()){
                    guardarDatos('ACP');
                }
            }
        }]);
    }
};
