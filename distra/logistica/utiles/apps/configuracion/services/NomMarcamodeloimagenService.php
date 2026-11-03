<?php

/**
 * @autor Javier Martin Rojas
 * @class Configuración nomenclador marca/modelo
 */
class NomMarcamodeloimagenService
{

    public function GetTodosIdesImagenes($idmarca)
    {
        return NomMarcamodeloimagen::GetTodosIdesImagenes($idmarca);
    }

    public function GetTodosIdesAllImagenes()
    {
        return NomMarcamodeloimagen::GetTodosIdesAllImagenes();
    }

    public function eliminarImagen($idmarca, $idimagen)
    {
        return NomMarcamodeloimagen::eliminarImagen($idmarca, $idimagen);
    }

}
