<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 17/06/16
 * Time: 16:32
 */
class DatIngresoModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * Constructor de la clase
     */
    public function init() {
        parent::ZendExt_Model();
    }

    public function getIngresosByNumid($numid)
    {
        $result = new stdClass();
        try {
            $objing = new DatIngreso();
            $result = $objing->getIngresosByNumid($numid);

            foreach($result as $key=>$v){
                if($v['idfamiliar']){
                    $familar=DatFamiliar::obtenerFamiliarPorIdfamiliar($v['idfamiliar']);
                    $result[$key]['familiar']=$familar[0]['nombre'];
                }
                $objService = new ConfiguracionGeneralService();
                $moneda = $objService->getMoneda($v['idmoneda']);
                $result[$key]['moneda']=$moneda[0]['nombremoneda'];
            }
            return $result;
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }

    public function obtenerIngresoPorPersona($idpersona)
    {
        $result = new stdClass();
        try {
            $result->data = DatIngreso::obtenerIngresoPorPersona($idpersona);

            foreach($result->data as $key=>$v){
                if($v['idfamiliar']){
                    $familar=DatFamiliar::obtenerFamiliarPorIdfamiliar($v['idfamiliar']);
                    $result->data[$key]['familiar']=$familar[0]['nombre'];
                }
                $objService = new ConfiguracionGeneralService();
                $moneda = $objService->getMoneda($v['idmoneda']);
                $result->data[$key]['moneda']=$moneda[0]['nombremoneda'];
            }
            return $result;
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }

    public function adicionarIngreso($idpersona, $arrIngreso)
    {

        $result = new stdClass();
        try {
            foreach ($arrIngreso as $v) {
                $obj = new DatIngreso();
                if( $v->idfamiliar){
                    $obj->idfamiliar = $v->idfamiliar;
                }
                $obj->idtipoingreso = $v->idtipoingreso;
                $obj->idmoneda = $v->idmoneda;
                $obj->cuantia = $v->cuantia;
                $obj->idpersona = $idpersona;
                $obj->save();
            }
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }
    
    public function modificarIngreso($idpersona, $arrIngreso)
    {
        try {
            foreach ($arrIngreso as $v) {
                $obj = DatIngreso::obtenerPorId($v->idingreso);
                if($idpersona == $obj->idpersona) {
                    $obj->idfamiliar = (empty($v->idfamiliar)) ? null : $v->idfamiliar;
                    $obj->idtipoingreso = $v->idtipoingreso;
                    $obj->idmoneda = $v->idmoneda;
                    $obj->cuantia = $v->cuantia;
                    $obj->save();
                }
            }
        } catch (Exception $e) {
            $result = new stdClass();
            $result->error = $e;
            return $result;
        }
    }
    
    public function eliminarFamiliar($arrIngreso)
    {
        $result = new stdClass();
        try {
            foreach ($arrIngreso as $v) {
                $ingreso = DatIngreso::obtenerPorId($v);
                $ingreso->delete();
            }
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('ding.*')->leftJoin($baseAlias . '.DatIngreso ding');
    }
}