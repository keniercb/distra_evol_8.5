<?php

class NomPrendaModel extends ZendExt_Model
{
    //$_objwear=> objeto  Wearas
    protected $_objwear = null;

    function __construct()
    {
        $this->_objwear = new NomPrenda();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener el tipo de prenda activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveWear($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objwear->getActiveWear($filtro, $limit, $start);
            $tmp->quantity = $this->_objwear->getCantActiveWear($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de Weara
     *
     * @param object $objwear
     *
     * @return numeric
     */
    public function addWear($objwear)
    {
        try {
            $objDomain = new NomPrenda();
            if (!$objDomain->findByIdOrDenomadd($objwear->denominacion)) {
                $obj = new NomPrenda();
                foreach ($objwear as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idprenda;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de  Weara
     *
     * @param numeric $idprenda
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modWear($idprenda, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomPrenda::findByIdOrDenom($denominacion, $idprenda)) {
                $objDomain = new NomPrenda();
                $result = $objDomain->modWear($idprenda, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta);
                if ($result) {
                    return $result;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para elieminar el tipo de  Weara
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delWear($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomPrenda');
//            if (is_array($ids)) {
//                $query->whereIn('idprenda', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idprenda = ?', $arrids);
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
             $query->from('NomPrenda');
             if (is_array($ids)) {
                 $query->whereIn('idprenda', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idprenda = ?', $arrids);
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

}

