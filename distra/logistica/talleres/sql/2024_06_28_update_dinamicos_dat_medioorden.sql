--agregar nueva columna para conservar los valores originales de "dinamicos".
ALTER TABLE IF EXISTS mod_logtaller.dat_medioorden
    ADD COLUMN IF NOT EXISTS dinamicos_original text;

--clonar la información original por si se requiere revertir el proceso.
UPDATE mod_logtaller.dat_medioorden SET dinamicos_original = dinamicos;

--convertir las palabras a minúscula.
update mod_logtaller.dat_medioorden
set dinamicos = (replace(replace(dinamicos,'Modelo','modelo'),'Marca','marca'));

--generar formato para guardar el modelo y actualizar los que no lo contienen.
update mod_logtaller.dat_medioorden
set dinamicos=(subquery.json_modelos::jsonb||dinamicos::jsonb)
from (
	select distinct dmo.idindicador as idin,
			(case when (nmd.denominacion is not null) then '{"modelo": '||'"'||nmd.denominacion||'"'||',"name": "modelo","identificador":"0","etiqueta":"modelo"'||'}'
			 		else '{"modelo":"","name": "modelo","identificador":"0","etiqueta":"modelo"}' 
			 		end
				)::jsonb as json_modelos
			from mod_logtaller.dat_medioorden as dmo
			inner join mod_datosmaestros.nom_indicador as i on (dmo.idindicador = i.idindicador)
			inner join mod_datosmaestros.nom_indicadorhoja ih on (i.idindicador = ih.idindicador)
			left join mod_datosmaestros.nom_marca as nm on (ih.idmarca = nm.idmarca)
			left join mod_datosmaestros.nom_modelo as nmd on (ih.idmodelo = nmd.idmodelo)
			where dmo.idmedio in ( select dm.idmedio from mod_logtaller.dat_medioorden dm
										where idmedio not in (select idmedio from mod_logtaller.dat_medioorden where dinamicos ilike '%modelo%')
											and idpadre <> 1
								)
) as subquery
where idindicador = subquery.idin
	and idmedio not in (select idmedio from mod_logtaller.dat_medioorden where dinamicos ilike '%modelo%')
	and idpadre <> 1;

--generar formato para guardar la marca y actualizar los que no lo contienen.
update mod_logtaller.dat_medioorden
set dinamicos=(subquery.json_marca::jsonb||dinamicos::jsonb)
from (
	select distinct dmo.idindicador as idin,
			(case when (nm.denominacion is not null) then '{"marca": '||'"'||nm.denominacion||'"'||',"name": "marca","identificador":"0","etiqueta":"marca"'||'}'
			 		else '{"marca":"","name": "marca","identificador":"0","etiqueta":"marca"}' 
			 		end
				)::jsonb as json_marca
			from mod_logtaller.dat_medioorden as dmo
			inner join mod_datosmaestros.nom_indicador as i on (dmo.idindicador = i.idindicador)
			inner join mod_datosmaestros.nom_indicadorhoja ih on (i.idindicador = ih.idindicador)
			left join mod_datosmaestros.nom_marca as nm on (ih.idmarca = nm.idmarca)
			left join mod_datosmaestros.nom_modelo as nmd on (ih.idmodelo = nmd.idmodelo)
			where dmo.idmedio in (select dm.idmedio from mod_logtaller.dat_medioorden dm
									where idmedio not in (select idmedio from mod_logtaller.dat_medioorden where dinamicos ilike '%marca%')
										and idpadre <> 1
								)
) as subquery
where idindicador = subquery.idin
	and idmedio not in (select idmedio from mod_logtaller.dat_medioorden where dinamicos ilike '%marca%')
	and idpadre <> 1;
