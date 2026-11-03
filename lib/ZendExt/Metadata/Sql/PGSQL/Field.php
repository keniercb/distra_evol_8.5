<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class ZendExt_Metadata_Sql_PGSQL_Field
{

    public function adicionarCampo($table, $denominacion, $tipo, $longitud, $permite_nulo, $secuencia, $llave_primaria, $precision)
    {
        $sql = "ALTER TABLE {$table->esquema}.{$table->tabla} ADD COLUMN \"{$denominacion}\" $tipo";
        if ($longitud && !$precision) {
            $sql .= "($longitud)";
        }elseif ($longitud){
        	$sql .= "($longitud,$precision)";
        }
        
        return $sql;
    }

    function crearSecuencia($pName)
    {
        $sql = "CREATE SEQUENCE $pName";
        return $sql;
    }

    function obtenerPrimaryKeyDeTabla($pSchema, $pTable)
    {
        return "SELECT column_name FROM information_schema.key_column_usage cu
                INNER JOIN information_schema.table_constraints tc ON tc.constraint_name = cu.constraint_name
                WHERE constraint_type = 'PRIMARY KEY' AND
                cu.table_schema = '{$pSchema}' AND cu.table_name = '{$pTable}'";
    }

    function obtenerCamposDeTabla($pSchema, $pTable)
    {
        return "SELECT * FROM information_schema.columns where table_name = '{$pTable}' AND
                table_schema = '{$pSchema}'";
    }

    function adicionarCampoALaLlavePrimaria($pField)
    {
        $sql = "ALTER TABLE {$pField->DatTabla->esquema}.{$pField->DatTabla->tabla}
                    ADD PRIMARY KEY ({$pField->denominacion});";
        return $sql;
    }

    function ponerNoNulo($pField)
    {
        $sql = "ALTER TABLE {$pField->DatTabla->esquema}.{$pField->DatTabla->tabla}
                    ALTER COLUMN \"{$pField->denominacion}\" SET NOT NULL;";
        return $sql;
    }

    function definirValorPorDefecto($pField, $pValue)
    {
        $sql = "ALTER TABLE {$pField->DatTabla->esquema}.{$pField->DatTabla->tabla}
                ALTER COLUMN {$pField->denominacion} SET DEFAULT ($pValue);";
        return $sql;
    }

    function crearFuncionesArbol($pTable)
    {
        $id = str_replace('nom_', 'id', $pTable->tabla);
        $esquema = $pTable->esquema;
        $tabla = $pTable->tabla;
        $func = "reordenar_$tabla";

        $sql
            = 'CREATE OR REPLACE FUNCTION mod_contabilidad.reordenar_nom_cuenta(idnomcuentanodo bigint, 
                    ordenizqnodo bigint)
                    RETURNS bigint AS
                    $BODY$
                    DECLARE
                           ultimoordender BIGINT;
                           canthijos INTEGER;
                           esprimero INTEGER;
                           hijo RECORD;
                    BEGIN
                    SET search_path = mod_contabilidad;
                     canthijos := count(idnomcuenta) FROM nom_cuenta WHERE idpadre = $1 
                    AND idnomcuentapadre <> idnomcuenta;
                     IF canthijos > 0 THEN
                        ultimoordender := $2 + 1;
                     ELSE
                         esprimero := 1;
                         FOR hijo IN SELECT idnomcuenta, ordenizq FROM nom_cuenta WHERE idnomcuenta = $1 LOOP
                             IF esprimero = 1 THEN
                                hijo.ordenizq := $2 + 1;
                                esprimero := 0;
                             ELSE
                                 hijo.ordenizq := ultimoordender + 1;
                             END IF;
                             ultimoordender := reordenar_nom_cuenta(hijo.idnomcuenta, hijo.ordenizq);
                             UPDATE nom_cuenta SET ordenizq = hijo.ordenizq, ordender = ultimoordender
                     WHERE idnomcuenta = hijo.idnomcuenta;
                         END LOOP;
                     END IF;
                     RETURN ultimoordender;
                END;
                $BODY$
                LANGUAGE \'plpgsql\' VOLATILE;

				CREATE OR REPLACE FUNCTION "mod_contabilidad"."actualizar_arbol_cuenta" ()
				RETURNS trigger AS
				$body$
				BEGIN
				if (new.idcuentapadre is null ) then
					new.idcuentapadre = new.idnomcuenta;
				end if;
				RETURN new;
				END;
				$body$
				LANGUAGE \'plpgsql\'
				IMMUTABLE
				CALLED ON NULL INPUT
				SECURITY INVOKER;
				
				CREATE OR REPLACE FUNCTION "mod_contabilidad"."eliminar_nodo_cuenta" () RETURNS trigger AS
                $body$
                DECLARE
                       ancho BIGINT;
                BEGIN
                        SET search_path = mod_contabilidad;
                        ancho := OLD.ordender - OLD.ordenizq + 1;
                        UPDATE nom_cuenta SET ordender = ordender - 2 WHERE ordender > OLD.ordender - ancho;
                        UPDATE nom_cuenta SET ordenizq = ordenizq - 2 WHERE ordenizq > OLD.ordender - ancho;
                        RETURN OLD;
                        EXCEPTION WHEN foreign_key_violation THEN
                         RETURN OLD;
                END;
                $body$
                LANGUAGE \'plpgsql\' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER;

                CREATE OR REPLACE FUNCTION mod_contabilidad.insertar_nodo_cuenta()
                  RETURNS trigger AS
                $BODY$
                DECLARE
                        derecha bigint;
                BEGIN
                        SET search_path = mod_contabilidad;
                        IF NEW.idnomcuenta != NEW.idnomcuentapadre THEN
                       derecha := ordender FROM nom_cuenta WHERE idnomcuenta = NEW.idnomcuentapadre;
                       UPDATE nom_cuenta SET ordender = ordender + 2 WHERE ordender >= derecha;
                       UPDATE nom_cuenta SET ordenizq = ordenizq + 2 WHERE ordenizq > derecha;
                       NEW.ordenizq := derecha;
                       NEW.ordender := derecha + 1;
                    ELSE
                        derecha :=  MAX(ordender) FROM nom_cuenta WHERE idnomcuenta = idnomcuentapadre;
                        IF NOT nullvalue(derecha) THEN
                           NEW.ordenizq := derecha + 1;
                           NEW.ordender := derecha + 2;
                        ELSE
                            NEW.ordenizq := 1;
                            NEW.ordender := 2;
                        END IF;
                    END IF;
                        RETURN NEW;
                END;
                $BODY$
                  LANGUAGE \'plpgsql\' VOLATILE;

                CREATE OR REPLACE FUNCTION mod_contabilidad.modificar_nodo_cuenta()
                RETURNS trigger AS
                $BODY$
                DECLARE
                raiz RECORD;
                esprimero INTEGER;
                ultimoordender BIGINT;
                BEGIN
                IF OLD.idnomcuentapadre != NEW.idnomcuentapadre THEN
                    SET search_path = mod_contabilidad;
                    esprimero := 1;
                    FOR raiz IN SELECT idnomcuenta, ordenizq FROM nom_cuenta WHERE idnomcuenta = idnomcuentapadre LOOP
                        IF esprimero = 1 THEN
                    raiz.ordenizq := 1;
                    esprimero := 0;
                 ELSE
                     raiz.ordenizq := ultimoordender + 1;
                 END IF;
                 ultimoordender := reordenar_nom_cuenta(raiz.idnomcuenta, raiz.ordenizq);
                 UPDATE nom_cuenta SET ordenizq = raiz.ordenizq, ordender = ultimoordender 
                    WHERE idnomcuenta = raiz.idnomcuenta;
                    END LOOP;
                END IF;
                RETURN NEW;
                END;
                $BODY$
                LANGUAGE \'plpgsql\' VOLATILE;


                CREATE TRIGGER "eliminar_cuenta" AFTER DELETE
                ON "mod_contabilidad"."nom_cuenta" FOR EACH ROW
                EXECUTE PROCEDURE "mod_contabilidad"."eliminar_nodo_cuenta"();
				
				CREATE TRIGGER "t_actualizarpadre" BEFORE INSERT 
				ON "mod_contabilidad"."nom_cuenta" FOR EACH ROW 
				EXECUTE PROCEDURE "mod_contabilidad"."actualizar_arbol_cuenta"();

                CREATE TRIGGER "insertar_cuenta" BEFORE INSERT
                ON "mod_contabilidad"."nom_cuenta" FOR EACH ROW
                EXECUTE PROCEDURE "mod_contabilidad"."insertar_nodo_cuenta"();

                CREATE TRIGGER "modificar_cuenta" AFTER UPDATE
                ON "mod_contabilidad"."nom_cuenta" FOR EACH ROW
                EXECUTE PROCEDURE "mod_contabilidad"."modificar_nodo_cuenta"();';

        $sql = str_replace('mod_contabilidad', $esquema, $sql);
        $sql = str_replace('reordenar_nom_cuenta', $func, $sql);
        $sql = str_replace('eliminar_nodo_cuenta', "eliminar_nodo_$tabla", $sql);
        $sql = str_replace('modificar_nodo_cuenta', "modificar_nodo_$tabla", $sql);
        $sql = str_replace('insertar_nodo_cuenta', "insertar_nodo_$tabla", $sql);
        $sql = str_replace('actualizar_arbol_cuenta', "actualizar_arbol_$tabla", $sql);

        $sql = str_replace('insertar_cuenta', "insertar_$tabla", $sql);
        $sql = str_replace('eliminar_cuenta', "eliminar_$tabla", $sql);
        $sql = str_replace('modificar_cuenta', "modificar_$tabla", $sql);

        $sql = str_replace('nom_cuenta', $tabla, $sql);
        $sql = str_replace('idnomcuenta', $id, $sql);
        $sql = str_replace('idnomcuenta', $id, $sql);
        $sql = str_replace('idcuentapadre', $id . "padre", $sql);

        return $sql;
    }

    function crearFuncEliminarArbol($pTable)
    {
        $sql = "CREATE OR REPLACE FUNCTION {$pTable->esquema}.eliminar_nodo_{$pTable->tabla} () RETURNS trigger AS";
        $sql .= '$body$';
        $sql .= "DECLARE
                           ancho BIGINT;
                    BEGIN
                            SET search_path = {$pTable->esquema};
                            ancho := OLD.ordender - OLD.ordenizq + 1;
                            UPDATE nom_cuenta SET ordender = ordender - 2 WHERE ordender > OLD.ordender - ancho;
                            UPDATE nom_cuenta SET ordenizq = ordenizq - 2 WHERE ordenizq > OLD.ordender - ancho;
                            RETURN OLD;
                            EXCEPTION WHEN foreign_key_violation THEN
                             RETURN OLD;
                    END;";
        $sql .= '$body$';
        $sql .= "LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER";

        return $sql;
    }

    function crearFuncInsertarArbol($pTable)
    {
        $sql = "CREATE OR REPLACE FUNCTION {$pTable->esquema}.insertar_nodo_{$pTable->tabla} () "
            . "RETURNS trigger AS";
        $sql .= '$body$';
        $sql .= "DECLARE
                        derecha bigint;
                BEGIN
                        SET search_path = {$pTable->esquema}
                        IF NEW.idnomcuenta != NEW.idnomcuentapadre THEN
                       derecha := ordender FROM nom_cuenta WHERE idnomcuenta = NEW.idnomcuentapadre;
                       UPDATE nom_cuenta SET ordender = ordender + 2 WHERE ordender >= derecha;
                       UPDATE nom_cuenta SET ordenizq = ordenizq + 2 WHERE ordenizq > derecha;
                       NEW.ordenizq := derecha;
                       NEW.ordender := derecha + 1;
                    ELSE
                        derecha :=  MAX(ordender) FROM nom_cuenta WHERE idnomcuenta = idnomcuentapadre;
                        IF NOT nullvalue(derecha) THEN
                           NEW.ordenizq := derecha + 1;
                           NEW.ordender := derecha + 2;
                        ELSE
                            NEW.ordenizq := 1;
                            NEW.ordender := 2;
                        END IF;
                    END IF;
                        RETURN NEW;
                END;";

        $sql .= '$body$';
        $sql .= "LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER";

        return $sql;
    }

    public function eliminarCampo($pField)
    {
        $sql = "ALTER TABLE {$pField->DatTabla->esquema}.{$pField->DatTabla->tabla}"
            . " DROP COLUMN \"{$pField->denominacion}\";";
        return $sql;
    }

}