var cambio = 0;
Ext.ns("Pvd.Sst.Riesgo.Configuracion");
Pvd.Sst.Riesgo.Configuracion.MagnitudRiesgo= Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'magnitud',
    title: 'Magnitud de riesgo',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;
        var accion;
        var busc = 0;
        var rowIndex;

        /**********************Ventana para adicionar la configuracion*******************************/

        this.tfdenom = new Ext.form.TextField({
            fieldLabel: 'Denominación',
            allowBlank: false,
            maxLength: 100,
            enableKeyEvents: true,
            anchor: '99%',
            width: '98%',
            name: 'denominacion'
        });       

        var hfIdExpresionMatematica = new Ext.form.Hidden();
        var tfFormula = new Ext.form.TextField({
            readOnly: true,
            hideLabel: true,
            name: 'formula',
            anchor: '100%',
            allowBlank: false,
            emptyText: 'Fórmula matemática',
            listeners: {
                change: function (tf, n, o)
                {
                    cambio = 1;
                },
                show: function (cmp)
                {
                    cmp.setWidth('100%');
                }
            }
        });

        var btnBuscarFormula = new Ext.Button({
            text: 'Buscar',
            iconCls: 'buscar',
            tooltip:'Buscar f&oacute;rmula matem&aacute;tica',
            style: 'margin: 8 0 0 0',
            handler: function ()
            {
                var arrIndicadores = new Array();
                arrIndicadores = [
                    [1,'Exposición'],[2,'Consecuencia'], [3,'Probabilidad'], [4, 'Grado de peligrosidad']
                ];

                var objExp = new Ext.pvd.persona.formula.winEditorExpresionesEvalSel({
                    hideFieldDenom: false,
                    indicadores: arrIndicadores,
                    width:1300,
                    mostrarCondicionales: true,
                    idexpresionmatematica: hfIdExpresionMatematica.getValue() || -1
                });

                objExp.show();
                objExp.on('expresionsalvada', function (data)
                {
                    hfIdExpresionMatematica.setValue(data.idexpresionmatematica);
                    tfFormula.setValue(data.denom);
                    objExp.close();
                });

            }
        });

       
        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            id:'confform',
            frame: true,
            layout: 'fit',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    },
                    {
                        columnWidth: 1,
                        style: 'margin:20 0 0 5',
                        layout: 'form',
                        html:'<b>Insertar una fórmula matemática a la configuración.</b>'
                    },
                    {
                        columnWidth:.80,
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        items: [tfFormula]
                    },{
                        columnWidth:.20,
                        style: 'margin:-5 0 0 5',
                        layout: 'form',
                        items: [btnBuscarFormula]
                    }
                ]
            }]
        });

        this.btnCancelar = new Ext.Button({
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
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarc';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = self.cbTipopension;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarc',
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
            width: 450,
            height: 220,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            keys: [{
                key: 'x',
                alt: true,
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
                    fn: function () {
                        if (!self.btnAplicar.disabled) {
                            self.btnAplicar.handler();
                        }
                    }
                },
                {
                    key: 13,
                    fn: function () {
                        if (!self.btnAceptar.disabled) {
                            self.btnAceptar.handler();
                        }
                    }
                }]
        });

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            text: this.idioma.BtnAyuda,
            iconCls:'ayuda',
            disabled: false
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.textToolTipAdicionar,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.btnAplicar.show();
                self.ventanaGestion.setTitle('Adicionar configuración');
                accion = 'add';
                self.ventanaGestion.show();
                self.formularioGestion.getForm().reset();
                hfIdExpresionMatematica.reset();
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: this.idioma.BtnModificar,
            disabled: true,
            tooltip: this.idioma.textToolTipModificar,
            iconCls: 'modificar',
            handler: function ()
            {
                var recordModelo = self.gpConfMagnitud.getSelectionModel().getSelected();
				self.ventanaGestion.setTitle('Modificar configuración');
                self.btnAplicar.hide();
                self.ventanaGestion.show();
                self.tfdenom.setValue(recordModelo.get('denominacion'));
                hfIdExpresionMatematica.setValue(recordModelo.get('idexpresionmatematica'));
                tfFormula.setValue(recordModelo.get('denomformula'));
                accion = 'mod';
                
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.textToolTipEliminar,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminar();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarR,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stClasi.load({params:{denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
                busc = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            text: this.idioma.BtnLimpiar,
            tooltip:this.idioma.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscar.reset();
                self.stClasi.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            enableKeyEvents: true,
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 140,
            name : 'tfbuscador'
        });

        //Fuente de datos del listado.
        this.stConfMagnitud = new Ext.data.Store({
            url: '/pvd/sst/riesgo/index.php/gestionarmagnitud/getMagnitud',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idmagnitudriesgo", totalProperty: "cantidad"},
                [{name:'idmagnitudriesgo'}, {name:'denominacion'}, {name:'idexpresionmatematica'}, {name:'denomformula'}, {name: 'orden'}]
            ),
            listeners: {
                load: function (st) {
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    self.btnGuardarOrden.disable();
                    self.btnArribaOrden.disable();
                    self.btnAbajoOrden.disable();
                    if (busc == 1 && st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount()==0) {
                        mostrarMensaje(1,self.idioma.lbNoDatos);
                    }
                }
            }
        });

        this.stConfMagnitud.load({params: {start:0, limit: 15}});

        //Listado de necesidades de capacitacion.
        this.gpConfMagnitud= new Ext.grid.GridPanel({
            store: this.stConfMagnitud,
            region:'center',
            width: 400,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function (sm, row, rec)
                    {
                        self.btnModificar.enable();
                        self.btnEliminar.enable();
                        self.btnArribaOrden.enable();
                        self.btnAbajoOrden.enable();
                        rowIndex = self.stConfMagnitud.indexOf(sm.getSelected());
                        if (rowIndex == 0) {
                            self.btnArribaOrden.disable();
                        }
                        if (rowIndex + 1 == self.stConfMagnitud.getRange().length) {
                            self.btnAbajoOrden.disable();
                        }
                    }
                }
            }),
            loadMask: {
                msg: 'Cargando...'
            },
            columns: [
                {
                    header: 'Denominación',
                    width: 200,
                    dataIndex: 'denominacion'
                },
                {
                    header: 'Fórmula matemática',
                    width:150,
                    dataIndex: 'denomformula'
                },
                {
                    header: 'Orden',
                    width: 100,
                    dataIndex: 'orden'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stConfMagnitud,
                displayInfo: true
            })
        });

        this.btnArribaOrden = new Ext.Button({
            tooltip: 'Ordenar hacia arriba',
            iconCls: 'arriba',
            disabled: true
        });

        this.btnAbajoOrden = new Ext.Button({
            tooltip: 'Ordenar hacia abajo',
            iconCls: 'abajo',
            disabled: true
        });

        this.btnGuardarOrden = new Ext.Button({
            text: 'Guardar',
            tooltip: 'Guardar orden',
            iconCls: 'guardar',
            disabled: true
        });

        this.btnArribaOrden.on('click', function () {
            moverArribaAbajo('Arriba');
        });

        this.btnAbajoOrden.on('click', function () {
            moverArribaAbajo('Abajo');
        });

        this.btnGuardarOrden.on('click', function () {
            guardarOrden();
        });

        // panel para add, mod, del, ayuda
        this.panelNorte = new Ext.Panel({
            layout: 'fit',
            region: 'north',
            border: false,
            tbar:[
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar, '-',
                this.btnArribaOrden,
                this.btnAbajoOrden,
                this.btnGuardarOrden,
                '->', '', '-',this.btnAyuda]
        });

        this.panelCentral = new Ext.Panel({
            layout: 'border',
            region: 'center',
            width:400,
            border: false,
            items:[ this.panelNorte,this.gpConfMagnitud]
        });


        this.panelNorte.on('render', function ()
        {
            self.btnAdicionar.focus();
        });

        this.ventanaGestion.on('hide', function ()
        {
            self.btnAdicionar.focus();
        });

        function moverArribaAbajo(dirmov)
        {
            var recordSeleccionado = self.gpConfMagnitud.getSelectionModel().getSelected();
            var ordenSelec = recordSeleccionado.get('orden');
            var recordAux = recordSeleccionado;
            if (dirmov == 'Arriba') {
                var recordAnterior = self.stConfMagnitud.getAt(rowIndex - 1);
                self.stConfMagnitud.remove(recordSeleccionado);
                self.stConfMagnitud.insert(rowIndex - 1, recordAux);
                recordSeleccionado.set('orden', recordAnterior.get('orden'));
                recordAnterior.set('orden', ordenSelec);
                self.gpConfMagnitud.getSelectionModel().selectPrevious();
            } else {
                var recordSiguiente = self.stConfMagnitud.getAt(rowIndex + 1);
                self.stConfMagnitud.remove(recordSeleccionado);
                self.stConfMagnitud.insert(rowIndex + 1, recordAux);
                recordSeleccionado.set('orden', recordSiguiente.get('orden'));
                recordSiguiente.set('orden', ordenSelec);
                self.gpConfMagnitud.getSelectionModel().selectNext();
            }
            self.stConfMagnitud.commitChanges();
            self.btnGuardarOrden.enable();
        }

        function guardarOrden() {
            var datast = self.stConfMagnitud.getRange();
            var magnitudes = new Array();
            for (i = 0; i < datast.length; i++) {
                magnitudes.push(datast[i].data);
            }
            Ext.Ajax.request({
                url: '/pvd/sst/riesgo/index.php/gestionarmagnitud/actualizarOrden',
                params: {magnitudes: Ext.encode(magnitudes)},
                callback: function () {
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData == true) {
                        mostrarMensaje(1, 'El orden fue cambiado satisfactoriamente');
                    }
                    self.btnGuardarOrden.disable();
                }
            });
        }

        function guardarDatos(btnpress)
        {
            var recordModelo = self.gpConfMagnitud.getSelectionModel().getSelected();
            if(self.formularioGestion.getForm().isValid()){
                Ext.Ajax.request({
                    url: (accion == 'add' ? '/pvd/sst/riesgo/index.php/gestionarmagnitud/addMagnitud' : '/pvd/sst/riesgo/index.php/gestionarmagnitud/modMagnitud'),
                    params: {
                        denominacion: self.tfdenom.getValue(),
                        idexpresionmatematica: hfIdExpresionMatematica.getValue(),
                        idmagnitudriesgo:accion == 'add' ? '':recordModelo.get('idmagnitudriesgo')
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);

                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgModCSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.msgAddCSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            hfIdExpresionMatematica.reset();
                            self.stConfMagnitud.removeAll();
                            self.stConfMagnitud.reload();
                            self.btnModificar.disable();
                            self.btnEliminar.disable();
                        } else {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1,'La configuración fue modificada satisfactoriamente.');
                            }else{
                                mostrarMensaje(1, 'La configuración fue adicionada satisfactoriamente.');
                            }

                        }
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = self.gpConfMagnitud.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idmagnitudriesgo);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la configuración seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las configuración seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/sst/riesgo/index.php/gestionarmagnitud/delMagnitud',
                        params: {magnitudes: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La configuración seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Algunas de las configuraciones seleccionadas no pueden ser eliminadas debido a que se encuentran en' +
                                        ' uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La configuración ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las configuraciones seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stConfMagnitud.removeAll();
                            self.stConfMagnitud.reload();
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
            },
            {
                key: 'b',
                alt: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ];


        this.items = [this.panelCentral];

        Pvd.Sst.Riesgo.Configuracion.MagnitudRiesgo.superclass.initComponent.call(this);
    }
});
