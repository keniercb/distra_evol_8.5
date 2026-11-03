/**
 * Interfaz para evaluar los recursos*
 *
 * @author Tte. Ing. Javier Rodríguez López*
 * @package PVD *
 * @subpackage Evaluaciones *
 * @copyright UCID-ERP Cuba 10 *
 */

Ext.ns('Ext.PVD.Evaluaciones.Evaluar');
Ext.PVD.Evaluaciones.Evaluar.WinEvaluarXProcesoEval = Ext.extend(Ext.Window, {
    layout: 'border',
    initComponent: function () {
        var self = this;

        this.title = 'Evaluar per&iacute;odo: ' + this.procesoEval.get('denominacion');

        this.btnEvaluar = new Ext.Button({
            id:'btnEvaluar',
            //hidden:true,
            text: this.labels.lbBtnEvaluar,
            tooltip: this.labels.ttpBtnEvaluar, 
            iconCls: 'evaluar', 
            disabled: true,
            handler: function () {
              showWinEvaluarTreeIndicadores(true, self.procesoEval, self.cmpEvaluados, false);
            }
        });

        this.btnVerEvaluacion = new Ext.Button({
            text: this.labels.lbBtnVerEval,
            tooltip: this.labels.ttpBtnVerEval,
            iconCls: 'ver',
            disabled: true,
            handler: function () {
                showWinEvaluarTreeIndicadores(false, self.procesoEval, self.cmpEvaluados, true,0);
            }
        });

        this.btnVerReclamacion = new Ext.Button({
            text: 'Ver reclamaci&oacute;n',
            tooltip: 'Ver reclamaciones (<b>ALt+R</b>)',
            iconCls: 'ver',
            disabled: true,
            handler: function () {
                showWinReclamacion(false, self.procesoEval, self.cmpEvaluados);
            }
        });

        this.btnNoEvaluar = new Ext.Button({
            text: this.labels.lbBtnNoEvaluar,
            tooltip: this.labels.ttpBtnNoEvaluar,
            iconCls: 'noevaluado',
            disabled: true,
            handler: function () {
                showWinNoEvaluados();
            }
        });

        this.btnEstadoDesarrollo = new Ext.Button({
            text: 'Estado de desarrollo',
            tooltip: 'Estado de desarrollo (<b>Alt+D</b>)',
            iconCls: 'chart_up',
            disabled: true,
            handler: function () {
                showWinEstadoDesarrollo();
            }
        });

        this.btnOpinionEvaluado = new Ext.Button({
            text: 'Reclamación',//'Opini&oacute;n',
            tooltip: 'Opini&oacute;n del evaluado (<b>ALt+O</b>)',
            iconCls: 'informe',
            hidden: self.procesoEval.get('opinionevaluado') == true ? false : true,
            handler: function () {
                showWinOpinionEvaluado();
            }
        });


        this.btnPerfilInd = new Ext.Button({
            text: 'Gráficas de perfiles',
            tooltip: 'Ver perfil de indicadores de las personas seleccionadas (<b>ALt+I</b>)',
            iconCls: 'chart_bar',
            disabled: true,
            menu: {
                items: [
                    {
                        text: 'Perfil de indicadores',
                        tooltip: 'Ver perfil de indicadores de las personas seleccionadas (<b>ALt+I</b>)',
                        iconCls: 'chart_bar',
                        //disabled: true,
                        handler: function () {

                            var recEvaluado = self.cmpEvaluados.getSelectionModel().getSelected();
                            var win = new Ext.Evaluaciones.PerfilIndicadores({
                                personas: self.cmpEvaluados.getSelectionModel().getSelections(),
                                idpersonaevaluacion: self.cmpEvaluados.getSelectionModel().getSelected().get('idpersonaevaluacion'),
                                idplanilla: recEvaluado.get('idplanilla'),
                                idmodelo: recEvaluado.get('idmodelo'),
                                width: '90%',
                                height: '90%'
                            });
                            win.show();
                            win.maximize();
                            win.on('close', function () {
                                self.cmpEvaluados.getSelectionModel().clearSelections();
                            }, this);
                        }
                    },{
                        text: 'Perfil de indicadores y períodos',
                        tooltip: 'Ver perfil de indicadores de la persona por períodos (<b>ALt+I</b>)',
                        iconCls: 'chart_bar',
                        //disabled: true,
                        handler: function () {
                            /*
                             @TODO
                             Validar que si las personas seleccionadas tienen distinto idplanilla no se puede habilitaar el boton
                             */
                            var recEvaluado = self.cmpEvaluados.getSelectionModel().getSelected();

                            var idpreprocesoevaluativo = self.idpreprocesoevaluativo.data.idpreprocesoevaluativo;

                            var win = new Ext.Evaluaciones.PerfilIndicadoresperiodo({
                                idpersona: recEvaluado.get('idpersona'),
                                idpersonaevaluacion: self.cmpEvaluados.getSelectionModel().getSelected().get('idpersonaevaluacion'),
                                personas: self.cmpEvaluados.getSelectionModel().getSelections(),
                                idplanilla: recEvaluado.get('idplanilla'),
                                idmodelo: recEvaluado.get('idmodelo'),
                                idpreprocesoevaluativo: idpreprocesoevaluativo,
                                width: '90%',
                                height: '90%',
                                nombrecompleto:recEvaluado.get('nombrecompleto')
                            });
                            win.show();
                            win.maximize();
                            win.on('close', function () {
                                self.cmpEvaluados.getSelectionModel().clearSelections();
                            }, this);

                        }
                    },
                    {
                        text: 'An&aacute;lisis por per&iacute;odo',
                        tooltip: 'Ver perfil de evaluaciones de las personas seleccionadas (<b>ALt+E</b>)',
                        iconCls: 'chart_bar',
                        //disabled: true,
                        handler: function () {
                            /*
                             @TODO
                             Validar que si las personas seleccionadas tienen distinto idplanilla no se puede habilitaar el boton
                             */
                            var recEvaluado = self.cmpEvaluados.getSelectionModel().getSelected();
                            var idpreprocesoevaluativo = self.idpreprocesoevaluativo.data.idpreprocesoevaluativo;
                            var win = new Ext.Evaluaciones.PerfilPeriodo({
                                personas: self.cmpEvaluados.getSelectionModel().getSelections(),
                                idpersonaevaluacion: self.cmpEvaluados.getSelectionModel().getSelected().get('idpersonaevaluacion'),
                                idperiodo: self.idperiodo,
                                idpreprocesoevaluativo: idpreprocesoevaluativo,
                                width: '90%',
                                height: '90%'
                            });
                            win.show();
                            win.maximize();
                            win.on('close', function () {
                                self.cmpEvaluados.getSelectionModel().clearSelections();
                            }, this);
                        }
                    }

                ]
            }

        });

        this.btnPerfilIndPeriodo = new Ext.Button({
            text: 'Perfil personal',
            tooltip: 'Ver perfil de indicadores de las persona por períodos (<b>ALt+I</b>)',
            iconCls: 'chart_bar',
            disabled: true,
            handler: function () {
                /*
                 @TODO
                 Validar que si las personas seleccionadas tienen distinto idplanilla no se puede habilitaar el boton
                 */
                var recEvaluado = self.cmpEvaluados.getSelectionModel().getSelected();

                var idpreprocesoevaluativo = self.idpreprocesoevaluativo.data.idpreprocesoevaluativo;

                var win = new Ext.Evaluaciones.PerfilIndicadoresperiodo({
                    idpersona: recEvaluado.get('idpersona'),
                    personas: self.cmpEvaluados.getSelectionModel().getSelections(),
                    idplanilla: recEvaluado.get('idplanilla'),
                    idmodelo: recEvaluado.get('idmodelo'),
                    idpreprocesoevaluativo: idpreprocesoevaluativo,
                    width: '90%',
                    height: '90%',
                    nombrecompleto:recEvaluado.get('idplanilla')
                });
                win.show();
                win.maximize();
                win.on('close', function () {
                    self.cmpEvaluados.getSelectionModel().clearSelections();
                }, this);

            }
        });

        this.btnPerfilPeriodo = new Ext.Button({
            text: 'An&aacute;lisis por per&iacute;odo',
            tooltip: 'Ver perfil de evaluaciones de las personas seleccionadas (<b>ALt+E</b>)',
            iconCls: 'chart_bar',
            disabled: true,
            handler: function () {
                /*
                 @TODO
                 Validar que si las personas seleccionadas tienen distinto idplanilla no se puede habilitaar el boton
                 */
                var recEvaluado = self.cmpEvaluados.getSelectionModel().getSelected();
                var idpreprocesoevaluativo = self.idpreprocesoevaluativo.data.idpreprocesoevaluativo;
                var win = new Ext.Evaluaciones.PerfilPeriodo({
                    personas: self.cmpEvaluados.getSelectionModel().getSelections(),
                    idperiodo: self.idperiodo,
                    idpreprocesoevaluativo: idpreprocesoevaluativo,
                    width: '90%',
                    height: '90%'
                });
                win.show();
                win.maximize();
                win.on('close', function () {
                    self.cmpEvaluados.getSelectionModel().clearSelections();
                }, this);
            }
        });

        this.btnImprimir = new Ext.Toolbar.MenuButton({
            text: this.labels.lbBtnPrint,
            tooltip: this.labels.ttpBtnPrintAll,
            iconCls: 'imprimir',
            // Menus can be built/referenced by using nested menu config objects
            menu: {
                items: [
                    {
                        text: this.labels.lbBtnPrintSelectedPersona,
                        iconCls: 'imprimir',
                        id: 'menuImprimir',
                        handler: function () {
                            var arrRec = self.cmpEvaluados.getSelectionModel().getSelections();
                            var arrIdPers = new Array();
                            Ext.each(arrRec, function (procesoEval) {
                                if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                                    arrIdPers.push(procesoEval.get('idpersona'));
                                }
                            });

                            if (arrIdPers.length > 0) {
                                mostrarMensaje(2, "Desea imprimir incluyendo complemento textual de los indicadores", function (btn) {
                                    if (btn == "ok") {
                                        imprimirEvaluados(arrIdPers,1);
                                    }else{
                                        imprimirEvaluados(arrIdPers,0);
                                    }
                                });

                            } else {
                                mostrarMensaje(3, 'Solo se pueden imprimir la evaluaciones de las personas con estado de <b>Evaluado</b> o <b>En reclamaci&oacute;n</b>');
                            }
                        }
                    },{
                        text: 'Imprimir la evaluación mensual del desempeño de los cuadros',
                        iconCls: 'imprimir',
                        id: 'menuImprimirCuadros',
                        handler: function () {
                            var arrRec = self.cmpEvaluados.getSelectionModel().getSelections();
                            var arrIdPers = new Array();
                            Ext.each(arrRec, function (procesoEval) {
                                if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                                    arrIdPers.push(procesoEval.get('idpersona'));
                                }
                            });
                            if (arrIdPers.length > 0) {
                                imprimirEvaluadosCuadros(arrIdPers,0);
                                // mostrarMensaje(2, "Desea imprimir incluyendo complemento textual de los indicadores", function (btn) {
                                //     if (btn == "ok") {
                                //         imprimirEvaluadosCuadros(arrIdPers,1);
                                //     }else{
                                //         imprimirEvaluadosCuadros(arrIdPers,0);
                                //     }
                                // });
                            } else {
                                mostrarMensaje(3, 'Solo se pueden imprimir la evaluaciones de las personas con estado de <b>Evaluado</b> o <b>En reclamaci&oacute;n</b>');
                            }
                        }
                    }
                ]
            },
            //**********Imprimir todos**********//
            handler: function () {
                var arrRec = self.stEvaluados.getRange();
                var arrIdPers = new Array();
                Ext.each(arrRec, function (procesoEval) {
                    if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                        arrIdPers.push(procesoEval.get('idpersona'));
                    }
                });
                if (arrIdPers.length > 0) {
                    mostrarMensaje(2, "Desea imprimir incluyendo complemento textual de los indicadores", function (btn) {
                        if (btn == "ok") {
                            imprimirEvaluados(arrIdPers,1);
                        }else{
                            imprimirEvaluados(arrIdPers,0);
                        }
                    });
                } else {
                    mostrarMensaje(3, 'Solo se pueden imprimir la evaluaciones de las personas con estado de <b>Evaluado</b> o <b>En reclamaci&oacute;n</b>');
                }
            }
        });

        this.btnFirmar = new Ext.Toolbar.MenuButton({
            text: 'Firmar',
            tooltip: 'Firmar las evaluaciones',
            iconCls: 'contratar',
            disabled:true,
            id: 'btnFirmar',
            //hidden:true,
            menu: {
                items: [{
                    text: 'Firmar evaluación',
                    iconCls: 'contratar',
                    id: 'menuFirmar',
                    handler: function () {
                        var arrRec = self.cmpEvaluados.getSelectionModel().getSelections();
                        var arrIdPers = new Array();
                        Ext.each(arrRec, function (procesoEval) {
                            if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                                arrIdPers.push(procesoEval.get('idpersona'));
                            }
                        });

                        if (arrIdPers.length > 0) {
                            firmarEvaluados(arrIdPers,1);
                        } else {
                            mostrarMensaje(3, 'Solo se pueden firmar la evaluaciones de las personas con estado de <b>Evaluado</b> o <b>En reclamaci&oacute;n</b>');
                        }
                    }
                },{
                    text: 'Visualizar estado de la firma',
                    iconCls: 'ver',
                    id: 'menuVer',
                    handler: function () {
                        visualizarCaso();
                    }
                },{
                    text: 'Eliminar firma',
                    iconCls: 'eliminar',
                    id: 'menuEliminar',
                    handler: function () {
                        eliminarCaso();
                    }
                }
                ]
            }
        });

		this.btnGenerarRTF = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar certificación de la evaluación',
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Exportar persona seleccionada',
                        iconCls: 'exportar',
                        id: 'menuExportar',
                        handler: function () {
                            var arrRec = self.cmpEvaluados.getSelectionModel().getSelections();
                            var arrIdPers = new Array();
                            Ext.each(arrRec, function (procesoEval) {
                                if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                                    arrIdPers.push(procesoEval.get('idpersona'));
                                }
                            });
                            if (arrIdPers.length > 0) {
                                ExportarEvaluados(arrIdPers);

                            } else {
                                mostrarMensaje(3, 'Solo se pueden imprimir la evaluaciones de las personas con estado de <b>Evaluado</b> o <b>En reclamaci&oacute;n</b>');
                            }
                        }
                    }
                ]
            },
            //**********Imprimir todos**********//
            handler: function () {
                var arrRec = self.stEvaluados.getRange();
                var arrIdPers = new Array();
                Ext.each(arrRec, function (procesoEval) {
                    if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                        arrIdPers.push(procesoEval.get('idpersona'));
                    }
                });
                if (arrIdPers.length > 0) {
                    ExportarEvaluados(arrIdPers);
                } else {
                    mostrarMensaje(3, 'Solo se pueden imprimir la evaluaciones de las personas con estado de <b>Evaluado</b> o <b>En reclamaci&oacute;n</b>');
                }
            }
        });

        this.btnReportar = new Ext.Button({
            text: 'Certificación',
            disabled:true,
            tooltip: 'Certificación de la persona',
            iconCls: 'exportar',
            handler: function () {
                var arrRec = self.cmpEvaluados.getSelectionModel().getSelections();
                var arrIdPers = new Array();

                Ext.each(arrRec, function (procesoEval) {
                    arrIdPers.push({nombrecompleto:procesoEval.get('nombrecompleto'),evaluacion:procesoEval.get('evaluacion'),deacuerdo:procesoEval.get('deacuerdo'),idpersonaevaluacion:procesoEval.get('idpersonaevaluacion'),idpersona:procesoEval.get('idpersona'),idpreprocesoevaluativo:self.idpreprocesoevaluativo.data.idpreprocesoevaluativo});
                });

                window.open('http://' + window.location.host + '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/obtenerReporte?params=' +
                    Ext.encode(arrIdPers));
            }
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaRealizar',
            text: labels.lbBtnAyuda,
            tooltip: labels.ttpBtnAyuda,
            iconCls: 'ayuda'
        });
        this.btnGestDocumento = new Ext.Button({
            id: 'btnGestDocumento',
            text: 'Gestionar documento',
            disabled:true,
            tooltip: 'Gestionar documento asociado a una evaluacion',
            iconCls: 'adicionar',
             handler: function () {
                  var selections = self.cmpEvaluados.getSelectionModel().getSelections();

                 if (selections.length == 1) {
                     var valor = 0;
                     var idpersona = 0;

                     if(selections[0].data.valor!=null){
                         var valor = selections[0].data.valor;
                     }
                     if(selections[0].data.idpersona!=null){
                         var idpersona = selections[0].data.idpersona;
                     }

                     this.winGestDocumentos = new pci.gestionardocumentos.windGestDoc({
                         title: 'Gestionar documentos',
                         idpersona: idpersona,
                         valor: valor
                     });

                     var _this = this;
                     this.winGestDocumentos.on("beforeclose", function(p) {
                         if (_this.winGestDocumentos.panelFormulario.collapsed == true) {
                             _this.winGestDocumentos.panelFormulario.toggleCollapse(false);
                         }
                     });

                     this.winGestDocumentos.show();
                     this.winGestDocumentos.panelFormulario.toggleCollapse(true);

                 } else {
                     mostrarMensaje(6, 'Debe escoger una sola persona.');
                 }
             }
        });

        this.btnImportarPersExcel = new Ext.Button({
            text: 'Importar Evaluaciones',
            tooltip: 'Importar evaluaciones <b>(Ctrl+Alt+I)<b/>',
            iconCls: 'importar',
            disabled: false,
            handler: function () {
                importarFileUploadField();
            }
        });

        /*********************************GRID DE REALIZAR EVALUACION*******************************/
        this.stEvaluados = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            autoLoad: true,
            remoteSort: true,
            url: 'getEvaluadosPE',
            listeners: {
                beforeexpandnode: function (st, record) {
                    st.baseParams.idpersonaevaluador = record.get('idpersona');
                },
                beforeload: function (st, options) {
                    st.baseParams.idperiodoproceso = self.idperiodo;
                    //Validacion para que no expanda los nodos hijos
                    if (st.active_node && st.active_node.data._is_leaf) {
                        return false;
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                    id: 'idpersona',
                    root: 'datos',
                    total: 'cantidad',
                    successProperty: 'success'
                },
                [
                    {
                        name: 'idpersona'
                    },
                    {
                        name: 'idpersonaevaluacion'
                    },
                    {
                        name: 'numid'
                    },
                    {
                        name: 'sexo'
                    },
                    {
                        name: 'denomsexo'
                    },
                    {
                        name: 'nombrecompleto'
                    },
                    {
                        name: 'nombre'
                    },
                    {
                        name: 'snombre'
                    },
                    {
                        name: 'papel'
                    },
                    {
                        name: 'sapel'
                    },
                    {
                        name: 'foto'
                    },
                    {
                        name: 'icon'
                    },
                    {
                        name: 'estado'
                    },
                    {
                        name: 'nopersona'
                    },
                    {
                        name: '_parent'
                    },
                    {
                        name: '_is_leaf'
                    },
                    {
                        name: 'deacuerdo'
                    },
                    {
                        name: 'hareclamado'
                    },
                    {
                        name: 'opinionevaluado'
                    },
                    {
                        name: 'idcausanoevaluado'
                    },
                    {
                        name: 'fechaevaluado'
                    },
                    {
                        name: 'valor'
                    },
                    {
                        name: 'evaluacion'
                    },
                    {
                        name: 'color'
                    },
                    {
                        name: 'idestadodesarrollo'
                    },
                    {
                        name: 'estadodesarrollo'
                    },
                    {
                        name: 'colorestadodes'
                    },
                    {
                        name: 'idescala'
                    },
                    {
                        name: 'idplanilla'
                    },
                    {
                        name: 'idmodelo'
                    },
                    {
                        name: 'idpersonaevaluador'
                    },
                    {
                        name: 'cargo'
                    },
                    {
                        name: 'planilla'
                    },
                    {
                        name: 'idcaso'
                    }
                ]
            )
        });


        this.search = new Ext.form.TextField({
            id: 'search' + self.id,
            anchor: '100%',
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            minLength: 1,
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13 && self.search.isValid()) {
                        self.btnBuscar.handler();
                    }
                }.createDelegate(this)
            }
        });

        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            id: 'btnBuscar' + self.id,
            tooltip: 'Buscar proceso o período evaluativo <b>(Alt+B)</b>',
            text: 'Buscar',
            handler: function () {
                if (self.search.isValid()) {
                    self.stEvaluados.baseParams.denominacion = self.search.getValue();
                    self.stEvaluados.load({params: {
                        start: 0,
                        limit: 10
                    }});
                }
            }.createDelegate(this)
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar' + self.id,
            text: 'Limpiar',
            tooltip: 'Limpiar filtros <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                self.search.setValue('');
                self.stEvaluados.baseParams.denominacion = '';
                self.stEvaluados.load({params: {start: 0, limit: 10}})
            }
        });
        this.tbargrid = ['Nombre y apellidos: ', this.search,' ', this.btnBuscar, this.btnLimpiar];

        /*********************************Escala para el grid editor********************************/
            /****************************Ver si se va a utilizar asi*********************************/
        var tfDenom = new Ext.form.TextField({
            id: 'tfDenomEvaluar',
            fieldLabel: 'Evaluaci&oacute;n',
            name: 'evaluacion',
            allowBlank: false,
            anchor: '100%',
            listeners: {
                specialkey: function (cb, event) {
                    var recEvaluadosVarios = self.cmpEvaluados.getSelectionModel().getSelections();

                    var Arrpersonas = new Array();
                    if(recEvaluadosVarios.length>0){
                        Ext.each(recEvaluadosVarios, function (record) {
                            Arrpersonas.push({
                                idpersona: record.get('idpersona'),
                                idpersonaevaluacion: parseInt(record.get('idpersonaevaluacion'))
                            });
                        });
                    }
                    PVD.mostrarMascara('saveprocess', 'Espere un momento por favor...', 'Enviando datos');
                    Ext.Ajax.request({
                            url: 'guardarEvaluacionDir',
                            method: 'POST',
                            params: {
                                arraypersona:Ext.encode(Arrpersonas),
                                valor :cb.getValue(),
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('saveprocess');
                                var responseData = Ext.util.JSON.decode(response.responseText);
                                if (responseData.success) {
                                    mostrarMensaje(1, 'El resultado se modificó satisfactoriamente.');
                                    self.cmpEvaluados.getStore().reload();

                                } else {
                                    mostrarMensaje(3, 'Error al modificar la evaluación de la persona');
                                }

                            }
                        }
                    );
                }
            }
        });

        /************************************************************************************************/
        
        this.cmpEvaluados = new Ext.ux.maximgb.treegrid.GridPanel({
            region: 'center',
            margins: '5 5 5 5',
            autoExpandColumn: 'cargo' + self.id,
            master_column_id: 'nombrecompleto' + self.id,
            title: 'Listado de evaluados',
            root_title: 'Evaluados',
            stripeRows: true,
            tbar:self.tbargrid,
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando...'
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            clicksToEdit: 1,
            store: this.stEvaluados,
            columns: [
                {
                    id: 'nombrecompleto' + self.id,
                    header: 'Nombre',
                    tooltip: 'Nombre de la persona',
                    width: 250,
                    dataIndex: 'nombrecompleto',
                    renderer: this.showName
                },
                {
                    header: 'No. identidad',
                    tooltip: 'No. de identidad de la persona',
                    width: 110,
                    dataIndex: 'numid'
                },
                {
                    id: 'cargo' + self.id,
                    header: 'Cargo',
                    tooltip: 'Cargo actual de la persona',
                    width: 110,
                    dataIndex: 'cargo'
                },
                {
                    header: 'Sexo',
                    tooltip: 'Sexo de la persona',
                    width: 40,
                    dataIndex: 'sexo',
                    renderer: this.showSexo
                },
                {
                    header: 'Estado',
                    tooltip: 'Estado de la persona en el período evaluativo',
                    width: 110,
                    dataIndex: 'estado',
                    renderer: this.showStatus
                },
                {
                    header: 'Evaluación',
                    tooltip: 'Resultado de la evaluación',
                    width: 80,
                    dataIndex: 'evaluacion',
                    renderer: this.showEvalColor,
                   // editor:tfDenom,//Esto es para hacerlo por el grid editor directo esta desabilitado ahora
                },
                {
                    header: 'Estado de desarrollo',
                    tooltip: 'Estado de desarrollo de la persona en el período evaluativo',
                    width: 115,
                    dataIndex: 'estadodesarrollo',
                    renderer: this.showEstadoDesarrollo
                },
                {
                    header: 'Estado de la firma',
                    tooltip: 'Estado de la firma',
                    width: 115,
                    dataIndex: 'idcaso',
                    renderer: this.showEstadoFirma
                }
            ]
        });

       this.keys = [
         {
            key: 'e',
            alt:true,
            ctrl:true,
            fn: function(){
                if(!self.btnEvaluar.disabled ){
                    self.btnEvaluar.handler();
                }
            }
        },{
            key: 'n',
            alt:true,
            fn: function(){
                if(!self.btnNoEvaluar.disabled ){
                    self.btnNoEvaluar.handler();
                }
            }
        },{
            key: 'v',
            alt:true,
            fn: function(){
                if(!self.btnVerEvaluacion.disabled ){
                    self.btnVerEvaluacion.handler();
                }
            }
        },{
            key: 'r',
            alt:true,
            fn: function(){
                if(!self.btnVerReclamacion.disabled ){
                    self.btnVerReclamacion.handler();
                }
            }
        },{
            key: 'd',
            alt:true,
            fn: function(){
                if(!self.btnEstadoDesarrollo.disabled ){
                    self.btnEstadoDesarrollo.handler();
                }
            }
        },{
            key: 'o',
            alt:true,
            fn: function(){
                self.btnOpinionEvaluado.handler();
            }
        },{
           key: 'i',
           alt:true,
           fn: function(){
               if(!self.btnPerfilInd.disabled ){
                   self.btnPerfilInd.handler();
               }
           }
       },
           {
               key: 'p',
               alt:true,
               fn: function(){
                   if(!self.btnImprimir.disabled ){
                       self.btnImprimir.handler();
                   }
               }
           },
           {
               key: 'e',
               alt:true,
               fn: function(){
                   if(!self.btnPerfilPeriodo.disabled ){
                       self.btnPerfilPeriodo.handler();
                   }
               }
           }
        ];
        var qtip = null;

        this.cmpEvaluados.on('mouseover', function (e) {
            var t = e.getTarget();
            var v = this.getView();
            var rowIndex = v.findRowIndex(t);

            if (rowIndex !== false) {
                var rec = this.getStore().getAt(rowIndex);

                var imgSexo = '';
                if (rec.get('nopersona') == 0) {
                    imgSexo = "<b> Sexo:</b> <div class='" + (rec.get('sexo') == 1 ? 'male' : 'female') + "' style='width: 16px; height: 16px;'></div> <br />";
                }
                var srcImg = rec.get('foto');
                var html = '<table width="90%" border="0" cellspacing="0" cellpadding="1" style="text-align: center;' +
                    ' font-size: 11px">' + '<tr>' + '<td>' + '<table width="100%" border="0" cellspacing="0" cellpadding="4">' + '<tr>' + '<td width="10%" style="text-align: center; ' +
                    'vertical-align: top">' + '<img src="' + srcImg + '" width="70" height="70" border="0" style="padding-right: 4px;padding-bottom: 3px">' + '</td>' + '<td style="vertical-align: top;' +
                    ' font: normal 11.5px arial, tahoma, helvetica, sans-serif;"><b>' + rec.get('nombrecompleto') + '</b><br />' + imgSexo + '<b>' + 'Evaluación:</b> ' + (rec.get('valor') || '') + '</br>' +
                    '</td>' + '</tr>' + '</table>' + '</td>' + '</tr></table>';

                qtip = new Ext.ToolTip({
                    target: t,
                    autoWidth: true,
                    maxWidth: 800,
                    minWidth: 500,
                    html: html,
                    trackMouse: true
                });
            }
        }, this.cmpEvaluados);

        this.cmpEvaluados.getSelectionModel().on('selectionchange', function (sm) {
            if(self.stEvaluados.totalLength ==1)
            {
                var count = 'Listado de evaluados : '+ self.stEvaluados.totalLength + ' persona en total';
            }
		    else
            {
                var count = 'Listado de evaluados : '+ self.stEvaluados.totalLength + ' personas en total';
            }
			self.cmpEvaluados.setTitle(count);
            self.btnEstadoDesarrollo.disable();
            self.btnPerfilInd.disable();
            self.btnPerfilPeriodo.disable();
            self.btnPerfilIndPeriodo.disable();
            self.btnVerEvaluacion.disable();
            self.btnVerReclamacion.disable();
            self.btnFirmar.enable();
            if(self.cmpEvaluados.getSelectionModel().getSelected().data.idcaso){
                Ext.getCmp('menuFirmar').disable();
                Ext.getCmp('menuVer').enable();
                Ext.getCmp('menuEliminar').enable();
            }else{
                Ext.getCmp('menuFirmar').enable();
                Ext.getCmp('menuVer').disable();
                Ext.getCmp('menuEliminar').disable();
            }
            if (sm.hasSelection()) {
                var selections = self.cmpEvaluados.getSelectionModel().getSelections();

                if (selections.length == 1) {
                    self.btnGestDocumento.enable();
                }
                else {
                    self.btnGestDocumento.disable();
                }

                if (self.procesoEval.data.estado == 2) {
                    self.btnEvaluar.hide();
                    self.btnNoEvaluar.hide();
                    self.btnEstadoDesarrollo.hide();
                    self.btnOpinionEvaluado.hide();
                    self.btnPerfilInd.enable();
                    self.btnPerfilPeriodo.enable();
                    self.btnPerfilIndPeriodo.enable();
                    self.btnVerEvaluacion.enable();
                    self.btnVerReclamacion.enable();
                } else {
                    self.btnPerfilInd.enable();
                    self.btnPerfilPeriodo.enable();
                    self.btnPerfilIndPeriodo.enable();
                    self.btnVerEvaluacion.enable();
                    self.btnVerReclamacion.enable();
                    var selectedRec = sm.getSelections();

                    if (selectedRec.length > 1 && selectedRec[0].data.planilla!=1) {
                        Ext.getCmp('menuImprimir').setText('Imprimir la evaluaci&oacute;n de las personas seleccionadas');
                        self.btnEvaluar.disable();
                        Ext.getCmp('menuImprimir').enable();
                        self.btnReportar.enable();
                        self.btnNoEvaluar.disable();
                        self.btnPerfilInd.enable();
                        self.btnPerfilPeriodo.enable();
                        self.btnPerfilIndPeriodo.enable();
                        self.btnVerEvaluacion.enable();
                        self.btnVerReclamacion.enable();
                        self.btnEstadoDesarrollo.disable();
                        self.btnOpinionEvaluado.disable();
                    }
                    else {
                        self.btnEvaluar.enable();
                        Ext.getCmp('menuImprimir').setText('Imprimir la evaluaci&oacute;n de la persona seleccionada');
                        self.btnEstadoDesarrollo.enable();
                        self.btnOpinionEvaluado.enable();
                        if (selectedRec[0].data.estado == '0') {
                            self.btnNoEvaluar.enable();
                            self.btnEstadoDesarrollo.disable();
                            self.btnOpinionEvaluado.disable();
                        }
                        else if (selectedRec[0].data.estado == '1') {
                            self.btnNoEvaluar.enable();
                            self.btnPerfilInd.enable();
                            self.btnPerfilPeriodo.enable();
                            self.btnPerfilIndPeriodo.enable();
                            self.btnVerEvaluacion.enable();
                            self.btnVerReclamacion.enable();
                            Ext.getCmp('menuImprimir').enable();
                            self.btnReportar.enable();
                            self.btnEstadoDesarrollo.enable();
                            if (selectedRec[0].data.deacuerdo == '1')
                                self.btnOpinionEvaluado.disable();
                            else {
                                self.btnOpinionEvaluado.enable();
                            }
                        }
                        else if (selectedRec[0].data.estado == '3') {
                            self.btnNoEvaluar.enable();
//                        self.btnEvaluar.enable();
                            self.btnEstadoDesarrollo.disable();
                            self.btnOpinionEvaluado.disable();
                        }
                        else {
                            Ext.getCmp('menuImprimir').enable();
                            self.btnReportar.enable();
                            self.btnNoEvaluar.disable();
                            self.btnOpinionEvaluado.disable();
                        }
                    }
                }
            } else {
                self.btnPerfilInd.disable();
                self.btnPerfilPeriodo.disable();
                self.btnPerfilIndPeriodo.disable();
                self.btnEvaluar.disable();
                Ext.getCmp('menuImprimir').disable();
                self.btnReportar.disable();
                self.btnNoEvaluar.disable();
                self.btnPerfilInd.disable();
                self.btnPerfilPeriodo.disable();
                self.btnPerfilIndPeriodo.disable();
                self.btnOpinionEvaluado.disable();
            }
        }, this);

        this.tbar = [this.btnEvaluar, this.btnNoEvaluar, this.btnVerEvaluacion, this.btnVerReclamacion, this.btnEstadoDesarrollo, this.btnOpinionEvaluado, this.btnPerfilInd, this.btnGestDocumento,/*this.btnPerfilPeriodo, this.btnPerfilIndPeriodo,*/ this.btnImprimir,this.btnImportarPersExcel,this.btnGenerarRTF,this.btnReportar,this.btnFirmar, '->', this.btnAyuda];
        this.items = [this.cmpEvaluados];
        Ext.PVD.Evaluaciones.Evaluar.WinEvaluarXProcesoEval.superclass.initComponent.call(this);

        function importarFileUploadField() {

            var panel = new Ext.FormPanel({
                fileUpload: true,
                width: 400,
                frame: true,
                autoHeight: true,
                bodyStyle: 'padding: 10px 10px 0 10px;',
                labelWidth: 50,
                defaults: {
                    anchor: '95%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [{
                                    xtype: 'fileuploadfield',
                                    id: 'subir',
                                    name: 'fileUpload',
                                    anchor: '100%',
                                    fieldLabel: 'Archivo',
                                    emptyText: 'Seleccione...',
                                    allowBlank: false,
                                    buttonText: 'Buscar',
                                    buttonConfig: {
                                        test: ''
                                    }
                                }]
                            }
                        ]
                    },
                    {
                        xtype: 'hidden',
                        id:'idperiodoimportar',
                        name: 'proceso'
                    }
                ]

            });

            var importar = new Ext.Window({
                title: 'Importar Persona',
                width: 400,
                layout: 'fit',
                modal: true,
                items: [panel],
                buttons: [{
                    iconCls: 'cancelar',
                    id: 'cancelarImportar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
                    handler: function () {
                        importar.close();
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'aceptarImportar',
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
                    handler: function () {
                        if (panel.getForm().isValid()) {
                            panel.getForm().submit({
                                url:'importarEvaluacionExcel',
                                waitMsg: 'Importando datos del archivo...',
                                success: function (fp, response) {
                                    var responseText = Ext.decode(response.response.responseText);
                                    importar.close();
                                    mostrarMensaje(1, 'Las evaluaciones han sido importada satisfactoriamente.');
                                    self.cmpEvaluados.getStore().reload();
                                    self.cmpEvaluados.getSelectionModel().selectFirstRow();
                                }.createDelegate(this),
                                failure: function (fp, response) {
                                    var responseText = Ext.decode(response.response.responseText);
                                    if (responseText.codMsg == 3) {
                                        mostrarMensaje(6, 'Ya existe la persona que quiere importar.');
                                    } else if (responseText.codMsg == 5) {
                                        mostrarMensaje(6, 'La dirección del archivo no existe.');
                                    }  else if (responseText.codMsg == 6) {
                                        mostrarMensaje(6, 'El archivo seleccionado no es válido.');
                                    }
                                }.createDelegate(this)
                            });
                        } else {
                            mostrarMensaje(6, 'No existen datos.');
                        }
                    }.createDelegate(this)
                }],
                keys: [{
                    key: 'x',
                    alt: true,
                    fn: function () {
                        if (!Ext.getCmp('cancelarImportar').disabled) {
                            Ext.getCmp('cancelarImportar').handler();
                        }
                    }
                },
                    {
                        key: 13,
                        fn: function () {
                            if (!Ext.getCmp('aceptarImportar').disabled) {
                                Ext.getCmp('aceptarImportar').handler();
                            }
                        }
                    }]
            });
            importar.show();
        }

        function showWinNoEvaluados() {
            var win = new Ext.PVD.Evaluaciones.Evaluar.WinNoEvaluar({
                labels: self.labels,
                recEval: self.cmpEvaluados.getSelectionModel().getSelected(),
                title: self.labels.lbWinNoEval,
                parent: self
            });
            win.on('show', function () {
                win.storeCausanoevaluado.load();
            });
            win.on('close', function (cmp) {
                self.cmpEvaluados.getSelectionModel().clearSelections();
                if (!self.btnNoEvaluar.disabled) {
                    self.btnNoEvaluar.disable();
                }
            });
            win.show();
            win.comBoxCausanoevaluado.focus();
        }

        function imprimirEvaluados(pArrIdPers,complemento) {
            var stformato = new Ext.data.SimpleStore({
                fields: ['idformato','formato'],
                data: [
                    [0,'A4'],
                    [1,'Carta'],
                    [2,'Legal'],
                    [3,'A2'],
                    [4,'A3'],
                ]
            });

            var cbFormato = new Ext.form.ComboBox({
                fieldLabel: 'Formato:',
                labelSeparator: '',
                editable: true,
                store: stformato,
                valueField: 'formato',
                displayField: 'formato',
                hiddenName: 'id',
                mode: 'local',
                triggerAction: 'all',
                readOnly: true,
                allowBlank: true,
                anchor: '90%',
                emptyText: 'Seleccione...',
                blankText:'Este campo es obligatorio',

            });

            var tfDenomhoja = new Ext.form.TextField({
                id: 'tfDenomhoja',
                fieldLabel: 'No. Hoja inicial',
                name: 'hoja',
                allowBlank: false,
                anchor: '90%'
            });

            var formformato = new Ext.form.FormPanel({
                width: 420,
                height: 180,
                frame: true,
                region: 'center',
                bodyStyle: 'padding: 5px 5px 0',
                border: false,
                labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
                labelAlign: 'top',
                items: [
                    cbFormato,tfDenomhoja
                ]

            });
            cbFormato.setValue('Carta');
            tfDenomhoja.setValue(1);
            var formato = '';
            var cantidadhoja = '';

            var btnAcepthoja = new Ext.Button({
                id: 'btnAcepthoja',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
                iconCls: 'aceptar',
                handler: function () {
                    formato = cbFormato.getValue();
                    cantidadhoja = tfDenomhoja.getValue();
                    windhoja.destroy();
                    var arrIdPers = pArrIdPers ? pArrIdPers : new Array();

                    var params = Ext.urlEncode({
                        idperiodoproceso: self.procesoEval.get('idperiodoproceso'),
                        idpreprocesoevaluativo: self.procesoEval.get('_parent'),
                        fechainicio: self.procesoEval.data.fechainicio,
                        fechafin: self.procesoEval.data.fechafin,
                        arridpersona: Ext.encode(arrIdPers),
                        complemento:complemento,
                        formato:formato,
                    });

                    var idIframeResolucion = Ext.id();
                    new Ext.Window({
                        title: 'Evaluación',
                        width: 800,
                        height: 500,
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
                                id: idIframeResolucion,
                                style: 'height: 100%; width: 100%; border: none',
                                src: document.location.protocol + '//' + document.location.host +
                                    '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/printEval?' + params
                            }
                        }
                    }).show();
                    PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando la evaluación en formato PDF.');
                    document.getElementById(idIframeResolucion).onload = function () {
                        PVD.ocultarMascara('rep01');
                    }
                }
            });

            var btnCancelhoja = new Ext.Button({
                id: 'btnCancelhoja' ,
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
                iconCls: 'cancelar',
                handler: function () {
                    windhoja.destroy();
                }
            });
            var windhoja = new Ext.Window({
                title:'Formato del reporte',
                border: false,
                modal: true,
                width: 430,
                height:190,
                closable: true,
                resizable: false,
                closeAction: 'hide',
                items: [formformato],

                buttons: [btnCancelhoja,btnAcepthoja]
            });

            windhoja.show();
        }

        function imprimirEvaluadosCuadros(pArrIdPers,complemento) {
            var stformatoCuadros = new Ext.data.SimpleStore({
                fields: ['idformato','formato'],
                data: [
                    [0,'A4'],
                    [1,'Carta'],
                    [2,'Legal'],
                    [3,'A2'],
                    [4,'A3'],
                ]
            });

            var cbFormatoCuadros = new Ext.form.ComboBox({
                fieldLabel: 'Formato:',
                labelSeparator: '',
                editable: true,
                store: stformatoCuadros,
                valueField: 'formato',
                displayField: 'formato',
                hiddenName: 'id',
                mode: 'local',
                triggerAction: 'all',
                readOnly: true,
                allowBlank: true,
                anchor: '90%',
                emptyText: 'Seleccione...',
                blankText:'Este campo es obligatorio',

            });

            var tfDenomhojaCuadros = new Ext.form.TextField({
                id: 'tfDenomhoja',
                fieldLabel: 'No. Hoja inicial',
                name: 'hoja',
                allowBlank: false,
                anchor: '90%'
            });

            var formformatoCuadros = new Ext.form.FormPanel({
                width: 420,
                height: 180,
                frame: true,
                region: 'center',
                bodyStyle: 'padding: 5px 5px 0',
                border: false,
                labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
                labelAlign: 'top',
                items: [
                    cbFormatoCuadros,tfDenomhojaCuadros
                ]

            });
            cbFormatoCuadros.setValue('Carta');
            tfDenomhojaCuadros.setValue(1);
            var formato = '';
            var cantidadhoja = '';

            var btnAcepthojaCuadros = new Ext.Button({
                id: 'btnAcepthoja',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
                iconCls: 'aceptar',
                handler: function () {
                    formato = cbFormatoCuadros.getValue();
                    cantidadhoja = tfDenomhojaCuadros.getValue();
                    windhojaCuadros.destroy();
                    var arrIdPers = pArrIdPers ? pArrIdPers : new Array();

                    var params = Ext.urlEncode({
                        idperiodoproceso: self.procesoEval.get('idperiodoproceso'),
                        idpreprocesoevaluativo: self.procesoEval.get('_parent'),
                        fechainicio: self.procesoEval.data.fechainicio,
                        fechafin: self.procesoEval.data.fechafin,
                        arridpersona: Ext.encode(arrIdPers),
                        complemento:complemento,
                        formato:formato,
                    });

                    var idIframeResolucion = Ext.id();
                    new Ext.Window({
                        title: 'Evaluación',
                        width: 800,
                        height: 500,
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
                                id: idIframeResolucion,
                                style: 'height: 100%; width: 100%; border: none',
                                src: document.location.protocol + '//' + document.location.host +
                                    '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/printEvalCuadros?' + params
                            }
                        }
                    }).show();
                    PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando la evaluación en formato PDF.');
                    document.getElementById(idIframeResolucion).onload = function () {
                        PVD.ocultarMascara('rep01');
                    }
                }
            });

            var btnCancelhojaCuadros = new Ext.Button({
                id: 'btnCancelhoja' ,
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
                iconCls: 'cancelar',
                handler: function () {
                    windhojaCuadros.destroy();
                }
            });
            var windhojaCuadros = new Ext.Window({
                title:'Formato del reporte',
                border: false,
                modal: true,
                width: 430,
                height:190,
                closable: true,
                resizable: false,
                closeAction: 'hide',
                items: [formformatoCuadros],

                buttons: [btnCancelhojaCuadros,btnAcepthojaCuadros]
            });
            windhojaCuadros.show();
        }

        function firmarEvaluados(pArrIdPers,complemento) {
            var arrIdPers = pArrIdPers ? pArrIdPers : new Array();
            Ext.getBody().mask('Cargando...');
            Ext.Ajax.request({
                url: 'firmarEval',
                method: 'POST',
                params: {
                    idperiodoproceso: self.procesoEval.get('idperiodoproceso'),
                    fechainicio: self.procesoEval.data.fechainicio,
                    fechafin: self.procesoEval.data.fechafin,
                    arridpersona: Ext.encode(arrIdPers),
                    complemento:complemento,
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    var responseData = Ext.decode(response.responseText);
                    var Arrpersonas = new Array();
                    var idspersonasevaluacion = new Array();
                    self.dir = new Array();
                    Ext.each(responseData, function (record) {
                        Arrpersonas.push({
                            "name" : record.nombre+"-EVALUACION.pdf",
                            "relativePath": '/pvd/evaluaciones/procesoevaluativo/EVALUACION-'+record.nombre+'.pdf',
                            "path" : record.direccion
                        });
                        idspersonasevaluacion.push(record.idpersonaevaluacion);
                        self.dir.push(record.direccion);
                    });
                    var win = new Ext.util.FirmaView({
                        documentos:Arrpersonas,
                        variables : responseData[0].variables,
                        onFirmaDigital:function(r){
                            guardarIdCaso(r.caseId,idspersonasevaluacion);
                            win.hide();
                        }
                    });
                    win.cmbProceso.on({
                        'select':function (cb,r) {
                            if(r.data.value == 'Firmar Evaluacion de Desempeño' && arrIdPers.length > 1){
                                mostrarMensaje(3, 'La firma evaluación de desempeño solo puede realizarse a una persona.');
                                win.close();
                            }
                        }
                    });
                    win.show();
                }
            });

            function guardarIdCaso(idcaso,idspersonasevaluacion) {
                Ext.Ajax.request({
                    url: 'guardarIdCaso',
                    method: 'POST',
                    params: {
                        idcaso : idcaso,
                        idspersonasevaluacion : Ext.encode(idspersonasevaluacion),
                        direcciones : Ext.encode(self.dir),
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        self.cmpEvaluados.getStore().reload();
                    }
                });
            }
        }

        function visualizarCaso() {
            Ext.getBody().mask('Cargando...');
            Ext.Ajax.request({
                url: 'visualizarCaso',
                method: 'POST',
                params: {
                    idpersona: self.cmpEvaluados.getSelectionModel().getSelected().data.idpersona,
                    idperiodoproceso: self.procesoEval.get('idperiodoproceso')
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    var responseData = Ext.decode(response.responseText);
                    var docWin = new Ext.util.DocumentosView({
                        params: {
                            caseId : responseData
                        }
                    });
                    docWin.show();
                }
            });
        }

        function eliminarCaso() {
            var arrRec = self.cmpEvaluados.getSelectionModel().getSelections();
            var arrIdPers = new Array();
            Ext.each(arrRec, function (procesoEval) {
                if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                    arrIdPers.push(procesoEval.get('idpersona'));
                }
            });
            Ext.getBody().mask('Eliminando caso...');
            Ext.Ajax.request({
                url: 'eliminarCaso',
                method: 'POST',
                params: {
                    arridpersona: Ext.encode(arrIdPers),
                    idperiodoproceso: self.procesoEval.get('idperiodoproceso')
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.success == 1){
                        mostrarMensaje(1, 'La firma ha sido eliminada satisfactoriamente.');
                    }else
                        mostrarMensaje(3, 'Ha ocurrido un error al eliminar la firma.');
                    self.cmpEvaluados.getStore().reload();
                }
            });
        }

		function ExportarEvaluados(pArrIdPers) {
           /*******************Para exportar con o sin jefe de area*******************************/
           var btnAcepte = new Ext.Button({
               id: 'btnAcepte' + self.id,
               text: 'Aceptar',
               tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
               iconCls: 'aceptar',
               handler: function () {
                   windmodo.hide();
                   var arrIdPers = pArrIdPers ? pArrIdPers : new Array();

                   var params = Ext.urlEncode({
                       idperiodoproceso: self.procesoEval.get('idperiodoproceso'),
                       idpreprocesoevaluativo: self.procesoEval.get('_parent'),
                       fechainicio: self.procesoEval.data.fechainicio,
                       fechafin: self.procesoEval.data.fechafin,
                       arridpersona: Ext.encode(arrIdPers),
                       modo:cbDatos.getValue(),
                   });

                   var winload = new Ext.PVD.comun.window.winLoad({
                       title  : 'Por favor espere...',
                       mensaje: 'Generando reporte'
                   });

                   winload.showMask();
                   var iframe = document.createElement("iframe");
                   iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/printExport?' + params
                   iframe.style.display = 'none';
                   that = this;
                   iframe.onload = function () {
                       winload.hideMask();
                       mostrarMensaje(1, 'Las personas evaluadas se han exportado satisfactoriamente.');

                   }
                   document.body.appendChild(iframe);

               }
           });

            var btnCancele = new Ext.Button({
                id: 'btnCancele' + self.id,
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
                iconCls: 'cancelar',
                handler: function () {
                    windmodo.hide();
                }
            });

            var stdato= new Ext.data.SimpleStore({
                fields: ['idmodo', 'denommodo'], data: [
                    [1, 'Con jefe de área'],
                    [2, 'Sin jefe de área']
                ]
            });

            var cbDatos = new Ext.form.ComboBox({
                fieldLabel: 'Para exportar',
                store: stdato,
                displayField: 'denommodo',
                valueField: 'idmodo',
                name: 'denommodo',
                forceSelection: true,
                allowblank: false,
                readOnly: true,
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                emptyText: 'Seleccione...',
                allowBlank: false,
                blankText:'Campo vacio',
                selectOnFocus: true,
                anchor: '100%'

            });
            cbDatos.setValue('Sin jefe de área');
            var formDatos = new Ext.form.FormPanel({
                width: 420,
                frame: true,
                region: 'center',
                bodyStyle: 'padding: 5px 5px 0',
                border: false,
                labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
                labelAlign: 'top',
                items: [
                    cbDatos
                ]

            });

            var windmodo = new Ext.Window({
                border: false,
                modal: true,
                title:'Para exportar la certificación',
                width: 430,
                height: 150,
                closable: true,
                resizable: false,
                closeAction: 'hide',
                items: [formDatos],
                keys: [{
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        btnAcepte.handler();
                    }
                },
                    {
                        key: 'x',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            if (!btnCancele.disabled) {
                                btnCancele.handler();
                            }
                        }
                    }],
                buttons: [btnCancele,btnAcepte]
            });

            windmodo.show();
            /**********************************************************/


        }
		
        function showWinEvaluarTreeIndicadores(editable, procesoEval, cmpEvaluados, nocargar) {
            var recEvaluado = self.cmpEvaluados.getSelectionModel().getSelected();

            var recEvaluadosVarios = self.cmpEvaluados.getSelectionModel().getSelections();

            var Arrpersonas = new Array();
            if(recEvaluadosVarios.length>0){
                Ext.each(recEvaluadosVarios, function (record) {
                    Arrpersonas.push({
                        idpersona: record.get('idpersona'),
                        idpersonaevaluacion: parseInt(record.get('idpersonaevaluacion'))
                    });
                });
            }
            if(recEvaluado.data.planilla==0){

                var win = new Ext.PVD.Evaluaciones.Evaluar.WinEvaluarTreeIndicadores({
                    labels: self.labels,
                    procesoEval: self.procesoEval,
                    evaluado: recEvaluado,
                    idpersona: recEvaluado.get('idpersona'),
                    idpersonaevaluacion: recEvaluado.get('idpersonaevaluacion'),
                    idperiodo: self.procesoEval.get('idperiodoproceso'),
                    idplanilla: recEvaluado.get('idplanilla'),
                    idmodelo: recEvaluado.get('idmodelo'),
                    iddefprocesoevaluativo: self.iddefprocesoevaluativo,
                    editable: editable,
                    nocargar: nocargar

                });

                win.on('evaluacionConcluida', function () {
                    self.cmpEvaluados.getStore().reload();
                });

                win.on('close', function (cmp) {
                    self.cmpEvaluados.getSelectionModel().clearSelections();
                    if (!self.btnEvaluar.disabled) {
                        self.btnEvaluar.focus();
                    }
                });
                win.show();
                win.maximize();
            }
            else{
/****************************************Para cuando no tiene planilla evaluativa*******************************/
                var tfDenom = new Ext.form.TextField({
                    id: 'tfDenomEvaluar',
                    fieldLabel: 'Evaluaci&oacute;n',
                    name: 'evaluarfijo',
                    allowBlank: false,
                    anchor: '100%'
                });

                var form = new Ext.form.FormPanel({
                    width: 420,
                    height: 180,
                    frame: true,
                    region: 'center',
                    bodyStyle: 'padding: 5px 5px 0',
                    border: false,
                    labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
                    labelAlign: 'top',
                    items: [
                        tfDenom,
                    ]

                });

                var btnAcept = new Ext.Button({
                    id: 'btnAcept',
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
                    iconCls: 'aceptar',
                    handler: function () {
                        if (form.getForm().isValid()) {
                            PVD.mostrarMascara('saveprocess', 'Espere un momento por favor...', 'Enviando datos');
                            Ext.Ajax.request({
                                    url: 'guardarEvaluacionDir',
                                    method: 'POST',
                                    params: {
                                        arraypersona:Ext.encode(Arrpersonas),
                                        valor :tfDenom.getValue(),
                                    },
                                    callback: function (options, success, response) {
                                        PVD.ocultarMascara('saveprocess');
                                        var responseData = Ext.util.JSON.decode(response.responseText);
                                        if (responseData.success) {
                                            wind.destroy();
                                            mostrarMensaje(1, 'El resultado se modificó satisfactoriamente.');
                                            self.cmpEvaluados.getStore().reload();

                                        } else {
                                            mostrarMensaje(3, 'Error al modificar la evaluación de la persona');
                                        }
                                    }
                                }
                            );
                        }
                    }
                });

                var btnCancel = new Ext.Button({
                    id: 'btnCancel' ,
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
                    iconCls: 'cancelar',
                    handler: function () {
                        wind.destroy();
                    }
                });

                if(recEvaluado.data.valor!=null || recEvaluado.data.valor!=''){
                    tfDenom.setValue(recEvaluado.data.valor);
                }
                var wind = new Ext.Window({
                    title:'Valor de la evaluación',
                    border: false,
                    modal: true,
                    width: 430,
                    height: 165,
                    closable: true,
                    resizable: false,
                    closeAction: 'hide',
                    items: [form],

                    buttons: [btnCancel,btnAcept]
                });

                wind.on('close', function (cmp) {
                    self.cmpEvaluados.getSelectionModel().clearSelections();
                    if (!self.btnEvaluar.disabled) {
                        self.btnEvaluar.focus();
                    }
                });
                wind.show();
            }
        }

        function showWinReclamacion(editable, procesoEval, cmpEvaluados) {
            var recEvaluado = self.cmpEvaluados.getSelectionModel().getSelected();

            var win = new Ext.PVD.Evaluaciones.Evaluar.WinReclamaciones({
                labels: self.labels,
                procesoEval: self.procesoEval,
				idpersonaevaluador:recEvaluado.data.idpersonaevaluador,
                evaluado: recEvaluado,
                idpersona: recEvaluado.get('idpersona'),
                idpersonaevaluacion: recEvaluado.get('idpersonaevaluacion'),
                idperiodo: self.procesoEval.get('idperiodoproceso'),
                idplanilla: recEvaluado.get('idplanilla'),
                idmodelo: recEvaluado.get('idmodelo'),
                iddefprocesoevaluativo: self.iddefprocesoevaluativo,
                editable: editable
            });

            win.on('reclamacionConcluida', function () {
                //self.cmpEvaluados.getStore().load();
            });

            win.on('close', function (cmp) {
                self.cmpEvaluados.getSelectionModel().clearSelections();
                if (!self.btnEvaluar.disabled) {
                    self.btnEvaluar.focus();
                }
            });
            win.show();
            win.maximize();
        }

        function showWinEstadoDesarrollo() {
            var winEstadoDesarrollo = new Ext.PVD.Evaluaciones.Evaluar.WinEstadoDesarrollo({
                title: labels.ttEstado,
                parent: self,
                recEval: self.cmpEvaluados.getSelectionModel().getSelected()
            });

            winEstadoDesarrollo.on('show', function () {
                winEstadoDesarrollo.store.load({
                    params: {
                        idescala: self.idescala
                    }
                });
                winEstadoDesarrollo.btnCancelar.focus();
            }, this);
            winEstadoDesarrollo.on('close', function () {
                self.cmpEvaluados.getSelectionModel().clearSelections();
                self.btnEstadoDesarrollo.disable();
                self.btnNoEvaluar.focus();
            }, this)

            winEstadoDesarrollo.show();
        }

        function showWinOpinionEvaluado() {

	    if(self.puedereclamar == 1){
            var win = new Ext.PVD.Evaluaciones.Evaluar.WinOpinionEvaluado({
                title: labels.ttOpinion,
                parent: self,
                recEval: self.cmpEvaluados.getSelectionModel().getSelected()
            });

            win.show();
			}
			else
        {
            mostrarMensaje(3, 'El evaluado no puede reclamar, el proceso no está definido para esta acción.')
        }

        }
    },
    showName: function (val, meta, record) {
        var icon = Ext.isEmpty(record.get('icon'))
            ? 'class="user" style="width: 16px; height: 16px;"'
            : "style='background-image: url(" + record.get('icon') + ") !important; width: 16px; height: 16px;'";
        return "<div " + icon + " >" +
        "<p style='margin-left: 20px; margin-top: 2px;'>" +
        val + "</p></div>";
    },
    showSexo: function (value, meta, record) {
        if (Ext.isEmpty(value)) {
            return;
        }
        var icon = value == 1 ? 'male' : 'female';
        return "<div class='" + icon + "' style='width: 16px; height: 16px;'></div>";
    },
    showStatus: function (val) {
        if (val == '1') {
            return '<span style="color:green;">Evaluado</span>';
        }
        else if (val == '2') {
            return '<span style="color:brown;">En reclamaci&oacute;n</span>';
        }
        else if (val == '3') {
            return '<span style="color:blue;">No evaluado</span>';
        }
        return '<span style="color:red;">Por evaluar</span>';
    },
    showEvalColor: function (val, m, record) {
        if (val) {
            if (record.get('color')) {
                return '<span style="color:' + record.get('color') + '"><b>' + val + '</b></span>';
            }
            return '<b>' + val + '<b>';
        } else {
            return '';
        }
    },
    showEstadoDesarrollo: function (val, m, record) {
        if (val) {
            if (record.get('colorestadodes')) {
                return '<span style="color:' + record.get('colorestadodes') + '"><b>' + val + '</b></span>';
            }
            return '<b>' + val + '<b>';
        } else {
            return '';
        }
    },
    showEstadoFirma: function (val, m, record) {
        if (val) {
            return '<span style="color:orange;">Enviado a firmar</span>';
        } else {
            return '';
        }
    }
});

Ext.PVD.Evaluaciones.Evaluar.WinNoEvaluar = new Ext.extend(Ext.Window, {
    resizable: false,
    modal: true,
    id: 'WinNoEvaluar',
    initComponent: function () {
        var self = this;
        this.storeCausanoevaluado = new Ext.data.Store({
            url: 'cargarcbCausaNoEval',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcausanoevaluado'},
                {name: 'denominacion'},
                {name: 'descripcion'},
                {name: 'fechainicio'},
                {name: 'fechafin'}
            ])
        });
        this.comBoxCausanoevaluado = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            valueField: 'idcausanoevaluado',
            hiddenName: 'idcausanoevaluado',
            forceSelection: true,
            anchor: '100%',
            displayField: 'denominacion',
            store: self.storeCausanoevaluado,
            allowBlank: false,
            emptyText: self.labels.emptyText,
            fieldLabel: self.labels.cmbCausaEval,
            mode: 'local'
        });
        this.form = new Ext.FormPanel({
            id: self.id + 'form',
            layout: 'form',
            cls: 'x-toolbar',
            region: 'center',
            width: 300,
            height: 70,
            labelAlign: 'top',
            frame: true,
            border: false,
            margins: '5 5 5 5',
            bodyStyle: 'padding: 5px',
            defaultType: 'textfield',
            items: [self.comBoxCausanoevaluado]
        });
        this.btnCancelar = new Ext.Button({
            id: self.id + 'btnCancelar',
            iconCls: 'cancelar',
            text: self.labels.lbBtnCancelar,
            tooltip: self.labels.ttpbtnCancelar,
            handler: function () {
                self.close();
            }
        });
        this.btnAceptar = new Ext.Button({
            id: self.id + 'btnAceptar',
            iconCls: 'aceptar',
            text: self.labels.lbBtnAceptar,
            tooltip: self.labels.ttpbtnAceptar,
            handler: function () {
                if (self.form.getForm().isValid()) {
                    PVD.mostrarMascara('idmskmodify', 'Por favor espere', 'Guardando datos del evaluado');
                    Ext.Ajax.request({
                        url: 'modevalpersona',
                        params: {
                            idpersonaevaluacion: self.recEval.get('idpersonaevaluacion'),
                            idcausa: self.comBoxCausanoevaluado.getValue()
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idmskmodify');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.modificado == true) {
                                Ext.Notification.show({
                                    title: 'Informaci&oacute;n',
                                    msg: 'El evaluado ha sido modificado satisfactoriamente.',
                                    time: 3
                                });
                                self.close();
                                self.recEval.set('estado', 3);
                            }
                            else {
                                Ext.Notification.show({
                                    title: 'Informaci&oacute;n',
                                    msg: 'El evaluado no se ha podido modificar.',
                                    time: 3
                                });
                                self.close();
                            }

                        }
                    });
                }
            }
        });
        this.items = [self.form];
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    self.btnAceptar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    self.btnCancelar.handler();
                }
            }
        ];
        this.buttons = [self.btnCancelar, self.btnAceptar];
        Ext.PVD.Evaluaciones.Evaluar.WinNoEvaluar.superclass.initComponent.call(this);
    }
});

/*Ventana para gestionar el estado de desarrollo*/
Ext.PVD.Evaluaciones.Evaluar.WinEstadoDesarrollo = new Ext.extend(Ext.Window, {
    resizable: false,
    modal: true,
    initComponent: function () {
        var self = this;
        var idpreprocesoevaluativo = self.recEval.get('idpreprocesoevaluativo');
        this.store = new Ext.data.Store({
            url: 'getValoresEscala',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idescala'},
                {name: 'tipoescala'},
                {name: 'idvalor'},
                {name: 'valor'},
                {name: 'color'},
                {name: 'denom'}
            ])
        });

        this.comBoxEstadoDesarrollo = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            valueField: 'idvalor',
            hiddenName: 'idvalor',
            forceSelection: true,
            anchor: '100%',
            displayField: 'denom',
            store: self.store,
            allowBlank: false,
            emptyText: labels.emptyText,
            fieldLabel: labels.cbBEstado,
            mode: 'local'
        });

        this.form = new Ext.FormPanel({
            id: self.id + 'form',
            layout: 'form',
            cls: 'x-toolbar',
            region: 'center',
            width: 300,
            height: 70,
            labelAlign: 'top',
            frame: true,
            border: false,
            margins: '5 5 5 5',
            bodyStyle: 'padding: 5px',
            //buttons: [self.btnCancelar, self.btnAceptar],
            defaultType: 'textfield',
            items: [self.comBoxEstadoDesarrollo]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: labels.lbBtnCancelar,
            tooltip: labels.ttpbtnCancelar,
            handler: function () {
                self.close();
            }
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: labels.lbBtnAceptar,
            tooltip: labels.ttpbtnAceptar,
            handler: function () {
                if (self.form.getForm().isValid()) {
                    PVD.mostrarMascara('idmskmodify', 'Por favor espere', 'Guardando datos del evaluado');
                    Ext.Ajax.request({
                        url: 'cambiarestadodesarrollo',
                        params: {
                            idpersonaevaluacion: self.recEval.get('idpersonaevaluacion'),
                            idestadodesarrollo: self.comBoxEstadoDesarrollo.getValue()
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idmskmodify');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.modificado == true) {
                                Ext.Notification.show({
                                    title: 'Informaci&oacute;n',
                                    msg: 'El evaluado ha sido modificado satisfactoriamente.',
                                    time: 3
                                });
                                self.recEval.set('idestadodesarrollo', self.comBoxEstadoDesarrollo.getValue());
                                self.recEval.set('estadodesarrollo', self.comBoxEstadoDesarrollo.getRawValue());
                                var index = self.store.find('idvalor', self.comBoxEstadoDesarrollo.getValue());
                                self.recEval.set('colorestadodes', self.store.getAt(index).get('color'));
                            }
                            else {
                                Ext.Notification.show({
                                    title: 'Informaci&oacute;n',
                                    msg: 'El evaluado no se ha podido modificar.',
                                    time: 3
                                });
                            }
                            self.close();
                        }
                    });
                }
            }
        });
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    self.btnAceptar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    self.btnCancelar.handler();
                }
            }
        ];
        this.items = [self.form];
        this.buttons = [self.btnCancelar, self.btnAceptar];
        Ext.PVD.Evaluaciones.Evaluar.WinEstadoDesarrollo.superclass.initComponent.call(this);
    }
});
