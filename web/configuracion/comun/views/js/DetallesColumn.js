/**
 * Ext.LOG.DetallesColumn Extensión
 *
 * @autor Javier González
 * @version 1.0
 *
 * @Clase Ext.LOG.DetallesColumn
 * @extends Ext.grid.Column
 * @param {Object}
 *            config Opciones de configuración
 *
 * new Ext.LOG.DetallesColumn({
			   header : 'Lotes',
			   title : 'Informaci&oacute;n',
			   msg : '<b>Lotes ubicados en el &aacute;rea:</b>',
			   detalles : 'Lotes',
			   dataIndex : 'lote',
			   icon : 'buscar'
  })
 * 
 * 
 *</code>
 */

// Creando el ámbito de objetos (Ext.LOG)
if (!Ext.LOG)
	Ext.ns('Ext.LOG');
var winDetalles;
Ext.LOG.DetallesColumn = Ext.extend(Object, {
    
/**
     * @cfg {String} header Any valid text or HTML fragment to display in the header cell for the row
     * number column (defaults to '').
     */
    header: "",
    msg : "",
	title : "",
	detalles : "",
	icon : "",
    
/**
     * @cfg {Number} width The default width in pixels of the row number column (defaults to 50).
     */
    width: 50,
    align: 'center',
    
    
/**
     * @cfg {Boolean} sortable True if the row number column is sortable (defaults to false).
     * @hide
     */
    sortable: false,
    
    constructor : function(config){
		Ext.apply(this, config);
		this.renderer = this.renderer.createDelegate(this);
		
    },

    fixed:true,
    menuDisabled:true,
    dataIndex: "",
    id: 'numberer',

    renderer : function(v, p, record, rowIndex){
       return String.format('<div style="text-align:center;"><img src="../../../../../lib/ExtJS/temas/default/images/iconos/'+this.icon+'.png"  onclick="new Ext.LOG.DetallesColumn().detalles({0},{1},{2},{3})"/></div>', "'"+v+"'", "'"+this.title+"'","'"+this.msg+"'","'"+this.detalles+"'");
    },
    detalles : function (data,title,msg,detalles){
			winDetalles = new Ext.Window({
						title:title,
						width:400,
						buttonAlign:'center',
						autoHeight: true,
						closeAction:'hide',
						bodyBorder :false,
						layout:'fit',
						defaults :{frame:true,border :false},
						items:new Ext.Panel({
							frame:true,monitorResize :true,
							autoHeight: true,layout:'column',
							items:[{columnWidth:.2,
								items: {style:'margin:2px 0px 0px 2px;',
									html:'<div id="iconoERROR" class="iconoERROR></div>'
								}
							},{ columnWidth:.7,
								items: {xtype:'panel',
									autoHeight: true,
									html:'<div id="pMSG">'+msg+'</div>'}
							},{ columnWidth:1,
								items: new Ext.form.FieldSet({
									autoScroll:true,
									layout:'form',title :detalles,
									autoWidth:true,html:'<div id="pDetalle">'+data+'</div>',
									autoHeight: true
								})
							}]
						}),
						buttons: [{text: 'OK',
							handler: function(){
								winDetalles.hide();
							}
						}]
					});
		
		winDetalles.show(Ext.getBody());
    }
});
