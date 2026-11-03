/**
 * Created by shonder on 30/04/2015.
 */

Ext.ns('Pvd.Nomina.CalculoPagoResultado');
//Tipo de layout auxiliar
Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize: true,

    // private
    isValidParent: function (c, target) {
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout     : function (ct, target) {
        var rs = ct.items.items, len = rs.length, r, i;

        if (!this.innerCt) {
            target.addClass('ux-row-layout-ct');
            this.innerCt = target.createChild({cls: 'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if (size.width < 1 && size.height < 1) { // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height: h});

        // some rows can be percentages while others are fixed
        // so we need to make 2 passes

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (!r.rowHeight) {
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (r.rowHeight) {
                r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
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
/**
 * Autor: Beatriz Selema Alvarez
 */

Pvd.Nomina.CalculoPagoResultado.detallesEntrada = Ext.extend(Ext.Panel, {
    layout: 'fit',
    initComponent: function () {

        this.stPeriodosPagoExportar = new Ext.data.GroupingStore({
            url: '',
            sortInfo: {field: 'fechapago', direction: "ASC"},
            groupField: 'anyo',
            reader:new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad:true,
                    root: "datos",
                    id: "idelaborarpagos" },
                [{name: 'idelaborarpagos'}
                    ,{name: 'idtipopago'}
                    ,{name: 'idperiodopago'}
                    ,{name: 'fechapago'}
                    ,{name: 'fechainicioperiodo'}
                    ,{name: 'fechafinperiodo'}
                    ,{name: 'mesanyopago'}
                    ,{name: 'denperiodopago'}
                    ,{name: 'identidad'}
                    ,{name: 'anyo'}
                    ,{name: 'mes'}
                    ,{name: 'periodopago'}
                ])
        });

        this.gpPeriodosPagosExportar = new Ext.grid.EditorGridPanel({
            store: this.stPeriodosPagoExportar,
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTituloTabPeriodo,
            border: false,
            loadMask: {text: 'Cargando...'},
            width:'100%',
            height:'50%',
            columns: [{header: 'idelaborarpagos', dataIndex: 'idelaborarpagos', width: 100, hidden: true},
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'idperiodopago', dataIndex: 'idperiodopago', width: 100, hidden: true},
                {header: 'fechainicioperiodo', dataIndex: 'fechainicioperiodo', width: 100, hidden: true},
                {header: 'fechafinperiodo', dataIndex: 'fechafinperiodo', width: 100, hidden: true},
                {header: 'estado', dataIndex: 'estado', width: 100, hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anyo', width: 100, hidden: true},
                {header: 'mesanyopago', dataIndex: 'mesanyopago', width: 100, hidden: true},
                {header: 'Per&iacute;odo', dataIndex: 'denperiodopago', width: 100, renderer: this.formatoPeriodosPago},
                {header: 'Rango fechas', dataIndex: 'periodopago', width: 150, renderer: this.formatoPeriodosPago},
                {header: 'Fecha de pago', dataIndex: 'fechapago', width: 120, renderer: this.formatoPeriodosPago},
                {header: 'Mes', dataIndex: 'mes', width: 150, hidden: true, renderer: this.formatoPeriodosPago}
            ],
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function(sm, index, record){
                    }.createDelegate(this)
                }
            })
        });

        this.stPeriodosPagoDestajo = new Ext.data.Store({
            url: 'obtenerperiodosdestajo',
            reader:new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad:true,
                    root: "datos",
                    id: "idperiodosdestajo" },
                [,{name: 'idperiodosdestajo'}
                    ,{name: 'fechainicio'}
                    ,{name: 'fechafin'}
                    ,{name: 'identidad'}
                    ,{name: 'idpagoresultado'}
                ])
        });

        this.dfFInicioDestajo = new Ext.form.DateField({id: 'dfFInicioDestajo', fieldLabel: 'Fecha inicio',
            tabIndex                                    : 3, name: 'fechainicio', allowBlank: false,
            format                                      : 'd/m/Y', editable: true, readOnly: false,
            /*value                                       : new Date().format('d/m/Y'),*/ maxText: Pvd.Nomina.CalculoPagoResultado.Idioma.lbFechaMaxima,
            minText                                     : Pvd.Nomina.CalculoPagoResultado.Idioma.lbFechaMinima, blankText: Pvd.Nomina.CalculoPagoResultado.Idioma.lbErrorCampoVacio,
            invalidText                                 : Pvd.Nomina.CalculoPagoResultado.Idioma.invalidTextFecha, vtype: 'daterange',
            anchor                                      : '90%', endDateField: 'dfFinDestajo'
        });

        this.dfFinDestajo = new Ext.form.DateField({id: 'dfFinDestajo', fieldLabel: 'Fecha fin',
            tabIndex                                 : 4, name: 'fechafin', xtype: 'datefield', allowBlank: false,
            format                                   : 'd/m/Y', editable: true, readOnly: false,
            maxText                                  : Pvd.Nomina.CalculoPagoResultado.Idioma.lbFechaMaxima, minText: Pvd.Nomina.CalculoPagoResultado.Idioma.lbFechaMinima,
            blankText                                : Pvd.Nomina.CalculoPagoResultado.Idioma.lbErrorCampoVacio, invalidText: Pvd.Nomina.CalculoPagoResultado.Idioma.invalidTextFecha,
            vtype                                    : 'daterange', anchor: '99%', startDateField: 'dfFInicioDestajo'
        });

        this.radioRangoDias = new Ext.form.Radio({
            hideLabel: true,
            id: 'rad3',
            align: 'center',
            boxLabel: 'Rango Dias',
            name: 'tipofecha',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {

                    }
                }.createDelegate(this)
            }
        });
        this.radioDiaaDia = new Ext.form.Radio({
            hideLabel: true,
            id: 'rad4',
            align: 'west',
            boxLabel: 'Dia a dia',
            name: 'tipofecha',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {

                    }
                }.createDelegate(this)
            }
        });

        /*this.fsRadiosDestajo = new Ext.form.FieldSet({
            autoHeight: true,
            defaultType: 'radio',
            items: [

                {layout  : 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.radioRangoDias]},
                        {columnWidth: .5, layout: 'form', items: [this.radioDiaaDia]}
                    ]
                }
            ]
        });*/

        //Formulario de fechas al destajo.
        this.formularioDestajo = new Ext.FormPanel({
            id        : 'formularioDestajo',
            labelAlign: 'top',
            frame     : true,
            width     : 500,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px',
            },
            items     : [
                            {layout  : 'column',
                                items: [
                                    {columnWidth: .5, layout: 'form', items: [this.dfFInicioDestajo]},
                                    {columnWidth: .5, layout: 'form', items: [this.dfFinDestajo]}
                                ]
                            },
                {layout  : 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.radioRangoDias]},
                        {columnWidth: .5, layout: 'form', items: [this.radioDiaaDia]}
                    ]
                }
            ],
        });

        //Botones de la ventana de tipos de nómina
        this.btnCancelarDestajo = new Ext.Button({
            id     : 'btnCancelarDestajo',
            iconCls: 'cancelar',
            //  icon:perfil.dirImg+'cancelar.png',
            text   : 'Cancelar'
        });


        this.btnAceptarDestajo = new Ext.Button({
            id     : 'btnAceptarDestajo',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text   : 'Aceptar'
        });

        //Ventana de adicionar y modificar fechas al destajo.
        this.ventanaDestajo = new Ext.Window({
            title: 'Gestionar fechas destajo',
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioDestajo],
            buttons: [this.btnCancelarDestajo, this.btnAceptarDestajo]
        });



        this.btnAdicionarFechasDestajo = new Ext.Button({
            id: 'btnAdicionarFechasDestajo',
            text: 'Adicionar',
            tooltip: '',
            iconCls: 'adicionar',
            disabled: true
        });

        this.btnEliminarFechasDestajo = new Ext.Button({
            id: 'btnEliminarFechasDestajo',
            text: 'Eliminar',
            tooltip: '',
            iconCls: 'eliminar',
            disabled: true
        });

        this.smdestajo = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function(sm, index, record){
                }.createDelegate(this)
            }
        });

        this.gpPeriodosPagoDestajo = new Ext.grid.EditorGridPanel({
            store: this.stPeriodosPagoDestajo,
            title: 'Periodos pago destajo',
            border: false,
            loadMask: {text: 'Cargando...'},
            width:'100%',
            height:'50%',
            columns: [{header: 'idperiodosdestajo', dataIndex: 'idperiodosdestajo', width: 100, hidden: true},
                this.smdestajo,
                {header: 'Fecha inicio', dataIndex: 'fechainicio', width: 100},
                {header: 'Fecha Fin', dataIndex: 'fechafin', width: 100},
                {header: 'identidad', dataIndex: 'identidad', width: 100, hidden: true},
                {header: 'idpagoresultado', dataIndex: 'idpagoresultado', width: 100, hidden: true},

            ],
            viewConfig: {
                forceFit: true
            },
            //view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smdestajo,
            tbar: [this.btnAdicionarFechasDestajo, this.btnEliminarFechasDestajo],
        });


        this.stPeriodoPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/elaborarpagos/obtenerperiodospago',
            autoLoad:true,
            reader:new Ext.data.JsonReader(
                {id: "idelaborarpagos" },
                [ 	 {name: 'idelaborarpagos'}
                    ,{name: 'idperiodopago'}
                    ,{name: 'denominacion'}
                    ,{name: 'fechainicio'}
                    ,{name:'idtipopago'}
                    ,{name: 'fechafin'}
                    ,{name: 'descripcion'}
                    ,{name: 'cantidaddias'}
                    ,{name: 'esmensual'}
                ])
        });
        this.formatoPeriodosPago = function(val, metadata, record, ri, ci){
            if(ci == 11){
                var i = this.stMes.find('valor', val);
                if(i != -1){
                    val = this.stMes.getAt(i).data.denominacion;
                }
            }
            else if(ci == 8){
                val = this.stPeriodoPago.getAt(this.stPeriodoPago.find('idperiodopago', record.data.idperiodopago)).data.denominacion;
            }

            if(record.data.estado == 1)
                return '<span style="color:blue;">' + val + '</span>';
            else if(record.data.estado == 2)
                return '<span style="color:green;">' + val + '</span>';
            else return val;
        }.createDelegate(this);

        this.stPlantillaNAreas = new Ext.data.Store({
            url: 'obtenerAreas',
            reader:new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idarea" },
                [ 	 {name: 'idarea'}
                    ,{name: 'area'}
                    ,{name: 'monto'}
                    ,{name: 'idpagoporresultadoarea'}
                    ,{name: 'idpagoporresultado'}
                ])
        });

        this.gridAreas = new Ext.grid.GridPanel({
            frame:true,
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTituloTabArea,
            disabled:false,
            autoExpandColumn :'idareaexp',
            split: true,
            autoScroll:true,
            stripeRows: true,
            store:  this.stPlantillaNAreas,
            loadMask:{
                msg :'Cargando...'
            },
            columns: [{header: "Area",id:'idareaexp', sortable: true,dataIndex: 'area'},{header: "Monto", sortable: true,dataIndex: 'monto',width:100}]
        });

        this.PanelPeriodosPagDest = new Ext.Panel({
            title: 'Periodos pago destajo',
            layout: 'ux.row',
            width:'100%',
            height:450,
            items : [
                {
                    rowHeight: .30,
                    width    : '100%',
                    border   : false,
                    split    : true,
                    layout   : 'fit',
                    items    : [this.gpPeriodosPagosExportar]
                },
                {
                    rowHeight: .70,
                    width    : '100%',
                    border   : false,
                    split    : true,
                    layout   : 'fit',
                    items    : [this.gpPeriodosPagoDestajo]
                }
            ]
        });



        this.items = new Ext.TabPanel({
            border:false,
            activeTab:0,
            tabPosition:'bottom',
            items:[ this.PanelPeriodosPagDest,this.gridAreas]
        });
        Pvd.Nomina.CalculoPagoResultado.detallesEntrada.superclass.initComponent.call(this);
    },
    setDetalles: function (arrayPeriodos,arrayAreas){
        //console.info(arrayPeriodos);
        //console.info(arrayAreas);
        this.limpiarStores();
        this.stPeriodosPagoExportar.add(arrayPeriodos);
        this.stPlantillaNAreas.add(arrayAreas);
  },
    limpiarStores:function(){
        
        this.stPeriodosPagoExportar.removeAll();
        this.stPlantillaNAreas.removeAll();
    },
    devDatosAreasPagos:function(){
        var arrayPagos=new Array();
        //Obteniendo las Areas
        var arrayAreas=new Array();
        Ext.each(this.stPlantillaNAreas.getRange(), function (rec) {
            var objRecord={};
            objRecord.monto=rec.data.monto;
            objRecord.idarea=rec.data.idarea;
            arrayAreas.push(objRecord);
        });
        //Obteniendo los Pagos
        Ext.each(this.stPeriodosPagoExportar.getRange(), function (rec) {
            var objRecordPago={};
            objRecordPago.idelaborarpagos=rec.data.idelaborarpagos;
            objRecordPago.idtipopago=rec.data.idtipopago;
            arrayPagos.push(objRecordPago);
        });
        var objGeneral={};
         objGeneral.pagos=arrayPagos;
         objGeneral.areas=arrayAreas;
        return  objGeneral;
    }

})//fin



