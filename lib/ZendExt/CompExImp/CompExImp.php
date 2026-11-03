<?php
class ZendExt_CompExImp_CompExImp
{
    public function __construct()
    {
    }

    public function exportar($obj, $formato, $url = '')
    {
        $exp = new ZendExt_CompExImp_Exportacion_Exportador();
        $clase = $this->parsear($formato);
        return $exp->exportar($obj, $clase, $url);
    }

    public function importar($ident, $formato)
    {
        $exp = new ZendExt_CompExImp_Importacion_Importador();
        $clase = $this->parsear($formato);
        return $exp->importar($ident, $clase);
    }

    function parsear($formato)
    {
        $xml = simplexml_load_file(
            dirname(__FILE__) . DIRECTORY_SEPARATOR . 'Formatos' . DIRECTORY_SEPARATOR . 'Formatos.xml'
        );
        $clase = null;
        foreach ($xml->File->tipo as $tipo) {
            $strtipo = ( string )$tipo ['name'];
            if ($strtipo == $formato) {
                $clase = $tipo;
            }
        }
        if ($clase == null) {
            foreach ($xml->BD->tipo as $tipo) {
                $tipo = ( string )$tipo ['name'];
                if ($strtipo == $formato) {
                    $clase = $tipo;
                }
            }
        }
        return $clase;
    }
}
