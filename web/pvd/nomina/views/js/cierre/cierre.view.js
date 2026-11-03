Ext.ns('Pvd.Nomina.Cierre');
 Ext.QuickTips.init();
 

Pvd.Nomina.Cierre.Vista = {
    init: function(perfil, idioma, modelo){
		var self = this;
        var _this = this;
                //Panel de estructura y composición que cargo hasta el nivel de entidades.
                this.pEstructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
                    layout: 'border',
                    nivel: 5
                });

                //Botón  para cargar las personas pertenecientes a la unidad selecionada.
                this.btnAceptarEstructura = new Ext.Button({
                    id: 'btnAceptarEstructura',
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
                    disabled: true,
                    //icon: perfil.dirImg+'aceptar.png',
                    iconCls: 'aceptar'
                });

                //Vista para el componente Buscar estructura 
                this.winEstructura = new Ext.Window({
                    title: 'Entidades',
                    modal: true,
                    height: 350,
                    width: '30%',
                    closable: false,
                    constrain: true,
                    resizable: false,
                    layout: 'fit',
                    items: [this.pEstructura],
                    buttons: [this.btnAceptarEstructura],
                    keys: [
                        {
                            key: Ext.EventObject.ENTER,
                            stopEvent: true,
                            fn: function () {
                                self.btnAceptarEstructura.handler();
                            }
                        }
                    ]
                });


       this.ActivarColores = function (val, metaData, record, rowIndex, colIndex, store) {
                    if (record.get('estado') == "Abierto" && val != null) {
                        return '<span style="color:#0000ff;">' + val + '</span>';
                    } else if (record.get('estado') == "Cerrado" && val != null) {
                        return '<span style="color:green;">' + val + '</span>';
                    } else {
                        return '<span style="color:red;">' + val + '</span>';
                    }
                    return val;
                }

        this.ColorDiferencia = function (val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('diferencia') == 0 && val != null) {
                return '<span style="color:green;">' + val + '</span>';
            } else {
                return '<span style="color:red;">' + val + '</span>';
            }
            return val;
        }

        //cambia el formato del numero  saldo
        this.formatoMonedaImporte = function (v){
            v=(Math.round((v-0)*100))/100;
            v=(v==Math.floor(v))?v+".00":((v*10==Math.floor(v*10))?v+"0":v);
            v=String(v);
            var ps=v.split(".");
            var whole=ps[0];
            var sub=ps[1]?"."+ps[1]:".00";
            var r=/(\d+)(\d{3})/;
            while(r.test(whole))
                whole=whole.replace(r,"$1"+","+"$2")
            v=whole+sub;
            if(v.charAt(0)=="-")//caso saldo negativo
                return v.substr(1);
            return v;
        }
   //////////////////////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////
             //Grid del listado de los periodos de pago
                this.gpPago = new Ext.grid.GridPanel({
                    id: 'gpPago',
                    title: 'Listado de pagos',
                    region: 'center',
                    layout: 'fit',
                    border: true,
                    columns: [
                        {header: 'identidad', dataIndex: 'identidad', width: 20, hidden: true},
                        {header: 'A&ntilde;o', dataIndex: 'anyo', width: 20, hidden: true},
                        {header: '', dataIndex: 'idestado', width: 10, hidden: true},
                        {header: 'fechainicioperiodo', dataIndex: 'inicio', width: 100, hidden: true},
                        {header: 'fechafinperiodo', dataIndex: 'fin', width: 100, hidden: true},
                        {header: 'Períodos de Pagos', dataIndex: 'periodopago', width: 205, renderer: this.ActivarColores},
                        {header: 'Estado', dataIndex: 'estado', width: 220, renderer: this.ActivarColores},
                    ],
                    closable: true,
                    stripeRows: true,
                    autoScroll: true,
                    sm: new Ext.grid.RowSelectionModel({
                        singleSelect : true
                    }),
                    viewConfig: {forceFit: true},
                    view: new Ext.grid.GroupingView({
                        groupTextTpl: '{text}'
                    }),
                    store: modelo.stPeriodoPago,
                    loadMask: {msg: 'Cargando'}
                });
        
                this.btnAceptarResumenPeriodos = new Ext.Button({
                    id: 'btnAceptarResumenPeriodos',
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana',
                    disabled: true,
                });

                this.btnCancelarResumenPeriodos = new Ext.Button({
                    id: 'btnCancelarResumenPeriodos',
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos'
                });

                this.ventanaResumenPeriodos = new Ext.Window({
                    region: 'center',
                    layout: 'fit',
                    title: 'Resumen de los per&iacute;odos de pago',
                    modal: true,
                    resizable: true,
                    draggable: true,
                    height: 500,
                    width: 450,
                    
                    // height: Ext.lib.Dom.getViewHeight() * 0.5, coge la mitad de la altura almacenada en el dom de de la vista 
                    // width: Ext.lib.Dom.getViewWidth() * 0.5,
                    // autoWidth: true,
                    // autoHeight: true,
                    closeAction: 'hide',
                    closable: true,
                    items: [this.gpPago],
                    //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
                    bbar: ['->', this.btnCancelarResumenPeriodos, this.btnAceptarResumenPeriodos]
                });
        ////////////////////////////////////////////////////////////////////////////////////////////////

                this.btnAyuda = new Ext.Button({
                    id: 'btnAyuda',
                    text: 'Ayuda',
                    tooltip: 'Ayuda de la funcionalidad',
                    //  icon: perfil.dirImg+'ayuda.png',
                    iconCls: 'ayuda',

                });
                
        //////////////////////////////////////////////////////////////////
        
             // label para mostrar nombre de la empresa y la fecha con el periodo actual
                this.lfempresa = new Ext.form.Label({
                    id: 'lfempresa',
                    text: '--- ',
                    style: 'font-weight:bold;'
                });
                
                this.lffecha = new Ext.form.Label({
                    id: 'lffecha',
                    text: '--- ',
                    style: 'font-weight:bold'
                });
               
                
            //botones del cierre
            this.btnCierrediario = new Ext.Button({
                id:'btnCierrediario',
                text:'Cierre diario',
                tooltip:'Cierre diario',
                disabled : true,
                iconCls:'cierre'
            }); 

            this.btnCierreperiodo = new Ext.Button({
                id:'btnCierreperiodo',
                text:'Cierre período',
                tooltip:'Cierre período',
                disabled: true,
                iconCls:'cerrarperiodo'
            }); 

              this.btnCierreejercicio = new Ext.Button({
                id:'btnCierreejercicio',
                text:'Cierre ejercicio',
                tooltip:'Cierre ejercicio',
                disabled:true,
                iconCls:'cierreejercicio'
            });

            this.btncambioperiodo = new Ext.Button({
                id:'btncambioperiodo',
                text:'Cambio de período',
                tooltip:'Cambio de período',
                disabled:false,
                iconCls:'periodo'
            });

            this.btnexportar= new Ext.Button({
                id:'btnexportar',
                text:'Exportar',
                tooltip:'Exportar la Información',
                disabled:true,
                iconCls:'exportar'
            });
       

            this.btnestructura= new Ext.Button({
                id: 'btnestructura',
                text: 'Seleccionar Estructura ',
                tooltip: '',
                // icon: perfil.dirImg+'adicionar.png',
                iconCls: 'estructura',
            });
        /////////////////////////////////////////////////////////

        this.expanderC= new Ext.grid.RowNumberer({});
        // tabla
        this.gpGridCierre = new Ext.grid.GridPanel({
            id: 'gpGridCierre',
            region: 'center',
            layout: 'fit',
            border: true,
            width: '100%',
            height: Ext.lib.Dom.getViewHeight() * 0.5,
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            store:modelo.stCuentasNomina,// ojo siempre q se vaya a usar el store se llama asi
            autoScroll: true,
            columns: [
                // columnas
                this.expanderC,
                {  header: '',
                    align: 'right',
                    dataIndex: 'idperiodo',
                    width: 0,
                    hidden: true,
                    sortable: true,
                },
                {  header: '',
                align: 'right',
                dataIndex: 'identidad',
                width: 0,
                hidden: true,
                sortable: true,
                 },
                {
                    header: 'Cuenta ',
                    region: 'right',
                    dataIndex: 'cuentas',
                    width: 50,
                    hideable: false,
                    sortable: true

                },{
                    header: 'Tipo de Pago',
                    region: 'right',
                    dataIndex: 'denominacion',
                    width: 250,
                    hideable: false,
                    sortable: true

                },{
                    header: 'Estado',
                    region: 'right',
                    dataIndex: 'estado',
                    width: 70,
                    hideable: false,
                    sortable: true
                },
                {
                    header: 'Importe Contabilidad',
                    align: 'right',
                    dataIndex: 'contab',
                    width: 130,
                    hideable: false,
                    sortable: true,
                    renderer: function(value, metaData, record) {
                        var formattedValue = self.formatoMonedaImporte(record.get('contab')); // Aplicas la función de formato de moneda
                        if (record.get('diferencia') == 0 && value != null) {
                            return '<span style="color:green;">' + formattedValue + '</span>'; // Aplicas el color verde si la diferencia es cero
                        } else {
                            return '<span style="color:red;">' + formattedValue + '</span>'; // Aplicas el color rojo si la diferencia no es cero
                        }

                    }
                },{
                    header: 'Importe Nómina',
                    align: 'right',
                    dataIndex: 'nomina',
                    width: 125,
                    hideable: false,
                    sortable: true,
                    renderer:function(value, metaData, record) {
                        var formattedValue = self.formatoMonedaImporte(record.get('nomina')); // Aplicas la función de formato de moneda
                        if (record.get('diferencia') == 0 && value != null) {
                            return '<span style="color:green;">' + formattedValue + '</span>'; // Aplicas el color verde si la diferencia es cero
                        } else {
                            return '<span style="color:red;">' + formattedValue + '</span>'; // Aplicas el color rojo si la diferencia no es cero
                        }

                    }
                 },{
                    header: 'Diferencia Importe',
                    align: 'right',
                    dataIndex: 'diferencia',
                    width: 130,
                    hideable: false,
                    sortable: true,
                    renderer: this.ColorDiferencia,
                 }
            
            ],
            viewConfig: {forceFit: true},
            // se le agregan los botones a la tabla pues estos forman parte de la misma
            tbar:[this.btnestructura,this.btncambioperiodo,'->',this.btnCierrediario, this.btnCierreperiodo, this.btnCierreejercicio,this.btnexportar],
            loadMask: {msg: 'Cargando'}
        });
        ////////////////////////////////
     

        this.expanderSinCentro = new Ext.grid.RowNumberer({});

        this.gridSinCentro = new Ext.grid.GridPanel({
            id: 'idgridSinCentro',
            region: 'center',
            layout: 'fit',
            border: true,
            width: '100%',
            height: Ext.lib.Dom.getViewHeight() * 0.5,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect : true
            }),
            autoScroll: true,
            store: modelo.stPersonal,
            columns: [ this.expanderSinCentro,
                {header: '', dataIndex: 'orden', width: 0.5 , hidden:true,sortable: true},
                {header: '', dataIndex: 'denomorden', width: 0.5 ,hidden:true,sortable: true},
                {header: '', dataIndex: 'nombre', width: '100%',sortable: true,hideable: false},
              
            ],          
          
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                  groupTextTpl: '{text}'}),
            loadMask: {msg: 'Cargando'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stPersonal,
                displayInfo: true
            }),
            
        });

        // this.tabGeneral = new Ext.TabPanel({
        //     activeTab: 0,
        //     region: 'south',
        //     height: 300,
        //     width : '100%',
        //     defaults: {autoScroll: true},
        //     split: true,
        //     items :[this.tabgridSinCentro/*,this.tabgridConCentro, this.tabgridsinConfigElemSalariales,this.tabgridSinPlantNominal,this.tabgrid2centroCosto,this.tabgridServicio*/]
        // });
        this.panelSecundario = new Ext.Panel({
            region: 'south',
            layout: 'fit',
            width: '100%',
            title : 'Información',
            height: 380,
            items: [ this.gridSinCentro]
        });

        // panel general que contendra todo lo que se muestre
        this.panelPrincipal = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            width: '100%',
            height: '80%',
           // title : 'Principal',
            tbar:[this.lfempresa,'->',this.lffecha],
            items: [
                this.gpGridCierre
            ]
        });


        this.principal= new Ext.Viewport({
			layout: 'border',
			items: [this.panelPrincipal,this.panelSecundario]
		});
       
         
 
    } 
}
