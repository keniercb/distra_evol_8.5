<?php

class NomEstadocivilModel extends ZendExt_Model
{
    //$_objMaritalStatus=> objeto  MaritalStatusas
    protected $_objMaritalStatus = null;

    function __construct()
    {
        $this->_objMaritalStatus = new NomEstadocivil();
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
    public function getActiveMaritalStatus($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objMaritalStatus->getActiveMaritalStatus($filtro, $limit, $start);
            $tmp->quantity = $this->_objMaritalStatus->getCantActiveMaritalStatus($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de MaritalStatusa
     *
     * @param object $objMaritalStatus
     *
     * @return numeric
     */
    public function addMaritalStatus($objMaritalStatus)
    {
        try {
            $objDomain = new NomEstadocivil();
            if (!$objDomain->findByIdOrDenomadd($objMaritalStatus->denominacion)) {
                $obj = new NomEstadocivil();
                foreach ($objMaritalStatus as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idestadocivil;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de  MaritalStatusa
     *
     * @param numeric $idestadocivil
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modMaritalStatus($idestadocivil, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomEstadocivil::findByIdOrDenom($denominacion, $idestadocivil)) {
                $objDomain = new NomEstadocivil();
                $result = $objDomain->modMaritalStatus($idestadocivil, $denominacion, $abreviatura, $descripcion, $fdesde,
                    $fhasta);
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
     * Funcion para elieminar el tipo de  MaritalStatusa
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delMaritalStatus($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstadocivil');
//            if (is_array($ids)) {
//                $query->whereIn('idestadocivil', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idestadocivil = ?', $arrids);
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
        /*try {
            $query = Doctrine_Query::create();
            $query->from('NomEstadocivil');
            if (is_array($ids)) {
                $query->whereIn('idestadocivil', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idestadocivil = ?', $arrids);
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

