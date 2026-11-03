<?php

interface ImportarInterface
{
    /**
     * Prepara los datos importados para guardarlos.
     * @param array $datos
     * @param array $params
     */
    public function sincronizarArray($datos, $params);
    /**
     * Importa los datos de un documento excel.
     * @param array $file
     * @param array $params
     * @return array
     */
    public function importarFichero($file, $params);
}
