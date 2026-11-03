/*
 * Gestionar Interrupcion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Movimientoslaborales
 * @uses Pvd.Movimientoslaborales.Gestionarinterrupcion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Gestionarinterrupcion');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Movimientoslaborales.Gestionarinterrupcion.Controlador = {
    init: function (idioma, vista, modelo) {
        var accion, objselect, node;

        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            vista.pInterruptos.stPersonasAll.baseParams.idestructura = node.attributes.id;
            vista.pInterruptos.stPersonasAll.load({params: {start: 0, limit: 15}});
            modelo.stInterrupcion.baseParams = {idestructura: node.attributes.id};
            modelo.stInterrupcion.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            modelo.stInterrupcion.baseParams.idestructura =  node.attributes.id;
            vista.pInterruptos.stPersonasAll.baseParams.idestructura = node.attributes.id;
            vista.pInterruptos.stPersonasAll.load({params: {start: 0, limit: 15}});
            modelo.stInterrupcion.removeAll();
            vista.pInterruptos.stInterruptos.removeAll();
            vista.pInterruptos.btnAdicionar.disable();
            vista.pImputables.stImputables.removeAll();
            vista.pImputables.btnAdicionar.disable();
            modelo.stInterrupcion.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpInterrupcion.getSelectionModel().on('rowselect', function () {
            objselect = vista.gpInterrupcion.getSelectionModel().getSelected().data;
            vista.pInterruptos.interrupcion = objselect;
            vista.pImputables.interrupcion = objselect;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.tabPanel.enable();
            Ext.getCmp('btnAdicionarImp').enable();
            Ext.getCmp('btnAdicionarInt').enable();
            vista.pInterruptos.idinterrupcion = objselect.idinterrupcion;
            vista.pInterruptos.stInterruptos.baseParams.idinterrupcion = objselect.idinterrupcion;
            vista.pInterruptos.idinterrupcion = objselect.idinterrupcion;
            vista.pInterruptos.fdesde = objselect.fdesde;
            vista.pInterruptos.fhasta = objselect.fhasta;
            vista.pInterruptos.horas = objselect.horas;
            vista.pImputables.idinterrupcion = objselect.idinterrupcion;
            vista.pImputables.stImputables.baseParams.idinterrupcion = objselect.idinterrupcion;

            if (vista.tabPanel.getActiveTab().id == 'PanelInterruptos') {
                vista.pInterruptos.stInterruptos.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'PanelImputables'){
                vista.pImputables.stImputables.load({params: {start: 0, limit: 15}});
            }
        });

        modelo.stInterrupcion.on('load', function () {
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
            Ext.getCmp('btnAdicionarImp').disable();
            Ext.getCmp('btnAdicionarInt').disable();
            if (modelo.stInterrupcion.getCount() > 0) {
                vista.gpInterrupcion.getSelectionModel().selectFirstRow();
            }
        });
        
        vista.tabPanel.on('tabchange', function(){
            if (vista.tabPanel.getActiveTab().id == 'PanelInterruptos') {
                vista.pInterruptos.stInterruptos.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'PanelImputables'){
                vista.pImputables.stImputables.load({params: {start: 0, limit: 15}});
            }
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            vista.ventanaGestion.show();
            vista.btnAplicar.show();
            vista.ventanaGestion.setTitle(idioma.msgAddA);
            vista.formularioGestion.getForm().reset();
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            vista.ventanaGestion.show();
            vista.btnAplicar.hide();
            vista.ventanaGestion.setTitle(idioma.msgModA);
            vista.cbMotivo.setValue(objselect.idmotivointerrupcion);
            vista.cbMotivo.setRawValue(objselect.motivo);
            vista.tfHora.setValue(objselect.horas);
            vista.dfFDesde.setValue(objselect.fdesde);
            vista.dfFHasta.setValue(objselect.fhasta);
            vista.taObservacion.setValue(objselect.observacion);
        });

        vista.btnEliminar.on('click', function () {
            eliminar();
        });

        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');
        });

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL');
        });
       
        vista.btnCancelar.on('click', function () {
            vista.ventanaGestion.hide();
        });

        vista.ventanaGestion.on('beforeshow', function () {
            modelo.stMotivos.load();
        });

        function guardarDatos(btnpress) {
            if (vista.formularioGestion.getForm().isValid()) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addInterrupcion' : 'updateInterrupcion'),
                    params: {
                        idinterrupcion: accion == 'add' ? -1 : objselect.idinterrupcion,
                        idestructura: node.id,
                        idmotivointerrupcion: vista.cbMotivo.getValue(),
                        horas: vista.tfHora.getValue(),
                        fdesde: vista.dfFDesde.getRawValue(),
                        fhasta: vista.dfFHasta.getRawValue(),
                        observacion: vista.taObservacion.getValue()
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if (accion == 'mod') {
                                mostrarMensaje(1, idioma.msgModASucces);
                            } else {
                                mostrarMensaje(1, idioma.msgAddASucces);
                            }
                            if (btnpress == 'ACP') {
                                vista.ventanaGestion.hide();
                            }
                            vista.formularioGestion.getForm().reset();
                            modelo.stInterrupcion.removeAll();
                            modelo.stInterrupcion.reload();
                        } else {
                            mostrarMensaje(6, idioma.msgAExistem);
                        }
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = vista.gpInterrupcion.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idinterrupcion);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = idioma.msgADeletepreg1;
            } else {
                mensaje = idioma.msgADeletepreg2;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteInterrupcion',
                        params: {interrupcion: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = idioma.msgADeleteFail1;
                                } else {
                                    mensaje = idioma.msgADeleteFail2;
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = idioma.msgADeleteSucces1;
                                } else {
                                    mensaje = idioma.msgADeleteSucces2;
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stInterrupcion.removeAll();
                            modelo.stInterrupcion.reload();
                        }
                    });
                }
            });
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imlhbx',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                       if(!vista.btnAdicionar.disabled){
                           accion = 'add';
                           vista.ventanaGestion.show();
                           vista.btnAplicar.show();
                           vista.ventanaGestion.setTitle(idioma.msgAddA);
                           vista.formularioGestion.getForm().reset();
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.hide();
                            vista.ventanaGestion.setTitle(idioma.msgModA);
                            vista.cbMotivo.setValue(objselect.idmotivointerrupcion);
                            vista.cbMotivo.setRawValue(objselect.motivo);
                            vista.tfHora.setValue(objselect.horas);
                            vista.dfFDesde.setValue(objselect.fdesde);
                            vista.dfFHasta.setValue(objselect.fhasta);
                            vista.taObservacion.setValue(objselect.observacion);

                        }
                        break;
                    }
                    case 76:{ //l para limpiar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger1Click();
                        }
                        break;
                    }
                    /* case 72:{ //h para ayuda

                     break;
                     }*/
                    case 66:{ //b para buscar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger2Click();
                        }
                        break;
                    }
                    case 88:{ //x para cancelar
                        if (vista.btnCancelar.isVisible()) {
                            vista.ventanaGestion.hide();
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminar.disabled){
                    eliminar();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    guardarDatos('ACP');
                }
            }
        }]);
    }
};
