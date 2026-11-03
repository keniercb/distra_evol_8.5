/**
 Uso:Componente para realizar la busqueda de tipos de pago.

 * ---------------------------------------------

 * 22 de Abril de 2013 |   Nomina
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Pvd.nomina.nomencladores');
Ext.QuickTips.init();
Pvd.nomina.nomencladores.Utils = function () {
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
var utils = new Pvd.nomina.nomencladores.Utils();

Pvd.nomina.nomencladores.ListarTiposPagoComp = Ext.extend(Ext.Panel, {
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'border'),
    multiselect: (this.multiselect ? this.multiselect : false),
    frame: false,
    border: (this.border ? this.border : false),
    initComponent: function () {
        var self = this;
        this.stTiposPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/listartipospagocomp/obtenertipospago',
            //sortInfo: {field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idtipopago"},
                [{name: 'idtipopago'}
                    , {name: 'denominacion'}
                    , {name: 'descripcion'}
                    , {name: 'sedesglosa'}
                    , {name: 'orden'}
                ])
        });

        this.expanderTiposPago = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        Ext.grid.CheckColumn = function (config) {
            Ext.apply(this, config);
            if (!this.id) {
                this.id = Ext.id();
            }
            this.renderer = this.renderer.createDelegate(this);
        };

        Ext.grid.CheckColumn.prototype = {
            init: function (grid) {
                this.grid = grid;
                this.grid.on('render', function () {
                    var view = this.grid.getView();
                }, this);
            },

            renderer: function (v, p, record) {
                p.css += ' x-grid3-check-col-td';
                return '<div class="x-grid3-check-col' + (v == 1 || v == '1' ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
            }
        };



        this.rowselectionmodel = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (selM, indexF, r) {
                    this.fireEvent('tipopagoseleccionado', r);
                }.createDelegate(this)
            }
        });

        this.checkboxselectionmodel = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (selM, indexF, r) {
                    this.fireEvent('tipopagoseleccionado', r);
                }.createDelegate(this)
            }
        });

        this.cmTiposPago = new Ext.grid.ColumnModel([this.checkboxselectionmodel,{
            header: "idtipopago",
            dataIndex: 'idtipopago',
            hidden: true,
            hideable: false
        }, {
            header: "idtipoconceptopd",
            dataIndex: 'idtipoconceptopd',
            hidden: true,
            hideable: false
        }, this.expanderTiposPago, {
            header: "Denominaci&oacute;n",
            dataIndex: 'denominacion',
            width: 170,
            renderer: function (val) {
                if (val == "General" || val == "General" || val == "Subvenciones" || val == "General fuera fecha" || val == "Nominilla") return '<span style="color:green;">' + val + '</span>';
                else return '<span style="color:blue;">' + val + '</span>';
            }
        }, {
            header: "Descripci&oacute;n",
            dataIndex: 'descripcion',
            width: 50,
            hidden: true,
            hideable: false
        }, {
            header: "Se desglosa",
            dataIndex: 'sedesglosa',
            hidden: true,
            width: 80,
            renderer: function (val) {
                if (val == 1) return '<center><span style="color:green;">Si</span></center>';
                else return '<center><span style="color:blue;">No</span></center>';
            }
        }, {
            header: "Orden",
            dataIndex: 'orden',
            type: 'string',
            hidden: false,
            width: 20
        }
        ]);
        this.cmTiposPago.defaultSortable = true;

        //Buscador
        this.tfbuscarTipoPago = new Ext.form.TextField({
            id: 'tfbuscarTipoPago',
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar',
            name: 'tfbuscador'
        });
        this.btnBuscarTipoPago = new Ext.Button({
            disabled: false,
            id: 'btnBuscarTipoPago',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar tipo de pago <b>(Alt+B)</b>',
            handler: function () {
                self.stTiposPago.load({params: {start: 0, limit: 20, criterio: self.tfbuscarTipoPago.getValue()}});
            }
        });
        //this.multiselect
        this.gpTiposPago = new Ext.grid.GridPanel({
            store: this.stTiposPago,
            cm: this.cmTiposPago,
            sm: (this.multiselect == true)?this.checkboxselectionmodel:this.rowselectionmodel,
            region: 'center',
            plugins: this.expanderTiposPago,
            width: 400,
            height: 300,
            viewConfig: {forceFit: true},
            loadMask: {msg: 'Cargando...'},
            tbar: [this.tfbuscarTipoPago, this.btnBuscarTipoPago],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: this.stTiposPago,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        this.items = [this.gpTiposPago];
        Pvd.nomina.nomencladores.ListarTiposPagoComp.superclass.initComponent.call(this);
    },
    Cargar: function () {
        this.stTiposPago.load({params: {limit: 20, start: 0}});
    },
    GetSeleccion: function () {
        this.gpTiposPago.getSelectionModel().getSelected();
    }
});
