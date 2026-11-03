<?php

class DatProformaClausula extends BaseDatProformaClausula
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        $this->hasOne('DatProforma', array('local' => 'idproforma', 'foreign' => 'idproforma'));
        $this->hasOne('NomClausula', array('local' => 'idclausula', 'foreign' => 'idclausula'));
        parent::setUp();
    }
}
