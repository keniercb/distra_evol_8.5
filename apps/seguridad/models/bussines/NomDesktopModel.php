<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class NomDesktopModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertardesktop($desktop)
    {
        $desktop->save();
    }

    function modificardesktop($desktop)
    {
        $desktop->save();
    }

    function eliminardesktop($desktop)
    {
        $desktop->delete();
    }
    
    public static function obtenerModoInicio($idusuario)
    {
        $objMsg = new stdClass();

        $sql = "SELECT modoinicio FROM mod_portal.dat_apariencia a WHERE a.idusuario='{$idusuario}';";

        try {
            $conn = Doctrine_Manager::getInstance()->connection();
            $result = $conn->execute($sql)->fetchAll(Doctrine_Core::FETCH_CLASS);
            if(!$result[0]) {
                $objApariencia = new DatApariencia();
                $objApariencia->idusuario = $idusuario;
                $objApariencia->modoinicio = 2;
                $objApariencia->save();
                $result = $conn->execute($sql)->fetchAll(Doctrine_Core::FETCH_CLASS);
            }
            return $result[0];
        } catch (Exception $e) {
            $objMsg->msgCod = 0;
            $objMsg->msgId = 'ExcObtenerModoInicio';
            $objMsg->msg = $e->getMessage();
            echo json_encode($objMsg);die;
        }
    }

    public function modificarModoInicio($idusuario, $value)
    {
        $objMsg = new stdClass();

        $sql = "UPDATE mod_portal.dat_apariencia a SET modoinicio='{$value}' WHERE idusuario ='{$idusuario}';";
        try {
            $conn = Doctrine_Manager::getInstance()->connection();
            $result = $conn->execute($sql)->fetchAll(Doctrine_Core::FETCH_CLASS);
            return $result[0];
        }catch (Exception $e) {
            $objMsg->msgCod = 0;
            $objMsg->msgId = 'ExcModificarModoInicio';
            $objMsg->msg = $e->getMessage();
            echo json_encode($objMsg);die;
        }
    }



}