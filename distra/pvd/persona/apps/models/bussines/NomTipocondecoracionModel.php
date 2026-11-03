<?php

class NomTipocondecoracionModel extends ZendExt_Model
{
    protected $_objTipoCondecoracion;

    function __construct()
    {
        $this->_objTipoCondecoracion = new NomTipocondecoracion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTipoCondecoracionActivos($filtro, $limit, $start)
    {
        try {
            $response->data = $this->_objTipoCondecoracion->getTipoCondecoracionActivos($filtro, $limit, $start);
            $response->quantity = ($limit > 0) ? $this->_objTipoCondecoracion->getCantTipoCondecoracionActivos(
                $filtro
            ) : count($response->data);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addTipoCondecoracion($objTipoCondec)
    {
        try {
            if (!$this->_objTipoCondecoracion->findByIdOrDenom($objTipoCondec->denominacion)) {
                $obj = new NomTipocondecoracion();
                foreach ($objTipoCondec as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipocondecoracion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modTipoCondecoracion($idtipocondecoracion, $denominacion, $abr, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->_objTipoCondecoracion->findByIdOrDenom($denominacion, $idtipocondecoracion)) {
                $result = $this->_objTipoCondecoracion->modTipoCondecoracion(
                    $idtipocondecoracion, $denominacion, $abr, $descripcion, $fdesde, $fhasta
                );
            } else {
                return false;
            }

            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function delTipoCondecoracion($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocondecoracion');
//            if (is_array($ids)) {
//                $query->whereIn('idtipocondecoracion', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtipocondecoracion = ?', $arrids);
            }
            $result = $query->execute();

            return $result->delete();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;

                return $r;
            } else {
                throw $e;
            }
        }
    }

}

