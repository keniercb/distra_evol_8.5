/**
 * Combobox para mostrar los grupos escalas.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Nomencladores.NomGrupoEscala');
Ext.QuickTips.init();

Pvd.Nomina.Nomencladores.NomGrupoEscala.comboGrupoEsc = Ext.extend(Ext.form.ComboBox,{
    valueField:'idgrupoescala',
	displayField:'denominacion',
	hiddenName:'idgrupoescala',     
	loadingText : 'Cargando...', 
	mode:'local',   
	triggerAction:'all',
	forceSelection:true, 
	typeAhead:true, 
	// selectOnFocus:true,
	enableKeyEvents :true,
	msgTarget : 'qtip',
	enableQtip : true,	
	editable:true, 
	extendField: 'descripcion',   
	emptyText:'Seleccione...',
    initComponent: function() {
		var me = this;
		
        this.store = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/nomgrupoescala/obtenerTodosGruposEscala',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", root: "datos", id: "idgrupoescala" }, 
			[ 	 {name: 'idgrupoescala'}
				,{name: 'denominacion'}	
				,{name: 'descripcion'}	
			])
		});
		
		Pvd.Nomina.Nomencladores.NomGrupoEscala.comboGrupoEsc.superclass.initComponent.call(this);
		
		me.on('expand', function(){
			this.store.load();
		})
    },
	cargarStore: function(){
		this.store.load();
	}
});
