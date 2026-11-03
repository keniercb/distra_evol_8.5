<?php
class DatDatosModeloNominaConceptosModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function DatDatosModeloNominaConceptosModel() {
        parent::ZendExt_Model();
    }

    public function devolverObjeto() {
	  $objModelDatosModeloConceptos = new Doctrine_Collection('DatDatosModeloNominaConceptos');
      return $objModelDatosModeloConceptos;
   }
}
