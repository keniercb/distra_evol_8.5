<?php

/**
 * Clase del negocio del nomenclador tipo de padecimento
 * Class NomPadecimientoModel
 */
class NomPadecimientoModel extends ZendExt_Model
{

    //$objhaircolor=> objeto color de ojos
    protected $_objsuffering = null;

    function __construct()
    {
        $this->_objsuffering = new NomPadecimiento();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los colores de ojos activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveSuffering($filtro, $limit, $start,$value)
    {
        try {
            $tmp->data = $this->_objsuffering->getActiveSuffering($filtro, $limit, $start,$value);
            $tmp->quantity = $this->_objsuffering->getCantActiveSuffering($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }
    public function getPadecimientos()
    {
        try {
            $tmp->data = $this->_objsuffering->getPadecimientos();
           // $tmp->quantity = $this->_objsuffering->getCantActiveSuffering($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de color de ojo
     *
     * @param object $objsuffering
     *
     * @return numeric
     */
    public function addSuffering($objsuffering)
    {
        try {
            $objDomain = new NomPadecimiento();
            if (!$objDomain->findByIdOrDenomadd($objsuffering->denominacion)) {
                $obj = new NomPadecimiento();
                foreach ($objsuffering as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idpadecimiento;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de color de ojos
     *
     * @param numeric $idpadecimiento
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSuffering($idpadecimiento, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomPadecimiento::findByIdOrDenom($denominacion, $idpadecimiento)) {
                $objDomain = new NomPadecimiento();
                $result = $objDomain->modSuffering($idpadecimiento, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta);
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
     * Funcion para elieminar el tipo de color de ojos
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delSuffering($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomPadecimiento');
//            if (is_array($ids)) {
//                $query->whereIn('idpadecimiento', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idpadecimiento = ?', $arrids);
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
             $query->from('NomPadecimiento');
             if (is_array($ids)) {
                 $query->whereIn('idpadecimiento', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idpadecimiento = ?', $arrids);
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
