/*
 * Gestionar recién graduado.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionarreciengraduado
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Gestionarreciengraduado');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Capacitacion.Gestionarreciengraduado.Controlador = {
    init: function (idioma, vista, modelo) {

        var accion, accionper, node, rgselect, jefeinmed, tutorselect, rg, evaluar;
        var columnsNew = new Array();
        var datIn = {
            jefeinmediato: '-',
            tutor: '-',
            fdesde: '-',
            ffinprep: '-',
            tiempo: '-'
        };
        vista.plantillaDatos.overwrite(vista.pDatos.body, datIn);

        Ext.Ajax.request({
            url: 'getLimites',
            params: {},
            method: "POST",
            callback: function () {
            },
            success: function (r) {
                var responseData = Ext.decode(r.responseText);
                vista.nfPeriodoPrep.minValue = responseData[0].lminPP;
                vista.nfPeriodoPrep.maxValue = responseData[0].lmaxPP;
                vista.nfTiempo.maxValue = responseData[0].lmaxExtPP;
            }
        });

        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stPersonas.baseParams.idestructura = node.attributes.id;
            modelo.stRecienGraduados.baseParams.idcargo = null;
            modelo.stRecienGraduados.baseParams = {idestructura: node.attributes.id};
            modelo.stRecienGraduados.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == 7) {
                modelo.stRecienGraduados.baseParams.idcargo = node.attributes.id;
                modelo.stRecienGraduados.baseParams.idestructura = null;
                modelo.stPersonas.baseParams.idcargo = node.attributes.id;
                modelo.stPersonas.baseParams.idestructura = null;
            } else {
                modelo.stRecienGraduados.baseParams.idestructura =  node.attributes.id;
                modelo.stRecienGraduados.baseParams.idcargo = null;
                modelo.stPersonas.baseParams.idestructura = node.attributes.id;
                modelo.stPersonas.baseParams.idcargo = null;
            }
            modelo.stRecienGraduados.removeAll();
            vista.tabPanel.disable();
            modelo.stRecienGraduados.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpReciengraduado.getSelectionModel().on('rowselect', function () {
            if (vista.gpReciengraduado.getSelectionModel().getSelections().length == 1) {
                vista.btnModificar.enable();
                rg = vista.gpReciengraduado.getSelectionModel().getSelected().data;
                var datPers = {
                    jefeinmediato: rg.jefeinmediato,
                    tutor: rg.tutor,
                    fdesde: rg.fdesde,
                    ffinprep: rg.ffinprep,
                    tiempo: rg.tiempo+' meses',
                    periodo: rg.periodo
                };
                vista.tabPanel.enable();
                if (vista.tabPanel.getActiveTab().id == 'gpExtensiones') {
                    modelo.stExtensiones.baseParams.idreciengraduado = rg.idreciengraduado;
                    modelo.stExtensiones.load();
                } else if (vista.tabPanel.getActiveTab().id == 'PanelTareas') {
                    vista.pTareas.idreciengraduado = rg.idreciengraduado;
                    vista.pTareas.stTareas.baseParams.idreciengraduado = rg.idreciengraduado;
                    vista.pTareas.stTareas.load();
                } else if (vista.tabPanel.getActiveTab().id == 'pPeriodos') {
                    modelo.stPeriodosRG.baseParams.idreciengraduado = rg.idreciengraduado;
                    modelo.stPeriodosRG.load();
                }
            } else {
                var datPers = {
                    jefeinmediato: 'Cargando...',
                    tutor: 'Cargando...',
                    fdesde: 'Cargando...',
                    ffinprep: 'Cargando...',
                    tiempo: 'Cargando...'
                };
                vista.tabPanel.disable();
            }
            vista.plantillaDatos.overwrite(vista.pDatos.body, datPers);
            vista.btnEliminar.enable();
        });

        vista.gpReciengraduado.getSelectionModel().on('rowdeselect', function () {
            modelo.stExtensiones.removeAll();
            vista.tabPanel.disable();
            vista.plantillaDatos.overwrite(vista.pDatos.body, datIn);
            vista.btnEliminar.disable();
            vista.btnEliminar.disable();
        });

        vista.gpPersonas.getSelectionModel().on('rowselect', function () {
            if (vista.elemento == 1) {
                rgselect = vista.gpPersonas.getSelectionModel().getSelected();
                vista.tfRecienGraduado.setValue(rgselect.data.idpersona);
                vista.tfRecienGraduado.setRawValue(rgselect.data.nombreyapellidosorden);
            } else if (vista.elemento == 2) {
                tutorselect = vista.gpPersonas.getSelectionModel().getSelected();
                if (tutorselect.data.idpersona != rgselect.data.idpersona) {
                    vista.tfTutor.setValue(rgselect.data.idpersona);
                    vista.tfTutor.setRawValue(tutorselect.data.nombreyapellidosorden);
                }  else {
                    mostrarMensaje(6, 'La persona seleccionada no puede ser tutor de el mismo.');
                }
            } else {
                jefeinmed = vista.gpPersonas.getSelectionModel().getSelected();
                vista.tcbCargosJefe.setValue(jefeinmed.data.idpersona);
                vista.tcbCargosJefe.setRawValue(jefeinmed.data.nombreyapellidosorden);
            }
            vista.windPersonas.hide();
        });

        modelo.stPersonas.on('load', function () {
            vista.sfBuscarPer.enable();
            if (vista.elemento == 2) {
                //modelo.stPersonas.remove(rgselect);
            }
        });

        vista.gpExtensiones.getSelectionModel().on('rowselect', function () {
            vista.btnEliminarExt.enable();
        });

        vista.gpIndicadoresRG.getSelectionModel().on('rowselect', function () {
            modelo.stValores.baseParams.idescala = vista.gpIndicadoresRG.getSelectionModel().getSelected().data.idescala;
            if (evaluar == 2) {
                modelo.stValores.load();
            }
            vista.btnAceptarInd.enable();
        });

        vista.gpIndicadoresRG.getSelectionModel().on('rowdeselect', function () {
            if (vista.gpIndicadoresRG.getSelectionModel().getSelections().length == 0) {
                vista.btnAceptarInd.disable();
            }
        });

        vista.gpPeriodosRG.getSelectionModel().on('rowselect', function () {
            vista.btnEliminarPer.enable();
            vista.btnModificarPer.enable();
            Ext.getCmp('idbtnevalind').enable();
        });

        modelo.stExtensiones.on('load', function () {
            vista.btnEliminarExt.disable();
            modelo.stExtensiones.each(function(rec){
                var valor = vista.nfTiempo.maxValue;
                vista.nfTiempo.maxValue = valor - rec.data.tiempo;
            });
        });

        modelo.stPeriodosRG.on('load', function () {
            vista.btnEliminarPer.disable();
            vista.btnModificarPer.disable();
            Ext.getCmp('idbtnevalind').disable();
        });

        vista.tcbCargosJefe.tree.on('click', function (n) {
            if (n.attributes.idconcepto == 7) {
                if (n.attributes.cantidad_real > 0) {
                    cargo = n.attributes;
                    modelo.stPersonas.baseParams.idcargo = cargo.id;
                    modelo.stPersonas.baseParams.idestructura = null;
                    modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscarPer.getValue()},
                        callback: function (r, opt, suc) {
                            if (modelo.stPersonas.getCount() > 1) {
                                vista.elemento = 3;
                                vista.windPersonas.show();
                                vista.windPersonas.setTitle('Seleccionar jefe inmediato');
                                vista.gpPersonas.getSelectionModel().clearSelections();
                            } else if (modelo.stPersonas.getCount() == 1) {
                                jefeinmed = modelo.stPersonas.getAt(0);
                                vista.tcbCargosJefe.setValue(jefeinmed.data.idpersona);
                                vista.tcbCargosJefe.setRawValue(jefeinmed.data.nombreyapellidosorden);
                            } else {
                                mostrarMensaje(6, 'Este cargo tiene la plantilla vacía.');
                            }
                        }});
                    vista.tcbCargosJefe.setValue('');
                    vista.tcbCargosJefe.setRawValue('');
                } else {
                    mostrarMensaje(6, 'Este cargo tiene la plantilla vacía.');
                }
            } else {
                mostrarMensaje(6, 'Debe seleccionar un cargo.');
                vista.tcbCargosJefe.setValue('');
                vista.tcbCargosJefe.setRawValue('');
            }
        });

        modelo.tlcargos.on('beforeload', function (tl, n) {
            if (tl.isLoading()) {
                return false;
            } else {
                tl.baseParams.idestructura = rg.idarea;
            }
        });

        modelo.stRecienGraduados.on('load', function () {
            vista.gpReciengraduado.getSelectionModel().clearSelections();
            vista.sfBuscar.enable();
            vista.btnEliminar.disable();
            vista.btnModificar.disable();
            modelo.stExtensiones.removeAll();
            vista.plantillaDatos.overwrite(vista.pDatos.body, datIn);
        });

        modelo.stIndRG.on('load', function () {
            vista.gpIndicadoresRG.getSelectionModel().clearSelections();
            var objrec = [];
            if (evaluar == 1) {
                modelo.stIndRG.each(function (rec) {
                    if (!Ext.isEmpty(rec.data.idrgindicador)) {
                        objrec.push(rec);
                    }
                });
                vista.smselectindrg.selectRecords(objrec);
            } else {
                modelo.stIndRG.each(function (rec) {
                    if (Ext.isEmpty(rec.data.idrgindicador)) {
                        modelo.stIndRG.remove(rec);
                    }
                });
            }
        });

        vista.tabPanel.on('tabchange', function(){
            if (vista.tabPanel.getActiveTab().id == 'gpExtensiones') {
                modelo.stExtensiones.baseParams.idreciengraduado = rg.idreciengraduado;
                modelo.stExtensiones.load();
            } else if (vista.tabPanel.getActiveTab().id == 'PanelTareas') {
                vista.pTareas.idreciengraduado = rg.idreciengraduado;
                vista.pTareas.stTareas.baseParams.idreciengraduado = rg.idreciengraduado;
                vista.pTareas.stTareas.load();
            } else if (vista.tabPanel.getActiveTab().id == 'pPeriodos') {
                modelo.stPeriodosRG.baseParams.idreciengraduado = rg.idreciengraduado;
                modelo.stPeriodosRG.load();
            }
        });

        vista.btnEliminar.on('click', function () {
            eliminar();
        });

        vista.btnEliminarExt.on('click', function () {
            eliminarExt();
        });

        vista.btnAdicionarExt.on('click', function () {
            vista.windAddExtension.show();
            vista.formAddExt.getForm().reset();
        });

        Ext.getCmp('idbtnaddind').on('click', function () {
            evaluar = 1;
            vista.btnAceptarInd.show();
            vista.btnAceptarInd.disable();
            modelo.stIndRG.baseParams.idreciengraduado = rg.idreciengraduado;
            modelo.stIndRG.load();
            vista.windAddIndRG.setTitle('Adicionar indicador');
            vista.windAddIndRG.show();
            vista.gpIndicadoresRG.getColumnModel().setHidden(2, true);
        });

        Ext.getCmp('idbtnevalind').on('click', function () {
            evaluar = 2;
            vista.btnAceptarInd.hide();
            modelo.stIndRG.baseParams.idreciengraduado = rg.idreciengraduado;
            modelo.stIndRG.load({params: {idrgperiodo: vista.gpPeriodosRG.getSelectionModel().getSelected().data.idrgperiodo}});
            vista.windAddIndRG.setTitle('Evaluar indicador');
            vista.windAddIndRG.show();
            vista.gpIndicadoresRG.getColumnModel().setHidden(2, false);
        });

        vista.btnExportarEval.setHandler(function () {
            var params;
            params = Ext.urlEncode({
                idreciengraduado: rg.idreciengraduado
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Evaluaci&oacute;n del recieacute;n graduado',
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
                    'beforeshow': function () {
                        vista.tabPanel.enable();
                    },
                    'hide': function () {
                        if (vista.gpReciengraduado.getSelectionModel().getSelected()) {
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
                        '/pvd/capacitacion/index.php/gestionarreciengraduado/generarEvaluacion?' + params
                    }
                }
            }).show();
            Ext.getCmp('wineval').maximize();

            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando evaluaci&oacute;n.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            };
        });

        vista.btnEliminarPer.on('click', function () {
            eliminarPer();
        });

        vista.btnAdicionarPer.setHandler(function () {
            accionper = 'add';
            vista.winAddPer.show();
            vista.btnAplicarp.show();
            vista.winAddPer.setTitle('Adicionar periodo');
        });

        vista.btnAceptarp.setHandler(function () {
            guardarPeriodo('ACP');
        });

        vista.btnAplicarp.setHandler(function () {
            guardarPeriodo('APL');
        });

        vista.btnModificarPer.setHandler(function () {
            accionper = 'mod';
            vista.winAddPer.show();
            vista.btnAplicarp.hide();
            vista.winAddPer.setTitle('Modificar periodo');
            vista.formAddPeriodo.getForm().loadRecord(vista.gpPeriodosRG.getSelectionModel().getSelected());
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            modelo.stPeriodos.load();
            vista.ventanaGestion.show();
            vista.btnAplicar.show();
            vista.ventanaGestion.setTitle(idioma.msgAdd);
            vista.formularioGestion.getForm().reset();
            vista.tcbCargosJefe.setValue('');
            vista.tcbCargosJefe.setRawValue('');
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            var obj = vista.gpReciengraduado.getSelectionModel().getSelected().data;
            vista.ventanaGestion.show();
            vista.btnAplicar.hide();
            vista.ventanaGestion.setTitle(idioma.msgMod);
            rgselect = {
                data: {
                    idpersona: obj.idpersona
                }
            };
            jefeinmed = {
                data: {
                    idpersona: obj.idjefeinmediato
                }
            };
            tutorselect = {
                data: {
                    idpersona: obj.idtutor
                }
            };
            var rootNod = vista.tcbCargosJefe.tree.getRootNode();
            vista.tcbCargosJefe.tree.getLoader().load(rootNod);
            vista.formularioGestion.getForm().loadRecord(vista.gpReciengraduado.getSelectionModel().getSelected());
            vista.tfRecienGraduado.setValue(rgselect.data.idpersona);
            vista.tfRecienGraduado.setRawValue(obj.nombreyapellidos);
            vista.tcbCargosJefe.setValue(jefeinmed.data.idpersona);
            vista.tcbCargosJefe.setRawValue(obj.jefeinmediato);
            vista.tfTutor.setValue(tutorselect.data.idpersona);
            vista.tfTutor.setRawValue(obj.tutor);
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

        vista.btnAceptarExt.on('click', function () {
            guardarDatosExt();
        });

        vista.btnAceptarInd.on('click', function () {
            guardarInd();
        });

        vista.btnCancelarExt.on('click', function () {
            vista.windAddExtension.hide();
        });

        vista.btnCancelarInd.on('click', function () {
            vista.windAddIndRG.hide();
        });

        vista.windPersonas.on('beforeshow', function () {
            if (vista.elemento != 3) {
                modelo.stPersonas.removeAll();
                modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscarPer.getValue()}});
            }
        });

        function guardarDatos(btnpress)
        {
            if(vista.formularioGestion.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addRecienGraduado' : 'updateRecienGraduado'),
                    params: {
                        idreciengraduado: accion == 'add' ? -1 : vista.gpReciengraduado.getSelectionModel().getSelected().data.idreciengraduado,
                        idpersona: rgselect.data.idpersona,
                        idjefeinmediato: jefeinmed.data.idpersona,
                        idtutor: tutorselect.data.idpersona,
                        fdesde: vista.dfFechaIP.getRawValue(),
                        tiempo: vista.nfPeriodoPrep.getValue(),
                        fhastass: vista.dfFechaFSS.getRawValue()
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
                            vista.tcbCargosJefe.setValue('');
                            vista.tcbCargosJefe.setRawValue('');
                            modelo.stRecienGraduados.removeAll();
                            modelo.stRecienGraduados.reload();
                        } else {
                            mostrarMensaje(6,idioma.msgExistem);
                        }
                    }
                });
            }
        }

        function guardarDatosExt()
        {
            if(vista.formAddExt.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: 'addExtension',
                    params: {
                        idreciengraduado: vista.gpReciengraduado.getSelectionModel().getSelected().data.idreciengraduado,
                        fdesde: vista.dfFechaExt.getRawValue(),
                        tiempo: vista.nfTiempo.getValue()
                    },
                    callback: function (){Ext.getBody().unmask();},
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            mostrarMensaje(1, 'Los datos han sido adicionados satisfactoriamente.');
                            vista.windAddExtension.hide();
                            vista.formAddExt.getForm().reset();
                            modelo.stExtensiones.removeAll();
                            modelo.stExtensiones.reload();
                        } else {
                            mostrarMensaje(6,idioma.msgExistem);
                        }
                    }
                });
            }
        }

        function guardarInd() {
            var ids = new Array();
            var s = vista.gpIndicadoresRG.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.idindicador);
            }
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: 'addIndicador',
                params: {
                    idindicadores: Ext.encode(ids),
                    idreciengraduado: rg.idreciengraduado
                },
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'Los datos han sido adicionados satisfactoriamente.');
                        vista.windAddIndRG.hide();
                        modelo.stIndRG.removeAll();
                        modelo.stIndRG.reload();
                    } else {
                        mostrarMensaje(6, idioma.msgExistem);
                    }
                }
            });
        }

        function guardarPeriodo(btn) {
            Ext.Ajax.request({
                url: (accionper == 'add') ? 'addPeriodo' : 'updatePeriodo',
                params: {
                    idrgperiodo: (accionper == 'mod') ? vista.gpPeriodosRG.getSelectionModel().getSelected().data.idrgperiodo : -1,
                    idreciengraduado: rg.idreciengraduado,
                    denominacion: vista.tfdenom.getValue(),
                    fdesde: vista.dfFInicio.getRawValue(),
                    fhasta: vista.dfFFin.getRawValue()
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData == true) {
                        if (accionper == 'add') {
                            mostrarMensaje(1, 'El periodo fue adicionado satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'El periodo fue modificado satisfactoriamente.');
                        }
                    } else {
                        mostrarMensaje(6, 'Ocurrió un error mientras se guardaban los datos.');
                    }
                    if (btn == 'ACP') {
                        vista.winAddPer.hide();
                    }
                    vista.formAddPeriodo.getForm().reset();
                    modelo.stPeriodosRG.reload();
                }
            });
        }

        function eliminar()
        {
            var ids = new Array();
            var s = vista.gpReciengraduado.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idreciengraduado);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el reci&eacute;n graduado seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los reci&eacute;n graduados seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteRecienGraduado',
                        params: {idsreciengraduado: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El reci&eacute;n graduado seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los reci&eacute;n graduados seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El reci&eacute;n graduado ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los reci&eacute;n graduados han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stRecienGraduados.removeAll();
                            modelo.stRecienGraduados.reload();
                        }
                    });
                }
            });
        }

        function eliminarExt()
        {
            var ids = new Array();
            var s = vista.gpExtensiones.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idextensionprep);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la extensi&oacute;n seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las extensi&oacute;nes seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteExtension',
                        params: {idextensiones: Ext.encode(ids)},
                        callback: function (){Ext.getBody().unmask();},
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La extensi&oacute;n seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las extensi&oacute;nes seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La extensi&oacute;n seleccionada ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las extensi&oacute;nes seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stExtensiones.removeAll();
                            modelo.stExtensiones.reload();
                        }
                    });
                }
            });
        }

        function eliminarPer() {
            var ids = new Array();
            var s = vista.gpPeriodosRG.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.idrgperiodo);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el periodo seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los periodos seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deletePeriodos',
                        params: {periodos: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El periodo seleccionado no puede ser eliminado debido a que se' +
                                        ' encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los periodos seleccionados no puede ser eliminado' +
                                        ' debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El periodo seleccionado ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los periodos seleccionados han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stPeriodosRG.removeAll();
                            modelo.stPeriodosRG.reload();
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
                        if(vista.tabPanel.getActiveTab().id == 'gpExtensiones' && !vista.tabPanel.disabled){
                            vista.windAddExtension.show();
                            vista.formularioGestion.getForm().reset();
                        } else if(!vista.btnAdicionar.disabled){
                            accion = 'add';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.show();
                            vista.ventanaGestion.setTitle(idioma.msgAdd);
                            vista.formularioGestion.getForm().reset();
                            vista.tcbCargosJefe.setValue('');
                            vista.tcbCargosJefe.setRawValue('');
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            var obj = vista.gpReciengraduado.getSelectionModel().getSelected().data;
                            vista.ventanaGestion.show();
                            vista.btnAplicar.hide();
                            vista.ventanaGestion.setTitle(idioma.msgMod);
                            rgselect = {
                                data: {
                                    idpersona: obj.idpersona
                                }
                            };
                            jefeinmed = {
                                data: {
                                    idpersona: obj.idjefeinmediato
                                }
                            };
                            tutorselect = {
                                data: {
                                    idpersona: obj.idtutor
                                }
                            };
                            vista.formularioGestion.getForm().loadRecord(vista.gpReciengraduado.getSelectionModel().getSelected());
                            vista.tfRecienGraduado.setValue(rgselect.data.idpersona);
                            vista.tfRecienGraduado.setRawValue(obj.nombreyapellidos);
                            vista.tcbCargosJefe.setValue(jefeinmed.data.idpersona);
                            vista.tcbCargosJefe.setRawValue(obj.jefeinmediato);
                            vista.tfTutor.setValue(tutorselect.data.idpersona);
                            vista.tfTutor.setRawValue(obj.tutor);

                        }
                        break;
                    }
                    case 76:{ //l para limpiar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger1Click();
                        } else if (!vista.sfBuscarPer.getValue() != '') {
                            vista.sfBuscarPer.onTrigger1Click();
                        }
                        break;
                    }
                    case 66:{ //b para buscar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger2Click();
                        } else if (!vista.sfBuscarPer.getValue() != '') {
                            vista.sfBuscarPer.onTrigger2Click();
                        }
                        break;
                    }
                    case 88:
                    { //x para cancelar
                        if (vista.btnCancelarExt.isVisible()) {
                            vista.windAddExtension.hide();
                        } else if (vista.btnCancelar.isVisible) {
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
                } else if(!vista.btnEliminarExt.disabled){
                    eliminarExt();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    guardarDatos('ACP');
                } else if (vista.btnAceptarExt.isVisible()) {
                    guardarDatosExt();
                }
            }
        },{
            key: 'p',
            alt: true,
            ctrl: true,
            //stopEvent: true,
            fn: function () {
                if (!vista.btnAplicar.disabled) {
                    guardarDatos('APL');
                }
            }
        }]);
    }
};
