<?php

class ConfiguraciongeneralController extends ZendExt_Controller_Secure
{

    private $model, $servicionConfGnrl;

    function init()
    {
        parent::init();

        $this->model = new ConfiguraciongeneralModel();
        $this->servicionConfGnrl = ServiciosConfiguracionGeneralHelper::__init();
    }

    function configuraciongeneralAction()
    {
        $this->render();
    }

    /* public function getidlogoidcunnoAction(){
      $idestructura = $this->global->Estructura->idestructura;
      echo json_encode(array('datos' => $this->model
     * ->CargarIdLogoIdCunno($idestructura)));
      } */

    public function getlogoAction()
    {
        $idimagen = $_GET['idimagen'];
        $objComunImagen= $this->servicionConfGnrl->obtenerObjClassComunImangenModel();
        $objComunImagen->obtenerImagenDb(
            $idimagen, 'mod_logistica.nom_logo',
            'idlogo'
        );
    }

    public function getcunnoAction()
    {
        $idimagen = $_GET['idimagen'];
        $objComunImagen= $this->servicionConfGnrl->obtenerObjClassComunImangenModel();
        $objComunImagen->obtenerImagenDb(
            $idimagen, 'mod_logistica.nom_cunno',
            'idcunno'
        );
    }

    public function guardarlogoAction()
    {

        $imagen = $_FILES["foto"]["tmp_name"];
        $objComunImagen= $this->servicionConfGnrl->obtenerObjClassComunImangenModel();
        $idimagen = $objComunImagen->insertarImagenDb(
            $imagen,
            'mod_logistica.nom_logo', 'imagen', array(), 'idlogo',
            'mod_logistica.sec_nomlogo', true
        );

        echo json_encode(array('idimagen' => $idimagen));
    }

    public function guardarcunnoAction()
    {

        $imagen = $_FILES["foto"]["tmp_name"];
        $objComunImagen= $this->servicionConfGnrl->obtenerObjClassComunImangenModel();
        $idimagen = $objComunImagen->insertarImagenDb(
            $imagen,
            'mod_logistica.nom_cunno', 'imagen', array(), 'idcunno',
            'mod_logistica.sec_nomcunno', true
        );

        echo json_encode(array('idimagen' => $idimagen));
    }

    /*
     * Eliminar imágenes asociadas a un activo
     */

    public function eliminarimagenAction()
    {
        $idimagen = $this->_request->getPost('idimagen');

        if ($this->_request->getPost('origen') == 'logo') {
            $eliminada = NomLogoService::eliminarImagen($idimagen);
        } else {
            $eliminada = NomCunnoService::eliminarImagen($idimagen);
        }


        echo json_encode(array('success' => $eliminada));
    }

    public function cambiarlogoAction($parametros)
    {
        $parametros = json_decode(
            stripcslashes($this->_request->getPost('parametros'))
        );
        $this->model->CambiarLogotipo(
            $parametros, 'logo',
            'mod_logistica.nom_logo'
        );
        echo json_encode(array('success' => true));
    }

    public function cambiarcunnoAction($parametros)
    {
        $parametros = json_decode(
            stripcslashes($this->_request->getPost('parametros'))
        );
        $this->model->CambiarLogotipo(
            $parametros, 'cunno',
            'mod_logistica.nom_cunno'
        );
        echo json_encode(array('success' => true));
    }

    public function gettodosidslogoAction()
    {
        echo json_encode(
            array('arrIdesImagenes' => $this->model->CargarIdsLogotipos('logo'))
        );
    }

    public function gettodosidscunnoAction()
    {
        echo json_encode(
            array('arrIdesImagenes' => $this->model->CargarIdsLogotipos(
                'cunno'
            ))
        );
    }

    public function cargarImagenAction()
    {

        $entidad = $this->global->Estructura->idestructura;
        $res = $this->model->getConfiguracion($entidad);
        echo(json_encode($res[0]));
    }

}
