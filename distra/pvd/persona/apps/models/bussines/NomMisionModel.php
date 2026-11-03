<?php

class NomMisionModel extends ZendExt_Model
{
    protected $_objMision;

    function __construct()
    {
        $this->_objMision = new NomMision();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getMisionActive($filtro, $limit, $start, $idtipomision,$value)
    {
        try {
            $response->data = $this->_objMision->getMisionActive($filtro, $limit, $start, $idtipomision,$value);
            $response->quantity = $this->_objMision->getCantMisionActive($filtro, $idtipomision);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $objMision
     *
     * @return bool|mixed
     */
    public function addMision($objMision)
    {
        try {
            if (!$this->_objMision->findByIdOrDenomadd($objMision->denominacion, null, $objMision->idtipomision)) {
                $obj = new NomMision();
                foreach ($objMision as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idmision;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modMision($idmision, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipomision)
    {
        try {
            if (!$this->_objMision->findByIdOrDenomadd($denominacion, $idmision, $idtipomision)) {
                $result = $this->_objMision->modMision(
                    $idmision, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipomision
                );

                return $result;
            } else {
                throw new Exception('La misi&oacute;n ya existe', 3);
            }

        } catch (Exception $e) {
            throw $e;
        }
    }

    public function delMision($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMision');
//            if (is_array($ids)) {
//                $query->whereIn('idmision', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idmision = ?', $arrids);
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
             $query = Doctrine_Query::create()
                 ->from('NomMision');
             if (is_array($arrids)) {
                 $query->whereIn('idmision', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idmision = ?', $arrids);
             }
             return $query->execute()->delete();
         } catch (Doctrine_Exception $e) {
             if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                 $r->exception = 1;
                 return $r;
             } else {
                 throw $e;
             }
         }*/
    }
}

