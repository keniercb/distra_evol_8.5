<?php

/**
 * Controlador para configurar las variables globales a los diferentes niveles.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses ConfigVariableGlobalValorModel
 * @copyright UCID
 * @version 1.0
 */
class ConfigvariableglobalController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de configurar las variables globales.
     */
    public function configvariableglobalAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar las variables globales.
     */
    public function obtenerConfigVariablesGlobalesAction() {

        //Creando el modelo de negocio de gestion de la configuración de las variables globales.
        $modeloNegocioConfVarGlob = new ConfigVariableGlobalValorModel();
        
        $domainVariableGlobales = new NomVariableGlobal();
        
        $arrResult = array();
        
        if(isset($_REQUEST['identidad'])){

            //Obteniendo el listado de variables globales a nivel de entidad.
            $arrConfigVar = $modeloNegocioConfVarGlob->obtenerConfVarGlobalNivelEntidad
              ($this->_getParam('identidad'));
            foreach($arrConfigVar as $i=>$v){
            $lugaresDecimales = $domainVariableGlobales->obtenerLugaresDecimalesXIdVariable($v['idvariableglobal']);
           
            $valor = $v['valor'];
            $format = $this->redondeado($valor,$lugaresDecimales);
            $arrResult[$i] = $v;
            $arrResult[$i]['valor'] = $format;
            }
        }elseif(isset($_REQUEST['idcargo'])) {

            //Obteniendo el listado de variables globales a nivel de cargo.
            $arrConfigVar = $modeloNegocioConfVarGlob->obtenerConfVarGlobalNivelCargo($this->_getParam('idcargo'));
			foreach($arrConfigVar as $i=>$v){
            $lugaresDecimales = $domainVariableGlobales->obtenerLugaresDecimalesXIdVariable($v['idvariableglobal']);
           
            $valor = $v['valor'];
            $format = $this->redondeado($valor,$lugaresDecimales);
            $arrResult[$i] = $v;
            $arrResult[$i]['valor'] = $format;
            }
        }else{

            //Obteniendo el listado de variables globales a nivel de sistema.
            $arrConfigVar = $modeloNegocioConfVarGlob->obtenerConfVarGlobalNivelSistema();
            foreach($arrConfigVar as $i=>$v){
            $lugaresDecimales = $domainVariableGlobales->obtenerLugaresDecimalesXIdVariable($v['idvariableglobal']);
           
            $valor = $v['valor'];
            $format = $this->redondeado($valor,$lugaresDecimales);
            $arrResult[$i] = $v;
            $arrResult[$i]['valor'] = $format;
            }
        }
        
        //Imprimiendo la coonfiguración de las variables globales.
        echo Zend_Json::encode(array('datos' => $arrResult, 'cantidad' => count($arrResult)));
    }
    
   public function redondeado ($numero, $decimales) {
        $numeroredond = number_format($numero, 8, '.', '');
     return $numeroredond;
   } 

    /**
     * Accion para guardar la configuración de las variables globales.
     */
    public function guardarConfigVariablesGlobalesAction() {
 
        //Creando el modelo de negocio de la configuración de las variables globales.
        $modeloNegocioConfVarGlob = new ConfigVariableGlobalValorModel();

        //Guardando la configuración.
        $modeloNegocioConfVarGlob->guardarConfigVarGlobal(
            $this->_getParam('identidad'),
            $this->_getParam('idcargo'),
            Zend_Json::decode(stripslashes($this->_getParam('valoresConfig')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }
}