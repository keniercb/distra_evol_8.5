<?php

class NomCiudadaniaModel extends ZendExt_Model
{

    //$objcitizenship=> objeto ciudadania
    protected $objcitizenship = null;

    function __construct()
    {
        $this->objcitizenship = new NomCiudadania();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener la ciudadania activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getActiveCitizenship($filtro, $limit, $start,$value)
    {
        try {
            $tmp->data = $this->objcitizenship->getActiveCitizenship($filtro, $limit, $start,$value);
            $tmp->quantity = $this->objcitizenship->getCantActiveCitizenship($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar ciudadania
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addCitizenship($objcitizenship)
    {
        try {
            $objDomain = new NomCiudadania();
            if (!$objDomain->findByIdOrDenomadd($objcitizenship->denominacion)) {
                $obj = new NomCiudadania();
                foreach ($objcitizenship as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idciudadania;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar la ciudadania
     *
     * @param $idciudadania
     * @param $denominacion
     * @param $descripcion
     * @param $bandera
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     */
    public function modCitizenship($idciudadania, $denominacion, $abr, $descripcion, $bandera, $fdesde, $fhasta)
    {
        try {
            if (!NomCiudadania::findByIdOrDenom($denominacion, $idciudadania)) {
                $objDomain = new NomCiudadania();
                $result = $objDomain->modCitizenship(
                    $idciudadania, $denominacion, $abr, $descripcion, $bandera, $fdesde, $fhasta
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
     * Funcion para eliminar ciudadania
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delCitizenship($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCiudadania');
            if (is_array($ids)) {
                $query->whereIn('idciudadania', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idciudadania = ?', $arrids);
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
             $query->from('NomCiudadania');
             if (is_array($ids)) {
                 $query->whereIn('idciudadania', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idciudadania = ?', $arrids);
             }
             $result = $query->execute();
             return $result->delete();
         } catch (Doctrine_Exception $e) {
             if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                 $r->exception = 1;
                 return $r;
             } else {
                 return (json_encode($e->getMessage()));
             }
         }*/
    }
}

