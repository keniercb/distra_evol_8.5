<?php

class DatIncotermClausula extends BaseDatIncotermClausula
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        $this->hasMany('NomClausula', array('local' => 'idclausula', 'foreign' => 'idclausula'));
        $this->hasMany('NomIncoterm', array('local' => 'idincoterm', 'foreign' => 'idincoterm'));
        parent::setUp();
    }
}
