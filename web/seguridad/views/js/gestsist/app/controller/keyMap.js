/**
 * Created by lily on 6/03/15.
 */

Ext.define('Conf.controller.KeyMap', {

    alias: 'widget.keymapController',

    init: function (){},


    pressAltIA: function(_this){

        if(typeof(this.insertarAccion) === "undefined"){
            this.insertarAccion = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                key: Ext.EventObject.A,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addAccion').disabled) {
                        _this.insertarAccion();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltIS: function(_this){

        if(typeof(this.insertarSubsistema) === "undefined"){
            this.insertarSubsistema = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                key: Ext.EventObject.S,
                alt: true,
                  defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addSubsistema').disabled) {
                        _this.insertarSubsistema();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltIF: function(_this){

        if(typeof(this.insertarFuncionalidad) === "undefined"){
            this.insertarFuncionalidad = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                key: Ext.EventObject.F,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addFuncionalidad').disabled) {
                        _this.insertarFuncionalidad();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltIR: function(_this){

        if(typeof(this.insertarRecurso) === "undefined"){
            this.insertarRecurso = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                key: Ext.EventObject.R,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addRecurso').disabled) {
                        _this.insertarRecurso();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltG: function(_this){

        if(typeof(this.Guardar) === "undefined"){
            this.Guardar = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.G,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnGuardar').disabled) {
                        _this.guardarcambiosFormulario();
                    }
                },
                scope: _this
            });
        }
    },

    deleteComponente: function(_this,arbolPanel){

            if(typeof(this.DeleteComp) === "undefined"){
                this.DeleteComp = new Ext.KeyMap(Ext.getBody(), {
                    key: Ext.EventObject.DELETE,
                    shift: false,
                    ctrl: false,
                    defaultEventAction:'stopEvent',
                    fn: function () {
                        if(!Ext.getCmp('btnEliminar').disabled) {
                            _this.eliminarcomponente();
                        }
                    },
                    scope: arbolPanel
                });
            }

    },

    deleteAccion: function(_this,grid){

            if(typeof(this.DeleteAction) === "undefined"){
                this.DeleteAction = new Ext.KeyMap(Ext.getBody(), {
                    key: Ext.EventObject.D,
                    shift: true,
                    ctrl: false,
                    defaultEventAction:'stopEvent',
                    fn: function () {
                        if(!Ext.getCmp('deleteAccion').disabled) {
                            _this.eliminarAccion();
                        }
                    },
                    scope: grid
                });
            }

    },

    buscarTree: function(_this){

        if(typeof(this.BuscarTree) === "undefined"){
            this.BuscarTree = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.B,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnBuscarTreeDerecho').disabled) {
                        _this.filtrarTree();
                    }
                },
                scope: _this
            });
        }
    },

    limpiarTree: function(_this){

        if(typeof(this.LimpiarTree) === "undefined"){
            this.LimpiarTree = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.L,
                alt: true,
                ctrl: false,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnLimpiarTreeDerecho').disabled) {
                        _this.limpiarFiltroTree();
                    }
                },
                scope: _this
            });
        }
    },

    buscarGrid: function(_this){
        if(typeof(this.BuscandoGrid) === "undefined"){
            this.BuscandoGrid = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.B,
                alt: true,
                //ctrl:true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnBuscarGrid').disabled) {
                        _this.buscarrAcciones();
                    }
                },
                scope: _this
            });
        }
    },

    limpiarGrid: function(_this){

        if(typeof(this.LimpiarGrid) === "undefined"){
            this.LimpiarGrid = new Ext.KeyMap(Ext.getBody(), {
                //key: Ext.EventObject.G,
                key: Ext.EventObject.L,
                alt: true,
                ctrl:true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnLimpiarGrid').disabled) {
                        _this.limpiarCajaRecargargrid();
                    }
                },
                scope: _this
            });
        }
    },

    importarSubsistema: function(_this){

        if(typeof(this.Importar) === "undefined"){
            this.Importar = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                alt: true,
                ctrl:true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnImportar').disabled) {
                        _this.importarsubsistema();
                    }
                },
                scope: _this
            });
        }
    },

    exportarSubsistema: function(_this){

        if(typeof(this.Exportar) === "undefined"){
            this.Exportar = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.E,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnExportar').disabled) {
                        _this.exportarsubsistema();
                    }
                },
                scope: _this
            });
        }
    },

    abrirReferencia: function(_this){

        if(typeof(this.Referencia) === "undefined"){
            this.Referencia = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.W,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnBuscarReferencia').disabled) {
                        _this.buscarReferencia();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltX: function(_this, win){

        this.close = new Ext.KeyMap(win.getEl(), {
            key: Ext.EventObject.X,
            alt: true,
            defaultEventAction:'stopEvent',
            fn: function () {
                win.close();
            },
            scope: _this
        });
    },

    pressEnter: function(_this, win){

        this.enter = new Ext.KeyMap(win.getEl(), {
            key: Ext.EventObject.ENTER,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                switch (win.getId()) {
                    case 'winReferencia':
                        if(!Ext.getCmp('aceptar').isDisabled()){
                            win.close();
                        }
                        break;
                    case 'winAddAction':
                        if(!Ext.getCmp('aceptar').isDisabled()){
                           _this.agregarAccion(Ext.getCmp('aceptar'));
                        }
                        break;
                    case 'winImpSist':
                        if(!Ext.getCmp('aceptar').isDisabled()){
                            _this.importarSistema(Ext.getCmp('aceptar'));
                        }
                        break;
                }

            },
            scope: _this
        });
    }



});
