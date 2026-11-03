<?php

class NomOrganizacionModel extends ZendExt_Model
{

    protected $_objOrganization;

    function __construct()
    {
        $this->_objOrganization = new NomOrganizacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los organizacion activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getOrganizationActive($filtro, $limit, $start, $idtipoorganizacion,$value)
    {
        try {
            $tmp->data = $this->_objOrganization->getOrganizationActive($filtro, $limit, $start, $idtipoorganizacion,$value);
            $tmp->quantity = $this->_objOrganization->getCantOrganizationActive($filtro, $idtipoorganizacion);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar  organizacion
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addOrganization($objOrganization)
    {
        try {
            if (!$this->_objOrganization->findByIdOrDenom(
                $objOrganization->denominacion, $objOrganization->idtipoorganizacion
            )
            ) {
                $obj = new NomOrganizacion();
                foreach ($objOrganization as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idorganizacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar organizacion
     *
     * @param numeric $idorganizacion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modOrganization($idorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta,
        $idtipoorganizacion)
    {
        try {
            $result = $this->_objOrganization->modOrganization(
                $idorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipoorganizacion
            );
            if ($result) {
            } else {
                return false;
            }

            return $result;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para eliminar  organizacion
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delOrganization($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomOrganizacion');
            if (is_array($ids)) {
                $query->whereIn('idorganizacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idorganizacion = ?', $arrids);
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
             $query->from('NomOrganizacion');
             if (is_array($ids)) {
                 $query->whereIn('idorganizacion', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idorganizacion = ?', $arrids);
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
    public function getOrganizaciones()
    {
        try {
            $tmp = NomOrganizacion::getOrganizaciones();

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }


}

