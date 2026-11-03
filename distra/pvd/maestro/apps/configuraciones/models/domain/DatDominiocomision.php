<?php
class DatDominiocomision extends BaseDatDominiocomision
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomDominio',
            array('local'=>'iddominio', 'foreign'=>'iddominio')
        );
    }

    public function getById($iddominiocomision)
    {
        return Doctrine::getTable('DatDominiocomision')->find($iddominiocomision);
    }

    public function getDominiosByComision($idcomision)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('DatDominiocomision c')
            ->where("c.idcomision = '$idcomision'");
        return $queryObj->fetchArray();
    }

    public function deleteByComision($idcomision)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('DatDominiocomision c')
            ->where("c.idcomision = '$idcomision'")
            ->execute();
    }
}
