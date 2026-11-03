<?php

class NomNormaModel extends ZendExt_Model
{
    //$objhaircolor=> objeto  normas
    protected $_objnorm = null;

    function __construct()
    {
        $this->_objnorm = new NomNorma();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener la norma activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveNorm($filtro, $limit, $start,$value)
    {
        try {
            $data = $this->_objnorm->getActiveNorm($value, $filtro, $limit, $start,$value);

            foreach($data as $key=>$dat){
                $tmp->data[$key]['fdesde']=$dat['fdesde'];
                $tmp->data[$key]['fhasta']=$dat['fhasta'];
                $tmp->data[$key]['denominacion']=$dat['denominacion'];
                $tmp->data[$key]['abreviatura'] = $dat['abreviatura'];
                $tmp->data[$key]['idnorma']=$dat['idnorma'];
                $tmp->data[$key]['idnomenclador'] = $dat['idnorma'];
                $tmp->data[$key]['descripcion']=$dat['descripcion'];
                if($dat['Confprendanorma']){
                    foreach($dat['Confprendanorma'] as $conf){
                        $tmp->data[$key]['idprenda']=$conf['idprenda'];
                        $tmp->data[$key]['idtalla']=$conf['idtalla'];
                    }

                }
            }
            $tmp->quantity = $this->_objnorm->getCantActiveNorm($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de norma
     *
     * @param object $_objnorm
     *
     * @return numeric
     */
    public function addNorm($_objnorm)
    {
        try {
            $objDomain = new NomNorma();
            if (!$objDomain->findByIdOrDenomadd($_objnorm->denominacion)) {
                $obj = new NomNorma();
                foreach ($_objnorm as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idnorma;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de  norma
     *
     * @param numeric $idnorma
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modNorm($idnorma, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomNorma::findByIdOrDenom($denominacion, $idnorma)) {
                $objDomain = new NomNorma();
                $result = $objDomain->modNorm($idnorma, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta);
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
     * Funcion para elieminar el tipo de  norma
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delNorm($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNorma');
            if (is_numeric($arrids)) {
                $query->where('idnorma = ?', $arrids);
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
    }

}

