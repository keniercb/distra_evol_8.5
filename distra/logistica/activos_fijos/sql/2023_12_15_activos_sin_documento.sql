--activos sin documento
with w_activos_enproceso as (select distinct rna.idregnumerico
								from mod_logactivofijotangible.dat_registronumerico rn
								inner join mod_logactivofijotangible.dat_regnumericoactivo as rna on rna.idregnumerico = rn.idregnumerico
				    			inner join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = rna.idgruposubgrupo)
								inner join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
				  				where nc.concatcta not like '187.%'
				   					and rn.enproceso = 1
				   			),
	w_mov_doc as (select mov.iddocumento, mrn.idregnumerico from mod_logistica.dat_movimiento as mov
					 	inner join mod_logactivofijotangible.dat_movregnumerico as mrn on (mov.idmovimiento = mrn.idmovimiento)
					  	inner join mod_logistica.dat_documento as doc on (mov.iddocumento = doc.iddocumento)				    
				 )
(
	select act_proc.idregnumerico, doc.iddocumento from w_activos_enproceso as act_proc
	left join w_mov_doc as doc on (doc.idregnumerico = act_proc.idregnumerico)
	where doc.iddocumento is null
)
