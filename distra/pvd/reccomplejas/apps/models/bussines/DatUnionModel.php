<?php

class DatUnionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatUnion $DatUnion)
    {
        $DatUnion->save();
        return $DatUnion->idunion;
    }

    public function Actualizar($object)
    {
        $this->conn->beginTransaction();
        try {
            $DatUnion = Doctrine::getTable('DatUnion')->find($object['idunion']);
            if ($DatUnion != false) {
                foreach ($object as $k => $v) {
                    $DatUnion->$k = $v;
                }
                $DatUnion->save();
                $this->conn->commit();
                return true;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function Eliminar($id)
    {
        try {
            $DatUnion = Doctrine::getTable('DatUnion')->find($id);
            if ($DatUnion != false) {

                $DatUnion->delete();
                return true;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }
}