<?php

/**
 * @package    Logística
 * @subpackage Útiles
 * @author     Jorge Luis Cuellar Mondeja
 * @version    5.0-0
 */
class NomCunnoService
{

    public function GetTodosIdesCunnos()
    {
        return NomCunno::GetTodosIdesCunnos();
    }

    public function eliminarImagen($idimagen)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $cfg = Doctrine::getTable('CfgGeneral')->find($global->Estructura->idestructura);
        if ($cfg->idcunno == $idimagen) {
            $cfg->idcunno = null;
        }
        $cfg->save();
        return NomCunno::eliminarImagen($idimagen);
    }

}