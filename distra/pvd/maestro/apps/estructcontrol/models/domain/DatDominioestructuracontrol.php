<?php
class DatDominioestructuracontrol extends BaseDatDominioestructuracontrol
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomDominio', array('local'=>'iddominio','foreign'=>'iddominio'));
        $this->hasOne('DatEstructuracontrol', array('local'=>'idestructuracontrol','foreign'=>'idestructuracontrol'));
    }

    public function getEstructurascontrolByDominioyEstructura($iddominio, $idestructura)
    {
        $queryObj = Doctrine_Query::create()
            ->select('dec.*, ec.*, c.*, dc.*, dm.*')
            ->from('DatDominioestructuracontrol dec')
            ->innerJoin('dec.DatEstructuracontrol ec')
            ->leftJoin('ec.DatControlador c')
            ->where("dec.iddominio = '$iddominio' and dec.idestructura = '$idestructura'");
        return $queryObj->fetchArray()[0]['DatEstructuracontrol'];
    }

    public function getControladosByDominioEstructuraPersona($iddominio, $idestructura, $idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*, dc.*, dm.*')
            ->from('DatControlador c')
            ->innerJoin('c.DatEstructuracontrol ec')
            ->innerJoin('ec.DatDominioestructuracontrol dec')
            ->innerJoin('c.DatControlado dc')
            ->where("dec.iddominio='$iddominio' and dec.idestructura='$idestructura' and c.idpersona='$idpersona'");
        return $queryObj->fetchArray();
    }

    public function deleteByEstControl($idestructuracontrol)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('DatDominioestructuracontrol c')
            ->where("c.idestructuracontrol = '$idestructuracontrol'")
            ->execute();
    }

    public function getControladosTiene($iddominio, $idestructura)
    {
        $sql = "SELECT count(c.idcontrolado)
				FROM mod_rrhhmaestro.dat_controlado as c
				INNER JOIN mod_rrhhmaestro.dat_controlador using(idcontrolador)
				INNER JOIN mod_rrhhmaestro.dat_dominioestructuracontrol as d using(idestructuracontrol)
                WHERE d.iddominio = $iddominio and d.idestructura = $idestructura";
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
        return $result;
    }

    public function getEstructurascontrolEvaluaciones($iddominio, $idestructura)
    {
        $queryObj = Doctrine_Query::create()
            ->select('dec.*, ec.*, c.*, dc.*, dm.*')
            ->from('DatDominioestructuracontrol dec')
            ->innerJoin('dec.DatEstructuracontrol ec')
            ->leftJoin('ec.DatControlador c')
            ->where("dec.iddominio = '$iddominio' and dec.idestructura = '$idestructura'");
        return $queryObj->fetchArray()[0]['DatEstructuracontrol'];
    }

    public function getControladorByDominioEstructuraPersona($iddominio, $idestructura, $idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idcontrolador,c.idcargo,c.idpersona')
            ->from('DatControlador c')
            ->innerJoin('c.DatEstructuracontrol ec')
            ->innerJoin('ec.DatDominioestructuracontrol dec')
            ->where("dec.iddominio='$iddominio' and c.idpersona='$idpersona'");
        if (!empty($idestructura)) {
            $queryObj->addWhere("dec.idestructura='$idestructura'");
        }
        return $queryObj->fetchArray();
    }
}