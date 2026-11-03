ALTER TABLE mod_contabilidad.dat_comprobante_documento
  ADD COLUMN iddeposito NUMERIC(19,0);

COMMENT ON COLUMN mod_contabilidad.dat_comprobante_documento.iddeposito
IS 'Identificador del deposito desde donde se creo el documento';

ALTER TABLE mod_contabilidad.dat_comprobante_documento
  ADD CONSTRAINT dat_comprobante_documento_fk FOREIGN KEY (iddeposito)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


-- Actualizar el iddeposito a todos los documentos 
UPDATE 
  mod_contabilidad.dat_comprobante_documento c
SET 
  iddeposito = q.iddeposito
from (select (case when f.iddeposito is not null then f.iddeposito else d.idestructuracomun end) as iddeposito,
d.iddocumento
from mod_contabilidad.dat_comprobante_documento cd
inner join mod_logistica.dat_documento d on d.iddocumento = cd.iddocumento
left join mod_logfacturacion.dat_docfactura f on f.idfactura = d.iddocumento
left join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = (case when f.iddeposito is not null then f.iddeposito else d.idestructuracomun end))q
WHERE 
  q.iddocumento = c.iddocumento;