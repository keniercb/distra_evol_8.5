<?php

class DatElementotipomodelo extends BaseDatElementotipomodelo {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatElemento', array('local' => 'idelemento', 'foreign' => 'idelemento'));
        $this->hasMany('DatElementotipomodelovalor', array('local' => 'idelementotipomodelo', 'foreign' => 'idelementotipomodelo'));
        $this->hasMany('NomTipomodelo', array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo'));
    }

    public function getByid($idelementotipomodelo) {
        return Doctrine::getTable('DatElementotipomodelo')->find($idelementotipomodelo)->toArray();
    }

    public function salvar(DatElementotipomodelo &$objDatElemTipomodelo) {
        $objDatElemTipomodelo->save();
        return $objDatElemTipomodelo->idelementotipomodelo;
    }

    public function getIdelementotipomodeloByIdelemento($idelemento) {
        $query = Doctrine_Query::create();
        $data = $query->select("de.idelementotipomodelo")
                ->from('DatElementotipomodelo de')
                ->where('de.idelemento = ?', $idelemento)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    public function getIdelementoByIdelementotipomodelo($idtipomodelo) {
        $query = Doctrine_Query::create();
        $data = $query->select("de.idelementotipomodelo")
                ->from('DatElementotipomodelo de')
                ->where('de.idtipomodelo = ?', $idtipomodelo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

}
