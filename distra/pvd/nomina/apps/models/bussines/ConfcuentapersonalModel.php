<?php

/**
 * Modelo de negocio para gestionar las plantillas nominales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses ConfPlantillaNominal, Entidad plantilla nominal (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class ConfcuentapersonalModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function ConfcuentapersonalModel() {
        parent::ZendExt_Model();
    }



    public function obtenerconfiguracionecuentasaperturapersona(){

        $objEscConf = new ConfCuentasAperturaPersona();
        //Insertando los datos de la escala tarifa.
        $datos=$objEscConf->obtenerconfiguracionecuentasaperturapersona();
        foreach($datos as $k=>$v){
            $datos[$k]['denom'] = $this->integrator->contabilidad->obtenerCuentaPorId($v['idcuenta'])->text;
        }

        return $datos;

    }

    public function adicionarConfiguracionCuentasAperturaPersona($idcuenta,$descripcion,$tipoapertura){

        $objEscConf = new ConfCuentasAperturaPersona();
        //Insertando los datos de la escala tarifa.
        $existe=ConfCuentasAperturaPersona::existecuentaaperturapersona($idcuenta);
        if(count($existe)==0){
            $objEscConf->idcuenta =$idcuenta;
            $objEscConf->tipoapertura =$tipoapertura;
//            $objEscConf->idestructura = $idestructura;
            $objEscConf->descripcion = $descripcion;
            $objEscConf->save();
            return true;
        }else {
            return false;
        }





    }

    public function modificarconfiguracionescuentasaperturapersona($idcuentaaperturapersona,$idcuenta,$descripcion,$tipoapertura){

        $objEscConf = ConfCuentasAperturaPersona::obtenerConfCuentasAperturaPersona($idcuentaaperturapersona);
        //Insertando los datos de la escala tarifa.
        $existe=ConfCuentasAperturaPersona::existecuentaaperturapersona($idcuenta);
        //if(count($existe)==0){
            $objEscConf->idcuenta =$idcuenta;
           $objEscConf->tipoapertura =$tipoapertura;
//            $objEscConf->idestructura = $idestructura;
            $objEscConf->descripcion = $descripcion;

        $objEscConf->save();

            return true;
//        }else {
//            return false;
//        }

    }

    public function eliminarconfiguracionescuentasaperturapersona($idcuentaaperturapersona){

        $objEscConf = ConfCuentasAperturaPersona::obtenerConfCuentasAperturaPersona($idcuentaaperturapersona);
        //Insertando los datos de la escala tarifa.

        $objEscConf->delete();


        return true;

    }


}