/**
 * @name GestionarCompetencias.controller - Controlador de la vista de la interfaz.
 * @package   Pvd.Competencia
 * @uses      Pvd.Competencia.GestionarCompetencias
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
Ext.ns('Pvd.Competencia.GestionarCompetencias');
Pvd.Competencia.GestionarCompetencias.Controlador = {
    init: function (idioma, vista, modelo) {
        var itemTab = new Array(); //Inicializando arreglos de elementos del TabPanel
        //Evento click en el menú
        var accion;
        var idsC = new Array();
        var idsCC = new Array();
        var idsCP = new Array();
        var idsNC = new Array();
        var idsNCP = new Array();
        var idsNCC = new Array();
        var node;
        var nivelcompetencia;
        var nivelcompetenciaProcesos;
        var nivelcompetenciaCargos;
        var compet;
        var tipo;
        var idestructura;

        // modelo.stCompetenciasEstructura.on('load', function () {
        //     vista.btnModificarC.disable();
        //     vista.btnEliminarC.disable();
        //     vista.btnAdicionarNC.disable();
        //     modelo.stNivelesCompetencias.removeAll();
        // });
        // modelo.stCompetenciasCargos.on('load', function () {
        //     vista.btnModificarCC.disable();
        //     vista.btnEliminarCC.disable();
        //     vista.btnAdicionarNCC.disable();
        //     modelo.stNivelesCompetencias.removeAll();
        // });
        // modelo.stCompetenciasProcesos.on('load', function () {
        //     vista.btnModificarCP.disable();
        //     vista.btnEliminarCP.disable();
        //     vista.btnAdicionarNCP.disable();
        //     modelo.stNivelesCompetencias.removeAll();
        // });
        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == '7' || node.attributes.idconcepto == '10') {
                vista.btnAdicionarC.disable();
                vista.btnAdicionarCP.disable();
                vista.btnAdicionarCC.enable();
                vista.tabPanel.setActiveTab('competenciascargos');
            }
            else {
                vista.btnAdicionarC.enable();
                vista.btnAdicionarCP.enable();
                vista.btnAdicionarCC.disable();
                vista.tabPanel.setActiveTab('competenciasorganizacion');
            }
            var idestructura = node.attributes.id;
            if (vista.tabPanel.getActiveTab().id == 'competenciasorganizacion') {
                modelo.stCompetenciasEstructura.load({params: {start: 0, limit: 15, idestructura: idestructura}});

            }
            else if (vista.tabPanel.getActiveTab().id == 'competenciasprocesos') {
                modelo.stCompetenciasProcesos.load({params: {start: 0, limit: 15, idestructura: idestructura}});
            }
            else if (vista.tabPanel.getActiveTab().id == 'competenciascargos') {
                modelo.stCompetenciasCargos.load({params: {start: 0, limit: 15, idestructura: idestructura}});
            }
        });

        vista.tabPanel.on('tabchange', function () {
            var idestructura = (node != undefined) ? node.attributes.id : false;
            if (vista.tabPanel.getActiveTab().id == 'competenciasorganizacion') {
                if (node == undefined) {
                    modelo.stCompetenciasEstructura.baseParams.idestructura = false;
                } else {
                    modelo.stCompetenciasEstructura.baseParams.idestructura = node.id;
                }
                modelo.stCompetenciasEstructura.removeAll();
                modelo.stNivelesCompetencias.removeAll();
                /*vista.gpNivelesCompetencias.disable();
                vista.gpNivelesCompetenciasProcesos.disable();
                vista.gpNivelesCompetenciasCargos.disable();*/
                modelo.stCompetenciasEstructura.load({
                    params: {
                        start       : 0,
                        limit       : 15,
                        idestructura: idestructura
                    }
                });
            } else if (vista.tabPanel.getActiveTab().id == 'competenciasprocesos') {
                modelo.stCompetenciasProcesos.removeAll();
                modelo.stNivelesCompetencias.removeAll();
                /*vista.gpNivelesCompetencias.disable();
                vista.gpNivelesCompetenciasProcesos.disable();
                vista.gpNivelesCompetenciasCargos.disable();*/
                modelo.stCompetenciasProcesos.load({
                    params: {
                        start       : 0,
                        limit       : 15,
                        idestructura: idestructura
                    }
                });
            } else if (vista.tabPanel.getActiveTab().id == 'competenciascargos') {
                modelo.stCompetenciasCargos.removeAll();
                modelo.stNivelesCompetencias.removeAll();
                /*vista.gpNivelesCompetencias.disable();
                vista.gpNivelesCompetenciasProcesos.disable();
                vista.gpNivelesCompetenciasCargos.disable();*/
                modelo.stCompetenciasCargos.load({
                    params: {
                        start       : 0,
                        limit       : 15,
                        idestructura: idestructura
                    }
                });
            }

        });

        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            modelo.stCompetenciasEstructura.load({params: {start: 0, limit: 15}});
            // modelo.stCompetenciasProcesos.load({params: {start: 0, limit: 15}});
            modelo.stCompetenciasCargos.load({params: {start: 0, limit: 15}});
        });

        vista.gpCompetenciasOrg.getSelectionModel().on('selectionchange', function(th) {
            if(th.getCount() == 1){
                compet = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data;
                modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.idescala;
                modelo.stNivelesCompetencias.baseParams.iddcompetencia = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.iddcompetencia;
                modelo.stNivelesCompetencias.load({params: {start: 0, limit: 15}});
                //vista.gpNivelesCompetencias.enable();
                vista.btnModificarC.enable();
                vista.btnEliminarC.enable();
                vista.btnAdicionarNC.enable();
            }
            else {
                vista.btnModificarC.disable();
                vista.btnEliminarC.disable();
                vista.btnAdicionarNC.disable();
            }
        });

        vista.gpCompetenciasProcesos.getSelectionModel().on('selectionchange', function(th) {
            if(th.getCount() == 1){
                compet = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data;
                modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.idescala;
                modelo.stNivelesCompetencias.baseParams.iddcompetencia = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.iddcompetencia;
                modelo.stNivelesCompetencias.load({params: {start: 0, limit: 15}});
                //vista.gpNivelesCompetenciasProcesos.enable();
                vista.btnModificarCP.enable();
                vista.btnEliminarCP.enable();
                vista.btnAdicionarNCP.enable();
            }
            else {
                vista.btnModificarCP.disable();
                vista.btnEliminarCP.disable();
                vista.btnAdicionarNCP.disable();
            }
        });

        vista.gpCompetenciasCargos.getSelectionModel().on('selectionchange', function(th) {
            if(th.getCount() == 1){
                compet = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data;
                modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala;
                modelo.stNivelesCompetencias.baseParams.iddcompetencia = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.iddcompetencia;
                modelo.stNivelesCompetencias.load({params: {start: 0, limit: 15}});
                //vista.gpNivelesCompetenciasCargos.enable();
                vista.btnModificarCC.enable();
                vista.btnEliminarCC.enable();
                vista.btnAdicionarNCC.enable();
            }
            else {
                vista.btnModificarCC.disable();
                vista.btnEliminarCC.disable();
                vista.btnAdicionarNCC.disable();
            }
        });

     /*   vista.gpCompetenciasOrg.getSelectionModel().on('rowselect', function () {
            compet = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data;
            modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.idescala;
            modelo.stNivelesCompetencias.baseParams.iddcompetencia = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.iddcompetencia;
            modelo.stNivelesCompetencias.load({params: {start: 0, limit: 15}});
            //vista.gpNivelesCompetencias.enable();
            vista.btnModificarC.enable();
            vista.btnEliminarC.enable();
            vista.btnAdicionarNC.enable();
        });*/

        // vista.gpCompetenciasProcesos.getSelectionModel().on('rowselect', function () {
        //     compet = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data;
        //     modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.idescala;
        //     modelo.stNivelesCompetencias.baseParams.iddcompetencia = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.iddcompetencia;
        //     modelo.stNivelesCompetencias.load({params: {start: 0, limit: 15}});
        //     //vista.gpNivelesCompetenciasProcesos.enable();
        //     vista.btnModificarCP.enable();
        //     vista.btnEliminarCP.enable();
        //     vista.btnAdicionarNCP.enable();
        // });

        // vista.gpCompetenciasCargos.getSelectionModel().on('rowselect', function () {
        //     compet = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data;
        //     modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala;
        //     modelo.stNivelesCompetencias.baseParams.iddcompetencia = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.iddcompetencia;
        //     modelo.stNivelesCompetencias.load({params: {start: 0, limit: 15}});
        //     //vista.gpNivelesCompetenciasCargos.enable();
        //     vista.btnModificarCC.enable();
        //     vista.btnEliminarCC.enable();
        //     vista.btnAdicionarNCC.enable();
        // });

        vista.gpNivelesCompetencias.getSelectionModel().on('selectionchange', function(th) {
            if(th.getCount() == 1){
                nivelcompetencia = vista.gpNivelesCompetencias.getSelectionModel().getSelected().data;
                vista.btnModificarNC.enable();
                vista.btnEliminarNC.enable();
            }
            else {
                vista.btnModificarNC.disable();
                vista.btnEliminarNC.disable();
            }
        });

        vista.gpNivelesCompetenciasProcesos.getSelectionModel().on('selectionchange', function(th) {
            if(th.getCount() == 1){
                nivelcompetenciaProcesos = vista.gpNivelesCompetenciasProcesos.getSelectionModel().getSelected().data;
                vista.btnModificarNCP.enable();
                vista.btnEliminarNCP.enable();
            }
            else {
                vista.btnModificarNCP.disable();
                vista.btnEliminarNCP.disable();
            }
        });

        vista.gpNivelesCompetenciasCargos.getSelectionModel().on('selectionchange', function(th) {
            if(th.getCount() == 1){
                nivelcompetenciaCargos = vista.gpNivelesCompetenciasCargos.getSelectionModel().getSelected().data;
                vista.btnModificarNCC.enable();
                vista.btnEliminarNCC.enable();
            }
            else {
                vista.btnModificarNCC.disable();
                vista.btnEliminarNCC.disable();
            }
        });

        // vista.gpNivelesCompetencias.getSelectionModel().on('rowselect', function () {
        //     nivelcompetencia = vista.gpNivelesCompetencias.getSelectionModel().getSelected().data;
        //     vista.btnModificarNC.enable();
        //     vista.btnEliminarNC.enable();
        //     //   }
        // });

        // vista.gpNivelesCompetenciasProcesos.getSelectionModel().on('rowselect', function () {
        //     nivelcompetenciaProcesos = vista.gpNivelesCompetenciasProcesos.getSelectionModel().getSelected().data;
        //     vista.btnModificarNCP.enable();
        //     vista.btnEliminarNCP.enable();
        // });

        // vista.gpNivelesCompetenciasCargos.getSelectionModel().on('rowselect', function () {
        //     nivelcompetenciaCargos = vista.gpNivelesCompetenciasCargos.getSelectionModel().getSelected().data;
        //     vista.btnModificarNCC.enable();
        //     vista.btnEliminarNCC.enable();
        // });

        vista.btnModificarC.on('click', function () {
            accion = 'modificar';
            modificarC();
        });
        vista.btnModificarCP.on('click', function () {
            accion = 'modificar';
            modificarCP();
        });
        vista.btnModificarNC.on('click', function () {
            accion = 'modificar';
            modificarNC();
        });
        vista.btnModificarNCP.on('click', function () {
            accion = 'modificar';
            modificarNCP();
        });

        vista.btnModificarCC.on('click', function () {
            accion = 'modificar';
            modificarCC();
        });
        vista.btnModificarNCC.on('click', function () {
            accion = 'modificar';
            modificarNCC();
        });

        vista.btnAdicionarC.on('click', function () {
            accion = 'adicionar';
            adicionarC();
        });
        vista.btnAdicionarCP.on('click', function () {
            accion = 'adicionar';
            adicionarCP();
        });
        vista.btnAdicionarNCP.on('click', function () {
            accion = 'adicionar';
            adicionarNCP();
        });
        vista.btnAdicionarNC.on('click', function () {
            accion = 'adicionar';
            adicionarNC();
        });

        vista.btnAdicionarCC.on('click', function () {
            accion = 'adicionar';
            adicionarCC();
        });
        vista.btnAdicionarNCC.on('click', function () {
            accion = 'adicionar';
            adicionarNCC();
        });

        vista.btnEliminarC.on('click', function () {
            var compEstruc = vista.gpCompetenciasOrg.getSelectionModel().getSelections();
            idsC = new Array();
            for (var i = 0; i < compEstruc.length; i++) {
                idsC.push(compEstruc[i].data.iddcompetencia);
            }
            eliminarC();
        });
        vista.btnEliminarNC.on('click', function () {
            var nivComp = vista.gpNivelesCompetencias.getSelectionModel().getSelections();

            for (var i = 0; i < nivComp.length; i++) {
                idsNC.push(nivComp[i].data.idnivelcompetencia);
            }
            eliminarNC();
        });
        vista.btnEliminarCP.on('click', function () {
            var compProc = vista.gpCompetenciasProcesos.getSelectionModel().getSelections();
            idsCP = new Array();
            for (var i = 0; i < compProc.length; i++) {
                idsCP.push(compProc[i].data.iddcompetencia);
            }
            eliminarCP();
        });
        vista.btnEliminarNCP.on('click', function () {
            var nivCompProc = vista.gpNivelesCompetenciasProcesos.getSelectionModel().getSelections();

            for (var i = 0; i < nivCompProc.length; i++) {
                idsNCP.push(nivCompProc[i].data.idnivelcompetencia);
            }
            eliminarNCP();
        });

        vista.btnEliminarCC.on('click', function () {
            var compCargo = vista.gpCompetenciasCargos.getSelectionModel().getSelections();
            idsCC = new Array();
            for (var i = 0; i < compCargo.length; i++) {
                idsCC.push(compCargo[i].data.iddcompetencia);
            }
            eliminarCC();
        });
        vista.btnEliminarNCC.on('click', function () {
            var nivComp = vista.gpNivelesCompetenciasCargos.getSelectionModel().getSelections();

            for (var i = 0; i < nivComp.length; i++) {
                idsNCC.push(nivComp[i].data.idnivelcompetencia);
            }
            eliminarNCC();
        });

        vista.btnAceptarComp.on('click', function () {
            tipo = 'estructura';
            guardarDatosC();
            
        });

        vista.btnAceptarCompProcesos.on('click', function () {
            tipo = 'proceso';
            guardarDatosC();
            
        });

        vista.btnAceptarCompCargos.on('click', function () {
            tipo = 'cargo';
            guardarDatosC();
            
        });
        vista.btnAplicarComp.on('click', function () {
            tipo = 'estructura';
            guardarDatosC();
            vista.fpAdicionarComp.getForm().reset();
        });
        vista.btnAplicarCompCargos.on('click', function () {
            tipo = 'cargo';
            guardarDatosC();
            vista.fpAdicionarCompCargos.getForm().reset();
        });
        vista.btnAplicarCompProcesos.on('click', function () {
            tipo = 'proceso';
            guardarDatosC();
            vista.fpAdicionarCompProceso.getForm().reset();
        });

        vista.btnAceptarNivComp.on('click', function () {
            tipo = 'estructura';
            guardarDatosNC();
            vista.wGestionNivelesCompetencia.hide();
            //modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.idescala;
            //modelo.stNivelesCompetencias.load();
            vista.fpAdicionarNivelesComp.getForm().reset();
        });
        vista.btnAplicarNivComp.on('click', function () {
            tipo = 'estructura';
            guardarDatosNC();
            //modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.idescala;
            //modelo.stNivelesCompetencias.load();
            vista.fpAdicionarNivelesComp.getForm().reset();
        });


        vista.btnAceptarNivCompCargos.on('click', function () {
            tipo = 'cargo';
            guardarDatosNC();
            vista.wGestionNivelesCompetenciasCargos.hide();

            modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala;
            modelo.stNivelesCompetencias.removeAll();
            //   var escala = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala;
            //  modelo.stNivelesCompetencias.load({params: {idescala: escala, start: 0, limit: 15}});
            vista.fpAdicionarNivelesCompCargos.getForm().reset();
        });
        vista.btnAplicarNivCompCargos.on('click', function () {
            tipo = 'cargo';
            guardarDatosNC();
            modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala;
            modelo.stNivelesCompetencias.removeAll();
            //    var escala = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala;
            //   modelo.stNivelesCompetencias.load({params: {idescala: escala, start: 0, limit: 15}});

            vista.fpAdicionarNivelesCompCargos.getForm().reset();
        });

        vista.btnAceptarNivCompProcesos.on('click', function () {
            tipo = 'proceso';
            guardarDatosNC();
            vista.wGestionNivelesCompetenciaProcesos.hide();

            //modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.idescala;
            //modelo.stNivelesCompetencias.load();
            vista.fpAdicionarNivelesCompProcesos.getForm().reset();
        });
        vista.btnAplicarNivCompProcesos.on('click', function () {
            tipo = 'proceso';
            guardarDatosNC();
            //modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.idescala;
            //modelo.stNivelesCompetencias.load();
            vista.fpAdicionarNivelesCompProcesos.getForm().reset();
        });

        vista.comboCompetencias.on('select', function () {
            vista.cbNivelRequeridoO.reset();
            var obj = modelo.stCompetencias.getById(vista.comboCompetencias.getValue());
            modelo.stValorEscala.baseParams.idescala = obj.data.idescala;
            modelo.stValorEscala.load();
        });

        vista.comboCompetenciasP.on('select', function () {
            vista.cbNivelRequeridoP.reset();
            var obj = modelo.stCompetencias.getById(vista.comboCompetenciasP.getValue());
            modelo.stValorEscala.baseParams.idescala = obj.data.idescala;
            modelo.stValorEscala.load();
        });

        vista.comboCompetenciasC.on('select', function () {
            vista.cbNivelRequeridoC.reset();
            var obj = modelo.stCompetencias.getById(vista.comboCompetenciasC.getValue());
            modelo.stValorEscala.baseParams.idescala = obj.data.idescala;
            modelo.stValorEscala.load();
        });

        vista.btnBuscarCE.on('click', function () {
            modelo.stCompetenciasEstructura.baseParams.busqueda = true;
            modelo.stCompetenciasEstructura.load({params: {denominacion: vista.sfBuscarCompetencia.getValue(), start: 0, limit: 15}});
        });

        vista.btnBuscarCP.on('click', function () {
            modelo.stCompetenciasProcesos.baseParams.busqueda = true;
            modelo.stCompetenciasProcesos.load({params: {denominacion: vista.sfBuscarCompetenciaProc.getValue(), idestructura: node.attributes.id, start: 0, limit: 15}});
        });

        vista.btnBuscarCC.on('click', function () {
            modelo.stCompetenciasCargos.baseParams.busqueda = true;
            modelo.stCompetenciasCargos.load({params: {denominacion: vista.sfBuscarCompetenciaCargo.getValue(), start: 0, limit: 15}});
        });

        function adicionarNC() {
            var idescala = vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.idescala;

            modelo.stValorEscala.load({params: {idescala: idescala}});

            var adicionarNivComp = vista.wGestionNivelesCompetencia;
            vista.wGestionNivelesCompetencia.setTitle('Adicionar nivel de competencia por estructura');
            vista.btnAplicarNivComp.show();
            adicionarNivComp.show();
        }


        function adicionarNCP() {
            var idescala = vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.idescala;

            modelo.stValorEscalaP.load({params: {idescala: idescala}});

            var adicionarNivCompProcesos = vista.wGestionNivelesCompetenciaProcesos;
            vista.wGestionNivelesCompetenciaProcesos.setTitle('Adicionar nivel de competencia por procesos');
            vista.btnAplicarNivCompProcesos.show();
            adicionarNivCompProcesos.show();
        }

        function adicionarNCC() {
            var idescala = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala;
            modelo.stValorEscalaC.load({params: {idescala: idescala}});
            var adicionarNivCompCargos = vista.wGestionNivelesCompetenciasCargos;
            vista.wGestionNivelesCompetenciasCargos.setTitle('Adicionar nivel de competencia por cargos');
            vista.btnAplicarNivCompCargos.show();
            adicionarNivCompCargos.show();
        }

        function adicionarC() {
            modelo.stCompetencias.load();
            modelo.stClasificacion.load();
            //      modelo.stEscala.load();
            var adicionarComp = vista.wGestionCompetencia;
            vista.wGestionCompetencia.setTitle('Adicionar competencia por estructura');
            adicionarComp.show();
            vista.btnAplicarComp.show();
        }

        function adicionarCC() {
            modelo.stCompetencias.load();
            modelo.stClasificacion.load();
            //  modelo.stEscala.load();
            var adicionarComp = vista.wGestionCompetenciasCargos;
            vista.wGestionCompetenciasCargos.setTitle('Adicionar competencia por cargos');
            adicionarComp.show();
            vista.btnAplicarCompCargos.show();
        }

        function adicionarCP() {
            var idestrc = node.attributes.id;

            modelo.stCompetencias.load();
            modelo.stClasificacion.load();
            //   modelo.stEscala.load();
            modelo.stProcesos.baseParams.idestructura = idestrc;
            modelo.stProcesos.load();
            var adicionarCompProcesos = vista.wGestionCompetenciaProcesos;
            vista.wGestionCompetenciaProcesos.setTitle('Adicionar competencia por proceso');
            adicionarCompProcesos.show();
            vista.btnAplicarCompProcesos.show();
        }

        function modificarC() {
            var modificarComp = vista.wGestionCompetencia;
            vista.wGestionCompetencia.setTitle('Modificar competencia');
            modificarComp.show();
            vista.btnAplicarComp.hide();
            vista.fpAdicionarComp.getForm().loadRecord(vista.gpCompetenciasOrg.getSelectionModel().getSelected());
            modelo.stCompetencias.reload();
            //   modelo.stEscala.reload();
            modelo.stClasificacion.reload();
            modelo.stValorEscala.baseParams.idescala = compet.idescala;
            modelo.stValorEscala.load();
            vista.comboCompetencias.setRawValue(compet.denominacion);
            vista.cbNivelRequeridoO.setValue(compet.idvalorescala);
            vista.cbNivelRequeridoO.setRawValue(compet.nivelrequerido);
            vista.tfOrdenO.setValue(compet.orden);
            vista.comboClasificacion.setRawValue(compet.clasificacion);
            vista.fechaInicio.setRawValue(compet.fdesde);
            vista.fechaFin.setRawValue(compet.fhasta);
        }

        function modificarCC() {
            var modificarComp = vista.wGestionCompetenciasCargos;
            vista.wGestionCompetenciasCargos.setTitle('Modificar competencia por cargo');
            modificarComp.show();
            vista.btnAplicarCompCargos.hide();
            vista.fpAdicionarCompCargos.getForm().loadRecord(vista.gpCompetenciasCargos.getSelectionModel().getSelected());
            modelo.stCompetencias.reload();
            //      modelo.stEscala.reload();
            modelo.stClasificacion.reload();
            modelo.stValorEscala.baseParams.idescala = compet.idescala;
            modelo.stValorEscala.load();
            vista.comboCompetenciasC.setRawValue(compet.denominacion);
            vista.cbNivelRequeridoC.setValue(compet.idvalorescala);
            vista.cbNivelRequeridoC.setRawValue(compet.nivelrequerido);
            vista.tfOrdenC.setValue(compet.orden);
            vista.comboClasificacionC.setRawValue(compet.clasificacion);
            vista.fechaInicioC.setRawValue(compet.fdesde);
            vista.fechaFinC.setRawValue(compet.fhasta);
        }

        function modificarNC() {
            var modificarNivComp = vista.wGestionNivelesCompetencia;
            vista.wGestionNivelesCompetencia.setTitle('Modificar nivel de competencia por estructura');
            vista.btnAplicarNivComp.hide();
            modificarNivComp.show();
            vista.fpAdicionarNivelesComp.getForm().loadRecord(vista.gpNivelesCompetencias.getSelectionModel().getSelected());
            modelo.stValorEscala.baseParams.idescala = nivelcompetencia.idescala;
            modelo.stValorEscala.reload();
            vista.comboValorEscala.setRawValue(nivelcompetencia.valorescala);
            vista.descripcionNivel.setRawValue(nivelcompetencia.descripcion);
        }

        function modificarCP() {
            var modificarComp = vista.wGestionCompetenciaProcesos;
            vista.wGestionCompetenciaProcesos.setTitle('Modificar competencia por procesos');
            modificarComp.show();
            vista.btnAplicarCompProcesos.hide();
            vista.fpAdicionarCompProceso.getForm().loadRecord(vista.gpCompetenciasProcesos.getSelectionModel().getSelected());
            modelo.stCompetencias.reload();
            //      modelo.stEscala.reload();
            modelo.stClasificacion.reload();
            modelo.stValorEscala.baseParams.idescala = compet.idescala;
            modelo.stValorEscala.load();
            modelo.stProcesos.baseParams.idestructura = compet.idestructura;
            modelo.stProcesos.reload();

            vista.comboProcesos.setRawValue(compet.denominacionproceso);
            vista.comboCompetenciasP.setRawValue(compet.denominacion);
            vista.cbNivelRequeridoP.setValue(compet.idvalorescala);
            vista.cbNivelRequeridoP.setRawValue(compet.nivelrequerido);
            vista.tfOrdenP.setValue(compet.orden);
            vista.comboClasificacionP.setRawValue(compet.clasificacion);
            vista.fechaInicioP.setRawValue(compet.fdesde);
            vista.fechaFinP.setRawValue(compet.fhasta);
        }

        function modificarNCP() {

            var modificarNivCompProcesos = vista.wGestionNivelesCompetenciaProcesos;
            vista.wGestionNivelesCompetenciaProcesos.setTitle('Modificar nivel de competencia por procesos');
            vista.btnAplicarNivCompProcesos.hide();
            modificarNivCompProcesos.show();
            vista.fpAdicionarNivelesCompProcesos.getForm().loadRecord(vista.gpNivelesCompetenciasProcesos.getSelectionModel().getSelected());
            modelo.stValorEscalaP.baseParams.idescala = nivelcompetenciaProcesos.idescala;
            modelo.stValorEscalaP.reload();

            vista.comboValorEscalaP.setRawValue(nivelcompetenciaProcesos.valorescala);
            vista.descripcionNivelP.setRawValue(nivelcompetenciaProcesos.descripcion);
        }

        function modificarNCC() {

            var modificarNivCompCargos = vista.wGestionNivelesCompetenciasCargos;
            vista.wGestionNivelesCompetenciasCargos.setTitle('Modificar nivel de competencia por cargos');
            vista.btnAplicarNivCompCargos.hide();
            modificarNivCompCargos.show();
            vista.fpAdicionarNivelesCompCargos.getForm().loadRecord(vista.gpNivelesCompetenciasCargos.getSelectionModel().getSelected());
            modelo.stValorEscalaC.baseParams.idescala = nivelcompetenciaCargos.idescala;
            modelo.stValorEscalaC.reload();

            vista.comboValorEscalaC.setRawValue(nivelcompetenciaCargos.valorescala);
            vista.descripcionNivelC.setRawValue(nivelcompetenciaCargos.descripcion);
        }

        function eliminarNC() {
            if (idsNC.length == 1) {
                mensaje = idioma.msgConfirmDeleteNCSin;
            } else {
                mensaje = idioma.msgConfirmDeleteNCPlu;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDeleting);
                    Ext.Ajax.request({
                        url     : 'eliminarNivelesCompetencias',
                        params  : {idNivelCompetencias: Ext.encode(idsNC)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success : function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                if (idsNC == 1) {
                                    var mensaje = 'El nivel de competencia ha sido eliminado satisfactoriamente.';
                                }
                                else {
                                    var mensaje = 'Los niveles de competencias han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stNivelesCompetencias.removeAll();
                            modelo.stNivelesCompetencias.reload();
                        }
                    })
                    modelo.stCompetenciasEstructura.reload();
                }

            });
        }

        function eliminarNCC() {
            var mensaje;
            if (idsNC.length == 1) {
                mensaje = idioma.msgConfirmDeleteNCSin;
            } else {
                mensaje = idioma.msgConfirmDeleteNCPlu;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDeleting);
                    Ext.Ajax.request({
                        url     : 'eliminarNivelesCompetencias',
                        params  : {idNivelCompetencias: Ext.encode(idsNCC)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success : function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                if (idsNC == 1) {
                                    var mensaje = 'El nivel de competencia ha sido eliminado satisfactoriamente.';
                                }
                                else {
                                    var mensaje = 'Los niveles de competencias han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stNivelesCompetencias.removeAll();
                            modelo.stNivelesCompetencias.reload();
                        }
                    })
                    modelo.stCompetenciasEstructura.reload();
                }

            });
        }

        function eliminarNCP() {
            var mensaje;
            if (idsNCP.length == 1) {
                mensaje = idioma.msgConfirmDeleteNCSin;
            } else {
                mensaje = idioma.msgConfirmDeleteNCPlu;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDeleting);
                    Ext.Ajax.request({
                        url     : 'eliminarNivelesCompetencias',
                        params  : {idNivelCompetencias: Ext.encode(idsNCP)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success : function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                if (idsNC == 1) {
                                    var mensaje = 'El nivel de competencia ha sido eliminado satisfactoriamente.';
                                }
                                else {
                                    var mensaje = 'Los niveles de competencias han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stNivelesCompetencias.removeAll();
                            modelo.stNivelesCompetencias.reload();
                        }
                    })
                    modelo.stCompetenciasEstructura.reload();
                }

            });
        }

        function eliminarC() {
            var mensaje;
            if (idsC.length == 1) {
                mensaje = idioma.msgConfirmDeleteCSin;
            } else {
                mensaje = idioma.msgConfirmDeleteCPlu;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDeleting);
                    Ext.Ajax.request({
                        url     : 'eliminarCompetencias',
                        params  : {idCompetenciasEstruc: Ext.encode(idsC)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success : function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                if (idsC == 1) {
                                    var mensaje = 'La competencia ha sido eliminada satisfactoriamente.';
                                }
                                else {
                                    var mensaje = 'Las competencias han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stCompetenciasEstructura.removeAll();
                            modelo.stNivelesCompetencias.removeAll();
                            modelo.stCompetenciasEstructura.reload();
                            modelo.stNivelesCompetencias.reload();
                        }
                    })
                }
            });
        }

        function eliminarCP() {
            var mensaje;
            if (idsCP.length == 1) {
                mensaje = idioma.msgConfirmDeleteCSin;
            } else {
                mensaje = idioma.msgConfirmDeleteCPlu;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDeleting);
                    Ext.Ajax.request({
                        url     : 'eliminarCompetenciasProcesos',
                        params  : {idCompetenciasProcesos: Ext.encode(idsCP)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success : function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                if (idsCP == 1) {
                                    var mensaje = 'La competencia ha sido eliminada satisfactoriamente.';
                                }
                                else {
                                    var mensaje = 'Las competencias han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stCompetenciasProcesos.removeAll();
                            modelo.stNivelesCompetencias.removeAll();
                            modelo.stCompetenciasProcesos.reload();
                            modelo.stNivelesCompetencias.reload();
                        }
                    })
                }
            });
        }

        function eliminarCC() {
            var mensaje;
            if (idsCP.length == 1) {
                mensaje = idioma.msgConfirmDeleteCSin;
            } else {
                mensaje = idioma.msgConfirmDeleteCPlu;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDeleting);
                    Ext.Ajax.request({
                        url     : 'eliminarCompetenciasCargos',
                        params  : {idCompetenciasCargos: Ext.encode(idsCC)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success : function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                if (idsCP == 1) {
                                    var mensaje = 'La competencia ha sido eliminada satisfactoriamente.';
                                }
                                else {
                                    var mensaje = 'Las competencias han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stCompetenciasCargos.removeAll();
                            modelo.stNivelesCompetencias.removeAll();
                            modelo.stCompetenciasCargos.reload();
                            modelo.stNivelesCompetencias.reload();
                        }
                    })
                }
            });
        }

        function guardarDatosC() {
            // if (vista.fpAdicionarComp.getForm().isValid()) {

                if (accion == 'modificar') {
                    var iddcompetencia = (tipo == 'estructura') ? vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.iddcompetencia : (tipo == 'cargo') ? vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.iddcompetencia : vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.iddcompetencia;
                }
                else {
                    var iddcompetencia = false;
                }

                // var idescala = (tipo == 'estructura') ? vista.comboEscala.getValue() : (tipo == 'cargo') ? vista.comboEscalaC.getValue() : vista.comboEscalaP.getValue();
                var idcompetencia = (tipo == 'estructura') ? vista.comboCompetencias.getValue() : (tipo == 'cargo') ? vista.comboCompetenciasC.getValue() : vista.comboCompetenciasP.getValue();
                var idclasifcompetencia = (tipo == 'estructura') ? vista.comboClasificacion.getValue() : (tipo == 'cargo') ? vista.comboClasificacionC.getValue() : vista.comboClasificacionP.getValue();
                var idvalorescala = (tipo == 'estructura') ? vista.cbNivelRequeridoO.getValue() : (tipo == 'cargo') ? vista.cbNivelRequeridoC.getValue() : vista.cbNivelRequeridoP.getValue();
                var orden = (tipo == 'estructura') ? vista.tfOrdenO.getValue() : (tipo == 'cargo') ? vista.tfOrdenC.getValue() : vista.tfOrdenP.getValue();
                var idcargo = '';
                var idproceso = vista.comboProcesos.getValue();
                var fdesde = (tipo == 'estructura') ? vista.fechaInicio.getRawValue() : (tipo == 'cargo') ? vista.fechaInicioC.getRawValue() : vista.fechaInicioP.getRawValue();
                var fhasta = (tipo == 'estructura') ? vista.fechaFin.getRawValue() : (tipo == 'cargo') ? vista.fechaFinC.getRawValue() : vista.fechaFinP.getRawValue();
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url     : (accion == 'adicionar' ? 'insertarCompetencia' : 'modificarCompetencia'),
                    params  : {
                        idcompetencia      : idcompetencia,
                        idclasifcompetencia: idclasifcompetencia,
                        idvalorescala      : idvalorescala,
                        orden              : orden,
                        idestructura       : (node != undefined) ? node.id : compet.idestructura,
                        idproceso          : idproceso,
                        fdesde             : fdesde,
                        fhasta             : fhasta,
                        iddcompetencia     : iddcompetencia,
                        tipo               : tipo,
                        idcompetenciaproc  : (tipo=='proceso' && accion == 'modificar')?vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.idcompetenciaproc:null
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success : function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if (accion == 'modificar') {
                                mostrarMensaje(1, 'La competencia ha sido modificada satisfactoriamente.');
                            }
                            else {
                                mostrarMensaje(1, idioma.msgAddSucces);
                            }

                            if (tipo == 'estructura') {
                                modelo.stCompetenciasEstructura.removeAll();
                                modelo.stCompetenciasEstructura.reload();
                                vista.fpAdicionarComp.getForm().reset();
                                vista.wGestionCompetencia.hide();
                            }
                            else if (tipo == 'cargo') {
                                modelo.stCompetenciasCargos.removeAll();
                                modelo.stCompetenciasCargos.reload();
                                vista.fpAdicionarCompCargos.getForm().reset();
                                vista.wGestionCompetenciasCargos.hide();
                            }
                            else {
                                modelo.stCompetenciasProcesos.removeAll();
                                modelo.stCompetenciasProcesos.reload();
                                vista.wGestionCompetenciaProcesos.hide();
                                vista.fpAdicionarCompProceso.getForm().reset();
                            }

                        } else {
                            mostrarMensaje(6, idioma.msgExistem);
                        }
                    }
                })
            // }
            // else {
            //     console.log('invalid');
            // }
        }

        function guardarDatosNC() {

            if (vista.fpAdicionarNivelesComp.getForm().isValid() || vista.fpAdicionarNivelesCompProcesos.getForm().isValid() || vista.fpAdicionarNivelesCompCargos.getForm().isValid()) {
                if (accion == 'modificar') {
                    var idnivelcompetencia = (tipo == 'estructura') ? vista.gpNivelesCompetencias.getSelectionModel().getSelected().data.idnivelcompetencia : (tipo == 'cargo') ? vista.gpNivelesCompetenciasCargos.getSelectionModel().getSelected().data.idnivelcompetencia : vista.gpNivelesCompetenciasProcesos.getSelectionModel().getSelected().data.idnivelcompetencia;
                }
                else {
                    var idnivelcompetencia = false;
                }
                var idescala = (tipo == 'estructura') ? vista.gpCompetenciasOrg.getSelectionModel().getSelected().data.idescala : (tipo == 'cargo') ? vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala : vista.gpCompetenciasProcesos.getSelectionModel().getSelected().data.idescala;
                var idvalorescala = (tipo == 'estructura') ? vista.comboValorEscala.getValue() : (tipo == 'cargo') ? vista.comboValorEscalaC.getValue() : vista.comboValorEscalaP.getValue();
                var descripcion = (tipo == 'estructura') ? vista.descripcionNivel.getValue() : (tipo == 'cargo') ? vista.descripcionNivelC.getValue() : vista.descripcionNivelP.getValue();
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url     : (accion == 'adicionar' ? 'insertarNivelCompetencia' : 'modificarNivelCompetencia'),
                    params  : {
                        idvalorescala     : idvalorescala,
                        descripcion       : descripcion,
                        idescala          : idescala,
                        iddcompetencia    : compet.iddcompetencia,
                        idnivelcompetencia: idnivelcompetencia
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success : function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            mostrarMensaje(1, idioma.msgAddNCSucces);
                            modelo.stNivelesCompetencias.removeAll();
                            modelo.stNivelesCompetencias.reload();

                        } else {
                            mostrarMensaje(6, idioma.msgExistem);
                        }
                    }
                })

            }
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imlb',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(!vista.btnAdicionarNC.disabled && vista.tabPanel.getActiveTab().id == 'competenciasorganizacion'){
                            accion = 'adicionar';
                            adicionarNC();
                        } else if(!vista.btnAdicionarC.disabled && vista.tabPanel.getActiveTab().id == 'competenciasorganizacion'){
                            accion = 'adicionar';
                            adicionarC();
                        } else if(!vista.btnAdicionarNCC.disabled && vista.tabPanel.getActiveTab().id == 'competenciascargos'){
                            accion = 'adicionar';
                            adicionarNCC();
                        } else if(!vista.btnAdicionarCC.disabled && vista.tabPanel.getActiveTab().id == 'competenciascargos'){
                            accion = 'adicionar';
                            adicionarCC();
                        } else if(!vista.btnAdicionarNCP.disabled && vista.tabPanel.getActiveTab().id == 'competenciasprocesos'){
                            accion = 'adicionar';
                            adicionarNCP();
                        } else if(!vista.btnAdicionarCP.disabled && vista.tabPanel.getActiveTab().id == 'competenciasprocesos'){
                            accion = 'adicionar';
                            adicionarCP();
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificarNC.disabled && vista.tabPanel.getActiveTab().id == 'competenciasorganizacion'){
                            accion = 'modificar';
                            modificarNCC();
                        } else if(!vista.btnModificarC.disabled && vista.tabPanel.getActiveTab().id == 'competenciasorganizacion'){
                            accion = 'modificar';
                            modificarCC();
                        } else if(!vista.btnModificarNCP.disabled && vista.tabPanel.getActiveTab().id == 'competenciasprocesos'){
                            accion = 'modificar';
                            modificarNCP();
                        } else if(!vista.btnModificarCP.disabled && vista.tabPanel.getActiveTab().id == 'competenciasprocesos'){
                            accion = 'modificar';
                            modificarCP();
                        } else if(!vista.btnModificarNCC.disabled && vista.tabPanel.getActiveTab().id == 'competenciascargos'){
                            accion = 'modificar';
                            modificarNCC();
                        } else if(!vista.btnModificarCC.disabled && vista.tabPanel.getActiveTab().id == 'competenciascargos'){
                            accion = 'modificar';
                            modificarCC();
                        }
                        break;
                    }
                    case 76:{ //l para limpiar
                        if(!vista.btnLimpiarCE.disabled && vista.tabPanel.getActiveTab().id == 'competenciasorganizacion'){
                           vista.btnLimpiarCE.handler();
                        } else if(!vista.btnLimpiarCP.disabled && vista.tabPanel.getActiveTab().id == 'competenciasprocesos'){
                           vista.btnLimpiarCP.handler();
                        } else if(!vista.btnLimpiarCC.disabled && vista.tabPanel.getActiveTab().id == 'competenciascargos'){
                           vista.btnLimpiarCC.handler();
                        }
                        break;
                    }
                    case 66:{ //b para buscar
                        if(!vista.btnBuscarCE.disabled && vista.tabPanel.getActiveTab().id == 'competenciasorganizacion'){
                            modelo.stCompetenciasEstructura.baseParams.busqueda = true;
                            modelo.stCompetenciasEstructura.load({params: {denominacion: vista.sfBuscarCompetencia.getValue(), start: 0, limit: 15}});
                        } else if(!vista.btnBuscarCP.disabled && vista.tabPanel.getActiveTab().id == 'competenciasprocesos'){
                            modelo.stCompetenciasProcesos.baseParams.busqueda = true;
                            modelo.stCompetenciasProcesos.load({params: {denominacion: vista.sfBuscarCompetenciaProc.getValue(), idestructura: node.attributes.id, start: 0, limit: 15}});
                        } else if(!vista.btnBuscarCC.disabled && vista.tabPanel.getActiveTab().id == 'competenciascargos'){
                            modelo.stCompetenciasCargos.baseParams.busqueda = true;
                            modelo.stCompetenciasCargos.load({params: {denominacion: vista.sfBuscarCompetenciaCargo.getValue(), start: 0, limit: 15}});
                        }
                        break;
                    }
                }
            }
        },{
            key: 'x',
            alt: true,
            stopEvent: true,
            fn: function () {
                if (vista.btnCancelarCompProcesos.isVisible()) {
                    vista.btnCancelarCompProcesos.handler();
                }
                if (vista.btnCancelarCompCargos.isVisible()) {
                    vista.btnCancelarCompCargos.handler();
                }
                if (vista.btnCancelarNivComp.isVisible()) {
                    vista.btnCancelarNivComp.handler();
                }
                if (vista.btnCancelarNivCompProcesos.isVisible()) {
                    vista.btnCancelarNivCompProcesos.handler();
                }
                if (vista.btnCancelarNivCompCargos.isVisible()) {
                    vista.btnCancelarNivCompCargos.handler();
                }
                if (vista.btnCancelarComp.isVisible()) {
                    vista.btnCancelarComp.handler();
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminarC.disabled && vista.tabPanel.getActiveTab().id == 'competenciasorganizacion'){
                    var compEstruc = vista.gpCompetenciasOrg.getSelectionModel().getSelections();
                    idsC = new Array();
                    for (var i = 0; i < compEstruc.length; i++) {
                        idsC.push(compEstruc[i].data.iddcompetencia);
                    }
                    eliminarC();
                } else if(!vista.btnEliminarCC.disabled && vista.tabPanel.getActiveTab().id == 'competenciascargos'){
                    var compCargo = vista.gpCompetenciasCargos.getSelectionModel().getSelections();
                    idsCC = new Array();
                    for (var i = 0; i < compCargo.length; i++) {
                        idsCC.push(compCargo[i].data.iddcompetencia);
                    }
                    eliminarCC();
                } else if(!vista.btnEliminarNCC.disabled && vista.tabPanel.getActiveTab().id == 'competenciascargos'){
                    var nivComp = vista.gpNivelesCompetenciasCargos.getSelectionModel().getSelections();

                    for (var i = 0; i < nivComp.length; i++) {
                        idsNCC.push(nivComp[i].data.idnivelcompetencia);
                    }
                    eliminarNCC();
                } else if(!vista.btnEliminarCP.disabled && vista.tabPanel.getActiveTab().id == 'competenciasprocesos'){
                    var compProc = vista.gpCompetenciasProcesos.getSelectionModel().getSelections();
                    idsCP = new Array();
                    for (var i = 0; i < compProc.length; i++) {
                        idsCP.push(compProc[i].data.iddcompetencia);
                    }
                    eliminarCP();
                } else if(!vista.btnEliminarNC.disabled && vista.tabPanel.getActiveTab().id == 'competenciasorganizacion'){
                    var nivComp = vista.gpNivelesCompetencias.getSelectionModel().getSelections();

                    for (var i = 0; i < nivComp.length; i++) {
                        idsNC.push(nivComp[i].data.idnivelcompetencia);
                    }
                    eliminarNC();
                } else if(!vista.btnEliminarNCP.disabled && vista.tabPanel.getActiveTab().id == 'competenciasprocesos'){
                    var nivCompProc = vista.gpNivelesCompetenciasProcesos.getSelectionModel().getSelections();

                    for (var i = 0; i < nivCompProc.length; i++) {
                        idsNCP.push(nivCompProc[i].data.idnivelcompetencia);
                    }
                    eliminarNCP();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptarComp.isVisible()){
                    tipo = 'estructura';
                    guardarDatosC();
                    vista.wGestionCompetencia.hide();
                    vista.fpAdicionarComp.getForm().reset();
                }
                if(vista.btnAceptarCompProcesos.isVisible()){
                    tipo = 'proceso';
                    guardarDatosC();
                    vista.wGestionCompetenciaProcesos.hide();
                    vista.fpAdicionarCompProceso.getForm().reset();
                }
                if(vista.btnAceptarCompCargos.isVisible()){
                    tipo = 'cargo';
                    guardarDatosC();
                    vista.wGestionCompetenciasCargos.hide();
                    vista.fpAdicionarCompCargos.getForm().reset();
                }
                if(vista.btnAceptarNivComp.isVisible()){
                    tipo = 'estructura';
                    guardarDatosNC();
                    vista.wGestionNivelesCompetencia.hide();
                    vista.fpAdicionarNivelesComp.getForm().reset();
                }
                if(vista.btnAceptarNivCompProcesos.isVisible()){
                    tipo = 'proceso';
                    guardarDatosNC();
                    vista.wGestionNivelesCompetenciaProcesos.hide();
                    vista.fpAdicionarNivelesCompProcesos.getForm().reset();
                }
                if(vista.btnAceptarNivCompCargos.isVisible()){
                    tipo = 'cargo';
                    guardarDatosNC();
                    vista.wGestionNivelesCompetenciasCargos.hide();
                    modelo.stNivelesCompetencias.baseParams.idescala = vista.gpCompetenciasCargos.getSelectionModel().getSelected().data.idescala;
                    modelo.stNivelesCompetencias.removeAll();
                    vista.fpAdicionarNivelesCompCargos.getForm().reset();
                }
            }
        }]);

    }
};
