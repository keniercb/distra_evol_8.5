CREATE TABLE mod_datosmaestros.nom_indicadormedicamento (
  idindicador NUMERIC(19,0) NOT NULL,
  idforma NUMERIC(19,0),
  composicion NUMERIC(19,6),
  idumcomposicion NUMERIC(19,0),
  idpresentacion NUMERIC(19,0),
  unidadpresent NUMERIC(19,0),
  dosisunitaria NUMERIC(25,6),
  temperatura VARCHAR(100),
  pesoenvase NUMERIC(25,6),
  idumpeso NUMERIC(19,0),
  CONSTRAINT pk_idindicador PRIMARY KEY(idindicador),
  CONSTRAINT fk_indicador_indicadormedicamento FOREIGN KEY (idindicador)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_tipoenvase_indicadormedicamento FOREIGN KEY (idpresentacion)
    REFERENCES mod_datosmaestros.nom_tipoenvase(idtipoenvase)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_unidadmedida_indicadormedicamento FOREIGN KEY (idumpeso)
    REFERENCES mod_datosmaestros.nom_unidadmedida(idunidadmedida)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_unidadmedida_indicadormedicamento_idumedida FOREIGN KEY (idumcomposicion)
    REFERENCES mod_datosmaestros.nom_unidadmedida(idunidadmedida)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT nom_indicadormedicamento_fk FOREIGN KEY (idforma)
    REFERENCES mod_logfarmacia.nom_forma(idforma)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.idindicador
IS 'Identificador del indicador';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.idforma
IS 'Identificador del la forma farmacéutica';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.composicion
IS 'Almacena la composición del medicamento';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.idumcomposicion
IS 'Identificador de la unidad de medida de la composicion';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.idpresentacion
IS 'Identificador del tipo de presentacion';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.unidadpresent
IS 'Almacena la unidad de presentación del medicamento';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.dosisunitaria
IS 'Dosis unitaria del producto';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.temperatura
IS 'Temperatura a la que debe almacenarse el producto';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.pesoenvase
IS 'Peso del producto';

COMMENT ON COLUMN mod_datosmaestros.nom_indicadormedicamento.idumpeso
IS 'Identificador de la unidad de medida';

ALTER TABLE mod_datosmaestros.nom_indicadormedicamento
  OWNER TO zeolides;