<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class ZendExt_Metadata_Sql_PGSQL_Relation
{

    function crearRelacion($pRelacion, $pFKName)
    {
        $on_delete_part = ($pRelacion->eliminarcascada) ? 'CASCADE' : 'NO ACTION';
        $on_update_part = ($pRelacion->actualizarcascada) ? 'CASCADE' : 'NO ACTION';

        $sql = "ALTER TABLE \"{$pRelacion->Destino->DatTabla->esquema}\".\"{$pRelacion->Destino->DatTabla->tabla}\"
                 ADD CONSTRAINT \"{$pFKName}\" FOREIGN KEY (\"{$pRelacion->Destino->denominacion}\")
                 REFERENCES \"{$pRelacion->Origen->DatTabla->esquema}\"."
            . "\"{$pRelacion->Origen->DatTabla->tabla}\"(\"{$pRelacion->Origen->denominacion}\")
                 ON DELETE $on_delete_part
                 ON UPDATE $on_update_part
                 NOT DEFERRABLE;";
        return $sql;
    }

    function crearIndiceUnico($pSource, $pTarget)
    {
        $name = "{$pSource->DatTabla->tabla}_{$pTarget->denominacion}";

        $sql = "CREATE UNIQUE INDEX \"$name\"
                 ON \"{$pSource->DatTabla->esquema}\".\"{$pSource->DatTabla->tabla}\" (\"{$pTarget->denominacion}\");";

        return $sql;
    }

    function ultimaForeignKey($pSchema, $pTable)
    {
        $sql = "SELECT MAX(cu.constraint_name) 
				FROM information_schema.key_column_usage cu
				WHERE cu.constraint_schema = '$pSchema'
				AND cu.constraint_name like 'fk_" . $pTable . "%'";

        return $sql;
    }

}