<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:49
 */
class DatPersonamedio extends BaseDatPersonamedio
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomAsignacion', array('local' => 'idasignacion', 'foreign' => 'idasignacion'));
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }
    
    public function getById($idpersonamedio)
    {
        $perso = $this->reflectArray($idpersonamedio);
        if (count($perso) > 0) {
            $query = Doctrine_Query::create()
                ->from('DatPersonamedio')
                ->whereIn('idpersonamedio', $perso);
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

    public function getMediosByPerson(array $idpersona, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select("de.*, nce.denominacion as dasignacion,
                (CASE WHEN de.fdesde <= now() and (now() <= de.fhasta or de.fhasta is null)
                THEN 1 ELSE 0 END) AS historico")
                ->from('DatPersonamedio de')
                ->innerJoin('de.NomAsignacion nce')
                ->orderBy('de.idpersonamedio');
            if (!empty($limit)) {
                $query->limit($limit)
                    ->offset($start);
            }
            return (count($idpersona) > 0)
                ? $query->andWhereIn('de.idpersona', $idpersona)->execute()->toArray()
                : array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantMediosByPerson(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatPersonamedio de')
                ->innerJoin('de.NomAsignacion nce');
            return (count($idpersona) > 0)
                ? $query->andWhereIn('de.idpersona', $idpersona)->count()
                : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delMediosByPerson(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->delete('DatPersonamedio');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }
            return (count($id) > 0)
                ? $query->andWhereIn('idpersonamedio', $id)->execute()
                : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}