<?php

/**
 * Clase para la generación del código SQL de las Tablas
 *
 * @author     Omar Antonio Díaz Peña
 * @version    2.0.0
 * @package    Planificación
 * @subpackage Metadatos
 */
class ZendExt_Metadata_Sql_PGSQL_Table
{

    public function obtenerEsquemas()
    {
        return 'select schema_name as schema from information_schema.schemata';
    }

    public function cargarEsquemasEnArbol()
    {
        return "select schema_name as id, schema_name as text, false as leaf from information_schema.schemata
                             where schema_name NOT like 'pg_%' AND schema_name <> 'public' "
        . "AND schema_name <> 'information_schema'";
    }

    public function adicionarTabla($pEsquema, $pTabla)
    {
        $sql = "create table {$pEsquema}.{$pTabla} ()";
        return $sql;
    }

    public function cargarTablasEnArbol($pEsquema)
    {
        $sql
            = "select tablename as id, tablename as text, true as leaf "
            . "from pg_tables where schemaname = '{$pEsquema}'";
        return $sql;
    }

    public function existeTablaEnEsquema($pEsquema, $pTabla)
    {
        $sql = "select count(tablename) from pg_tables where schemaname = '{$pEsquema}' AND tablename = '{$pTabla}'";
        return $sql;
    }

    public function eliminarSecuencia($pSecuencia)
    {
        $sql = "drop sequence $pSecuencia";
        return $sql;
    }

    public function eliminarFuncsArbol($pTabla)
    {
        $sql = "DROP TRIGGER insertar_{$pTabla->tabla} ON {$pTabla->esquema}.{$pTabla->tabla};
                 DROP TRIGGER modificar_{$pTabla->tabla} ON {$pTabla->esquema}.{$pTabla->tabla};
                 DROP TRIGGER eliminar_{$pTabla->tabla} ON {$pTabla->esquema}.{$pTabla->tabla};
                 DROP TRIGGER t_actualizarpadre ON {$pTabla->esquema}.{$pTabla->tabla};
                 DROP FUNCTION {$pTabla->esquema}.insertar_nodo_{$pTabla->tabla}();
                 DROP FUNCTION {$pTabla->esquema}.eliminar_nodo_{$pTabla->tabla}();
                 DROP FUNCTION {$pTabla->esquema}.reordenar_{$pTabla->tabla}(idwenodo bigint, ordenizqnodo bigint);
                 DROP FUNCTION {$pTabla->esquema}.modificar_nodo_{$pTabla->tabla}();
                 DROP FUNCTION {$pTabla->esquema}.actualizar_arbol_{$pTabla->tabla}();";

        return $sql;
    }

    public function eliminarTabla($pEsquema, $pTabla)
    {
        //[IF EXISTS] para asegurar que si no existe no lanze un error, en ese caso lanza una noticia.		 
        $sql = "drop table {$pEsquema}.{$pTabla} cascade";
        return $sql;
    }

}