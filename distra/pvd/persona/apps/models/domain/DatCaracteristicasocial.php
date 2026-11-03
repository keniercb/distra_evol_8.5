<?php
class DatCaracteristicasocial extends BaseDatCaracteristicasocial
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomEstadocivil', array('local' => 'idestadocivil', 'foreign' => 'idestadocivil'));
        $this->hasOne('NomDisposicion', array('local' => 'iddisposicion', 'foreign' => 'iddisposicion'));
        $this->hasOne('NomEstratificacionsocial', array('local' => 'idestratificacionsocial', 'foreign' => 'idestratificacionsocial'));
    }

    public function getById($idcaracteristicasocial)
    {
        return Doctrine::getTable('DatCaracteristicasocial')->find($idcaracteristicasocial);
    }

    public function getDatosSocialesByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('dcs.*, nec.denominacion as estadocivil, nes.denominacion as estratificaionsocial, dis.denominacion as disposicion')
                ->from('DatCaracteristicasocial dcs')
                ->leftJoin('dcs.NomEstadocivil nec')
                ->leftJoin('dcs.NomDisposicion dis')
                ->leftJoin('dcs.NomEstratificacionsocial nes')
                ->whereIn('dcs.idpersona', $idpersona);
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            if ($filtro) {
                $query->andWhere("nec.denominacion ilike '?' OR nes.denominacion ilike '?'", $filtro);
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantDatosSocialesByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatCaracteristicasocial dcs')
                ->leftJoin('dcs.NomEstadocivil nec')
                ->leftJoin('dcs.NomEstratificacionsocial nes')
                ->whereIn('dcs.idpersona', $idpersona);
            if ($filtro) {
                $query->andWhere("nec.denominacion ilike '?' OR nes.denominacion ilike '?'", $filtro);
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}