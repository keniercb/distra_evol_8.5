<?php
class PlantillaService extends ZendExt_Model
{
    public function getContenidoByIdPlantilla($idplantilla, $idpersona)
    {
        $datos->contenido = DatPlantilladocModel::getContenidoByIdPlantilla($idplantilla, $idpersona);
        $datos->configuraciones = ConfPlantilladocrecModel::getConfiguracionesByIdPlantilla($idplantilla);
        return $datos;
    }

    public function getContenidoReemplazado($idpersona, $idplantilla)
    {
        $datos->contenido = Exportarplantilla::getContenido($idpersona, $idplantilla);
        return $datos;
    }
	
	 /**
     * @return string
     */
    function mostrarIUPlantilla()
    {
        $phtml = "<script type='text/javascript' src='/pvd/maestro/documentos/views/js/plantillaexp/plantillaexp.js'></script>";
        return $phtml;
    }
}
