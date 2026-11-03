<?php

class ZendExt_Nomencladores_Sql_Field
{

    /**
     * addField
     *
     * Adiciona un campo a una tabla de la BD
     *
     * @param $pTable       String Nombre de la tabla.
     * @param $pNombreField Nombre de los campos.
     * @param $pType        String Tipo de datos.
     * @param $pPK          Bool Si es llave primaria.
     *
     * @return String
     */
    public function addField($pTable, $pNombreField, $pType, $pPK)
    {
        $sql = "ALTER TABLE $pTable ADD COLUMN $pNombreField $pType ";

        if ($pPK == 'true') {
            $sql .= "
					  ;ALTER TABLE $pTable ALTER COLUMN $pNombreField SET NOT NULL;
					  ALTER TABLE $pTable ADD PRIMARY KEY ($pNombreField)";
        }
        return $sql;
    }

    /**
     * addFK
     *
     * Genera el código SQL para adicionar una restricción de llave primaria.
     *
     * @param $pTable        String Nombre de la tabla.
     * @param $pForeignTable String Nombre de la tabla.
     * @param $pForeignField String Nombre del campo destino.
     *
     * @return String.
     */
    public function addFK($pTable, $pForeignTable, $pLocalField, $pForeignField)
    {
        $pForeignTable1 = substr(
            $pForeignTable, strrpos($pForeignTable, '.') + 1, strlen($pForeignTable) - strrpos($pForeignTable, '.') - 1
        );
        $sql = "ALTER TABLE $pTable  ADD CONSTRAINT $pForeignTable1" . "_" . "$pForeignField FOREIGN KEY ($pLocalField)
    REFERENCES $pForeignTable($pForeignField)ON DELETE CASCADE ON UPDATE CASCADE  NOT DEFERRABLE";
        return $sql;
    }

    /**
     * dropField
     *
     * Genera el código SQL para eliminar un campo en la tabla del SQL.
     *
     * @param $pTable String Nombre de la tabla.
     * @param $pField String Nombre del campo.
     *
     * @return String.
     */
    public function dropField($pTable, $pField)
    {
        return "ALTER TABLE $pTable DROP COLUMN $pField RESTRICT";
    }

    /**
     * dropFK
     *
     * Genera el código SQL para eliminar una restricción de llave foranea.
     *
     * @param $pTable        String Nombre de la tabla.
     * @param $pForeignTable String Nombre de la tabla foranea.
     * @param $pForeignField String Nombre del campo foraneo.
     *
     * @return String.
     */
    public function dropFK($pTable, $pForeignField)
    {
        return "ALTER TABLE $pTable DROP CONSTRAINT $pForeignField";
    }

    /**
     * renameField
     *
     * Renombra un campo en la tabla de la BD.
     *
     * @param $pTable   String Nombre de la tabla.
     * @param $pOldName Nombre antiguo del campo
     * @param $pNewName Nombre nuevo del campo
     *
     * @return String.
     */

    public function renameField($pTable, $pOldName, $pNewName)
    {
        return "ALTER TABLE $pTable RENAME COLUMN $pOldName TO $pNewName";
    }

    public function getFields($pSchema, $pTable)
    {
//		$p = "";
//		if($pWhere == 'pk')
//			$p = "and pk = 'true'";
//		elseif ($pWhere == 'nopk')
//			$p = "and pk = 'false'";
//		return "select campos.*, presentacion.*, tipo_componente.*, exp_regulares.* from campos
//				inner join presentacion on campos.idcampo = presentacion.campoidcampo
//				inner join exp_regulares on exp_regulares.id_exp_reg = presentacion.regex
//				inner join tipo_componente on tipo_componente.id_tipo_componente = presentacion.componente
//				where tablasnombre = '$pTable' $p";
        return "SELECT
                      columns.column_name,
                      columns.numeric_precision,
                      columns.numeric_scale,
                      columns.is_nullable,
                      columns.data_type,
                      columns.character_maximum_length,
                      columns.column_default
                    FROM 
                      information_schema.columns
                    WHERE
                      columns.table_schema = '$pSchema' AND
                      columns.table_name = '$pTable'";
    }

    public function addExtFK($pextTable, $pNomenclador, $pextField, $pField)
    {
        $constraint = substr(
            $pNomenclador, strrpos($pNomenclador, '.') + 1, strlen($pNomenclador) - strrpos($pNomenclador, '.') - 1
        );
        return "ALTER TABLE $pextTable   ADD CONSTRAINT $constraint" . "_$pField FOREIGN KEY ($pextField)
    REFERENCES $pNomenclador($pField) ON DELETE CASCADE  ON UPDATE CASCADE  NOT DEFERRABLE";
    }

    public function addExt2FK($pextTable, $pNomenclador, $pextField, $pField)
    {
        $constraint = substr(
            $pNomenclador, strrpos($pNomenclador, '.') + 1, strlen($pNomenclador) - strrpos($pNomenclador, '.') - 1
        );
        return "ALTER TABLE $pNomenclador   ADD CONSTRAINT $constraint" . "_$pField FOREIGN KEY ($pField)
    REFERENCES $pextTable ($pextField) ON DELETE CASCADE  ON UPDATE CASCADE  NOT DEFERRABLE";
    }

    public function addPresentacion(
        $pLongitud, $pRegEx, $pDesc, $pVisible, $pNombre, $pComponent, $pDisplayField, $pForeignTable, $pIdField
    ) 
    {
        return "insert into presentacion "
        . "(campoidcampo, longitud, nombremostrar, regex, descripcion, visible, componente, combdisplay, tablaf) "
        . "values ($pIdField, $pLongitud, '$pNombre', $pRegEx, "
                . "'$pDesc', '$pVisible', $pComponent, '$pDisplayField', '$pForeignTable')";
    }

    public function getLastFieldId()
    {
        return "select max (idcampo) from campos";
    }

    public function addUnique($pTable, $pField)
    {
        return "ALTER TABLE $pTable ADD UNIQUE ($pField);";
    }

    public function setNextValue()
    {
        return 'select from nextval (campos_id_campo)';
    }

    public function getLastValue()
    {
        return 'select last_value from campos_idcampo_seq';
    }

    public function  getRegExps()
    {
        return 'select * from exp_regulares';
    }

    public function  getTiposDatos()
    {
        return 'select * from tipo_dato';
    }

    public function  getTiposComponentes()
    {
        return 'select * from tipo_componente';
    }

    function getFieldData($pIdField)
    {
        return "select * from campos where idcampo = $pIdField";
    }

    function getPKFields($pTable, $pSchema = 'mod_datosmaestros')
    {
        return "SELECT key_column_usage.column_name "
                . "FROM information_schema.key_column_usage "
                . "WHERE key_column_usage.table_schema = '$pSchema' "
                . "AND key_column_usage.table_name = '$pTable' "
                . "AND key_column_usage.constraint_name LIKE '%pk%'";
    }

    function getNonPKFields($pTable, $pSchema = 'mod_datosmaestros')
    {
        return "SELECT DISTINCT columns.column_name "
                . "FROM information_schema.key_column_usage, information_schema.columns "
                . "WHERE key_column_usage.table_name = columns.table_name "
                . "AND columns.table_schema = key_column_usage.table_schema "
                . "AND columns.column_name <> key_column_usage.column_name "
                . "AND key_column_usage.table_schema = '$pSchema' "
                . "AND columns.table_name = '$pTable'";
    }

    function getPresentacion($pIdField)
    {
        return "select presentacion.*, campos.* from presentacion
                join campos on  campos.idcampo = presentacion.campoidcampo
                where campoidcampo = $pIdField";
    }
}
