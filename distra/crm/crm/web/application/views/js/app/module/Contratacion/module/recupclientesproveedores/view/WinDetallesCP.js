Ext.define('RecupClientesProveedores.view.WinDetallesCP', {
    extend: 'Ext.window.Window',
    alias: 'widget.windetallescp',
    margin: false,
    width: 650,
    height: 550,
    closable : true,
    closeAction: 'hide',
    modal: true,
    resizable : false,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    autoScroll: true,
    layout: 'anchor',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.titleWinDetallesCP;

        me.initPanelPrincipal();
        me.initGridContactos();
        me.initGridCuentas();
        me.initGridContratos();
        me.initPanelDescripcion();

        me.items = [me.panelPrincipal, me.gpContactos, me.gpCuentas, me.gpContratos, me.pDescripcion];

        me.buttons = [{
            text: me.etiquetas.lbBtnCerrar,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipCerrar,
            action: 'cerrar'
        }];

        me.callParent();
    },
    initPanelPrincipal: function(){
        var me = this;

       me.tplPrincipal = new Ext.XTemplate(
        '<div class="recupcp-logo-container"><img src="{foto}" /></div>',
        '<div class="recupcp-container-info">',
            '<div class="recupcp-columns">',
                '<div class = "recupcp-info-item">',
                    '<label>'+me.etiquetas.lbCodigoREEUP+':</label><span>{codigo}</span>',
                '</div>',
                '<div class = "recupcp-info-item">',
                    '<label>'+me.etiquetas.lbCodigoNIT+':</label><span>{codigocontable}</span>',
                '</div>',
             '</div>',
            '<div class = "recupcp-info-item">',
                '<label>'+me.etiquetas.lbNombre+':</label><span>{nombre}</span>',
            '</div>',
            '<div class = "recupcp-info-item">',
                '<label>'+me.etiquetas.lbAbreviatura+':</label><span>{abreviatura}</span>',
            '</div>',
            '<div class = "recupcp-info-item">',
                '<label>'+me.etiquetas.lbDireccion+':</label><span>{direccion}</span>',
            '</div>',
           '<div class = "recupcp-info-item">',
                '<label>'+me.etiquetas.lbTelefono+':</label><span>{telefono}</span>',
            '</div>',
           '<div class = "recupcp-info-item">',
                '<label>'+me.etiquetas.lbCorreo+':</label><span>{correo}</span>',
            '</div>',
        '</div>'
       );

        me.panelPrincipal = Ext.create('Ext.panel.Panel', {
            bodyCls: 'recupcp-pprincipal',
            bodyStyle: {
                padding: '10px',
            },
            margin: '10 0 0 0',
            height: 150,
            tpl: me.tplPrincipal,
            data: []
        });

    },
    initGridContactos: function(){
        var me = this;

        me.storeContacto= Ext.create('Ext.data.Store',{
            fields: ['idcontacto', 'nombre', 'cargo', 'telefono', 'direccion'],
        });
        
        me.gpContactos = Ext.create('Ext.grid.Panel', {
            title:  me.etiquetas.lbContactos,
            margin: '10 0 0 0',
            height: 120,
            store: me.storeContacto,
            columns: [{
                text: me.etiquetas.lbNombre,
                sortable: false,
                fixed: true,
                width: 150,
                dataIndex: 'nombre'
            },{
                text: me.etiquetas.lbCargo,
                sortable: false,
                fixed: true,
                width: 150,
                dataIndex: 'cargo'
            },{
                text: me.etiquetas.lbTelefono,
                align: 'center',
                sortable: false,
                fixed: true,
                width: 100,
                dataIndex: 'telefono'
            },{
                text: me.etiquetas.lbDireccion,
                sortable: false,
                flex: 1,
                dataIndex: 'direccion'
            }]
        });
    },
    initGridCuentas: function(){
        var me = this;

        me.storeCuentas = Ext.create('Ext.data.Store',{
            fields: ['idcuenta', 'numerocuenta', 'titular', 'nombrebanco', 'numerosucursal'],
        });
        
        me.gpCuentas = Ext.create('Ext.grid.Panel', {
            title:  me.etiquetas.lbCuentas,
            margin: '10 0 0 0',
            height: 120,
            store: me.storeCuentas,
            columns: [{
                text: me.etiquetas.lbCuenta,
                sortable: false,
                fixed: true,
                width: 100,
                dataIndex: 'numerocuenta'
            },{
                text: me.etiquetas.lbTitular,
                sortable: false,
                flex: 1,
                dataIndex: 'nombrecuenta'
            },{
                text: me.etiquetas.lbBanco,
                align: 'center',
                sortable: false,
                fixed: true,
                width: 150,
                dataIndex: 'nombrebanco'
            },{
                text: me.etiquetas.lbSucursal,
                sortable: false,
                fixed: true,
                width: 150,
                dataIndex: 'numerosucursal'
            }]
        });
    },
    initGridContratos: function(){
        var me = this;

        me.storeContratos = Ext.create('Ext.data.Store',{
            fields: [
                {name: 'idcontrato', type: 'int'},
                {name: 'numero', type: 'string'},
                {name: 'numerocontrato', type: 'string'},
                {name: 'nombre', type: 'string'},
                {name: 'denominacion', type: 'string'},
                {name: 'fechainicio'},
                {name: 'tipocontrato', type: 'string'},
                {name: 'idtipocontrato', type: 'int'},
                {name: 'clienteproveedor', type: 'string'},
                {name: 'idclienteproveedor', type: 'int'},
                {name: 'fechafirma'},
                {name: 'montototal', type: 'float'},
                {name: 'idestado', type: 'int'},
                {name: 'idpadre', type: 'int'},
                {name: 'idestructuracomun', type: 'int'},
                {name: 'elemento', type: 'array'},
                {name: 'registropago', type: 'array'},
                {name: 'transicion', type: 'array'},
                {name: 'fechafin'},
                {name: 'idproforma'},
                {name: 'proforma', type: 'string'},
                {name: 'objeto', type: 'string'},
                {name: 'descripcion', type: 'string'},
                {name: 'contratomarco', type: 'boolean'},
                {name: 'cliente', type: 'boolean'},
                {name: 'idcontratomarco'},
                {name: 'idmediopago'},
                {name: 'mediopago', type: 'string'},
                {name: 'acciones', type: 'array'},
                {name: 'denominacioncontratomarco', type: 'string'},
                {name: 'estadoinicial', type: 'string'},
                {name: 'iconoestadoinicial', type: 'string'},
                {name: 'version', type: 'string'},
                {name: 'idsector'},
                {name: 'sector', type: 'string'},
                {name: 'numerojson', type: 'string'},
                {name: 'documentojson', type: 'string'},
                {name: 'vigente', type: 'int'},
                {name: 'vigencia'},
                {name: 'unidadtiempo'},
                {name: 'idpersona',mapping:'idresponsable'},
                {name: 'nombrepersona', type: 'string'},
                {name: 'idcondicionpago'},
                {name: 'condicionpago', type: 'string'},
                {name: 'idplantilla', type: 'string'},
                {name: 'idarea'},
                {name: 'nombrearea', type: 'string'}
            ]
        });
        
        me.gpContratos = Ext.create('Ext.grid.Panel', {
            title:  me.etiquetas.lbContratos,
            margin: '10 0 0 0',
            height: 130,
            store: me.storeContratos,
            columns: [{
                text: me.etiquetas.lbNumero,
                align: 'center',
                sortable: false,
                fixed: true,
                width: 120,
                dataIndex: 'numero'
            },{
                text: me.etiquetas.lbNombre,
                sortable: false,
                flex: 1,
                dataIndex: 'nombre'
            },{
                text: me.etiquetas.lbVigencia,
                align: 'center',
                sortable: false,
                fixed: true,
                width: 100,
                dataIndex: 'vigente',
                renderer: function (value, meta) {
                    meta.innerCls = value ? "icondistra-true verde" : "icondistra-false rojo";
                    meta.tdAttr = 'data-qtip="' + (value ? 'Vigente' : 'Fuera de vigencia') + '"';
                },
            },{
                text: me.etiquetas.lbFechaFirma,
                align: 'center',
                sortable: false,
                fixed: true,
                width: 100,
                dataIndex: 'fechafirma'
            }
            ,{
                xtype:'actioncolumn',
                width:40,
                align: 'center',
                iconCls: 'icondistra-detalles',
                tooltip: me.etiquetas.ttipBtnVerDetalles,
                handler: me.showWinDetallesContrato,
            }
            ]
        });
    },
    initPanelDescripcion: function(){
        var me = this;

        me.pDescripcion = Ext.create('Ext.panel.Panel', {
            title:  me.etiquetas.lbDescripcion,
            margin: '10 0 0 0',
            height: 120,
             bodyStyle: {padding: '10px',},
            tpl: new Ext.XTemplate('<div>{descripcion}</div>'),
            data: []
        });
    },
    show:function(record){
        var me = this,
            data = record.getData();
        
        data['foto'] = (data['foto'])? data['foto'] : this.getFotoDir(record);
        me.panelPrincipal.update(data);
        me.pDescripcion.update(data);

        me.storeContacto.removeAll();
        me.storeCuentas.removeAll();
        me.storeContratos.removeAll();

        me.callParent();

        me.showLoadingMask(true);
    },
    getFotoDir:function(record){
        var tipo, clasificacion;

        switch(record.get('idtipo')){
            case '1': tipo = 'cliente';break;
            case '2': tipo = 'proveedor';break;
            case '3': tipo = 'cliente-proveedor';break;
        }

        switch(record.get('idclasificacion')){
            case '1': clasificacion = 'entidad';break;
            case '2': clasificacion = 'persona';break;
        }

        return '/configuracion/comun/views/images/'+clasificacion + '_'+ tipo+'.png';
    },
    loadDetallesList: function(data){
        var me  = this;
        
        me.storeContacto.loadData(data['contactos']);
        me.storeCuentas.loadData(data['cuentas']);
        me.storeContratos.loadData(data['contratos']);
    },
    showLoadingMask: function(enable){
        var me = this;

       if(!me.loadMask)
            me.loadMask = new Ext.LoadMask(me, {msg:"Cargando..."});
        
        me.loadMask[(enable)?'show':'hide']();
    },
    showWinDetallesContrato: function(view, rowIndex, colIndex, item, e, record ){

        Ext.create('GestionContrato.view.DetailsWindow').show(record);
    }
});
