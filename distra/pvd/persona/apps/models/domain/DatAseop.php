<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:49
 */
class DatAseop extends BaseDatAseop
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomAseo', array('local' => 'idaseo', 'foreign' => 'idaseo'));
    }

    public function getById($idaseop)
    {
        $perso = $this->reflectArray($idaseop);
        if (count($perso) > 0) {
            $query = Doctrine_Query::create()
                ->from('DatAseop')
                ->whereIn('idaseop', $perso);
            return $query->execute();
        }
    }

    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function getAseop(array $idpersona, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select("de.*,aseo.denominacion as denomaseo")
                ->from('DatAseop de')
                ->innerJoin('de.NomAseo aseo');
            if (!empty($limit)) {
                $query->limit($limit)
                    ->offset($start);
            }
           // print_r($query->getSqlQuery());die;
            return (count($idpersona) > 0)
                ? $query->andWhereIn('de.idpersona', $idpersona)->execute()->toArray()
                : array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantAseop(array $idpersona)
    {

        try {
            $query = Doctrine_Query::create()
                ->from('DatAseop de');
            return (count($idpersona) > 0)
                ? $query->andWhereIn('de.idpersona', $idpersona)->count()
                : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delAseop(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->delete('DatAseop');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }
            return (count($id) > 0)
                ? $query->andWhereIn('idaseop', $id)->execute()
                : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}