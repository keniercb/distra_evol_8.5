<?php

class NomTallaModel extends ZendExt_Model
{

    //$objhaircolor=> objeto  Sizeas
    protected $_objsize = null;

    function __construct()
    {
        $this->_objsize = new NomTalla();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener la Sizea activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveSize($filtro, $limit, $start,$value)
    {
        try {
            $data = $this->_objsize->getActiveSize($filtro, $limit, $start,$value);
            $i=0;
            foreach($data as $dat){

                $tmp->data[$i]['fdesde']=$dat['fdesde'];
                $tmp->data[$i]['fhasta']=$dat['fhasta'];
                $tmp->data[$i]['denominacion']=$dat['denominacion'];
                $tmp->data[$i]['abreviatura'] = $dat['abreviatura'];
                $tmp->data[$i]['idtalla']=$dat['idtalla'];
                $tmp->data[$i]['idnomenclador'] = $dat['idtalla'];
                $tmp->data[$i]['descripcion']=$dat['descripcion'];
                if($dat['Confprendanorma']){
                    $tmp->data[$i]['idprenda'] = $dat['Confprendanorma'][0]['idprenda'];
                    $tmp->data[$i]['idnorma'] = $dat['Confprendanorma'][0]['idnorma'];

                }
                $i++;
                    if (count($dat['Confprendanorma'] > 1)) {

                            for ($a = 1; $a < count($dat['Confprendanorma']); $a++) {
                                $tmp->data[$i]['fdesde'] = $dat['fdesde'];
                                $tmp->data[$i]['fhasta'] = $dat['fhasta'];
                                $tmp->data[$i]['denominacion'] = $dat['denominacion'];
                                $tmp->data[$i]['abreviatura'] = $dat['abreviatura'];
                                $tmp->data[$i]['idtalla'] = $dat['idtalla'];
                                $tmp->data[$i]['idnomenclador'] = $dat['idtalla'];
                                $tmp->data[$i]['descripcion'] = $dat['descripcion'];

                                $tmp->data[$i]['idprenda'] = $dat['Confprendanorma'][$a]['idprenda'];
                                $tmp->data[$i]['idnorma'] = $dat['Confprendanorma'][$a]['idnorma'];
                                $i++;
                            }

                    }

            }
            $tmp->quantity = $this->_objsize->getCantActiveSize($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de Sizea
     *
     * @param object $objsize
     *
     * @return numeric
     */
    public function addSize($objsize)
    {
        try {
            $objDomain = new NomTalla();
            if (!$objDomain->findByIdOrDenomadd($objsize->denominacion)) {
                $obj = new NomTalla();
                foreach ($objsize as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtalla;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de  Sizea
     *
     * @param numeric $idtalla
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSize($idtalla, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomTalla::findByIdOrDenom($denominacion, $idtalla)) {
                $objDomain = new NomTalla();
                $result = $objDomain->modSize($idtalla, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta);
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
     * Funcion para elieminar el tipo de  Sizea
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delSize($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTalla');
//            if (is_array($ids)) {
//                $query->whereIn('idtalla', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtalla = ?', $arrids);
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
            $query->from('NomTalla');
            if (is_array($ids)) {
                $query->whereIn('idtalla', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idtalla = ?', $arrids);
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

