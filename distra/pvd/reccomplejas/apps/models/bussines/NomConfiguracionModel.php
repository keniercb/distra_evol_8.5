<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 20/09/2017
 * Time: 15:38
 */
class NomConfiguracionModel extends ZendExt_Model
{
    public function NomConfiguracionModel() {
        parent::ZendExt_Model();
    }

    public function eliminarConfiguracion($idconfiguracion) {
        try {
            $nconfig = new NomConfiguracion();
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $conn->fetchAll("DELETE FROM mod_reccomplejas2.nom_configuracion WHERE idconfiguracion LIKE '$idconfiguracion'");
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}