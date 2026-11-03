<?php

class DatEvalindicadorescalculadoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalindicadorescalculado $DatEvalindicadorescalculado) {
        $DatEvalindicadorescalculado->save();
    }

    public function Actualizar(DatEvalindicadorescalculado $DatEvalindicadorescalculado) {
        $DatEvalindicadorescalculado->save();
    }

    public function Eliminar($idindicadorcalculado, $idexpresionmatematica) {
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                    ->delete()
                    ->from('DatEvalindicadorescalculado')
                    ->where('idindicadorcalculado = ?', $idindicadorcalculado)
                    ->execute();
            $aux = $this->pIntegrator->comun->EliminarExpresionMatematica($idexpresionmatematica);
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

}