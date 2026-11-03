Ext.namespace('Ext.Cmpaction');
Ext.Cmpaction= Ext.extend(Ext.grid.RowActions, {
    url: undefined,
    constructor: function(params = undefined)
    {
        var scope = this;
        // if (!document.getElementById('SCFPrintView'))
        //     this.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintView.js", 'SCFPrintView');
        // if (!document.getElementById('SCFPrintData'))
        //     this.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintData.js", 'SCFPrintData');


        // this.loadJs("/contabilidad/comun/componentes/RowActionColumn/Ext.grid.RowActions", null, function () {

        this.id = 'idRowactionCmpaction' + Ext.id();
        this.widthSlope = 100;
        this.keepSelection = false;
        this.autoWidth = true;
        this.header = "No. Comprobante";

        this.actions = [
            {
                id: 'vistareporte',
                // tooltip: 'Ver comprobante',
                qtipIndex: 'numcomprobante',
                iconCls: 'vistareporte',
                marginLeft: 5,
                // width: 200,
                height: 16,
                hideIndex: 'showCmp',
                textIndex: 'numcomprobante'
            },
        ];
        Ext.apply(this, params);

        Ext.Cmpaction.superclass.constructor.call(scope);
        scope.initializeEvents(scope);
        scope.initializeFunctions(scope);
        scope.loadDataComponent(scope);
    },
    loadDataComponent: function(scope)
    {

    },
    loadMessageBox: function(msg)
    {
        Ext.MessageBox.show({
            title: 'Cargando...',
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    loadJs: function (jsSrc, id = null, onload = function () {}) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            if (id != null) {
                tagScript.setAttribute("id", id);
            }
            tagScript.setAttribute("src", jsSrc + ".js");
            tagScript.onload = onload;
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    initializeEvents: function(scope)
    {
        scope.on({
            action: function (grid, record, action, rowIndex, col, e) {
                if (action == 'vistareporte') {
                    scope.fShowReporteComprobante(grid);
                }
            },
        });
    },
    initializeFunctions: function(scope)
    {
        scope.fShowReporteComprobante = function (grid) {
            Ext.Msg.wait('Cargando...', 'Espere');
            var arrayIdCmp= [];
            var arrayRecord = grid.getSelectionModel().getSelections();
            arrayRecord.forEach(function (element, index, arr){
                var arrayId = element.json.arrayIdCmp;
                for (var i = 0; i < arrayId.length; i++) {
                    arrayIdCmp.push({
                        idcomprobante: arrayId[i].idcomprobante,
                    });
                }
            }, scope);


            // Ext.Ajax.request({
            //     url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
            //     params: {
            //         reporteParams: Ext.encode(arrayIdCmp)
            //     },
            //     callback: function (options, success, response) {
            //         var responseData = Ext.decode(response.responseText);
            //         if (responseData.dataSources.length > 0) {
            //             scope.fOpenWindowReportCmp({
            //                 datoGeneral: {
            //                     reporte: '100',
            //                     titulo: 'Comprobante de operaciones',
            //                 },
            //                 datoCuerpo: responseData.dataSources
            //             });
            //         }
            //         Ext.MessageBox.hide();
            //     }
            // });
            Ext.MessageBox.hide();
            scope.fOpenWindowReportCmp({
                datoGeneral: {
                    reporte: '100',
                    titulo: 'Comprobante de operaciones',
                },
                datoCuerpo: [],
                datoParametros: arrayIdCmp
            });
        };

        scope.fOpenWindowReportCmp = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };
    }
});
