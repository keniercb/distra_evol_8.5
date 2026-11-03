<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DatEvalmodeloexpmatematicaModel
 *
 * @author dominick
 */
class DatEvalmodeloexpmatematicaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalmodeloexpmatematica $DatEvalmodeloexpmatematica) {
        $DatEvalmodeloexpmatematica->save();
    }

    public function Actualizar(DatEvalmodeloexpmatematica $DatEvalmodeloexpmatematica) {
        $DatEvalmodeloexpmatematica->save();
    }

    public function Eliminar($idevalmodeloexpmatematica) {

        try {
            Doctrine_Query::create()
                ->delete()
                ->from('DatEvalmodeloexpmatematica')
                ->where('idevalmodeloexpmatematica = ?', $idevalmodeloexpmatematica)
                ->execute();
            return true;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                throw new ZendExt_Exception('CHE045');
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    public function getModelo($idevalmodeloexpmatematica) {
        return $DatEvalmodeloexpmatematica = Doctrine::getTable('DatEvalmodeloexpmatematica')->find($idevalmodeloexpmatematica);
    }

}