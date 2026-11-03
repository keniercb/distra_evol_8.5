<?php

class NomEventoalimentacionModel extends ZendExt_Model
{
    protected $_objevento = null;

    function __construct()
    {
        $this->_objevento = new NomEventoalimentacion();
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
    public function obtenerEventoAlimentacion($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objevento->obtenerEventoAlimentacion($filtro, $limit, $start);
            $tmp->quantity = $this->_objevento->cantEventoAlimentacion($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de Weara
     *
     * @param object $objwear
     *
     * @return numeric
     */
    public function adicionarEventoAlimentacion($obj)
    {
        try {
            $objDomain = new NomEventoalimentacion();
            if (!$objDomain->existeEvento($obj->denominacion)) {
                $evento = new NomEventoalimentacion();
                foreach ($obj as $k => $v) {
                    $evento->$k = $v;
                }
                $evento->save();

                return $evento->idevento;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de  Weara
     *
     * @param numeric $idprenda
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modificarEventoAlimentacion($idevento, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomEventoalimentacion();
            if (!$obj->existeEvento($denominacion, $idevento)) {
                $evento = $obj->obtenerPorId($idevento);
                $evento->denominacion = $denominacion;
                $evento->abreviatura = $abreviatura;
                $evento->descripcion = $descripcion;
                $evento->fdesde = $fdesde;
                $evento->fhasta = $fhasta;
                $evento->save();

                return true;
            }

            return false;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para elieminar el tipo de  Weara
     *
     * @param array $arrids
     *
     * @return type
     */
    public function eliminarEventoAlimentacion($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEventoalimentacion');
//            if (is_array($ids)) {
//                $query->whereIn('idevento', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idevento = ?', $arrids);
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
             $query->from('NomEventoalimentacion');
             if (is_array($ids)) {
                 $query->whereIn('idevento', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idevento = ?', $arrids);
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