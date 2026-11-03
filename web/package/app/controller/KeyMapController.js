Ext.define('Packed.controller.keymap', {

    alias: 'widget.keymapController',

    init: function (){},

    pressAltN: function (_this) {

        this.newPack = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.N,
            alt: true,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                _this.onClickNewPack();
            },
            scope: _this
        });
    },

    pressAltB: function (_this, win) {

        this.filtrar = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.B,
            alt: true,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                switch (win.getId()) {
                    case 'winAddPack':
                        _this.filtrarTree();
                    break;
                    default:{
                        if(!Ext.getCmp('textfieldBuscarTree').isDisabled()) {
                            _this.filtrarGridPack();
                        }
                    }

                }

            },
            scope: _this
        });
    },

    pressAltL: function (_this, win) {

        this.limpiar = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.L,
            alt: true,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                switch (win.getId()) {
                    case 'winAddPack':
                        _this.limpiarFiltroTree();
                        break;
                    default:
                    {
                        if(!Ext.getCmp('clearFiltroGridPack').isDisabled()) {
                            _this.limpiarFiltroGridPack();
                        }
                    }

                }
            },
            scope: _this
        });
    },
    pressAltP: function (_this, win) {

        if(typeof(this.publicpack) === "undefined"){
            this.publicpack = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.P, // or Ext.EventObject.ENTER
                shift: true,
                alt: true,
                fn: function () {
                    if(!Ext.getCmp('btnPublicar').isDisabled()) {
                            _this.onClickpublicarPack();
                    }

                },
                scope: _this
            });
        }
    },

    pressDelPack: function (_this) {

        if(typeof(this.delpack) === "undefined"){
            this.delpack = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.DELETE, // or Ext.EventObject.ENTER
                fn: function () {
                    if(!Ext.getCmp('btnElimPack').isDisabled()) {
                        _this.onClickDeletePack();
                    }
                },
                scope: _this
            });
        }

    },

    pressDelRepo: function(_this){
        if(typeof(this.delRepo) === "undefined"){
            this.delRepo = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.DELETE, // or Ext.EventObject.ENTER
                fn: function () {
                    if(!Ext.getCmp('btnElimRepo').isDisabled()){
                        _this.elimRepositorio();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltI: function(_this){
        if(typeof(this.newRepo) === "undefined"){
            this.newRepo = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                alt: true,
                //  defaultEventAction:'stopEvent',
                fn: function () {
                    if(Ext.getCmp('winAddPack')){
                        _this.addRepositorio();
                    }
                },
                scope: _this
            });
        }

    },

    pressAltM: function(_this){
        if(typeof(this.modRepo) === "undefined"){
            this.modRepo = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.M,
                alt: true,
                  defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnModRepo').isDisabled()){
                        _this.addRepositorio(false);
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
                //  defaultEventAction:'stopEvent',
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
                    case 'winAddPack':
                        var btn = Ext.getCmp('btnAceptarPack');
                        if(!btn.isDisabled()){
                            _this.submitFormCreatePack(btn);
                        }
                    break;
                    case 'winAutentication':
                        _this.submitFormAutentic();
                    break;
                    case 'winAddRepo':
                        _this.onClickComprobar(Ext.getCmp('aceptarRepo'));
                    break;
                }

            },
            scope: _this
        });
    },

    pressCtrlAltP: function(_this, win){

        this.CtrlAltP = new Ext.KeyMap(win.getEl(), {
            key: Ext.EventObject.P,
            //  defaultEventAction:'stopEvent',
            alt: true,
            ctrl: true,
            fn: function () {
                switch (win.getId()) {
                    case 'winAddPack':
                        var btn = Ext.getCmp('btnAplicarPack');
                        if(!btn.isDisabled()){
                            _this.submitFormCreatePack(btn);
                        }
                    break;
                    case 'winAddRepo':
                        _this.onClickComprobar(Ext.getCmp('aplicarRepo'));
                        break;
                }

            },
            scope: _this
        });
    }

});
