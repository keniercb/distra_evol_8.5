<?php

/**
 * Class NomCausalimitacionModel
 */
class NomCausalimitacionModel extends ZendExt_Model
{

    /**
     * @var NomCausalimitacion|null
     */
    protected $objcausa = null;

    /**
     *
     */
    function __construct()
    {
        $this->objcausa = new NomCausalimitacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener las causas activas
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveCausa()
    {
        try {
            $tmp->data = NomCausalimitacion::getActiveCausa();
            $tmp->quantity = NomCausalimitacion::getCantActiveCausa();

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener todos las causas
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getAllCausa($filtro, $limit, $start)
    {
        try {
            $objcausa = new NomCausalimitacion();
            $tmp->data = $objcausa->getAllCausa($filtro, $limit, $start);
            $tmp->quantity = $objcausa->getCantAllCausas($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar una causa
     *
     * @param object $objcausa
     *
     * @return numeric
     */
    public function addCausa($objcausa)
    {
        try {
            $objDomain = new NomCausalimitacion();
            if (!$objDomain->findByIdOrDenom($objcausa->denominacion)) {
                $obj = new NomCausalimitacion();
                foreach ($objcausa as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idcausalimitacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar una causa
     *
     * @param numeric $idcausalimitacion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modCausa($idcausalimitacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomCausalimitacion::getById($idcausalimitacion);
            $obj->denominacion = $denominacion;
            $obj->abreviatura = $abreviatura;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->save();

            return $obj->idcausalimitacion;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para eliminar las causas
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delCausa($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCausalimitacion');
            if (is_array($arrids)) {
                $query->whereIn('idcausalimitacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcausalimitacion = ?', $arrids);
            }
            $result = $query->execute();

            return $result->delete();
        } catch (Doctrine_Exception $e) {
            $r->success = 0;
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                $r->mensaje = "La causa de limitación que desea eliminar se encuentra en uso.";
                //print_r($e->getMessage());die;
                //return $r;
                return $r;
            } else {
                $r->mensaje = "Ha ocurrido un error mientras se eliminaba la causa de limitación.";
                return $r;//(json_encode($e->getMessage()));
            }
        }
    }
}

