/**
 * Controlador para configurar proyectos
 *
 * @author Ing. Javier Rodríguez López
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */
Ext.ns('Ext.pvd.persona.configurarproyecto');
Ext.pvd.persona.configurarproyecto.Controlador = {

    init: function (perfil, lang, view, model)
    {
        //Carga el listado de proyectos de persona
        model.stProject.load({
            params: {limit: 20, start: 0}
        });

        //Carga las configuraciones del recuperador complejo
        model.stReccomplejo.load();

        view.gpProject.addListener('rowdblclick', function ()
        {
            view.btnConfig.handler();
        });
        view.gpProject.addListener('afteredit', function (e) {
            PVD.mostrarMascara('msk', lang.lbMsgWait, lang.msgUpdateProject);
            Ext.Ajax.request({
                url: 'updateProyecto',
                params: {
                    'idproyecto': e.record.get('idproyecto'),
                    'fdatos': e.value
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('msk');
                    responseData = Ext.decode(response.responseText);
                    mostrarMensaje(1, lang.msgUpdProj);
                    view.tfIdProyecto.focus(false, 300);
                    model.stProject.reload();
                }
            });
        });
        view.smProject.addListener('selectionchange', function (sm)
        {
            if (sm.hasSelection()) {
                view.btnMod.enable();
                view.btnDel.enable();
                view.btnConfig.enable();
                view.btnGenerate.enable();
            } else {
                view.btnMod.disable();
                view.btnDel.disable();
                view.btnConfig.disable();
                view.btnGenerate.disable();
            }
        });

        view.btnAdd.setHandler(function ()
        {
            view.formProject.getForm().reset();
            view.WindFormProject.setTitle(lang.titWinAddProj);
            view.tfIdProyecto.enable();
            view.hfAction.setValue('add');
            view.WindFormProject.show();
        });

        view.btnMod.setHandler(function ()
        {
            if (view.smProject.hasSelection()) {
                view.formProject.getForm().reset();
                view.WindFormProject.setTitle(lang.titWinModProj);
                view.tfIdProyecto.disable();
                view.WindFormProject.show();
                view.formProject.getForm().loadRecord(view.smProject.getSelected());
                view.hfAction.setValue('mod');
            }
        });

        view.btnDel.setHandler(function ()
        {
            if (view.smProject.hasSelection()) {
                mostrarMensaje(2, lang.askDelProj, function (btn)
                {
                    if (btn == 'ok') {
                        PVD.mostrarMascara('mskdelproj', lang.lbMsgWait, lang.msgDeletingProject);
                        Ext.Ajax.request({
                            url: 'eliminarProyecto',
                            params: {
                                idproyecto: view.smProject.getSelected().get('idproyecto')
                            },
                            callback: function (options, success, response)
                            {
                                PVD.ocultarMascara('mskdelproj');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.success) {
                                    mostrarMensaje(1, lang.msgDeletedProj);
                                    model.stProject.reload();
                                } else {
                                    mostrarMensaje(3, lang.msgNoDeletedProj);
                                }
                            }
                        });
                    } else {
                        view.btnAdd.focus();
                    }
                });
            }
        });

        view.btnCancelProj.setHandler(function ()
        {
            view.WindFormProject.hide();
            view.btnAdd.focus();
        });

        view.btnAceptProj.setHandler(function ()
        {
            if (view.formProject.getForm().isValid()) {
                PVD.mostrarMascara('mskaddproj', lang.lbMsgWait, lang.msgAddingProject);
                var params = view.formProject.getForm().getValues();
                params.idproyecto = view.tfIdProyecto.getValue();
                Ext.Ajax.request({
                    url: 'insertarProyecto',
                    params: params,
                    callback: function (options, success, response)
                    {
                        PVD.ocultarMascara('mskaddproj');
                        responseData = Ext.decode(response.responseText);
                        mostrarMensaje(1, lang.msgAddedProj);
                        model.stProject.reload();
                        view.btnCancelProj.handler();
                    }
                });
                view.btnAdd.focus();
            }
        });

        view.btnAplicProj.setHandler(function ()
        {
            if (view.formProject.getForm().isValid()) {
                PVD.mostrarMascara('mskaddproj', lang.lbMsgWait, lang.msgAddingProject);
                Ext.Ajax.request({
                    url: 'insertarProyecto',
                    params: view.formProject.getForm().getValues(),
                    callback: function (options, success, response)
                    {
                        PVD.ocultarMascara('mskaddproj');
                        responseData = Ext.decode(response.responseText);
                        mostrarMensaje(1, lang.msgAddedProj);
                        view.tfIdProyecto.focus(false, 300);
                        model.stProject.reload();
                    }
                });
            }
        });

        /**
         * Abre la ventana de configuracion del proyecto
         */
        view.btnConfig.setHandler(function ()
        {
            var p = view.smProject.getSelected();
            var idproyecto = p.get('idproyecto');
            if (!Ext.getCmp(idproyecto)) {
                var win = new Ext.Person.ConfigProject({
                    id: idproyecto,
                    title: p.get('denominacion'),
                    project: p,
                    lang: lang
                });
                win.show();
                win.maximize();
            } else {
                Ext.getCmp(idproyecto).show();
            }
        });

        view.btnGenerate.setHandler(function ()
        {
            PVD.mostrarMascara('mskaddproj', lang.lbMsgWait, lang.msgGeneratingProject);
            Ext.Ajax.request({
                url: 'generateProject',
                params: {'idproyecto': view.smProject.getSelected().get('idproyecto')},
                callback: function (options, success, response)
                {
                    PVD.ocultarMascara('mskaddproj');
                    responseData = Ext.decode(response.responseText);
                    mostrarMensaje(1, lang.msgAddedProj);
                }
            });
        });
    }

}