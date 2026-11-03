<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:49
 */
class DatSituaciondefensa extends BaseDatSituaciondefensa
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomAsigdefensa', array('local' => 'idasignaciondefensa', 'foreign' => 'idasignaciondefensa'));
        $this->hasOne('Nomcargodefensa', array('local' => 'idcargodefensa', 'foreign' => 'idcargodefensa'));
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    public function getById($idsituaciondefensa)
    {
        $perso = $this->reflectArray($idsituaciondefensa);
        if (count($perso) > 0) {
            $query = Doctrine_Query::create()
                ->from('DatSituaciondefensa')
                ->whereIn('idsituaciondefensa', $perso);
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

    public function getSituacionDefensa(array $idpersona, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select("de.*, nad.denominacion as denomasigdefensa,ncd.denominacion as denomcargo")

                ->from('DatSituaciondefensa de')
                ->innerJoin('de.NomAsigdefensa nad')
                ->innerJoin('de.Nomcargodefensa ncd');
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

    public function getCantSituaciondefensa(array $idpersona)
    {

        try {
            $query = Doctrine_Query::create()
                ->from('DatSituaciondefensa de')
                ->innerJoin('de.NomAsigdefensa nad')
                ->innerJoin('de.Nomcargodefensa ncd');
            return (count($idpersona) > 0)
                ? $query->andWhereIn('de.idpersona', $idpersona)->count()
                : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delSituacionDefensa(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->delete('DatSituaciondefensa');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }
            return (count($id) > 0)
                ? $query->andWhereIn('idsituaciondefensa', $id)->execute()
                : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getPersonasByAsig($idasignaciondefensa)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('ds.*, nc.denominacion as cargodefensa,na.denominacion as denomasignacion')
                ->from('DatSituaciondefensa ds')
                ->leftJoin('ds.Nomcargodefensa nc')
                ->leftJoin('ds.NomAsigdefensa na');
            if (isset($idasignaciondefensa)) {
                $query->where('ds.idasignaciondefensa=?', $idasignaciondefensa);
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantPersonaBySituacion()
    {
        $sql = "SELECT sum(tabla.cantidadpersonas) as cantidad,
                          (select denominacion FROM mod_personaext.nom_asignaciondefensa WHERE idasignaciondefensa=tabla.asignacion) as asignaciondefensa
                    FROM (SELECT CASE WHEN (nad.idasignaciondefensa = dad.idasignaciondefensa) THEN count(dad.idpersona) ELSE 0 END AS cantidadpersonas,
                           nad.idasignaciondefensa as asignacion
                    FROM mod_personaext.nom_asignaciondefensa as nad
                    LEFT JOIN mod_personaext.dat_situaciondefensa as dad using (idasignaciondefensa)
                    GROUP BY nad.idasignaciondefensa,dad.idasignaciondefensa,dad.idpersona) as tabla GROUP BY tabla.asignacion ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }
}