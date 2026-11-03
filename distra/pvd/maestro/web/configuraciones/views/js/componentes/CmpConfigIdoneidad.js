
/*
 * Componente Configurar idoneidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones.Escala
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Maestro.Configuraciones.ConfigIdoneidad");
Pvd.Maestro.Configuraciones.ConfigIdoneidad = Ext.extend(Ext.Panel,{
    layout: 'border',
    border: false,
    id: 'pidoneidad',
    title: 'Estructuras para idoneidad',
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
            id: 'idbtnAyudaConfigIdon',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.btnAdicionar,
            tooltip: 'Adicionar configuraci&oacute;n <b>(Alt+I)</b>',
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestion.setTitle('Adicionar configuraci&oacute;n');
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.cbTipo.setValue('');
                //self.tpEstruct.tree.getRootNode().collapse();
                self.formularioGestion.getForm().clearInvalid();
                accion = 'add';
                self.btnAceptar.disable();
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: this.idioma.btnModificar,
            disabled: true,
            tooltip: 'Modificar configuraci&oacute;n <b>(Alt+M)</b>',
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.setTitle('Modificar configuraci&oacute;n');
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tlEst.load(self.tpEstruct.tree.getRootNode());
                //self.tpEstruct.tree.getRootNode().expand();
                accion = 'mod';
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.btnEliminar,
            disabled: true,
            tooltip: 'Eliminar configuraci&oacute;n <b>(DEL)</b>',
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
            url: '/pvd/maestro/configuraciones/index.php/confidoneidad/getConfigIdoneidad',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idconfidoneidad", totalProperty: ""},
                [{name:'idconfidoneidad'}, {name:'idestructura'},{name:'estructura'}, {name:'tipo'}]
            ),
            sortInfo   : {
                field: 'tipo',
                direction: "DESC"
            },
            groupField : 'tipo',
            listeners: {
                load: function (st) {
                    confselect = null;
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    if (busc == 1 && st.getCount()==0) {
                        mostrarMensaje(1, 'No existen datos que coincidan con el criterio de búsqueda especificado.');
                        busc = 0;
                    } else if (st.getCount()==0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
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
                groupTextTpl   : '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Estructuras" : "Estuctura"]})'
            }),
            columns: [
                {
                    header: '',
                    width:300,
                    hidden: true,
                    dataIndex: 'tipo',
                    renderer: function (val) {
                        if(val == 1) {
                            return 'Por competencias laborales';
                        } else if (val == 2) {
                            return 'Por procesos de idoneidad';
                        }
                    }
                },
                {
                    header: 'Estructura',
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
                //this.btnModificar,
                this.btnEliminar,'-',
                '->', '','-',this.btnAyuda]
        });

        this.tlentidades = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructura',
            preloadChildren: false
        });

        this.cbTipo = new Ext.form.ComboBox({
            fieldLabel: 'Idoneidad',
            name: 'id',
            hideOnSelect: false,
            anchor: '98%',
            allowBlank: false,
            width: 100,
            mode: 'local',
            editable: false,
            hiddenName: 'id',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            store: new Ext.data.SimpleStore({
                fields: ['valor', 'id'],
                data: [
                    ['Por competencias laborales', 1],
                    ['Por procesos de idoneidad', 2]
                ]
            }),
            valueField: 'id',
            displayField: 'valor'
        });

        this.tlEst = new Ext.tree.TreeLoader({
            dataUrl: '/pvd/maestro/configuraciones/index.php/confidoneidad/getEstructura',
            preloadChildren: false
        });

        this.tpEstruct = new Ext.estructura.panel.PanelEstructura({
            border: false,
            height: 350,
            //inicial: perfil.idestructuracomun,
            width: 410,
            checker: true,
            cargos: false,
            split: true,
            region: 'south'
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
                        items: [this.cbTipo]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbBtnCancelar,
            handler: function ()
            {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbBtnAceptar,
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarce',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbBtnAplicar,
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
            width: 500,
            height: 500,
            items: [this.formularioGestion, this.tpEstruct],
            buttons: [
                this.btnCancelar,
                //this.btnAplicar,
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
            self.btnAceptar.disable();
            self.btnAplicar.disable();
            self.cbTipo.focus(true, 500);
        });

        this.ventanaGestion.on('hide', function ()
        {
            self.btnAdicionar.focus();
            var checkestructuras = self.tpEstruct.tree.getChecked();
            if (checkestructuras.length > 0) {
                var arrayidestructuras = new Array();
                for (i = 0; i < checkestructuras.length; i++) {
                    arrayidestructuras.push(checkestructuras[i].id);
                    self.tpEstruct.tree.getNodeById(checkestructuras[i].id).getUI().toggleCheck(false);
                }
            }
        });
        
        this.tpEstruct.tree.on('checkchange', function (n, ch)
        {
            if (ch == true && self.cbTipo.getValue()) {
                self.btnAceptar.enable();
                self.btnAplicar.enable();
            }
        });

        function guardarDatos(btnpress)
        {
            var checkestructuras = self.tpEstruct.tree.getChecked();
            if (checkestructuras.length > 0) {
                var arrayidestructuras = new Array();
                for (i = 0; i<checkestructuras.length; i++) {
                    arrayidestructuras.push(checkestructuras[i].id);
                    self.tpEstruct.tree.getNodeById(checkestructuras[i].id).getUI().toggleCheck(false);
                }
                if(self.formularioGestion.getForm().isValid()){
                    Ext.getBody().mask('Por favor espere... Guardando datos.');
                    Ext.Ajax.request({
                        url: (accion == 'add' ? '/pvd/maestro/configuraciones/index.php/confidoneidad/add' : '/pvd/maestro/configuraciones/index.php/confidoneidad/update'),
                        params: {
                            tipo: self.cbTipo.getValue(),
                            arrayidestructuras: Ext.encode(arrayidestructuras)
                        },
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                if(accion == 'mod')
                                {
                                    if (checkestructuras.length > 1) {
                                        mostrarMensaje(1, 'Las estructuras han sido modificadas satisfactoriamente.');
                                    } else {
                                        mostrarMensaje(1, 'La estructura ha sido modificada satisfactoriamente.');
                                    }
                                }else{
                                    /*if (checkestructuras.length > 1) {
                                        mostrarMensaje(1, 'Las configuraciones han sido adicionadas satisfactoriamente.');
                                    } else {*/
                                        mostrarMensaje(1, 'La configuraci&oacute;n ha sido adicionada satisfactoriamente.');
                                    //}
                                }
                                if (btnpress == 'ACP')
                                {
                                    self.ventanaGestion.hide();
                                }
                                self.formularioGestion.getForm().reset();
                                self.stConfig.removeAll();
                                self.stConfig.reload();
                            } else
                                if (checkestructuras.length > 1) {
                                    mostrarMensaje(6,'Alguna de las estructuras no pueden ser adicionadas debido a que ya existe.');
                                } else {
                                    mostrarMensaje(6, 'La estructura no puede ser adicionada debido a que ya existe.');
                                }
                        }
                    });
                }
            }  else {
                mostrarMensaje(6,'Debe seleccionar al menos una estructura.');
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
                mensaje = '¿Est&aacute; seguro que desea eliminar la estructura seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las estructuras seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/confidoneidad/delete',
                        params: {arrayids: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false)  {
                                if (s.length == 1) {
                                    mensaje = 'La estructura seleccionada no puede ser eliminada.';
                                } else {
                                    mensaje = 'Alguna de las estructuras seleccionadas no puede ser eliminada.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                self.btnAdicionar.focus();
                                if (s.length == 1) {
                                    mensaje = 'La estructura seleccionada ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las estructuras seleccionadas han sido eliminadas satisfactoriamente.';
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

        Pvd.Maestro.Configuraciones.ConfigIdoneidad.superclass.initComponent.call(this);
    }
});
