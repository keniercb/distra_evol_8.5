<?php

class ZendExt_Nomencladores_Sql_Table
{

    /**
     * @var $_conn PDO Conexión a la BD.
     */
    private $_conn;
    private $_where;

    /**
     * Constructor
     *
     * @return ZendExt_Nom_Sql_Table
     */
    public function __construct($pConn = null)
    {
        $this->_conn = $pConn;
    }

    public function getTables($pLimit, $pOffset, $pEsquema, $pNoms)
    {
        $query = "SELECT table_name FROM information_schema.tables WHERE table_schema = '$pEsquema' order by table_name ASC";
        if ($pNoms) {
            $query .= " AND table_name LIKE 'nom_%'";
        }
        if ($pLimit) {
            $query .= " OFFSET($pOffset) LIMIT($pLimit)";
        }
        return $query;
    }

    /**
     * updateValues
     *
     * Genera la parte de Values de las consultas de actualización.
     *
     * @param $pValues Array Arreglo de valores.
     *
     * @return String.
     */
    private function updateValues($pValues)
    {
        $result = "";

        foreach (array_keys($pValues) as $var) {
            $result .= $var . " = '" . $pValues [$var] . "',";
        }

        return substr($result, 0, strlen($result) - 1);
    }

    /**
     * update
     *
     * Genera el código SQL para actualizar un elemento
     *
     * @param $pTable  String Nombre de la tabla.
     * @param $pValues Array Arreglo de valores para actualizar.
     * @param $pPKs    Array Arreglo de valores de las llaves primarias.
     *
     * @return $String.
     */
    public function update($pTable, $pValues, $pPKs)
    {
        $values = $this->updateValues($pValues);
        $where = $this->wherePart($pPKs);
        return "update $pTable set $values where $where";
    }

    private function wherePart($pKeys)
    {
        $result = "";

        foreach (array_keys($pKeys) as $key) {
            $result .= $key . "='" . $pKeys [$key] . "' and ";
        }

        $str = substr($result, 0, strlen($result) - 5);
        return $str;
    }

    /**
     * delete
     *
     * Elimina un elemento de una tabla.
     *
     * @param $pTable String Nombre de la tabla.
     * @param $pKey   Arreglo de llaves.
     *
     * @return String.
     */
    public function delete($pTable, $pKey)
    {
        $where = $this->wherePart($pKey);
        return "DELETE FROM $pTable WHERE $where";
    }

    /**
     * insert
     *
     * Inserta un elemento en una tabla.
     *
     * @param $pTable  String Nombre de la tabla.
     * @param $pValues Array Arreglo de valores a insertar.
     *
     * @return String.
     */
    public function insert($pTable, $pValues)
    {
        $attributes = "";
        $newValues = "";
        foreach (array_keys($pValues) as $items) {
            $attributes .= ',' . $items;

            if ($pValues [$items] == '') {
                $newValues .= ", null ";
            } else {
                $newValues .= ",'" . $pValues [$items] . "'";
            }
        }

        $newAttributes = substr($attributes, 1, strlen($attributes));
        $pnewValues = substr($newValues, 1, strlen($newValues));
        $query = "INSERT INTO $pTable ($newAttributes) VALUES ($pnewValues)";
        return $query;
    }

    /**
     * select
     *
     * Selecciona los elementos de una tabla.
     *
     * @param $pTable String Nombre de la tabla.
     *
     * @return String.
     */
    public function select($pTable, $pLimit, $pOffset, $pWhere, $pOrderBy)
    {
        $sql = "SELECT * FROM $pTable";
        if ($pWhere != null) {
            $sql .= " WHERE $pWhere";
        }
        if ($pOrderBy != null) {
            $sql .= " ORDER BY $pOrderBy";
        }
        if ($pLimit != 0) {
            $sql .= " OFFSET $pOffset LIMIT $pLimit";
        }
        return $sql;
    }

    public function getRelationFields($pSchema, $pTable)
    {
        return "SELECT presentacion.tablaf, presentacion.combdisplay, campos.field
				FROM campos
 				INNER JOIN presentacion ON (campos.idcampo = presentacion.campoidcampo)
 				INNER JOIN tablas ON (campos.tablasnombre = tablas.nombre)
 				where tablas.esquema = '$pSchema' and
 					  presentacion.tablaf != '' and	
 					  campos.tablasnombre = '$pTable'";
    }

    public function hasRelatedElements($pSchema, $pTable)
    {
        return "SELECT presentacion.tablaf
				FROM campos
 				INNER JOIN presentacion ON (campos.idcampo = presentacion.campoidcampo)
 				INNER JOIN tablas ON (campos.tablasnombre = tablas.nombre)
 				where presentacion.tablaf != '' and
 					  presentacion.tablaf != '$pTable' and
 					  tablas.esquema = '$pSchema' and
 					  campos.tablasnombre = '$pTable'";
    }

    public function selectParam($pTable, $pFields, $pLimit, $pOffset, $pWhere, $pOrderBy)
    {
        $fields = $this->formfields($pFields);
        $sql = "SELECT $fields FROM $pTable";
        if ($pWhere != null) {
            $sql .= " WHERE $pWhere";
        }
        if ($pOrderBy != null) {
            $sql .= " ORDER BY $pOrderBy";
        }
        if ($pLimit != 0) {
            $sql .= " OFFSET $pOffset LIMIT $pLimit";
        }
        return $sql;
    }

    private function formfields($pFields)
    {
        $f = "";
        $p = 0;
        foreach ($pFields as $field) {
            if ($p > 0) {
                $f .= ', ';
            }
            $f .= $field;
            $p++;
        }
        return $f;
    }

    /**
     * create
     *
     * Genera el código SQL para crear una tabla sin campos.
     *
     * @param $pTable String Nombre de la tabla.
     *
     * @return String.
     */
    public function createTable($pTable)
    {
        return "create table $pTable ()";
    }

    /**
     * dropTable
     *
     * Genera el código SQL para eliminar una tabla
     *
     * @param  $pTable String Nombre de la tabla
     *
     * @return String
     */
    function dropTable($pTable)
    {
        return "drop table $pTable cascade";
    }

    /**
     * Genera el código SQL para cambiar el nombre de la tabla para obtener un elemento de la tabla
     * @param  $pTable String Nombre de la tabla
     * @param  $pKey   String Nombre de la llave primaria
     * @param  $pSelectParams  Integer Nombre del valor del elemento a obtener
     * @return String
     */
    public function getOneElement($pTable, $pKey, $pSelectParams)
    {
        $idtable = '';
        $select = '';

        if (strpos($pTable, '.')) {
            $table = substr($pTable, strpos($pTable, '.') + 1);
            $idtable = str_replace('nom_', 'id', $table);
            $select = '*';
        } else {
            $idtable = str_replace('nom_', 'id', $pTable);
        }


        //echo '<pre>'; print_r ($pSelectParams); die;

        if ($select != '*') {
            foreach ($pSelectParams as $var) {
                $select .= "$var,";
            }

            //echo $select; die;

            $select = substr($select, 0, strlen($select) - 1);
        }

        $sql = "SELECT $select FROM $pTable where $idtable = " . $pKey;
        return $sql;
    }

    /**
     *  Genera el código SQL para contar la cantidad de tablas de un esquema dado.
     * @param  $pSchema String Nombre del esquema.
     * @param  $pTable String Nombre de la tabla nom_% (tipo nomenclador).
     * @return String
     */
    public function countTables($pSchema, $pTable)
    {
        $sql = "SELECT COUNT (*) FROM information_schema.tables WHERE table_schema = '$pSchema'";
        if ($pTable) {
            $sql .= " AND table_name LIKE 'nom_%'";
        }
        return $sql;
    }

    public function countFields($pTable, $pSchema)
    {
        $sql = "SELECT COUNT (*) FROM information_schema.columns WHERE table_schema = '$pSchema' "
                . "AND table_name = '$pTable'";
        return $sql;
    }

    public function countValues($pTable, $pWhere)
    {
        $sql = "SELECT COUNT (*) FROM $pTable";
        if ($pWhere != null) {
            $sql .= " WHERE $pWhere";
        }
        return $sql;
    }

    public function insertTableOnCatalog($pSchema, $pTable, $pTree, $pEnabled, $pNativo)
    {
        return "insert into tablas values ('$pTable', $pTree, $pEnabled, $pNativo,'$pSchema')";
    }

    public function deleteTableOnCatalog($pTable)
    {
        $sql = array();
        $sql [] = "delete from campos  where tablasnombre='$pTable'";
        $sql [] = "delete from tablas_categoria  where tablasnombre='$pTable'";
        $sql [] = "delete from tablas where nombre = '$pTable'";
        return $sql;
    }

    public function tableExist($pSchema, $pNom)
    {
        //return "select * from tablas where nombre='$pNom'";
        return "SELECT table_name FROM information_schema.tables WHERE table_name = '$pNom' "
                . "AND table_schema = '$pSchema'";
    }

    public function fieldExist($pSchema, $pTable, $pField)
    {
        //return "select * from tablas where nombre='$pNom'";
        return "SELECT column_name FROM information_schema.columns WHERE table_name = '$pTable' "
                . "AND table_schema = '$pSchema' AND column_name = '$pField'";
    }

    public function IsTree($pTable)
    {
        return "select * from tablas where tablas.tree = true and tablas.nombre = '$pTable'";
    }

    public function getRegisters($pTable)
    {
        return "SELECT
                          categoria.n_categoria
                        FROM
                          mod_datosmaestros.tablas_categoria,
                          mod_datosmaestros.categoria
                        WHERE
                          categoria.id_categoria = tablas_categoria.categoriaid_categoria AND
                          tablas_categoria.tablasnombre = '$pTable'";
    }

    public function addSecuencia($pTable, $pPK, $pEsquema)
    {
        $sql = "insert into mod_datosmaestros.nom_secuenciasnomencladores (nombresecuencia,
		valor_inicial,valor_incrementar,valor_final,nombreesquema) 
                values ('sec_{$pTable}_{$pPK}_seq','1','1','8000000','$pEsquema');";

        return $sql
                . "alter table {$pEsquema}.nom_{$pTable} alter column {$pPK} "
                . "set default nextval ('{$pEsquema}.sec_{$pTable}_{$pPK}_seq')";
    }

    public function triggerInsert($pTable, $pEsquema)
    {
        return "CREATE OR REPLACE FUNCTION " . $pEsquema . ".ft_insertar_nodo_" . $pTable . " () RETURNS trigger AS
\$body$
DECLARE
        derecha bigint;
BEGIN
	SET search_path = " . $pEsquema . ";
	IF NEW.id$pTable != NEW.idpadre THEN
       derecha := ordender FROM $pEsquema." . 'nom_' . $pTable . " WHERE id$pTable = NEW.idpadre;
       UPDATE $pEsquema." . 'nom_' . $pTable . " SET ordender = ordender + 2 WHERE ordender >= derecha;
       UPDATE $pEsquema." . 'nom_' . $pTable . " SET ordenizq = ordenizq + 2 WHERE ordenizq > derecha;
       NEW.ordenizq := derecha;
       NEW.ordender := derecha + 1;
    ELSE
        derecha :=  MAX(ordender) FROM $pEsquema." . 'nom_' . $pTable . " WHERE id$pTable = idpadre;
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
\$body$
LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER;
CREATE TRIGGER t_insertar_" . $pTable . " BEFORE INSERT 
ON " . $pEsquema . ".nom_" . $pTable . " FOR EACH ROW 
EXECUTE PROCEDURE " . $pEsquema . ".ft_insertar_nodo_" . $pTable . "();

CREATE OR REPLACE FUNCTION " . $pEsquema . ".ft_actualizacion_arbol_" . $pTable . " () RETURNS trigger AS
\$body$
BEGIN
if (new.idpadre is null ) then
    new.idpadre = new.id$pTable;
end if;
RETURN new;
END;
\$body$
LANGUAGE 'plpgsql' IMMUTABLE CALLED ON NULL INPUT SECURITY INVOKER;

CREATE TRIGGER t_actualizarpadre" . $pTable . " BEFORE INSERT 
ON " . $pEsquema . ".nom_" . $pTable . " FOR EACH ROW 
EXECUTE PROCEDURE " . $pEsquema . ".ft_actualizacion_arbol_" . $pTable . "();

CREATE OR REPLACE FUNCTION " . $pEsquema . ".ft_eliminar_nodo_" . $pTable . " () RETURNS trigger AS
\$body$
DECLARE
       ancho BIGINT;
BEGIN
	SET search_path =" . $pEsquema . ";
	ancho := OLD.ordender - OLD.ordenizq + 1;
	UPDATE $pEsquema." . 'nom_' . $pTable . " SET ordender = ordender - 2 WHERE ordender > OLD.ordender - ancho;
	UPDATE $pEsquema." . 'nom_' . $pTable . " SET ordenizq = ordenizq - 2 WHERE ordenizq > OLD.ordender - ancho;
	RETURN OLD;
	EXCEPTION WHEN foreign_key_violation THEN
         RETURN OLD;
END;
\$body$
LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER;

CREATE TRIGGER t_eliminar_" . $pTable . " AFTER DELETE 
ON " . $pEsquema . ".nom_" . $pTable . " FOR EACH ROW 
EXECUTE PROCEDURE " . $pEsquema . ".ft_eliminar_nodo_" . $pTable . "();

CREATE OR REPLACE FUNCTION " . $pEsquema . ".f_reordenar_nom_" . $pTable . " (idnodo numeric, ordenizqnodo numeric) 
    RETURNS numeric AS
\$body$
DECLARE
       ultimoordender BIGINT;
       canthijos INTEGER;
       esprimero INTEGER;
       hijo RECORD;
BEGIN
     SET search_path = $pEsquema;
     canthijos := count(id$pTable) FROM $pEsquema." . 'nom_' . $pTable . " WHERE idpadre = $1 AND idpadre <> id$pTable;
     IF canthijos > 0 THEN
        ultimoordender := $2 + 1;
     ELSE
         esprimero := 1;
         FOR hijo IN SELECT id$pTable, ordenizq FROM $pEsquema." . 'nom_' . $pTable . " WHERE id$pTable = $1 LOOP
             IF esprimero = 1 THEN
                hijo.ordenizq := $2 + 1;
                esprimero := 0;
             ELSE
                 hijo.ordenizq := ultimoordender + 1;
             END IF;
             ultimoordender := f_reordenar_nom_" . $pTable . "(hijo.id$pTable, hijo.ordenizq);
             UPDATE $pEsquema." . 'nom_' . $pTable . " SET ordenizq = hijo.ordenizq, ordender = ultimoordender "
                . "WHERE id$pTable = hijo.id$pTable;
         END LOOP;
     END IF;
     RETURN ultimoordender;
END;
\$body$
LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER;

CREATE OR REPLACE FUNCTION $pEsquema.ft_modificar_nodo_" . $pTable . " () RETURNS trigger AS
\$body$
DECLARE
	raiz RECORD;
	esprimero INTEGER;
	ultimoordender BIGINT;
BEGIN
	IF OLD.idpadre != NEW.idpadre THEN
		SET search_path = $pEsquema;
		esprimero := 1;
		FOR raiz IN SELECT id$pTable, ordenizq FROM $pEsquema." . 'nom_' . $pTable . " WHERE id$pTable = idpadre LOOP
		    IF esprimero = 1 THEN
                raiz.ordenizq := 1;
                esprimero := 0;
             ELSE
                 raiz.ordenizq := ultimoordender + 1;
             END IF;
             ultimoordender := f_reordenar_nom_" . $pTable . "(raiz.id$pTable, raiz.ordenizq);
             UPDATE $pEsquema." . 'nom_' . $pTable . " SET ordenizq = raiz.ordenizq, ordender = ultimoordender "
                . "WHERE id$pTable = raiz.id$pTable;
		END LOOP;
	END IF;
	RETURN NEW;
END;
\$body$
LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER;

CREATE TRIGGER t_modificar_" . $pTable . " AFTER UPDATE 
ON $pEsquema.nom_" . $pTable . " FOR EACH ROW 
EXECUTE PROCEDURE $pEsquema.ft_modificar_nodo_" . $pTable . "();";
    }

    public function obtEsquema($pTable)
    {
        return "select esquema from tablas where nombre = '$pTable'";
    }

    public function addExtNom($pTable, $pSchema)
    {
        $sql [] = "select table_name from information_schema.tables "
                . "where table_schema = '$pSchema' and table_name = '$pTable'";
        $sql [] = "select column_name, data_type, is_nullable, column_default,numeric_precision,datetime_precision "
                . "from information_schema.columns "
                . "where table_schema = '$pSchema' and table_name = '$pTable' ";
        $sql [] = "select constraint_name from information_schema.table_constraints "
                . "where table_schema = '$pSchema' and table_name = '$pTable'";
        return $sql;
    }

    public function compConstraints($pConstraint)
    {
        return "select conkey,confkey from pg_constraint where conname = '$pConstraint'";
    }

    public function getSchemas()
    {
        return "select schema_name from information_schema.schemata";
    }

    public function getParent($pTable, $pId)
    {
        $idName = str_replace('nom_', 'id', $pTable);
        return "select * from $pTable where $idName = $pId";
    }

    public function getForest($pTable, $pIdExtComun)
    {
        $campoid = substr($pTable, strpos($pTable, '.'));
        $campoid = str_replace('nom_', 'id', $campoid);

        return ($pIdExtComun != null) ? "select * from $pTable
                                                    where $pTable.$campoid = idpadre and
                                                          $pTable.idestructuracomun = $pIdExtComun" : "select * from $pTable
                                                    where $pTable.$campoid = idpadre";
    }

    public function findByLike($pTree, $pLikeParams, $pWhereParams, $pSelectParams)
    {
        $likePart = '';
        $selectPart = '';
        $wherePart = '';
        $selectPart = '';

        if ($pSelectParams != null) {
            foreach ($pSelectParams as $var) {
                $selectPart .= "$var,";
            }
        }

        if ($pLikeParams != null) {
            foreach ($pLikeParams as $index => $value) {
                $likePart .= "$index like '%$value%' or ";
            }
        }

        if ($pWhereParams != null) {
            foreach ($pWhereParams as $index => $value) {
                $wherePart .= "$index = '$value' and";
            }
        }

        $likePart = substr($likePart, 0, strlen($likePart) - 3);
        $wherePart = substr($wherePart, 0, strlen($wherePart) - 3);
        $selectPart = substr($wherePart, 0, strlen($wherePart) - 1);

        return ($wherePart != '') ? "select *
									  from $pTree
									  where $likePart and $wherePart" : "select *
									  from $pTree
									  where $likePart";
    }

    public function isForeignKey($pSchema, $pTable, $pField)
    {
        return "SELECT
              referential_constraints.unique_constraint_schema
            FROM
              information_schema.referential_constraints,
              information_schema.key_column_usage
            WHERE
              referential_constraints.constraint_schema = key_column_usage.constraint_schema AND
              key_column_usage.constraint_name = referential_constraints.constraint_name AND
              key_column_usage.column_name = '$pField' AND
              key_column_usage.table_schema = '$pSchema' AND
              key_column_usage.table_name = '$pTable'";
    }

    public function getForeignDatils($pforeignField)
    {
        return "SELECT
              key_column_usage.table_name,
              columns.column_name,
              referential_constraints.unique_constraint_schema
            FROM
              information_schema.referential_constraints,
              information_schema.key_column_usage,
              information_schema.columns
            WHERE
              key_column_usage.constraint_name = referential_constraints.unique_constraint_name AND
              key_column_usage.constraint_schema = referential_constraints.unique_constraint_schema AND
              columns.table_name = key_column_usage.table_name AND
              columns.table_schema = key_column_usage.table_schema AND
              key_column_usage.column_name = '$pforeignField'
            GROUP BY
              key_column_usage.table_name,
              key_column_usage.column_name,
              columns.column_name,
              referential_constraints.unique_constraint_schema";
    }

}
