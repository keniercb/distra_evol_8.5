
/*
 * Componente Configurar entidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores.ConfigEntidad
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.MovimientosLaborales.Nomencladores.ConfigEntidad");
Pvd.MovimientosLaborales.Nomencladores.ConfigEntidad = Ext.extend(Ext.Panel,{
    layout: 'border',
    border: false,
    id: 'configentidad',
    title: 'Unidades empresariales de base (UEB)',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;
        var confselect, accion;
        var busc = 0;
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaUnidadesempresariales',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: 'Adicionar unidad empresarial de base <b>(Alt+I)</b>',
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestion.setTitle('Adicionar unidad empresarial de base');
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.tcbEntidadPadre.setValue('');
                self.tcbEntidadPadre.setRawValue('');
                self.tpEstruct.getRootNode().collapse();
                self.tpEstruct.disable();
                self.formularioGestion.getForm().clearInvalid();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: this.idioma.BtnModificar,
            disabled: true,
            tooltip: 'Modificar unidad empresarial de base <b>(Alt+M)</b>',
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.setTitle('Modificar unidad empresarial de base');
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tcbEntidadPadre.setValue(confselect.identidad);
                self.tcbEntidadPadre.setRawValue(confselect.entidad);
                self.tpEstruct.enable();
                self.tlEst.load(self.tpEstruct.getRootNode());
                self.tpEstruct.getRootNode().expand();
                accion = 'mod';
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: 'Eliminar unidad empresarial de base <b>(DEL)</b>',
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminar();
            }.createDelegate(this)
        });

        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Fuente de datos del listado.
        this.stConfig = new Ext.data.GroupingStore({
            url: 'getConfigEntidad',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idestructura", totalProperty: ""},
                [{name:'idestructura'},{name:'estructura'}, {name:'identidad'}, {name:'entidad'}]
            ),
            sortInfo   : {
                field: 'entidad',
                direction: "DESC"
            },
            groupField : 'entidad',
            listeners: {
                load: function (st) {
                    confselect = null;
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    if (busc == 1 && st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            }
        });

        this.stConfig.load();

        //Listado de tipos de contrato.
        this.gpConfig = new Ext.grid.GridPanel({
            store: this.stConfig,
            border: false,
            loadMask: {msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit       : true,
                startCollapsed : false,
                groupTextTpl   : '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Unidades" : "Unidad"]})'
            }),
            columns: [
                {
                    header: '',
                    width:300,
                    hidden: true,
                    dataIndex: 'entidad'
                },
                {
                    header: 'Unidad empresarial de base',
                    width:100,
                    dataIndex: 'estructura'
                }
            ]
        });

        this.gpConfig.getSelectionModel().on('rowselect', function (n) {
            confselect = n.getSelected().data;
            self.btnModificar.enable();
            self.btnEliminar.enable();
        }, this);

        //Panel con listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            region: 'center',
            items: [this.gpConfig]
        });

        // panel para add, mod, del, ayuda
        this.panel2 = new Ext.Panel({
            layout: 'fit',
            region: 'north',
            border: false,
            tbar:[
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar,
                '->', this.btnAyuda]
        });

        this.tlentidades = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructura',
            preloadChildren: false
        });

        this.tcbEntidadPadre = new Ext.components.TreeComboBox({
            anchor:	'100%',
            allowBlank: false,
            fieldLabel: 'Entidad',
            id: 'tcbEntidadPadre'+self.panel.id,
            treeConfig: {
                rootVisible: false,
                loader: this.tlentidades,
                border: false,
                autoScroll: true
            }
        });


        this.tlEst = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructura',
            preloadChildren: false
        });

        this.tpEstruct = new Ext.tree.TreePanel({
            title: 'Unidades empresariales de base',
            split:false,
            autoScroll:true,
            region: 'south',
            disabled: true,
            height: 350,
            border:false,
            layout: 'fit',
            loader: self.tlEst,
            root: new Ext.tree.AsyncTreeNode({
                text:'Estructuras',
                id: 0
            })
        });

        //Formulario de gestion.
       this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            region: 'center',
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tcbEntidadPadre]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            nextTab: 'tcbEntidadPadre'+self.panel.id,
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbtnCancelar,
            handler: function ()
            {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'tcbEntidadPadre'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarce';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tcbEntidadPadre'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarce',
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
            layout: 'border',
            width: 600,
            height: 500,
            items: [this.formularioGestion, this.tpEstruct],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
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

        this.ventanaGestion.on('show', function ()
        {
            self.tcbEntidadPadre.focus(true, 500);
        });

        this.ventanaGestion.on('hide', function ()
        {
            self.btnAdicionar.focus();
        });

        this.tlEst.on('beforeload', function (tl, n)
        {
            if (tl.isLoading()) {
                return false;
            } else if (self.tcbEntidadPadre.getValue() != '') {
                tl.baseParams.idestructura = self.tcbEntidadPadre.getValue();
                if (accion == 'mod') {
                    tl.baseParams.check = 1;
                }  else {
                    tl.baseParams.check = 0;
                }
            }
        });

        this.tlEst.on('load', function (tl, n)
        {
            if (accion == 'mod') {
                return false;
            } else if (self.tcbEntidadPadre.getValue() != '') {
                tl.baseParams.idestructura = self.tcbEntidadPadre.getValue();
            }
        });

        this.tcbEntidadPadre.tree.on('click', function (n)
        {
            if (n.attributes.idconcepto == 3) {
                self.tpEstruct.enable();
                self.tlEst.load(self.tpEstruct.getRootNode());
                self.tpEstruct.getRootNode().expand();
            }  else {
                mostrarMensaje(6, 'Debe seleccionar una entidad.');
                self.tcbEntidadPadre.setValue('');
                self.tcbEntidadPadre.setRawValue('');
            }
            self.tcbEntidadPadre.focus(true, 500);
        });

        this.tpEstruct.on('checkchange', function (n, ch)
        {
            if (ch == true) {
                if (n.attributes.idconcepto != 5) {
                    mostrarMensaje(6, 'Debe seleccionar un &oacute;rgano interno.');
                    var padre = n.parentNode;
                    self.tlEst.load(padre);
                    padre.expand();
                }
            }
        });

        function guardarDatos(btnpress)
        {
            var checkestructuras = self.tpEstruct.getChecked();
            if (checkestructuras.length > 0) {
                var arrayidestructuras = new Array();
                for (i = 0; i<checkestructuras.length; i++) {
                    arrayidestructuras.push(checkestructuras[i].id);
                }
                if(self.formularioGestion.getForm().isValid()){
                    Ext.getBody().mask('Por favor espere... Guardando datos.');
                    Ext.Ajax.request({
                        url: (accion == 'add' ? 'addConfigEntidad' : 'updateConfigEntidad'),
                        params: {
                            identidad: self.tcbEntidadPadre.getValue(),
                            arrayidestructuras: Ext.encode(arrayidestructuras)
                        },
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData != false) {
                                if(accion == 'mod')
                                {
                                    if (checkestructuras.length > 1) {
                                        mostrarMensaje(1, 'Las unidades empresariales de base han sido modificadas satisfactoriamente.');
                                    } else {
                                        mostrarMensaje(1, 'La unidad empresarial de base ha sido modificada satisfactoriamente.');
                                    }
                                }else{
                                    if (checkestructuras.length > 1) {
                                        mostrarMensaje(1, 'Las unidades empresariales de base han sido adicionadas satisfactoriamente.');
                                    } else {
                                        mostrarMensaje(1, 'La unidad empresarial de base ha sido adicionada satisfactoriamente.');
                                    }
                                }
                                if (btnpress == 'ACP')
                                {
                                    self.ventanaGestion.hide();
                                }
                                self.formularioGestion.getForm().reset();
                                self.stConfig.removeAll();
                                self.stConfig.reload();
                            } else
                                mostrarMensaje(6,'Alguna de las entidades no pueden ser adicionas debido a que ya existen.');
                        }
                    });
                }
            }  else {
                mostrarMensaje(6,'Debe seleccionar las unidades empresariales de base.');
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = self.gpConfig.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idestructura);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la unidad empresarial de base seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las unidadades empresariales de base seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: 'deleteConfigEntidad',
                        params: {arrayids: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false)  {
                                if (s.length == 1) {
                                    mensaje = 'La unidad empresarial de base seleccionada no puede ser eliminada.';
                                } else {
                                    mensaje = 'Alguna de las unidades empresariales de base seleccionadas no puede ser eliminada.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                self.btnAdicionar.focus();
                                if (s.length == 1) {
                                    mensaje = 'La unidad empresarial de base seleccionada ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las unidades empresariales de base seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stConfig.removeAll();
                            self.stConfig.reload();
                        }
                    });
                }
            });
        }

        this.keys = [
            {
                key: 'i',
                alt: true,
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
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                fn: function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            }
        ];

        Pvd.MovimientosLaborales.Nomencladores.ConfigEntidad.superclass.initComponent.call(this);
    }
});
