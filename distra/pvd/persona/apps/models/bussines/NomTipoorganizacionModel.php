<?php

class NomTipoorganizacionModel extends ZendExt_Model
{

    protected $_objTypeOfOrganization = null;

    function __construct()
    {
        $this->_objTypeOfOrganization = new NomTipoorganizacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los tipo organizacion activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getTypeOfOrganizationActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objTypeOfOrganization->getTypeOfOrganizationActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objTypeOfOrganization->getCantTypeOfOrganizationActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar tipo organizacion
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addTypeOfOrganization($_objTypeOfOrganization)
    {
        try {
            if (!$this->_objTypeOfOrganization->findByIdOrDenom($_objTypeOfOrganization->denominacion)) {
                $obj = new NomTipoorganizacion();
                foreach ($_objTypeOfOrganization as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipoorganizacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar tipo organizacion
     *
     * @param numeric $idtipoorganizacion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modTypeOfOrganization($idtipoorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde,
        $fhasta)
    {
        try {
            if (!$this->_objTypeOfOrganization->findByIdOrDenom($denominacion, $idtipoorganizacion)) {
                $result = $this->_objTypeOfOrganization->modTypeOfOrganization(
                    $idtipoorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
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
     * Funcion para eliminar tipo organizacion
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delTypeOfOrganization($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipoorganizacion');
            if (is_array($arrids)) {
                $query->whereIn('idtipoorganizacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idtipoorganizacion = ?', $arrids);
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

}

