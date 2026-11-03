<?php

class Datelementotipomodelovalor extends BaseDatElementotipomodelovalor {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatElementotipomodelo', array('local' => 'idelementotipomodelo', 'foreign' => 'idelementotipomodelo'));
        $this->hasOne('DatEtapaElementoinversion', array('local' => 'idelemento', 'foreign' => 'idetapaelementoinversion'));
    }

    public function getByid($idelementotipomodelovalor) {
        return Doctrine::getTable('Datelementotipomodelovalor')->find($idelementotipomodelovalor);
    }

    public function salvar(Datelementotipomodelovalor &$objDatElemTipomodeloValor) {
        $objDatElemTipomodeloValor->save();
        return $objDatElemTipomodeloValor->idelementotipomodelovalor;
    }

}
