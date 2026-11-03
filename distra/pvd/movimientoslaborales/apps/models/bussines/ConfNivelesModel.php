<?php
class ConfNivelesModel extends ZendExt_Model
{
    protected $_objDomain;
    public function __construct()
    {
        $this->_objDomain = new ConfNiveles();
    }
    
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addConfig($idpreparacion, $arrayniveles)
    {
        try {
            $this->_objDomain->deleteByIdPrep($idpreparacion);
            foreach ($arrayniveles as $v) {
                $obj = new ConfNiveles();
                $obj->idpreparacion = $idpreparacion;
                $obj->idniveleducacional = $v;
                $obj->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
}
