Utilidades.Cmp.CmpBotonesComplementarios = function(opcionesConfig)
{
	var _this = this;
	var perfil = eval(uneval(window.parent.UCID.portal.perfil));
	//objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();
	
	//elemento sobre el cual se trabaja
	this.elemento = opcionesConfig.elemento;
	
	//store del combo que muestra las acciones sobre el DHW
	this.stacciones = new Ext.data.SimpleStore({
        id:'stcbActivo',
        fields: ['idaccion', 'nombreaccion','icono'],
        data :[
			[1, 'Cierre','lote.png'],
			[2, 'Actualizar','lote.png']
		]
    });
	
	//combo que muestra las acciones sobre el DWH
	this.cbacciones = new Ext.form.ComboBox({
        //id : 'cbActivo',
        //name: 'cbActivo',
        store: _this.stacciones,
        displayField:'nombreaccion',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus:true,
        editable:true,
        hiddenName: 'idaccion',
        valueField: 'idaccion',
        width:200,
        emptyText:'Acciones para el Almacen de Datos',
        listeners:{
            select:function(cmb){
				_this.EjecutarAccionSobreDWH();
			}
        }
    });
		
	
	//funcion que ejecuta la accion sobre el DWH
	this.EjecutarAccionSobreDWH = function()
	{
		var mensajemascara = 'Efectuando cierre';
		var mensajeconfirmacion = 'El cierre se est&aacute; efectuando correctamente.';
		var mensajeerror = 'No se ha podido efectuar el cierre correctamente.';
		if(_this.cbacciones.getValue() == 2)
		{
			mensajemascara = 'Efectuando actualizaci&oacute;n';
			mensajeconfirmacion = 'La actualizaci&oacute;n se est&aacute; efectuando correctamente.';
			mensajeerror = 'No se ha podido efectuar la actualizaci&oacute;n correctamente.';
		}		
		_this.BarraProgreso.show(mensajemascara);				
		Ext.Ajax.request({						
			url:'/planificacion/planmeta/index.php/cmpcomplementario/efectuaracciondwh',						
			params:{
				elemento:_this.elemento,
				accion:_this.cbacciones.getRawValue()
			},						
			callback: function(options,success,response)
			{									
				_this.BarraProgreso.hide();											
				responseData = Ext.decode(response.responseText);
				mensaje = mensajeconfirmacion;
				if(responseData.mensaje != 1)
				{mensaje = mensajeerror;} 
				mostrarMensaje(responseData.mensaje,mensaje,function()
				{				  
				});												
			}
		});
	}
}