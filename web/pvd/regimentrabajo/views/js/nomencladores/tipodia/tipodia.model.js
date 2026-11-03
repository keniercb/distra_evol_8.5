Ext.ns('Ext.Zeolides.Nomtipodia');

Ext.Zeolides.Nomtipodia.Modelo = {

	init: function () {
        //Store del grid de tipo de dia
        this.storeTipodia = new Ext.data.Store({
            url: 'cargarDias',
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idtipodedia"
            }, [{name: 'idtipodedia'},
                {name: 'denominacion'},
                {name: 'descripcion'},
                {name: 'fdesde'},
                {name: 'fhasta'},
                {name: 'trabajo'},
                {name: 'color'}
            ]),
            baseParams:{
                criterio:-1
            }
        });
	
    	
}

}

