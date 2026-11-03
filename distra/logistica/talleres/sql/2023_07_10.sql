DELETE FROM mod_logtaller.dat_trabajooperariosdetallado
	WHERE idtrabajooperariosdetallado = any(
		select a.idtrabajooperariosdetallado
		from mod_logtaller.dat_trabajooperariosdetallado a
		left join mod_logistica.dat_documento b on (a.iddocfactura = b.iddocumento)
		where a.iddocfactura is not null and b.iddocumento is null
	);
	
ALTER TABLE mod_logtaller.dat_trabajooperariosdetallado
    ADD CONSTRAINT fk_topdetallado_iddocfatura FOREIGN KEY (iddocfactura)
    REFERENCES mod_logistica.dat_documento (iddocumento) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


COMMENT ON COLUMN mod_logtaller.dat_trabajooperariosdetallado.estado
    IS 'dejado de usar, se utiliza el estado de la factura';