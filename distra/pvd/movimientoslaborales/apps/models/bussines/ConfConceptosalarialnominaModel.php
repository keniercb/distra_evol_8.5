<?php
class ConfConceptosalarialnominaModel extends ZendExt_Model
{
    protected $_objDomain;
    public function __construct()
    {
        $this->_objDomain = new ConfConceptosalarialnomina();
    }
    
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getConfigByIdconceptosalarial($idconceptosalarial)
    {
        try {
            return $this->_objDomain->getConfig($idconceptosalarial);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addConfig($idconceptosalarial, $arrayconceptosnomina)
    {
        try {
            $this->_objDomain->deleteByIdconceptosalarial($idconceptosalarial);
            foreach ($arrayconceptosnomina as $v) {
                $obj = new ConfConceptosalarialnomina();
                $obj->idconceptosalarial = $idconceptosalarial;
                $obj->idconceptosalarialnomina = $v;
                $obj->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function getConceptosPD()
    {
        try {
            $res = $this->_objDomain->getConceptosPD();
            return $res;
        } catch (Exception $e) {
            return false;
        }
    }
}