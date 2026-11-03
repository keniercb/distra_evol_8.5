Ext.define('Ext.ux.Report', {
    extend: 'Ext.Window',
    height: 500,
    name: 'mywin',
    id: 'mywin',
    width: 900,
    layout: 'fit',
    title: 'CRM Reporte',
    //minimizable: true,
    maximizable: true,
    closable: true,
    constrain: true,
    constructor: function (config) {
        var me = this;
        Ext.apply(this, config || {});
        if (!this.params) {
            console.log('Al reporte no se la ha configurada la propiedad params. Ej: [{name:p1:value:v1,type:"string"},{name:p2:value:v2,type:"int"}]')
        }
        this.refactParams();
        this.createBody();
        Ext.ux.Report.superclass.constructor.call(this, config);
        this.show();
    },
    createBody: function () {
        var me = this;

        var data = {
            usuario: me.usuario,
            clave: me.clave,
            recurso: me.nombrereporte + me.tipohoja + me.orientacion + '.jrxml',
            formato: "PDF",
            idplantilla: me.idplantilla,
            parametros: me.params,
            bd: me.bd,
            host: me.host,
            usuariobd: me.usuariobd,
            password: me.password,
            port: me.port
        };

        this.stFormatosReporte = new Ext.data.SimpleStore({
            fields: [{name: 'valor'}, {name: 'denominacion'}],
            data: [['PDF', 'PDF'], ['XLS', 'XLS'], ['XLSX', 'XLSX (Paginado)'], ['DOCX', 'DOCX'], ['PPTX', 'PPTX'], ['RTF', 'RTF'], ['ODT', 'ODT'], ['CSV', 'CSV']]
        });

        this.btnJasperGenerarReporte = new Ext.Button({
            id: 'btnJasperGenerarReporte',
            width: 120,
            iconCls: 'exportar',
            text: 'Exportar Reporte',
            tooltip: 'Exportar reporte',
            listeners: {
                scope: this,
                click: function () {
                    window.open(this.buildUrl());
                }
            }
        });

        this.btnRecargar = new Ext.Button({
            id: 'btnrecargarReporte',
            width: 120,
            iconCls: 'recargar',
            text: 'Recargar Reporte',
            tooltip: 'Exportar reporte',
            listeners: {
                scope: this,
                click: function () {
                    Ext.getCmp("idpanel").destroy();
                    me.reportpanel = this.createReportPanel();
                    Ext.getCmp("mywin").add([me.reportpanel]);
                }
            }
        });

        me.cbFormatosReporte = new Ext.form.ComboBox({
            id: 'idformatos',
            width: 150,
            editable: false,
            valueField: 'valor',
            value: 'PDF',
            displayField: 'denominacion',
            allowBlank: false,
            queryMode: 'local',
            store: this.stFormatosReporte
        });

        me.reportpanel = this.createReportPanel();
        me.tbar = ['->', me.btnRecargar, me.btnJasperGenerarReporte, me.cbFormatosReporte];
        me.items = [me.reportpanel];
    },
    createReportPanel: function () {
        return new Ext.Panel({
            id: 'idpanel',
            labelAlign: 'top',
            labelWidth: 15,
            height: 500,
            width: 900,
            html: '<iframe id="idframe" frameborder="0" src="' + this.buildUrl('PDF') + '" width="100%" height="100%"></iframe>'
        });
    },
    buildUrl: function (format) {
        var dir = this.getReporteJasperUrl(),
            params = {
                formato: format || this.cbFormatosReporte.getValue(),
                recurso: this.nombrereporte + '.jrxml',
                idplantilla: this.idplantilla || null,
                filters: (this.params) ? Ext.encode(this.params) : null
            };
        console.log('config: ',params)
        console.log('config: ',Ext.encode(params))
        console.log('url:', document.location.protocol + '//' + document.location.host + dir + '?' + Ext.urlEncode(params))
        return document.location.protocol + '//' + document.location.host + dir + '?' + Ext.urlEncode(params);
    },
    getReporteJasperUrl: function () {
        return (function () {
            var nomModule = ModuleMgr.get('ConfiguracionGral').moduleCfg;
            return '/' + nomModule.getBasePath() + 'index.php/componentereportes/getReporteJasperData';
        })();
    },
    refactParams: function () {
        if (this.params && Ext.isArray(this.params)) {
            var result = [];
            for (var k in this.params) {
                var type = this.getJavaType(this.params[k]['datatype']);
                if (type) {
                    this.params[k]['datatype'] = type;
                    result.push(this.params[k]);
                } else {
                    console.log('La propiedad type del elemento ' + Ext.encode(this.params[k]) +
                        ' no esta definida o esta mal definidda.Ej:string,int,float,boolean,date');
                }
            }
        }
    },
    getJavaType: function (type) {
        var types = {
            string: 'java.lang.String',
            int: 'java.math.BigDecimal',
            float: 'java.lang.Float',
            boolean: 'java.lang.String',
            date: 'java.util.Date'
        };

        if (type) {
            return types[type];
        }
        return false;
    }
});