Ext.namespace('Caja.GestCajaFondo');
Ext.QuickTips.init();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Caja.GestCajaFondo.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
    }
});

Caja.GestCajaFondo.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {

        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        this.taskRunner = new Ext.util.TaskRunner();

        this.panelCaja = new Caja.GestCaja.PanelCaja({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            frame: true,
            border: false,
            region: 'center'
        });

        this.panelTalonario = new Caja.GestFondo.PanelTalonario({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'center',
            disabled: false
        });

        this.panelTalonario2 = new Ext.Panel({
            idioma: params.idioma,
            perfil: params.perfil,
            layout: 'border',
            region: 'east',
            border: false,
            split: true,
            frame: true,
            title: params.idioma.lbConsecutivos,
            width: '25%',
            items: this.panelTalonario
        });

        this.panelPermiso = new Caja.GestCaja.PanelPermiso({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            border: false,
            region: 'center',
            disabled: false
        });

        this.panelPermiso2 = new Ext.Panel({
            idioma: params.idioma,
            perfil: params.perfil,
            layout: 'border',
            region: 'east',
            border: false,
            split: true,
            frame: true,
            title: params.idioma.lbPermiso,
            // collapsed: true,
            // collapsible: true,
            width: '25%',
//            margins: '0 0 0 3',
            items: this.panelPermiso
        });
        this.panelCajaPermiso = new Ext.Panel({
            layout: 'border',
            region: 'center',
            //collapsible: true,
            //collapsed: true,
            border: false,
            split: true,
            //frame: true,
            title: params.idioma.lbGestCaja,
            items: [this.panelCaja, this.panelPermiso2]//, this.panelOperaciones2]
        });

        this.panelFondo = new Caja.GestFondo.PanelFondo({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this
        });

        this.panelFondoTalonario = new Ext.Panel({
            region: 'south',
            layout: 'border',
            height: Ext.lib.Dom.getViewHeight() * 0.5,
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            border: false,
            split: true,
            title: params.idioma.lbGestFondo,
            items: [this.panelFondo]
            //items: [this.panelFondo, this.panelTalonario2]
        });

        this.panelGeneral = new Ext.Panel({
            layout: 'border',
            frame: false,
            border: false,
            tbar: ['->',
                this.btnAyuda = new Ext.Button({
                    id: 'btnAyudaCajaFondo',
                    text: params.idioma.lbBtnAyuda,
                    tooltip: params.idioma.lbToolAyuda,
                    //icon: params.perfil.dirImg + 'ayuda.png',
                    iconCls: 'ayuda'
                })],
            items: [this.panelCajaPermiso, this.panelFondoTalonario]
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
            items: [this.panelGeneral]
        });

        this.initGlobalsKeys();
        this.initEventos();
        this.initFunctions();

        Caja.GestCajaFondo.Viewport.superclass.constructor.call(this, params);
    },
    initGlobalsKeys: function () {

        this.keyMapa = new Ext.KeyMap(document, [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    this.panelCaja.btnAddCaja.fireEvent('click');
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!this.panelCaja.btnModCaja.disabled)
                        this.panelCaja.btnModCaja.fireEvent('click');
                }
            }, {
                key: Ext.EventObject.DELETE,
                //alt: true,
                scope: this,
                fn: function () {
                    if (!this.panelCaja.btnDelCaja.disabled)
                        this.panelCaja.btnDelCaja.fireEvent('click');
                }
            }, /*{
             key: "t",
             alt: true,
             scope: this,
             fn: function () {
             if (!this.panelCaja.btnTalonario.disabled)
             this.panelCaja.btnTalonario.fireEvent('click');
             }
             }, {
             key: "p",
             ctrl: true,
             alt: true,
             scope: this,
             fn: function () {
             if (!this.panelFondo.btnPermiso.disabled)
             this.panelFondo.btnPermiso.fireEvent('click');
             }
             },*/ {
                key: "i",
                ctrl: true,
                scope: this,
                fn: function () {
                    this.panelFondo.btnAddFondo.fireEvent('click');
                }
            }, {
                key: "m",
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelFondo.btnModFondo.disabled)
                        this.panelFondo.btnModFondo.fireEvent('click');
                }
            }, {
                key: Ext.EventObject.DELETE,
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelFondo.btnDelFondo.disabled)
                        this.panelFondo.btnDelFondo.fireEvent('click');
                }
            }, {
                key: "c",
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelFondo.btnAsocDes.disabled)
                        this.panelFondo.btnAsocDes.fireEvent('click');
                }
            }, {
                key: "a",
                ctrl: true,
                scope: this,
                fn: function () {
                    if (!this.panelFondo.btnAperturar.disabled)
                        this.panelFondo.btnAperturar.fireEvent('click');
                }
            }, {
                key: "h",
                alt: true,
                fn: function () {
                    //this.btnAyuda.fireEvent('click');
                }
            }
        ]);
    },
    initEventos: function () {
        this.panelCaja.gpCaja.on({
            scope: this,
            dblclick: function () {
                this.panelFondo.stFondo.load();
//                if (this.panelFondo2.collapsed)
//                    this.panelFondo2.expand(true);
//                else
//                    this.panelFondo2.collapse(true);
            }
        });
        this.panelFondo.gpFondo.on({
            scope: this,
            dblclick: function () {
                if (this.panelFondo.smFondo.getSelected())
                    if (this.panelFondo.smFondo.getSelected().data.idcajafondo) {
                        this.panelFondo.btnPermiso.fireEvent('click');
//                        this.panelFondo.btnOperaciones.fireEvent('click');
//                        if (this.panelOperaciones2.collapsed)
//                            this.panelOperaciones2.expand(true);
//                        else
//                            this.panelOperaciones2.collapse(true);
                    }
            }
        });
        // this.panelOperaciones2.on({
        //     scope: this,
        //     expand: function () {
        //         if (this.panelFondo.smFondo.getSelected())
        //             if (this.panelFondo.smFondo.getSelected().data.idcajafondo) {
        //                 this.panelFondo.btnOperaciones.fireEvent('click');
        //             }
        //     }
        // });
        this.panelPermiso2.on({
            scope: this,
            expand: function () {
                if (this.panelCaja.smCaja.getSelected())
                    this.panelCaja.btnPermiso.fireEvent('click');
            }
        });
        this.panelCaja.on({
            scope: this,
            showWinCaja: function (mod) {
                this.windowCaja = new Caja.GestCaja.WindowCaja({
                    idioma: this.idioma,
                    perfil: this.perfil,
                    defaultButton: 0,
                    scope: this,
                    title: (mod) ? this.idioma.lbModCaja : this.idioma.lbAddCaja,
                    listeners: {
                        scope: this,
                        show: function (window) {
                            this.keyMapa.disable();
                            this.windowCaja.btnCancelar.focus();
                            Ext.getCmp('btnCancelar').focus(true);
                            this.windowCaja.formCaja.getForm().isValid();
                            //Agregando un keymap al boton aceptar
                            this.windowCaja.btnAceptar.getEl().addKeyMap([
                                {
                                    key: Ext.EventObject.TAB,
                                    stopEvent: true,
                                    scope: this,
                                    fn: function () {
                                        this.windowCaja.tfCodigo.focus(true, true);
                                    }
                                }
                            ]);
                            //Agregando un keymap al tfcodigo
                            this.windowCaja.tfCodigo.getEl().addKeyMap({
                                key: Ext.EventObject.TAB,
                                shift: true,
                                stopEvent: true,
                                scope: this,
                                fn: function () {
                                    this.windowCaja.btnAceptar.focus();
                                }
                            });
                        },
                        close: function (window) {
                            this.stopTaskValidForm();
                            this.keyMapa.enable();
                            this.panelCaja.btnAddCaja.focus();
                        }
                    }
                });
                this.windowCaja.btnAplicar.setVisible((mod) ? false : true);
                this.windowCaja.setTitle((mod) ? this.idioma.lbModCaja : this.idioma.lbAddCaja);

                this.windowCaja.show();
                this.windowCaja.doLayout();
                if (mod) {
                    this.windowCaja.cargarWinModCaja(this.panelCaja.gpCaja.getSelectionModel().getSelected());
                    //this.windowCaja.tfDenominacion.focus(true, 100);
                    this.windowCaja.autoValidate = false;
                    this.windowCaja.btnAceptar.setDisabled(true);
                    this.startTaskValidForm(this.windowCaja.formCaja.getForm(), 'mod', [this.windowCaja.btnAceptar]);

                } else this.windowCaja.tfCodigo.focus(true, 100);

            },
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.tfDenominacion.focus();
                }
            }
        });
        this.panelFondo.on({
            scope: this,
            showWinFondo: function (mod) {
                this.windowFondo = new Caja.GestFondo.WindowFondo({
                    idioma: this.idioma,
                    perfil: this.perfil,
                    defaultButton: 0,
                    scope: this,
                    listeners: {
                        scope: this,
                        show: function (window) {
                            this.windowFondo.formFondo.getForm().isValid();
                            this.keyMapa.disable();
                            //Agregando un keymap al boton aceptar
                            this.windowFondo.btnAceptar.getEl().addKeyMap([
                                {
                                    key: Ext.EventObject.TAB,
                                    stopEvent: true,
                                    scope: this,
                                    fn: function () {
                                        this.windowFondo.tfCodigo.focus(true, true);
                                    }
                                }
                            ]);
                            //Agregando un keymap al tfcodigo
                            this.windowFondo.tfCodigo.getEl().addKeyMap({
                                key: Ext.EventObject.TAB,
                                shift: true,
                                stopEvent: true,
                                scope: this,
                                fn: function () {
                                    this.windowFondo.btnAceptar.focus();
                                }
                            });
                        },
                        close: function (panel) {
                            this.stopTaskValidForm();
                            this.keyMapa.enable();
                            this.panelFondo.btnAddFondo.focus();
                        }
                    }
                });
                this.windowFondo.btnAplicar.setVisible((mod) ? false : true);
                this.windowFondo.setTitle((mod) ? this.idioma.lbModFondo : this.idioma.lbAddFondo);

                this.windowFondo.show();
                this.windowFondo.doLayout();
                if (mod) {
                    this.windowFondo.cargarWinModFondo(this.panelFondo.gpFondo.getSelectionModel().getSelected());
                    //this.windowFondo.tfDenominacion.focus(true, 100);
                    this.windowFondo.autoValidate = false;
                    this.windowFondo.btnAceptar.setDisabled(true);
                    this.startTaskValidForm(this.windowFondo.formFondo.getForm(), 'mod', [this.windowFondo.btnAceptar]);
                } else {
                    this.windowFondo.tfCodigo.focus(true, 100);
                }
            }
        });
    },
    initFunctions: function () {
        this.lMaskEspere = function () {
            this.lMask = new Ext.LoadMask(this.panelGeneral.body, {//body de la ventana
                msg: this.idioma.lbEspere,
                removeMask: false
            });
            this.lMask.show();
        };
        //Tarea para validar los botones de la ventana--------------------------------------------
        this.startTaskValidForm = function (form, accion, arrayButtons) {
            this.tarea = {
                run: function () {
                    if (accion === 'add') {
                        if (form.isValid()) {
                            Ext.each(arrayButtons, function (btn) {
                                btn.setDisabled(false);
                            });
                        }
                        else {
                            Ext.each(arrayButtons, function (btn) {
                                btn.setDisabled(true);
                            });
                        }
                    }
                    else {
                        if (form.isValid() && form.isDirty()) {
                            Ext.each(arrayButtons, function (btn) {
                                btn.setDisabled(false);
                            });
                        }
                        else {
                            Ext.each(arrayButtons, function (btn) {
                                btn.setDisabled(true);
                            });
                        }
                    }
                },
                interval: 500
            };

            this.taskRunner.start(this.tarea);
        }
        //---
        this.stopTaskValidForm = function () {
            if (!Ext.isEmpty(this.tarea)) {
                this.taskRunner.stop(this.tarea);
            }
        }
        //------------------------------------------------------------------------------------------
    }
})