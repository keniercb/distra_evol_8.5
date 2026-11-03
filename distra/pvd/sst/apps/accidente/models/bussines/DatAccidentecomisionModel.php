<?php 
class DatAccidentecomisionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getComisiones($idaccidente)
    {
        try {
            $datos = DatAccidentecomision::getComisiones($idaccidente);
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idaccidente, $idcomision)
    {
        try {
            $obj = new DatAccidentecomision();
            $obj->idaccidente = $idaccidente;
            $obj->idcomision = $idcomision;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}