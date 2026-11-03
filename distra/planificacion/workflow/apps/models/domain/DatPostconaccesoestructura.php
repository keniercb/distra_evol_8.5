<?php

class DatPostconaccesoestructura extends BaseDatPostconaccesoestructura
{

    public function setUp()
    {
        parent:: setUp();
        $this->HasMany(
            'NomCondicion',
            array('local' => 'idcondicion', 'foreign' => 'idcondicion')
        );
        $this->HasMany(
            'DatEstado', array('local' => 'idestado', 'foreign' => 'idestado')
        );
    }

    public function getByid($idestructura)
    {
        return Doctrine::getTable('DatPostconaccesoestructura')->find(
            $idestructura
        )->toArray();
    }


}

