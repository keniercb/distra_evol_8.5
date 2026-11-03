/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.GestOperaciones
 * @extends Ext.Viewport
 */
Ext.namespace('Ext.Conf.GestOperaciones');
Ext.Conf.GestOperaciones = Ext.extend(Ext.Viewport, {
    //Functions
    constructor: function(params) {
        Ext.MessageBox.wait('Cargando...', 'Por favor espere');

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            scope: this,
            callback: function(options, success, response)
            {
                var idioma = Ext.decode(response.responseText);
                var perfil = window.parent.perfil;

                params.tabsubsistemas = new Ext.Conf.TabpanelSubsistemas.Operaciones({
                    perfil: perfil,
                    idioma: idioma,
                    region: 'center'
                });

                //Panel que contiene todo el componente
                params.panel = new Ext.Panel({
                    id: 'paneloperaciones',
                    layout: 'border',
                    border: false,
                    items: [params.tabsubsistemas]
                });

                Ext.apply(this, params);
                Ext.apply(this, {
                    layout: 'fit',
                    items: [params.panel]
                });

                Ext.Conf.GestOperaciones.superclass.constructor.call(this);

                //Inicializa todos los eventos del componente
                this.inicializarEventos(perfil, idioma);

                //Se termina la carga del componente y se cierra la máscara
                Ext.MessageBox.hide();
            }
        });
    },
    inicializarEventos: function(perfil, idioma) {
        this.tabsubsistemas.on('endload', function(tabpanel) {
            //Refresca la vista del viewport, necesario para que el pagin toolbar salga bien
            this.doLayout();
        }, this);
    }
});


//Inicializando la vista.
Ext.QuickTips.init();

new Ext.Conf.GestOperaciones({
});