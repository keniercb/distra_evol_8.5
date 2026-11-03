<?php

class DatEvaldefprocesoplanillasModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvaldefprocesoplanillas $DatEvaldefprocesoplanillas) {
        return $DatEvaldefprocesoplanillas->save();
    }

    public function Actualizar(array $object) {
        $this->conn->beginTransaction();
        try {
            $val = Doctrine::getTable('DatEvaldefprocesoplanillas')->find($object['idprocesoplanilla']);
            if ($val != false) {
                foreach ($object as $k => $v)
                    $val->$k = $v;
                $val->save();
                $this->conn->commit();
                return true;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function Eliminar($iddefprocesoevaluativo, $idplanilla, $idprocesoplanilla) {
        try {
            $val = Doctrine::getTable('DatEvaldefprocesoplanillas')->find($idprocesoplanilla);
            $val->delete();
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                throw new ZendExt_Exception('CHE064');
            } else {
                die($e->getMessage());
            }
        }
    }

}