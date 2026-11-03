<?php

class MetadatoModel extends ZendExt_Model
{

    private $server;
    private $port;
    private $user;
    private $pass;
    private $dbname;
    private $conexbd;

    /**
     * Constructor de la clase
     *
     * @param $server
     * @param $port
     * @param $user
     * @param $pass
     * @param $dbname
     *
     * @return bool
     */
    public function MetadatoModel($server, $port, $user, $pass, $dbname)
    {
        parent::ZendExt_Model();
        $this->server = $server;
        $this->port = $port;
        $this->user = $user;
        $this->pass = $pass;
        $this->dbname = $dbname;

        try {
            $this->conexbd = new PDO("pgsql:host=$this->server;port=$this->port;dbname=$this->dbname", $this->user, $this->pass);
            return true;
        } catch (PDOException $e) {
            $m['codMsg'] = 2;
            $m['mensaje'] = $e->getMessage();
            echo json_encode($m);
        }
    }

    public function getMetadato()
    {
        try {
            $result = $this->getSchemas();

            return $result;
        } catch (PDOException $e) {
            $m['codMsg'] = 2;
            $m['mensaje'] = $e->getMessage();
            echo json_encode($m);
        }
    }

    /**
     * Devuelve todos los schemas de una base de datos
     *
     * @return array
     */
    public function getSchemas()
    {
        try {
            $sql = "SELECT table_schema AS schema
                    FROM information_schema.columns
                    WHERE table_catalog = '{$this->dbname}'
                    AND table_schema NOT LIKE 'pg_%' AND table_schema <> 'information_schema'
                    GROUP BY table_schema
                    ORDER BY table_schema";

            $sth = $this->conexbd->prepare($sql);
            $sth->execute();
            $result = $sth->fetchAll(PDO::FETCH_COLUMN, 0);

            return $result;
        } catch (PDOException $e) {
            $m['codMsg'] = 2;
            $m['mensaje'] = $e->getMessage();
            echo json_encode($m);
        }
    }

    /**
     * Devuelve todas las tablas dado un esquema
     *
     * @param $schema
     *
     * @return array
     */
    public function getTablesBySchema($schema)
    {
        try {
            $sql = "SELECT n.nspname as schema, t.tablename as table from pg_tables t
				inner JOIN pg_namespace n on (n.nspname = t.schemaname)
				where n.nspname = '{$schema}' ORDER BY t.tablename;";
            $sth = $this->conexbd->prepare($sql);
            $sth->execute();
            $result = $sth->fetchAll();

            return $result;
        } catch (PDOException $e) {
            $m['codMsg'] = 2;
            $m['mensaje'] = $e->getMessage();
            echo json_encode($m);
        }
    }

    /**
     * Devuelve todos los campos dado una tabla y un esquema
     *
     * @param $table
     * @param $schema
     *
     * @return array
     */
    public function getFieldsByTables($table, $schema)
    {
        try {
            $sql = "SELECT  distinct on(a.attname) a.attname as name,
            a.attnotnull as obligatorio,
			k.nspname as schema, c.relname as table,
			CASE
			WHEN cc.contype = 'p' THEN 'pk'
			WHEN cc.contype ='f' THEN 'fk'
			ELSE 'campo'  END AS key, t.typname as tipodato,
			CASE
            WHEN cc.confrelid <> 0
			THEN (SELECT cls.relname as fk_table
            	FROM pg_catalog.pg_class cls
                WHERE cls.oid = cc.confrelid)
            END AS fk_table,

            CASE
            WHEN cc.confrelid <> 0
			THEN (SELECT k1.nspname as fk_schema
            	FROM pg_catalog.pg_class c1
	            LEFT JOIN pg_catalog.pg_namespace k1 ON c1.relnamespace = k1.oid
                WHERE c1.oid = cc.confrelid)
            END AS fk_schema

			FROM pg_catalog.pg_attribute a
			LEFT JOIN pg_catalog.pg_type t ON t.oid = a.atttypid
			LEFT JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
			LEFT JOIN pg_catalog.pg_namespace k ON c.relnamespace = k.oid
			LEFT JOIN pg_catalog.pg_constraint cc ON cc.conrelid = c.oid AND cc.conkey[1] = a.attnum
			LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = c.oid AND a.attnum = d.adnum
			WHERE  a.attnum > 0 AND c.relname = '{$table}' and k.nspname = '{$schema}'
			ORDER BY a.attname;";

            $sth = $this->conexbd->prepare($sql);
            $sth->execute();
            $result = $sth->fetchAll();

            return $result;
        } catch (PDOException $e) {
            $m['codMsg'] = 2;
            $m['mensaje'] = $e->getMessage();
            echo json_encode($m);
        }
    }

    /**
     * Obtiene los campos que son llave primaria en una tabla
     *
     * @param $table
     * @param $schema
     *
     * @return array
     */
    public function getPrimaryKeys($schema, $table)
    {
        try {
            $sql = "SELECT  distinct on(a.attname) a.attname as name
			FROM pg_catalog.pg_attribute a
			LEFT JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
			LEFT JOIN pg_catalog.pg_namespace k ON c.relnamespace = k.oid
			INNER JOIN pg_catalog.pg_constraint cc ON (cc.conrelid = c.oid AND cc.conkey[1] = a.attnum AND cc.contype = 'p')
			LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = c.oid AND a.attnum = d.adnum
			WHERE  a.attnum > 0 AND c.relname = '{$table}' and k.nspname = '{$schema}'
			ORDER BY a.attname;";

            $sth = $this->conexbd->prepare($sql);
            $sth->execute();
            $result = $sth->fetchAll();

            return $result;
        } catch (PDOException $e) {
            $m['codMsg'] = 2;
            $m['mensaje'] = $e->getMessage();
            echo json_encode($m);
        }
    }

}