/**
 * Fichero que contiene el objeto Toolbar que contiene las opciones para exportar el reporte.
 * 
 * @author
 * @version 1.0
 */

Ext.namespace('Planificacion.Sistemas');
Planificacion.Sistemas.ReportesToolbar = ExtExtend.Class({
    $extend: Ext.Toolbar,
    style: 'background: #fff; border-bottom: 0px;',
        initComponent: function() {
        var _this = this;

        _this.controller = (_this.controller) ? _this.controller : new Planificacion.Sistemas.ReportesController();
        _this.items = ['->',{
            text:'<i class= "fa fa-print"></i> Imprimir',
            scope: _this,
            handler: function(){
                $("#page-content").printArea();
            }
        },{
            text:'<i class= "fa fa-download"></i> Exportar',
            menu: _this.menuOpciones(_this.exportTo)
        },' ', ' ',' ', ' ',' ', ' ',' ', ' ', ' ']

        Planificacion.Sistemas.ReportesToolbar.superclass.initComponent.call(Ext.apply(_this, arguments));
    },

    menuOpciones: function(exportTo) {
        var _this = this;

        var exportToRTF = {
            text:'<i class= "fa fa-file-word-o"></i> WORD',
            format: 'rtf',
            scope: _this,
            handler: _this.exportarReporte
        };

        var exportToPDF = {
            text: '<i class= "fa fa-file-pdf-o"></i> PDF',
            format: 'pdf',
            scope: _this,
            handler: _this.exportarReporte
        };

        var exportToExcel = {
            text: '<i class= "fa fa-file-excel-o"></i> Excel',
            format: 'excel',
            scope: _this,
            handler: _this.exportarReporte
        };

        var exportOpcions = [];

        if (exportTo) {
            Ext.each (exportTo, function(opcion) {
                switch (opcion) {

                    case 'WORD':
                        exportOpcions.push(exportToRTF);
                        break;

                    case 'PDF':
                        exportOpcions.push(exportToPDF);
                        break;

                    case 'EXCEL':
                        exportOpcions.push(exportToExcel);
                        break;
                }
            });

        } else {
            exportOpcions = [exportToRTF, exportToPDF, exportToExcel];
        }

       return new Ext.menu.Menu({
               shadow: false,
               cls : 'export-menu',
               items: exportOpcions
        });
    },


    exportarReporte: function(item) {
        var _this = this;

        $("#page-content").on('onrender', function () {

            switch (item.format) {

                case 'rtf':
                    $("#page-content").wordExport(_this.titulo);
                    break;

                case 'pdf':
                    var html = $("#page-content").html();
                    var pdf = new jsPDF('p', 'pt','a4');
                   pdf.setFontSize(12);

                    var margins = {
                        top: 80,
                        bottom: 60,
                        left: 40,
                        width: 522
                    };

                    pdf.fromHTML($("#page-content").get(0),30, 10,{
                        'width': 570,
                    },function(){
                        setTimeout(function() {
                            pdf.output('dataurlnewwindow');
                            //pdf.save('reporte.pdf');
                        }, 10);
                    },margins);

                   /* Ext.MessageBox.show({
                        msg: 'Exportando..',
                        title:'Por favor espere...',
                        width:300,
                        wait:true
                    });
                    pdf.addHTML($("#page-content").get(0),function() {

                        pdf.output('dataurlnewwindow');
                        Ext.MessageBox.hide();

                    });*/



                    break;

                case 'excel' :
                    $("#page-content").excelExport(_this.titulo);
                    break
            }
        })


        this.beforeExportTo ? this.controller.getFn(this.view, this.beforeExportTo, $("#page-content"), this.pbeforeExportTo) :
            $("#page-content").trigger('onrender');

    }

});
Ext.reg('Planificacion.Sistemas.ReportesToolbar', Planificacion.Sistemas.ReportesToolbar);

