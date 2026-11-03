var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();

UCID.portal.cargarEtiquetas('transportacion', cargarInterfaz);
Ext.QuickTips.init();
var rep, strFormatoReporte, cmbFormatoReporte, cmbReportes, stReportes, v_reportes;
var btnEjecutar, btnAdicionar, btnEliminar, btnModificar, btnAyuda, btnConfigurar, vpServicios, pReportes, pBarras, winReporte1, reporte;

function cargarInterfaz() {

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando,
        removeMask: false
    });

    stReportes = [[1, 'RESUMEN DEL PLAN POR VIA DE ADQUISICION'],
        [2, 'RESUMEN COMPARATIVO DEL PLAN POR CONCEPTOS'],
        [3, 'RESUMEN DE PRODUCTOS POR OACE'],
        [4, 'RESUMEN DE PRODUCTOS SI POR OACE']];

    cmbReportes = new Ext.form.ComboBox({
        store: stReportes, // direct array data
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        selectOnFocus: true,
        width: 260,
        listeners: {
            select: function(combo, record, index) {
                rep = index + 1;
                cmbFormatoReporte.setDisabled(false);
            }
        }
    })

    strFormatoReporte = [[1, 'HTML'], [2, 'PDF'], [3, 'EXCEL'], [3, 'CSV']];

    cmbFormatoReporte = new Ext.form.ComboBox({
        id: 'cmbFormatoReporte',
        store: strFormatoReporte,
        width: 80,
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        emptyText: perfil.etiquetas.lbSeleccione,
        selectOnFocus: true,
        disabled: true,
        listeners: {
            select: function(combo, record, index) {
                btnConfigurar.enable();
            }
        }
    });

    btnAyuda = new Ext.Button({
        disabled: false,
        id: 'btnAyuda',
        tabIndex: 2,
      //  icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        handler: function() {
        }
    });

    btnAdicionar = new Ext.Button({
        disabled: false,
        id: 'btnAdicionar',
        tabIndex: 2,
       // icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        text: perfil.etiquetas.lbBtnAdicionar,
        handler: function() {

        }
    });
    btnEliminar = new Ext.Button({
        disabled: false,
        id: 'btnEliminar',
        tabIndex: 2,
        //icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        text: perfil.etiquetas.lbBtnEliminar,
        handler: function() {

        }
    });

    btnModificar = new Ext.Button({
        disabled: false,
        id: 'btnModificar',
        tabIndex: 2,
        //icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        text: perfil.etiquetas.lbBtnModificar,
        handler: function() {

        }
    });
    pBarras = new Ext.Panel({
        tbar: [btnAdicionar, '-', btnModificar, '-', btnEliminar, '-',
            new Ext.Toolbar.TextItem(perfil.etiquetas.lbReporte),
            cmbReportes, '-',
            new Ext.Toolbar.TextItem(perfil.etiquetas.lbFormato),
            cmbFormatoReporte, '->',
            btnAyuda],
        region: 'north',
        autoHeight: true,
        border: true
    })

    pReportes = new Ext.Panel({
        id: 'pcm',
        region: 'center',
        layout: 'fit',
        border: false,
        frame: false
    });

    vpServicios = new Ext.Viewport({
        layout: 'border',
        items: [pBarras, pReportes]
    });

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        v_reportes = UCID.portal.getAccionesReportes();
    });
}
