<?php

class DatElementoInversion extends BaseDatElementoInversion {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatInversion', array('local' => 'idinversion', 'foreign' => 'idinversion'));
        $this->hasOne('DatEtapa', array('local' => 'idetapa', 'foreign' => 'idetapa'));
        $this->hasOne('DatElemento', array('local' => 'idelemento', 'foreign' => 'idelemento'));
    }

    public function getByid($idetapa) {
        return Doctrine::getTable('DatElementoInversion')->find($idetapa);
    }

    public function adicionarElemtInv($params) {
        $objdato = new DatElementoInversion();
        $objdato->idinversion = $params['idinversion'];
        $objdato->idetapa = $params['idetapa'];
        $objdato->parametrodinamico = $params['idcontenido'];
        $objdato->idelemento = $params['idelemento'];
        $objdato->idcontenido = $params['idcontenido'];
        $objdato->save();
        return true;
    }

    public function deleteEt($parametros, $dat) {
        $query = new Doctrine_Query();
        $aux = $query->delete()
                ->from('DatElementoInversion ')
                ->where('idinversion=? ', array($parametros['idinversion']))
                ->execute();
        return $aux;
    }

}
