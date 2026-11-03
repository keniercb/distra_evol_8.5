<?php

/**
 * @name ConfRegistrounicoModel - Clase de logica de negocio para la configuracion de loc conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfConceptosNominaModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function guardarConceptos($ids)
    {
        ConfConceptosNomina::deleteTabla();
        try {
            foreach ($ids as $id) {
                $obj = new ConfConceptosNomina();
                $obj->idconcepto = $id;
                $obj->save();
            }
            $r->success = true;
            return $r;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getSelected(){
        $result= ConfConceptosNomina::getSelected();
        return $result;
    }


}
