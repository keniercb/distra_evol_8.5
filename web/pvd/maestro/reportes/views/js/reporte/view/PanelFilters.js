Ext.ns('Maestro.Reporte.view');

Maestro.Reporte.view.PanelFilter = Ext.extend( Ext.FormPanel, {
    region: 'north',
    labelAlign: 'top',
    bodyStyle : {
        padding: '10px 10px 0 10px',
        background: '#DFE8F6',
        borderBottom: '1px solid #99BBE8',
    },
    autoHeight : true,
    region: 'north',
    hidden: true, 
    layout:'column',
    border:false,
    frame: true,
  	initComponent: function() {
    	 var me = this,
    		  idiom = Maestro.Reporte.idiom;

    	  me.btnSearch = new Ext.Button({
            text: idiom.lbBtnSearch,
            tooltip: idiom.lbBtnTtpSeach,
            iconCls : 'buscar',
        });

      	me.btnClean = new Ext.Button({
  		      text: idiom.lbBtnClean,
            tooltip: idiom.lbBtnTtpClean,
            iconCls : 'limpiar',
        });
        
        me.checkbFormatoExcel = new Ext.form.Checkbox({
            name: 'otroformato',
            inputValue: 1,
            fieldLabel: '',
            labelSeparator: '',
            //hidden: true,
            boxLabel: 'Exportar a hoja de c&aacute;lculo'
        });

        //me.items = [me.checkbFormatoExcel, {/*items: [me.checkbFormatoExcel], */border:false, layout: 'form', style:'float: right;padding-top: 15px;', buttons: [me.btnSearch, me.btnClean]}];
        //me.items = [/*{frame: true, columnWidth: 0.15, border:false, layout: 'form', items: [me.checkbFormatoExcel]}, */{items: [me.checkbFormatoExcel], border:false, layout: 'form', style:'float: right;padding-top: 15px;', buttons: [me.btnSearch, me.btnClean]}];
        me.items = [{olumnWidth: 0.25, border:false, layout: 'form', items: [me.checkbFormatoExcel]}, {border:false, layout: 'form', style:'float: right;padding-top: 15px;', buttons: [me.btnSearch, me.btnClean]}];

        Maestro.Reporte.view.PanelFilter.superclass.initComponent.call(this);
    }
});