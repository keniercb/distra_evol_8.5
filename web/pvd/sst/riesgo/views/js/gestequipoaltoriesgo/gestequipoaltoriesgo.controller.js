/*
 * Gestionar equipo de alto riesgo.
 *
 * @author Ing. Yaricel Guerra Velazquez
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestequipoaltoriesgo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Riesgo.Gestequipoaltoriesgo');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Riesgo.Gestequipoaltoriesgo.Controlador = {
    init: function (idioma, vista, modelo) {

        var accion, node, objselect, inspselect, accioninsp, obsselect, accionobs;

        vista.ventanaGestion.on('beforeshow', function () {
            modelo.stClasifEquipo.load();
            modelo.stPais.load();
            vista.tabPanel.enable()
        });
        
        vista.ventanaGestionInsp.on('beforeshow', function () {
            modelo.stTipoInspeccion.load();
            modelo.stResultadoInspeccion.load();
        });

        vista.ventanaGestion.on('hide', function () {
            vista.tabPanel.disable();
        });

        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stEquipoRiesgos.baseParams = {idestructura: node.attributes.id};
            modelo.stEquipoRiesgos.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            vista.btnAdicionar.enable();
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            modelo.stEquipoRiesgos.baseParams.idestructura =  node.attributes.id;
            vista.btnAdicionar.enable();
            modelo.stEquipoRiesgos.removeAll();
            vista.tabPanel.disable();
            modelo.stEquipoRiesgos.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpEquipoRiesgos.getSelectionModel().on('rowselect', function () {
            objselect = vista.gpEquipoRiesgos.getSelectionModel().getSelected().data;            
            modelo.stInspecciones.baseParams.idequipoaltoriesgo = objselect.idequipoaltoriesgo;
            modelo.stObservaciones.baseParams.idequipoaltoriesgo = objselect.idequipoaltoriesgo;
            vista.tabPanel.enable();
            if (vista.tabPanel.getActiveTab().id == 'gpInspecciones') {
                modelo.stInspecciones.load({params: {start: 0, limit: 15}});
            } else {
                modelo.stObservaciones.load({params: {start: 0, limit: 15}});
            }
            vista.btnAdicionarInsp.enable();
            vista.btnAdicionarObs.enable();
            if (vista.gpEquipoRiesgos.getSelectionModel().getSelections().length == 1) {
                vista.btnModificar.enable();
            } else {
                vista.btnModificar.disable();
                modelo.stInspecciones.removeAll();
                modelo.stObservaciones.removeAll();
                vista.tabPanel.disable();
            }
            vista.btnEliminar.enable();
        });

        vista.gpEquipoRiesgos.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpEquipoRiesgos.getSelectionModel().getSelections().length == 0) {
                vista.btnEliminar.disable();
                vista.btnModificar.disable();
            }
            if (vista.gpEquipoRiesgos.getSelectionModel().getSelections().length == 1) {
                vista.btnModificar.enable();
            }
        });

        modelo.stEquipoRiesgos.on('load', function () {
            vista.gpEquipoRiesgos.getSelectionModel().clearSelections();
            vista.sfBuscar.enable();
            vista.btnEliminar.disable();
            vista.btnModificar.disable();
        });
        
        modelo.stInspecciones.on('load', function () {
            vista.btnModificarInsp.disable();
            vista.btnEliminarInsp.disable();
        });
        
        modelo.stObservaciones.on('load', function () {
            vista.btnModificarObs.disable();
            vista.btnEliminarObs.disable();
        });

        modelo.stClasifEquipo.on('load', function () {
            if (accion == 'mod') {
                vista.cbClasifequipo.setValue(objselect.idclasifequipo);
            }
        });

        modelo.stPais.on('load', function () {
            if (accion == 'mod') {
                vista.cbPais.setValue(objselect.idpaisfabricante);
            }
        });

        modelo.stTipoInspeccion.on('load', function () {
            if (accioninsp == 'mod') {
                vista.cbTipoInspeccion.setValue(inspselect.idtipoinspeccion);
                vista.cbResultInspeccion.setValue(inspselect.idresultadoinspeccion);
            }
        });
        
        vista.tabPanel.on('tabchange', function(){
            if (vista.tabPanel.getActiveTab().id == 'gpInspecciones') {
                modelo.stInspecciones.load({params: {start: 0, limit: 15}});
            } else {
                modelo.stObservaciones.load({params: {start: 0, limit: 15}});
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
            vista.ventanaGestion.show();
            vista.btnAplicar.hide();
            vista.ventanaGestion.setTitle(idioma.msgMod);
            vista.tfDenominacionEq.setValue(objselect.denominacion);
            vista.tfNoInventario.setValue(objselect.inventario);
            vista.tfModelo.setValue(objselect.modelo);
            vista.nfAnno.setValue(objselect.annofabricacion);
            vista.tfSerie.setValue(objselect.serie);
            vista.nfPresioncalculo.setValue(objselect.presioncalculo);
            vista.nfPresionautorizada.setValue(objselect.presionautorizada);
            vista.nfCapcalculo.setValue(objselect.capacidadcalculo);
            vista.nfCapautorizada.setValue(objselect.capacidadautorizada);
            vista.taUbicacion.setValue(objselect.ubicacion);
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
        
        vista.gpInspecciones.getSelectionModel().on('rowselect', function () {
            inspselect = vista.gpInspecciones.getSelectionModel().getSelected().data;
            if (vista.gpInspecciones.getSelectionModel().getSelections().length == 1) {
                vista.btnModificarInsp.enable();               
            } else {
                vista.btnModificarInsp.disable();
            }
            vista.btnEliminarInsp.enable();
        });
        
        vista.gpObservaciones.getSelectionModel().on('rowselect', function () {
            obsselect = vista.gpObservaciones.getSelectionModel().getSelected().data;
            if (vista.gpObservaciones.getSelectionModel().getSelections().length == 1) {
                vista.btnModificarObs.enable();               
            } else {
                vista.btnModificarObs.disable();
            }
            vista.btnEliminarObs.enable();
        });
        
        vista.gpInspecciones.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpInspecciones.getSelectionModel().getSelections().length == 0) {
                vista.btnEliminarInsp.disable();
                vista.btnModificarInsp.disable();
            }
            if (vista.gpInspecciones.getSelectionModel().getSelections().length == 1) {
                vista.btnModificarInsp.enable();
            }
        });
        
        vista.gpObservaciones.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpObservaciones.getSelectionModel().getSelections().length == 0) {
                vista.btnEliminarObs.disable();
                vista.btnModificarObs.disable();
            }
            if (vista.gpObservaciones.getSelectionModel().getSelections().length == 1) {
                vista.btnModificarObs.enable();
            }
        });
        
        vista.btnAdicionarInsp.on('click', function () {
            accioninsp = 'add';
            vista.ventanaGestionInsp.show();
            vista.btnAplicarInsp.show();
            vista.ventanaGestionInsp.setTitle('Adicionar inspección técnica');
            vista.formularioGestionInsp.getForm().reset();
        });
        
        vista.btnAdicionarObs.on('click', function () {
            accionobs = 'add';
            vista.ventanaGestionObs.show();
            vista.btnAplicarObs.show();
            vista.ventanaGestionObs.setTitle('Adicionar observación');
            vista.formularioGestionObs.getForm().reset();
        });

        vista.btnModificarInsp.on('click', function () {
            accioninsp = 'mod';
            vista.ventanaGestionInsp.show();
            vista.btnAplicarInsp.hide();
            vista.ventanaGestionInsp.setTitle('Modificar inspección técnica');
            var obj = vista.gpInspecciones.getSelectionModel().getSelected().data;
            vista.dfFechaPlanificada.setValue(obj.fplan);
            vista.dfFechaInspeccion.setValue(obj.finspeccion);
        });
        
        vista.btnModificarObs.on('click', function () {
            accionobs = 'mod';
            vista.ventanaGestionObs.show();
            vista.btnAplicarObs.hide();
            vista.ventanaGestionObs.setTitle('Modificar observación');
            vista.taObs.setValue(obsselect.observacion);
        });
        
        vista.btnEliminarInsp.on('click', function () {
            eliminarInsp();
        });
        
        vista.btnEliminarObs.on('click', function () {
            eliminarObs();
        });
        
        vista.btnAceptarInsp.on('click', function () {
            guardarDatosInsp('ACP');
        });

        vista.btnAplicarInsp.on('click', function () {
            guardarDatosInsp('APL');
        });

        vista.btnAceptarObs.on('click', function () {
            guardarDatosObs('ACP');
        });
        
        vista.btnAplicarObs.on('click', function () {
            guardarDatosObs('APL');
        });

        vista.btnCancelarInsp.on('click', function () {
            vista.ventanaGestionInsp.hide();
        });
        
        vista.btnCancelarObs.on('click', function () {
            vista.ventanaGestionObs.hide();
        });

        function guardarDatos(btnpress)
        {
            if(vista.formularioGestion.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addEquipoaltoriesgo' : 'modEquipoaltoriesgo'),
                    params: {
                        idequipoaltoriesgo: accion == 'add' ? -1 : objselect.idequipoaltoriesgo,
                        idclasifequipo: vista.cbClasifequipo.getValue(),
                        denominacion: vista.tfDenominacionEq.getValue(),
                        inventario: vista.tfNoInventario.getValue(),
                        modelo: vista.tfModelo.getValue(),
                        serie: vista.tfSerie.getValue(),
                        idpaisfabricante: vista.cbPais.getValue(),
                        annofabricacion: vista.nfAnno.getValue(),
                        presioncalculo: vista.nfPresioncalculo.getValue(),
                        presionautorizada: vista.nfPresionautorizada.getValue(),
                        capacidadcalculo: vista.nfCapcalculo.getValue(),
                        capacidadautorizada: vista.nfCapautorizada.getValue(),
                        ubicacion: vista.taUbicacion.getValue(),
                        idestructura: node.id
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
                            modelo.stEquipoRiesgos.removeAll();
                            modelo.stEquipoRiesgos.reload();
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
            var s = vista.gpEquipoRiesgos.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idequipoaltoriesgo);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el equipo seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los equipos seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'delEquipoaltoriesgo',
                        params: {idequipoaltoriesgo: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El equipo seleccionado no puede ser eliminado debido a que se' +
                                        ' encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los equipos seleccionados no puede ser eliminado debido a' +
                                        ' que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El equipo ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los equipos han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stEquipoRiesgos.removeAll();
                            modelo.stEquipoRiesgos.reload();
                        }
                    });
                }
            });
        }
        
        function guardarDatosInsp(btnpress)
        {
            if(vista.formularioGestionInsp.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accioninsp == 'add' ? 'addInspeccion' : 'modInspeccion'),
                    params: {
                        idinspeccionequipo: accioninsp == 'add' ? -1 : inspselect.idinspeccionequipo,
                        idequipoaltoriesgo: objselect.idequipoaltoriesgo,
                        idtipoinspeccion: vista.cbTipoInspeccion.getValue(),
                        idresultadoinspeccion: vista.cbResultInspeccion.getValue(),
                        fplan: vista.dfFechaPlanificada.getRawValue(),
                        finspeccion: vista.dfFechaInspeccion.getRawValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accioninsp == 'mod')
                            {
                                mostrarMensaje(1, 'La inspección ha sido modificada satisfactoriamente.');
                            }else{
                                mostrarMensaje(1, 'La inspección ha sido adicionada satisfactoriamente.');
                            }
                            if (btnpress == 'ACP')
                            {
                                vista.ventanaGestionInsp.hide();
                            }
                            vista.formularioGestionInsp.getForm().reset();
                            modelo.stInspecciones.removeAll();
                            modelo.stInspecciones.reload();
                        } else {
                            mostrarMensaje(6,'La inspección que desea adicionar ya existe');
                        }
                    }
                });
            }
        }
        
        function eliminarInsp()
        {
            var ids = new Array();
            var s = vista.gpInspecciones.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idinspeccionequipo);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la inspección seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las inspecciones seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteInspeccion',
                        params: {inspecciones: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La inspección seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las inspecciones seleccionadas no puede ser eliminada debido' +
                                        ' a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La inspección ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las inspeccciones han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stInspecciones.removeAll();
                            modelo.stInspecciones.reload();
                        }
                    });
                }
            });
        }
        
        function guardarDatosObs(btnpress)
        {
            if(vista.formularioGestionObs.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accionobs == 'add' ? 'addObservacion' : 'modObservacion'),
                    params: {
                        idobservacionequipo: accionobs == 'add' ? -1 : obsselect.idobservacionequipo,
                        idequipoaltoriesgo: objselect.idequipoaltoriesgo,
                        observacion: vista.taObs.getValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accionobs == 'mod')
                            {
                                mostrarMensaje(1, 'La observación ha sido modificada satisfactoriamente.');
                            }else{
                                mostrarMensaje(1, 'La observación ha sido adicionada satisfactoriamente.');
                            }
                            if (btnpress == 'ACP')
                            {
                                vista.ventanaGestionObs.hide();
                            }
                            vista.formularioGestionObs.getForm().reset();
                            modelo.stObservaciones.removeAll();
                            modelo.stObservaciones.reload();
                        } else {
                            mostrarMensaje(6,'La observación que desea adicionar ya existe');
                        }
                    }
                });
            }
        }
        
        function eliminarObs()
        {
            var ids = new Array();
            var s = vista.gpObservaciones.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idobservacionequipo);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la observación seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las observaciones seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteObservacion',
                        params: {observaciones: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La observación seleccionada no puede ser eliminada debido a que se' +
                                        ' encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las observaciones seleccionadas no puede ser eliminada' +
                                        ' debido a' +
                                        ' que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La observación ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las observaciones han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stObservaciones.removeAll();
                            modelo.stObservaciones.reload();
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
                        if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpInspecciones'){
                            accioninsp = 'add';
                            vista.ventanaGestionInsp.show();
                            vista.btnAplicarInsp.show();
                            vista.ventanaGestionInsp.setTitle('Adicionar inspección técnica');
                            vista.formularioGestionInsp.getForm().reset();
                        } else if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'btnAdicionarObs'){
                            accionobs = 'add';
                            vista.ventanaGestionObs.show();
                            vista.btnAplicarObs.show();
                            vista.ventanaGestionObs.setTitle('Adicionar observación');
                            vista.formularioGestionObs.getForm().reset();
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
                        if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpInspecciones'){
                            if (!vista.btnModificarInsp.disabled) {
                                accioninsp = 'mod';
                                vista.ventanaGestionInsp.show();
                                vista.btnAplicarInsp.hide();
                                vista.ventanaGestionInsp.setTitle('Modificar inspección técnica');
                                var obj = vista.gpInspecciones.getSelectionModel().getSelected().data;
                                vista.dfFechaPlanificada.setValue(obj.fplan);
                                vista.dfFechaInspeccion.setValue(obj.finspeccion);
                            }
                        } else if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpObservaciones'){
                            if (!vista.btnModificarObs.disabled) {
                                accionobs = 'mod';
                                vista.ventanaGestionObs.show();
                                vista.btnAplicarObs.hide();
                                vista.ventanaGestionObs.setTitle('Modificar observación');
                                vista.taObs.setValue(obsselect.observacion);
                            }
                        } else if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.hide();
                            vista.ventanaGestion.setTitle(idioma.msgMod);
                            vista.tfDenominacionEq.setValue(objselect.denominacion);
                            vista.tfNoInventario.setValue(objselect.inventario);
                            vista.tfModelo.setValue(objselect.modelo);
                            vista.nfAnno.setValue(objselect.annofabricacion);
                            vista.tfSerie.setValue(objselect.serie);
                            vista.nfPresioncalculo.setValue(objselect.presioncalculo);
                            vista.nfPresionautorizada.setValue(objselect.presionautorizada);
                            vista.nfCapcalculo.setValue(objselect.capacidadcalculo);
                            vista.nfCapautorizada.setValue(objselect.capacidadautorizada);
                            vista.taUbicacion.setValue(objselect.ubicacion);
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
                        if (vista.btnCancelarInsp.isVisible()) {
                            vista.ventanaGestionInsp.hide();
                        } if (vista.btnCancelarObs.isVisible()) {
                            vista.ventanaGestionObs.hide();
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
                if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpInspecciones' && !vista.btnEliminarInsp.disabled){
                    eliminarInsp();
                } else if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpObservaciones' && !vista.btnEliminarObs.disabled){
                    eliminarObs();
                } else if(!vista.btnEliminar.disabled){
                    eliminar();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptarMed.isVisible()){
                    vista.btnAceptarMed.focus();
                    guardarDatosInsp('ACP');
                } else if(vista.btnAceptarRec.isVisible()){
                    vista.btnAceptarRec.focus();
                    guardarDatosObs('ACP');
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
                    guardarDatosInsp('APL');
                } else if(vista.btnAplicarRec.isVisible()){
                    guardarDatosObs('APL');
                } else if(vista.btnAplicar.isVisible()){
                    guardarDatos('APL');
                }
            }
        }]);
    }
};
