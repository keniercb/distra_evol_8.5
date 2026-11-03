/*
 * Componente Editor de documentos.
 *
 * @author Yaricel Gerra Velázquez
 * @package Pvd.Documentos
 * @uses Pvd.Documentos.Plantillas.PanelEditor
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Documentos.Plantillas');
Pvd.Documentos.Plantillas.PanelEditor = Ext.extend(Ext.Panel, {
    layout: 'fit', 
	id: 'editor',
	region: 'center',
	width: '100%',
    initComponent : function() {
        var self = this;
        this.pOtrosConcept = new Ext.tree.TreePanel({
            title: 'Otros conceptos',
            border: false,
            layout: 'fit',
            animate: true,
            rootVisible: false,
            autoScroll: true,
            containerScroll: true,
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'getConceptosAdicionales',
                preloadChildren: false
            }),
            root: new Ext.tree.AsyncTreeNode({
                nodeType: 'async',
                idcampo: null,
                text: 'Conceptos',
                animate: false,
                draggable: false,
                expanded: false
            }),
            listeners: {
                click: function (node, e) {
                    if(node.attributes.id == node.attributes.idpadre){
                        var stTipoRepresentar = new Ext.data.SimpleStore({
                            fields: ['tipo', 'denom'],
                            data: [
                                [1, 'Lista'],
                                [2, 'Tabla']
                            ]
                        });

                        var cbTipoRepresentar = new Ext.form.ComboBox({
                            valueField: 'tipo',
                            hiddenName: 'tipo',
                            store: stTipoRepresentar,
                            editable: false,
                            displayField: 'denom',
                            typeAhead: true,
                            mode: 'local',
                            triggerAction: 'all',
                            emptyText: 'Seleccione...',
                            selectOnFocus:true,
                            listeners: {
                                select: function (v) {
                                    var text = node.attributes.text;
                                    var idconcepto = node.attributes.id;
                                    var contenido = '<span class = '+'"'+idconcepto+'-'+v.getValue()+'">{'+text+'}</span>';
                                    tinymce.activeEditor.execCommand('mceInsertContent', false, contenido);

                                    winTipo.close();
                                }
                            }
                        });

                        var winTipo = new Ext.Window({
                            title: 'Representar datos',
                            closeAction: 'hide',
                            constrain: true,
                            resizable: false,
                            width: 200,
                            height: 54,
                            x: e.getXY()[0],
                            y: e.getXY()[1],
                            closable: true,
                            layout: 'fit',
                            modal: true,
                            items: [cbTipoRepresentar],
                            listeners: {
                                show: function () {
                                    cbTipoRepresentar.focus();
                                },
                                close: function () {
                                    self.pOtrosConcept.focus();
                                }
                            }
                        });
                        winTipo.show();
                        cbTipoRepresentar.expand();
                        //cbTipoRepresentar.setValue(1);
                    }else{
                        var text = node.attributes.text;
                        tinymce.activeEditor.execCommand('mceInsertContent', false, '{'+text+'}'); 
                    }
                }.createDelegate(this)
            }
        });

        this.pIzq = new Ext.Panel({
            layout:'accordion',
            region: 'west',
            border: false,
            disabled: true,
            width: 300,
            height: '100%'
        });

        construirAcordion();

        this.pIzq.add(this.pOtrosConcept);

        this.pDer = new Ext.Panel({
            region: 'center',
            html: '<div class="disenar-plantilla" style="width:100;"></div>'
        });

        this.p = new Ext.Panel({
            layout: 'border',
            region: 'center',
            border: false,
            width: '100%',
            items: [this.pIzq, this.pDer]
        });

        this.p.on('render', function () {
            tinymce.init({
                selector: "div.disenar-plantilla",
                mode: "textareas",
                language: "es",
                statusbar: false,
                theme: "modern",
                resizing: false,
                plugins: [
                    "advlist lists image charmap preview hr anchor pagebreak",
                    "searchreplace  visualblocks visualchars",
                    "insertdatetime nonbreaking save table contextmenu directionality",
                    "paste textcolor colorpicker textpattern emoticons print layer",
                    "legacyoutput noneditable code"
                ],
                contextmenu: "image inserttable | cell row column deletetable",
                toolbar1:"save,|,undo,redo,|newdocument,|,print,|,image,|,preview,|,bold,italic,underline,strikethrough,|,alignleft,aligncenter,alignright,alignjustify|,forecolor,backcolor",
                toolbar2:"ltr,rtl,|,removeformat,|,bullist,|,numlist,|,outdent,indent,blockquote,|,formatselect,|,fontselect,|,fontsizeselect,|,hr|,code",
                resize: true,
                toolbar_location : "top",
                toolbar_align : "left",
                external_image_list_url : "js/image_list.js",
                external_filemanager_path:"/pvd/maestro/documentos/views/js/plantillasdoc/resources/filemanager/",
                external_plugins: { "filemanager" : "/pvd/maestro/documentos/views/js/plantillasdoc/resources/filemanager/plugin.js"},
                filemanager_title:"Gestionar archivos",
                image_advtab: true,
                setup : function(ed) {
                    ed.on('PreInit', function(e) {
                        ed.iframeElement.id = 'framee';
                        $('#framee').height($( window ).height()-140);
                        getContenido(self.idplantilla);
                    });
                    ed.on('click', function(e) {
                        self.pIzq.enable();
                    });
                }
            });
        }, this, {buffer: 100});

        this.items = [this.p];

        function construirAcordion() {
            var config = self.configuraciones;
            for (i=0; i<config.length; i++) {
                var idconfiguracion = config[i];
                var pConcept = new Ext.tree.TreePanel({
                    title: 'Conceptos de ' + idconfiguracion,
                    border: false,
                    layout: 'fit',
                    animate: true,
                    rootVisible: false,
                    autoScroll: true,
                    containerScroll: true,
                    loader: new Ext.tree.TreeLoader({
                        dataUrl: 'getConceptos',
                        baseParams: {idconfiguracion: idconfiguracion},
                        preloadChildren: false,
                        listeners: {
                            beforeload: function (tloader, node) {
                                tloader.baseParams.idcampo = node.attributes.idcampo;
                            }
                        }
                    }),
                    root: new Ext.tree.AsyncTreeNode({
                        nodeType: 'async',
                        idcampo: null,
                        text: 'Campos',
                        animate: false,
                        draggable: false,
                        expanded: false
                    }),
                    listeners: {
                        click: function (node) {
                            var text = node.attributes.text;
                            var idcampo = node.attributes.idcampo;
                            if (node.attributes.leaf == true) {
                                var contenido = '<span class = '+'"'+idcampo+'">{'+text+'}</span>&nbsp;';
                                tinymce.activeEditor.execCommand('mceInsertContent', false, contenido);
                            }
                        }.createDelegate(this)
                    }
                });
                self.pIzq.add(pConcept);
            }
        }
        Pvd.Documentos.Plantillas.PanelEditor.superclass.initComponent.call(this);
    }
});
