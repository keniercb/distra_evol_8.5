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
    constructor: function (params) {
        var idioma = window.parent.perfil.idioma;
        var text = (idioma === 'es') ? 'Cargando...' : 'Loading...';
        var title = (idioma === 'es') ? 'Por favor espere...' : 'Please wait...';

        this.onloadMessageBox(title, text);

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            scope: this,
            callback: function (options, success, response) {
                var idioma = this.idioma = Ext.decode(response.responseText);
                var perfil = window.parent.perfil;

                var btnadd = this.btnadd = new Ext.Button({
                    id: 'btnAdicionar',
                    text: idioma.lbbtnaddbtnaddoperacion,
                    iconCls: 'adicionar',
                    tooltip: idioma.tooltipbtnaddoperacion,
                    hidden: true
                });

                var btnasociarentidad = this.btnasociarentidad = new Ext.Button({
                    id: 'btnAsociarEntidad',
                    text: idioma.lbbtnaddbtnbtnasociarentidad,
                    disabled: true,
                    iconCls: 'usarentidad verde',
                    tooltip: idioma.tooltipbtnbtnasociarentidad,
                    hidden: true
                });

                var btndel = this.btndel = new Ext.Button({
                    id: 'btnEliminar',
                    text: idioma.lbtndeloperacion,
                    iconCls: 'eliminar',
                    disabled: true,
                    tooltip: idioma.tooltipbtndeloperacion,
                    hidden: true
                });

                var btnsave = this.btnsave = new Ext.Button({
                    id: 'btnGuardar',
                    text: idioma.lbbtnsave,
                    tooltip: idioma.tooltipbtnsave,
                    disabled: true,
                    iconCls: 'guardar',
                    hidden: true
                });

                var btnactualizar = this.btnactualizar = new Ext.Button({
                    id: 'btnActualizar',
                    tooltip: 'Actualizar',
                    iconCls: 'actualizar',
                    // hidden: true
                });

                var btndescartar = this.btndescartar = new Ext.Button({
                    id: 'btnDeshacer',
                    text: idioma.lbbtndescartar,
                    tooltip: idioma.tooltipbtndescartar,
                    disabled: true,
                    iconCls: 'deshacer',
                    hidden: true
                });

                var btnayuda = params.btnayuda = new Ext.Button({
                    id: 'btnAyudaOperacionesContables'/* + params.idsubsistema*/,
                    text: idioma.lbbtnayuda,
                    tooltip: idioma.tooltipayuda,
                    iconCls: 'ayuda'
                });

                params.tabsubsistemas = new Ext.Conf.TabpanelSubsistemas.Operaciones({
                    perfil: perfil,
                    idioma: idioma,
                    region: 'center',
                    viewport:this
                });

                var cmbOrganos = new Ext.CmbOrganos({
                    idioma: idioma,
                    gridStore: null,
                    tabsubsistemas: params.tabsubsistemas
                });

                params.tbar = [btnadd, btndel, btnasociarentidad, '->', cmbOrganos, btnayuda];

                params.template = new Ext.CmpTemplate({
                    tabparent: params.tbar,
                    position: 3,
                    createurl: 'crearPlantilla',
                    useurl: 'usarPlantilla',
                    idioma:idioma,
                    subsystem: true
                    
                });

                Ext.getCmp('btnCreateTemplate').setDisabled(true);
                Ext.getCmp('btnUseTemplate').setDisabled(true);

                //Panel que contiene el componente
                params.panel = new Ext.Panel({
                    id: 'paneloperaciones',
                    layout: 'border',
                    border: false,
                    tbar: params.tbar,
                    items: [params.tabsubsistemas],
                    bbar: [btnactualizar, '->', {text: '',disabled:true},btndescartar, btnsave]
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
                actionValidate.validate(function () {
                    this.createKeyMap(idioma);
                    this.tabsubsistemas.createItems();
                },this);
                params.tabsubsistemas.on({
                    'nosubsist': function (disable) {
                    Ext.each(params.tbar, function (item) {
                        if (!item.form && item.text != 'Ayuda' && typeof item != 'string' && item.id != 'cmborgano') {
                            item = Ext.getCmp(item.id);
                            item.setDisabled(disable);
                        }
                    }, params);
                }
                })

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
    inicializarEventos: function (perfil, idioma) {
        var scope = this;
        this.tabsubsistemas.on('endload', function (tabpanel) {
            //Refresca la vista del viewport, necesario para que el pagin toolbar salga bien
            this.doLayout();
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
        }, this);

        this.btnadd.on({
            scope: this,
            click: function (button, e) {
                this.getActiveGrid().insertarRow();
            }
        });

        this.btnasociarentidad.on({
            scope: this,
            click: function (button, e) {
                this.getActiveGrid().asociarEntidad();
            }
        });

        this.btndel.on('click', function (button, e) {
            this.getActiveGrid().deleteRows(idioma);
        }, this);

        this.btnsave.on('click', function (button, e) {
            this.getActiveGrid().saveData(idioma);
        }, this);

        this.btnactualizar.on('click', function (button, e) {
            this.getActiveGrid().getStore().load();
        }, this);

        this.btndescartar.on('click', function (button, e) {
            this.getActiveGrid().descartarCambios(idioma);
        }, this);

        this.template.on({
            scope: this,
            confirm: function (action) {
                if (action == 'use') {
                    this.tabsubsistemas.getActiveTab().getComponent(0).getStore().load();
                }
            }
        });
    },
    getActiveGrid: function () {
        return this.tabsubsistemas.getActiveTab().getComponent(0);
    },
    createKeyMap: function (idioma) {
        var _this = this;
        this.mapaTeclas = new Ext.KeyMap(Ext.getBody(), [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    var btn = this.btnadd;
                    if (!btn.disabled && !btn.hidden) {
                        _this.getActiveGrid().insertarRow();
                    }
                }
            }, {
                key: "g",
                alt: true,
                scope: this,
                fn: function () {
                    var btn = this.btnsave;
                    if (!btn.disabled  && !btn.hidden) {
                        _this.getActiveGrid().saveData(idioma);
                    }
                }
            }, {
                key: "z",
                alt: true,
                scope: this,
                fn: function () {
                    var btn = this.btndescartar;
                    if (!btn.disabled  && !btn.hidden) {
                        _this.getActiveGrid().descartarCambios(idioma);
                    }
                }
            }, {
                key: Ext.EventObject.DELETE,
                scope: this,
                fn: function () {
                    var btn = this.btndel;
                    if(!btn.disabled && !btn.hidden){
                        _this.getActiveGrid().deleteRows(idioma);
                    }
                }
            },
            {
                key: "u",
                alt: true,
                scope: this,
                fn: function () {
                    var btn = this.btnasociarentidad;
                    if (!btn.disabled  && !btn.hidden) {
                        _this.getActiveGrid().asociarEntidad();
                    }
                }
            }, {
                key: "b",
                alt: true,
                scope: this,
                fn: function () {
                    var filter = _this.getActiveGrid().sf;
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
                    var filter = gridactivo.sf;
                    if (filter.getValue()) {
                        filter.onTrigger1Click();
                    }
                }
            }
        ]);

    }
});

new Ext.Conf.GestOperaciones({});