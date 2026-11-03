<?php

class NomCargoorganizacionModel extends ZendExt_Model
{
    protected $objPositionInOrganization = null;

    function __construct()
    {
        $this->objPositionInOrganization = new NomCargoorganizacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los tipo cargo organizacion activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getPositionInOrganizationActive($filtro, $limit, $start)
    {
        try {

            $tmp->data = $this->objPositionInOrganization->getPositionInOrganizationActive($filtro, $limit, $start);
            $tmp->quantity = $this->objPositionInOrganization->getCantPositionInOrganizationActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar tipo cargo organizacion
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addPositionInOrganization($objPositionInOrganization)
    {
        try {
            $objDomain = new NomCargoorganizacion();
            if (!$objDomain->findByIdOrDenomadd($objPositionInOrganization->denominacion)) {
                $obj = new NomCargoorganizacion();
                foreach ($objPositionInOrganization as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcargoorganizacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar tipo cargo organizacion
     *
     * @param numeric $idcargoorganizacion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modPositionInOrganization($idcargoorganizacion, $denominacion, $abreviatura, $descripcion,
        $fdesde, $fhasta)
    {
        try {
            if (!NomCargoorganizacion::findByIdOrDenom($denominacion, $idcargoorganizacion)) {
                $objDomain = new NomCargoorganizacion();
                $result = $objDomain->modPositionInOrganization(
                    $idcargoorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
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
     * Funcion para eliminar tipo cargo organizacion
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delPositionInOrganization($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCargoorganizacion');
            if (is_array($ids)) {
                $query->whereIn('idcargoorganizacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcargoorganizacion = ?', $arrids);
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
        /* $data = Utiles::reflectArray($arrids);
         if (count($data) > 0) {
             try {
                 return Doctrine_Query::create()
                     ->delete('NomCargoorganizacion')
                     ->whereIn('idcargoorganizacion', $data)
                     ->execute();
             } catch (Doctrine_Exception $e) {
                 throw $e;
             }
         }
         return false;*/
    }
}