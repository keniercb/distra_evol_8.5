
/**
 Uso:Componente para realizar la busqueda de conceptos de percepciones y descuentos.

  * ---------------------------------------------

  * 15 de Abril de 2013 |   Nomina
  *

  * @extends Ext.Panel
  * @xtype
  * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
  * @version 1.0.0
  */
Ext.ns('Pvd.nomina.nomencladores');
Ext.QuickTips.init();
Pvd.nomina.nomencladores.Utils = function() {
    return {
        loadMask : function(msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg : msj
            });
            this.lMask.show();
        },
        hideMask : function() {
            this.lMask.hide();
        }
    }
};
var utils = new Pvd.nomina.nomencladores.Utils();

/*Componente panelBuscarestructura*/
Pvd.nomina.nomencladores.ListarConceptosPercepcionesDescuentosComp = Ext.extend(Ext.Panel,{
    region:(this.region ? this.region : 'center'),
    layout:(this.layout ? this.layout : 'border'),
    frame:false,
    border: (this.border ? this.border : false),
    seleccionMultiple: (this.seleccionMultiple ? this.seleccionMultiple : false),
	initComponent: function() {
		this.tipo = (this.tipo?2:1);
		var self = this;

		this.stConceptosPercepcionesDescuentos = new Ext.data.GroupingStore({
			url: '/pvd/nomina/index.php/listarconceptospercepcionesdescuentoscomp/obtenerconceptospercepcionesdescuentos',
			reader: new Ext.data.JsonReader(
                    {totalProperty: "cantidad", root: "datos", id: "idconceptopercepciondescuento"},
            [{name: 'idconceptopercepciondescuento'}
                , {name: 'abreviatura'}
                , {name: 'denominacion'}
                , {name: 'descripcion'}
                , {name: 'idtipoconceptopd'}
                , {name: 'tipoconcepto'}
            ]),
			sortInfo:{field: 'denominacion', direction: "ASC"},
			groupField:'tipoconcepto'
		});
		
		this.expanderConceptosPercepcionesDescuentos = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });
		
		this.multiSelect = new Ext.grid.CheckboxSelectionModel({
				listeners: {
					rowselect: function(selM, indexF, r){
						this.fireEvent('conceptoseleccionado', r);
					}.createDelegate(this)
				}
		});
		
		this.cmCheckboxConceptosPercepcionesDescuentos = new Ext.grid.ColumnModel([this.multiSelect,{
               header: "idconceptopercepciondescuento",
               dataIndex: 'idconceptopercepciondescuento',
               hidden: true,
               hideable: false
            },{
               header: "idtipoconceptopd",
               dataIndex: 'idtipoconceptopd',
               hidden: true,
               hideable: false
            },this.expanderConceptosPercepcionesDescuentos,{
               header: "Denominaci&oacute;n",
               dataIndex: 'denominacion',
               width: 250
            },{
               header: "Descripci&oacute;n",
               dataIndex: 'descripcion',
               width: 50,
               hidden: true,
               hideable: false
            },{
               header: "Tipo de concepto",
               dataIndex: 'tipoconcepto',
               width: 50,
               hidden: true,
               hideable: false
            }
        ]);
        this.cmCheckboxConceptosPercepcionesDescuentos.defaultSortable = true;
		
		this.cmConceptosPercepcionesDescuentos = new Ext.grid.ColumnModel([{
               header: "idconceptopercepciondescuento",
               dataIndex: 'idconceptopercepciondescuento',
               hidden: true,
               hideable: false
            },{
               header: "idtipoconceptopd",
               dataIndex: 'idtipoconceptopd',
               hidden: true,
               hideable: false
            },this.expanderConceptosPercepcionesDescuentos,{
               header: "Denominaci&oacute;n",
               dataIndex: 'denominacion',
               width: 250
            },{
               header: "Descripci&oacute;n",
               dataIndex: 'descripcion',
               width: 50,
               hidden: true,
               hideable: false
            },{
               header: "Tipo de concepto",
               dataIndex: 'tipoconcepto',
               width: 50,
               hidden: true,
               hideable: false
            }
        ]);
        this.cmConceptosPercepcionesDescuentos.defaultSortable = true;
		
		this.singleSelect = new Ext.grid.RowSelectionModel({
				singleSelect: (!this.seleccionMultiple),
				listeners: {
					rowselect: function(selM, indexF, r){
						this.fireEvent('conceptoseleccionado', r);
					}.createDelegate(this)
				}
		});

        //Buscador
        this.tfBuscarPercepcionesDescuentos = new Ext.form.TextField({
            id: 'tfBuscarPercepcionesDescuentos',
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar',
            name: 'tfbuscador'
        });
        this.btnBuscarPercepcionesDescuentos = new Ext.Button({
            disabled: false,
            id: 'btnBuscarPercepcionesDescuentos',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar concepto<b>(Alt+C)</b>',
            handler: function () {
                self.stConceptosPercepcionesDescuentos.load({params: {start: 0, limit: 20, criterio: self.tfBuscarPercepcionesDescuentos.getValue()}});
            }
        });
			
		this.gpConceptosPercepcionesDescuentos = new Ext.grid.GridPanel({
			store: this.stConceptosPercepcionesDescuentos,
			cm: (this.tipo=2?this.cmCheckboxConceptosPercepcionesDescuentos:this.cmConceptosPercepcionesDescuentos), 
			sm: (this.tipo=2?this.multiSelect:this.singleSelect),
			region: 'center',
			view: new Ext.grid.GroupingView({
				forceFit:true,
				groupTextTpl: '{text}'
			}),
			plugins: this.expanderConceptosPercepcionesDescuentos,
			width: 400,
			height: 300,
			loadMask:{msg : 'Cargando...'},
            tbar: [this.tfBuscarPercepcionesDescuentos, this.btnBuscarPercepcionesDescuentos],
            bbar:new Ext.PagingToolbar({ 
                pageSize: 20, 
                store: this.stConceptosPercepcionesDescuentos,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            })
		});

        this.items = [this.gpConceptosPercepcionesDescuentos];
        Pvd.nomina.nomencladores.ListarConceptosPercepcionesDescuentosComp.superclass.initComponent.call(this);
    },
    Cargar: function(){
		this.stConceptosPercepcionesDescuentos.load({params: {limit: 20, start: 0}});
    },
    Desmarcar: function(){
		this.gpConceptosPercepcionesDescuentos.getSelectionModel().clearSelections();
    },
    GetSeleccionados: function(){
		return this.gpConceptosPercepcionesDescuentos.getSelectionModel().getSelections();
    }
});
