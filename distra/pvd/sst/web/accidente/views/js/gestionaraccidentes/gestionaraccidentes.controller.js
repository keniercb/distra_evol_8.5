/*
 * Gestionar Accidentes.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Gestionaraccidentes');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.SST.Gestionaraccidentes.Controlador = {
    init: function (idioma, vista, modelo) {
        var accion, objselect, node;

        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stAccidentes.baseParams = {idestructura: node.attributes.id};
            modelo.stAccidentes.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            modelo.stAccidentes.baseParams.idestructura =  node.attributes.id;
            modelo.stAccidentes.removeAll();
            modelo.stAccidentes.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            vista.pImplicadoss.stImplicados.removeAll();
            vista.pImplicadoss.stLesiones.removeAll();
            vista.pCausas.stCausas.removeAll();
            vista.pRecomendaciones.stRecomendaciones.removeAll();
            vista.pConclusiones.stConclusiones.removeAll();
            vista.pCostos.stCostos.removeAll();
        });

        // vista.gpAccidentes.getSelectionModel().on('selectionchange', function(th){
        //     if(th.getCount() == 0 || th.getCount() > 1){
        //         vista.tabPanel.collapse(true);
        //
        //     }
        //     else{
        //         vista.tabPanel.expand(true);
        //         vista.tabPanel.enable();
        //     }
        // });

        vista.gpAccidentes.getSelectionModel().on('rowselect', function () {
            objselect = vista.gpAccidentes.getSelectionModel().getSelected().data;
            vista.pImplicadoss.accidente = objselect;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.btnAsociar.enable();
            Ext.getCmp('btnAdicionarImp').enable();
            Ext.getCmp('btnAdicionarCau').enable();
            Ext.getCmp('btnAdicionarRec').enable();
            Ext.getCmp('btnAdicionarCon').enable();
            Ext.getCmp('btnAdicionarCosto').enable();
            Ext.getCmp('idbtn2').enable();
            vista.pImplicadoss.idaccidente = objselect.idaccidente;
            vista.pImplicadoss.stImplicados.baseParams.idaccidente = objselect.idaccidente;
            vista.pCausas.idaccidente = objselect.idaccidente;
            vista.pCausas.stCausas.baseParams.idaccidente = objselect.idaccidente;
            vista.pRecomendaciones.idaccidente = objselect.idaccidente;
            vista.pRecomendaciones.stRecomendaciones.baseParams.idaccidente = objselect.idaccidente;
            vista.pCostos.idaccidente = objselect.idaccidente;
            vista.pCostos.stCostos.baseParams.idaccidente = objselect.idaccidente;
            vista.pConclusiones.idaccidente = objselect.idaccidente;
            vista.pConclusiones.stConclusiones.baseParams.idaccidente = objselect.idaccidente;
            if (vista.tabPanel.getActiveTab().id == 'PanelImplicados') {
                vista.pImplicadoss.stImplicados.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'PanelCausas'){
                vista.pCausas.stCausas.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'PanelRecomendaciones'){
                vista.pRecomendaciones.stRecomendaciones.load();
            } else if (vista.tabPanel.getActiveTab().id == 'PanelConclusiones'){
                vista.pConclusiones.stConclusiones.load();
            } else if (vista.tabPanel.getActiveTab().id == 'PanelCostos'){
                vista.pCostos.stCostos.load();
            }
        });

        modelo.stAccidentes.on('load', function () {
            objselect = null;
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
            vista.btnAsociar.disable();
            Ext.getCmp('btnAdicionarImp').disable();
            Ext.getCmp('btnAdicionarCau').disable();
            Ext.getCmp('btnAdicionarRec').disable();
            Ext.getCmp('btnAdicionarCon').disable();
            Ext.getCmp('btnAdicionarCosto').disable();
            Ext.getCmp('btnEliminarRec').disable();
            Ext.getCmp('btnEliminarCon').disable();
            Ext.getCmp('btnEliminarCosto').disable();
            Ext.getCmp('idbtn2').disable();

            if (modelo.stAccidentes.getCount() > 0) {
                vista.gpAccidentes.getSelectionModel().selectFirstRow();
            }
        });

        modelo.stComision.on('load', function () {
            var objcomis = new Array();
            modelo.stComision.each(function(rec){
                if (rec.data.idaccidentecomision != null) {
                    objcomis.push(rec);
                }
            });
            if (objcomis.length > 0) {
                vista.smComision.selectRecords(objcomis);
            }
        });

        vista.tabPanel.on('tabchange', function(){
            if (objselect != null) {
                if (vista.tabPanel.getActiveTab().id == 'PanelImplicados') {
                    vista.pImplicadoss.stImplicados.load({params: {start: 0, limit: 15}});
                } else if (vista.tabPanel.getActiveTab().id == 'PanelCausas'){
                    vista.pCausas.stCausas.load({params: {start: 0, limit: 15}});
                } else if (vista.tabPanel.getActiveTab().id == 'PanelRecomendaciones'){
                    vista.pRecomendaciones.stRecomendaciones.load();
                } else if (vista.tabPanel.getActiveTab().id == 'PanelConclusiones'){
                    vista.pConclusiones.stConclusiones.load();
                } else if (vista.tabPanel.getActiveTab().id == 'PanelCostos'){
                    vista.pCostos.stCostos.load();
                }
            }
            if (vista.tabPanel.getActiveTab().id == 'PanelDatosAccidente'){
                vista.pDatosAccidente.doLayout();
            }
        });

        vista.gpComision.getSelectionModel().on('selectionchange', function () {
            if ( vista.gpComision.getSelectionModel().getSelections().length > 0) {
                vista.btnAceptarCom.enable();
            } else {
                vista.btnAceptarCom.disable();
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
            vista.taLugar.setValue(objselect.lugar);
            vista.cbTipoAccidente.setValue(objselect.idtipoaccidente);
            vista.cbTipoAccidente.setRawValue(objselect.tipoaccidente);
            vista.cbFormaAccidente.setValue(objselect.idformaaccidente);
            vista.cbFormaAccidente.setRawValue(objselect.formaaccidente);
            vista.cbTipoAgente.setValue(objselect.idtipoagente);
            vista.cbTipoAgente.setRawValue(objselect.tipoagente);
            vista.cbAgente.setValue(objselect.idagente);
            vista.cbAgente.setRawValue(objselect.agente);
            vista.dfFecha.setValue(objselect.fecha);
            vista.tfHora.setValue(objselect.hora);
            vista.chbEquiparado.setValue(objselect.equiparado);
            vista.taDescripcion.setValue(objselect.descripcion);
        });

        vista.btnEliminar.on('click', function () {
            eliminar();
        });

        vista.btnAsociar.on('click', function(){
            modelo.stComision.baseParams.idaccidente = objselect.idaccidente;
            modelo.stComision.load();
            vista.btnAceptarCom.disable();
            vista.winAsociarComision.show();
        });

        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');
        });

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL');
        });

        vista.btnCancelarCom.on('click', function(){
            vista.gpComision.getSelectionModel().clearSelections();
            vista.winAsociarComision.hide();
        });

        vista.btnAceptarCom.on('click', function(){
            guardarComision();
        });

        vista.btnCancelar.on('click', function () {
            vista.ventanaGestion.hide();
        });

        Ext.getCmp('idbtn1').on('click', function () {
            if(modelo.stAccidentes.getCount() > 0) {
                var idIframe = Ext.id();
                new Ext.Window({
                    title       : 'Indicadores seleccionados de protecci&oacute;n y seguridad social',
                    width       : 800,
                    height      : 500,
                    id          : 'winregistro',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable : true,
                    constrain   : true,
                    border      : false,
                    modal       : true,
                    items       : {
                        xtype : 'component',
                        autoEl: {
                            tag  : 'iframe',
                            id   : idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src  : document.location.protocol + '//' + document.location.host +
                            '/pvd/sst/accidente/index.php/gestionaraccidentes/generarPdfReporte?idestructura=' + node.id
                        }
                    }
                }).show();
                Ext.getCmp('winregistro').maximize();
                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
                document.getElementById(idIframe).onload = function () {
                    PVD.ocultarMascara('rep01');
                }
            }  else {
                mostrarMensaje(8, 'En la estructura seleccionada no existen accidentes registrados.');
            }
        });

        Ext.getCmp('idbtn2').on('click', function () {
            var idIframe = Ext.id();
            new Ext.Window({
                title       : 'Expediente del accidente',
                width       : 800,
                height      : 500,
                id          : 'winexp',
                maskDisabled: false,
                animCollapse: false,
                maximizable : true,
                constrain   : true,
                border      : false,
                modal       : true,
                items       : {
                    xtype : 'component',
                    autoEl: {
                        tag  : 'iframe',
                        id   : idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src  : document.location.protocol + '//' + document.location.host +
                        '/pvd/sst/accidente/index.php/gestionaraccidentes/generarPdfExpediente?idaccidente=' + objselect.idaccidente
                    }
                }
            }).show();
            Ext.getCmp('winexp').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        });

        vista.cbTipoAgente.on('select', function () {
            vista.cbAgente.enable();
            modelo.stAgente.baseParams.idtipoagente = vista.cbTipoAgente.getValue();
            modelo.stAgente.load();
        });

        vista.ventanaGestion.on('beforeshow', function () {
            if (accion == 'add'){
                vista.cbAgente.disable();
            } else {
                vista.cbAgente.enable();
            }
            modelo.stTiposAcc.load();
            modelo.stFormaAcc.load();
            modelo.stTiposAgente.load();
        });

        function guardarComision()
        {
            if (vista.gpComision.getSelections().length > 0) {
                var comisiones = new Array();
                for(i = 0; i < vista.gpComision.getSelections().length; i++){
                    comisiones.push(vista.gpComision.getSelections()[i].data.idcomision);
                }
                Ext.Ajax.request({
                    url: 'guardarComision',
                    params: {idaccidente:objselect.idaccidente,
                        comisiones: Ext.encode(comisiones)},
                    callback: function (){
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData) {
                            if (comisiones.length == 1) {
                                mostrarMensaje(1, 'La comisi&oacute;n ha sido asociada satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'Las comisiones han sido asociados satisfactoriamente.');
                            }
                        } else {
                            mostrarMensaje(6, 'Ocurri&oacute; un error mientras se guardaban los datos.');
                        }
                        vista.winAsociarComision.hide();
                    }
                });
            } else {
                mostrarMensaje(6, 'Debe seleccionar al menos una comisi&oacute;n');
            }
        }

        function guardarDatos(btnpress) {
            if (vista.formularioGestion.getForm().isValid()) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addAccidente' : 'updateAccidente'),
                    params: {
                        idaccidente: accion == 'add' ? -1 : objselect.idaccidente,
                        idestructura: node.id,
                        lugar: vista.taLugar.getValue(),
                        idtipoaccidente: vista.cbTipoAccidente.getValue(),
                        idformaaccidente: vista.cbFormaAccidente.getValue(),
                        idagente: vista.cbAgente.getValue(),
                        fecha: vista.dfFecha.getRawValue(),
                        hora: vista.tfHora.getValue(),
                        descripcion: vista.taDescripcion.getValue(),
                        equiparado: (vista.chbEquiparado.checked == true) ? 1 : 0
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
                            modelo.stAccidentes.removeAll();
                            modelo.stAccidentes.reload();
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
            var s = vista.gpAccidentes.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idaccidente);
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
                        url: 'deleteAccidentes',
                        params: {accidentes: Ext.encode(ids)},
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
                            modelo.stAccidentes.removeAll();
                            modelo.stAccidentes.reload();
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
                            vista.taLugar.setValue(objselect.lugar);
                            vista.cbTipoAccidente.setValue(objselect.idtipoaccidente);
                            vista.cbTipoAccidente.setRawValue(objselect.tipoaccidente);
                            vista.cbFormaAccidente.setValue(objselect.idformaaccidente);
                            vista.cbFormaAccidente.setRawValue(objselect.formaaccidente);
                            vista.cbTipoAgente.setValue(objselect.idtipoagente);
                            vista.cbTipoAgente.setRawValue(objselect.tipoagente);
                            vista.cbAgente.setValue(objselect.idagente);
                            vista.cbAgente.setRawValue(objselect.agente);
                            vista.dfFecha.setValue(objselect.fecha);
                            vista.tfHora.setValue(objselect.hora);
                            vista.taDescripcion.setValue(objselect.descripcion);
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
                        if (vista.btnCancelarCom.isVisible()) {
                            vista.winAsociarComision.hide();
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
                    guardarDatos('ACP');                }
                if(vista.btnAceptarCom.isVisible()){
                    vista.btnAceptarCom.focus();
                    guardarComision();
                }
            }
        }]);
    }
};
