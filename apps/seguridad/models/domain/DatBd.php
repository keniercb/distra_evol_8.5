<?php

/**
 * Clase dominio de DatBd.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatBd extends BaseDatBd
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatServidorDatGestorDatBd',
            array('local' => 'idbd', 'foreign' => 'idbd')
        );
        $this->hasMany(
            'DatSistemaDatServidores',
            array('local' => 'idbd', 'foreign' => 'idbd')
        );
    }

    static public function cargarbd($idservidor, $idgestor, $limit, $start)
    {
        $q = Doctrine_Query::create();
        $result = $q->select('b.idbd id,b.denominacion text,b.descripcion')
            ->from('DatBd b,b.DatServidorDatGestorDatBd g')
            ->where(
                "g.idservidor = ? and g.idgestor= ?",
                array($idservidor, $idgestor)
            )->orderby('b.idbd')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $result;
    }

    static function obtenercantbd($idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatBd b,b.DatServidorDatGestorDatBd g')
            ->where(
                "g.idservidor = ? and g.idgestor= ?",
                array($idservidor, $idgestor)
            )->count();
        return $result;
    }

    static public function obtenercantgestsistema($idservidor, $idgestor, $idbd)
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatSistemaDatServidores u')
            ->where(
                "u.idservidor = ? and u.idgestor =? and u.idbd =?",
                array($idservidor, $idgestor, $idbd)
            )->count();
        return $cant;
    }

    static function cargarcombobd($idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $queryTwo = Doctrine_Query::create();
        $adentro = $query->select('s.idbd')
            ->from('Datbd s,s.DatServidorDatGestorDatBd a')
            ->where(
                "a.idservidor=? and a.idgestor = ?",
                array($idservidor, $idgestor)
            )->execute();
        $arrayAdentro = array();
        foreach ($adentro as $obj)
            $arrayAdentro[] = $obj->idbd;
        $afuera = $queryTwo->select('f.idbd, f.denominacion')
            ->from('Datbd f')
            ->whereNotIn('f.idbd', $arrayAdentro)
            ->execute();
        return $afuera;
    }

    static function cargarnombd($limit, $start)
    {
        $query = Doctrine_Query::create();
        $bd = $query->select('b.idbd, b.denominacion,b.descripcion')
            ->from('DatBd b ')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $bd;
    }

    static function obtenercantnombd()
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatBd')->count();
        return $cant;
    }

    static function obtenercantnombdsist($idbd)
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatSistemaDatServidores s')
            ->where("s.idbd=?", $idbd)
            ->count();
        return $cant;
    }

    static public function buscarnombd($denominacion, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idbd, denominacion, descripcion')
            ->from('DatBd')
            ->where("denominacion like '$denominacion%'")
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    static public function obtenercantnombdbuscados($denominacion)
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatBd')
            ->where("denominacion like '$denominacion%'")
            ->count();
        return $cant;
    }

    static public function borrarBdFisicamente($arrBd)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatBd')
            ->whereIn('idbd', $arrBd)
            ->execute();
    }

    public static function obtenerCantTablasTriggersDeteccionCambiosBD($conn)
    {
        $manager = Doctrine_Manager::getInstance();
        $sql = "SELECT COUNT(table_schema)
                FROM information_schema.tables
                WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
                AND table_name NOT IN ('dat_pid', 'his_violacionesbd', 'dat_accion', 'dat_funcionalidad')
                AND (table_name IN (SELECT event_object_table
                                        FROM information_schema.triggers
                                        WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema')
                                        AND trigger_name = 'tg_eliminar_pid' AND trigger_schema = table_schema)
                OR table_name IN (SELECT event_object_table
                                      FROM information_schema.triggers
                                      WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema')
                                      AND trigger_name = 'tg_adicionar_violacion' AND trigger_schema = table_schema))";

        try {
            $result = $manager->getCurrentConnection()->fetchOne($sql);
        } catch (Exception $e) {
            echo json_encode(
                array('success' => false,
                    'msgId' => "ExcObtenerCantTablasTriggersDeteccionCambiosBD",
                    'message' => 'Ha ocurrido un error inesperado al intentar saber si está habilitado el chequeo de integridad de la base de datos.')
            );
            die();
        };

        return $result;
    }

    public static function obtenerQueryCrearTriggers()
    {
        $manager = Doctrine_Manager::getInstance();
        $sentencia = '';
        $query = "
            SELECT 'DO ' ||
                    '\$do\$ ' ||
                    'BEGIN ' ||
                       'IF NOT EXISTS (SELECT * FROM information_schema.triggers ' ||
                       'WHERE trigger_name = ''tg_adicionar_violacion'' ' ||
                       'AND event_object_schema = ''' || table_schema || '''' ||
                       'AND event_object_table = ''' || table_name || ''') THEN ' ||
                            'CREATE TRIGGER tg_adicionar_violacion ' ||
                            'AFTER INSERT OR UPDATE OR DELETE ON \"' || table_schema || '\".\"' || table_name || 
                            '\" FOR EACH ROW EXECUTE PROCEDURE mod_seguridad.ft_insertar_violacion(); ' ||
                    'END IF; ' ||
                    'END' ||
                    '\$do\$;' ||
                    'DO ' ||
                    '\$do\$ ' ||
                    'BEGIN ' ||
                       'IF NOT EXISTS (SELECT * FROM information_schema.triggers ' ||
                       'WHERE trigger_name = ''tg_eliminar_pid'' ' ||
                       'AND event_object_schema = ''' || table_schema || '''' ||
                       'AND event_object_table = ''' || table_name || ''') THEN ' ||
		                    'CREATE TRIGGER tg_eliminar_pid ' ||
		                    'AFTER INSERT OR UPDATE OR DELETE ON \"' || table_schema || '\".\"' || table_name || 
		                    '\" FOR EACH STATEMENT EXECUTE PROCEDURE mod_seguridad.ft_eliminar_pid(); ' ||
		            'END IF; ' ||
                    'END ' ||
                    '\$do\$;' 
                    AS sentencia
            FROM information_schema.tables
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema') 
            AND table_name NOT IN ('dat_pid', 'his_violacionesbd', 'dat_accion', 'dat_funcionalidad')
            AND table_type =  'BASE TABLE'
            ORDER BY table_schema;
        ";

        try {
            $result = $manager->getCurrentConnection()->fetchAll($query);
        } catch (Exception $e) {
            throw new ZendExt_Exception("SEGINTEGRIDADBD02");
        }
        foreach ($result as $res)
            $sentencia .= $res['sentencia'];

        return $sentencia;
    }


    public static function obtenerQuerysEliminarTriggers()
    {
        $manager = Doctrine_Manager::getInstance();
        $sentencia = '';
        $query = "
            SELECT 'DROP TRIGGER IF EXISTS tg_adicionar_violacion ON \"' || table_schema || '\".\"' || table_name || '\";' || 
                   'DROP TRIGGER IF EXISTS tg_eliminar_pid ON \"' || table_schema || '\".\"' || table_name || '\";' AS sentencia
            FROM  information_schema.tables
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
            AND table_name NOT IN ('dat_pid', 'his_violacionesbd', 'dat_accion', 'dat_funcionalidad') 
            AND table_type =  'BASE TABLE'
            ORDER BY table_schema;
        ";
        try {
            $result = $manager->getCurrentConnection()->fetchAll($query);
        } catch (Exception $e) {
            throw new ZendExt_Exception("SEGINTEGRIDADBD03");
        }

        for ($j = 0; $j < count($result); $j++) {
            $sentencia .= $result[$j]['sentencia'];
        }

        return $sentencia;
    }


}