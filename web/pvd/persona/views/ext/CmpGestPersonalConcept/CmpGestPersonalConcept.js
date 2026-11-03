Ext.ns('Ext.components');

Ext.Component.GestPersonalConcept = Ext.extend(Ext.Window, {
    width: '100%',
    layout: 'border',
    closeAction: 'hide',
    autoValidate: false,
    modal: true,
    initComponent: function () {
        var self = this;
        this.change = false;
        this.inited = false;
        this.force = false;
        this.viewFicha = false;
        /**
         * Boton cerrar para los conceptos no obligatorios
         * @type {Array}
         */
        this.toolToggle = {
            id: 'toggle',
            qtip: 'Alternar entre <b>Collapsar/Contraer</b> el concepto.',
            handler: function (e, target, panel) {
                panel.toggleCollapse(true);
            }
        };
        this.toolRefresh = {
            id: 'refresh',
            qtip: 'Recargar el concepto'
        };
        this.toolHelp = {
            id: 'help',
            qtip: 'Ayuda del concepto'
        };
        this.toolGuardar = {
            id: 'save',
            qtip: 'Guardar datos del concepto',
            handler: function (e, target, panel) {
                if (!panel.isDirty() === false) {
                    self.btnAplicarPers.handler.call(this);
                }
                return;
            }
        };
        this.btnCloseToConcetps = [
            this.toolGuardar,
            this.toolRefresh,
            this.toolToggle,
            //this.toolHelp,
            {
                id: 'close',
                qtip: 'Cerrar el concepto',
                handler: function (e, target, panel) {
                    if (!this.viewFicha) {

                        if (panel.isDirty() === false) {
                            panel.ownerCt.ownerCt.removeConcept(panel, true);
                        } else {
                            mostrarMensaje(2, '&iquest;Desea guardar los cambios efectuados en el concepto?', function (btn) {
                                switch (btn) {
                                    case 'ok':
                                        self.fireEvent('cerrarconcepto');
                                        //executeSaveFn('APLICAR', true);
                                        //var test = self.btnAplicarPers.handler.call(this);
                                        //panel.ownerCt.ownerCt.removeConcept(panel, true);
                                        break;
                                    default:
                                        panel.ownerCt.ownerCt.removeConcept(panel, true);
                                        break;
                                }
                            });
                            return;
                        }
                    } else {
                        panel.ownerCt.ownerCt.removeConcept(panel, true);
                    }
                }.createDelegate(this)
            }
        ];

        /**
         * Panel de conceptos
         * @type {Panel}
         */
        this.tpConcepts = new Ext.components.TreeConcept({
            region: 'west',
            split: true,
            width: '22%',
            minSize: 190,
            maxSize: 400,
            idproyecto: this.configPersona.idproyecto,
            collapsible: true,
            animCollapse: false,
            animate: false,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5'
        });

        this.tpConcepts.getLoader().on('load', function (tl, node, res) {
            this.fireEvent('conceptsReady', node, res);
        }, this, {buffer: 200})

        /**
         * Contenedor del portal de conceptos
         * @type {TabPanel}
         */
        this.tbpPersonalData = new Ext.TabPanel({
            region: 'center',
            margins: '5 5 5 0',
            enableTabScroll: true,
            deferredRender: true,
            plugins: new Ext.TabPanel.TabCloseMenu()
        });

        this.items = [this.tpConcepts, this.tbpPersonalData];

        /**
         * Boton de cancelar de la ventana de gestionar datos personales
         * @type {Button}
         */
        this.btnCancelSavePers = new Ext.Button({
            iconCls: 'cancelar',
            text: this.idioma.lbtnCancelar,
            tooltip: this.idioma.ttBtnCancelar
        });
        /**
         * Boton para guardar los datos sin cerrar el formulario
         * @type {Button}
         */
        this.btnAplicarPers = new Ext.Button({
            id: 'btnAplicarPers',
            iconCls: 'aplicar',
            text: this.idioma.lbtnAplicar,
            tooltip: this.idioma.ttBtnAplicar
        });

        /**
         * Boton de aceptar de la ventana de gestionar datos personales
         * @type {Button}
         */
        this.btnAceptSavePers = new Ext.Button({
            id: 'btnAceptSavePers',
            iconCls: 'aceptar',
            text: this.idioma.lbtnAceptar,
            tooltip: this.idioma.ttBtnAceptar
        });

        this.buttons = [this.btnCancelSavePers, this.btnAplicarPers, this.btnAceptSavePers];

        this.title = this.idioma.lb_Window_title;
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                fn: function () {
                    if (!self.btnAceptSavePers.disabled) {
                        self.btnAceptSavePers.handler();
                    }

                }
            },
            {
                key: 'p',
                alt: true,
                ctrl: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnAplicarPers.disabled) {
                        self.btnAplicarPers.handler();
                    }

                }
            },
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancelSavePers.disabled) {
                        self.btnCancelSavePers.handler();
                    }
                }
            }
        ];
        this.controller = new Ext.Component.GestPersonalConcept_Controller(this, null, this.idioma);


        Ext.Component.GestPersonalConcept.superclass.initComponent.call(this);


    }.createInterceptor(function () {
        this.idioma = Ext.GestPersonalConcept.idioma;
    }),
    addNewPerson: function () {
        this.btnAceptSavePers.show();
        this.btnAplicarPers.show();
        this.controller.newTabConcept(this.tbpPersonalData.items.length, {
            iconCls: 'add',
            tabTip: 'Abrir una nueva pestaña'
        });
        this.tbpPersonalData.setActiveTab(this.tbpPersonalData.items.length - 1);
        this.show();
        this.maximize();
        this.controller.readyToUse(true);
    },
    modPersons: function (recPersons) {
        this.viewFicha = false;
        this.btnAceptSavePers.show();
        this.btnAplicarPers.show();
        this.controller.newTabConcept(this.tbpPersonalData.items.length, {
            iconCls: 'add',
            tabTip: 'Abrir una nueva pestaña'
        });

        Ext.each(recPersons, function (rec, i) {
            this.controller.newTabConcept(i, {
                iconCls: 'user_edit',
                title: rec.get('nombre') + ' ' + rec.get('papel') + ' ' + rec.get('sapel'),
                closable: true,
                status: 'inited',
                //Objecto con los datos de la persona que se esta modificando
                persona: rec.data,
                accion: 'MOD'
            });
        }, this);
        this.tbpPersonalData.setActiveTab(0);
        this.show();
        this.maximize();
        this.controller.readyToUse(true);
    },
    showViewPersons: function (recPersons, viewFicha) {
        this.viewFicha = viewFicha;
        this.btnAceptSavePers.hide();
        this.btnAplicarPers.hide();

        Ext.each(recPersons, function (rec, i) {
            this.controller.newTabConcept(i, {
                iconCls: 'user_edit',
                title: rec.get('nombre') + ' ' + rec.get('papel') + ' ' + rec.get('sapel'),
                closable: true,
                status: 'inited',
                //Objecto con los datos de la persona que se esta modificando
                persona: rec.data,
                accion: 'MOD'
            });
        }, this);
        this.tbpPersonalData.setActiveTab(0);
        this.show();
        this.maximize();
        this.controller.readyToUseView(true);
    }
});

Ext.Component.GestPersonalConcept_Controller = function (view, modelo, idioma, perfil) {
    var self = this;
//------------------------Eventos-------------------------------------------------------------------------------------//

  
    /**
     * Evento click sobre un nodo del arbol
     */
    view.tpConcepts.on('click', function (n) {
        if (n.isLeaf()) {
            if (!view.viewFicha) {
                toggleConcepto(n, true);
            }
            else {
                toggleConceptoView(n, true)
            }
            if (!n.attributes.checked && !n.attributes.obligatorio) {
                checkNodo(n, true);
            }
        }
    });

    /**
     * Evento check del arbol
     */
    view.tpConcepts.on('checkchange', function (n, check) {
        if (check) {
            if (!view.viewFicha) {
                toggleConcepto(n, true);
            }
            else {
                toggleConceptoView(n, true)
            }
        } else {
            if (!view.viewFicha) {
                toggleConcepto(n, false);
            }
            else {
                toggleConceptoView(n, false)
            }
        }
    });

    /**
     * Eventos del window
     */
    view.on('show', function (cmp) {
        view.change = false;
        view.force = false;
        view.tbpPersonalData.addListener('tabchange', self.readyToUse);
    });

    /**
     * Eventos del window
     */
    view.on('hide', function (cmp) {
        view.tbpPersonalData.un('tabchange', self.readyToUse);
        clearTabPanel();
        if (cmp.change) {
            cmp.fireEvent('reload');
        }
    });

    /**
     * Evento para validar si existen cambios sin guardar
     */
    view.on('beforehide', function () {
        if (view.inited) {
            if (view.force) {
                return true;
            } else {
                var leng = view.tbpPersonalData.items.items.length - 2;
                while (leng >= 0) {
                    var cmp = view.tbpPersonalData.items.items[leng];
                    if (cmp.isDirty()) {
                        mostrarMensaje(2, '&iquest;Desea guardar los cambios efectuados en el concepto?', function (btn) {
                            switch (btn) {
                                case 'ok':
                                    view.btnAceptSavePers.handler.call(view);
                                    break;
                                default :
                                    view.force = true;
                                    view.btnCancelSavePers.handler.call(view);
                                    break;
                            }
                        });
                        return false;
                        break;
                    }
                    leng--;
                }
                return true;
            }
        }
    }, this);

    /**
     * Evento del tabPanel para activar nuevos nomialConcept
     */
    view.tbpPersonalData.on('beforetabchange', function (tabPanel, tabNew) {
        switch (tabNew.status) {
            case 'init':
                self.newTabConcept(tabPanel.items.length - 1, {
                    iconCls: 'user_add',//user_add
                    title: 'Nueva persona',
                    closable: true,
                    status: 'inited'
                });
                view.tbpPersonalData.setActiveTab(tabPanel.items.length - 2);
                return false;
                break;
            case 'inited':
                tabNew.addListener('remove', function (cmpParent, cmpChild) {
                    var id = cmpChild.getId().split(cmpChild.idpadre);
                    checkNodo(view.tpConcepts.getNodeByIdConceptoProyecto(id[0]), false);
                });
                return true;
                break;
            default:
                return false;
        }
    });

    view.on('cerrarconcepto', function() {
        executeSaveFn('APLICAR', true);
    });

//---------------------------------Handlers de los botones------------------------------------------------------------//
    /**
     * Handler del boton cancelar.
     */
    view.btnCancelSavePers.setHandler(function () {
        // view.close();
        view.parent.objRecComplejas.pReporte.gpReporte.getSelectionModel().selectFirstRow();
        view.parent.objRecComplejas.pReporte.gpReporte.focus();
        view.hide();


    });

    /**
     * Handler del boton aplicar
     */
    view.btnAplicarPers.setHandler(function () {
        executeSaveFn('APLICAR', false);
        view.btnAplicarPers.enable();
        view.tbpPersonalData.getActiveTab().addListener('change', function (errores) {
            view.change = true;
        });
    });

    /**
     * Handler del boton aceptar
     */
    view.btnAceptSavePers.setHandler(function () {
        executeSaveFn('ACEPTAR', false);
        view.tbpPersonalData.getActiveTab().addListener('change', function (errores) {
            view.change = true;
            if (errores == 0) {
                var leng = view.tbpPersonalData.items.items.length - 2;
                if (leng > 0) {
                    view.tbpPersonalData.remove(view.tbpPersonalData.getActiveTab());
                } else {
                    view.force = true;
                    view.hide();
                }
            }
        });
    });

//---------------------------------Funciones--------------------------------------------------------------------------//
    /**
     * Funcion para ejecutar las funciones save de los conceptos mostrados
     * @param btnPress
     */
    function executeSaveFn(btnPress, close) {
        var arrIds = view.tbpPersonalData.getActiveTab().getConceptActivos();
        Ext.each(arrIds, function (k) {
            var cmp = Ext.getCmp(k);
            if (typeof cmp.saveFn == 'string') {
                if (typeof cmp[cmp.saveFn] == 'function') {
                    cmp[cmp.saveFn].call(cmp, btnPress, close);

                }
            } else if (typeof cmp.saveFn == 'function') {                
                cmp.saveFn.call(cmp, btnPress, close);
            }
        });
    }


    /**
     * Funcion para crear un tabConcept
     * @param pos
     * @param objParam
     */
    this.newTabConcept = function (pos, objParam) {
        var nominalConcept = {
            title: 'M&aacute;s',
            status: 'init',
            xtype: 'portal',
            items: [
                {
                    columnWidth: 1
                }
            ],
            persona: {},
            accion: 'ADD'
        };

        Ext.apply(nominalConcept, objParam);

        view.tbpPersonalData.insert(pos, new Ext.components.NominalConcept(nominalConcept));
        view.inited = true;
    }

    /**
     * Funcion para activar o descativar un concepto del nominalConcept
     * @param n
     * @param bool
     */
    function toggleConcepto(n, bool) {

        var nominalConcept = view.tbpPersonalData.getActiveTab();
        var id = n.attributes.idproyectoconcepto;
        n.attributes.viewFicha = false;
        var concept = concepGenerator(n.attributes, nominalConcept.getId(), false);

        var panel = syncToUseAsConcept(concept, n.attributes.obligatorio || false);
        addHelpHandler(panel.helpHandler);
        addLoadButton();
        Ext.apply(panel, {
            orden: n.attributes.orden
        });

        if (bool) {
            if (nominalConcept.addConcept(panel)) {
                if (nominalConcept.accion == 'MOD') {
                    if (typeof Ext.getCmp(panel.id).loadFn == 'function') {
                        Ext.getCmp(panel.id).loadFn.call(Ext.getCmp(panel.id), nominalConcept.persona.idpersona);
                    }
                }
            }
        } else {
            nominalConcept.removeConcept(panel);
        }
    }

    /**
     * Funcion para activar  concepto del nominalConcept en los datos de vizualizacion
     * @param n
     * @param bool
     */
    function toggleConceptoView(n, bool) {
        var nominalConcept = view.tbpPersonalData.getActiveTab();
        var id = n.attributes.idproyectoconcepto;
        n.attributes.viewFicha = view.viewFicha;
        var concept = concepGenerator(n.attributes, nominalConcept.getId());
        var panel = syncToUseAsConcept(concept, n.attributes.obligatorio || false);
        addHelpHandler(panel.helpHandler);
        addLoadButton();
        Ext.apply(panel, {
            orden: n.attributes.orden
        });

        if (bool) {
            if (nominalConcept.addConcept(panel)) {
                if (nominalConcept.accion == 'MOD') {
                    if (typeof Ext.getCmp(panel.id).loadFn == 'function') {
                        Ext.getCmp(panel.id).loadFn.call(Ext.getCmp(panel.id), nominalConcept.persona.idpersona);
                    }
                }
            }
        } else {

            nominalConcept.removeConcept(panel);
        }
    }

    /**
     * Funcion para adicionar el handler del boton ayuda
     * @param handler
     */
    function addHelpHandler(handler) {
        view.toolHelp.handler = handler || function () {
                Ext.Notification.show({
                    title: 'Informaci&oacute;n',
                    msg: 'La ayuda no esta configurada, Contacte al administrador.',
                    icon: 'info'
                });
            };
    }

    /**
     * Funcion para adicionar el handler del boton refrescar el concepto
     * @param handler
     */
    function addLoadButton() {
        view.toolRefresh.handler = function (e, target, panel) {
            if (Ext.getCmp(panel.idpadre).accion == 'MOD')
                panel.loadFn.call(panel, Ext.getCmp(panel.idpadre).persona.idpersona);
        };
    }

    /**
     *  Funcion para adionar las propiedases al concepto creado para poder ser usado como concepto
     * @param item
     * @param oblg
     * @returns {item}
     */
    function syncToUseAsConcept(item, oblg) {
        Ext.apply(item, {
            draggable: true,
            obligatorio: oblg,
            titleCollapse: true,
            tools: (oblg) ? [ view.toolToggle] : view.btnCloseToConcetps,
            cls: 'x-portlet'
        });

        return item;
    }

    /**
     * Funcion para generar los conceptos
     * @param nodo
     */
    function concepGenerator(nodo, idpadre) {
        var item = {
            accion: 'ADD',
            idown: nodo.idproyectoconcepto,
            id: nodo.idproyectoconcepto + idpadre,
            fdatos: nodo.fdatos,
            idpadre: idpadre,
            viewFicha: nodo.viewFicha,
            segAction: [nodo.add, nodo.mod, nodo.del],
            listeners: {}
        };

        var propInFile = eval('Ext.persona.cmp' + nodo.idproyectoconcepto);
        apply(item, Ext.decode(nodo.propiedades), propInFile);

        if (Ext.isArray(nodo.children)) {
            if (nodo.children.length > 0) {
                item.items = itemGenerator(nodo, item.idpadre);
            }
        }

        return item;
    }

    /**
     * Funcion para generar los items de los containers
     * @param cmp
     * @returns {{layout: string, items: Array}}
     */
    function itemGenerator(nodo, idpadre) {
        var item = [];
        var itemsChildrens = ordenar(nodo.children, nodo.children.length);

        var propiedades = Ext.decode(nodo.propiedades);
        var colw = (propiedades.elementsByRow > 0) ? 1 / propiedades.elementsByRow : 1;
        Ext.each(itemsChildrens, function (cmp) {
            var propertys = Ext.decode(cmp.propiedades);
            if (propertys.hidden !== 'true') {
                if (!Ext.isEmpty(propiedades.layout)) {
                    item.push(concepGenerator(cmp, idpadre));
                } else {
                    item.push({
                        bodyStyle: 'padding:0px 5px 0px 5px',
                        columnWidth: propertys.anchocolumna || colw,
                        layout: 'form',
                        items: concepGenerator(cmp, idpadre)
                    });
                }
            }
        }, this);

        if (!Ext.isEmpty(propiedades.layout)) {
            return item;
        }

        return (item.length > 0) ? {
            layout: 'column',
            items: item
        } : item;
    }

    function ordenar(A, N) {
        function intercambiar(A, i, j) {
            var tmp = A[i];
            A[i] = A[j];
            A[j] = tmp;
        }

        var i, j, k;
        for (i = 0; i < N - 1; i++) {
            for (k = i, j = i + 1; j < N; j++)
                if (parseInt(A[j].orden) < parseInt(A[k].orden))
                    k = j;
            if (k != i)
                intercambiar(A, i, k);
        }
        return A;
    }

    /**
     * Funcion para hacer check o uncheck un nodo del arbol
     * @param n
     * @param bool
     */
    function checkNodo(n, bool) {
        if (!Ext.isEmpty(n)) {
            var nodeUI = n.ui;
            nodeUI.checked = bool;
            nodeUI.checkbox.checked = bool;
            nodeUI.checkbox.defaultChecked = bool;
            n.attributes.checked = bool;
        }
    }

    /**
     * Funcion para mostar los conceptos que son obligatorio una ves iniciada la instancia del nominalConcept
     */
    this.readyToUse = function (ini) {
        for (var p in view.tpConcepts.nodeHash) {
            if (view.tpConcepts.nodeHash[p].attributes.obligatorio == true) {
                toggleConcepto(view.tpConcepts.nodeHash[p], true);
            } else {
                if (ini == true) {
                    view.tpConcepts.nodeHash[p].ui.toggleCheck(false);
                } else if (view.tpConcepts.nodeHash[p].attributes.checked) {
                    toggleConcepto(view.tpConcepts.nodeHash[p], true);
                }
            }
        }
    }

    this.readyToUseView = function (ini) {
        for (var p in view.tpConcepts.nodeHash) {
            if (view.tpConcepts.nodeHash[p].attributes.obligatorio == true) {
                toggleConceptoView(view.tpConcepts.nodeHash[p], true);
            } else {
                if (ini == true) {
                    view.tpConcepts.nodeHash[p].ui.toggleCheck(false);
                } else if (view.tpConcepts.nodeHash[p].attributes.checked) {
                    toggleConceptoView(view.tpConcepts.nodeHash[p], true);
                }
            }
        }
    }

    /**
     * Funcion para limpiar los tabConcepto del nominalConcept
     */
    function clearTabPanel() {

        var leng = view.tbpPersonalData.items.items.length - 1;
        while (leng >= 0) {
            view.tbpPersonalData.remove(view.tbpPersonalData.items.items[leng]);
            leng--;
        }
    }

    /**
     * Funcion para copiar las propiedades de obj a obj
     * @param o
     * @param c
     * @param defaults
     * @returns {object}
     */
    function apply(o, c, defaults) {
        if (defaults) {
            apply(o, defaults);
        }
        if (o && c && typeof c == 'object') {
            for (var p in c) {
                if (!Ext.isEmpty(c[p])) {
                    switch (c[p]) {
                        case 'true':
                            o[p] = true;
                            break;
                        case 'false':
                            o[p] = false;
                            break;
                        case 'now()':
                            o[p] = new Date().format('d/m/Y');
                            break;
                        default :
                            o[p] = c[p];
                            break;
                    }
                }
            }
        }
        return o;
    }
};
