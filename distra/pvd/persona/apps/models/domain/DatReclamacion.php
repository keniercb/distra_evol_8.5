<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:49
 */
class DatReclamacion extends BaseDatReclamacion
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    public function getById($idreclamacion)
    {
        $perso = $this->reflectArray($idreclamacion);
        if (count($perso) > 0) {
            $query = Doctrine_Query::create()
                ->from('DatReclamacion')
                ->whereIn('idreclamacion', $perso);
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

    public function getReclamacion(array $idpersona, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select("de.*")
                ->from('DatReclamacion de')
                ->orderBy('de.numeroacuerdo');
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

    public function getCantReclamacion(array $idpersona)
    {

        try {
            $query = Doctrine_Query::create()
                ->from('DatReclamacion de');
            return (count($idpersona) > 0)
                ? $query->andWhereIn('de.idpersona', $idpersona)->count()
                : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delReclamacion(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->delete('DatReclamacion');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }
            return (count($id) > 0)
                ? $query->andWhereIn('idreclamacion', $id)->execute()
                : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}