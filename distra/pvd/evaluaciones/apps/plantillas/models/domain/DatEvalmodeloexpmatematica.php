<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DatEvalmodeloexpmatematica
 *
 * @author dominick
 */
class DatEvalmodeloexpmatematica extends BaseDatEvalmodeloexpmatematica {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
    }

    public function getArrIdExpMatematicaByModelo($idmodelo) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalmodeloexpmatematica')
                ->where('idmodelo = ?', $idmodelo)
                ->execute();
        return $result->toArray();
    }

}