/**
 * Controlador para de la funcionalidad de gestionar personas generico
 *
 * @author Ing. Ing.Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2013
 */
Ext.ns('Ext.PersonaGenerico');
Ext.PersonaGenerico.ControllerBase = function (config) {
    config = config || {};

    this.initialConfig = config;

    Ext.apply(this, config);
    Ext.PersonaGenerico.ControllerBase.superclass.constructor.call(this);
    this.initComponent();
};
Ext.extend(Ext.PersonaGenerico.ControllerBase, Ext.util.Observable, {
    imgDefaultMale: '../../../../views/images/persona/no-photo-male.png',
    imgDefaultFemale: '../../../../views/images/persona/no-photo-female.png',
    initComponent: function () {
        var me = this;
        this.conceptsReady = false;
        this.initPortalConceptos();
        this.initBtnHandlers();
        this.iniGridReporte();
        this.initKeyMap();
        $("#pFoto").click(function () {
            me.zoomImage();
        });

        /*******Creacion de la ventana para la actualizacion de las UM*******/

        this.strcbxUM = new Ext.data.Store({
            url: 'cargarNumerosPublicos',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "codigo", totalProperty: "cantidad"},
                [{name: 'codigo'}/*, {name: 'ptipopase'}*/]
            )
        });
        this.strcbxUM.load();
        this.cbxUM = new Ext.form.ComboBox({
            id: 'cbxUM',
            //editable: true,
            name: 'idtpase',
            fieldLabel: 'Seleccione la UM que desea actualizar',
            valueField: 'codigo',
            displayField: 'codigo',
            hiddenName: 'codigo',
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: 'Este campo solo admite caracteres numéricos.',
            mode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            selectOnFocus: true,
            anchor: '100%',
            allowBlank: false,
            blankText: 'Este campo es obligatorio',
            width: 80,
            store: this.strcbxUM,
            emptyText: 'Seleccione...'
        });
        this.formWinUM = new Ext.FormPanel({
            frame: true,
            height: 80,
            width: '100%',
            region: 'center',
            labelAlign: 'top',
            items: [
                this.cbxUM
            ]
        });

        this.btnCancelSync = new Ext.Button({
            id: 'btnCancelSync',
            text: 'Cancelar',
            tooltip: 'Cancelar la operacion y cerrar la ventana.',
            iconCls: 'btn',
            icon: perfil.dirImg + 'cancelar.png',
            handler: function () {
                this.WinSyncUM.hide()
            }.createDelegate(this)
        });

        this.btnAceptarSync = new Ext.Button({
            id: 'btnAceptarSync',
            text: 'Aceptar',
            tooltip: 'Actualizar personas desde activo FAR',
            iconCls: 'btn',
            icon: perfil.dirImg + 'Aceptar.png',
            handler: function () {
                if (this.strcbxUM.getById(this.cbxUM.getValue()) !== undefined) {
                    this.syncActivosFAR('ok', this.cbxUM.getValue());
                    this.WinSyncUM.hide();
                }
                else {
                    mostrarMensaje(3, 'Debe seleccionar un elemento de la lista para actualizar.');
                }
            }.createDelegate(this)
        });

        this.WinSyncUM = new Ext.Window({
            title: 'Sincronizar unidades militares',
            width: 280,
            height: 130,
            modal: true,
            resizable: false,
            animCollapse: false,
            closeAction: 'hide',
            maximizable: false,
            constrainHeader: true,
            border: false,
            items: [this.formWinUM],
            buttons: [this.btnCancelSync, this.btnAceptarSync]
        });
        /*******Creacion de la ventana para la actualizacion de las UM*******/

    },
    initPortalConceptos: function () {
        this.view.foto.overwrite(Ext.getCmp('pFoto').body, {
            foto: this.imgDefaultMale

        });
        this.view.infoPersona.overwrite(Ext.getCmp('pInfo').body, {
            nombre: '',
            numid:'',
            edad: '',
            entidad: '',
            area: '',
            cargo: '',
            salario: '',
            categocup: '',
            regtrab: ''
        });

        this.view.winGestPersonalConcept.show();
        this.view.winGestPersonalConcept.hide();
        this.view.winGestPersonalConcept.on('reload', this.onChangeData, this);
        this.view.winGestPersonalConcept.on('conceptsReady', this.onReadyConcepts, this);
    },
    initBtnHandlers: function () {
        this.view.btnAdd.setHandler(this.addHandler, this);
        this.view.btnMod.setHandler(this.modHandler, this);
        this.view.btnDel.setHandler(this.delHandler, this);
        this.view.btnSyncActivoFAR.setHandler(this.syncActivoFARHandler, this);
        this.view.btnView.setHandler(this.modViewHandler, this);
        this.view.btnGestDoc.setHandler(this.gestDocHandler, this);
        this.view.btnExport.setHandler(this.exportHandler, this);
        this.view.btnImport.setHandler(this.importHandler, this);
        this.view.btnImportarPersExcel.setHandler(this.importarFileUploadField, this);

    },
    iniGridReporte: function () {
        this.view.btnReportPlanilla.setDisabled(true);
        this.view.btnFichaPersona.setDisabled(true);
        this.view.btnExpedientePersona.setDisabled(true);
        this.view.btnReportPerfil.setDisabled(true);
        this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().on('selectionchange', this.onSelectionChange, this);
    },
    onChangeData: function () {
        this.view.objRecComplejas.pReporte.gpReporte.getStore().reload();
        this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().selectFirstRow();
        this.view.objRecComplejas.pReporte.gpReporte.focus();

    },
    onReadyConcepts: function (node, res) {
        var responseData = Ext.decode(res.responseText);
        if (responseData.length > 0) {
            this.view.btnAdd.enable();
            this.view.btnImport.enable();
            this.view.btnImportarPersExcel.enable();
            this.conceptsReady = true;
            this.view.objRecComplejas.pReporte.gpReporte.store.setDefaultSort('pkey0');
            this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().selectFirstRow();
            this.view.objRecComplejas.pReporte.gpReporte.focus();
        } else {
            this.view.btnAdd.hide();
            this.view.btnMod.hide();
            this.view.btnView.hide();
            this.view.btnGestDoc.hide();

            this.view.btnImport.hide();
            this.view.btnImportarPersExcel.hide();
            this.conceptsReady = false;
        }
    },
    addHandler: function () {
        this.view.winGestPersonalConcept.addNewPerson();
    },
    modHandler: function () {
        this.view.winGestPersonalConcept.modPersons(this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections());
    },
    modViewHandler: function () {
        this.view.winGestPersonalConcept.showViewPersons(this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections(), true);
    },
    gestDocHandler: function () {
        var objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido();
        objetoContenido.inicializarComponente(true, '5e69f8af-2786-45f7-9bcf-53ad9ace079a');
        var temp = true;
        objetoContenido.on('obtenerContenidoOK', function () {

            if (temp) {
                objetoContenido.winContenido.show();
                temp = false;

            }
        });
        objetoContenido.on("obtenerContenidoEx", function () {
            mostrarMensaje(8, 'Error interno al obtener los archivos del servidor.');
        })
    },
    delHandler: function () {
        var selections = this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections();
        var ask = (selections.length == 1) ? this.idioma.askDelSing : this.idioma.askDelPlu;
        var answer = (selections.length == 1) ? this.idioma.answerDelSig : this.idioma.answerDelPlu;
        var arrP = new Array();
        var arrPconCargo = new Array();
        Ext.each(selections, function (rec) {
            if (rec.get('dencargo') == null) {
                arrP.push(rec.get('idpersona'));
            } else {
                arrPconCargo.push(rec.get('idpersona'));
            }
        }, this);
        if (arrPconCargo.length == selections.length) {
            if (selections.length == 1) {
                mostrarMensaje(6, 'La persona seleccionada no puede ser eliminada porque se encuentra ocupando cargo.');
            } else {
                mostrarMensaje(6, 'Las personas seleccionadas no pueden ser eliminadas porque se encuentran' +
                    ' ocupando cargo.');
            }
        } else {
            mostrarMensaje(2, ask, function (btn) {
                if (btn == 'ok') {
                    if (arrPconCargo.length > 0) {
                        mostrarMensaje(6, 'Alguna de las personas seleccionadas no puede ser eliminada porque se encuentra ocupando cargo.');
                    }
                    PVD.mostrarMascara(this.view.id + 'maskdel', 'Por favor espere...', 'Eliminado datos.');
                    Ext.Ajax.request({
                        url: 'delPerson',
                        method: 'POST',
                        scope: this,
                        params: {
                            arrPersons: Ext.encode(arrP)
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara(this.view.id + 'maskdel');
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.success) {
                                Ext.Notification.show({
                                    title: 'Informaci&oacute;n',
                                    msg: answer,
                                    icon: 'ok'
                                });
                                this.view.objRecComplejas.pReporte.gpReporte.getStore().reload();
                                this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().selectFirstRow();
                                this.view.objRecComplejas.pReporte.gpReporte.focus();
                            } else if (responseData.codigo == 4) {
                                mostrarMensaje(6, 'La persona seleccionada no puede ser eliminada porque se encuentra ocupando cargo.');
                            }
                        }.createDelegate(this)
                    });

                }
            }.createDelegate(this));
        }
    },
    syncActivoFARHandler:function(){
        this.showPromptActualizar();
    },
    showPromptActualizar: function () {
        this.cbxUM.setValue(' ');
        this.WinSyncUM.show();

    },
    syncActivosFAR: function (btn, v) {
        if (btn !== 'ok')return;

        if (Ext.isEmpty(v)) {
            mostrarMensaje(3, 'El no público no puede ser vacio.');
            this.showPromptActualizar();
            return;
        }
        if (isNaN(v)) {
            mostrarMensaje(3, 'El no público no puede ser letra.');
            this.showPromptActualizar();
            return;
        }
        //aqui va el codigo que esta en el minfar para la llamada al metodo que se integra con activos far
        PVD.mostrarMascara('sync-activos', 'Por favor espere...', 'Actualizando personal.');
        Ext.Ajax.request({
            url: 'syncActivoFaR',
            timeout:99999999999,
            method: 'POST',
            scope: this,
            params: {n_publico: v,cantidad: this.view.objRecComplejas.pReporte.gpReporte.getStore().getCount()},
            callback: function (options, success, response) {
                PVD.ocultarMascara('sync-activos');
                responseData = Ext.decode(response.responseText);

                if(responseData.success == -1)
                {
                    mostrarMensaje(1, "El sistema ActivosFAR no ha devuelto datos de las personas pertenecientes \n a la unidad militar "+v+".");
                }
                else
                {
                    if (responseData.success === true) {
                        mostrarMensaje(1, 'La actualizaci&oacute;n se ha realizado satisfactoriamente.');
                        this.view.objRecComplejas.pReporte.gpReporte.getStore().reload();
                    } else {
                        mostrarMensaje(3, 'La actualizaci&oacute;n no se ha realizado debido a que ha ocurrido un error interno.');
                    }
                }
            }
        });
    },
    exportHandler: function () {
        var idspersona = new Array(),
            params = {};

        Ext.each(this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections(), function (rec) {
            idspersona.push(rec.get('idpersona'));
        }, this);

        params = Ext.apply(params, {
            idspersona: Ext.encode(idspersona),
            idproyecto: this.view.configPersona.idproyecto
        });

        window.open('/pvd/persona/projects/basetecnologica/index.php/basetecnologica/exportarPersonas' + '?' + Ext.urlEncode(params));
    },
    importHandler: function () {
        if (!this.winImportFile) {
            this.winImportFile = new Ext.PersonaGenerico.WinImportarPersona();

            this.winImportFile.btnCancel.on('click', function () {
                this.winImportFile.hide();
            }, this);

            this.winImportFile.btnAccept.on('click', function () {
                var me = this, maskId = me.id + 'mask', idioma = Ext.PersonaGenerico.idioma;

                //PVD.mostrarMascara(maskId,'ejemplo de prueba','mensaje');

                this.winImportFile.form.getForm().submit({
                    url: '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/importarPersonas',
                    waitMsg: idioma.importData,
                    success: function (formpanel, opt) {
                        if (!opt.result.success) {
                            mostrarMensaje(6, idioma.failureImportarPersona);
                            me.winImportFile.form.getForm().reset();
                            me.winImportFile.hide();
                        } else {
                            mostrarMensaje(7, idioma.successImportarPersona);
                            me.winImportFile.form.getForm().reset();
                            me.winImportFile.hide();
                            me.view.objRecComplejas.pReporte.gpReporte.getStore().reload();
                        }
                    },
                    failure: function (a) {
                        PVD.ocultarMascara(maskId);
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        me.winImportFile.form.getForm().reset();
                    },
                    scope: me
                });
            }, this);
        }

        this.winImportFile.show();
        this.winImportFile.form.getForm().reset();
    },

    importarFileUploadField: function () {
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
                            url:'importarPersonaExcel',
                            waitMsg: 'Importando datos del archivo...',
                            success: function (fp, response) {
                                var responseText = Ext.decode(response.response.responseText);
                                importar.close();
                                    mostrarMensaje(1, 'La persona ha sido importada satisfactoriamente.');
                                this.view.objRecComplejas.pReporte.gpReporte.getStore().reload();
                                this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().selectFirstRow();
                                this.view.objRecComplejas.pReporte.gpReporte.focus();
                                self.tpTemplate.getLoader().load(self.tpTemplate.getRootNode());
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
    },

    restablecerHandler: function () {
        var arrP = new Array();
        Ext.each(this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections(), function (rec) {
            arrP.push(rec.get('idpersona'));
        }, this);
        PVD.mostrarMascara(this.view.id + 'maskdel', 'Por favor espere...', 'Restableciendo datos');
        Ext.Ajax.request({
            url: 'restPerson',
            method: 'POST',
            scope: this,
            params: {
                arrPersons: arrP
            },
            callback: function (options, success, response) {
                PVD.ocultarMascara(this.view.id + 'maskdel');
                var responseData = Ext.decode(response.responseText);
                if (responseData.success) {
                    Ext.Notification.show({
                        title: 'Informaci&oacute;n',
                        msg: 'La(s) persona(s) se ha(n) restablecido satisfactoriamente.',
                        icon: 'ok'
                    });
                    this.view.objRecComplejas.pReporte.gpReporte.getStore().reload();
                    this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().selectFirstRow();
                    this.view.objRecComplejas.pReporte.gpReporte.focus();
                }
            }.createDelegate(this)
        });
    },
    onSelectionChange: function (sm) {
        this.view.btnDel.setDisabled(!sm.hasSelection());
        if (sm.hasSelection()) {
            this.view.btnMod.setDisabled(!this.conceptsReady);
            this.view.btnView.setDisabled(!this.conceptsReady);
            this.view.btnGestDoc.setDisabled(!this.conceptsReady);
            this.view.btnExport.enable();

            this.view.btnDel.setText(!this.isEliminated(sm.getSelections())
                ? this.idioma.lbBtnEliminar
                : this.idioma.lbBtnRestablecer
            );
            this.view.btnDel.setHandler(!this.isEliminated(sm.getSelections())
                ? this.delHandler
                : this.restablecerHandler, this);

            var rec = sm.getSelected();
            if (sm.getCount() == 1) {
                this.view.pFicha.expand();
                this.imgHandler(rec);
                this.personaData = rec;
                this.fichaHandler(rec);
                this.singleSelectHandler(sm.getSelected());
                this.view.btnReportPlanilla.setDisabled(false);
                this.view.btnFichaPersona.setDisabled(false);
                this.view.btnExpedientePersona.setDisabled(false);
                this.view.btnReportPerfil.setDisabled(false);
            } else {
                this.view.foto.overwrite(Ext.getCmp('pFoto').body, {
                    foto: this.imgDefaultMale

                });
                this.view.infoPersona.overwrite(Ext.getCmp('pInfo').body, {
                    nombre: '',
                    numid:'',
                    edad: '',
                    entidad: '',
                    area: '',
                    cargo: '',
                    salario: '',
                    categocup: '',
                    regtrab: ''
                });
                this.mutliSelectHandler(sm.getSelections());
                this.view.btnReportPlanilla.setDisabled(true);
                this.view.btnFichaPersona.setDisabled(true);
                this.view.btnExpedientePersona.setDisabled(true);
                this.view.btnReportPerfil.setDisabled(true);
            }

        } else {
            this.view.btnMod.disable();
            this.view.btnView.disable();
            this.view.btnGestDoc.disable();
            this.view.btnDel.disable();
            this.view.btnExport.disable();
            this.noneSelectHandler();
            this.view.btnReportPlanilla.setDisabled(true);
            this.view.btnFichaPersona.setDisabled(true);
            this.view.btnExpedientePersona.setDisabled(true);
            this.view.btnReportPerfil.setDisabled(true);
            this.view.foto.overwrite(Ext.getCmp('pFoto').body, {
                foto: this.imgDefaultMale

            });
            this.view.infoPersona.overwrite(Ext.getCmp('pInfo').body, {
                nombre: '',
                numid:'',
                edad: '',
                entidad: '',
                area: '',
                cargo: '',
                salario: '',
                categocup: '',
                regtrab: ''
            });
        }


    },
    isEliminated: function (records) {
        var flag = false;
        Ext.each(records, function (rec) {
            if (!Ext.isEmpty(rec.get('feliminado'))) {
                flag = true;
            }
        }, this);
        return flag;
    },
    mutliSelectHandler: Ext.emptyFn,
    singleSelectHandler: Ext.emptyFn,
    noneSelectHandler: Ext.emptyFn,
    fichaHandler: function (rec) {
        tplInfoPersonaIniTabla = '<tpl for="."><div"><table width="100%" style="border-collapse: collapse">';
        tplInfoPersonaIniElem = '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>Nombre y apellidos:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{nombre}</td></tr><tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>No. Identidad:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{numid}</td></tr>';
        tplInfoPersonaFinTabla = '</table></div></tpl>';
        elem = '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>No. Identidad:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{numid}</td></tr>';

        if (rec.get('edad')) {
            tplInfoPersonaIniElem += '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>Edad:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{edad}</td></tr>';
        }
        if (rec.get('denentidad')) {
            tplInfoPersonaIniElem += '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>Entidad:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{entidad}</td></tr>';
        }
        if (rec.get('denarea')) {
            tplInfoPersonaIniElem += '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>&Aacute;rea:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{area}</td></tr>';
        }
        if (rec.get('dencargo')) {
            tplInfoPersonaIniElem += '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>Cargo:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{cargo}</td></tr>';
        }
        if (rec.get('categocup')) {
            tplInfoPersonaIniElem += '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>Categor&iacute;a ocupacional:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{categocup}</td></tr>';
        }
        if (rec.get('salario')) {
            tplInfoPersonaIniElem += '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>Salario escala:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{salario}</td></tr>';
        }
        if (rec.get('regtrab')) {
            tplInfoPersonaIniElem += '<tr style="padding: 3px; background: #dfe8f6; color: #17438c; border-bottom: 1px solid #fff; border-top: 3px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td><b>R&eacute;gimen de trabajo:</b></td></tr><tr style="padding: 3px; background: #f0f1f3; border-bottom: 3px solid #fff; border-top: 1px solid transparent; font:normal 12px tahoma,arial,verdana,sans-serif"><td>{regtrab}</td></tr>';
        }

        this.view.infoPersona = new Ext.XTemplate(tplInfoPersonaIniTabla+tplInfoPersonaIniElem+tplInfoPersonaFinTabla);

        this.view.infoPersona.overwrite(Ext.getCmp('pInfo').body, {
            nombre: rec.get('nombreyapellidos'),
            numid: rec.get('numid'),
            edad: rec.get('edad') || 'No conocida',
            entidad: rec.get('denentidad') || 'No definida',
            area: rec.get('denarea') || 'No definida',
            cargo: rec.get('dencargo') || 'No definido',
            salario: rec.get('salario') || 'No definido',
            categocup: rec.get('categocup') || 'No definido',
            regtrab: rec.get('regtrab') || 'No definido'
        });
    },
    imgHandler: function (rec) {
        if (Ext.isEmpty(rec.get('foto'))) {
            if (rec.get('sexo') === 'Femenino' || rec.get('sexo') == 0) {
                this.view.foto.overwrite(Ext.getCmp('pFoto').body, {
                    foto: this.imgDefaultFemale

                });
            } else {
                this.view.foto.overwrite(Ext.getCmp('pFoto').body, {
                    foto: this.imgDefaultMale

                });
            }
        } else {
            this.view.foto.overwrite(Ext.getCmp('pFoto').body, {
                foto: 'data:image/png;base64,' + rec.get('foto')
            });
        }
    },
    getSelection: function () {
        return this.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections();
    },
    initKeyMap: function () {
        var self = this;
        new Ext.KeyMap(this.view.objRecComplejas.body.dom, [
            {
                key: 'i',
                alt: true,
                stopEvent: true,
                fn: function () {
                    self.view.winGestPersonalConcept.addNewPerson();
                }
            },
            {
                key: 'm',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.view.btnMod.disabled) {
                        self.view.winGestPersonalConcept.modPersons(self.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections());
                    }

                }
            }, {
                key: 'v',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.view.btnView.disabled) {
                        self.view.winGestPersonalConcept.showViewPersons(self.view.objRecComplejas.pReporte.gpReporte.getSelectionModel().getSelections(), true);
                    }

                }
            },
            {
                key: 'e',
                stopEvent: true,
                alt: true,
                fn: function () {
                    self.exportHandler();
                }
            },
            {
                key: 46,
                stopEvent: true,
                fn: function () {
                    if (!self.view.btnDel.disabled) {
                        self.delHandler();
                    }
                }
            }
        ])
    },

    zoomImage: function () {
        var $imageZoom = $('<div />').appendTo('body');
        $imageZoom.attr('id', 'imageZoom');
        var img = this.imgDefaultFemale;
        if (Ext.isEmpty(this.personaData.get('foto'))) {
            if (this.personaData.get.get('sexo') === 'Femenino' || this.personaData.get.get('sexo') == 0) {
                img = this.imgDefaultFemale;

            } else {
                img = this.imgDefaultMale;
            }
        } else {
            img = 'data:image/jpg;base64,' + this.personaData.get('foto');
        }

        $($imageZoom).html('<img src=' + img + ' width="270px" height="270px">');

        $($imageZoom).dialog({
            modal: true,
            show: {
                effect: 'scale',
                duration: 450
            },
            hide: {
                effect: 'size',
                duration: 250
            },
            width: 300,
            height: 300,
            resizable: false,
            shadowBlur: 20,
            create: function () {
                $(".ui-dialog-titlebar").hide();
            }
        });
        $($imageZoom).bind('click', function () {
            $(this).dialog('close');
        });

    },
});