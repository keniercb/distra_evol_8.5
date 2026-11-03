/**
 * Created by lily on 2/02/16.
 */
Ext.define('Traces.keyMap.KeyMapGrafica', {

    alias: 'widget.keyMapGrafica',

    init: function (){},


   buscarTraza: function(_this, component){

        if(typeof(this.BuscarTrazas) === "undefined"){
            this.BuscarTrazas = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.B,
                alt: true,
                ctrl: false,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('buscar').disabled) {
                        _this.buscarTrazas();
                    }
                },
                scope: _this
            });
        }
    },

    limpiarTraza: function(_this, component){

        if(typeof(this.LimpiarTrazas) === "undefined"){
            this.LimpiarTrazas = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.L,
                alt: true,
                ctrl: false,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('limpiar').disabled) {
                        _this.limpiarFiltro();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltX: function(_this, win){

        if (typeof(this.close) === "undefined") {
            this.close = new Ext.KeyMap(win.getEl(), {
                key: Ext.EventObject.X,
                alt: true,
                defaultEventAction: 'stopEvent',
                fn: function () {
                    Ext.getCmp('tiempoReal').reset();
                    Ext.getCmp('panelGrafica').keyMap.BuscarTrazas.setDisabled(false);
                    Ext.getCmp('panelGrafica').keyMap.LimpiarTrazas.setDisabled(false);
                    win.close();
                },
                scope: _this
            });
        }
    },

    pressEnter: function (_this, win) {

        this.enter = new Ext.KeyMap(win.getEl(), {
            key: Ext.EventObject.ENTER,
            defaultEventAction:'stopEvent',
            fn: function () {
                _this.tiempoReal = setInterval(function () {

                        _this.actualizarTabGraficas();
                    },

                    parseInt(Ext.getCmp('tiempoRecarga').getValue()) * 1000
                );

                Ext.getCmp('panelGrafica').keyMap.BuscarTrazas.setDisabled(false);
                Ext.getCmp('panelGrafica').keyMap.LimpiarTrazas.setDisabled(false);
                win.close();


            },
            scope: _this
        });
    }



});