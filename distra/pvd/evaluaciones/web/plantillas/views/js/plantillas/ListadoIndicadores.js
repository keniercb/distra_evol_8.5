Ext.ns("Ext.Component.Seleccion");
Ext.Component.Seleccion.ListadoIndicadores = Ext.extend(Ext.grid.GridPanel,{
    autoscroll: true,
    //autoExpandColumn:'denominacion',
    title:'Listado de indicadores',

    initComponent: function() {
        var self = this;
        this.tfFiltro = new Ext.form.TextField({
            maxLength: 255,
            emptyText: 'Criterio a buscar...',
            listeners:{
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        self.btnBuscar.handler();
                    }
                }
            }
        });
        this.btnBuscar = new Ext.Button({
            text: this.labels.btnBuscar,
            tooltip: this.labels.ttpBtnBuscarIndicador,
            iconCls:'buscar',
            handler : function() {
                this.store.load({
                    params:{
                        start: 0,
                        limit: 10
                    }
                });
            }.createDelegate(this)
        });
        this.btnLimpiar = new Ext.Button({
            text: this.labels.lbBtnLimpiar,
            tooltip: this.labels.ttpBtnLimpiar,
            iconCls:'limpiar',
            handler : function() {
                this.tfFiltro.reset();
                this.tfFiltro.focus(false, 100);
            }.createDelegate(this)
        });

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        var expanderIndicador = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style ="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;<b>Descripci&oacute;n:</b>&nbsp;{descripcion}</p></div>'
                ),
            enableCaching: 'true'
        });
        this.plugins = expanderIndicador;

        this.store = new Ext.data.Store({
            url: 'cargartodosindicadores',
            baseParams: {
                tipoI: this.tipo
            },
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id:'idindicador'
            },  [{
                name: 'idindicador'
            }
            ,{
                name: 'denom'
            }
            ,{
                name: 'tipo'
            }
            ,{
                name: 'descripcion'
            }
            ]),
            listeners:{
                load: function(st, records, options){
                    self.tfFiltro.focus(false,100);
                    if(st.getTotalCount() == 0){
                        if(self.tfFiltro.getValue() == ''){
                            Ext.MessageBox.show({
                                title: self.labels.lbInfo,
                                msg: self.labels.MsgBusqNoDatos,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function(){
                                    self.tfFiltro.focus(false);
                                }
                            });
                        }else{
                            Ext.MessageBox.show({
                                title: self.labels.lbInfo,
                                msg: self.labels.MsgBusqVacia,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function(){
                                    self.tfFiltro.focus(false);
                                }
                            });
                        }
                    }
                },
                beforeload: function(st, options){
                    st.baseParams.filtro = self.tfFiltro.getValue();
                }
            }
        });

        this.bbar = new Ext.PagingToolbar({
            pageSize: 15,
            store: this.store,
            displayInfo: true
        });

        this.columns = [expanderIndicador,{
            header: this.labels.lbIndicador,
            width:450,
            sortable: true,
            dataIndex: 'denom'
        }];
        this.viewConfig = {
            forceFit: true
        };
        this.loadMask = {
            msg:  this.labels.Cargando
        };
        this.tbar = ['Denominaci&oacute;n: ',this.tfFiltro,this.btnBuscar,this.btnLimpiar];
        Ext.Component.Seleccion.ListadoIndicadores.superclass.initComponent.call(this);
    }
});

Ext.Component.Seleccion.WinListadoIndicadores = Ext.extend(Ext.Window,{
    modal:true,
    layout:'border',
    title:'Adicionar indicadores',
    height:450,
    width: 500,
    initComponent: function() {
        var self = this;
        this.btnCancelar = new Ext.Button({
            iconCls : 'cancelar',
            text: this.labels.btnCancelar,
            tooltip: this.labels.lbToolTipCerrar,
            handler : function() {
                this.close();
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            disabled: true,
            iconCls : 'aplicar',
            text: this.labels.btnAplicar,
            tooltip: this.labels.lbToolTipAplicar,
            handler: function(){
                save('aplic');
            }
        });

        this.btnAceptar = new Ext.Button({
            disabled: true,
            iconCls : 'aceptar',
            text: this.labels.btnAceptar,
            tooltip: this.labels.lbToolTipAceptar,
            handler: function(){
                save('acept');
            }
        });

        this.grid = new Ext.Component.Seleccion.ListadoIndicadores({
            labels: this.labels,
            region:'center',
            margins:'5 5 5 5',
            tipo: this.tipo
        });
        this.grid.getSelectionModel().on('selectionchange', function(sm){
            if(sm.hasSelection()){
                this.btnAplicar.enable();
                this.btnAceptar.enable();
            }else{
                this.btnAplicar.disable();
                this.btnAceptar.disable();
            }
        }.createDelegate(this));

        this.items = [this.grid];
        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
        this.keys = [{
            key: 'b',
            alt:true,
            fn: this.grid.btnBuscar.handler
        },{
            key: 'l',
            alt:true,
            fn: this.grid.btnLimpiar.handler
        }];
        Ext.Component.Seleccion.WinListadoIndicadores.superclass.initComponent.call(this);
        this.on('show', function(cmp){
            self.grid.store.load({
                params:{
                    limit:10,
                    start:0
                }
            });
        });

        function save(button){
            if(self.grid.getSelectionModel().hasSelection()){
                PVD.mostrarMascara('msksavedata'+self.id,'',self.labels.msgAddingIndicador);
                var idindicador = self.grid.getSelectionModel().getSelected().get('idindicador');
                var abreviatura = self.idplanilla + '_' + idindicador;
                var idplanilla = self.idplanilla;
                var calculado;
                var tipo;
                if(self.tipo == 'Ag'){
                    calculado = false;
                    tipo = true;
                }
                else if(self.tipo == 'Text'){
                    calculado = true;
                    tipo = true;
                }
                else{
                    calculado = true;
                    tipo = false;
                }

                Ext.Ajax.request({
                    url: 'addindicadorplanilla',
                    method:'POST',
                    params:{
                        idindicador:idindicador,
                        tipo:tipo,
                        abreviatura:abreviatura,
                        idpadre: self.idpadre,
                        calculado:calculado,
                        idplanilla:idplanilla,
                        tipoI:self.tipo
                    },
                    callback: function (options,success,response){
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('msksavedata'+self.id);
                        if(responseData.codMsg == 3){
                            Ext.MessageBox.show({
                                title: self.labels.lbInfo,
                                msg: responseData.mensaje,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR,
                                fn: function(){
                                    self.btnAceptar.focus(false);
                                }
                            });
                        }else{
                            Ext.MessageBox.show({
                                title: self.labels.lbInfo,
                                msg: self.labels.msgAddIndicador,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function(){
                                    if(button == 'aplic'){
                                        self.btnAceptar.focus(false);
                                    }else{
                                        self.fireEvent('dataSaved');
                                        self.close();
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    }
});
