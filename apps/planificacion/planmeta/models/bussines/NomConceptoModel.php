<?php

class NomConceptoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_concepto(NomConcepto $nomConcepto)
    {
        $nomConcepto->save();
        return $nomConcepto->idconcepto;
    }

    public function modificarnom_concepto($nomConcepto)
    {
        $nomConcepto->save();
    }

    public function eliminarnom_concepto($nomConcepto)
    {
        $nomConcepto->delete();
    }

    public function eliminarConcepto($id, $rolledback)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $query = Doctrine_Query::create();
        try {
            $query->delete()->from('NomConcepto')->where(
                'idconcepto = ?', array($id)
            )
                ->execute();
            if (!$rolledback) {
                $conn->commit();
            }
            $conn->beginTransaction();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == '23503') {
                $conn->rollback();
                return false;
            }
        }
        return true;
    }

    public function eliminarConceptos($arrayToDelete)
    {
        $arrayInUse = array();
        //$conn = null;
        $rolledback = false;
        for ($i = 0; $i < count($arrayToDelete); $i++) {
            if (!self::eliminarConcepto($arrayToDelete[$i], $rolledback)) {
                array_push($arrayInUse, $arrayToDelete[$i]);
                $rolledback = true;
            } else {
                $rolledback = false;
            }
        }
        return $arrayInUse;
    }
}


