Ext.ns('Ext.Zeolides.NomCausa');

Ext.Zeolides.NomCausa.Modelo = {

	init: function () {
        this.stcamporeporteausencia = new Ext.data.Store({
            url: 'getcamposreporteausencia',
            reader:new Ext.data.JsonReader({
                    root: "datos",
                    id: 'idvariablesconfreportescertificaciones'
                },
                [
                    {name:'idvariablesconfreportescertificaciones'}, {name:'denominacionvariable'}
                ])
        });

        this.stCausaasistencia = new Ext.data.Store({
            url: 'getcausasausencias',
            reader:new Ext.data.JsonReader({
                root: "datos",
                id: "idcausa"
            }, [{name: 'idcausa'},
                {name: 'denominacion'},
                {name: 'marcado'}
            ])
        });

        this.TreePanelLoader = new Ext.tree.TreeLoader({
            dataUrl:'/pvd/regimentrabajo/index.php/nomcausa/getDenomCausa',
            preloadChildren:true
        });


    }

}

