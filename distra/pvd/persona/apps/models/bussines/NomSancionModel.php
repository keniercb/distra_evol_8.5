<?php

class NomSancionModel extends ZendExt_Model
{

    protected $_objSanction = null;

    function __construct()
    {
        $this->_objSanction = new NomSancion();
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
    public function getSanctionActive($idtiposancion, $filtro, $limit, $start,$value)
    {
        try {
            $tmp = new StdClass();
            $tmp->data = $this->_objSanction->getSanctionActive($filtro, $limit, $start, $idtiposancion,$value);
            $tmp->quantity = $this->_objSanction->getCantSanctionActive($filtro, $idtiposancion);

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
    public function addSanction($objSanction)
    {
        try {
            if (!$this->_objSanction->findByIdOrDenom($objSanction->denominacion)) {
                $obj = new NomSancion();
                foreach ($objSanction as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idsancion;
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
     * @param numeric $idsancion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSanction(
        $idsancion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtiposancion, $tiemporehabilitacion,
        $unidadtiempo
    )
    {
        try {
            if (!$this->_objSanction->findByIdOrDenom($denominacion, $idsancion)) {
                $result = $this->_objSanction->modSanction(
                    $idsancion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtiposancion,
                    $tiemporehabilitacion,
                    $unidadtiempo
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
    public function delSanction($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomSancion');
//            if (is_array($ids)) {
//                $query->whereIn('idsancion', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idsancion = ?', $arrids);
            }
            $result = $query->execute();
            if ($result->delete()) {
                $r['exception'] = 0;
            }

            return $r;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r['exception'] = 1;

                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
        /* try {
             $query = Doctrine_Query::create();
             $query->from('NomSancion');
             if (is_array($ids)) {
                 $query->whereIn('idsancion', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idsancion = ?', $arrids);
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
         }*/
    }

    public function getSanctionByCodigo($codigo)
    {
        try {
            return $this->_objSanction->getSanctionByCodigo($codigo);
        } catch (Exception $e) {
            throw $e;
        }
    }
}

