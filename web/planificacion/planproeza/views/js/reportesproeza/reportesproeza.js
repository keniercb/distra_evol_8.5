//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('reportesproeza', cargarReportesInterfaz);

function cargarReportesInterfaz() {
    //Para el trabajo con las unidades de medidad a partir de 'idumedida'
    stum = new Ext.data.Store({
        url: 'cargarUnidaddeMedida',
        id: 'stum',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }, {
                name: 'abreviaturaunidadmedida'
            }])
    });
    //Fin del store UM

    cargarReporteA();
    cargarInterfaz();
}

function cargarInterfaz() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'mep')
                mep = 1;
        }
    });
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });

    tabsReportes = new Ext.TabPanel({
        activeTab: 0,
        enableTabScroll: true,
        defaults: {autoScroll: true},
        id: 'tabsReportes',
        region: 'center',
        listeners: {
            tabchange: function (panel, tab) {

            }
        }
    });

    tabsReportes.add({
        id: 'tabReporteA',
        title: perfil.etiquetas.lbReporteA,
        layout: 'fit',
        items: [pContenedorA]
    });

    btnAyudaReportesProeza = new Ext.Toolbar.Button({
        id: 'btnAyudaReportesProeza',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbAyuda,
        tooltip: perfil.etiquetas.lbAyuda
    });

    panelView = new Ext.Panel({
        layout: 'fit',
        //tbar: ['->', btnAyudaReportesProeza],
        items: [tabsReportes]
    });
    myViewReportesProeza = new Ext.Viewport({
        layout: 'fit',
        items: [panelView]
    });

}

function renderUM(value, m) {
    if (value == '-') {
        m.attr = 'ext:qtip="' + value + '"';
        return value;
    } else {
        for (i in stum.data.items)
            if (stum.data.items[i].data.idunidadmedida == value) {
                m.attr = 'ext:qtip="' + stum.data.items[i].data.abreviaturaunidadmedida + '"';
                return stum.data.items[i].data.abreviaturaunidadmedida;
            }
        m.attr = 'ext:qtip="' + value + '"';
        return value;
    }
}

function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}

function crearToolTipDenom(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return '<p style="white-space:pre">' + v + '</p>';
}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + " - <i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

