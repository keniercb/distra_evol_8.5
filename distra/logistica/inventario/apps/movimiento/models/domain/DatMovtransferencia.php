<?php
class DatMovtransferencia extends BaseDatMovtransferencia
{
    public function setUp()
    {
        $this->hasOne('DatMovimientos', array('foreign' => 'idmovimiento', 'local' => 'idmovimiento'));
        $this->hasOne(
            'DatEstructuraubicacion',
            array('foreign' => 'idestructuraubicacion', 'local' => 'idestructuraubicaciondestino')
        );
    }

}


