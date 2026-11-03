<?php
class ImportarexcelService extends ZendExt_Model
{
    /**
     * @method obtenerConfImportarExcel - Implementacion del servicio que obtiene la configuración para importar excel.
     * @param $iddominio - Identificador del dominio del módulo.
	 * @param $identidad - Identificador de la entidad que creó la configuración.
	 * @param $idselemento - Arreglo de identificadores de los elementos.
     * @return Array - Arreglo con la configuración para importar el excel.
     * @author Yaricel Guerra Velázquez.
     */
    public function obtenerConfImportarExcel($iddominio, $identidad, array $idselementos)
    {
        return ConfImportarexcelModel::obtenerConfImportarExcel($iddominio, $identidad, $idselementos);
    }
}
