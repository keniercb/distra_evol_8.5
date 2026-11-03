<?php

class ConfPerfilcargasxdefectoinvolucrado
    extends BaseConfPerfilcargasxdefectoinvolucrado
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'ConfPerfil', array('local'   => 'idconfiguracionperfil',
                                'foreign' => 'idconfiguracionperfil')
        );
    }

    public function getByid($idtipocompinvolucrado)
    {
        return Doctrine::getTable('ConfPerfilcargasxdefectoinvolucrado')->find(
            $idtipocompinvolucrado
        )->toArray();
    }

    public function comprobarConfigActualComportamiento($tipoelemento)
    {
        $existeactual = Doctrine::getTable(
            'ConfPerfilcargasxdefectoinvolucrado'
        )->findByDql("idtipoelemento = $tipoelemento AND actual = 1");
        if ($existeactual[0]->idtipoelemento != null) {
            $existeactual[0]->actual = 0;
            $existeactual[0]->save();
        }
    }


}

