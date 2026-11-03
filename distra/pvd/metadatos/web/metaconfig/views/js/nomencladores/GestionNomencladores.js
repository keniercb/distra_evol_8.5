Ext.QuickTips.init();
Ext.ns('Configuracion.nomencladores');
Configuracion.nomencladores.TabPanel = Ext.extend(Ext.TabPanel, {
		id                      : 'panelGestionNomencladores',
		enableTabScroll         : true,
		border                  : false,
		disabled                : false,
		viewport                : null,
		contenedor              : null,
		icon                    : '/metadatos/comun/recursos/iconos/cog.png',
		initComponent           : function ()
		{
				var _this = this;
				_this.createNodesNomencladores();
				Ext.apply(this, {
						listeners: {
								remove   : function ()
								{
										_this.ajustar(_this.viewport.id);
										_this.ajustar(_this.contenedor.id);
										_this.ajustar(_this.contenedor.contenedor.id);
								}, render: function ()
								{
										var $contenedor = $('<div/>', {
												id: 'preview', 'class': 'preview'
										});
										var $contenedorIcon = $('<div/>', {
												id: 'previewI', 'class': 'preview'
										});
										var $imagen = $('<img>', {
												id: 'previewImage',
											width: 120,
											height: 60
										})
										var $icon = $('<img>', {
												id: 'previewIcon'
										})
										var areaTrabajo = this.getEl().dom;
										$imagen.appendTo($contenedor);
										$icon.appendTo($contenedorIcon);
										$contenedor.appendTo(areaTrabajo);
										$contenedorIcon.appendTo(areaTrabajo);
								}
						}
				})
				Configuracion.nomencladores.TabPanel.superclass.initComponent.apply(this);
		},
		createNodesNomencladores: function ()
		{
				var _this = this;
				_this.nomencladores = [];
				var nomencladores = [{
						text   : etiquetas.nomencladores.lbOrgano,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbOrganoName,
						icon   : _this.icon,
						id     : 'idorgano',
						tabName: 'taborgano',
						idFoco : 'filtroDenominacion_organo',
						create : construirOrgano
				}, {
						text   : etiquetas.nomencladores.lbOrganoInterno,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbOrganoInternoName,
						icon   : _this.icon,
						id     : 'idorganointerno',
						tabName: 'taborganoi',
						idFoco : 'filtroDenominacion_organoi',
						create : construirOrganoInterno
				}, {
						text   : etiquetas.nomencladores.lbAgrupacion,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbAgrupacionName,
						icon   : _this.icon,
						id     : 'idagrupacion',
						tabName: 'tabagrupacion',
						idFoco : 'filtroDenominacion_agrupacion',
						create : construirAgrupacion
				}, {
						text   : etiquetas.nomencladores.lbAgrupacionInterna,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbAgrupacionInternaName,
						icon   : _this.icon,
						id     : 'idagrupacioninterna',
						tabName: 'tabagrupacioni',
						idFoco : 'filtroDenominacion_agrupacioni',
						create : construirAgrupacionInterna
				}, {
						text   : etiquetas.nomencladores.lbNoFormales,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbNoFormalesName,
						icon   : _this.icon,
						id     : 'idnoformal',
						tabName: 'tabnoformal',
						idFoco : 'filtroDenominacion_noformal',
						create : construirNoFormales
				}, {
						text   : etiquetas.nomencladores.lbTipoEscala,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbTipoEscalaName,
						icon   : _this.icon,
						id     : 'idtipoescala',
						tabName: 'tabtipoescala',
						idFoco : 'filtroDenominacion_tipoescala',
						create : construirTipoEscala
				}, {
						text   : etiquetas.nomencladores.lbGrupo,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbGrupoName,
						icon   : _this.icon,
						id     : 'idgrupocomplejidad',
						tabName: 'tabgrupocomplejidad',
						idFoco : 'filtroDenominacion_grupo',
						create : construirGrupoComplejidad
				}, {
						text   : etiquetas.nomencladores.lbSalario,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbSalarioName,
						icon   : _this.icon,
						id     : 'idsalario',
						tabName: 'tabsalario',
						idFoco : 'filtroValor_salario',
						create : construirSalario
				}, {
						text   : etiquetas.nomencladores.lbEscalaSalarial,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbEscalaSalarialName,
						icon   : _this.icon,
						id     : 'idescalasalarial',
						tabName: 'tabescala',
						idFoco : 'filtroFormFiltro_escala',
						create : construirEscalaSalarial
				}, {
						text   : etiquetas.nomencladores.lbAgrupacionCategoria,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbAgrupacionCategoriaName,
						icon   : _this.icon,
						id     : 'idcategoria ',
						tabName: 'tabsubcategoria',
						idFoco : 'filtroDenominacion_categoria',
						create : construirSubCategoriaOcupacional
				}, {
						text   : etiquetas.nomencladores.lbCategoria,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbCategoriaName,
						icon   : _this.icon,
						id     : 'idcategocup',
						tabName: 'tabcategoria',
						idFoco : 'filtroDenominacion_subcategoria',
						create : construirCategoriaOcupacional
				}, {
						text   : etiquetas.nomencladores.lbPreparacion,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbPreparacionName,
						icon   : _this.icon,
						id     : 'idpreparacion',
						tabName: 'tabpreparacion',
						idFoco : 'filtroDenominacion_preparacion',
						create : construirPreparacion
				}, {
						text   : etiquetas.nomencladores.lbGrado,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbGradoName,
						icon   : _this.icon,
						id     : 'idgrado',
						tabName: 'tabgrado',
						idFoco : 'filtroDenominacion_grado',
						create : construirGrado
				},
					{
						text      : etiquetas.nomencladores.lbCargo,
						leaf      : true,
						referencia: 'cargocivil',
						nombre    : etiquetas.nomencladores.lbCargoName,
						icon      : _this.icon,
						id        : 'idcargo',
						tabName   : 'tabcargo',
						idFoco    : 'filtroDenominacion_cargo',
						create    : construirCargo
				}, {
						text   : etiquetas.nomencladores.lbSubordinacion,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbSubordinacionName,
						icon   : _this.icon,
						id     : 'idnomsubordinacion',
						tabName: 'tabsubordinacion',
						idFoco : 'filtroDenominacion_subordinacion',
						create : construirSubordinacion
				},
					{
						text   : etiquetas.nomencladores.lbTipoMedio,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbTipoMedioName,
						icon   : _this.icon,
						id     : 'idtipomedio',
						tabName: 'tabtipomedio',
						idFoco : 'filtroDenominacion_tipomedio',
						create : construirTipoMedio
				},
					{
						text   : etiquetas.nomencladores.lbIcono,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbIconoName,
						icon   : _this.icon,
						id     : 'idicono',
						tabName: 'tabicono',
						idFoco : 'filtroDenominacion_icono',
						create : construirIcono
				}, {
						text   : etiquetas.nomencladores.lbFirma,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbFirmaName,
						icon   : _this.icon,
						id     : 'idfirma',
						tabName: 'tabfirma',
						idFoco : 'filtroDenominacion_firma',
					 	create : construirFirma
				},
					{
						text   : etiquetas.nomencladores.lbNormaJuridica,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbNormaJuridicaName,
						icon   : _this.icon,
						id     : 'idnormajuridica',
						tabName: 'tabnormajuridica',
						idFoco : 'filtroDenominacion_normajuridica',
					    	create : construirNormaJuridica
				},{
                        text: etiquetas.nomencladores.lbSectores,
                        leaf: true,
                        nombre: etiquetas.nomencladores.lbSectorName,
                        icon: _this.icon,
                        id: 'idsector',
                        tabName: 'tabsector',
                        idFoco: 'filtroDenominacion_sector',
                        create: construirSector
                    }, {
                        text: etiquetas.nomencladores.lbNivelCargo,
                        leaf: true,
                        nombre: etiquetas.nomencladores.lbNivelCargoName,
                        icon: _this.icon,
                        id: 'idnivelcargo',
                        tabName: 'tabnivelcargo',
                        idFoco: 'filtroDenominacion_nivelcargo',
                        create: construirNivelcargo
                    }, {
                        text: etiquetas.nomencladores.lbCargoFacultado,
                        leaf: true,
                        nombre: etiquetas.nomencladores.lbCargoFacultadoName,
                        icon: _this.icon,
                        id: 'idcargofacultado',
                        tabName: 'tabcargofacultado',
                        idFoco: 'filtroDenominacion_cargofacultado',
                        create: construirCargoFacultado
                    }

				/*{
						text   : etiquetas.nomencladores.lbComplementoSalarial,
						leaf   : true,
						nombre : etiquetas.nomencladores.lbComplementoSalarialName,
						icon   : _this.icon,
						id     : 'idcomplemento',
						tabName: 'tabComplemento',
						idFoco : 'filtroDenominacion_complementosalarial',
						create : construirComplemento
				}*/];

				nomencladores.forEach(element => {
					if (ACCIONES_ABREVIATURA['ct'] || ACCIONES_ABREVIATURA['ct-nomenclador'] || ACCIONES_ABREVIATURA[element.id]) {
						_this.nomencladores.push(element);
					}
				});
		},
		getNodes                : function ()
		{
				return this.nomencladores;
		},
		ajustar                 : function (id)
		{
				Ext.getCmp(id).doLayout();
		},
		onClick                 : function (node)
		{
				var _this = this;
				var nomenclador = node.attributes;

				if (Ext.getCmp(nomenclador.tabName) == null) {

						_this.add(nomenclador.create(nomenclador.tabName)).show();
				} else {
						_this.activate(Ext.getCmp(nomenclador.tabName));
						Ext.getCmp(nomenclador.idFoco).focus(false, 10);
				}
				_this.ajustar(_this.viewport.id);
		}
});