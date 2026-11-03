<?php

class NomTipomediocontactoModel extends ZendExt_Model
{
    protected $_objtypecontactmedium = null;

    function __construct()
    {
        $this->_objtypecontactmedium = new NomTipomediocontacto();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener la TypeContactMediuma activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveTypeContactMedium($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objtypecontactmedium->getActiveTypeContactMedium($filtro, $limit, $start);
            $tmp->quantity = $this->_objtypecontactmedium->getCantActiveTypeContactMedium($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo medio contacto
     *
     * @param object $objtypecontactmedium
     *
     * @return numeric
     */
    public function addTypeContactMedium($objtypecontactmedium)
    {
        try {
            if (!$this->_objtypecontactmedium->findByIdOrDenomadd($objtypecontactmedium->denominacion, null)) {
                $obj = new NomTipomediocontacto();
                foreach ($objtypecontactmedium as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipomediocontacto;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo medio contacto
     *
     * @param numeric $idtipomediocontacto
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modTypeContactMedium(
        $idtipomediocontacto, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $type, $maxcaracter, $mincaracter
    )
    {
        try {
            //if(!NomTipodocidentidad::findByIdOrDenom($denominacion, $idtipodocidentidad)){
            $objDomain = new NomTipomediocontacto();
            $result = $objDomain->modTypeContactMedium(
                $idtipomediocontacto, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $type, $maxcaracter,
                $mincaracter
            );
            if ($result) {
                return $result;
            } else {
                return false;
            }
            /* }
              else {
                  return false;
              }
    */
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Funcion para elieminar el tipo medio contacto
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delTypeContactMedium($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipomediocontacto');
//            if (is_array($ids)) {
//                $query->whereIn('idtipomediocontacto', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtipomediocontacto = ?', $arrids);
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
            $query->from('NomTipomediocontacto');
            if (is_array($ids)) {
                $query->whereIn('idtipomediocontacto', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idtipomediocontacto = ?', $arrids);
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