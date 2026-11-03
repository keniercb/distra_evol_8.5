CREATE EXTENSION ltree;
--
--- + del campo parent_path en la tabla dat_subordinacion 
ALTER TABLE mod_estructuracomp.dat_subordinacion 
ADD COLUMN parent_path ltree;
COMMENT ON COLUMN mod_estructuracomp.dat_subordinacion.parent_path
IS 'Representa la estructura representada por el tipo de dato ltree';

CREATE INDEX parent_path_idx ON mod_estructuracomp.dat_subordinacion USING GIST (parent_path);

CREATE OR REPLACE FUNCTION mod_estructuracomp.ft_update_parent_path()
  RETURNS trigger AS
$BODY$
    DECLARE
        path public.LTREE;
    BEGIN
        --SET search_path = 'mod_estructuracomp';
        IF NEW.idpadre = NEW.idhijo THEN
            NEW.parent_path = (cast(NEW.idhijo as varchar))::public.ltree;
            --NEW.parent_path = (NEW.idfila)::ltree;
        ELSEIF TG_OP = 'INSERT' OR OLD.idpadre != NEW.idpadre THEN
            SELECT parent_path FROM mod_estructuracomp.dat_subordinacion WHERE idhijo = NEW.idpadre AND idnomsubordinacion = NEW.idnomsubordinacion INTO path;
            IF path IS NULL THEN
               RAISE EXCEPTION 'parent_path del padre no existe %', NEW.idpadre;
            END IF;
            NEW.parent_path = public.text2ltree(public.ltree2text(path)||'.'||NEW.idhijo);
        END IF;
        RETURN NEW;
    END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;


CREATE TRIGGER parent_path_tgr BEFORE INSERT OR UPDATE ON mod_estructuracomp.dat_subordinacion FOR EACH ROW EXECUTE PROCEDURE mod_estructuracomp.ft_update_parent_path();
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE mod_estructuracomp.aux_complemento (
  idcomplemento NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_complemento PRIMARY KEY(idcomplemento)
) 
WITH (oids = false);

COMMENT ON TABLE mod_estructuracomp.aux_complemento
IS 'Tabla nomencladora que almacena los conceptos asociados al complemento salarial en la entidad.';

COMMENT ON COLUMN mod_estructuracomp.aux_complemento.idcomplemento
IS 'Identificador del complemento.';

COMMENT ON CONSTRAINT pk_complemento ON mod_estructuracomp.aux_complemento
IS 'identificador unico para la tabla aux_complemento';
