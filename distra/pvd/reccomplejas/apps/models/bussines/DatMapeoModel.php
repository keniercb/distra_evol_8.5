<?php

class DatMapeoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatMapeo $DatMapeo)
    {
        $DatMapeo->save();
        return $DatMapeo->idmapeo;
    }

    public function Actualizar($object)
    {
        $this->conn->beginTransaction();
        try {
            $DatMapeo = Doctrine::getTable('DatMapeo')->find($object['idmapeo']);
            if ($DatMapeo != false) {
                foreach ($object as $k => $v) {
                    $DatMapeo->$k = $v;
                }
                $DatMapeo->save();
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
            $DatMapeo = Doctrine::getTable('DatMapeo')->find($id);
            if ($DatMapeo != false) {

                $DatMapeo->delete();
                return true;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

}