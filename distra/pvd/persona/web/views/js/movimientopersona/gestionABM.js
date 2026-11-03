Ext.ns('Ext.Persona');
Ext.Persona.gestionABM = Ext.extend(Ext.Panel, {
    title: 'Actualidad',
    layout: 'border',
    border: false,
    btn: {},
    dataEstructura: {
        node: {},
        isCargo: false,
        nodeEntidad: {}
    },
    initComponent: function () {
        this.advancedSearch();
        this.addEvents('alta', 'movimiento', 'baja', 'modificar', 'normal');

        var config = {
            region: 'center',
            layout: 'card',
            activeItem: 0,
            border: false,
            items: []
        };

        config = this.generateItems(config);
        config = this.generateToolbar(config);

        this.pAsociar = new Ext.Panel(config);

        this.items = [];
        if (!Ext.isEmpty(this.fpAdvancedSearch)) {
            this.items.push(this.fpAdvancedSearch);
        }
        this.items.push(this.pAsociar);

        Ext.Persona.gestionABM.superclass.initComponent.call(this);
    },
    generateItems: function (config) {

        this.initListadoSituacionLaboral();
        this.initPersonasAlta();

        if (!Ext.isEmpty(this.gpListadoSituacionLaboral)) {
            config.items.push(this.gpListadoSituacionLaboral);
        } else {
            config.items.push({html: 'asdas'});
        }
        if (!Ext.isEmpty(this.gpListadoPersona)) {
            config.items.push(this.gpListadoPersona);
        }
        return config;
    },
    generateToolbar: function (config) {

        var tbar = this.iniButton();

        if (!Ext.isEmpty(this.fpAdvancedSearch)) {
            tbar = this.fpAdvancedSearch.getFastSearch(tbar);
        }
        if (tbar.length > 0) {
            config.tbar = tbar;
        }
        return config;
    },
    advancedSearch: function () {
        try {
            this.fpAdvancedSearch = new Ext.Persona.busquedaAvanzadaPersona({
                region: 'east',
                margins: '0 0 5 5'
            });
        } catch (Error) {
            this.fpAdvancedSearch = null;
        }

    },
    iniButton: function (arg) {

        this.btn = [];

        if (!Ext.isEmpty(this.gpListadoPersona)) {
            var obj = this.gpListadoPersona.getButtons();
            for (var b in obj) {
                this.btn.push(obj[b]);
            }
            this.gpListadoPersona.setHandlerAsociar(this.asociarHandler, this);
            this.gpListadoPersona.setHandlerCancelar(this.cancelarHandler, this);
        }
        if (!Ext.isEmpty(this.gpListadoSituacionLaboral)) {
            var obj = this.gpListadoSituacionLaboral.getButtons();
            for (var b in obj) {
                this.btn.push(obj[b]);
            }
        }

        this.btnSyncCargos = new Ext.Button({
            hidden: true,
            iconCls: 'btn',
            icon: perfil.dirImg + 'actualizar.png',
            tooltip: 'Actualizar completamiento de plantilla',
            scope: this,
            handler: this.syncCargosOcupacion
        });

        this.btnAyuda = new Ext.Button({
            iconCls: 'btn',
            icon: perfil.dirImg + 'ayuda.png',
            text: this.idioma.lbBtnAyuda
        });

        this.btn.push(this.btnSyncCargos);
        this.btn.push('->',this.btnAyuda);

        return this.btn;
    },
    initListadoSituacionLaboral: function () {
       /* this.gpListadoSituacionLaboral = new Ext.Persona.listadoSituacionLaboral();*/

        try {
            this.gpListadoSituacionLaboral = new Ext.Persona.listadoSituacionLaboral();

            this.bindStore(this.gpListadoSituacionLaboral.getGridSA().getStore());

            this.gpListadoSituacionLaboral.on('baja', function () {
                this.setVisibleButtonsTbar(false);
            }, this);

            this.gpListadoSituacionLaboral.on('normal', function (g) {
                this.bindStore(g.getStore());
                this.setVisibleButtonsTbar(true);
            }, this);

            this.gpListadoSituacionLaboral.on('editando', function () {
                this.setVisibleButtonsTbar(false);
            }, this);

            this.gpListadoSituacionLaboral.on('mov', function (g) {
                this.bindStore(g.getStore());
            }, this);

            this.gpListadoSituacionLaboral.getGridSA().on('rowdblclick', function (grid, i) {
                var record = grid.getStore().getAt(i);
                if (!Ext.isEmpty(record.get('rutaids'))) {
                    var path = '/Estructuras/' + record.get('rutaids');
                    this.fireEvent('expandirArbol', path, record.get('idcargo'));
                }
            }, this);

        } catch (e) {
            this.gpListadoSituacionLaboral = {html: "asdasdasdads"};
        }
    },
    initPersonasAlta: function () {
        try {
            this.gpListadoPersona = new Ext.Persona.altaEntidad();
        } catch (error) {
            this.gpListadoPersona = null;
        }
    },
    bindStore: function (st) {
        if (!Ext.isEmpty(this.fpAdvancedSearch)) {
            this.fpAdvancedSearch.bindStore(st);
        }
    },
    asociarHandler: function () {
        this.fireEvent('alta');
        this.pAsociar.getLayout().setActiveItem(1);
        this.setVisibleButtonsTbar(false);
        this.bindStore(this.gpListadoPersona.getGrid().getStore());
    },
    cancelarHandler: function () {
        this.fireEvent('normal');
        this.pAsociar.getLayout().setActiveItem(0);
        this.setVisibleButtonsTbar(true);
        if (!Ext.isEmpty(this.gpListadoSituacionLaboral)) {
            this.bindStore(this.gpListadoSituacionLaboral.getGridSA().getStore());
        }
    },
    setDatosEstructura: function (node, isCargo, entidad) {
        this.dataEstructura.node = node;
        this.dataEstructura.isCargo = isCargo;
        this.dataEstructura.nodeEntidad = entidad;

        this.gpListadoPersona.setDataEstructura(entidad, isCargo ? node : null);

        this.btnSyncCargos.setVisible(node instanceof Ext.tree.TreeNode);
    },
    updateListado: function () {
        var item = this.pAsociar.getLayout().activeItem.id;
        if (!Ext.isEmpty(this.gpListadoSituacionLaboral) && this.gpListadoSituacionLaboral.id === item) {
            this.gpListadoSituacionLaboral.loadData(this.dataEstructura.node, this.dataEstructura.nodeEntidad, true);
        }
    },
    syncCargosOcupacion: function () {
        PVD.mostrarMascara(this.id + 'syncCargos', this.idioma.lbMsgWait, this.idioma.lbMsgSync);
        Ext.Ajax.request({
            url: 'syncCargosOcupacion',
            method: 'POST',
            scope: this,
            params: {idestructura: this.dataEstructura.node instanceof Ext.tree.TreeNode ? this.dataEstructura.node.id : null},
            callback: function (options, success, response) {
                PVD.ocultarMascara(this.id + 'syncCargos');
                responseData = Ext.decode(response.responseText);
                if (responseData.success === true) {                    //mostrarMensaje(1, 'La(s) persona(s) se ha(n) dado de alta satisfactoriamente.');
                    if (this.dataEstructura.node instanceof Ext.tree.TreeNode) {
                        if (Ext.isFunction(this.dataEstructura.node.reload)) {
                            this.dataEstructura.node.reload();
                        } else {
                            this.dataEstructura.node.parentNode.reload();
                        }
                    }
                }
            }
        });
    },
    setVisibleButtonsTbar: function (b) {
        this.gpListadoSituacionLaboral.setVisibleAllButtons(b);
        this.gpListadoPersona.hideAsociarBtn(b);
        this.btnSyncCargos.setVisible(b);
    }
});