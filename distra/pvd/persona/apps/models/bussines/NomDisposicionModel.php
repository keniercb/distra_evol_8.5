<?php
class NomDisposicionModel extends ZendExt_Model
{
    protected $_objDisposicion = null;

    function __construct()
    {
        $this->_objDisposicion = new NomDisposicion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener las disposiciones
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getDisposicionActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objDisposicion->getDisposicionActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objDisposicion->getCantDisposicionActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar disposiciones
     *
     * @param object $objsdisposicion
     *
     * @return numeric
     */
    public function addDisposicion($objDisposicion)
    {
        try {
            $objDomain = new NomDisposicion();
            if (!$objDomain->findByIdOrDenom($objDisposicion->denominacion)) {
                $obj = new NomDisposicion();
                foreach ($objDisposicion as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->iddisposicion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar disposi
     *
     * @param numeric $iddisposicion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modDisposicion($iddisposicion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomDisposicion::findByIdOrDenom($denominacion, $iddisposicion)) {
                $objDomain = new NomDisposicion();
                $result = $objDomain->modDisposicion(
                    $iddisposicion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
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
     * Funcion para eliminar tipo cargo nivel educacional
     * @param array $arrids
     * @return value
     */
    public function delDisposicion($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomDisposicion');
            if (is_numeric($arrids)) {
                $query->where('iddisposicion = ?', $arrids);
            }
            $result = $query->execute();
            if ($result->delete()) {
                $r['exception'] = 0;
            }
            return $r;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                $r['exception'] = 1;
                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }
}