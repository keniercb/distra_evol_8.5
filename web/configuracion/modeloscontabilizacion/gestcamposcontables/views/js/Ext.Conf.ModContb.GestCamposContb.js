/**
 * Componente para la gestión de campos contables.
 * @class Ext.Conf.ModContb.GestCamposContb
 * @extends Ext.Viewport
 * @category Componente
 * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @version 1.0
 */

Ext.ns('Ext.Conf.ModContb');
Ext.onReady(function () {
    new Ext.Conf.ModContb.GestCamposContb({
        idsubsistema: 0
    });
});
Ext.Conf.ModContb.GestCamposContb = Ext.extend(Ext.Viewport, {
    //Properties and Variables
    idsubsistema: -1,
    constructor: function (config) {
        this.baseUrl = '/configuracion/modeloscontabilizacion/gestcamposcontables/index.php/gestcamposcontables/'
        //idioma del sistema
        var idioma = window.parent.perfil.idioma;
        var text = (idioma === 'es') ? 'Cargando...' : 'Loading...';
        var title = (idioma === 'es') ? 'Por favor espere' : 'Please wait...';

        this.onloadMessageBox(title, text);

        Ext.Ajax.request({
            method: "POST",
            url: this.baseUrl + "cargaretiquetas",
            scope: this,
            callback: function (options, success, response) {
                this.idioma = Ext.decode(response.responseText);
                this.perfil = window.parent.perfil;
                this.layout = 'fit',
                    Ext.MessageBox.hide();
                this.cargarInterfaz(this, config.idsubsistema);

                Ext.Conf.ModContb.GestCamposContb.superclass.constructor.call(this, config);

                //Keymap necesario para el trabajo con las teclas rápidas
                this.keyMap = new Ext.KeyMap(this.getEl(), [
                    {
                        key: "i",
                        alt: true,
                        scope: this,
                        fn: function () {
                            this.action = 'adicionar';
                            this.crearwindow('btnAdicionar');
                        }
                    }, {
                        key: "m",
                        alt: true,
                        scope: this,
                        fn: function () {
                            this.action = 'modificar';
                            this.crearwindow(this.getGridSeleccionado().id);
                        }
                    }, {
                        key: "b",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var filter = this.getGridSeleccionado().sf;
                            if (filter.getValue()) {
                                filter.onTrigger2Click();
                            } else {
                                filter.focus();
                            }
                        }
                    }, {
                        key: "l",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var filter = this.getGridSeleccionado().sf;
                            if (filter.getValue()) {
                                filter.onTrigger1Click();
                            }
                        }
                    }, {
                        key: Ext.EventObject.DELETE,
                        scope: this,
                        fn: function () {
                            this.action == 'eliminar';
                            this.eliminar();
                        }
                    }
                ]);
            }
        });


    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    //Crea los componentes visuales
    cargarInterfaz: function (scope, idsubsistema) {
        //accion por default
        this.action = 'adicionar';

        this.grid = new Ext.Conf.ModContb.GestModeloGrid({
            identificador: 'grid-2',
            perfil: scope.perfil,
            idioma: scope.idioma,
            idComponente: 4
        });

        this.tabpanel = new Ext.Conf.ModContb.Tabpanel({
            idsubsistema: idsubsistema,
            perfil: scope.perfil,
            idioma: scope.idioma,
            idComponente: 4,
            activeTab: 1/*,
             items: [
             {
             title: scope.idioma.titlecomun,
             layout: 'fit',
             items: this.grid,
             disabled: true,
             id: -2,
             listeners: {
             'activate': function () {
             var myMask = new Ext.LoadMask(Ext.getBody());
             myMask.show();
             scope.grid.store.removeAll();
             scope.grid.store.load({
             callback: function () {
             myMask.hide();
             }
             });
             }
             }
             }
             ]*/
        });

        this.btnAdicionar = new Ext.Button({
            text: scope.idioma.btnaddcampo,
            tooltip: scope.idioma.tooltipaddcampo,
            iconCls: 'adicionar',
            id: 'btnAdicionar',
            hidden: true
        });

        this.btnEliminar = new Ext.Button({
            text: scope.idioma.btndelcampo,
            tooltip: scope.idioma.lbtooltipEli,
            iconCls: 'eliminar',
            id: 'btnEliminar',
            hidden: true,
            disabled: true
        });

        this.btnAyuda = new Ext.Button({
            text: scope.idioma.btnayuda,
            tooltip: scope.idioma.tooltipayuda,
            iconCls: 'ayuda',
            id: 'btnAyudaCamposContables'
        });

        this.items = {
            xtype: 'panel',
            layout: 'fit',
            tbar: [
                this.btnAdicionar,
                this.btnEliminar,
                '->',
                new Ext.CmbOrganos({
                    idioma: scope.idioma,
                    gridStore: null,
                    tabsubsistemas: this.tabpanel
                }),
                this.btnAyuda
            ],
            items: this.tabpanel
        };

        actionValidate.validate(function () {
            this.tabpanel.createItems();
        }, this);

        this.inicializarEventos();
    },
    //Inicializa los eventos de los componentes visuales
    inicializarEventos: function () {
        var scope = this;
        this.btnAdicionar.on('click', function () {
            this.action = 'adicionar';
            this.crearwindow('btnAdicionar');
        }, this);

        //btn Eliminar campos contables
        this.btnEliminar.on('click', function () {
            this.action = 'eliminar';
            this.eliminar();
        }, this);

        //btn Ayuda
        /*this.btnAyuda.on('click', function () {
         alert('Ayuda')
         }, this);*/

        this.tabpanel.on('nosubsist', function () {
            scope.btnAdicionar.setDisabled(true);
            scope.btnEliminar.setDisabled(true);
        });
        this.tabpanel.on('endload', function () {
            scope.doLayout();
            var array = this.items.items;

            for (var i = 0; i < array.length; i++) {
                var grid = this.items.items[i].items.items[0];
                grid.on('rowaction', function (grid, record, action, rowIndex, colIndex, e) {
                    if (action == 'eliminar') {
                        scope.action == 'eliminar';
                        scope.eliminar();
                    }
                    if (action == 'modificar') {
                        scope.action = 'modificar';
                        scope.crearwindow(scope.getGridSeleccionado().id);
                    }

                });
                var sm = grid.getSelectionModel();
                sm.on({
                    'rowselect': function (sm, rowIndex, record) {
                        if (sm.getCount() >= 1) {
                            scope.btnEliminar.enable();
                        } else {
                            scope.btnEliminar.disable();
                        }
                    },
                    'rowdeselect': function (sm, rowIndex, record) {
                        if (sm.getCount() < 1) {
                            scope.btnEliminar.disable();
                        }
                    }
                });

                var store = grid.getStore();
                store.on(
                    {
                        'load': function () {
                            scope.btnEliminar.disable();
                            scope.btnAdicionar.focus();
                        }
                    }
                );
            }

            Ext.EventManager.on(scope.el, 'keydown', function (e) {
                if (e.getKey() == Ext.EventObject.TAB) {
                    var target = e.getTarget();
                    while (target && target.nodeType === 1 && target !== document.body) {
                        var cmp = Ext.getCmp(target.id);
                        if (cmp && (cmp.text == 'Cancelar' || cmp.text == 'Cancel')) {
                            var dialog = Ext.MessageBox.getDialog(),
                                btncancel = dialog.buttons[3],
                                btnacept = dialog.buttons[0];
                            if (cmp.id == btncancel.id) {
                                e.preventDefault();
                                btnacept.focus();
                            }
                            break;
                        }
                        target = target.parentNode;
                    }
                }
            });
            scope.btnAdicionar.setDisabled(false);
        });
    },
    //Crea y muestra las ventanas para adicionar o modificar un campo contable
    crearwindow: function (idtarget) {
        var scope = this;
        if ((this.action == 'modificar' && this.idsSeleccionados().length == 1) || this.action == 'adicionar') {
            this.keyMap.disable();
            var params = {
                idioma: this.idioma,
                animateTarget: idtarget,
                action: scope.action,
                idsubsistema: scope.getSubsistema()
            }

            if (this.action == 'modificar') {
                params.campocontable = scope.getGridSeleccionado().getSelectionModel().getSelected();
            }
            this.win = new Ext.Conf.ModContb.WinAddCamposContb(params);

            // eventos de la ventana
            if (this.win) {
                this.win.on(
                    {
                        scope: this,
                        addElement: this.recargarGrid,
                        destroy: function () {
                            this.btnAdicionar.focus();
                            this.keyMap.enable();
                        }
                    }
                );
            }
        }
    },
    //Recarga el store del grid que se encuentra activo
    recargarGrid: function () {
        /*var myMask = new Ext.LoadMask(Ext.getBody());
         myMask.show();*/

        this.getGridSeleccionado().getStore().load({
            callback: function () {
                //myMask.hide();
            }
        });
    },
    //retorna el el grid actualmente activo
    getGridSeleccionado: function () {
        var idactivetab = this.tabpanel.getActiveTab().id;
        var idsubsistema = -2
        if (idactivetab != -2) {
            idsubsistema = idactivetab.substring(4);
        }
        return Ext.getCmp('grid' + idsubsistema);
    },
    //retorna el id del subsistema actualmente activo
    getSubsistema: function () {
        var idactivetab = this.tabpanel.getActiveTab().id;
        var idsubsistema = -2
        if (idactivetab != -2) {
            idsubsistema = idactivetab.substring(4);
        }
        return idsubsistema;
    },
    //elimina un campo contable seleccionado
    eliminar: function () {
        var seleccionados = this.idsSeleccionados();
        var scope = this;
        if (seleccionados.length > 0) {
            this.keyMap.disable();
            mostrarMensaje(2, (seleccionados.length > 1) ? scope.idioma.confirmareliminar1 : scope.idioma.confirmareliminar2, function (btn) {
                if (btn == 'ok') {

                    scope.onloadMessageBox(scope.idioma.msgWaitEspera, seleccionados.length == 1 ? scope.idioma.msgWaitEliminado : scope.idioma.msgWaitEliminados);

                    Ext.Ajax.request({
                        url: scope.baseUrl + 'del',
                        scope: scope,
                        params: {
                            ids: Ext.encode(seleccionados)
                        },
                        callback: function (options, success, response) {
                            var response = Ext.decode(response.responseText);

                            Ext.MessageBox.hide();

                            scope.recargarGrid();
                            if (response.errors.length != 0) {
                                var mensaje = '';
                                var store = this.getGridSeleccionado().getStore();
                                if (response.code == 6 || response.code == 7) {
                                    Ext.each(response.errors, function (error, pos) {
                                        if (error.code == 8) {
                                            var index = store.find('idcampo', error.id);
                                            var nombre = store.getAt(index).data.nombre;
                                            if (pos != response.errors.length - 1) {
                                                mensaje += '<b>' + nombre + '</b>, ';
                                            } else {
                                                mensaje += '<b>' + nombre + '</b>.';
                                            }
                                        }
                                    }, this);
                                }
                                if (response.code == 3) {
                                    mostrarMensaje(3, this.idioma.msgError);
                                    this.keyMap.enable();
                                }
                                if (response.code == 4) {
                                    mostrarMensaje(1, this.idioma.msgNoEliminarOne);
                                    this.keyMap.enable();
                                } else if (response.code == 5) {
                                    mostrarMensaje(1, this.idioma.msgNoEliminarMany);
                                    this.keyMap.enable();
                                } else if (response.code == 6) {
                                    this.mostrarMensaje(this.idioma.msgNoEliminarSelectOne + mensaje, function () {
                                        this.keyMap.enable();
                                    }, this);
                                } else {
                                    this.mostrarMensaje(this.idioma.msgNoEliminarSelectMany + mensaje, function () {
                                        this.keyMap.enable();
                                    }, this);
                                }
                            } else {
                                if (seleccionados.length == 1) {
                                    mostrarMensaje(1, this.idioma.msgEliminado);
                                } else {
                                    mostrarMensaje(1, this.idioma.msgEliminados);
                                }
                                scope.keyMap.enable();
                            }
                        }
                    });
                } else {
                    scope.keyMap.enable();
                }
            });
        }

    },
    //devuelve un array con todos los identificadores de los campos contables que estan seleccionados
    idsSeleccionados: function () {
        var array = new Array();
        var select = this.getGridSeleccionado().getSelectionModel().getSelections();
        var cant = this.getGridSeleccionado().getSelectionModel().getCount();
        if (cant > 1) {
            for (var i = 0; i < cant; i++) {
                array.push(select[i].data.idcampo);
            }
        } else if (cant == 1) {
            array.push(select[0].data.idcampo);
        }
        return array;
    },
    mostrarMensaje: function (msg, fn, scope) {
        Ext.MessageBox.show({
            title: this.idioma.titleInfo,
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO,
            fn: fn.call(scope)
        });
    }
});