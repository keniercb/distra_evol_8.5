CREATE INDEX IF NOT EXISTS idx_idpadre_idhijo ON mod_estructuracomp.dat_subordinacion 
	USING btree (idpadre,idhijo) TABLESPACE pg_default;
