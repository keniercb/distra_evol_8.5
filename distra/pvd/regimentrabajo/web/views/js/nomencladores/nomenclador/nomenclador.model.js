/**
 * Modelos de funcionalidad de nomenclador
 *
 * @author Ing. Javier Rodríguez López
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */
Ext.ns('Ext.pvd.persona.nomenclador');

Ext.pvd.persona.nomenclador.Model = {

	init: function (perfil)
	{

		this.tlNomenclador = new Ext.tree.TreeLoader({
			dataUrl: 'getNomencladores'
		});
		this.storeInicio = new Ext.data.SimpleStore({
			fields: [
                {name:'idnomenclador'},
				{name: 'denominacion'},
				{name: 'src'},
				{name: 'descripcion'},
				{name: 'imagen'}
			]
		});
	}

};