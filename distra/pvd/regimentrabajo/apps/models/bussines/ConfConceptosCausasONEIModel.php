<?php

class ConfConceptosCausasONEIModel extends ZendExt_Model
{
    protected $NomConceptos;

    function __construct()
    {
        $this->NomConceptos = new NomConceptos();
    }

    public function setUp()
    {
        parent::ZendExt_Model();

    }

    public function getlistadoConceptosONEI()
    {
        $result = $this->NomConceptos->getconceptos();
        return $result;
    }

    public function guardarConceptosONEI($concepto,$orden)
    {
        try {
            $objconcepto = new NomConceptos();
            $objconcepto->denominacion = $concepto;
            $objconcepto->orden = $orden;
            $objconcepto->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function modConceptosONEI($idconcepto, $concepto,$orden)
    {
        try {
            $objconcepto = new NomConceptos();
            $existe = $objconcepto->getById($idconcepto);
            if (count($existe) > 0) {
                $existe->denominacion = $concepto;
                $existe->orden = $orden;
                $existe->save();
                return true;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function delConceptosONEI($idconcepto)
    {
        try {
            $objconcepto = new NomConceptos();
            $objconcepto->delConcepto($idconcepto);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

}
