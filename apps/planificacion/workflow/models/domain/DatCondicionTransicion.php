<?php

class DatCondicionTransicion extends BaseDatCondicionTransicion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomCondicion',
            array('local' => 'idcondicion', 'foreign' => 'idcondicion')
        );
        $this->hasOne(
            'DatTransicion',
            array('local' => 'idtransicion', 'foreign' => 'idtransicion')
        );
    }


}

