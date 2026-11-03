<?php
class CompartimentacionService extends ZendExt_Model
{

    private  $_segusercompModel;

    public function __construct()
    {
        $this->_segusercompModel = new SegUsuariocompartimentacionModel();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getSqlUserCompartimentacionPersona()
    {
        $tipoCompart = $this->getUserTipoCompartimentacion();
        return $tipoCompart->getSqlCompartimentacion();
    }

    private function getUserTipoCompartimentacion()
    {
        $compartimentacion = $this->_segusercompModel->getCompartimentacionesByUser($this->getIdUserLogueado());
        return $this->tipoCompartimentacionFactory($compartimentacion[0]['idcompartimentacion']);
    }

     public function getSqlFromCompartimentacionPersona()
    {
        $tipoCompart = $this->getUserTipoCompartimentacion();
        return $tipoCompart->getFromSqlCompartimentacion();
    }

    private function tipoCompartimentacionFactory($type)
    {
        switch($type){
            case 2:
                return new CompartimentacionDominioModel();
                break;
            case 3:
                return new CompartimentacionGrupoPersonaModel();
                break;
            case 4:
                return new CompartimentacionRegistroModel();
                break;
            default:
                return new CompartimentacionTodasPersonaModel();
        }
    }

    private function getIdUserLogueado()
    {
        $registro = Zend_Registry::getInstance();
        return $registro->session->perfil['idusuario'];
    }
}