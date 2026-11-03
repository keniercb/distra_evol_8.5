
/**
 Uso:Componente gestionar formular o expresiones matematicas

  * ---------------------------------------------

  * 2 de Abril de  2012 |   Persona
  *

  * @extends Ext.Panel
  * @xtype
  * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
  * @version 1.0.0
  */
Ext.ns('Ext.pvd.persona.formula');
Ext.QuickTips.init();
Ext.pvd.persona.formula.Utils = function() {
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
var utils = new Ext.pvd.persona.formula.Utils();
Ext.QuickTips.init();
//var _this = null;

Ext.pvd.persona.formula.winFormula = Ext.extend(Ext.Window,{
    layout:(this.layout ? this.layout : 'border'),
	idCmp:this.idCmp,
	width:(this.width ? this.width : 850),
	height:(this.height ? this.height : 550),
	closeAction:'destroy',
	closable:true,
	plain: false,
	indicadores: (this.indicadores ? this.indicadores : []),
    initComponent: function(){
        /*****************************************************************************************************************************************************************************/
		/*GridPanel para los indicadores*/
		this.stIndicadores = new Ext.data.SimpleStore({
	        fields: [
	           {name: 'idindicador'},
	           {name: 'denominacion'}
	        ]
		});
		this.smIndicadores = new Ext.grid.RowSelectionModel({
			singleSelect : true,
			listeners : {
				rowselect : function(smInd, indiceFila, record) {
					console.log(record.get('idindicador'));
				}
			}
		});
		this.gpIndicadores = new Ext.grid.EditorGridPanel({
			title:'Indicadores',
			store: this.stIndicadores, //le asignamos la fuente de datos
			region: 'west',
			width: 350,
			margins: '0 5 0 0',
			columns: [
						new Ext.grid.RowNumberer(),
						{header:'Idindicador', dataIndex:'idindicador', width: 100,  hidden: true},
						{header:'Denominaci&oacute;n', dataIndex:'denominacion', width: 320}
					],
			sm: this.smIndicadores,
		});
        /******************************************************************************************************************************************************************************/

 	    /*Panel contenedor del area de edicion de la formula*/
		this.taExpresionformula = new Ext.form.TextArea({
			anchor:		'95%',
			layout: 'fit',
			region: 'center',
			allowBlank:	true
		});

		this.btnValidar = new Ext.Button({
			iconCls:'btn',
			text: 'Validar',
			tooltip: 'Validar',
			handler: function(){}
		});

		this.btnVistaprevia = new Ext.Button({
			iconCls:'btn',
			text: 'Vista previa',
			tooltip: 'Vista previa',
			handler: function(){}
		});

		this.btnAyuda = new Ext.Button({
			iconCls:'btn',
			text: 'Ayuda',
			tooltip: 'Ayuda',
			handler: function(){}
		});

		this.fpExpresionformula = new Ext.FormPanel({
			frame: true,
			region:'north',
			layout: 'fit',
			height: 300,
			autoScroll: true,
			title:'Expresi&oacute;n matem&aacute;tica',
			items:[this.taExpresionformula],
			tbar: [this.btnValidar, this.btnVistaprevia, '->', this.btnAyuda]
		});

		/*Panel contenedor de los operadores y operandos*/
		this.pOperadores = new Ext.FormPanel({
			region: 'center',
			layout: 'fit',
			frame: true,

			title:'Operadores',
			items: [{
	            xtype:'fieldset',
	            title: 'Phone Number',
	            collapsible: true,
	            autoHeight:true,
	            defaults: {width: 210},
	            defaultType: 'textfield',
	            items :[{
	                    fieldLabel: 'Home',
	                    name: 'home',
	                    value: '(888) 555-1212'
	                },{
	                    fieldLabel: 'Business',
	                    name: 'business'
	                },{
	                    fieldLabel: 'Mobile',
	                    name: 'mobile'
	                },{
	                    fieldLabel: 'Fax',
	                    name: 'fax'
	                }
	            ]
	        }]
		});

		/*Panel contenedor del area de edicion de la formula y los operadores y operandos*/
		this.pContenedor = new Ext.Panel({
			region: 'center',
			layout: 'border',
			items: [this.fpExpresionformula, this.pOperadores]
		});



		/******************************************************************************************************************************************************************************/

		/*Propiedades de la ventana*/
		this.title = 'Editor de expresiones matem&aacute;ticas';
        this.items = [this.gpIndicadores, this.pContenedor];
		this.stIndicadores.loadData(this.indicadores);
        Ext.pvd.persona.formula.winFormula.superclass.initComponent.call(this);
    }
});