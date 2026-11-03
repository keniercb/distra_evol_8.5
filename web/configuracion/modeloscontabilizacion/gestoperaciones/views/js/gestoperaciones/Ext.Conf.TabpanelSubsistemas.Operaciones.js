/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.TabpanelSubsistemas.Operaciones
 * @extends Ext.TabPanel
 */
Ext.namespace('Ext.Conf.TabpanelSubsistemas.Operaciones');
Ext.Conf.TabpanelSubsistemas.Operaciones = Ext.extend(Ext.TabPanel, {
    //idsubsistema: -1,
    idioma: {},
    perfil: {},
    autoCreate:false,
    constructor: function (params) {

        //Evento para saber si ya el componente tab se termino de cargar
        this.addEvents('endload', 'change');

        Ext.apply(this, params);
        Ext.apply(this, {
            border: false,
            enableTabScroll: true
        });
        Ext.Conf.TabpanelSubsistemas.Operaciones.superclass.constructor.call(this);

        if(this.autoCreate){
            this.createItems();
        }

    },
    createItems:function(){
        var _this = this,
            myMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.msgCargando});
        myMask.show();

        Ext.Ajax.request({
            method: "POST",
            url: "cargarsubsistemas",
            scope: this,
            callback: function (options, success, response) {

                var arrsubs = Ext.decode(response.responseText);
                while (typeof _this.items.first() != 'undefined') {
                    _this.remove(_this.items.first());
                }
                if (arrsubs.length > 0) {
                    for (var i = 0; i < arrsubs.length; i++) {
                        this.addTab(arrsubs[i].idsubsistema, arrsubs[i].nombsubsistema,
                            _this.perfil, _this.idioma);
                    }

                    myMask.hide();
                    //Activar el primer tab
                    this.activate(this.items.items[0]);
                    this.doLayout();

                    //Dispara el evento endload
                    this.fireEvent('endload', this);

                    this.inicioEventos(_this.idioma, _this.perfil);
                }
                else {
                    myMask.hide();
                    mostrarMensaje(1, _this.idioma.msgErrorSubsEnt, function () {
                        //window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
                    });
                    this.fireEvent('nosubsist', true);
                }
            }
        });
    },
    inicioEventos: function (idioma, perfil) {
        this.on({
            scope: this,
            beforetabchange: function (tabpanel, newtab, currenttab) {
                var currentgrid = currenttab.getComponent(0),
                    changes = (currentgrid.getStore().getModifiedRecords().length + currentgrid.arreliminados.length) != 0;
                currentgrid.sf.blur();
                currentgrid.sf.reset();
                if (changes) {
                    mostrarMensaje(2, idioma.msgQuestionSaveChanges, function (btn) {
                        if (btn === 'ok') {
                            currentgrid.saveData(idioma);
                        }
                        else {
                            tabpanel.suspendEvents();
                            tabpanel.activate(newtab);
                            tabpanel.resumeEvents();
                        }
                    });
                    return false;
                }
                else {
                    return true;
                }
            }
        });
    },
    addTab: function (idsubsistema, nombsubsistema, perfil, idioma) {
        var parent = this.viewport;
        this.add({
            title: nombsubsistema,
            id: 'tab ' + idsubsistema,
            layout: 'fit',
            resizeTabs: true, //propiedad importante para que cada tab se adapte
            //minTabWidth: 170,
            items: new Ext.Conf.GridEditor.Operaciones({
                id: 'grid' + idsubsistema,
                idsubsistema: idsubsistema,
                perfil: perfil,
                idioma: idioma,
                border: false,
                tabpanel: this,
                btnadd: parent.btnadd,
                btnasociarentidad: parent.btnasociarentidad,
                btndel: parent.btndel,
                btnsave: parent.btnsave,
                btndescartar: parent.btndescartar
            }),
            listeners: {
                scope: this,
                activate: function (subtabpanel) {
                    var gridactivo = subtabpanel.getComponent(0);
                    var myMask = new Ext.LoadMask(subtabpanel.getEl());
                    myMask.show();

                    gridactivo.enable();
                    gridactivo.arreliminados = new Array();
                    gridactivo.getStore().commitChanges();
                    gridactivo.getStore().removeAll();

                    //Petición realizada para obtener los documentos y los modelos
                    Ext.Ajax.request({
                        method: "POST",
                        params: {
                            idsubsistema: idsubsistema
                        },
                        url: "cargarModelsAndDoc",
                        scope: this,
                        callback: function (options, success, response) {
                            myMask.hide();
                            var response = Ext.decode(response.responseText);

                            /*if (response.modelos.total === 0) {
                             //myMask.hide();
                             mostrarMensaje(1, idioma.noAsocModelos);
                             }*/

                            if (response.documentos.total === 0) {
                                //myMask.hide();
                                mostrarMensaje(6, idioma.noAsocDoc, function () {
                                    gridactivo.disable();
                                });
                            }
                            else {
                                gridactivo.enable();
                                gridactivo.cbmodelos.store.loadData(response.modelos);
                                gridactivo.cbdocumentos.store.loadData(response.documentos);
                                gridactivo.cbsignos.store.loadData(response.signos);
                                myMask.hide();
                                gridactivo.getStore().load();
                            }
                        }
                    });
                }
            }
        });
    }

});