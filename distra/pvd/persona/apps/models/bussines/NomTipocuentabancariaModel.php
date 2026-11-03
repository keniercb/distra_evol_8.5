<?php

class NomTipocuentabancariaModel extends ZendExt_Model
{

    //$_objtypeacountbank=> objeto  
    protected $_objtypeacountbank = null;

    function __construct()
    {
        $this->_objtypeacountbank = new NomTipocuentabancaria();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener tipo de cuenta bancaria activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveTypeAcountBank($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objtypeacountbank->getActiveTypeAcountBank($filtro, $limit, $start);
            $tmp->quantity = $this->_objtypeacountbank->getCantActiveTypeAcountBank($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo medio contacto
     *
     * @param object $objtypeacountbank
     *
     * @return numeric
     */
    public function addTypeAcountBank($objtypeacountbank)
    {
        try {
            $objDomain = new NomTipocuentabancaria();
            if (!$objDomain->findByIdOrDenomadd($objtypeacountbank->denominacion)) {
                $obj = new NomTipocuentabancaria();
                foreach ($objtypeacountbank as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipocuentabancaria;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo medio contacto
     *
     * @param numeric $idtipocuentabancaria
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modTypeAcountBank($idtipocuentabancaria, $denominacion, $abreviatura, $descripcion, $fdesde,
        $fhasta)
    {
        try {
            if (!NomTipocuentabancaria::findByIdOrDenom($denominacion, $idtipocuentabancaria)) {
                $objDomain = new NomTipocuentabancaria();
                $result = $objDomain->modTypeAcountBank(
                    $idtipocuentabancaria, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );
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
     * Funcion para elieminar el tipo medio contacto
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delTypeAcountBank($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocuentabancaria');
//            if (is_array($ids)) {
//                $query->whereIn('idtipocuentabancaria', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtipocuentabancaria = ?', $arrids);
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
        /*   try {
               $query = Doctrine_Query::create();
               $query->from('NomTipocuentabancaria');
               if (is_array($ids)) {
                   $query->whereIn('idtipocuentabancaria', $arrids);
               } elseif (is_numeric($arrids)) {
                   $query->where('idtipocuentabancaria = ?', $arrids);
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

