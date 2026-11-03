<?php
class FicheroperacionModel extends ZendExt_Model
{
    public static function subirArchivoGrande($nombreOriginal, $nombreTrozo, $archivo = 'archivo'){
        $obj = new stdClass();
        $obj->msgCod = 1;
        $fichero = $_FILES[$archivo];
        $nombreTemporal = $fichero["tmp_name"];
        $size = $fichero["size"];
        if($fichero['error'] == 1){
            $obj->msgCod = 0;
            $obj->msgId = 'ErrorSubiendoTrozo';
            return $obj;
        }

        header("Expires: -1");
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . "GMT");
        header("Content-Transfer-Encoding: binary");
        header('Content-Length: ' . $size);
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check = 0, pre-check=0");
        header("Pragma: no-cache");
        try{
            $_directorioFicheroTrozo = "/tmp/{$nombreTrozo}";
            $_directorioFicheroDefinitivo = "/tmp/{$nombreOriginal}";
            move_uploaded_file($nombreTemporal, $_directorioFicheroTrozo);
            $obj->numeroTrozo = self::agregar_trozo_a_original($_directorioFicheroDefinitivo, $_directorioFicheroTrozo);
        }catch (Exception $e){
            throw new ZendExt_Exception("SEGFICHEROPERACION01");
        }
        return $obj;
    }

    public function agregar_trozo_a_original($nombreDefinitivo, $_directorioFicheroTrozo) {
        $nombreTrozo = basename($_directorioFicheroTrozo);

        list($idunico, $numeroTrozo) = explode("_",$nombreTrozo);

        if ($numeroTrozo == "1"){
            unlink($nombreDefinitivo);
        }

        $archivoFinal = fopen($nombreDefinitivo, "ab");
        $trozo = fopen($_directorioFicheroTrozo, "rb");

        while ($buff = fread($trozo, 1000000)) {
            fwrite($archivoFinal, $buff);
        }
        unlink($_directorioFicheroTrozo);
        fclose($archivoFinal);
        return $numeroTrozo;
    }

    public static function descomprimirFichero($nombreFichero)
    {
        set_time_limit(0);
        $objMsg = new stdClass();
        $objMsg->msgCod = 1;
        $comando = "cd /tmp && unzip -o {$nombreFichero}";
        exec($comando, $datos, $returnVar);
        if (0 != $returnVar) {
            throw new ZendExt_Exception("SEGFICHEROPERACION02");
        }
        return $objMsg;
    }
}
