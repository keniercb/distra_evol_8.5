-- adicionando columna tipoformato a la tabla mod_nomina.conf_exportacionbanco

ALTER TABLE mod_nomina.conf_exportacionbanco
  ADD COLUMN tipoformato NUMERIC(1,0) DEFAULT 1;