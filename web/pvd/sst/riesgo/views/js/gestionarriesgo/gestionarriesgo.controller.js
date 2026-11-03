/*
 * Gestionar riesgo.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestionarriesgo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Riesgo.Gestionarriesgo');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Riesgo.Gestionarriesgo.Controlador = {
    init: function (idioma, vista, modelo) {

        var accion, node, objselect, medselect, accionmed, recselect, accionrec, eveselect, accioneven, conselect, accioncon,
            pelselect, accionpel;

        vista.ventanaGestion.on('beforeshow', function () {
            modelo.stNomRiesgo.load();
            modelo.stFrecuencia.load();
            modelo.stProbabilidad.load();
            modelo.stNivelRiesgo.load();
            modelo.stSistema.load();
            modelo.stParteSistema.load();
            if (accion == 'add') {
                vista.tabPanel.enable();
            }
        });

        vista.ventanaGestion.on('hide', function () {
            if (accion == 'add') {
                vista.tabPanel.disable();
            }
        });
        
        vista.ventanaGestionRec.on('beforeshow', function () {
            modelo.stNomRecurso.load();
        });

        vista.ventanaGestionEvento.on('beforeshow', function () {
            modelo.stNomEventos.load();
        });

        vista.ventanaGestionConsecuencia.on('beforeshow', function () {
            modelo.stNomConsecuencias.load();
        });

        vista.ventanaGestionPeligro.on('beforeshow', function () {
            modelo.stNomPeligros.load();
        });

        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stRiesgos.baseParams.idcargo = '';
            modelo.stRiesgos.baseParams = {idestructura: node.attributes.id};
            modelo.stRiesgos.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            vista.btnAdicionar.enable();
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == 7) {
                modelo.stRiesgos.baseParams.idcargo = node.attributes.id;
                vista.btnAdicionar.disable();
            } else {
                modelo.stRiesgos.baseParams.idestructura =  node.attributes.id;
                vista.btnAdicionar.enable();
            }
            modelo.stRiesgos.removeAll();
            modelo.stMedidas.removeAll();
            modelo.stRecursos.removeAll();
            vista.tabPanel.disable();
            modelo.stRiesgos.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpRiesgo.getSelectionModel().on('rowselect', function () {
            objselect = vista.gpRiesgo.getSelectionModel().getSelected().data;            
            modelo.stMedidas.baseParams.idriesgo = objselect.idriesgo;
            modelo.stRecursos.baseParams.idriesgo = objselect.idriesgo;
            modelo.stEventos.baseParams.idriesgo = objselect.idriesgo;
            modelo.stConsecuencias.baseParams.idriesgo = objselect.idriesgo;
            modelo.stPeligros.baseParams.idriesgo = objselect.idriesgo;
            vista.tabPanel.enable();
            if (vista.tabPanel.getActiveTab().id == 'gpMedidas') {
                modelo.stMedidas.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpRecursos') {
                modelo.stRecursos.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpEventos') {
                modelo.stEventos.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpConsecuencias') {
                modelo.stConsecuencias.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpPeligros') {
                modelo.stPeligros.load({params: {start: 0, limit: 15}});
            }
            vista.btnAdicionarMed.enable();
            vista.btnAdicionarRec.enable();
            vista.btnAddEvento.enable();
            vista.btnAddConsecuencia.enable();
            vista.btnAddPeligro.enable();
            if (vista.gpRiesgo.getSelectionModel().getSelections().length == 1) {
                vista.btnModificar.enable();
                var rg = vista.gpRiesgo.getSelectionModel().getSelected().data;                
            } else {
                vista.btnModificar.disable();
                modelo.stMedidas.removeAll();
                modelo.stRecursos.removeAll();
                modelo.stEventos.removeAll();
                vista.tabPanel.disable();
            }
            vista.btnEliminar.enable();
        });

        vista.gpRiesgo.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpRiesgo.getSelectionModel().getSelections().length == 0) {
                vista.btnEliminar.disable();
                vista.btnModificar.disable();
            }
            if (vista.gpRiesgo.getSelectionModel().getSelections().length == 1) {
                vista.btnModificar.enable();
            }
        });

        modelo.stRiesgos.on('load', function () {
            vista.gpRiesgo.getSelectionModel().clearSelections();
            vista.sfBuscar.enable();
            vista.btnEliminar.disable();
            vista.btnModificar.disable();
            if (modelo.stRiesgos.getCount() > 0) {
                vista.gpRiesgo.getSelectionModel().selectFirstRow();
            } else {
                vista.tabPanel.disable();
            }
        });
        
        modelo.stMedidas.on('load', function () {
            vista.btnModificarMed.disable();
            vista.btnEliminarMed.disable();
        });
        
        modelo.stRecursos.on('load', function () {
            vista.btnModificarRec.disable();
            vista.btnEliminarRec.disable();
        });

        modelo.stEventos.on('load', function () {
            vista.btnModEvento.disable();
            vista.btnDelEvento.disable();
        });

        modelo.stConsecuencias.on('load', function () {
            vista.btnModConsecuencia.disable();
            vista.btnDelConsecuencia.disable();
        });

        modelo.stPeligros.on('load', function () {
            vista.btnModPeligro.disable();
            vista.btnDelPeligro.disable();
        });
        
        vista.tabPanel.on('tabchange', function(){
            if (vista.tabPanel.getActiveTab().id == 'gpMedidas') {
                modelo.stMedidas.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpRecursos') {
                modelo.stRecursos.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpEventos') {
                modelo.stEventos.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpConsecuencias') {
                modelo.stConsecuencias.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpPeligros') {
                modelo.stPeligros.load({params: {start: 0, limit: 15}});
            }

        });

        vista.btnEliminar.on('click', function () {
            eliminar();
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            vista.ventanaGestion.show();
            vista.btnAplicar.show();
            vista.ventanaGestion.setTitle(idioma.msgAdd);
            vista.formularioGestion.getForm().reset();
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            var obj = vista.gpRiesgo.getSelectionModel().getSelected().data;
            vista.ventanaGestion.show();
            vista.btnAplicar.hide();
            vista.ventanaGestion.setTitle(idioma.msgMod);            
            vista.cbNomRiesgo.setValue(obj.idnriesgo);
            vista.cbNomRiesgo.setRawValue(obj.denomriesgo);
            vista.taDescripcion.setValue(obj.descripcion);
            vista.dfFechaDeteccion.setValue(obj.fdeteccion);
            vista.cbFrecuencia.setValue(obj.idfrecuencia);
            vista.cbFrecuencia.setRawValue(obj.frecuencia);
            vista.cbProbabilidad.setValue(obj.idprobabilidad);
            vista.cbProbabilidad.setRawValue(obj.probabilidad);
            vista.cbNivelRiesgo.setValue(obj.idnivelriesgo);
            vista.cbNivelRiesgo.setRawValue(obj.nivelriesgo);
            vista.cbSistema.setValue(obj.idsistema);
            vista.cbSistema.setRawValue(obj.sistema);
            vista.cbParteSistema.setValue(obj.idpartesistema);
            vista.cbParteSistema.setRawValue(obj.partesistema);
        });

        vista.btnExportar.on('click', function () {
            var nodeactual = node;
            var entidad;
            if (nodeactual.attributes._parent) {
                while (nodeactual.attributes._parent != nodeactual.id) {
                    var idc = nodeactual.parentNode.attributes.idconcepto;
                    var idt = nodeactual.parentNode.attributes.idtipo;
                    if ((idc == 3 || idc == 1 || idc == 4) || (idt == 3 || idt == 1 || idt == 4)) {
                        entidad = nodeactual.parentNode.text;
                        break;
                    }
                    nodeactual = nodeactual.parentNode;
                }
            } else {
                entidad = node.text;
            }

            if (modelo.stRiesgos.getCount() > 0) {
                var params = Ext.urlEncode({
                    idestructura: node.id,
                    entidad: entidad
                });
                var idIframe = Ext.id();
                new Ext.Window({
                    title: 'Evaluación de riesgos',
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
                            '/pvd/sst/riesgo/index.php/gestionarriesgo/generarPdfReporte?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winregistro').maximize();
                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
                document.getElementById(idIframe).onload = function () {
                    PVD.ocultarMascara('rep01');
                }
            } else {
                mostrarMensaje(8, 'En la estructura seleccionada no existen riesgos registrados.');
            }
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
        
        vista.gpMedidas.getSelectionModel().on('rowselect', function () {
            medselect = vista.gpMedidas.getSelectionModel().getSelected().data;
            if (vista.gpMedidas.getSelectionModel().getSelections().length == 1) {
                vista.btnModificarMed.enable();               
            } else {
                vista.btnModificarMed.disable();
            }
            vista.btnEliminarMed.enable();
        });
        
        vista.gpRecursos.getSelectionModel().on('rowselect', function () {
            recselect = vista.gpRecursos.getSelectionModel().getSelected().data;
            if (vista.gpRecursos.getSelectionModel().getSelections().length == 1) {
                vista.btnModificarRec.enable();               
            } else {
                vista.btnModificarRec.disable();
            }
            vista.btnEliminarRec.enable();
        });

        vista.gpEventos.getSelectionModel().on('rowselect', function () {
            eveselect = vista.gpEventos.getSelectionModel().getSelected().data;
            if (vista.gpEventos.getSelectionModel().getSelections().length == 1) {
                vista.btnModEvento.enable();
            } else {
                vista.btnModEvento.disable();
            }
            vista.btnDelEvento.enable();
        });

        vista.gpConsecuencias.getSelectionModel().on('rowselect', function () {
            conselect = vista.gpConsecuencias.getSelectionModel().getSelected().data;
            if (vista.gpConsecuencias.getSelectionModel().getSelections().length == 1) {
                vista.btnModConsecuencia.enable();
            } else {
                vista.btnModConsecuencia.disable();
            }
            vista.btnDelConsecuencia.enable();
        });

        vista.gpPeligros.getSelectionModel().on('rowselect', function () {
            pelselect = vista.gpPeligros.getSelectionModel().getSelected().data;
            if (vista.gpPeligros.getSelectionModel().getSelections().length == 1) {
                vista.btnModPeligro.enable();
            } else {
                vista.btnModPeligro.disable();
            }
            vista.btnDelPeligro.enable();
        });
        
        vista.gpMedidas.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpMedidas.getSelectionModel().getSelections().length == 0) {
                vista.btnEliminarMed.disable();
                vista.btnModificarMed.disable();
            }
            if (vista.gpMedidas.getSelectionModel().getSelections().length == 1) {
                vista.btnModificarMed.enable();
            }
        });
        
        vista.gpRecursos.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpRecursos.getSelectionModel().getSelections().length == 0) {
                vista.btnEliminarRec.disable();
                vista.btnModificarRec.disable();
            }
            if (vista.gpRecursos.getSelectionModel().getSelections().length == 1) {
                vista.btnModificarRec.enable();
            }
        });

        vista.gpEventos.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpEventos.getSelectionModel().getSelections().length == 0) {
                vista.btnDelEvento.disable();
                vista.btnModEvento.disable();
            }
            if (vista.gpEventos.getSelectionModel().getSelections().length == 1) {
                vista.btnModEvento.enable();
            }
        });

        vista.gpConsecuencias.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpConsecuencias.getSelectionModel().getSelections().length == 0) {
                vista.btnDelConsecuencia.disable();
                vista.btnModConsecuencia.disable();
            }
            if (vista.gpConsecuencias.getSelectionModel().getSelections().length == 1) {
                vista.btnModConsecuencia.enable();
            }
        });

        vista.gpPeligros.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpPeligros.getSelectionModel().getSelections().length == 0) {
                vista.btnDelPeligro.disable();
                vista.btnModPeligro.disable();
            }
            if (vista.gpPeligros.getSelectionModel().getSelections().length == 1) {
                vista.btnModPeligro.enable();
            }
        });
        
        vista.btnAdicionarMed.on('click', function () {
            accionmed = 'add';
            vista.ventanaGestionMed.show();
            vista.btnAplicarMed.show();
            vista.ventanaGestionMed.setTitle('Adicionar medida');
            vista.formularioGestionMed.getForm().reset();
        });
        
        vista.btnAdicionarRec.on('click', function () {
            accionrec = 'add';
            vista.ventanaGestionRec.show();
            vista.btnAplicarRec.show();
            vista.ventanaGestionRec.setTitle('Adicionar recurso');
            vista.formularioGestionRec.getForm().reset();
        });

        vista.btnAddEvento.on('click', function () {
            accioneven = 'add';
            vista.ventanaGestionEvento.show();
            vista.btnAplicarEvento.show();
            vista.ventanaGestionEvento.setTitle('Adicionar evento');
            vista.formularioGestionEvento.getForm().reset();
        });

        vista.btnAddConsecuencia.on('click', function () {
            accioncon = 'add';
            vista.ventanaGestionConsecuencia.show();
            vista.btnAplicarConsecuencia.show();
            vista.ventanaGestionConsecuencia.setTitle('Adicionar consecuencia');
            vista.formularioGestionConsecuencia.getForm().reset();
        });

        vista.btnAddPeligro.on('click', function () {
            accionpel = 'add';
            vista.ventanaGestionPeligro.show();
            vista.btnAplicarPeligro.show();
            vista.ventanaGestionPeligro.setTitle('Adicionar peligro');
            vista.formularioGestionPeligro.getForm().reset();
        });

        vista.btnModificarMed.on('click', function () {
            accionmed = 'mod';
            vista.ventanaGestionMed.show();
            vista.btnAplicarMed.hide();
            vista.ventanaGestionMed.setTitle('Modificar medida');            
            var obj = vista.gpMedidas.getSelectionModel().getSelected().data;            
            vista.taMedida.setValue(obj.medida);
            vista.tfResponsable.setValue(obj.responsable);
            vista.dfFechaCumplimiento.setValue(obj.fcumplimiento);
        });
        
        vista.btnModificarRec.on('click', function () {
            accionrec = 'mod';
            vista.ventanaGestionRec.show();
            vista.btnAplicarRec.hide();
            vista.ventanaGestionRec.setTitle('Modificar recurso');            
            var obj = vista.gpRecursos.getSelectionModel().getSelected().data;            
            vista.cbNomRecurso.setValue(obj.idrecurso);
            vista.cbNomRecurso.setRawValue(obj.recurso);
            vista.taDescripcionRec.setValue(obj.descripcion);
            vista.dfFInicioRec.setValue(obj.fdesde);
            vista.dfFFinRec.setValue(obj.fhasta);
        });

        vista.btnModEvento.on('click', function () {
            accioneven = 'mod';
            vista.ventanaGestionEvento.show();
            vista.btnAplicarEvento.hide();
            vista.ventanaGestionEvento.setTitle('Modificar evento');
            var obj = vista.gpEventos.getSelectionModel().getSelected().data;
            vista.cbEvento.setValue(obj.idevento);
            vista.cbEvento.setRawValue(obj.evento);
            vista.taObservacionesEvento.setValue(obj.observaciones);
            vista.dfFRegistroEvento.setValue(obj.fregistro);
        });

        vista.btnModConsecuencia.on('click', function () {
            accioncon = 'mod';
            vista.ventanaGestionConsecuencia.show();
            vista.btnAplicarConsecuencia.hide();
            vista.ventanaGestionConsecuencia.setTitle('Modificar consecuencia');
            var obj = vista.gpConsecuencias.getSelectionModel().getSelected().data;
            vista.cbConsecuencia.setValue(obj.idconsecuencia);
            vista.cbConsecuencia.setRawValue(obj.consecuencia);
            vista.taObservacionesCons.setValue(obj.observaciones);
            vista.chbPrincipal.setValue(obj.principal);
            vista.dfFRegistroConsecuencia.setValue(obj.fregistro);
        });

        vista.btnModPeligro.on('click', function () {
            accionpel = 'mod';
            vista.ventanaGestionPeligro.show();
            vista.btnAplicarPeligro.hide();
            vista.ventanaGestionPeligro.setTitle('Modificar peligro');
            var obj = vista.gpPeligros.getSelectionModel().getSelected().data;
            vista.cbPeligro.setValue(obj.idpeligro);
            vista.cbPeligro.setRawValue(obj.peligro);
            vista.taObservacionesCons.setRawValue(obj.observaciones);
            vista.dfFRegistroPeligro.setValue(obj.fregistro);
        });
        
        vista.btnEliminarMed.on('click', function () {
            eliminarMed();
        });
        
        vista.btnEliminarRec.on('click', function () {
            eliminarRec();
        });

        vista.btnDelEvento.on('click', function () {
            eliminarEvento();
        });

        vista.btnDelConsecuencia.on('click', function () {
            eliminarConsecuencia();
        });

        vista.btnDelPeligro.on('click', function () {
            eliminarPeligro();
        });
        
        vista.btnAceptarMed.on('click', function () {
            guardarDatosMed('ACP');
        });
        
        vista.btnAceptarRec.on('click', function () {
            guardarDatosRec('ACP');
        });

        vista.btnAceptarEvento.on('click', function () {
            guardarDatosEvento('ACP');
        });

        vista.btnAceptarConsecuencia.on('click', function () {
            guardarDatosConsecuencia('ACP');
        });

        vista.btnAceptarPeligro.on('click', function () {
            guardarDatosPeligro('ACP');
        });

        vista.btnAplicarMed.on('click', function () {
            guardarDatosMed('APL');
        });
        
        vista.btnAplicarRec.on('click', function () {
            guardarDatosRec('APL');
        });

        vista.btnAplicarEvento.on('click', function () {
            guardarDatosEvento('APL');
        });

        vista.btnAplicarConsecuencia.on('click', function () {
            guardarDatosConsecuencia('APL');
        });

        vista.btnAplicarPeligro.on('click', function () {
            guardarDatosPeligro('APL');
        });

        vista.btnCancelarMed.on('click', function () {
            vista.ventanaGestionMed.hide();
        });
        
        vista.btnCancelarRec.on('click', function () {
            vista.ventanaGestionRec.hide();
        });

        vista.btnCancelarEvento.on('click', function () {
            vista.ventanaGestionEvento.hide();
        });

        vista.btnCancelarConsecuencia.on('click', function () {
            vista.ventanaGestionConsecuencia.hide();
        });

        vista.btnCancelarPeligro.on('click', function () {
            vista.ventanaGestionPeligro.hide();
        });

        function guardarDatos(btnpress)
        {
            if(vista.formularioGestion.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addRiesgo' : 'updateRiesgo'),
                    params: {
                        idriesgo: accion == 'add' ? -1 : vista.gpRiesgo.getSelectionModel().getSelected().data.idriesgo,
                        idnriesgo: vista.cbNomRiesgo.getValue(),                        
                        idestructura: node.id,
                        descripcion: vista.taDescripcion.getValue(),
                        fdeteccion: vista.dfFechaDeteccion.getRawValue(),
                        idfrecuencia: vista.cbFrecuencia.getValue(),
                        idprobabilidad: vista.cbProbabilidad.getValue(),
                        idnivelriesgo: vista.cbNivelRiesgo.getValue(),
                        idsistema: vista.cbSistema.getValue(),
                        idpartesistema: vista.cbParteSistema.getValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, idioma.msgModSucces);
                            }else{
                                mostrarMensaje(1, idioma.msgAddSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                vista.ventanaGestion.hide();
                            }
                            vista.formularioGestion.getForm().reset();
                            modelo.stRiesgos.removeAll();
                            modelo.stRiesgos.reload();
                        } else {
                            mostrarMensaje(6,idioma.msgExistem);
                        }
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = vista.gpRiesgo.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idriesgo);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el riesgo seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los riesgos seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteRiesgo',
                        params: {idsriesgos: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El riesgo seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los riesgos seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El riesgo ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los riesgos han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                                vista.tabPanel.disable();
                                modelo.stMedidas.removeAll();
                                modelo.stRecursos.removeAll();
                                modelo.stEventos.removeAll();
                                modelo.stConsecuencias.removeAll();
                                modelo.stPeligros.removeAll();
                            }
                            modelo.stRiesgos.removeAll();
                            modelo.stRiesgos.reload();
                        }
                    });
                }
            });
        }
        
        function guardarDatosMed(btnpress)
        {
            if(vista.formularioGestionMed.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accionmed == 'add' ? 'addMedida' : 'updateMedida'),
                    params: {
                        idmedida: accionmed == 'add' ? -1 : medselect.idmedida,
                        idriesgo: objselect.idriesgo,
                        medida: vista.taMedida.getValue(),
                        responsable: vista.tfResponsable.getValue(),
                        fcumplimiento: vista.dfFechaCumplimiento.getRawValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accionmed == 'mod')
                            {
                                mostrarMensaje(1, 'La medida ha sido modificada satisfactoriamente.');
                            }else{
                                mostrarMensaje(1, 'La medida ha sido adicionada satisfactoriamente.');
                            }
                            if (btnpress == 'ACP')
                            {
                                vista.ventanaGestionMed.hide();
                            }
                            vista.formularioGestionMed.getForm().reset();
                            modelo.stMedidas.removeAll();
                            modelo.stMedidas.reload();
                        } else {
                            mostrarMensaje(6,'La medida que desea adicionar ya existe');
                        }
                    }
                });
            }
        }
        
        function eliminarMed()
        {
            var ids = new Array();
            var s = vista.gpMedidas.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idmedida);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la medida seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las medidas seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteMedida',
                        params: {idsmedida: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La medida seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las medidas seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La medida ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las medidas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stMedidas.removeAll();
                            modelo.stMedidas.reload();
                        }
                    });
                }
            });
        }
        
        function guardarDatosRec(btnpress)
        {
            if(vista.formularioGestionRec.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accionrec == 'add' ? 'addRecurso' : 'updateRecurso'),
                    params: {
                        iddrecurso: accionrec == 'add' ? -1 : recselect.iddrecurso,
                        idriesgo: objselect.idriesgo,
                        idrecurso: vista.cbNomRecurso.getValue(),
                        descripcion: vista.taDescripcionRec.getValue(),
                        fdesde: vista.dfFInicioRec.getRawValue(),
                        fhasta: vista.dfFFinRec.getRawValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accionrec == 'mod')
                            {
                                mostrarMensaje(1, 'El recurso ha sido modificado satisfactoriamente.');
                            }else{
                                mostrarMensaje(1, 'El recurso ha sido adicionado satisfactoriamente.');
                            }
                            if (btnpress == 'ACP')
                            {
                                vista.ventanaGestionRec.hide();
                            }
                            vista.formularioGestionRec.getForm().reset();
                            modelo.stRecursos.removeAll();
                            modelo.stRecursos.reload();
                        } else {
                            mostrarMensaje(6,'El recurso que desea adicionar ya existe');
                        }
                    }
                });
            }
        }

        function guardarDatosEvento(btnpress) {
            if (vista.formularioGestionEvento.getForm().isValid()) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accioneven == 'add' ? 'addEvento' : 'updateEvento'),
                    params: {
                        idriesgoevento: accioneven == 'add' ? -1 : eveselect.idriesgoevento,
                        idriesgo: objselect.idriesgo,
                        idevento: vista.cbEvento.getValue(),
                        observaciones: vista.taObservacionesEvento.getValue(),
                        fregistro: vista.dfFRegistroEvento.getRawValue()
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if (accioneven == 'mod') {
                                mostrarMensaje(1, 'El evento ha sido modificado satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'El evento ha sido adicionado satisfactoriamente.');
                            }
                            if (btnpress == 'ACP') {
                                vista.ventanaGestionEvento.hide();
                            }
                            vista.formularioGestionEvento.getForm().reset();
                            modelo.stEventos.removeAll();
                            modelo.stEventos.reload();
                        } else {
                            mostrarMensaje(6, 'El evento que desea adicionar ya existe');
                        }
                    }
                });
            }
        }

        function guardarDatosConsecuencia(btnpress) {
            if (vista.formularioGestionConsecuencia.getForm().isValid()) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accioncon == 'add' ? 'addConsecuencia' : 'updateConsecuencia'),
                    params: {
                        idrconsecuencia: accioncon == 'add' ? -1 : conselect.idrconsecuencia,
                        idriesgo: objselect.idriesgo,
                        idconsecuencia: vista.cbConsecuencia.getValue(),
                        observaciones: vista.taObservacionesCons.getValue(),
                        principal: (vista.chbPrincipal.checked == true) ? 1 : 0,
                        fregistro: vista.dfFRegistroConsecuencia.getRawValue()
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if (accioncon == 'mod') {
                                mostrarMensaje(1, 'La consecuencia ha sido modificada satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'La consecuencia ha sido adicionada satisfactoriamente.');
                            }
                            if (btnpress == 'ACP') {
                                vista.ventanaGestionConsecuencia.hide();
                            }
                            vista.formularioGestionConsecuencia.getForm().reset();
                            modelo.stConsecuencias.removeAll();
                            modelo.stConsecuencias.reload();
                        } else {
                            mostrarMensaje(6, 'La consecuencia que desea adicionar ya existe');
                        }
                    }
                });
            }
        }

        function guardarDatosPeligro(btnpress) {
            if (vista.formularioGestionPeligro.getForm().isValid()) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accionpel == 'add' ? 'addPeligros' : 'updatePeligros'),
                    params: {
                        idrpeligro: accionpel == 'add' ? -1 : pelselect.idrpeligro,
                        idriesgo: objselect.idriesgo,
                        idpeligro: vista.cbPeligro.getValue(),
                        observaciones: vista.taObservacionesPeligro.getValue(),
                        fregistro: vista.dfFRegistroPeligro.getRawValue()
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if (accionpel == 'mod') {
                                mostrarMensaje(1, 'La peligro ha sido modificado satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'La peligro ha sido adicionado satisfactoriamente.');
                            }
                            if (btnpress == 'ACP') {
                                vista.ventanaGestionPeligro.hide();
                            }
                            vista.formularioGestionPeligro.getForm().reset();
                            modelo.stPeligros.removeAll();
                            modelo.stPeligros.reload();
                        } else {
                            mostrarMensaje(6, 'La peligro que desea adicionar ya existe');
                        }
                    }
                });
            }
        }
        
        function eliminarRec()
        {
            var ids = new Array();
            var s = vista.gpRecursos.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.iddrecurso);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el recurso seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los recursos seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteRecurso',
                        params: {idsrecurso: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El recurso seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los recursos seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El recurso ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los recursos han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stRecursos.removeAll();
                            modelo.stRecursos.reload();
                        }
                    });
                }
            });
        }

        function eliminarEvento() {
            var ids = new Array();
            var s = vista.gpEventos.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.idriesgoevento);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el evento seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los eventos seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteEvento',
                        params: {eventos: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El evento seleccionado no puede ser eliminado debido a que se' +
                                        ' encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los eventos seleccionados no puede ser eliminado debido a' +
                                        ' que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El evento ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los eventos han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stEventos.removeAll();
                            modelo.stEventos.reload();
                        }
                    });
                }
            });
        }

        function eliminarConsecuencia() {
            var ids = new Array();
            var s = vista.gpConsecuencias.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.idrconsecuencia);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la consecuencia seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las consecuencias seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteConsecuencia',
                        params: {consecuencias: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La consecuencia seleccionada no puede ser eliminada debido a que se' +
                                        ' encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las consecuencias seleccionadas no puede ser eliminada' +
                                        ' debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La consecuencia ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las consecuencias han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stConsecuencias.removeAll();
                            modelo.stConsecuencias.reload();
                        }
                    });
                }
            });
        }

        function eliminarPeligro() {
            var ids = new Array();
            var s = vista.gpPeligros.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.idrpeligro);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la peligro seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las peligros seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deletePeligros',
                        params: {peligros: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La peligro seleccionado no puede ser eliminado debido a que se' +
                                        ' encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de los peligros seleccionados no puede ser eliminado' +
                                        ' debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La peligro ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Las peligros han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stPeligros.removeAll();
                            modelo.stPeligros.reload();
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
                        if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpMedidas'){
                            accionmed = 'add';
                            vista.ventanaGestionMed.show();
                            vista.btnAplicarMed.show();
                            vista.ventanaGestionMed.setTitle('Adicionar medida');
                            vista.formularioGestionMed.getForm().reset();
                        } else if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpRecursos'){
                            accionrec = 'add';
                            vista.ventanaGestionRec.show();
                            vista.btnAplicarRec.show();
                            vista.ventanaGestionRec.setTitle('Adicionar recurso');
                            vista.formularioGestionRec.getForm().reset();
                        } else if(!vista.btnAdicionar.disabled){
                            accion = 'add';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.show();
                            vista.ventanaGestion.setTitle(idioma.msgAdd);
                            vista.formularioGestion.getForm().reset();
                        }
                        break;                        
                    }
                    case 77:{ //m para modificar
                        if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpMedidas'){
                            if (!vista.btnModificarMed.disabled) {
                                accionmed = 'mod';
                                vista.ventanaGestionMed.show();
                                vista.btnAplicarMed.hide();
                                vista.ventanaGestionMed.setTitle('Modificar medida');            
                                var obj = vista.gpMedidas.getSelectionModel().getSelected().data;            
                                vista.taMedida.setValue(obj.medida);
                                vista.tfResponsable.setValue(obj.responsable);
                                vista.dfFechaCumplimiento.setValue(obj.fcumplimiento);
                            }
                        } else if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpRecursos'){
                            if (!vista.btnModificarRec.disabled) {
                                accionrec = 'mod';
                                vista.ventanaGestionRec.show();
                                vista.btnAplicarRec.hide();
                                vista.ventanaGestionRec.setTitle('Modificar recurso');            
                                var obj = vista.gpRecursos.getSelectionModel().getSelected().data;            
                                vista.cbNomRecurso.setValue(obj.idrecurso);
                                vista.cbNomRecurso.setRawValue(obj.recurso);
                                vista.taDescripcionRec.setValue(obj.descripcion);
                                vista.dfFInicioRec.setValue(obj.fdesde);
                                vista.dfFFinRec.setValue(obj.fhasta);
                            }
                        } else if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            var obj = vista.gpRiesgo.getSelectionModel().getSelected().data;
                            vista.ventanaGestion.show();
                            vista.btnAplicar.hide();
                            vista.ventanaGestion.setTitle(idioma.msgMod);            
                            vista.cbNomRiesgo.setValue(obj.idnriesgo);
                            vista.cbNomRiesgo.setRawValue(obj.denomriesgo);
                            vista.taDescripcion.setValue(obj.descripcion);
                            vista.dfFechaDeteccion.setValue(obj.fdeteccion);
                            vista.cbFrecuencia.setValue(obj.idfrecuencia);
                            vista.cbFrecuencia.setRawValue(obj.frecuencia);
                            vista.cbProbabilidad.setValue(obj.idprobabilidad);
                            vista.cbProbabilidad.setRawValue(obj.probabilidad);
                            vista.cbNivelRiesgo.setValue(obj.idnivelriesgo);
                            vista.cbNivelRiesgo.setRawValue(obj.nivelriesgo);
                        }
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
                    case 88:
                    { //x para cancelar
                        if (vista.btnCancelarMed.isVisible()) {
                            vista.ventanaGestionMed.hide();
                        } if (vista.btnCancelarRec.isVisible()) {
                            vista.ventanaGestionRec.hide();
                        } if (vista.btnCancelar.isVisible()) {
                            vista.ventanaGestion.hide();
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpMedidas' && !vista.btnEliminarMed.disabled){
                    eliminarMed();
                } else if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpRecursos' && !vista.btnEliminarRec.disabled){
                    eliminarRec();
                } else if(!vista.btnEliminar.disabled){
                    eliminar();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptarMed.isVisible()){
                    vista.btnAceptarMed.focus();
                    guardarDatosMed('ACP');
                } else if(vista.btnAceptarRec.isVisible()){
                    vista.btnAceptarRec.focus();
                    guardarDatosRec('ACP');
                } else if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    guardarDatos('ACP');
                }
            }
        },{
            key: 'p',
            alt: true,
            ctrl: true,
            //stopEvent: true,
            fn: function () {
                if(vista.btnAplicarMed.isVisible()){
                    guardarDatosMed('APL');
                } else if(vista.btnAplicarRec.isVisible()){
                    guardarDatosRec('APL');
                } else if(vista.btnAplicar.isVisible()){
                    guardarDatos('APL');
                }
            }
        }]);
    }
};
