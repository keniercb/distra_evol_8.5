function myBeforeLoad(param, idFiltroDenom, idFiltroAbrev, formFiltro, id, baseParam, clase, condicion, idEscalaSalarial)
{
		Secodena.mostrarMascara('cargaini', '', "Cargando...");
		var limit = param.params.limit;
		var start = param.params.start;
		var parametros = Ext.decode(param.params.parametros);
		if (parametros == undefined) {
				var denominacion = Ext.getCmp(idFiltroDenom).getValue();
				var abreviatura = (idFiltroAbrev) ? Ext.getCmp(idFiltroAbrev).getValue() : undefined;
				//console.info(abreviatura);
				var escala = (idEscalaSalarial) ? Ext.getCmp(idEscalaSalarial).getValue() : undefined;
				if (denominacion != undefined || abreviatura != undefined || escala != undefined) {
						var form = formFiltro.getForm();
						if (form.isValid()) {
								parametros = new Array();
								parametros.push(id);
								if (id == 15) {
										parametros.push({
												salario         : denominacion,
												grupocomplejidad: abreviatura,
												escala          : escala,
												condicion       : Ext.getCmp(condicion).getValue()
										})
								} else {
										parametros.push(form.getValues())
								}
						} else {
								parametros = baseParam;
						}
				} else {
						parametros = baseParam;
				}
		}
		param.params = {
				start     : start,
				limit     : limit,
				clase     : clase,
				parametros: Ext.encode(parametros)
		}
		return param;
}
var htmlHeader = "<div class='win-commandlayout'><a class='win-command' href='#'><span class= 'win-commandicon win-commandring icon-home' ></span><span class='win-label'>Home</span></a><hr class= 'win-command' ><a class='win-command' href='#'><span class='win-commandicon win-commandring icon-plus-5'></span><span class='win-label'>Add</span></a><a class= 'win-command' href = '#' ><span class='win-commandicon win-commandring icon-disk'></span><span class= 'win-label' > Save </span ></a><button class='win-command'><span class='win-commandicon win-commandring icon-reload'></span><span class='win-label'>Reload</span></button><button class='win-command'><span class='win-commandicon win-commandring icon-arrow-left-12'></span><span class='win-label'>Previous</span></button><button class='win-command'><span class='win-commandicon win-commandring icon-arrow-right-11'></span><span class='win-label'>Next</span></button><hr class='win-command'><button class='win-command'><span class='win-commandicon win-commandring icon-cog-2'></span><span class='win-label'>Settings</span></button><button class='win-command'><span class='win-commandicon win-commandring icon-download'></span><span class='win-label'>Download</span></button><button class='win-command'><span class='win-commandicon win-commandring icon-upload-2'></span><span class='win-label'>Upload</span></button></div>";

