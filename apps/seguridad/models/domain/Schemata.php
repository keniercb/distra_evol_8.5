<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class Schemata extends BaseSchemata
{

    static public function getPgsqlSchemasByDb($conn, $db)
    {
        $conn->exec("set search_path=information_schema;");
        $query = Doctrine_Query::create();
        return $query->select(
            "schema_name as id, schema_name as text,schema_name as esquema, "
            . "false as checked, true as leaf"
        )
            ->from('Schemata')
            ->where(
                "catalog_name = ? AND schema_name "
                . "NOT LIKE 'pg_%' and schema_name <> 'information_schema'", $db
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

}