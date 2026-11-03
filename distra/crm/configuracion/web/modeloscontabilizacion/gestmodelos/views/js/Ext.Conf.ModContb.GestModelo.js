/**
 * Componente para la gestión de modelos contables.
 * @class Ext.Conf.ModContb.GestModelo
 * @extends Ext.Viewport
 * @category Componente
 * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @version 1.0
 */

Ext.ns('Ext.Conf.ModContb');
Ext.onReady(function () {
    new Ext.Conf.ModContb.GestModelo({
        idsubsistema: 0
    });
});
Ext.Conf.ModContb.GestModelo = Ext.extend(Ext.Viewport, {
    //Properties and Variables
    idsubsistema: -1,
    constructor: function (params) {
        //idioma del sistema
        var idioma = window.parent.perfil.idioma;
        var text = (idioma === 'es') ? 'Cargando...' : 'Loading...';
        var title = (idioma === 'es') ? 'Por favor espere...' : 'Please wait...';

        this.onloadMessageBox(title, text);

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            scope: this,
            callback: function (options, success, response) {
                //etiquetas predefinidas
                this.idioma = Ext.decode(response.responseText);
                this.perfil = window.parent.perfil;
                this.idsubsistema = params.idsubsistema;
                this.cargarInterfaz();
                Ext.Conf.ModContb.GestModelo.superclass.constructor.call(this, params);
                Ext.MessageBox.hide();
                //Keymap necesario para el trabajo con las teclas rápidas
                this.keyMap = new Ext.KeyMap(this.getEl(), [
                    {
                        key: "i",
                        alt: true,
                        scope: this,
                        fn: function () {
                            this.action = 'adicionar';
                            var btn = this.btnAdicionar;
                            if (!btn.disabled && !btn.hidden) {
                                this.crearWindow(this, 'btnAdicionar');
                            }
                        }
                    }, {
                        key: "m",
                        alt: true,
                        scope: this,
                        fn: function () {
                            this.action = 'modificar';
                            var actionenabled = this.isRowActionEnabled(this.action);
                            if (actionenabled) {
                                this.crearWindow(this, this.getGridSeleccionado().id);
                            }
                        }
                    }, {
                        key: "c",
                        key: "s",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var btn = this.btnEstado;
                            if (!btn.disabled && !btn.hidden) {
                                this.cambiarEstado();
                            }
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
                            this.action = 'eliminar';
                            var btn = this.btnEliminar,
                                actionenabled = this.isRowActionEnabled(this.action);
                            if (actionenabled || (!btn.disabled && !btn.hidden)) {
                                this.eliminar();
                            }
                        }
                    }
                ]);

                this.inicializarEventos(this);
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
    cargarInterfaz: function () {
        this.layout = 'fit';
        this.xtype = 'viewport';
        this.baseUrl = '/configuracion/modeloscontabilizacion/gestmodelos/index.php/gestionarmodelos/';

        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: this.idioma.lbbtnadionarmodelo,
            iconCls: 'adicionar',
            hidden: true,
            tooltip: this.idioma.lbtooltipAdd
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: this.idioma.lbtneliminarmodelos,
            iconCls: 'eliminar',
            hidden: true,
            disabled: true,
            tooltip: this.idioma.lbtooltipEli
        });

        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: this.idioma.lbtnExportarModelos,
            iconCls: 'exportar',
            hidden: true,
            tooltip: this.idioma.lbTtpExportarModelos
        });

        this.btnImportar = new Ext.Button({
            id: 'btnImportar',
            text: this.idioma.lbtnImportarModelos,
            iconCls: 'importar',
            hidden: true,
            tooltip: this.idioma.lbTtpImportarModelos
        });

        this.btnEstado = new Ext.Button({
            id: 'btnEstado',
            text: this.idioma.lbtncambiarestado,
            iconCls: 'cambiodestado',
            hidden: true,
            disabled: true,
            tooltip: this.idioma.lbtooltipcambiar
        });

        this.btnAyuda = new Ext.Button({
            text: this.idioma.lbbtnayuda,
            iconCls: 'ayuda',
            id: 'btnAyudaModelosContables'
        });

        this.tabpanel = new Ext.Conf.ModContb.Tabpanel({
            idsubsistema: this.idsubsistema,
            perfil: this.perfil,
            idioma: this.idioma,
            idComponente: 1
        });

        this.cmbOrganos = new Ext.CmbOrganos({
            idioma: this.idioma,
            scope: this,
            gridStore: null,
            tabsubsistemas: this.tabpanel
        });

        this.tbar = [this.btnAdicionar, this.btnEliminar, this.btnEstado, '->', this.cmbOrganos, this.btnAyuda];

        this.replicator = new Ext.CmpReplicator({
            tabparent: this.tbar,
            position: 3,
            replicateurl: 'replicarDatos',
            loaddataurl: 'load',
            idioma: this.idioma,
            subsystem: true,
            dataidentifier: 'idmodelo',
            datafields: [{name: 'idmodelo', header: 'Identificador', hidden: true}, {
                name: 'nombre',
                header: 'Nombre',
                id: 'nombremodelo'
            }],
            datatotalProperty: 'total',
            dataroot: 'data',
            dataautoExpandColumn: 'nombremodelo',
            economic: false
        });

        this.items = [{
            xtype: 'panel',
            layout: 'fit',
            tbar: this.tbar,
            items: [this.tabpanel]

        }];

        actionValidate.validate(function () {
            this.tabpanel.createItems();
        }, this);
    },
    //Inicializa los eventos de los componentes visuales
    inicializarEventos: function (scope, defined) {
        var _this = this;
        //Solamente se definen los eventos de estos cmp la primera vez que se llama este metodo
        if (!defined) {
            //btn Adicionar modelo
            if (scope.btnAdicionar) {
                this.btnAdicionar.on('click', function () {
                    this.action = 'adicionar';
                    this.crearWindow(this, 'btnAdicionar');
                }, this);
            }

            //btn Eliminar modelos
            if (scope.btnEliminar) {
                this.btnEliminar.on('click', function () {
                    this.eliminar();
                }, this);
            }

            if (scope.btnExportar) {
                this.btnExportar.on('click', function () {
                    var subsystems = _this.getArraySubsyst();

                    this.winselectmodeloexport = new Ext.Conf.ModContb.WinSelectSubsistExport({
                        idioma: this.idioma,
                        listData: subsystems
                    });

                    this.winselectmodeloexport.btnCancel.on('click', function () {
                        this.winselectmodeloexport.destroy();
                    }, this);

                    this.winselectmodeloexport.btnAccept.on('click', function () {
                        this.exportarModelos();
                    }, this);

                    this.winselectmodeloexport.show();
                }, this);
            }

            if (scope.btnImportar) {
                this.btnImportar.on('click', function () {
                    if (!this.winImportModelo) {
                        this.winImportModelo = new Ext.Conf.ModContb.WinImportModelo({
                            idioma: this.idioma
                        });

                        this.winImportModelo.btnCancel.on('click', function () {
                            this.winImportModelo.hide();
                        }, this);

                        this.winImportModelo.btnAccept.on('click', function () {
                            this.importarModelo();
                        }, this);
                    }
                    this.winImportModelo.show();
                }, this);
            }

            //btn Cambiar estado de los modelos
            if (scope.btnEstado) {
                this.btnEstado.on('click', function () {
                    this.cambiarEstado();
                }, this);
            }

            if (scope.cmbOrganos) {
                scope.cmbOrganos.combo.on({
                    change: function (combo) {
                        console.log(combo.getValue());
                        scope.replicator.idestructura = combo.getValue();
                    }
                })
            }
        }

        this.tabpanel.on({
            endload: function () {
                var array = this.items.items,
                    store = this.getActiveTab().getComponent(0).getStore();
                for (var i = 0; i < array.length; i++) {
                    var panel = this.items.items[i],
                        grid = panel.items.items[0];
                    grid.on('rowaction', function (grid, record, action, rowIndex, colIndex, e) {
                        if (action == 'eliminar') {
                            scope.action == 'eliminar';
                            scope.eliminar();
                        }
                        if (action == 'modificar') {
                            scope.action = 'modificar';
                            scope.crearWindow(scope, scope.getGridSeleccionado().id);
                        }

                    });
                    var sm = grid.getSelectionModel();
                    sm.on({
                        'rowselect': function (sm, rowIndex, record) {
                            if (sm.getCount() >= 1) {
                                scope.btnEliminar.enable();
                                scope.btnEstado.enable();
                            }
                        },
                        'rowdeselect': function (sm, rowIndex, record) {
                            if (sm.getCount() == 0) {
                                scope.btnEliminar.disable();
                                scope.btnEstado.disable();
                            }
                        }
                    });

                    var store = grid.getStore();
                    store.on('load', function () {
                        scope.btnAdicionar.focus();
                    });
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
                _this.doLayout();
                _this.disableButtons(false);

                if (_this.winselectmodeloexport) {
                    _this.winselectmodeloexport.listData = _this.getArraySubsyst();
                }
            },
            nosubsist: _this.disableButtons.bind(_this, true)
        });
    },
    crearWindow: function (scope, idtarget) {
        if ((this.action == 'modificar' && this.idsSeleccionados().length == 1) || this.action == 'adicionar') {
            this.keyMap.disable();
            var params = {
                idioma: scope.idioma,
                action: scope.action,
                animateTarget: idtarget,
                idsubsistema: scope.getSubsistema(),
                xtype: 'window',
                listeners: {
                    scope: scope,
                    'addElement': function () {
                        this.recargarGrid();
                    },
                    show: function (win) {
                        if (win.action === 'modificar') {
                            var mask = new Ext.LoadMask(win.body, {
                                msg: this.idioma.msgCargandoAsientos
                            });
                            mask.show();
                            var record = this.getGridSeleccionado().getSelectionModel().getSelected();

                            win.stvalorAsientos.load({
                                params: {
                                    idmodelo: record.data.idmodelo,
                                    cargaInicial: true
                                },
                                callback: function () {
                                    win.gridAsiento.getStore().load({
                                        scope: this,
                                        params: {
                                            idmodelo: record.data.idmodelo
                                        },
                                        callback: function (records, options, success) {
                                            record.data.nombre = record.data.nombre.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '');
                                            record.data.codigo = record.data.codigo.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '');
                                            win.form.getForm().loadRecord(record);
                                            win.calcular();
                                            mask.hide();
                                        }
                                    });
                                }
                            });

                        }
                    },
                    destroy: function () {
                        this.keyMap.enable();
                        this.btnAdicionar.focus();
                    }
                }
            };
            this.win = new Ext.Conf.ModContb.WinAddModelos(params);
        }
    },
    //retorna el id del subsistema actualmente activo
    getSubsistema: function () {
        var idactivetab = this.tabpanel.getActiveTab().id;
        var idsubsistema = -2;
        if (idactivetab != -2) {
            idsubsistema = idactivetab.substring(4);
        }
        return idsubsistema;
    },
    //retorna el el grid actualmente activo
    getGridSeleccionado: function () {
        var idactivetab = this.tabpanel.getActiveTab().id;
        var idsubsistema = -2;
        if (idactivetab != -2) {
            idsubsistema = idactivetab.substring(4);
        }
        return Ext.getCmp('grid' + idsubsistema);
    },
    //Recarga el store del grid que se encuentra activo
    recargarGrid: function () {
        /* var myMask = new Ext.LoadMask(Ext.getBody());
         myMask.show();*/
        this.getGridSeleccionado().getStore().load({
            scope: this,
            callback: function () {
                this.getGridSeleccionado().getSelectionModel().clearSelections();
                // myMask.hide();
            }
        });
    },
    //devuelve un array con todos los identificadores de los campos contables que estan seleccionados
    idsSeleccionados: function () {
        var array = new Array();
        var select = this.getGridSeleccionado().getSelectionModel().getSelections();
        var cant = this.getGridSeleccionado().getSelectionModel().getCount();
        if (cant > 1) {
            for (var i = 0; i < cant; i++) {
                array.push(select[i].data.idmodelo);
            }
        } else if (cant == 1) {
            array.push(select[0].data.idmodelo);
        }
        return array;
    },
    //Elimina uno o varios modelos selecionados
    eliminar: function () {
        var seleccionados = this.idsSeleccionados();
        var scope = this;
        if (seleccionados.length > 0) {
            this.keyMap.disable();
            mostrarMensaje(2, seleccionados.length == 1 ? this.idioma.confirmareliminar2 : this.idioma.confirmareliminar1, function (btn) {
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

                            this.recargarGrid();

                            if (response.errors.length != 0) {

                                if (response.code == 3) {
                                    mostrarMensaje(3, this.idioma.msgError);
                                    this.keyMap.enable();
                                } else if (response.code >= 4 || response.code <= 7) {
                                    mostrarMensaje(1, this.idioma.msgNoEliminarUso);
                                    this.keyMap.enable();
                                }
                            } else {
                                mostrarMensaje(1, this.idioma.msgEliminado);
                                this.keyMap.enable();
                            }

                        }
                    });
                } else {
                    scope.keyMap.enable();
                }
            });
        }
    },
    exportarModelos: function () {
        var recordSelecteds = this.winselectmodeloexport.subsystemGrid.getSelectionModel().getSelections(),
            lg = recordSelecteds.length,
            idSubsystm = new Array(),
            url;

        for (var i = 0; i < lg; i++)
            idSubsystm.push(recordSelecteds[i].get('idsubsystem'));

        url = document.location.protocol + '//' + document.location.host + this.baseUrl + 'exportarModelos?' + Ext.urlEncode({subsistemas: Ext.encode(idSubsystm)});

        window.open(url);

        this.winselectmodeloexport.destroy();
    },
    importarModelo: function () {

        this.onloadMessageBox(this.idioma.msgTitleWaitImport, this.idioma.msgTextWaitGuardando);
        this.winImportModelo.form.getForm().submit({
            url: this.baseUrl + 'importarModelos',
            success: function (fp, o) {
                Ext.MessageBox.hide();
                var reponseInfo = Ext.decode(o.response.responseText);
                if (reponseInfo.success) {
                    mostrarMensaje(1, this.idioma.lbMsgSuccessImporModelos);
                    this.winImportModelo.hide();
                }
            },
            failure: function () {

            },
            scope: this
        });
    },
    //Cambia el estado de uno o varios modelos seleccionados
    cambiarEstado: function () {
        var seleccionados = this.idsSeleccionados();
        var scope = this;
        if (seleccionados.length > 0) {
            this.keyMap.disable();
            mostrarMensaje(2, seleccionados.length == 1 ? this.idioma.confirmarcambiarestado2 : this.idioma.confirmarcambiarestado1, function (btn) {
                if (btn == 'ok') {
                    var myMask = new Ext.LoadMask(Ext.getBody());
                    myMask.show();
                    Ext.Ajax.request({
                        url: scope.baseUrl + 'cambiarEstado',
                        params: {
                            ids: Ext.encode(seleccionados)
                        },
                        callback: function () {
                            myMask.hide();
                            scope.keyMap.enable();
                            mostrarMensaje(1, seleccionados.length == 1 ? scope.idioma.msgModificado : scope.idioma.msgModificados);
                            scope.recargarGrid();
                        }
                    });
                } else {
                    scope.keyMap.enable();
                }
            });
        }
    },
    mostrarMensaje: function (msg, fn, scope) {
        Ext.MessageBox.show({
            title: this.idioma.titleInfo,
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO,
            fn: fn.call(scope)
        });
    },
    //Muestra un mensaje de espera
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    },
    changeEntity: function () {
        this.getComponent(0).remove(this.tabpanel);
        this.tabpanel = new Ext.Conf.ModContb.Tabpanel({
            idsubsistema: this.idsubsistema,
            perfil: this.perfil,
            idioma: this.idioma,
            idComponente: 1
        });
        this.inicializarEventos(this, true);
        this.getComponent(0).add(this.tabpanel);
        this.tabpanel.createItems();
    },
    disableButtons: function (disable) {
        Ext.each(this.tbar, function (item) {
            if (!item.form && item.text != 'Ayuda' && typeof item != 'string' && item.id != 'cmborgano') {
                item = Ext.getCmp(item.id);
                if (disable == false && (item == this.btnEliminar || item == this.btnEstado)) {
                    item.setDisabled(true);
                } else {
                    item.setDisabled(disable);
                }
            }
        }, this);
    },
    //retorna los subsitemas de la entidad
    getArraySubsyst: function () {
        var subsystems = new Array();
        this.tabpanel.items.each(function (elem) {
            subsystems.push([elem.id.split(' ')[1], elem.title]);
        }, this);
        return subsystems;
    },
    isRowActionEnabled: function (id) {
        var enabled = false;
        if (!this.tabpanel.getComponent(0)) {
            return false;
        }
        var grid = this.getGridSeleccionado();
        Ext.each(grid.rowaction.actions, function (action) {
            if (id == action.id && !action.hide) {
                enabled = true;
            }
        });
        return enabled;
    }
});




