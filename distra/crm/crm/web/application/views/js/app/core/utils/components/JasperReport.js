Ext.define('Ext.ux.JasperReport', {
    extend: 'Ext.Window',
    // height: 500,
    name: 'mywin',
    id: 'mywin',
    // width: 900,
    layout: 'fit',
    title: 'Visor de reporte',
    //minimizable: true,
    maximizable: true,
    maximized:true,
    closable: true,
    constrain: true,
    urlExport: '/logistica/utiles/reportes/index.php?',
    // urlExport: '/crm/componentereporte/index.php?',
    cls: 'x-panel-report',
    constructor: function (config) {
        var me = this;
        Ext.apply(this, config || {});
        // this.typeRequest = config.typeRequest ? config.typeRequest : 'auto';
        // this.typeFormat = config.typeFormat ? config.typeFormat : 'HTML';
        // this.content = config.content ? config.content : 'text/HTML';
        // this.paginated = config.paginated ? config.paginated : true;
        // this.isAttachment= config.isAttachment ? config.isAttachment : false;
        //
        // this.name=config.name;
        // this.description=config.description;
        // this.isList=config.isList;
        // this.params=config.params;
        // this.dirReport=config.dirReport;
        this.configReport={
            //principales
            dirReport: config.dirReport, //direccion del reporte
            params: config.params,
            name: config.name, //nombre que va a tener el archivo a guardar
            //cambiables
            typeRequest: config.typeRequest ? config.typeRequest : 'auto',
            typeFormat: config.typeFormat ? config.typeFormat : 'PDF',
            content: config.content ? config.content : 'application/pdf',
            paginated: config.paginated ? config.paginated : false,
            isAttachment: config.isAttachment ? config.isAttachment : false,
            //defecto
            pages: (this.pages && this.pages.getValue()) ? this.pages.getValue() : null,
            attachmentsPrefix: (this.attachmentsPrefix && this.attachmentsPrefix.checked) ? this.attachmentsPrefix.checked : null,
            interactive: (this.interactive && this.interactive.checked) ? this.interactive.checked : false,
            freshData: (this.freshData && this.freshData.checked) ? this.freshData.checked : false,
            saveDataSnapshot: (this.saveDataSnapshot && this.saveDataSnapshot.checked) ? this.saveDataSnapshot.checked : false,
            transformerKey: (this.transformerKey && this.transformerKey.checked) ? this.transformerKey.checked : false
        };
        // this.idioma = LOG.util.report.Idioma;
        this.height = (window.frameElement.contentWindow.document.body.scrollHeight / 2) + (window.frameElement.contentWindow.document.body.scrollHeight / 4) - 2;
        this.width = window.frameElement.contentWindow.document.body.scrollWidth * 85 / 100;
        // this.tbar = this.buildMenus();
        this.createBody();
        Ext.ux.JasperReport.superclass.constructor.call(this, config);


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
            // width: 120,
            iconCls: 'exportar',
            text: 'Exportar',
            tooltip: 'Exportar reporte',
            listeners: {
                scope: this,
                click: function () {
                    me.configReport['typeFormat']=me.cbFormatosReporte.getValue();
                    me.configReport['isAttachment']=true;
                    window.open(me.getReporteJasperUrl()+'?datas='+Ext.encode(me.configReport));
                }
            }
        });

        this.btnRecargar = new Ext.Button({
            id: 'btnrecargarReporte',
            // width: 120,
            iconCls: 'recargar',
            text: 'Recargar',
            tooltip: 'Recargar reporte',
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
            fieldLabel: 'Formato',
            id: 'idformatos',
            labelWidth:60,
            width: 180,
            editable: false,
            valueField: 'valor',
            value: 'PDF',
            displayField: 'denominacion',
            allowBlank: false,
            queryMode: 'local',
            store: this.stFormatosReporte
        });

        this.createReportPanel();
        // me.panelReport = this.createReportPanel();
        me.tbar = ['->', me.cbFormatosReporte, me.btnRecargar, me.btnJasperGenerarReporte];
        me.items = [me.panelReport];

        this.buttons = [{
            iconCls: 'cerrar',
            action: 'close',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                me.close();
            }
        }];
    },
    createReportPanel: function () {
        var me=this;
        return me.panelReport=Ext.create('Ext.form.Panel',{
            id: 'idpanel',
            labelAlign: 'top',
            labelWidth: 15,
            height: 500,
            width: 900,
            cls:'x-panel-report',
            html: '<iframe id="idframe" name="idframe" frameborder="0" width="100%" height="100%" onload="Ext.ux.JasperReport.prototype.onLoadReport(this.id)" ></iframe>',///*onload="'+me.onLoadReport(this.id)+';*/
            // html: '<iframe id="idframe" name="idframe" frameborder="0" action="POST" src="' + this.buildUrl('PDF') + '" width="100%" height="100%"></iframe>',
            listeners: {
                afterrender: function (panel) {
                    panel.fromHidden=panel.getEl().createChild(
                        {tag: 'form', cls: 'x-hidden', method: 'POST', action: me.urlExport, target: 'idframe'}
                    );
                    panel.fromHidden.createChild("<input name='datas' type='text' class='u-datas' style='display:none' hidden='true' value='{0}'/>");
                    me.configReport['isAttachment']=false;
                    me.loadReport(me.configReport);
                }
            }
        });
    },
    buildUrl: function (format) { //no se usa
        var me=this;
        var params = {
            typeFormat: format || this.cbFormatosReporte.getValue(),
            name: this.name,
            dirReport: '/reports'+this.dirReport,
            params: this.params
        };
        return this.urlExport + "datas=" + Ext.urlEncode(me.configReport);
        // return this.urlExport + "datas=" + Ext.encode(me.configReport);
    },
    loadReport: function (config) {
        var me = this,value = Ext.encode(config);

        // this.loadMask = new Ext.LoadMask(this.getEl(), {msg: 'Cargando...', removeMask: true});
        // this.loadMask.show();
        // this.panelReport./*getForm().*/getEl().dom.action = this.urlExport;
        // this.panelReport./*getForm().*/getEl().dom.method = "POST";
        // this.panelReport./*getForm().*/getEl().dom.target = "idframe";
        // this.panelReport./*getForm().*/getEl().dom.enctype = "multipart/form-data";
        // this.panelReport./*getForm().*/getEl().child("input.u-datas").dom.value = value.trim();

        this.loadMask = new Ext.LoadMask(this.panelReport.getEl(), {msg: 'Cargando...', removeMask: true});
        this.loadMask.show();
        this.panelReport.fromHidden.dom.action = me.getReporteJasperUrl();
        this.panelReport.fromHidden.dom.method = "POST";
        this.panelReport.fromHidden.dom.target = 'idframe';
        this.panelReport.fromHidden.dom.enctype = "multipart/form-data";
        this.panelReport.fromHidden.child("input.u-datas").dom.value = value.trim();
        // this.panelReport./*getForm().*/getEl().dom.submit();
        // this.panelReport./*getForm().*/submit();
        // this.panelReport.getForm().submit();
        this.panelReport.fromHidden.dom.submit();
        // this.panelReport.getForm().submit({
        //     url: me.urlExport,
        //     params: {
        //         data: Ext.encode(me.configReport)
        //     },
        //     // success: function(){
        //     //     alert('yujuuu')
        //     // }
        // })
    },
    getReporteJasperUrl: function () {
        return (function () {
            var nomModule = ModuleMgr.get('ConfiguracionGral').moduleCfg;
            return '/' + nomModule.getBasePath() + 'index.php/componentereportes/getReporteJasper';
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
    },
    onLoadReport: function (id) {
        // Ext.select(".x-panel-report .ext-el-mask").remove();
        Ext.select(".x-panel-report .x-mask").remove();
        Ext.select(".x-panel-report .ext-el-mask-msg").remove();
        Ext.select(".x-panel-report .x-mask-loading").remove();
        document.getElementById(id).style = "width:100%; height:100%; border:0;";
    }
});