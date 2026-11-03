<?php
class ConfIdoneidadModel extends ZendExt_Model
{
    protected $_objDomain;
    public function __construct()
    {
        $this->_objDomain = new ConfIdoneidad();
    }
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function getConfig()
    {
        try {
            $datos = $this->_objDomain->getConfig();
            foreach ($datos as $k => $val) {
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idestructura']);
                $datos[$k]['estructura'] = $estructura[0]->denominacion;
            }
            $result->datos = $datos;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($tipo, $Est)
    {
        try {
            $existe = $this->_objDomain->existeEstructura($Est);
            if (count($existe) == 0) {
                $obj = new ConfIdoneidad();
                $obj->tipo = $tipo;
                $obj->idestructura = $Est;
                $obj->save();
                return true;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idconfidoneidad)
    {
        try {
            $obj = $this->_objDomain->getById($idconfidoneidad);
            $obj->delete();            
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}