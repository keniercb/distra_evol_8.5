<?php
class NomDominio extends BaseNomDominio
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatDominioestructuracontrol', array('local' => 'iddominio', 'foreign' => 'iddominio'));
    }

    public function getById($iddominio)
    {
        return Doctrine::getTable('NomDominio')->find($iddominio);
    }

    public function getDominiosAll()
    {
        $queryObj = Doctrine_Query::create()
            ->select('d.*')
            ->from('NomDominio d');
        return $queryObj->fetchArray();
    }

    public function getDominiosSinEstructurasdecontrol($idestructura, $idestructuracontrol)
    {
        $queryObj = Doctrine_Query::create()
            ->select('d.*')
            ->from('NomDominio d');
        if (!empty($idestructuracontrol)) {
            $queryObj->addWhere(
                "d.iddominio not in (SELECT de.iddominio FROM DatDominioestructuracontrol de"
                ." WHERE de.idestructura = $idestructura and de.idestructuracontrol <> $idestructuracontrol)"
            );
        } else {
            $queryObj->addWhere(
                "d.iddominio not in"
                ." (SELECT de.iddominio FROM DatDominioestructuracontrol de WHERE de.idestructura = $idestructura)"
            );
        }
        return $queryObj->fetchArray();
    }
}