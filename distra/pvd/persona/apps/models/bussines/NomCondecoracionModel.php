<?php

class NomCondecoracionModel extends ZendExt_Model
{

    protected $_objCondecoration = null;

    function __construct()
    {
        $this->_objCondecoration = new NomCondecoracion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $filtro
     * @param $limit
     * @param $start
     * @param $idtipocondecoracion
     *
     * @return mixed
     * @throws Exception
     */
    public function getCondecorationActive($filtro, $limit, $start, $idtipocondecoracion,$value)
    {

        try {
            $tmp->data = $this->_objCondecoration->getCondecorationActive($filtro, $limit, $start, $idtipocondecoracion,$value);
            $tmp->quantity =  $this->_objCondecoration->getCantCondecorationActive(
                $filtro, $idtipocondecoracion
            ) ;

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }


    /**
     * @param $objCondecoration
     *
     * @return bool|mixed
     */
    public function addCondecoration($objCondecoration)
    {
        try {
            $objDomain = new NomCondecoracion();
            if (!$objDomain->findByIdOrDenom(
                $objCondecoration->denominacion, null, $objCondecoration->idtipocondecoracion
            )
            ) {
                $obj = new NomCondecoracion();
                foreach ($objCondecoration as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcondecoracion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * @param $idcondecoracion
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipocondecoracion
     *
     * @return bool
     */
    public function modCondecoration(
        $idcondecoracion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipocondecoracion
    )
    {
        try {
            $result = $this->_objCondecoration->modCondecoration(
                $idcondecoracion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipocondecoracion
            );
            if ($result) {
                return $result;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * @param $arrids
     *
     * @return Doctrine_Collection|string
     */
    public function delCondecoration($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCondecoracion');
//            if (is_array($ids)) {
//                $query->whereIn('idcondecoracion', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idcondecoracion = ?', $arrids);
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
        /*try {
            $query = Doctrine_Query::create();
            $query->from('NomCondecoracion');
            if (is_array($arrids)) {
                $query->whereIn('idcondecoracion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcondecoracion = ?', $arrids);
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

