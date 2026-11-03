<?php

class DatCartatecnologicamodelo extends BaseDatCartatecnologicamodelo {

    public function setUp() {
        parent::setUp();

        $this->hasOne(
                'DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasOne(
                'DatCartatecnologica', array('local' => 'idcartatecnologica',
            'foreign' => 'idcartatecnologica')
        );
    }

    public function listarModelosXCarta($idcarta) {
        $query = new Doctrine_Query();
        $data->data = $query
                        ->from("DatCartatecnologicamodelo cta")
                        ->addWhere('cta.idcartatecnologica = ?', $idcarta)
                        ->innerJoin('cta.DatModelo m')->execute()->toArray(true);
        return $data;
    }

    public function eliminarModelosXCarta($cartas) {
        $query = new Doctrine_Query();
        $query->delete('DatCartatecnologicamodelo')
                ->from('DatCartatecnologicamodelo')
                ->whereIn('idcartatecnologica', $cartas)->execute();
        return true;
    }

}
