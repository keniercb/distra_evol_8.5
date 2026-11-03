<?php

/**
 * Modelo de negocio para gestionar configuración de las variables globales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Modelo de negocio
 * @uses ConfigVariableGlobalValor, Entidad valor de variables globales (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class ConfigVariableGlobalValorModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function ConfigVariableGlobalValorModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de la variables configuradas a nivel de sistema.
     * 
     * @return array Listado de variables configuradas a nivel de sistema.
     */
    public function obtenerConfVarGlobalNivelSistema() {

        //Retornando el listado de variables configuradas a nivel de sistema.
        return ConfigVariableGlobalValor::obtenerConfigVarGlobales(1);
    }

    /**
     * Obtener un listado de la variables configuradas a nivel de entidad.
     * 
     * @param int $identidad   Identificador de la entidad.
     * @return array Listado de variables configuradas a nivel de entidad.
     */
    public function obtenerConfVarGlobalNivelEntidad($identidad) {
        //Retornando el listado de variables configuradas a nivel de entidad.
        return ConfigVariableGlobalValor::obtenerConfigVarGlobalesEntidad(2, $identidad);
    }

    /**
     * Obtener un listado de la variables configuradas a nivel de cargo.
     * 
     * @param int $idcargo   Identificador del cargo.
     * @return array Listado de variables configuradas a nivel de cargo.
     */
    public function obtenerConfVarGlobalNivelCargo($idcargo) {

        //Retornando el listado de variables configuradas a nivel de cargo.
        return ConfigVariableGlobalValor::obtenerConfigVarGlobalesCargo(3, $idcargo);
    }

    /**
     * Guardar la configuración de las variables configuradas.
     *
     * @param int $identidad     Identificador de la entidad.
     * @param int $idcargo       Identificador del cargo.
     * @param array $configvar   Arreglo de configuración de las variables globales.
     */
    public function guardarConfigVarGlobal($identidad, $idcargo, $configvar){
        
        //Se recorre el arreglo de configuración y se insertan o eliminan los datos especificados.
        foreach ($configvar as $key => $value) {

            if($value['idvariableglobalvalor']){
                if($value['valor']){
                    $this->modificarConfigVariableGlobal($value['idvariableglobalvalor'], $value['idvariableglobal'], $value['valor'], $identidad, $idcargo);
                }else{
                    $this->eliminarConfigDadoIdConfig($value['idvariableglobalvalor']);
                }   
            }else{
                if($value['valor']){
                    $this->adiconarConfigVariableGlobale($value['idvariableglobal'], $value['valor'], $identidad, $idcargo);
                }  
            }
                
        }
    }

    /**
     * Insertar una configuración de variable global.
     * 
     * @param int $idvar         Identificador de la variable global.
     * @param int $valor         Valor de la configuración.
     * @param int $identidad     Identificador de la entidad.
     * @param int $idcargo       Identificador del cargo.
     */
    public function adiconarConfigVariableGlobale($idvar, $valor, $identidad, $idcargo) {

        //Se crea el objeto de la configuración.
        $objConfig = new ConfigVariableGlobalValor();

        //Insertando los datos.
        $objConfig->idvariableglobal = $idvar;
        $objConfig->valor = $valor;
        $objConfig->identidad = ($identidad)?$identidad:null;
        $objConfig->idcargo = ($idcargo)?$idcargo:null;
        
        //Guardando los datos.
        $objConfig->save();
    }

    /**
     * Modificar una configuración de variable global.
     * 
     * @param int $idconf        Identificador de la configuración.
     * @param int $idvar         Identificador de la variable global.
     * @param int $valor         Valor de la configuración.
     * @param int $identidad     Identificador de la entidad.
     * @param int $idcargo       Identificador del cargo.
     */
    public function modificarConfigVariableGlobal($idconf, $idvar, $valor, $identidad, $idcargo) {

        //Obteniendo la configuración a modificar.
        $objConfig = ConfigVariableGlobalValor::obtenerObjConfigVarGlobalDadoId($idconf);

        //Modificando los datos de la configuración.
        $objConfig->idvariableglobal = $idvar;
        $objConfig->valor = $valor;
        $objConfig->identidad = ($identidad)?$identidad:null;
        $objConfig->idcargo = ($idcargo)?$idcargo:null;
        
        //Guardando los datos.
        $objConfig->save();
    }

    /**
     * Eliminar una configuración de variable global.
     * 
     * @param int $idconfig    Identificador de la configuración de las variables globales.
     */
    public function eliminarConfigDadoIdConfig($idconfig) {

        //Obteniendo la configuración a eliminar.
        $objConfig = ConfigVariableGlobalValor::obtenerObjConfigVarGlobalDadoId($idconfig);
            
        //Borrando la configuración.
        $objConfig->delete();
    }
	
	public function obtenerVariablesGlobales($identidad, $arrCargos) {
	  $objCVG = new ConfigVariableGlobalValor();
        $arrVG = $objCVG->obtenerConfValoresVariablesGlobales($identidad, $arrCargos);  
        $conf = null;
        foreach ($arrVG as $i => $c) {
            if ($c['idnivelconfiguracion'] == 1) {
                $conf->sistema[$c['idvariableglobal']] = $c['valor'];
            } else if ($c['idnivelconfiguracion'] == 2) {
                $conf->entidad[$c['idvariableglobal']] = $c['valor'];
            } else if ($c['idnivelconfiguracion'] == 3) {
                $conf->cargo[$c['idvariableglobal']] = $c['valor'];
            }
        }
        return $conf;
	        
    }
}