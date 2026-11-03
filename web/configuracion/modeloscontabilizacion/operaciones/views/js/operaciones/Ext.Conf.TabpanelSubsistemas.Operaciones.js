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
    constructor: function(params) {

        //Evento para saber si ya el componente tab se termino de cargar
        this.addEvents('endload');

        Ext.apply(this, params);
        Ext.apply(this, {
            border: false,
            enableTabScroll: true
        });
        Ext.Conf.TabpanelSubsistemas.Operaciones.superclass.constructor.call(this);

        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: params.idioma.msgCargando});
        myMask.show();

        Ext.Ajax.request({
            method: "POST",
            url: "cargarsubsistemas",
            scope: this,
            callback: function(options, success, response) {

                var arrsubs = Ext.decode(response.responseText);

                for (var i = 0; i < arrsubs.length; i++) {
                    this.addTab(arrsubs[i].idsubsistema, arrsubs[i].nombsubsistema,
                            params.perfil, params.idioma);
                }

                myMask.hide();
                //Activar el primer tab
                this.activate(this.items.items[0]);
                this.doLayout();

                //Dispara el evento endload
                this.fireEvent('endload', this);
            }
        });
    },
    addTab: function(idsubsistema, nombsubsistema, perfil, idioma) {
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
                border: false
            }),
            listeners: {
                scope: this,
                activate: function(subtabpanel) {
                    var gridactivo = subtabpanel.items.items[0];
                    var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});
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
                        callback: function(options, success, response) {

                            var response = Ext.decode(response.responseText);

                            if (response.modelos.total === 0) {
                                myMask.hide();
                                mostrarMensaje(1, idioma.noAsocModelos);
                            }

                            if (response.documentos.total === 0) {
                                myMask.hide();
                                mostrarMensaje(3, idioma.noAsocDoc, function() {
                                    gridactivo.disable();
                                });
                            }
                            else {
                                gridactivo.enable();
                                gridactivo.cbmodelos.store.loadData(response.modelos);
                                gridactivo.cbdocumentos.store.loadData(response.documentos);

                                gridactivo.getStore().load({
                                    scope: this,
                                    callback: function() {
                                        myMask.hide();

                                        //Mapa de teclas para la gestión en el grid de las operaciones contables
                                        //El grid activo
                                        if (Ext.isEmpty(gridactivo.mapaTeclas)) {
                                            gridactivo.mapaTeclas = new Ext.KeyMap(Ext.getBody(), [
                                                {
                                                    key: "i",
                                                    alt: true,
                                                    //scope: this,
                                                    fn: function() {
                                                        if (!gridactivo.btnadd.disabled) {
                                                            gridactivo.insertarRow();
                                                        }
                                                    }
                                                }, {
                                                    key: "s",
                                                    alt: true,
                                                    //scope: this,
                                                    fn: function() {
                                                        if (!gridactivo.btnsave.disabled) {
                                                            gridactivo.saveData(idioma);
                                                        }
                                                    }
                                                }, {
                                                    key: "x",
                                                    alt: true,
                                                    //scope: this,
                                                    fn: function() {
                                                        if (!gridactivo.btndescartar.disabled) {
                                                            gridactivo.descartarCambios(idioma);
                                                        }
                                                    }
                                                }, {
                                                    key: Ext.EventObject.DELETE,
                                                    //scope: this,
                                                    fn: function() {
                                                        gridactivo.deleteRows(idioma);
                                                    }
                                                }
                                            ]);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }

});