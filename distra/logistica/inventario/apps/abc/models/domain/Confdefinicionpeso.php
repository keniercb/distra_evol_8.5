<?php

class Confdefinicionpeso extends BaseConfdefinicionpeso
{

    public function setUp()
    {
        $this->hasMany('Nomclasificacionabc', array('local' => 'idclasificacionabc', 'foreign' => 'idclasificacionabc'));
        $this->hasMany('Nomcriteriovaloracion', array('local' => 'idcriteriovaloracion', 'foreign' => 'idcriteriovaloracion'));
        parent::setUp();
    }

    public function obtenerDefinicionPeso($idestructura)
    {
        $q = new Doctrine_Query();
        return $q->select('cdp.*, nc.denominacion as clasificacionabc, ncv.denominacion as criteriovaloracion')
            ->from('Confdefinicionpeso cdp')
            ->innerJoin("cdp.Nomclasificacionabc nc")
            ->innerJoin("cdp.Nomcriteriovaloracion ncv")
            ->where('idestructura = ?', array($idestructura))
            ->orderBy('idclasificacionabc')->orderBy('idcriteriovaloracion')->execute()->toArray();
    }

    public function existeDefinicionPeso($idclasificacionabc, $idcriteriovaloracion)
    {
        $q = new Doctrine_Query();
        $r = $q->select('cdp.idclasificacionabc')
            ->from('Confdefinicionpeso cdp')
            ->where('idclasificacionabc = ? and idcriteriovaloracion = ?', array($idclasificacionabc, $idcriteriovaloracion))
            ->execute()->toArray();

        return count($r) > 0;

    }


}
