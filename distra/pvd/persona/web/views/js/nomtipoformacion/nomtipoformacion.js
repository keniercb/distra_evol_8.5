/**
 * Nomenclador de la persona tipo formación
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoFormacion');

PVD.Persona.NomTipoFormacion.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de tipos de preparación',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de preparación',
    titleWindMod: 'Modificar tipo de preparación',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de preparación <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de preparación <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de preparación <b>(DEL)</b>',
    /**
     * Mensages de las acciones.
     */

    msgNotDel: 'El tipo de preparación seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de preparación ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de preparación que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de preparación ya existe.',
    msgMod: 'El tipo de preparación ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos',
    msgSendServer: 'Enviando datos al servidor.',

    /**
     * Pluraridad
     */
    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de preparación seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de preparación seleccionados?',
    msgDelS: 'El tipo de preparación se ha sido eliminado satisfactoriamente',
    msgDelP: 'Los tipos de preparación se han sido eliminados satisfactoriamente'

};


PVD.Persona.NomTipoFormacion.ViewForm = Ext.extend(Ext.Window, {
    autoValidate: false,
    border: false,
    modal: true,
    closeAction: 'hide',
    autoHeigth: true,
    width: 420,
    resizable: false,
    initComponent: function() {
        var self = this;

        this.btnAcept = new Ext.Button({
            id: 'btnAcept' + self.referencia,
            nextTab: 'tfDenomination' + self.referencia,
            prevTab: 'btnApply' + self.referencia,
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
            iconCls: 'aceptar',
            disabled: true
            //icon: perfil.dirImg + 'aceptar.png'
        });

        this.btnApply = new Ext.Button({
            id: 'btnApply' + self.referencia,
            nextTab: 'btnAcept' + self.referencia,
            prevTab: 'btnCancel' + self.referencia,
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos <b>(Alt+P)</b>',
            iconCls: 'aplicar',
            disabled: true
            //icon: perfil.dirImg + 'aplicar.png'
        });
        this.btnCancel = new Ext.Button({
            id: 'btnCancel' + self.referencia,
            nextTab: 'btnApply' + self.referencia,
            prevTab: 'taDescription' + self.referencia,
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
            iconCls: 'cancelar',
            //icon: perfil.dirImg + 'cancelar.png'
        });

        this.tfDenomination = this.tfDenomination || new Ext.form.TextField({
                id: 'tfDenomination' + self.referencia,
                nextTab: 'fdesde' + self.referencia,
                prevTab: 'btnAcept' + self.referencia,
                fieldLabel: 'Denominación',
                maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
//                regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
//                regexText: 'Solo admite letras y el(los) caracter(es) especial(les) ( _-)',
                maxLength: 100,
                name: 'denominacion',
                allowBlank: false,
                anchor: '100%',
                enableKeyEvents: true,
                vtype: 'denominacion',
                listeners: {                    
                    keyup: function(tf, e) {
                        if (e.getKey() != 9) {
                            if (self.form.getForm().isValid()) {
                                self.btnApply.enable();
                                self.btnAcept.enable();
                            } else {
                                self.btnApply.disable();
                                self.btnAcept.disable();
                            }
                        }                        
                    }
                }
            });

        this.taDescription = this.taDescription || new Ext.form.TextArea({
                id: 'taDescription' + self.referencia,
                nextTab: 'btnCancel' + self.referencia,
                prevTab: 'fhasta' + self.referencia,
                fieldLabel: 'Descripción',
                name: 'descripcion',
                anchor: '100%',
                height: 90,
                maxLength: 255,
                enableKeyEvents: true,
                listeners: {                    
                    keyup: function(tf, e) {
                        if (e.getKey() != 9) {
                           if (self.form.getForm().isValid()) {
                                self.btnApply.enable();
                                self.btnAcept.enable();
                            } else {
                                self.btnApply.disable();
                                self.btnAcept.disable();
                            } 
                        }                        
                    }
                }
            });

        this.dfFrom = this.dfFrom || new Ext.form.DateField({
                name: 'fdesde',
                id: 'fdesde' + self.referencia,
                nextTab: 'fhasta' + self.referencia,
                prevTab: 'tfDenomination' + self.referencia,
                fieldLabel: 'Fecha inicio',
                anchor: '90%',
                allowBlank: false,
                format: 'd/m/Y',
                value: new Date().format('d/m/Y'),
                vtype: 'daterange',
                endDateField: 'fhasta' + self.referencia,
                enableKeyEvents: true,
                listeners: {
                    keypress: function(tf, e) {
                        if (e.getKey() != 9) {
                            if (self.form.getForm().isValid()) {
                                self.btnApply.enable();
                                self.btnAcept.enable();
                            } else {
                                self.btnApply.disable();
                                self.btnAcept.disable();
                            } 
                        }
                        
                    }
                }
            });

        this.dfUp = this.dfUp || new Ext.form.DateField({
                name: 'fhasta',
                id: 'fhasta' + self.referencia,
                nextTab: 'taDescription' + self.referencia,
                prevTab: 'fdesde' + self.referencia,
                fieldLabel: 'Fecha fin',
                anchor: '90%',
                format: 'd/m/Y',
                value: '',
                vtype: 'daterange',
                startDateField: 'fdesde' + self.referencia,
                enableKeyEvents: true,
                listeners: {
                    keypress: function(tf, e) {
                        if (e.getKey() != 9) {
                            if (self.form.getForm().isValid()) {
                                self.btnApply.enable();
                                self.btnAcept.enable();
                            } else {
                                self.btnApply.disable();
                                self.btnAcept.disable();
                            } 
                        }                        
                    }
                }
            });
        this.form = new Ext.form.FormPanel({
            frame: true,
            region: 'center',
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            autoHeigth: true,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            items: this.itemsForm || [
                self.tfDenomination, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.dfFrom]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [self.dfUp]
                        }
                    ]
                }, self.taDescription
            ]

        });

        this.items = [this.form];
        this.buttons = [this.btnCancel, this.btnApply, this.btnAcept];

        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                fn: function() {
                    self.btnAcept.handler();
                }
            },
            {
                key: 'p',
                alt: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnApply.disabled) {
                        self.btnApply.handler();
                    }

                }
            },
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnCancel.disabled) {
                        self.btnCancel.handler();
                    }
                }
            }
        ];
        PVD.Persona.NomTipoFormacion.ViewForm.superclass.initComponent.call(this);

    }
});


/**
 * Vista en forma de tree grid
 * @type {extend|*|void|extend|extend|extend}
 */

PVD.Persona.NomTipoFormacion.ViewGrid = Ext.extend(Ext.tree.TreeGrid, {
    border: false,
    rootVisible: true,
    initComponent: function() {
        //Variables
        var self = this;
        var lang = {};
        this.referencia = 'nomtipoformacion';
        this.btnAdd = new Ext.Button({
            id: 'btnAdd' + self.referencia,
            disabled: true,
            text: 'Ad<u>i</u>cionar',
            nextTab: 'btnChange' + self.referencia,
            prevTab: 'btnHelp' + self.referencia,
            tooltip: 'Adicionar tipo de preparación<b>(Alt+I)</b>',
            //icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar'
        });

        this.btnChange = new Ext.Button({
            disabled: true,
            id: 'btnChange' + self.referencia,
            nextTab: 'btnRemove' + self.referencia,
            prevTab: 'btnAdd' + self.referencia,
            text: '<u>M</u>odificar',
            tooltip: 'Modificar tipo de preparación<b>(Alt+M)</b>',
            //icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar'
        });

        this.btnRemove = new Ext.Button({
            disabled: true,
            id: 'btnRemove' + self.referencia,
            nextTab: 'search' + self.referencia,
            prevTab: 'btnChange' + self.referencia,
            text: 'Eliminar',
            tooltip: 'Eliminar tipo de preparación<b>(DEL)</b>',
            //icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar'

        });

        this.btnHelp = new Ext.Button({
            id: 'btnHelp' + self.referencia,
            text: 'Ayuda',
            nextTab: 'btnAdd' + self.referencia,
            prevTab: 'search' + self.referencia,
            tooltip: 'Ayuda de la funcionalidad <b>(Alt+H)</b>',
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'

        });

        /**
         * Expande todos los nodos
         * @type {Button}
         */
        this.btnExpandAll = new Ext.Button({
            iconCls: 'expand-all',
            tooltip: 'Expandir <b>(Alt+Abajo)</b>',
            scope: this

        });

        /**
         * Contrae a todos los nodos
         * @type {Button}
         */
        this.btnCollapseAll = new Ext.Button({
            iconCls: 'collapse-all',
            tooltip: 'Contraer <b>(Alt+Arriba)</b>',
            scope: this
        });

        this.btnUpdate = new Ext.Button({
            iconCls: 'Actualizar',
            //icon: perfil.dirImg + 'actualizar.png',
            tooltip: 'Actualizar<b>(Ctrl+Alt+Z)</b>',
            scope: this
        });

        this.columns = [
            {
                header: 'Denominación',
                dataIndex: 'denominacion',
                width: 450
            },
            {
                header: 'Fecha inicio',
                width: 100,
                dataIndex: 'fdesde',
                align: 'center'
            },
            {
                header: 'Fecha fin',
                width: 100,
                align: 'center',
                dataIndex: 'fhasta',
                tpl: new Ext.XTemplate('{fhasta:this.clearDate}', {
                    clearDate: function(v, rec) {
                        if (Ext.isEmpty(v)) {
                            return '';
                        } else {
                            return v;
                        }

                    }
                })
            }
        ];
        this.dataUrl = '/pvd/persona/index.php/nomtipoformacion/getTipoFormacion';

        this.root = new Ext.tree.AsyncTreeNode({
            id: 'roottipoformacion',
            denominacion: 'Tipo de preparación..',
            expanded: true,
            uiProvider: Ext.ux.tree.TreeGridNodeUI
        });


        this.tbar = [this.btnAdd, this.btnChange, this.btnRemove, '-', this.btnExpandAll, this.btnCollapseAll, this.btnUpdate, '->', this.btnHelp];
        this.keys = [
            {
                key: 'i',
                alt: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnAdd.disabled) {
                        self.btnAdd.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnChange.disabled) {
                        self.btnChange.handler();
                    }
                }
            },
            {
                key: 46, //Eliminar
                alt: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnRemove.disabled) {
                        self.btnRemove.handler();
                    }
                }
            },
            {
                key: 38, //Contrar
                alt: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnCollapseAll.disabled) {
                        self.btnCollapseAll.handler();
                    }
                }
            },
            {
                key: 40, //Expnadir
                alt: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnExpandAll.disabled) {
                        self.btnExpandAll.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnHelp.disabled) {
                        self.btnHelp.handler();
                    }
                }
            },
            {
                key: 'z',
                alt: true,
                ctrl: true,
                stopEvent: true,
                fn: function() {
                    if (!self.btnUpdate.disabled) {
                        self.btnUpdate.handler();
                    }
                }
            }
        ];

        PVD.Persona.NomTipoFormacion.ViewGrid.superclass.initComponent.call(this);
        this.winGestion = new PVD.Persona.NomTipoFormacion.ViewForm({
            lang: lang,
            autoValidate: true,
            validateDefault: true
        });
        var controller = new PVD.Persona.NomTipoFormacion.Controller(this, lang, null);
    },
    enfocar: function() {
    }
});

PVD.Persona.NomTipoFormacion.Model = function(url) {

    this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad: false,
        remoteSort: true,
        url: url,
        listeners: {
            beforeexpandnode: function(st, record) {
                st.baseParams.idtipoformacion = record.get('idtipoformacion');
            },
            beforeload: function(st, options) {
                //Validacion para que no expanda los nodos hijos
                if (st.active_node && st.active_node.data._is_leaf) {
                    return false;
                }
            }
        },
        reader: new Ext.data.JsonReader({
                id: 'idtipoformacion',
                root: 'data',
                total: 'quantity',
                successProperty: 'success'
            },
            [
                {
                    name: 'idtipoformacion'
                },
                {
                    name: 'idpadre'
                },
                {
                    name: '_parent'
                },
                {
                    name: '_is_leaf'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'fdesde'
                },
                {
                    name: 'fhasta'
                },
                {
                    name: 'descripcion'
                }
            ]
        )
    });

};

PVD.Persona.NomTipoFormacion.Controller = function(view, lang, urls) {

    /**
     *Variables necesarias
     *
     */
    var variables = {
        accion: 'add',
        btnpress: 'acp',
        url: null,
        record: null,
        idpadre: null
    };

    view.on('expandnode', function(n) {
        delete n.attributes.children;
    });
    
    view.on('click', function (e) {
        view.btnAdd.focus();
    });

    /**
     *Mantener controlar el foco del boton adicionar del gridpanel al renderizar
     */
    view.on('render', function(cmp) {
        view.btnAdd.focus();
        view.myMask = new Ext.LoadMask(cmp.body.dom, {
            msg: "Cargando..."
        });

    });

    view.getLoader().on('load', function() {
        view.myMask.hide();
    });

    view.getLoader().on('beforeload', function() {
        view.myMask.show();
    });

    /**
     *  Dispara cuando hay al cambio en la seleccion delos elemtos
     */
    view.getSelectionModel().on('selectionchange', function(sm, node) {


        if (node) { //Verifica que exista algun nodo seleccionado
            variables.record = node.attributes;
            if (node == view.getRootNode()) {
                variables.record = null
                view.btnAdd.enable();
                view.btnChange.disable();
                view.btnRemove.disable();
            } else {
                view.btnAdd.enable();
                view.btnChange.enable();
                view.btnRemove.enable();
            }

        } else {
            view.btnAdd.disable();
            view.btnRemove.disable();
            view.btnChange.disable();
            variables.record = null;
        }
    });

    /**
     * Evento para controlar el foco del boton adicionar al cerrar la ventana
     */
    view.winGestion.on('hide', function() {
        view.btnAdd.focus();
    });

    view.btnExpandAll.setHandler(function() {
        view.expandAll();

    });

    view.btnCollapseAll.setHandler(function() {
        view.collapseAll();
    });

    view.btnUpdate.setHandler(function() {
        view.getLoader().load(view.getRootNode());
        view.expandAll();
    });
    
    view.winGestion.btnAcept.on('disable', function () {
        view.winGestion.btnCancel.nextTab = 'tfDenomination' + view.winGestion.referencia;
        view.winGestion.tfDenomination.prevTab = 'btnCancel' + view.winGestion.referencia;
    });
    view.winGestion.btnAcept.on('enable', function () {
        if (view.winGestion.btnApply.hidden) {
            view.winGestion.btnCancel.nextTab = 'btnAcept' + view.winGestion.referencia;
        } else {
            view.winGestion.btnCancel.nextTab = 'btnApply' + view.winGestion.referencia;
        }        
        view.winGestion.tfDenomination.prevTab = 'btnAcept' + view.winGestion.referencia;
    }); 

    /**
     *Handler del boton Adicionar del gridpanel
     *
     */
    view.btnAdd.setHandler(function() {
        variables.accion = 'add';
        variables.url = '/pvd/persona/index.php/nomtipoformacion/addTipoFormacion';
        if (variables.record == null) {
            view.winGestion.setTitle('Adicionar tipo de preparación de la persona');
            view.winGestion.btnCancel.nextTab = 'btnApply' + view.winGestion.referencia;
            view.winGestion.btnAcept.prevTab = 'btnApply' + view.winGestion.referencia;
            view.winGestion.show();
            view.winGestion.btnApply.setVisible(true);
            view.winGestion.form.getForm().reset();
            view.winGestion.tfDenomination.focus(true, 100);
        }
        else {
            view.winGestion.setTitle('Adicionar tipo de preparación específica de la persona');
            view.winGestion.btnCancel.nextTab = 'btnApply' + view.winGestion.referencia;
            view.winGestion.btnAcept.prevTab = 'btnApply' + view.winGestion.referencia;
            view.winGestion.show();
            view.winGestion.btnApply.setVisible(true);
            view.winGestion.form.getForm().reset();
            view.winGestion.tfDenomination.focus(true, 100);
            var xy = view.winGestion.getPosition();
            var wh = view.winGestion.getSize();
            view.winGestion.updateBox({
                x: xy[0],
                y: xy[1],
                width: wh.width,
                height: wh.height
            });
        }

    });

    /**
     *Handler del boton Modificar del gridpanel
     *
     */
    view.btnChange.setHandler(function() {
        variables.accion = 'mod';
        variables.url = '/pvd/persona/index.php/nomtipoformacion/modTipoFormacion';

        if (!Ext.isEmpty(variables.record)) {
            if (variables.record.idpadre == variables.record.idtipoformacion) {
                view.winGestion.setTitle('Modificar tipo de preparación de la persona');
                view.winGestion.btnCancel.nextTab = 'btnAcept' + view.winGestion.referencia;
                view.winGestion.btnAcept.prevTab = 'btnCancel' + view.winGestion.referencia;
                view.winGestion.show();
                view.winGestion.btnApply.hide();
                view.winGestion.tfDenomination.setValue(variables.record.denominacion);
                view.winGestion.dfFrom.setRawValue(variables.record.fdesde);
                view.winGestion.dfUp.setRawValue(variables.record.fhasta);
                view.winGestion.taDescription.setValue(variables.record.descripcion);
                view.winGestion.tfDenomination.focus(true, 100);

            } else {
                view.winGestion.setTitle('Modificar tipo de preparación específica de la persona');
                view.winGestion.btnCancel.nextTab = 'btnAcept' + view.winGestion.referencia;
                view.winGestion.btnAcept.prevTab = 'btnCancel' + view.winGestion.referencia;
                view.winGestion.show();
                view.winGestion.btnApply.hide();
                view.winGestion.tfDenomination.setValue(variables.record.denominacion);
                view.winGestion.dfFrom.setRawValue(variables.record.fdesde);
                view.winGestion.dfUp.setRawValue(variables.record.fhasta);
                view.winGestion.taDescription.setValue(variables.record.descripcion);
                view.winGestion.tfDenomination.focus(true, 100);
                var xy = view.winGestion.getPosition();
                var wh = view.winGestion.getSize();
                view.winGestion.updateBox({
                    x: xy[0],
                    y: xy[1],
                    width: wh.width,
                    height: wh.height
                });
            }
        }

    });

    /**
     *Handler del boton Eliminar del gridpanel
     *
     */
    view.btnRemove.setHandler(function() {
        variables.url = '/pvd/persona/index.php/nomtipoformacion/delTipoFormacion';
        removeNomenclador(variables.url);

    });



    /**
     *Handler del boton Cancelar de la ventana
     *
     */
    view.winGestion.btnCancel.setHandler(function() {
        view.winGestion.hide();
    });

    /**
     *Handler del boton Aceptar de la ventana
     * @param accion='add'
     */
    view.winGestion.btnAcept.setHandler(function() {
        variables.btnpress = 'acp';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Handler del boton Aplicar de la ventana
     * @param accion='apl'
     */
    view.winGestion.btnApply.setHandler(function() {
        variables.btnpress = 'apl';
        addOrChangeNomenclador(variables.accion, variables.btnpress);
    });

    /**
     *Funcion para eliminar modo de formacion seleccionado
     */
    function removeNomenclador(url) {
        mostrarMensaje(2, '¿Está seguro que quiere eliminar el tipo de preparación seleccionado?', function(btn) {
            if (btn == 'ok') {
                var arr = new Array();
                Ext.each(view.getSelectionModel().getSelectedNode(), function(rec) {
                    arr.push(rec.id);
                });
                PVD.mostrarMascara('mask', 'Por favor espere...', 'Eliminando datos del tipo de preparación.');
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        idtipoformacion: Ext.encode(arr)
                    },
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('mask');
                        if (responseData.success) {
                            mostrarMensaje('1', 'El tipo de preparación de la persona ha sido eliminado satisfactoriamente.');
                            view.getLoader().load(view.getRootNode());
                            view.expandAll();
                            view.btnChange.disable();
                            view.btnRemove.disable();
                            view.btnAdd.focus();
                        } else {
                            if (!responseData.success) {
                                mostrarMensaje('3', 'El tipo de preparación de la persona no se puede eliminar debido a que está en uso.');
                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * Funcion para adicionar o modificar Modo de formación
     * @param accion Especifica la accion requerida(add,mod)
     * @param btnpress Especifica el boton precionado de la ventena (acp,apl)
     */
    function addOrChangeNomenclador(accion, btnpress) {
        var node = view.getSelectionModel().getSelectedNode();
        if (accion == 'add' || accion == 'mod') {
            if (view.winGestion.form.getForm().isValid()) {
                PVD.mostrarMascara('mask', 'Por favor espere..', 'Enviando datos al servidor.');
                var values = view.winGestion.form.getForm().getValues();

                if (accion == 'add') {
                    values.idpadre = node.id != 'roottipoformacion' ? node.id : null;
                }
                Ext.Ajax.request({
                    url: variables.url,
                    method: 'POST',
                    params: {
                        idtipoformacion: (accion != 'add') ? node.id : null,
                        values: Ext.encode(values)
                    },
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('mask');
                        if (responseData.success) {
                            var msg = (accion == 'add') ? 'El tipo de preparación ha sido adicionado satisfactoriamente.' : 'El tipo de preparación ha sido modifcado satisfactoriamente.';
                            mostrarMensaje('1', msg);
                            if (btnpress == 'acp') {
                                view.winGestion.hide();
                                view.winGestion.form.getForm().reset();
                            } else {
                                view.winGestion.form.getForm().reset();
                                view.winGestion.tfDenomination.focus(true, 100);
                            }
                            view.getLoader().load(view.getRootNode());
                            view.expandAll();

                        } else {
                            msg = (accion == 'add') ? 'El tipo de preparación que quiere adicionar ya existe.' : 'El tipo de preparación ya existe.';
                            mostrarMensaje('3', msg);
                        }
                    }
                });
            }
        } else {
            view.winGestion.hide();
            view.winGestion.form.getForm().reset();
        }
    }

};

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */

PVD.Persona.NomTipoFormacion.ViewCombo = Ext.extend(Ext.components.Tree_ComboBox, {
    fieldLabel: PVD.Persona.NomTipoFormacion.Lang.label,
    treeConfig: {
        loader: {
            dataUrl: '/pvd/persona/index.php/nomtipoformacion/getTipoFormacion'
        },
        border: false,
        autoScroll: true,
        rootVisible: false,
        root: {
            text: 'Tipo de preparación de la persona',
            animate: false,
            draggable: false,
            expanded: false
        }
    },
    clickNode: function(node, e) {
        if (node.isLeaf()) {
            var text = node.text;
            this.setValue(text);
            this.collapse();
        }
    },
    initComponent: function() {
        PVD.Persona.NomTipoFormacion.ViewCombo.superclass.initComponent.call(this);
    }
});

Ext.reg('combo_tipopreparacion', PVD.Persona.NomTipoFormacion.ViewCombo);

