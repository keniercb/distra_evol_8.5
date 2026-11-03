<?php

/**
 * Class NomTipomisionModel
 */
class NomTipomisionModel extends ZendExt_Model
{
    /**
     * @var NomTipomision
     */
    protected $_objTipoMision;

    /**
     *
     */
    function __construct()
    {
        $this->_objTipoMision = new NomTipomision();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getTipoMisionActivos($filtro, $limit, $start)
    {
        try {
            $response->data = $this->_objTipoMision->getTipoMisionActivos($filtro, $limit, $start);
            $response->quantity = ($limit > 0)
                ? $this->_objTipoMision->getCantTipoMisionActivos($filtro)
                : count(
                    $response->data
                );

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addTipoMision($objTipoMision)
    {
        try {
            if (!$this->_objTipoMision->findByIdOrDenom($objTipoMision->denominacion)) {
                $obj = new NomTipomision();
                foreach ($objTipoMision as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipomision;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modTipoMision($idtipomision, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $result = $this->_objTipoMision->modTipoMision(
                $idtipomision, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
            );
            if ($result) {
                return $result;
            } else {
                throw new Exception('El tipo de misi&oacute;n que quiere modificar ya existe.', 3);
            }

            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delTipoMision($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipomision');
            if (is_array($arrids)) {
                $query->whereIn('idtipomision', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idtipomision = ?', $arrids);
            }

            return $query->execute()->delete();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;

                return $r;
            } else {
                throw $e;
            }
        }
    }
}

