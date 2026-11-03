<?php

/**
 * @name ConfRegistrounicoModel - Clase de logica de negocio para la configuracion del registro único.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfRegistrounicoModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function marcarUnico($ids)
    {
        try {
            foreach ($ids as $id) {
                $objRegistroUnico = new ConfRegistrounico();
                $objRegistro = $objRegistroUnico->obtenerPorId($id);
                $objRegistro->unico = 1;
                $objRegistro->save(); 
            }      
            $r->success = true;
            return $r;
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function marcarNoUnico($ids)
    {
        try {
            foreach ($ids as $id) {
                $objRegistroUnico = new ConfRegistrounico();
                $objRegistro = $objRegistroUnico->obtenerPorId($id);
                $objRegistro->unico = 2;
                $objRegistro->save();
            }                  
            $r->success = true;
            return $r;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getLlaves()
    {
        try {
            $sql = "SELECT * FROM mod_rrhhmaestro.conf_registrounico ORDER BY idregistrounico";
            $query = Doctrine_Manager::getInstance();
            //print_r($query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC));die;
            return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function getCantLlaves()
    {
        try {
            $sql = "SELECT COUNT(idregistrounico) as cantidad FROM mod_rrhhmaestro.conf_registrounico";
            $query = Doctrine_Manager::getInstance();
            $cantidad = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            return $cantidad[0]['cantidad'];
        } catch (Exception $e) {
            throw $e;
        }
    }   

}
