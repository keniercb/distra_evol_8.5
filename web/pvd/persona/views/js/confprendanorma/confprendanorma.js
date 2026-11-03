/**
 *
 *
 * @author Ing. Beatriz Selema Alvarez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.ConfPrendaNormTall');

/**
 * Vista en forma de formulario
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.ConfPrendaNormTall.ViewForm = Ext.extend(Ext.Window, {
    border: false,
    modal: true,
    closeAction: 'hide',
    initComponent: function () {
        var self = this;
        var model = new PVD.Persona.ConfPrendaNormTall.Model();
        this.btnAcept = new Ext.Button({
            id: 'btnAcept' + self.id,
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
            iconCls: 'aceptar'
        });

        this.btnApply = new Ext.Button({
            id: 'btnApply' + self.id,
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos <b>(Alt+P)</b>',
            iconCls: 'aplicar'
        });

        this.btnCancel = new Ext.Button({
            id: 'btnCancel' + self.id,
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
            iconCls: 'cancelar'
        });

        this.cbprenda = new Ext.form.ComboBox({
            store: model.stprenda,
            name: 'denominacion',
            anchor: '95%',
            id: 'prenda',
            //hiddenName:'',
            fieldLabel: 'Prenda',
            displayField: 'denonprenda',
            valueField: 'idprenda',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            readOnly: true
        });
        this.cbnorma = new Ext.form.ComboBox({
            store: model.stnorma,
            name: 'denominacion',
            anchor: '88%',
            id: 'norma',
            fieldLabel: 'Norma',
            displayField: 'denominacion',
            valueField: 'idnorma',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            readOnly: true
        });
        this.cbtalla = new Ext.form.ComboBox({
            store: model.sttalla,
            name: 'denominacion',
            anchor: '90%',
            id: 'talla',
            fieldLabel: 'Talla',
            displayField: 'denominacion',
            valueField: 'idtalla',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            readOnly: true
        });

        this.form = new Ext.form.FormPanel({
            width: 600,
            frame: true,
            region: 'center',
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.cbprenda]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [self.cbnorma]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            items: [self.cbtalla]
                        }
                    ]
                }
            ]

        });

        this.items = [this.form];

        this.buttons = [this.btnCancel, this.btnApply, this.btnAcept];

        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                fn: function () {
                    self.btnAcept.handler();
                }
            },
            {
                key: 'p',
                alt: true,
                ctrl: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnApply.disabled) {
                        self.btnApply.handler();
                    }

                }
            },
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancel.disabled) {
                        self.btnCancel.handler();
                    }
                }
            }
        ];


        PVD.Persona.ConfPrendaNormTall.ViewForm.superclass.initComponent.call(this);
    }
});

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.ConfPrendaNormTall.ViewGrid = Ext.extend(Ext.grid.GridPanel, {
    border: false,
    initComponent: function () {
        //Variables
        var self = this;
        var lang = {};
        var idioma = this.lang;

        var lang = Ext.applyIf(PVD.Persona.ConfPrendaNormTall.Lang, this.lang || {});

        var model = new PVD.Persona.ConfPrendaNormTall.Model();
        this.autoExpandColumn = 'expandDenom' + this.id;

        this.loadMask = {
              msg: 'Cargando..'
        };

        this.store = model.store;

        this.btnAdd = new Ext.Button({
            id: 'btnAdd' + self.id,
            text: 'Adicionar',
            tooltip: 'Adicionar configuración <b>(Alt+I)</b>',
            iconCls: 'adicionar'
        });

        this.btnChange = new Ext.Button({
            disabled: true,
            id: 'btnChange' + self.id,
            text: '<u>M</u>odificar',
            tooltip: 'Modificar configuración<b>(Alt+M)</b>',
            iconCls: 'modificar'
        });

        this.btnRemove = new Ext.Button({
            disabled: true,
            id: 'btnRemove' + self.id,
            text: 'Eliminar',
            tooltip: 'Eliminar  configuración<b>(DEL)</b>',
            iconCls: 'eliminar'

        });

        this.btnExport = new Ext.Button({
            id: 'btnExport' + self.id,
            /* text: lang.btnExport,
             tooltip: this.lang.ttBtnExport,*/
            //icon: perfil.dirImg + 'exportar.png',
            iconCls: 'exportar'
        });

        this.btnHelp = new Ext.Button({
            id: 'btnHelp_' + self.referencia,
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad <b>(Alt+H)</b>',
            iconCls: 'ayuda'

        });

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.columns = [new Ext.grid.RowNumberer(),
            {
                header: 'Prenda',
                id: 'expandDenom' + self.id,
                sortable: true,
                resizable: false,
                width: 200,
                dataIndex: 'denonprenda'
            },
            {
                header: 'Norma',
                sortable: true,
                width: 200,
                resizable: false,
                dataIndex: 'denomnorma',
                alight:'center'
            },
            {
                header: 'Talla',
                sortable: true,
                width: 200,
                resizable: false,
                dataIndex: 'denontalla',
                alight:'center'
            }

        ];

        //this.plugins = this.expander;

        this.search = new Ext.app.SearchField({
            id: 'search' + self.id,
            /*nextTab: 'btnHelp' + self.id,
             prevTab: 'btnExport' + self.id,*/
            store: self.store,
            emptyText: 'Criterio a buscar...'
        });


        this.bbar = new Ext.PagingToolbar({
            store: this.store,
            displayInfo: true,
            /* displayMsg: lang.displayMsg + '{0} - {1} de {2} ',
             emptyMsg: lang.emptyMsg,*/
            pageSize: 15
        });

        this.tbar = [this.btnAdd, this.btnChange, this.btnRemove, /*this.btnExport , */'-', this.search, '->', this.btnHelp];

        this.keys = [
            {
                key: 'i',
                alt: true,
                stopEvent: true,
                fn: function () {
                    self.btnAdd.handler();
                }
            },
            {
                key: 'm',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnChange.disabled) {
                        self.btnChange.handler();
                    }

                }
            },
            {
                key: 46,
                stopEvent: true,
                fn: function () {
                    if (!self.btnRemove.disabled) {
                        self.btnRemove.handler();
                    }
                }
            },
            {
                key: 'h',
                stopEvent: true,
                alt: true,
                fn: function () {
                    self.btnHelp.handler();
                }
            },
            {
                key: 'e',
                stopEvent: true,
                alt: true,
                fn: function () {
                    self.btnExport.handler();
                }
            }
        ];

        this.wind = new PVD.Persona.ConfPrendaNormTall.ViewForm({
            /*lang: lang,
             idioma: idioma*/
        });
        PVD.Persona.ConfPrendaNormTall.ViewGrid.superclass.initComponent.call(this);
        var controller = new PVD.Persona.ConfPrendaNormTall.Controller(this, lang, idioma);

    },
    getHeader: function () {
        var self = this;
        var arrHeader = new Array();
        var cant = self.getColumnModel().getColumnCount();
        for (var i = 0; i < cant; i++) {
            arrHeader[i] = self.getColumnModel().getColumnHeader(i);
        }
        return arrHeader;
    },

    enfocar: function () {
    }
});

/**
 * Modelo del componente
 * @type {{init: Function}}
 */
PVD.Persona.ConfPrendaNormTall.Model = function () {

    this.store = new Ext.data.Store({
        url: '/pvd/persona/index.php/confprendanorma/getConfiguracion',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'quantity',
                root: 'data'
            },
            [
                {name: 'idprenda'},
                {name: 'idnorma'},
                {name: 'idtalla'},
                {name: 'idconftallaje'},
                {name: 'idnomenclador'},
                {name: 'denomnorma'},
                {name: 'denonprenda'},
                {name: 'denontalla'}
            ])
    });

    this.stprenda = new Ext.data.Store({
        url: '/pvd/persona/index.php/confprendanorma/getPrenda',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'quantity',
                root: 'data'
            },
            [
                {name: 'idprenda'},
                {name: 'denonprenda'}
            ]),
        autoLoad: true
    });

    this.stnorma = new Ext.data.Store({
        url: '/pvd/persona/index.php/confprendanorma/getNorma',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'quantity',
                root: 'data'
            },
            [
                {name: 'idnorma'},
                {name: 'denominacion'}
            ]),
        autoLoad: true
    });

    this.sttalla = new Ext.data.Store({
        url: '/pvd/persona/index.php/confprendanorma/getTalla',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'quantity',
                root: 'data'
            },
            [
                {name: 'idtalla'},
                {name: 'denominacion'}
            ]),
        autoLoad: true
    });

};

/**
 * Controlador del componente
 * @type {{init: Function}}
 */
PVD.Persona.ConfPrendaNormTall.Controller = function (view, lang, idioma) {
    /**
     *Variables necesarias
     *
     */

    var variables = {
        accion: 'add',
        btnpress: 'acp',
        url: null
        /* wind: new Pvd.agenda.CmpNomenclador.ViewForm({
         lang: lang, idioma: idioma
         })*/
    };
    view.on('render', function (cmp) {
        cmp.getStore().load({
            params: {
                limit: 15,
                start: 0
            }
        })
    });
    /*
     *Mantener controlar el foco del boton adicionar del gridpanel al renderizar
     */
    view.on('render', function () {
        view.btnAdd.focus();
    });

    /**
     * Dispara cuando ahy al cambio en la seleccion de los elemtos
     */
    view.getSelectionModel().on('selectionchange', function (sm) {
        if (sm.getCount() == 1) {
            view.btnChange.enable();
            view.btnRemove.enable();
        } else if (sm.getCount() > 1) {
            view.btnChange.disable();
        } else {
            view.btnChange.disable();
            view.btnRemove.disable();
        }
    });

    /**
     * Evento para controlar el foco del boton adicionar al cerrar la ventana
     */
    view.wind.on('hide', function () {
        view.btnAdd.focus();
    });

    /**
     *Handler del boton Adicionar del gridpanel
     *
     */
    view.btnAdd.setHandler(function () {
        variables.accion = 'add';
        // variables.url = urls.add;
        view.wind.setTitle('Adicionar configuración');
        view.wind.show();
        view.wind.btnApply.setVisible(true);
        view.wind.form.getForm().reset();
        // view.wind.tfDenomination.focus(true, 100);
    });

    /**
     *Handler del boton Modificar del gridpanel
     *
     */
    view.btnChange.setHandler(function () {
        variables.accion = 'mod';
        //variables.url = urls.mod;
        view.wind.setTitle('Mofificar configuración');
        view.wind.btnApply.hide();
        view.wind.show();
        // view.wind.form.getForm().loadRecord(view.getSelectionModel().getSelected());
        view.wind.cbprenda.setRawValue(view.getSelectionModel().getSelected().data.denonprenda);
        view.wind.cbprenda.setValue(view.getSelectionModel().getSelected().data.idprenda);


        view.wind.cbtalla.setRawValue(view.getSelectionModel().getSelected().data.denontalla);
        view.wind.cbtalla.setValue(view.getSelectionModel().getSelected().data.idtalla);

        view.wind.cbnorma.setRawValue(view.getSelectionModel().getSelected().data.denomnorma);
        view.wind.cbnorma.setValue(view.getSelectionModel().getSelected().data.idnorma);
    });

    /**
     *Handler del boton Eliminar del gridpanel
     *
     */
    view.btnRemove.setHandler(function () {
        // variables.url = urls.del;
         removeNomenclador();
    });

    /**
     * Handler del boton Exportar del gridpanel
     */
    view.btnExport.setHandler(function () {
        /* variables.url = urls.expt;
         variables.gridheader = view.getHeader();
         showReport(variables.url, variables.gridheader);*/
    });

    /**
     *Handler del boton Cancelar de la ventana
     *
     */
    view.wind.btnCancel.setHandler(function () {
        view.wind.hide();
    });

    /**
     *Handler del boton Aceptar de la ventana
     * @param accion='add'
     */
    view.wind.btnAcept.setHandler(function () {
        variables.btnpress = 'acp';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Handler del boton Aplicar de la ventana
     * @param accion='apl'
     */
    view.wind.btnApply.setHandler(function () {
        variables.btnpress = 'apl';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Funcion para eliminar el nacionalidad seleccionado
     */
    function removeNomenclador(url) {
        var arr = new Array();
        Ext.each(view.getSelectionModel().getSelections(), function (rec) {
            arr.push(rec.data.idconftallaje);
        });
        var mens = '¿Está seguro que quiere eliminar la configuración seleccionada?';
        if (arr.length > 1) {
           mens = '¿Está seguro que quiere eliminar las configuraciones seleccionadas?';
        }
        mostrarMensaje(2, mens, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask( 'Por favor espere...Eliminando datos ');
                Ext.Ajax.request({
                    url: '/pvd/persona/index.php/confprendanorma/delConfiguracion',
                    method: 'POST',
                    params: {
                        idnomenclador: Ext.encode(arr)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        Ext.getBody().unmask();
                        if (responseData.success) {
                            if (arr.length > 1) {
                                mostrarMensaje(1, 'Las configuraciones han sido eliminadas satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'La configuración ha sido eliminada satisfactoriamente.');
                            }
                            view.getStore().reload();
                            view.btnChange.disable();
                            view.btnRemove.disable();
                            view.btnAdd.focus();
                        } else if (!responseData.success) {
                            mostrarMensaje(6,'No puede der eliminado debido a que esta en uso');
                        }
                    }
                });
            }
        });
    }

    /**
     * Funcion para adicionar o modificar  nacionalidad
     * @param accion Especifica la accion requerida(add,mod)
     * @param btnpress Especifica el boton precionado de la ventena (acp,apl)
     */
    function addOrChangeNomenclador(accion, btnpress) {
        if (accion == 'add' || accion == 'mod') {
            if (view.wind.form.getForm().isValid()) {
                Ext.getBody().mask('Por favor espere...Enviando datos al servidor');
                Ext.Ajax.request({
                    url: (accion == 'add') ? '/pvd/persona/index.php/confprendanorma/addConfiguracion' : '/pvd/persona/index.php/confprendanorma/modConfiguracion',
                    method: 'POST',
                    params: {
                        idnomenclador: (accion != 'add') ? view.getSelectionModel().getSelected().data.idconftallaje : null,
                        idprenda: view.wind.cbprenda.getValue(),
                        idnorma: view.wind.cbnorma.getValue(),
                        idtalla: view.wind.cbtalla.getValue()

                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        Ext.getBody().unmask();
                        if (responseData.success) {
                            var msg = (accion == 'add') ? 'La configuración ha sido adicionada satisfactoriamente.' : 'La configuración ha sido modificada satisfactoriamente.';
                            mostrarMensaje(7, msg);
                            if (btnpress == 'acp') {
                                view.wind.hide();
                                view.wind.form.getForm().reset();
                            } else {
                                view.wind.form.getForm().reset();
                            }
                            view.getStore().reload();

                        } else {
                            msg = (accion == 'add') ? 'La configuración  que quiere adicionar ya existe.' : 'La configuración  que quiere modificar ya existe';
                            mostrarMensaje(8, msg);
                        }
                    }
                });
            }
        } else {
            view.wind.hide();
            view.wind.form.getForm().reset();
        }
    }

    /**
     * Funcion para mostrar el reporte de los nomecladores
     */
    /*   function showReport(reporturl, headerdoc) {
     var header = new Array();
     header[0] = 'No.';
     header[headerdoc.length - 1] = 'Descripci&oacute;n';
     for (var i = 1; i < headerdoc.length - 1; i++) {
     header[i] = headerdoc[parseInt(i) + 1];
     }
     var win = new Ext.components.winReporte({
     title: 'Configuración del reporte',
     modal: true,
     layout: 'border',
     params: {
     url: reporturl,
     tiporeporte: 'listado',
     columns: header
     }
     });
     win.show();
     }
     */

};




