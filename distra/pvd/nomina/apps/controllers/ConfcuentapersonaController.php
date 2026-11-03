<?php

/**
 * Controlador para gestionar las plantillas nominales
 *
 * @author Tte. Milena Gainza Rodríguez.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses ConfcuentapersonaModel
 * @copyright UCID
 * @version 1.0
 */
class ConfcuentapersonaController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista.
     */
    public function confcuentapersonaAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    public function obtenerconfiguracionecuentasaperturapersonaAction(){

        //$idestructura = $this->_getParam('idestructura');

        $objModel = new ConfcuentapersonalModel();
        $datos=$objModel->obtenerconfiguracionecuentasaperturapersona();

        echo json_encode(array('datos'=>$datos, 'cantidad'=>count($datos)));
    }

    public function adicionarconfiguracionescuentasaperturapersonaAction(){
        $idcuenta = $this->_getParam('idcuenta');
        $descripcion = $this->_getParam('descripcion');
        $tipoapertura = $this->_getParam('tipoapertura');
        //$idestructura = $this->_getParam('idestructura');

        $objModel = new ConfcuentapersonalModel();
         $result = $objModel->adicionarConfiguracionCuentasAperturaPersona($idcuenta,$descripcion,$tipoapertura);

        if($result){
            $r->codigo = 'ADD-1';
        }else{
             $r->codigo = 'EXISTE';
        }

        echo json_encode($r);
    }

    public function modificarconfiguracionescuentasaperturapersonaAction(){

        $idcuentaaperturapersona = $this->_getParam('idcuentaaperturapersona');
        $idcuenta = $this->_getParam('idcuenta');
        $descripcion = $this->_getParam('descripcion');
       $tipoapertura = $this->_getParam('tipoapertura');
        //$idestructura = $this->_getParam('idestructura');

        $objModel = new ConfcuentapersonalModel();
        $result = $objModel->modificarconfiguracionescuentasaperturapersona($idcuentaaperturapersona,$idcuenta,$descripcion,$tipoapertura);


       // if($result){
            $r->codigo = 'MOD-1';
//        }else{
//            $r->codigo = 'EXISTE';
//        }
        echo json_encode($r);
    }

    public function eliminarconfiguracionescuentasaperturapersonaAction(){
        $idcuentaaperturapersona = $this->_getParam('idcuentaaperturapersona');

        $objModel = new ConfcuentapersonalModel();
        $objModel->eliminarconfiguracionescuentasaperturapersona($idcuentaaperturapersona);

        $r->codigo = 'ADD-1';
        echo json_encode($r);
    }








}
