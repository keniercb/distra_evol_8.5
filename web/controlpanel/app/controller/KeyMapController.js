Ext.define('Controlpanel.controller.keymap', {

    alias: 'widget.keymapController',

    init: function (){},

    pressAltI: function(_this){
        if(typeof(this.newRepo) === "undefined"){
            this.newRepo = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addrepo').isDisabled()){
                        _this.onClickNewRepo();
                    }

                },
                scope: _this
            });
        }

    },

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

    pressAltB: function (_this) {

        this.filtrar = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.B,
            alt: true,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                _this.filtrarGridPacks();

            },
            scope: _this
        });
    },

    pressAltL: function (_this) {

        this.limpiar = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.L,
            alt: true,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                if(!Ext.getCmp('clearFiltroGridPack').isDisabled()){
                    _this.limpiarFiltroGridPacks();
                }

            },
            scope: _this
        });
    },

    pressDelPack: function (_this) {

        if(typeof(this.delpack) === "undefined"){
            this.delpack = new Ext.KeyMap(Ext.get('gridPacked'), {
                key: Ext.EventObject.DELETE, // or Ext.EventObject.ENTER
                fn: function () {
                    _this.onClickDeletePack();
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
                    if(!Ext.getCmp('elimrepo').isDisabled())
                    _this.onClickElimRepo();
                },
                scope: _this
            });
        }else{
            this.delRepo.setDisabled(false);
        }

    },


    pressAltM: function(_this){
        if(typeof(this.modRepo) === "undefined"){
            this.modRepo = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.M,
                alt: true,
                  defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('modrepo').isDisabled()){
                        _this.onClickModfRepo();
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
            defaultEventAction:'stopEvent',
            fn: function () {
                switch (win.getId()) {
                    case 'winAddRepo':
                        var btn = Ext.getCmp('aceptarRepo');
                        if(!btn.isDisabled()){
                            _this.addRepo(btn);
                        }
                    break;
                    case 'winAux':

                        var btn = Ext.getCmp('aceptarApp');
                        if(!btn.isDisabled()){
                            _this.confirmCompile();
                        }
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
                    case 'winAddRepo':
                        var btn = Ext.getCmp('aplicarRepo');
                        if(!btn.isDisabled()){
                            _this.addRepo(btn);
                        }

                }

            },
            scope: _this
        });
    },

    pressCtrlShiftI: function(_this){

        this.CtrlAltI = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.I,
            //  defaultEventAction:'stopEvent',
            shift: true,
            ctrl: true,
            fn: function () {
               if(!Ext.getCmp('instalar').isDisabled()){
                   _this.installPack();
               }

            },
            scope: _this
        });
    },

    pressCtrlShiftD: function(_this){

        this.CtrlAltD = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.D,
            //  defaultEventAction:'stopEvent',
            shift: true,
            ctrl: true,
            fn: function () {
                if(!Ext.getCmp('desintalar').isDisabled()){
                    _this.desintalarPack();
                }

            },
            scope: _this
        });
    },

    pressCtrlAltZ: function(_this){

        this.CtrlAltZ = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.Z,
            //  defaultEventAction:'stopEvent',
            alt: true,
            ctrl: true,
            fn: function () {
                if(!Ext.getCmp('actualizar').isDisabled()){
                    _this.actualizarPack();
                }

            },
            scope: _this
        });
    },

    pressAltShiftD: function(_this){

        this.AltShiftD = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.R,
            //  defaultEventAction:'stopEvent',
            shift: true,
            alt: true,
            fn: function () {
                if(!Ext.getCmp('reinstalar').isDisabled()){
                    _this.reinstalarPack();
                }

            },
            scope: _this
        });
    },

    pressAltShiftV: function(_this){

        this.AltShiftV = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.Z,
            //  defaultEventAction:'stopEvent',
            //shift: true,
            alt: true,
            fn: function () {
                if(!Ext.getCmp('revertir').isDisabled()){
                    _this.revertirPack();
                }

            },
            scope: _this
        });
    },

    pressCtrlAltL: function(_this){

        if(typeof(this.limpFiltroTree) === "undefined"){
            this.limpFiltroTree = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.L,
                ctrl: true,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnLimpiarTree').disabled){
                        _this.limpiarFiltroTree();
                    }

                },
                scope: _this
            });
        }
    }

});
