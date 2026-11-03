<?php

class NomAmbitodofa extends BaseNomAmbitodofa
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasMany('DatEstudiomatrizdofa', array('local' => 'idambitodofa', 'foreign' => 'idambitodofa'));
    }

    public function getByid($idambitodofa)
    {
        return Doctrine::getTable('NomAmbitodofa')->find($idambitodofa);
    }

    public function getTreeAmbitos()
    {
        $_query = Doctrine_Query::create();
        $_query->from('NomAmbitodofa a')
        ->orderby('a.idambitodofa ASC')
        ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $a = $_query->execute();
        return $a;

    }


}

