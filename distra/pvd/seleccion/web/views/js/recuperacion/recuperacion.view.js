/*
 * Recuperacion General.
 *
 * @author Ing. Orestes Rodríguez Lorenzo
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Recuperacion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Seleccion.Recuperacion');

Ext.QuickTips.init();

Pvd.Seleccion.Recuperacion.Vista = {
    init: function (idioma, modelo) {
        //Botón Ayuda.
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: idioma.btnAyuda_Text,
            tooltip: idioma.btnAyuda_Tooltips,
            iconCls: 'ayuda'
        });
        //Botón mostrar detalles.
        this.btnDetalle = new Ext.Button({
            id: 'btnDetalle',
            text: idioma.btnDetalle_Text,
            tooltip: idioma.btnDetalle_Tooltips,
            disabled: true,
            iconCls: 'detalles'
        });
        //Botón mostrar una gráfica resumen.
        this.btnGrafica = new Ext.Button({
            id: 'btnGrafica',
            text: idioma.btnGrafica_Text,
            tooltip: idioma.btnGrafica_Tooltips,
            //iconCls:'grafica'
            iconCls: 'graficar'
        });
        //Botón mostrar una gráfica resumen.
        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: 'Exportar',// idioma.btnGrafica_Text,
            //tooltip: idioma.btnGrafica_Tooltips,
            //iconCls:'grafica'
            iconCls: 'exportar'
        });
        //Botón para limpiar los filtros de búsqueda.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar_Text,
            tooltip: idioma.btnLimpiar_Tooltips,
            iconCls: 'limpiar'
        });
        //Campo de búsqueda
        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stRecCandidato,
            emptyText: idioma.sfBuscar_empty
        });
        //Combobox para filtrar por procesos
        this.cbProceso = new Ext.form.ComboBox({
            store: modelo.stProceso,
            displayField: 'denominacion',
            valueField: 'idproceso',
            typeAhead: true,
            mode: 'local',
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Proceso de selección'
        });
        //Combobox para filtrar por estados
        this.cbEstado = new Ext.form.ComboBox({
            store: modelo.stEstado,
            displayField: 'estado',
            valueField: 'idestado',
            typeAhead: true,
            mode: 'local',
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            emptyText: idioma.cbEstado_emptyText
        });
        //Grid panel
        this.gpRecCandidato = new Ext.grid.GridPanel({
            store: modelo.stRecCandidato,
            region: 'center',
            tbar: [this.sfBuscar],
            loadMask: {msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
            columns: [
                {hidden: true, dataIndex: 'idcandidato'},
                {hidden: true, dataIndex: 'nombre'},
                {header: idioma.gpRecCandidato_proceso, dataIndex: 'proceso', width: 250},
                {header: idioma.gpRecCandidato_fregistro, dataIndex: 'fregistro', width: 100},
                {header: idioma.gpRecCandidato_estado, dataIndex: 'estado', width: 100}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stRecCandidato,
                displayInfo: true
            }),
            tbar: [this.sfBuscar, ' ',
                this.cbProceso, ' ',
                this.cbEstado, ' ',
                this.btnLimpiar, '-',
                this.btnGrafica,
                this.btnDetalle,   '->', '-',
                this.btnAyuda]
        });

        //Ventana para detalles de la persona en el proceso
        //Plantilla datos personales
        this.plantillaDatosPers = new Ext.XTemplate(
            '<table style="border-collapse: collapse; background-color: #dfe8f6;">',
            '<tr><td height="10px" /></tr>',
            '<tr><td colspan=4><center class="text"><b>DATOS PERSONALES</b></center></td></tr>',
            '<tr>',
            '<td width="10px" />',
            '<td><img class="fotoDetalles" src="data:image/jpg;base64,{foto}" /></td>',
            '<td>',
            '<table>',
            '<tr>',
            '<td width="5px" />',
            '<td width="150"><div class="text"><b>No. Registro:</b></div></td>',
            '<td width="250"><div class="text"><u>{idpersona}</u></div></td>',
            '</tr>',
            '<tr>',
            '<td width="5px" />',
            '<td width="150"><div class="text"><b>No. Identidad:</b></div></td>',
            '<td width="250"><div class="text"><u>{numid}</u></div></td>',
            '</tr>',
            '<tr>',
            '<td width="5px" />',
            '<td width="150"><div class="text"><b>Apellidos, Nombre(s):</b></div></td>',
            '<td width="250"><div class="text"><u>{nombre}</u></div></td>',
            '</tr>',
            '</table>',
            '</td>',
            '<td width="10px" />',
            '</tr>',
            '<tr><td colspan=4><br /><center class="text"><b>DATOS DEL PROCESO</b></center></td></tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Proceso:</b> <u>{proceso}</u></div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Estado actual:</b> <u>{estado}</u></div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Fecha incorporación al proceso:</b> <u>{fregistro}</u></div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Fecha de preselección:</b> <u>{fpreseleccion}</u></div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Fecha de selección:</b> <u>{fseleccion}</u></div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Fecha de exclusión:</b> <u>{fexcluido}</u></div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr><td height="10px" /></tr>',
            '</table>',
            '<br/>'
        );
        //Panel datos personales
        this.pDatosPers = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            height: '100%',
            items: [this.plantillaDatosPers]
        });

        this.winDetalles = new Ext.Window({
            layout: 'fit',
            title: idioma.winDetalles_Title,
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 520,
            height: 300,
            constrain: true,
            items: [this.pDatosPers]
        });

        //Ventana para la gráfica
        this.winGrafica = new Ext.Window({
            layout: 'fit',
            constrain: true,
            title: idioma.winGrafica_Title,
            modal: true,
            closeAction: 'hide',
            resizable: false
        });

        //Viewport
        new Ext.Viewport({
            layout: 'fit',
            items: [this.gpRecCandidato]
        });
    }
};

UCID.portal.cargarEtiquetas('recuperacion', function (perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Pvd.Seleccion.Recuperacion.Modelo;
    modelo.init();
    var vista = Pvd.Seleccion.Recuperacion.Vista;
    vista.init(idioma, modelo);
    Pvd.Seleccion.Recuperacion.Controlador.init(idioma, vista, modelo);
});
