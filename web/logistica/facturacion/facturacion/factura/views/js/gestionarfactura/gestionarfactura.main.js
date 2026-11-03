/**
 * Esta clase crea los componentes que gestiona las facturas
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */

/*var getConfigFacturacion = function() {
    Ext.Ajax.request({
        url: 'cargarConfiguracion',
        method: 'POST',
        callback: function(opts, success, response) {

        }
    });
}*/
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.fact.Idioma, LOG.util.Idioma);
    var cmbOperaciones = new LOG.util.LovCombo({
        fieldLabel: idioma.lbOperacion,
        emptyText: idioma.cbEmtyText,
        editable: false,
        url: 'cargarSubsistemas',
        hiddenName: 'idnomoperaciones',
        valueField: 'idnomoperaciones',
        displayField: 'denominacion',
        listeners: {
            select: function (cmb, rd) {

            }
        }
    });

    var cmbCentroCosto = new LOG.util.ComboBox({
        url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCentroCostos',
        hiddenName: 'idcentrocosto',
        fieldLabel: 'Centro de costo',
        valueField: 'idcentrogrupo',
        displayField: 'text',
        mode: 'local',
        pageSize: 20,
        resizable: true
    });

    var entregarA = new LOG.util.ComboBox({
        fieldLabel: idioma.cmEntregarA,
        //editable: false,
        url: 'cargarClientes',
        hiddenName: 'idcliente',
        valueField: 'idclientesproveedores',
        displayField: 'nombre',
        triggerAction: 'all',
        enableQtip: true,
        pageSize: 20,
        minChars: 0,
        mode: 'remote'
    });
    var tipoDocumento = new LOG.util.ComboBox({
        fieldLabel: idioma.cmTipoDocumento,
        editable: false,
        url: 'cargarTipoDocumento',
        hiddenName: 'iddoc',
        valueField: 'iddoc',
        displayField: 'sigla'
    });
    var estado = new LOG.util.ComboBox({
        fieldLabel: idioma.cmEstado,
        hiddenName: 'estado',
        valueField: 'idestado',
        displayField: 'estado',
        editable: false,
        mode: 'local',
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]],
                [4, LOG.lb.documento.Estado[4]],
                [7, LOG.lb.documento.Estado[7]],
                [5, LOG.lb.documento.Estado[5]],
                [10, LOG.lb.documento.Estado[10]],
            ]
        })
    });
    var ano = LOG.util.Prototipos.inputEntero({
        fieldLabel: idioma.lbAnno,
        name: 'anno',
        hiddenName: 'anno'
    });
    var comboCreadoPor = new LOG.lb.documento.ComboUsuarios({
        fieldLabel: idioma.lbCreadoPor,
        editable: false,
        campo: 'idusuario',
        alias: 'facturaLog',
        subsistema: LOG.util.Subsistemas.facturacion,
        hiddenName: 'idusuario'
    });

    var comboDocOrigen = new LOG.util.ComboBox({
        fieldLabel: idioma.cmDocOrigen,
        //editable: false,
        typeAhead: true,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus:true,
        url: 'cargarDocumentosOrigen',
        hiddenName: 'idpadre',
        valueField: 'idpadre',
        displayField: 'nrodoc',
        autoLoad: false,
        mode: 'remote',
        pageSize: 30,
        minChars: 1,
    });
    var comboDeposito = new LOG.util.ComboBox({
        fieldLabel: idioma.lbDeposito,
        editable: true,
        url: 'cargarDepositosBusqueda',
        hiddenName: 'iddeposito',
        valueField: 'iddeposito',
        //autoLoad: false,
        displayField: 'deposito',
        mode: 'remote',
        tpl: '<tpl for="."><div style="color:{color}" class="x-combo-list-item"> <div><b>Dep\xf3sito:</b> {deposito}</div><div><b>Estado:</b> {denestado}</div> </div></tpl>',
        otherFields: [{
            name: 'codigo'
        }, {
            name: 'estado'
        }, {
            name: 'denestado'
        }, {
            name: 'color'
        }, {
            name: 'text'
        }]
    });

    var gridPlugins = new LOG.util.List();
   /* gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'nrocomprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));*/

    var vpFactura = new LOG.fact.facturacion({
        idioma: idioma,
        modoSeleccion: 3,
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        busquedaBasica: true,
        configFacturacion: configfact,
        urlBusquedaGridPrincipal: 'cargarFacturas',
        autoLoad: false,
        idsubsistema: null,
        cmbFindDocOrigen: comboDocOrigen,
        cmbFindDeposito: comboDeposito,
        cmbFindOperacion: cmbOperaciones,
        gridPlugins: gridPlugins
    });


    var desde = new Ext.form.DateField({
        fieldLabel: idioma.lbDesde,
        name: 'desde',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta'
    });
    var hasta = new Ext.form.DateField({
        fieldLabel: idioma.lbHasta,
        name: 'hasta',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde'
    });

    comboDocOrigen.getStore().on('beforeload', function(){
        comboDocOrigen.getStore().baseParams.idsubsistema = vpFactura.idsubsistema;
    });

    comboDeposito.getStore().on('beforeload', function(){
        comboDeposito.getStore().baseParams.idsubsistema = vpFactura.idsubsistema;
    });
    vpFactura.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 3,
        firmas: [
            'facturadopor',
            'contabilizadopor',
            'entregadopor'
        ],
        entidadDeLaPersona: {
            'entregadopor': -1
        }
    }));
    vpFactura.init();
    vpFactura.getPanelSuperior().onRender = vpFactura.getPanelSuperior().onRender.createSequence(function() {
        vpFactura.getPanelSuperior().add(vpFactura.createComboSubsistemas());
        vpFactura.getPanelSuperior().doLayout();
    });
    /**
     * Adicionar los componentes al panel de busqueda
     */
    vpFactura.getPanelBusqueda().setColumns(1);

    var frmBusqAvanz = new LOG.util.ColumnForm(2);
    var frmOperacion = new LOG.util.ColumnForm(2);
    var frmDeposito = new LOG.util.ColumnForm(2);
    var frmFecha = new LOG.util.ColumnForm(2);
    var frmFechaRango = new LOG.util.ColumnForm(2);
    frmOperacion.addComponent(cmbOperaciones);
    frmOperacion.addComponent(cmbCentroCosto);
    frmOperacion.getColumn(0).columnWidth = 0.5;
    frmOperacion.getColumn(1).columnWidth = 0.5;
    frmOperacion.getColumn(0).getComponent(0).anchor = '98%';
    frmOperacion.getColumn(1).getComponent(0).anchor = '98%';
    frmBusqAvanz.addComponent(entregarA);
    frmBusqAvanz.addComponent(tipoDocumento);
    frmBusqAvanz.addComponent(estado);
    frmBusqAvanz.addComponent(ano);
    frmBusqAvanz.addComponent(comboCreadoPor);
    frmBusqAvanz.addComponent(comboDocOrigen);
    frmDeposito.addComponent(comboDeposito);
    frmDeposito.getColumn(0).columnWidth = 1;
    frmDeposito.getColumn(0).getComponent(0).anchor = '99%';
    frmFechaRango.addComponent(desde);
    frmFechaRango.addComponent(hasta);
    frmFecha.addComponent(new Ext.form.FieldSet({
        title: idioma.tRangoFecha,
        anchor: '100%',
        items: [frmFechaRango]
    }));
    frmFecha.getColumn(0).columnWidth = 1;
    frmFecha.getColumn(0).getComponent(0).anchor = '99%';
    vpFactura.addFilterComponent(frmOperacion);
    vpFactura.addFilterComponent(frmBusqAvanz);
    vpFactura.addFilterComponent(frmDeposito);
    vpFactura.addFilterComponent(frmFecha);
    /**
     * Crear la interfaz principal
     */
    vpFactura.view();
});