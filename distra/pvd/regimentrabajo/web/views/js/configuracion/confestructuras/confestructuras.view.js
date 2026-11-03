
Ext.ns('RegimenTrabajo.Confestructuras');

RegimenTrabajo.Confestructuras.Vista = {

    init: function (idioma, modelo) {
        var self = this;

        this.btnAyuda = new Ext.Button({
           id:'btnAyudaRTDMasivo',
           text: idioma.btnAyuda,
           iconCls:'ayuda',
           disabled: false,
           tooltip:idioma.lbBtnAyuda
       });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: 'Adicionar',
            tooltip: '',
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: 'Modificar',
            tooltip: '',
            iconCls: 'modificar'
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            text: 'Eliminar',
            tooltip: '',
            iconCls: 'eliminar'
        });

        //Listado
        this.listadoEstructuras = new Ext.grid.GridPanel({
            height: 527,
            store: modelo.store,
            border: false,
            loadMask: {msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit       : true,
                startCollapsed : false,
                groupTextTpl   : '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Estructuras" : "Estructura"]})'
            }),
            columns: [
                {
                    header: '',
                    width:300,
                    hidden: true,
                    dataIndex: 'entidad'
                },
                {
                    header: 'Estructuras',
                    width:100,
                    dataIndex: 'estructura'
                }
            ]
        });

        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            region: 'center',
            items: [this.listadoEstructuras]
        });

        this.EstructuraPadre = new Ext.components.TreeComboBox({
            anchor:	'100%',
            allowBlank: false,
            fieldLabel: 'Estructura',
            id: 'EstructuraPadre'+self.panel.id,
            treeConfig: {
                rootVisible: false,
                loader: modelo.estructurapadre,
                border: false,
                autoScroll: true
            }
        });

        this.EstructurasHijas = new Ext.tree.TreePanel({
            title: 'Estructuras',
            split:false,
            autoScroll:true,
            region: 'south',
            disabled: true,
            height: 350,
            border:false,
            layout: 'fit',
            loader: modelo.estructuras,
            root: new Ext.tree.AsyncTreeNode({
                text:'Estructuras',
                id: 0
            })
        });

        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            region: 'center',
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.EstructuraPadre]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });

        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            layout: 'border',
            width: 600,
            height: 500,
            items: [this.formularioGestion, this.EstructurasHijas],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });

        this.VP = new Ext.Viewport({
            layout: 'fit',
            items: [{
                region: 'center',
                id:'panelp',
                layout: 'fit',
                frame:true,
                tbar:[
                    this.btnAdicionar,
                    this.btnModificar,
                    this.btnEliminar,'','-',
                    '->', '','-',this.btnAyuda
                ],
                items: [this.panel]
            }]
        });
    }

};
//Inicializando la vista.
UCID.portal.cargarEtiquetas('confestructuras', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = RegimenTrabajo.Confestructuras.Modelo;
  modelo.init();

    //Inicializando la vista.
    var vista = RegimenTrabajo.Confestructuras.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    RegimenTrabajo.Confestructuras.Controlador.init(idioma, vista, modelo);
});

