<?php
/**
 * Marco de Trabajo ZEOLIDES.
 * User: jmzaldivar
 * Date: 19/06/14
 * Email: jmzaldivar"xetid.cu
 * Autor: Jose Miguel Zaldivar Alfonseca
 */

class ZendExt_Adapters_Lib {
 /*
  * @descripcion: importar libreria esternas
  * @parametros $argNombreLib "Nombre de la libreria", $argVersioLib "Version de la Libreria".
  *             $argNombreFichero "Nombre del fichero a incluir"
  * @ZendExt_Exception
  * resultado void
  * */
    public static function incluirLibreria( $argNombreLib, $argVersioLib, $argNombreFichero = null){

        if($argNombreFichero == null){
            $argNombreFichero = $argNombreLib;
        }

        $dirAdacter = dirname(__FILE__).'/../../Adapters';


        if($argNombreLib && $argVersioLib){

            $dirLib = $dirAdacter.'/'.$argNombreLib;
            
            if(is_dir($dirLib)){
                $dirVersion = $dirLib.'/'.$argVersioLib.'/';
                 if(is_dir($dirVersion)){
                        self::getDireccionFichero($dirVersion,$argNombreFichero.'.php',$includeDir);
                     if($includeDir){
                        include "$includeDir";
                     }
                 }else{
                     throw new ZendExt_Exception("La versión ".$argVersioLib." de libreria ".$argNombreLib." no existe");
                 }
            }else{
                throw new ZendExt_Exception("La libreria ".$argNombreLib." no existe");
            }
        }else{
            throw new ZendExt_Exception("Espesifique el nombre y la versión de la libreria");
        }

    }
    public static function getDireccionFichero($argAdapters,$argNombreFichero,&$argDireccion){
        $itemsPack = array_diff(scandir($argAdapters), array('.', '..'));
        foreach ($itemsPack as $value) {
            if (!is_file($argAdapters . $value)) {
              self::getDireccionFichero($argAdapters . $value .'/',$argNombreFichero ,$argDireccion);
            } else {
                if ($value == $argNombreFichero) {
                    $argDireccion = $argAdapters . $value;
                }
            }
        }
    }
} 
