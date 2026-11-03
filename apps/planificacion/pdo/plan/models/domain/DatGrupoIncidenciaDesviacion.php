<?php

class DatGrupoIncidenciaDesviacion extends BaseDatGrupoIncidenciaDesviacion
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'DatIncidencia',
            array('local'   => 'idincidenciadesviacion',
                  'foreign' => 'idincidencia')
        );
        $this->hasOne(
            'DatDesviacion',
            array('local'   => 'idincidenciadesviacion',
                  'foreign' => 'iddesviacion')
        );
    }

    public function getByid($tipo)
    {
        return Doctrine::getTable('DatGrupoIncidenciaDesviacion')->find($tipo)
            ->toArray();
    }


}

