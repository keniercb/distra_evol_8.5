/*
 * Gestionar accion de capacitacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionaraccion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Gestionaraccion');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Capacitacion.Gestionaraccion.Controlador = {
    init: function (idioma, vista, modelo) {
        var ejecaccion = 1;
        var accion, accioncurso, accionind, node, objselect, objcurso, iscomp;
        vista.tabPanel.hideTabStripItem(vista.gpCursos);
        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stAcciones.baseParams.idcargo = '';
            modelo.stAcciones.baseParams = {idestructura: node.attributes.id};
            modelo.stAcciones.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == 7) {
                modelo.stAcciones.baseParams.idcargo = node.attributes.id;
            } else {
                modelo.stAcciones.baseParams.idestructura =  node.attributes.id;
            }
            modelo.stAccionNecesidades.baseParams.idestructura = node.attributes.id;
            modelo.stAcciones.removeAll();
            modelo.stParticipantes.removeAll();
            vista.tabPanel.disable();
            modelo.stAcciones.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpAcciones.getSelectionModel().on('rowselect', function () {
            objselect = vista.gpAcciones.getSelectionModel().getSelected().data;
            modelo.stParticipantes.baseParams.idaccion = objselect.idaccion;
            modelo.stCursos.baseParams.idaccion = objselect.idaccion;
            modelo.stAseguramientos.baseParams.idaccion = objselect.idaccion;
            modelo.stCursos.removeAll();
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            if (objselect.estado == 2) {
                vista.btnAdicionarCurso.disable();
            } else {
                vista.btnAdicionarCurso.enable();
            }
            vista.tabPanel.enable();
            Ext.getCmp('idrepind').enable();
            var tact = vista.tabPanel.getActiveTab().id;
            var edit = vista.tabPanel.getComponent('gpCursos');
            if (objselect.curso == 1) {
                edit.setVisible(true);
                vista.tabPanel.unhideTabStripItem(vista.gpCursos);
                tact = 'gpCursos';
                vista.tabPanel.setActiveTab('gpParticipantes');
            } else {
                edit.setVisible(false);
                vista.tabPanel.hideTabStripItem(vista.gpCursos);
                vista.tabPanel.setActiveTab('gpParticipantes');
                vista.btnEjecutar.enable();
            }
            if (vista.tabPanel.getActiveTab().id == 'gpParticipantes' && tact == 'gpParticipantes') {
                modelo.stParticipantes.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpCursos'){
                modelo.stCursos.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpAseguramientos'){
                modelo.stAseguramientos.load({params: {start: 0, limit: 15}});
            }
            vista.dfFInicioC.setMinValue(objselect.fdesde);
            vista.dfFInicioC.setMaxValue(objselect.fhasta);
            vista.dfFFinC.setMinValue(objselect.fdesde);
            vista.dfFFinC.setMaxValue(objselect.fhasta);
        });

        vista.gpParticipantes.getSelectionModel().on('rowselect', function () {
            vista.btnEliminarParticip.enable();
            vista.btnResultados.enable();
            vista.btnEvaluar.enable();
            if (objselect.estado == 2) {
                vista.btnResultados.enable();
            } else {
                vista.btnResultados.disable();
            }
            if (vista.gpParticipantes.getSelectionModel().getSelected().get('terminado') == 1) {
                vista.btnEvaluar.enable();
            } else {
                vista.btnEvaluar.disable();
            }
        });

        vista.gpIndicadoresPart.getSelectionModel().on('rowselect', function () {
            vista.btnModificarInd.enable();
            vista.btnEliminarInd.enable();
        });

        vista.gpCursos.getSelectionModel().on('rowselect', function () {
            objcurso = vista.gpCursos.getSelectionModel().getSelected().data;
            vista.btnModificarCurso.enable();
            vista.btnEliminarCurso.enable();
            vista.btnEjecutarC.enable();
        });

        vista.gpAseguramientos.getSelectionModel().on('selectionchange', function () {
            vista.btnGuardar.enable();
        });

        vista.smselectPer.on('rowselect', function (p, numrow, per) {
            iscomp = false;
            comprobar(numrow, per);
        });

        vista.gpPersonas.on('rowclick', function (g, numrow, c) {
            var paux= g.getSelectionModel().getSelected();
            if (iscomp == false) {
                comprobar(numrow, paux);
            }
        });

        modelo.stParticipantes.on('load', function () {
            vista.btnEliminarParticip.disable();
            vista.btnResultados.disable();
            vista.btnEvaluar.disable();
            var alerta = false;
            modelo.stParticipantes.each(function (rec) {
                    if (rec.data.alerta == 1) {
                        alerta = true;
                    }
                }
            );
            if (alerta == true) {
                mostrarMensaje(8, 'Debe realizar la evaluaci&oacute;n de impacto a los participantes señalados.');
            }
        });

        modelo.stAseguramientos.on('load', function () {
            vista.btnGuardar.disable();
            var objrecaseg = new Array();
            modelo.stAseguramientos.each(function(rec){
                if (rec.data.idaccionaseguramiento != null) {
                    objrecaseg.push(rec);
                }
            });
            if (objrecaseg.length > 0) {
                vista.smselectAseg.selectRecords(objrecaseg);
            }
        });

        modelo.stAccionNecesidades.on('load', function () {
            var objrecnec = new Array();
            modelo.stAccionNecesidades.each(function(rec){
                if (accion == 'mod' && rec.data.idaccionnecesidad) {
                    objrecnec.push(rec);
                }
            });
            if (objrecnec.length > 0) {
                vista.smselectAccNec.selectRecords(objrecnec);
            }
        });

        modelo.stNecesidadesVencidas.on('load', function () {
            var objrecnecv = new Array();
            modelo.stNecesidadesVencidas.each(function(rec){
                if (rec.data.fvencida) {
                    objrecnecv.push(rec);
                }
            });
            if (objrecnecv.length > 0) {
                vista.smselectNecVen.selectRecords(objrecnecv);
            }
        });

        modelo.stAcciones.on('load', function () {
            vista.btnEliminar.disable();
            vista.btnModificar.disable();
            vista.btnEjecutar.disable();
            vista.sfBuscar.enable();
            Ext.getCmp('idrepind').disable();
            modelo.stParticipantes.removeAll();
        });

        modelo.stCursos.on('load', function (st) {
            vista.btnEliminarCurso.disable();
            vista.btnModificarCurso.disable();
            vista.btnEjecutarC.disable();
            var cursosinterm = false;
            st.each(function(rec){
                if (rec.data.estado != 2) {
                    cursosinterm = true;
                }
            });
            if (cursosinterm == true) {
                vista.btnEjecutar.disable();
            } else {
                vista.btnEjecutar.enable();
            }
        });

        modelo.stCategorias.on('load', function(){
            var cant = modelo.stCategorias.getCount();
            if (accion == 'mod') {
                var recCat = modelo.stCategorias.getRange();
                var cat = objselect.idscategorias;
                Ext.each(recCat, function (rec)
                {
                    if (cat.indexOf(rec.id) > -1) {
                        var index = modelo.stCategorias.indexOf(rec);
                        vista.cbCategorias.onSelect(rec, index);
                    }
                }, this);
            }
        });

        modelo.stIndPartic.on('load', function(){
            vista.btnEliminarInd.disable();
            vista.btnModificarInd.disable();
        });

        vista.tabPanel.on('tabchange', function(){
            if (vista.tabPanel.getActiveTab().id == 'gpParticipantes') {
                modelo.stParticipantes.load({params: {start: 0, limit: 15}});
            } else if (vista.tabPanel.getActiveTab().id == 'gpCursos'){
                modelo.stCursos.load();
            } else if (vista.tabPanel.getActiveTab().id == 'gpAseguramientos'){
                modelo.stAseguramientos.load();
            }
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            vista.ventanaGestion.show();
            vista.btnAplicar.show();
            vista.ventanaGestion.setTitle(idioma.msgAddA);
            vista.formularioGestion.getForm().reset();
            modelo.stAccionNecesidades.removeAll();
            modelo.stAccionNecesidades.load();
        });

        vista.btnAdicionarParticip.on('click', function () {
            vista.windPersonas.show();
            vista.sfBuscarPer.reset();
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscarPer.getValue()}});
        });

        modelo.stPersonas.on('beforeload', function(st){
            modelo.stPersonas.removeAll();
            modelo.stPersonas.baseParams.idaccion = objselect.idaccion;
            var cargartodo = (vista.chbMostrarTodas.checked == true)?1:0;
            st.baseParams.cargartodo = cargartodo;
            if (vista.chbMostrarTodas.checked == true) {
                modelo.stPersonas.baseParams.idestructura = null;
            } else {
                modelo.stPersonas.baseParams.idestructura = node.id;
            }
        });

        vista.chbMostrarTodas.on('check', function(){
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscarPer.getValue()}});
        });

        vista.btnAdicionarCurso.on('click', function () {
            accioncurso = 'add';
            vista.ventanaGestionCurso.show();
            vista.ventanaGestionCurso.setTitle(idioma.msgAddCurso);
            vista.btnAplicarCurso.show();
            vista.formularioGestionCurso.getForm().reset();
        });

        vista.btnAdicionarInd.on('click', function () {
            accionind = 'add';
            vista.windAddInd.show();
            vista.windAddInd.setTitle('Adicionar indicador');
            vista.btnAplicarInd.show();
            vista.formAddInd.getForm().reset();
        });

        vista.btnGuardar.on('click', function () {
            guardarAseguramientos();
        });

        vista.btnGuardarNecVen.on('click', function () {
            guardarNecVencidas();
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            vista.ventanaGestion.show();
            vista.btnAplicar.hide();
            vista.ventanaGestion.setTitle(idioma.msgModA);
            vista.tfdenom.setValue(objselect.denominacion);
            vista.cbModoFormacion.setValue(objselect.idmodoformacion);
            vista.cbModoFormacion.setRawValue(objselect.modoformacion);
            vista.dfFInicioA.setValue(objselect.fdesde);
            vista.dfFFinA.setValue(objselect.fhasta);
            vista.nfDuracion.setValue(objselect.duracion);
            vista.tfLugar.setValue(objselect.lugar);
            vista.chbEspCurso.setValue(objselect.curso);
            modelo.stAccionNecesidades.removeAll();
            modelo.stAccionNecesidades.load({params:{idaccion: objselect.idaccion}});
        });

        vista.btnModificarCurso.on('click', function () {
            accioncurso = 'mod';
            vista.ventanaGestionCurso.show();
            vista.btnAplicarCurso.hide();
            vista.ventanaGestion.setTitle(idioma.msgUPDCurso);
            vista.cbCurso.setValue(objcurso.idcurso);
            vista.cbCurso.setRawValue(objcurso.denominacion);
            vista.taDescripcionCur.setValue(objcurso.descripcion);
            vista.dfFInicioC.setRawValue(objcurso.fdesde);
            vista.dfFFinC.setRawValue(objcurso.fhasta);
            vista.tfProfesor.setValue(objcurso.profesor);
        });

        vista.btnModificarInd.on('click', function () {
            var indsel = vista.gpIndicadoresPart.getSelectionModel().getSelected().data;
            accionind = 'mod';
            vista.windAddInd.show();
            vista.btnAplicarInd.hide();
            vista.windAddInd.setTitle('Modificar indicador');
            vista.cbPeriodo.setValue(indsel.idperiodo);
            vista.cbPeriodo.setRawValue(indsel.periodo);
            vista.cbIndicador.setValue(indsel.idindicador);
            vista.cbIndicador.setRawValue(indsel.indicador);
            vista.cbEvaluacion.setValue(indsel.idvalor);
            vista.cbEvaluacion.setRawValue(indsel.valor);
            vista.dfFechaEval.setRawValue(indsel.fecha);
            vista.taObservacionInd.setValue(indsel.complemento);
        });

        vista.btnEliminarInd.on('click', function () {
            eliminarInd();
        });

        vista.btnEliminarParticip.on('click', function () {
            eliminarParticipante()
        });

        vista.btnEliminar.on('click', function () {
            eliminar();
        });

        vista.btnEliminarCurso.on('click', function () {
            eliminarCurso();
        });

        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');
        });

        vista.btnAceptarPart.on('click', function () {
            addParticipante();
        });

        vista.btnAceptarCurso.on('click', function () {
            guardarCurso('ACP');
        });

        vista.btnAceptarEv.on('click', function () {
            guardarResultado();
        });

        vista.btnAceptarEjec.on('click', function () {
            if (ejecaccion == 1) {
                ejecutar();
            } else {
                ejecutar(objcurso.idaccioncurso);
            }
        });

        vista.btnAceptarPlan.on('click', function () {
            exportarPlanCapacit();
        });

        vista.btnAceptarInd.on('click', function () {
            guardarIndicador('ACP');
        });

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL');
        });

        vista.btnAplicarInd.on('click', function () {
            guardarIndicador('APL');
        });

        vista.btnAplicarCurso.on('click', function () {
            guardarCurso('APL');
        });

        vista.btnCancelar.on('click', function () {
            vista.ventanaGestion.hide();
        });

        vista.btnCancelarPart.on('click', function () {
            vista.windPersonas.hide();
        });

        vista.btnCancelarCurso.on('click', function () {
            vista.ventanaGestionCurso.hide();
        });

        vista.btnCancelarEv.on('click', function () {
            vista.windResultados.hide();
        });

        vista.btnCancelarEjec.on('click', function () {
            vista.windEjec.hide();
        });

        vista.btnCancelarPlan.on('click', function () {
            vista.windFechasPlan.hide();
        });

        vista.btnCancelarEI.on('click', function () {
            vista.windEvaluar.hide();
            modelo.stParticipantes.reload();
        });

        vista.btnCancelarInd.on('click', function () {
            vista.windAddInd.hide();
        });

        vista.btnResultados.on('click', function () {
            vista.windResultados.show();
            var s = vista.gpParticipantes.getSelectionModel().getSelected().data;
            vista.taObservacion.setValue(s.observacion);
            vista.chbTerminado.setValue(s.terminado);
            vista.tfResultado.setValue(s.resultado);
        });

        vista.btnEvaluar.on('click', function () {
            vista.windEvaluar.show();
            var s = vista.gpParticipantes.getSelectionModel().getSelected().data;
            modelo.stIndPartic.load({params: {
                idaccionparticipante: s.idaccionparticipante
            }});
            modelo.stNecesidadesVencidas.load({params: {
                idpersona: s.idpersona,
                idaccion: objselect.idaccion
            }});
        });

        vista.btnEjecutar.on('click', function () {
            ejecaccion = 1;
            vista.windEjec.show();
            vista.windEjec.setHeight(240);
            Ext.getCmp('colObservaciones').show();
            vista.windEjec.setTitle('Ejecutar acci&oacute;n de capacitaci&oacute;n');
            vista.dfDesde.setRawValue(objselect.frdesde);
            vista.dHasta.setRawValue(objselect.frhasta);
            vista.taObservacionEjec.setValue(objselect.observaciones);
            vista.dfDesde.setMinValue('01/01/1900');
            vista.dHasta.setMinValue('01/01/1900');
        });

        vista.btnEjecutarC.on('click', function () {
            ejecaccion = 2;
            vista.windEjec.show();
            vista.windEjec.setHeight(130);
            Ext.getCmp('colObservaciones').hide();
            vista.windEjec.setTitle('Ejecutar curso de capacitaci&oacute;n');
            vista.dfDesde.setRawValue(objcurso.frdesde);
            vista.dHasta.setRawValue(objcurso.frhasta);
            vista.taObservacionEjec.reset();
            vista.dfDesde.setMinValue(objselect.frdesde);
            vista.dHasta.setMinValue(objselect.frdesde);
        });

        vista.btnExportar.on('click', function () {
            vista.windFechasPlan.show();
        });

        vista.btnExportarEval.on('click', function () {
            exportarEval();
        });

        vista.ventanaGestion.on('beforeshow', function () {
            vista.tbaddAccion.setActiveTab('formularioGestion');
            Ext.getCmp('idrepind').enable();
            modelo.stModoFormacion.load();
            modelo.stTipoAccion.load();
            modelo.stCategorias.load();
        });

        vista.windAddInd.on('beforeshow', function () {
            vista.cbEvaluacion.disable();
            modelo.stPeriodos.load();
            modelo.stIndicadores.load();
        });

        vista.cbIndicador.on('select', function () {
            vista.cbEvaluacion.enable();
            vista.cbEvaluacion.reset();
            var ind = modelo.stIndicadores.getById(vista.cbIndicador.getValue());
            modelo.stValores.baseParams.idescala = ind.data.idescala;
            modelo.stValores.load();
        });

        vista.ventanaGestion.on('hide', function () {
            if (objselect == null) {
                Ext.getCmp('idrepind').disable();
            }
        });

        vista.ventanaGestionCurso.on('beforeshow', function () {
            modelo.stCursosNom.load();
        });

        vista.windResultados.on('beforeshow', function () {
            if (objselect.curso == 1) {
                modelo.stCursosEval.removeAll();
                modelo.stCursosEval.load({params:{
                    idaccion: objselect.idaccion,
                    idaccionparticipante: vista.gpParticipantes.getSelectionModel().getSelected().get('idaccionparticipante')}
                });
                Ext.getCmp('fsCursos').show();
                vista.windResultados.setHeight(280);
            } else {
                Ext.getCmp('fsCursos').hide();
                vista.windResultados.setHeight(250);
            }
        });

        modelo.stCursosEval.on('load', function () {
            var result = false;
            modelo.stCursosEval.each(function(recs){
                if (recs.data.resultadocurso > 0) {
                    result = true;
                }
            });
            if (result == true) {
                vista.fsCursos.expand();
            } else {
                vista.fsCursos.collapse();
            }
        });

        vista.windResultados.on('hide', function () {
            vista.fsCursos.collapse();
        });

        vista.windFechasPlan.on('hide', function () {
            vista.dfDesdePlan.reset();
            vista.dHastaPlan.reset();
        });

        vista.fsCursos.on('expand', function () {
            vista.windResultados.setHeight(490);
        });

        vista.fsCursos.on('collapse', function () {
            vista.windResultados.setHeight(280);
        });

        function guardarDatos(btnpress)
        {
            var necesidades = new Array();
            var s = vista.gpAccionNecesidades.getSelectionModel().getSelections();
            if (s.length > 0) {
                for(i = 0; i < s.length; i++) {
                    necesidades.push(s[i].data.idnecesidad);
                }
                if(vista.formularioGestion.getForm().isValid()){
                    Ext.getBody().mask('Guardando datos...');
                    Ext.Ajax.request({
                        url: (accion == 'add' ? 'addAccion' : 'updateAccion'),
                        params: {
                            idaccion: accion == 'add' ? -1 : objselect.idaccion,
                            denominacion: vista.tfdenom.getValue(),
                            idmodoformacion: vista.cbModoFormacion.getValue(),
                            fdesde: vista.dfFInicioA.getRawValue(),
                            fhasta: vista.dfFFinA.getRawValue(),
                            duracion: vista.nfDuracion.getValue(),
                            lugar: vista.tfLugar.getValue(),
                            idestructura: node.id,
                            curso: (vista.chbEspCurso.getValue() == true)?1:0,
                            categorias: vista.cbCategorias.getValue(),
                            necesidades: Ext.encode(necesidades)
                        },
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData != false) {
                                if(accion == 'mod')
                                {
                                    mostrarMensaje(1, idioma.msgModASucces);
                                }else{
                                    mostrarMensaje(1, idioma.msgAddASucces);
                                }
                                if (btnpress == 'ACP')
                                {
                                    vista.ventanaGestion.hide();
                                }
                                vista.formularioGestion.getForm().reset();
                                modelo.stAcciones.removeAll();
                                modelo.stAcciones.reload();
                            } else {
                                mostrarMensaje(6,idioma.msgAExistem);
                            }
                        }
                    });
                }
            } else {
                mostrarMensaje(6, 'Debe seleccionar al menos una necesidad de capacitaci&oacute;n.');
            }
        }

        function addParticipante()
        {
            var ids = new Array();
            var s = vista.gpPersonas.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idpersona);
            }
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: 'addParticipante',
                params: {
                    idaccion: objselect.idaccion,
                    personas: Ext.encode(ids)
                },
                callback: function (){
                    Ext.getBody().unmask();
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'Los datos fueron guardados satisfactoramente.');
                        vista.windPersonas.hide();
                        modelo.stParticipantes.removeAll();
                        modelo.stParticipantes.reload();
                    } else {
                        //mostrarMensaje(6,idioma.msgAExistem);
                    }
                }
            });
        }

        function guardarResultado()
        {
            var ids = new Array();
            var cur = modelo.stCursosEval.getRange();
            Ext.each(cur, function (recs) {
                ids.push(recs.data);
            });
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: 'guardarResultado',
                params: {
                    idaccionparticipante: vista.gpParticipantes.getSelectionModel().getSelected().data.idaccionparticipante,
                    observacion: vista.taObservacion.getValue(),
                    terminado: (vista.chbTerminado.getValue() == true)?1:0,
                    resultado: vista.tfResultado.getValue(),
                    cursos: Ext.encode(ids)
                },
                callback: function (){
                    Ext.getBody().unmask();
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'Los datos fueron guardados satisfactoramente.');
                        vista.windResultados.hide();
                        modelo.stParticipantes.removeAll();
                        modelo.stParticipantes.reload();
                    }
                }
            });
        }

        function guardarIndicador(btnpress)
        {
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: (accionind == 'add')?'addEvalImpacto':'updateEvalImpacto',
                params: {
                    idevalimpacto: (accionind == 'add')?-1:vista.gpIndicadoresPart.getSelectionModel().getSelected().id,
                    idaccionparticipante: vista.gpParticipantes.getSelectionModel().getSelected().data.idaccionparticipante,
                    idperiodo: vista.cbPeriodo.getValue(),
                    idindicador: vista.cbIndicador.getValue(),
                    idvalorescala: vista.cbEvaluacion.getValue(),
                    fecha: vista.dfFechaEval.getRawValue(),
                    complemento: vista.taObservacionInd.getValue()
                },
                callback: function (){
                    Ext.getBody().unmask();
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'Los datos fueron guardados satisfactoramente.');
                        if (btnpress == 'ACP')
                        {
                            vista.windAddInd.hide();
                        }
                        modelo.stIndPartic.removeAll();
                        modelo.stIndPartic.reload();
                        vista.formAddInd.getForm().reset();
                    } else {
                        mostrarMensaje(6, 'El indicador ya se encuentra evaluado en dicho periodo.');
                    }
                }
            });
        }

        function ejecutar(idaccioncurso)
        {
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: 'actualizarfechas',
                params: {
                    idaccion: objselect.idaccion,
                    idcurso: idaccioncurso,
                    frdesde: vista.dfDesde.getRawValue(),
                    frhasta: vista.dHasta.getRawValue(),
                    observacion: vista.taObservacionEjec.getValue(),
                    accion: ejecaccion,
                    updaccion: (ejecaccion == 2 && objselect.frdesde == null && objselect.frhasta == null)?1:0
                },
                callback: function (){
                    Ext.getBody().unmask();
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'Los datos fueron guardados satisfactoramente.');
                        vista.windEjec.hide();
                        if (ejecaccion == 1 || (ejecaccion == 2 && objselect.frdesde == null && objselect.frhasta == null)) {
                            modelo.stAcciones.removeAll();
                            modelo.stAcciones.reload();
                        } else {
                            modelo.stCursos.removeAll();
                            modelo.stCursos.reload();
                        }
                    }
                }
            });
        }

        function guardarAseguramientos()
        {
            var ids = new Array();
            var s = vista.gpAseguramientos.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idaseguramiento);
            }
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: 'guardarAseguramiento',
                params: {
                    idaccion: objselect.idaccion,
                    aseguramientos: Ext.encode(ids)
                },
                callback: function (){
                    Ext.getBody().unmask();
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'Los datos fueron guardados satisfactoramente.');
                        modelo.stAseguramientos.removeAll();
                        modelo.stAseguramientos.reload();
                    } else {
                        //mostrarMensaje(6,idioma.msgAExistem);
                    }
                }
            });
        }

        function guardarNecVencidas()
        {
            var ids = new Array();
            var s = vista.gpNecesidadesVen.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.iddnecesidad);
            }
            var idsquitar = new Array();
            modelo.stNecesidadesVencidas.each(function(rec){
                var esta = false;
                Ext.each(ids, function(id) {
                    if (id == rec.data.iddnecesidad) {
                        esta = true;
                    }
                });
                if (esta == false) {
                    idsquitar.push(rec.data.iddnecesidad);
                }
            });
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: 'guardarNecVencidas',
                params: {
                    necesidadesv: Ext.encode(ids),
                    necesidadesnv: Ext.encode(idsquitar)
                },
                callback: function (){
                    Ext.getBody().unmask();
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'Los datos fueron guardados satisfactoramente.');
                        modelo.stNecesidadesVencidas.removeAll();
                        modelo.stNecesidadesVencidas.reload();
                    }
                }
            });
        }

        function guardarCurso(btnpress)
        {
            if(vista.formularioGestionCurso.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accioncurso == 'add' ? 'addCurso' : 'updateCurso'),
                    params: {
                        idaccioncurso: accioncurso == 'add' ? -1 : objcurso.idaccioncurso,
                        idaccion: objselect.idaccion,
                        idcurso: vista.cbCurso.getValue(),
                        descripcion: vista.taDescripcionCur.getValue(),
                        fdesde: vista.dfFInicioC.getRawValue(),
                        fhasta: vista.dfFFinC.getRawValue(),
                        profesor: vista.tfProfesor.getValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accioncurso == 'mod')
                            {
                                mostrarMensaje(1, idioma.msgModCSucces);
                            }else{
                                mostrarMensaje(1, idioma.msgAddCSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                vista.ventanaGestionCurso.hide();
                            }
                            vista.formularioGestionCurso.getForm().reset();
                            modelo.stCursos.removeAll();
                            modelo.stCursos.reload();
                        } else {
                            mostrarMensaje(6,idioma.msgAExistem);
                        }
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = vista.gpAcciones.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idaccion);
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
                        url: 'deleteAcciones',
                        params: {idsacciones: Ext.encode(ids)},
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
                            modelo.stAcciones.removeAll();
                            modelo.stAcciones.reload();
                        }
                    });
                }
            });
        }

        function eliminarParticipante()
        {
            var ids = new Array();
            var s = vista.gpParticipantes.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idaccionparticipante);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = 'Esta seguro que desea eliminar el participante seleccionado?';
            } else {
                mensaje = 'Esta seguro que desea eliminar los participantes seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteParticipante',
                        params: {participantes: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                mostrarMensaje(6, 'La acción no se pudo realizar.');
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El participante fue eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los participantes fueron eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stParticipantes.removeAll();
                            modelo.stParticipantes.reload();
                        }
                    });
                }
            });
        }

        function eliminarInd()
        {
            var ids = new Array();
            var s = vista.gpIndicadoresPart.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idevalimpacto);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = 'Esta seguro que desea eliminar el indicador seleccionado?';
            } else {
                mensaje = 'Esta seguro que desea eliminar los indicadores seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteEvalInd',
                        params: {indicadores: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                mostrarMensaje(6, 'La acción no se pudo realizar.');
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El indicador fue eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los indicadores fueron eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stIndPartic.removeAll();
                            modelo.stIndPartic.reload();
                        }
                    });
                }
            });
        }

        function eliminarCurso()
        {
            var ids = new Array();
            var s = vista.gpCursos.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idaccioncurso);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = 'Esta seguro que desea eliminar el curso seleccionado?';
            } else {
                mensaje = 'Esta seguro que desea eliminar los cursos seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteCurso',
                        params: {cursos: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                mostrarMensaje(6, 'La acción no se pudo realizar.');
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El curso fue eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los cursos fueron eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stCursos.removeAll();
                            modelo.stCursos.reload();
                        }
                    });
                }
            });
        }

        function comprobar (numrow, per) {
            var esta = false;
            modelo.stParticipantes.each(function(rec){
                if (rec.data.idpersona == per.data.idpersona) {
                    iscomp = true;
                    esta = true;
                    mostrarMensaje(6, 'La persona seleccionada ya es participante.');
                    vista.smselectPer.deselectRow(numrow);
                }
            });
            if (esta == false) {
                var estacateg = false;
                Ext.each(objselect.idscategorias, function(reccat){
                    if (reccat == per.data.idcategoria) {
                        estacateg = true;
                    }
                });
                if(estacateg == false && objselect.idscategorias.length > 0) {
                    mostrarMensaje(2, idioma.msgAddPartPreg, function (btnPresionado){
                        if (btnPresionado != 'ok') {
                            vista.smselectPer.deselectRow(numrow);
                        }
                    });
                }
            }
        }

        function exportarPlanCapacit() {
            var params;
            params = Ext.urlEncode({
                idestructura: node.id,
                fdesde: vista.dfDesdePlan.getRawValue(),
                fhasta: vista.dHastaPlan.getRawValue()
            });
            vista.windFechasPlan.hide();
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Plan de capacitación',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                listeners: {
                    'beforeshow': function()
                    {
                        vista.tabPanel.enable();
                    },
                    'hide': function()
                    {
                        if (vista.gpAcciones.getSelectionModel().getSelected()) {
                            vista.tabPanel.enable();
                        } else {
                            vista.tabPanel.disable();
                        }
                    }
                },
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/capacitacion/index.php/gestionaraccionescapacitacion/generarPlan?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();

            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando plan de capacitación.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            };
        }

        function exportarEval() {
            var params;
            params = Ext.urlEncode({
                idaccionparticipante: vista.gpParticipantes.getSelectionModel().getSelected().data.idaccionparticipante,
                idpersona: vista.gpParticipantes.getSelectionModel().getSelected().data.idpersona
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Evaluaci&oacute;n de impacto',
                width: 800,
                height: 500,
                id: 'wineval',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                listeners: {
                    'beforeshow': function()
                    {
                        vista.tabPanel.enable();
                    },
                    'hide': function()
                    {
                        if (vista.gpAcciones.getSelectionModel().getSelected()) {
                            vista.tabPanel.enable();
                        } else {
                            vista.tabPanel.disable();
                        }
                    }
                },
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/capacitacion/index.php/gestionaraccionescapacitacion/generarEvaluacionImp?' + params
                    }
                }
            }).show();
            Ext.getCmp('wineval').maximize();

            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando evaluaci&oacute;n de impacto.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            };
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imlhbxe',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpParticipantes'){
                            vista.windPersonas.show();
                            modelo.stPersonas.removeAll();
                            modelo.stPersonas.load({params: {idestructura: node.id, start: 0, limit: 15, query: vista.sfBuscarPer.getValue()}});
                        }else if(!vista.tabPanel.disabled && vista.tabPanel.getActiveTab().id == 'gpCursos'){
                            accioncurso = 'add';
                            vista.ventanaGestionCurso.show();
                            vista.ventanaGestionCurso.setTitle(idioma.msgAddCurso);
                            vista.btnAplicarCurso.show();
                            vista.formularioGestionCurso.getForm().reset();
                        }else if(!vista.btnAdicionar.disabled){
                            accion = 'add';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.show();
                            vista.ventanaGestion.setTitle(idioma.msgAddA);
                            vista.formularioGestion.getForm().reset();
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificarCurso.disabled){
                            accioncurso = 'mod';
                            vista.ventanaGestionCurso.show();
                            vista.btnAplicarCurso.hide();
                            vista.ventanaGestion.setTitle(idioma.msgUPDCurso);
                            vista.cbCurso.setValue(objcurso.idcurso);
                            vista.cbCurso.setRawValue(objcurso.denominacion);
                            vista.taDescripcionCur.setValue(objcurso.descripcion);
                            vista.dfFInicioC.setRawValue(objcurso.fdesde);
                            vista.dfFFinC.setRawValue(objcurso.fhasta);
                            vista.tfProfesor.setValue(objcurso.profesor);
                        } else if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.hide();
                            vista.ventanaGestion.setTitle(idioma.msgModA);
                            vista.tfdenom.setValue(objselect.denominacion);
                            vista.cbModoFormacion.setValue(objselect.idmodoformacion);
                            vista.cbModoFormacion.setRawValue(objselect.modoformacion);
                            vista.cbTipoAccion.setValue(objselect.idtipoaccion);
                            vista.cbTipoAccion.setRawValue(objselect.tipoaccion);
                            vista.dfFInicioA.setValue(objselect.fdesde);
                            vista.dfFFinA.setValue(objselect.fhasta);
                            vista.nfDuracion.setValue(objselect.duracion);
                            vista.tfLugar.setValue(objselect.lugar);
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
                    case 88:{ //x para cancelar
                        if (vista.btnCancelarPart.isVisible()) {
                            vista.windPersonas.hide();
                        }
                        if (vista.btnCancelarCurso.isVisible()) {
                            vista.ventanaGestionCurso.hide();
                        }
                        if (vista.btnCancelar.isVisible()) {
                            vista.ventanaGestion.hide();
                        }
                        if (vista.btnCancelarEjec.isVisible()) {
                            vista.windEjec.hide();
                        }
                        if (vista.btnCancelarPlan.isVisible()) {
                            vista.windFechasPlan.hide();
                        }
                        if (vista.btnCancelarEv.isVisible()) {
                            vista.windResultados.hide();
                        }
                        if (vista.btnCancelarInd.isVisible()) {
                            vista.windAddInd.hide();
                        }
                        break;
                    }
                    case 69:{ //e para exportar
                        if (vista.btnExportar.isVisible()) {
                            vista.windFechasPlan.show();
                        }
                        break;
                    }
                    case 69:{ //j para ejecutar
                        if (vista.btnEjecutar.isVisible()) {
                            ejecaccion = 1;
                            vista.windEjec.show();
                            vista.windEjec.setHeight(240);
                            Ext.getCmp('colObservaciones').show();
                            vista.windEjec.setTitle('Ejecutar acci&oacute;n de capacitaci&oacute;n');
                            vista.dfDesde.setRawValue(objselect.frdesde);
                            vista.dHasta.setRawValue(objselect.frhasta);
                            vista.taObservacionEjec.setValue(objselect.observaciones);
                            vista.dfDesde.setMinValue('01/01/1900');
                            vista.dHasta.setMinValue('01/01/1900');
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminarParticip.disabled && vista.tabPanel.getActiveTab().id == 'gpParticipantes'){
                    eliminarParticipante();
                }else if(!vista.btnEliminarCurso.disabled && vista.tabPanel.getActiveTab().id == 'gpCursos'){
                    eliminarCurso();
                }else if(!vista.btnEliminar.disabled){
                    eliminar();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptarPart.isVisible()){
                    vista.btnAceptarPart.focus();
                    addParticipante('ACP');
                }else if(vista.btnAceptarCurso.isVisible()){
                    vista.btnAceptarCurso.focus();
                    guardarCurso('ACP');
                }else if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    guardarDatos('ACP');
                }
            }
        },{
            key: 88,//ctrl+alt+x cerrar
            alt: true,
            ctrl: true,
            fn: function(){
                if(vista.btnCancelarEI.isVisible()){
                    vista.btnCancelarEI.focus();
                    vista.windEvaluar.hide();
                    modelo.stParticipantes.reload();
                }
            }
        }]);
    }
};
