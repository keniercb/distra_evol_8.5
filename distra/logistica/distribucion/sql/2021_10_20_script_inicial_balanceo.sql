CREATE TABLE mod_logdistribucion.dat_docbalanceo (
  iddocbalanceo NUMERIC(19,0) NOT NULL,
  PRIMARY KEY(iddocbalanceo)
) 
WITH (oids = false);

ALTER TABLE mod_logdistribucion.dat_docbalanceo
  OWNER TO zeolides;

COMMENT ON TABLE mod_logdistribucion.dat_docbalanceo
IS 'Tabla donde se registran los documentesod de balanceo';

COMMENT ON COLUMN mod_logdistribucion.dat_docbalanceo.iddocbalanceo
IS 'Id de la tabla donde se guardan los documentos de balanceo';

ALTER TABLE mod_logdistribucion.dat_docbalanceo
  ADD CONSTRAINT dat_docbalanceo_fk FOREIGN KEY (iddocbalanceo)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

CREATE SEQUENCE mod_logdistribucion.sec_datproductosbalanceo_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logdistribucion.sec_datcancelacion_seq RESTART WITH 1000000001;

CREATE TABLE mod_logdistribucion.dat_productosbalanceo (
  idproductosbalanceo NUMERIC(19,0) DEFAULT nextval('mod_logdistribucion.sec_datcancelacion_seq'::regclass) NOT NULL,
  idindicador NUMERIC(19,0) NOT NULL,
  iddocbalanceo NUMERIC(19,0) NOT NULL,
  iddocpedido NUMERIC(19,0) NOT NULL,
  idclasificacionabc NUMERIC(19,0),
  idproductosbalanceopadre NUMERIC(19,0),
  cantidadpedidos NUMERIC(25,6) DEFAULT 0,
  cantdistribuidos NUMERIC(25,6) DEFAULT 0,
  cantcomprar NUMERIC(25,6) DEFAULT 0,
  PRIMARY KEY(idproductosbalanceo)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.idproductosbalanceo
IS 'Llave primaria de la tabla';

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.idindicador
IS 'Id del indicador';

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.iddocbalanceo
IS 'Id del documento de balanceo';

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.iddocpedido
IS 'Id del documento del pedido';

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.idclasificacionabc
IS 'Id de la clasificacion ABC total que posee el producto.';

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.idproductosbalanceopadre
IS 'Este campo (llave foranea de la pk de la tabla) define si el indicador/producto es un sustituto de algun otro existente.';

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.cantidadpedidos
IS 'Cantidad solicitada';

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.cantdistribuidos
IS 'Cantidad a distribuir';

COMMENT ON COLUMN mod_logdistribucion.dat_productosbalanceo.cantcomprar
IS 'Cantidad de productos que se necesitan comprar.';

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_fk2 FOREIGN KEY (iddocpedido)
    REFERENCES mod_logdistribucion.dat_pedido(iddocumento)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_fk FOREIGN KEY (iddocbalanceo)
    REFERENCES mod_logdistribucion.dat_docbalanceo(iddocbalanceo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_fk1 FOREIGN KEY (idclasificacionabc)
    REFERENCES mod_logabc.nom_clasificacionabc(idclasificacionabc)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_fk3 FOREIGN KEY (idindicador)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_fk4 FOREIGN KEY (idproductosbalanceopadre)
    REFERENCES mod_logdistribucion.dat_productosbalanceo(idproductosbalanceo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  OWNER TO zeolides;

ALTER SEQUENCE mod_logdistribucion.sec_datproductosbalanceo_seq
  OWNER TO zeolides;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ALTER COLUMN cantidadpedidos DROP DEFAULT;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD COLUMN parent_path public.ltree;

CREATE OR REPLACE FUNCTION mod_logdistribucion.ft_insert_prod_balanceo (
)
RETURNS trigger AS
$body$
DECLARE
        padre_rec mod_logdistribucion.dat_productosbalanceo;
        path public.LTREE;
     BEGIN

        IF TG_OP = 'INSERT' THEN
        	IF NEW.idproductosbalanceopadre = null THEN
                  NEW.idproductosbalanceopadre = NEW.idproductosbalanceo;
           	END IF;
               
			IF NEW.idproductosbalanceopadre = NEW.idproductosbalanceo THEN
              NEW.parent_path = (cast(NEW.idproductosbalanceo as varchar))::public.ltree;
			END IF;
           
            IF NEW.idproductosbalanceopadre <> NEW.idproductosbalanceo THEN
            	SELECT * into  padre_rec FROM mod_logdistribucion.dat_productosbalanceo WHERE idproductosbalanceo = NEW.idproductosbalanceopadre;
                SELECT parent_path FROM mod_logdistribucion.dat_productosbalanceo WHERE idproductosbalanceo = padre_rec.idproductosbalanceo INTO path;
                
                 IF path IS NOT NULL THEN
                 	NEW.parent_path = public.text2ltree(public.ltree2text(path)||'.'||NEW.idproductosbalanceo);
                 END IF;
            END IF;
         	   
        END IF;

		EXECUTE 'ALTER sequence mod_logdistribucion.sec_datproductosbalanceo_seq RESTART ' ||New.idproductosbalanceo + 1;

	RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE TRIGGER dat_productosbalanceo_tr
  BEFORE INSERT 
  ON mod_logdistribucion.dat_productosbalanceo
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_logdistribucion.ft_insert_prod_balanceo();

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_idx 
    UNIQUE (idindicador, iddocbalanceo, iddocpedido) NOT DEFERRABLE;

ALTER INDEX mod_logdistribucion.dat_productosbalanceo_idx
  OWNER TO zeolides;

CREATE SEQUENCE mod_logdistribucion.sec_datprodbalanceodist_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logdistribucion.sec_datprodbalanceodist_seq RESTART WITH 1000000030;

CREATE TABLE mod_logdistribucion.dat_prodbalanceodistribuir (
  idprodbalanceodist NUMERIC(19,0) DEFAULT nextval('mod_logdistribucion.sec_datprodbalanceodist_seq'::regclass) NOT NULL,
  idproductobalanceo NUMERIC(19,0) NOT NULL,
  idproducto NUMERIC(19,0) NOT NULL,
  cantidad NUMERIC(25,6) DEFAULT 0 NOT NULL,
  PRIMARY KEY(idprodbalanceodist)
) 
WITH (oids = false);

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ALTER COLUMN idproductobalanceo SET STATISTICS 0;

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceodistribuir.idproductobalanceo
IS 'Llave foranea de la tabla dat_productobalanceo';

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceodistribuir.idproducto
IS 'Id de la tabla dat_producto. Por aqui se puede saber la referencia en cuanto a existencia, disponible, ueb y almacen al que pertenece el producto.';

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceodistribuir.cantidad
IS 'Cantidad a distribuir';

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD CONSTRAINT dat_prodbalanceodistribuir_fk FOREIGN KEY (idproductobalanceo)
    REFERENCES mod_logdistribucion.dat_productosbalanceo(idproductosbalanceo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD CONSTRAINT dat_prodbalanceodistribuir_fk1 FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
      ADD CONSTRAINT dat_prodbalanceodistribuir_idx 
        UNIQUE (idproductobalanceo, idproducto) NOT DEFERRABLE;

ALTER SEQUENCE mod_logdistribucion.sec_datprodbalanceodist_seq
  OWNER TO zeolides;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  OWNER TO zeolides;

-- object recreation
ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  DROP CONSTRAINT dat_prodbalanceodistribuir_fk1 RESTRICT;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD CONSTRAINT dat_prodbalanceodistribuir_fk1 FOREIGN KEY (idproducto)
    REFERENCES mod_logistica.dat_producto(idproducto)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

-- object recreation
ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  DROP CONSTRAINT dat_prodbalanceodistribuir_fk RESTRICT;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD CONSTRAINT dat_prodbalanceodistribuir_fk FOREIGN KEY (idproductobalanceo)
    REFERENCES mod_logdistribucion.dat_productosbalanceo(idproductosbalanceo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

CREATE OR REPLACE FUNCTION mod_logdistribucion.ft_insert_prod_balanceo (
)
RETURNS trigger AS
$body$
DECLARE
        padre_rec mod_logdistribucion.dat_productosbalanceo;
        path public.LTREE;
     BEGIN


        	IF NEW.idproductosbalanceopadre IS NULL THEN
                  NEW.idproductosbalanceopadre = NEW.idproductosbalanceo;
           	END IF;
               
			IF NEW.idproductosbalanceopadre = NEW.idproductosbalanceo THEN
              NEW.parent_path = (cast(NEW.idproductosbalanceo as varchar))::public.ltree;
			END IF;
           
            IF NEW.idproductosbalanceopadre <> NEW.idproductosbalanceo THEN
            	SELECT * into  padre_rec FROM mod_logdistribucion.dat_productosbalanceo WHERE idproductosbalanceo = NEW.idproductosbalanceopadre;
                SELECT parent_path FROM mod_logdistribucion.dat_productosbalanceo WHERE idproductosbalanceo = padre_rec.idproductosbalanceo INTO path;
                
                 IF path IS NOT NULL THEN
                 	NEW.parent_path = public.text2ltree(public.ltree2text(path)||'.'||NEW.idproductosbalanceo);
                 END IF;
            END IF;
         	   
        

		EXECUTE 'ALTER sequence mod_logdistribucion.sec_datproductosbalanceo_seq RESTART ' ||New.idproductosbalanceo + 1;

	RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  DROP CONSTRAINT dat_productosbalanceo_fk2 RESTRICT;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_fk2 FOREIGN KEY (iddocpedido)
    REFERENCES mod_logdistribucion.dat_pedido(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

CREATE OR REPLACE FUNCTION mod_logdistribucion.ft_insert_prod_balanceo (
)
RETURNS trigger AS
$body$
DECLARE
        padre_rec mod_logdistribucion.dat_productosbalanceo;
        path public.LTREE;
     BEGIN
 
			IF NEW.idproductosbalanceopadre IS NULL THEN
            	NEW.parent_path = (cast(NEW.idproductosbalanceo as varchar))::public.ltree;
			ELSE
            	SELECT * into  padre_rec FROM mod_logdistribucion.dat_productosbalanceo WHERE idproductosbalanceo = NEW.idproductosbalanceopadre;
                SELECT parent_path FROM mod_logdistribucion.dat_productosbalanceo WHERE idproductosbalanceo = padre_rec.idproductosbalanceo INTO path;
                
                IF path IS NOT NULL THEN
					NEW.parent_path = public.text2ltree(public.ltree2text(path)||'.'||NEW.idproductosbalanceo);
                END IF;
            END IF;

		EXECUTE 'ALTER sequence mod_logdistribucion.sec_datproductosbalanceo_seq RESTART ' ||New.idproductosbalanceo + 1;

	RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE TABLE mod_logdistribucion.dat_prodbalanceopedido (
  idproductobalanceopedido NUMERIC(19,0) NOT NULL,
  idproductobalanceo NUMERIC(19,0) NOT NULL,
  iddocpedido NUMERIC(19,0) NOT NULL,
  cantidadpedidos NUMERIC(25,6),
  cantdistribuidos NUMERIC(25,6) DEFAULT 0,
  cantcomprar NUMERIC(25,6) DEFAULT 0,
  PRIMARY KEY(idproductobalanceopedido)
) 
WITH (oids = false);

ALTER TABLE mod_logdistribucion.dat_prodbalanceopedido
  ALTER COLUMN idproductobalanceo SET STATISTICS 0;

CREATE SEQUENCE mod_logdistribucion.sec_datproductobalanceopedido_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logdistribucion.sec_datproductobalanceopedido_seq RESTART WITH 1000000081;

ALTER TABLE mod_logdistribucion.dat_prodbalanceopedido
  ALTER COLUMN idproductobalanceopedido SET DEFAULT nextval('mod_logdistribucion.sec_datproductobalanceopedido_seq'::regclass);

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceopedido.idproductobalanceopedido
IS 'Id de la tabla';

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceopedido.idproductobalanceo
IS 'Foranea con dat_productobalanceo';

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceopedido.iddocpedido
IS 'Foranea con iddocumento de pedido';

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceopedido.cantidadpedidos
IS 'Cantidad solicitada';

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceopedido.cantdistribuidos
IS 'Cantidad a distribuid';

COMMENT ON COLUMN mod_logdistribucion.dat_prodbalanceopedido.cantcomprar
IS 'Cantidad de productos que se necesitan comprar';

ALTER TABLE mod_logdistribucion.dat_prodbalanceopedido
  ADD CONSTRAINT dat_prodbalanceopedido_fk FOREIGN KEY (idproductobalanceo)
    REFERENCES mod_logdistribucion.dat_productosbalanceo(idproductosbalanceo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_prodbalanceopedido
  ADD CONSTRAINT dat_prodbalanceopedido_fk1 FOREIGN KEY (iddocpedido)
    REFERENCES mod_logdistribucion.dat_pedido(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  DROP COLUMN iddocpedido;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  DROP COLUMN cantidadpedidos;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  DROP COLUMN cantdistribuidos;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  DROP COLUMN cantcomprar;

ALTER TABLE mod_logdistribucion.dat_prodbalanceopedido
  ADD CONSTRAINT dat_prodbalanceopedido_idx 
    UNIQUE (idproductobalanceo, iddocpedido) NOT DEFERRABLE;

CREATE TABLE mod_logdistribucion.dat_pedidosatisfechobalanceo (
  iddocpedido NUMERIC(19,0) NOT NULL,
  satisfecho NUMERIC(1,0) DEFAULT 0 NOT NULL,
  PRIMARY KEY(iddocpedido)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logdistribucion.dat_pedidosatisfechobalanceo.satisfecho
IS 'Indica si el pedido ha sido satisfacido mediante el balanceo';

ALTER TABLE mod_logdistribucion.dat_pedidosatisfechobalanceo
  ADD CONSTRAINT dat_pedidosatisfechobalanceo_fk FOREIGN KEY (iddocpedido)
    REFERENCES mod_logdistribucion.dat_pedido(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

CREATE TABLE mod_logdistribucion.dat_prodpedidosatisfechobalanceo (
  idproductopedido NUMERIC(19,0) NOT NULL,
  cantidadprocesada NUMERIC(25,6) DEFAULT 0 NOT NULL,
  cantidadnecesaria NUMERIC(25,6) NOT NULL,
  PRIMARY KEY(idproductopedido)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logdistribucion.dat_prodpedidosatisfechobalanceo.idproductopedido
IS 'Llave primaria y foranea de dat_productopedido';

COMMENT ON COLUMN mod_logdistribucion.dat_prodpedidosatisfechobalanceo.cantidadprocesada
IS 'Es la cantidad que se va satisfaciendo.';

COMMENT ON COLUMN mod_logdistribucion.dat_prodpedidosatisfechobalanceo.cantidadnecesaria
IS 'Es la cantidad necesaria para satisfacer el pedido de este producto en especifico';

ALTER TABLE mod_logdistribucion.dat_prodpedidosatisfechobalanceo
  ADD CONSTRAINT dat_prodpedidosatisfechobalanceo_fk FOREIGN KEY (idproductopedido)
    REFERENCES mod_logdistribucion.dat_productopedido(idproductopedido)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_productopedido DROP CONSTRAINT IF EXISTS dat_productopedido_fk;

ALTER TABLE mod_logdistribucion.dat_productopedido
  ADD CONSTRAINT dat_productopedido_fk FOREIGN KEY (idpedido)
    REFERENCES mod_logdistribucion.dat_pedido(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_productopedido DROP CONSTRAINT IF EXISTS dat_productopedido_fk1;

ALTER TABLE mod_logdistribucion.dat_productopedido
  ADD CONSTRAINT dat_productopedido_fk1 FOREIGN KEY (idproducto)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

COMMENT ON COLUMN mod_logdistribucion.dat_pedidosatisfechobalanceo.satisfecho
IS 'Indica si el pedido ha sido satisfacido mediante el balanceo. 0 => No satisfecho, 1 => Si satisfecho.';

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_idx 
    UNIQUE (idindicador, iddocbalanceo) NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_pedidosatisfechobalanceo
  OWNER TO zeolides;

ALTER TABLE mod_logdistribucion.dat_prodpedidosatisfechobalanceo
  OWNER TO zeolides;

ALTER TABLE mod_logdistribucion.dat_prodbalanceopedido
  OWNER TO zeolides;

ALTER SEQUENCE mod_logdistribucion.sec_datproductobalanceopedido_seq
  OWNER TO zeolides;

 -- object recreation
ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  DROP CONSTRAINT dat_productosbalanceo_idx RESTRICT;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_idx 
    UNIQUE (idindicador, iddocbalanceo, idproductosbalanceopadre) NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  DROP CONSTRAINT dat_prodbalanceodistribuir_idx RESTRICT;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  DROP COLUMN idproductobalanceo;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD COLUMN idproductobalanceopedido NUMERIC(19,0);

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD CONSTRAINT dat_prodbalanceodistribuir_fk FOREIGN KEY (idproductobalanceopedido)
    REFERENCES mod_logdistribucion.dat_prodbalanceopedido(idproductobalanceopedido)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_prodbalanceodistribuir
  ADD CONSTRAINT dat_prodbalanceodistribuir_idx1 
    UNIQUE (idproducto, idproductobalanceopedido) NOT DEFERRABLE;

ALTER TABLE mod_logdistribucion.dat_prodbalanceopedido
  DROP COLUMN cantdistribuidos;

ALTER TABLE mod_logdistribucion.dat_pedido DROP CONSTRAINT IF EXISTS dat_pedido_fk;

ALTER TABLE mod_logdistribucion.dat_pedido
  ADD CONSTRAINT dat_pedido_fk FOREIGN KEY (iddocumento)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  DROP CONSTRAINT dat_productosbalanceo_idx RESTRICT;

ALTER TABLE mod_logdistribucion.dat_productosbalanceo
  ADD CONSTRAINT dat_productosbalanceo_idx 
    UNIQUE (idindicador, iddocbalanceo) NOT DEFERRABLE;

