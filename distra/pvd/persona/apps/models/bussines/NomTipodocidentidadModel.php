<?php

/**
 * Clase del negocio del nomenclador tipo documento de identificacion *
 * Class NomTipodocidentidadModel
 */
class NomTipodocidentidadModel extends ZendExt_Model
{

    protected $_objTipoDocIdentidad = null;

    function __construct()
    {
        $this->_objTipoDocIdentidad = new NomTipodocidentidad();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTipoDocIdentidadActivo($filtro, $limit, $start,$value)
    {
        try {
            $tmp = new StdClass();
            $tmp->data = NomTipodocidentidad::getTipoDocIdentidadActivos($filtro, $limit, $start,$value);
            $tmp->quantity = NomTipodocidentidad::getCantTipoDocIdentidadActivos($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addDoctypeidentity($objTipoDocIdentidad)
    {
        try {
            if (!$this->_objTipoDocIdentidad->findByIdOrDenom($objTipoDocIdentidad->denominacion, null)) {
                $obj = new NomTipodocidentidad();
                foreach ($objTipoDocIdentidad as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipodocidentidad;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar un tipo de documento de indentidad
     *
     * @param type $idtipodocidentidad
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @throws Exception
     * @return type
     */
    public function modDoctypeidentity(
        $idtipodocidentidad, $denominacion, $abr, $descripcion, $fdesde, $fhasta, $type, $maxcaracter, $mincaracter
    )
    {
        try {
            //if(!NomTipodocidentidad::findByIdOrDenom($denominacion, $idtipodocidentidad)){
            $objDomain = new NomTipodocidentidad();
            $result = $objDomain->modDoctypeidentity(
                $idtipodocidentidad, $denominacion, $abr, $descripcion, $fdesde, $fhasta, $type, $maxcaracter, $mincaracter
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
     * funcion para eliminar tipo de documentos de identidad
     *
     * @param array $arrids
     *
     * @return \Doctrine_Collection|\StdClass|string
     * @throws Exception
     */
    public function delDoctypeidentity($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipodocidentidad');
//            if (is_array($ids)) {
//                $query->whereIn('idtipodocidentidad', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtipodocidentidad = ?', $arrids);
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

    public function getDatosNomTipoDocById($idtipodocidentidad)
    {
        try {
            return $this->_objTipoDocIdentidad->getDatosNomTipoDocById($idtipodocidentidad);
        } catch (Exception $e) {
            throw $e;
        }
    }
    //---------------------------------------------------------------------------------------------------//
    //                     NUEVOS DESARROLLOS APLICANDO ESTANDARES Y BUENAS PRACTICAS                    //
    //---------------------------------------------------------------------------------------------------//
    public function obtenerTipoDocIdActivo($filtro, $limit, $start)
    {
        try {
            $tmp = new stdClass();
            $tmp->data = NomTipodocidentidad::obtenerTipoDocIdActivo($filtro, $limit, $start);
            $tmp->quantity = NomTipodocidentidad::cantTipoDocIdActivo($filtro);
            print_r($tmp);
            die;

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }
}
