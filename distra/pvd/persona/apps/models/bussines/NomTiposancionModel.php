<?php

class NomTiposancionModel extends ZendExt_Model
{

    protected $_objTypeOfSanction = null;

    function __construct()
    {
        $this->_objTypeOfSanction = new NomTiposancion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los sancion activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getTypeOfSanctionActive($filtro, $limit, $start)
    {
        try {
            $tmp = new StdClass();
            $tmp->data = $this->_objTypeOfSanction->getTypeOfSanctionActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objTypeOfSanction->getCantTypeOfSanctionActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar sancion
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addTypeOfSanction($objTypeOfSanction)
    {
        try {
            $objDomain = new NomTiposancion();
            if (!$objDomain->findByIdOrDenom($objTypeOfSanction->denominacion)) {
                $obj = new NomTiposancion();
                foreach ($objTypeOfSanction as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtiposancion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar sancion
     *
     * @param numeric $idmotivosancion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modTypeOfSanction($idtiposancion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $objDomain = new NomTiposancion();
            if (!$objDomain->findByIdOrDenom($denominacion, $idtiposancion)) {
                $result = $objDomain->modTypeOfSanction(
                    $idtiposancion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );

                return $result;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para eliminar sancion
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delTypeOfSanction($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTiposancion');
//            if (is_array($ids)) {
//                $query->whereIn('idtiposancion', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtiposancion = ?', $arrids);
            }
            $result = $query->execute();

            return $result->delete();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;

                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }


    public function getTipoSanctionByCodigo($codigo)
    {
        try {
            return $this->_objTypeOfSanction->getTipoSanctionByCodigo($codigo);
        } catch (Exception $e) {
            throw $e;
        }
    }

}

