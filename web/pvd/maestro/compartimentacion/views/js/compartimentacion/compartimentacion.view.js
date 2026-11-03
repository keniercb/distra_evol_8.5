/*
 * Compartimentacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Compartimentacion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Maestro.Compartimentacion');

Ext.QuickTips.init();
 
///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////

Pvd.Maestro.Compartimentacion.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function(idioma, modelo) {

        this.smUser = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: idioma.lbBtnBuscar,
            tooltip: idioma.textToolTipBuscar,
            iconCls: 'buscar'
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            text: idioma.lbBtnLimpiar,
            tooltip: idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width:140,
            name : 'tfbuscador'
        });
	
		//Listado de valores usuarios.
        this.gpUsuarios = new Ext.grid.GridPanel({
			region: 'center',
			width: '50%',
            //frame: true,
            border: true,
            tbar: ['',
                'Usuario:',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar,'','-'
            ],
            sm: this.smUser,
            title: idioma.lbListadoUser,
            store: modelo.stUsuarios,
            columns: [this.smUser,
                {
                    header: 'Usuario',
                    width:300,
                    dataIndex: 'nombreusuario'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stUsuarios,
                displayInfo: true,
                displayMsg: 'Mostrando {0} - {1} de {2}',
                emptyMsg: 'No hay registros para mostrar'
            })
        });

        this.smCom = new Ext.grid.CheckboxSelectionModel({
             singleSelect: false
        });
		
		//Listado de valores compartimentaciones.
        this.gpCompartimentaciones = new Ext.grid.GridPanel({
            title: idioma.lbListadoCom,
			region: 'east',
			width: '50%',
            disabled: true,
            frame: true,
            border: false,
            selModel: this.smCom,
            //sm: this.smCom,
            store: modelo.stCompartimentaciones,
            columns: [this.smCom,
                {
                    header: 'Denominaci&oacute;n',
                    width:300,
                    dataIndex: 'denominacion'
                }
            ]/*,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stUsuarios,
                displayInfo: true
            }) */
        });

        this.btnGuardar = new Ext.Button({
            iconCls: 'guardar',
            tooltip: idioma.ttBtnGuardar,
            text: 'Guardar'
        });

        this.panelGen = new Ext.Panel({
            layout: 'border',
            frame: true,
            border: true,
            region: 'center',
            buttons: [this.btnGuardar],
            items: [this.gpUsuarios, this.gpCompartimentaciones]
        });
       
        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [this.panelGen]
        });

	}
};

	//Inicializando la vista.
	UCID.portal.cargarEtiquetas('compartimentacion', function(perfil, idioma){
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;
    
    //Inicializando el modelo
    var modelo = Pvd.Maestro.Compartimentacion.Modelo;
    modelo.init();
    
    //Inicializando la vista.
    var vista = Pvd.Maestro.Compartimentacion.Vista;
    vista.init(idioma, modelo);
    
    //Inicializar controlador.
    Pvd.Maestro.Compartimentacion.Controlador.init(idioma, vista, modelo);
});
