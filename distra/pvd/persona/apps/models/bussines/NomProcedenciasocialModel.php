<?php

class NomProcedenciasocialModel extends ZendExt_Model
{

    //$objhaircolor=> objeto  SocialOriginas
    protected $_objsocialorigin = null;

    function __construct()
    {
        $this->_objsocialorigin = new NomProcedenciasocial();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener la SocialOrigina activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveSocialOrigin($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objsocialorigin->getActiveSocialOrigin($filtro, $limit, $start);
            $tmp->quantity = $this->_objsocialorigin->getCantActiveSocialOrigin($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de SocialOrigina
     *
     * @param object $objsocialorigin
     *
     * @return numeric
     */
    public function addSocialOrigin($objsocialorigin)
    {
        try {
            $objDomain = new NomProcedenciasocial();
            if (!$objDomain->findByIdOrDenomadd($objsocialorigin->denominacion)) {
                $obj = new NomProcedenciasocial();
                foreach ($objsocialorigin as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idprocedenciasocial;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de  SocialOrigina
     *
     * @param numeric $idprocedenciasocial
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSocialOrigin($idprocedenciasocial, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomProcedenciasocial::findByIdOrDenom($denominacion, $idprocedenciasocial)) {
                $objDomain = new NomProcedenciasocial();
                $result = $objDomain->modSocialOrigin(
                    $idprocedenciasocial, $denominacion, $descripcion, $fdesde, $fhasta
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
     * Funcion para elieminar el tipo de  SocialOrigina
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delSocialOrigin($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomProcedenciasocial');
//            if (is_array($ids)) {
//                $query->whereIn('idprocedenciasocial', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idprocedenciasocial = ?', $arrids);
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
            $query->from('NomProcedenciasocial');
            if (is_array($ids)) {
                $query->whereIn('idprocedenciasocial', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idprocedenciasocial = ?', $arrids);
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

