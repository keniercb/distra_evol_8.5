Ext.ns('Pvd.Nomina.Pago.Retencion');

Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,

    // private
    isValidParent : function(c, target){
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout : function(ct, target){
        var rs = ct.items.items, len = rs.length, r, i;

        if(!this.innerCt){
            target.addClass('ux-row-layout-ct');
            this.innerCt = target.createChild({cls:'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if(size.width < 1 && size.height < 1){ // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height:h});
        
        // some rows can be percentages while others are fixed
        // so we need to make 2 passes
        
        for(i = 0; i < len; i++){
            r = rs[i];
            if(!r.rowHeight){
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for(i = 0; i < len; i++){
            r = rs[i];
            if(r.rowHeight){
                r.setSize({height: Math.floor(r.rowHeight*ph) - r.getEl().getMargins('tb')});
            }
        }
    }
    
    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;

Ext.QuickTips.init();

//Vista del componente Gestionar retenciones.
Pvd.Nomina.Pago.Retencion.Vista = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar retenciones(Tipo: Pvd.Nomina.Pago.Retencion.Modelo).
     */
    init: function(perfil, idioma, modelo) {

        //Componenete para seleccionar la entidad de la cual obtener las personas.
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region:'center',
            nivel: 5,
            nivelchequear: 3
        });

        //Ventana para seleccionar la entidad.
        this.btnAceptarEntidad = new Ext.Button({
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAceptar,
            disabled: true,
            iconCls: 'aceptar'
        });
            
        this.winEstructura = new Ext.Window({
            title: idioma.lbTitleWinEstructura,
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable:false,
            resizable:false, 
            layout: 'fit',
            items:[this.pobjestructura],
            buttons: [this.btnAceptarEntidad] 
        });

        //Listado de personas registradas en la entidad.
        this.smPersona = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

        this.gpPersona = new Ext.grid.GridPanel({
            title:idioma.lbTitleGridPersona,
            region:'center',
            columns: [{header: 'idpersona',  hidden: true, hideable: false, dataIndex: 'idpersona'}
                    ,{header: idioma.lbColNoIdentidad, fixed : true, sortable: true, dataIndex: 'numid'}            
                    ,{header: idioma.lbColNombre, width: 100, sortable: true, dataIndex: 'nombre'} 
                    ,{header: idioma.lbColSNombre, width: 100, sortable: true, dataIndex: 'snombre'}
                    ,{header: idioma.lbColPApellido, width: 100, sortable: true, dataIndex: 'papel'}  
                    ,{header: idioma.lbColSApellido, width: 100, sortable: true, dataIndex: 'sapel'}  
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            //plugins: this.expanderConcepto, 
            viewConfig: {forceFit: true},
            store: modelo.storePersona,
            sm: this.smPersona,
            loadMask:{msg : idioma.lbMaskGridCargando},
            bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: modelo.storePersona,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            }),
        });

        //Botones de Add, Mod, Elim retenciones.
        this.btnAdicionarRetenc = new Ext.Button({
            id: 'idbtnAdicionarRetenc',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddRetenc,
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarRetenc',
            nextTab: 'idbtnModificarRetenc',
        });

        this.btnModificarRetenc = new Ext.Button({
            id: 'idbtnModificarRetenc',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModRetenc,
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarRetenc',
            nextTab: 'idbtnEliminarRetenc',
        });

        this.btnEliminarRetenc = new Ext.Button({
            id: 'idbtnEliminarRetenc',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimRetenc,
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarRetenc',
            nextTab: 'idbtnAdicionarRetenc',
        });

         //Listado de retenciones.
        function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }

        this.smRetenc = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

        this.gpRetenc = new Ext.grid.GridPanel({
            id:'idgpRetenc',
            title:idioma.lbTitleGridRetenc,
            region:'center',
            columns: [{header: 'idpersonaretencion',  hidden: true, hideable: false, dataIndex: 'idpersonaretencion'}
                    ,{header: '<center>'+idioma.lbColTipoRetenc+'</center>', sortable: true, dataIndex: 'tiporetencion', renderer:centrarValor}            
                    ,{header: '<center>'+idioma.lbColSaldoInicial+'</center>', fixed : true, width: 80, sortable: true, dataIndex: 'saldoinicial', renderer:centrarValor} 
                    ,{header: '<center>'+idioma.lbColMensualidad+'</center>', fixed : true, width: 80, sortable: true, dataIndex: 'mensualidad', renderer:centrarValor}
                    ,{header: '<center>'+idioma.lbColUltMensualidad+'</center>', fixed : true, width: 85, sortable: true, dataIndex: 'ultmensualidad', renderer:centrarValor}   
                    ,{header: '<center>'+idioma.lbColReferencia+'</center>', fixed : true, width: 90, sortable: true, dataIndex: 'refdocumentoacredita', renderer:centrarValor}  
                    ,{header: '<center>'+idioma.lbColFechaDocumento+'</center>', fixed : true, width: 85, sortable: true, dataIndex: 'fechadocumento', renderer:centrarValor}                 
                    ,{header: '<center>'+idioma.lbColDesde+'</center>', fixed : true, width: 85, sortable: true, dataIndex: 'fechainicio', renderer:centrarValor}
                    ,{header: '<center>'+idioma.lbColHasta+'</center>', fixed : true, width: 85, sortable: true, dataIndex: 'fechafin', renderer:centrarValor}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            //plugins: this.expanderConcepto, 
            viewConfig: {forceFit: true},
            store: modelo.storeRetenc,
            sm: this.smRetenc,
            loadMask:{msg : idioma.lbMaskGridCargando},
            bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: modelo.storeRetenc,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            }),
        });
        
        //Listado de histórico de retenciones.
        function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }

        this.smHistRetenc = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

        this.gpHistRetenc = new Ext.grid.GridPanel({
            id:'idgpHistRetenc',
            title:idioma.lbTitleGridHistRetenc,
            region:'center',
            columns: [{header: 'idhistretencion',  hidden: true, hideable: false, dataIndex: 'idhistretencion'}
                    ,{header: '<center>'+idioma.lbColRefComprobA+'</center>', fixed : true, width: 75, sortable: true, dataIndex: 'referenciacomprobante', renderer:centrarValor}            
                    ,{header: '<center>'+idioma.lbColNomina+'</center>',width: 75, sortable: true, dataIndex: 'saldoinicial', renderer:centrarValor} 
                    ,{header: '<center>'+idioma.lbColFechaOperac+'</center>', fixed : true, width: 75, sortable: true, dataIndex: 'mensualidad', renderer:centrarValor}
                    ,{header: '<center>'+idioma.lbColRetenido+'</center>', fixed : true, width: 75, sortable: true, dataIndex: 'ultmensualidad', renderer:centrarValor}   
                    ,{header: '<center>'+idioma.lbColRefComprobP+'</center>', fixed : true, width: 80, sortable: true, dataIndex: 'referencia', renderer:centrarValor}  
                    ,{header: '<center>'+idioma.lbColFechaComprobP+'</center>', fixed : true, width: 80, sortable: true, dataIndex: 'fechadocumento', renderer:centrarValor}                 
                    ,{header: '<center>'+idioma.lbColSaldoAdeudo+'</center>', fixed : true, width: 85, sortable: true, dataIndex: 'fechainicio', renderer:centrarValor}
                    ,{header: '<center>'+idioma.lbColRetencPendiente+'</center>', fixed : true, width: 85, sortable: true, dataIndex: 'fechafin', renderer:centrarValor}
                    ,{header: '<center>'+idioma.lbColSaldoPendiente+'</center>', fixed : true, width: 85, sortable: true, dataIndex: 'fechafin', renderer:centrarValor}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%',
            //plugins: this.expanderConcepto, 
            viewConfig: {forceFit: true},
            store: modelo.storeRetencHist,
            sm: this.smHistRetenc,
            loadMask:{msg : idioma.lbMaskGridCargando},
            bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: modelo.storeRetencHist,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            }),
        });

        //Ventana para gestionar las retenciones de las personas por entidades.
        this.winGestRetenciones = new Ext.Window({
            title: idioma.lbTitleWinGestRetenciones,
            modal: true,
            height: '100%',
            constrain: true,
            width: '100%',
            closeAction: 'hide',
            maximized: true,
            closable:true,
            resizable:false, 
            layout: 'border',
            items:[this.gpPersona, {
                    region: 'east',
                    height: '100%',
                    width: '60%',
                    layout:'ux.row', 
                    items:[{
                        rowHeight: .5,
                        width: '100%',  
                        border:false,
                        layout:'fit',
                        tbar:[this.btnAdicionarRetenc, this.btnModificarRetenc, this.btnEliminarRetenc],
                        items:[this.gpRetenc] 
                    },{
                        rowHeight: .5,
                        width: '100%',  
                        border:false,
                        layout:'fit',
                        items:[this.gpHistRetenc] 
                    }]
                }]
        }); 
        
        //Campos de gestionar retenciones.
        this.cbTipoRetenc = new Ext.form.ComboBox({
                id:'idcbTipoRetenc', fieldLabel:idioma.lbColTipoRetenc, 
                valueField: 'idtiporetencion', prevTab: 'idbtnAceptarRetenc', 
                nextTab: 'idtfSaldoInicial', 
                displayField: 'denominacion', hiddenName: 'idtiporetencion',
                allowBlank: false, mode: 'local', 
                store: modelo.storeTipoRetencion, emptyText: 'Seleccione...',
                blankText:idioma.lbErrorCampoVacio, readOnly: true, 
                triggerAction: 'all', anchor: '90%'
        });  

        this.tfSaldoInicial = new Ext.form.TextField({
                id:'idtfSaldoInicial', fieldLabel:idioma.lbColSaldoInicial,
                name: 'saldoinicial', allowBlank: false, 
                anchor: '99%',
                blankText:idioma.lbErrorCampoVacio, 
        }); 

        this.tfMensualidad = new Ext.form.TextField({
                id:'idtfMensualidad', fieldLabel:idioma.lbColMensualidad,
                name: 'mensualidad', allowBlank: false, anchor: '90%',
                blankText:idioma.lbErrorCampoVacio, 
        });  

        this.tfUMensualidad = new Ext.form.TextField({
                id:'idtfUMensualidad', fieldLabel:idioma.lbColUltMensualidad,
                name: 'ultmensualidad', allowBlank: false, anchor: '90%',
                blankText:idioma.lbErrorCampoVacio, 
        });   

        this.tfReferencia = new Ext.form.TextField({
                id:'idtfReferencia', fieldLabel:idioma.lbColReferencia,
                name: 'refdocumentoacredita', allowBlank: false, anchor: '99%',
                blankText:idioma.lbErrorCampoVacio, 
        });  

        this.dfFDocumento = new Ext.form.DateField({
                id:'iddfFDocumento', fieldLabel:idioma.lbColFechaDocumento, 
                name: 'fechadocumento', allowBlank: false, 
                format:'d/m/Y', editable:true, readOnly : false, 
                value: new Date().format('d/m/Y'), maxText : idioma.lbFechaMaxima, 
                minText : idioma.lbFechaMinima, blankText:idioma.lbErrorCampoVacio, 
                invalidText: idioma.invalidTextFecha, vtype:'daterange', 
                anchor: '90%'
        });

        this.dfFInicioRetenc = new Ext.form.DateField({
                id:'dfFInicioRetenc', fieldLabel:idioma.lbColDesde, 
                name: 'fechainicio', allowBlank: false, 
                format:'d/m/Y', editable:true, readOnly : false, 
                value: new Date().format('d/m/Y'), maxText : idioma.lbFechaMaxima, 
                minText : idioma.lbFechaMinima, blankText:idioma.lbErrorCampoVacio, 
                invalidText: idioma.invalidTextFecha, vtype:'daterange', 
                anchor: '90%', endDateField: 'dfFFinRetenc'
        });

        this.dfFFinRetenc = new Ext.form.DateField({
                id:'dfFFinRetenc', fieldLabel:idioma.lbColHasta, 
                name: 'fechafin', xtype: 'datefield', allowBlank: true,
                format:'d/m/Y', editable:true, readOnly : false, 
                maxText : idioma.lbFechaMaxima, minText : idioma.lbFechaMinima, 
                blankText:idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha, 
                vtype:'daterange', anchor: '99%', startDateField: 'dfFInicioRetenc',
                prevTab: 'iddfFInicioRetenc', nextTab: 'idbtnCancelarRetenc'
        });	

        //Formulario de retenciones.
        this.formularioRetenc = new Ext.FormPanel({
            id:'idformularioRetenc',
            labelAlign: 'top',
            frame:true,
            width: 380,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },  
            items:[{layout:'column',
                        items:[
                            {columnWidth:.7, layout: 'form', items: [this.cbTipoRetenc]},
                            {columnWidth:.3, layout: 'form', items: [this.tfSaldoInicial]},
                        ]
                    },{layout:'column',
                        items:[
                            {columnWidth:.3, layout: 'form', items: [this.tfMensualidad]},
                            {columnWidth:.3, layout: 'form', items: [this.tfUMensualidad]},
                            {columnWidth:.4, layout: 'form', items: [this.tfReferencia]}
                        ]
                    },{layout:'column',
                        items:[
                            {columnWidth:.335, layout: 'form', items: [this.dfFDocumento]},
                            {columnWidth:.335, layout: 'form', items: [this.dfFInicioRetenc]},
                            {columnWidth:.33, layout: 'form', items: [this.dfFFinRetenc]}
                        ]
                    }
            ],
        });

        //Botones de la ventana de adicionar retenciones.
        this.btnCancelarRetenc = new Ext.Button({
            id:'idbtnCancelarRetenc',
            iconCls:'cancelar',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'dfFFinRetenc', 
            nextTab: 'idbtnAplicarRetenc',
        });
        
        this.btnAplicarRetenc = new Ext.Button({
            id:'idbtnAplicarRetenc',
            iconCls:'aplicar',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarRetenc', 
            nextTab: 'idbtnAceptarRetenc',
        });

        this.btnAceptarRetenc = new Ext.Button({
            id:'idbtnAceptarRetenc',
            iconCls:'aceptar',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarRetenc', 
            nextTab: 'idcbTipoRetenc',
        });

        //Ventana de adicionar y modificar retención.
        this.ventanaRetenc = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            constrain: true,
            resizable:false, 
            layout: 'fit',
            items:[this.formularioRetenc],
            buttons: [this.btnCancelarRetenc, this.btnAplicarRetenc, this.btnAceptarRetenc] , 
        });

	}
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('configestructurapago', function(perfil, idioma){
    perfil = arguments[0];
	idioma = arguments[1];
	
    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Pago.Retencion.Modelo;
    modelo.init();
    //Inicializando la vista.
	var vista = Pvd.Nomina.Pago.Retencion.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Pago.Retencion.Controlador.init(idioma, vista, modelo);
});