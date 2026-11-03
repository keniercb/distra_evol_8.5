/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.ModContb.Tabpanel
 * @extends Ext.TabPanel
 */

// DEFINIENDO UNA RESPUESTA EN CASO DE QUE OCURRA UNA EXCEPCION EN LA PETICION AJAX
//Ext.Ajax.on({
//    requestexception: function(connection, response, options) {
//        if (response.status > 400) {
//            mostrarMensaje(3, 'La petici&oacute;n no pudo ser procesada debido \n\
//a la ocurrencia del siguiente error: ' + response.statusText, function() {
//            });
//        }
//    }
//});

Ext.namespace('Ext.Conf.ModContb.Tabpanel');
Ext.Conf.ModContb.Tabpanel = Ext.extend(Ext.TabPanel, {
    idsubsistema: -1,
    idComponente: -1,
    idioma: {},
    perfil: {},
    autoCreate:false,
    constructor: function(params) {

        //Evento para saber si ya el componente tab se termino de cargar
        this.addEvents('endload');

        Ext.apply(this, params);
        Ext.apply(this, {
            border: false,
            enableTabScroll: true
        });
        Ext.Conf.ModContb.Tabpanel.superclass.constructor.call(this);

        if (params.idsubsistema === -1) {//no se ha especificado el id del subsistema            
            mostrarMensaje(3, params.idioma.msgErrorSubs, function() {
                window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
            });
        } else {
            if(this.autoCreate){
                this.createItems();
            }
        }
    },
    createItems:function(){
        var _this = this;
        var myMask = new Ext.LoadMask(Ext.getBody());
        myMask.show();
        Ext.Ajax.request({
            params: {
                idsubsistema : _this.idsubsistema
            },
            method: "POST",
            url: "cargarsubsistemas",
            scope: this,
            callback: function(options, success, response) {
                var arrsubs = Ext.decode(response.responseText);
                while (typeof _this.items.first() != 'undefined') {
                    _this.remove(_this.items.first());
                }
                if (arrsubs.length > 0) {
                    //_this.setDisabled(false);
                    for (var i = 0; i < arrsubs.length; i++) {
                        this.addTab(arrsubs[i].idsubsistema, arrsubs[i].nombsubsistema, _this.idComponente,
                            _this.perfil, _this.idioma);
                    }

                    myMask.hide();
                    //Activar el primer tab en caso que no se especifique un tab activo
                    this.activate(this.items.items[/*_this.activeTab ? _this.activeTab :*/ 0]);
                    this.doLayout();

                    //Dispara el evento endload
                    this.fireEvent('endload', this);
                }
                else {
                    myMask.hide();
                    mostrarMensaje(1, _this.idioma.msgErrorSubsEnt, function () {
                        //window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
                    });
                    //mostrarMensaje(1, _this.idioma.msgErrorSubsEnt);
                    this.fireEvent('nosubsist', this);
                }
            }
        });
    },
    addTab: function(idsubsistema, nombsubsistema, idComponente, perfil, idioma) {
        this.add({
            title: nombsubsistema,
            id: 'tab ' + idsubsistema,
            layout: 'fit',
            resizeTabs: true, //propiedad importante para que cada tab se adapte
            //minTabWidth: 170,
            items: new Ext.Conf.ModContb.GestModeloGrid({
                identificador: 'grid' + idsubsistema,
                idsubsistema: idsubsistema,
                idComponente: idComponente,
                perfil: perfil,
                idioma: idioma
            }),
            listeners: {
                scope: this,
                'activate': function(subtabpanel) {
                    var gridactivo = subtabpanel.items.items[0];
                    /*var myMask = new Ext.LoadMask(Ext.getBody());
                    myMask.show();*/
                    gridactivo.getStore().removeAll();
                    gridactivo.getStore().load({
                        scope: this,
                        params: {
                            idsubsistema: subtabpanel.id.split(' ')[1]
                        },
                        callback: function() {
                            //myMask.hide();
                        }
                    });
                }
            }
        });
    }

});




