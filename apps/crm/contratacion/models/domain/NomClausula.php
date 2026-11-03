<?php

class NomClausula extends BaseNomClausula
{

    public function setUp()
    {
        parent::setUp();

        $this->HasMany('DatIncotermClausula', array('local' => 'idclausula', 'foreign' => 'idclausula'));
        $this->hasMany('DatProformaClausula', array('local' => 'idclausula', 'foreign' => 'idclausula'));
    }

}
