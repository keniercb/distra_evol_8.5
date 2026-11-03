<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:49
 */
class DatSituacexcep extends BaseDatSituacexcep
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomCargoexcep', array('local' => 'idcargoexcep', 'foreign' => 'idcargoexcep'));
        $this->hasOne('NomSituacexcep', array('local' => 'idsituacexcep', 'foreign' => 'idsituacexcep'));
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    public function getById($idsitexcepcional)
    {
        $perso = $this->reflectArray($idsitexcepcional);
        if (count($perso) > 0) {
            $query = Doctrine_Query::create()
                ->from('DatSituacexcep')
                ->whereIn('idsitexcepcional', $perso);
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

    public function getSituacExcep(array $idpersona, $limit, $start = 0, $idsituacexcep, $idcargoexcep)
    {
        try {
            $query = Doctrine_Query::create()
                ->select("de.*, nad.denominacion as situacexcep,ncd.denominacion as cargoexcep")

                ->from('DatSituacexcep de')
                ->innerJoin('de.NomSituacexcep nad')
                ->innerJoin('de.NomCargoexcep ncd');
            if (!empty($limit)) {
                $query->limit($limit)
                    ->offset($start);
            }
            if (!empty($idsituacexcep)) {
                $query->andWhereIn("nad.denominacion ilike '%$idsituacexcep%'");
            }
            if (!empty($idcargoexcep)) {
                $query->andWhere('de.idcargoexcep = ?', array($idcargoexcep));
            }
            return (count($idpersona) > 0)
                ? $query->andWhereIn('de.idpersona', $idpersona)->execute()->toArray()
                : array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantSituacExcep(array $idpersona)
    {

        try {
            $query = Doctrine_Query::create()
                ->from('DatSituacexcep de')
                ->innerJoin('de.NomSituacexcep nad')
                ->innerJoin('de.NomCargoexcep ncd');
            return (count($idpersona) > 0)
                ? $query->andWhereIn('de.idpersona', $idpersona)->count()
                : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delSituacExcep(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->delete('DatSituacexcep');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }
            return (count($id) > 0)
                ? $query->andWhereIn('idsitexcepcional', $id)->execute()
                : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}