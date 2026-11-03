<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Controller
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class NomValoresContables extends BaseNomValoresContables
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        $this->hasOne(
            'DatAsientosContables',
            array('local' => 'idvalorcontable', 'foreign' => 'idvalorcontable')
        );
        $this->hasOne(
            'NomValoresContables',
            array('local' => 'idvalorcontable', 'foreign' => 'valor')
        );
        parent::setUp();
    }

    public function persist()
    {
        try {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $this->save();

            $va->commit();
            $va->beginTransaction();

            return $this->idvalorcontable;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomValoresContables')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByPage($offset, $limit, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomValoresContables')
                ->offset($offset)
                ->limit($limit)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idvalorcontable, $toArray = false)
    {
        try {
            $result = Doctrine::getTable('NomValoresContables')->find(
                $idvalorcontable
            );
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByIds($arrIds, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomValoresContables')
                ->whereIn("idvalorcontable", $arrIds)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition(
        $condition, $params, $toArray = false, $start = null, $limit = null
    ) {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexion = $objDoctrine->getCurrentConnection();
            $query="SELECT nv.*,(CASE WHEN nv.tipo = 3 THEN nc.clavecuenta||' '||nc.descripcion else null END) as concat
                    FROM mod_datosmaestros.nom_valorcontable nv LEFT JOIN mod_contabilidad.nom_cuenta nc on nv.referencia=CAST(nc.idcuenta as text)
                    WHERE $condition ORDER BY idvalorcontable";

            if (!is_null($start) && !is_null($limit)) {
                $query.=" OFFSET $start LIMIT $limit";
            }

            $result=$conexion->fetchAll($query,$params);

            /*$query = Doctrine_Query::create();
            $query->from('NomValoresContables nv')
                ->where("$condition", $params)
                ->orderby('idvalorcontable');

            if (!is_null($start) && !is_null($limit)) {
                $query->offset($start)
                    ->limit($limit);
            }
            $result = $query->execute();
            return $toArray ? $result->toArray() : $result;*/

            return $toArray ? $result : (object) $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function CountByCondition($condition, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('count(idvalorcontable) as cantidad')
                ->from('NomValoresContables')
                ->where("$condition", $params)
                ->execute()
                ->toArray();
            return $result[0]['cantidad'];
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idvalorcontable)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomValoresContables')
                ->where("idvalorcontable=?", array($idvalorcontable))
                ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomValoresContables')
                ->where("$conditions", $params)
                ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByTable(
        $table, $identifier, $toArray = false, $start = null, $limit = null,
        $conditions = null
    ) {
        try {
            
            $query = Doctrine_Query::create();
            $query->from($table);

            if (!empty($conditions)) {
                $query->where($conditions);
            }

            if (!is_null($start) && !is_null($limit)) {
                $query->offset($start)
                    ->limit($limit);
            }
            $query->orderBy($identifier);
            $result = $query->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function CountByTable($table, $conditions = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->select('count(*) as cantidad')
                ->from($table);
            if (!is_null($conditions)) {
                $query->where("$conditions");
            }
            $result = $query->execute()
                ->toArray();
            return $result[0]['cantidad'];
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function testQuery($table, $column, $value)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from($table)
                ->where("$column=$value")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return is_array($result) && count($result) != 0;
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    static public function getRow($table, $identifier, $idtable)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $result = $conn->fetchAll(
                "SELECT row FROM (SELECT row_number() OVER(ORDER BY $identifier) as row,*  FROM $table) a where a.$identifier=$idtable"
            );
            return $result[0]['row'];
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }


}
