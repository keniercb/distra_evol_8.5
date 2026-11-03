
/*
 * Componente situación laboral.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores.Situacion
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.MovimientosLaborales.Nomencladores.Situacion");
Pvd.MovimientosLaborales.Nomencladores.Situacion = Ext.extend(Ext.tree.TreeGrid,{
    layout: 'fit',
    id: 'situacion',
    title: 'Situaci&oacute;n laboral',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    border: false,
    rootVisible: true,
    initComponent: function () {
        //Variables
        var self = this;
        var record = null;
        var accion = 'add';
        var url, btnpress;

        this.btnAdd = new Ext.Button({
            id: 'btnAdd' + self.id,
            disabled: true,
            text: self.idioma.BtnAdicionar,
            nextTab: 'btnChange' + self.id,
            prevTab: 'btnHelp' + self.id,
            tooltip: self.idioma.lbBtnAdicionarSl,
            iconCls: 'adicionar',
            handler: function ()
            {
                accion = 'add';
                url = '/pvd/movimientoslaborales/index.php/nomencladores/addSituation';
                self.chbxCargoAsociado.setVisible(true);
                self.winGestion.setHeight(390);
                if (record == null) {
                    self.winGestion.setTitle(self.idioma.msgAddSit+' laboral');
                    self.winGestion.show();
                    self.btnApply.setVisible(true);
                    self.formularioGestion.getForm().reset();
                    self.tfDenomination.focus(true, 100);
                }
                else {
                    self.winGestion.setTitle(self.idioma.msgAddSitEsp);
                    self.winGestion.show();
                    self.btnApply.setVisible(true);
                    self.formularioGestion.getForm().reset();
                    self.tfDenomination.focus(true, 100);
                }
            }.createDelegate(this)
        });

        this.btnChange = new Ext.Button({
            disabled: true,
            id: 'btnChange' + self.id,
            nextTab: 'btnRemove' + self.id,
            prevTab: 'btnAdd' + self.id,
            text: self.idioma.BtnModificar,
            tooltip: self.idioma.lbBtnModificarSl,
            iconCls: 'Modificar',
            handler: function ()
            {
                accion = 'mod';
                url = '/pvd/movimientoslaborales/index.php/nomencladores/changeSituation';
                self.winGestion.setTitle('Modificar situaci&oacute;n laboral');
                if (!Ext.isEmpty(record)) {
                    self.winGestion.show();
                    self.btnApply.hide();
                    self.tfDenomination.setValue(record.denominacion);
                    self.cfcolor.setValue(record.color);
                    self.chbxCargoAsociado.setVisible(true);
                    self.winGestion.setHeight(390);
                    self.chbxCargoAsociado.setValue(record.asociadocargo);
                    self.dfFrom.setRawValue(record.fdesde);
                    self.dfUp.setRawValue(record.fhasta);
                    self.taDescription.setValue(record.descripcion);
                }
            }.createDelegate(this)
        });

        this.btnRemove = new Ext.Button({
            disabled: true,
            id: 'btnRemove' + self.id,
            nextTab: 'search' + self.id,
            prevTab: 'btnChange' + self.id,
            text: self.idioma.BtnEliminar,
            tooltip: self.idioma.lbBtnEliminarSl,
            iconCls: 'eliminar',
            handler: function ()
            {
                url = '/pvd/movimientoslaborales/index.php/nomencladores/removeSituation';
                removeNomenclador(url);
            }.createDelegate(this)
        });

        this.btnHelp = new Ext.Button({
            id: 'idbtnAyudaSituacionlaboral',
            text: self.idioma.BtnAyuda,
            nextTab: 'btnAdd' + self.id,
            prevTab: 'search' + self.id,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });

        /**
         * Expande todos los nodos
         * @type {Button}
         */
        this.btnExpandAll = new Ext.Button({
            iconCls: 'expandir',
            tooltip: self.idioma.lbBtnExpandir,
            scope: this,
            handler: function ()
            {
                self.expandAll();
            }.createDelegate(this)
        });

        /**
         * Contrae a todos los nodos
         * @type {Button}
         */
        this.btnCollapseAll = new Ext.Button({
            iconCls: 'contraer',
            tooltip: self.idioma.lbBtnCollapse,
            scope: this,
            handler: function ()
            {
                self.collapseAll();
            }.createDelegate(this)
        });

        this.btnUpdate = new Ext.Button({
            iconCls: 'actualizar',
            tooltip: self.idioma.lbBtnUpdate,
            scope: this,
            handler: function ()
            {
                self.getLoader().load(self.getRootNode());
                self.expandAll();
            }.createDelegate(this)
        });

        this.columns = [
            {
                header: 'Denominación',
                dataIndex: 'denominacion',
                width: 450,
                tpl: new Ext.XTemplate('{denominacion:this.renderColor}', {
                    renderColor: function (v, rec) {
                        rec.descripcion = Ext.isEmpty(rec.descripcion) ? 'Sin descripción' : rec.descripcion;
                        if (!Ext.isEmpty(rec.color)) {
                            return '<span ext:qtip="<b>' + rec.descripcion + '</b>"  style="color:' + rec.color + ';">' + v + '</span>';
                        }
                        else {
                            return '<span ext:qtip="<b>' + rec.descripcion + '</b>">' + v + '</span>';
                        }
                    }
                })
            },
            {
                header: "Cargo asociado",
                width: 120,
                sortable: true,
                align: 'center',
                dataIndex: 'asociadocargo',
                tpl: new Ext.XTemplate('{asociadocargo:this.render}', {
                    render: function (v) {
                        if (Ext.isEmpty(v)) {
                            return ' ';
                        }
                        return v === '1' ? 'Si' : '';
                    }
                })

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
                    clearDate: function (v, rec) {
                        if (Ext.isEmpty(v)) {
                            return '';
                        } else {
                            return v;
                        }

                    }
                })
            },
            {
                header: '',
                width: 100,
                dataIndex: 'fdesde',
                hidden: true,
                align: 'center'
            }
        ];
        this.dataUrl = '/pvd/movimientoslaborales/index.php/nomencladores/getAllSituation';

        this.root = new Ext.tree.AsyncTreeNode({
            id: 'rootsituacion',
            denominacion: 'Situaci&oacute;n laboral',
            expanded: true,
            uiProvider: Ext.ux.tree.TreeGridNodeUI
        });

        this.tbar = [this.btnAdd, this.btnChange, this.btnRemove, '-', this.btnExpandAll, this.btnCollapseAll, this.btnUpdate, '->', this.btnHelp];

        this.cfcolor = this.cfcolor || new Ext.ux.ColorField({
            fieldLabel: 'Color',
            hideLabel: false,
            readOnly: true,
            hideParent: true,
            emptyText:'Seleccione...',
            name: 'color',
            anchor: '99%'
        });

        this.tfDenomination = this.tfDenomination || new Ext.form.TextField({
            id: 'tfDenomination'+self.cfcolor.id,
            fieldLabel: 'Denominación',
            name: 'denominacion',
            allowBlank: false,
            anchor: '99%',
            maxLength: 100,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres
        });

        this.chbxCargoAsociado = new Ext.form.Checkbox({
            boxLabel: 'Cargo Asociado',
            hideParent: true,
            hideLabel: true,
            hidden: true,
            anchor: '99%',
            name: 'asociadocargo'
        });

        this.taDescription = this.taDescription || new Ext.form.TextArea({
            id: 'taDescription'+self.cfcolor.id,
            fieldLabel: 'Descripción',
            name: 'descripcion',
            anchor: '99%',
            height: 100,
            maxLength: 255,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.lbRegexTextDescripcion
        });

        this.dfFrom = this.dfFrom || new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde'+self.cfcolor.id,
            nextTab: 'fhasta'+self.cfcolor.id,
            prevTab: 'tfDenomination'+self.cfcolor.id,
            fieldLabel: 'Fecha inicio',
            anchor: '98%',
            allowBlank: false,
            format: 'd/m/Y',
            //format: 'j \\de F \\de Y',
            value: new Date().format('d/m/Y'),
            vtype: 'daterange',
            endDateField: 'fhasta'+self.cfcolor.id
        });

        this.dfUp = this.dfUp || new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta'+self.cfcolor.id,
            nextTab: 'taDescription'+self.cfcolor.id,
            prevTab: 'fdesde'+self.cfcolor.id,
            fieldLabel: 'Fecha fin',
            anchor: '98%',
            format: 'd/m/Y',
            value: '',
            vtype: 'daterange',
            startDateField: 'fdesde'+self.cfcolor.id
        });

        this.formularioGestion = new Ext.form.FormPanel({
            frame: true,
            region: 'center',
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            autoHeigth: true,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            items: this.itemsForm || [ {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [self.tfDenomination]
                        },
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [self.chbxCargoAsociado]
                        },
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [self.cfcolor]
                        },
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

        this.btnCancel = new Ext.Button({
            nextTab: 'tfDenomination',
            iconCls: 'cancelar',
            tooltip: self.idioma.textToolTipCancelar,
            text: self.idioma.lbtnCancelar,
            handler: function ()
            {
                self.winGestion.hide();
            }.createDelegate(this)
        });

        this.btnAcept = new Ext.Button({
            nextTab: 'tfDenomination',
            iconCls: 'aceptar',
            tooltip: self.idioma.textToolTipAceptar,
            text: self.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancel.nextTab = 'btnApplysl';
                },
                'disable': function()
                {
                    self.btnCancel.nextTab = 'tfDenomination'+self.cfcolor.id;
                }
            },
            handler: function ()
            {
                btnpress = 'acp';
                addOrChangeNomenclador(accion, btnpress);
            }.createDelegate(this)
        });

        this.btnApply = new Ext.Button({
            id: 'btnApplysl',
            iconCls: 'aplicar',
            tooltip: self.idioma.textToolTipAplicar,
            text: self.idioma.lbtnAplicar,
            handler: function ()
            {
                btnpress = 'apl';
                addOrChangeNomenclador(accion, btnpress);
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.winGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: self.idioma.lbCrearTP,
            width: 420,
            height: 390,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancel,
                this.btnApply,
                this.btnAcept
            ],
            keys: [{
                    key: 'x',
                    alt: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnCancel.disabled) {
                            self.btnCancel.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnApply.disabled) {
                            self.btnApply.handler();
                        }
                    }
                },
                {
                    key: 13,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAcept.disabled) {
                            self.btnAcept.handler();
                        }
                    }
                }]
        });

        this.on('render', function ()
        {
            self.btnAdd.focus();
        });

        this.winGestion.on('hide', function ()
        {
            self.btnAdd.focus();
        });

        this.getSelectionModel().on('selectionchange', function (sm, node) {
            if (node) {
                record = node.attributes;
                if (node == self.getRootNode()) {
                    record = null;
                    self.btnAdd.enable();
                    self.btnChange.disable();
                    self.btnRemove.disable();
                } else {
                    self.btnAdd.enable();
                    if (record.gestion == 1) {
                        self.btnChange.enable();
                        self.btnRemove.enable();
                    } else {
                        self.btnChange.disable();
                        self.btnRemove.disable();
                    }
                }
            } else {
                self.btnAdd.disable();
                self.btnRemove.disable();
                self.btnChange.disable();
                record = null;
            }
        });

        /**
         * Función para adicionar o modificar  situación
         * @param accion Especifica la acción requerida(add,mod)
         * @param btnpress Especifica el botón presionado de la ventana (acp,apl)
         */
        function addOrChangeNomenclador(accion, btnpress) {
            var node = self.getSelectionModel().getSelectedNode();
            if (accion == 'add' || accion == 'mod') {
                if (self.formularioGestion.getForm().isValid()) {
                    PVD.mostrarMascara('mask', 'Por favor espere..', self.idioma.msgEspere);
                    var values = self.formularioGestion.getForm().getValues();
                    values.asociadocargo = values.asociadocargo === 'on' ? 1 : 0;
                    values.color = values.color || node.attributes.color;
                    if (accion == 'add') {
                        values.idpadre = node.id != 'rootsituacion' ? node.id : null;
                    }
                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',
                        params: {
                            idsituacion: (accion != 'add') ? node.id : null,
                            values: Ext.encode(values)
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('mask');
                            if (responseData.success) {
                                var msg = (accion == 'add') ? self.idioma.msgAddSucces : self.idioma.msgModSucces;
                                mostrarMensaje('1', msg);
                                if (btnpress == 'acp') {
                                    self.winGestion.hide();
                                    self.formularioGestion.getForm().reset();
                                } else {
                                    self.formularioGestion.getForm().reset();
                                    self.tfDenomination.focus(true, 100);
                                }
                                self.getLoader().load(self.getRootNode());
                                self.expandAll();

                            } else {
                                msg = (accion == 'add') ? self.idioma.msgSitExiste : 'La situación ya existe.';
                                mostrarMensaje('6', msg);
                            }
                        }
                    });
                }
            } else {
                self.winGestion.hide();
                self.formularioGestion.getForm().reset();
            }
        }

        /**
         *Función para eliminar la situación seleccionada
         */
        function removeNomenclador(url) {
            mostrarMensaje(2, self.idioma.msgConfirmDel, function (btn) {
                if (btn == 'ok') {
                    var arr = new Array();
                    Ext.each(self.getSelectionModel().getSelectedNode(), function (rec) {
                        arr.push(rec.id);
                    });
                    PVD.mostrarMascara('mask', 'Por favor espere...', self.idioma.msgEspereDel);
                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',
                        params: {
                            idsituacion: Ext.encode(arr)
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('mask');
                            if (responseData.success) {
                                mostrarMensaje('1', self.idioma.msgDeleteSucces);
                                self.getLoader().load(self.getRootNode());
                                self.expandAll();
                                self.btnChange.disable();
                                self.btnRemove.disable();
                                self.btnAdd.focus();
                            } else {
                                if (!responseData.success) {
                                    mostrarMensaje('6', self.idioma.msgDeleteFails);
                                }
                            }
                        }
                    });
                }
            });
        }

        this.keys = [
            {
                key: 'i',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAdd.disabled) {
                        self.btnAdd.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnChange.disabled) {
                        self.btnChange.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                //stopEvent: true,
                fn: function () {
                    if (!self.btnRemove.disabled) {
                        self.btnRemove.handler();
                    }
                }
            },
            {
                key: 38,//Contraer
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnCollapseAll.disabled) {
                        self.btnCollapseAll.handler();
                    }
                }
            },
            {
                key: 40,//Expandir
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnExpandAll.disabled) {
                        self.btnExpandAll.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnHelp.disabled) {
                        self.btnHelp.handler();
                    }
                }
            },
            {
                key: 'z',
                alt: true,
                ctrl: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnUpdate.disabled) {
                        self.btnUpdate.handler();
                    }
                }
            }
        ];
        Pvd.MovimientosLaborales.Nomencladores.Situacion.superclass.initComponent.call(this);
    }
});
