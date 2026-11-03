/**
	* @Uso: 	Panel para mostrar datos personales.
	* @autor:   Ing. Adrián García Leyva
	* @version: 1.0
*/
Ext.ns('Ext.pvd.persona.informacionpersona');
Ext.QuickTips.init();
Ext.pvd.persona.informacionpersona.Utils = function() {
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
var utils = new Ext.pvd.persona.informacionpersona.Utils();
Ext.QuickTips.init();
var _this =null;
Ext.pvd.persona.informacionpersona.panelInformacionpersona = Ext.extend(Ext.Panel,{
    region:(this.region ? this.region : 'center'),
    layout:(this.layout ? this.layout : 'border'),
    frame:false,
    border: false,
    idpersona: this.idpersona,
	datospersona: this.datospersona,
    nombre: this.nombre,
    hideBorders: true,
    initComponent: function() {
        _this = this;
        this.plantillaFoto = new Ext.XTemplate(
					'<center><img src="{dirfoto}" height=130 width=130 style="cursor:pointer;border:1px solid 000" /></center>'
		);
		this.plantillaFoto.compile();
		
		this.plantillaInformacion = new Ext.XTemplate(
		    '<p class="estiloinfo"> {nombre}    </p>','<br/>',
		    '<p><b> {sexo} 	 	</b></p>','<br/>',
		    '<p><b> {categoria} </b></p>','<br/>',
		    '<p><b> {linea}     </b></p>','<br/>',
		    '<p><b> {cargo}    </b></p>'
		);
		this.plantillaInformacion.compile();
		
		this.pinformacion = new Ext.Panel({
						width : 300,
						height : 200,
						border : true,
						region: 'center',
						id: 'pinformacion',
						bodyStyle:'padding:0 0 0 60px;',
						autoShow : true,
						listeners: {
							render: function(){
							      var ip = {nombre: 'Sin informaci&oacute;n', sexo: '', categoria: '', linea: '', cargo: ''};
								  _this.plantillaInformacion.overwrite(_this.pinformacion.getEl(), ip);
							   }
						}
		});		
						
		this.fsfoto = new Ext.Panel({
						id : 'fsfoto',
						width : 135,
						height : 135,
						border: true,
						listeners: {
							render: function(){
							      var df = {dirfoto: '/pvd/repositorio_persona/persona/personaimgs/persona.jpg'};
								  _this.plantillaFoto.overwrite(_this.fsfoto.getEl(), df);
							   }
						}
		});
		
        this.items = [{
					columnWidth : .4,
					layout : 'form',
					items : [this.fsfoto]
					},{
						columnWidth : .6,
						layout : 'form',
						items : [this.pinformacion]
					}];
        Ext.pvd.persona.informacionpersona.panelInformacionpersona.superclass.initComponent.call(this);
    },
    
    cargardatosPersona: function(fila) {
			Ext.Ajax.request({
						url : '/pvd/comun/index.php/informacionpersonacomp/getdatpersona',
						method : 'POST',
						params : {
							idpersona : fila.data.idpersona
						},
						callback : function(o,r, respuesta) {							
						var valor = Ext.decode(respuesta.responseText);
						_this.cargarInformacion(fila,valor[0]);
						}
					});
		},
		
	cargarInformacion: function(fila,valor){
		this.datospersona = valor;
		if(valor.idfoto){
			var fotopersona = valor.idpersona;
			var extensionfoto = valor.extension;
		}	
		else{
			var fotopersona = "persona";
			var extensionfoto = ".jpg";
		}	
			
		var df = {dirfoto: '/pvd/repositorio_persona/persona/personaimgs/'+fotopersona+extensionfoto};
		
		var nombre = fila.data.nombre;
		if(fila.data.snombre)
			nombre += ' ' + fila.data.snombre;
		nombre += ' ' + fila.data.papel + ' ' + fila.data.sapel;
		
		var ip = {nombre: nombre, sexo: valor.sexo, categoria: valor.categoria, linea: valor.linea, cargo: valor.cargo};
		this.plantillaFoto.overwrite(this.fsfoto.getEl(), df);
		this.plantillaInformacion.overwrite(this.pinformacion.getEl(), ip);
	},
	getDatospersona: function(){
	  return this.datospersona;
	}
	
});