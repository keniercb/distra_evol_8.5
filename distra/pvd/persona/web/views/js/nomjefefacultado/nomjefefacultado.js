/**
 * Nomenclador de jefes facultados
 *
 * @author Ing. Mayler Navarro Diaz
 * @package PvD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomJefeFacultado');

/**
 * Vista en forma de formulario
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomJefeFacultado.Lang = {
    titleGrid: 'Jefes Facultados',

    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    codigo: 'C&oacute;digo',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar jefe facultado',
    titleWindMod: 'Modificar jefe facultado',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar jefe facultado <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar jefe facultado <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar jefe facultado <b>(DEL)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El jefe facultado ha sido eliminado satisfactoriamente',
    msgNotDel: 'El jefe facultado seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El jefe facultado ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El jefe facultado que quiere adicionar ya existe.',
    msgNotMod: 'El jefe facultado ya existe.',
    msgMod: 'El jefe facultado ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del jefe facultado',
    msgSendServer: 'Enviando datos al servidor.',

    msgAskDelS: '¿Está seguro que quiere eliminar el jefe facultado seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los jefes facultados seleccionados?',
    msgDelS: 'El jefe facultado ha sido eliminado satisfactoriamente',
    msgDelP: 'Los jefes facultados han sido eliminados satisfactoriamente'

};
PVD.Persona.NomJefeFacultado.ViewForm = Ext.extend(Ext.Window, {
    border: false,
    modal: true,
    closeAction: 'hide',
    initComponent: function () {
        var self = this;
        var model = new PVD.Persona.NomJefeFacultado.Model();
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

        this.cbcargos = new Ext.form.ComboBox({
            store: model.stcargos,
            name: 'cargopropuesto',
            anchor: '100%',
            id: 'prenda',
            fieldLabel: 'Cargos',
            displayField: 'denominacion',
            valueField: 'idcargopropuesto',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            readOnly: true
        });

        this.tfAbbreviation = new Ext.form.TextField({
            fieldLabel: 'Abreviatura',
            name: 'abreviatura',
            anchor: '100%',
            maxLength: 5
        });

        this.taDescription = new Ext.form.TextArea({
            id: 'taDescription' + self.id,
            nextTab: 'btnCancel' + self.id,
            prevTab: 'fhasta' + self.id,
            fieldLabel: 'Descripción',
            name: 'descripcion',
            anchor: '100%',
            height: 90
        });

        this.dfFrom = new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.id,
            nextTab: 'fhasta' + self.id,
            prevTab: 'tpCategoria' + self.id,
            fieldLabel: 'Fecha inicio',
            anchor: '98%',
            allowBlank: false,
            format: 'd/m/Y',
            value: new Date().format('d/m/Y'),
            vtype: 'daterange',
            endDateField: 'fhasta' + self.id
        });

        this.dfUp = new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta' + self.id,
            nextTab: 'taDescription' + self.id,
            prevTab: 'fdesde' + self.id,
            fieldLabel: 'Fecha fin',
            anchor: '100%',
            format: 'd/m/Y',
            vtype: 'daterange',
            startDateField: 'fdesde' + self.id
        });

        this.form = new Ext.form.FormPanel({
            width: 400,
            frame: true,
            region: 'center',
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            items: [
                self.cbcargos, this.tfAbbreviation,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFrom]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfUp]
                        }
                    ]
                }, this.taDescription
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


        PVD.Persona.NomJefeFacultado.ViewForm.superclass.initComponent.call(this);
    }
});

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomJefeFacultado.ViewGrid = Ext.extend(Ext.grid.GridPanel, {
    border: false,
    initComponent: function () {
        //Variables
        var self = this;
        var lang = {};
        var idioma = this.lang;

        var lang = Ext.applyIf(PVD.Persona.NomJefeFacultado.Lang, this.lang || {});

        var model = new PVD.Persona.NomJefeFacultado.Model();
        this.autoExpandColumn = 'expandDenom' + this.id;

        this.loadMask = {
            msg: 'Cargando..'
        };

        this.store = model.store;

        this.btnAdd = new Ext.Button({
            id: 'btnAdd' + self.id,
            text: 'Adicionar',
            tooltip: 'Adicionar jefe facultado <b>(Alt+I)</b>',
            iconCls: 'adicionar'
        });

        this.btnChange = new Ext.Button({
            disabled: true,
            id: 'btnChange' + self.id,
            text: '<u>M</u>odificar',
            tooltip: 'Modificar jefe facultado<b>(Alt+M)</b>',
            iconCls: 'modificar'
        });

        this.btnRemove = new Ext.Button({
            disabled: true,
            id: 'btnRemove' + self.id,
            text: 'Eliminar',
            tooltip: 'Eliminar  jefe facultado<b>(DEL)</b>',
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
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;margin-left:50;width:300"><p>&nbsp;&nbsp;<b>Descripci&oacute;n:</b>&nbsp;{descripcion}</p><br/></div>'
            ),
            enableCaching: false
        });

        this.columns = [new Ext.grid.RowNumberer(),
            this.expander,
            {
                header: 'Jefe facultado',
                id: 'expandDenom' + self.id,
                sortable: true,
                resizable: false,
                dataIndex: 'cargopropuesto'
            },
            {
                header: 'Abreviatura',
                sortable: true,
                resizable: false,
                dataIndex: 'abreviatura'
            },
            {
                header: 'Fecha inicio',
                sortable: true,
                width: 100,
                resizable: false,
                dataIndex: 'fdesde',
                alight: 'center'
            },
            {
                header: 'Fecha fin',
                sortable: true,
                width: 100,
                resizable: false,
                dataIndex: 'fhasta',
                alight: 'center'
            }

        ];

        this.plugins = this.expander;

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

        this.wind = new PVD.Persona.NomJefeFacultado.ViewForm({
            /*lang: lang,
             idioma: idioma*/
        });
        PVD.Persona.NomJefeFacultado.ViewGrid.superclass.initComponent.call(this);
        var controller = new PVD.Persona.NomJefeFacultado.Controller(this, lang, idioma);

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

PVD.Persona.NomJefeFacultado.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomjefefacultado/getFormEnteringJefe',
    mapping: [
        {name: 'idjefesfacultado'},
        {name: 'idcargopropuesto'},
        {name: 'cargopropuesto'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta '},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcargopropuesto';
        this.displayField = 'cargopropuesto';
        this.name = 'idcargopropuesto';
        this.hiddenName = 'idcargopropuesto';
        PVD.Persona.NomJefeFacultado.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_jefefacultado', PVD.Persona.NomJefeFacultado.ViewCombo);


/**
 * Modelo del componente
 * @type {{init: Function}}
 */
PVD.Persona.NomJefeFacultado.Model = function () {

    this.store = new Ext.data.Store({
        url: '/pvd/persona/index.php/nomjefefacultado/getFormEnteringJefe',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'quantity',
                root: 'data'
            },
            [
                {name: 'idjefesfacultado'},
                {name: 'idcargopropuesto'},
                {name: 'cargopropuesto'},
                {name: 'abreviatura'},
                {name: 'fdesde'},
                {name: 'fhasta '},
                {name: 'descripcion'}
            ])
    });

    this.stcargos = new Ext.data.Store({
        url: '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/getCargos',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'quantity',
                root: 'data'
            },
            [
                {name: 'idcargopropuesto'},
                {name: 'denominacion'}
            ]),
        autoLoad: true
    });
};

/**
 * Controlador del componente
 * @type {{init: Function}}
 */
PVD.Persona.NomJefeFacultado.Controller = function (view, lang, idioma) {
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
        view.wind.setTitle('Adicionar jefe facultado');
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
        view.wind.setTitle('Mofificar jefe facultado');
        view.wind.btnApply.hide();
        view.wind.show();
        view.wind.form.getForm().loadRecord(view.getSelectionModel().getSelected());
        view.wind.cbcargos.setRawValue(view.getSelectionModel().getSelected().data.cargopropuesto);
        view.wind.cbcargos.setValue(view.getSelectionModel().getSelected().data.idcargopropuesto);

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
            arr.push(rec.data.idjefesfacultado);
        });
        var mens = '¿Está seguro que quiere eliminar el jefe facultado seleccionado?';
        if (arr.length > 1) {
            mens = '¿Está seguro que quiere eliminar los jefes facultados seleccionados?';
        }
        mostrarMensaje(2, mens, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask('Por favor espere...Eliminando datos ');
                Ext.Ajax.request({
                    url: '/pvd/persona/index.php/nomjefefacultado/delFormEnteringJefe',
                    method: 'POST',
                    params: {
                        idnomenclador: Ext.encode(arr)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        Ext.getBody().unmask();
                        if (responseData.success) {
                            if (arr.length > 1) {
                                mostrarMensaje(7, 'Los jefes facultados han sido eliminados satisfactoriamente.');
                            } else {
                                mostrarMensaje(7, 'El jefe facultado ha sido eliminado satisfactoriamente.');
                            }
                            view.getStore().reload();
                            view.btnChange.disable();
                            view.btnRemove.disable();
                            view.btnAdd.focus();
                        } else if (!responseData.success) {
                            mostrarMensaje(7, 'No puede ser eliminado debido a que esta en uso.');
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
                    url: (accion == 'add') ? '/pvd/persona/index.php/nomjefefacultado/addFormEnteringJefe' : '/pvd/persona/index.php/nomjefefacultado/modFormEnteringJefe',
                    method: 'POST',
                    params: {
                        idnomenclador: (accion != 'add') ? view.getSelectionModel().getSelected().data.idjefesfacultado : null,
                        idcargopropuesto: view.wind.cbcargos.getValue(),
                        abreviatura: view.wind.tfAbbreviation.getValue(),
                        fdesde: view.wind.dfFrom.getRawValue(),
                        fhasta: view.wind.dfUp.getRawValue(),
                        descripcion: view.wind.taDescription.getValue()

                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        Ext.getBody().unmask();
                        if (responseData.success) {
                            var msg = (accion == 'add') ? 'El jefe facultado ha sido adicionado satisfactoriamente.' : 'El jefe facultado ha sido modificado satisfactoriamente.';
                            mostrarMensaje(7, msg);
                            if (btnpress == 'acp') {
                                view.wind.hide();
                                view.wind.form.getForm().reset();
                            } else {
                                view.wind.form.getForm().reset();
                            }
                            view.getStore().reload();

                        } else {
                            msg = (accion == 'add') ? 'El jefe facultado  que quiere adicionar ya existe.' : 'El jefe facultado  que quiere modificar ya existe';
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

};




