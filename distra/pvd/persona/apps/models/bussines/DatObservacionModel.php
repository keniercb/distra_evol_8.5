<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 12:03
 */
class DatObservacionModel extends ZendExt_Model implements IConceptoExport
{
    protected $objDomain;
    protected $response;
    
    function __construct()
    {
        $this->objDomain = new DatObservacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }
    public function getObservacion($idpersona)
    {
        $result = new stdClass();
        try {
            $result->data = DatObservacion::obtenerObservPorPersona($idpersona);
            return $result;
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }


    public function addObservacion($idpersona, $arrObser)
    {

        $result = new stdClass();
        try {
            foreach ($arrObser as $v) {
                $obj = new DatObservacion();
                if( $v->observacion){
                    $obj->observacion = $v->observacion;
                }
                $obj->idpersona = $idpersona;
                $obj->save();
            }
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }

    public function modObservacion($idpersona, $arrObser)
    {
        try {
            foreach ($arrObser as $v) {

                $obj = DatObservacion::getById($v->idobservacion);
                if($idpersona == $obj->idpersona) {
                    $obj->observacion = (empty($v->observacion)) ? null : $v->observacion;
                    $obj->save();
                }
            }
        } catch (Exception $e) {
            $result = new stdClass();
            $result->error = $e;
            return $result;
        }
    }

    public function delObservacion($arrObser)
    {
        $result = new stdClass();
        try {
            foreach ($arrObser as $v) {
                $obser = DatObservacion::getById($v);
                $obser->delete();
            }
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }


    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('do.*')->leftJoin($baseAlias . '.DatObservacion do');
    }
}