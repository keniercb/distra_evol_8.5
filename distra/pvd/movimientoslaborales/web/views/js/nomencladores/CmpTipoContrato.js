
/*
 * Componente Tipo de contrato.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores.Tipocontrato
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.MovimientosLaborales.Nomencladores.Tipocontrato");
Pvd.MovimientosLaborales.Nomencladores.Tipocontrato = Ext.extend(Ext.Panel,{
    layout: 'border',
    border: false,
    id: 'tipocontrato',
    title: 'Tipo de contrato',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
         var self = this;
        var tipocontselect, accion, plantilla;
        var determinado = 0;
        var requiereplantilla = 0;
        var busc = 0;
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaTipodecontrato',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.lbCrearTP);
                self.ventanaGestion.show();
                self.btnAplicar.show();
                determinado = 0;
                requiereplantilla = 0;
                self.formularioGestion.getForm().reset();
                self.cbTipo.setRawValue('');
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: this.idioma.BtnModificar,
            disabled: true,
            tooltip: this.idioma.lbBtnModificar,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.lbModificarTP);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tfdenom.setValue(tipocontselect.denominacion);
                self.tadescripcion.setValue(tipocontselect.descripcion);
                var chplant = (tipocontselect.plantilla == 1)?true:false;
                self.cbTipo.setValue(determinado);
                self.chRequierePlantilla.setValue(chplant);
                accion = 'mod';
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminar,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarTipoCont();
            }.createDelegate(this)
        });

        //Botón para ver plantilla.
        this.btnVer = new Ext.Button({
            text: 'Previsualizar',
            disabled: true,
            tooltip: 'Previsualizar plantilla del contrato <b>(Alt+V)</b>',
            iconCls: 'ver',
            handler: function ()
            {
                if (tipocontselect.idplantilla) {
                    var win = new PVD.Plantilla.Contenedor({
                        idplantilla: tipocontselect.idplantilla,
                        title: 'Plantilla del contrato',
                        margenes: '8, 8, 8, 8'
                    });
                    win.show();
                    win.maximize();
                } else {
                    mostrarMensaje(6, 'El tipo de contrato seleccionado no posee plantilla configurada.')
                }
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscar,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stTipoContrato.load({params:{denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
                busc = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            text: this.idioma.BtnLimpiar,
            tooltip: this.idioma.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscar.reset();
                self.stTipoContrato.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width:140,
            name : 'tfbuscador'
        });

        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Cargar Imágenes para columna determinar período
        function loadImgProcess(val) {
            if(val == 1) {
                return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
            } else {
                return '<span style="color: #aa0710;">' + '&#08416;' + '</span>';
            }
        }

        //Fuente de datos del listado.
        this.stTipoContrato = new Ext.data.Store({
            url: 'getTiposContrato',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idtipocontrato", totalProperty: "cantidad"},
                [{name:'idtipocontrato'},{name:'denominacion'}, {name:'descripcion'}, {name:'determinado'},
                 {name:'idplantilla'}, {name:'plantilla'}, {name:'gestion'}, {name:'tipo'}]
            ),
            listeners: {
                load: function (st) {
                    tipocontselect = null;
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    self.btnVer.disable();
                    if (busc == 1 && st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            }
        });

        this.stTipoContrato.load({params: {start:0, limit: 15}});

        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="No gestionable"';
            }
            return val;
        }

        //Listado de tipos de contrato.
        this.gpTipoContrato = new Ext.grid.GridPanel({
            store: this.stTipoContrato,
            border: false,
            loadMask: {msg: 'Cargando...'},
            plugins:this.expander,
            tbar: ['',
                this.idioma.lbDenominacion+':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar
            ],
            columns: [this.expander,
                {
                    header: this.idioma.lbDenominacion,
                    width:300,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: 'Requiere plantilla',
                    width:100,
                    align: 'center',
                    dataIndex: 'plantilla',
                    renderer : loadImgProcess
                } ,
                {
                    header: 'Tipo',
                    width:100,
                    align: 'center',
                    dataIndex: 'tipo'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stTipoContrato,
                displayInfo: true
            })
        });

        this.gpTipoContrato.getSelectionModel().on('rowselect', function (n) {
            tipocontselect = n.getSelected().data;
            if (tipocontselect.gestion == 1) {
                self.btnModificar.enable();
                self.btnEliminar.enable();
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
            if (tipocontselect.plantilla==1) {
                self.btnVer.enable();
            } else {
                self.btnVer.disable();
            }
        }, this);

        //Panel con listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            region: 'center',
            items: [this.gpTipoContrato]
        });


        this.tlPlantilla = new Ext.tree.TreeLoader({
            dataUrl: 'getTiposPlantilla',
            preloadChildren: false,
            listeners: {
                beforeload: function (treeLoader, node, response) {
                    if (node.attributes.hoja == true) {
                        treeLoader.baseParams.idtipoplantilla = node.attributes.id;
                    } else {
                        treeLoader.baseParams.idtipoplantilla = -1;
                    }
                },
                load: function () {
                    if (accion == 'mod' && tipocontselect.idplantilla != '') {
                        var nod = self.tpPlantilla.getNodeById('p-'+tipocontselect.idplantilla);
                        if (nod) {
                            nod.select();
                        }
                    }
                }
            }
        });

        this.tpPlantilla = new Ext.tree.TreePanel({
            region: 'center',
            title: 'Plantillas de documentos',
            split: false,
            border: true,
            frame: false,
            height: 120,
            autoScroll: true,
            style: 'background-color: #ffffff;',
            loader: this.tlPlantilla,
            containerScroll: true,
            rootVisible: true,
            layout: 'fit',
            root: new Ext.tree.AsyncTreeNode({
                text: 'Fuerza de trabajo',
                id: 'root'
            }),
            listeners: {
                click: function (node) {
                    if (node.attributes.leaf == false) {
                        self.btnAceptar.disable();
                        self.btnAplicar.disable();
                    } else {
                        self.btnAceptar.enable();
                        self.btnAplicar.disable();
                    }
                }
            }
        });

        // panel para add, mod, del, ayuda
        this.panel2 = new Ext.Panel({
            layout: 'fit',
            region: 'north',
            border: false,
            tbar:[
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar,'-',this.btnVer,
                '->',this.btnAyuda]
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenomtc'+self.panel.id,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank : false,
            maxLength: 100,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres,
            anchor:	'99%',
            name : 'denominacion'
        });

        this.chRequierePlantilla = new Ext.form.Checkbox({
            boxLabel: 'Requiere plantilla de contrato',
            hidden: false,
            hideLabel: true,
            name: 'plantilla',
            anchor: '100%',
            listeners: {
                check: function (v) {
                    if (v.checked == true) {
                        requiereplantilla = 1;
                        Ext.getCmp('colplantillas').show();
                        self.ventanaGestion.setHeight(450);
                        self.tpPlantilla.getSelectionModel().clearSelections();
                        self.tpPlantilla.getRootNode().reload();
                        self.tpPlantilla.expandAll();
                    }   else {
                        requiereplantilla = 0;
                        Ext.getCmp('colplantillas').hide();
                        self.ventanaGestion.setHeight(340);
                    }
                }
            }
        });

        // Area de texto Descripción
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbDescripcion,
            name: 'descripcion',
            anchor:	'99%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 255,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.lbRegexTextDescripcion,
            allowBlank:	true
        });

        this.stTipo = new Ext.data.SimpleStore({
            fields: ['text', 'id'],
            data: [
                ['Determinado', 1],
                ['Indeterminado', 0],
                ['Eventual', 2]
            ]
        });

        this.cbTipo = new Ext.form.ComboBox({
            store: this.stTipo,
            fieldLabel: 'Tipo',
            anchor: '99%',
            height: 100,
            hiddenName:'id',
            displayField: 'text',
            valueField: 'id',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: false,
            tpl:'<tpl for="."><div ext:qtip="<b>{text}</b>" class="x-combo-list-item">{text}</div></tpl>'
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.cbTipo]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tadescripcion]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.chRequierePlantilla]
                    },{
                        columnWidth:1.0,
                        id: 'colplantillas',
                        hidden: true,
                        layout: 'form',
                        items: [this.tpPlantilla]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenomtc'+self.panel.id,
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbtnCancelar,
            handler: function ()
            {
                determinado = 0;
                requiereplantilla = 0;
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'tfdenomtc'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicartc';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenomtc'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicartc',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbtnAplicar,
            handler: function ()
            {
                guardarDatos('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            title: this.idioma.lbCrearTP,
            width: 410,
            height: 340,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfdenom.focus(true, 500);
                }
            },
            keys: [{
                    key: 'x',
                    alt: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelar.disabled) {
                            self.btnCancelar.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicar.disabled) {
                            self.btnAplicar.handler();
                        }
                    }
                },
                {
                    key: 13,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptar.disabled) {
                            self.btnAceptar.handler();
                        }
                    }
                }]
        });

        this.items = [this.panel2, this.panel];

        this.panel2.on('render', function ()
        {
            self.btnAdicionar.focus();
        });

        this.ventanaGestion.on('hide', function ()
        {
            self.btnAdicionar.focus();
        });

        function guardarDatos(btnpress)
        {
            if(self.formularioGestion.getForm().isValid()){
                var idpadre = null;
                if (accion == 'add' && tipocontselect) {
                    idpadre = tipocontselect.idtipodocumento;
                }
                if(requiereplantilla == 1 && self.tpPlantilla.getSelectionModel().getSelectedNode()){
                    var idp = self.tpPlantilla.getSelectionModel().getSelectedNode().attributes.idplantilla;
                }
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addTipoContrato' : 'updateTipoContrato'),
                    params: {
                        idtipocontrato: accion == 'add' ? -1 : tipocontselect.idtipocontrato,
                        plantilla: requiereplantilla,
                        denominacion: self.tfdenom.getValue(),
                        determinado: self.cbTipo.getValue(),
                        descripcion: self.tadescripcion.getValue(),
                        idplantilla: idp
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgCorrectoMod);
                            }else{
                                mostrarMensaje(1, self.idioma.msgCorrectoAdd);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            determinado = 0;
                            requiereplantilla = 0;
                            self.formularioGestion.getForm().reset();
                            self.stTipoContrato.removeAll();
                            self.stTipoContrato.reload();
                        } else
                            mostrarMensaje(6,self.idioma.lbMsgAddFail);

                    }
                });
            }
        }

        function eliminarTipoCont()
        {
            var ids = new Array();
            var s = self.gpTipoContrato.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idtipocontrato);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el tipo de contrato seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los tipos de contrato seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: 'deleteTipoContrato',
                        params: {tiposcontrato: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El tipo de contrato seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los tipos de contrato seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El tipo de contrato ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los tipos de contrato han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stTipoContrato.removeAll();
                            self.stTipoContrato.reload();
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
                    if (!self.btnAdicionar.disabled) {
                        self.btnAdicionar.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnModificar.disabled) {
                        self.btnModificar.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                //stopEvent: true,
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            },
            /*{
                key: 'k',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnVer.disabled) {
                        self.btnVer.handler();
                    }
                }
            },*/
            {
                key: 'h',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ];

        Pvd.MovimientosLaborales.Nomencladores.Tipocontrato.superclass.initComponent.call(this);
    }
});
