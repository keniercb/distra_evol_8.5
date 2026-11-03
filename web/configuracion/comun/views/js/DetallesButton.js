

/**
 * @author Zaruman
 * @copyright 2012
 */

// Creando el ámbito de objetos (Ext.LOG)
if (!Ext.LOG)
	Ext.ns('Ext.LOG');
 var winDetalles;
 Ext.LOG.DetallesButton = function(config) {
  Ext.apply(this, config);
  Ext.LOG.DetallesButton.superclass.constructor.call(this);
};

Ext.LOG.DetallesButton = Ext.extend(Ext.LOG.DetallesButton, Ext.util.Observable, {
    
/**
     * @cfg {String} header Any valid text or HTML fragment to display in the header cell for the row
     * number column (defaults to '').
     */
    msg : "",
	title : "",
	detalles : "",
    
/**
     * @cfg {Number} width The default width in pixels of the windows (defaults to 350).
     */
    width: 350,
    //align: 'center',
    
    
/**
     * @cfg {Boolean} sortable True if the row number column is sortable (defaults to false).
     * @hide
     */
    sortable: false,
    fixed:true,
    menuDisabled:true,
    dataIndex: "",
    id: 'numberer',
	
	mostrarDetallesButton : function(v){
        this.detallesWin(v,this.title,this.msg,this.detalles,this.width);
    },
    detallesWin : function (data,title,msg,detalles,width){
	    if(!winDetalles){
			winDetalles = new Ext.Window({
				title:title,
				width:width,
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
		}
		winDetalles.show(Ext.getBody());
    }
});


