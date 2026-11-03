<?php
/*
 *Componente para gestinar los sistemas.
 *
 * @package SIGIS
 * @copyright UCID-ERP Cuba
 * @author Oiner Gomez Baryolo    
 * @author Darien Garc�a Tejo
 * @author Julio Cesar Garc�a Mosquera  
 * @version 1.0-0
 */
class NomTipoTrazaModel extends ZendExt_Model
{
   
    public function NomTipoTrazaModel()
    {
        parent::ZendExt_Model();
    }

    function Insertar($traza)
    {
        $traza->save();
    }

    function Modificar($traza)
    {
        $traza->save();
    }

    function Eliminar($traza)
    {
        $traza->delete();
    }
    function GetAllTipo()
    {
        $tipo=NomTipotraza::selectAlltipo();
        return $tipo;
    }

}
