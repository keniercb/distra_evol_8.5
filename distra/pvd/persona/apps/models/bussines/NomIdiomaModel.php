<?php

class NomIdiomaModel extends ZendExt_Model
{

    //$_objLanguage=> objeto  idioma
    protected $_objLanguage = null;

    function __construct()
    {
        $this->_objLanguage = new NomIdioma();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener idiomas activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveLanguage($filtro, $limit, $start,$value)
    {
        try {
            $tmp->data = $this->_objLanguage->getActiveLanguage($filtro, $limit, $start,$value);
            $tmp->quantity = $this->_objLanguage->getCantActiveLanguage($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de idioma
     *
     * @param object $objLanguage
     *
     * @return numeric
     */
    public function addLanguage($objLanguage)
    {
        try {
            $objDomain = new NomIdioma();
            if (!$objDomain->findByIdOrDenomadd($objLanguage->denominacion)) {
                $obj = new NomIdioma();
                foreach ($objLanguage as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->ididioma;
            } else {
                return false;
            }

        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el idioma
     *
     * @param $ididioma
     * @param $denominacion
     * @param $descripcion
     * @param $bandera
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     */
    public function modLanguage($ididioma, $denominacion, $abreviatura, $descripcion, $bandera, $fdesde, $fhasta)
    {
        try {
            if (!NomIdioma::findByIdOrDenom($denominacion, $ididioma)) {
                $objDomain = new NomIdioma();
                $result = $objDomain->modLanguage($ididioma, $denominacion, $abreviatura, $descripcion, $bandera, $fdesde,
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
     * Funcion para elieminar el idioma
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delLanguage($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomIdioma');
//            if (is_array($ids)) {
//                $query->whereIn('ididioma', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('ididioma = ?', $arrids);
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
             $query->from('NomIdioma');
             if (is_array($ids)) {
                 $query->whereIn('ididioma', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('ididioma = ?', $arrids);
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

