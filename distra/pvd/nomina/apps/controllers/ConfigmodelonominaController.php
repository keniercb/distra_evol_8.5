<?php

/**
 * Controlador para configurar los modelos de nómina.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses ConfigModeloNominaModel
 * @copyright UCID
 * @version 1.0
 */
class ConfigmodelonominaController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de configurar los modelos de nóminas.
     */
    public function configmodelonominaAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar la configuración de los modelos de nóminas.
     */
    public function obtenerConfModelosNominaAction() {
        
        //Creando el modelo de negocio de gestion de la configuración de los modelos de nomina.
        $modeloNegocioConfM = new ConfigModeloNominaModel();

        //Arreglo de configuracion de los modelos de nomina.
        $arrayConfM = $modeloNegocioConfM->obtenerConfigModelosNomina();
        //Imprimiendo la configuración de los modelos de nominas.
        echo Zend_Json::encode(array('datos' => $arrayConfM, 'cantidad' => count($arrayConfM)));
    }

    /**
     * Accion utilizada para listar los tipos de pago.
     */
    public function obtenerTiposPagoAction() {
        //Creando el modelo de negocio de gestion de los tipos de pago.
        $modeloNegocioTipoP = new NomTipoPagoModel();

        //Arreglo de tipos de pago.
        $arrayTipoP = $modeloNegocioTipoP->obtenerTodosTiposPago();

        //Imprimiendo los tipos de pago
        echo Zend_Json::encode(array('datos' => $arrayTipoP, 'cantidad' => count($arrayTipoP)));
    }

    /**
     * Accion utilizada para actualizar la configuración de los modelos de nómina.
     */
    public function actualizarModelosNominaAction() {

        //Creando el modelo de negocio de gestion de la configuración de los modelos de nomina.
        $modeloNegocioConfM = new ConfigModeloNominaModel();

        if( $this->_getParam('idconfig') ){
            $modeloNegocioConfM->modificarConfigModeloNomina(    $this->_getParam('idconfig')
                                                                ,$this->_getParam('idtiponomina')
                                                                ,$this->_getParam('idtipopago')
                                                                ,Zend_Json::decode(stripslashes($this->_getParam('categorias'))));
        }else{
            $modeloNegocioConfM->adicionarConfigModeloNomina(    $this->_getParam('idtiponomina')
                                                                ,$this->_getParam('idtipopago')
                                                                ,Zend_Json::decode(stripslashes($this->_getParam('categorias'))));
        }

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para listar las categorías de personas.
     */
    public function obtenerCategoriasPersonaAction() {

        //Obteniendo las categorías de las personas.

		//$ioc = ZendExt_Ioc_Inter::getInstance();//print_r($ioc);die;
      // $arrayCateg = $ioc->persona->getNomCategorias();//print_r($arrayCateg);die;

		//$ioc = ZendExt_Ioc::getInstance();
        //$arrayCateg = $ioc->pvd->getNomCategorias();
       // $arrayCateg = $this->pIntegrator->persona->getNomCategorias();
        //obtiene el nomenclador categorias de persona.
        $arrayCateg = ConfigModeloNominaModel::getNomCategorias();


		/*$arrcat = array();
		foreach($arrayCateg as $i=>$rcat){
		  $arrcat[$i]['idcategoriapersona'] = $rcat['idcategoria'];
		  $arrcat[$i]['denom'] = $rcat['denominacion'];
		}//print_r($arrcat);die;*/
        //Imprimiendo la configuración de los modelos de nominas.
        echo Zend_Json::encode(array('datos' => $arrayCateg, 'cantidad' => $arrayCateg->quantity));
    }

    public function eliminarConfModeloNominaAction(){
        try {
            $idconfig = $this->_getParam('idconfmodelonomina');
            if($idconfig){
                $objModeloDelete = ConfigModeloNomina::obtenerObjConfigModelosNominaDadoId($idconfig);
                $objModeloDelete->delete();
                echo json_encode('ok');
            }else{
                echo json_encode('no-tipo-pago');
            }

        } catch (Exception $e) {
            echo json_encode('mod-nom-en-uso');
        }

    }
}