<?php

class NomTipoareaoperaciones extends BaseNomTipoareaoperaciones
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTipoareaEntidad', array('local'   => 'idnomtipoareaentidad',
                                        'foreign' => 'idtipoareaentidad')
        );
        $this->hasOne(
            'NomOperacion', array('local' => 'idoperacion', 'foreign' => 'idoperacion')
        );

        if (class_exists('NomOperacion')) {
            $array[] = array('cardinalidad' => 'many',
                             'relation'     => 'NomTipoareaoperaciones',
                             'properties'   => array('foreign' => 'idoperacion',
                                                     'local'   => 'idoperacion'));
            $operacionContable = new NomOperacion();
            UtilesDoctrineModel::tryInyectRelactions(
                $operacionContable, $array
            );
        }
    }

}




