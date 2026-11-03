/**
 Uso:Componente para listar los periodos de pagos

 * ---------------------------------------------

 * 25 de junio de 2013 |   Nomina
 *

 * @extends   Ext.Panel
 * @xtype
 * @autor     Linea Capital Humano - Ing. Yadir Martinez Vergara
 * @modifyby  Linea Capital Humano - Ing. Frank Rodriguez Berroa
 * @version   1.0.1
 */
Ext.ns('Pvd.Nomina.ElaborarPago');
Ext.QuickTips.init();
Pvd.Nomina.ElaborarPago.Utils = function () {
    return {
        loadMask: function (msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function () {
            this.lMask.hide();
        }
    }
};
var utils = new Pvd.Nomina.ElaborarPago.Utils();

/*Componente*/
Pvd.Nomina.ElaborarPago.ListarPeriodosPago = Ext.extend(Ext.Panel, {
    region: 'center',
    layout: 'border',
    frame: false,
    split: true,
    autoScroll: true,
    identidad: null,
    arrayentidades: null,
    cantidadPorPagina: 20,
    initComponent: function () {
        this.cantidadPorPagina = (this.cantidadPorPagina ? this.cantidadPorPagina : 20);
        this.region = (this.region ? this.region : 'center');
        this.layout = (this.layout ? this.layout : 'border');
        this.modoview = (this.modoview ? this.modoview : 1);

        var variables = {
            idtipopago: null,
            modopago: null
        };

        this.stTipoPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/elaborarpagos/obtenertipospago',
            //sortInfo: {field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {id: "idtipopago"},
                [{name: 'idtipopago'},
                    {name: 'denominacion'},
                    {name: 'sedesglosa'},
                    {name: 'modopago'},
                    {name: 'modoseleccionpersonas'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'descripcion'},
                    {name: 'orden'}
                ])
        });

        this.cbTipoPago = new Ext.form.ComboBox({
            id: 'cbTipoPago',
            valueField: 'idtipopago',
            displayField: 'denominacion', hiddenName: 'idtipopago',
            allowBlank: false,
            mode: 'local',
            store: this.stTipoPago,
            emptyText: 'Seleccione...',
            blankText: 'Este campo es obligatorio',
            readOnly: true,
            triggerAction: 'all'
        });

        this.cbTipoPago.on('select', function (combo, record, index) {
            variables.idtipopago = record.data.idtipopago;
            variables.modopago = record.data.modopago;
            var cm = this.gpPeriodosPagos.getColumnModel();
            if (variables.modopago == 1) {
                cm.setHidden(9, false);
                cm.setHidden(11, true);
            } else if (variables.modopago == 2) {
                cm.setHidden(9, true);
                cm.setHidden(11, false);
            }
            this.stPeriodosPago.removeAll();
            this.CargarPeriodosPago();
        }.createDelegate(this));

        this.stVisualizar = new Ext.data.SimpleStore({
            fields: [{name: 'valor'}, {name: 'denominacion'}]
        });
        var a = [[1, 'Plantillas'], [2, 'General']];
        this.stVisualizar.loadData(a);

        this.cbVisualizar = new Ext.form.ComboBox({
            id: 'cbVisualizar',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            mode: 'local',
            readOnly: true,
            triggerAction: 'all',
            store: this.stVisualizar
        });

        this.stPeriodosPago = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/elaborarpagos/obtenerperiodosdepago',
            sortInfo: {field: 'anyo', direction: "DESC"},
            groupField: 'anyo',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idelaborarpagos"
                },
                [
                    {name: 'idelaborarpagos'},
                    {name: 'idtipopago'},
                    {name: 'idperiodopago'},
                    {name: 'fechapago'},
                    {name: 'fechainicioperiodo'},
                    {name: 'fechafinperiodo'},
                    {name: 'mesanyopago'},
                    {name: 'estado'},
                    {name: 'identidad'},
                    {name: 'anyo'},
                    {name: 'mes'},
                    {name: 'periodopago'},
                    {name: 'idcomprobanteoperaciones'},
                    {name: 'numerocomprobanteoperaciones'},
                    {name: 'idcomprobantecancelacion'},
                    {name: 'numerocomprobantecancelacion'},
                    {name: 'idcomprobantecuentasporcobrar'},
                    {name: 'numerocomprobantecuentaxcobrar'},
                    {name: 'denomtipopago'}
                ])
        });

        this.stPeriodosPagoExportar = new Ext.data.GroupingStore({
            url: '',
            sortInfo: {field: 'fechapago', direction: "ASC"},
            groupField: 'anyo',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idelaborarpagos"
                },
                [{name: 'idelaborarpagos'}, {name: 'idtipopago'}, {name: 'idperiodopago'}, {name: 'fechapago'}, {name: 'fechainicioperiodo'}, {name: 'fechafinperiodo'}, {name: 'mesanyopago'}, {name: 'estado'}, {name: 'identidad'}, {name: 'anyo'}, {name: 'mes'}, {name: 'periodopago'}, {name: 'denomtipopago'}
                ])
        });

        this.CargarPeriodosPago = function () {
            console.log(this.identidad)
            this.stPeriodosPago.removeAll();
            this.stPeriodosPago.baseParams.identidad = this.identidad;
            this.stPeriodosPago.baseParams.idtipopago = variables.idtipopago;
            this.stPeriodosPago.baseParams.modopago = variables.modopago;
            this.stPeriodosPago.baseParams.cargarsinaprobar = this.modoview;
            this.stPeriodosPago.baseParams.arrayidentidades = Ext.encode(this.arrayentidades);
            this.stPeriodosPago.load();
        }

        this.arrMes = [['01', 'Enero'], ['02', 'Febrero'], ['03', 'Marzo'], ['04', 'Abril'], ['05', 'Mayo'], ['06', 'Junio'], ['07', 'Julio'], ['08', 'Agosto'], ['09', 'Septiembre'], ['10', 'Octubre'], ['11', 'Noviembre'], ['12', 'Diciembre']];
        this.stMes = new Ext.data.Store({
            data: this.arrMes,
            reader: new Ext.data.ArrayReader({}, [{name: 'valor'}, {name: 'denominacion'}]),
            sortInfo: {field: 'valor', direction: "ASC"}
        });

        this.stPeriodoPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/elaborarpagos/obtenerperiodospago',
            reader: new Ext.data.JsonReader(
                {id: "idperiodopago"},
                [{name: 'idperiodopago'}, {name: 'denominacion'}, {name: 'fechainicio'}, {name: 'fechafin'}, {name: 'descripcion'}, {name: 'cantidaddias'}, {name: 'esmensual'}
                ])
        });

        this.formatoPeriodosPago = function (val, metadata, record, ri, ci) {
            if (ci == 11) {
                var i = this.stMes.find('valor', val);
                if (i != -1) {
                    val = this.stMes.getAt(i).data.denominacion;
                }
            }
            else if (ci == 8) {
                val = this.stPeriodoPago.getAt(this.stPeriodoPago.find('idperiodopago', record.data.idperiodopago)).data.denominacion;
            }

            if (record.data.estado == 1)
                return '<span style="color:blue;">' + val + '</span>';
            else if (record.data.estado == 2)
                return '<span style="color:green;">' + val + '</span>';
            else return val;
        }.createDelegate(this);

        this.ordenarPorAnnos = function (val) {
            var anno = val.split('-');
            //return anno[1];
            return val;
        }.createDelegate(this);

        this.gpPeriodosPagos = new Ext.grid.EditorGridPanel({
            store: this.stPeriodosPago,
            region: 'center',
            // layout: 'fit',
            border: false,
            autoScroll: true,
            split: true,
            loadMask: {text: 'Cargando...'},
            width: '100%',
            // height: 600,
            columns: [{header: 'idelaborarpagos', dataIndex: 'idelaborarpagos', width: 100, hidden: true},
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'idperiodopago', dataIndex: 'idperiodopago', width: 100, hidden: true},
                {header: 'fechainicioperiodo', dataIndex: 'fechainicioperiodo', width: 100, hidden: true},
                {header: 'fechafinperiodo', dataIndex: 'fechafinperiodo', width: 100, hidden: true},
                {header: 'estado', dataIndex: 'estado', width: 100, hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anyo', width: 100, hidden: true, renderer: this.ordenarPorAnnos},
                {header: 'mesanyopago', dataIndex: 'mesanyopago', width: 100, hidden: true},
                {header: 'Per&iacute;odo',dataIndex: 'idperiodopago', width: 100, hidden: true, renderer: this.formatoPeriodosPago},
                {header: 'Tipo de pago', dataIndex: 'denomtipopago', width: 100, renderer: this.formatoPeriodosPago},
                {header: 'Rango fechas', dataIndex: 'periodopago', width: 150, renderer: this.formatoPeriodosPago},
                {header: 'Fecha de pago', dataIndex: 'fechapago', width: 120, renderer: this.formatoPeriodosPago},
                {header: 'Mes', dataIndex: 'mes', width: 150, hidden: true, renderer: this.formatoPeriodosPago},
            ],
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function (sm, index, record) {
                        this.fireEvent('periodopagoseleccionado', record);
                    }.createDelegate(this)
                }
            }),
            tbar: (this.modoview == 2 ? ['Tipo de pago:', this.cbTipoPago] : ['Tipo de pago:', this.cbTipoPago]/* '->','Modo visualizar:', this.cbVisualizar]*/)
        });

        this.gpPeriodosPagosExportar = new Ext.grid.EditorGridPanel({
            store: this.stPeriodosPagoExportar,
            title: 'Listado de períodos de pago a exportar',
            region: 'center',
            layout: 'fit',
            border: false,
            loadMask: {text: 'Cargando...'},
            width: '100%',
            height: 450,
            columns: [{header: 'idelaborarpagos', dataIndex: 'idelaborarpagos', width: 100, hidden: true},
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'idperiodopago', dataIndex: 'idperiodopago', width: 100, hidden: true},
                {header: 'fechainicioperiodo', dataIndex: 'fechainicioperiodo', width: 100, hidden: true},
                {header: 'fechafinperiodo', dataIndex: 'fechafinperiodo', width: 100, hidden: true},
                {header: 'estado', dataIndex: 'estado', width: 100, hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anyo', width: 100, hidden: true},
                {header: 'mesanyopago', dataIndex: 'mesanyopago', width: 100, hidden: true},
                {
                    header: 'Per&iacute;odo',
                    dataIndex: 'idperiodopago',
                    hidden: true,
                    width: 100,
                    renderer: this.formatoPeriodosPago
                },
                {header: 'Tipo de pago', dataIndex: 'denomtipopago', width: 100, renderer: this.formatoPeriodosPago},
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
                    rowselect: function (sm, index, record) {
                        this.fireEvent('periodopagoexportarseleccionado', record);
                    }.createDelegate(this)
                }
            })
        });


        //Botones de adicionar y eliminar cargos.
        this.btnAddGridExportarVarios = new Ext.Button({
            disabled: true,
            id: 'idbtnAddGridExportarVarios',
            style: 'margin-left:10px;margin-top:155px',
            //icon: perfil.dirImg + 'siguiente.png',
            tooltip: 'Adicionar período de pago a exportar',
            iconCls: 'siguiente',
        });

        this.btnDelGridExportarVarios = new Ext.Button({
            disabled: true,
            id: 'idbtnGridExportarVarios',
            style: 'margin-left:10px;margin-top:70px',
            tooltip: 'Eliminar período de pago a exportar',
            iconCls: 'anterior',
        });


        //Formulario de periodos
        this.panelIzquierdoPeriodos = new Ext.Panel({
            layout: 'fit',
            // region: 'center',
            height: 400,
            width: 350,
            autoScroll: true,
            items: [this.gpPeriodosPagos]
        });

        //Formulario de periodos a exportar
        this.panelDerechoPeriodos = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            height: 400,
            width: 350,
            autoScroll: true,
            items: [this.gpPeriodosPagosExportar]
        });

        //Formulario de estructura de plantilla.
        this.formularioExportar = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            region: 'center',
            // height: 800,
            // width: 800,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .47,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        border: false,
                        layout: 'border',
                        height: 320,
                        //width: 200,
                        items: [this.gpPeriodosPagos]
                    }
                    ]
                }, {
                    columnWidth: .06,
                    layout: 'form',
                    items: [this.btnAddGridExportarVarios, this.btnDelGridExportarVarios],
                    anchor: '100%'
                }, {
                    columnWidth: .47,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        border: true,
                        layout: 'fit',
                        items: [this.panelDerechoPeriodos]
                    }]
                }]
            }]
        });

        this.items = [(this.modoview == 2 ? this.formularioExportar : this.gpPeriodosPagos)];
        Pvd.Nomina.ElaborarPago.ListarPeriodosPago.superclass.initComponent.call(this);
        this.stTipoPago.load();
        this.stPeriodoPago.load();
    },
    Datos: function () {
        if (this.gpPeriodosPagos.getSelectionModel().hasSelection()) {
            var d = {
                idelaborarpagos: null,
                idtipopago: null,
                tipopago: '',
                periodopago: '',
                fechapago: ''
            };
            var r = this.gpPeriodosPagos.getSelectionModel().getSelected();
            d.idelaborarpagos = r.data.idelaborarpagos;
            d.idtipopago = r.data.idtipopago;
            d.tipopago = this.stTipoPago.getAt(this.stTipoPago.find('idtipopago', r.data.idtipopago)).data.denominacion;
            d.modopago = this.stTipoPago.getAt(this.stTipoPago.find('idtipopago', r.data.idtipopago)).data.modopago;
            d.periodopago = this.stPeriodoPago.getAt(this.stPeriodoPago.find('idperiodopago', r.data.idperiodopago)).data.denominacion;
            d.fechapago = r.data.fechapago;
            d.fechainicioperiodo = r.data.fechainicioperiodo;
            d.fechafinperiodo = r.data.fechafinperiodo;
            /*d.idcomprobanteoperaciones = r.data.idcomprobanteoperaciones;
            d.numerocomprobanteoperaciones = (r.data.numerocomprobanteoperaciones != null) ? r.data.numerocomprobanteoperaciones : '';
            d.idcomprobantecancelacion = r.data.idcomprobantecancelacion;
            d.numerocomprobantecancelacion = (r.data.numerocomprobantecancelacion != null) ? r.data.numerocomprobantecancelacion : '';
            d.idcomprobantecuentasporcobrar = r.data.idcomprobantecuentasporcobrar;
            d.numerocomprobantecuentaxcobrar = (r.data.numerocomprobantecuentaxcobrar != null) ? r.data.numerocomprobantecuentaxcobrar : '';*/
            d.mesanyopago = r.data.mesanyopago;
            //console.info(d);

            if (d.modopago == 2) {
                var i = this.stMes.find('valor', r.data.mes);
                if (i != -1) {
                    d.mespago = this.stMes.getAt(i).data.denominacion;
                } else {
                    d.mespago = '';
                }
                d.rangofechas = '';
            } else {
                d.mespago = '';
                d.rangofechas = d.fechainicioperiodo + ' al ' + d.fechafinperiodo;
            }

            return d;
        }
    },
    CambiarEntidad: function (pidentidad) {
        this.identidad = pidentidad;
    },
    CambiarEntidadesBuscar: function (arrayidentidades) {
        this.arrayentidades = arrayidentidades;
        console.info(arrayidentidades);
    },
    DesabilitarCombo: function () {
        this.cbTipoPago.disable();
    },
    HabilitarCombo: function () {
        this.cbTipoPago.enable();
    },
    getSeleccion: function () {

    },
    limpiarSeleccion: function () {

    },
    cargarPeriodosPagoExportar: function (arrperiodospago) {

    },
    cargarComboTiposPagoEspecificos: function (arrtipospago) {
        this.stTipoPago.load({params:{arrtipospago: Ext.encode(arrtipospago)}});
    }

});
