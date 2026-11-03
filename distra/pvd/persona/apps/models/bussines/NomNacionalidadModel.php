<?php

class NomNacionalidadModel extends ZendExt_Model
{

    //$objhaircolor=> objeto  nacionalidads
    protected $_objnationality = null;

    function __construct()
    {
        $this->_objnationality = new NomNacionalidad();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener la nacionalidad activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveNationality($filtro, $limit, $start,$value)
    {
        try {
            $tmp->data = $this->_objnationality->getActiveNationality($filtro, $limit, $start,$value);
            $tmp->quantity = $this->_objnationality->getCantActiveNationality($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de nacionalidad
     *
     * @param object $objnationality
     *
     * @return numeric
     */
    public function addNationality($objnationality)
    {
        try {
            $objDomain = new NomNacionalidad();
            if (!$objDomain->findByIdOrDenomadd($objnationality->denominacion)) {
                $obj = new NomNacionalidad();
                foreach ($objnationality as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idnacionalidad;
            } else {
                return false;
            }

        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de  nacionalidad
     *
     * @param $idnacionalidad
     * @param $denominacion
     * @param $descripcion
     * @param $bandera
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     */
    public function modNationality($idnacionalidad, $denominacion, $abr, $descripcion, $bandera, $fdesde, $fhasta)
    {
        try {
            if (!NomNacionalidad::findByIdOrDenom($denominacion, $idnacionalidad)) {
                $objDomain = new NomNacionalidad();
                $result = $objDomain->modNationality(
                    $idnacionalidad, $denominacion, $abr, $descripcion, $bandera, $fdesde, $fhasta
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
     * Funcion para elieminar el tipo de  nacionalidad
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delNationality($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNacionalidad');
//            if (is_array($ids)) {
//                $query->whereIn('idnacionalidad', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idnacionalidad = ?', $arrids);
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
             $query->from('NomNacionalidad');
             if (is_array($ids)) {
                 $query->whereIn('idnacionalidad', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idnacionalidad = ?', $arrids);
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

