<?php
class NomDominio extends BaseNomDominio
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('ConfImportarexcel', array('local' => 'iddominio', 'foreign' => 'iddominio'));
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
}
