<?php

class ConfSuplementoModel extends ZendExt_Model
{
    protected $_objDomain;
    public function __construct()
    {
        $this->_objDomain = new ConfSuplemento();
    }
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function getSuplementos($denominacion,$start,$limit)
    {
        try {
             $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
             $datos = $this->_objDomain->getSuplementos(
                 $idestructura, $denominacion, $start, $limit
             );
             $result->datos = $datos;
             return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function guardarSuplemento($idplantilla)
    {
        $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        $obj = new ConfSuplemento();
        $obj->identidad = $idestructura;
        $obj->idplantilla = $idplantilla;
        $obj->save();
    }


    public function deleteSuplemento($idsuplemento)
    {
        try {
            $obj = $this->_objDomain->getById($idsuplemento);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}